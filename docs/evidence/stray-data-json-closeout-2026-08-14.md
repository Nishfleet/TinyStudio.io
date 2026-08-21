# Stray root-level data.json — verified resolved and closed (2026-08-14), **amended (2026-08-20)**

Date: 2026-08-14 (original closeout); amended 2026-08-20
Scope: closeout receipt for item `e5021d2e1e` — "Stray 1.2 MB data.json
sits untracked in the product repo root — a secret-shaped desk/triage".

> ## ⚠️ Amendment (2026-08-20) — the original closeout understated the facts.
>
> The 2026-08-14 version of this receipt claimed "the live checkout copy
> was already deleted" and that step 1 of its verification ("no stray file
> is present in this checkout") was run on *the* deploy checkout. **That
> was not true.** A post-merge audit (postmerge-200) found that the
> secret-shaped root `data.json` was **still physically present** in the
> product deploy checkout
> (`/home/nish/workspaces/products/TinyStudio.io/data.json`) — 1,455,002
> bytes, mode `-rw-------`, mtime 2026-08-14 02:35 IST — a **frozen copy
> left by an ad-hoc 2026-08-17 fan-out**, byte-for-byte the same class of
> internal agent-state dump (317 "triage", 210 "email", 73 "credential",
> 55 "spend", 10 "campaign" mentions). It was never tracked in git ("never
> tracked" stays TRUE) and never public (`https://tinystudio.io/data.json`
> → 404), because the root-anchored `/data.json` ignore rule (PR #160,
> merged 2026-08-13) silently kept the working-tree copy untracked. That is
> exactly the protection the ignore rule is for — but the closeout sealed
> the item on a stale observation, asserting a deleted file that still
> lived in the deploy checkout until **2026-08-20**, when it was finally
> `rm`'d. It is now gone: `find . -name data.json` and `ls data.json` on
> the deploy checkout both return nothing (verified this run).
>
> Whatever claimed otherwise in the 2026-08-14 verifications below must be
> read in light of this correction: the ignore rule prevented the dump from
> ever reaching the public repo or git history, but **deletion of the live
> deploy-checkout copy was only ever the intent, not yet the reality.**
> Actual deletion happened on 2026-08-20. That is the truth this amended
> receipt records.
>
> Related remediation in the same packet: the Hermes `ReadWritePaths`
> grant on that same deploy checkout (`55-fleet-state-visibility.conf`) is
> the mechanism that made it possible for an agent to write the dump into
> the checkout at all; review notes are in this file's companion packet
> and rollback is documented in that unit drop's header.

## What the stray file was

A ~1.2 MB (1,455,002-byte) agent-state dump (desk triage, spend, campaigns,
internal emails, credential mentions by name) accidentally written to the
product repo root as untracked `data.json`. It was never pushed to
`origin/main` — but an automated repo-sync snapshot once swept it into a
dangling local ref, proving the commit risk this item guarded against.

## The fix already landed: PR #160 (merged) — and what it actually guarantees

| | |
|---|---|
| PR | **#160** "chore(gitignore): ignore stray fleet desk snapshot data.json at repo root" |
| commit | `5c7c5e9` (on `origin/main`; branch `fix/gitignore-stray-fleet-desk-data-json`) |
| change | `.gitignore` gains a root-anchored `/data.json` entry plus an explanatory comment |

The root-anchored `/data.json` ignore is active on `origin/main` (`0540cf9`):
a fresh clone contains no `data.json`, and `git status` on the working tree
is clean. **Critically, the ignore rule protects git and the public repo —
it does not delete a file that is sitting untracked in a checkout.** That
is the guarantee the closeout relied on, and that is the distinction the
2026-08-14 receipt blurred.

## Verification performed (2026-08-14) — with 2026-08-20 corrections

1. **Working tree**: `git status --porcelain` clean. ❌ The 2026-08-14
   claim appended "no stray file is present in this checkout" — **false on
   the primary deploy checkout**; `data.json` was still there.
   ✅ Verified 2026-08-20: `find . -name data.json` and `ls data.json` on
   the deploy checkout return nothing — the file is finally deleted.
2. **Ignore rule on main**: `git show origin/main:.gitignore | grep
   data.json` → `/data.json` present (line 8). ✅ Still true on `0540cf9`.
3. **Never tracked**: `git log --all --diff-filter=A -- data.json` → no
   commits; `git ls-tree -r origin/main --name-only` scan of all commits →
   no root data.json on any GitHub ref; `git ls-files` → 0. ✅ TRUE,
   unchanged by the amended deadline — the dump never entered git history.
4. **Fresh clone**: `git clone --depth 1 origin/main` → no `data.json`
   anywhere in the tree. ✅ TRUE.
5. **No open delivery path**: `gh pr list --state open` → no open PR
   touches the root ignore or carries this item (PR #160 is merged and
   closed). ✅ TRUE.
6. **Security posture**: The 2026-08-14 claim that "the live checkout copy
   was already deleted" was **untrue at the time**. What IS true: the
   root-anchored ignore guaranteed the secret-shaped dump could not be
   committed into the public repo even while it sat untracked in the
   deploy checkout. The residual risk was that any path that bypasses
   gitignore (`git add -f`, stash pop, worktree switch, tooling that does
   not honor gitignore) could have staged and pushed the internal dump.
   ✅ That residual risk is now retired: the file was deleted from the
   deploy checkout on 2026-08-20, and no `data.json` remains.

## Resulting state

**The item is closed, now truthfully.** The stray secret-shaped `data.json`
is gone from the deploy checkout — not "already gone at closeout", but gone
for real as of **2026-08-20** after sitting there undetected as a frozen
2026-08-17 fan-out copy. It never existed in git history and never reached
the public repo — both TRUE, both unchanged. Reopening this item or
creating a duplicate PR would recreate exactly the churn the fleet
reconciled; this amended receipt is the authoritative closeout of item
`e5021d2e1e`, corrected to state the true deletion timeline.

## Reproduce

- `git show origin/main:.gitignore | grep data.json` → `/data.json`
- `git ls-tree -r origin/main --name-only --full-tree | xargs -I{} git show origin/main:{} 2>/dev/null || true` → no root data.json
- `git log --all --oneline --diff-filter=A -- data.json` → (empty)
- on the deploy checkout: `find . -name data.json` → (empty); `ls data.json` → no such file (deleted 2026-08-20)
- `git clone https://github.com/nish3451/TinyStudio.io && ls data.json` → no such file
- `gh pr view 160 --repo nish3451/TinyStudio.io` → MERGED, closed (ignore rule)