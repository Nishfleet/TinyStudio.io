# TinyStudio — competitive assessment: continuous monitoring parity

Date: 2026-08-22
Scope: `docs/continuous-monitoring-competitive-assessment-2026-08-22.md` — this file is an
internal competitive-intelligence assessment. It records no ranking, traffic,
lead, or revenue outcome. It is not marketing copy and is not published to the
site.

Item: 528ec27d0d — "Continuous monitoring is now standard — TinyStudio's
one-off audit + 3-month desk has no continuous monitoring, while competitors
ship 'flag issues within hours' and 'monthly Share of Model tracking'"
[unreviewed-by-opus].

## What the competitors ship

Three named competitors sell continuous monitoring as a standard feature of
the paid offer. Each URL below was fetched live with `curl -L` on 2026-08-22.
All three product pages returned HTTP 200. Quotes are verbatim from the
retrieved HTML.

### OnyxRank

`https://onyxrank.com/services/technical-seo` (HTTP 200, fetched 2026-08-22).
Title: "Technical SEO Service: 50-Factor Audit Plus Continuous Monitoring |
OnyxRank".

Hero, verbatim: "Continuous technical SEO monitoring covering 50+ factors.
Schema markup, Core Web Vitals, crawl efficiency, and site architecture
optimization shipped as implementation, not audit-and-handoff."

Section heading "Continuous, Not Quarterly", verbatim: "We monitor
continuously and flag issues within hours, not in monthly reports."

Continuous-monitoring agent, verbatim: "We stand up automated checks that
re-run inside 24 hours of any deploy and inside one hour of any indexation
drop." The item's stored wording used "within one hour"; the live page on
2026-08-22 says "inside one hour". The rest of the sentence matches.

Implementation close, verbatim: "No issues stay open in 'recommended but not
implemented' status."

OnyxRank's own comparison table on the same page prices this model at
"$2,500/mo" with "Continuous monitoring plus implementation, senior
strategist included".

### BrightIQ

`https://brightiq.solutions/services/monthly-retainer/` (HTTP 200, fetched
2026-08-22). Title: "Full Monthly SEO Retainer, Managed SEO Service for
Agencies".

Hero, verbatim: "Monthly strategy calls keep you aligned. Quarterly
deep-dive audits reset priorities. A dedicated Slack channel means you're
never waiting on email."

Included-each-month table, verbatim labels:

- "Monthly Re-Crawl + Report"
- "Monthly Share of Model" immediately followed by "tracking, ChatGPT,
  Perplexity, Gemini, Claude" (the item's stored phrase "Monthly Share of
  Model tracking, ChatGPT, Perplexity, Gemini, Claude" is this row, split
  across two HTML fragments; both fragments are on the live page)
- "Quarterly deep-dive audit resets 90-day priorities"
- "Dedicated Slack channel, no email delays"

JSON-LD FAQ on the same page restates the same package: "AI visibility
monitoring with monthly Share of Model tracking, quarterly deep-dive audit,
monthly strategy calls, and a dedicated Slack channel."

### Mod Op GEO

`https://geo.modop.ai` (HTTP 200, fetched 2026-08-22; effective URL
`https://geo.modop.ai/`). Title: "AI Search Visibility Audit: Free GEO Tool
| Mod Op GEO". Launched 2026-08-13 per the item and the same-day press
release.

Free audit, verbatim: "Start FREE audit →"; "No credit card. No sign-up.
Results in minutes." Body: "Get an in-depth analysis of your current AI
visibility across major platforms." Platforms named on the page: ChatGPT,
Perplexity, Google, Claude, Copilot, "And more".

The item's stored phrase "The GEO 50" is **not** on `geo.modop.ai`. A
`grep` of the 2026-08-22 `curl -L` body for that string returns no hit.
What the product page does ship, verbatim:

- "The 25 elements AI weighs before it cites your brand."
- "Read the full framework: The GEO Periodic Table"
- Paid-engagement line "Monthly Visibility Reports": "Monitor how your
  brand's AI presence changes over time with prompt-level tracking."
- "Ongoing Optimization": "New models. Algorithm updates. We stay at the
  forefront of change to keep your strategy fresh and continuously
  improving."

The item's paraphrase "continuous benchmarking across AI engines" is
therefore **not** a live verbatim quote on `geo.modop.ai`. The closest live
verbatim is the monthly visibility-report line above, plus the free audit's
competitor comparison ("How you stack against competitors").

"The GEO 50" **does** exist as a separate Mod Op page, fetched the same day:
`https://www.modop.com/geo-50-benchmark/` (HTTP 200, 2026-08-22; `modop.com`
301/resolves to `www.modop.com`). Verbatim: "Benchmarking how 50 major
brands show up in AI search — scored, ranked, and broken out by category
across ChatGPT, Claude, and Perplexity" / heading "The GEO 50" / "We
audited 50 major brands across eight categories". That is a published
snapshot/leaderboard, not a line on the `geo.modop.ai` product page.

