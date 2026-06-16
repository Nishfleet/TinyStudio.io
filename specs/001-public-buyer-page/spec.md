# Feature Specification: Locked Coming-Soon Page

## User Outcome

Visitors can visit `tinystudio.io`, understand that TinyStudio is temporarily closed, and leave an email for launch access.

## Non-Goals

- Build a SaaS app.
- Add payment collection.
- Publish the old sprint offers, pricing, or public delivery claims.
- Replace sales calls or Loom audits.
- Promise revenue, ROAS, rankings, AI visibility, booked calls, or sales lift.
- Keep the old private app/API subdomains alive.

## Requirements

- Public page must be a cryptic coming-soon page.
- Public page must collect emails through `/api/signups`.
- Email capture must store emails in Cloudflare D1.
- Public page must include a contact path using `hello@tinystudio.io`.
- Public page must not publish old offers, pricing, deliverables, or claims while locked.
- Old public paths must render the locked page rather than old offer pages.
- Public page must include agent-readable `/llms.txt` and `/offer.md` that describe lockdown state.
- Cloudflare config must route `tinystudio.io`, `www.tinystudio.io`, `app.tinystudio.io`, and `api.tinystudio.io`.
- `app.tinystudio.io` must return an intentional retired notice.
- `api.tinystudio.io` must return an intentional retired JSON response.

## Acceptance Checks

- `npm test` passes.
- The page includes coming-soon copy, email form, and contact email.
- `/pipeline-sprint/` and stale public paths no longer expose old offer details.
- The copy avoids revenue, ROAS, ranking, AI visibility, booked-call, conversion-lift, and sales-lift guarantees.
- Cloudflare routes include `app.tinystudio.io` and `api.tinystudio.io` so the old Website Manager app/API are no longer exposed there.
- Desktop and mobile browser checks render without obvious overlap or blank visual sections.

## Data Touched

- Public website copy.
- Email addresses submitted by visitors for launch access.
- No customer, prospect folders, analytics exports, payment data, or private app data.

## Launch Risk

The main risk is accidentally leaving old public offer pages live. The control is Worker-first routing for all public paths plus a content check that fails on old offer copy.
