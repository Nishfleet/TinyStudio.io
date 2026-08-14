# Favicon rel=icon on every served page — re-verify against current main and live

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] No rel=icon link is
served, so every page load fires a 404 /favicon.ico request while favicon
svg exists and is allow-listed" (item 017eb201fc). This receipt re-verifies
the item's guarantee against the current `origin/main` head (5770bf3,
"docs(evidence): re-verify AI answer readiness finding 4473a99a9bc9 against
current main and live", merged 2026-08-14) and the live deployment of that
head. It is source-evidence plus a real-browser measurement of the deployed
site.

## Summary

The failure mode the item describes — every page load firing a
`/favicon.ico` request that 404s because no `rel=icon` link is served — **no
longer occurs, on source and on the live site**. The code-side fix is already
merged in `origin/main`: PR #85 (`9302611`, "fix(public): serve rel=icon
favicon on every page so browsers stop 404ing /favicon.ico") added the
`<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` line to the
five human-facing pages; PR #113 (`18128e8`) re-landed the two pieces the
original branch scoped out — the same link on `/brief-requested` (the
post-signup page every buyer hits) and a CI guard in `scripts/check-site.mjs`
that enforces exactly one `rel=icon` link pointing at `/favicon.svg` on **all
seven** served pages, with `public/favicon.svg` tracked, valid SVG, and
allow-listed in the worker. `/favicon.ico` is not (and never was) served by
the worker — but since every page now declares its icon, no browser requests
it. Measured in real Chromium on 2026-08-14: **zero** `/favicon.ico`
requests on any page load.

## Source checks on the current head (5770bf3)

1. `npm run check` passes (exit 0, "TinyStudio.io checks passed."). The
   "Favicon (dogfood)" guard (`scripts/check-site.mjs` lines 1348-1393,
   "every served HTML page must keep exactly one <link rel=icon> inside its
   head pointing at the served /favicon.svg asset") verifies on all seven
   pages — homepage, audit, desk (`agents`), pricing, specimen,
   brief-requested, and the retired agent-desk — that exactly one
   `<link rel="icon">` appears in the head and its `href` is `/favicon.svg`;
   that `public/favicon.svg` is a valid SVG (`<svg` opening tag), tracked by
   git, and still allow-listed by the worker (`src/worker.js` line 61
   `"/favicon.svg"`).
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   viewport, and narrow-viewport suites — all green, zero failures. (The
   only reported item is a pre-existing, out-of-scope note that `/` overflows
   at 240px and 260px; it does not gate the exit code and does not touch the
   favicon guarantee.)

## Live re-verification 2026-08-14

Re-ran the deployed-site measurement in real Chromium (Playwright 1.62.1,
headless) against the live `https://tinystudio.io` — the current deployment
of the current main:

| Page | HTTP | rel=icon links (head / full doc) | href | requests to /favicon.ico | other 4xx/5xx on load |
|---|---|---|---|---|---|
| `/` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/audit` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/agents` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/pricing` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/specimen` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/brief-requested` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/agent-desk` | 200 | 1 / 1 | `https://tinystudio.io/favicon.svg` | 0 | none |

Every page loaded 200 at its clean URL with zero page errors and zero console
errors; the served DOM of every page carries exactly one `<link rel="icon"
href="/favicon.svg" type="image/svg+xml" />`; and the network log of every
load contains **zero** requests whose URL includes `/favicon.ico` — the 404
the item flagged is no longer fired by any browser.

Served head link, quoted verbatim from `https://tinystudio.io/`:

> ```html
> <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
> ```

Direct asset probes:

```
GET https://tinystudio.io/favicon.svg → HTTP/2 200, content-type: image/svg+xml
GET https://tinystudio.io/favicon.ico → HTTP/2 404 (expected: not allow-listed;
                                         and now unreferenced, so never requested)
```

The served `/favicon.svg` is byte-identical to the committed
`public/favicon.svg` (SHA-256
`998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c`), so the
live icon is exactly the file the source guard checks.

## Repro steps

1. Source guard: `npm run check` — the "Favicon (dogfood)" section fails if
   any of the seven pages loses its single `/favicon.svg` rel=icon link, if
   the asset is dropped, rewritten invalid, untracked, or removed from the
   worker allow-list.
2. Live browser probe: headless Chromium (Playwright 1.62.1) loads each of
   the seven public pages, waits for network idle, records every request
   whose URL contains `/favicon.ico`, and asserts
   `document.head.querySelectorAll('link[rel="icon"]').length === 1` with
   `href === "https://tinystudio.io/favicon.svg"` — measured zero
   favicon.ico requests and one correct link on all seven pages, each
   returning HTTP 200.
3. Asset probes: `curl -s -o /dev/null -w '%{http_code}' 
   https://tinystudio.io/favicon.svg` → 200; the same for `/favicon.ico` →
   404, now never referenced. The served bytes match the committed file
   (SHA-256 above).

## Closeout

The item as stated — "No rel=icon link is served, so every page load fires a
404 /favicon.ico request while favicon.svg exists and is allow-listed" — is
**closed against current main and live**: the code-side fix (PRs #85 and
#113) is merged in `origin/main`, the CI guard in `scripts/check-site.mjs`
enforces the guarantee on all seven served pages, `npm run check` and
`npm test` pass on the current head (5770bf3), and the deployed site serves
exactly one `/favicon.svg` rel=icon link on every page with zero
`/favicon.ico` requests fired — as re-measured in real Chromium on
2026-08-14. The receipt now records the closeout on the current head so the
item cannot be re-opened by tracker drift.
