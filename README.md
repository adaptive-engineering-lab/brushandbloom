# Brush & Bloom

Static marketing site for Brush & Bloom — paint & sip evenings in Brussels — with a
site-wide slide-over booking panel.

Plain HTML, CSS and JavaScript. No build step, no dependencies, nothing to install.

```
site/                     ← this folder is what gets deployed
  index.html              home, including the next-session block (#schedule)
  about.html              story + values
  gallery.html            colour-block tiles (real photos still outstanding)
  css/style.css           the whole design system, plus the booking panel
  js/sessions.js          ← THE WEEKLY EDIT LIVES HERE
  js/booking-panel.js     booking panel behaviour + schedule rendering
  js/main.js              nav, EN/FR/NL switcher
  images/                 logo and favicons
design_handoff_booking_panel/   original design handoff, kept for reference
```

## Editing the schedule

Open `site/js/sessions.js` and edit the `BB_SESSIONS` array. That single array feeds
both the next-session block on the home page and the booking panel — nothing else needs
touching.

**Only the first session in the array is ever shown publicly.** The site advertises one
evening at a time (`BB_CONFIG.showOnlyNextSession`), so keep the next date at the top and
queue future ones underneath. Set the flag to `false` to list them all.

```js
{
  id: "s1",                                          // any unique string
  day: "14", mon: "Sep",                             // the date block
  when: "Saturday 14 September · 19:00–21:30",       // shown inside the panel
  title: "Botanical Sunset — Beginner Friendly",
  venue: "Brush & Bloom Studio, Brussels",
  price: 39,                                         // euros per seat, a plain number
  tags: ["All Levels", "1 Drink Included"],
  url: ""                                            // checkout link (see below)
}
```

## The booking panel

Any element carrying `data-book` opens it:

| Attribute | Opens on |
|---|---|
| `data-book` | the next session, straight to the seat step |
| `data-book="s2"` | that specific session, straight to the seat step |
| `data-book="pick"` | the session list |

The panel collects seats, name and email. **Nothing is charged here** — by design.

## Online checkout is currently OFF

`BB_CONFIG.checkoutEnabled` in `site/js/sessions.js` is `false`. The last step of the
panel shows a "booking opens soon" note and the studio email address instead of sending
anyone to a payment page.

To turn booking on:

1. Put each session's real Eventbrite/Stripe URL in its `url` field.
2. **Confirm the prefill parameter names.** `bookingUrl()` in `js/booking-panel.js`
   appends `?quantity=&name=&email=` — that is a reasonable guess, not a confirmed
   contract. Eventbrite's parameters vary by ticket type and embed mode; Stripe Checkout
   uses `prefilled_email` and sets quantity server-side. Check against the real listing.
3. Set `checkoutEnabled: true`.

Other settings in the same object: `maxSeats` (default 6), `collectPhone`,
`showNextSteps`, `openInNewTab`, `contactEmail`.

## Still placeholder

- `[YOUR PHONE NUMBER]` — footer of every page
- Session dates, themes and prices in `js/sessions.js`
- The founding story on `about.html` (marked `<em>Placeholder</em>`)
- Testimonials on `index.html` (labelled "placeholder review")
- Gallery photos — tiles are colour blocks; drop images into `images/gallery/`
- There is no contact page or form — guests reach you via the footer's email address
  and Instagram link.
- The booking panel's copy is English only. The FR/NL switcher reads from the
  `translations` object at the top of `js/main.js`.

## Running it locally

```sh
cd site && python3 -m http.server 8000
```

## Deploying

The site deploys from the `site/` directory as a static build — no framework preset, no
build command.

```sh
npx vercel deploy --prod site
```
