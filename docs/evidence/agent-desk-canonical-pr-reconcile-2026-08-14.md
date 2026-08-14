# Retired Agent Desk canonical — re-reconcile the open delivery paths to the declared survivor #91 (2026-08-14)

Date: 2026-08-14
Scope: the open pull requests that each carry the retired Agent Desk
canonical/og:url fix (`public/agent-desk.html` stops claiming the apex root),
re-checked against current `origin/main` head (`2825df8`, "docs(evidence):
close the two post-#105 duplicate fix-PR cluster residuals (#196)") and the
live deployment. This receipt is process evidence — a state verification of
the repository's pull requests plus the reconciliation actions taken — not a
live-index measurement.

## The problem (state at 2026-08-14)

The 2026-08-12 reconcile (`docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-12.md`,
PR #157) closed the four-carrier cluster (#84/#131/#138 closed, #91 refreshed)
and left **#91** as the single surviving delivery path. Since then:

- **PR #187** (`fix/agent-desk-canonical-off-apex-lane1`, opened 2026-08-14)
  re-delivered the identical two-file fix on a fresh base from current main.
  Its own body says: "whichever lands first, the other should be closed as
  superseded" — leaving **two** open delivery paths for one surface again,
  the same defect #105/#109 closed.
- **PR #91** (`fix/agent-desk-canonical-lane1`) was 1 commit behind current
  main (`2825df8`; merge-base `c28eeac` = `2825df8`'s parent) and had not
  been re-verified against the newest main head. Its production files do not
  conflict (the only main change since its base, #196, touched docs only).
- The fix itself remains **unlanded on main and live**: `origin/main`'s
  `public/agent-desk.html` still declares
  `<link rel="canonical" href="https://tinystudio.io/" />` and
  `<meta property="og:url" content="https://tinystudio.io/" />`, and the
  live `/agent-desk` surface (HTTP 307 → `/agent-desk.html`, 200) serves the
  same apex-root canonical and og:url (verified 2026-08-14).

## The two carriers (GitHub state, 2026-08-14)

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #91 | `fix/agent-desk-canonical-lane1` | 2026-08-10T22:58Z | MERGEABLE (BEHIND by 1 main commit) | the fix + robust guard + `docs/evidence/agent-desk-title-canonical-2026-08-11.md` |
| #187 | `fix/agent-desk-canonical-off-apex-lane1` | 2026-08-14T09:15Z | MERGEABLE (CLEAN, at main HEAD) | the fix + equivalent guard + `.lane/reports/fix-agent-desk-canonical-off-apex-lane1.md` |

### Fix content is identical everywhere

- `public/agent-desk.html`: `git diff origin/fix-91 origin/fix-187 -- public/agent-desk.html`
  is **empty** — canonical and og:url move from `https://tinystudio.io/` to
  `https://tinystudio.io/agent-desk.html` byte-identically on both branches.
- `scripts/check-site.mjs`: the canonical/og:url guard code is identical on
  both branches (comment-stripping, exact-one-canonical count, exact-value
  equality for canonical and og:url). The only difference is the prose of a
  preceding comment block — #91 keeps the original longer framing, #187
  trims it. No branch's guard covers anything the other does not.
- No other open PR touches `public/agent-desk.html` (verified by scanning
  every open PR's changed files, 2026-08-14). PR #194 touches
  `scripts/check-site.mjs` but for the pricing closing callout, not the
  retired-desk guard.
- Merge test: `git merge origin/main` into `origin/fix-91` completes cleanly
  (no conflicts; only doc additions), so the survivor is not conflict-locked.

## Reconciliation actions taken (2026-08-14, lane-1 run)

1. **Refreshed the declared survivor #91 onto current `origin/main` HEAD**
   (merge `2825df8` pushed to `fix/agent-desk-canonical-lane1`): production
   files unchanged, now sits on the newest main with a clean merge. Verified
   on the refreshed tree: `npm run check` green, `npm test` green, `git diff
   --check` clean (below).
2. **Closed PR #187** with a comment naming #91 as the surviving delivery
   path: zero unique fix content over #91 (byte-identical `agent-desk.html`,
   identical guard logic, fresh-base only).

## Resulting state

Exactly one open delivery path for the retired Agent Desk canonical fix:
**#91** (`fix/agent-desk-canonical-lane1`), sitting on current `origin/main`
HEAD with the fix, the regression guard, and the evidence receipt, mergeable
and awaiting review. The canonical fix itself remains unlanded on main (main
and live still serve the apex-root claim), so **#91 must be merged** for the
surface to be closed — this receipt only reconciles the delivery paths.

## Verification (reproduce)

- `git diff origin/fix-91 origin/fix-187 -- public/agent-desk.html` → empty.
- `git merge origin/main` into `origin/fix-91` → clean, no conflicts.
- `npm run check` and `npm test` on the refreshed #91 tree → green (below).
- Live: `curl -sL https://tinystudio.io/agent-desk` → 200, carries
  `canonical https://tinystudio.io/` + `og:url https://tinystudio.io/`
  (unlanded fix confirmed).
- GitHub state: #91 open and MERGEABLE; #187 closed with comment naming the
  survivor.
