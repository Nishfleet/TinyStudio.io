# Duplicate open-PR clusters residual — re-verify the post-#105 closeout on current GitHub, main and live (2026-08-21)

Date: 2026-08-21
Item: f3c90474c1 — "[unreviewed-by-opus] Reconcile the two residual
duplicate fix-PR clusters after #105 — brief-requested clean links"
Scope: re-verify the 2026-08-14 closeout
(`docs/evidence/duplicate-open-pr-clusters-residual-closeout-2026-08-14.md`)
of the two residual duplicate fix-PR clusters left after the first
reconciliation (PR #105) against current GitHub state, current
`origin/main` (`92d55c3`, 2026-08-20) and the live site. The lane records
the verification only — the item's own evidence trail (2026-08-11, 08-12,
08-14 receipts) shows every cluster member was already closed or merged,
so no code change is claimed on this lane.

## The two residual clusters (current GitHub state, 2026-08-21)

### Cluster 1 — brief-requested clean nav/back links

| PR | head branch | state 2026-08-21 | carries |
|---|---|---|---|
| #60 | `fix/brief-requested-clean-nav-links` | CLOSED 2026-08-11T08:10:08Z | the fix, original stale-base branch |
| #97 | `fix/brief-requested-clean-links` | CLOSED 2026-08-12T01:24:26Z | the fix + guard-coverage receipt |
| #145 | `fix/brief-requested-clean-links-lane1` | MERGED 2026-08-14T09:42:02Z (`f9214c1`) | the two-file fix + guard |

The survivor #145 merged to main on 2026-08-14 (`f9214c1`); #60 and #97
are closed with survivor-naming comments. **No open PR carries this fix.**

### Cluster 2 — rel=icon favicon

| PR | head branch | state 2026-08-21 | carries |
|---|---|---|---|
| #47 | `fix/serve-rel-icon-favicon` | CLOSED 2026-08-11T08:10:09Z | the fix, conflict-locked original |
| #85 | `fix/rel-icon-favicon-lane1` | MERGED 2026-08-11T13:43:26Z (`9302611`) | the fix |
| #113 | `fix/serve-rel-icon-brief-requested` | MERGED 2026-08-11T18:34:32Z (`18128e8`) | brief-requested icon + guard extension |

**No open PR carries this fix** — the correct terminal state.

## No other carriers (open-PR scan, 2026-08-21)

Every open PR's changed-files set was scanned (24 open PRs). The only
matches touching either cluster's files: #267 and #250 are evidence
re-verify PRs (their own docs receipts), #261 touches `public/audit.html`
for the ai-search evidence fixture — a different fix, and none touches
the clean-links anchors or the favicon links. **No open delivery path
remains for either cluster.**

## Verification performed (2026-08-21, against `origin/main` `92d55c3`)

1. **GitHub state**: #145, #85, #113 MERGED (`f9214c1`, `9302611`,
   `18128e8`); #60, #97, #47 CLOSED. No open PR carries either fix.
2. **Main tree (cluster 1)**: `public/brief-requested.html` carries only
   clean anchors — logo `/`, nav `/audit`, `/agents`, `/pricing`, back
   `/`; no `.html` href remains. The internal-links guard
   (`internalLinkPages` in `scripts/check-site.mjs`) covers the
   `brief-requested page`, and `htmlPageTargets` maps every redirecting
   twin including `brief-requested.html` → `/brief-requested` (hardened
   by PR #243).
3. **Main tree (cluster 2)**: exactly one `<link rel="icon"
   href="/favicon.svg">` on all five public pages (`index`, `pricing`,
   `audit`, `agents`, `specimen`); the favicon guard (`faviconPages`)
   covers all seven served pages, `brief-requested` and `agent-desk`
   included.
4. **`npm run check`** on the `92d55c3` tree → "TinyStudio.io checks
   passed." (exit 0).
5. **`npm test`** on the `92d55c3` tree → exit 0, all suites green
   (headings, sitemap, worker 83/83, UI 16/16, contract 8/8, study,
   viewport, narrow-pages, narrow).
6. **Live probes** (2026-08-21): `https://tinystudio.io/brief-requested`
   serves 200 with exactly five anchors, all clean (`/`, `/audit`,
   `/agents`, `/pricing`, back `/`), and **no** `.html` hrefs. Every
   served page carries `<link rel="icon" href="/favicon.svg"
   type="image/svg+xml" />`; `/favicon.svg` serves 200
   image/svg+xml. The redirecting `.html` twins (`/index.html`,
   `/audit.html`, `/agents.html`, `/pricing.html`, `/specimen.html`)
   still 307 to their clean extensionless twins — the worker 307 shim is
   unchanged and harmless, since no served page links the `.html` forms
   anymore.
7. **Negative probe of the guard**: re-introducing `href="audit.html"`
   on `public/brief-requested.html` makes `npm run check` fail with
   `Internal page link on brief-requested page must point at the clean
   destination "/audit" (found "audit.html").`; restoring the clean link
   passes again — the guard genuinely still covers the post-signup page.

## Resulting state

**The item is closed.** Both residual post-#105 clusters are at their
terminal states, unchanged since the 2026-08-14 closeout:

- Cluster 1 (brief-requested clean links): sole survivor #145 merged to
  main (`f9214c1`); fix landed, guard landed (hardened by #243); no open
  delivery path remains.
- Cluster 2 (favicon): fix delivered via #85 and #113 (`9302611`,
  `18128e8`); no open delivery path remains — the correct terminal state.

Combined with PR #105's four clusters and the 2026-08-11/08-12/08-14
runs, every duplicate open fix-PR pair in the repository is reconciled
to one superior delivery path (or delivered). This receipt re-verifies
the residual reconciliation item `f3c90474c1` on current main and live.

## Reproduce

- `gh pr list --repo nish3451/TinyStudio.io --state all` → #145, #85,
  #113 MERGED; #60, #97, #47 CLOSED.
- Open-PR changed-files scan → no open PR touches the clean-links
  anchors or the five-page favicon links.
- `grep -oE 'href="[^"]*"' public/brief-requested.html` → clean anchors
  only; `grep -c 'rel="icon"' public/{index,pricing,audit,agents,specimen}.html`
  → 1 each.
- `npm run check` and `npm test` on a fresh `origin/main` tree → green.
- `curl -s https://tinystudio.io/brief-requested | grep -oE 'href="[^"]*\.html"'`
  → no match; each `.html` twin 307s to its clean form; every served
  page's head carries exactly one `rel="icon"` link to `/favicon.svg`.
