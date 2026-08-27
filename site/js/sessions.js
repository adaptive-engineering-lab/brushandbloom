/* =========================================================
   Brush & Bloom — SESSION SCHEDULE
   ---------------------------------------------------------
   THIS IS THE ONLY FILE YOU EDIT EACH WEEK.

   Everything on the site that mentions a session reads from
   the list below: the next-session block on the home page and
   the booking panel.

   Only the FIRST session in the list is ever shown publicly
   (see showOnlyNextSession below) — keep the next date at the
   top and queue future ones underneath.

   day   : number shown big on the date block  ("14")
   mon   : three-letter month under it          ("Sep")
   when  : full weekday + date + time, shown inside the panel
   title : the theme of the evening
   venue : shown in the panel summary
   price : euros per seat, as a plain number (no € sign)
   tags  : short pills shown on the schedule row
   url   : that session's Eventbrite / Stripe checkout link
   ========================================================= */

window.BB_SESSIONS = [
  {
    id: "s1",
    day: "14",
    mon: "Sep",
    when: "Saturday 14 September · 19:00–21:30",
    title: "Botanical Sunset — Beginner Friendly",
    venue: "Brush & Bloom Studio, Brussels",
    price: 39,
    tags: ["All Levels", "1 Drink Included"],
    url: "" /* TODO: real checkout link — see BB_CONFIG.checkoutEnabled below */
  },
  {
    id: "s2",
    day: "21",
    mon: "Sep",
    when: "Saturday 21 September · 19:00–21:30",
    title: "Golden Hour Vineyard",
    venue: "Brush & Bloom Studio, Brussels",
    price: 39,
    tags: ["All Levels", "Date Night Favourite"],
    url: ""
  },
  {
    id: "s3",
    day: "28",
    mon: "Sep",
    when: "Saturday 28 September · 18:30–21:00",
    title: "Abstract Bloom — Ladies' Night",
    venue: "Brush & Bloom Studio, Brussels",
    price: 55,
    tags: ["All Levels", "Group Friendly"],
    url: ""
  },
  {
    id: "s4",
    day: "05",
    mon: "Oct",
    when: "Sunday 5 October · 19:00–21:30",
    title: "Autumn Still Life",
    venue: "Brush & Bloom Studio, Brussels",
    price: 39,
    tags: ["All Levels", "1 Drink Included"],
    url: ""
  }
];

/* =========================================================
   Booking panel settings
   ---------------------------------------------------------
   checkoutEnabled — OFF right now, by choice.
     While false, the last step of the booking panel shows a
     "booking opens soon" note and an email address instead of
     sending anyone to a payment page. Nothing is charged and
     no half-finished checkout link is exposed.

     To switch online booking on later:
       1. Put each session's real checkout URL in `url` above.
       2. Confirm the prefill parameter names with Eventbrite
          or Stripe — the ones in bookingUrl() below are a
          sensible guess, NOT confirmed. Eventbrite's differ by
          ticket type and embed mode; Stripe Checkout uses
          `prefilled_email` and sets quantity server-side.
       3. Set checkoutEnabled to true.
   ========================================================= */

window.BB_CONFIG = {
  checkoutEnabled: false,

  /* One evening at a time. The site advertises only the first
     session in the list above, and the panel opens straight
     onto it. Set to false to show the whole list instead. */
  showOnlyNextSession: true,

  contactEmail: "hello@brushandbloom.be",
  maxSeats: 6,
  collectPhone: false,
  showNextSteps: true,
  openInNewTab: true
};
