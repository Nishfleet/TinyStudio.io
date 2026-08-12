# Duplicate open-PR clusters residual — re-verify the two post-#105 clusters against current GitHub state (2026-08-12)

Date: 2026-08-12
Scope: re-verify and reconcile the two residual clusters of duplicate open PRs
left over after the first reconciliation (PR #105,
`docs/evidence/duplicate-open-pr-clusters-2026-08-11.md`) and its follow-up
receipt (`docs/evidence/duplicate-open-pr-clusters-residual-2026-08-11.md`),
so that exactly one superior delivery path remains open per surface. This
receipt records a state verification of the repository's pull requests plus
the reconciliation actions taken; it is process evidence, not a live-site
measurement.

## The two residual clusters (GitHub state, 2026-08-12)

### Cluster 1 — brief-requested clean nav/back links

| PR | head branch | created | closed / merged | state 2026-08-12 | carries |
|---|---|---|---|---|---|
| #60 | `fix/brief-requested-clean-nav-links` | 2026-08-09T21:32Z | CLOSED 2026-08-11T08:10:08Z | closed | the fix, original stale-base branch |
| #97 | `fix/brief-requested-clean-links` | 2026-08-11T01:17Z | CLOSED 2026-08-12T01:24:26Z | closed | the fix + guard-coverage receipt |
| #145 | `fix/brief-requested-clean-links-lane1` | 2026-08-12T01:24:19Z | — | **OPEN, MERGEABLE (BLOCKED: awaiting review)** | the fix + guard extension |

#60 and #97 were closed as stale duplicates (each with a comment naming the
surviving delivery path). After #97's closure, **#145 is the sole open
delivery path** for the brief-requested clean-links fix. Its head (`47d42e7`)
contains current `origin/main` (`cab6d18`), it is `mergeable: MERGEABLE`, and
its tree carries exactly the two-file fix:

- `public/brief-requested.html` — the post-signup page's logo, three nav links
  and back link move from the `.html` forms the deployed worker 307-redirects
  to the clean extensionless twins (`index.html` → `/`, `audit.html` → `/audit`,
  `agents.html` → `/agents`, `pricing.html` → `/pricing`).
- `scripts/check-site.mjs` — the internal-links guard
  (`internalLinkPages`) gains the `brief-requested` page entry so the
  redirecting-`.html` shape cannot silently return.

Fix-content identity across the cluster (verified this run by diffing each
branch against its own merge-base with main):

- #60 vs #145: the `public/brief-requested.html` change is **byte-identical**
  (the diff `+`/`-` line sets match exactly). The guard differs only in
  comment wording; #60 additionally carried a `"brief-requested.html" →
  "/brief-requested"` `htmlPageTargets` entry that the re-lands scoped out —
  no fault coverage is lost, because every real `.html` target on the page
  (`index.html`, `audit.html`, `agents.html`, `pricing.html`) remains a
  guarded `htmlPageTargets` key.
- #97 vs #145: the fix content is identical (fix commit `ad5164e` on #97 vs
  the same two-file change on #145 — same comment wording, same
  `internalLinkPages` shape, byte-identical page change).

### Cluster 2 — rel=icon favicon on the five public pages

| PR | head branch | created | closed / merged | state 2026-08-12 | carries |
|---|---|---|---|---|---|
| #47 | `fix/serve-rel-icon-favicon` | 2026-08-09T14:46Z | CLOSED 2026-08-11T08:10:09Z | closed | the fix, conflict-locked original |
| #85 | `fix/rel-icon-favicon-lane1` | 2026-08-10T21:31Z | MERGED 2026-08-11T13:43:26Z | merged (`9302611`) | the fix |

The favicon cluster is fully **delivered**: #47 was closed as the
conflict-locked stale duplicate, and #85 merged the identical five-page
`<link rel="icon" href="/favicon.svg">` fix to main (commit `9302611`). The
follow-up #113 (`fix/serve-rel-icon-brief-requested`) — which served the icon
on `/brief-requested` and extended the favicon guard to all seven served
pages — also merged (`18128e8`); main's favicon guard today covers all seven
pages, `brief-requested` included (verified in `scripts/check-site.mjs` on
`origin/main`). **No open PR carries the five-page favicon fix.**

## No other carriers

Every open PR's changed-files set was scanned (2026-08-12). The only other
open PRs touching `public/brief-requested.html` are #112 (footer brand),
#123 (apple-touch-icon) and #136 (env-driven ads tag) — each a different fix;
none touches the logo/nav/back anchors of the clean-links fix. No open PR
touches the five-page favicon links.

## Reconciliation actions taken (2026-08-12, lane-1 run)

No further closures were needed: both stale duplicates were already closed
with survivor-naming comments, and each surface has exactly one delivery
path. The run re-verified the state and refreshed nothing — the declared
survivor #145 already sits on current `origin/main` (its last commit is a
main merge, `47d42e7`, pushed 2026-08-12T13:00Z).

Pre-closure-style verification performed on this run (2026-08-12):

- **Per-cluster fix identity**: #60 vs #145 page diff byte-identical; #97 vs
  #145 fix content identical (above). The stale branches carried no unique fix
  content the survivor lacks.
- **Survivor tree checks** (`fix/brief-requested-clean-links-lane1` at
  `47d42e7`, fetched fresh): `npm run check` green; `npm test` green — 92
  subtests (6 headings, 7 sitemap, 55 worker, 16 UI, 8 contract).
- **Negative probe**: re-introducing `href="audit.html"` on
  `public/brief-requested.html` makes `npm run check` fail
  ("Internal page link on brief-requested page must point at the clean
  destination \"/audit\""); restoring the clean link passes again — the
  guard genuinely covers the post-signup page.
- **GitHub state**: #145 open and MERGEABLE (BLOCKED = awaiting review, no
  conflict); #60 and #97 closed with comments naming the surviving delivery
  path; #47 closed and #85 merged.

## Resulting state

Exactly one open delivery path per residual surface:

- **Brief-requested clean links**: #145 (`fix/brief-requested-clean-links-lane1`),
  sitting on current `origin/main` with the fix and the regression guard,
  mergeable and awaiting review. The fix itself remains unlanded on main
  (main's `public/brief-requested.html` still carries the `.html` nav/back
  links and the internal-links guard still lacks the page), so #145 must be
  merged for the surface to be closed — this receipt only reconciles the
  delivery paths.
- **Favicon**: delivered to main via #85 (`9302611`) and #113 (`18128e8`);
  no open delivery path remains, which is the correct terminal state.

Combined with PR #105's four clusters and the 2026-08-11 residual run, every
duplicate open fix-PR pair in the repository is reconciled to one superior
delivery path (or delivered).

## Verification (reproduce)

- `git diff <#60 merge-base> fix/brief-requested-clean-nav-links -- public/brief-requested.html` vs `git diff <#145 merge-base> fix/brief-requested-clean-links-lane1 -- public/brief-requested.html` → identical `+`/`-` line sets.
- `npm run check` and `npm test` on the #145 tree → green (92 subtests).
- Negative probe: `sed -i 's|href="/audit"|href="audit.html"|' public/brief-requested.html` on the #145 tree → check fails; restore → passes.
- GitHub state: #145 open and MERGEABLE; #60, #97, #47 closed with survivor-naming comments; #85, #113 merged to main.
