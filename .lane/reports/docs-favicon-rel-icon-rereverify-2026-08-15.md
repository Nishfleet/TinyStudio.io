# Lane report: favicon rel=icon re-verify (2026-08-15)

Lane: tinystudio-io lane 1
Branch: `docs/evidence/favicon-rel-icon-rereverify-2026-08-15`
Item: 017eb201fc — "[unreviewed-by-opus] No rel=icon link is served, so every page load fires a 404 /favicon.ico request while favicon.svg exists and is allow-listed"

## Outcome

Closed. The failure mode described by the item no longer occurs, on source
and on the live site. The code-side fix was already merged in `origin/main`
(PRs #85 and #113) and the CI guard in `scripts/check-site.mjs` enforces the
guarantee on all seven served pages. This lane re-verified against the
current head (23e24d6) and the live deployment, and recorded the closeout
evidence.

## Verification performed

1. **Source guard**: `npm run check` passes (exit 0, "TinyStudio.io checks
   passed."). The "Favicon (dogfood)" section (scripts/check-site.mjs
   1375-1420) enforces exactly one `<link rel="icon">` with
   `href="/favicon.svg"` in the head of all seven pages (home, audit,
   agents, pricing, specimen, brief-requested, agent-desk);
   `public/favicon.svg` is a valid, git-tracked SVG; the worker allow-list
   serves `/favicon.svg` (src/worker.js:61).
2. **Full suite**: `npm test` passes (exit 0) — all suites green (121
   subtests, 0 failures).
3. **Drift check**: `git diff 5770bf3..HEAD` (since the 2026-08-14 receipt,
   PR #182) over `public/`, `scripts/check-site.mjs`, `src/worker.js`
   contains zero favicon/rel=icon changes; the 18 intervening commits
   touched copy, the www-host retirement, and unrelated guards.
4. **Live browser probe** (Playwright 1.62.1, headless Chromium,
   2026-08-15) against https://tinystudio.io: all seven pages return 200
   with exactly one rel=icon link in head pointing at `/favicon.svg`;
   **zero** requests to `/favicon.ico` on any page load; zero page/console
   errors and zero 4xx/5xx responses on load.
5. **Asset probes**: `GET /favicon.svg` → 200 `image/svg+xml`,
   byte-identical to committed file (SHA-256
   `998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c`, same
   as 2026-08-14); `GET /favicon.ico` → 404, now never referenced.

## Files changed

- `docs/evidence/favicon-rel-icon-rereverify-2026-08-15.md` — new evidence
  receipt recording the closeout on the current head and live site (the
  lane's claimed file).

## Verification commands

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- `npm test` → exit 0 (all suites green).
- Live probe script (node + playwright) → JSON per page: all 200, 1/1
  rel=icon links, 0 favicon.ico requests, 0 errors.
