# First-viewport buyer-audience fix — verified already merged and live (2026-08-21, lane 1)

Date: 2026-08-21
Item: c078f6958c — "[unreviewed-by-opus] The first-viewport buyer-audience
fix is complete and verified but stranded — sol-sweep packet"
Scope: authoritative re-verification of the stranded first-viewport
buyer-audience fix (`fix(home): name the buyer in the first-viewport hero and
deploy the pass-4 fix`, original commit `be81f49` on the unmerged branch
`fix/first-viewport-audience-deploy-recur`) against current `origin/main`
(`92d55c3`) and the live deployment. The fix itself is already on
`origin/main` via PR #171 (merge commit `e5bfb08`, 2026-08-13) — the
re-land of the stranded commit onto current main — and the 2026-08-14 lane
that verified this already merged and live (PR #208, `20b7cc6`) also landed.
This receipt is a state verification of the repository and the live site, not
a code change. Re-opening the stale branch as a PR would recreate a duplicate
of the already-merged #171.

## State of the item on current main

`origin/main` (`92d55c3`, "fix(check): guard the apple touch icon on every
served page, and re-verify finding 98a7bf8e08fc (2026-08-20) (#256)") carries
the fix as merged via PR #171 (`e5bfb08`, squash-merged 2026-08-13):

- `public/index.html` — the hero `<p class="sub">` names the buyer:
  "For the owner, founder or marketer of a high-ticket service business — we
  read the one page your revenue depends on …".
- `scripts/test-first-viewport-audience.mjs` — the 141-line regression guards
  the first-viewport buyer naming (hero block must name buyer + industry;
  rejects pre-fix hero, below-fold-only label, role-only label, missing hero;
  verifies repo-truth anchors and npm wiring).
- `package.json` — `test:viewport` wired into `npm test`.

Verified line-by-line on the worktree HEAD (see "Source check on the current
head" below).

## Landing history (why the item is already closed)

- Stranded original: `be81f49` on branch `fix/first-viewport-audience-deploy-recur`
  (parent `dc1542a`). Never merged directly.
- Re-land: PR #171, merge commit `e5bfb08`
  (`fix(home): name the buyer in the first-viewport hero and deploy the pass-4 fix (#171)`),
  squash-merged 2026-08-13T19:24:02Z. `git merge-base --is-ancestor e5bfb08 origin/main` → YES.
- Prior verification lane (2026-08-14): PR #208 (`20b7cc6`,
  "docs(evidence): verify first-viewport buyer-audience fix already merged and
  live (#171)"), merged 2026-08-14T19:34:35Z.
- The stranded commit `be81f49` itself is NOT an ancestor of `origin/main`
  (it was superseded by the identical re-land `e5bfb08`), which is why the
  stale branch still appears unmerged.

## Live verification (2026-08-21, against the deployed worker)

| URL | live status | notes |
|---|---|---|
| `https://tinystudio.io/` | HTTP 200 | serves the buyer label in the hero |
| hero label | present | "For the owner, founder or marketer of a high-ticket service business" matched in the served HTML |

## Source check on the current head (`92d55c3`)

`npm` is not on the runner's default PATH; `npm test` was re-run with
`PATH="$HOME/.local/bin:$PATH"`.

| Step (`package.json` script) | Result |
|---|---|
| `check` (`node scripts/check-site.mjs`) | PASS — "TinyStudio.io checks passed." |
| `test:headings` | PASS — 6/6 |
| `test:sitemap` | PASS — 7/7 |
| `test:worker` | PASS — 83/83 |
| `test:ui` | PASS — 16/16 |
| `test:contract` | PASS — 8/8 |
| `test:study` | PASS — 2/2 |
| `test:viewport` (`node --test scripts/test-first-viewport-audience.mjs`) | PASS — 4/4 |
| `test:narrow-pages` | PASS — exit 0 |
| `test:narrow` | PASS — exit 0 |

Total: 126 tests, 0 failures.

## Evidence

- `git merge-base --is-ancestor e5bfb08 origin/main` → YES (fix landed).
- `git merge-base --is-ancestor be81f49 origin/main` → NO (stale duplicate, as expected).
- `git show origin/main:public/index.html | grep -c "For the owner, founder or marketer of a high-ticket service business"` → 1.
- `git show origin/main:package.json | grep test:viewport` → wired into `npm test`.
- `git ls-tree origin/main --name-only scripts/ | grep viewport` → `test-first-viewport-audience.mjs` present.
- PR #171 state=MERGED (mergeCommit `e5bfb084fea11294c92006522b7c4fc93119e8f4`).
- PR #208 state=MERGED (mergeCommit `20b7cc6c4dff9965f43a3e53a2c38e49bcdfb175`).
- Live `curl -sL https://tinystudio.io/` carries the buyer label (HTTP 200).

## Recommended cleanup (not done here, out of scope)

The stale branch `fix/first-viewport-audience-deploy-recur` (commit `be81f49`)
is the unmerged duplicate of the landed fix. It can be deleted after this
verification; the fix's content is fully present on `origin/main` via `e5bfb08`.
