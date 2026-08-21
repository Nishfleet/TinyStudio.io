# tinystudio-io lane 1 — stray root `data.json` re-dispatch re-verify (2026-08-21)

- Branch: `lane1/stray-data-json-redispatch-reverify-2026-08-21` (off `origin/main` @ `92d55c3`)
- Item: `e5021d2e1e` — `[unreviewed-by-opus] Stray 1.2 MB data.json sits untracked in the product repo root — a secret-shaped desk/triage`
- Packet dispatch: 2026-08-21 06:45 (`/home/nish/workspaces/agent-worktrees/REPORT-.packet-tinystudio-io-lane1-1787274943828.md`)

## Outcome: already resolved on `origin/main` — re-verified, recommended to strike

The packet item targets a state that no longer exists. The stray 1.2 MB
secret-shaped `data.json` was deleted from the product repo root on
**2026-08-20**, and the root-anchored ignore that prevents re-commit was
merged two cycles earlier. This re-dispatch was a stale queue emission
([unreviewed-by-opus]) of an item the fleet already closed twice.

| Verification | Result |
| --- | --- |
| `ls /home/nish/workspaces/products/TinyStudio.io/data.json` | No such file or directory |
| `find . -maxdepth 3 -name data.json` in worktree | empty |
| `git status --porcelain` on this worktree | clean |
| `git ls-tree -r origin/main --name-only \| grep -c data.json` | `0` |
| `git ls-files \| grep -c data.json` | `0` |
| `git log --all --diff-filter=A -- data.json` | (empty — file never tracked) |
| `git show origin/main:.gitignore \| grep -n data.json` | line 8: `/data.json` (with explanatory comment) |
| `git merge-base --is-ancestor 5c7c5e9c origin/main` | true (PR #160, chore gitignore) |
| `git merge-base --is-ancestor 548fc9ca origin/main` | true (PR #200, evidence closeout) |
| `git merge-base --is-ancestor 2e3d7a86 origin/main` | true (truthful amend: actual 2026-08-20 deletion) |

## Why the item cannot be "done" again

1. **The file is gone.** Verified on `origin/main` (`92d55c3`), on the
   worktree, and on the canonical checkout
   `/home/nish/workspaces/products/TinyStudio.io/`. There is no
   checkout copy to remove; the 2026-08-20 amendment (commit
   `2e3d7a86`) records the truth: a frozen 2026-08-17 fan-out copy
   sat untracked until manually `rm`'d on 2026-08-20.
2. **The ignore is already in place.** `origin/main:.gitignore` line 8
   reads:

   ```
   # Stray fleet desk/triage snapshot accidentally written to the repo root
   # (agent-state dump with internal triage/spend/credential-mention content).
   # Never belongs in the public product repo; the live file must be deleted
   # from the checkout, this only guarantees it cannot be committed again.
   /data.json
   ```

   The root anchor (`/data.json`) keeps the rule precise — only the
   stray root dump is blocked; legitimate `data/*` paths under the
   repo are untouched (e.g., `study/corpus.json` is tracked fine).
3. **The file never entered git history.** No commit ever added
   `data.json`; `git ls-tree -r origin/main` returns 0 matches. The
   only `data.json` reference in the entire main tree is the
   `.gitignore` comment itself.
4. **The item has been formally closed twice.** PR #200 (commit
   `548fc9ca`) closed it as already resolved on 2026-08-14; commit
   `2e3d7a86` on 2026-08-20 amended the closeout to state the true
   deletion timeline after the postmerge-200 audit found the 2026-08-14
   claim of "already deleted" was premature.
5. **No open PR carries any part of this work.** No duplicate guard,
   ignore rule, or evidence amend is open.

## What this PR does

Per the packet's permitted terminal state — "report plainly why the
item cannot be done" — this PR is **evidence-only**. The branch
touches a single lane-unique file (this report) and opens a small
verification PR so the next re-dispatch of the same `[unreviewed-by-opus]`
item finds a fresh closeout receipt at the tip and stops emitting it.

## Files changed

- `.lane/reports/lane1-stray-data-json-redispatch-reverify-2026-08-21.md`
  — this lane report. Lane-unique path; the only file on the branch;
  follows the inish-site precedent for already-resolved items
  (PR nish3451/inish-site#97, 2026-08-20).

## Delivery

- Branch: `lane1/stray-data-json-redispatch-reverify-2026-08-21`
- Base: `origin/main` @ `92d55c3`
- PR: opened against `nish3451/TinyStudio.io`
- Lane claim: published to
  `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json`
  (`claims` field only — atomic temp-file + rename; no other field
  touched).
- Dispatch report:
  `/home/nish/workspaces/agent-worktrees/REPORT-.packet-tinystudio-io-lane1-1787274943828.md`

## Recommendation

Strike item `e5021d2e1e` from the backlog. The work is done, the
receipts are merged, and re-dispatching it produces no remediation
work — only duplicate PRs that conflict with the existing closeouts.
If a new stray desk dump does reappear at the repo root, the
root-anchored `/data.json` ignore in `.gitignore` (PR #160) will
catch it before it can be committed; that is the durable fix.
