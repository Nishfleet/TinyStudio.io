# Duplicate heading-hierarchy PRs — GitHub-state verification and closeout

Date: 2026-08-09
Scope: the review item "Two open PRs carry the same heading-hierarchy fix — PR
#22 is conflict-locked and superseded" (review queue, unreviewed-by-grok),
verified against the GitHub repository state on 2026-08-09.
This receipt records a state verification of the repository's pull requests.
It is process evidence, not a live-site measurement; the site-side
verification of the heading fix itself is the separate receipt
`docs/evidence/heading-hierarchy-2026-08-09.md` (merged via PR #40).

## What the item claimed

- Two open PRs carried the same heading-hierarchy fix.
- PR #22 was conflict-locked and superseded.

## What the verification found (GitHub, 2026-08-09)

Every pull request that carries or carried the heading-hierarchy fix, in
order of creation:

| PR | head branch | title | state |
|---|---|---|---|
| #22 | `fix/heading-hierarchy` | fix(public): repair heading hierarchy without visual changes | CLOSED, never merged; `mergeStateStatus: DIRTY` (`mergeable: CONFLICTING`) at close |
| #27 | `fix/heading-hierarchy-cleanup` | fix(public): remove heading-level skips on home and sibling pages | CLOSED, never merged |
| #28 | `fix/heading-hierarchy-complete` | fix(public): heading hierarchy cleanup on home and all six served pages | MERGED into main 2026-08-09T05:10Z |
| #40 | `docs/evidence/heading-hierarchy-closeout` | docs(evidence): close out heading-hierarchy finding e6e153bdadd0 against current main and live | MERGED |

Timeline of the duplicate PRs: #22 was created 2026-08-08T19:33Z and closed
2026-08-09T07:47Z; #27 was created 2026-08-08T23:51Z and closed
2026-08-09T07:47Z. The superseding fix (PR #28) merged at 05:10Z, before
either duplicate was closed.

Current open PRs (five: #43, #45, #47, #49, #50) were diff-reviewed for this
receipt: none adds, removes or retags any `h1`–`h6` element, so no open PR
currently carries the heading-hierarchy fix.

Two findings against the item:

1. The item's premise no longer holds: there are no two open PRs carrying
   the same heading-hierarchy fix. The two duplicates are closed and the
   canonical fix is merged.
2. The item's description of PR #22 was accurate: it was conflict-locked
   (`DIRTY`/`CONFLICTING`, never mergeable) and it was superseded — its own
   fix shape landed via PR #28, which carries the same retagging and the
   regression test that PR #22 lacked.

## What closes the item

- The conflict-locked duplicate (PR #22) and its sibling duplicate (PR #27)
  are closed.
- The superseding fix (PR #28) is merged on main: sub-headings retagged one
  level shallower, CSS selectors retargeted with identical values, and a
  deterministic regression test (`scripts/test-heading-hierarchy.mjs`, wired
  into `npm test` as `test:headings`) that locks the corrected outline of
  each of the six served pages and rejects the pre-fix shapes.
- The fix is verified against the live deployment in
  `docs/evidence/heading-hierarchy-2026-08-09.md` (merged via PR #40): all
  six served pages descend without skipped levels, exactly one leading `h1`.
- Current main was verified in this lane on 2026-08-09: `npm run check`
  passes, and `npm test` passes in full, including `test:headings` 6/6
  (each owned public page has a correct heading outline; each matches its
  locked corrected outline; the checker rejects the pre-fix shapes).
- Observation, no action taken: the remote branches of the closed duplicate
  PRs (`fix/heading-hierarchy`, `fix/heading-hierarchy-cleanup`) still exist
  on origin. This repository routinely retains branches of closed PRs
  (several older closed-PR branches remain on origin), and deleting them is
  outside this lane's scope; they have no open PR and cannot be merged.

## Closeout

This closes the review item "Two open PRs carry the same heading-hierarchy
fix — PR #22 is conflict-locked and superseded" against current GitHub
state: the duplicate open PRs are closed, the conflict-locked PR #22 was
superseded by the merged PR #28, and no open PR currently duplicates the
heading-hierarchy fix. No code change is needed or proposed: the repository
already carries exactly one heading-hierarchy fix on main, gated by a
passing regression test and verified on the live deployment.
