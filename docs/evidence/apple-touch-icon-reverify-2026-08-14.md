# Apple touch icon on home — re-verify against current main and live

Date: 2026-08-14
Scope: the dogfood finding "Apple touch icon missing on home" (finding
98a7bf8e08fc, audit 20260808T074205Z-msk2fl3n). This receipt re-verifies the
finding's guarantee against the current `origin/main` head (f8e820e,
"docs(evidence): re-verify appraisal-page canonical/JSON-LD clean /audit
URL") and the live deployment of that head. It is source-evidence plus a
real-browser measurement of the deployed site.

## Summary

The failure mode the finding describes — the home page serving no
`<link rel="apple-touch-icon">`, leaving iOS Safari to derive a home-screen
icon from a screenshot — **no longer occurs, on source and on the live
site**. The code-side fix is already merged in `origin/main`: PR #30
(`b004c11`) added `<link rel="apple-touch-icon" href="/apple-touch-icon.png"
/>` to the head of the five public pages, and PR #123 (`dc1542a`) extended
the link to `/brief-requested` and added a CI guard in
`scripts/check-site.mjs` ("Apple touch icon (dogfood)" section) that
enforces the guarantee on **all seven** served pages. The guard fails the
build if any page loses, duplicates, or moves the link out of `<head>`, or
points it anywhere but `/apple-touch-icon.png`; it also refuses a
`public/apple-touch-icon.png` that is not a valid, git-tracked PNG and a
Worker whose asset allow-list no longer serves `/apple-touch-icon.png`.
Re-measured in real Chromium on 2026-08-14: every page, the home page
first, serves exactly one correct apple-touch-icon link, and the served icon
is byte-identical to the committed file.

## Source checks on the current head (f8e820e)

1. `npm run check` passes. The "Apple touch icon (dogfood)" guard
   (`scripts/check-site.mjs`) verifies on all seven pages — homepage, audit,
   desk (`agents`), pricing, specimen, brief-requested, and the retired
   agent-desk — that exactly one `<link rel="apple-touch-icon">` appears in
   the head and its `href` is `/apple-touch-icon.png`; that
   `public/apple-touch-icon.png` is a valid PNG (180x180, non-interlaced,
   2,232 bytes) tracked by git; and that the worker's public asset
   allow-list still serves `"/apple-touch-icon.png"` (`src/worker.js`).
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy (6/6), sitemap (7/7), agent-worker (76/76), agent-UI
   (16/16), product-contract, viewport, and narrow-viewport suites — all
   green, zero failures. (The only reported item is a pre-existing,
   out-of-scope note that `/` overflows at 240px; it does not gate the exit
   code and does not touch the apple-touch-icon guarantee.)

## Live re-verification 2026-08-14

Re-ran the deployed-site measurement in real Chromium (Playwright 1.62.1,
headless) against the live `https://tinystudio.io` — the current deployment
of the current main:

| Page | HTTP | CSP header | link in head | link in full doc | href | console/page errors |
|---|---|---|---|---|---|---|
| `/` (home) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/audit` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/agents` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/pricing` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/specimen` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/brief-requested` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |
| `/agent-desk` | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none |

Homepage head as served (the block the finding class flags, quoted verbatim):

> ```html
> <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
> ```

Direct asset probe:

- `GET https://tinystudio.io/apple-touch-icon.png` → 200,
  `content-type: image/png`, 2,232 bytes.
- Valid PNG (signature, 8-bit RGB, non-interlaced), 180x180 — the size iOS
  Safari requests for a home-screen icon.
- Byte-identical to the committed `public/apple-touch-icon.png` (SHA-256
  `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645`), so the
  served icon is exactly the file the source guard checks.

## Exact verification method (reproduce)

1. Source guard: `npm run check` — the "Apple touch icon (dogfood)" section
   fails if any of the seven pages loses its single `/apple-touch-icon.png`
   link, if the asset is dropped, rewritten invalid, untracked, or removed
   from the worker allow-list.
2. Live browser probe: headless Chromium (Playwright 1.62.1) loads each of
   the seven public pages at its final URL, waits for `domcontentloaded`,
   captures console/page errors, and asserts HTTP 200 with the CSP header,
   `document.head.querySelectorAll('link[rel="apple-touch-icon"]').length
   === 1`, `document.querySelectorAll(...).length === 1`, and the single
   `href` exactly `/apple-touch-icon.png` — all seven pages passed.
3. Asset probe: `curl -s -o /dev/null -w '%{http_code} %{content_type}'
   https://tinystudio.io/apple-touch-icon.png` → `200 image/png`; the bytes
   match the committed file exactly (SHA-256 above).

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check runs
manually, so a future deployment could still regress while CI stays green.
What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with PR #123), which fails `npm test` on
any page whose apple-touch-icon link is missing, duplicated, outside the
head, or pointed anywhere but `/apple-touch-icon.png`, and on any commit
that drops or corrupts `public/apple-touch-icon.png` or removes it from the
Worker allow-list. The served pages are the static files verbatim through
the Worker's ASSETS binding (`src/worker.js`), so the source guard and the
served bytes cannot drift unless the Worker's asset serving itself changes.
The measurement does not claim what iOS Safari will render on a specific
device (caches and platform rendering are out of scope); it verifies the
served HTML carries the link and the icon behind it exists, is reachable,
and is a valid 180x180 PNG.

## Closeout

The finding as stated — "Apple touch icon missing on home" — is **closed
against current main and live**: the code-side fix (PRs #30 and #123) is
merged in `origin/main`, the CI guard in `scripts/check-site.mjs` enforces
the guarantee on all seven served pages, `npm run check` and `npm test`
pass on the current head (f8e820e), and the deployed site serves exactly one
`/apple-touch-icon.png` apple-touch-icon link in the head of the home page
and of all six sibling pages — backed by an allow-listed, git-tracked, valid
180x180 PNG byte-identical to the committed file — as re-measured in real
Chromium on 2026-08-14. The receipt now records the closeout on the current
head so the finding cannot be re-opened by tracker drift.
