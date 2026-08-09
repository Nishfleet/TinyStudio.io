# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of deeper offer/delivery truth.
- The current offer is the Website Appraisal: the free leak audit of high-ticket service homepages, six a month, done by hand, reviewed by a person and signed by Nish, and yours to keep. The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up.
- The desk's price and terms live on pricing.html. `llms.txt` and `offer.md` must not restate the price or refund terms, and must keep demoting the legacy Agent Desk.

## Product Truth

- The Website Appraisal is a written report on one page of the buyer's choosing — each fault named, in order of what it costs, with the fix beside each. Buyer: high-ticket service businesses — clinics, surgeons, dentists, spas, dealers, brokers — and clients are never named.
- Human review gates fit, claims, client-facing work, delivery/acceptance, and renewal. Automation may prepare research, drafts, QA, packages, and routing, but never autonomously sends, publishes, spends, approves, accepts, or renews.
- Public copy must not promise revenue, ROAS, ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.

## Legacy Agent Desk Mechanics

- The earlier self-serve Agent Desk (one-shot Pipeline Brief) is demoted and is not the current offer. `specs/001-public-buyer-page/` and `specs/002-minimal-input-agent-desk/` document that completed work and are visibly superseded by `specs/004-website-appraisal/plan.md`.
- The legacy surface `/agent-desk` remains reachable, retired, and absent from the index. `/api/agent-audit` still runs Cloudflare Workers AI generation and keeps its safety rails, validation, and D1 rate limits; treat it as live legacy plumbing, not the product.
- Email capture remains live through `/api/signups`.
- The public app stores email and lightweight agent usage metadata in D1, including daily rate-limit counters and a daily IP-derived rate-limit key, but not submitted business context, weekly metrics, or generated artifacts.
- Legacy Agent Desk safety rails: no campaign publishing, no ad spend changes, no ad account connection, no prospect message sending; client-side code must not call model providers, platform admin APIs, ad accounts, databases, or private credentials directly.

## Deployment Boundary

- The intended Cloudflare Worker route patterns own the whole TinyStudio.io domain family:
  - `tinystudio.io`
  - `www.tinystudio.io`
  - `app.tinystudio.io`
  - `api.tinystudio.io`
- `app.tinystudio.io` should return an intentional retired notice.
- `api.tinystudio.io` should return an intentional retired JSON response.

## Verification

- Run `npm test` before any deploy; it includes the product-contract regression guard (`scripts/test-product-contract.mjs`) that keeps the repo descriptors and spec statuses honest.
- Apply D1 migrations locally and remotely before deploying schema-dependent Worker changes.
- Verify `/api/agent-audit` with a sample high-ticket scenario before deploy (legacy mechanics must not silently break).
- For visual changes, run the Worker and inspect desktop and mobile browser views.
- Verify old deep links such as `/pipeline-sprint/` render the Agent Desk, not stale public pages.
