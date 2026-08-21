# Lane report: favicon rel=icon + `/favicon.ico` fallback re-verify (2026-08-20)

- Lane: tinystudio-io lane 1
- Branch: `docs/evidence/favicon-rereverify-2026-08-20`
- Item: 017eb201fc — "[unreviewed-by-opus] No rel=icon link is served, so
  every page load fires a 404 /favicon.ico request while favicon.svg exists
  and is allow-listed"

## Outcome

The item's code-side fix is already merged in `origin/main` — PR #85
(`9302611`, rel=icon on the five human-facing pages), PR #113 (`18128e8`,
rel=icon on `/brief-requested` plus the CI guard), and PR #238 (`5ca6241`,
the `/favicon.ico` legacy fallback serving the canonical SVG bytes). No new
code change was needed; this lane re-verified the guarantee against the
current head (d0daea9) and the live site, in the established pattern of the
prior re-verify receipts (#132, #182, #230), and recorded the closeout.

## Verification performed

1. **Source guard**: `node scripts/check-site.mjs` → "TinyStudio.io checks
   passed." (exit 0). The "Favicon (dogfood)" section verifies exactly one
   `<link rel="icon" href="/favicon.svg">` in the head of all seven served
   pages, valid tracked SVG, worker allow-list; the `/favicon.ico` section
   verifies the worker allow-lists the path and serves `image/x-icon`.
2. **Full suite**: `npm test` → exit 0, all suites green (headings 6/0,
   sitemap 7/0, worker, agent-UI, contract, study, viewport, narrow —
   zero failures).
3. **Live HTTP probes** (https://tinystudio.io):
   - All seven pages → HTTP 200.
   - `/favicon.svg` → 200, `image/svg+xml`.
   - `/favicon.ico` → **200** (was 404 before #238), `image/x-icon`,
     `Cache-Control: public, max-age=31536000, immutable`, body SHA-256
     `998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c` —
     byte-identical to `public/favicon.svg`.
4. **Live browser probe** (headless Chromium, Playwright 1.62.1): all seven
   pages load 200 with exactly one `link[rel="icon"]` pointing at
   `https://tinystudio.io/favicon.svg`, **zero** requests to `/favicon.ico`
   on any load, zero page/console errors, zero other 4xx/5xx.

## Drift check

`git diff 5ca6241..HEAD` over `public/`, `scripts/check-site.mjs`, and
`src/worker.js` contains zero favicon-related changes; the guarantee is
unchanged since the 2026-08-17 fix.

## Files changed

- `docs/evidence/favicon-rereverify-2026-08-20.md` — re-verify receipt on
  the current head (d0daea9) and live site, closing item 017eb201fc.
- `.lane/reports/docs-evidence-favicon-rereverify-2026-08-20.md` — this
  lane report.
