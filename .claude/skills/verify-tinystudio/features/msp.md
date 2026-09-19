# MSP/IT buyer-intent page — `/msp`

The MSP/IT buyer-intent page. Same current offer as the homepage
(The Website Appraisal), but framed for managed-service-provider,
managed-IT, and cybersecurity buyers. Served by the Worker from
`public/msp.html` through the `PUBLIC_ASSET_PATHS` allow-list, with
`public/msp.css` and `public/msp.js` co-served.

## How users reach it

Open `http://127.0.0.1:8790/msp` directly, or follow an inbound
MSP/IT link. The page is in the sitemap and is therefore indexable
— the homepage does not link to it on purpose (the audience is
different and the homepage is a generalist page).

## How to drive it

1. `GET /msp` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The primary CTA funnels into the same `audit` form the homepage
   uses. The form action is `/api/signups`, with `email` as the
   required field; the page is allowed to derive `source="msp"`
   from the page path when the form is submitted.
3. The MSP/IT framing is present: at minimum, terms like "managed
   service", "MSP", "cybersecurity" or "security" appear in the
   copy. The page does NOT change the offer — same Website
   Appraisal, same human-reviewed desk, same price.
4. The page is in `public/sitemap.xml` (the sitemap regression test
   in `scripts/test-sitemap.mjs` asserts on the exact loc set).

```bash
curl -fsS http://127.0.0.1:8790/msp -o /tmp/verify-tinystudio/msp.html
grep -c 'action="/api/signups"' /tmp/verify-tinystudio/msp.html
grep -c 'name="email"' /tmp/verify-tinystudio/msp.html
curl -s http://127.0.0.1:8790/sitemap.xml | grep -c '<loc>https://tinystudio.io/msp</loc>'
curl -s -o /dev/null -w "msp.css %{http_code}\n" http://127.0.0.1:8790/msp.css
curl -s -o /dev/null -w "msp.js  %{http_code}\n" http://127.0.0.1:8790/msp.js
```

## What proves success

- HTTP 200 on `/msp`, `/msp.css`, `/msp.js`.
- The signup form posts to `/api/signups` (same contract as `/audit`).
- The exact `<loc>https://tinystudio.io/msp</loc>` line is in the
  sitemap.
- The page carries MSP/IT buyer-intent framing without changing
  the offer, the price, or the no-guarantees boundary.

## Local honesty note

The page is pure HTML/CSS/JS. No D1 read on render. The D1
read/write happens on form submit, which `features/signup.md`
covers. The page-level drive is byte-identical to production.
