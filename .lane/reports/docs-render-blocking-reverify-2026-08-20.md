# Lane 1 — dogfood b8f6046e942a re-verification (2026-08-20)

Finding: "Render-blocking resources on home" (dogfood run
20260808T074205Z-msk2fl3n).

## Verdict

**The font stylesheet loads non-blocking on all six public pages, in CI and
on live — the finding stays closed, and no code change was needed.**

## What this lane checked

The finding was originally fixed by PR #20 (commit c5599bc: preload the
Google Fonts css2 URL as a style resource, promote it via the same-origin
`public/fonts.js` script, keep a `<noscript>` fallback, drop the `@import`
from `shared.css`) and enforced in CI by PR #23 (`npm run
check:render-blocking`, real Chromium under the production CSP). It has
been re-verified against live on 2026-08-09, 2026-08-10, 2026-08-11,
2026-08-13, 2026-08-14 and 2026-08-17.

Since the 2026-08-17 re-verification (head 798cd71), the commits that
landed on main were: d0daea9 (controlled AI-search re-run), dda25f2 (worker
six-a-month intake cap honesty), 43cc831 (study figures refreshed,
2026-08-12 scan, daily-refresh promise guard), 66f7bd6 (appraisal intake
fields switched from `aria-label` to wrapped `<label for=...><span>`
elements), 23a7f06 (footer brand TinyStudio), ed2b1a9 (appraisal-page
canonicals and JSON-LD WebPage @ids pointed at clean non-307 URLs), 76fe17b
(real Request-the-appraisal signup form in the /pricing closing callout),
9f79c71 (check-site guard catches every redirecting spelling of an internal
`.html` page link), 5ca6241 (serve `/favicon.ico` from the canonical SVG so
legacy clients stop 404-ing) and the docs-only re-verification receipts.
None touched the font loading shape. `git diff 798cd71..d0daea9 --
public/fonts.js` is empty; `public/index.html` lines 56–59 (the preload
link, `fonts.js` promotion script and `<noscript>` fallback) are unchanged;
`shared.css` carries no `@import` chain on any of the six pages.

The lane therefore re-ran the same verification the finding demands, on the
current origin/main head (`d0daea9`) and against the live deployment:

1. **Browser check passes** — `npm run check:render-blocking` on the current
   working tree (real Chromium, production CSP, css2 intercepted and
   delayed 2500ms, stubbed response): all six pages PASS — css2
   non-blocking, first-contentful-paint never waits for it (homepage 248ms,
   audit 132ms, desk 104ms, pricing 72ms, specimen 80ms, brief-requested
   68ms; the css2 response arrives at 2500ms, i.e. ~2.3–2.4s after first
   paint), no render-blocking resources other than the site's own
   same-origin stylesheets, promoted sheet applied.

2. **Full suite passes** — `node scripts/check-site.mjs` reports
   "TinyStudio.io checks passed"; the `--test` runs across
   `test-heading-hierarchy.mjs`, `test-sitemap.mjs`,
   `test-agent-worker.mjs`, `test-agent-ui.mjs`,
   `test-product-contract.mjs`, `test-study-freshness.mjs` — 122 tests, 0
   failures; `test-first-viewport-audience.mjs` — 4 tests, 0 failures;
   `test-narrow-viewport.mjs` and `test-narrow-viewport-pages.mjs` — pass.
   `git diff --check` is clean.

3. **Live re-measurement** in real Chromium (unthrottled), served with the
   production CSP header emitted by the worker (verified via `curl -sI
   https://tinystudio.io/`):

   | Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
   |---|---|---|---|---|---|---|
   | index.html (home) | non-blocking | 236 | 400 | same-origin index.css only | yes / yes | yes |
   | audit.html | non-blocking | 248 | 436 | same-origin shared.css, audit.css | yes / yes | yes |
   | agents.html (desk, served at /agents) | non-blocking | 260 | 407 | same-origin shared.css, agents.css | yes / yes | yes |
   | pricing.html | non-blocking | 216 | 381 | same-origin shared.css, pricing.css | yes / yes | yes |
   | specimen.html | non-blocking | 260 | 413 | same-origin shared.css, specimen.css | yes / yes | yes |
   | brief-requested.html | non-blocking | 200 | 380 | same-origin shared.css, brief-requested.css | yes / yes | yes |

   On the unthrottled live run the preloaded css2 (a non-blocking style
   preload, fetched at preload priority from the first byte) arrives
   ~140–170ms after first-contentful-paint on each page — the same
   ordering every earlier live run showed. That is timing, not blocking:
   the deterministic delayed-css2 run above paints ~2.3–2.4s before the
   css2 response arrives, so first paint cannot be waiting on it.

4. **No head-shape drift** — the live-deployed HTML on every page still
   carries the preload link (`rel="preload" as="style" data-fonts-css`), the
   `fonts.js` promotion script and the `<noscript>` fallback (the same
   three head elements the CI check and the live re-measurements rely on),
   and still serves without any `@import` chain. The deployed intake fields
   are still on `aria-label`, replaced in the current source by 66f7bd6
   (one fix behind the current source head); the served font head block,
   which is what this finding measures, is unchanged in both source and
   deploy.

## Files touched

- `docs/evidence/render-blocking-fonts-2026-08-08.md` — appended the
  2026-08-20 closeout re-verification receipt (the finding's established
  closeout pattern: source check + live measurement, no code change when
  the guarantee already holds).
- `.lane/reports/docs-render-blocking-reverify-2026-08-20.md` — this lane
  report.

## Why the earlier receipts did not cover this

The 2026-08-17 receipt verified head 798cd71. This receipt re-checks the
browser guarantee, the CI guard and the live served bytes on the current
head (`d0daea9`) and against the live site on 2026-08-20. Nothing changed in
the font loading region since the 2026-08-17 receipt, so the finding remains
closed with no code change.
