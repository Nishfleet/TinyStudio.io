# Favicon rel=icon on every served page + `/favicon.ico` fallback — re-verify against current main and live

Date: 2026-08-20
Scope: the review-queue item "[unreviewed-by-opus] No rel=icon link is
served, so every page load fires a 404 /favicon.ico request while favicon
svg exists and is allow-listed" (item 017eb201fc). This receipt re-verifies
the item's guarantee against the current `origin/main` head (d0daea9,
"evidence(ai-search): controlled entity-and-offer re-run with first Found
transitions (2026-08-15) (#227)") and the live deployment of that head,
following the pattern of the 2026-08-12, 2026-08-14, 2026-08-15
re-verifications (PRs #132, #182, #230) and the 2026-08-17 `/favicon.ico`
fallback fix (#238).

## Summary

The failure mode the item describes — every page load firing a
`/favicon.ico` request that 404s because no `rel=icon` link is served — **no
longer occurs, on source and on the live site**. Two merged code fixes cover
it:

1. **rel=icon links** — PR #85 (`9302611`, "fix(public): serve rel=icon
   favicon on every page so browsers stop 404ing /favicon.ico") added
   `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` to the
   five human-facing pages; PR #113 (`18128e8`) added the same link to
   `/brief-requested` and a CI guard in `scripts/check-site.mjs` enforcing
   exactly one rel=icon link pointing at `/favicon.svg` in the head of **all
   seven** served pages, with `public/favicon.svg` tracked, valid SVG, and
   allow-listed in the worker.
2. **`/favicon.ico` legacy fallback** — PR #238 (`5ca6241`, "fix(public):
   serve /favicon.ico from the canonical SVG so legacy clients stop
   404-ing", 2026-08-17) allow-listed `/favicon.ico` in the worker
   (`PUBLIC_ASSET_PATHS`) and added a handler that serves the canonical
   `public/favicon.svg` bytes with `Content-Type: image/x-icon`, so even
   legacy clients that ignore `<link rel="icon">` and hit the well-known
   path get 200 instead of 404. Modern browsers that honor the link
   declaration never request `/favicon.ico` at all.

Measured in real Chromium on 2026-08-20: **zero** `/favicon.ico` requests
on any page load, and `GET /favicon.ico` itself returns **200** with the
canonical SVG bytes.

## Source checks on the current head (d0daea9)

1. `npm run check` passes (exit 0, "TinyStudio.io checks passed."). The
   "Favicon (dogfood)" guard (`scripts/check-site.mjs` lines 1455-1499)
   verifies on all seven pages — homepage, audit, desk (`agents`), pricing,
   specimen, brief-requested, and the retired agent-desk — that exactly one
   `<link rel="icon">` appears in the head and its `href` is `/favicon.svg`;
   that `public/favicon.svg` is a valid SVG (`<svg` opening tag), tracked by
   git, and still allow-listed by the worker (`src/worker.js`
   `"/favicon.svg"`). The `/favicon.ico` guard (lines 1501-1518) verifies
   the worker allow-lists `"/favicon.ico"` and overrides the served
   Content-Type to `image/x-icon`.
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   first-viewport-audience, narrow-viewport-pages and narrow-viewport
   suites — all green, zero failures.

### Drift check since the last receipt (2026-08-17, head 5ca6241)

Between the 2026-08-17 `/favicon.ico` fix (`5ca6241`, PR #238) and this
head (d0daea9), no favicon-related line changed anywhere in the repo:
`git diff 5ca6241..HEAD` over `public/`, `scripts/check-site.mjs`, and
`src/worker.js` contains **zero** additions or deletions matching
`rel="icon"` or `favicon` (the intervening commits touched study figures,
the intake cap, entity/offer evidence, and unrelated guards). The source
guard and the live measurement below re-confirm the guarantee on the
deployed site.

## Live re-verification 2026-08-20

Real-browser measurement in headless Chromium (Playwright 1.62.1) against
the deployed `https://tinystudio.io`: load each page with `networkidle`,
record every request whose URL contains `/favicon.ico`, and assert exactly
one `link[rel="icon"]` in `document.head` with `href ===
"https://tinystudio.io/favicon.svg"`.

| Page | HTTP | rel=icon links | href | requests to /favicon.ico | other 4xx/5xx, page/console errors |
|---|---|---|---|---|---|
| `/` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/audit` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/agents` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/pricing` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/specimen` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/brief-requested` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |
| `/agent-desk` | 200 | 1 | `https://tinystudio.io/favicon.svg` | 0 | none |

Every page loaded 200 at its clean URL with zero page errors, zero console
errors, and zero 4xx/5xx responses on load; the served DOM of every page
carries exactly one `<link rel="icon" href="/favicon.svg"
type="image/svg+xml" />`; and the network log of every load contains **zero**
requests whose URL includes `/favicon.ico`.

Direct asset probes against the live worker:

```
GET https://tinystudio.io/favicon.svg → HTTP 200, content-type: image/svg+xml
GET https://tinystudio.io/favicon.ico → HTTP 200, content-type: image/x-icon,
     cache-control: public, max-age=31536000, immutable, body length 304
```

The served `/favicon.ico` body is byte-identical to the canonical
`public/favicon.svg` (SHA-256
`998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c` — same
digest as the 2026-08-17 receipt), proving the legacy path serves the real
asset, not a stub. The `/favicon.ico` 404 the item's symptom described can
no longer be produced by any user agent.

## Repro steps (drift detection)

1. Source guard: `npm run check` — the "Favicon (dogfood)" section fails if
   any of the seven pages loses its single `/favicon.svg` rel=icon link, if
   the asset is dropped, rewritten invalid, untracked, or removed from the
   worker allow-list; the `/favicon.ico` section fails if the worker drops
   the allow-list entry or the `image/x-icon` override.
2. Live browser probe: headless Chromium (Playwright 1.62.1) loads each of
   the seven public pages, waits for network idle, records every request
   whose URL contains `/favicon.ico`, and asserts exactly one
   `link[rel="icon"]` with `href === "https://tinystudio.io/favicon.svg"`
   — measured zero favicon.ico requests and one correct link on all seven
   pages, each returning HTTP 200 with no page or console errors.
3. Asset probes: `curl https://tinystudio.io/favicon.svg` → 200
   `image/svg+xml`; `curl https://tinystudio.io/favicon.ico` → 200
   `image/x-icon`, body matching `sha256sum public/favicon.svg`. A 404 on
   either means the deploy lost the allow-list or the fallback handler.

## Closeout

The item as stated — "No rel=icon link is served, so every page load fires a
404 /favicon.ico request while favicon.svg exists and is allow-listed" — is
**closed against current main and live**: the code-side fixes (PRs #85,
#113, and #238) are merged in `origin/main`, the CI guard in
`scripts/check-site.mjs` enforces the guarantee on all seven served pages,
`npm run check` and `npm test` pass on the current head (d0daea9), and the
deployed site serves exactly one `/favicon.svg` rel=icon link on every page
with zero `/favicon.ico` requests fired — while the legacy `/favicon.ico`
path itself now returns 200 with the canonical SVG bytes — as re-measured
in real Chromium on 2026-08-20. This receipt records the closeout on the
current head so the item cannot be re-opened by tracker drift.
