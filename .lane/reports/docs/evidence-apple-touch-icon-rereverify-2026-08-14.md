# Lane report — tinystudio-io lane 1 (docs/evidence-apple-touch-icon-rereverify-2026-08-14)

## Item

- [ ] [dogfood 98a7bf8e08fc] Apple touch icon missing on home [dogfood 20260808T074205Z-msk2fl3n] [authorized-by-nish 20...

## Outcome: already fixed and deployed; re-verified and closed out

The requested change is already on `origin/main`: PR #30 (`b004c11`) added
`<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` to the head of
the five public pages, and PR #123 (`dc1542a`) extended it to
`/brief-requested` and added a CI guard in `scripts/check-site.mjs`
("Apple touch icon (dogfood)" section) covering all seven served pages.

This lane's work was to re-verify the finding against current main and live
and record the closeout, resolving the tracker item.

Evidence: `docs/evidence/apple-touch-icon-reverify-2026-08-14.md`.

## Verification performed

1. Source: `npm run check` passes — the apple-touch-icon guard verifies
   exactly one `/apple-touch-icon.png` link in the head of all seven pages
   (homepage, audit, agents/desk, pricing, specimen, brief-requested,
   agent-desk), a valid git-tracked 180x180 PNG, and the worker allow-list
   entry.
2. `npm test` passes (exit 0): heading-hierarchy 6/6, sitemap 7/7,
   agent-worker 76/76, agent-UI 16/16, plus contract/viewport/narrow-viewport
   suites — zero failures.
3. Live, in real Chromium (Playwright 1.62.1, headless) on 2026-08-14:
   all seven pages serve HTTP 200 with CSP header, exactly one
   `link[rel="apple-touch-icon"]` in head and full doc, href exactly
   `/apple-touch-icon.png`, zero console/page errors. The home page — the
   finding's scope — serves the link verbatim:
   `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`.
4. Asset: `https://tinystudio.io/apple-touch-icon.png` → 200 `image/png`,
   2232 bytes, valid 180x180 non-interlaced PNG, byte-identical to committed
   `public/apple-touch-icon.png` (SHA-256
   `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645`).

## Deliverables

- Branch `docs/evidence-apple-touch-icon-rereverify-2026-08-14` pushed to
  origin (commit `6d33b06`).
- PR #177 opened: https://github.com/nish3451/TinyStudio.io/pull/177
- Files changed: `docs/evidence/apple-touch-icon-reverify-2026-08-14.md`
  (new evidence receipt; no source change needed — fix already merged).
