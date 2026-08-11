# PR #29 (canonical URLs) rebase/recreate review item — GitHub-state verification and closeout

Date: 2026-08-11
Scope: the review item "[unreviewed-by-grok] Rebase or recreate PR #29
(canonical URLs) — it is now CONFLICTING/DIRTY after #28/#30/#31 landed"
(review queue), re-verified against the GitHub repository state on 2026-08-11.
This receipt records a state verification of the repository's pull requests.
It is process evidence, not a live-site measurement; the site-side
verification of the canonical fix itself is the separate receipt
`docs/evidence/canonical-urls-2026-08-09.md` (finding 6631c0ab0454, closed
out via PR #38 and re-verified via PR #75).

## What the item claimed

- PR #29 (canonical URLs, branch `fix/canonical-urls`) was CONFLICTING/DIRTY
  after #28/#30/#31 landed, and needed to be rebased or recreated.

## What the re-verification found (GitHub, 2026-08-11)

### The item's historical premise was accurate, but transient

PR #29 was genuinely unmergeable for a window on 2026-08-09. The branch's
content commits (`b9be0e6`, canonical links; `1f65f26`, guard hardening)
were authored at 08:32–08:36 +0530 against a main that predated #31/#28/#30
(which landed at 10:27–10:50 +0530), so the branch went CONFLICTING/DIRTY
once those page-editing PRs merged — exactly as the item said.

That dirty window closed before the item could matter: the branch was
brought up to date with main at 13:20 +0530 (`fff0121`, "Merge origin/main
into fix/canonical-urls", merging #31/#28/#30/#32/#33/#34 into the branch),
and PR #29 was then squash-merged by GitHub at 08:00:56Z (13:30:55 +0530) as
commit `a163327` — GitHub only performs a squash merge on a mergeable
branch, so the CONFLICTING state was resolved by `fff0121` before merge.

### PR #29 is closed and merged; there is no open PR to rebase or recreate

| Fact | Value (GitHub API, 2026-08-11) |
|---|---|
| PR #29 state | `closed`, `merged: true` |
| Merged at | 2026-08-09T08:00:56Z |
| Squash commit on main | `a163327` "seo: add canonical URLs to the five public pages (finding 6631c0ab0454) (#29)" |
| Base at merge | `39a6238` (PR #34) |
| Head branch | `fix/canonical-urls` (tip `fff0121`, 2026-08-09T13:20:34+05:30) |

Timeline (times +0530):

| Time (2026-08-09) | Event |
|---|---|
| 08:32–08:36 | `b9be0e6` + `1f65f26` authored on `fix/canonical-urls` (the whole PR) |
| 10:27 | #31 (social share image) merged |
| 10:40 | #28 (heading hierarchy) merged |
| 10:50 | #30 (apple touch icon) merged |
| 12:01, 12:50, 13:18 | #32 (structured data), #33 (App Store citation), #34 (internal links) merged |
| 13:20 | `fff0121` — main merged into `fix/canonical-urls`; dirty window closed |
| 13:30 | PR #29 squash-merged as `a163327`; PR closed |

### Main carries the PR's entire content; nothing unmerged remains

- `git diff origin/main...fix/canonical-urls` (branch against its merge base
  with main) is exactly the six-file, +58-line change that `a163327` squashed
  onto main: one `<link rel="canonical">` per page on
  `public/{index,audit,agents,pricing,specimen}.html` and the hardened
  canonical guard in `scripts/check-site.mjs` (exactly-one link parsed across
  the whole document, commented-out markup ignored, single/double quotes
  accepted, link must sit in `<head>`, href must be the page's absolute
  `https://tinystudio.io` address, no duplicate hrefs across pages).
- So the branch has zero content that is not already on main. Recreating or
  rebasing PR #29 would produce a PR with an empty diff; there is nothing to
  land.
- Current main head (`2ae7504`, PR #102) still carries the guard and all five
  canonicals; `npm run check` passes ("TinyStudio.io checks passed") on
  2026-08-11. Later canonical-line evolution on main (#46, #56, #102) is
  separate tracked work with its own evidence receipts, not a regression of
  the #29 fix.

### Why the item was tagged unreviewed-by-grok

PR #29 was reviewed on 2026-08-09 by coderabbitai (no actionable comments),
greptile-apps (credit-limited, no review), and chatgpt-codex-connector
(reviewed `1f65f26` and the merged tip `fff0121` at 07:53:58Z, seven minutes
before merge). No Grok review exists, so the review queue tagged the PR
unreviewed-by-grok; the CONFLICTING/DIRTY observation in the item predates
`fff0121` and the merge.

## What closes the item

- There is no open PR #29: it is `closed`/`merged` since 2026-08-09T08:00:56Z.
  A rebase or recreate is neither possible nor needed — a fresh PR from the
  same branch would carry an empty diff against main.
- The CONFLICTING/DIRTY state the item described was real but transient
  (between the #31/#28/#30 merges and `fff0121` at 13:20 +0530 on 2026-08-09)
  and was resolved by merging main into the branch before the squash merge.
- Main carries the full, exact PR content (`a163327` = the branch's entire
  unique diff), the canonical guard passes `npm run check` on the current
  head, and the finding itself (6631c0ab0454) remains closed and re-verified
  by its own receipts (#38, #75).
- No code change is needed or proposed.

## Closeout

This closes the review item "[unreviewed-by-grok] Rebase or recreate PR #29
(canonical URLs) — it is now CONFLICTING/DIRTY after #28/#30/#31 landed"
against current GitHub state (2026-08-11): PR #29 is merged, its entire
content is on main, its transient conflict was resolved before the merge,
and no open PR duplicates it. The branch `fix/canonical-urls` can be
considered retired; the item needs no further action beyond this receipt.
