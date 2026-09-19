# Machine-readable truth — `/llms.txt` and `/offer.md`

The two agent-readable surfaces. Served by the Worker from
`public/llms.txt` and `public/offer.md` through the
`PUBLIC_ASSET_PATHS` allow-list, with no D1 or AI call on render.
This is the canonical "what is TinyStudio selling" truth for any
agent (or human) reading the site as a document instead of as a
page.

## How users reach it

Direct URL only. The pages are linked from the
site's `public/sitemap.xml` and are the only agent-readable
endpoints. They are intentionally not linked from the visible
homepage or any marketing page.

## How to drive it

1. `GET /llms.txt` — expect 200 and `Content-Type: text/plain; charset=utf-8`.
2. The file declares TinyStudio's current offer is The Website
   Appraisal (the free leak audit of high-ticket service
   homepages, with the human-reviewed desk that closes what the
   audit finds). The legacy Agent Desk is described as retired /
   legacy, never as the current product.
3. `GET /offer.md` — expect 200 and `Content-Type: text/markdown; charset=utf-8`.
4. The file mirrors the same product truth in markdown form.
5. Both files are in `public/sitemap.xml` as exact loc lines
   (`<loc>https://tinystudio.io/llms.txt</loc>` and
   `<loc>https://tinystudio.io/offer.md</loc>`); the
   `scripts/test-sitemap.mjs` regression asserts on those exact
   strings.
6. The no-guarantees boundary is in both files: no revenue, ROAS,
   ranking, conversion, booked-call, sales-lift, autonomous-buying,
   or unapproved-spend claims. This is the same boundary the
   visible pages enforce, and the `check-site.mjs` forbidden-claim
   list reads these files to enforce it.

```bash
curl -fsS -D - http://127.0.0.1:8790/llms.txt -o /tmp/verify-tinystudio/llms.txt | grep -i "Content-Type"
curl -fsS -D - http://127.0.0.1:8790/offer.md -o /tmp/verify-tinystudio/offer.md | grep -i "Content-Type"
curl -s http://127.0.0.1:8790/sitemap.xml | grep -E '<loc>https://tinystudio.io/(llms\.txt|offer\.md)</loc>'
```

## What proves success

- HTTP 200 on both files.
- The `Content-Type` header is `text/plain; charset=utf-8` for
  `/llms.txt` and `text/markdown; charset=utf-8` for `/offer.md`.
- The current-offer declaration (Website Appraisal) is present in
  both files.
- The retired-Desk declaration is present in both files.
- The no-guarantees boundary (no revenue/ROAS/ranking/conversion
  promises) is present in both files.
- Both files are in the sitemap at the exact loc lines above.

## Local honesty note

- The files are static and byte-identical between local dev and
  production. The Worker is a passthrough for these paths.
- These two files are what the repo's `scripts/check-site.mjs`
  and `scripts/test-product-contract.mjs` regression tests read
  to enforce the no-promises boundary. If a PR weakens the
  boundary here, the unit tests fail before the harness is even
  needed; the harness exists to prove the *runtime* serves
  them, not to re-derive the content.
