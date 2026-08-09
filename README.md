# TinyStudio.io

The Website Appraisal — the free leak audit of high-ticket service homepages — and the human-reviewed desk that closes what the audit finds.

## What This Repo Owns

- The public `tinystudio.io` and `www.tinystudio.io` Website Appraisal site: homepage, appraisal page, desk page, pricing, specimen, and the agent-readable product truth at `/llms.txt` and `/offer.md`.
- The human-reviewed desk: automation prepares research, drafts, QA, packages, and routing, but a person reviews fit, claims, client-facing work, delivery/acceptance, and renewal before anything ships.
- Email capture through `/api/signups`, stored in Cloudflare D1.
- The legacy Agent Desk implementation context: `/agent-desk` (retired surface, noindexed) and `/api/agent-audit` (still live) keep their mechanics and safety rails; the Agent Desk is not the current offer.
- Lightweight usage metadata in Cloudflare D1, including daily rate-limit counters.
- The intentional retirement responses for `app.tinystudio.io` and `api.tinystudio.io`.

## What This Repo Does Not Own

- Any live private TinyStudio app/API product.
- Client folders, analytics exports, payment data, private sprint work, or ad-platform credentials.
- Revenue claims, ROAS claims, booked-call claims, ranking claims, sales-lift promises, autonomous ad buying, ad spend changes, campaign publishing, or ad-platform write actions.
- Storage of submitted business context, weekly metrics, or generated artifacts; submitted context is processed for the output and is not stored. Only email plus lightweight usage metadata are kept.

## Current Plan

- The current plan is `specs/004-website-appraisal/plan.md`.
- `specs/001-public-buyer-page/` and `specs/002-minimal-input-agent-desk/` are completed historical Agent Desk work, kept for history and visibly superseded.
- `specs/003-wellness-clinic-launch/` is the earlier approved campaign plan, superseded as the current plan; the desk terms it specifies remain the desk's terms on pricing.html.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

Deploys are guarded by the machine-level `safe-deploy` wrapper.
