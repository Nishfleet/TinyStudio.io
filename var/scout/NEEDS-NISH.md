# NEEDS-NISH — 2026-08-21 — TinyStudio.io

Scout timestamp: 2026-08-21T02:32:22.659Z
Product: TinyStudio.io
Source: var/scout/CANDIDATES-2026-08-21-TinyStudio.io.md

These items require Nish's decision on pricing, brand, legal, or
product-direction grounds before the scout's survivors can proceed. They are
NOT dispatched to the worker fleet.

---

## 1. Mid-funnel nurture between free appraisal and paid desk [brand]

**Title:** No automated bridge exists between the free audit delivery and the $2,500/mo desk decision — every appraisal recipient must self-navigate to /pricing or /agents.

**Revenue impact:** HIGH — this is the largest revenue leak in the funnel.
The appraisal is free and email-gated; the desk is $2,500/month on a
three-month minimum. Between delivery and decision there is no sequence, no
retargeting, no "your audit is ready" desk-bridge email. Unchanged since the
2026-08-20 audit.

**Evidence:**
- `public/agents.html` — desk page CTA is "Request the appraisal" (top-of-funnel), no mid-funnel bridge
- `public/pricing.html` — price page CTA is "Request the appraisal" (top-of-funnel)
- `src/worker.js` `/api/signups` — stores email + metadata, no downstream nurture trigger visible
- `docs/service/pilot-delivery-packet.md` — stage-gated pilot workflow, no automated nurture

**Why Nish:** The nurture sequence copy, cadence, and brand voice are
brand and product-direction decisions. Any email automation that touches a
paying-buyer relationship must be approved by Nish — the review boundary in
`public/offer.md` states "Automation may prepare research, drafts, QA,
packages, and routing, but never autonomously sends, publishes, spends,
approves, accepts, or renews."

## 2. Manual submission of service directory profiles [brand]

**Title:** Submit the Clutch, G2, GoodFirms, and 50Pros agency profiles manually once the handoff PRs (#252, #253, #254, #262) are merged.

**Revenue impact:** MEDIUM-HIGH — these are inbound lead sources for
high-ticket service buyers searching for audit/appraisal providers. All four
PRs remain OPEN as of 2026-08-21.

**Evidence:**
- PR #252 `docs(service): re-verify truthful manual Clutch profile handoff` (OPEN)
- PR #253 `docs(service): re-verify truthful manual G2 profile handoff` (OPEN)
- PR #254 `docs(service): re-verify truthful manual GoodFirms profile handoff` (OPEN)
- PR #262 `docs(service): prepare truthful manual 50Pros agency profile handoff` (OPEN)
- `docs/service/clutch-manual-profile-2026-08-09.md` — manual submission runbook
- `docs/service/g2-service-profile-2026-08-09.md` — manual submission runbook
- `docs/service/goodfirms-manual-profile-2026-08-15.md` — manual submission runbook

**Why Nish:** Manual submission on third-party directories requires Nish's
account creation, identity verification, and brand positioning decisions.
The PRs are the copy-paste handoff docs (worker-dispatchable merge); the
actual submission is Nish's.

## 3. Google Ads conversion ID/LABEL secret configuration [credentials]

**Title:** Confirm `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL` are set as Worker secrets and the conversion tag is firing, or decide to leave funnel ROI unmeasured.

**Revenue impact:** HIGH — without conversion tracking, paid acquisition
ROI is unmeasurable.

**Evidence:**
- `src/worker.js` lines 1428–1480 — tag injected only when both env vars are well-formed
- `wrangler.jsonc` — no such vars (set via `wrangler secret put`)
- `docs/evidence/ads-conversion-placeholder-rereverify-2026-08-15-lane1.md` — dead-by-construction history

**Why Nish:** The Google Ads conversion ID/label are account credentials
tied to Nish's Google Ads account. Setting them via `wrangler secret put`
is a credential and account decision only Nish can make.

## Not applicable

- **pricing:** the desk price ($2,500/mo, three-month minimum) is set and
  stable; no pricing change surfaced in this audit.
- **legal:** no new legal/regulatory item beyond the existing review boundary
  and no-guarantees posture already enforced by `scripts/test-product-contract.mjs`.
- **delete:** no park/kill decision needed — the retired Agent Desk is already
  demoted and guarded by the product-contract test.
