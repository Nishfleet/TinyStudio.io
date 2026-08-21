# CANDIDATES — 2026-08-21 — TinyStudio.io

> **Input note (audit blocker).** The candidates file referenced by the scout
> run (`var/scout/CANDIDATES-2026-08-21-TinyStudio.io.md`) is the deterministic
> fleet-scout output at `/home/nish/fleet2/var/scout/CANDIDATES-2026-08-21-TinyStudio.io.md`.
> That file is noise for this product: all 28 lines are the "Open TODOs /
> FIXMEs" grep, and nearly every line is a `node_modules/wrangler` TODO comment
> or a `.agents/skills/speckit-*` skill-template placeholder. Line 14 is an echo
> of the previous scout's own `.git/COMMIT_EDITMSG` ("candidates file was
> noise…"). None of it is a product revenue candidate.
>
> Rather than audit noise, this file reconstructs the candidate set **directly
> from the product workspace**, with every item carrying a cited evidence source
> (file path, commit, or GitHub PR). It is the input the audit
> (`AUDIT-2026-08-21-TinyStudio.io.md`) ranked.

## Product context (revenue framing)

- TinyStudio's sole revenue line is **The Growth Desk**: $2,500/month on a
  three-month minimum ($7,500 minimum engagement). Source: `public/pricing.html`,
  `public/offer.md`.
- The **free Website Appraisal** is the only top-of-funnel acquisition surface:
  six per month, by hand, email-gated. Source: `public/offer.md`, `src/worker.js`
  intake-cap logic (lines 428–443).
- Conversion path: appraisal request (email capture via `/api/signups`) →
  free audit delivered → desk upsell on `/pricing`, `/agents`, `/audit`.
- Revenue impact is scored by: how directly the item moves a visitor from
  appraisal request to paid desk engagement, or protects the measurement of
  that funnel.

## Candidates

### C1 — Deploy lag: conversion-critical fixes on main are not live

`main` HEAD is `92d55c3ede64be3cfb8c40b144967b371ac24982` (2026-08-20, PR #256).
**Verified against live:** `https://tinystudio.io/pricing` serves NO `<form>`
and no `/api/signups` action, while local `public/pricing.html` carries the
request-the-appraisal signup form (`<form class="lead two" action="/api/signups">`,
line 132) added by PR #194. That means at least #194 (pricing closing-callout
signup form) and its follow-up #251 (44px tap target on those form inputs) are
on `main` but NOT deployed. The live `pricing.html` closing callout still reads
"The appraisal costs you an email…" with no form.

Evidence:
- Live `https://tinystudio.io/pricing` — no `<form>` / no `/api/signups` (measured 2026-08-21)
- Local `public/pricing.html:132` `<form class="lead two" action="/api/signups" method="post">` (main HEAD)
- PR #194 merged `fix(public): put a real Request-the-appraisal signup form in the /pricing closing callout`
- PR #251 merged `fix(public): keep /pricing lead-form bare inputs at a 44px tap target`
- PR #256 merged `fix(check): guard the apple touch icon on every served page` (HEAD)
- `docs/evidence/ai-search-evidence-lag-2026-08-12.md` documents the same deploy-lag pattern

### C2 — Google Ads conversion tracking: env-gated, active state unverified

The funnel's only conversion measurement is the Google Ads conversion tag on
`/brief-requested`, injected by the worker only when `GOOGLE_ADS_CONVERSION_ID`
and `GOOGLE_ADS_CONVERSION_LABEL` are BOTH set and well-formed. With either
value missing or malformed, the page ships with no tag at all — zero conversion
tracking. The vars are not in `wrangler.jsonc` (they are set via
`wrangler secret put`), so whether the tag fires in production is unverifiable
from the repo side. Without it, paid-acquisition ROI is unmeasurable.

Evidence:
- `src/worker.js` lines 1428–1480 (`googleAdsConversion`, env-gated)
- `wrangler.jsonc` — no `GOOGLE_ADS_CONVERSION_ID` / `_LABEL` vars
- `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md`
- `scripts/check-site.mjs` (guard for placeholder tags)

### C3 — Service directory profiles: 4 manual-handoff PRs still open

The Clutch, G2, GoodFirms, and 50Pros agency-profile handoff PRs are all still
OPEN on 2026-08-21. These are inbound lead sources for high-ticket service
buyers searching for audit/appraisal providers. The manual submission on each
venue is Nish's (see NEEDS-NISH).

Evidence:
- PR #252 (Clutch) OPEN
- PR #253 (G2) OPEN
- PR #254 (GoodFirms) OPEN
- PR #262 (50Pros) OPEN
- `docs/service/clutch-manual-profile-2026-08-09.md`, `g2-service-profile-2026-08-09.md`, `goodfirms-manual-profile-2026-08-15.md`

### C4 — AI-search answer readiness: q5 ground-truth re-verification still open

The `/audit` embedded artifact and q5 ground truth are mid re-verification. PR
#227 (controlled entity-and-offer re-run, merged) advanced the source, but the
follow-on re-runs PR #261 and q5 ground-truth drop PR #264 are still OPEN, so
the retired Agent Desk description in q5 may still be live in some surfacing.

Evidence:
- PR #261 OPEN (`evidence(ai-search): controlled entity-and-offer re-run … 2026-08-20`)
- PR #264 OPEN (`docs(evidence): re-verify q5 ground truth drop of retired Agent Desk … 2026-08-21`)
- PR #227 merged (`evidence(ai-search): controlled entity-and-offer re-run … 2026-08-15`)
- `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`, `public/offer.md` Answer Readiness section

### C5 — Study snapshot freshness: newest snapshot at the 4-day CI edge

The newest study snapshot is `2026-08-17.json`; today is 2026-08-21 — 4 days
old, exactly at the `MAX_SNAPSHOT_AGE_DAYS = 4` edge in the freshness guard.
The scan runs daily at 07:00 IST in a separate checkout; the snapshots are
imported into this repo by hand. A multi-day drift turns CI red and quietly
undermines the "refreshed daily" / "this number is today's" promise.

Evidence:
- `study/snapshots/2026-08-17.json` is the newest snapshot
- `scripts/test-study-freshness.mjs` (`MAX_SNAPSHOT_AGE_DAYS = 4`)
- `public/index.html`, `public/audit.html`, `public/pricing.html`, `public/specimen.html` `data-study` spans

## Rejected / dedup

- **node_modules / wrangler TODOs** — not product code; ignored.
- **`.agents/skills/speckit-*` placeholders** — tooling skill docs, not product; ignored.
- **The prior scout's COMMIT_EDITMSG echo** (line 14) — history, not a candidate.
- **Docs evidence re-verify PRs** (#263–#281) — verification receipts, not revenue work.
