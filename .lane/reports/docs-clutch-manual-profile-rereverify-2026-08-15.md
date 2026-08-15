# Lane report: truthful manual Clutch profile handoff re-verify (2026-08-15)

Lane: tinystudio-io lane 1
Branch: `docs/clutch-manual-profile-rereverify-2026-08-15`
PR: https://github.com/nish3451/TinyStudio.io/pull/232
Item: 362bd79013 — "Prepare a truthful manual Clutch profile for the human-reviewed Website Appraisal" [research desk 2026-08-09]

## Outcome

Handoff re-verified against current `origin/main` (cdfa877) and the live site on 2026-08-15. Every field in the prepared Clutch profile table can still be filled truthfully from live first-party surfaces; nothing needs to move to the "Never on the profile" list; no reject condition is triggered. One truthfulness fix landed: the overview field's price-and-terms pointer now reads `tinystudio.io/pricing` (the site's own canonical pointer since c447585) instead of the legacy `pricing.html`. The human manual submission remains the open action — this lane records evidence only, it does not submit anything.

## What I did

1. **Published claims** to `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only the `claims` field, atomic temp-file+rename): `docs/service/clutch-manual-profile-2026-08-09.md`.
2. **Investigated** — the item is a recurring handoff: prepared 2026-08-09 (PR #49), re-verified 2026-08-11, 2026-08-12, and 2026-08-14 (PR #184). This lane follows the established periodic re-verify pattern.
3. **Diffed source since the last re-verify (5eefa80)**: 11 commits; only `public/llms.txt`, `public/offer.md` (buyer-URL cleanup to clean non-307 paths + domain-valuation boundary paragraph), `public/index.html` (matching q8 answer edit), and `public/index.css` (below-320px hero fix) changed. No identity/offer/contact/price/boundary string used by the profile changed.
4. **Live-checked** all five first-party surfaces: `/`, `/audit`, `/pricing`, `llms.txt`, `offer.md` — all 200 and byte-identical to committed source (no deployment lag). Verified verbatim: the offer, "reviewed by a person, not autonomous software", "month one corrects the costliest fault...", "Six appraisals a month, done by hand", "run by Nish, who signs every audit", "The site states no base city or office address", "clients are never named", `hello@tinystudio.io`, the price-and-terms pointer to `https://tinystudio.io/pricing`, the "$2,500 a month on a three-month minimum" price (4 occurrences, no hourly/project-size figure), audit q3/q6 location-and-clients answers, and the homepage "Where TinyStudio is based" disclosure.
5. **Clutch policy page re-fetched** (2026-08-15): still documents "Create a free company profile at clutch.co/get-listed", offerings "Basic, Verified, or Advertiser", the same profile fields, and the same review-and-publish flow. No paid placement required for Basic — no reject condition.
6. **Updated the handoff** to match the site's canonical price-and-terms pointer: overview field now says `tinystudio.io/pricing` (was `pricing.html`); the price-field source note and the post-table paragraph updated to match. Historical re-verify sections left untouched. Appended the 2026-08-15 re-verification section.
7. **No Clutch receipt** exists in the product state; receipt block remains unfilled; human submission is the open action.
8. **Ran the repo checks**: `npm run check` → "TinyStudio.io checks passed."; `npm test` → exit 0, 121 tests across 6 suites (headings 6/6, sitemap 7/7, worker 80/80, ui 16/16, contract 8/8, viewport 4/4) all green.

## Files changed

- `docs/service/clutch-manual-profile-2026-08-09.md` — appended the 2026-08-15 re-verification section and updated the three price-pointer references to the site's canonical `/pricing` (the lane's claimed file).
- `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-15.md` — this lane report.

## Verification evidence

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- `npm test` → exit 0; suites: headings 6/6, sitemap 7/7, worker 80/80, ui 16/16, contract 8/8, viewport 4/4 (121 total, 0 failed).
- Live curl diffs of all five surfaces vs committed source: zero differences.
- Clutch policy page fetch → HTTP 200, all required strings present.

## Closeout

PR opened at https://github.com/nish3451/TinyStudio.io/pull/232. Handoff ready for Nish's manual submission unchanged.
