# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of deeper offer/delivery truth.
- The current product is The Website Appraisal — the free leak audit of high-ticket service homepages — and the human-reviewed desk that closes what the audit finds. Every audit is signed by a person; human review gates fit, claims, client-facing work, delivery/acceptance, and renewal.
- The current plan is `specs/004-website-appraisal/plan.md`. Specs 001 and 002 are historical (the retired self-serve Agent Desk); spec 003 is an earlier approved campaign plan, not the current product plan.
- Price and terms belong to `public/pricing.html`; the repository contract documents must not restate dollar amounts.

## Product Truth

- The Website Appraisal is a written report on one page of the buyer's choosing: each fault named, in order of what it costs, with the fix beside it. It is free, yours to keep, and handable to any developer.
- Buyer: high-ticket service businesses — clinics, surgeons, dentists, spas, dealers, brokers — and clients are never named.
- Six appraisals a month, done by hand; when the sixth is taken the intake closes until the next.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.
- The audit page (`/audit`) carries the controlled AI-search evidence artifact; `/llms.txt` and `/offer.md` mirror the current offer and identity and map each controlled question to its preferred source page.

## Legacy Agent Desk Mechanics

- The self-serve Agent Desk (`public/agent-desk.html`, served at `/agent-desk`) is retired and is not the current offer. It stays noindexed and framed as retired.
- `/api/agent-audit` remains a live legacy mechanism: Cloudflare Workers AI generates a Pipeline Brief, Implementation Checklist, and Weekly Fix Report from a minimal business snapshot.
- The legacy default intake is minimal: email plus business snapshot. Offer, buyer, funnel, proof, follow-up, CRM, constraints, and weekly metrics are optional detail inputs; missing context is inferred and only true blockers are asked.
- Email capture remains live through `/api/signups`.
- The legacy mechanism stores only email and lightweight usage metadata in D1, including daily rate-limit counters and a daily IP-derived rate-limit key — never the submitted business snapshot, optional details, weekly metrics, or generated artifacts.
- Legacy safety rails stand: agents generate planning assets and recommendations only; human approval remains required for claims, ad spend, campaign publishing, platform connections, CRM outcome syncing, compliance-sensitive actions, and anything that would affect money or external accounts. Client-side code must not call model providers, Cloudflare admin APIs, D1, ad-platform APIs, or private credentials directly.

## Deployment Boundary

- The intended Cloudflare Worker route patterns own the whole TinyStudio.io domain family:
  - `tinystudio.io`
  - `www.tinystudio.io`
  - `app.tinystudio.io`
  - `api.tinystudio.io`
- `app.tinystudio.io` should return an intentional retired notice.
- `api.tinystudio.io` should return an intentional retired JSON response.

## Verification

- Run `npm test` before any deploy; it includes `test:contract`, which fails if README.md, MEMORY.md, package.json, or the spec status markers stop describing the current product truth.
- Apply D1 migrations locally and remotely before deploying schema-dependent Worker changes.
- Verify `/api/agent-audit` with a sample high-ticket scenario before deploy (legacy mechanism).
- For visual changes, run the Worker and inspect desktop and mobile browser views.
- Verify old deep links such as `/pipeline-sprint/` map to the current surfaces, not stale public pages.
