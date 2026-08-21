# AUDIT / REVIEW — 2026-08-21 — TinyStudio.io

## Headline

The fleet-scout candidates file (`var/scout/CANDIDATES-2026-08-21-TinyStudio.io.md`
in the fleet2 scout output) was pure noise again: 28 lines of "Open TODOs /
FIXMEs" grep, nearly all `node_modules/wrangler` comments, `.agents/skills/speckit-*`
skill-template placeholders, and an echo of the previous scout's own commit
message. The candidate set was reconstructed directly from the product
workspace; every survivor carries a cited evidence source.

**Revenue reality:** TinyStudio's sole revenue line is The Growth Desk at
$2,500/month on a three-month minimum ($7,500 minimum engagement). The free
Website Appraisal is the only top-of-funnel surface. Revenue impact is scored
by how directly an item moves a visitor from appraisal request to paid desk
engagement, or protects the measurement of that funnel.

The top five revenue-impact survivors match the prior run and all persist with
current evidence: (1) deploy lag, (2) Google Ads conversion tracking, (3) service
directory profiles, (4) AI-search answer readiness, (5) study snapshot freshness.

## Ranked survivors (max 5, priority=revenue)

1. **`deploy-lag`** (highest revenue impact; conversion-critical fix not live).
   **Verified live:** `https://tinystudio.io/pricing` serves NO signup form while
   `public/pricing.html` on `main` carries the request-the-appraisal form
   (`action="/api/signups"`, line 132) added by PR #194 and hardened by #251
   (44px tap targets). `main` HEAD is `92d55c3` (PR #256); the live pricing page
   predates the #194 form.
   Evidence: live `/pricing` (measured 2026-08-21, no `<form>`), `public/pricing.html:132`,
   PRs #194/#251/#256 (MERGED), `docs/evidence/ai-search-evidence-lag-2026-08-12.md`.

2. **`google-ads-conversion-tracking`** (funnel ROI unmeasurable if secret unset).
   The conversion tag is injected only when both `GOOGLE_ADS_CONVERSION_ID` and
   `GOOGLE_ADS_CONVERSION_LABEL` are set and well-formed; neither is in
   `wrangler.jsonc`, so firing state is unverified from the repo.
   Evidence: `src/worker.js:1428-1480`, `wrangler.jsonc` (no such vars),
   `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md`.

3. **`service-directory-profiles`** (inbound lead sources pending merge).
   All four handoff PRs remain OPEN: #252 Clutch, #253 G2, #254 GoodFirms,
   #262 50Pros. The manual submission on each directory is Nish's (see NEEDS-NISH).
   Evidence: PRs #252/#253/#254/#262 (all OPEN), `docs/service/clutch-manual-profile-2026-08-09.md`,
   `docs/service/g2-service-profile-2026-08-09.md`, `docs/service/goodfirms-manual-profile-2026-08-15.md`.

4. **`ai-search-answer-readiness`** (buyer reading surface; q5 ground truth).
   PR #227 (controlled re-run) is merged, but follow-ons #261 (entity-and-offer
   re-run) and #264 (q5 ground-truth drop of retired Agent Desk) are still OPEN.
   Evidence: PRs #261/#264 (OPEN), PR #227 (MERGED), `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`.

5. **`study-snapshot-freshness`** (audit credibility; daily-refresh promise).
   Newest snapshot `2026-08-17.json` is 4 days old, exactly at the
   `MAX_SNAPSHOT_AGE_DAYS = 4` CI edge behind the "refreshed daily" promise.
   Evidence: `study/snapshots/2026-08-17.json`, `scripts/test-study-freshness.mjs`,
   `public/{index,audit,pricing,specimen}.html` `data-study` spans.

## INBOX lines to append (each its own line, priority=revenue, original slug tag)

```
[TinyStudio.io] priority=revenue Deploy main to live: verified the /pricing request-the-appraisal signup form (#194, #251) is NOT live — live /pricing serves no <form>/api/signups while main HEAD 92d55c3 has it; slug=deploy-lag; evidence=live /pricing (2026-08-21), public/pricing.html:132, PRs #194/#251/#256, docs/evidence/ai-search-evidence-lag-2026-08-12.md
[TinyStudio.io] priority=revenue Verify Google Ads conversion tag is firing in production: GOOGLE_ADS_CONVERSION_ID/LABEL are env-gated and not in wrangler.jsonc; unset = zero conversion tracking and unmeasurable paid ROI; slug=google-ads-conversion-tracking; evidence=src/worker.js:1428-1480, wrangler.jsonc, docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md
[TinyStudio.io] priority=revenue Merge the 4 open service-directory profile PRs so handoff docs are on main: #252 Clutch, #253 G2, #254 GoodFirms, #262 50Pros; manual submission is Nish's; slug=service-directory-profiles; evidence=PRs #252/#253/#254/#262, docs/service/
[TinyStudio.io] priority=revenue Continue AI-search answer-readiness re-verification: merge PRs #261 and #264 so /audit embedded artifact advances and q5 ground truth drops the retired Agent Desk description; slug=ai-search-answer-readiness; evidence=docs/evidence/ai-search/2026-08-15-controlled-rerun.md, PR #227, PRs #261/#264
[TinyStudio.io] priority=revenue Import a newer study snapshot and re-run study/render.py: newest 2026-08-17.json is at the MAX_SNAPSHOT_AGE_DAYS=4 CI edge behind the daily-refresh promise; slug=study-snapshot-freshness; evidence=study/snapshots/2026-08-17.json, scripts/test-study-freshness.mjs, public/*.html data-study spans
```

## Market-signal role

**No new competitor moves or pricing shifts visible in the candidates file.**
The fleet-scout candidates file is noise (node_modules TODOs); it carries no
competitor or pricing signal. The product workspace shows no competitor pricing
change: the desk price remains $2,500/month on a three-month minimum
(`public/pricing.html`, `public/offer.md`), unchanged from prior runs. The
service-directory profile work (Clutch/G2/GoodFirms/50Pros) is TinyStudio's own
inbound positioning, not a competitor move.

## Rejected / dedup

- **node_modules/wrangler TODOs** — not product code; ignored.
- **`.agents/skills/speckit-*` placeholders** — tooling skill docs; ignored.
- **Prior scout's COMMIT_EDITMSG echo** — history, not a candidate.
- **Docs evidence re-verify PRs (#263–#281)** — verification receipts, not revenue work.
- **C6 `mid-funnel-nurture`** — still the largest revenue leak, but it touches
  email/marketing automation and brand voice that need Nish's decision; moved to
  NEEDS-NISH, not kept in the max-5 cap.

## Files

- Reconstructed input: `var/scout/CANDIDATES-2026-08-21-TinyStudio.io.md`
- Needs-Nish items: `var/scout/NEEDS-NISH.md`