## What TinyStudio sells (current, first-party)

Re-verified live with `curl -L` on 2026-08-22. All five surfaces returned
HTTP 200.

The appraisal (`https://tinystudio.io/`, HTTP 200): "The free leak audit of
high-ticket service homepages." Intake copy: "Thirty seconds to ask.
Findings inside five working days. No call at any point." "Six a month.
When the sixth is taken, the intake closes until the next." Stat chips:
"Complimentary" / "And yours to keep". Desk price on the same page: "The
desk that closes findings runs at $2,500 a month, on a three-month
minimum."

The audit method (`https://tinystudio.io/audit`, HTTP 200): one-off
AI-search panel. Depth-not-breadth framing, verbatim: "This is not a GEO
dashboard. It is not a weekly score across dozens of engines. Free
automated platforms do that; we do not. We run a named, dated,
human-labelled test of the questions a buyer actually asks, with the
verbatim answers and cited pages on the page. Depth, not breadth. One day's
record, signed by a person — not continuous monitoring."

The Growth Desk (`https://tinystudio.io/pricing`, HTTP 200): "$2,500" /
"Per month · Three-month minimum." Month one: "The appraisal, then your
most valuable page rewritten or rebuilt" and "A dev-ready handoff if your
own team ships it." Months two and three: "weekly checks, one revision, and
tracking that says whether the fix held." Delivery guarantee, verbatim:
"If the month-one deliverables are not in your hands within fourteen
working days of Day 0, month one is refunded in full." Human signature,
verbatim: "a person signing every client-facing output" and "Automation
never sends, publishes, spends or approves."

`https://tinystudio.io/offer.md` and `https://tinystudio.io/llms.txt` (both
HTTP 200) match first-party offer truth: "The Website Appraisal — the free
leak audit of high-ticket service homepages" / "The audit is free and yours
to keep" / "Six appraisals a month, done by hand." Desk: "month one
corrects the costliest fault; months two and three build the loop that
keeps the standard up." Human boundary: "never autonomously sends,
publishes, spends, approves, accepts, or renews." Neither file describes
continuous monitoring, a dashboard, or an always-on check.

## The existing positioning against continuous monitoring

The live site already states, in public copy, that TinyStudio is **not**
continuous monitoring. This is not inferred; it is on the page.

`public/audit.html` line 118, verbatim (matches live `/audit` HTTP 200,
2026-08-22): "This is not a GEO dashboard. It is not a weekly score across
dozens of engines. Free automated platforms do that; we do not. We run a
named, dated, human-labelled test of the questions a buyer actually asks,
with the verbatim answers and cited pages on the page. Depth, not breadth.
One day's record, signed by a person — not continuous monitoring."

`public/msp.html` lines 106–107, verbatim heading and body: heading
`"24/7 monitoring" as the whole story`; body "A feature list is not a
reason to switch. The appraisal checks whether the page makes the case for
moving — or just describes what you run." This is MSP-buyer leak copy, not
a product claim that TinyStudio itself monitors 24/7. It treats "24/7
monitoring" as a weak homepage story on MSP sites.

The `/audit` AI-search panel was introduced by PR #15 (per the item's own
evidence). The depth-not-breadth distinction was reinforced by the GEO
depth-not-breadth work: commit `d70811d`, PR #293,
`fix/geo-audit-depth-not-breadth-lane1` (on this worktree's `origin/main`
as of 2026-08-22).

Observation, not a decision: option (b) from the item's "Done when" —
"position the 3-month desk as 'deep focused work, not shallow monitoring'"
— is ALREADY partially implemented on the live public surfaces (`/audit`,
`/msp`). Nish has not formally chosen (b). This file does not treat that
partial live copy as a closed product-direction decision.

## Is the parity claim accurate?

YES, factually: TinyStudio ships no continuous monitoring. The audit is a
one-off snapshot ("One day's record"). The desk is a fixed three-month
engagement with weekly checks in months two–three, not ongoing monitoring
after the term. Three competitors ship continuous monitoring as standard
(OnyxRank: hours-scale technical flags; BrightIQ: monthly re-crawl + Share
of Model; Mod Op GEO: monthly visibility reports with prompt-level
tracking, plus a published GEO 50 snapshot on a separate URL).

BUT the site has already made a deliberate positioning choice to NOT be
continuous monitoring and to frame depth + human signature as the
differentiator. So the "parity gap" is not unaddressed — it is addressed
via positioning (option b), not via adding monitoring (option a). Whether
that positioning is sufficient is Nish's call.

## TinyStudio's defensible differentiation (facts only, no new claims)

Grounded in TinyStudio's own live copy, fetched 2026-08-22:

- Depth over monitoring. `/audit`: one named, dated, human-labelled test,
  signed by a person — "not continuous monitoring."
