# Handoff: Brush & Bloom — Site-wide Booking Panel

## Overview
A slide-over booking panel for Brush & Bloom (paint & sip evenings, Brussels). Any "Book Now" button on the site opens it. The guest picks seats, gives their name and email, sees a short "what happens next" note, then is handed off to Eventbrite (or Stripe) checkout in a new tab with quantity, name and email pre-filled in the URL.

Deliberate product decisions made with the owner:
- **No payment on our side.** The panel collects seats + name + email, then hands off. Nothing is charged in our UI.
- **Calm, not urgent.** No "3 seats left" counters, no sold-out badges.
- **One next session.** The public page lists only the next upcoming session; the panel opens straight onto that session's seat step.
- **Sessions are hand-edited weekly** from a single array at the top of one file — no CMS, no API.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing intended look and behavior, not production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (React, Vue, Next.js, etc.) using its established patterns, component library and styling approach. If no environment exists yet, pick the framework most appropriate for the project and implement there.

The existing live site (`brushandbloomsite/`, also bundled) is plain static HTML/CSS/JS with a hand-written design system in `css/style.css`. If the implementation stays static, the panel can be added as one `booking-panel` partial + a small JS module reusing those existing CSS custom properties instead of the inline styles used in the prototype.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, shadows and interaction behavior. Recreate pixel-accurately using the codebase's own libraries. All values below are exact.

## Screens / Views

### 1. Page shell (context only — not the deliverable)
Present in the prototype so the panel can be seen in situ. The real site already has header, hero, session list and footer; only the **session list row** and the **Book Now triggers** matter for this work.

