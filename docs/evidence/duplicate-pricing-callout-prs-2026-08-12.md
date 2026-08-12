# Duplicate pricing-callout PRs — reconciliation to one delivery path

Date: 2026-08-12
Scope: the review item "[unreviewed-by-grok] Reconcile the byte-identical
duplicate pricing-callout PRs #68/#114 — two MERGEABLE open PRs", reconciled
so that exactly one delivery path remains open for the /pricing closing
callout form fix. This receipt records a state verification of the
repository's pull requests plus the reconciliation actions taken; it is
process evidence, not a live-site measurement. The site-side verification of
the fix itself is carried by the surviving PR (#114) and by the repo's
standing `npm run check` suite.

## The problem

Two open PRs carried the same fix — a real "Request the appraisal" signup
form inside the /pricing closing callout band — on two different branches:
an older original with a 25-merge-commit history and a fresh single-commit
re-land created the next day. Two open PRs per surface is the same defect
already reconciled for other clusters (PR #105, PR #109): a reviewer cannot
tell which is canonical, and a merge of the wrong one re-introduces drift.

## The cluster (GitHub state, 2026-08-12)

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #68 | `fix/pricing-closing-callout-appraisal-action` | 2026-08-10T16:15:50Z | MERGEABLE (BEHIND) | the fix + guard |
| #114 | `fix/pricing-closing-callout-appraisal-action-lane1` | 2026-08-11T17:11:46Z | MERGEABLE (BEHIND) | the fix + guard |

Both branches make the same two-file change (`public/pricing.html`,
`scripts/check-site.mjs`): the closing `.band` on /pricing gains a
`form.lead.two` posting website + email to `/api/signups` with persistent
programmatic `aria-label`s and a "Request the appraisal" submit button, and
`scripts/check-site.mjs` gains a static source guard pinning that shape.

Verified identical: `gh pr diff 68` and `gh pr diff 114` are byte-identical
(54 lines each, 2 files changed, +32/−0; `diff` reports zero differences).
Neither branch has a human review or an APPROVED/CHANGES_REQUESTED review
state: #68 accumulated 38 bot COMMENTED reviews (greptile × 27, Codex × 10,
CodeRabbit × 1) plus a 2026-08-11 human CI-status note, all non-blocking;
#114 has two bot comments. Both branches fork from the same main commit
(9302611) and sit 3 commits behind current `origin/main` HEAD (5864e39);
both are MERGEABLE with `verify` and `Gitleaks` checks SUCCESS.

**Superior delivery path: #114.** #68 is the original but is 26 commits deep
(1 fix + 25 main merges) with no blocking review thread; #114 is the fresh
re-land with a single clean commit whose body names itself the delivery path
("#68 can be closed once this merges (or now, to avoid a duplicate cluster)"),
matching the house rule applied in PR #105/#109: prefer the fresh re-land
over the deep-merge-history original when the production diff is identical.

## Reconciliation actions taken (2026-08-12, lane-1 run)

The closure below is the actual GitHub state change, preceded by a comment
naming the surviving delivery path:

- Closed PR **#68** (2026-08-12T01:08:49Z): stale duplicate; #114 re-lands
  the byte-identical fix on the fresh base with a single commit and is the
  surviving delivery path.

Pre-closure verification on this run (2026-08-12):

- Per-cluster diffs confirmed the branches carry identical fix content
  (`gh pr diff 68` vs `gh pr diff 114`: byte-identical, zero differences).
- `npm run check` re-run green on the survivor's own tree
  (`fix/pricing-closing-callout-appraisal-action-lane1`, head b34e395,
  fetched fresh): "TinyStudio.io checks passed." — including the new
  pricing closing-callout guard (negative-tested by the fix's author on
  both branches: removing the form fails the guard messages).

Kept open, as the single delivery path: #114.

## What closes the item

- The /pricing closing-callout fix now has exactly one delivery path: the
  fresh re-land PR #114 (mergeable, `npm run check` green on its own tree,
  single commit on the shared fresh base).
- The stale duplicate #68 is closed with a comment naming the surviving
  delivery path; it carried no change the survivor lacks (production diffs
  byte-identical, both +32/−0 across the same two files).
- Combined with PR #105's four clusters and PR #109's two residual
  clusters, every duplicate open fix-PR pair in the repository is now
  reconciled to one superior delivery path.
