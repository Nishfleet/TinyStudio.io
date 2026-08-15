# Redirecting internal links on home — re-verification (2026-08-15, lane 1)

Date: 2026-08-15
Scope: dogfood finding 996dffe45ef7, "Redirecting internal links on home"
(audit run 20260808T074205Z-msk2fl3n). This receipt re-verifies the finding's
guarantee against the current `origin/main` head (c0305df,
"docs(evidence): re-verify CI queue re-starvation item — already resolved
(queue empty at 03:45Z) (#224)") and the live deployment of that head, in the
pattern of the 2026-08-09 closeout (PR #34) and the 2026-08-11/08-12/08-14
re-verifications.

## Summary

The failure mode the finding describes — the home page carrying internal
links that resolve through a redirect — **does not occur, on source and on
the live site**. The code-side fix has been merged since 2026-08-09 (PR #34):
all five public pages point every page link at the clean URL the worker
serves (`/`, `/audit`, `/agents`, `/pricing`, `/specimen` — never at a
`.html` file that 307-redirects to it), and the CI guard "Internal page links
(dogfood 996dffe45ef7)" in `scripts/check-site.mjs` fails the build if any of
the five pages carries an anchor targeting a `.html` page name. Re-verified
today: `npm run check` and `npm test` pass on the current head, and the live
site serves zero redirecting internal links on all five public pages —
measured in real Chromium, including the home page the finding flagged.

## Source checks on the current head (c0305df)

1. `npm run check` passes ("TinyStudio.io checks passed."). The
   996dffe45ef7 guard in `scripts/check-site.mjs` (section at line 1704,
   "Internal page links (dogfood 996dffe45ef7)") still fails the build if any
   of the five public pages carries an anchor whose target is `index.html`,
   `audit.html`, `agents.html`, `pricing.html` or `specimen.html`.
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   first-viewport-audience, narrow-viewport-pages and narrow-viewport
   suites — all green, zero failures.
3. `public/index.html` (home, the page the finding flagged) links only the
   clean addresses the worker serves: logo `href="/"`, nav `href="/audit"`,
   `href="/agents"`, `href="/pricing"`, CTA `href="#start"`, specimen
   call-out `href="/specimen"`. No anchor on any of the five public pages
   targets a `.html` page name.

### Drift check since the last receipt (d1af1c1, 2026-08-14)

The 2026-08-14 re-verification measured head b0e9c57 and its receipt landed
as d1af1c1. Between that head and this one (c0305df), the link surface of the
five public pages changed only once, in a way the live measurement below
covers:

- `public/index.html`: one line changed (ffc1672, "fix(public): add
  domain-valuation distinction to the conversion-audit intent bridge
  (#193)") — a copy-text change in the conversion-audit bridge; no page link
  changed (`git diff d1af1c1..HEAD -- public/index.html` is 1 insertion, 1
  deletion, and the live probe below confirms every anchor on the page still
  probes 200 with no redirect).
- `public/audit.html`, `public/agents.html`, `public/pricing.html`,
  `public/specimen.html`: unchanged since the last receipt.
- `scripts/check-site.mjs`: the 996dffe45ef7 guard section moved from lines
  1630-1667 (at b0e9c57) to line 1704 (at c0305df) because earlier guard
  sections grew; its logic is unchanged.

## Live verification (deployed site, 2026-08-15)

Real-browser measurement in headless Chromium (Playwright 1.62.1) against
the deployed `https://tinystudio.io`, on the exact method of the prior
receipts: load each page with `domcontentloaded`, collect every anchor with a
non-external, non-`mailto:`/`tel:`, non-hash-only href, then probe each
internal target with `maxRedirects: 0` — a redirecting link returns a 3xx
with a `Location` header, a clean link returns 200 with no `Location`.

- All five pages load `200` at their final clean URLs with zero console
  errors and zero page errors: `/` (home), `/audit`, `/agents`, `/pricing`,
  `/specimen`.
- Every internal link target on every page probes `200` with no `Location`
  header. Home's anchors — the page the finding flagged — are `/`, `/audit`,
  `/agents`, `/pricing`, `/#start`, `/specimen`: all clean.
- The five `.html` forms the pre-fix home linked at still 307-redirect to
  their clean twins (`index.html` → `/`, `audit.html` → `/audit`,
  `agents.html` → `/agents`, `pricing.html` → `/pricing`,
  `specimen.html` → `/specimen`) — the exact shape the finding flagged, still
  present only on unlinked addresses.

## Closeout

Nothing further to change: the code-side fix (PR #34) and the CI enforcement
("Internal page links (dogfood 996dffe45ef7)" guard in `scripts/check-site.mjs`)
are merged in origin/main, `npm run check` and `npm test` pass on the current
head (c0305df), and the deployed site serves zero redirecting internal links
on all five public pages — including the home page the finding flagged — as
measured in real Chromium on 2026-08-15. The finding stays closed.
