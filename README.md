# TinyStudio.io

TinyStudio's public site contract: the free Website Appraisal leak audit of
high-ticket service homepages, and the human-reviewed desk that closes what
the audit finds. The retired self-serve Agent Desk is legacy only — its
mechanics stay served for old deep links, but nothing here sells it.

## What This Repo Owns

- The public `tinystudio.io` and `www.tinystudio.io` Website Appraisal site:
  root, `/audit`, `/pricing`, `/agents`, `/specimen`, and `/brief-requested`.
- Agent-readable current-offer truth at `/llms.txt` and `/offer.md`.
- The Website Appraisal contract: a free, written leak audit on one page of
  your choosing — each fault named in order of what it costs you, with the
  fix beside each — done by hand, six a month, with a human-reviewed desk
  that closes the findings (month one corrects the costliest fault; months
  two and three build the loop). Price and terms live on `pricing.html`.
- The retired Agent Desk's legacy mechanics, still served for old deep links:
  - `public/agent-desk.html` at `/agent-desk` (noindex, framed as retired).
  - Cloudflare Workers AI generation through `/api/agent-audit` for the old
    Pipeline Brief, Implementation Checklist, and Weekly Fix Report outputs.
  - Email capture through `/api/signups`, stored in Cloudflare D1.
  - Lightweight usage metadata in Cloudflare D1, including daily rate-limit
    counters.
  - The intentional retirement responses for `app.tinystudio.io` and
    `api.tinystudio.io`.
- The legacy safety rails that stay live with the Desk: no campaign
  publishing, no ad spend changes, no ad account connection, no prospect
  message sending, and client-side code never calls model providers, platform
  admin APIs, databases, or private credentials directly.

## What This Repo Does Not Own

- The Website Appraisal's price or terms — those live on `pricing.html`, and
  this repo must not invent performance, price, or legal claims.
- Any live private TinyStudio app/API product.
- Client folders, analytics exports, payment data, private sprint work, or
  ad-platform credentials.
- Revenue claims, ROAS claims, booked-call claims, ranking claims,
  sales-lift promises, autonomous ad buying, ad spend changes, campaign
  publishing, or ad-platform write actions.
- Storage of submitted business snapshots, optional detail inputs, weekly
  metrics, or generated artifacts: the legacy Desk processes context for the
  generated output and stores only email plus lightweight usage metadata.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

Deploys are guarded by the machine-level `safe-deploy` wrapper.
