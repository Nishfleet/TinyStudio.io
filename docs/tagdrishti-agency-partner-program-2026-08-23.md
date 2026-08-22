# TinyStudio — competitive assessment: TagDrishti agency partner program

Date: 2026-08-23

Scope: `docs/tagdrishti-agency-partner-program-2026-08-23.md` — internal competitive-intelligence assessment. It records no ranking, traffic, lead, or revenue outcome. It is not marketing copy and is not published to the site. It does not edit the prior assessments `docs/continuous-monitoring-competitive-assessment-2026-08-22.md` (PR #296) or `docs/continuous-monitoring-competitive-assessment-expansion-2026-08-22.md` (PR #300); it cross-references them.

Item: 17c45c2150 — "TagDrishti ships an agency partner program (30% recurring, white-label, per-client status pag[e]" [unreviewed-by-opus]. Note the truncation: read as "per-client status page", confirmed against live wording below.

## What TagDrishti ships — the agency partner program

The URLs below were fetched live with `curl -L` on 2026-08-23. Both competitor pages returned HTTP 200 with no redirect. Quotes are verbatim contiguous text from the retrieved HTML. Inline `<em>` / `<span>` tags were stripped when extracting a visible sentence; those reconstructed sentences are described in prose and are not quoted as a single unit, because they are not one contiguous string in the saved body.

### Agency partner program page

- Stored/candidate URL: `https://www.tagdrishti.com/for-agencies`
- Effective URL after `curl -L`: `https://www.tagdrishti.com/for-agencies`
- HTTP status: `200`
- Page title (verbatim from `<title>`): `For Agencies: White-Label Tag Monitoring | TagDrishti`
- Verbatim quotes showing the agency partner program:
  - 30% recurring commission: "30% of every invoice, every month, for as long as the client stays subscribed." Trust line (full visible text node, including the leading hash character that is in the HTML): "# 30% recurring · no clawback · paid monthly via Paddle · 48-hour reply". Nav / eyebrow also labels the page "Agency Partner Program". Hero H1 wraps "30% recurring" in an emphasis span (class v6-h1-em); the contiguous fragments in the saved body are "Protect the retainer. Earn ", "30% recurring", and " while you do it."
  - White-label: "Your logo, your colours, your subdomain. Clients bookmark your URL, not ours, and never see TagDrishti branding. Available on Agency and Agency Plus." Hero body also contains the contiguous phrase "ship white-label audit PDFs". Nav item label: "Agency partner program" with sub-label "White-label, retainer-friendly". Feature-card H3 is `White-label <em>status page.</em>` (visible after stripping `<em>`: White-label status page.); that reconstructed title is not a single contiguous string in the saved body, so it is not quoted as one unit.
  - Per-client status page / white-label status page: the exact label "per-client status page" is **not** on this page. Closest live wording on this URL is the white-label status-page card quoted above, plus the meta description phrase "a client status page on your logo" (meta description).
- Drift from item's stored wording, if any: The three claimed features are present on TagDrishti, but the exact item label "per-client status page" is not on `/for-agencies`. This page's visible H3 (after stripping `<em>`) is White-label status page., and the meta description only has "a client status page on your logo". Commission copy matches "30% recurring" verbatim (trust line and Earn step). "white-label" appears verbatim in the nav sub-label and in "ship white-label audit PDFs". Pricing-tier counts and client-seat numbers appearing on the page were not independently verified as product facts and are omitted.

### Supporting page: solutions/agencies

- Stored/candidate URL: `https://www.tagdrishti.com/solutions/agencies`
- Effective URL after `curl -L`: `https://www.tagdrishti.com/solutions/agencies`
- HTTP status: `200`
- Page title (verbatim from `<title>`): `For Analytics Agencies Running 10+ Clients | TagDrishti`
- Verbatim quotes showing the agency partner program:
  - 30% recurring commission: "30% recurring share." Hero also contains "White-label PDFs, per-client status pages, 30% recurring revenue share if you resell."
  - White-label: "White-label PDFs, per-client status pages, 30% recurring revenue share if you resell."
  - Per-client status page (exact item label, source of claim 3): "Per-client status page, no login". Description of that feature: "Your logo, your colours, a secure link per account. No client login, no shared credentials, no confusion." Meta description (meta description): "White-label audit PDFs, per-client status pages, 30% recurring share".
- Drift from item's stored wording, if any: None flagged for the three claimed features. This page supplies the exact truncated item phrase as "per-client status page" (plan row "Per-client status page, no login"). The live hero uses the plural "per-client status pages" in the same sentence as "30% recurring revenue share". Client-seat / plan-size numbers on this page are omitted.

Item's stored wording for comparison (do not copy into the doc unless the live page contains it verbatim):
- 30% recurring
- white-label
- per-client status pag[e]  ← note truncation; judge resolved as "per-client status page"

Live pages do contain those three strings (with the third completed as "per-client status page" on `/solutions/agencies`).

## What TinyStudio sells (current, first-party)

Re-verified live with `curl -L` on 2026-08-23. All five surfaces returned HTTP 200.

- `https://tinystudio.io/` (HTTP 200, effective `https://tinystudio.io/`): "The free leak audit of high-ticket service homepages — and the desk that closes what the audit finds, with a person's name on every audit." Also: "The desk that closes findings runs at $2,500 a month, on a three-month minimum."
- `https://tinystudio.io/audit` (HTTP 200, effective `https://tinystudio.io/audit`): "Depth, not breadth. One day's record, signed by a person — not continuous monitoring."
- `https://tinystudio.io/pricing` (HTTP 200, effective `https://tinystudio.io/pricing`): The Growth Desk at "$2,500" "Per month · Three-month minimum".
- `https://tinystudio.io/offer.md` (HTTP 200, effective `https://tinystudio.io/offer.md`): "The Website Appraisal — the free leak audit of high-ticket service homepages — and the human-reviewed desk that closes what the audit finds."
- `https://tinystudio.io/llms.txt` (HTTP 200, effective `https://tinystudio.io/llms.txt`): Same offer facts as `offer.md` (free leak audit of high-ticket service homepages; human-reviewed desk). Price is pointed at `/pricing`, not restated in this file.

## Is the claim accurate?

YES. TagDrishti ships a live Agency Partner Program at `https://www.tagdrishti.com/for-agencies` (HTTP 200). All three item legs are backed by verbatim quotes from this run: "30% recurring" / "30% of every invoice, every month, for as long as the client stays subscribed."; white-label copy including "ship white-label audit PDFs" and "Your logo, your colours, your subdomain."; and the exact "per-client status page" label on `https://www.tagdrishti.com/solutions/agencies` ("Per-client status page, no login"). TinyStudio still sells a free leak audit plus a $2,500/mo three-month desk and does not ship an agency partner program, white-label offering, or per-client status page.

## Reserved decisions (NOT made here)

The following are Nish-reserved and were **not** done in this packet:
- Any TinyStudio product response (agency/reseller program, white-label offering, per-client reporting surface).
- Any change to pricing ($2,500/mo desk, free appraisal) or offer copy.
- Any change to site copy, positioning, public surfaces, or the seven specialists.
- Any competitive claim published to the live site.
- Any edit to the prior competitive-assessment docs.

This assessment supplies evidence only; it implements no response.

## Sources

- `https://www.tagdrishti.com/for-agencies` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://www.tagdrishti.com/solutions/agencies` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://tinystudio.io/` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://tinystudio.io/audit` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://tinystudio.io/pricing` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://tinystudio.io/offer.md` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `https://tinystudio.io/llms.txt` (fetched 2026-08-23, `curl -L` HTTP 200, effective URL unchanged)
- `docs/continuous-monitoring-competitive-assessment-2026-08-22.md` (PR #296; prior 3-competitor assessment, already merged, not edited)
- `docs/continuous-monitoring-competitive-assessment-expansion-2026-08-22.md` (PR #300; expansion adding TagDrishti retainer-audit monitoring, already merged, not edited)
