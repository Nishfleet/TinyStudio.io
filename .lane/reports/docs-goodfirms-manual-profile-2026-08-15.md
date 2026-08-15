# Lane report: truthful manual GoodFirms profile — prepared handoff (2026-08-15)

Lane: tinystudio-io lane 1
Branch: `docs/goodfirms-manual-profile-2026-08-15`
Item: 07d7a4fb59 — "Prepare a truthful manual GoodFirms profile for the
human-reviewed Website Appraisal" [research desk 2026-08-14, risk: green,
traction]

## Outcome

First capture of the GoodFirms handoff: `docs/service/goodfirms-manual-profile-2026-08-15.md`
is a prepared, copy-paste profile table plus a manual submission runbook for a
free GoodFirms listing, mirroring the established Clutch (PR #184) and G2
(PR #185) handoffs. Every field maps to a live first-party surface or stays
empty; every GoodFirms official page was re-fetched live on 2026-08-15; no
account was created and nothing was submitted. The human manual submission
remains the open action.

## What I did

1. **Published claims** to
   `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only
   the `claims` field, atomic temp-file+rename):
   `docs/service/goodfirms-manual-profile-2026-08-15.md`,
   `.lane/reports/docs-goodfirms-manual-profile-2026-08-15.md`.
2. **Investigated** — the item is a first capture (the growth-loop packet
   `goodfirms-manual-listing.md` is still in `packets/`, not `done/`; no
   GoodFirms profile file exists in `docs/service/`). The Clutch and G2
   handoffs (same lane, earlier dates) established the document shape.
3. **Verified the live product truth** — `curl` of `/`, `/audit`, `/pricing`,
   `llms.txt`, `offer.md` all HTTP 200 and byte-identical to the committed
   source on this head (no deployment lag). Verified verbatim: the offer, the
   human review boundary, "Six appraisals a month, done by hand", "run by
   Nish, who signs every audit", "The site states no base city or office
   address", "clients are never named", `hello@tinystudio.io`, the pricing
   pointer, and the homepage "Where TinyStudio is based" disclosure + "Request
   the appraisal" CTA. Also confirmed the site publishes **no** phone number,
   no year founded, no social-profile URLs, and no certification anywhere.
4. **Re-fetched every GoodFirms official page live (2026-08-15)** in a real
   browser session (plain curl is blocked with HTTP 403, documented in the
   improvement-loop journal): `goodfirms.co/get-listed` (Free plan "$0 /
   forever", "No card required · 23% acceptance rate", "4-Step Research
   Verification by the Goodfirms research team"), the four help articles
   (get-listed flow, free listing, 2-3 business day approval window, the full
   collected-field list), the auto-listing/claim article, and the terms of use
   (robots/scripts/crawling bar). No account was created; nothing was
   submitted.
5. **Prepared the handoff** — profile table with a source column per field,
   a "Never on the profile" list, the manual runbook, the receipt block, the
   packet's reject conditions (GoodFirms requires phone/location/year/employees
   it cannot supply → stop and report), rollback, and the non-claims section.
6. **Ran the repo checks**: `npm run check` and `npm test` (full suite) on
   this head.

## Files changed

- `docs/service/goodfirms-manual-profile-2026-08-15.md` — the prepared
  handoff (the lane's claimed file).
- `.lane/reports/docs-goodfirms-manual-profile-2026-08-15.md` — this lane
  report.

## Verification evidence

- Live curl diffs of all five surfaces vs committed source: zero differences.
- GoodFirms official pages fetched via real browser session 2026-08-15: all
  required strings present (quoted in the handoff's "Why this handoff
  exists").
- `npm run check` → "TinyStudio.io checks passed."; `npm test` → exit 0,
  117 tests across 6 suites all green.

## Closeout

PR opened at
https://github.com/nish3451/TinyStudio.io/pull/<number>. Handoff ready for
Nish's manual submission.
