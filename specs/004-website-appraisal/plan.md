# Implementation Plan: The Website Appraisal (current product)

> **Status: CURRENT.** The Website Appraisal is TinyStudio's current offer and
> this plan describes the current public contract. Supersedes the Agent Desk
> product framing of `specs/001-public-buyer-page/` and
> `specs/002-minimal-input-agent-desk/`; the wellness-clinic campaign plan
> (`specs/003-wellness-clinic-launch/plan.md`) is a historical campaign plan.

## Scope

Keep the public site truthful: The Website Appraisal — the free leak audit of
high-ticket service homepages, reviewed by a person — and the human-reviewed
desk that closes what the audit finds. No public behavior changes; this plan
documents the contract and guards it against regression to the retired
self-serve Agent Desk framing.

## Current Public Surfaces

- `/` (homepage): names The Website Appraisal and the human-reviewed desk; no revenue, ranking, ROAS, conversion, booked-call, or sales-volume guarantees.
- `/audit`: the appraisal request surface and the controlled AI-search evidence artifact.
- `/agents`: the desk — the human-reviewed delivery that closes what the audit finds.
- `/pricing`: the desk's price and terms (pricing/legal copy is owned there, not here).
- `/specimen`: a sample of the written report shape.
- `/brief-requested`: post-submission confirmation for the appraisal flow.
- `/offer.md` and `/llms.txt`: machine-readable mirrors of current product truth, including the explicit legacy Agent Desk demotion.
- `/api/signups`: email capture into Cloudflare D1.

## Legacy Mechanics (retired, still operational)

- `/agent-desk` (and `/agent-desk.html`): the retired self-serve Agent Desk surface. Explicitly framed as retired, `noindex`, absent from the sitemap, and not the current offer.
- `/api/agent-audit`: the legacy generation endpoint (Pipeline Brief, Implementation Checklist, Weekly Fix Report) used by the retired Agent Desk surface. Still live and operational; never described as the current offer or as removed.
- D1 usage metadata and daily rate-limit counters continue to operate for the legacy surface.
- `app.tinystudio.io` and `api.tinystudio.io` return intentional retired responses.
- Legacy safety rails stand: no campaign publishing, no ad spend changes, no ad account connection, no prospect message sending; client-side code never calls model providers, platform admin APIs, ad accounts, databases, or private credentials directly.

## Boundaries

- `/api/signups` stores the submitted email and the normalized submitted website URL in D1 alongside lightweight request metadata (source/page path, referer, user agent, timestamps); submitted page content and media are processed to generate output and are not stored, and the website URL is used for appraisal and request handling.
- No invented outcomes, prices, or guarantees: no revenue, ranking, ROAS, conversion, booked-call, or sales-volume promises anywhere in owned copy.
- Human review gates fit, claims, client-facing work, delivery/acceptance, and renewal.
- Current-offer truth lives in `/offer.md` and `/llms.txt`; `README.md`, `MEMORY.md`, and `package.json` must mirror it without contradicting it.

## Verification

- `node --test scripts/test-product-contract.mjs` rejects any return to active Agent Desk product framing and validates the current/historical plan markers.
- `npm run check` and `npm test` (which includes the product-contract test) pass.
- `git diff --check` is clean; `sgscan` reports no findings.
- Visual changes still require the desktop and mobile browser checks.
