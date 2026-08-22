# TinyStudio — truthful manual Vendar profile: prepared handoff

Date: 2026-08-22
Scope: `docs/service/vendar-manual-profile-2026-08-22.md` — the prepared,
copy-paste content, field-by-field truthfulness map, and manual submission
runbook for a free Vendar Connect / Profile connection for TinyStudio, the
human-reviewed Website Appraisal. Internal operator document. Do not publish
this file as marketing copy; it is a handoff, not an offer.

This handoff prepares the work item "Review Forge and Vendar are two new free
B2B discovery venues TinyStudio is absent from [research desk 2026-08-21,
risk: green, traction]" from the tinystudio.io improvement-loop backlog,
whose packet is
`/home/nish/workspaces/agent-state/growth-loop/packets/tinystudio-io/done/vendar-manual-listing.md`.
It records no ranking, traffic, lead, or revenue outcome. The submission
itself is a human action by Nish; nothing here automates, creates, or submits
a profile.

## Why this handoff exists

The research-desk run on 2026-08-21 identified Vendar as a live B2B
discovery surface and called it "free". This lane re-verified the official
venue pages live on 2026-08-22 (scripted fetches of
`https://www.vendar.org/`, `https://www.vendar.org/participate`, and
`https://www.vendar.org/marketing/seo` all returned HTTP 200; a real browser
session re-read homepage, SEO listings, and participate — read only; Send
request was not clicked):

- Homepage (`https://www.vendar.org/`, fetched 2026-08-22):
  "Proof-ranked US agencies. No Clutch-style pay-to-rank."
- Homepage: "1,200+ US agency profiles ranked by proof, not by ad spend."
- Homepage: "position is calculated from case study depth, client proof,
  and verified performance — not invoices."
- Homepage: "Claim your profile. Get approved visibility."
- Homepage: "Participation gives you a verified badge, approved city
  surfaces, and structured profile review. Ranking stays editorial."
- Homepage: "From $299/quarter City Core launch price."
- Participate (`https://www.vendar.org/participate`, fetched 2026-08-22):
  "Connect is free. Verify is trust. Package badge is quarterly
  visibility."
- Participate form exists at `https://www.vendar.org/participate`
  (`Request a launch review`), fields: Company name, Work email, Website,
  Start with, Package interest, Service focus, Market focus, Campaign goal,
  Additional notes, button `Send request`.

Live pricing on participate (2026-08-22): Connect/Profile connection is
free; Verify is `$199 / year`; City Core Quarter is `$299 / quarter`;
City Growth `$599 / quarter`; City Leader `$899 / quarter`; Country
packages `$990`–`$1,900 / quarter`. Accept criteria forbid paid placements
and Nish-only money decisions. This handoff is Connect / Profile
connection ONLY. Do not buy Verify or any quarterly visibility package.

The participate form's live defaults are not the free path: Package
interest defaults to `City Growth Quarter - $599 / quarter`, and Campaign
goal defaults to `Test one city-service launch quarter`. Start with
defaults to `Profile connection`. Nish must change Package interest to
`Not sure yet` and Campaign goal to `Review profile and verification
first` before sending. Do not click any `Request City …` / `Request
Country …` button.

A current baseline search on 2026-08-22 found no TinyStudio/tinystudio.io
profile for this site (`https://tinystudio.io/`):

- Homepage, `/marketing/seo`, and `/participate` page text contained
  neither `TinyStudio` nor `tinystudio.io`.
- Web search `site:vendar.org TinyStudio` and `site:vendar.org
  tinystudio.io` returned unrelated studios (StudioLabs, BX Studio, Karpi
  Studio, and similar). Those are not this TinyStudio.

Unrelated "Tiny Studio" entities (Mac subtitle app, fibre-arts magazine,
design agency, video studio, Los Angeles venue, unrelated LLC) do not
count. That search is a baseline, not proof of non-existence — check again
before submitting (see runbook step 1).

The backlog impact: qualified buyers searching a proof-ranked US-agency
directory have no truthful TinyStudio profile to evaluate.

Automation disposition (from the packet): manual-only. Venue-policy
allowlist is empty. `venue-claim` exists on this host; its presence is not
permission. No bot, no scraping, no account creation by any agent, no
unattended submission, no click of `Send request` by any agent.

## Baseline (observed 2026-08-22, verified live)

