# Lane report — fix/internal-links-reverify-lane1

## Item

"Redirecting internal links on home" (dogfood finding 996dffe45ef7, audit
20260808T074205Z-msk2fl3n).

## Outcome

**Already fixed and deployed; re-verified and closed out.**

The requested change is PR #34 ("fix(public): point internal page links at
final clean URLs"), already on origin/main, plus the CI guard "Internal page
links (dogfood 996dffe45ef7)" in `scripts/check-site.mjs`. This lane's work
was to re-verify the item against the current head and live and record the
closeout. No code change was needed.

Evidence: `docs/evidence/internal-links-reverify-2026-08-14.md`.

## Verification performed

1. `public/index.html` on current origin/main (`b0e9c57`) links only the clean
   addresses the worker serves — logo `/`, nav `/audit`, `/agents`,
   `/pricing`, `#start` CTA, specimen call-out `/specimen`. No anchor on any
   of the five public pages targets a `.html` page name.
2. The guard still enforces it: `scripts/check-site.mjs` "Internal page links
   (dogfood 996dffe45ef7)" fails the build if any of the five pages carries an
   anchor targeting `index.html` / `audit.html` / `agents.html` / `pricing.html`
   / `specimen.html`.
3. `npm run check` passes; `npm test` passes (117 tests, 0 failures);
   narrow-viewport script passes for all four owned routes.
4. Live (real Chromium, Playwright 1.62.1, 2026-08-14): all five pages load
   200 at clean URLs with zero console/page errors; every internal link on
   every page probes 200 with no `Location` (`maxRedirects: 0`); the five
   `.html` forms still 307 to their clean twins, unlinked.
5. No link-relevant change since the prior re-verify (post-fix page commits
   are content-only).

## Delivery

- Branch: `fix/internal-links-reverify-lane1`
- PR: opened against origin/main.
