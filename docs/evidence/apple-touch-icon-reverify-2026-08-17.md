# Apple touch icon on home — re-verify against current main and live

Date: 2026-08-17
Scope: the dogfood finding "Apple touch icon missing on home" (finding
98a7bf8e08fc, audit 20260808T074205Z-msk2fl3n). This receipt re-verifies the
finding's guarantee against the current `origin/main` head (7d3a8ae,
"docs(evidence): re-verify render-blocking finding b8f6046e942a against
current main and live (2026-08-17) (#234)") and the live deployment of that
head. It is source-evidence plus a real measurement of the deployed site.

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
Re-measured on 2026-08-17: every page, the home page first, serves exactly
one correct apple-touch-icon link, and the served icon is byte-identical to
the committed file.

## Source checks on the current head (7d3a8ae)

1. `npm run check` passes. The "Apple touch icon (dogfood)" guard
   (`scripts/check-site.mjs`) verifies on all seven pages — homepage, audit,
   desk (`agents`), pricing, specimen, brief-requested, and the retired
   agent-desk — that exactly one `<link rel="apple-touch-icon">` appears in
   the head and its `href` is `/apple-touch-icon.png`; that
   `public/apple-touch-icon.png` is a valid PNG (180x180, non-interlaced,
   2,232 bytes) tracked by git; and that the worker's public asset
   allow-list still serves `"/apple-touch-icon.png"` (`src/worker.js`, line
   62).
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   viewport, and narrow-viewport suites — all green, zero failures.

### Drift check since the last receipt (e35b4bf, 2026-08-15)

Between the last verification and this head, the icon-adjacent files
changed only in ways that leave the guarantee intact:

- `public/index.html`: body form only — the appraisal email input gained
  `autocomplete="email"` (PR #213). The head still carries exactly one
  `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` at line 9.
- `public/audit.html` and `public/agent-desk.html`: canonical/og:url edits
  for the retired desk (PR #229); no icon-adjacent change.
- `scripts/check-site.mjs`: gained a retired-desk canonical/og:url guard
  (PR #229); the "Apple touch icon (dogfood)" guard section is unchanged.
- `src/worker.js`: unchanged since the last receipt (the
  `"/apple-touch-icon.png"` allow-list entry remains).
- `public/apple-touch-icon.png`: unchanged (same SHA-256).

## Live re-verification 2026-08-17

Measured the deployed site at `https://tinystudio.io` — the current
deployment of the current main:

| Check | Result |
|---|---|
| `GET /` contains `rel="apple-touch-icon" href="/apple-touch-icon.png"` | yes, exactly once in head |
| All seven served pages carry exactly one apple-touch-icon link | `/`, `/audit`, `/pricing`, `/agents`, `/specimen`, `/brief-requested`, `/agent-desk` — each 1 |
| `GET /apple-touch-icon.png` | 200, `content-type: image/png`, 2,232 bytes |
| Served icon SHA-256 | `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645` |
| Committed icon SHA-256 | `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645` |

The served icon is byte-identical to the committed file.

## Exact verification method (reproduce)

1. Source guard: `npm run check` — the "Apple touch icon (dogfood)" section
   fails if any of the seven pages loses its single `/apple-touch-icon.png`
   link, if the asset is dropped, rewritten invalid, untracked, or removed
   from the worker allow-list.
2. Full suite: `npm test` — all suites pass (exit 0).
3. Live probe: `curl -s https://tinystudio.io/` and grep for the
   apple-touch-icon link; `curl -s -o /dev/null -w '%{http_code}
   %{content_type} %{size_download}' https://tinystudio.io/apple-touch-icon.png`
   → `200 image/png 2232`; `curl -s ... | sha256sum` compared against
   `sha256sum public/apple-touch-icon.png`.

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
pass on the current head (7d3a8ae), and the deployed site serves exactly one
`/apple-touch-icon.png` apple-touch-icon link in the head of the home page
and of all six sibling pages — backed by an allow-listed, git-tracked, valid
180x180 PNG byte-identical to the committed file — as re-measured on
2026-08-17. The receipt records the closeout on the current head so the
finding cannot be re-opened by tracker drift.