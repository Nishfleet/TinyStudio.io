# Product-contract candidate round 1: harvest re-verification

Date: 2026-08-14
Scope: re-verify the abandoned round-1 candidate work for the finding
`f168b00e05` ("repository product contract still identifies the retired
Agent Desk as current") against the current `origin/main` and live, so the
tracker item stays closed against drift and cannot re-open.

This receipt extends `product-contract-round1-harvest-2026-08-11.md` (the
lane-1 worktree closeout), `product-contract-round1-candidates-2026-08-12.md`
(the seven-candidate closeout), and
`product-contract-round1-harvest-2026-08-13.md` (the previous re-verification)
onto the current main (`c4475858`) and live (2026-08-14).

## What the abandoned round held

Per the continuity line in
`agent-state/tinystudio-io-improvement-loop/retired-cycles.md` (retired
2026-08-10T00:45:33), the round spanned eight worktrees:

- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-20260810-{1,2,3,4,5}`
- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-refine-20260810-{1,2}`
- `/home/nish/workspaces/agent-worktrees/tinystudio-io-lane1-20260810-004533`
  (branch `improve/repository-product-contract-a121ce8c`, HEAD `96a10b3`)

Re-checked on 2026-08-14:

- Every candidate worktree's branch is pushed to `origin/candidate/*` and in
  sync; the only uncommitted item in each is a deleted Python bytecode cache
  (`study/__pycache__/harvest.cpython-312.pyc`), a build artifact with no
  content. No finished-but-uncommitted product work exists to rescue.
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
2026-08-13) confirmed the work is fully represented in main.

## Verification on the current head (`c4475858`, 2026-08-14)

Content diff of the abandoned uncommitted state against current `origin/main`:

- `specs/004-website-appraisal/plan.md`: clean diff. The Boundaries
  paragraph (line 38) is byte-identical to the draft — the `/api/signups`
  storage disclosure is present verbatim ("stores the submitted email and
  the normalized submitted website URL in D1 alongside lightweight request
  metadata … the website URL is used for appraisal and request handling").
- `scripts/test-product-contract.mjs`: main carries a refactored superset of
  the draft. Every semantic the draft added is in main:
  - bounded leading-banner status declaration (`hasLeadingStatus`, lines
    98–104, anchored on `>` plus optional bold plus terminator — period, em
    dash, bold close, or line end);
  - per-claim `AGENT_DESK_ACTIVE_PATTERNS` evaluation with the same
    clause-scope negation rule, iterating `matchAll` rather than only the
    first match (lines 134–156);
  - negation-precedes-term guarantee check using `clause.slice(0,
    term.index)` scoping (line 231);
  - `WEBSITE_STORED`/`WEBSITE_NOT_STORED` disclosure guards (lines 252–259).
  The draft's `matchAll` loop, in the abandoned worktree, additionally
  builds a fresh global regex from `pattern.source` per iteration; main's
  loop implementation is semantically equivalent (main uses non-global
  patterns and rebuilds the iterator).
- Repository-descriptor drift between PR #58 (`11864a7`) and current main:
  only toolchain/feature commits; zero contract drift. README, MEMORY, and
  package.json still name The Website Appraisal as the current offer.

Contract truth on current main:

- `specs/001-public-buyer-page/plan.md` — `Status: HISTORICAL`;
- `specs/002-minimal-input-agent-desk/plan.md` — `Status: HISTORICAL`;
- `specs/003-wellness-clinic-launch/plan.md` — `Status: SUPERSEDED`;
- `specs/004-website-appraisal/plan.md` — `Status: CURRENT`.

Test suite on a fresh `origin/main` checkout (`c4475858`):

- `npm run check` — "TinyStudio.io checks passed."
- `npm run test:contract` — 8/8 (including the "known bad shape" fixtures
  proving the guard rejects the regressions it guards, and the
  `WEBSITE_STORED` boundary-disclosure assertion).

## Verification live (2026-08-14)

- `https://tinystudio.io/` — 200, titles "TinyStudio — The Website
  Appraisal" with zero Agent Desk / self-serve mentions in the landing copy.
- `https://tinystudio.io/llms.txt` — 200, opens "TinyStudio's current
  offer: The Website Appraisal" and the Legacy Self-Serve Agent Desk
  section states "is demoted and is not the product TinyStudio sells".
- `https://tinystudio.io/offer.md` — 200, titled "The Website Appraisal",
  and the demotion line ("is demoted and is not the current offer") is
  intact.

## Conclusion

Nothing further to change. The abandoned round-1 candidate work is fully
represented in current main and live: the repository product contract no
longer identifies the retired Agent Desk as current (README/MEMORY/
package.json name The Website Appraisal; specs 001/002 HISTORICAL, spec
003 SUPERSEDED, spec 004 CURRENT), the review-gap contract-guard
refinements from the abandoned uncommitted draft are landed on
`origin/main` (`c4475858`), the deterministic guard passes 8/8, the full
check suite passes, and the live surfaces verify the current truth. The
tracker item `f168b00e05` can be ticked with reason: "round-1 candidate
work harvested through PR #58 and re-verified against `c4475858` and live
on 2026-08-14; nothing further to change."
