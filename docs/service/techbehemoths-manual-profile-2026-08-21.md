# TinyStudio — truthful manual TechBehemoths profile: prepared handoff

Date: 2026-08-21
Scope: `docs/service/techbehemoths-manual-profile-2026-08-21.md` — the prepared,
copy-paste content, field-by-field truthfulness map, and manual submission
runbook for a free TechBehemoths company profile for TinyStudio, the
human-reviewed Website Appraisal. Internal operator document. Do not publish
this file as marketing copy; it is a handoff, not an offer.

This handoff prepares the work item "Prepare a truthful manual TechBehemoths
profile for the human-reviewed Website Appraisal" [research desk 2026-08-21]
from the tinystudio.io improvement-loop backlog, whose packet is
`/home/nish/workspaces/agent-state/growth-loop/packets/tinystudio-io/techbehemoths-manual-listing.md`.
It records no ranking, traffic, lead, or revenue outcome. The submission
itself is a human action by Nish; nothing here automates, creates, or submits
a profile.

## Why this handoff exists

The research-desk run on 2026-08-21 verified TechBehemoths' official pages and
this lane re-verified every first-party claim against the live site the same
day:

- `https://techbehemoths.com/faq` (fetched 2026-08-21): "Yes. TechBehemoths is
  a 100% free platform... No hidden fees or services."
- `https://techbehemoths.com/about-us` (fetched 2026-08-21): "56,126 IT
  companies from 146 countries and 7,725 cities." TechBehemoths is an IT-only
  B2B directory owned by Mobiteam GmbH (Berlin).
- `https://techbehemoths.com/terms` (fetched 2026-08-21) prohibit "false,
  inaccurate, or misleading information," "fake reviews, inflated performance
  claims," and "misleading users about service deliverables." The terms also
  reserve the right to remove listings for "lack of effort or unwillingness to
  cooperate in optimizing their presence on the platform."
- Registration requires corporate-email confirmation: "Once you are using your
  corporate email, we will send you an automated email to confirm the
  registration" (FAQ).
- Third-party corroboration: getprojects.ai "10 Best B2B Directories 2026"
  (2026-08-10) lists TechBehemoths as #6, "IT-Only, Free to List," "free for
  agencies."

A current baseline search on 2026-08-21 found no TinyStudio/tinystudio.io
profile on TechBehemoths. That search is a baseline, not proof of
non-existence — check for an existing or auto-created profile before
registering (see runbook step 1).

The backlog impact: qualified buyers searching an IT-focused service directory
have no truthful TinyStudio profile to evaluate.

Automation disposition (from the packet): manual-only. Registration is gated
on corporate-email verification, the terms bar false or misleading content,
and the executable allowlist for this venue is empty — absence of an explicit
automation prohibition is not permission. A form existing is not automation
permission: no bot, no scraping, no account creation by any agent, no
unattended submission. Consistent with this, scripted fetches of
`techbehemoths.com/faq` and `/terms` from the VPS return HTTP 403 (bot
challenge), observed again by this lane on 2026-08-21; the Wayback Machine
availability API answered HTTP 429 (rate-limited) during the same run, so the
packet's same-day captures stand as the operative source of the quoted policy
strings until a human refresh.

## Baseline (observed 2026-08-21, verified live)

