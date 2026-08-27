/* =========================================================
   Brush & Bloom — site-wide booking panel
   ---------------------------------------------------------
   A slide-over that opens from any "Book Now" button.
   The guest picks seats and leaves their name and email;
   nothing is charged here.

   Session data and settings live in js/sessions.js — this
   file holds only behaviour. Vanilla JS, no dependencies.

   Also renders the session list into [data-schedule], so the
   whole site reads from that one array.
   ========================================================= */

(function () {
  "use strict";

  var SESSIONS = window.BB_SESSIONS || [];
  var CFG = window.BB_CONFIG || {};

  var maxSeats = CFG.maxSeats || 6;

  /* The public site advertises one evening at a time — see
     showOnlyNextSession in js/sessions.js. The full array stays
     available so future dates can be queued up behind it. */
  function visible() {
    return CFG.showOnlyNextSession === false ? SESSIONS : SESSIONS.slice(0, 1);
  }
  var STEP_TITLES = ["Pick a session", "Choose your seats", "Who's coming?", "Review & checkout"];

  var state = {
    open: false,
    step: 0,
    sessionId: null,
    seats: 2,
    first: "",
    last: "",
    email: "",
    phone: "",
    optIn: true,
    error: ""
  };

  var scrim = null;
  var panel = null;
  var lastFocused = null;

  /* ---------------- tiny DOM helper ---------------- */
  function el(tag, attrs, kids) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === false || v === undefined) return;
      if (k === "text") node.textContent = v;
      else if (k === "class") node.className = v;
      else if (k.slice(0, 2) === "on") node.addEventListener(k.slice(2), v);
      else if (v === true) node.setAttribute(k, "");
      else node.setAttribute(k, v);
    });
    (kids || []).forEach(function (kid) {
      if (kid) node.appendChild(kid);
    });
    return node;
  }

  function money(n) { return "€" + n; }

  function session() {
    for (var i = 0; i < SESSIONS.length; i++) {
      if (SESSIONS[i].id === state.sessionId) return SESSIONS[i];
    }
    return null;
  }

  function total() {
    var s = session();
    return s ? s.price * state.seats : 0;
  }

  function fullName() { return (state.first + " " + state.last).trim(); }

  /* Time + first part of the venue, e.g. "19:00–21:30 · Brush & Bloom Studio" */
  function shortMeta(s) {
    var time = s.when.split(" · ")[1] || s.when;
    return time + " · " + s.venue.split(",")[0];
  }

  function bookingUrl() {
    var s = session();
    if (!s || !s.url) return "#";
    return s.url +
      "?quantity=" + state.seats +
      "&name=" + encodeURIComponent(fullName()) +
      "&email=" + encodeURIComponent(state.email.trim());
  }

  /* ---------------- steps ---------------- */

  function stepPick() {
    var cards = visible().map(function (s) {
      return el("button", {
        class: "bb-session",
        type: "button",
        onclick: function () { setStep(1, { sessionId: s.id }); }
      }, [
        el("span", { class: "bb-session__date" }, [
          el("strong", { text: s.day }),
          el("span", { text: s.mon })
        ]),
        el("span", {}, [
          el("span", { class: "bb-session__title", style: "display:block", text: s.title }),
          el("span", { class: "bb-session__meta", style: "display:block", text: shortMeta(s) })
        ]),
        el("span", { class: "bb-session__price", text: money(s.price) })
      ]);
    });
    return el("div", {}, cards);
  }

  function stepSeats() {
    var s = session();
    if (!s) return el("p", { text: "Pick a session first." });

    var count = el("strong", { text: String(state.seats) });
    var word = el("span", { text: state.seats === 1 ? "seat" : "seats" });
    var math = el("span", { class: "bb-total__math", text: state.seats + " × " + money(s.price) });
    var sum = el("span", { class: "bb-total__sum", text: money(total()) });
    var hint = el("p", { class: "bb-hint" });
    var minus, plus;

    function sync() {
      count.textContent = String(state.seats);
      word.textContent = state.seats === 1 ? "seat" : "seats";
      math.textContent = state.seats + " × " + money(s.price);
      sum.textContent = money(total());
      hint.textContent = state.seats >= maxSeats
        ? "Booking for a bigger group? Ask us about a private session."
        : "Seats are held together, side by side.";
      minus.disabled = state.seats <= 1;
      plus.disabled = state.seats >= maxSeats;
    }

    function nudge(by) {
      state.seats = Math.min(maxSeats, Math.max(1, state.seats + by));
      sync();
    }

    minus = el("button", { type: "button", "aria-label": "Remove a seat", text: "−", onclick: function () { nudge(-1); } });
    plus = el("button", { type: "button", "aria-label": "Add a seat", text: "+", onclick: function () { nudge(1); } });

    var node = el("div", {}, [
      el("div", { class: "bb-summary" }, [
        el("h4", { text: s.title }),
        el("p", { text: s.when }),
        el("p", { text: s.venue })
      ]),
      el("span", { class: "bb-label", id: "bb-seats-label", text: "How many seats?" }),
      el("div", { class: "bb-stepper", role: "group", "aria-labelledby": "bb-seats-label" }, [
        minus,
        el("span", { class: "bb-stepper__count", "aria-live": "polite" }, [count, word]),
        plus
      ]),
      hint,
      el("div", { class: "bb-total" }, [math, sum])
    ]);

    sync();
    return node;
  }

  function field(key, label, opts) {
    opts = opts || {};
    var id = "bb-" + key;
    var input = el("input", {
      id: id,
      type: opts.type || "text",
      value: state[key],
      autocomplete: opts.autocomplete || null,
      oninput: function (e) {
        state[key] = e.target.value;
        if (state.error) clearError();
      }
    });
    return el("div", { class: "bb-field" + (opts.full ? " full" : "") }, [
      el("label", { for: id, text: label }),
      input
    ]);
  }

  function stepDetails() {
    var fields = [
      field("first", "First name", { autocomplete: "given-name" }),
      field("last", "Last name", { autocomplete: "family-name" }),
      field("email", "Email", { type: "email", full: true, autocomplete: "email" })
    ];
    if (CFG.collectPhone) {
      fields.push(field("phone", "Phone (optional)", { type: "tel", full: true, autocomplete: "tel" }));
    }

    return el("div", {}, [
      el("p", { class: "bb-intro", text: "Just enough to hold your seats — we'll confirm by email." }),
      el("div", { class: "bb-fields" }, fields),
      el("label", { class: "bb-optin" }, [
        el("input", {
          type: "checkbox",
          checked: state.optIn,
          onchange: function (e) { state.optIn = e.target.checked; }
        }),
        el("span", { text: "Email me when new sessions open — no more than once a month." })
      ]),
      el("div", { id: "bb-error-slot" })
    ]);
  }

  function reviewRow(label, value) {
    return el("div", { class: "bb-review__row" }, [
      el("span", { text: label }),
      el("strong", { text: value })
    ]);
  }

  function nextStepsNote() {
    if (!CFG.showNextSteps) return null;

    if (!CFG.checkoutEnabled) {
      /* Online checkout is deliberately switched off — see js/sessions.js */
      return el("div", { class: "bb-note" }, [
        el("span", { class: "bb-note__eyebrow", text: "Booking opens soon" }),
        el("p", {}, [
          document.createTextNode("Online checkout for this session isn't live yet. Send these details to "),
          el("a", { href: "mailto:" + CFG.contactEmail, style: "color:var(--rose-deep)", text: CFG.contactEmail }),
          document.createTextNode(" and we'll hold your seats and confirm by email.")
        ])
      ]);
    }

    return el("div", { class: "bb-note" }, [
      el("span", { class: "bb-note__eyebrow", text: "What happens next" }),
      el("ol", {}, [
        el("li", { text: "A new tab opens on our secure checkout with your seats already selected." }),
        el("li", { text: "You pay there by card — nothing is charged on this page." }),
        el("li", { text: "Your ticket and studio address arrive by email straight away." })
      ])
    ]);
  }

  function stepReview() {
    var s = session();
    if (!s) return el("p", { text: "Pick a session first." });

    return el("div", {}, [
      el("div", { class: "bb-summary" }, [
        el("h4", { text: s.title }),
        el("p", { text: s.when }),
        el("div", { class: "bb-review__rows" }, [
          reviewRow("Seats", state.seats + " × " + money(s.price)),
          reviewRow("Name", fullName()),
          reviewRow("Email", state.email.trim())
        ]),
        el("div", { class: "bb-review__total" }, [
          el("span", { text: "Total" }),
          el("strong", { text: money(total()) })
        ])
      ]),
      nextStepsNote()
    ]);
  }

  function buildStep() {
    if (state.step === 0) return stepPick();
    if (state.step === 1) return stepSeats();
    if (state.step === 2) return stepDetails();
    return stepReview();
  }

  /* ---------------- errors ---------------- */

  function clearError() {
    state.error = "";
    var slot = panel && panel.querySelector("#bb-error-slot");
    if (slot) slot.textContent = "";
    if (panel) {
      panel.querySelectorAll(".bb-field input").forEach(function (i) { i.removeAttribute("aria-invalid"); });
    }
  }

  function showError(message, invalidIds) {
    state.error = message;
    var slot = panel.querySelector("#bb-error-slot");
    if (slot) {
      slot.textContent = "";
      slot.appendChild(el("p", { class: "bb-error", role: "alert", text: message }));
    }
    (invalidIds || []).forEach(function (id) {
      var input = panel.querySelector("#bb-" + id);
      if (input) input.setAttribute("aria-invalid", "true");
    });
    var firstBad = panel.querySelector('[aria-invalid="true"]');
    if (firstBad) firstBad.focus();
  }

  function validateDetails() {
    if (!state.first.trim() || !state.last.trim()) {
      showError("Please add your first and last name.",
        [!state.first.trim() ? "first" : "last"]);
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(state.email.trim())) {
      showError("That email doesn't look right — we send your ticket there.", ["email"]);
      return false;
    }
    return true;
  }

  /* ---------------- panel shell ---------------- */

  function primaryAction() {
    var labels = ["Choose a session above", "Continue", "Review booking"];

    if (state.step < 3) {
      return el("button", {
        class: "btn btn--primary",
        type: "button",
        disabled: state.step === 0,
        text: labels[state.step],
        onclick: function () {
          if (state.step === 2 && !validateDetails()) return;
          setStep(Math.min(3, state.step + 1));
        }
      });
    }

    /* Final step */
    if (!CFG.checkoutEnabled) {
      return el("button", {
        class: "btn btn--primary",
        type: "button",
        text: "Done",
        onclick: close
      });
    }

    return el("a", {
      class: "btn btn--primary",
      href: bookingUrl(),
      target: CFG.openInNewTab === false ? "_self" : "_blank",
      rel: "noopener",
      text: "Continue to secure checkout",
      onclick: function () { close(); }
    });
  }

  /* Primary button, then the "← Back" / reassurance row under it. */
  function footerBits() {
    var actions = [];
    if (state.step > 0) {
      actions.push(el("button", {
        class: "bb-back",
        type: "button",
        text: "← Back",
        onclick: function () { setStep(Math.max(0, state.step - 1)); }
      }));
    }
    actions.push(el("span", { class: "bb-reassure", text: "Free cancellation up to 48h before" }));
    return [primaryAction(), el("div", { class: "bb-actions" }, actions)];
  }

  function build() {
    var counter = el("span", { class: "bb-counter", text: "Step " + (state.step + 1) + " of 4" });
    var title = el("h2", { class: "bb-title", id: "bb-panel-title", tabindex: "-1", text: STEP_TITLES[state.step] });

    var rail = el("div", { class: "bb-rail", "aria-hidden": "true" },
      STEP_TITLES.map(function (_, i) {
        return el("span", { class: i <= state.step ? "is-done" : "" });
      })
    );

    panel = el("div", {
      class: "bb-panel",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "bb-panel-title"
    }, [
      el("div", { class: "bb-panel__header" }, [
        el("div", {}, [counter, title]),
        el("button", { class: "bb-close", type: "button", "aria-label": "Close booking", text: "×", onclick: close })
      ]),
      rail,
      el("div", { class: "bb-body" }, [buildStep()]),
      el("div", { class: "bb-panel__footer" }, footerBits())
    ]);

    scrim = el("button", { class: "bb-scrim", type: "button", "aria-label": "Close booking", onclick: close });

    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.classList.add("bb-open");
    panel.addEventListener("keydown", onKeydown);
    title.focus();
  }

  /* Rebuild header, rail, body and footer in place — keeps the
     panel mounted so the slide-in animation doesn't replay. */
  function setStep(step, patch) {
    if (patch) Object.keys(patch).forEach(function (k) { state[k] = patch[k]; });
    state.step = step;
    state.error = "";
    if (!panel) return;

    panel.querySelector(".bb-counter").textContent = "Step " + (step + 1) + " of 4";
    var title = panel.querySelector(".bb-title");
    title.textContent = STEP_TITLES[step];

    panel.querySelectorAll(".bb-rail span").forEach(function (bar, i) {
      bar.className = i <= step ? "is-done" : "";
    });

    var body = panel.querySelector(".bb-body");
    body.textContent = "";
    body.appendChild(buildStep());
    body.style.animation = "none";
    void body.offsetWidth;
    body.style.animation = "";
    body.scrollTop = 0;

    var footer = panel.querySelector(".bb-panel__footer");
    footer.textContent = "";
    footerBits().forEach(function (bit) { footer.appendChild(bit); });

    title.focus();
  }

  /* ---------------- open / close ---------------- */

  function open(sessionId) {
    lastFocused = document.activeElement;
    state.open = true;
    state.sessionId = sessionId || null;
    state.step = sessionId ? 1 : 0;
    state.seats = 2;
    state.error = "";
    build();
  }

  function close() {
    if (!state.open) return;
    state.open = false;
    if (panel) panel.removeEventListener("keydown", onKeydown);
    if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
    if (scrim && scrim.parentNode) scrim.parentNode.removeChild(scrim);
    panel = null;
    scrim = null;
    document.body.classList.remove("bb-open");
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  var FOCUSABLE = 'button:not(:disabled), a[href], input:not(:disabled), [tabindex="0"]';

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== "Tab") return;

    var items = Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];

    if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.querySelector(".bb-title"))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  /* ---------------- triggers ---------------- */
  /* Any element with data-book opens the panel:
       data-book        → next session, straight to the seat step
       data-book="s2"   → that session, straight to the seat step
       data-book="pick" → the session list                        */

  function initTriggers() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest ? e.target.closest("[data-book]") : null;
      if (!trigger) return;
      e.preventDefault();
      var val = trigger.getAttribute("data-book");
      if (val === "pick") open(null);
      else if (val) open(val);
      else open(SESSIONS.length ? SESSIONS[0].id : null);
    });
  }

  /* ---------------- schedule rendering ---------------- */
  /* Reads the same array the panel does, so the weekly edit
     stays in one file: js/sessions.js                        */

  function renderSchedule() {
    var host = document.querySelector("[data-schedule]");
    if (!host) return;
    host.textContent = "";

    if (!visible().length) {
      host.appendChild(el("p", { class: "form-note text-center", text: "No dates on the calendar right now — check back soon." }));
      return;
    }

    visible().forEach(function (s) {
      host.appendChild(el("div", { class: "event-row" }, [
        el("div", { class: "event-row__date" }, [
          el("strong", { text: s.day }),
          el("span", { text: s.mon })
        ]),
        el("div", {}, [
          el("h4", { text: s.title }),
          el("p", { text: shortMeta(s) }),
          el("div", { class: "tag-row" }, s.tags.map(function (t) {
            return el("span", { class: "tag", text: t });
          }))
        ]),
        el("div", { style: "text-align:right" }, [
          el("div", {
            style: "font-family:var(--font-display);font-size:1.1rem;color:var(--brown);margin-bottom:8px",
            text: money(s.price)
          }),
          el("button", { class: "btn btn--outline btn--sm", type: "button", "data-book": s.id, text: "Book Now" })
        ])
      ]));
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initTriggers();
    renderSchedule();
  });

  window.BrushAndBloomBooking = { open: open, close: close };
})();
