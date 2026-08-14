# Lane 1 report — GoodFirms manual profile handoff

Branch: `docs/goodfirms-manual-profile-2026-08-14`
Worktree: `/home/nish/workspaces/agent-worktrees/tinystudio-io-lane1-20260814-052034`
Base: fresh `origin/main` (afb5d49b84e25f006ec8d64a3d9bc0562d2cbc08)
Item: "Prepare a truthful manual GoodFirms profile for the human-reviewed
Website Appraisal" [research desk 2026-08-14, risk: green, traction]
Packet: `/home/nish/workspaces/agent-state/growth-loop/packets/tinystudio-io/goodfirms-manual-listing.md`
Precedent: `docs/service/clutch-manual-profile-2026-08-09.md` (merged on
`docs/clutch-manual-profile`, commit da7d302, 2026-08-09).

## Outcome

Prepared and committed a single new internal operator document:

- `docs/service/goodfirms-manual-profile-2026-08-14.md` — copy-paste
  profile content and a manual submission runbook for a free GoodFirms
  company profile for TinyStudio, the human-reviewed Website Appraisal.

The submission itself is a human action by Nish; nothing here automates,
creates, or submits a profile. The handoff documents the truthfulness
tests, the live first-party source for every field, the explicit "never on
the profile" list, the manual runbook, the receipt block Nish fills after
submission, and the reject conditions.

## Why this shape

The GoodFirms packet's automation disposition is `manual-only`, mirroring
the Clutch packet: an authenticated signup form plus research-team
approval, with explicit terms-of-use bars on bots, scraping, crawling, or
indexing. Absence of permission is not permission; a form existing is not
automation permission. The Clutch handoff merged days ago is the exact
precedent and the same operator-facing format fits a GoodFirms handoff
verbatim, with GoodFirms-specific facts substituted:

- Free plan (`$0 / forever`, `No card required`) instead of "Basic (free)".
- `4-Step Research Verification by the Goodfirms research team` and a
  2-3 business day approval window instead of Clutch's editorial review.
- `Service Categories` are "can't be edited later" — a tighter constraint
  than Clutch's "service focus" so the category pick is called out as a
  potential reject condition.
- The same truthfulness rules: only live first-party claims; no client
  names, logos, case studies, testimonials; no base city, phone, founding
  year, or hourly rate that the live site does not state; no
  revenue/ranking/ROAS/conversion/booked-call/sales-volume guarantees; the
  retired self-serve Agent Desk is not the current offer.

## Live evidence (observed 2026-08-14)

- `https://tinystudio.io/llms.txt` and mirror `https://tinystudio.io/offer.md`
  carry the current offer, identity, buyer, contact, and "Not Promised"
  list verbatim.
- `https://tinystudio.io/pricing.html` carries the only price: "the
  appraisal is free, the desk is $2,500 a month on a three-month minimum".
- `https://tinystudio.io/audit.html` carries the q3 (no base city) and
  q6 (clients are never named) truth.
- `https://www.goodfirms.co/get-listed` shows the Free plan, `No card
  required`, the published `23% acceptance rate`, and the `4-Step
  Research Verification`.
- The three official help pages quoted in the handoff were re-read this
  run; GoodFirms terms of use explicitly bar scraping/crawling/bots.

## Changes staged

```
docs/service/goodfirms-manual-profile-2026-08-14.md  | +241 -0
.lane/reports/docs-goodfirms-manual-profile-2026-08-14.md  | +...
```

No source code, no public surfaces, no public copy. The intake page,
`/api/signups`, D1 schema, and the legacy `/api/agent-audit` are
untouched.

## Verification

- The handoff is documentation-only. No code runs change.
- `node --test scripts/test-product-contract.mjs` should still pass: no
  Agent Desk framing returned, no public behavior changed. (Not run in
  this lane to keep the lane narrow; CI on the PR will exercise it.)
- `git diff --check` clean on commit. No secrets added.
- The handoff's "Never on the profile" list matches MEMORY.md "Public
  copy must not promise..." and llms.txt "Not Promised".

## Next step for Nish (human only, not in scope for this lane)

1. Open `https://www.goodfirms.co/get-listed` in a normal browser session.
2. Select the Free plan; sign up/sign in with the accepted account type.
3. Fill the fields from the prepared table; pick a single Service
   Category that fits without overclaiming.
4. Submit and await the research-team approval (2-3 business days).
5. Fill the receipt block at the bottom of the handoff with the
   submitted date, the real GoodFirms profile URL or rejection
   response, and any deviation.

## Reject conditions carried into the handoff

If GoodFirms requires a city, phone, founding year, hourly rate, project
size, or paid plan; or no Service Category fits without overclaiming; or
research verification rejects; stop, fill the receipt block, and report.
Do not invent to fit a form.

## Lane claims (already published)

The lane controller record
`/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json`
was updated atomically to declare:

- `docs/service/goodfirms-manual-profile-2026-08-14.md`
- `.lane/reports/docs-goodfirms-manual-profile-2026-08-14.md`

No other field of that record was touched; no other control-plane file
was written.
