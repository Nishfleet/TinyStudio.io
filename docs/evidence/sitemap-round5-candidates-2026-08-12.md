# Sitemap candidate round 5: candidate worktrees harvest closeout

Date: 2026-08-12
Scope: the five abandoned round-5 candidate worktrees for the finding that
`public/sitemap.xml` did not cover the five human-facing pages ("Publish a
complete sitemap covering the five human-facing pages"), per the continuity
line in `agent-state/tinystudio-io-improvement-loop/retired-cycles.md`
(2026-08-09T13:54:27, retired at stage `attempts`):

- `/home/nish/workspaces/agent-worktrees/tinystudio-io-sitemap-{1,2,3,4,5}`

This receipt records the judgment of the round: which candidate won, where
the winning work landed on main, what happened to the losing candidates, and
the fresh verification on the current head — so the tracker item can close
with a reason and cannot re-open by drift.

## What the candidate worktrees contained

All five worktrees sit at the same **detached HEAD `aa64d7d`** ("fix(public):
repair broken App Store citation on /audit (dogfood 78fcaed682fa) (#33)", the
parent of the fix) with the same uncommitted shape in every worktree:

- `M package.json` — wires the guard into CI: adds `"test:sitemap"` and the
  `&& npm run test:sitemap` link in the `test` chain;
- `M public/sitemap.xml` — +12 lines adding the four missing human-facing
  pages (`/audit`, `/agents`, `/pricing`, `/specimen`) to the pre-fix
  three-URL sitemap (`/`, `/offer.md`, `/llms.txt`);
- `?? scripts/test-sitemap.mjs` — the untracked regression guard;
- `D study/__pycache__/harvest.cpython-312.pyc` — a deleted Python bytecode
  cache file; build artifact with no content.

The five candidates differ in the **loc order** of `sitemap.xml` and the
**guard implementation** in `scripts/test-sitemap.mjs`:

| Worktree | `sitemap.xml` loc order | `test-sitemap.mjs` (untracked) |
| --- | --- | --- |
| tinystudio-io-sitemap-1 | `/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/offer.md`, `/llms.txt` — **byte-identical to the shipped file** | 155-line guard, generic wording |
| tinystudio-io-sitemap-2 | alternative "crawl-priority" order: `/pricing`, `/audit`, `/specimen`, `/agents` first | 70-line guard, earliest draft |
| tinystudio-io-sitemap-3 | mirrors kept first: `/`, `/offer.md`, `/llms.txt`, then the four pages | 82-line guard |
| tinystudio-io-sitemap-4 | `/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/offer.md`, `/llms.txt` — **byte-identical to the shipped file** | 111-line guard, with known-bad-shape fixtures |
| tinystudio-io-sitemap-5 | `/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/offer.md`, `/llms.txt` — **byte-identical to the shipped file** | 217-line guard — **byte-identical to the shipped file** |

## Judgment of the round

- **Winner: `tinystudio-io-sitemap-5`.** All three product files in its
  working tree — `public/sitemap.xml`, `scripts/test-sitemap.mjs`,
  `package.json` — are **byte-identical** to the harvested commit `2e142f4`
  ("seo: publish complete sitemap covering the five human-facing pages
  (harvested round-5 candidate)"). Candidate-5's guard is a strict superset
  of the other four drafts' coverage: exact ordered-loc lock, absolute-URL
  and extensionless-path checks, trailing-slash rule, `/brief-requested`
  (noindex) and `/agent-desk` (legacy) exclusions, robots.txt directive
  check, and embedded "known bad shape" fixtures. Candidates 1 and 2 lacked
  the robots directive check; candidate 3 lacked the fixtures and order lock;
  candidate 4 lacked the robots, trailing-slash and order-lock checks.
- **Shared the loc order: candidates 1, 4 and 5.** Their `sitemap.xml` files
  are byte-identical to the shipped file (md5 `a4518678…`), so the shipped
  canonical order (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`,
  `/offer.md`, `/llms.txt`) is common to the three; only candidate-5's guard
  shipped.
- **Superseded: candidates 1–4.** Their guard scripts are alternative
  wordings and alternative coverage sets of the same change, judged during
  the round and not selected; nothing in them is absent from the winner's
  shipped guard.

## Where the winning work landed

The winner's working-tree state was committed as `2e142f4` on branch
`seo/complete-sitemap-five-pages` (pushed as `origin/seo/complete-sitemap-five-pages`)
and merged as **PR #36** (`cd9184c`, "seo: publish complete sitemap covering
the five human-facing pages (harvested round-5 candidate)", merged
2026-08-09). The squash merge is **tree-identical** to the harvested commit
(`git diff 2e142f4 cd9184c` is empty). The shipped files remain current on
`origin/main`:

- `git show origin/main:public/sitemap.xml` is **byte-identical** to
  candidate-5's file (md5 `a4518678…`), and
  `git show origin/main:scripts/test-sitemap.mjs` is **byte-identical** to
  candidate-5's file (md5 `7a9f5d7e…`).
- `package.json` differs from candidate-5's file only by later, unrelated
  round changes: the description rename to "The Website Appraisal"
  (product-contract round, PR #58), the added `test:contract` script (PR
  #58), and the wrangler toolchain bump `^4.93.0` → `^4.120.1` (PR #101).
- The finding was subsequently re-verified against main and live by
  `817a699` (#44, 2026-08-09), `ed18c6e` (#82, 2026-08-11), and the
  2026-08-11 closeout section of `docs/evidence/sitemap-2026-08-09.md`.

## Verification on the current head (`18128e8`, 2026-08-12)

Full suite on a fresh `origin/main` checkout of this worktree:

- `npm run check` — "TinyStudio.io checks passed."
- `npm run test:headings` — 6/6; `npm run test:sitemap` — 7/7;
  `npm run test:worker` — 55/55; `npm run test:ui` — 16/16;
  `npm run test:contract` — 8/8. Exit 0, zero `not ok`.

## Conclusion

Nothing further to change. The round is closed with a reason: the round-5
candidate winner (`tinystudio-io-sitemap-5`) was already harvested as commit
`2e142f4` and merged as PR #36 (`cd9184c`), whose tree is identical to the
candidate's uncommitted working state; `public/sitemap.xml` and
`scripts/test-sitemap.mjs` remain byte-identical to that state on current
`origin/main` (only unrelated later package.json deltas), and the regression
suite still passes. The superseded candidates (1–4) were alternative loc
orderings and guard drafts, all subsumed by the shipped guard; they remain
preserved on disk at detached HEAD `aa64d7d`, with no unique uncommitted work
beyond the winner's tree and the stray `.pyc` deletion in each. The sitemap
covers the complete indexable surface (five human-facing pages plus the two
machine-readable mirrors) and cannot regress without `npm test` failing.
