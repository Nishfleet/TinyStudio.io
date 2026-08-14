# Lane report: tinystudio-io lane 1 — Google Ads conversion placeholder tag (re-verify)

Item: `d2c8a852ff` — "[unreviewed-by-opus] The funnel's only Google Ads
conversion measurement is dead by construction: placeholder tag"

## Outcome: already fixed on main and live — re-verified, closed out

No new code change was needed. The dead-by-construction shape the item
describes was already removed by PR #172 (`60d045c`, "fix(worker): make the
Google Ads conversion tag env-driven instead of a dead placeholder", merged
2026-08-14), which is an ancestor of the current `origin/main` head
(`e7777f3`). This lane re-verified the fix against current main and the live
site, and recorded the close-out.

## What was dead (pre-#172)

- `public/brief-requested.html` hardcoded the gtag loader with placeholder
  `AW-XXXXXXXXX`.
- `public/brief-requested.js` fired the conversion event to the same
  placeholder (`AW-XXXXXXXXX/YYYYYYYYYYYYYYYYYYY`).
- The production CSP blocked `googletagmanager.com` entirely, so even a real
  ID pasted in could never load or record.

## The merged fix (PR #172)

- Worker generates the tag at request time from
  `GOOGLE_ADS_CONVERSION_ID` / `GOOGLE_ADS_CONVERSION_LABEL`, emits it only
  on `/brief-requested` when both are configured and well-formed.
- With either missing or malformed, the page ships with **no tag at all** —
  a dead tag is never served.
- gtag's CSP allowances scoped to that one noindex page's response; every
  other page keeps the strict CSP.
- CI guards (`scripts/check-site.mjs`) forbid any placeholder / hardcoded
  gtag in `public/` or `src/worker.js`; worker tests (3) cover
  unconfigured / configured / partial-malformed.

## Re-verification evidence (2026-08-14)

- `git merge-base --is-ancestor 60d045c HEAD` → yes, fix is in main.
- `npm run check` passes — the Google Ads guard section is active.
- `npm test` passes end to end: 117 tests, 0 failures (worker suite 80
  tests incl. the 3 ads-tag tests).
- Live probes:
  - `https://tinystudio.io/brief-requested.html` → 200, zero
    `googletagmanager` / `gtag` / `AW-` references, strict CSP.
  - `https://tinystudio.io/brief-requested.js` → 200, static no-op, no
    `gtag(` / `dataLayer`.
  - Production secrets are unset (live site emits no tag), so the strict CSP
    is served — no dead tag, and the tag activates the moment the real
    conversion ID/label are set via `wrangler secret put`
    (per `specs/003-wellness-clinic-launch/tracking-setup.md` §3).

## Files changed (this lane)

- `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-14.md` — the
  close-out receipt (new).
- `.lane/reports/fix-ads-conversion-placeholder-rereverify-2026-08-14.md` —
  this report (new).

## Delivery

- Branch: `fix/ads-conversion-placeholder-rereverify-2026-08-14`
- PR: opens against main with the close-out receipt; no functional code
  change, since the fix (PR #172) is already merged and live.
