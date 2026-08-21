# Lane 1 — Reconcile the THREE agent-desk-canonical PRs #91/#131/#138 — re-verify (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `lane1/agent-desk-canonical-pr-reconcile-rereverify-2026-08-21`
Item: `ba5fb5fb58` — "[unreviewed-by-opus] Reconcile the THREE open
agent-desk-canonical PRs #91/#131/#138 — #105's declared survivor #9"
(truncated at dispatch; the trailing "#9" is a typo in the dispatch for
"#91" — the survivor is PR #91 per the backlog source and PR #105's
reconciliation table)

## Outcome

**Closed (already reconciled upstream).** The THREE carrier PRs
#91/#131/#138 are no longer a duplicate open-PR cluster on this
surface: #131 and #138 were closed by PR #157 on 2026-08-12, #91 was
closed in the post-#229 sweep (the cleaner-URL survivor superseded the
older `.html`-URL form), and the underlying fix is on `origin/main`
head `92d55c3` via PR #229 (commit `798cd71`, merged 2026-08-17). The
canonical `<link rel="canonical" href="https://tinystudio.io/agent-desk">`
plus matching `<meta property="og:url">` are present on source and
live, md5-for-md5 (`3310f720f1b9234970327ba35c52da94`). No code change
was needed; this lane lands the re-verification receipt.

## What this lane checked

The lane reads the truncated item text as: "the THREE open
agent-desk-canonical PRs #91/#131/#138 need to be reconciled to
#105's declared survivor" — i.e. the duplicate-PR cluster on the
retired `/agent-desk` surface where multiple lanes re-created the
identical `public/agent-desk.html` canonical/og:url fix. The lane
therefore:

1. Re-checks the open/closed state of each of the THREE PRs against
   the reconciliation receipts and the most-recent backlog.
2. Re-checks that the substantive fix is on `origin/main` head
   `92d55c3` (source check) and on the live deployment (live check).
3. Re-checks that the regression guard in `scripts/check-site.mjs`
   enforces the correct canonical / og:url pair.

## Files changed

- `docs/evidence/agent-desk-canonical-pr-reconcile-rereverify-2026-08-21-lane1.md` —
  full re-verification receipt (history table, per-PR state, byte-diff
  of the carried fix, source check, live check, regression-guard check,
  static checks/tests, reproduce, non-claims, relationship to other
  receipts).
- `.lane/reports/lane1-agent-desk-canonical-pr-reconcile-rereverify-2026-08-21.md` —
  this report.

## What I verified (this run, 2026-08-21)

- `git ls-remote origin refs/pull/{91,131,138}/head` → all three head
  refs still resolve (closed PRs retain their head refs).
- `git diff origin/main...refs/pull/{91,131,138}/head -- public/agent-desk.html`
  → byte-identical hunks across all three (canonical + og:url moved from
  `https://tinystudio.io/` to `https://tinystudio.io/agent-desk.html`).
- `git diff origin/main...refs/pull/229/head -- public/agent-desk.html`
  → the same logical fix but with the cleaner `https://tinystudio.io/agent-desk`
  URL (no `.html`), matching `origin/main` head `92d55c3`.
- `git log -1 --format='%H' origin/main -- public/agent-desk.html`
  → `798cd71a86e5171cedb1819e6b462ee54580f2b7` (PR #229 is the last
  commit that touched the legacy page; nothing between `798cd71` and
  `92d55c3` has touched the file).
- `md5sum public/agent-desk.html` on disk =
  `3310f720f1b9234970327ba35c52da94`;
  `curl -sL https://tinystudio.io/agent-desk | md5sum` over the wire =
  `3310f720f1b9234970327ba35c52da94` (live bytes md5-match source).
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test` over the six test files → 124 / 124 pass.
- `git diff --check` clean.

## What I did NOT do

- **Did not close any GitHub PR.** All THREE PRs are already closed
  per the reconciliation receipts and the most-recent backlog
  annotation; closing them again would be a no-op. The substantive
  fix is on main via PR #229; the duplicate-PR cluster on this
  surface is gone.
- **Did not push code, schema, infra, or production state.** This
  lane is docs-only (a re-verification receipt + this lane report).
- **Did not claim a Google SERP change.** The fix is a site-side
  correction; Google's recrawl and site-name refresh run on Google's
  timetable.

## Relationship to other receipts

This re-verification complements (does not overlap):

- `docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-12.md`
  (PR #157) — closed #84/#131/#138 with #91 as the survivor.
- `docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-14.md`
  (PR #198) — closed #187 as duplicate of #91.
- `docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-17.md`
  and `docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-21.md`
  — site-side re-verification that the canonical is on source and live.

This lane lands the process-evidence re-verification: the THREE
carrier PRs are reconciled, the substantive fix is on main, the
guard enforces it, and the live bytes md5-match the source.

## Non-claim

No Google SERP change is claimed; no new closure is claimed (the PRs
are already closed); no merge is performed (the substantive merge
was PR #229 on 2026-08-17, four days before this re-verification).
The honest claim is the source + live + PR-queue state documented in
the linked receipt.
