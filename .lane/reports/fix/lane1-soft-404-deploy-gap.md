# Lane 1 — soft-404 deploy gap (2026-08-20)

Finding: nonexistent pages on `https://tinystudio.io` historically returned a
soft-404 (the generic platform error page) instead of the branded TinyStudio
404, and the fix was deployed in a bundle that post-dated the report's original
commit reference.

## Correction (docs-only)

This report previously cited commit `a0d1de5` (2026-08-09, PR #35) as the fix
that closed the gap. That reference was wrong. The real bundle that carried the
branded 404 to production is the June-20 deploy bundle **`07acd07`**. The
before-PR-34 clause is dropped — PR #34 is unrelated to this finding.

## Live status — as of 2026-08-20

The live soft-404 is **fixed**: nonexistent pages return the branded
TinyStudio 404 as of 2026-08-20. The deploy lane stays **red pending the
Cloudflare token**, so the live fix is not yet guaranteed to re-roll into every
release until that token is provisioned on the deploy runner.

## Files touched

- `.lane/reports/fix/lane1-soft-404-deploy-gap.md` (this report, docs-only).

No production files changed.