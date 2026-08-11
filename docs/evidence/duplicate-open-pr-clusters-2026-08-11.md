# Duplicate open-PR clusters — reconciliation to one superior delivery path per surface

Date: 2026-08-11
Scope: the four clusters of open PRs that each carry the same fix on a
different branch, reconciled so that exactly one superior delivery path
remains open per surface. This receipt records a state verification of the
repository's pull requests plus the reconciliation actions taken; it is
process evidence, not a live-site measurement.

## The problem

Four surfaces each had two open PRs carrying the same fix: an older branch
created against a stale base (later re-landed, or left to rot, by a
subsequent lane) and a fresh re-land branch created against current
`origin/main`. Two open PRs per surface is a defect: reviewers cannot tell
which is canonical, the stale branch tends to conflict-lock against main, and
a merge of the wrong one re-introduces drift.

## The four clusters (GitHub state, 2026-08-11)

### Cluster 1 — homepage intake form tablet squeeze

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #59 | `fix/lead-form-tablet-squeeze` | 2026-08-09T20:57Z | MERGEABLE (BEHIND) | the fix + `docs/evidence/lead-form-tablet-squeeze-2026-08-10.md` |
| #96 | `fix/lead-form-tablet-squeeze-reprise` | 2026-08-11T00:15Z | MERGEABLE (BEHIND) | identical fix + same evidence doc with an additional 2026-08-11 re-verification section |

The production diff (`public/index.css`, `scripts/check-site.mjs`) is
identical between the two branches (verified: `git diff #59...#96` shows zero
production-file differences). #96 is the reprise: it re-lands the identical
code on a fresh base and extends the evidence receipt with an independent
2026-08-11 re-run against current `origin/main` HEAD (`dc95ebf`). #59 is the
original branch, never merged, whose evidence doc lacks the re-verification.

**Superior delivery path: #96.** #59 closed as the stale duplicate.

### Cluster 2 — agents/pricing/specimen canonical + og:url + JSON-LD clean URLs

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #61 | `fix/clean-canonical-urls-remaining-pages` | 2026-08-10T09:38Z | **CONFLICTING (DIRTY)** | the fix |
| #95 | `fix/canonical-clean-urls-agents-pricing-specimen` | 2026-08-11T00:09Z | MERGEABLE (BEHIND) | the fix, updated guard comments |

Both branches change the same four files (`public/agents.html`,
`public/pricing.html`, `public/specimen.html`, `scripts/check-site.mjs`) and
the per-page canonical/og:url/JSON-LD edits are identical. #61 is
conflict-locked against current main (`mergeStateStatus: DIRTY`,
`mergeable: CONFLICTING`): its guard list still expects `/audit.html` while
main has since moved the audit page to `/audit` (PR #56). #95 was re-landed on
the fresh base, its guard lists expect the clean `/audit` address, and it
passes `npm run check` on its own tree.

**Superior delivery path: #95.** #61 closed as the conflict-locked stale
duplicate (same shape as the heading-hierarchy precedent, PR #22).

### Cluster 3 — retired Agent Desk canonical / og:url off the apex root

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #54 | `fix/agent-desk-canonical` | 2026-08-09T16:49Z | MERGEABLE (BEHIND) | the fix + `docs/evidence/agent-desk-canonical-2026-08-09.md` |
| #91 | `fix/agent-desk-canonical-lane1` | 2026-08-10T22:58Z | MERGEABLE (BEHIND) | the fix + `docs/evidence/agent-desk-title-canonical-2026-08-11.md` |

The `public/agent-desk.html` change is identical on both branches (canonical
and og:url move from the apex root to the page's own served
`https://tinystudio.io/agent-desk.html`). #91's guard is the newer, slightly
stronger shape (43 vs 42 lines of `scripts/check-site.mjs` change; the
dogfood guard gains the "noindex page canonicalizing to a live page tells
Google it is a duplicate" framing), and #91's own body states it re-lands the
item that "previously sat in open PRs #54 (same fix, stale base) and #84".
The 2026-08-11 evidence receipt supersedes the 2026-08-09 one.

**Superior delivery path: #91.** #54 closed as the stale-base duplicate.

### Cluster 4 — q5 ground truth drop of the retired Agent Desk

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #53 | `fix/ai-search-q5-ground-truth-agent-desk-retired` | 2026-08-09T16:34Z | MERGEABLE (BEHIND) | the fix |
| #90 | `fix/q5-ground-truth-drop-agent-desk` | 2026-08-10T22:53Z | MERGEABLE (BEHIND) | the fix |

Both branches make the same two-file change
(`evidence-fixtures/ai-search/controlled-questions.json`,
`public/audit.html`) to drop the retired Agent Desk from the q5 ground truth
in the AI-search controlled questions and regenerate the embedded evidence
bundle so the drift guard passes. #90's wording is the one consistent with
the fixture's own q1/q2 "desk that closes the leaks the audit finds"
phrasing, re-landed on the fresh base.

**Superior delivery path: #90.** #53 closed as the stale duplicate.

## Reconciliation actions taken (2026-08-11, lane-1 run)

The plan above was executed on the lane-1 run; the closures below are the
actual GitHub state changes, each with the comment naming the surviving
delivery path:

- Closed PR **#59** (2026-08-11T05:29:31Z): the identical fix already landed
  on main via the reprise #96 (merged 2026-08-11T02:30Z, commit `6f85c61`), so
  the stale branch carried zero changes main lacks and was conflict-locked
  against it.
- Closed PR **#61** (2026-08-11T05:29:32Z): conflict-locked stale duplicate;
  #95 re-lands the identical per-page edits on the fresh base and passes
  `npm run check` on its own tree.
- Closed PR **#54** (2026-08-11T05:29:33Z): stale-base duplicate; #91 re-lands
  the byte-identical `public/agent-desk.html` change with the stronger guard.
- Closed PR **#53** (2026-08-11T05:29:34Z): stale duplicate; #90 re-lands the
  same two-file change with the wording consistent with the fixture's own
  q1/q2 phrasing.

Pre-closure verification on this run (2026-08-11):

- Per-cluster two-dot diffs confirmed the stale branches carried no unique
  fix content: #59 had no unique commits over #96 (only old `Merge branch
  'main'` commits); #61 vs #95 differed only in main-evolution guard
  deltas (including #61's stale `/audit.html` expectation); #54 vs #91
  differed only in the guard comment (byte-identical `agent-desk.html`);
  #53 vs #90 differed only in the q5 wording.
- `npm run check` re-run green on the three still-open survivors
  (`fix/canonical-clean-urls-agents-pricing-specimen`,
  `fix/agent-desk-canonical-lane1`, `fix/q5-ground-truth-drop-agent-desk`),
  each fetched fresh and checked on its own tree; each sits directly on
  current `origin/main` HEAD (`e6f42c1`).

Kept open, as the single delivery path per surface: #96 (lead form — already
merged to main), #95 (canonicals), #91 (Agent Desk canonical), #90 (q5 ground
truth).

## What closes the item

- Every surface now has exactly one delivery path for its fix: the fresh
  re-land PR (mergeable, evidence receipt current, `npm run check` green on
  its own tree) or, for the lead-form cluster, main itself via the merged
  reprise #96.
- The four stale duplicates are closed; none of them carried a change the
  survivor lacks (verified per-cluster by diffing the two branches: the only
  differences are staleness, evidence-doc currency, or guard-comment
  improvements, never a fix regression).
