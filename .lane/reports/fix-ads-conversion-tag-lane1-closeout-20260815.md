# Lane report: tinystudio-io lane 1 — Google Ads conversion placeholder tag

Item: `[unreviewed-by-opus] The funnel's only Google Ads conversion measurement
is dead by construction: placeholder tag`

## Outcome: already fixed, merged, and live — closeout evidence only

This lane performed no source change. Investigation on this worktree
(current `origin/main` head `e7777f3`) found the item's failure mode is
already resolved on source, CI, and the live site:

- **PR #172** (`60d045c`, "fix(worker): make the Google Ads conversion tag
  env-driven instead of a dead placeholder") — **MERGED** 2026-08-13
  (merge commit on main 2026-08-13T23:37:28Z). It replaced the hardcoded
  placeholder `AW-XXXXXXXXX` gtag loader in `public/brief-requested.html`
  and the placeholder conversion event in `public/brief-requested.js` with
  request-time generation in `src/worker.js` from
  `GOOGLE_ADS_CONVERSION_ID` / `GOOGLE_ADS_CONVERSION_LABEL`, emitted only
  when both are configured and well-formed. Missing or malformed config
  ships **no tag at all** — a dead tag is never served. The production CSP,
  which previously blocked `googletagmanager.com` entirely, is now
  page-scoped via `GOOGLE_ADS_CSP` on `/brief-requested` only.
- **PR #215** (branch `fix/ads-conversion-placeholder-rereverify-2026-08-14`)
  — **MERGED** 2026-08-14T23:03:39Z — already closed this exact item with a
  re-verification evidence doc on the current head and live site.

## Independent verification performed this lane (2026-08-15)

1. **Source** — `src/worker.js` carries the env-driven generation
   (`GOOGLE_ADS_ID_PATTERN` / `GOOGLE_ADS_LABEL_PATTERN`,
   `googleAdsConversion()` emitting nothing on malformed/partial config);
   `public/brief-requested.html` contains only a comment explaining worker
   injection, no hardcoded tag; `public/brief-requested.js` is a documented
   static no-op. No placeholder (`AW-XXXXXXXXX`, `YYYYYYYYYYYYYYYYYYY`) or
   hardcoded `googletagmanager.com`/`gtag(` remains in `public/` or
   `src/worker.js`.
2. **Git ancestry** — `60d045c` (PR #172) is an ancestor of current
   `origin/main` head `e7777f3` (`git merge-base --is-ancestor`).
3. **CI guards** — `scripts/check-site.mjs` contains a "Google Ads
   conversion tag" section refusing placeholder/hardcoded gtag in `public/`
   or `src/worker.js` and requiring the env-driven wiring; the shape cannot
   regress.
4. **Tests** — `npm test` green on this head: worker suite 80/80 (includes
   the 3 Google Ads tests: unconfigured → no tag + strict CSP; configured →
   injected loader + generated script + page-scoped CSP; partial/malformed →
   nothing emitted), check-site, heading-hierarchy, sitemap, agent-UI,
   product-contract, first-viewport, narrow-viewport — zero failures.
5. **Live site** — `GET https://tinystudio.io/brief-requested` returns
   HTTP/2 200 with the **strict CSP**
   (`script-src 'self' https://static.cloudflareinsights.com`, no
   googletagmanager/googleadservices allowance) and **zero**
   `googletagmanager`/`AW-` references in the body. Exactly the designed
   behavior while the secrets are unset: nothing dead ships, and the tag
   activates without code change the moment the real IDs are set via
   `wrangler secret put`.

## Files changed

- `.lane/reports/fix-ads-conversion-tag-lane1-closeout-20260815.md` — this
  lane report.
- `docs/evidence/ads-conversion-tag-lane1-closeout-20260815.md` — closeout
  evidence receipt against current main and live, so the item cannot be
  re-opened by tracker drift.

## Delivery

- Branch: `fix/ads-conversion-tag-lane1-closeout-20260815`
- PR: opens against main; docs-only closeout following the established
  pattern of the already-merged PR #215 for this same item.

## Repro

- `npm run check` — the "Google Ads conversion tag" guard section.
- `node --test scripts/test-agent-worker.mjs` — worker tests incl. ads
  tests 78-80 (unconfigured / configured / partial-malformed).
- `curl -s https://tinystudio.io/brief-requested.html | grep -c googletagmanager`
  → 0, with strict CSP on the response.
