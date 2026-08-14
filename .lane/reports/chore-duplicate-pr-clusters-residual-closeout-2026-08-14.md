# Lane report: duplicate open-PR clusters residual closeout (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `chore/duplicate-pr-clusters-residual-closeout-2026-08-14`
Item: f3c90474c1 — "Reconcile the two residual duplicate fix-PR clusters after #105 — brief-requested clean links"

## Outcome

**Closed.** The two residual post-#105 duplicate fix-PR clusters are fully
reconciled to terminal state. Cluster 1 (brief-requested clean links) had
its surviving delivery path #145 merged to main as `f9214c1`
(2026-08-14T09:42:02Z); the fix and its regression guard now live on
`origin/main` (`5eefa80`). Cluster 2 (rel=icon favicon) was delivered via
#85 (`9302611`) and #113 (`18128e8`). Verified on this run: no open PR
carries either fix, main carries both, `npm run check` and `npm test` green
on a fresh main tree, and the live site serves the clean anchors with no
`.html` hrefs. No code change was needed — opening a duplicate would have
recreated the cluster the fleet reconciled. This lane records the
authoritative closeout receipt.

## Verification performed

1. **GitHub state**: #145, #85, #113 MERGED; #60, #97, #47 CLOSED with
   survivor-naming comments (confirmed via `gh pr list --state all`).
2. **Open-PR scan** (19 open PRs): no open PR touches the clean-links
   anchors or the five-page favicon links. #112/#114/#154 touch
   `brief-requested.html`/`check-site.mjs` for different fixes (footer
   brand, pricing callout, intake labels).
3. **Main tree** (fresh `5eefa80`): clean anchors + guard entry present;
   exactly one `rel=icon` on all five public pages.
4. **`npm run check`** on fresh main tree → "TinyStudio.io checks passed."
5. **`npm test`** on fresh main tree → exit 0, all suites green; only the
   pre-existing out-of-scope `/` @ 240px overflow note (does not gate).
6. **Live probes**: `/brief-requested` 200 with zero `.html` hrefs; the
   `.html` twins still 307 to their clean forms (worker shim unchanged).

## Files changed

- `docs/evidence/duplicate-open-pr-clusters-residual-closeout-2026-08-14.md`
  — new evidence receipt recording the final closeout of both residual
  clusters (the lane's claimed file).

## Delivery

- Branch: `chore/duplicate-pr-clusters-residual-closeout-2026-08-14`
- PR: **#196** opened against origin/main carrying the evidence closeout
  (commit `32e7d11`, 2026-08-14).
