# AUDIT / REVIEW — 2026-08-20 — TinyStudio.io

## Headline

The fleet-scout candidates file was mostly noise (a 1.6 MB `data.json` dump
and `node_modules` TODOs). The candidate set was reconstructed directly from
the product workspace; every survivor carries a cited evidence source.

**Revenue reality:** TinyStudio's sole revenue line is The Growth Desk at
$2,500/month on a three-month minimum ($7,500 minimum engagement). The free
Website Appraisal is the only top-of-funnel surface. Revenue impact is scored
by how directly an item moves a visitor from appraisal request to paid desk
engagement, or protects the measurement of that funnel.

The top five revenue-impact survivors are: (1) deploy lag, (2) Google Ads
conversion tracking, (3) service directory profiles, (4) AI-search answer
readiness, (5) study snapshot freshness. C6 (mid-funnel nurture) was not
kept in the max-5 cap — it is the largest revenue leak but it touches
email/marketing automation that needs Nish's brand voice decision, so it
goes to NEEDS-NISH.

## Ranked survivors (max 5, priority=revenue)

1. **`deploy-lag`** (highest revenue impact; conversion-critical fixes not live).
   Ship pending `main` to live via `safe-deploy`: the six-a-month intake cap
   fix (#245) and the pricing-page signup form (#194) are on `main` but not
   deployed. The deployed Worker is at `b4d80f1c` (2026-08-17); `main` HEAD is
   `2e3d7a8`.
   Evidence: `release-state-tinystudio-io.json` sha `b4d80f1c`, `git log b4d80f1c..HEAD`,
   `docs/evidence/ai-search-evidence-lag-2026-08-12.md`, PRs #245, #194, #154, #156, #218.

2. **`google-ads-conversion-tracking`** (funnel ROI unmeasurable if secret unset).
   Verify `GOOGLE_ADS_CONVERSION_ID` / `GOOGLE_ADS_CONVERSION_LABEL` are set as
   Worker secrets and the `/brief-requested` tag is firing in production. If
   unset, zero conversion tracking and paid acquisition ROI is unmeasurable.
   Evidence: `src/worker.js:1428-1455`, `wrangler.jsonc` (no such vars),
   `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md`,
   `scripts/check-site.mjs:788-800`.

3. **`service-directory-profiles`** (inbound lead sources pending merge).
   Merge the 4 open service-profile PRs (#252 Clutch, #253 G2, #254 GoodFirms,
   #262 50Pros) so the handoff docs are on `main`. The manual submission on
   each directory is Nish's (see NEEDS-NISH).
   Evidence: PRs #252, #253, #254, #262 (all OPEN), `docs/service/clutch-manual-profile-2026-08-09.md`,
   `docs/service/g2-service-profile-2026-08-09.md`, `docs/service/goodfirms-manual-profile-2026-08-15.md`.

4. **`ai-search-answer-readiness`** (buyer reading surface; q5 ground truth).
   Continue the entity/offer re-verification: merge PRs #261 and #264 so the
   `/audit` embedded artifact advances past `testedOn: 2026-08-15` and q5
   ground truth drops the retired Agent Desk description for good.
   Evidence: `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`, PR #227
   (merged), PRs #261 + #264 (OPEN), `public/offer.md` Answer Readiness section.

5. **`study-snapshot-freshness`** (audit credibility; daily-refresh promise).
   Import newer study snapshots from the scan checkout and re-run
   `study/render.py` so the public pages' "refreshed daily" / "this number is
   today's" promise holds. Newest snapshot is `2026-08-17.json` — 4 days old,
   at the `MAX_SNAPSHOT_AGE_DAYS = 4` CI edge.
   Evidence: `study/snapshots/2026-08-17.json`, `scripts/test-study-freshness.mjs`,
   PR #156 (merged), `public/audit.html` `data-study` spans.

## INBOX lines to append (each its own line, priority=revenue, original slug tag)

```
[TinyStudio.io] priority=revenue Ship pending main to live via safe-deploy: 8+ merged conversion-critical fixes not yet deployed (intake cap #245, pricing form #194, a11y #154, study #156, canonicals #218); deployed sha b4d80f1c vs HEAD 2e3d7a8; slug=deploy-lag; evidence=release-state-tinystudio-io.json, git log b4d80f1c..HEAD, docs/evidence/ai-search-evidence-lag-2026-08-12.md
[TinyStudio.io] priority=revenue Verify Google Ads conversion tag is firing in production: GOOGLE_ADS_CONVERSION_ID/LABEL secrets env-gated, unset = zero conversion tracking; slug=google-ads-conversion-tracking; evidence=src/worker.js:1428-1455, wrangler.jsonc, docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md
[TinyStudio.io] priority=revenue Merge the 4 open service-directory profile PRs so handoff docs are on main: #252 Clutch, #253 G2, #254 GoodFirms, #262 50Pros; manual submission is Nish's; slug=service-directory-profiles; evidence=PRs #252/#253/#254/#262, docs/service/
[TinyStudio.io] priority=revenue Continue AI-search answer readiness re-verification: merge PRs #261 and #264 so /audit embedded artifact advances past testedOn 2026-08-15 and q5 ground truth drops retired Agent Desk; slug=ai-search-answer-readiness; evidence=docs/evidence/ai-search/2026-08-15-controlled-rerun.md, PR #227, PRs #261/#264
[TinyStudio.io] priority=revenue Import newer study snapshots from the scan checkout and re-run study/render.py: newest snapshot 2026-08-17 is at the MAX_SNAPSHOT_AGE_DAYS=4 CI edge behind the daily-refresh promise; slug=study-snapshot-freshness; evidence=study/snapshots/2026-08-17.json, scripts/test-study-freshness.mjs, PR #156
```

## Market-signal role

**No new competitor moves or pricing shifts visible in the candidates file.**
The fleet-scout candidates file was noise (a `data.json` dump and
`node_modules` TODOs); it carries no competitor or pricing signal. The
product workspace shows no competitor pricing change: the desk price remains
$2,500/month on a three-month minimum (`public/pricing.html`, `public/offer.md`),
unchanged from the prior scout runs. The service-directory profile work
(Clutch/G2/GoodFirms/50Pros) is TinyStudio's own inbound positioning, not a
competitor move.

## Rejected / dedup

- **C6 `mid-funnel-nurture`** — the largest revenue leak (no automated bridge
  between free audit delivery and paid desk decision), but it touches
  email/marketing automation and brand voice, which need Nish's decision.
  Moved to NEEDS-NISH, not kept in the max-5 cap.
- **node_modules TODOs** — not product code; ignored.
- **`data.json` fleet pulse dump** — a fleet artifact in the workspace root,
  not a product candidate; ignored.

## Files

- Reconstructed input: `var/scout/CANDIDATES-2026-08-20-TinyStudio.io.md`
- Needs-Nish items: `var/scout/NEEDS-NISH.md`
