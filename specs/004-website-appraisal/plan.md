# 004 - Website Appraisal and Human-Reviewed Desk

Status: **current plan** (2026-08-10). Canonical current guidance for this
repo. Supersedes `specs/001-public-buyer-page/` and
`specs/002-minimal-input-agent-desk/` (completed Agent Desk work, kept for
history) and `specs/003-wellness-clinic-launch/` (earlier approved campaign
plan, kept for its offer history) as the current plan.

## Scope

Keep the live tinystudio.io Website Appraisal site truthful and shippable:
the free leak audit of high-ticket service homepages and the human-reviewed
desk that closes what the audit finds, with the retired self-serve Agent
Desk preserved as explicit legacy mechanics.

## Present Surfaces

- `/` (`public/index.html`) — homepage for the Website Appraisal: six a
  month, done by hand, yours to keep.
- `/audit.html` — the appraisal page, with the controlled AI-search
  evidence artifact embedded.
- `/agents.html` — the human-reviewed desk: seven specialists, one
  signature; nothing ships unread.
- `/pricing.html` — price and terms (desk price, three-month minimum,
  delivery guarantee). Pricing/legal copy must not be changed.
- `/specimen.html` — specimen appraisal with the client's name removed.
- `/brief-requested.html` — post-signup confirmation.
- `/llms.txt` and `/offer.md` — agent-readable product truth; they mirror
  each other, must not restate dollar amounts or refund terms (pricing.html
  owns them), and must keep demoting the legacy Agent Desk.
- `/api/signups` — email capture into Cloudflare D1.
- `/health` — health check.

## Legacy Boundary (Agent Desk Mechanics)

- `/agent-desk` and `/agent-desk.html` — retired Agent Desk surface: robots
  noindex/nofollow meta, framed as retired in title and description, absent
  from the sitemap. Do not re-index or re-promote it.
- `/api/agent-audit` — Cloudflare Workers AI generation still live; keeps
  request validation, rate limits, and output safety scrubbing. Treat as
  live legacy plumbing: do not remove, do not present as the product.
- `/pipeline-sprint/` — stale public path that must keep rendering the
  Agent Desk rather than stale public pages.
- `app.tinystudio.io` and `api.tinystudio.io` — intentional retired
  responses; the old app/API are not exposed there.
- `specs/001` and `specs/002` document the completed Agent Desk work;
  superseded but kept for history.

## Safety

- Human review gates fit, claims, client-facing work, delivery/acceptance,
  and renewal. Automation may prepare research, drafts, QA, packages, and
  routing, but never autonomously sends, publishes, spends, approves,
  accepts, or renews.
- No revenue, ranking, ROAS, conversion, booked-call, or sales-volume
  guarantees, in public copy or generated output.
- `llms.txt`/`offer.md` must keep the legacy Agent Desk demotion ("is not
  the current offer") and must not restate price or refund terms.
- Submitted business context is processed for the output and is not stored;
  only email and lightweight usage metadata go to D1, with daily rate-limit
  counters.
- Client-side code must not call model providers, platform admin APIs, ad
  accounts, databases, or private credentials directly.

## Verification

- `node --test scripts/test-product-contract.mjs` — product-contract
  regression guard (repo descriptors, spec statuses, price/legal invariants,
  and public-truth demotion markers).
- `npm run check` (`scripts/check-site.mjs`) — content, claim-safety,
  indexing, and wiring guards.
- `npm test` — full suite: check + headings + sitemap + worker + ui +
  product-contract.
- `npm run deploy:dry-run` before any live deploy.
- Apply D1 migrations locally and remotely before deploying
  schema-dependent Worker changes.
- Browser checks at desktop and mobile sizes for visual changes.
- Verify `/api/agent-audit` still answers a sample high-ticket scenario
  before any deploy.
