# Lane 1 — re-reconcile agent-desk-canonical PRs to survivor #91 (2026-08-14)

Branch: `docs/agent-desk-canonical-pr-reconcile-2026-08-14`
Item: `[unreviewed-by-opus] Reconcile the THREE open agent-desk-canonical PRs #91/#131/#138 — #105's declared survivor #9`

## Finding

The 2026-08-12 reconcile (PR #157) already closed #131/#138 and refreshed
#91, but the item remained queued `[unreviewed-by-opus]` and the cluster had
regrown:

- **PR #187** opened 2026-08-14 re-delivering the identical
  `public/agent-desk.html` + guard fix on a fresh base, with "whichever
  lands first, close the other" in its body — two open delivery paths again.
- **PR #91** (declared survivor) was 1 main commit behind, un-reverified
  against the newest main.
- The fix is still unlanded: main and live `/agent-desk` both serve
  `canonical https://tinystudio.io/` + `og:url https://tinystudio.io/`.

## Actions

1. Refreshed #91 onto current origin/main HEAD (merge 2825df8, pushed).
2. Closed #187 as superseded, comment naming #91 as the surviving path.
3. Evidence receipt: `docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-14.md`.

## Verification

- `git diff origin/fix-91 origin/fix-187 -- public/agent-desk.html` → empty
  (byte-identical fix).
- Guard code identical between branches; only a preceding comment's prose
  differs.
- `git merge origin/main` into #91 branch → clean, no conflicts.
- `npm run check` / `npm test` on refreshed #91 tree → green.
- Live `/agent-desk` (307 → .html, 200) still serves the apex canonical.

## Outcome

Single delivery path: **#91**, mergeable on current main, awaiting merge.
Surface stays open until #91 merges.
