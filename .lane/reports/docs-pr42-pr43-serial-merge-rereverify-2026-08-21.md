# Lane report: PR #42 + #43 serial-merge re-verification (2026-08-21, lane 1)

Branch: `docs/pr42-pr43-serial-merge-rereverify-2026-08-21`
Item: "[unreviewed-by-opus] Merge PR #42 and #43 in serial order (or rebase
the loser) — both are MERGEABLE/CLEAN but rew…"

## Outcome

Both PRs are already closed and merged on `origin/main` — there was no merge
left to perform. This lane re-verified the serial-merge outcome against live
GitHub state and current main, and records the receipt.

## Verified facts (2026-08-21)

- PR #42 (`fix/ai-answer-readiness-preferred-sources`): state `MERGED`,
  merged 2026-08-09T12:51:00Z by nish3451, squash commit
  `95d2248a15baf64910c0dbaf40245945b533d1fb`.
- PR #43 (`fix/ai-search-rerun-entity-offer`): state `MERGED`,
  merged 2026-08-12T02:54:14Z by nish3451, merge commit
  `ad9cee307d4e01b2f0e47c828dc95a74e3bfd855`.
- Serial order holds: `git merge-base --is-ancestor 95d2248a ad9cee3` → true
  (PR #42 landed first, PR #43 on top). The "rebase the loser" alternative
  was moot.
- Both merge commits are ancestors of current main (`92d55c3`).
- PR #43 branch tip `ed62202e` is an ancestor of main; zero unmerged content.
- PR #42 content on main: `public/llms.txt` and `public/offer.md` carry the
  `## Answer Readiness: Preferred Source Pages` section (q1–q8 mapping,
  including the later q8 extension from PR #102); `scripts/check-site.mjs`
  carries the preferred-source guard; `scripts/test-agent-ui.mjs` carries the
  unit assertions.
- PR #43 content on main: `docs/evidence/ai-search/2026-08-09-controlled-rerun.md`,
  `docs/evidence/ai-search/2026-08-11-q5-ground-truth-alignment.md`,
  `evidence-fixtures/ai-search/{README.md,evidence.json,controlled-questions.json}`.

## Checks run against current main (`92d55c3`)

- `node scripts/check-site.mjs` → `TinyStudio.io checks passed.`
- `node --test scripts/test-agent-ui.mjs` → tests 16, pass 16, fail 0
- `node --test scripts/test-heading-hierarchy.mjs` → tests 6, pass 6, fail 0

## Artifacts

- Evidence receipt: `docs/evidence/pr42-pr43-serial-merge-rereverify-2026-08-21.md`
- No production code changed; this is a state-verification lane.

Prior receipts: closeout 2026-08-12 (PR #146), re-verifications 2026-08-14
(PR #189) and 2026-08-17 (PR #244) — all still hold.
