# Favicon rel=icon on every served page — re-verify against current main and live

Date: 2026-08-12
Scope: the review-queue item "[unreviewed-by-grok] No rel=icon link is
served, so every page load fires a 404 /favicon.ico request while
favicon.svg exists and is allow-listed". This receipt re-verifies the item's
guarantee against the current `origin/main` head (18128e8, "fix(public):
serve rel=icon on /brief-requested and guard favicon links in
check-site.mjs", merged 2026-08-12) and the live deployment of that head. It
is source-evidence plus a real-browser measurement of the deployed site.

## Summary

The failure mode the item describes — every page load firing a
`/favicon.ico` request that 404s because no `rel=icon` link is served — **no
longer occurs, on source and on the live site**. The code-side fix is already
merged in `origin/main` in two parts: PR #85
(`9302611`, "fix(public): serve rel=icon favicon on every page so browsers
stop 404ing /favicon.ico") added the `<link rel="icon" href="/favicon.svg"
type="image/svg+xml" />` line to the five human-facing pages; PR #113
(`18128e8`) re-landed the two pieces the original branch scoped out — the
same link on `/brief-requested` (the post-signup page every buyer hits) and a
CI guard in `scripts/check-site.mjs` that enforces exactly one `rel=icon`
link pointing at `/favicon.svg` on **all seven** served pages, with
`public/favicon.svg` tracked, valid SVG, and allow-listed in the worker.
`/favicon.ico` is not (and never was) served by the worker — but since every
page now declares its icon, no browser requests it. Measured in real
Chromium on 2026-08-12: **zero** `/favicon.ico` requests on any page load.

## Source checks on the current head (18128e8)

1. `npm run check` passes. The "Favicon (dogfood)" guard
   (`scripts/check-site.mjs`, "every served HTML page must keep exactly one
   <link rel=icon> inside its head pointing at the served /favicon.svg
   asset") verifies on all seven pages — homepage, audit, desk (`agents`),
   pricing, specimen, brief-requested, and the retired agent-desk — that
   exactly one `<link rel="icon">` appears in the head and its `href` is
   `/favicon.svg`; that `public/favicon.svg` is a tracked, valid SVG; and
   that the worker's public asset allow-list still serves `"/favicon.svg"`
   (`src/worker.js` line 50). It also guards the parallel apple-touch-icon
   guarantee (`/apple-touch-icon.png` on all seven pages), which the
   item's fix pass touched on `/brief-requested` in PR #114.
2. `npm test` passes: the source checks above plus the heading-hierarchy,
   sitemap, agent-worker, agent-UI and product-contract suites — 92 tests
   total, all green, zero failures.

## Live re-verification 2026-08-12

Re-ran the deployed-site measurement in real Chromium (Playwright 1.62.1,
headless) against the live `https://tinystudio.io` — the current deployment
of the current main:

| Page | HTTP | rel=icon links | requests to /favicon.ico | other 4xx/5xx on load |
|---|---|---|---|---|
| `/` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none |
| `/audit` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none |
| `/agents` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none |
| `/pricing` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none |
| `/specimen` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none |
| `/brief-requested` | 200 | 1 × `/favicon.svg` (image/svg+xml) | 0 | none (see note) |

Every page loaded 200 at its clean URL with zero page errors and zero console
errors; the served DOM of every page carries exactly one `<link rel="icon"
href="/favicon.svg" type="image/svg+xml" />`; and the network log of every
load contains **zero** requests whose URL includes `/favicon.ico` — the 404
the item flagged is no longer fired by any browser.

Direct asset probes:

```
GET https://tinystudio.io/favicon.svg  → HTTP/2 200, content-type: image/svg+xml
GET https://tinystudio.io/favicon.ico  → HTTP/2 404 (expected: not allow-listed;
                                          and now unreferenced, so never requested)
```

Plain `curl` fetches of the six live pages (cache-busted with `?cb=20260812`,
`Cache-Control: no-cache`) each contain exactly one `rel="icon"` link,
matching the browser measurement.

Note (unrelated, pre-existing): `/brief-requested` carries a Google Ads
conversion-tag placeholder (`https://www.googletagmanager.com/gtag/js?id=
AW-XXXXXXXXX`, added in the page's first commit c90c8a4 / PR #14) whose
script load is blocked by the production CSP (`script-src 'self'
https://static.cloudflareinsights.com`). That is a CSP-blocked script load,
not a 404, not a favicon issue, and predates this item's fixes; it does not
affect the favicon guarantee measured above.

## Repro steps

1. Source guard: `npm run check` — the "Favicon (dogfood)" section fails if
   any of the seven pages loses its single `/favicon.svg` rel=icon link, if
   the asset is dropped, rewritten invalid, untracked, or removed from the
   worker allow-list.
2. Live browser probe: headless Chromium (Playwright 1.62.1) loads each of
   the six public pages, waits for network idle, records every request whose
   URL contains `/favicon.ico`, and asserts
   `document.querySelectorAll('link[rel="icon"]').length === 1` with
   `href === "/favicon.svg"` — measured zero favicon.ico requests and one
   correct link on all six pages.
3. Asset probes: `curl -s -o /dev/null -w '%{http_code}' 
   https://tinystudio.io/favicon.svg` → 200; the same for `/favicon.ico` →
   404, now never referenced.

## Closeout

The item as stated — "No rel=icon link is served, so every page load fires a
404 /favicon.ico request while favicon.svg exists and is allow-listed" — is
**closed against current main and live**: the code-side fix (PRs #85 and
#113) is merged in `origin/main`, the CI guard in `scripts/check-site.mjs`
enforces the guarantee on all seven served pages, `npm run check` and
`npm test` pass on the current head (18128e8), and the deployed site serves
exactly one `/favicon.svg` rel=icon link on every page with zero
`/favicon.ico` requests fired — as re-measured in real Chromium on
2026-08-12. The receipt now records the closeout on the current head so the
item cannot be re-opened by tracker drift.
