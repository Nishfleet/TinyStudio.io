# Homepage — `/`

The anonymous marketing root. Served by the Worker from `public/index.html`
via the `PUBLIC_ASSET_PATHS` allow-list, with the security headers applied.
This is the canonical first-paint for every anonymous visitor on
`tinystudio.io` and `www.tinystudio.io`.

## How users reach it

Open `http://127.0.0.1:8790/` directly, or follow any inbound link. No
account, no session. The Worker answers 200 for the bare path and for
`/index.html`.

## How to drive it

1. `GET /` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The page title is exactly `TinyStudio — The Website Appraisal`.
3. `<link rel="canonical" href="https://tinystudio.io/">` is present so
   `www.tinystudio.io` does not get indexed as a separate site (the
   production `www` host also answers a 301 to the apex; local dev
   cannot, because the dev server canonicalizes the host header).
4. The hero form is the audit CTA. It is the in-page link to `#start`
   plus the navlink `Request the appraisal`. The "audit" page at
   `/audit` carries the actual form.
5. Required copy strings from `scripts/check-site.mjs` are present:
   `Six a month.`, `No call at any point.`, `hello@tinystudio.io`,
   `TinyStudio is the business behind this site`.
6. The `data-ai-question` blocks (the FAQ) are rendered as `<div
   class="q" data-ai-question="q8-conversion-audit">` etc.

```bash
curl -fsS http://127.0.0.1:8790/ -o /tmp/verify-tinystudio/home.html
grep -c 'TinyStudio — The Website Appraisal' /tmp/verify-tinystudio/home.html
grep -c 'Six a month.' /tmp/verify-tinystudio/home.html
grep -c 'No call at any point.' /tmp/verify-tinystudio/home.html
grep -c 'hello@tinystudio.io' /tmp/verify-tinystudio/home.html
grep -c 'data-ai-question="q8-conversion-audit"' /tmp/verify-tinystudio/home.html
```

## What proves success

- HTTP 200.
- The exact page title appears exactly once.
- The four required-copy strings are each present at least once.
- At least one `data-ai-question` block is rendered (the FAQ).
- The security headers from `SECURITY_HEADERS` in `src/worker.js`
  arrive on the response (`Strict-Transport-Security`,
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`).

## Local honesty note

- The Google Ads conversion tag only injects when both
  `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL` are
  configured. Local dev does not have them, so the page-scoped
  `GOOGLE_ADS_CSP` does not apply and the response uses the strict
  default CSP. Local success must NOT require the conversion tag.
- The OG image (`/og-image.png`) and the favicon variants
  (`/favicon.svg`, `/favicon.ico`, `/apple-touch-icon.png`) must all
  return 200; the homepage's `<link>` and `<meta>` tags reference them
  and a 404 there is a real regression, not a dev-only thing.
