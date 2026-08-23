# TinyStudio — truthful manual TinyAudits profile: prepared handoff

Date: 2026-08-23
Scope: `docs/service/tinyaudits-manual-profile-2026-08-23.md` — the prepared,
copy-paste content, field-by-field truthfulness map, and manual submission
runbook for a TinyAudits listing for TinyStudio, the human-reviewed Website
Appraisal. Internal operator document. Do not publish this file as marketing
copy; it is a handoff, not an offer. The submission is a human action by Nish;
nothing here automates, creates, submits, or pays for a profile.

## Why this handoff exists

The backlog item identifies TinyAudits at `https://tinyaudits.com` as a curated
directory of 100+ audit tools and services where TinyStudio is absent.
`https://index.dodopayments.com/tinyaudits` is the Dodo Payments Index's
third-party profile *about* TinyAudits (not the submission venue). That page
links out with `[Visit TinyAudits](https://tinyaudits.com?utm_source=index.dodopayments.com)`.
It is corroboration only; do not submit to the Dodo Payments Index.

Reachability log (scripted GET fetches, 2026-08-23; all HTTP 200 unless noted):

- Homepage (`https://tinyaudits.com/`): "Browse a curated directory of
  specialized audit services and tools"; "Curated Audits Only — We manually
  vet every tool and service provider listing"; "Audits by Real Humans — No
  generic, automated AI generator printouts" (aligns with TinyStudio's
  "reviewed by a person, not autonomous software").
