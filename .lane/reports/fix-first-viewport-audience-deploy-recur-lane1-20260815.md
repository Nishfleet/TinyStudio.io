# Lane 1 report — first-viewport buyer-audience fix (unreviewed-by-opus item)

Date: 2026-08-14 (run 2026-08-15 00:20 IST)

## Item

`[unreviewed-by-opus] The first-viewport buyer-audience fix is complete and verified but stranded — sol-sweep packet`

## Outcome

**The stranded fix is already merged and live on main — no new code change is required.**

The item described the fix as "complete and verified but stranded" (the Pass-4 packet landed
the copy change in the shared checkout but never merged it). That stranded state has already
been resolved by a later worker: the identical fix was re-landed as commit `e5bfb08`
(`fix(home): name the buyer in the first-viewport hero and deploy the pass-4 fix (#171)`),
which is an ancestor of current `origin/main` (`c447585`).

## Evidence

- Stranded original commit: `be81f49` on branch `fix/first-viewport-audience-deploy-recur`
  (parent `dc1542a`, "serve apple-touch-icon … #123"). It changed `package.json`,
  `public/index.html`, and added `scripts/test-first-viewport-audience.mjs`.
- Merged re-land commit: `e5bfb08`, PR #171, is an ancestor of `origin/main`
  (`git merge-base --is-ancestor e5bfb08 origin/main` → YES).
- Same change, same tree: `git diff be81f49 e5bfb08 --stat` shows only the expected
  divergence from their different parents; both carry the identical buyer label and the same
  `test-first-viewport-audience.mjs` regression (141 lines added in both).
- Current main (`c447585`) serves the buyer label:
  `grep -o "For the owner, founder or marketer of a high-ticket service business" public/index.html`
  → matched.
- Live production serves it too:
  `curl -s https://tinystudio.io/ | grep ...` → matched (2026-08-14).
- Regression test is wired and green on current main:
  `npm run test:viewport` → 4 tests, 4 pass, 0 fail.
- `package.json` wires `test:viewport` into `npm test` (`npm run check && … && test:viewport …`).

## Files changed in this lane

None — code is already landed. This lane produced only this report
(`.lane/reports/fix-first-viewport-audience-deploy-recur-lane1-20260815.md`).

## Recommended cleanup (not done here, out of scope)

The stale local branch `fix/first-viewport-audience-deploy-recur` (commit `be81f49`, not on
origin) and its worktree `first-viewport-audience-deploy-recur` hold the unmerged duplicate.
It can be deleted after this verification; the remote `origin/fix/first-viewport-audience-deploy-recur`
was not found, so the stale state is local-only.
