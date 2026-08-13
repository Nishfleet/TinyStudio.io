# Social share image finding d87d715be3d0 — dogfood engine rerun (fingerprint dropped)

Date: 2026-08-12
Scope: dogfood finding `d87d715be3d0` ("Social share image incomplete on home", audit run `20260808T074205Z-msk2fl3n`) against https://tinystudio.io — the home page plus the four sibling public pages (`/index.html`, `/audit.html`, `/agents.html`, `/pricing.html`, `/specimen.html`).
This receipt records the verify step the backlog item names: a rerun of the **same SEO Fix Kit rendered audit engine** after the fix went live, to confirm the finding's fingerprint drops out of active findings.

## Why this receipt exists

The code fix for this finding (PR #31, commit eae1d87: the complete Open Graph +
Twitter Card set on all five public pages, the regenerated 1200x630 current-offer
`og-image.png`, and the source-string CI guard in `scripts/check-site.mjs`) merged
and shipped live on 2026-08-09, and the live deployment was measured in real
Chromium on 2026-08-11 (`docs/evidence/social-share-image-2026-08-11.md`, PR #76).

What neither of those could do was satisfy the backlog item's verify criterion
verbatim: "Rerun the dogfood batch and confirm the fingerprint drops out of
active findings." The last engine rerun on record (`20260809T013017Z-msl4lamt`)
started 2026-08-09T01:30:17Z — before the fix's fleet-release landed at ~05:45Z
the same day — so it still reported the finding. The scheduled portfolio batch
(systemd `traction-dogfood`, Sunday 07:00 Asia/Kolkata) had no intervening run.
This receipt fills that gap with the engine rerun.

## What was measured

- Engine: the exact same module the scheduled dogfood pipeline imports —
  `/home/nish/workspaces/products/proof-seo/server/audit/engine.js`, checkout
  commit `1df396eeec524bec8e2a294abe54a43b3a18520f`, version `0.9.0` (the same
  engine that produced runs `20260808T074205Z-msk2fl3n` and
  `20260809T013017Z-msl4lamt`).
- Invocation: identical to `traction-dogfood/dogfood.mjs` step 3 —
  `auditUrl("https://tinystudio.io", { maxPages: 6, pageSpeed: false })` with
  `SEOFIXKIT_PAGESPEED_DISABLED=1`, local Playwright (Chromium headless), run
  2026-08-12 against the live deployed site.
- In addition, the served HTML of `https://tinystudio.io/` was fetched and the
  share set read from the served bytes, and `https://tinystudio.io/og-image.png`
  was fetched and header-checked.

## Results (engine rerun, 2026-08-12)

| Metric | Original run 20260808T074205Z-msk2fl3n | Rerun 2026-08-12 |
|---|---|---|
| Score | 12 | 89 |
| Findings | 55 (C6 / W25 / N24) | 7 (C0 / W4 / N3) |
| "Social share image incomplete" findings (`issue-6`, `issue-15`, `issue-24`, `issue-33`, `issue-42`, `issue-51`) | 6 — home, /index.html, /audit.html, /agents.html, /pricing.html, /specimen.html | **0** |
| Home page findings | 10 (incl. the social share notice) | **0** |

The finding's fingerprint — `og:image: missing; twitter:image: missing` on the
six page scopes — **dropped out of active findings entirely**. The rerun's only
residual findings are unrelated and on sibling pages:

- `performance-1/2/4/6` (warning): render-blocking CSS on /audit, /agents,
  /pricing, /specimen — owned by dogfood finding b8f6046e942a.
- `issue-3/5/7` (notice): canonical URL redirects on /agents, /pricing,
  /specimen — owned by dogfood finding 6631c0ab0454.

The home page — the finding's scope — has zero findings in the rerun.

## Live served bytes (2026-08-12)

`GET https://tinystudio.io/` → 200; the served HTML carries the complete
twelve-tag share set, each exactly once in `<head>`:

> ```html
> <meta property="og:title" content="TinyStudio — The Website Appraisal">
> <meta property="og:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
> <meta property="og:type" content="website">
> <meta property="og:url" content="https://tinystudio.io/">
> <meta property="og:image" content="https://tinystudio.io/og-image.png">
> <meta property="og:image:width" content="1200">
> <meta property="og:image:height" content="630">
> <meta property="og:image:alt" content="TinyStudio — The Website Appraisal">
> <meta name="twitter:card" content="summary_large_image">
> <meta name="twitter:title" content="TinyStudio — The Website Appraisal">
> <meta name="twitter:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
> <meta name="twitter:image" content="https://tinystudio.io/og-image.png">
> ```

`GET https://tinystudio.io/og-image.png` → 200, `content-type: image/png`,
345,042 bytes — a valid non-interlaced 1200x630 PNG, matching the declared
`og:image:width`/`height` and the committed `public/og-image.png`.

Source guard still green on current main: `npm run check` passes, including
the "Social share tags (dogfood d87d715be3d0)" section of
`scripts/check-site.mjs` (twelve tags, exactly once, in `<head>`, correct
attribute per tag, non-empty content, bound to each page's own metadata, and
`og:image:width`/`height` matched against the committed PNG header).

## Exact verification method (reproduce)

1. `cd /home/nish/workspaces/products/proof-seo` (the engine checkout the
   dogfood pipeline reads from the product registry).
2. `SEOFIXKIT_PAGESPEED_DISABLED=1 node -e 'import("./server/audit/engine.js").then(async ({auditUrl}) => { const r = await auditUrl("https://tinystudio.io", { maxPages: 6, pageSpeed: false }); console.log(JSON.stringify(r.findings, null, 1)); })'`
   with Playwright + Chromium installed.
3. Assert: no finding whose title matches `/social share image/i` and no
   finding whose evidence matches `/og:image: missing|twitter:image: missing/i`
   on any of the six page scopes; home page finding list empty.
4. `curl -s https://tinystudio.io/ | grep -c "og:image\|twitter:image"` → 5+,
   and `curl -sI https://tinystudio.io/og-image.png` → 200 `image/png`.
5. `npm run check` in the TinyStudio.io checkout → "TinyStudio.io checks
   passed."

## Limitation

This rerun audited the finding's product scope (tinystudio.io) with the exact
engine and parameters the scheduled batch uses; it was not the full
seven-domain portfolio batch, which the systemd timer owns and which also
refreshes `finding-ledger.json` and the other product backlogs. The item's
accept/verify criteria are about this product's pages, so the single-domain
rerun answers them; the next scheduled batch will record the drop in the
ledger without further action.

## Closeout

This closes dogfood finding d87d715be3d0 ("Social share image incomplete on
home", audit 20260808T074205Z-msk2fl3n) on every criterion the backlog item
names: the rendered-audit notice is resolved on the live site, the CI guard
holds the fix in source, and a rerun of the same SEO Fix Kit engine — the
item's stated verify step — no longer reports the fingerprint on any of the
six page scopes.