- Submit form (`https://tinyaudits.com/audits/new`): five Submission Criteria
  bullets — (1) Clear & Fixed Scope; (2) 1:1 Consultation Availability
  ("You must provide an optional path for a live 1:1 strategic review
  session. Buyers should be able to book you..."); (3) No Sales Call Required;
  (4) Standalone Action Items ("...could technically take to any
  developer..."); (5) Honest Offer Pricing. Then: "**$29 one-time fee**";
  "Manual review completed within 48 hours."; form fields `Audit URL`
  ("Where should users go to start learn more about your audit?") and
  `Your Email Address` ("For submission status and editorial updates
  only."); button `Confirm Submission`.
- Provider funnel (`https://tinyaudits.com/submit`): "List Your Audit Free
  →" (`href="/users/sign_up"`); "100% Free Listing Status Open"; "Keep
  every single dollar you clear"; "Become a Provider →" (`href="/users/sign_up"`).
- About (`https://tinyaudits.com/about`): two-sided marketplace copy —
  "For Industry Experts ... List specialized diagnostic profiles".
- Contact: `team@tinyaudits.com` (`mailto:team@tinyaudits.com`, homepage
  footer "Contact Support").
- Dodo corroboration (`https://index.dodopayments.com/tinyaudits`): "Visit
  TinyAudits" outbound link to
  `https://tinyaudits.com?utm_source=index.dodopayments.com`.

Absence baseline (2026-08-23):

- `https://tinyaudits.com/audits` (HTTP 200): page body contains neither
  `TinyStudio` nor `tinystudio`.
- Category pages fetched and text-grepped:
  `https://tinyaudits.com/categories/landing-page-audit`,
  `https://tinyaudits.com/categories/website-performance-audit`,
  `https://tinyaudits.com/categories/seo-audit`,
  `https://tinyaudits.com/categories/web-ui-ux-audit` — none contain
  `TinyStudio` or `tinystudio.io`.
- `https://tinyaudits.com/sitemap.xml`: curl hit a redirect loop (HTTP 301,
  max redirects exceeded); no sitemap `<loc>` grep was possible on this run.
- Web search `site:tinyaudits.com TinyStudio` and
  `site:tinyaudits.com tinystudio.io` returned category pages, the homepage,
  and unrelated "studio" listings — not a tinystudio.io profile.

Unrelated "Tiny Studio" entities (Mac subtitle app, fibre-arts magazine,
design agency, video studio, Los Angeles venue, unrelated LLC) do not count.
That search is a baseline, not proof of non-existence — check again before
submitting.

Automation disposition: manual-only. Venue-policy allowlist is empty. No
account creation, no login, no form fill, no `Confirm Submission` click, no
payment, no scraping-by-bot, no unattended submission by any agent.

## Baseline (observed 2026-08-23, verified live)

- Live `https://tinystudio.io/llms.txt` and `https://tinystudio.io/offer.md`
  (both HTTP 200) are byte-identical to committed `public/llms.txt` and
  `public/offer.md` on this head (curl diff: zero differences).
- Live `https://tinystudio.io/pricing` (HTTP 200) states exactly: "the
  appraisal is free, the desk is $2,500 a month on a three-month minimum".
  Do not put the dollar amount in the submitted profile copy; point at
  `https://tinystudio.io/pricing`.
- Live homepage `https://tinystudio.io/` (HTTP 200) carries the promises
  "Six a month." and "No call at any point." (required copy enforced by
  `scripts/check-site.mjs`). Intake works by entering the site URL without
  any call.
- Live `data-study="readable"` on the homepage is `88` (public homepages
  study; not client proof).
- `https://tinystudio.io/specimen` is a sample report shape; the clinic is
  not a client.
- Not promised (llms.txt / offer.md): no revenue, ranking, ROAS, conversion,
  booked-call, or sales-volume guarantees. TinyStudio is not sold as a
  conversion audit service and promises no conversion lift. The retired
  Agent Desk is legacy, not the current offer.
- The site publishes no phone number, no year founded, no social-profile
  URLs, no certifications, no hourly rate, no project size. The only team
  statement is "run by Nish, who signs every audit". The site states no base
  city or office address; clients are never named.
- No TinyAudits receipt exists yet.

## TinyAudits submission criteria — truthfulness map

| TinyAudits criterion | TinyStudio evidence | Verdict |
| --- | --- | --- |
| Clear & Fixed Scope | llms.txt: "each fault named, in order of what it costs you, with the fix beside each" | PASS |
| 1:1 Consultation Availability | Homepage: "No call at any point." (required copy, guarded by `scripts/check-site.mjs`); no bookable-call path on any first-party surface | CONFLICT / BLOCKER CANDIDATE — TinyStudio communicates in writing only; if TinyAudits enforces this criterion, record the blocker and stop; adding a booking path is Nish's product decision and out of scope; never invent a calendar/booking URL |
| No Sales Call Required | "No call at any point." exceeds this | PASS |
| Standalone Action Items | "yours to keep and to hand to any developer" | PASS |
| Honest Offer Pricing | Audit is free and yours to keep; desk terms at `/pricing`; six-per-month capacity | PASS |

## Prepared profile content (copy-paste)

Every value below is drawn only from the live first-party surfaces named in
the source column, and from this handoff's constraints. Fields not listed here
must be left empty — an empty field is truthful; an invented one is not.

| TinyAudits field | Value to enter | Source |
| --- | --- | --- |
| Audit URL | `https://tinystudio.io/` | llms.txt Canonical URL; q1/q5 preferred source (homepage owns offer + intake) |
| Your Email Address | `hello@tinystudio.io` | llms.txt Contact |
| Company / tool name | `TinyStudio` (no Inc/LLC/Studios, no city) | llms.txt Identity |
| Tagline | `The free leak audit of high-ticket service homepages, reviewed by a person.` | llms.txt |
| Description | `TinyStudio runs The Website Appraisal: the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. The appraisal is a written report on one page of your choosing — each fault named, in order of what it costs you, with the fix beside each — and it is yours to keep and to hand to any developer. The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up. Six appraisals a month, done by hand; when the sixth is taken, the intake closes until the next. The audit is free; the desk's price and terms are published on the website. Run by Nish, who signs every audit. Clients are never named, and the site states no base city or office address.` | llms.txt / offer.md |
| Category | `landing-page-audit` — **Landing Page** — The Website Appraisal is a written report on the buyer's chosen high-ticket service homepage, naming each fault in cost order with the fix beside each; fits landing-page evaluation without promising conversion lift, rankings, speed metrics, or UX-redesign deliverables. Category page (fetched 2026-08-23): "Landing page audits diagnose why your page isn't converting — whether you're driving traffic from ads, email, or SEO. They evaluate headline clarity, value proposition strength, CTA design and placement, social proof, form friction, page speed, and mobile experience..." TinyStudio is not sold as a conversion audit service; listing copy describes the appraisal, not CRO outcomes. | `https://tinyaudits.com/categories/landing-page-audit`; llms.txt q8 |
| Pricing field / "free" flag (if the form or dashboard asks) | `The audit is free and yours to keep. Six appraisals a month, done by hand. Optional human-reviewed desk; price and terms: https://tinystudio.io/pricing` | llms.txt; live /pricing |
| Consultation / booking field (if present) | Leave empty; see criteria-map row for 1:1 Consultation Availability; if required → reject condition | homepage; criteria map |
| Location | Leave blank | llms.txt Identity; public-surface scan — if required, stop (reject condition) |
| Phone | Leave blank | public-surface scan — if required, stop (reject condition) |
| Year founded | Leave blank | llms.txt — if required, stop (reject condition) |
| Social profiles | Leave blank | public-surface scan — if required, stop (reject condition) |
| Clients / reviews / testimonials | Leave empty; never fabricate; specimen + study are not client proof | audit.html q6; llms.txt |

The description intentionally does not restate the desk price: llms.txt and
offer.md point price and terms at `https://tinystudio.io/pricing`; this profile
follows the same rule.

## Never on the profile

- Client names, logos, case studies, testimonials, "as seen at", or any client
  work.
- A base city or office address.
- A phone number, year founded, social-profile URLs, certifications, hourly
  rate, or project size the site does not publish.
- Revenue, ranking, ROAS, conversion, booked-call, or sales-volume results or
  guarantees — including "guaranteed growth", "rankings", promised conversion
  lift, or any CRO framing (TinyAudits markets heavily in conversion language;
  TinyStudio is not sold as a conversion audit service per llms.txt q8).
- Domain-value or resale estimates.
- The retired self-serve Agent Desk as the current product.
- Invented booking or calendar URLs.
- Any dollar amount in the submitted copy.
- Any payment to TinyAudits by anyone but Nish.

## Manual submission runbook (Nish, human only)

1. Re-run the absence search (methods in "Why this handoff exists"). If a
   listing now exists for this tinystudio.io, correct it; do not duplicate.
2. Resolve the two-path question BEFORE paying: `/audits/new` shows "$29
   one-time fee" while `/submit` shows "List Your Audit Free" via
   `/users/sign_up`. Recommended first action: email `team@tinyaudits.com`
   FROM `hello@tinystudio.io` using the clarification template below. No
   account creation, no payment, no form submission in this step.
3. If proceeding: Nish personally creates any account (`/users/sign_up`) or
   opens `/audits/new` in a normal browser; fills ONLY the fields in the
   table; leaves unmappable fields empty; chooses the nominated category (or
   records why it would not stick).
4. Before any `Confirm Submission` click: re-read "Never on the profile" and
   the criteria map; confirm the $29 (or any) charge is a deliberate Nish
   decision — if the only path to listing is a payment he declines, STOP and
   record that as the blocker receipt.
5. Capture the receipt: listing URL, pending/"manual review within 48 hours"
   state, rejection, or blocker; fill the Receipt block.

Clarification-email template:

```
Subject: Listing question before submitting — TinyStudio (tinystudio.io)

Hello TinyAudits team,

Before submitting The Website Appraisal for the directory, two quick questions:

1. Which listing path applies to a service like ours — the "Submit New" form at /audits/new (shown with a $29 one-time review fee) or the free provider listing at /users/sign_up ("100% Free Listing Status Open")?

2. Your submission criteria mention "1:1 Consultation Availability — buyers should be able to book you". Our audit is delivered entirely in writing by design ("No call at any point" is a promise we make on https://tinystudio.io/), so we cannot offer a live strategy call. Is a written-only audit eligible?

Proposed listing: TinyStudio — the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. Audit URL: https://tinystudio.io/ — Contact: hello@tinystudio.io

Thank you,
Nish — TinyStudio
```

No agent creates an account, fills a form, clicks `Confirm Submission`, sends
any email, or pays anything. No unattended submission.

## Acceptance / verification

- accept: Nish manually lists (or formally declines) using only live
  first-party claims; capture a real listing URL, pending state, rejection, or
  documented blocker; verify name, website, service focus, and claims match
  the live Website Appraisal / human-reviewed desk; no fabricated reviews,
  client names, location, outcome claims, booking URLs, or payments.
- verify: retain the receipt and compare the published listing against
  `https://tinystudio.io/llms.txt` and the public routes; no unattended
  submission.

### Receipt block (fill after the manual submission)

- Submitted: `<date>`
- Path used: `<$29 /audits/new | free /users/sign_up | email-only>`
- Listing URL or response: `<url or response>`
- Published: `<date>` / `<not yet>`
- Category used: `landing-page-audit` (or actual)
- Payment made: `<none | amount + Nish approval ref>`
- Any deviation from this handoff: `<none or describe>`

## Reject conditions (stop, do not invent, record in receipt)

- They enforce the 1:1-consultation criterion and will not accept
  written-only delivery (primary expected blocker — the "No call at any
  point." promise stands).
- Listing requires a payment Nish has not approved.
- Only fitting categories require conversion-lift, CRO, SEO-rankings,
  speed-metrics, or UX-redesign claims.
- They require city, phone, year founded, social URLs, named clients, or
  testimonials.
- The venue is unreachable or defunct (record dates).
- A listing already exists (retire instead — see workflow step 4 in the
  packet).

In any of these cases the truthful action is to record the blocker in this
receipt block and stop — silence or invention is not an outcome.

## Rollback

If TinyAudits publishes unsupported or stale claims, request correction or
removal via `team@tinyaudits.com`, then update the receipt block with what
was requested and when.

## What this document does not claim

- The absence search is not proof of non-existence (re-check before
  submitting; compare any discovered profile against llms.txt).
- Nothing predicts publication, visibility, traffic, leads, or revenue.
- Whether TinyAudits strictly enforces the "1:1 Consultation Availability"
  criterion, and whether written-only delivery is eligible — unresolved
  until TinyAudits answers; treated as the primary blocker candidate.
- The true relationship between the `$29 one-time fee` path (`/audits/new`)
  and the "100% Free Listing" provider-account path (`/users/sign_up`):
  which produces a public listing card, whether both exist simultaneously,
  and what the fee actually buys — observed contradiction recorded, not
  resolved.
- Whether category selection happens at submit time, inside a provider
  dashboard after sign-up, or is assigned editorially — the visible form
  showed only `Audit URL` + `Your Email Address`.
- Whether the rendered `/audits/new` form exposes additional JS-hidden
  fields not present in the static fetch.
- Whether the submitted `Audit URL` is crawled to auto-build the listing
  card.
- Live `public/llms.txt` vs deployed byte-parity was checked on 2026-08-23
  (identical); if they later drift, committed `public/` files govern and
  deploy lag is recorded in Baseline.
- This lane created no account, submitted nothing, paid nothing.
