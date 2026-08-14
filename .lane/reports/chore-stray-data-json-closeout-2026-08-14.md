# Lane report: stray root-level data.json closeout (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `chore/stray-data-json-closeout-2026-08-14`
Item: e5021d2e1e — "Stray 1.2 MB data.json sits untracked in the product repo root — a secret-shaped desk/triage"

## Outcome

**Closed — verified already resolved; evidence receipt opened.** The
suspected secret-shaped `data.json` is gone from the checkout, the fix
(root-anchored `/data.json` ignore) was already merged to main via
**PR #160** (`5c7c5e9`, 2026-08-13), and the file never entered git
history (`git log --all --diff-filter=A -- data.json` → empty). Verified
on this run: working tree clean, no `data.json` anywhere in a fresh
`origin/main` clone (`895ad9c`), no open PR carries the item. No code
change was needed — opening a duplicate fix PR would have re-created the
exact churn the fleet already reconciled. This lane records the
authoritative closeout receipt.

## Verification performed

1. **Working tree**: `git status --porcelain` clean; `find . -name
   data.json` → nothing.
2. **Ignore rule on main**: `/data.json` present in
   `origin/main:.gitignore` (line 8, from merged PR #160).
3. **Never tracked**: `git log --all --diff-filter=A -- data.json` → no
   commits; `git ls-tree -r origin/main --name-only | grep -c data.json`
   → 0; `git ls-files | grep -c data.json` → 0.
4. **Fresh clone**: `git clone --depth 1 --branch main` → no `data.json`.
5. **Open PRs**: `gh pr list --state open` → no open PR touches the root
   ignore or carries this item; PR #160 is merged/closed.
6. **Security posture**: root-anchored ignore means even a reappearing
   checkout copy cannot be committed to the public repo; the live copy
   was already manually removed.

## Files changed

- `docs/evidence/stray-data-json-closeout-2026-08-14.md` — new evidence
  receipt recording the verified resolved-and-closed state (the lane's
  claimed file).
- `.lane/reports/chore-stray-data-json-closeout-2026-08-14.md` — this lane
  report (lane-unique path, per packet contract).

## Delivery

- Branch: `chore/stray-data-json-closeout-2026-08-14`
- PR: opened against origin/main carrying the evidence closeout.
