# Lane report: reconcile/pricing-callout-prs-68-114-2026-08-14

Date: 2026-08-14
Lane: tinystudio-io lane 1
Item: "[unreviewed-by-opus] Reconcile the byte-identical duplicate
pricing-callout PRs #68/#114 — two MERGEABLE open PRs"

## What I did

Investigated the two-PR cluster against live GitHub state and found the
premise had decayed since the 2026-08-12 reconciliation (PR #144):

- #68: closed 2026-08-12, never merged (stale duplicate, per PR #144).
- #114: still open but CONFLICTING — its branch had accumulated 33 commits
  of automated main-merges and `scripts/check-site.mjs` now conflicts with
  main in the guard region.
- #194 (created today): fresh re-land of the byte-identical fix on a branch
  from current origin/main, MERGEABLE/CLEAN.

Verified the production diff is identical across #114 and #194
(`public/pricing.html` +5, `scripts/check-site.mjs` +27; only a guard
comment word and #194's lane report differ). Ran `npm run check` and
`npm test` on #194's tree — all green (the sole viewport "failure" is the
pre-existing out-of-scope `/` @ 240px note).

## Actions

- Closed PR #114 with a comment naming #194 as the surviving delivery path.
- Kept #194 open as the single delivery path; the fix is still not on main
  and awaits the governed review pipeline.

## Evidence

- docs/evidence/duplicate-pricing-callout-prs-closeout-2026-08-14.md
  (this PR)
