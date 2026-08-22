# Lane report: truthful manual Clutch profile handoff re-verify (2026-08-22)

Branch: `lane1/clutch-profile-manual-desk`

Item: 362bd79013 — "Prepare a truthful manual Clutch profile for the human-reviewed Website Appraisal" [research desk 2026-08-09]

Handoff re-verified against current `origin/main` (ed69cab) and the live site on 2026-08-22. Every field in the prepared Clutch profile table can still be filled truthfully from live first-party surfaces; nothing needs to move to the "Never on the profile" list; no reject condition is triggered. No value in the table needed to change this lane — the canonical-pointer rewrite that landed since d0daea9 brings llms.txt/offer.md into exact agreement with the pointer the handoff already uses (`https://tinystudio.io/pricing`). The human manual submission remains the open action — this lane records evidence only, it does not submit anything.

## What was done

1. **Published claims** to `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only the `claims` field, atomic temp-file+rename): `docs/service/clutch-manual-profile-2026-08-09.md`, `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-22.md`.
2. **Investigated** — the item is a recurring handoff: prepared 2026-08-09 (PR #87), re-verified 2026-08-11, 2026-08-12 (#134), 2026-08-14, 2026-08-15 (#232), and 2026-08-20 (#252, merged 2026-08-21). Not resolved: acceptance requires a real Clutch receipt and none exists. Followed the established periodic re-verify pattern.
3. **Diffed main since last measurement head** (d0daea9 → ed69cab, 138 commits): public-surface changes are the llms.txt/offer.md price-and-terms pointer rewritten to the full `https://tinystudio.io/pricing` URL, a new "Pages" index section, the new `msp-buyer-intent` question mapping, and the audit.html embedded AI-search evidence refreshed to its 2026-08-20 run. No identity, offer, contact, price, or boundary string changed.
4. **Live checks** — llms.txt and offer.md byte-identical to source (both 200); `/pricing` clean URL 200 (`pricing.html` 307s to it) with "$2,500 a month on a three-month minimum" ×4 and zero hourly-rate/project-size figures; `/audit` keeps q3 no-base-city and q6 no-client-work truths; `/` carries the where-based disclosure; new `/msp` page live (200) extends the same offer to MSP/IT buyers without changing any profile value.
5. **Clutch policy page re-fetched** (2026-08-22): HTTP 200, still documents "Create a free company profile at clutch.co/get-listed", offerings "Basic, Verified, or Advertiser", sign-in with LinkedIn/Google/company email, the same profile fields, and the review-and-publish flow. No paid placement required for Basic — no reject condition.
6. **No Clutch receipt** exists in the product state; receipt block remains unfilled; human submission is the open action. External search baseline not re-run (scripted queries blocked from the VPS in prior lanes); the 2026-08-09 baseline stands with its caveat.
7. **Repository checks**: `node scripts/check-site.mjs` passes ("TinyStudio.io checks passed"). Test suite: 127 of 128 green. The single failure is `scripts/test-study-freshness.mjs`, a time-decay guard failing on main itself (newest snapshot 2026-08-17 is four days old against today's max-age-4 rule) — pre-existing, unrelated to this docs-only change, untouched by this branch, and recorded honestly in the appended section rather than claimed as an all-green suite.

## Files

- `docs/service/clutch-manual-profile-2026-08-09.md` — appended the 2026-08-22 re-verification section (the lane's claimed file). No table value needed changing.
- `.lane/reports/docs-clutch-manual-profile-rereverify-2026-08-22.md` — this lane report.

## Verification evidence

- curl byte-diffs: llms.txt, offer.md → zero differences vs source.
- Clutch policy fetch → HTTP 200, all required strings present.
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed".
- Commit pushed: `017c470`; PR opened from `lane1/clutch-profile-manual-desk`.

## Outcome

Same result as the preparation and all five prior re-verifications: every field can still be filled truthfully, nothing moves to "Never on the profile", no reject condition triggered. The handoff stays ready for Nish's manual submission unchanged; the item must NOT be retired until a real receipt exists.
