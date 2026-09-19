# Specimen report — `/specimen`

The specimen page: a public sample of the Website Appraisal, paired
with the eighty-eight-site market study link. Served by the Worker
from `public/specimen.html` through the `PUBLIC_ASSET_PATHS` allow-list,
with `public/specimen.css` and `public/specimen.js` co-served.

## How users reach it

Open `http://127.0.0.1:8790/specimen` directly, or follow the
`Read the specimen →` link in the homepage's market-research
paragraph.

## How to drive it

1. `GET /specimen` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The page links to the market study with the readable count:
   `<span data-study="readable_word">eighty-eight</span>` (or the
   current snapshot's readable word). The study snapshot is what
   `scripts/test-study-freshness.mjs` reads; the specimen page must
   stay in sync with that snapshot.
3. The specimen itself is a representative audit — not a real
   client's. The page must make that explicit (no logos, no
   testimonials, no "as seen at").

```bash
curl -fsS http://127.0.0.1:8790/specimen -o /tmp/verify-tinystudio/specimen.html
grep -c 'data-study="readable_word"' /tmp/verify-tinystudio/specimen.html
curl -s -o /dev/null -w "specimen.css %{http_code}\n" http://127.0.0.1:8790/specimen.css
curl -s -o /dev/null -w "specimen.js  %{http_code}\n" http://127.0.0.1:8790/specimen.js
```

## What proves success

- HTTP 200 on `/specimen`, `/specimen.css`, `/specimen.js`.
- The `data-study="readable_word"` span is present and carries a
  number-as-words (the same readable form the homepage's FAQ
  references).
- The page contains a disclaimer that this is a representative
  audit, not a real engagement.

## Local honesty note

- The market-study freshness test
  (`scripts/test-study-freshness.mjs`) currently fails on
  `main` because the most recent snapshot is 4 days old and the
  site promises a daily refresh. This is a **pre-existing** fault
  in the snapshot pipeline, not the specimen page. The harness
  reports it; the fix lands in a separate PR/issue.
- The page is pure HTML/CSS/JS. No D1, no AI. Local proof is
  byte-identical to production for this page.
