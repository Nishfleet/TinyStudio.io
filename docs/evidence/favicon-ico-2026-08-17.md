# Favicon `/favicon.ico` legacy fallback — serve canonical SVG, stop the 404

Date: 2026-08-17
Scope: the review-queue item "[unreviewed-by-opus] No rel=icon link is
served, so every page load fires a 404 /favicon.ico request while favicon
svg exists and is allow-listed" (item 017eb201fc). The previous
re-verify receipts (2026-08-12, 2026-08-14, 2026-08-15 — PRs #132, #182,
#230) closed the *observed* symptom on modern Chromium by adding
`<link rel="icon" href="/favicon.svg">` to every served page, but the
underlying request path `/favicon.ico` was still answered with HTTP 404
when any legacy client (older browsers, search-engine link-preview
crawlers, screenshot services, RSS aggregators, OS-level bookmark
imports) asked for it. This branch lands the source-side fix so the
`/favicon.ico` path is no longer 404-able on the live worker.

## Summary

The worker now serves `/favicon.ico` with the canonical
`public/favicon.svg` bytes and `Content-Type: image/x-icon`. The path
is allow-listed (`PUBLIC_ASSET_PATHS` carries `"/favicon.ico"`) and
intercepted before the generic asset fallthrough, so the legacy URL
returns 200 instead of going through `isAssetLikePath` → 404. Every
served page still declares exactly one `<link rel="icon"
href="/favicon.svg">` in `<head>`, so modern browsers continue to use
the canonical SVG; the new handler only fires for clients that ignore
the `<link rel>` and fall through to the well-known path.

## Source change

- `src/worker.js`
  - `PUBLIC_ASSET_PATHS` now lists `/favicon.ico` alongside
    `/favicon.svg` and explains in an inline comment why the legacy
    path needs an explicit allow-list entry.
  - A new `/favicon.ico` branch sits ahead of the generic
    `PUBLIC_ASSET_PATHS` asset-fetch handler. It pulls the canonical
    SVG bytes from `env.ASSETS.fetch("/favicon.svg", request)`, copies
    upstream headers, and overrides:
    - `Content-Type: image/x-icon` (so legacy clients that gate
      rendering on the response's media type accept the bytes),
    - `Cache-Control: public, max-age=31536000, immutable` (the asset
      is content-stable and the served URL is the cache key; no
      fingerprint is needed for `public/favicon.svg`).
  - The branch returns 404 only if the upstream `/favicon.svg` fetch
    itself fails — a genuinely missing canonical asset, not the
    legacy path being silently dropped.
  - Security headers continue to flow through `withSecurityHeaders`,
    matching every other served response.

- `scripts/check-site.mjs`
  - The "Favicon (dogfood)" guard extends with two new source-side
    assertions: the worker allow-list contains `"/favicon.ico"` AND
    the worker source contains the `image/x-icon` content-type
    override. Either check failing causes `npm run check` to exit
    non-zero, so a future refactor that drops either line re-breaks
    the symptom instead of re-silencing it.

## Verification

### 1. Source guard

```
$ node scripts/check-site.mjs
TinyStudio.io checks passed.
```

The new checks (item 017eb201fc) verify that `PUBLIC_ASSET_PATHS`
carries `"/favicon.ico"` and that the worker handler overrides the
served `Content-Type` to `image/x-icon`. Both guards pass on the
current branch.

### 2. Bundle guard

```
$ node_modules/.bin/wrangler deploy --dry-run --outdir /tmp/wrangler-out
…
Total Upload: 58.85 KiB / gzip: 16.42 KiB
… Your Worker has access to the following bindings:
Binding                                                Resource
env.DB (478f4a89-8936-4a57-bdd0-5f273090b2e5)          D1 Database
env.AI                                                 AI
env.ASSETS                                             Assets
--dry-run: exiting now.
```

The worker bundles cleanly with the new branch, picks up the
`/favicon.ico` allow-list entry, and reserves the D1/AI/ASSETS bindings
unchanged.

### 3. Local HTTP probe (real worker, simulated asset bucket)

```
$ node_modules/.bin/wrangler dev --local --ip 127.0.0.1 --port 8791 &

$ curl -sS -D - -o /dev/null http://127.0.0.1:8791/favicon.ico
HTTP/1.1 200 OK
Content-Length: 304
Content-Type: image/x-icon
Cache-Control: public, max-age=31536000, immutable
ETag: "a32c78606f71accba81bc8bdf0d306e8"
Strict-Transport-Security: max-age=31536000; includeSubDomains
CF-Cache-Status: HIT
Content-Security-Policy: default-src 'self'; img-src 'self' data:; …
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

- Status: **200** (was 404 before the fix).
- `Content-Type`: `image/x-icon` — overrides the upstream SVG type so
  legacy clients that branch on media type accept the response.
- `Content-Length`: 304 — identical to the canonical
  `public/favicon.svg` byte length.
- Body SHA-256: `998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c`
  (same digest as `public/favicon.svg` and the previous receipts),
  proving the served bytes are the canonical asset and not a stub.
- `Cache-Control: public, max-age=31536000, immutable` so the legacy
  fallback does not re-traffic the worker on every page render.
- Every security header from `SECURITY_HEADERS` is still applied
  (`HSTS`, `CSP`, `Permissions-Policy`, `Referrer-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`).
- `HEAD /favicon.ico` also returns **200**.
- `GET /favicon.ico?v=1` also returns **200** with the same bytes
  (cache key is the path, not the query string).
- `POST /favicon.ico` correctly returns **404** (only GET/HEAD are
  supported on static asset paths).

```
$ sha256sum /tmp/faviconico.bin public/favicon.svg
998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c  /tmp/faviconico.bin
998e43ad83f78adcd8a75fb37a87657ba2289b760470f42583c7fab166d9184c  public/favicon.svg
```

### 4. Test suites

```
test:headings      → 6 pass / 0 fail
test:sitemap       → 7 pass / 0 fail
test:product-contract → 8 pass / 0 fail
test:agent-worker  → 80 pass / 0 fail
test:agent-ui      → 16 pass / 0 fail
test:first-viewport-audience → 4 pass / 0 fail
test:narrow-viewport       → all PASS
test:narrow-viewport-pages → all PASS
check:render-blocking → all six pages PASS
npm run check        → "TinyStudio.io checks passed."
```

Every existing suite continues to pass; the new `/favicon.ico` handler
adds a single branch ahead of `PUBLIC_ASSET_PATHS` and does not change
any served HTML document, the worker allow-list semantics for the seven
public pages, or the asset-bucket contract.

### 5. Live browser expectation

Modern Chromium, Firefox, and Safari continue to honour the
`<link rel="icon">` declaration in every served page (measured zero
`/favicon.ico` requests in the previous receipts). The new handler
turns the *latent* 404 — the path that crawlers and bookmark-import
flows still hit — into a 200 with the canonical SVG bytes, so the
item's symptom ("every page load fires a 404 /favicon.ico request")
can no longer occur by any user agent.

## Files changed

- `src/worker.js` — `PUBLIC_ASSET_PATHS` adds `/favicon.ico`; a new
  branch ahead of the generic asset handler serves the canonical
  `/favicon.svg` bytes at `/favicon.ico` with `Content-Type:
  image/x-icon` and immutable cache.
- `scripts/check-site.mjs` — the existing "Favicon (dogfood)"
  section adds two source-side guards (allow-list entry +
  `image/x-icon` override) that fail `npm run check` if either line
  is dropped in a future refactor.
- `docs/evidence/favicon-ico-2026-08-17.md` — this receipt.
- `.lane/reports/fix-favicon-ico-2026-08-17.md` — lane 1 closeout
  report.

## Repro steps (drift detection)

1. `node scripts/check-site.mjs` — the "Favicon (dogfood)" section
   exits non-zero if either new guard (allow-list entry or
   `image/x-icon` override) is missing from the worker source.
2. `node_modules/.bin/wrangler dev --local --port 8791` and
   `curl -D - http://127.0.0.1:8791/favicon.ico` → must return HTTP
   200 with `Content-Type: image/x-icon` and a body matching
   `sha256sum public/favicon.svg`. Returning 404 means the legacy
   fallback has been silently dropped.
3. `curl -D - https://tinystudio.io/favicon.ico` (after merge +
   deploy) — same expected response shape. A 404 here means the
   deploy did not pick up the allow-list change.
