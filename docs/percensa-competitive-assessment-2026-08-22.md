# TinyStudio — competitive assessment: Percensa (7-reviewer, $49)

Date: 2026-08-22
Scope: `docs/percensa-competitive-assessment-2026-08-22.md` — this file is an
internal competitive-intelligence assessment. It records no ranking, traffic,
lead, or revenue outcome. It is not marketing copy and is not published to the
site.

Item: 20d07458d0 — "Percensa ships a 7-reviewer model at $49 — a
structural quality innovation over TinyStudio's" [unreviewed-by-opus].

## What Percensa is and what it sells

Percensa is a one-time website review product from 11:11 Designs
(`1111designs.com`). The launch page
`https://1111designs.com/introducing-percensa-the-website-review-we-kept-doing-by-hand/`
(read 2026-08-22 via WebFetch; curl returned HTTP 403 / Cloudflare block)
states, verbatim: "Percensa reviews your website the way a sharp creative
director would, and gives you a private report showing what works, what
confuses people, and what to change first. One website, one complete review,
$49, no subscription. Reports are typically ready in about 20 to 40 minutes."

A separate purchase site exists and is reachable: `https://percensa.com/`
(HTTP 200, fetched 2026-08-22). Its homepage CTA is "Review my website — $49"
with proof chips "Ready in about 20–40 minutes" and "One-time $49", and the
closing line "One website. One complete review. No subscription." Pricing at
`https://percensa.com/pricing` (HTTP 200, 2026-08-22): "$49 / Pay once. Keep
the report." / "No subscription." Checkout starts at
`https://percensa.com/start` (HTTP 200, 2026-08-22): "Website review / $49".

The seven-reviewer structure, verbatim from the 11:11 launch page (read
2026-08-22): "A creative director, a brand and positioning specialist, a UX
reviewer, a behavioral analyst, a copy and messaging expert, a visual
designer, and a conversion specialist each review the same captured evidence
separately, without seeing each other’s conclusions."

The same launch page states why independence is the signal: "When seven
reviewers working alone all circle the same paragraph, that is a signal. When
one reviewer flags something the other six walked past, that is worth
examining rather than averaging away."

The purchase site restates the same structure in public labels (fetched
2026-08-22 from `https://percensa.com/`): Creative direction; Brand &
positioning; User experience; Visitor behavior; Copy & messaging; Visual
design; Sales & conversion. Method page
(`https://percensa.com/method`, HTTP 200): "Get seven independent reviews /
Specialists in brand, copy, design, UX, behavior, creative direction, and
conversion review the same evidence separately."

Percensa's own positioning, verbatim from the launch page (read 2026-08-22):
"A review is a diagnosis, not a treatment. Knowing that your offer is unclear
above the fold does not rewrite it, and knowing your proof is in the wrong
place does not rebuild the page." FAQ (`https://percensa.com/faq`, HTTP 200,
2026-08-22): "Will you redesign my website? No. We show you what to keep, what
to change, why it matters, and what to do first."

## What TinyStudio sells (current, first-party)

Re-verified live with `curl -L` on 2026-08-22. All five surfaces returned
HTTP 200.

The appraisal (`https://tinystudio.io/`, HTTP 200): "The free leak audit of
high-ticket service homepages." Intake copy: "Thirty seconds to ask. Findings
inside five working days. No call at any point. Six a month. When the sixth is
taken, the intake closes until the next." "Complimentary And yours to keep."
`https://tinystudio.io/offer.md` and `https://tinystudio.io/llms.txt` (both
HTTP 200) match: "The Website Appraisal — the free leak audit of high-ticket
service homepages" / "The audit is free and yours to keep" / "Six appraisals a
month, done by hand."

The Growth Desk (`https://tinystudio.io/pricing`, HTTP 200): "$2,500 / Per
month · Three-month minimum." Month one: "The appraisal, then your most
valuable page rewritten or rebuilt" and "A dev-ready handoff if your own team
ships it." Months two and three: "weekly checks, one revision, and tracking
that says whether the fix held." Homepage (`https://tinystudio.io/`, HTTP 200)
states the same desk price: "The desk that closes findings runs at $2,500 a
month, on a three-month minimum."

The seven specialists (`https://tinystudio.io/agents`, HTTP 200): Landing Page
Fixer, Product Page Fixer, Site Architecture Fixer, Ad Angle Generator,
Competitor Watcher, Email & SMS Generator, Weekly Performance Analyst. Page
copy, verbatim: "Each one does a single job and nothing else." This is a
pipeline of specialists — each has one job, a defined input list, and a
checklist — not seven independent reviewers of the same captured evidence.

Human signature (`https://tinystudio.io/pricing`, HTTP 200), verbatim: "Seven
specialist agents behind it, a person signing every client-facing output" and
"Automation never sends, publishes, spends or approves." `offer.md` /
`llms.txt` (HTTP 200): "run by Nish, who signs every audit" and "never
autonomously sends, publishes, spends, approves, accepts, or renews."

## Is the "structural quality innovation" claim accurate?

The two structures are not the same thing with different branding.

- Percensa = 7 independent reviewers of the **same** captured evidence.
  Independent convergence is the signal: seven flagging the same thing
  independently is strong; one flagging what six missed is worth examining,
  not averaged away. Percensa says this in its own launch copy (cited above,
  2026-08-22).
- TinyStudio = 7 specialists in a **pipeline**, each one job. Specialization
  and division of labour, not independent convergence. TinyStudio says this
  on `/agents` (cited above, 2026-08-22): "Each one does a single job and
  nothing else."

