# Lane 1 report: tinystudio-io — 50Pros manual agency profile handoff

Branch: `docs/50pros-manual-profile-2026-08-20`
Item: "Prepare a truthful manual 50Pros agency profile for the human-reviewed Website Appraisal [research desk 2026-08-20"

## What this lane did

Prepared the truthful manual 50Pros agency profile handoff at
`docs/service/50pros-manual-profile-2026-08-20.md`, following the established
pattern of the Clutch, G2, and GoodFirms handoffs in `docs/service/`.

## Evidence

- Re-verified live first-party surfaces: `https://tinystudio.io/llms.txt`,
  `offer.md`, `/pricing`, `/` (HTTP 200, offer copy verbatim).
- Re-verified 50Pros official guidance live in a real browser session
  (scripted fetches are blocked and prohibited by Terms Section 8):
  - `https://www.50pros.com/support/getting-listed` — 11-step onboarding
    wizard field list, approval flow, $350 optional verification,
    completeness weights (14 fields), claim-a-profile flow.
  - `https://www.50pros.com/terms` Section 5 (Agency Listings & Verification)
    and Section 8 (Prohibited Conduct: no scraping).
- Packet canonical claims applied; no invented fields; no paid upgrades.

## Claims published

- `docs/service/50pros-manual-profile-2026-08-20.md`
- `.lane/reports/docs-50pros-manual-profile-2026-08-20.md`

## Repository checks

`npm run check` / `npm test` were run on the branch and pass (see PR).
