# 004 - The Website Appraisal

Status: current — this plan describes the live offer on `tinystudio.io` and
the repository truth that guards it. It supersedes the historical specs
`001-public-buyer-page/` and `002-minimal-input-agent-desk/` and the earlier
campaign plan `003-wellness-clinic-launch/`, which remain as records.

## Goal

Keep the repository contract truthful about what the site actually sells
today: The Website Appraisal — the free leak audit of high-ticket service
homepages — and the human-reviewed desk that closes what the audit finds.
The retired self-serve Agent Desk stays documented as retired while its live
legacy mechanics keep working.

## What the offer is

- **The Website Appraisal:** a written report on one page of the buyer's
  choosing — each fault named, in order of what it costs, with the fix beside
  each. Reviewed by a person, not autonomous software. Free and yours to
  keep.
- **The human-reviewed desk:** the paid engagement that closes what the audit
  finds. Month one corrects the costliest fault; months two and three build
  the loop that keeps the standard up. Price and terms live on
  `pricing.html`.
- **Capacity:** six appraisals a month, done by hand. When the sixth is
  taken, intake closes until the next.
- **Buyer:** high-ticket service businesses — clinics, surgeons, dentists,
  spas, dealers, brokers. Clients are never named.
- **Promise boundary (unchanged):** no revenue, ranking, ROAS, conversion,
  booked-call, or sales-volume guarantees.

## What stays from the retired Agent Desk

- The retired Agent Desk surface (`public/agent-desk.html`) stays served at
  `/agent-desk` and `/agent-desk.html` so old deep links keep working, and
  its head declares itself retired with a `noindex` meta.
- The retired Agent Desk's legacy API mechanics remain live:
  `/api/agent-audit` (Pipeline Brief, Implementation Checklist, Weekly Fix
  Report), `/api/signups` email capture, and lightweight D1 usage metadata
  with daily rate-limit counters. `app.tinystudio.io` and `api.tinystudio.io`
  return intentional retirement responses.
- The retired Agent Desk's safety rails stand: human approval gates claims,
  ad spend, campaign publishing, platform connections, CRM outcome syncing,
  compliance-sensitive actions, and anything that would affect money or
  external accounts.

## Repository truth contract

- `README.md`, `MEMORY.md`, and `package.json` must name The Website
  Appraisal as the current product and never present the retired Agent Desk
  as current; every Agent Desk mention must carry a legacy/retired marker.
- Historical specs (`001/`, `002/`, `003/`) carry a `Status: historical`
  header so they cannot be mistaken for current instructions.
- `scripts/test-product-contract.mjs` enforces this contract in `npm test`.

## Verification

- `node --test scripts/test-product-contract.mjs` passes.
- `npm run check` and `npm test` pass.
- `git diff --check` passes.