Verdict: the independent-convergence structure **is** a genuine
methodological difference from TinyStudio's pipeline. On the narrow question
"is the 7-independent-reviewer structure a structural quality innovation over
a 7-specialist-pipeline for the **diagnosis** step", the answer is **yes** —
independent convergence catches both consensus and outliers in a way a
pipeline does not.

But the scope limit is equally factual. Percensa is diagnosis-only ("A review
is a diagnosis, not a treatment"; it does not rewrite or rebuild the page).
TinyStudio's desk includes **treatment**: the most valuable page rewritten or
rebuilt, a dev-ready handoff, and a three-month holding loop of weekly
checks, one revision, and tracking. The two are not substitutes at the same
stage of the buyer journey. Percensa is a $49 one-shot diagnosis you can buy
without a relationship. TinyStudio is a free diagnosis (the appraisal) plus
an optional $2,500/month, three-month treatment desk.

## TinyStudio's defensible differentiation (facts only, no new claims)

Grounded in TinyStudio's own live copy, fetched 2026-08-22:

- Treatment, not diagnosis only. Pricing (`https://tinystudio.io/pricing`):
  month one rewrites or rebuilds the most valuable page and ships a
  dev-ready handoff; months two and three are weekly checks, one revision,
  and tracking. Percensa's FAQ states it will not redesign the site.
- A human signs every client-facing output. Pricing, verbatim: "a person
  signing every client-facing output"; "Automation never sends, publishes,
  spends or approves."
- Free appraisal first. Homepage and `offer.md`: the leak audit is free and
  yours to keep; the desk is a later decision.
- Six-a-month scarcity with a written delivery guarantee. Pricing,
  verbatim: "If the month-one deliverables are not in your hands within
  fourteen working days of Day 0, month one is refunded in full." Percensa's
  public copy on `/pricing`, `/faq`, and `/terms` (all HTTP 200, 2026-08-22)
  contains no fourteen-working-day delivery-or-refund term. What it does
  publish is a different refund: if Percensa cannot access enough of the
  site to produce a useful report, it stops and refunds; completed critiques
  are "generally non-refundable" (`https://percensa.com/terms`, 2026-08-22).
  That is not the same guarantee.

## Reserved decisions (NOT made here)

The following are Nish-reserved and were **not** done in this packet:

- Any change to pricing ($2,500/mo, three-month minimum, free appraisal).
- Any change to the product structure (adopting an independent-reviewer
  model, adding a $49 tier, changing the seven specialists).
- Any change to site copy, positioning, or the agents/pricing/homepage pages.
- Any competitive claim published to the live site.

These are product-direction and brand decisions reserved to Nish. This
assessment supplies the evidence; it does not implement a response.

## Sources

- `https://1111designs.com/introducing-percensa-the-website-review-we-kept-doing-by-hand/`
  (2026-08-22). Canonical launch/offer page. `curl -L` HTTP 403 (Cloudflare).
  Camoufox session also blocked. Full page body retrieved via WebFetch the
  same day; web-search snippets for the same URL/date independently match
  the $49 / one website / no subscription / 20–40 minutes / seven-reviewer
  list / "diagnosis, not a treatment" wording quoted above. Parent: 11:11
  Designs.
- `https://percensa.com/` (2026-08-22, `curl -L` HTTP 200). Purchase/product
  homepage: $49 one-time, 20–40 minutes, seven independent reviewers, no
  subscription. `www.percensa.com` 301/resolves to the same origin.
- `https://percensa.com/pricing` (2026-08-22, HTTP 200). $49 pay-once; $199
  five-report pack; no subscription; refund only if the site cannot be
  accessed enough to produce a useful report. No fourteen-working-day
  delivery guarantee.
- `https://percensa.com/faq` (2026-08-22, HTTP 200). Will not redesign;
  20–40 minutes; refund if the site cannot be accessed.
- `https://percensa.com/method` (2026-08-22, HTTP 200). Seven independent
  reviews of the same evidence.
- `https://percensa.com/start` (2026-08-22, HTTP 200). Checkout: "Website
  review / $49"; Stripe; seven specialist labels.
- `https://percensa.com/terms` (2026-08-22, HTTP 200). Beta terms / August
  2026. Access-failure refund; completed critiques generally non-refundable;
  findings are "not guarantees of performance".
- `https://tinystudio.io/` (2026-08-22, `curl -L` HTTP 200). Free leak audit;
  findings inside five working days; six a month; yours to keep; desk
  $2,500/mo three-month minimum.
- `https://tinystudio.io/pricing` (2026-08-22, `curl -L` HTTP 200). Growth
  Desk $2,500/mo, three-month minimum; month-one rewrite/rebuild + handoff;
  months two–three loop; fourteen-working-day delivery guarantee; "a person
  signing every client-facing output"; "Automation never sends, publishes,
  spends or approves."
- `https://tinystudio.io/agents` (2026-08-22, `curl -L` HTTP 200). Seven
  named specialists; "Each one does a single job and nothing else."
- `https://tinystudio.io/offer.md` (2026-08-22, `curl -L` HTTP 200).
  First-party offer mirror: free leak audit, six appraisals a month, human
  signature, no autonomous send/publish/spend/approve.
- `https://tinystudio.io/llms.txt` (2026-08-22, `curl -L` HTTP 200). Same
  offer facts as `offer.md`.
