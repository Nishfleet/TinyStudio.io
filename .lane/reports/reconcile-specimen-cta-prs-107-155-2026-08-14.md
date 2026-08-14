# Lane report: reconcile/specimen-cta-prs-107-155-2026-08-14

Date: 2026-08-14
Lane: tinystudio-io lane 1
Item: "[unreviewed-by-opus] Reconcile the duplicate specimen-CTA PRs
#107/#155 — byte-identical specimen.html band hunks"

## What I did

Investigated the two-PR cluster against live GitHub state and found the
premise had fully decayed — the fix has already landed and the cluster is
already resolved:

- **#107** (`fix/specimen-conversion-cta`): CLOSED 2026-08-14, never
  merged. Its branch went conflict-locked against main; PR #155's
  supersession note documents this.
- **#155** (`fix/specimen-conversion-cta-lane1`): **MERGED into main**
  2026-08-13 as commit `b81281f` ("fix(public): add in-content conversion
  CTA to the /specimen proof page (#155)").
- No open PR carries the fix: `gh pr list` shows no specimen-CTA delivery
  path in the open set. This differs from the pricing-callout cluster
  (#68/#114), where the fix had NOT yet landed and a surviving open PR
  (#194) needed to be named.

Verified the duplicate claim from the item: the two branches' hunks to
`public/specimen.html` are byte-identical. `git diff` of each branch
against its own merge-base (only the diff header/index lines differ, which
is expected since the branches were cut from different main bases; the
content hunks match exactly):

- #107: `@@ -130,6 +130,13 @@` — adds the `.band` block (h2, copy,
  `<a class="cta" href="/#start">Request the appraisal</a>`, note).
- #155: `@@ -131,6 +131,13 @@` — the identical block, same 7 added lines
  (one-line context shift because main moved between the two cuts).

Confirmed the survivor is on main and deployed:

- `git merge-base --is-ancestor b81281f origin/main` → true (origin/main
  head `d981610`, 2026-08-14).
- Live `https://tinystudio.io/specimen` serves the `.band`, the CTA
  labelled "Request the appraisal", and the `/#start` target (verified by
  fetch, 2026-08-14).
- `npm run check` and `npm test` pass on origin/main (head `d981610`),
  including the static source guard in `scripts/check-site.mjs` ("Specimen
  in-content conversion CTA" block) that fails CI if the band, CTA, note,
  or >=44px tap target regress.

## Actions

- No GitHub state change was needed: #155 is merged, #107 is already
  closed, and no open duplicate delivery path survives.
- Recorded the reconciliation closeout as evidence so the review queue
  item can be closed as already resolved.

## Evidence

- docs/evidence/specimen-cta-prs-107-155-closeout-2026-08-14.md (this PR)
