# 004 - Website Appraisal and Human-Reviewed Desk

Status: **CURRENT PRODUCT PLAN**. This is the plan a new contributor should
read first. The self-serve Agent Desk specs (`specs/001-public-buyer-page/`,
`specs/002-minimal-input-agent-desk/`) are historical and describe a retired
product. `specs/003-wellness-clinic-launch/` is an earlier approved campaign
plan and is not the current product plan. Public product truth lives in
`public/index.html`, `public/llms.txt`, and `public/offer.md`; price and terms
live on `public/pricing.html` and are owned by that page.

## Goal

TinyStudio's current offer is The Website Appraisal — the free leak audit of
high-ticket service homepages — and the human-reviewed desk that closes what
the audit finds. This plan keeps the repository's contract documents
(README.md, MEMORY.md, package.json) describing that truth, keeps the retired
self-serve Agent Desk accurately documented as a legacy mechanism, and guards
the description with a deterministic regression test.

No price, performance, or outcome claims are added by this plan: the audit is
free and yours to keep, the desk's price and terms are stated on pricing.html,
and the site promises no revenue, ranking, ROAS, conversion, booked-call, or
sales-volume guarantees.

## Pieces

- `public/index.html` (root), `public/audit.html`, `public/agents.html`,
  `public/pricing.html`, `public/specimen.html`, `public/brief-requested.html`
  form the public site. The root and `/audit` present The Website Appraisal
  and the human-reviewed desk.
- `public/llms.txt` and `public/offer.md` are the agent-readable mirrors of
  the current offer and identity, including the preferred source page for
  every controlled AI-search question.
- `src/worker.js` serves the public assets with security headers, writes email
  signups through `/api/signups` into Cloudflare D1, returns intentional
  retired responses for `app.tinystudio.io` and `api.tinystudio.io`, and maps
  stale public paths (`/pipeline-sprint/`) to the current surfaces.
- `public/agent-desk.html` is the legacy self-serve Agent Desk surface, still
  served at `/agent-desk` and `/agent-desk.html`, noindexed and framed as
  retired. `/api/agent-audit` remains a live legacy mechanism that generates a
  one-shot Pipeline Brief, Implementation Checklist, and Weekly Fix Report
  from a minimal business snapshot; the public app stores only email plus
  lightweight usage metadata in D1, never the submitted context or artifacts.
- `scripts/check-site.mjs`, `scripts/test-heading-hierarchy.mjs`,
  `scripts/test-sitemap.mjs`, `scripts/test-agent-worker.mjs`,
  `scripts/test-agent-ui.mjs`, and `scripts/test-product-contract.mjs`
  guard the public surface, the legacy mechanics, and the contract documents.
- `README.md` and `MEMORY.md` state the current product, point to this plan,
  and document the legacy Agent Desk mechanics. `package.json` names the
  current product and runs `test:contract`.

## Verification

- Run `node --test scripts/test-product-contract.mjs` — must pass on this
  branch and fail against the pre-appraisal origin/main (the proof that the
  contract guard actually guards).
- Run `npm run check` and `npm test` before any deploy.
- Apply D1 migrations locally and remotely before deploying schema-dependent
  Worker changes.
- After any content change, re-read `public/llms.txt` and `public/offer.md`
  against the live pages so the machine-readable mirror cannot drift.

## Fallback

If the repo's product truth changes again, update this plan and the contract
guard in the same change: the guard fails until README.md, MEMORY.md,
package.json, and the spec status markers describe the same current product.
