# Brush & Bloom — Content Checklist

This is a complete, working static website (plain HTML/CSS/JS — no build step, no dependencies to install). Everything below is placeholder content standing in for the real thing so the site looks and feels finished. Nothing will break if you leave it as-is, but here's what to update before it goes live.

## 1. Booking links (highest priority)

Every "Book Now" button currently points to `#book` (a harmless placeholder). Find-and-replace `href="#book"` across all `.html` files with your real Eventbrite event/listing URL(s).

Files with these links: `index.html`, `about.html`, `events.html` (schedule rows + pricing cards).

## 2. Contact details

Search for these placeholders and replace them:

- `[YOUR PHONE NUMBER]` — appears in the footer of every page and on `contact.html`.
- `[Add your full studio address]` — on `contact.html`.
- `[Add your opening hours, e.g. Wed–Sun, 17:00–22:00]` — on `contact.html`.
- `hello@brushandbloom.be` — a plausible placeholder email; update if different.
- The map placeholder box on `contact.html` — replace with a real Google Maps `<iframe>` embed once you have a confirmed address.

## 3. Event schedule & pricing

`events.html` has 4 sample upcoming sessions and 3 sample pricing tiers (Classic €39, Bloom Package €55, Group from €35). Replace the dates, themes, times, and prices with your real offering. If your lineup changes often, consider eventually pulling it from Eventbrite's API or embedding an Eventbrite widget instead of hand-editing HTML each time.

## 4. About page story

`about.html` has placeholder founding-story copy (marked `<em>Placeholder…</em>`). Swap in your real story, founder bio, and mission.

## 5. Testimonials

`index.html` has 3 clearly-labelled placeholder reviews ("Guest — placeholder review"). Replace with real guest quotes once you have some — remove the "Placeholder reviews" note below them once done.

## 6. Gallery photos

`gallery.html` currently uses 8 elegant colour-block tiles with simple line icons instead of real photos (no stock photos were used, since none were provided). To swap in real photos:

1. Add your images to a new `images/gallery/` folder.
2. In `gallery.html`, replace each `<div class="gallery-tile ...">...</div>` block with:
   ```html
   <div class="gallery-tile g-tall"><img src="images/gallery/your-photo.jpg" alt="Describe the photo" style="width:100%;height:100%;object-fit:cover;"><span class="g-caption">Your caption</span></div>
   ```
   (Drop `g-tall` for a normal-height tile.)

## 7. Logo & favicon

Your logo (`images/logo.png`) is already wired into the nav, footer, and favicon. If you get a version with a transparent background later, swap the file — no code changes needed.

## 8. Languages (EN / FR / NL)

A working language switcher (EN / FR / NL buttons in the nav) is built in `js/main.js`. It currently translates all navigation, buttons, headings and section labels. Longer paragraph copy (the About story, FAQ answers, testimonial quotes, event descriptions) is left in English on purpose, since that content is still placeholder and will likely change — once you finalize your real English copy, send it over (or add it yourself) and the French/Dutch translations for those paragraphs can be filled into the `translations` object at the top of `js/main.js`.

Note: the switcher works per-page and resets to English on navigation (no cookies/local storage are used, by design, to keep the site fully static and privacy-friendly).

## 9. Deploying to Vercel (free tier)

Since you mentioned Vercel:

1. Push this folder to a GitHub repo (or use `vercel` CLI directly on the folder).
2. In Vercel: **New Project → Import** your repo (or drag-and-drop the folder at vercel.com/new).
3. Framework preset: **Other** (it's static HTML — no build command needed, no output directory setting required beyond the repo root).
4. Deploy. You'll get a free `*.vercel.app` URL immediately, and can attach a custom domain (e.g. `brushandbloom.be`) afterward in Project Settings → Domains.

## 10. Contact form

The form on `contact.html` currently just shows a friendly "not connected yet" message on submit (no data is sent anywhere). To make it functional without a backend, the easiest options are:
- **Formspree** (formspree.io) — add `action="https://formspree.io/f/yourFormId"` and `method="POST"` to the `<form>` tag.
- **Netlify Forms** — if you deploy on Netlify instead of Vercel, add `data-netlify="true"` and a hidden `form-name` input.
- Or simply keep it as a `mailto:` fallback by pointing guests to the email address instead.

---

Everything else — layout, colors (pulled from your logo), typography, spacing, animations, mobile menu — is finished and doesn't need any changes unless you want to adjust the look.
