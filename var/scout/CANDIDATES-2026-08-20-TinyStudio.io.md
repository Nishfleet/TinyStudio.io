# CANDIDATES — 2026-08-20 — TinyStudio.io

> **Input note (audit blocker).** The candidates file referenced by the scout
> run (`var/scout/CANDIDATES-2026-08-20-TinyStudio.io.md`) was the deterministic
> fleet-scout output at `/home/nish/fleet2/var/scout/CANDIDATES-2026-08-20-TinyStudio.io.md`.
> That file is mostly noise for this product: line 1 is a 1.6 MB `data.json` dump
> (a fleet pulse artifact that happens to live in this workspace's root and
> matched the TODO grep), and the remaining lines are `node_modules/wrangler`
> TODO comments. Neither is a product revenue candidate.
>
> Rather than audit noise, this file reconstructs the candidate set **directly
> from the product workspace**, with every item carrying a cited evidence source
> (file path, commit, or GitHub PR). It is the input the audit
> (`AUDIT-2026-08-20-TinyStudio.io.md`) ranked.

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

### C1 — Deploy lag: 8+ merged conversion-critical fixes on main are not live

The deployed Worker is at `b4d80f1c` (2026-08-17) but `main` HEAD is
`2e3d7a8`. At least eight merged PRs — including the six-a-month intake cap
fix (#245), the pricing-page signup form (#194), appraisal a11y labels (#154),
study refresh (#156), and canonical/JSON-LD cleanups (#218) — are on `main`
but not yet deployed. The intake-cap fix and the pricing form are
conversion-critical: the cap guards the scarcity promise that drives
requests, and the pricing form is the only in-page signup on the page that
states the price.

Evidence:
- `release-state-tinystudio-io.json` sha `b4d80f1c8736b59f75e07cb30a1fc7a3df078a01` (2026-08-17T17:39:07)
- `git log --oneline b4d80f1c..HEAD` shows 8+ commits including #245, #194, #154, #156, #218
- `docs/evidence/ai-search-evidence-lag-2026-08-12.md` documents the same deploy-lag pattern for PR #43
- `MEMORY.md` "Deploys are guarded by the machine-level `safe-deploy` wrapper"

### C2 — Google Ads conversion tracking: env-gated, active state unverified

The only funnel conversion measurement is the Google Ads conversion tag on
`/brief-requested`, injected by the worker from `GOOGLE_ADS_CONVERSION_ID` /
`GOOGLE_ADS_CONVERSION_LABEL` env secrets. With either value missing or
malformed, the page ships with no tag at all — zero conversion tracking. The
secrets are not in `wrangler.jsonc` (they are set via `wrangler secret put`),
so whether the tag is actually firing in production is unverified from the
repo side. Without conversion tracking, paid acquisition ROI is unmeasurable.

Evidence:
- `src/worker.js` lines 1428–1455 (`googleAdsConversionScript`, env-gated)
- `wrangler.jsonc` — no `GOOGLE_ADS_CONVERSION_ID` or `GOOGLE_ADS_CONVERSION_LABEL` vars
- `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md` — documents the dead-by-construction history and the env-driven fix
- `scripts/check-site.mjs` lines 788–800 — CI guard for placeholder tags

### C3 — Service directory profiles: 4 manual handoff PRs pending merge and submission

Four open PRs prepare truthful manual agency profiles for Clutch (#252), G2
(#253), GoodFirms (#254), and 50Pros (#262). These are inbound lead sources
for high-ticket service buyers searching for audit/appraisal providers. The
PRs are the copy-paste handoff docs; the actual manual submission on each
directory requires Nish's account and brand decision.

Evidence:
- PR #252 `docs(service): re-verify truthful manual Clutch profile handoff` (OPEN)
- PR #253 `docs(service): re-verify truthful manual G2 profile handoff` (OPEN)
- PR #254 `docs(service): re-verify truthful manual GoodFirms profile handoff` (OPEN)
- PR #262 `docs(service): prepare truthful manual 50Pros agency profile handoff` (OPEN)
- `docs/service/clutch-manual-profile-2026-08-09.md`
- `docs/service/g2-service-profile-2026-08-09.md`
- `docs/service/goodfirms-manual-profile-2026-08-15.md`

### C4 — AI-search answer readiness: entity/offer re-verification ongoing

The `/audit` page embeds a controlled AI-search evidence artifact that
teaches engines what tinystudio.io is (q5 ground truth). PR #227 advanced
`testedOn` to 2026-08-15 with the first Found transitions. Open PRs #261
and #264 continue the re-verification. AI search is a reading surface where
buyers get answers before they reach the site — if q5 still describes the
retired Agent Desk, the buyer never arrives.

Evidence:
- `docs/evidence/ai-search/2026-08-15-controlled-rerun.md` — first Found transitions
- PR #227 (merged) `evidence(ai-search): controlled entity-and-offer re-run with first Found transitions (2026-08-15)`
- PR #261 (OPEN) `evidence(ai-search): controlled entity-and-offer re-run with four Found runs (2026-08-20)`
- PR #264 (OPEN) `docs(evidence): re-verify q5 ground truth drop of retired Agent Desk on current main and live (2026-08-21)`
- `public/offer.md` "Answer Readiness: Preferred Source Pages" section

### C5 — Study snapshot freshness at the daily-refresh promise edge

The public pages promise "refreshed daily" and "this number is today's"
(`index.html`, `audit.html`, `pricing.html`, `specimen.html`). The newest
study snapshot is `2026-08-17.json` — 4 days old as of 2026-08-21, exactly
at the `MAX_SNAPSHOT_AGE_DAYS = 4` CI threshold. A stale study undermines
the audit's credibility with the high-ticket buyer who reads the numbers.

Evidence:
- `study/snapshots/2026-08-17.json` (newest)
- `scripts/test-study-freshness.mjs` `MAX_SNAPSHOT_AGE_DAYS = 4`
- PR #156 (merged) `fix(public): refresh the study figures to the 2026-08-12 scan and guard the daily-refresh promise`
- `public/audit.html` `data-study` spans rendered from snapshots

### C6 — Appraisal-to-desk upsell path has no mid-funnel nurture

The appraisal is free and email-gated; the desk is $2,500/mo. Between the
free audit delivery and the paid desk decision, there is no automated
mid-funnel surface (no sequence, no retargeting, no "your audit is ready"
desk-bridge email). Every appraisal recipient must self-navigate from the
audit to `/pricing` or `/agents`. This is the largest revenue-leak in the
funnel but it touches email/marketing automation which may need Nish's
brand voice decision.

Evidence:
- `public/agents.html` — desk page, CTA is "Request the appraisal" (top-of-funnel), no mid-funnel bridge
- `public/pricing.html` — price page, CTA is "Request the appraisal" (top-of-funnel)
- `src/worker.js` `/api/signups` — stores email + metadata, no downstream nurture trigger visible
- `docs/service/pilot-delivery-packet.md` — stage-gated pilot workflow, no automated nurture
