# Product-contract candidate round 1: candidate worktrees harvest closeout

Date: 2026-08-12
Scope: the seven abandoned round-1 candidate worktrees for the finding
`f168b00e05` ("repository product contract still identifies retired Agent Desk
as current"), per the continuity lines in
`agent-state/tinystudio-io-improvement-loop/retired-cycles.md`:

- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-20260810-{1,2,3,4,5}`
- `/home/nish/workspaces/agent-worktrees/candidates/tsio-product-contract-refine-20260810-{1,2}`

This receipt records the judgment of the round: which candidate won, where
the winning work landed on main, what happened to the losing candidates, and
the fresh verification on the current head — so the tracker item can close
with a reason and cannot re-open by drift.

## What the candidate worktrees contained

Every candidate worktree had its work **committed** to its own branch, and
every branch is pushed to `origin` and in sync (local == remote):

| Worktree | Branch | HEAD | Content |
| --- | --- | --- | --- |
| tsio-product-contract-20260810-1 | `candidate/product-contract-a121ce8c-1` | `1717322` | docs(contract): Website Appraisal as current offer + contract-guard script (172 lines) |
| tsio-product-contract-20260810-2 | `candidate/product-contract-a121ce8c-2` | `fa6fbe8` | same change, alternative wording, larger guard (226 lines) |
| tsio-product-contract-20260810-3 | `candidate/product-contract-a121ce8c-3` | `8c6aab2` | same change, alternative wording, largest guard (304 lines) |
| tsio-product-contract-20260810-4 | `candidate/product-contract-a121ce8c-4` | `c8f7e66` | same change, "legacy" framing, smallest guard (115 lines) |
| tsio-product-contract-20260810-5 | `candidate/product-contract-a121ce8c-5` | `012fa30` | same change, most extensive docs rewrite, guard (148 lines) |
| tsio-product-contract-refine-20260810-1 | `candidate/product-contract-refine-a121ce8c-1` | `ffa459b` | refine: keep the product guard on repo truth, not app internals |
| tsio-product-contract-refine-20260810-2 | `candidate/product-contract-refine-a121ce8c-2` | `a8e1c89` | refine: harden product-contract guard against brittleness |

The only uncommitted item in each worktree was a deleted Python bytecode
cache file (`study/__pycache__/harvest.cpython-312.pyc`); a build artifact
with no content. There was no finished-but-uncommitted product work to
recover — the "hold finished, uncommitted diffs" premise of the backlog item
was stale by the time of this harvest.

## Judgment of the round

- **Winner (docs): `candidate-1`.** Its docs commit `1717322` is
  **tree-identical** to `4a97738` on the eventual merged branch
  (`improve/repository-product-contract-a121ce8c`) — the same tree,
  rebased. The docs wording that shipped is candidate-1's wording.
- **Winner (guard): `refine-1`.** Its guard commit `ffa459b` is
  **tree-identical** to `eec3fe3` on the merged branch. The shipped guard
  philosophy (guard repo truth, not app internals) is refine-1's.
- **Superseded: candidates 2–5 and refine-2.** These were alternative
  wordings and alternative guard implementations of the same change. They
  were judged against the winner lineage during the round and not selected;
  nothing in them is absent from the winner lineage's later hardening
  (`4d6d6f4` reject contradictory truth, `65a713d` reject mixed positive
  guarantees, `96a10b3` scope contradiction checks to each claim).

## Where the winning work landed

The winner lineage (`candidate-1` docs + `refine-1` guard + the three
hardening commits) was carried by branch `improve/repository-product-contract-a121ce8c`
and merged as **PR #58** (`11864a7`, "docs(contract): make the Website
Appraisal the active repo truth", merged 2026-08-10, squash). Its contract
content is still current on `origin/main`:

- `git diff 11864a7 origin/main -- README.md MEMORY.md package.json
  scripts/test-product-contract.mjs specs/004-website-appraisal/plan.md`
  is empty except the later wrangler toolchain bump (#101) — no contract
  drift since the merge.
- Every guard mechanic from the candidate/refine round is present in
  main's `scripts/test-product-contract.mjs`: bounded leading-banner status
  declaration (`hasLeadingStatus`), per-claim Agent Desk evaluation
  (`matchAll` over `AGENT_DESK_ACTIVE_PATTERNS`), negation-precedes-term
  guarantee check (`term.index`), and the `WEBSITE_STORED`/`NEGATION`
  disclosure guards.

## Verification on the current head (`18128e8`, 2026-08-12)

Full suite on a fresh `origin/main` checkout of this worktree:

- `npm run check` — "TinyStudio.io checks passed."
- `npm run test:headings` — 6/6; `npm run test:sitemap` — 7/7;
  `npm run test:worker` — 55/55; `npm run test:ui` — 16/16;
  `npm run test:contract` — 8/8. Exit 0, zero `not ok`.

## Conclusion

Nothing further to change. The round is closed with a reason: the candidate
round's winner (`candidate-1` + `refine-1`) was already harvested through the
`improve` branch and merged as PR #58; the superseded candidates (2–5,
refine-2) remain preserved on `origin/candidate/*` for reference; the
abandoned lane-1 worktree was separately closed out by PR #72, and the
underlying finding by PR #99. All seven candidate worktrees contain only a
stray `.pyc` deletion beyond their pushed branches, so no uncommitted work
existed to rescue. The repository product contract identifies The Website
Appraisal as current, the retired Agent Desk stays bounded as legacy
mechanics, and the deterministic contract guard passes on the current head.
