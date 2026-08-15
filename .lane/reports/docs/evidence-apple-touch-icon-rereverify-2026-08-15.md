# Lane report — tinystudio-io lane 1 (docs/evidence-apple-touch-icon-rereverify-2026-08-15)

## Item

- [ ] [dogfood 98a7bf8e08fc] Apple touch icon missing on home [dogfood 20260808T074205Z-msk2fl3n] [authorized-by-nish 20...

## Outcome: already fixed and deployed; re-verified and closed out

The requested change is already on `origin/main`: PR #30 (`b004c11`) added
`<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` to the head of
the five public pages, and PR #123 (`dc1542a`) extended it to
`/brief-requested` and added a CI guard in `scripts/check-site.mjs`
("Apple touch icon (dogfood)" section) covering all seven served pages.

This lane's work was to re-verify the finding against current main and live
and record the closeout on the current head, resolving the tracker item.

Evidence: `docs/evidence/apple-touch-icon-reverify-2026-08-15.md`.

## Verification performed

1. Source: `npm run check` passes — the apple-touch-icon guard verifies
   exactly one `/apple-touch-icon.png` link in the head of all seven pages
   (homepage, audit, agents/desk, pricing, specimen, brief-requested,
   agent-desk), a valid git-tracked 180x180 PNG, and the worker allow-list
   entry.
2. `npm test` passes (exit 0): heading-hierarchy, sitemap, agent-worker,
   agent-UI, plus contract/viewport/narrow-viewport suites — zero failures.
3. Drift check vs last receipt (f8e820e, 2026-08-14): `public/index.html`
   changed only in body copy; the head link at line 10 is untouched; the
   guard section in `scripts/check-site.mjs` is unchanged; `src/worker.js`
   gained a www canonical-host redirect (PR #181) but the
   `"/apple-touch-icon.png"` allow-list entry remains (line 62);
   `public/apple-touch-icon.png` unchanged.
4. Live, 2026-08-15: `GET https://tinystudio.io/` serves exactly one
   `rel="apple-touch-icon" href="/apple-touch-icon.png"` in the head;
   `GET https://tinystudio.io/apple-touch-icon.png` → 200 `image/png`,
   2232 bytes, SHA-256
   `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645` —
   byte-identical to committed `public/apple-touch-icon.png`.

## Deliverables

- Branch `docs/evidence-apple-touch-icon-rereverify-2026-08-15` pushed to
  origin (commit `de7e6ef`).
- PR opened: https://github.com/nish3451/TinyStudio.io/pull/ (see PR)
- Files changed: `docs/evidence/apple-touch-icon-reverify-2026-08-15.md`
  (new evidence receipt; no source change needed — fix already merged).
