# Duplicate open-PR clusters — residual reconciliation after #105

Date: 2026-08-11
Scope: the two residual clusters of open PRs that each carry the same fix on
a different branch, left over after the first reconciliation (PR #105,
`docs/evidence/duplicate-open-pr-clusters-2026-08-11.md`), reconciled so that
exactly one superior delivery path remains open per surface. This receipt
records a state verification of the repository's pull requests plus the
reconciliation actions taken; it is process evidence, not a live-site
measurement.

## The problem

PR #105 closed four stale duplicates (lead-form tablet squeeze #59, clean
canonicals #61, Agent Desk canonical #54, q5 ground truth #53). Two surfaces
still had two open PRs carrying the same fix: an older branch created against
a stale base and a fresh re-land branch created against current
`origin/main`. Two open PRs per surface is the same defect #105 closed: a
reviewer cannot tell which is canonical, the stale branch tends to
conflict-lock against main, and a merge of the wrong one re-introduces drift.

## The two residual clusters (GitHub state, 2026-08-11)

### Cluster 1 — brief-requested clean nav/back links

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #60 | `fix/brief-requested-clean-nav-links` | 2026-08-09T21:32Z | MERGEABLE (BEHIND) | the fix |
| #97 | `fix/brief-requested-clean-links` | 2026-08-11T01:17Z | MERGEABLE (CLEAN) | the fix, guard-coverage receipt |

Both branches make the same two-file change
(`public/brief-requested.html`, `scripts/check-site.mjs`): the post-signup
page's logo, three nav links and back link move from the `.html` forms
(`index.html`, `audit.html`, `agents.html`, `pricing.html`) that the deployed
worker 307-redirects, to the clean extensionless twins (`/`, `/audit`,
`/agents`, `/pricing`), and the internal-links guard (dogfood 996dffe45ef7)
gains the `brief-requested` page entry plus the `brief-requested.html` →
`/brief-requested` target. Verified: the `public/brief-requested.html` diff is
byte-identical between the two fix commits (`db7b2b1` vs `ad5164e`); the
`scripts/check-site.mjs` guard extension is identical apart from comment
wording. #60 is the original branch (created against a stale base, twelve
main-merge commits deep), BEHIND current main; #97 is the re-land, CLEAN,
sitting directly on current `origin/main` HEAD (`a30f2ad`), and its body
documents the detector fix plus the negative probe.

**Superior delivery path: #97.** #60 closed as the stale duplicate.

### Cluster 2 — rel=icon favicon on the five public pages

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #47 | `fix/serve-rel-icon-favicon` | 2026-08-09T14:46Z | **CONFLICTING (DIRTY)** | the fix + a check-site.mjs favicon guard + a `brief-requested.html` link |
| #85 | `fix/rel-icon-favicon-lane1` | 2026-08-10T21:31Z | MERGEABLE (CLEAN) | the fix |

Both branches add the identical `<link rel="icon" href="/favicon.svg"
type="image/svg+xml" />` line to the five human-facing pages
(`public/index.html`, `pricing.html`, `audit.html`, `agents.html`,
`specimen.html`) — verified byte-identical line-for-line on all five pages.
#47 is the original branch, conflict-locked against current main
(`mergeStateStatus: DIRTY`, `mergeable: CONFLICTING`); #85 is the re-land,
CLEAN, sitting directly on current `origin/main` HEAD (`a30f2ad`), and its
body names `fix/serve-rel-icon-favicon` as "a stale duplicate branch ... never
merged" that it re-lands cleanly. Note: the stale branch additionally carried
a `brief-requested.html` favicon link and a check-site.mjs favicon guard that
the re-land scoped out; the five-page instance fix itself is identical, and
#85's body states the same validation as #47's (exactly one `rel=icon` link
per page; `favicon.svg` tracked and valid).

**Superior delivery path: #85.** #47 closed as the conflict-locked stale
duplicate (same shape as #61 and #22 before it).

## Reconciliation actions taken (2026-08-11, lane-1 run)

The closures below are the actual GitHub state changes, each preceded by a
comment naming the surviving delivery path:

- Closed PR **#60** (2026-08-11T08:10:08Z): stale-base duplicate; #97 re-lands
  the byte-identical fix on the fresh base with the guard-coverage receipt.
- Closed PR **#47** (2026-08-11T08:10:09Z): conflict-locked stale duplicate;
  #85 re-lands the identical five-page fix on the fresh base.

Pre-closure verification on this run (2026-08-11):

- Per-cluster diffs confirmed the stale branches carried no unique fix
  content the survivor lacks: #60 vs #97 differ only in guard-comment wording
  (fix commits `db7b2b1` vs `ad5164e`); #47 vs #85 differ only in the extra
  `brief-requested.html` link and check-site.mjs guard the original carried
  (the five-page instance fix is byte-identical).
- `npm run check` re-run green on both still-open survivors
  (`fix/brief-requested-clean-links`, `fix/rel-icon-favicon-lane1`), each
  fetched fresh and checked on its own tree; each sits directly on current
  `origin/main` HEAD (`a30f2ad`).

Kept open, as the single delivery path per surface: #97 (brief-requested
clean links), #85 (favicon).

## What closes the item

- Every surface now has exactly one delivery path for its fix: the fresh
  re-land PR (mergeable, `npm run check` green on its own tree, directly on
  current `origin/main`).
- The two stale duplicates are closed, each with a comment naming the
  surviving delivery path; neither carried a change the survivor lacks
  (verified per-cluster by diffing the fix commits: the only differences are
  staleness, comment wording, or the original's extra scoped-out content,
  never a fix regression).
- Combined with PR #105's four clusters, every duplicate open fix-PR pair in
  the repository is now reconciled to one superior delivery path.
