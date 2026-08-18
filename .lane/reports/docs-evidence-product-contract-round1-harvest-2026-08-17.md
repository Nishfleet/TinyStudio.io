# Lane report: product-contract candidate round 1 — harvest re-verify (2026-08-17)

Lane: tinystudio-io lane 1
Branch: `docs/evidence-product-contract-round1-harvest-2026-08-17`
Item: `b063acbb7f` — "Harvest the abandoned 'f168b00e05 repository product
contract still identifies reti' candidate round - 1 worktree"

## Outcome

**Closed. The abandoned round-1 candidate work is fully represented in
current main and live, and the tracker item `f168b00e05` ("repository
product contract still identifies the retired Agent Desk as current") stays
closed against drift on the current head `5ca6241` and live (2026-08-17).
No code change was needed; the closeout evidence is recorded.**

## What the abandoned round held

Per the continuity line in
`agent-state/tinystudio-io-improvement-loop/retired-cycles.md` (retired
2026-08-10T00:45:33), the round spanned eight worktrees:

- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-20260810-{1,2,3,4,5}`
- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-refine-20260810-{1,2}`
- `/home/nish/workspaces/agent-worktrees/tinystudio-io-lane1-20260810-004533`
  (branch `improve/repository-product-contract-a121ce8c`, HEAD `96a10b3`)

Re-checked on 2026-08-17:

- Every candidate worktree's branch is pushed to `origin/candidate/*` and in
  sync; the only uncommitted item in each is a deleted Python bytecode
  cache (`study/__pycache__/harvest.cpython-312.pyc`), a build artifact
  with no content. No finished-but-uncommitted product work exists to
  rescue.
- The abandoned lane-1 worktree still holds two uncommitted working-tree
  refinements on top of `96a10b3` (the stash commit `939e6c4`): the
  review-gap hardening draft of `scripts/test-product-contract.mjs`
  (bounded leading-banner status declaration, per-claim Agent Desk
  evaluation over `matchAll`, negation-precedes-term guarantee check, new
  `WEBSITE_STORED` guard) and the `specs/004-website-appraisal/plan.md`
  Boundaries bullet disclosing that `/api/signups` stores the submitted
  email and normalized website URL in D1.

## Where the same work landed

The finding was harvested through the `improve` branch and merged as **PR
#58** (`11864a7`, "docs(contract): make the Website Appraisal the active
repo truth", merged 2026-08-10). The underlying finding was additionally
closed by PR #99. Subsequent re-verifications (2026-08-11, 2026-08-12,
2026-08-13, 2026-08-14) confirmed the work is fully represented in main.

## Verification performed on the current head (`5ca6241`, 2026-08-17)

1. **Current plan markers** — `specs/004-website-appraisal/plan.md` opens
   with `> **Status: CURRENT.** The Website Appraisal is TinyStudio's
   current offer and this plan describes the current public contract.
   Supersedes the Agent Desk product framing of
   `specs/001-public-buyer-page/` and `specs/002-minimal-input-agent-desk/`;
   the wellness-clinic campaign plan
   (`specs/003-wellness-clinic-launch/plan.md`) is a historical campaign
   plan.`
2. **Historical banners** — `specs/001-public-buyer-page/{plan,spec,tasks}.md`
   and `specs/002-minimal-input-agent-desk/{plan,spec,tasks}.md` each
   open with `> **Status: HISTORICAL — retired.**` and point at the
   current plan.
3. **Superseded banner** — `specs/003-wellness-clinic-launch/plan.md`
   opens with `> **Status: SUPERSEDED — historical campaign plan.**`.
4. **README + MEMORY mirror the contract**:
   - `README.md` line 3 names The Website Appraisal as the public
     surface; lines 9-11 declare the active product contract at
     `specs/004-website-appraisal/plan.md`.
   - `MEMORY.md` lines 13-14 mirror that declaration; the "Legacy Agent
     Desk" section demotes the Agent Desk to a legacy mechanics note with
     safety rails preserved.
5. **`package.json` wiring** — description names The Website Appraisal
   and the human-reviewed desk on Cloudflare Workers; the `test`
   script chains `test:contract`; `test:contract` runs
   `node --test scripts/test-product-contract.mjs`.
