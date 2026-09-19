# Pricing — `/pricing`

The pricing page: a single price, plainly stated, with the
no-guarantees boundary in writing. Served by the Worker from
`public/pricing.html` through the `PUBLIC_ASSET_PATHS` allow-list,
with `public/pricing.css` and `public/pricing.js` co-served.

## How users reach it

Open `http://127.0.0.1:8790/pricing` directly, or follow `Pricing` in
the homepage nav.

## How to drive it

1. `GET /pricing` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The price is `2,500` (USD, per month) with a `three-month minimum`
   (or `three month minimum` — the prose form is also fine).
3. The no-guarantees boundary is in the page meta description and
   body: `No revenue, ranking or booking guarantees. Only the work.`
   (or the close variants used across the site). The forbidden-claim
   list in `scripts/check-site.mjs` rejects promises of revenue,
   ROAS, ranking, conversion, booked calls, sales lift, autonomous ad
   buying, or unapproved spend changes.
4. The `delivery guarantee` is described as the audit being free and
   the desk running at the stated price — not a results guarantee.

```bash
curl -fsS http://127.0.0.1:8790/pricing -o /tmp/verify-tinystudio/pricing.html
grep -c '2,500' /tmp/verify-tinystudio/pricing.html
grep -c 'three-month minimum\|three month minimum' /tmp/verify-tinystudio/pricing.html
grep -c 'No revenue, ranking or booking guarantees' /tmp/verify-tinystudio/pricing.html
curl -s -o /dev/null -w "pricing.css %{http_code}\n" http://127.0.0.1:8790/pricing.css
curl -s -o /dev/null -w "pricing.js  %{http_code}\n" http://127.0.0.1:8790/pricing.js
```

## What proves success

- HTTP 200 on `/pricing`, `/pricing.css`, `/pricing.js`.
- The literal `2,500` appears in the page.
- The three-month minimum is named.
- The no-guarantees boundary is visible in the body or meta
  description (the same string the `check-site` script asserts on
  elsewhere in the site).

## Local honesty note

The page is pure HTML/CSS/JS — no D1, no AI. Local proof is
byte-identical to production for this page. The price is the
single source of truth; do not introduce a "starts at" or a
"contact for pricing" variant without a contract change.
