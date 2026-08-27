/* =========================================================
   Brush & Bloom — site behaviour
   - Mobile nav toggle
   - Scroll reveal
   - Lightweight EN/FR/NL switcher (in-memory only, no storage)
     Falls back to the original English text if a key has no
     translation yet — safe to extend as real copy is added.
   ========================================================= */

(function () {
  "use strict";

  /* ---------------- Translations ----------------
     Keys are short, chrome-level strings (nav, buttons,
     headings, footer, FAQ). Long paragraph copy is left in
     English by design since it's placeholder text the owner
     will likely replace — translate it here once final copy
     is set (see the README at the repo root).
  ------------------------------------------------- */
  var translations = {
    fr: {
      "nav.home": "Accueil",
      "nav.about": "À propos",
      "nav.events": "Ateliers & Tarifs",
      "nav.gallery": "Galerie",
      "nav.contact": "Contact",
      "nav.book": "Réserver",

      "common.bookNow": "Réserver une place",
      "common.viewEvents": "Voir les ateliers",
      "common.learnMore": "En savoir plus",
      "common.getDirections": "Itinéraire",
      "common.sendMessage": "Envoyer le message",
      "common.readMore": "Lire la suite",

      "home.eyebrow": "Peindre. Trinquer. Fleurir.",
      "home.hero.title1": "Peignez, sirotez,",
      "home.hero.title2": "et laissez éclore votre créativité",
      "home.hero.lead": "Des ateliers peinture & vin conviviaux à Bruxelles — aucune expérience requise, juste de la bonne compagnie, un verre à la main et une toile qui vous ressemble.",
      "home.meta.duration": "De peinture guidée",
      "home.meta.experienceValue": "Zéro",
      "home.meta.groupsValue": "Petits",
      "home.meta.experience": "Expérience requise",
      "home.meta.groups": "Groupes, toujours",
      "home.badge": "Prochain atelier bientôt",
      "home.next.eyebrow": "Prochain atelier",
      "home.next.title": "Votre prochaine soirée à l'atelier",
      "home.features.eyebrow": "Pourquoi Brush & Bloom",
      "home.features.title": "Une soirée pensée pour se détendre",
      "home.steps.eyebrow": "Comment ça marche",
      "home.steps.title": "Votre soirée en quatre étapes",
      "home.testimonials.eyebrow": "Ce qu'on en dit",
      "home.testimonials.title": "Des soirées dont on se souvient",
      "home.cta.title": "Prêt·e à créer votre prochain souvenir ?",
      "home.cta.lead": "Places limitées à chaque atelier — réservez la vôtre avant qu'elle ne s'envole.",

      "about.eyebrow": "Notre histoire",
      "about.title": "Créer. Connecter. Fleurir.",
      "about.values.eyebrow": "Nos valeurs",
      "about.values.title": "Ce qui guide chaque atelier",

      "events.eyebrow": "Ateliers & Tarifs",
      "events.title": "Trouvez votre prochaine soirée peinture",
      "events.schedule.eyebrow": "Prochaines dates",
      "events.schedule.title": "Calendrier des ateliers",
      "events.pricing.eyebrow": "Tarifs",
      "events.pricing.title": "Une formule pour chaque envie",
      "events.private.eyebrow": "Événements privés",
      "events.private.title": "Organisez votre propre atelier",
      "events.faq.eyebrow": "Questions fréquentes",
      "events.faq.title": "Tout ce qu'il faut savoir",

      "gallery.eyebrow": "Galerie",
      "gallery.title": "Un aperçu de nos ateliers",

      "contact.eyebrow": "Contact",
      "contact.title": "On a hâte de vous accueillir",
      "contact.form.title": "Envoyez-nous un message",

      "footer.tagline": "Créer. Connecter. Fleurir.",
      "footer.explore": "Explorer",
      "footer.contact": "Contact",
      "footer.follow": "Suivez-nous",
      "footer.rights": "Tous droits réservés."
    },
    nl: {
      "nav.home": "Home",
      "nav.about": "Over ons",
      "nav.events": "Workshops & Prijzen",
      "nav.gallery": "Galerij",
      "nav.contact": "Contact",
      "nav.book": "Boeken",

      "common.bookNow": "Boek nu je plek",
      "common.viewEvents": "Bekijk workshops",
      "common.learnMore": "Meer weten",
      "common.getDirections": "Routebeschrijving",
      "common.sendMessage": "Bericht versturen",
      "common.readMore": "Lees meer",

      "home.eyebrow": "Schilder. Proost. Bloei.",
      "home.hero.title1": "Schilder, proost",
      "home.hero.title2": "en laat je creativiteit openbloeien",
      "home.hero.lead": "Gezellige paint & sip workshops in Brussel — geen ervaring nodig, gewoon fijn gezelschap, een glas in de hand en een canvas dat helemaal van jou is.",
      "home.meta.duration": "Begeleid schilderen",
      "home.meta.experienceValue": "Geen",
      "home.meta.groupsValue": "Klein",
      "home.meta.experience": "Ervaring nodig",
      "home.meta.groups": "Groepen, altijd",
      "home.badge": "Volgende workshop binnenkort",
      "home.next.eyebrow": "Volgende workshop",
      "home.next.title": "Jouw volgende avond in het atelier",
      "home.features.eyebrow": "Waarom Brush & Bloom",
      "home.features.title": "Een avond gemaakt om te ontspannen",
      "home.steps.eyebrow": "Hoe het werkt",
      "home.steps.title": "Jouw avond in vier stappen",
      "home.testimonials.eyebrow": "Wat gasten zeggen",
      "home.testimonials.title": "Avonden om te onthouden",
      "home.cta.title": "Klaar voor jouw volgende herinnering?",
      "home.cta.lead": "Beperkte plaatsen per workshop — boek de jouwe voor ze vol zit.",

      "about.eyebrow": "Ons verhaal",
      "about.title": "Creëer. Verbind. Bloei.",
      "about.values.eyebrow": "Onze waarden",
      "about.values.title": "Wat elke workshop leidt",

      "events.eyebrow": "Workshops & Prijzen",
      "events.title": "Vind jouw volgende schilderavond",
      "events.schedule.eyebrow": "Eerstvolgende data",
      "events.schedule.title": "Workshopkalender",
      "events.pricing.eyebrow": "Prijzen",
      "events.pricing.title": "Voor elk wat wils",
      "events.private.eyebrow": "Privé-evenementen",
      "events.private.title": "Organiseer je eigen workshop",
      "events.faq.eyebrow": "Veelgestelde vragen",
      "events.faq.title": "Alles wat je moet weten",

      "gallery.eyebrow": "Galerij",
      "gallery.title": "Een kijkje bij onze workshops",

      "contact.eyebrow": "Contact",
      "contact.title": "We verwelkomen je graag",
      "contact.form.title": "Stuur ons een bericht",

      "footer.tagline": "Creëer. Verbind. Bloei.",
      "footer.explore": "Ontdek",
      "footer.contact": "Contact",
      "footer.follow": "Volg ons",
      "footer.rights": "Alle rechten voorbehouden."
    }
  };

  var currentLang = "en";
  var originalText = new WeakMap();

  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (!originalText.has(el)) originalText.set(el, el.textContent);
      var key = el.getAttribute("data-i18n");
      var dict = translations[lang];
      if (dict && dict[key]) {
        el.textContent = dict[key];
      } else {
        el.textContent = originalText.get(el);
      }
    });

    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === lang);
    });
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-switch button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(btn.getAttribute("data-lang"));
      });
    });
  }

  function initNavToggle() {
    var toggle = document.querySelector(".nav__toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    nav.querySelectorAll(".nav__links a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = new Date().getFullYear();
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var note = form.querySelector("[data-form-status]");
      if (note) {
        note.textContent = "Thanks for writing! This form isn't connected to our inbox just yet — please send your message to hello@brushandbloom.be and we'll come straight back to you.";
        note.style.display = "block";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initNavToggle();
    initYear();
    initContactForm();
  });
})();
