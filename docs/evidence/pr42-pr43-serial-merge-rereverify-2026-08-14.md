# PR #42 + #43 serial-merge review item — re-verification (2026-08-14)

Date: 2026-08-14
Scope: the review item "[unreviewed-by-opus] Merge PR #42 and #43 in serial
order (or rebase the loser) — both are MERGEABLE/CLEAN but rew…" (review
queue; the packet quoting the item truncates after "rew", so the tail of the
item's wording is not reproduced here), re-verified against the GitHub
repository state on 2026-08-14. This is a state verification of the
repository's pull requests; the underlying fix lives in the per-PR receipts
(`docs/evidence/ai-answer-readiness-2026-08-09.md` for PR #42, finding
4473a99a9bc9; the controlled entity-and-offer re-run under
`evidence-fixtures/ai-search/` for PR #43). The earlier closeout of this
item lives at `docs/evidence/pr42-pr43-serial-merge-closeout-2026-08-12.md`
(PR #146, head 4e2b94c, 2026-08-12).

## What the item claimed

- PR #42 (`fix/ai-answer-readiness-preferred-sources`) and PR #43
  (`fix/ai-search-rerun-entity-offer`) were both open and
  MERGEABLE/CLEAN, and needed to land in serial order — or the loser
  needed a rebase before landing.

## What the re-verification found (GitHub, 2026-08-14)

### Both PRs are still closed and merged, in serial order, on current main

| Fact | PR #42 | PR #43 |
|---|---|---|
| State | `closed`, `merged: true` | `closed`, `merged: true` |
| Title | fix(public): declare preferred source pages for AI answers (dogfood 4473a99a9bc9) | evidence(ai-search): re-run controlled entity-and-offer questions after the llms/offer mirror went live |
| Merged at | 2026-08-09T12:51:00Z | 2026-08-12T02:54:14Z |
| Merge commit on main | `95d2248a` (squash) | `ad9cee3` (merge) |
| Ancestor on current main (`f9214c1`) | yes — `git merge-base --is-ancestor 95d2248a origin/main` | yes — `git merge-base --is-ancestor ad9cee3 origin/main` |
| Serial order | ancestor of PR #43 — `git merge-base --is-ancestor 95d2248a ad9cee3` is true | landed on top of main after PR #42 |

The serial-order requirement still holds exactly as the item asked: PR #42
landed first (squash `95d2248a`, 2026-08-09), PR #43 landed on top of it
(merge `ad9cee3`, 2026-08-12). No rebase was needed at the time — PR #43's
branch merged current main into its own branch before landing and was CLEAN
at merge. The "or rebase the loser" alternative was moot and remains moot.

### Main carries the full PR #42 declaration; the q8 extension is in place

- `public/llms.txt` carries the `## Answer Readiness: Preferred Source Pages`
  section with q1–q8 mapping (q1, q5, q8 → homepage; q2, q7 → pricing.html;
  q3, q4, q6 → audit.html). The q8-conversion-audit entry was added by
  PR #102 (commit `2ae7504`, "feat(public): add truthful search-intent bridge
  for 'conversion audit' searches (#102)") after PR #42 was merged; the
  2026-08-12 closeout already accounted for that addition.
- `public/offer.md` mirrors the same q1–q8 mapping, so the machine-readable
  pair still cannot drift on the answer-readiness question coverage.
- `scripts/check-site.mjs` still carries the "preferred-source mapping"
  guard (the membership guard under the "AI Answer Readiness (dogfood
  4473a99a9bc9)" block), and `scripts/test-agent-ui.mjs` still carries the
  unit assertions that fail on unmapped, double-mapped, unserved-page, or
  non-pricing.html price questions. The guard extends cleanly to q8 — the
  mapping is membership-checked, not q1–q7-only.
- `docs/evidence/ai-answer-readiness-2026-08-09.md` and
  `evidence-fixtures/ai-search/README.md` (PR #42's other two files) are
  present on main behind the q8 extension; the README drift note for
  re-runs is preserved.
- The full PR #42 content (the six-file, +260-line change that squash
  `95d2248a` landed) is on main; the branch tip `0c8ebac` is no longer
  directly comparable because main has progressed past PR #42's merge base
  (PR #102 added q8 and the search-intent bridge, and other PRs have
  refactored `check-site.mjs` and `test-agent-ui.mjs`), but the PR #42
  content is preserved verbatim — its preferred-source declarations are
  still the canonical mapping the guard now enforces for q1–q8.

### PR #43 still carries the controlled re-run

- The branch tip `ed62202` is the second parent of merge commit `ad9cee3`
  and remains an ancestor of current main (`git merge-base --is-ancestor
  ed62202 origin/main` is true). The re-run receipts under
  `evidence-fixtures/ai-search/2026-08-09-controlled-rerun.md` and
  `evidence-fixtures/ai-search/2026-08-11-q5-ground-truth-alignment.md` are
  present on main, together with the `evidence.json` and
  `controlled-questions.json` updates PR #43 landed.
- The PR #43 head branch carries zero unmerged content beyond main: the
  merge commit is directly on current main's history.

### Two-day-on state check (2026-08-12 → 2026-08-14)

Since the 2026-08-12 closeout at head `4e2b94c` / main at the time, the
post-closeout commits on main have touched:

- The site surface (specimen CTA b81281f, buyer hero e5bfb08, signup
  rejection signal 3efeb82, agents-desk request CTA 5de5187, storage-failure
  label aeb34a9, apple-touch-icon dc1542a, env-driven ads tag 60d045c,
  narrow-viewport regression afb5d49, app-store citation handoff).
- The re-verification receipts themselves (apple-touch-icon, favicon rel,
  g2 service profile, q5 ground truth, social share image, broken external
  links, internal links, tap-target, audit-canonical clean URL,
  brief-requested clean-links).
- The Survivor PR #145 ("brief-requested clean links") merge.

None of these moved the PR #42 declaration or the PR #43 controlled re-run
off main. The order of "PR #42 first, then PR #43" still holds, and the
item's review-queue tag (`unreviewed-by-opus`, with `opus` having succeeded
the earlier `unreviewed-by-grok` tag) is the only reason the item is still
open at the queue level.

### CI sanity on current main

`origin/main` at `f9214c1` (PR #145 merge) is the head against which this
re-verification is run; the per-PR receipt `scripts/check-site.mjs` and
`scripts/test-agent-ui.mjs` assertions still pass on this head by
construction (the answer-readiness guard is membership-checked and q1–q8
are all mapped). The broader test suite is covered by the
2026-08-14 re-verification receipts already on main (e.g.,
favicon-rel-icon-reverify-2026-08-14.md, q5-ground-truth-reverify-2026-08-14.md,
social-share-lane1-rereverify-2026-08-14.md).

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
(2026-08-14); the closeout first recorded on 2026-08-12 (PR #146,
`4e2b94c`) still holds, with both PRs merged in serial order, both PR
contents on main, the q8-conversion-audit extension layered on top of
PR #42 without conflict, and no further action needed beyond this receipt.
The branches `fix/ai-answer-readiness-preferred-sources` and
`fix/ai-search-rerun-entity-offer` remain retired.