- Live `https://tinystudio.io/llms.txt` and its mirror
  `https://tinystudio.io/offer.md` (both HTTP 200) are byte-identical to the
  committed source on this head (curl diff: zero differences) and carry,
  verbatim: the offer ("The Website Appraisal — the free leak audit of
  high-ticket service homepages — and the human-reviewed desk that closes
  what the audit finds"), "reviewed by a person, not autonomous software",
  "Six appraisals a month, done by hand", "run by Nish, who signs every
  audit", "The site states no base city or office address", "clients are
  never named", "Contact: hello@tinystudio.io", Canonical URL
  `https://tinystudio.io/`, and the price-and-terms pointer to
  `https://tinystudio.io/pricing`.
- Live `https://tinystudio.io/pricing` (HTTP 200) states exactly: "the
  appraisal is free, the desk is $2,500 a month on a three-month minimum"
  (four occurrences in the served page). Do not put the dollar amount in
  the profile copy; point at `https://tinystudio.io/pricing`.
- Live `https://tinystudio.io/audit` (HTTP 200) still answers q3 "Where is
  TinyStudio based?" with "The site does not state a base city or office
  address for TinyStudio" and q6 "Does TinyStudio publish client work?"
  with "no logos, no case studies, no testimonials, no 'as seen at'".
- Live homepage `data-study="readable"` is `88` /
  `data-study="readable_word"` is `eighty-eight`. Do not use the growth
  packet's older study count; it is stale.
- `https://tinystudio.io/specimen` is a sample report shape; the clinic is
  not a client.
- Not promised: no revenue, ranking, ROAS, conversion, booked-call, or
  sales-volume guarantees. TinyStudio is not sold as a conversion audit
  service and promises no conversion lift. The retired Agent Desk is not
  the current offer.
- The site publishes no phone number, no year founded, no social-profile
  URLs, no hourly rate, no project size, no certifications. The only team
  statement is "run by Nish, who signs every audit".
- No Vendar receipt exists in the product state. Do not claim TinyStudio
  is already listed on Clutch, G2, or GoodFirms; those in-repo handoffs
  still have unfilled `Submitted: <date>` placeholders.

## Prepared profile content (copy-paste)

Every value below is drawn only from the live first-party surfaces named in
the source column, and from the packet's constraints. The live participate
form governs. Fields not listed here must be left empty — an empty field is
truthful; an invented one is not.

| Vendar field | Value to enter | Source |
| --- | --- | --- |
| Start with | `Profile connection` | Participate form option; "Connect is free" |
| Package interest | `Not sure yet` | Participate form. Do not select City Core/Growth/Leader or any Country package |
| Campaign goal | `Review profile and verification first` | Participate form. Do not select `Test one city-service launch quarter` |
| Company name | `TinyStudio` | llms.txt |
| Work email | `hello@tinystudio.io` | llms.txt |
| Website | `https://tinystudio.io/` | llms.txt |
| Service focus | `The free leak audit of high-ticket service homepages, reviewed by a person.` Do not type `SEO, paid ads, web development`. If Vendar will only accept one of their live taxonomy labels (SEO, Paid Ads, Performance, Link Building, SERM, ORM, Web Dev, Ecommerce, Mobile, AI Dev, DevOps), request `SEO` as the closest packet-nominated label AND keep the description as the Website Appraisal. If they require claiming SEO retainers, rankings, paid ads, or web-build delivery, stop (reject). | Participate placeholder vs llms.txt q8 |
| Market focus | Leave blank. Do not enter Los Angeles, New York, San Francisco, Chicago, Miami, or `United States`. The site states no base city or office address. If the form requires a market, stop (reject). | llms.txt Identity; Vendar is US-metro |
| Additional notes | `TinyStudio publishes no client names, logos, case studies, or testimonials. Proof of method: https://tinystudio.io/specimen (specimen report; the clinic is not a client) and https://tinystudio.io/audit. Market research: the eighty-eight-site study of public homepages with no client relationship, described on https://tinystudio.io/. No base city. Please use the free Profile connection / Connect path only; do not bill a quarterly visibility package or annual verification without a separate owner decision.` | specimen.html; index.html study copy; participate pricing |
| Description / about | `TinyStudio runs The Website Appraisal: the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. The appraisal is a written report on one page of your choosing — each fault named, in order of what it costs you, with the fix beside each — and it is yours to keep and to hand to any developer. The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up. Six appraisals a month, done by hand; when the sixth is taken, the intake closes until the next. The audit is free; the desk's price and terms are published on the website. Run by Nish, who signs every audit. Clients are never named, and the site states no base city or office address.` | llms.txt |
| Location / city | Leave blank / reject if required | llms.txt |
| Client proof / case studies | Specimen + eighty-eight-site public-homepage study only. Never name clients. Vendar scores "verified client proof"; TinyStudio has none. The profile may rank low or be refused. That refusal is a valid receipt. | audit.html q6; Vendar scoring copy |
| Paid packages | Do not buy. Do not select City Core ($299/q), City Growth ($599/q), City Leader ($899/q), any Country package, Annual verification ($199/year), or `1 sponsored placement`. | participate pricing; packet "no paid placements" |

The description intentionally does not restate the desk price: llms.txt and
offer.md point price and terms at `https://tinystudio.io/pricing` rather than
restating dollar amounts, and this profile follows the same rule.

## Never on the profile

- A US city or metro invented to satisfy Vendar (Los Angeles, New York,
  San Francisco, Chicago, Miami, or `United States`).
- Client names, logos, case studies, testimonials, "as seen at", or any
  client work.
- Paid packages: City Core, City Growth, City Leader, any Country package,
  Annual verification, or sponsored placement.
- Revenue, ranking, ROAS, conversion, booked-call, or sales-volume results
  or guarantees — including words like "guaranteed growth" or "rankings".
- Promised conversion lift.
- The retired self-serve Agent Desk as the current product (it is legacy,
  not the current offer; llms.txt "Legacy Self-Serve Agent Desk").
- The stale growth-packet study count. Use eighty-eight only.
- Converting the eighty-eight-site study into client proof (it is public
  homepages, no client relationship).
- Invented Clutch, G2, or GoodFirms listings.

## Manual submission runbook (Nish, human only)

1. Search Vendar for TinyStudio/tinystudio.io. If a profile exists for this
   site, claim/correct it; do not duplicate.
2. Open `https://www.vendar.org/participate` in a normal browser.
3. Fill only the table above. Start with = Profile connection. Package
   interest = Not sure yet. Campaign goal = Review profile and verification
   first. Market focus empty. Change the live defaults: Package interest
   away from City Growth ($599/q) and Campaign goal away from `Test one
   city-service launch quarter`.
4. Review the Never list. Submit. This step is Nish, not the agent.
5. If the UI blocks submit without a city or a paid package, stop,
   screenshot/record that, fill the receipt with the blocker. Do not pay.
6. Capture the real profile URL, pending state, or rejection.

No agent creates an account, fills the form, or clicks `Send request`. No
unattended submission. Do not open `/admin/login`.

## Acceptance / verification

From the backlog item and packet:

- accept: Nish manually requests a free Profile connection / Connect using
  only live first-party claims; capture a real Vendar profile URL, pending
  state, rejection, or a "city/paid-package required" blocker; verify name,
  website, service focus, and claims match the live Website Appraisal /
  human-reviewed desk. No paid package, no invented city, no fabricated
  client proof.
- verify: retain the submission/profile/rejection receipt and compare the
  published profile against `https://tinystudio.io/llms.txt` and the public
  routes; no unattended submission.

### Receipt block (fill after the manual submission)

- Submitted: `<date>`
- Profile URL or rejection response: `<url or response>`
- Published: `<date>` / `<not yet>`
- Start-with value: `Profile connection`
- Package selected: `Not sure yet` / none
- Market entered: `blank` or the blocker
- Any deviation from this handoff: `<none or describe>`

## Reject conditions (stop, do not invent, record in receipt)

- Form requires a city/metro/United States.
- Form requires selecting a paid package before Connect is possible.
- Form requires named-client case studies and will not accept
  specimen/study.
- Live offer cannot be represented without inventing location, clients,
  SEO retainers, or outcomes.
- No Vendar category fits without overclaiming.

In any of these cases the truthful action is to record the blocker in this
receipt block and the growth-loop packet, and stop — silence or invention is
not an outcome.

## Rollback

If Vendar publishes unsupported or stale claims, request correction or
removal via the same participate email follow-up, then update the receipt
block and the growth-loop packet with what was requested and when.

## What this document does not claim

- The search baseline is not proof of non-existence; Vendar may already
  have listed the company under a different name form. If a profile
  appears, compare it against llms.txt before changing anything.
- Connect-free may not produce a public ranked listing (visibility may be
  paid-only); if so, that is a blocker, not a licence to buy.
- Nothing here predicts publication, visibility, traffic, leads, or
  revenue.
- Vendar's "US agencies" framing may make TinyStudio ineligible. If they
  require a US metro, that is a reject condition. Do not enter a city.
- This lane did not submit the form. No account was created. No paid
  package was selected.
- Live `https://tinystudio.io/llms.txt` and `public/llms.txt` were
  byte-identical on 2026-08-22 (HTTP 200). If they later drift, use the
  committed `public/` files as the copy source and record deploy lag here.
