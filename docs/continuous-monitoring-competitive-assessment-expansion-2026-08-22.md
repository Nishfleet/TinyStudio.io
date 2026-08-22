# TinyStudio — competitive assessment: continuous monitoring parity (expansion)

Date: 2026-08-22
Scope: `docs/continuous-monitoring-competitive-assessment-expansion-2026-08-22.md` — internal competitive-intelligence expansion. This file does not replace the prior 3-competitor assessment in `docs/continuous-monitoring-competitive-assessment-2026-08-22.md` (PR #296); it adds three new competitors and updates the count to 6+.

Item: 2b721f168e — "Continuous monitoring is now standard (expansion) — E11 Group, GrowthLimit, and TagDrishti join OnyxRank/BrightIQ/Mod Op GEO, bringing the count to 6+ competitors shipping ongoing monitoring" [unreviewed-by-opus].

## What the competitors ship — the three new additions

The URLs below must be fetched live with `curl -L` on 2026-08-22. All three product pages must return HTTP 200. Quotes are verbatim from the retrieved HTML. Record the effective (post-redirect) URL when `curl -L` follows a 301/308.

### E11 Group

- Stored URL from the backlog item: `https://e11group.com/services/performance-monitoring/`
- Effective URL after `curl -L`: `https://e11group.com/services/performance-monitoring/`
- HTTP status: `200`
- Page title (verbatim from `<title>`): `Performance Monitoring | E11 Group`
- Verbatim quotes showing continuous monitoring as a standard paid feature:
  - "Ongoing automated monitoring and performance refinement that catches problems before your visitors do."
  - "Automated scans run continuously. Issues are identified, prioritized by impact, and approved fixes are implemented within your included monthly capacity — so your site improves without extra effort from you."
- Drift from item's stored wording, if any: First stored sentence is verbatim on the live page. Second stored sentence is close but not identical: live copy says "included monthly capacity" (plus the trailing clause above) rather than "included capacity". "Monthly Health Report" is live, covering "Core Web Vitals trends, issues resolved, and prioritized recommendations."

Item's stored wording for comparison (do not copy into the doc unless the live page contains it verbatim):
- "Ongoing automated monitoring and performance refinement that catches problems before your visitors do"
- "Automated scans run continuously. Issues are identified, prioritized by impact, and approved fixes are implemented within your included capacity"
- monthly health report with trends

### GrowthLimit

- Stored URL from the backlog item: `https://growthlimit.com/service-technical-seo`
- Effective URL after `curl -L`: `https://www.growthlimit.com/service-technical-seo`
- HTTP status: `200`
- Page title (verbatim from `<title>`): `Technical SEO for Investor-Market Surfaces | Growth Limit`
- Verbatim quotes showing continuous monitoring as a standard paid feature:
  - "Indexation and Conversion Monitoring" / "Monitor crawl, rendering, indexed samples, template regressions, and qualified conversion paths."
  - "Compare before and after crawls, logs, Search Console, rendered HTML, Core Web Vitals, indexed samples, and qualified conversion paths for the approved surfaces changed."
- Drift from item's stored wording, if any: The stored phrase "Ongoing crawl monitoring, regression alerts, and quarterly health reviews" does **not** appear in the `curl -L` body. Closest live wording is the Indexation and Conversion Monitoring step above (crawl + template regressions; no "regression alerts" and no "quarterly health reviews"). "post-migration monitoring" is live under Inventory, Market, and Platform Migrations. The stored "a single monthly retainer covering 10 services" is not verbatim; the live page labels Technical SEO as "Service 02 / 10" and says "When selected in the signed scope, this work is delivered within the monthly retainer."

Item's stored wording for comparison:
- "Ongoing crawl monitoring, regression alerts, and quarterly health reviews"
- a single monthly retainer covering 10 services

Note from the judge's live probe (2026-08-22): the stored quote does not appear in the `curl -L` body for the stored URL. The live page contains phrases such as "Indexation and Conversion Monitoring", "post-migration monitoring", and "Compare before and after crawls". Quote what is actually on the page and explicitly flag the drift.

### TagDrishti

- Stored URL from the backlog item: `https://tagdrishti.com/retainer-audit`
- Effective URL after `curl -L`: `https://www.tagdrishti.com/retainer-audit`
- HTTP status: `200`
- Page title (verbatim from `<title>`): `Retainer Audit: 57 Checks for Agencies | TagDrishti`
- Verbatim quotes showing continuous monitoring as a standard paid feature:
  - "30 days of real-time monitoring on the audited site so the next bug surfaces in Slack before it surfaces at the QBR."
  - "Slack alerts to your team the moment anything breaks. Monday digest."
- Drift from item's stored wording, if any: None flagged. Both stored monitoring sentences appear verbatim on the live retainer-audit page. A nearby feature block also says "Slack alerts on the audited site the minute a tag fails, mis-fires, or an unknown script appears. Weekly Monday digest." Pricing-tier counts were not independently verified from this page and are omitted.

Item's stored wording for comparison:
- "30 days of real-time monitoring on the audited site so the next bug surfaces in Slack before it surfaces at the QBR"
- "Slack alerts to your team the moment anything breaks. Monday digest"
- 7 pricing tiers from $99/mo to $3,999/mo

Do not include the pricing-tier count unless you independently fetch and verify it from a live pricing page. The retainer-audit page is the required source for the monitoring claim.

## What TinyStudio sells (current, first-party)

Re-verified live with `curl -L` on 2026-08-22. All five surfaces must return HTTP 200.

- `https://tinystudio.io/` (HTTP 200): The Website Appraisal — free leak audit of high-ticket service homepages; findings inside five working days; six a month. No continuous monitoring.
- `https://tinystudio.io/audit` (HTTP 200): One-off AI-search panel. Verbatim from live `/audit` (matches `public/audit.html:118`): "This is not a GEO dashboard. It is not a weekly score across dozens of engines. Free automated platforms do that; we do not. We run a named, dated, human-labelled test of the questions a buyer actually asks, with the verbatim answers and cited pages on the page. Depth, not breadth. One day's record, signed by a person — not continuous monitoring."
- `https://tinystudio.io/pricing` (HTTP 200): Growth Desk at one price, three-month minimum; month one rewrite/rebuild; months two and three weekly checks. No continuous monitoring.
- `https://tinystudio.io/offer.md` (HTTP 200): First-party offer mirror — free leak audit plus the human-reviewed desk that closes what the audit finds. No continuous monitoring.
- `https://tinystudio.io/llms.txt` (HTTP 200): Same offer facts as `offer.md`. No continuous monitoring.

## Is the parity claim accurate?

YES. Six named competitors now ship continuous monitoring as a standard feature (OnyxRank/BrightIQ/Mod Op GEO per the prior assessment; E11 Group, GrowthLimit, TagDrishti added here). TinyStudio still ships a one-off free leak audit and a fixed three-month human-reviewed desk; it does not ship continuous monitoring.

The existing positioning in `public/audit.html:118` already states that TinyStudio is "not continuous monitoring" and frames the offer as "Depth, not breadth. One day's record, signed by a person." This is a positioning answer to the parity gap, not a product change.

## Reserved decisions (NOT made here)

The following are Nish-reserved and must **not** be implemented in this packet:

- (a) Add a continuous monitoring dimension to the desk (direction change; needs Nish ack).
- (b) Position the 3-month desk as "deep focused work, not shallow monitoring" (positioning shift).
- (c) Accept the parity risk.

No changes to `public/`, `src/`, pricing, positioning, or product structure were made. The doc supplies evidence only.

## Sources

- `https://e11group.com/services/performance-monitoring/` (fetched 2026-08-22, `curl -L` HTTP 200)
- `https://growthlimit.com/service-technical-seo` (fetched 2026-08-22, `curl -L` HTTP 200; follow redirects to effective `www.` URL)
- `https://tagdrishti.com/retainer-audit` (fetched 2026-08-22, `curl -L` HTTP 200; follow redirects to effective `www.` URL)
- `https://tinystudio.io/` (fetched 2026-08-22, `curl -L` HTTP 200)
- `https://tinystudio.io/audit` (fetched 2026-08-22, `curl -L` HTTP 200)
- `https://tinystudio.io/pricing` (fetched 2026-08-22, `curl -L` HTTP 200)
- `https://tinystudio.io/offer.md` (fetched 2026-08-22, `curl -L` HTTP 200)
- `https://tinystudio.io/llms.txt` (fetched 2026-08-22, `curl -L` HTTP 200)
- `docs/continuous-monitoring-competitive-assessment-2026-08-22.md` (prior 3-competitor assessment, already merged, not edited)
