# Lane 1 report — reconcile duplicate specimen-CTA PRs #107/#155 (2026-08-21)

Item: `[unreviewed-by-opus] Reconcile the duplicate specimen-CTA PRs #107/#155 — byte-identical specimen.html band hunks`

## Outcome

The cluster is **already reconciled on current GitHub state**; the fix is on
main and live, and no open PR carries it. This report re-verifies that state
on today's main (head `92d55c3`) and records the verification as the lane's
evidence. No code change was needed.

## What the duplicate was

- **PR #107** (`fix/specimen-conversion-cta`) — opened 2026-08-11, carried the
  in-content conversion CTA band for `/specimen`. Conflict-locked (DIRTY)
  against main since 2026-08-11.
- **PR #155** (`fix/specimen-conversion-cta-lane1`) — opened 2026-08-12 as the
  superseding branch cut fresh from main, **merged 2026-08-13** (commit
  `b81281f`, merge `0ff0694`... verified `git merge-base --is-ancestor`).
- **PR #107** closed 2026-08-14 without merging.

Both branches added the identical `.band` block: h2, four-passes copy,
`<a class="cta" href="/#start">Request the appraisal</a>`, and the
no-guarantees `.note`.

## Byte-identical band verification (2026-08-21)

Extracted the `.band` hunk from `public/specimen.html` on three refs:

| Ref | Band hunk vs main |
|---|---|
| `15472129` (#107 head `91f0eaf`) | IDENTICAL |
| `99830cfa` (#155 head) | IDENTICAL |
| `origin/main` (92d55c3) | — (source of truth) |

`git diff` of the band hunks: zero differences. The item's "byte-identical"
claim checks out. (The full-file diffs of the stale branches show extra
canonical-URL and study-count drift from their old merge-base — both since
resolved by later PRs — but the band hunk itself is identical.)

## Current-state verification (head 92d55c3)

- `public/specimen.html` lines 134-139 carry the `.band` CTA block between the
  report and the footer; homepage routes "Read the specimen" to `/specimen`.
- `scripts/check-site.mjs` (lines ~2021-2051) statically guards: band presence
  before footer, `.cta` link to `/#start` labelled "Request the appraisal",
  the no-guarantees note, `.band .cta` styling, and `padding:16px 24px`
  (>=44px tap target).
- `public/specimen.js` reveal-on-scroll selector includes `.band`.
- `npm run check` → "TinyStudio.io checks passed." (exit 0)
- `npm test` → all suites green (126 ok, 0 fail: headings, sitemap,
  contract, worker, ui).
- No open PR references specimen/conversion-CTA (verified via `gh pr list`).

## Prior closeout

PR **#203** (`docs/evidence`: close the duplicate specimen-CTA PR #107/#155
cluster) merged 2026-08-14 as `0ff0694`; its evidence report
`.lane/reports/reconcile-specimen-cta-prs-107-155-2026-08-14.md` and doc
`docs/evidence/specimen-cta-prs-107-155-closeout-2026-08-14.md` are both on
current main. This report confirms that closeout still holds on 2026-08-21
main.

## Conclusion

Reconciliation complete — nothing left to merge, nothing open, everything
green.
