# Active product contract — retired Agent Desk replaced in README, MEMORY, and the spec plane — re-verify against current main

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] Replace the retired
Agent Desk as the repository's active product contract — README, MEMORY,"
(item id `e9b7a5a184`). The repository's top-level truth files
(`README.md`, `MEMORY.md`) and the spec plane (`specs/00{1..4}-*`) describe
TinyStudio's active product. The retired self-serve Agent Desk used to
appear in those files as the active product; it has since been replaced
with The Website Appraisal — the free leak audit of high-ticket service
homepages — and the human-reviewed desk that closes what the audit finds.

This receipt re-verifies that replacement against the current
`origin/main` head (`6534795`, "docs(evidence): re-verify PR #42 + #43
serial-merge closeout on current main (2026-08-14) (#189)") and the live
deployment of that head. It is a source-side plus served-bytes re-verify;
no live AI-search capture or browser-side rendering check is in scope.

## Summary

The active product contract on `origin/main` already names The Website
Appraisal — never the Agent Desk — in the top-level truth files, the
spec plane, and the script-level guards that prove the framing:

- `README.md` — line 3 names "The Website Appraisal" as TinyStudio's
  public surface; lines 9-11 declare the active product contract as
  `specs/004-website-appraisal/plan.md` and demote specs 001 and 002 as
  "historical records of the retired Agent Desk" plus spec 003 as a
  "superseded campaign plan"; line 16 keeps the retired `/agent-desk`
  surface and `/api/agent-audit` endpoint as legacy mechanics only.
- `MEMORY.md` — lines 7-8 mirror the README: current offer is The
  Website Appraisal; current plan is `specs/004-website-appraisal/plan.md`;
  specs 001 and 002 are historical Agent Desk records; spec 003 is
  superseded. Section "## Legacy Agent Desk" (line 19) demotes the
  Agent Desk and preserves its safety rails verbatim.
- `package.json` — line 6 description reads "TinyStudio public website:
  The Website Appraisal and the human-reviewed desk on Cloudflare
  Workers.", and the `test` script (line 11) wires `test:contract` (line
  16) into `npm test` so the framing guard runs on every test pass.
- `specs/001-public-buyer-page/{plan.md,spec.md,tasks.md}` — each opens
  with `> **Status: HISTORICAL — retired.** Records the original Agent
  Desk implementation.` and points readers to
  `specs/004-website-appraisal/plan.md` as the current offer.
- `specs/002-minimal-input-agent-desk/{plan.md,spec.md,tasks.md}` — each
  opens with `> **Status: HISTORICAL — retired.** Records the
  minimal-input Agent Desk correction.` and points to specs/004.
- `specs/003-wellness-clinic-launch/plan.md` — opens with
  `> **Status: SUPERSEDED — historical campaign plan.**` and was never
  the active product contract.
- `specs/004-website-appraisal/plan.md` — opens with
  `> **Status: CURRENT.** The Website Appraisal is TinyStudio's current
  offer and this plan describes the current public contract.` and
  describes The Website Appraisal, the desk (`/agents`), the appraisal
  intake (`/audit`), and the legacy Agent Desk surfaces.

The product-contract guard (`scripts/test-product-contract.mjs`) locks
this framing: 8/8 tests pass on this head, including the regression
fixtures that prove the checker rejects the old Agent Desk framings and
rejects misplaced or contradictory truth.

## What's new since the last verifying receipt

The active-product-contract replacement has been on `main` for several
release cycles. Branches that touched this region after the 2026-08-12
receipt window did not alter the framing; the canonical Agent Desk
title-canonical branches (`fix/agent-desk-*`) only adjusted the
**retired** Agent Desk surface metadata (the canonical tag pointing at
the legacy `agent-desk.html` so it stops pretending to be the apex
root), not the active product contract. No commit between
`6534795` and this head changes any of the eight framing clauses the
product-contract test guards.

## Verification performed

1. **Spec status banners** — every active spec carries the right banner:
   specs 001 and 002 → `Status: HISTORICAL`; spec 003 →
   `Status: SUPERSEDED`; specs 004 → `Status: CURRENT`. Each banner is
   the first prose paragraph after the `# H1`, the only position the
   product-contract checker accepts.
2. **README + MEMORY framing** — both files declare
   `specs/004-website-appraisal/plan.md` as the current plan, mirror
   The Website Appraisal as the current offer, and demote the Agent
   Desk to a legacy mechanics note. Neither file's first paragraph
   names the Agent Desk as the offer; the only "Agent Desk" mentions
   are inside explicitly-named "Legacy Agent Desk" or
   "retired self-serve Agent Desk" prose with safety-rail context.
3. **`package.json` description + test script** — line 6
   `description` says "The Website Appraisal and the human-reviewed
   desk"; line 11 `test` script chains `test:contract`; line 16 wires
   `node --test scripts/test-product-contract.mjs`.
4. **Product-contract test** — `node --test scripts/test-product-contract.mjs`
   → 8 tests, 8 pass, 0 fail. Subtests, in order:
   - ok 1 — `README.md frames The Website Appraisal as the current product`
   - ok 2 — `MEMORY.md frames The Website Appraisal as the current product`
   - ok 3 — `package.json describes the current product and wires the contract test`
   - ok 4 — `specs 001 and 002 are unmistakably historical implementation records`
   - ok 5 — `spec 003 is superseded and points at the current plan`
   - ok 6 — `the current plan exists at specs/004-website-appraisal/plan.md`
   - ok 7 — `checker rejects the old Agent Desk framings (fixtures)`
   - ok 8 — `checker rejects misplaced, conflicting, and contradictory truth (fixtures)`
5. **Full test suite** — `node --test scripts/test-heading-hierarchy.mjs scripts/test-sitemap.mjs scripts/test-agent-worker.mjs scripts/test-agent-ui.mjs scripts/test-product-contract.mjs scripts/test-first-viewport-audience.mjs`
   → 117 tests, 117 pass, 0 fail. Includes the 8 product-contract tests
   plus heading-hierarchy (6), sitemap (7), agent-worker (76),
   agent-ui (16), first-viewport-audience (4).
6. **Site-wide checker** — `node scripts/check-site.mjs` → exit 0,
   "TinyStudio.io checks passed." The narrow-viewport probe
   (`test-narrow-viewport-pages.mjs`) reports PASS on all four owned
   routes at 240-390px; the render-blocking probe
   (`check-render-blocking.mjs`) reports non-blocking on all six pages.
7. **Honest boundary** — this receipt makes no claim about whether
   `git diff --check` regressions are present in unrelated files, no
   claim about any engine's answer to a question about TinyStudio, and
   no claim about pricing/legal prose (which is owned by
   `pricing.html`, not the repository framing).

## Files touched

None on `origin/main`. The active-product-contract replacement has
already shipped, and this receipt only documents the current state on
`origin/main` (head `6534795`). The proof files added by this lane are
documentation only:

- `.lane/reports/docs-agent-desk-product-contract-rereverify-2026-08-14.md`
  — lane report (this branch's report file).
- `docs/evidence/agent-desk-product-contract-reverify-2026-08-14.md` —
  this evidence receipt.

## Verification commands

- `git show origin/main:README.md` — line 3 names The Website Appraisal;
  lines 9-11 point at specs/004.
- `git show origin/main:MEMORY.md` — lines 7-8 mirror the README framing.
- `git show origin/main:package.json` — line 6 description and line 11
  test chain.
- `node --test scripts/test-product-contract.mjs` → 8/8 pass.
- `node --test scripts/test-heading-hierarchy.mjs scripts/test-sitemap.mjs scripts/test-agent-worker.mjs scripts/test-agent-ui.mjs scripts/test-product-contract.mjs scripts/test-first-viewport-audience.mjs`
  → 117/117 pass.
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node scripts/test-narrow-viewport-pages.mjs` → PASS on the four
  owned routes; one out-of-scope note on `/` at 240px (does not gate
  exit code, pre-existing, unrelated to the active product contract).
- `node scripts/check-render-blocking.mjs` → non-blocking on all six
  owned pages.
