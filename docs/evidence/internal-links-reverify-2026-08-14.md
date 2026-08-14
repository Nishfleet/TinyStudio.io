# Redirecting internal links on home — re-verification (2026-08-14, lane 1)

Item: "Redirecting internal links on home" (dogfood finding 996dffe45ef7, audit
20260808T074205Z-msk2fl3n).

## What the item asks

The leak audit this site sells flags a homepage whose internal links do not
point at the final destination URL: every link that resolves through a
redirect is a redirecting internal link, and search engines value the link at
the redirected address, not at the hop it started from. The dogfood run found
exactly that fault on this site's own home page: before the fix,
`public/index.html` linked its logo, navigation and specimen call-out at
`index.html`, `audit.html`, `agents.html`, `pricing.html` and `specimen.html`.
The deployed worker serves extensionless twins for all five pages and
307-redirects every `.html` form to its clean twin, so each of those home
links was a redirecting internal link.

## Fix already landed on main

The fix is PR #34 ("fix(public): point internal page links at final clean
URLs"), merged into main. It changed all five public pages to point every page
link at the clean URL the worker serves (`/`, `/audit`, `/agents`, `/pricing`,
`/specimen` — never at a `.html` file that resolves to it), and added the
source-string CI guard "Internal page links (dogfood 996dffe45ef7)" in
`scripts/check-site.mjs` that fails the build if any of the five pages carries
an anchor whose target is one of the five `.html` page names.

This receipt is a fresh re-verification against the current origin/main head
(b0e9c57) and the live deployment, on the pattern of the prior receipts for
this finding (docs/evidence/internal-links-2026-08-09.md and its 2026-08-11
and 2026-08-12 re-verifications).

## Source checks on the current head (b0e9c57)

1. `public/index.html` (home, the page the finding flagged) links only the
   clean addresses: logo `href="/"`, nav `href="/audit"`, `href="/agents"`,
   `href="/pricing"`, CTA `href="#start"`, and specimen call-out
   `href="/specimen"`. No anchor on any of the five public pages targets a
   `.html` page name.
2. The guard still enforces it: `scripts/check-site.mjs` lines 1630-1667
   ("Internal page links (dogfood 996dffe45ef7)") fail the build if any of the
   five public pages carries an anchor whose target is `index.html`,
   `audit.html`, `agents.html`, `pricing.html` or `specimen.html`.
3. `npm run check` passes on the current head: "TinyStudio.io checks passed."
4. `npm test` passes on the current head: check + heading-hierarchy (6),
   sitemap (7), agent-worker (76), agent-UI (16), product-contract (8),
   first-viewport-audience (4) — 117 tests, 0 failures — and the narrow-viewport
   pages script passes for all four owned routes (the only out-of-scope rows
   are `/` at 240/260px, which are documented as out-of-scope and do not gate
   the exit code).
5. No link-relevant change since the prior re-verify: the newest touches to
   the five public pages since the fix landed are content-only (specimen CTA
   b81281f, buyer-hero e5bfb08), none of which touched a page link or the
   guard's page set.

## Live verification (deployed site, 2026-08-14)

Real-browser measurement in headless Chromium (Playwright 1.62.1) against the
deployed `https://tinystudio.io`:

- All five pages load 200 at their final clean URLs with zero console errors
  and zero page errors: `/`, `/audit`, `/agents`, `/pricing`, `/specimen`
  (each re-probed `curl` → `200`, empty `redirect_url`).
- Every internal link target on every page probes `200` with no `Location`
  header (`maxRedirects: 0`), including the home page the finding flagged:
  home's anchors are `/`, `/audit`, `/agents`, `/pricing`, `/#start`,
  `/specimen` — zero redirecting internal links site-wide.
- The five `.html` forms the pre-fix home linked at still 307-redirect to
  their clean twins (`index.html` → `/`, `audit.html` → `/audit`,
  `agents.html` → `/agents`, `pricing.html` → `/pricing`,
  `specimen.html` → `/specimen`) — the exact shape the finding flagged, still
  present only on unlinked addresses.

## Closeout

Nothing further to change: the code-side fix (PR #34) and the CI enforcement
("Internal page links (dogfood 996dffe45ef7)" guard in `scripts/check-site.mjs`)
are merged in origin/main, `npm run check` and `npm test` pass on the current
head (b0e9c57), and the deployed site serves zero redirecting internal links
on all five public pages — including the home page the finding flagged — as
measured in real Chromium on 2026-08-14. The finding stays closed.