- **Header**: sticky, `background: rgba(249,241,236,0.93)`, `backdrop-filter: blur(10px)`, `border-bottom: 1px solid #e9d7cc`. Inner row max-width 1160px, padding 14px 28px, flex, space-between, gap 24px. Brand (52×52 circular logo + "Brush & Bloom", Playfair Display 1.12rem, letter-spacing 0.06em, `&` in #c08d7e) is `flex-shrink: 0; white-space: nowrap`. Nav links: Jost 500, 0.84rem, letter-spacing 0.06em, uppercase, #6b4a3a, gap 24px, `white-space: nowrap; flex-shrink: 0`. Header "Book Now" is a pill button (see tokens) with `flex-shrink: 0; white-space: nowrap`.
  - The live site collapses `.nav__links` at ≤760px and shows a hamburger — preserve that behavior; the prototype's flat nav is a simplification.
- **Page hero**: `background: #f3e3db`, padding 64px 0 56px, centered. Gold eyebrow ("UPCOMING DATES", 0.78rem, letter-spacing 0.28em, uppercase, #b8863f, followed by a 26×1px #b8863f rule). H1 Playfair Display 600, `clamp(2rem, 4vw, 2.8rem)`, #4a2f22. Lead paragraph max-width 560px.
- **Session row** (one only): CSS grid `104px 1fr auto`, gap 24px, align center, padding 24px 0, `border-bottom: 1px solid #e9d7cc`.
  - Date block: `background: #efd9d2`, radius 10px, padding 12px 6px, centered. Day = Playfair Display 600 1.4rem #4a2f22; month = 0.72rem uppercase letter-spacing 0.08em #a66f62.
  - Middle: title Playfair Display 600 1.14rem #4a2f22; meta line 0.88rem #9c7d6c (format `19:00–21:30 · Brush & Bloom Studio`); tag pills 0.72rem uppercase, `background: #f3e3db`, color #6b4a3a, padding 4px 11px, radius 999px, gap 8px, wrapping.
  - Right: price Playfair Display 1.1rem #4a2f22 above an outline pill button ("BOOK NOW", 0.78rem, border `1px solid #4a2f22`, transparent bg, hover `background:#4a2f22; color:#f9f1ec`).
- **Footer**: `background: #4a2f22`, padding 40px 0, centered, Alex Brush 1.9rem #efd9d2 "Create. Connect. Bloom."

### 2. Booking panel (the deliverable)
Rendered only when open — mounted/unmounted, not hidden, so the entry animation replays each time.

- **Scrim**: `position: fixed; inset: 0; z-index: 90; background: rgba(74,47,34,0.42); backdrop-filter: blur(2px)`. Click closes. Animation `bbFade` 0.25s ease.
- **Panel**: `position: fixed; top/right/bottom: 0; z-index: 91; width: 100%; max-width: 468px; background: #fffdfb; box-shadow: -30px 0 60px -30px rgba(74,47,34,0.45)`. Flex column. Animation `bbSlide` 0.32s `cubic-bezier(0.22,1,0.36,1)` (translateX 32px → 0, opacity 0 → 1). `role="dialog"`, `aria-label="Book a session"`.
- **Panel header**: padding 22px 28px 18px, `border-bottom: 1px solid #e9d7cc`, flex space-between. Left: step counter ("STEP 2 OF 4", 0.72rem, letter-spacing 0.22em, uppercase, #b8863f, weight 500) above the step title (Playfair Display 600, 1.32rem, #4a2f22). Right: 34×34 circular close button, `border: 1px solid #e9d7cc`, glyph ×, #9c7d6c, hover `background:#f3e3db; color:#4a2f22`.
- **Progress rail**: 4 bars, `height: 3px; flex: 1; radius 999px`, gap 6px, padding 14px 28px 0. Completed/current `#c08d7e`, upcoming `#e9d7cc`, `transition: background 0.3s ease`.
- **Body**: `flex: 1; overflow-y: auto`, padding 26px 28px 30px. Each step animates in with `bbStep` 0.3s ease (translateY 8px → 0, opacity 0 → 1).
- **Panel footer**: `border-top: 1px solid #e9d7cc`, padding 18px 28px 22px, `background: #fffdfb`. Full-width primary pill; below it a centered row (gap 18px) with "← Back" (borderless, 0.82rem, #9c7d6c, hover #4a2f22) and the reassurance line "Free cancellation up to 48h before" (0.76rem, #c4a99a, `white-space: nowrap`).

#### Step 1 — Pick a session
Only reached if the panel is opened without a session context. Lists sessions as selectable cards: grid `52px 1fr auto`, gap 14px, padding 14px 16px, `border: 1px solid #e9d7cc`, radius 14px, `background: #fffdfb`, hover `border-color: #c08d7e; background: #f9f1ec`. Compact date block (radius 9px, padding 7px 4px; day Playfair 1.05rem, month 0.62rem), title Playfair 0.98rem, meta 0.8rem #9c7d6c, price Playfair 0.98rem #a66f62. Primary button reads "Choose a session above" and is **disabled** on this step.
Currently the list is limited to the single next session, and "Book Now" pre-selects it, so this step is normally skipped.

#### Step 2 — Choose your seats
- Summary card: `background: #f9f1ec`, `border: 1px solid #e9d7cc`, radius 14px, padding 18px 20px. Title Playfair 1.05rem #4a2f22; two 0.86rem #9c7d6c lines (full date + time, then venue).
- Label "HOW MANY SEATS?" — 0.76rem, letter-spacing 0.14em, uppercase, #9c7d6c, weight 500, margin 26px 0 12px.
- Stepper: row, `border: 1px solid #e9d7cc`, radius 14px, padding 12px 16px, space-between. − and + are 40×40 circles, `border: 1px solid #e9d7cc`, transparent, #4a2f22, 1.2rem, hover `background: #f3e3db`. Center: count Playfair 600 1.6rem #4a2f22 above "SEAT"/"SEATS" (0.76rem, letter-spacing 0.08em, uppercase, #9c7d6c). Clamped 1…maxSeats (default 6).
- Hint line 0.82rem #9c7d6c below: normally "Seats are held together, side by side."; at the max it becomes "Booking for a bigger group? Ask us about a private session."
- Total row: margin-top 26px, padding-top 18px, `border-top: 1px solid #e9d7cc`, space-between, baseline. Left `3 × €39` (0.88rem); right total Playfair 600 1.5rem #4a2f22.
- Primary button: "Continue".

#### Step 3 — Who's coming?
- Intro 0.92rem: "Just enough to hold your seats — payment happens on the next screen."
- Two-column grid (gap 16px): First name / Last name; Email spans both columns; optional Phone spans both columns and only renders when `collectPhone` is on.
- Field label: 0.74rem, letter-spacing 0.08em, uppercase, #9c7d6c, weight 500, gap 7px above input. Input: 0.95rem, padding 12px 15px, `border: 1px solid #e9d7cc`, radius 10px, `background: #fffdfb`, color #4a2f22. Focus: `border-color: #c08d7e; box-shadow: 0 0 0 3px #f0ddd6; outline: none`.
- Opt-in checkbox row (gap 11px, margin-top 22px, `accent-color: #c08d7e`, 16×16, default **checked**): "Email me when new sessions open — no more than once a month."
- Error message (when validation fails): 0.86rem, color #a66f62, `background: #f0ddd6`, radius 10px, padding 11px 14px, margin-top 18px.
- Primary button: "Review booking".

#### Step 4 — Review & checkout
- Summary card (`background: #f9f1ec`, radius 14px, padding 20px): title + full date, then a hairline-separated list of rows (0.88rem, label #9c7d6c / value #4a2f22, gap 9px): Seats (`3 × €39`), Name, Email. Total row separated by another hairline, value Playfair 600 1.35rem.
- "What happens next" note (rendered when `showNextSteps` is on): margin-top 22px, `border: 1px dashed #c08d7e`, radius 14px, padding 20px. Eyebrow "WHAT HAPPENS NEXT" (0.74rem, letter-spacing 0.16em, uppercase, #b8863f). Three numbered lines (gap 11px, 0.88rem; numerals Playfair #c08d7e):
  1. "A new tab opens on our secure checkout with your seats already selected."
  2. "You pay there by card — nothing is charged on this page."
  3. "Your ticket and studio address arrive by email straight away."
- Footer action becomes an anchor: "Continue to secure checkout" → the built checkout URL, `target="_blank" rel="noopener"` (configurable), and closes the panel on click.

## Interactions & Behavior
- **Open**: every "Book Now" (header + session row) opens the panel. A row's button pre-selects that session and opens on **step 2**; the header button pre-selects the next session and also opens on step 2. Opening resets seats to 2 and clears errors.
- **Close**: × button, scrim click, or following the checkout link. (Add Esc-to-close and focus trapping in production — the prototype does not implement them.)
- **Navigation**: "← Back" decrements the step (hidden on step 1); the primary button advances. Step 1's primary button is disabled.
- **Validation** (on leaving step 3, blocking):
  - First and last name must be non-empty after trimming → "Please add your first and last name."
  - Email must match `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` → "That email doesn't look right — we send your ticket there."
  - Any input change clears the current error.
- **Seat stepper**: clamped to 1…maxSeats; total and the `n × €price` line recompute live.
- **Handoff URL**: `${session.url}?quantity=${seats}&name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}`.
  ⚠️ **Verify these parameter names against the real Eventbrite/Stripe listing** — they are a reasonable assumption, not confirmed. Eventbrite's prefill params differ by ticket type and embed mode; Stripe Checkout uses `prefilled_email` and a quantity set server-side. Adjust before launch.
- **Animations**: scrim fade 0.25s ease; panel slide 0.32s `cubic-bezier(0.22,1,0.36,1)`; step content 0.3s ease; button/border hovers 0.2–0.25s ease. Respect `prefers-reduced-motion` in production (the live site already gates its reveal animation this way).
- **Responsive**: panel is `width: 100%; max-width: 468px` — full-screen sheet on mobile. Consider a bottom-sheet variant on small screens. Body scroll should be locked while open (not implemented in the prototype).
- **Accessibility to add in production**: focus the panel heading on open, trap focus, return focus to the trigger on close, `aria-invalid` + `aria-describedby` on failing fields, and announce step changes politely.

## State Management
Single component state object:
| Key | Type | Initial | Notes |
|---|---|---|---|
| `open` | boolean | `false` | Panel mounted |
| `step` | 0–3 | `0` | 0 pick · 1 seats · 2 details · 3 review |
| `sessionId` | string \| null | `null` | Selected session |
| `seats` | number | `2` | Clamped 1…maxSeats |
| `first`, `last`, `email`, `phone` | string | `""` | Guest details |
| `optIn` | boolean | `true` | Newsletter consent |
| `error` | string | `""` | Current validation message |

Transitions: `openPanel(id)` → `{open:true, sessionId:id, step: id ? 1 : 0, seats:2, error:""}`; `advance()` validates on step 2 then `step = min(3, step+1)`; `back()` → `max(0, step-1)`; `close()` → `{open:false}` (form values intentionally persist for the session).

**No data fetching.** Sessions come from a hardcoded array. In the target codebase this is the natural seam for a future Eventbrite API call or CMS collection — keep the session shape stable:
```js
{ id, day, mon, when, title, venue, price, tags: string[], url }
```

Configurable props (surfaced as tweaks in the prototype):
| Prop | Type | Default | Effect |
|---|---|---|---|
| `maxSeats` | int 1–12 | 6 | Stepper ceiling + group hint |
| `collectPhone` | boolean | false | Shows optional phone field |
| `showNextSteps` | boolean | true | Shows the "what happens next" note |
| `openInNewTab` | boolean | true | Checkout link target |

## Design Tokens
Taken from the brand logo and matching the live site's `css/style.css` custom properties.

**Colors**
| Token | Hex | Use |
|---|---|---|
| `--cream` | `#f9f1ec` | Page background, panel summary cards |
| `--cream-deep` | `#f3e3db` | Alternate sections, tag pills, hover fills |
| `--cream-line` | `#e9d7cc` | All hairlines and input borders |
| `--white` | `#fffdfb` | Panel surface, inputs, button text |
| `--brown` | `#4a2f22` | Headings, footer, outline buttons |
| `--brown-soft` | `#6b4a3a` | Body copy, nav links |
| `--brown-faint` | `#9c7d6c` | Muted labels and meta |
| — | `#c4a99a` | Faintest text (reassurance line) |
| `--rose` | `#c08d7e` | Primary buttons, active progress, focus ring border |
| `--rose-deep` | `#a66f62` | Primary hover, links, error text |
| `--rose-pale` | `#f0ddd6` | Focus ring, error background |
| `--blush` | `#efd9d2` | Date blocks |
| `--gold` | `#b8863f` | Eyebrows, fine rules |
| `--gold-soft` | `#d9b479` | Footer headings on brown |

**Typography** — Google Fonts: Playfair Display (400/500/600 + italic), Cormorant Garamond (500 + italic), Alex Brush, Jost (300/400/500/600).
- Display / headings: Playfair Display 600, `line-height: 1.2`
- Body / UI: Jost 300 (body) and 500 (labels, buttons, nav), `line-height: 1.65`
- Script accent: Alex Brush (footer tagline only)
- Pull-quotes on the live site: Cormorant Garamond italic
- Scale in the panel: 0.72 / 0.74 / 0.76 / 0.78 / 0.82 / 0.86 / 0.88 / 0.92 / 0.95 / 0.98 / 1.05 / 1.08 / 1.32 / 1.35 / 1.5 / 1.6 rem
- Uppercase label pattern: uppercase + weight 500 + letter-spacing 0.06em (buttons/nav), 0.08em (field labels), 0.14–0.16em (section eyebrows), 0.22–0.28em (step counter / page eyebrow)

**Spacing** — 4px base; used values 4 · 6 · 7 · 9 · 10 · 11 · 12 · 14 · 16 · 18 · 20 · 22 · 24 · 26 · 28 · 30 · 32 · 40 · 56 · 64 · 84 · 96 px. Panel gutter is 28px; card padding 18–20px; field gap 16px.

**Radii** — `999px` pills · `14px` panel cards · `10px` inputs & date blocks · `9px` compact date block · `50%` circles.

**Shadows**
- Buttons: `0 8px 20px -12px rgba(74,47,34,0.3)` (primary CTA uses `…0.4`)
- Cards (live site): `0 8px 20px -12px rgba(74,47,34,0.3)`
- Raised (live site): `0 20px 45px -20px rgba(74,47,34,0.25)`
- Panel: `-30px 0 60px -30px rgba(74,47,34,0.45)`

**Keyframes**
```css
@keyframes bbFade  { from { opacity: 0 }                              to { opacity: 1 } }
@keyframes bbSlide { from { transform: translateX(32px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
@keyframes bbStep  { from { transform: translateY(8px);  opacity: 0 } to { transform: translateY(0);  opacity: 1 } }
```

## Assets
- `brushandbloomsite/images/logo.png` — brand logo, used circular (52×52 in header, 46×46 in footer). Has a cream background, not transparent; a transparent version would be a drop-in replacement.
- `brushandbloomsite/images/favicon-32.png`, `favicon-512.png`, `apple-touch-icon.png` — favicons, already wired up.
- No photography. Gallery tiles on the live site are colour blocks; real session photos are still outstanding.
- All icons on the live site are inline stroked SVGs (`stroke-width: 1.6`, round caps/joins) — reuse or replace with the codebase's icon set.

## Files
| File | What it is |
|---|---|
| `Booking Panel.dc.html` | The prototype. Sessions array + all panel logic at the top of the `<script>` block; markup and inline styles below. Opens directly in a browser. |
| `brushandbloomsite/` | The current live static site (5 pages, EN/FR/NL switcher in `js/main.js`, full design system in `css/style.css`). The panel is meant to replace the `href="#book"` links throughout. |
| `brushandbloomsite/README-CONTENT-TODO.md` | Outstanding real-content items from the site build (booking links, address, hours, phone, photos, reviews, translations, deployment notes). |

## Open items before launch
1. Confirm the real checkout URL and its prefill parameter names.
2. Replace the four placeholder sessions with real dates, themes, prices and links.
3. Decide where session data ultimately lives — hardcoded array is fine at current volume, but Eventbrite's API is the obvious next step if the schedule grows.
4. Wire the newsletter opt-in to an actual list (it currently only sets local state).
5. Mirror the site's existing EN/FR/NL switcher: the panel's copy is English-only and needs `fr`/`nl` entries in the `translations` object in `js/main.js`.
