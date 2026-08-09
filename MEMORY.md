# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of deeper offer/delivery truth.
- The current offer is The Website Appraisal: the free leak audit of high-ticket service homepages and the human-reviewed desk that closes what the audit finds. Price and terms live on `pricing.html`.

## Product Truth

- The Website Appraisal is the current product: a written report on one page of the buyer's choosing, each fault named in order of what it costs, with the fix beside each, reviewed by a person and not autonomous software. Six appraisals a month, done by hand; when the sixth is taken, intake closes until the next.
- The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.

## Legacy Agent Desk

- The earlier self-serve Agent Desk (one-shot Pipeline Brief) is retired and is not the current offer. Its page (`public/agent-desk.html`) stays served at `/agent-desk` and `/agent-desk.html` for old deep links, and its head declares itself retired with a `noindex` meta.
- The retired Agent Desk's API mechanics remain live: `/api/agent-audit` still generates a Pipeline Brief, Implementation Checklist, and Weekly Fix Report from user-submitted context through Cloudflare Workers AI.
- Email capture remains live through `/api/signups`.
- The app stores email and lightweight usage metadata in D1, including daily rate-limit counters and a daily IP-derived rate-limit key, but not submitted business snapshots, optional details, weekly metrics, or generated artifacts.

## Legacy Agent Desk Safety

- The retired Agent Desk's safety rails stand: agents can generate planning assets and recommendations, but human approval remains required for claims, ad spend, campaign publishing, platform connections, CRM outcome syncing, compliance-sensitive actions, and anything that would affect money or external accounts.
- Client-side code must not call model providers, Cloudflare admin APIs, D1, ad-platform APIs, or private credentials directly.

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
- For visual changes, run the Worker and inspect desktop and mobile browser views.
- Verify old deep links such as `/pipeline-sprint/` still render the retired Agent Desk surface, not stale public pages.
