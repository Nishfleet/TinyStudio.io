# Duplicate open-PR clusters residual — closeout of the two post-#105 clusters (2026-08-14)

Date: 2026-08-14
Scope: final closeout of the two residual duplicate fix-PR clusters left after
the first reconciliation (PR #105,
`docs/evidence/duplicate-open-pr-clusters-2026-08-11.md`) and its follow-up
receipts (`docs/evidence/duplicate-open-pr-clusters-residual-2026-08-11.md`
and `-reverify-2026-08-12.md`): verify against current GitHub state that
exactly one delivery path resolved per surface, that no open PR still carries
either fix, and that both fixes have landed on current `origin/main`. This
receipt records a state verification of the repository's pull requests plus
the live site; it is process evidence, not itself a code change.

## The two residual clusters (final state, GitHub 2026-08-14)

### Cluster 1 — brief-requested clean nav/back links

| PR | head branch | created | closed / merged | final state | carries |
|---|---|---|---|---|---|
| #60 | `fix/brief-requested-clean-nav-links` | 2026-08-09T21:32Z | CLOSED 2026-08-11T08:10:08Z | closed | the fix, original stale-base branch |
| #97 | `fix/brief-requested-clean-links` | 2026-08-11T01:17Z | CLOSED 2026-08-12T01:24:26Z | closed | the fix + guard-coverage receipt |
| #145 | `fix/brief-requested-clean-links-lane1` | 2026-08-12T01:24:19Z | MERGED 2026-08-14T09:42:02Z | merged (`f9214c1`) | the two-file fix |

#60 and #97 were closed as stale duplicates (each with a comment naming the
surviving delivery path); the 2026-08-12 receipt declared "#145 must be merged
for the surface to be closed". **#145 merged to main as `f9214c1`**
(2026-08-14T09:42:02Z), and `origin/main` today serves the clean anchors and
the internal-links guard entry (verified on `5eefa80` below). **No open PR
carries this fix.**

### Cluster 2 — rel=icon favicon on the five public pages

| PR | head branch | created | closed / merged | final state | carries |
|---|---|---|---|---|---|
| #47 | `fix/serve-rel-icon-favicon` | 2026-08-09T14:46Z | CLOSED 2026-08-11T08:10:09Z | closed | the fix, conflict-locked original |
| #85 | `fix/rel-icon-favicon-lane1` | 2026-08-10T21:31Z | MERGED 2026-08-11T13:43:26Z | merged (`9302611`) | the fix |
| #113 | `fix/serve-rel-icon-brief-requested` | 2026-08-11T16:14:59Z | MERGED 2026-08-11T18:34:32Z | merged (`18128e8`) | brief-requested icon + guard extension |

#47 was closed as the conflict-locked stale duplicate; #85 merged the
identical five-page `<link rel="icon" href="/favicon.svg">` fix to main
(`9302611`), and the follow-up #113 extended the icon and the favicon guard
to `/brief-requested` (`18128e8`). **No open PR carries this fix** — the
correct terminal state.

## No other carriers (open-PR scan, 2026-08-14)

Every open PR's changed-files set was scanned (19 open PRs; #67 and #45
return no file list — their heads are closed/merged states). The only open
PRs touching `public/brief-requested.html` are #112 (footer brand),
#114/#194 (pricing closing callout) and #154 (intake labels) — each a
different fix; #112's `brief-requested.html` diff is the footer line only.
No open PR touches the logo/nav/back anchors of the clean-links fix or the
five-page favicon links.

## Verification performed (2026-08-14, against `origin/main` `5eefa80`)

1. **GitHub state**: #145 MERGED (`f9214c1`); #60, #97, #47 CLOSED with
   survivor-naming comments; #85, #113 MERGED (`9302611`, `18128e8`). No open
   PR carries either fix.
2. **Main tree (cluster 1)**: `public/brief-requested.html` links the logo,
   three nav links and back link at the clean extensionless twins
   (`/`, `/audit`, `/agents`, `/pricing`); the internal-links guard in
   `scripts/check-site.mjs` covers the `brief-requested` page.
3. **Main tree (cluster 2)**: exactly one `<link rel="icon" href="/favicon.svg">`
   on all five public pages (`index`, `pricing`, `audit`, `agents`,
   `specimen`).
4. **`npm run check`** on a fresh `5eefa80` tree → "TinyStudio.io checks
   passed."
5. **`npm test`** on a fresh `5eefa80` tree → exit 0, all suites green
   (headings, sitemap, worker, UI, contract, viewport); only the pre-existing
   out-of-scope `/` @ 240px overflow note, which does not gate exit code.
6. **Live probes** (2026-08-14): `https://tinystudio.io/brief-requested`
   serves 200 with **no** `.html` hrefs; the `.html` twins still 307 to their
   clean forms (`/index.html` → `/`, `/audit.html` → `/audit`, `/agents.html`
   → `/agents`, `/pricing.html` → `/pricing`, `/specimen.html` → `/specimen`)
   — the worker 307 shim is unchanged and harmless, since no served page links
   the `.html` forms anymore.

## Resulting state

**The item is closed.** Both residual post-#105 clusters are reconciled to
their terminal states:

- Cluster 1 (brief-requested clean links): sole surviving path #145 merged to
  main (`f9214c1`); fix landed, guard landed, no open delivery path remains.
- Cluster 2 (favicon): fix delivered via #85 and #113 (`9302611`, `18128e8`);
  no open delivery path remains — the correct terminal state.

Combined with PR #105's four clusters and the 2026-08-11/08-12 residual runs,
every duplicate open fix-PR pair in the repository is reconciled to one
superior delivery path (or delivered). This receipt closes the residual
reconciliation item `f3c90474c1`.

## Reproduce

- `gh pr list --repo nish3451/TinyStudio.io --state all` → #145, #85, #113
  MERGED; #60, #97, #47 CLOSED.
- `for n in $(gh pr list --repo nish3451/TinyStudio.io --state open ...); do
  gh pr view $n --json files --jq '.files[].path'; done` → no open PR touches
  the clean-links anchors or the five-page favicon links.
- `git show origin/main:public/brief-requested.html | grep href=` → clean
  anchors only; `grep -c 'rel="icon"' public/{index,pricing,audit,agents,specimen}.html`
  → 1 each.
- `npm run check` and `npm test` on a fresh `origin/main` tree → green.
- `curl -s https://tinystudio.io/brief-requested | grep -o 'href="[^"]*\.html"'`
  → no match; each `.html` twin 307s to its clean form.
