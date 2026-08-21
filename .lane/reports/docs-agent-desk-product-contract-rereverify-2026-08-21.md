# Lane report: active product contract — Agent Desk replaced in README, MEMORY, and the spec plane — re-verify (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `docs/agent-desk-product-contract-rereverify-2026-08-21`
Item: `e9b7a5a184` — "[unreviewed-by-opus] Replace the retired Agent Desk as the repository's active product contract — README, MEMORY,"

## Outcome

**Closed. The retired Agent Desk has already been replaced as the
repository's active product contract on `origin/main`, and this lane
re-verified the replacement against the current head (`92d55c3`,
"fix(check): guard the apple touch icon on every served page, and
re-verify finding 98a7bf8e08fc (2026-08-20) (#256)"). No code change was
needed; the closeout evidence is recorded.**

## Verification performed

1. **Current plan marker** — `git show origin/main:specs/004-website-appraisal/plan.md`
   opens with `> **Status: CURRENT.** The Website Appraisal is
   TinyStudio's current offer and this plan describes the current
   public contract. Supersedes the Agent Desk product framing of
   `specs/001-public-buyer-page/` and `specs/002-minimal-input-agent-desk/`;
   the wellness-clinic campaign plan
   (`specs/003-wellness-clinic-launch/plan.md`) is a historical
   campaign plan.`
2. **Historical banners** — `specs/001-public-buyer-page/{plan.md,spec.md,tasks.md}`
   and `specs/002-minimal-input-agent-desk/{plan.md,spec.md,tasks.md}`
   each open with `> **Status: HISTORICAL — retired.**` and point at
   the current plan.
3. **Superseded banner** — `specs/003-wellness-clinic-launch/plan.md`
   opens with `> **Status: SUPERSEDED — historical campaign plan.**`.
4. **README + MEMORY mirror the contract**:
   - `README.md` line 3 names The Website Appraisal as the public
     surface; lines 9-11 declare the active product contract at
     `specs/004-website-appraisal/plan.md`.
   - `MEMORY.md` lines 7-8 mirror that declaration; the "Legacy
     Agent Desk" section at line 19 demotes the Agent Desk to a
     legacy mechanics note with safety rails preserved.
5. **`package.json` wiring** — line 6 description: "TinyStudio public
   website: The Website Appraisal and the human-reviewed desk on
   Cloudflare Workers." Line 11 `test` script chains `test:contract`;
   line 16 wires `node --test scripts/test-product-contract.mjs`.
6. **Product-contract test** — `node --test scripts/test-product-contract.mjs`
   → 8/8 pass.
7. **Full node test suite** — 124 tests, 0 failures across
   heading-hierarchy (6), sitemap (7), agent-worker (83),
   agent-ui (16), product-contract (8), and first-viewport-audience (4).
8. **Site-wide checker** — `node scripts/check-site.mjs` → exit 0,
   "TinyStudio.io checks passed."

## Files changed

- `docs/evidence/agent-desk-product-contract-reverify-2026-08-21.md` —
  new evidence receipt recording the closeout on the current head
  (the lane's claimed file).
- `.lane/reports/docs-agent-desk-product-contract-rereverify-2026-08-21.md`
  — this report.

## Verification commands

- `git show origin/main:README.md` — line 3 names The Website
  Appraisal; lines 9-11 point at specs/004.
- `git show origin/main:MEMORY.md` — lines 7-8 mirror the README
  framing; section "## Legacy Agent Desk" at line 19 demotes the
  retired Agent Desk.
- `node --test scripts/test-product-contract.mjs` → 8/8 pass.
- `node --test scripts/test-heading-hierarchy.mjs scripts/test-sitemap.mjs scripts/test-agent-worker.mjs scripts/test-agent-ui.mjs scripts/test-product-contract.mjs scripts/test-first-viewport-audience.mjs`
  → 124/124 pass.
- `node scripts/check-site.mjs` → exit 0, "TinyStudio.io checks
  passed."

## Honest boundary

This lane claims no behavioural change in the public surface. The
retired `/agent-desk` page and the legacy `/api/agent-audit` endpoint
remain operational as legacy mechanics, exactly as the current plan's
"Legacy Mechanics (retired, still operational)" section describes.
This lane makes no claim about pricing/legal prose (owned by
`pricing.html`), no claim about runtime behaviour of `src/worker.js`
(owned by the application test suite), and no claim about any engine's
answer to a question about TinyStudio. The receipt confirms the
repository's **active product contract** is The Website Appraisal and
the retired Agent Desk framing is gone from the top-level truth files.
