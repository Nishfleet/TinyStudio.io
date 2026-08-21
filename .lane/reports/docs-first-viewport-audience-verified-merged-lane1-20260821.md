# Lane report: first-viewport buyer-audience fix — verified already merged and live (2026-08-21, lane 1)

Lane: tinystudio-io lane 1
Branch: `docs/first-viewport-audience-verified-merged-lane1-20260821`
Item: c078f6958c — "[unreviewed-by-opus] The first-viewport buyer-audience fix is complete and verified but stranded — sol-sweep packet"

## Outcome

**Closed.** The fix is already merged and live on main — no code change is
required. The stranded commit `be81f49` (`fix(home): name the buyer in the
first-viewport hero and deploy the pass-4 fix`) on the stale branch
`fix/first-viewport-audience-deploy-recur` was re-landed as PR #171 (squash
merge `e5bfb08`, 2026-08-13T19:24:02Z), which is an ancestor of current
`origin/main` (`92d55c3`). The 2026-08-14 lane that verified this already
merged and live (PR #208, `20b7cc6`) also landed. This lane re-verified the
survivor authoritatively against the current `origin/main` (`92d55c3`) and
the live deployment: the buyer label is in main's `public/index.html` and
served on live `https://tinystudio.io/`, the `test:viewport` regression
(4/4) is wired into `npm test`, and the full suite is green (126 tests,
0 failures).

No code change was made on this branch — opening a duplicate of PR #171
would have recreated the stranded-branch cluster the fleet already
reconciled via the merged evidence PR #208.

## Verification performed (2026-08-21)

1. **GitHub state**: PR #171 merged to `origin/main` as `e5bfb08` (squash,
   2026-08-13T19:24:02Z); PR #208 (the 2026-08-14 evidence verification)
   merged as `20b7cc6` (2026-08-14T19:34:35Z); `origin/main` head `92d55c3`
   carries the fix.
2. **Git ancestry**:
   - `git merge-base --is-ancestor e5bfb08 origin/main` → YES (fix landed).
   - `git merge-base --is-ancestor be81f49 origin/main` → NO (stale
     duplicate, as expected — superseded by the identical re-land).
3. **Live probe**: `curl -sL https://tinystudio.io/` → HTTP 200, hero serves
   "For the owner, founder or marketer of a high-ticket service business".
4. **Tree checks** on the worktree HEAD (`92d55c3`): `PATH="$HOME/.local/bin:$PATH" npm test`
   → exit 0, 126 tests, 0 failures (headings 6, sitemap 7, worker 83, UI 16,
   contract 8, study 2, viewport 4, narrow-pages exit 0, narrow exit 0).
5. **Regression guard**: `node --test scripts/test-first-viewport-audience.mjs`
   → 4/4 pass, including the known-bad fixtures (pre-fix hero rejected,
   below-fold-only label rejected, role-only hero rejected, missing hero
   rejected) and the npm-wiring assertion.
6. **Main carries the fix**: `git show origin/main:public/index.html` has the
   buyer label; `git show origin/main:package.json` wires `test:viewport` into
   `npm test`; `scripts/test-first-viewport-audience.mjs` present on main.

## Files changed

- `docs/evidence/first-viewport-audience-verified-merged-lane1-20260821.md`
  — new evidence receipt recording the authoritative re-verify against
  current `origin/main` (`92d55c3`) and live (the lane's claimed file).
- `.lane/reports/docs-first-viewport-audience-verified-merged-lane1-20260821.md`
  — this lane-1 closeout.

## Delivery

- Branch: `docs/first-viewport-audience-verified-merged-lane1-20260821`
- PR: opened against `origin/main` carrying the evidence closeout.
- Fix delivery: PR #171 merged to main (`e5bfb08`), the sole delivery path;
  prior verification evidence PR #208 already merged. No re-land needed.
