# Stray root-level data.json — verified resolved and closed (2026-08-14)

Date: 2026-08-14
Scope: closeout receipt for item `e5021d2e1e` — "Stray 1.2 MB data.json
sits untracked in the product repo root — a secret-shaped desk/triage".
The suspected secret-shaped file is already gone from the checkout, already
prevented from ever entering the public repo by a merged ignore rule, and
never exists anywhere in git history. This receipt records a state
verification; no code change is needed.

## What the stray file was

A ~1.2 MB agent-state dump (desk triage, spend, campaigns, internal emails,
credential mentions by name) accidentally written to the product repo root
as untracked `data.json`. It was never pushed to `origin/main`, but an
automated repo-sync snapshot once swept it into a dangling local ref —
proving the commit risk this item guarded against.

## The fix already landed: PR #160 (merged)

| | |
|---|---|
| PR | **#160** "chore(gitignore): ignore stray fleet desk snapshot data.json at repo root" |
| commit | `5c7c5e9` (on `origin/main`; branch `fix/gitignore-stray-fleet-desk-data-json`) |
| change | `.gitignore` gains a root-anchored `/data.json` entry plus an explanatory comment |

The ignore rule is active on current `origin/main` (`895ad9c`): a fresh
clone contains no `data.json`, and `git status` on the working tree is
clean.

## Verification performed (2026-08-14)

1. **Working tree**: `git status --porcelain` clean; `find . -name
   data.json` finds nothing (checked at the start of this run — no stray
   file is present in this checkout).
2. **Ignore rule on main**: `git show origin/main:.gitignore | grep
   data.json` → `/data.json` present (line 8).
3. **Never tracked**: `git log --all --diff-filter=A -- data.json` → no
   commits; `git ls-tree -r origin/main --name-only | grep -c data.json`
   → 0; `git ls-files` → 0.
4. **Fresh clone**: `git clone --depth 1 origin/main` → no `data.json`
   anywhere in the tree.
5. **No open delivery path**: `gh pr list --state open` → no open PR
   touches the root ignore or carries this item (PR #160 is merged and
   closed).
6. **Security posture**: root-anchored ignore guarantees the secret-shaped
   dump cannot be committed into the public repo even if it reappears in a
   checkout; the live checkout copy was already deleted.

## Resulting state

**The item is closed.** The stray secret-shaped `data.json` is gone from the
checkout, cannot enter the public repo (merged root-anchored ignore from
PR #160), never existed in git history, and no open PR carries any part of
this item. Reopening this item or creating a duplicate PR would recreate
exactly the churn the fleet reconciled — this receipt is the authoritative
closeout of item `e5021d2e1e`.

## Reproduce

- `git show origin/main:.gitignore | grep data.json` → `/data.json`
- `git ls-tree -r origin/main --name-only | grep -c data.json` → 0
- `git log --all --oneline --diff-filter=A -- data.json` → (empty)
- `git clone https://github.com/nish3451/TinyStudio.io && ls data.json`
  → no such file
- `gh pr view 160 --repo nish3451/TinyStudio.io` → MERGED, closed
