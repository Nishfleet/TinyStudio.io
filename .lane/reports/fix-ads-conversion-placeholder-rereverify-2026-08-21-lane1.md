# Lane 1 — Google Ads conversion placeholder tag re-verification (2026-08-21)

Item: `d2c8a852ff` — "[unreviewed-by-opus] The funnel's only Google Ads
conversion measurement is dead by construction: placeholder tag"

Branch: `fix/ads-conversion-placeholder-rereverify-2026-08-21-lane1`
Base: `origin/main` at `92d55c3` (2026-08-20)

## Verdict

**Finding stays closed — no code change required.** The dead-by-construction
Google Ads conversion tag was removed by PR #172 (`60d045c`, merged
2026-08-13): the worker now generates the tag at request time from
`GOOGLE_ADS_CONVERSION_ID` / `GOOGLE_ADS_CONVERSION_LABEL`, emits it only on
`/brief-requested` when both are configured and well-formed, and emits
nothing otherwise. The CI guard in `scripts/check-site.mjs` makes the
placeholder shape impossible to return. The fix remains intact on both the
current main head (`92d55c3`) and the live deployment.

## Changes since the 2026-08-15 #227/#228 close-out (base 23e24d6)

- `public/brief-requested.html`: only a footer brand string changed (#112,
  "The Tiny Studio" → "TinyStudio · tinystudio.io") — no ads-related change.
- `src/worker.js` / `scripts/check-site.mjs`: touched by #229, #238, #243,
  #194, #218, #112, #154, #245, #251, #256 — the env-driven
  `googleAdsConversion()` generator, the page-scoped `GOOGLE_ADS_CSP`
  injection and the static source guard are unchanged and intact.

## Source verification (head 92d55c3)

- `git merge-base --is-ancestor 60d045c HEAD` → yes.
- `src/worker.js` lines 1428-1461: `googleAdsConversion()` returns `null`
  unless both env values match `/^AW-\d{6,15}$/` and
  `/^[A-Za-z0-9_-]{10,50}$/`; injection confined to `/brief-requested`,
  `/brief-requested.html` and `/brief-requested.js`.
- `public/brief-requested.html` / `public/brief-requested.js`: no loader,
  no placeholder — only the explanatory comment; the script is a static
  no-op the worker replaces when configured.
- `npm run check` passes (including the Google Ads guard section).
- `npm run test:worker` passes 83/83 (incl. the three ads-tag tests:
  unconfigured → no tag + strict CSP; configured → injected loader +
  generated script + page-scoped CSP; partial/malformed → nothing emitted).

## Live verification (2026-08-21)

- `GET https://tinystudio.io/brief-requested` → 200, strict CSP, zero
  `googletagmanager` / `AW-` references (single "gtag" hit is the
  explanatory comment).
- `GET https://tinystudio.io/brief-requested.js` → 200, static no-op, no
  `gtag(` / `dataLayer`.

With the secrets unset, the funnel ships zero tracking rather than a dead
tag — exactly the designed behavior — and the tag activates from env with
no code change the moment the real conversion ID and label are set via
`wrangler secret put`.

## Outcome

Closed, no code change. Full evidence:
`docs/evidence/ads-conversion-placeholder-rereverify-2026-08-21-lane1.md`.
