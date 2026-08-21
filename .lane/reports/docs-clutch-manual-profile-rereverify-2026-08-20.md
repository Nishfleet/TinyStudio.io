# Lane report: truthful manual Clutch profile handoff re-verify (2026-08-20)

Lane: tinystudio-io lane 1
Branch: `docs/clutch-manual-profile-rereverify-2026-08-20`
Item: 362bd79013 — "Prepare a truthful manual Clutch profile for the human-reviewed Website Appraisal" [research desk 2026-08-09]

## Outcome

Handoff re-verified against current `origin/main` (d0daea9) and the live site on 2026-08-20. Every field in the prepared Clutch profile table can still be filled truthfully from live first-party surfaces; nothing needs to move to the "Never on the profile" list; no reject condition is triggered. No truthfulness fix was needed this lane — the 2026-08-15 pointer correction to `tinystudio.io/pricing` still matches the site's own canonical pointer. The human manual submission remains the open action — this lane records evidence only, it does not submit anything.

## What I did

1. **Published claims** to `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only the `claims` field, atomic temp-file+rename): `docs/service/clutch-manual-profile-2026-08-09.md`, `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-20.md`.
2. **Investigated** — the item is a recurring handoff: prepared 2026-08-09 (PR #49), re-verified 2026-08-11 (PR #134), 2026-08-12, 2026-08-14 (PR #184), and 2026-08-15 (PR #232). This lane follows the established periodic re-verify pattern.
3. **Diffed source since the last re-verify (cdfa877)**: 24 commits; the ones that touched public surfaces are 76fe17b (Request-the-appraisal signup form on /pricing), ed2b1a9 (clean-URL canonicals and JSON-LD @ids on /pricing and /audit), 23a7f06 (TinyStudio-branded footer text), 66f7bd6 (persistent programmatic labels on intake fields), 43cc831 (study figures refreshed to the 2026-08-12 scan), dda25f2 (truthful closed-intake response when the six-a-month cap is hit), and 9f79c71 (redirecting-spelling guard in check-site). `git diff cdfa877..origin/main -- public/llms.txt public/offer.md public/pricing.html public/audit.html public/index.html` shows no change to any identity, offer, contact, price, or boundary string this profile uses.
4. **Live-checked** all five first-party surfaces: `/`, `/audit`, `/pricing`, `llms.txt`, `offer.md` — all 200. The committed source carries every claim the profile depends on verbatim; the served bytes trail the committed source on a handful of cosmetic lines (study numbers, intake-form label markup, clean-URL canonical rewrites) that do not affect any value in the table. Verified verbatim: the offer, "reviewed by a person, not autonomous software", "month one corrects the costliest fault...", "Six appraisals a month, done by hand", "run by Nish, who signs every audit", "The site states no base city or office address", "clients are never named", `hello@tinystudio.io`, the price-and-terms pointer to `https://tinystudio.io/pricing`, the "$2,500 a month on a three-month minimum" price (4 occurrences, no hourly/project-size figure), audit q3/q6 location-and-clients answers, and the homepage "Where TinyStudio is based" disclosure.
5. **Clutch policy page re-fetched** (2026-08-20): still documents "Create a free company profile at clutch.co/get-listed", offerings "Basic, Verified, or Advertiser", the same profile fields, and the same review-and-publish flow. No paid placement required for Basic — no reject condition.
6. **No Clutch receipt** exists in the product state; receipt block remains unfilled; human submission is the open action.
7. **Ran the repo checks**: `node scripts/check-site.mjs` → "TinyStudio.io checks passed."; `node --test scripts/test-*.mjs` → exit 0, 128 tests across 9 suites (headings, sitemap, worker, ui, contract, study, viewport, narrow-pages, narrow) all green.

## Files changed

- `docs/service/clutch-manual-profile-2026-08-09.md` — appended the 2026-08-20 re-verification section (the lane's claimed file). The 2026-08-15 price-pointer correction was left intact; no value in the table above needed to change.
- `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-20.md` — this lane report.

## Verification evidence

- `node scripts/check-site.mjs` → exit 0, "TinyStudio.io checks passed."
- `node --test scripts/test-*.mjs` → exit 0; 128 tests across 9 suites all green.
- Live curl diffs of all five first-party surfaces vs committed source: zero differences on `llms.txt` and `offer.md`; cosmetic diffs on `/`, `/audit`, and `/pricing` (study numbers, intake-form label markup, clean-URL canonical rewrites) that do not touch any claim this profile depends on.
- Clutch policy page fetch → HTTP 200, all required strings present.

## Closeout

PR will be opened against origin/main carrying the 2026-08-20 re-verification section. Handoff ready for Nish's manual submission unchanged.