6. **Plan Boundaries** — line 38 of `specs/004-website-appraisal/plan.md`
   discloses that `/api/signups` stores the submitted email and the
   normalized submitted website URL in D1 alongside lightweight request
   metadata — byte-identical to the abandoned draft.
7. **Product-contract guard** — `scripts/test-product-contract.mjs` carries
   the refactored superset of the abandoned draft's semantics:
   - bounded leading-banner status declaration (`hasLeadingStatus`, lines
     98–104, anchored on `>` plus optional bold plus terminator — period,
     em dash, bold close, or line end);
   - per-claim `AGENT_DESK_ACTIVE_PATTERNS` evaluation iterating `matchAll`
     rather than only the first match (lines 149, 176, 189, 230);
   - negation-precedes-term guarantee check using `clause.slice(0,
     term.index)` scoping (line 231);
   - `WEBSITE_STORED` / `WEBSITE_NOT_STORED` disclosure guards (lines
     252–259), asserted on current `plan` content.
8. **Repository-descriptor drift between PR #58 (`11864a7`) and current
   main** — only toolchain/feature commits (wrangler `^4.120.1` bump,
   the 2026-08-17 favicon SVG landing, the GoodFirms / Clutch /
   render-blocking / apple-touch-icon / AI-search / pipeline-bridge
   re-verifications, the retired-Agent-Desk canonical fix, the appraisal
   `autocomplete="email"` patch); zero contract drift. README, MEMORY, and
   package.json still name The Website Appraisal as the current offer.
9. **Product-contract test** — `node --test scripts/test-product-contract.mjs`
   → 8/8 pass (including the "known bad shape" fixtures proving the guard
   rejects the regressions it guards, and the `WEBSITE_STORED`
   boundary-disclosure assertion).
10. **Site-wide checker** — `node scripts/check-site.mjs` → "TinyStudio.io
    checks passed."

## Verification live (2026-08-17)

- `https://tinystudio.io/` — HTTP 200, titles "TinyStudio — The Website
  Appraisal" with zero Agent Desk / self-serve mentions in the landing
  copy.
- `https://tinystudio.io/llms.txt` — HTTP 200, opens "TinyStudio's current
  offer: The Website Appraisal"; the Legacy Self-Serve Agent Desk section
  states "is demoted and is not the product TinyStudio sells".
- `https://tinystudio.io/offer.md` — HTTP 200, titled "The Website
  Appraisal"; the demotion line ("is demoted and is not the current
  offer") is intact.

## Files changed

- `docs/evidence/product-contract-round1-harvest-2026-08-17.md` — new
  evidence receipt recording the 2026-08-17 re-verification on the current
  head and live site (the lane's claimed file).
- `.lane/reports/docs/evidence-product-contract-round1-harvest-2026-08-17.md`
  — this lane report.

## Verification commands

- `git show origin/main:specs/004-website-appraisal/plan.md` — opens with
  `> **Status: CURRENT.**`.
- `git show origin/main:specs/001-public-buyer-page/plan.md` and
  `…/002-minimal-input-agent-desk/plan.md` — open with
  `> **Status: HISTORICAL — retired.**`.
- `git show origin/main:specs/003-wellness-clinic-launch/plan.md` — opens
  with `> **Status: SUPERSEDED — historical campaign plan.**`.
- `node --test scripts/test-product-contract.mjs` → 8/8 pass.
- `node scripts/check-site.mjs` → exit 0, "TinyStudio.io checks passed."
- `curl -sI -w "%{http_code}\n" https://tinystudio.io/` →
  `200`; `/llms.txt` and `/offer.md` likewise `200`.

## Honest boundary

This lane claims no behavioural change in the public surface. The
retired `/agent-desk` page and the legacy `/api/agent-audit` endpoint
remain operational as legacy mechanics, exactly as the current plan's
"Legacy Mechanics (retired, still operational)" section describes. This
lane makes no claim about pricing/legal prose (owned by `pricing.html`),
no claim about runtime behaviour of `src/worker.js` (owned by the
application test suite), and no claim about any engine's answer to a
question about TinyStudio. The receipt confirms the **abandoned
round-1 candidate work** is fully represented in current main, the
**repository product contract** is The Website Appraisal, the **retired
Agent Desk framing** is gone from the top-level truth files, and the
**deterministic contract guard** still rejects the regressions it guards.
