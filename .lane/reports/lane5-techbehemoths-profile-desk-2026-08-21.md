# Lane 5 report: TechBehemoths manual profile handoff (2026-08-21)

Item: "Prepare a truthful manual TechBehemoths profile for the human-reviewed
Website Appraisal [research desk 2026-08-21]" (item_id 26056ec397).

## Outcome

Prepared, not already-resolved: no TechBehemoths content existed anywhere on
origin/main (grep for `techbehemoth` across the worktree: zero matches), and
no TechBehemoths receipt exists in the product state. So this lane produced
the first-capture handoff, mirroring the established Clutch / G2 / GoodFirms
pattern in `docs/service/`.

## Deliverable

- `docs/service/techbehemoths-manual-profile-2026-08-21.md` — prepared
  copy-paste profile content, field-by-field truthfulness map, manual-only
  submission runbook for Nish, receipt block, reject conditions, rollback.

## Sources used

- Growth packet: `/home/nish/workspaces/agent-state/growth-loop/packets/tinystudio-io/techbehemoths-manual-listing.md`
  (research-desk captures of techbehemoths.com FAQ/terms/about, fetched
  2026-08-21, same day as this lane).
- Live first-party surfaces, re-verified by this lane on 2026-08-21:
  - `https://tinystudio.io/llms.txt` and `/offer.md`: HTTP 200, byte-identical
    to committed source (curl diff: zero differences).
  - `https://tinystudio.io/pricing`: HTTP 200; "the appraisal is free, the
    desk is $2,500 a month on a three-month minimum" ×4; no hourly-rate /
    project-size / minimum-project strings anywhere.
  - `https://tinystudio.io/audit`: HTTP 200; q3 "The site does not state a
    base city or office address for TinyStudio"; q6 "no logos, no case
    studies, no testimonials, no 'as seen at'".
  - `public/index.html`: "Where TinyStudio is based" disclosure present.
  - Full public-surface scan: no `tel:`/phone string, no founded/est. year,
    no certif/accred string, no TinyStudio social-profile URLs (the
    instagram/linkedin/facebook matches in `public/audit.html` are cited
    sources about unrelated businesses inside the embedded AI-search evidence
    JSON).
- TechBehemoths direct re-fetch attempted by this lane: HTTP 403 (bot
  challenge) for both `/faq` and `/terms` — consistent with the manual-only
  disposition. Wayback availability API returned HTTP 429 (rate-limited)
  during the run; recorded honestly in the handoff's "does not claim"
  section. No bypass was attempted.

## Truthfulness guards carried into the handoff

- No price restated in profile copy; price-and-terms pointer to /pricing
  (repo convention from the Clutch/GoodFirms handoffs).
- No clients, location, phone, founded year, socials, certification, hourly
  rate, project size, or outcome guarantees.
- Conversion-optimization category allowed only if its definition does not
  promise lift (llms.txt q8 boundary: "not sold as a conversion audit
  service... promises no conversion lift").
- Retired Agent Desk never presented as current product.

## Verification

- `node scripts/check-site.mjs` and the full test suite: run after commit
  (docs-only change; results appended below if anything fails).
- No site/runtime files touched; claims published to
  `agent-state/lanes/tinystudio-io/lane-5.json` before editing:
  `docs/service/techbehemoths-manual-profile-2026-08-21.md`,
  `.lane/reports/lane5-techbehemoths-profile-desk-2026-08-21.md`.

## Not claimed

- Nothing predicts publication, visibility, traffic, leads, or revenue.
- The 2026-08-21 no-profile baseline is a baseline, not proof of
  non-existence; runbook step 1 re-checks before registering.
