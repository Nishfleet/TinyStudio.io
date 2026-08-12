# Duplicate heading-hierarchy PRs — GitHub-state re-verification and closeout (2026-08-12)

Date: 2026-08-12
Scope: the review item "Two open PRs carry the same heading-hierarchy fix —
PR #22 is conflict-locked and superseded" (review queue, unreviewed-by-grok),
re-verified against the GitHub repository state on 2026-08-12.
This receipt records a state verification of the repository's pull requests.
It is process evidence, not a live-site measurement; the site-side
verification of the heading fix itself is the separate receipt
`docs/evidence/heading-hierarchy-2026-08-09.md`, whose 2026-08-12 re-verify
against current main and live is in-flight as PR #120
(`docs/evidence/heading-hierarchy-reverify-2026-08-12`).

Prior closeouts of this item: `docs/evidence/duplicate-heading-prs-2026-08-09.md`
(PR #51, merged 2026-08-11) and `docs/evidence/duplicate-heading-prs-2026-08-11.md`
(PR #89, merged 2026-08-11). Both are on main. This receipt re-verifies every
claim of the item against the current GitHub state (2026-08-12) and supersedes
them; its open-PR snapshot is current as of this date.

## What the item claimed

- Two open PRs carried the same heading-hierarchy fix.
- PR #22 was conflict-locked and superseded.

## What the re-verification found (GitHub, 2026-08-12)

### The item's historical premise was accurate

Two PRs carrying the same heading-hierarchy fix were open simultaneously from
2026-08-08T23:51Z (creation of #27) until 2026-08-09T07:47Z (closure of both):
PR #22 (`fix/heading-hierarchy`, created 2026-08-08T19:33Z) and PR #27
(`fix/heading-hierarchy-cleanup`, created 2026-08-08T23:51Z). Both retagged
the skipped heading levels on the public pages.

### Every PR that carries or carried the heading-hierarchy fix, current state

| PR | head branch | title | state (2026-08-12) |
|---|---|---|---|
| #22 | `fix/heading-hierarchy` | fix(public): repair heading hierarchy without visual changes | CLOSED 2026-08-09T07:47:44Z, never merged; `mergeStateStatus: DIRTY` (`mergeable: CONFLICTING`) — conflict-locked, as the item said |
| #27 | `fix/heading-hierarchy-cleanup` | fix(public): remove heading-level skips on home and sibling pages | CLOSED 2026-08-09T07:47:46Z, never merged; `mergeStateStatus: DIRTY` |
| #28 | `fix/heading-hierarchy-complete` | fix(public): heading hierarchy cleanup on home and all six served pages | MERGED 2026-08-09T05:10:57Z (commit 7be3d8f) — the superseding fix |
| #40 | `docs/evidence/heading-hierarchy-closeout` | docs(evidence): close out heading-hierarchy finding e6e153bdadd0 against current main and live | MERGED 2026-08-09T11:10:51Z |

The item's description of PR #22 was accurate: it was conflict-locked
(`DIRTY`/`CONFLICTING`, never mergeable) and it was superseded — its own fix
shape landed via PR #28, which carries the same retagging plus the regression
test (`scripts/test-heading-hierarchy.mjs`, wired into `npm test` as
`test:headings`) that PR #22 lacked. No new commit has reopened PR #22's or
#27's branches into a live duplicate: both remain closed.

### No open PR currently carries the heading-hierarchy fix

All 53 open PRs on 2026-08-12 (numbers 45, 49, 50, 55, 57, 62, 67, 71, 83, 84,
91, 95, 103, 107, 111, 112, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138,
139, 140, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151) were diff-reviewed
for this receipt. Exactly two open PRs add literal heading markup anywhere,
and neither retags an existing level:

- PR #107 (`fix/specimen-conversion-cta`) adds one new top-level `<h2>` to
  `/specimen` (in-content conversion band). It is hierarchy-preserving: the
  band sits after the last section, the outline stays gap-free
  (`[1, 2, 2, 2, 2, 3, 2, 2]`), and its diff updates the locked outline for
  `public/specimen.html` in `scripts/test-heading-hierarchy.mjs` to include
  the additive `h2`. This is the only open PR that touches
  `scripts/test-heading-hierarchy.mjs`, and it does so in the locking
  direction, not a retag.
- PR #116 (`fix/signup-monthly-cap-lane1`) adds one `<h1>` inside a new
  self-contained 409 closed-intake response page served by the worker
  (`src/worker.js`). The page has exactly one `h1` and descends `h1 -> p -> a`
  with no skips; no served page and no heading test is touched.

Every other open-PR match for heading text is prose inside
`docs/evidence/*.md` (e.g. #55, #117, #118, #120, #139, #148 reference the
`test:headings` suite or describe the finding) — not markup, and zero open PR
retags an existing `<h1>`–`<h6>` level on any of the six served pages.

So the item's premise no longer holds: there are no two open PRs carrying
the same heading-hierarchy fix. The two duplicates are closed and the
canonical fix is merged.

### Current main carries exactly one heading fix, unchanged in shape since the merge

- Every commit on main touching `public/*.html` since the fix merged
  (7be3d8f, PR #28, 2026-08-09) was checked. Exactly one commit changed a
  heading tag: `2ae7504` (PR #102, merged 2026-08-11) added two homepage FAQ
  `h3` rows ("Is TinyStudio a conversion audit service", "Is this a
  conversion audit?"), each under an existing `h2` — a hierarchy-preserving
  addition. Its diff updates the locked `public/index.html` outline in
  `scripts/test-heading-hierarchy.mjs` (28 entries -> 30, two extra level-3s).
  No commit on main since the fix reopens a skip, drops the single leading
  `h1`, or otherwise retags a heading level.
- Source checks on current origin/main head (ad9cee3, "Merge pull request
  #43 from nish3451/fix/ai-search-rerun-entity-offer"): `npm run check`
  passes ("TinyStudio.io checks passed"), and `npm test` passes in full —
  `test:headings` 6/6 (each of the six served pages matches its locked
  corrected outline and the checker rejects the pre-fix shapes), `test:sitemap`
  7/7, `test:worker` 55/55, `test:ui` 16/16, `test:contract` 8/8.
- The heading fix's site-side verification was re-verified on 2026-08-11
  (`docs/evidence/heading-hierarchy-2026-08-09.md`, PR #74, merged). The
  2026-08-12 re-verify against current main and live (which now includes the
  two 2ae7504 FAQ `h3`s) is in flight as PR #120.

## What closes the item

- The conflict-locked duplicate (PR #22) and its sibling duplicate (PR #27)
  are closed; neither branch has been reopened.
- The superseding fix (PR #28) is merged on main: sub-headings retagged one
  level shallower, CSS selectors retargeted with identical values, and a
  deterministic regression test that locks the corrected outline of each of
  the six served pages and rejects the pre-fix shapes.
- No open PR duplicates the heading-hierarchy fix (53 open PRs diff-reviewed
  2026-08-12; the only heading markup added anywhere is one hierarchy-
  preserving `h2` on /specimen in PR #107 with its locked outline updated,
  and one standalone `h1` in PR #116's new closed-intake page — neither
  retags an existing level).
- Main has carried exactly one heading fix since 2026-08-09: the only
  heading-tag change since the merge is 2ae7504's two hierarchy-preserving
  FAQ `h3`s, `npm run check` passes, and `npm test` passes in full on the
  current head (ad9cee3).
- The site-side verification remains current via
  `docs/evidence/heading-hierarchy-2026-08-09.md` (re-verified 2026-08-11,
  PR #74) and is being re-verified against current main and live in PR #120.

## Closeout

This closes the review item "Two open PRs carry the same heading-hierarchy
fix — PR #22 is conflict-locked and superseded" against current GitHub
state (2026-08-12): the duplicate open PRs are closed, the conflict-locked
PR #22 was superseded by the merged PR #28, and no open PR currently
duplicates the heading-hierarchy fix. No code change is needed or proposed:
the repository already carries exactly one heading-hierarchy fix on main,
gated by a passing regression test and verified on the live deployment.
This receipt supersedes the 2026-08-11 closeout
(`docs/evidence/duplicate-heading-prs-2026-08-11.md`, PR #89) and the stale
2026-08-09 closeout (`docs/evidence/duplicate-heading-prs-2026-08-09.md`,
PR #51), whose open-PR snapshots no longer reflect the repository.
