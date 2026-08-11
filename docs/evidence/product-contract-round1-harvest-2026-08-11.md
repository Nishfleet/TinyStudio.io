# Product-contract candidate round 1: harvest closeout

Date: 2026-08-11
Scope: abandoned round-1 candidate worktree
`/home/nish/workspaces/agent-worktrees/tinystudio-io-lane1-20260810-004533`
(branch `improve/repository-product-contract-a121ce8c`, HEAD `96a10b3`) for the
finding that the repository product contract still identified the retired
Agent Desk as the current offer. This receipt records what the abandoned
round-1 lane contained, where the same work landed on main, and the fresh
verification on the current head — so the tracker item cannot re-open by
drift.

## What the abandoned round-1 lane contained

The lane's committed work (`docs(contract)` + contract-guard test commits,
later reworked and pushed as `origin/improve/repository-product-contract-a121ce8c`
@ `8dffdce`) was abandoned with two uncommitted working-tree refinements
(stash commit `939e6c4`, parent `96a10b3`):

1. `scripts/test-product-contract.mjs` — a review-gap hardening draft:
   - `hasLeadingStatus` tightened so the status marker only counts as the
     leading banner's actual bounded status declaration, not as prose that
     merely mentions the marker ("Previously Status: CURRENT; now retired."
     does not declare status);
   - every active Agent Desk claim on a line is evaluated (`matchAll` over all
     `AGENT_DESK_ACTIVE_PATTERNS`), so a negated first clause cannot hide a
     later positive claim;
   - the Boundaries guarantee guard requires the explicit negation to precede
     the guarantee/promise term inside the same clause (`clause.slice(0,
     term.index)`), so "We guarantee ten booked calls, with no refunds."
     is rejected;
   - a new `WEBSITE_STORED` guard asserting the current plan's Boundaries
     disclose that `/api/signups` persists the normalized submitted website
     URL in D1, not just the email.
2. `specs/004-website-appraisal/plan.md` — the Boundaries bullet rewritten to
   disclose that `/api/signups` stores the submitted email and normalized
   website URL in D1 alongside request metadata, while submitted page content
   and media are processed and not stored.

## Where the same work landed

The finding was harvested through later rounds and merged to main as
**PR #58** (`11864a7`, "docs(contract): make the Website Appraisal the active
repo truth", 2026-08-10): the squashed merge contains the round's docs commit
and the contract-guard test commits, including the final review-gap version
(`8dffdce` on `origin/improve/repository-product-contract-a121ce8c`) whose
content is byte-identical to main's for `scripts/test-product-contract.mjs`,
`specs/004-website-appraisal/plan.md`, `README.md`, `MEMORY.md`, and
`package.json` (clean diff).

## Verification on the current head (`1cc7a4e`, 2026-08-11)

1. Content diff of the abandoned uncommitted state (`939e6c4`) against the
   current head:
   - `specs/004-website-appraisal/plan.md`: **identical** to main (clean
     diff) — the `/api/signups` storage disclosure is present verbatim.
   - `scripts/test-product-contract.mjs`: main carries a refactored superset
     of the draft. Every semantic the draft added is in main — bounded
     leading-banner status declaration (loop implementation), per-claim Agent
     Desk evaluation with the same clause-scope negation rule, negation-
     precedes-term guarantee check, and the `WEBSITE_STORED`/`WEBSITE_NOT_STORED`
     disclosure guard — and main additionally ships regression fixtures the
     draft lacked (misleading-banner mention, bounded bold declaration,
     hidden later reactivation, comma-clause negation).
   - The only other uncommitted item in the abandoned worktree was a deleted
     Python bytecode cache file (`study/__pycache__/harvest.cpython-312.pyc`);
     build artifact, no content.
2. Test suite on the current head (fresh `origin/main`, `1cc7a4e`):
   - `npm run test:contract` — 8/8 pass (incl. the "known bad shape" fixtures
     proving the guard rejects the regressions it guards);
   - `npm run test:headings` — 6/6; `npm run test:sitemap` — 7/7;
     `npm run test:worker` — 53/53; `npm run test:ui` — 16/16;
   - `npm run check` — "TinyStudio.io checks passed."

## Conclusion

Nothing further to change. The abandoned round-1 candidate work is fully
represented in current main: the repository product contract no longer
identifies the retired Agent Desk as current (README/MEMORY/package.json name
The Website Appraisal; specs 001/002 HISTORICAL, spec 003 SUPERSEDED, spec 004
CURRENT), and the deterministic guard plus the round-1 review-gap refinements
are all present and passing on the current head.
