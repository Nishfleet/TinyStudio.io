# Duplicate heading-hierarchy PRs — GitHub-state re-verification and closeout

Date: 2026-08-11
Scope: the review item "Two open PRs carry the same heading-hierarchy fix —
PR #22 is conflict-locked and superseded" (review queue, unreviewed-by-grok),
re-verified against the GitHub repository state on 2026-08-11.
This receipt records a state verification of the repository's pull requests.
It is process evidence, not a live-site measurement; the site-side
verification of the heading fix itself is the separate receipt
`docs/evidence/heading-hierarchy-2026-08-09.md` (closeout re-verified
2026-08-11, merged via PR #74).

A first closeout of this item was written on 2026-08-09
(`docs/evidence/duplicate-heading-prs-2026-08-09.md`, branch
`docs/evidence/review-duplicate-heading-prs-closeout`, still-open PR #51).
That receipt was never merged, and its open-PR snapshot ("five open PRs:
#43, #45, #47, #49, #50") is stale — 26 PRs are open today. This receipt
re-verifies every claim of the item and of the 2026-08-09 receipt against
the current GitHub state and supersedes it.

## What the item claimed

- Two open PRs carried the same heading-hierarchy fix.
- PR #22 was conflict-locked and superseded.

## What the re-verification found (GitHub, 2026-08-11)

### The item's historical premise was accurate

Two PRs carrying the same heading-hierarchy fix were open simultaneously from
2026-08-08T23:51Z (creation of #27) until 2026-08-09T07:47Z (closure of both):
PR #22 (`fix/heading-hierarchy`, created 2026-08-08T19:33Z) and PR #27
(`fix/heading-hierarchy-cleanup`, created 2026-08-08T23:51Z). Both retagged
the skipped heading levels on the public pages.

### Every PR that carries or carried the heading-hierarchy fix, current state

| PR | head branch | title | state (2026-08-11) |
|---|---|---|---|
| #22 | `fix/heading-hierarchy` | fix(public): repair heading hierarchy without visual changes | CLOSED 2026-08-09T07:47:44Z, never merged; `mergeStateStatus: DIRTY` (`mergeable: CONFLICTING`) — conflict-locked, as the item said |
| #27 | `fix/heading-hierarchy-cleanup` | fix(public): remove heading-level skips on home and sibling pages | CLOSED 2026-08-09T07:47:46Z, never merged; `mergeStateStatus: DIRTY` |
| #28 | `fix/heading-hierarchy-complete` | fix(public): heading hierarchy cleanup on home and all six served pages | MERGED 2026-08-09T05:10:58Z (commit 7be3d8f) — the superseding fix |
| #40 | `docs/evidence/heading-hierarchy-closeout` | docs(evidence): close out heading-hierarchy finding e6e153bdadd0 against current main and live | MERGED 2026-08-09T11:10:51Z |

The item's description of PR #22 was accurate: it was conflict-locked
(`DIRTY`/`CONFLICTING`, never mergeable) and it was superseded — its own fix
shape landed via PR #28, which carries the same retagging plus the regression
test (`scripts/test-heading-hierarchy.mjs`, wired into `npm test` as
`test:headings`) that PR #22 lacked.

### No open PR currently carries the heading-hierarchy fix

All 26 open PRs on 2026-08-11 (numbers 43, 45, 47, 49, 50, 51, 52, 53, 54,
55, 57, 59, 60, 61, 62, 67, 68, 71, 72, 73, 75, 83, 84, 85, 86, 88) were
diff-reviewed for this receipt:

- zero added or removed `<h1>`–`<h6>` tags in any HTML file (the only
  `<h[1-6]>` matches in any open-PR diff are prose mentions inside
  `docs/evidence/fleet-release-2026-08-09.md`, PR #55 — not markup);
- zero changes to `scripts/test-heading-hierarchy.mjs` or to the
  `test:headings` wiring in `package.json`.

So the item's premise no longer holds: there are no two open PRs carrying
the same heading-hierarchy fix. The two duplicates are closed and the
canonical fix is merged.

### Current main carries exactly one heading fix, unchanged since the merge

- Every commit on main touching `public/*.html` since the fix merged
  (7be3d8f, PR #28, 2026-08-09) was checked: zero `<h1>`–`<h6>` line
  changes. The commits in that window (39a6238, b004c11, fa8d83c, aa64d7d,
  a163327, c5e2f2b, ac05bec, f9f0b0f, 1cc7a4e) are canonical/JSON-LD,
  sitemap, structured-data, icon, Agent Desk, tap-target and footer-link
  changes — none touches a heading tag.
- Source checks on current origin/main head (d70bea0, "docs(service):
  re-verify truthful manual Clutch profile handoff against current main and
  live (#87)"): `npm run check` passes ("TinyStudio.io checks passed"), and
  `npm run test:headings` passes 6/6 — each of the six served pages matches
  its locked corrected outline and the checker rejects the pre-fix shapes.
- The heading fix itself was re-verified against the live deployment on
  2026-08-11 in `docs/evidence/heading-hierarchy-2026-08-09.md` (PR #74):
  all six served pages descend without skipped levels, exactly one leading
  `h1`.

## What closes the item

- The conflict-locked duplicate (PR #22) and its sibling duplicate (PR #27)
  are closed.
- The superseding fix (PR #28) is merged on main: sub-headings retagged one
  level shallower, CSS selectors retargeted with identical values, and a
  deterministic regression test that locks the corrected outline of each of
  the six served pages and rejects the pre-fix shapes.
- No open PR currently duplicates the heading-hierarchy fix (26 open PRs
  diff-reviewed 2026-08-11; zero heading-tag changes anywhere).
- Main has carried exactly one heading fix since 2026-08-09: no commit since
  the merge touches a single `<h1>`–`<h6>` line, `npm run check` passes, and
  `test:headings` passes 6/6 on the current head.
- The site-side verification remains current via
  `docs/evidence/heading-hierarchy-2026-08-09.md` (re-verified 2026-08-11,
  PR #74).

## Closeout

This closes the review item "Two open PRs carry the same heading-hierarchy
fix — PR #22 is conflict-locked and superseded" against current GitHub
state (2026-08-11): the duplicate open PRs are closed, the conflict-locked
PR #22 was superseded by the merged PR #28, and no open PR currently
duplicates the heading-hierarchy fix. No code change is needed or proposed:
the repository already carries exactly one heading-hierarchy fix on main,
gated by a passing regression test and verified on the live deployment.
This receipt supersedes the stale 2026-08-09 closeout
(`docs/evidence/duplicate-heading-prs-2026-08-09.md`, PR #51), whose open-PR
snapshot no longer reflects the repository.
