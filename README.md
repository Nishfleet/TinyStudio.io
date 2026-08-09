# TinyStudio.io

TinyStudio's current product: **The Website Appraisal** — the free leak audit
of high-ticket service homepages — and the human-reviewed desk that closes
what the audit finds. The audit is free and yours to keep; the desk's price
and terms are on `/pricing`. Every audit carries a person's name. There are no
revenue, ranking, ROAS, conversion, booked-call, or sales-volume guarantees.

## Where the Plan Lives

- **Current plan:** `specs/004-website-appraisal/plan.md`.
- **Historical:** `specs/001-public-buyer-page/` and
  `specs/002-minimal-input-agent-desk/` describe the retired self-serve Agent
  Desk and are kept only as history.
- **Earlier campaign:** `specs/003-wellness-clinic-launch/` is an approved
  campaign plan that predates the Website Appraisal offer; it is not the
  current product plan.

## What This Repo Owns

- The public `tinystudio.io` site: the Website Appraisal surfaces (root and
  `/audit`), the human-reviewed desk page (`/agents`), `/pricing`,
  `/specimen`, and `/brief-requested`.
- Agent-readable public product truth at `/llms.txt` and `/offer.md`,
  including the preferred source page for every controlled AI-search
  question.
- Email capture through `/api/signups`, stored in Cloudflare D1.
- The intentional retirement responses for `app.tinystudio.io` and
  `api.tinystudio.io`.
- The legacy self-serve Agent Desk surface (`/agent-desk`, noindexed and
  framed as retired) and its still-live `/api/agent-audit` mechanism, which
  generates a one-shot Pipeline Brief, Implementation Checklist, and Weekly
  Fix Report from a minimal business snapshot. It is legacy, not the current
  offer; its safety rails stand: no campaign publishing, no ad spend changes,
  no ad account connection, no prospect message sending.
- Lightweight agent usage metadata in Cloudflare D1, including daily
  rate-limit counters, for the legacy mechanism.

## What This Repo Does Not Own

- Any live private TinyStudio app/API product.
- Client folders, analytics exports, payment data, private sprint work, or
  ad-platform credentials.
- Revenue claims, ROAS claims, booked-call claims, ranking claims, sales-lift
  promises, autonomous ad buying, ad spend changes, campaign publishing, or
  ad-platform write actions.
- Storage of submitted business snapshots, optional detail inputs, weekly
  metrics, or generated artifacts; the legacy Agent Desk processes context
  for the generated output and stores only email plus lightweight usage
  metadata.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

`npm test` includes `test:contract`, which fails if this file, `MEMORY.md`,
`package.json`, or the spec status markers drift from the current product
truth above. Deploys are guarded by the machine-level `safe-deploy` wrapper.
