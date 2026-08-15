# Lane 1 — Google Ads conversion placeholder tag re-verification (2026-08-15)

Item: `d2c8a852ff` — "[unreviewed-by-opus] The funnel's only Google Ads
conversion measurement is dead by construction: placeholder tag"

Branch: `fix/ads-conversion-placeholder-rereverify-2026-08-15-lane1`
Base: `origin/main` at `c62211c` (2026-08-15)

## Verdict

**Finding stays closed — no code change required.** The dead-by-construction
Google Ads conversion tag was removed by PR #172 (`60d045c`, merged
2026-08-13): the worker now generates the tag at request time from
`GOOGLE_ADS_CONVERSION_ID` / `GOOGLE_ADS_CONVERSION_LABEL`, emits it only on
`/brief-requested` when both are configured and well-formed, and emits
nothing otherwise. The CI guard in `scripts/check-site.mjs` makes the
placeholder shape impossible to return. The fix remains intact on both
current main (`c62211c`) and the live deployment.

## Changes since the 2026-08-15 #227/#228 re-verification (base 23e24d6)

No commits since `23e24d6` (#227/#228) touched the ads-conversion surface:
the diff range `23e24d6..HEAD` is empty for `src/worker.js`,
`public/brief-requested.html`, `public/brief-requested.js`,
`scripts/check-site.mjs` and `specs/003-wellness-clinic-launch/tracking-setup.md`.

## Source verification (head c62211c)

- `git merge-base --is-ancestor 60d045c HEAD` → yes.
- `src/worker.js` lines 1350-1383: `googleAdsConversion()` returns `null`
  unless both env values are present and match `/^AW-\d{6,15}$/` and
  `/^[A-Za-z0-9_-]{10,50}$/`; injection confined to `/brief-requested`
  and `/brief-requested.js`.
- `public/brief-requested.html` / `public/brief-requested.js`: no loader,
  no placeholder — only the explanatory comment; the script is a static
  no-op the worker replaces when configured.
- `npm run check` passes (including the Google Ads guard section).
- `npm test` passes end to end: check-site, headings 6/6, sitemap 7/7,
  worker 80/80 (incl. the three ads-tag tests), agent-UI 16/16,
  product-contract 8/8, first-viewport 4/4, narrow-viewport — zero
  failures across all suites.

## Live verification (2026-08-15)

- `GET https://tinystudio.io/brief-requested.html` → 307 →
  `/brief-requested` → 200, strict CSP, zero `googletagmanager` / `AW-`
  references (single "gtag" hit is the explanatory comment).
- `GET https://tinystudio.io/brief-requested.js` → 200, static no-op, no
  `gtag(` / `dataLayer`.

With the secrets unset, the funnel ships zero tracking rather than a dead
tag — exactly the designed behavior — and the tag activates from env with
no code change the moment the real conversion ID and label are set via
`wrangler secret put`.

## Outcome

Closed, no code change. Full evidence:
`docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md`.