- Treatment, not diagnosis only. `/pricing`: month one rewrites or rebuilds
  the most valuable page and ships a dev-ready handoff; months two and
  three are weekly checks, one revision, and tracking. (None of the three
  competitors cited claim to rewrite/rebuild the money page as the core of
  the engagement. OnyxRank ships technical-SEO implementation; BrightIQ
  rewrites metadata and tracks Share of Model; Mod Op GEO audits and
  reports AI visibility.)
- A human signs every client-facing output. `/pricing`, verbatim: "a
  person signing every client-facing output"; "Automation never sends,
  publishes, spends or approves."
- Free appraisal first. Homepage and `offer.md`: the leak audit is free
  and yours to keep; the desk is a later decision.
- Six-a-month scarcity with a fourteen-working-day delivery-or-refund
  guarantee (`/pricing`).

## The north-star "always-on infrastructure" claim

The item says the north star names "always-on infrastructure" as a
"prompt-inimitable wedge". That north-star language is NOT in this repo.
Per `MEMORY.md`, the Growth Brain operating repo lives at
`/Users/nish/Documents/TINY STUDIO` (Nish's Mac, not this VPS, not this
repo). A grep of this worktree for "always-on", "north star", and
"prompt-inimitable" returns ZERO hits (re-verified 2026-08-22 during this
assessment). So the claim could not be verified here; it is referenced as
the item states it, and any reconciliation of the north-star wording
against the product is Nish-reserved and out of scope for this repo.

## Reserved decisions (NOT made here)

The following are Nish-reserved and were **not** done in this packet:

- (a) Add a continuous monitoring dimension to the desk (direction change,
  needs ack — E2's territory: the weekly growth desk history loop).
- (b) Position the 3-month desk as "deep focused work, not shallow
  monitoring" (positioning shift) — NOTE: already partially live on
  `/audit` and `/msp`; Nish decides whether to confirm/extend it.
- (c) Accept the parity risk.

No changes to public surfaces, pricing, positioning, or product structure
were made in this packet. These are product-direction and brand decisions
reserved to Nish. This assessment supplies the evidence; it does not
implement a response.

## Sources

- `https://onyxrank.com/services/technical-seo` (2026-08-22, `curl -L`
  HTTP 200). Continuous technical SEO monitoring covering 50+ factors;
  "flag issues within hours, not in monthly reports"; automated checks
  re-run inside 24 hours of any deploy and inside one hour of any
  indexation drop; "No issues stay open in 'recommended but not
  implemented' status."
- `https://brightiq.solutions/services/monthly-retainer/` (2026-08-22,
  `curl -L` HTTP 200). "Monthly Re-Crawl + Report"; Monthly Share of Model
  tracking across ChatGPT, Perplexity, Gemini, Claude; "Quarterly
  deep-dive audits reset priorities"; "Dedicated Slack channel".
- `https://geo.modop.ai` (2026-08-22, `curl -L` HTTP 200). Free AI Search
  Visibility Audit. "The GEO 50" is **not** on this page. Live copy:
  25-element GEO Periodic Table; "Monthly Visibility Reports" with
  prompt-level tracking; "continuously improving."
- `https://www.modop.com/geo-50-benchmark/` (2026-08-22, `curl -L` HTTP
  200). Separate Mod Op page that does publish "The GEO 50": benchmarking
  50 major brands across ChatGPT, Claude, and Perplexity. Fallback for the
  GEO 50 name after it was absent from `geo.modop.ai`.
- `https://tinystudio.io/` (2026-08-22, `curl -L` HTTP 200). Free leak
  audit; findings inside five working days; six a month; yours to keep;
  desk $2,500/mo three-month minimum.
- `https://tinystudio.io/audit` (2026-08-22, `curl -L` HTTP 200). One-off
  AI-search panel; "not continuous monitoring"; depth, not breadth.
- `https://tinystudio.io/pricing` (2026-08-22, `curl -L` HTTP 200). Growth
  Desk $2,500/mo, three-month minimum; month-one rewrite/rebuild +
  handoff; months two–three weekly checks; fourteen-working-day delivery
  guarantee; "a person signing every client-facing output"; "Automation
  never sends, publishes, spends or approves."
- `https://tinystudio.io/offer.md` (2026-08-22, `curl -L` HTTP 200).
  First-party offer mirror: free leak audit, six appraisals a month, human
  signature, no autonomous send/publish/spend/approve. No continuous
  monitoring.
- `https://tinystudio.io/llms.txt` (2026-08-22, `curl -L` HTTP 200). Same
  offer facts as `offer.md`.
- `public/audit.html:118` (this worktree, 2026-08-22). Live `/audit`
  source of the "not continuous monitoring" sentence.
- `public/msp.html:106-107` (this worktree, 2026-08-22). '"24/7
  monitoring" as the whole story'.
