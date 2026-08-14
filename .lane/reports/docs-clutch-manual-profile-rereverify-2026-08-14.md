# Lane report: truthful manual Clutch profile handoff re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `docs/clutch-manual-profile-rereverify-2026-08-14`
PR: https://github.com/nish3451/TinyStudio.io/pull/184
Item: 362bd79013 — "Prepare a truthful manual Clutch profile for the human-reviewed Website Appraisal" [research desk 2026-08-09]

## Outcome

Handoff re-verified unchanged against current `origin/main` (e9fc96a) and the live site on 2026-08-14. Every field in the prepared Clutch profile table can still be filled truthfully from live first-party surfaces; nothing needs to move to the "Never on the profile" list; no reject condition is triggered. The human manual submission remains the open action — this lane records evidence only, it does not submit anything.

## What I did

1. **Published claims** to `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only the `claims` field, atomic temp-file+rename): `docs/service/clutch-manual-profile-2026-08-09.md`.
2. **Investigated** — the item is a recurring handoff: prepared 2026-08-09 (PR #49), re-verified 2026-08-11 (PR #134) and 2026-08-12. The packet moved to `growth-loop/packets/tinystudio-io/done/`. This lane follows the established periodic re-verify pattern.
3. **Diffed source since the last re-verify (18128e8)**: 62 commits; `public/llms.txt`, `public/offer.md`, `public/pricing.html` unchanged; only `public/audit.html` (AI-search evidence re-run dated 2026-08-09 + in-content CTA band with no-guarantees note) and `public/index.html` (buyer naming in hero + signup rejection signal) changed.
4. **Live-checked** all five first-party surfaces: `/`, `/audit`, `/pricing`, `llms.txt`, `offer.md` — all 200 and byte-identical to committed source (no deployment lag). Verified verbatim: the offer, "reviewed by a person, not autonomous software", "month one corrects the costliest fault...", "Six appraisals a month, done by hand", "run by Nish, who signs every audit", "The site states no base city or office address", "clients are never named", `hello@tinystudio.io`, the pricing pointer, the "$2,500 a month on a three-month minimum" price (4 occurrences, no hourly/project-size figure), audit q3/q6 location-and-clients answers, and the homepage "Where TinyStudio is based" disclosure.
5. **Clutch policy page re-fetched** (2026-08-14): still documents "Create a free company profile at clutch.co/get-listed", offerings "Basic, Verified, or Advertiser", the same profile fields, and the same review-and-publish flow. No paid placement required for Basic — no reject condition.
6. **No Clutch receipt** exists in the product state; receipt block remains unfilled; human submission is the open action.
7. **Ran the repo checks**: `npm run check` → "TinyStudio.io checks passed."; `npm test` → exit 0, 117 tests across 6 suites all green (only pre-existing out-of-scope note: `/` overflows at 240px, unrelated).

## Files changed

- `docs/service/clutch-manual-profile-2026-08-09.md` — appended the 2026-08-14 re-verification section (the lane's claimed file).
- `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-14.md` — this lane report.

## Verification evidence

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- `npm test` → exit 0; suites: headings 6/6, sitemap 7/7, worker 76/76, ui 16/16, contract 8/8, viewport 4/4 (117 total, 0 failed).
- Live curl diffs of all five surfaces vs committed source: zero differences.
- Clutch policy page fetch → HTTP 200, all required strings present.

## Closeout

PR opened at https://github.com/nish3451/TinyStudio.io/pull/184. Handoff ready for Nish's manual submission unchanged.
