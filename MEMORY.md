# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO`
  and is the source of deeper offer/delivery truth.
- The current offer is the Website Appraisal: a free leak audit of high-ticket
  service homepages, reviewed by a person, not autonomous software, with a
  human-reviewed desk that closes what the audit finds. Price and terms live
  on `pricing.html`.

## Product Truth

- The appraisal is a written report on one page of your choosing — each fault
  named, in order of what it costs you, with the fix beside each. It is free,
  yours to keep, and handable to any developer, including one who is not us.
- Six appraisals a month, done by hand. When the sixth is taken, the intake
  closes until the next.
- The human-reviewed desk closes what the audit finds: month one corrects the
  costliest fault; months two and three build the loop that keeps the standard
  up. Human review gates fit, claims, client-facing work, delivery/acceptance,
  and renewal; automation never autonomously sends, publishes, spends,
  approves, accepts, or renews.
- Buyer: high-ticket service businesses — clinics, surgeons, dentists, spas,
  dealers, brokers — and clients are never named.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility,
  conversion lift, booked calls, sales lift, autonomous ad buying, or
  unapproved ad spend changes.

## Legacy Agent Desk

- The self-serve Agent Desk is retired and is not the current offer, but its
  mechanics stay live for old deep links: `public/agent-desk.html` is served
  at `/agent-desk` (noindex, framed as retired), Cloudflare Workers AI still
  generates the Pipeline Brief, Implementation Checklist, and Weekly Fix
  Report through `/api/agent-audit`, and email capture remains live through
  `/api/signups`.
- The legacy Desk stores email and lightweight agent usage metadata in D1
  (including daily rate-limit counters and a daily IP-derived rate-limit key),
  but not submitted business snapshots, optional details, weekly metrics, or
  generated artifacts.
- Its safety rails remain: no campaign publishing, no ad spend changes, no ad
  account connection, no prospect message sending; client-side code must not
  call model providers, Cloudflare admin APIs, D1, ad-platform APIs, or
  private credentials directly.

## Deployment Boundary

- The intended Cloudflare Worker route patterns own the whole TinyStudio.io
  domain family:
  - `tinystudio.io`
  - `www.tinystudio.io`
  - `app.tinystudio.io`
  - `api.tinystudio.io`
- `app.tinystudio.io` should return an intentional retired notice.
- `api.tinystudio.io` should return an intentional retired JSON response.

## Verification

- Run `npm test` before any deploy — it includes the product-contract guard
  (`scripts/test-product-contract.mjs`) that fails if repo docs revive the
  retired Agent Desk as the current offer or drift the current-offer truth.
- Apply D1 migrations locally and remotely before deploying schema-dependent
  Worker changes.
- Verify `/api/agent-audit` with a sample high-ticket scenario before deploy.
- For visual changes, run the Worker and inspect desktop and mobile browser
  views.
- Verify old deep links such as `/pipeline-sprint/` render the legacy Agent
  Desk surface, not stale public pages.
