# Feature Specification: Self-Serve Agent Desk

> **Status: HISTORICAL — retired.** Records the original Agent Desk
> implementation. The self-serve Agent Desk is retired and is not the current
> product; the current offer is The Website Appraisal
> (`specs/004-website-appraisal/plan.md`). Body kept as a historical record.

## User Outcome

Visitors can visit `tinystudio.io`, submit high-ticket pipeline context, and receive an AI-generated Pipeline Brief, Implementation Checklist, and Weekly Fix Report without a sales call.

## Non-Goals

- Add payment collection.
- Connect to ad accounts.
- Publish campaigns.
- Change ad spend.
- Send prospect messages.
- Sync CRM outcomes to ad platforms.
- Store submitted business snapshots, optional details, weekly metrics, or generated artifacts.
- Replace human approval for claims or compliance-sensitive decisions.
- Promise revenue, ROAS, rankings, AI visibility, booked calls, or sales lift.
- Keep the old private app/API subdomains alive.

## Requirements

- Public page must be a usable Agent Desk, not a marketing-only landing page.
- Public page must collect only the minimum required context by default: email and a business snapshot. Offer, target buyer, proof, funnel, follow-up, CRM, constraints, and weekly metrics stay optional.
- Public page must allow optional weekly lead-to-call metrics for the Weekly Fix Report.
- Agent generation must run server-side through Cloudflare Workers AI.
- Agent generation must require a valid email.
- Email capture and lightweight usage metadata must store in Cloudflare D1, including daily rate-limit counters.
- The submitted business snapshot and optional details must not be stored by this app.
- Public page must include a contact path using `hello@tinystudio.io`.
- Public page must not publish revenue, ROAS, booked-call, ranking, AI-visibility, conversion-lift, or sales-lift guarantees.
- Public page must clearly mark ad spend, campaign publishing, platform connections, and compliance-sensitive actions as approval-gated.
- Old public paths must render the Agent Desk rather than old offer pages.
- Public page must include agent-readable `/llms.txt` and `/offer.md` that describe the current Agent Desk truth.
- Cloudflare config must route `tinystudio.io`, `www.tinystudio.io`, `app.tinystudio.io`, and `api.tinystudio.io`.
- `app.tinystudio.io` must return an intentional retired notice.
- `api.tinystudio.io` must return an intentional retired JSON response.

## Acceptance Checks

- `npm test` passes.
- The page includes minimal Agent Desk intake, optional detail fields, Cloudflare AI positioning, agent stack, output panel, and safety rails.
- `/api/agent-audit` generates a useful Pipeline Brief, Implementation Checklist, and Weekly Fix Report for a sample high-ticket scenario.
- `/pipeline-sprint/` and stale public paths no longer expose separate old offer pages.
- The copy avoids revenue, ROAS, ranking, AI visibility, booked-call, conversion-lift, and sales-lift guarantees.
- Cloudflare routes include `app.tinystudio.io` and `api.tinystudio.io` so the old Website Manager app/API are no longer exposed there.
- Desktop and mobile browser checks render without obvious overlap or blank visual sections.

## Data Touched

- Public website copy.
- Email addresses submitted by visitors for launch access.
- Lightweight agent usage metadata: email, source, page path, daily IP-derived rate-limit key, user agent, daily counters, and created timestamp.
- No customer folders, analytics exports, payment data, or private app data.
- No storage of submitted business snapshots, optional details, weekly metrics, or generated artifacts.

## Launch Risk

The main risks are overclaiming automation, AI cost abuse, and storing sensitive business context. Controls: server-side Cloudflare AI, email requirement, D1 daily limits, no business-brief storage, approval-gated copy, and content checks.
