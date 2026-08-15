# Lane report — tinystudio-io lane 1 (fix/internal-links-rereverify-lane1-20260815)

## Item

- [ ] [dogfood 996dffe45ef7] Redirecting internal links on home [dogfood
  20260808T074205Z-msk2fl3n]

## Outcome: already fixed and deployed; re-verified and closed out

The requested change is already on `origin/main`: PR #34 ("fix(public):
point internal page links at final clean URLs") changed all five public pages
to point every page link at the clean URL the worker serves (`/`, `/audit`,
`/agents`, `/pricing`, `/specimen` — never at a `.html` file that resolves to
it), and added the CI guard "Internal page links (dogfood 996dffe45ef7)" in
`scripts/check-site.mjs` that fails the build if any of the five pages
carries an anchor whose target is one of the five `.html` page names.

This lane's work was to re-verify the finding against current main and live
and record the closeout on the current head, resolving the tracker item.

Evidence: `docs/evidence/internal-links-reverify-2026-08-15.md`.

## Verification performed

1. Source: `npm run check` passes — the 996dffe45ef7 guard (line 1704) still
   rejects any anchor on the five public pages targeting `index.html` /
   `audit.html` / `agents.html` / `pricing.html` / `specimen.html`.
2. `npm test` passes (exit 0): heading-hierarchy, sitemap, agent-worker,
   agent-UI, product-contract, viewport, narrow-viewport-pages and
   narrow-viewport suites — zero failures.
3. Drift check vs last receipt (d1af1c1, 2026-08-14): `public/index.html`
   changed by one copy-text line (domain-valuation intent bridge, ffc1672);
   the other four pages and the guard's logic are unchanged (guard section
   moved to line 1704 as earlier sections grew).
4. Live, 2026-08-15 (real Chromium, Playwright 1.62.1): all five pages load
   200 at clean URLs with zero console/page errors; every internal link on
   every page probes 200 with no `Location` (`maxRedirects: 0`), home
   included; the five `.html` forms still 307 to their clean twins,
   unlinked.

## Delivery

- Branch: `fix/internal-links-rereverify-lane1-20260815`
- PR: opened against origin/main.
