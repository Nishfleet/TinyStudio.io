# Lane report: duplicate open-PR clusters residual re-verify (2026-08-21, lane 1)

Lane: tinystudio-io lane 1
Branch: `chore/duplicate-pr-clusters-residual-closeout-rereverify-2026-08-21`
Item: f3c90474c1 — "[unreviewed-by-opus] Reconcile the two residual
duplicate fix-PR clusters after #105 — brief-requested clean links"

## Outcome

**Closed (no code change).** Both residual post-#105 clusters are already
at their terminal states, verified on current GitHub, `origin/main`
(`92d55c3`, 2026-08-20) and live:

- **Cluster 1 — brief-requested clean links**: #60 and #97 closed as
  stale duplicates; survivor #145 MERGED (`f9214c1`, 2026-08-14). Main
  serves only clean anchors (`/`, `/audit`, `/agents`, `/pricing`) on
  `public/brief-requested.html`; the internal-links guard covers the
  page and was hardened by #243 to catch every redirecting spelling.
- **Cluster 2 — rel=icon favicon**: #47 closed; #85 and #113 MERGED
  (`9302611`, `18128e8`). All seven served pages carry exactly one
  `rel="icon"` link to `/favicon.svg`, guarded in `check-site.mjs`.

Opening a duplicate fix would recreate the cluster the fleet reconciled
on 2026-08-14; the lane therefore records re-verification evidence only.

## Verification performed (2026-08-21)

1. **GitHub state** — `gh pr view` on #60, #97, #145, #47, #85, #113:
   #145/#85/#113 MERGED, #60/#97/#47 CLOSED, exactly as the closeout
   records. Open-PR changed-files scan (24 open PRs): no open PR carries
   either fix (only evidence PRs #267/#250 and the unrelated #261
   touch nearby files).
2. **Main tree** — clean anchors on `public/brief-requested.html`;
   `internalLinkPages` includes `brief-requested page`; `htmlPageTargets`
   maps `brief-requested.html` → `/brief-requested`; one
   `rel="icon"` link per public page; `faviconPages` covers all seven
   served pages.
3. **`npm run check`** — "TinyStudio.io checks passed." (exit 0).
4. **`npm test`** — exit 0; headings, sitemap, worker 83/83, UI 16/16,
   contract 8/8, study, viewport, narrow-pages, narrow all green.
5. **Live probes** — `/brief-requested` 200 with five clean anchors, no
   `.html` hrefs; all pages serve the `/favicon.svg` `rel="icon"` link;
   `/favicon.svg` 200 image/svg+xml; `/index.html`, `/audit.html`,
   `/agents.html`, `/pricing.html`, `/specimen.html` each 307 to their
   clean twins.
6. **Negative probe** — `href="audit.html"` re-introduced on
   `public/brief-requested.html` → `npm run check` fails with the
   targeted guard message naming `/audit`; page restored, tree clean.

## Files changed

- `docs/evidence/duplicate-open-pr-clusters-residual-closeout-rereverify-2026-08-21.md`
  — evidence receipt for this run.
- `.lane/reports/chore-duplicate-pr-clusters-residual-closeout-rereverify-2026-08-21.md`
  — this lane report.

No source code change.

## Delivery

- Branch: `chore/duplicate-pr-clusters-residual-closeout-rereverify-2026-08-21`
- Base: `origin/main` (`92d55c3`, 2026-08-20)
- PR: opened against origin/main carrying the evidence closeout
