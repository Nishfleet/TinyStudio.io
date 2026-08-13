# Product-contract candidate round 1: harvest re-verification

Date: 2026-08-13
Scope: re-verify the abandoned round-1 candidate worktree
`/home/nish/workspaces/agent-worktrees/tinystudio-io-lane1-20260810-004533`
(branch `improve/repository-product-contract-a121ce8c`, HEAD `96a10b3`)
against the current `origin/main` and live, so the tracker item
`f168b00e05` ("repository product contract still identifies the retired
Agent Desk as current") stays closed against drift and cannot re-open.

This receipt extends `product-contract-round1-harvest-2026-08-11.md` (the
lane-1 worktree closeout) and `product-contract-round1-candidates-2026-08-12.md`
(the seven-candidate closeout) onto the current main and live.

## Source of truth being verified

The abandoned round-1 lane had two intended uncommitted refinements on
top of `96a10b3`:

1. `scripts/test-product-contract.mjs` — a review-gap hardening draft:
   - `hasLeadingStatus` tightened so the marker only counts as the
     leading banner's actual bounded status declaration, not prose that
     merely mentions it ("Previously Status: CURRENT; now retired."
     does not declare status);
   - every active Agent Desk claim on a line is evaluated (`matchAll`
     over `AGENT_DESK_ACTIVE_PATTERNS`), so a negated first clause cannot
     hide a later positive claim;
   - the Boundaries guarantee guard requires the explicit negation to
     precede the guarantee/promise term inside the same clause
     (`clause.slice(0, term.index)`), so "We guarantee ten booked calls,
     with no refunds." is rejected;
   - a new `WEBSITE_STORED` guard asserting the current plan's Boundaries
     disclose that `/api/signups` persists the normalized submitted
     website URL in D1, not just the email.
2. `specs/004-website-appraisal/plan.md` — the Boundaries bullet
   rewritten to disclose that `/api/signups` stores the submitted email
   and normalized website URL in D1 alongside request metadata, while
   submitted page content and media are processed and not stored.

The only other uncommitted item in the worktree is a deleted Python
bytecode cache (`study/__pycache__/harvest.cpython-312.pyc`), a build
artifact with no content. No finished-but-uncommitted product work was
held in the worktree to be rescued.

## Where the same work landed

The abandoned round-1 lane's committed work (`docs(contract)` and the
contract-guard test commits, later reworked and pushed as
`origin/improve/repository-product-contract-a121ce8c` @ `8dffdce`) was
harvested through PR #58 (`11864a7`, "docs(contract): make the Website
Appraisal the active repo truth", merged 2026-08-10). Content diff of
the abandoned uncommitted state (`939e6c4`) against the squashed merge
is empty for the contract-bearing files; review-gap refinements in
`scripts/test-product-contract.mjs` were folded into the same branch as
subsequent commits (`4d6d6f4` reject contradictory truth, `65a713d`
reject mixed positive guarantees, `96a10b3` scope contradiction checks
to each claim).

## Verification on the current head (`47537d6`, 2026-08-13)

Content diff of the abandoned uncommitted state against the current
`origin/main`:

- `specs/004-website-appraisal/plan.md`: clean diff. The Boundaries
  paragraph on line 38 is byte-identical to the draft — the
  `/api/signups` storage disclosure is present verbatim ("stores the
  submitted email and the normalized submitted website URL in D1
  alongside lightweight request metadata … the website URL is used for
  appraisal and request handling").
- `scripts/test-product-contract.mjs`: main carries a refactored
  superset of the draft. Every semantic the draft added is in main:
  - bounded leading-banner status declaration implemented as a regex
    anchored on `>` plus optional bold plus terminator (period, em dash,
    bold close, or end of line) at lines 94–104;
  - per-claim `AGENT_DESK_ACTIVE_PATTERNS` evaluation with the same
    clause-scope negation rule, iterating `matchAll` rather than only
    the first match at lines 148–162;
  - negation-precedes-term guarantee check using `clause.slice(0,
    term.index)` style scoping at lines 220–250;
  - `WEBSITE_STORED` and `WEBSITE_NOT_STORED` disclosure guards at
    lines 252–259, asserted at line 339.
- Repository-descriptor drift between PR #58 (`11864a7`) and current
  main: the only delta is the wrangler devDependency bump
  (`^4.93.0` → `^4.120.1`, package.json lines 28). Zero contract drift.

Test suite on a fresh `origin/main` checkout (`47537d6`):

- `node scripts/check-site.mjs` — "TinyStudio.io checks passed."
- `node --test scripts/test-heading-hierarchy.mjs` — 6/6
- `node --test scripts/test-sitemap.mjs` — 7/7
- `node --test scripts/test-product-contract.mjs` — 8/8 (including the
  "known bad shape" fixtures proving the guard rejects the regressions
  it guards, and the `WEBSITE_STORED` boundary-disclosure assertion at
  line 339);
- `node --test scripts/test-agent-worker.mjs` — 72/72;
- `node --test scripts/test-agent-ui.mjs` — 16/16.
- 109 tests pass, exit 0, zero `not ok`.

## Verification live (2026-08-13)

- `https://tinystudio.io/` titles "TinyStudio — The Website Appraisal"
  with zero Agent Desk / self-serve mentions in the landing copy.
- `https://tinystudio.io/llms.txt` opens "TinyStudio's current offer:
  The Website Appraisal" and the Legacy Self-Serve Agent Desk section
  states "is demoted and is not the product TinyStudio sells".
- `https://tinystudio.io/offer.md` is titled "The Website Appraisal"
  and the demotion line ("is demoted and is not the current offer") is
  intact.

## Conclusion

Nothing further to change. The abandoned round-1 candidate work is
fully represented in current main and live: the repository product
contract no longer identifies the retired Agent Desk as current, the
review-gap contract-guard refinements from the abandoned uncommitted
draft are landed on `origin/main` (`47537d6`), the deterministic guard
passes 8/8, and the full suite (109 tests) plus live surfaces verify
the current truth. The tracker item `f168b00e05` can be ticked with
reason: "round-1 candidate work harvested through PR #58 and
re-verified against `47537d6` and live; nothing further to change."
