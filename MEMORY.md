# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of deeper offer/delivery truth.
- The current offer is The Website Appraisal — the free leak audit of high-ticket service homepages — and the human-reviewed desk that closes what the audit finds. Public truth lives at `/llms.txt` and `/offer.md`.
- The current plan is `specs/004-website-appraisal/plan.md` (Status: CURRENT); specs 001 and 002 are HISTORICAL records of the retired Agent Desk, and spec 003 is a SUPERSEDED campaign plan. Read the current plan before routing product work.
- The self-serve Agent Desk is retired. Its `/agent-desk` surface and the `/api/agent-audit` generation endpoint still exist operationally as legacy mechanics and must not be presented as the current product.

## Product Truth

- TinyStudio's current offer is The Website Appraisal: a written report on one page of the visitor's choosing, each fault named in order of what it costs, with the fix beside each, reviewed by a person. The human-reviewed desk closes what the audit finds.
- The appraisal intake is minimal: one page of the visitor's choosing; the desk's price and terms live on `pricing.html`, and TinyStudio makes no revenue, ranking, ROAS, conversion, booked-call, or sales-volume guarantees.
- Email capture remains live through `/api/signups`.
- The public app stores email and lightweight agent usage metadata in D1, including daily rate-limit counters and a daily IP-derived rate-limit key, but not submitted business context or generated artifacts.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.

## Legacy Agent Desk

- The earlier self-serve Agent Desk (one-shot Pipeline Brief through `/api/agent-audit`) is demoted, retired, and is not the product TinyStudio sells.
- Legacy Agent Desk surfaces still reachable on this site are legacy, not the current offer, and keep their safety rails: no campaign publishing, no ad spend changes, no ad account connection, no prospect message sending; client-side code never calls model providers, platform admin APIs, ad accounts, databases, or private credentials directly.

## Deployment Boundary

- The intended Cloudflare Worker route patterns own the whole TinyStudio.io domain family:
  - `tinystudio.io`
  - `www.tinystudio.io`
  - `app.tinystudio.io`
  - `api.tinystudio.io`
- `app.tinystudio.io` should return an intentional retired notice.
- `api.tinystudio.io` should return an intentional retired JSON response.

## Verification

- Run `npm test` before any deploy.
- Apply D1 migrations locally and remotely before deploying schema-dependent Worker changes.
- Verify the legacy `/api/agent-audit` still responds as operational legacy; it is not current-offer truth.
- For visual changes, run the Worker and inspect desktop and mobile browser views.
- Verify old deep links such as `/pipeline-sprint/` still resolve to the legacy Agent Desk surface, not stale public pages.
