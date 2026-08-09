# Implementation Plan: Minimal-Input Agent Desk

> **STATUS: HISTORICAL — SUPERSEDED.** This plan describes the retired
> self-serve Agent Desk, which is no longer TinyStudio's current product. It
> is kept only as history; do not read it as current guidance. The current
> product plan is `specs/004-website-appraisal/plan.md` — read that plan
> first. The legacy `/api/agent-audit` mechanics it corrected remain live
> and are documented as legacy in README.md and MEMORY.md.

## Scope

Correct the Agent Desk so it behaves like an agentic product: the customer provides a small seed, and the agents infer the rest unless a true blocker remains.

## Pieces

- `public/index.html` keeps email, business snapshot, and hard limits visible while moving detailed offer, buyer, funnel, proof, follow-up, CRM, and weekly metrics into an optional detail pack.
- `public/styles.css` makes the form compact and styles the optional detail pack as progressive disclosure.
- `public/script.js` validates only email and business snapshot before submitting.
- `src/worker.js` validates only email and business snapshot, then prompts the model to infer missing context, state assumptions, and ask only true blocker questions.
- `scripts/test-agent-worker.mjs` proves minimal input succeeds and missing business snapshot fails.
- `scripts/test-agent-ui.mjs` proves the browser flow submits without offer or audience.
- `scripts/check-site.mjs` prevents regression to the old heavy-intake posture.
- `public/llms.txt`, `public/offer.md`, `README.md`, and `specs/001-public-buyer-page/spec.md` describe the minimal-input product truth.

## Verification

- Run `npm test`.
- Browser-check the local Worker preview on desktop and mobile.
- Exercise `/api/agent-audit` with a minimal high-ticket business snapshot and verify all three output sections return.
- Run the required review gate before any PR, merge, deploy, or publish path.

## Fallback

If minimal-input generation produces weak output in real use, keep the optional detail pack but do not make it required. Improve the agent prompt, examples, and blocker-question logic first.
