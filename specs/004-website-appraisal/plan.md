# Implementation Plan: Website Appraisal (Current Offer)

## Scope

Keep the repository-level contract truthful to TinyStudio's current offer —
the Website Appraisal and the human-reviewed desk that closes its findings —
while preserving the retired Agent Desk's still-live legacy mechanics as
bounded, discoverable legacy surfaces.

## Pieces

- The public site (root, `/audit`, `/pricing`, `/agents`, `/specimen`)
  presents the current offer: a free written leak audit of high-ticket
  service homepages — one page of your choosing, each fault named in order of
  what it costs you, with the fix beside each — six a month, done by hand,
  reviewed by a person, not autonomous software.
- `public/llms.txt` and `public/offer.md` mirror the current-offer truth for
  agent readers and demote the Agent Desk to legacy.
- Human review gates fit, claims, client-facing work, delivery/acceptance,
  and renewal. Automation may prepare research, drafts, QA, packages, and
  routing, but never autonomously sends, publishes, spends, approves,
  accepts, or renews.
- Legacy mechanics stay live and bounded: `public/agent-desk.html` at
  `/agent-desk` (noindex, framed as retired), `/api/agent-audit` through
  Cloudflare Workers AI, `/api/signups` email capture in Cloudflare D1,
  lightweight usage metadata with daily rate-limit counters, and the retired
  responses for `app.tinystudio.io` and `api.tinystudio.io`. The legacy
  safety rails stay: no campaign publishing, no ad spend changes, no ad
  account connection, no prospect message sending, and no client-side calls
  to model providers, admin APIs, databases, or private credentials.
- `scripts/test-product-contract.mjs` fails when README, MEMORY, the package
  description, or the specs layer revive the self-serve Agent Desk as the
  current product or drift the current-offer facts.

## Verification

- Run `node --test scripts/test-product-contract.mjs`.
- Run `npm test` and the site checks before any deploy.
- Keep `pricing.html` as the single source for price and terms; never
  restate them in repo docs.

## Fallback

If the legacy surface is ever removed, retire `/api/agent-audit`,
`/api/signups`, and the worker routes together with it — never leave legacy
mechanics live without the legacy framing, and never re-promote them to the
current offer.
