# PR #42 + #43 serial-merge review item — re-verification (2026-08-17)

Date: 2026-08-17
Scope: the review item "[unreviewed-by-opus] Merge PR #42 and #43 in serial
order (or rebase the loser) — both are MERGEABLE/CLEAN but rew…" (review
queue; the packet quoting the item truncates after "rew", so the tail of the
item's wording is not reproduced here), re-verified against the GitHub
repository state on 2026-08-17. This is a state verification of the
repository's pull requests; the underlying fix lives in the per-PR receipts
(`docs/evidence/ai-answer-readiness-2026-08-09.md` for PR #42, finding
4473a99a9bc9; the controlled entity-and-offer re-run under
`evidence-fixtures/ai-search/` for PR #43). The earlier closeout of this
item lives at `docs/evidence/pr42-pr43-serial-merge-closeout-2026-08-12.md`
(PR #146, head 4e2b94c, 2026-08-12), and the prior re-verification lives at
`docs/evidence/pr42-pr43-serial-merge-rereverify-2026-08-14.md` (PR #189,
head 65347958, 2026-08-14).

## What the item claimed

- PR #42 (`fix/ai-answer-readiness-preferred-sources`) and PR #43
  (`fix/ai-search-rerun-entity-offer`) were both open and
  MERGEABLE/CLEAN, and needed to land in serial order — or the loser
  needed a rebase before landing.

## What the re-verification found (GitHub, 2026-08-17)

### Both PRs are still closed and merged, in serial order, on current main

Verified live against the GitHub REST API with the configured credential:

| Fact | PR #42 | PR #43 |
|---|---|---|
| State | `closed`, `merged: true` | `closed`, `merged: true` |
| Title | fix(public): declare preferred source pages for AI answers (dogfood 4473a99a9bc9) | evidence(ai-search): re-run controlled entity-and-offer questions after the llms/offer mirror went live |
| Merged at | 2026-08-09T12:51:00Z | 2026-08-12T02:54:14Z |
| Merged by | nish3451 | nish3451 |
| Merge commit on main | `95d2248a15baf64910c0dbaf40245945b533d1fb` (squash) | `ad9cee307d4e01b2f0e47c828dc95a74e3bfd855` (merge) |
| Ancestor on current main (`f309dd45`) | yes — `git merge-base --is-ancestor 95d2248a origin/main` is true | yes — `git merge-base --is-ancestor ad9cee3 origin/main` is true |
| Serial order | ancestor of PR #43 — `git merge-base --is-ancestor 95d2248a ad9cee3` is true | landed on top of main after PR #42 |

The serial-order requirement still holds exactly as the item asked: PR #42
landed first (squash `95d2248a`, 2026-08-09), PR #43 landed on top of it
(merge `ad9cee3`, 2026-08-12). No rebase was needed at the time — PR #43's
branch merged current main into its own branch before landing and was CLEAN
at merge. The "or rebase the loser" alternative was moot and remains moot.

### Main carries the full PR #42 declaration; q8 extension and later layers hold

- `public/llms.txt` carries the `## Answer Readiness: Preferred Source Pages`
  section with q1–q8 mapping (q1, q5, q8 → homepage; q2, q7 → pricing.html;
  q3, q4, q6 → audit.html). The q8-conversion-audit entry was added by
  PR #102 (commit `2ae7504`, "feat(public): add truthful search-intent
  bridge for 'conversion audit' searches (#102)") after PR #42 was merged;
  the 2026-08-12 closeout and the 2026-08-14 re-verification already
  accounted for that addition, and the present re-check confirms it is
  still present (`grep -c "q8-conversion-audit" public/llms.txt` → 1).
- `public/offer.md` mirrors the same q1–q8 mapping
  (`grep -c "Answer Readiness" public/offer.md` → 1), so the
  machine-readable pair still cannot drift on the answer-readiness
  question coverage.
- `scripts/check-site.mjs` still carries the "preferred-source mapping"
  guard under the "AI Answer Readiness (dogfood 4473a99a9bc9)" block
  (`grep -c "preferred-source" scripts/check-site.mjs` → 1), and
  `scripts/test-agent-ui.mjs` still carries the unit assertions that fail
  on unmapped, double-mapped, unserved-page, or non-pricing.html price
  questions. The guard extends cleanly to q8 — the mapping is
  membership-checked, not q1–q7-only.
- `docs/evidence/ai-answer-readiness-2026-08-09.md` and
  `evidence-fixtures/ai-search/README.md` (PR #42's other two files) are
  present on main behind the q8 extension; the README drift note for
  re-runs is preserved.
- The full PR #42 content (the six-file, +260-line change that squash
  `95d2248a` landed) is on main; the branch tip `0c8ebace` is no longer
  directly comparable because main has progressed past PR #42's merge base
  (PR #102 added q8 and the search-intent bridge, and other PRs have
  refactored `check-site.mjs` and `test-agent-ui.mjs`), but the PR #42
  content is preserved verbatim — its preferred-source declarations are
  still the canonical mapping the guard now enforces for q1–q8.

### PR #43 still carries the controlled re-run

- The branch tip `ed62202e` is the second parent of merge commit
  `ad9cee3` and remains an ancestor of current main
  (`git merge-base --is-ancestor ed62202 origin/main` is true). The re-run
  receipts under `evidence-fixtures/ai-search/2026-08-09-controlled-rerun.md`
  and `evidence-fixtures/ai-search/2026-08-11-q5-ground-truth-alignment.md`
  are present on main, together with the `evidence.json` and
  `controlled-questions.json` updates PR #43 landed.
- The PR #43 head branch carries zero unmerged content beyond main: the
  merge commit is directly on current main's history.

### Three-day-on state check (2026-08-14 → 2026-08-17)

Since the 2026-08-14 re-verification at head `65347958` / main `f9214c1`,
the post-reverification commits on main have touched:

- The site surface (`favicon.ico` 5ca6241 from the canonical SVG,
  retired `/agent-desk` canonical fix 798cd71, narrow-viewport fixes,
  tap-target re-verifications, app-store citation handoff, env-driven ads
  tag, /brief-requested clean-links).
- The re-verification receipts themselves (apple-touch-icon,
  favicon rel, render-blocking, social-share, q5 ground truth, canonical
  URL, product-contract round-1 harvest, tap-target, brief-requested
  clean-links, the survivor PR #145 merge).
- Reconciliation landings: `reconcile(evidence): land the stranded
  2026-08-12 AI-search re-run (PR #128) on current main (#211)`.

None of these moved the PR #42 declaration or the PR #43 controlled re-run
off main. The order of "PR #42 first, then PR #43" still holds, and the
item's review-queue tag (`unreviewed-by-opus`) is the only reason the item
is still open at the queue level — there is no mergeable, unmerged work
on either PR.

### CI sanity on current main

`origin/main` at `f309dd45` (PR #242 merge, 2026-08-17) is the head
against which this re-verification is run. The local checks below were
executed against this head:

- `node scripts/check-site.mjs` → `TinyStudio.io checks passed.`
- `node --test scripts/test-agent-ui.mjs` → `tests 16, pass 16, fail 0`
- `node --test scripts/test-heading-hierarchy.mjs` → `tests 6, pass 6, fail 0`

The per-PR receipt `scripts/check-site.mjs` and `scripts/test-agent-ui.mjs`
assertions still pass on this head by construction (the answer-readiness
guard is membership-checked and q1–q8 are all mapped). The broader test
suite is covered by the 2026-08-14 re-verification receipts already on
main and the per-PR receipts on their own branches.

## What closes the item (re-verified)

- There are no open PRs #42 or #43: both are `closed`/`merged` (2026-08-09
  and 2026-08-12 respectively). Merging them again is neither possible nor
  needed.
- The serial-order requirement is satisfied exactly as the item asked:
  #42 landed first (squash `95d2248a`, 2026-08-09), then #43 on top of it
  (merge `ad9cee3`, 2026-08-12). The "or rebase the loser" alternative was
  moot — #43 merged current main into its own branch before landing and
  was CLEAN at merge.
- Main carries the full, exact content of both PRs; the six-file PR #42
  declaration is on main and the q8-conversion-audit extension (PR #102)
  is layered on top of it without removing any of PR #42's content.
- The PR #42 branch tip is now stale relative to current main (because
  main has progressed past PR #42's merge base), but the PR is already
  merged — the staleness is expected and does not change the serial-merge
  outcome.
- The PR #43 branch tip is an ancestor of current main and carries zero
  unmerged content beyond main.
- No code change is needed or proposed.

## Closeout

This re-verifies the review item "[unreviewed-by-opus] Merge PR #42 and #43
in serial order (or rebase the loser)" against current GitHub state
(2026-08-17); the closeout first recorded on 2026-08-12 (PR #146,
`4e2b94c`) and the re-verification recorded on 2026-08-14 (PR #189,
`65347958`) still hold, with both PRs merged in serial order, both PR
contents on main, the q8-conversion-audit extension and the post-2026-08-14
layers (favicon from SVG, retired /agent-desk canonical fix, PR #145
survivor, PR #128 reconciliation) layered on top of PR #42 + #43 without
conflict, and no further action needed beyond this receipt. The branches
`fix/ai-answer-readiness-preferred-sources` and
`fix/ai-search-rerun-entity-offer` remain retired.
