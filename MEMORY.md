# Project Memory

## Current Shape

- This repo is the deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of deeper offer/delivery truth.
- As of the Agent Desk pass, `tinystudio.io` is reopening as a self-serve AI workspace for high-ticket pipeline setup.
- Cloudflare Workers AI generates the Pipeline Brief from user-submitted context through `/api/agent-audit`.

## Product Truth

- TinyStudio Agent Desk generates readiness diagnosis, funnel path, audience/pain map, first creative tests, lead qualification, follow-up/setter flow, CRM/tracking checklist, and decision plan.
- Email capture remains live through `/api/signups`.
- The public app stores email and lightweight agent usage metadata in D1, including daily rate-limit counters and a daily IP-derived rate-limit key, but not the full submitted business brief.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.

## Agent Desk Safety

- Agents can generate planning assets and recommendations.
- Human approval remains required for claims, ad spend, campaign publishing, platform connections, CRM outcome syncing, compliance-sensitive actions, and anything that would affect money or external accounts.
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
- Verify `/api/agent-audit` with a sample high-ticket scenario before deploy.
- For visual changes, run the Worker and inspect desktop and mobile browser views.
- Verify old deep links such as `/pipeline-sprint/` render the Agent Desk, not stale public pages.