- Live `https://tinystudio.io/llms.txt` and its mirror
  `https://tinystudio.io/offer.md` (both HTTP 200) are byte-identical to the
  committed source on this head (curl diff: zero differences) and carry,
  verbatim: the offer ("The Website Appraisal — the free leak audit of
  high-ticket service homepages — and the human-reviewed desk that closes
  what the audit finds"), "reviewed by a person, not autonomous software",
  "Six appraisals a month, done by hand", "run by Nish, who signs every
  audit", "The site states no base city or office address", "clients are
  never named", "Contact: hello@tinystudio.io", and the price-and-terms
  pointer to `https://tinystudio.io/pricing`.
- Live `https://tinystudio.io/pricing` (clean URL, HTTP 200) states exactly:
  "the appraisal is free, the desk is $2,500 a month on a three-month minimum"
  (four occurrences in the served page), and contains no hourly-rate,
  project-size, or minimum-project figure anywhere.
- Live `https://tinystudio.io/audit` (HTTP 200) still answers q3 "Where is
  TinyStudio based?" with "The site does not state a base city or office
  address for TinyStudio" and q6 "Does TinyStudio publish client work?" with
  "no logos, no case studies, no testimonials, no 'as seen at'".
- The site publishes no phone number, no year founded, no employee count, no
  certification, and no TinyStudio social-profile URLs (the only
  instagram/linkedin/facebook strings are inside `/audit`'s embedded AI-search
  evidence JSON, cited as sources about unrelated businesses). The only team
  statement is "run by Nish".
- No TechBehemoths receipt exists in the product state.

## Prepared profile content (copy-paste)

Every value below is drawn only from the live first-party surfaces named in
the source column, and from the packet's constraints. TechBehemoths company
profiles present fields such as company name, tagline/description, website,
services, team size, location, and contact details; the live form governs.
Fields not listed here must be left empty — an empty field is truthful; an
invented one is not.

| TechBehemoths field | Value to enter | Source |
| --- | --- | --- |
| Plan / offering | Free profile only. The FAQ states the platform is "100% free... No hidden fees or services", so no paid upgrade should exist; if one is offered, decline it. | Packet: manual listing, no paid upgrades; FAQ quote |
| Company name | `TinyStudio` (exact product name; no "Inc", "LLC", "Studios", or a city). | Packet canonical claims; llms.txt Identity |
| Website | `https://tinystudio.io/` | llms.txt Canonical URL |
| Tagline / short description | `The free leak audit of high-ticket service homepages, reviewed by a person.` | llms.txt lines 3–5; offer.md |
| Company description | `TinyStudio runs The Website Appraisal: the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. The appraisal is a written report on one page of your choosing — each fault named, in order of what it costs you, with the fix beside each — and it is yours to keep and to hand to any developer. The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up. Six appraisals a month, done by hand; when the sixth is taken, the intake closes until the next. The audit is free; the desk's price and terms are published on the website. Run by Nish, who signs every audit. Clients are never named, and the site states no base city or office address.` | Each clause from llms.txt Current Offer / Identity, offer.md, audit.html, index.html |
| Contact email | `hello@tinystudio.io` — use this corporate email for registration too; TechBehemoths confirms registration by emailing it. | llms.txt Contact; FAQ corporate-email confirmation |
| Team size / employees | `1` — the site's only team statement is "run by Nish, who signs every audit". If Nish knows the true figure differs, enter the true number instead. | llms.txt Identity; offer.md |
| Location | Leave blank or choose the remote / no-location option if offered. The site states no base city or office address; never enter a city. If the form requires a location, stop and report (reject condition, below). | llms.txt Identity; audit.html q3 truth; index.html "Where TinyStudio is based" |
| Phone | Leave blank. The site publishes no phone number. If the form requires a phone number, stop and report (reject condition, below). | Full public-surface scan (no phone/tel anywhere) |
| Year founded | Leave blank. The site and llms.txt state no founding year. If the form requires a year, stop and report (reject condition, below). | llms.txt Identity (no year) |
| Social profiles | Leave blank. The site publishes no TinyStudio social-profile URLs. | Full public-surface scan |
| Services / categories | Choose only categories that truthfully name the service — the free leak audit of high-ticket service homepages and the desk that closes the leaks. Prefer plain audit-shaped categories (website audit; web development or SEO-adjacent if that is the closest fit). A conversion-optimization category may be selected only if its definition describes auditing and improving pages without promising lift; never add copy implying guaranteed conversion improvement — the site's own boundary states TinyStudio "is not sold as a conversion audit service" and "promises no conversion lift". Do not pick a category whose definition implies guarantees, ad buying, or the retired Agent Desk product. | Packet acceptance #4; llms.txt q8 boundary; Clutch/GoodFirms precedent rule |
| Hourly rate / budget range | Leave blank. No hourly rate or project-size figure exists anywhere on the site; the only price statement is on the pricing page. Do not invent either. If the form requires one, stop and report (reject condition, below). | /pricing scan (no such figures); llms.txt "Price and terms" pointer |
| Portfolio / projects / key clients | Leave empty. Clients are never named and no client work is published — no logos, no case studies, no testimonials. Do not submit fabricated portfolio items or request reviews from invented clients. Real client reviews, when they exist, arrive through the platform's own verified process. | audit.html q6 truth; llms.txt Buyer |

The description intentionally does not restate the desk price: llms.txt and
offer.md point price and terms at `https://tinystudio.io/pricing` rather than
restating dollar amounts, and this profile follows the same rule.

## Never on the profile

- Client names, logos, case studies, testimonials, "as seen at", or any client
  work.
- A base city, office address, or any location the site does not state.
- A phone number, year founded, social-profile URLs, certifications, hourly
  rate, or project size the site does not publish.
- Revenue, ranking, ROAS, conversion, booked-call, or sales-volume results or
  guarantees — including words like "guaranteed growth", "rankings", or
  promised conversion lift.
- An invented employee count (beyond "1", the site's own statement) or award.
- The retired self-serve Agent Desk as the current product (it is legacy, not
  the current offer; llms.txt "Legacy Self-Serve Agent Desk").
- Fake reviews or inflated performance claims — expressly prohibited by
  TechBehemoths' own terms, and by this repo's truthfulness rules regardless.

## Manual submission runbook (Nish, human only)

1. First check that TinyStudio is not already listed: search TechBehemoths for
   "TinyStudio" and "tinystudio.io" in a normal browser session. If a profile
   already exists under a different name form (including the legacy Agent
   Desk), claim and correct it rather than creating a duplicate.
2. Open `https://techbehemoths.com` in a normal browser session and start the
   company sign-up ("Join"/register flow). Register with the corporate email
   `hello@tinystudio.io`; TechBehemoths sends an automated confirmation email
   to it.
3. Confirm the registration email, then fill the profile fields from the table
   above, verbatim where the form accepts the text. Leave empty any field the
   table does not cover, especially: phone, location, year founded, social
   profiles, hourly rate/budget, portfolio, key clients.
4. Review against the "Never on the profile" list before publishing.
5. Publish. Note the platform's own term reserving removal for "lack of
   effort or unwillingness to cooperate in optimizing their presence": keep
   later platform prompts honest — respond with the same first-party claims
   or leave fields empty; never fill them with invented material to satisfy
   engagement prompts.
6. Capture the receipt: the real TechBehemoths profile URL once published, or
   the rejection response if review fails. Record it in the receipt block
   below and in the growth-loop packet.

No agent creates the account, fills the form, or submits. No unattended
submission.

## Acceptance / verification

From the backlog item and packet:

- accept: Nish manually creates the free TechBehemoths profile using only live
  first-party claims; capture a real TechBehemoths profile URL, pending state,
  or rejection; verify name, website, service focus, and claims match the live
  Website Appraisal / human-reviewed desk. No fabricated reviews, client
  names, location, outcome claims, or paid upgrades.
- verify: retain the submission/profile/rejection receipt and compare the
  published profile against `https://tinystudio.io/llms.txt` and the public
  routes; no unattended submission.

### Receipt block (fill after the manual submission)

- Submitted: `<date>`
- Profile URL or rejection response: `<url or response>`
- Published: `<date>` / `<not yet>`
- Categories chosen: `<categories>`
- Any deviation from this handoff: `<none or describe>`

## Reject conditions (stop, do not submit, report)

Per the packet's constraints:

- TechBehemoths requires a city/location, phone number, year founded, hourly
  rate, budget range, portfolio, or named clients that are not on the live
  contract.
- TechBehemoths requires paid placement before a basic profile is possible —
  the FAQ states the platform is "100% free... No hidden fees or services",
  so this should not happen; if it does, stop.
- The live offer cannot be represented without inventing location, clients,
  outcomes, an hourly rate, or a project size.
- No service category in TechBehemoths' taxonomy fits the offer without
  overclaiming.

In any of these cases the truthful action is to record the blocker in this
receipt block and the growth-loop packet, and stop — silence or invention is
not an outcome.

## Rollback

If TechBehemoths publishes unsupported or stale claims (wrong product,
invented location, outcome claims, fake reviews, or the retired Agent Desk as
current), request correction or removal manually through the profile edit
flow or TechBehemoths support, then update the receipt block and the
growth-loop packet with what was requested and when.

## What this document does not claim

- The search baseline is not proof that no profile exists; TechBehemoths may
  have auto-created one under a different name form. If a profile appears,
  compare it against llms.txt before changing anything.
- This lane could not re-fetch TechBehemoths' FAQ/terms/about directly
  (scripted fetches return HTTP 403 from the VPS; Wayback availability API
  returned HTTP 429 during this run). The quoted policy strings come from the
  research-desk captures of 2026-08-21; re-check them in a browser session at
  submission time and apply the truthfulness tests above rather than this
  table verbatim if anything changed.
- Nothing here predicts publication, visibility, traffic, leads, or revenue.
- This lane read no TechBehemoths page in a real browser session; no account
  was created and nothing was submitted.
