# Lane report: truthful manual G2 service profile handoff re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `docs/g2-service-profile-rereverify-2026-08-14`
PR: https://github.com/nish3451/TinyStudio.io/pull/185
Item: a19ade7a78 — "Prepare a truthful manual G2 service profile for the Website Appraisal" [research desk 2026-08-09]

## Outcome

Handoff re-verified unchanged against current `origin/main` (e9fc96a) and the live site on 2026-08-14. Every field in the prepared G2 profile table can still be filled truthfully from live first-party surfaces; nothing needs to move to the "Never on the profile" list; no reject condition is triggered. The human manual submission remains the open action — this lane records evidence only, it does not submit anything.

## What I did

1. **Published claims** to `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only the `claims` field, atomic temp-file+rename): `docs/service/g2-service-profile-2026-08-09.md`, `.lane/reports/docs-g2-service-profile-rereverify-2026-08-14.md`.
2. **Investigated** — the item is a recurring handoff: prepared 2026-08-09, re-verified 2026-08-11 and 2026-08-12. The packet moved to `growth-loop/packets/tinystudio-io/done/`. This lane follows the established periodic re-verify pattern, mirroring the Clutch profile re-verify that landed today (daa5689).
3. **Diffed source since the last re-verify (18128e8, measured by 0b5e40d)**: 62 commits; `public/llms.txt`, `public/offer.md`, `public/pricing.html` unchanged; only `public/audit.html` (AI-search evidence re-run dated 2026-08-09 + in-content CTA band with no-guarantees note) and `public/index.html` (buyer naming in hero + signup rejection signal) changed.
4. **Live-checked** all five first-party surfaces: `/`, `/audit`, `/pricing`, `llms.txt`, `offer.md` — all 200 and byte-identical to committed source (no deployment lag). Verified verbatim: the offer, "reviewed by a person, not autonomous software", "month one corrects the costliest fault...", "Six appraisals a month, done by hand", "run by Nish, who signs every audit", "The site states no base city or office address", "clients are never named", `hello@tinystudio.io`, the pricing pointer, the "$2,500 a month on a three-month minimum" price (4 occurrences, no hourly/project-size figure), audit q3/q6 location-and-clients answers, and the homepage "Where TinyStudio is based" disclosure + "Request the appraisal" CTA.
5. **G2 policy pages re-fetched** (2026-08-14): `sell.g2.com/create-a-profile` still documents conditional approval, research-team verification "in about 3-5 business days", live-and-ready-to-claim, claim review "within 1-3 business days", and "claim your profile for free", linking to `g2.com/products/new`; `g2digitalmarkets.com/listing-guidelines` (still "Last updated on May 4, 2026") still requires public availability + CTA, excludes custom/bespoke software, requires the listing under the service name on the vendor's website, and carries all copy rules (no first person, no CTA, no phone/email/URL, no superlatives, no suffixes, content-team discretion); `research.g2.com/methodology/research-faq` still says one profile per vendor and advises checking "already listed on G2 under a different name". No reject condition.
6. **No G2 receipt** exists in the product state; receipt block remains unfilled; human submission is the open action.
7. **Ran the repo checks**: `npm run check` → "TinyStudio.io checks passed."; `npm test` → exit 0, 117 tests across 6 suites all green (only pre-existing out-of-scope note: `/` overflows at 240px, unrelated).

## Files changed

- `docs/service/g2-service-profile-2026-08-09.md` — appended the 2026-08-14 re-verification section (the lane's claimed file).
- `.lane/reports/docs-g2-service-profile-rereverify-2026-08-14.md` — this lane report.

## Verification evidence

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- `npm test` → exit 0; suites: headings 6/6, sitemap 7/7, worker 76/76, ui 16/16, contract 8/8, viewport 4/4 (117 total, 0 failed).
- Live curl diffs of all five surfaces vs committed source: zero differences.
- G2 policy pages fetched → HTTP 200, all required strings present.

## Closeout

PR opened at https://github.com/nish3451/TinyStudio.io/pull/185. Handoff ready for Nish's manual submission unchanged.
