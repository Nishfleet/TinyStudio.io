# Feature Specification: Minimal-Input Agent Desk

> **STATUS: HISTORICAL — SUPERSEDED.** This specification describes the
> retired self-serve Agent Desk, which is no longer TinyStudio's current
> product. It is kept only as history; do not read it as current guidance.
> The current product plan is `specs/004-website-appraisal/plan.md`.

## What Went Wrong

The Agent Desk drifted into an agency intake form. The UI required customers to pre-diagnose their offer, buyer, funnel, proof, follow-up, CRM, and weekly numbers before the agent could help.

That broke the product promise. TinyStudio is supposed to sell an agentic operating system where the customer gives the minimum context and the agents do the heavy lifting. The old flow made the customer do the work and made the page feel like an internal admin tool.

## User Outcome

A visitor can give TinyStudio an email plus one compact business snapshot, then receive a Pipeline Brief, Implementation Checklist, and Weekly Fix Report. The agents infer missing offer, buyer, funnel, creative, qualification, follow-up, CRM, tracking, and metric assumptions. The output calls out true blockers only when the missing information would prevent a useful next step.

## Non-Goals

- Do not connect to ad accounts.
- Do not publish campaigns.
- Do not change ad spend.
- Do not send WhatsApp, SMS, email, or DM follow-up messages.
- Do not sync CRM outcomes to ad platforms.
- Do not store submitted business snapshots, weekly metrics, or generated artifacts.
- Do not promise revenue, ROAS, profit, booked calls, conversion lift, sales lift, or specific close rates.
- Do not hide optional advanced inputs from power users.

## Requirements

- The public form must require only a valid email and a business snapshot.
- The business snapshot must accept messy raw context such as a website, Instagram bio, offer note, customer description, or sales context.
- Offer, target buyer, market, current funnel, proof, follow-up, CRM, constraints, and weekly metrics must be optional.
- Optional fields must be progressively disclosed so they help prepared users without burdening first-time users.
- The Worker must accept minimal input and still run the agent workflow.
- The agent prompt must instruct the model to infer missing context, label assumptions, and ask only true blocker questions.
- The agent must not invent exact prices, demographics, city lists, dates, proof details, revenue, budgets, or current tools when those facts are missing.
- The generated output must remain split into Pipeline Brief, Implementation Checklist, and Weekly Fix Report.
- The Weekly Fix Report must use supplied weekly metrics when present. Without metrics, it must preserve contextual next-step guidance and add the metrics to collect; the static tracker template is only a fallback when the model leaves the report unusable or invents numbers.
- Public copy and generated output must keep spend, publishing, platform connections, claims, and compliance-sensitive actions approval-gated.
- Client-side code must not call model providers, database admin APIs, Cloudflare admin APIs, ad platform APIs, or private credentials.

## Acceptance Checks

- `npm test` passes.
- A submission with only email and business snapshot succeeds.
- A submission without business snapshot fails with a clear message.
- The first visible form screen is compact and does not require offer, buyer, proof, follow-up, CRM, or metrics.
- Optional detail fields remain accessible in the page.
- Browser verification at desktop and mobile sizes shows no oversized form typography, incoherent overlap, or admin-form sprawl.
- The live API response from `/api/agent-audit` still returns all three sections.
- Generated output remains claim-safe and approval-gated.

## Data Touched

- Email addresses for access and rate-limit tracking.
- Lightweight agent usage metadata: email, source, page path, IP-derived daily bucket, user agent, and timestamp.
- No storage of submitted business snapshots, optional fields, weekly metrics, or generated artifacts.

## Root-Cause Guardrail

Future Agent Desk changes must pass this question before shipping: did the change reduce customer effort while preserving output quality? If it increases required customer input, it needs a clear reason and should usually be optional.
