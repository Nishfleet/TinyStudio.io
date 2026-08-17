# Lane report: favicon `/favicon.ico` legacy fallback (2026-08-17)

Lane: tinystudio-io lane 1
Branch: `fix/favicon-ico-serve-2026-08-17`
Item: 017eb201fc — "[unreviewed-by-opus] No rel=icon link is served, so
every page load fires a 404 /favicon.ico request while favicon svg exists
and is allow-listed"

## Outcome

Closed via code-side fix (not only re-verification). The worker now
serves `/favicon.ico` with the canonical `public/favicon.svg` bytes and
`Content-Type: image/x-icon`, so the legacy path no longer 404s for any
client. Modern browsers still hit `/favicon.svg` via `<link rel="icon">`
on every served page (still exactly one link in `<head>`, still
pointing at `/favicon.svg`, still allow-listed); the new handler only
fires when a client ignores the `<link>` and falls through to the
well-known path. The previous closeouts (PRs #132, #182, #230) made
modern Chromium stop hitting `/favicon.ico`; this branch makes any
legacy / crawler / screenshot client stop getting a 404 at the same
path.

## Verification performed

1. **Source guard** (`scripts/check-site.mjs`): new assertions in the
   "Favicon (dogfood)" section fail `npm run check` if the worker
   allow-list drops `/favicon.ico` or the `image/x-icon` content-type
   override is removed. Passes on the current branch:
   ```
   $ node scripts/check-site.mjs
   TinyStudio.io checks passed.
   ```
2. **Worker compiles**:
   ```
   $ node_modules/.bin/wrangler deploy --dry-run --outdir /tmp/wrangler-out
   Total Upload: 58.85 KiB / gzip: 16.42 KiB
   ... env.DB / env.AI / env.ASSETS bindings registered, --dry-run: exiting now.
   ```
3. **Local HTTP probe** (`wrangler dev --local --port 8791`,
   `curl -sS -D - http://127.0.0.1:8791/favicon.ico`):
   - HTTP 200 (was 404 pre-fix).
   - `Content-Type: image/x-icon`.
   - `Cache-Control: public, max-age=31536000, immutable`.
   - Body SHA-256 matches `public/favicon.svg`
     (`998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c`,
     304 bytes).
   - HEAD and cached GET (`/favicon.ico?v=1`) also return 200;
     POST correctly returns 404.
   - All security headers (`HSTS`, `CSP`, `Permissions-Policy`,
     `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`)
     propagated through `withSecurityHeaders`.
4. **Test suites** (no regressions): `test:headings` 6/6,
   `test:sitemap` 7/7, `test:product-contract` 8/8,
   `test:agent-worker` 80/80, `test:agent-ui` 16/16,
   `test:first-viewport-audience` 4/4, `test:narrow-viewport` all
   PASS, `test:narrow-viewport-pages` all PASS,
   `check:render-blocking` all six pages PASS.
5. **Body-serving guarantees unchanged**: the new branch sits ahead of
   the generic `PUBLIC_ASSET_PATHS` handler for the `/favicon.ico`
   path only. No served HTML document changes; the seven public
   pages (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`,
   `/brief-requested`, `/agent-desk`) keep their single
   `<link rel="icon" href="/favicon.svg">` in `<head>` and their
   response shape.

## Files changed (lane's claimed files)

- `src/worker.js` — `PUBLIC_ASSET_PATHS` adds `/favicon.ico`; a new
  `/favicon.ico` branch serves the canonical `/favicon.svg` bytes
  with `Content-Type: image/x-icon` and immutable cache, routed
  ahead of the generic asset handler.
- `scripts/check-site.mjs` — "Favicon (dogfood)" section adds two
  source-side guards (allow-list entry + `image/x-icon` content-type
  override) so a future refactor that drops either re-breaks the
  symptom instead of re-silencing it.
- `docs/evidence/favicon-ico-2026-08-17.md` — new evidence receipt
  recording the fix and the local HTTP probe (the lane's claimed
  evidence file).
- `.lane/reports/fix-favicon-ico-2026-08-17.md` — this lane
  closeout report.

## Verification commands

- `node scripts/check-site.mjs` → exit 0,
  "TinyStudio.io checks passed."
- `node_modules/.bin/wrangler deploy --dry-run …` → exit 0,
  bindings registered cleanly.
- `node_modules/.bin/wrangler dev --local --port 8791` →
  `curl -D - http://127.0.0.1:8791/favicon.ico` → `HTTP/1.1 200 OK`,
  `Content-Type: image/x-icon`, body = canonical SVG bytes.
- `sha256sum /tmp/faviconico.bin public/favicon.svg` →
  identical digest `998e43ad…`.
- All eight test suites (`node --test scripts/*.mjs` and
  `check:render-blocking`) → 0 failures.
