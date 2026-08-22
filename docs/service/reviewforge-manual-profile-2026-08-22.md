# TinyStudio — truthful manual Review Forge profile: prepared handoff

Date: 2026-08-22
Scope: `docs/service/reviewforge-manual-profile-2026-08-22.md` — the prepared,
copy-paste content, field-by-field truthfulness map, and manual submission
runbook for a free editorial Review Forge listing for TinyStudio, the
human-reviewed Website Appraisal. Internal operator document. Do not publish
this file as marketing copy; it is a handoff, not an offer.

This handoff prepares the work item "Review Forge and Vendar are two new free
B2B discovery venues TinyStudio is absent from [research desk 2026-08-21,
risk: green, traction]" from the tinystudio.io improvement-loop backlog,
whose packet is
`/home/nish/workspaces/agent-state/growth-loop/packets/tinystudio-io/done/reviewforge-manual-listing.md`.
It records no ranking, traffic, lead, or revenue outcome. The submission
itself is a human action by Nish; nothing here automates, creates, or submits
a profile.

## Why this handoff exists

The research-desk run on 2026-08-21 identified Review Forge as a live B2B
discovery surface where TinyStudio is absent. This lane re-verified the
official venue pages live on 2026-08-22 (scripted fetches of
`https://reviewforge.reviews/` and `https://reviewforge.reviews/about` both
returned HTTP 200; a real browser session re-read the same two URLs):

- Homepage (`https://reviewforge.reviews/`, fetched 2026-08-22): "An
  independent directory of B2B service companies with direct links to
  verified reviews on Google, Trustpilot, G2, Clutch, and GoodFirms."
- Homepage: "No company can pay us to be removed, hidden, or promoted.
  Companies are listed because they operate in the space, not because they
  paid for placement."
- About (`https://reviewforge.reviews/about`, fetched 2026-08-22): "We do
  not accept payment for placement, removal, hiding, or promotion. There is
  no premium tier. There is no featured slot for sale."
- About editorial methodology: "A company appears on Review Forge when all
  three are true: (1) the company operates publicly in one of our covered
  B2B service categories, (2) the company has a verifiable presence on at
  least one major B2B review platform (Google Business, Clutch, GoodFirms,
  G2, or Trustpilot), and (3) a human editor has confirmed that the
  platform links resolve to the correct profile, not an impersonator or a
  closed/archived listing."
- Contact (About "Editorial corrections and contact" plus homepage and
  About footers): `elizabeth5@gmail.com` (`mailto:elizabeth5@gmail.com`).
  Those two pages show no other contact address and no self-serve
  submission form. Contact is editorial corrections / email. Do not invent
  `hello@reviewforge.reviews` or similar.

Active homepage categories include `SEO Company`
(`https://reviewforge.reviews/seo-company-reviews/`). Conversion Rate
Optimization is listed under Coming Soon; TinyStudio is not sold as a
conversion audit service, so that category is not to be requested.

A current baseline search on 2026-08-22 found no TinyStudio/tinystudio.io
profile for this site (`https://tinystudio.io/`):

- Homepage search box: typed `TinyStudio`, then typed `tinystudio.io`.
  Neither query produced a company card or profile URL; the page body
  contained neither string.
- `https://reviewforge.reviews/seo-company-reviews/` (HTTP 200) does not
  contain TinyStudio or tinystudio.io.
- `https://reviewforge.reviews/sitemap.xml` (HTTP 200, 719 `<loc>` URLs)
  contains no tinystudio URL. The only sitemap loc matching `tiny` is the
  unrelated `.../testiny-reviews/`.
- Web search `site:reviewforge.reviews TinyStudio` and
  `site:reviewforge.reviews tinystudio.io` returned category pages and the
  homepage, not a tinystudio.io profile.

Unrelated "Tiny Studio" entities (Mac subtitle app, fibre-arts magazine,
design agency, video studio, Los Angeles venue, unrelated LLC) do not
count. That search is a baseline, not proof of non-existence — check again
before emailing (see runbook step 1).

The backlog impact: qualified buyers searching a B2B review-directory
surface have no truthful TinyStudio profile to evaluate.

Automation disposition (from the packet): manual-only. Venue-policy
allowlist is empty. `venue-claim` exists on this host; its presence is not
permission. There is no signup form. No bot, no scraping, no account
creation by any agent, no unattended submission.

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
- No Review Forge receipt exists in the product state.

## Prepared profile content (copy-paste)

Every value below is drawn only from the live first-party surfaces named in
the source column, and from the packet's constraints. Review Forge has no
self-serve form; these are the fields to put in the editorial email. Fields
not listed here must be left empty — an empty field is truthful; an
invented one is not.

| Review Forge field | Value to enter | Source |
| --- | --- | --- |
| Plan / offering | Free editorial listing only. Review Forge states there is no premium tier and no featured slot for sale. Do not offer payment. | About: no premium tier |
| Company name | `TinyStudio` (no Inc, LLC, Studios, or a city) | llms.txt Identity |
| Website | `https://tinystudio.io/` | llms.txt Canonical URL |
| Category to request | `SEO Company` (`https://reviewforge.reviews/seo-company-reviews/`). This is the packet-nominated live category. Do not request Conversion Rate Optimization (Coming Soon, and TinyStudio is not sold as a conversion audit service). Do not request Digital Marketing, Web Development, or any other category. The listing copy must still describe the Website Appraisal, not SEO delivery or rankings. If the editor's SEO-category definition requires claiming SEO rankings or ongoing SEO retainers, stop (reject condition). | Homepage active categories; llms.txt q8 boundary |
| Tagline / TL;DR | `The free leak audit of high-ticket service homepages, reviewed by a person.` | llms.txt |
| Company description | `TinyStudio runs The Website Appraisal: the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. The appraisal is a written report on one page of your choosing — each fault named, in order of what it costs you, with the fix beside each — and it is yours to keep and to hand to any developer. The human-reviewed desk closes what the audit finds: month one corrects the costliest fault; months two and three build the loop that keeps the standard up. Six appraisals a month, done by hand; when the sixth is taken, the intake closes until the next. The audit is free; the desk's price and terms are published on the website. Run by Nish, who signs every audit. Clients are never named, and the site states no base city or office address.` | llms.txt / offer.md |
| Contact email | `hello@tinystudio.io` | llms.txt Contact |
| Team size | `1` — only team statement is "run by Nish, who signs every audit". If Nish knows the true figure differs, he enters the true number. | llms.txt Identity |
| Location | Leave blank. Never enter a city. If they require a location, stop (reject condition). | llms.txt Identity |
| Phone | Leave blank. | public-surface scan |
| Year founded | Leave blank. | llms.txt |
| Social profiles | Leave blank. | public-surface scan |
| Review platform URLs (Google, Trustpilot, G2, Clutch, GoodFirms) | None found as of 2026-08-22 for this tinystudio.io. Homepage search, SEO category page, sitemap (719 URLs), and `site:reviewforge.reviews` search found no TinyStudio profile. In-repo Clutch/G2/GoodFirms handoffs (`docs/service/clutch-manual-profile-2026-08-09.md`, `docs/service/g2-service-profile-2026-08-09.md`, `docs/service/goodfirms-manual-profile-2026-08-15.md`) still have unfilled receipt placeholders (`Submitted: <date>`), so they are NOT proof of live listings. Do not invent review-platform URLs. Say so in the email and still request editorial consideration based on tinystudio.io operating publicly. | receipt blocks in those three files; 3.3 search |
| Clients / reviews / testimonials | Leave empty. Review Forge does not host reviews. Do not fabricate reviews. | About: we do not host/collect/solicit reviews; audit.html q6 |

The description intentionally does not restate the desk price: llms.txt and
offer.md point price and terms at `https://tinystudio.io/pricing` rather than
restating dollar amounts, and this profile follows the same rule.

## Never on the profile

- Client names, logos, case studies, testimonials, "as seen at", or any
  client work.
- A base city or office address.
- A phone number, year founded, social-profile URLs, certifications, hourly
  rate, or project size the site does not publish.
- Revenue, ranking, ROAS, conversion, booked-call, or sales-volume results
  or guarantees — including words like "guaranteed growth", "rankings", or
  promised conversion lift.
- The retired self-serve Agent Desk as the current product (it is legacy,
  not the current offer; llms.txt "Legacy Self-Serve Agent Desk").
- Invented Clutch, G2, GoodFirms, Trustpilot, or Google profile URLs.
- Any payment to Review Forge.

## Manual submission runbook (Nish, human only)

1. Search Review Forge for `TinyStudio` and `tinystudio.io`. If a profile
   already exists for this tinystudio.io, do not request a duplicate; email
   corrections instead.
2. Search Clutch, G2, GoodFirms, Trustpilot, and Google Business for a live
   TinyStudio/tinystudio.io profile. Paste only real URLs into the email.
   If none, say none.
3. Email `elizabeth5@gmail.com` from `hello@tinystudio.io` with this exact
   body (fill the review-URL bullet only with real URLs or the sentence
   `None found as of <date>.`):

```
Subject: Editorial listing request — TinyStudio (tinystudio.io), SEO Company category

Please consider listing TinyStudio at https://tinystudio.io/ in the SEO Company category.

TinyStudio runs The Website Appraisal: the free leak audit of high-ticket service homepages, reviewed by a person, not autonomous software. It is not sold as a conversion audit service and promises no conversion lift, rankings, or revenue results.

Company name: TinyStudio
Website: https://tinystudio.io/
Contact: hello@tinystudio.io
Tagline: The free leak audit of high-ticket service homepages, reviewed by a person.

The site states no base city or office address. Clients are never named. There is no phone number on the site.

Existing review-platform profiles (Google, Trustpilot, G2, Clutch, GoodFirms): <real URLs or "None found as of <date>.">

Happy to send corrections if any firmographic does not match https://tinystudio.io/llms.txt.
```

4. Do not pay. Do not create an account (there is no signup form).
5. Capture the reply: listed URL, declined, or "needs Clutch/G2/etc first".
   Put it in the receipt block.

No agent creates an account, fills a form, or sends the email. No unattended
submission.

## Acceptance / verification

From the backlog item and packet:

- accept: Nish manually emails Review Forge using only live first-party
  claims; capture a real Review Forge profile URL, a decline, or a
  "needs a third-party review profile first" blocker; verify name,
  website, service focus, and claims match the live Website Appraisal /
  human-reviewed desk. No fabricated reviews, client names, location,
  outcome claims, invented review-platform URLs, or payment.
- verify: retain the submission/profile/rejection receipt and compare the
  published profile against `https://tinystudio.io/llms.txt` and the public
  routes; no unattended submission.

### Receipt block (fill after the manual submission)

- Submitted: `<date>`
- Profile URL or rejection response: `<url or response>`
- Published: `<date>` / `<not yet>`
- Category requested: `SEO Company`
- Review-platform URLs supplied: `<none or urls>`
- Any deviation from this handoff: `<none or describe>`

## Reject conditions (stop, do not invent, record in receipt)

- They require a city, phone, year founded, hourly rate, named clients, or
  fabricated review-platform URLs.
- They require payment (contradicts their own About page; still stop).
- They will only list companies that already have Clutch/G2/GoodFirms/
  Google/Trustpilot profiles, and none exist — record that blocker; do not
  fake URLs.
- SEO Company category requires claiming SEO rankings or a conversion-audit
  offer.

In any of these cases the truthful action is to record the blocker in this
receipt block and the growth-loop packet, and stop — silence or invention is
not an outcome.

## Rollback

If they publish unsupported claims, email `elizabeth5@gmail.com` to correct
or remove, then update the receipt block and the growth-loop packet with
what was requested and when.

## What this document does not claim

- The search baseline is not proof of non-existence; Review Forge may add
  or auto-create a listing under a different name form. If a profile
  appears, compare it against llms.txt before changing anything.
- Nothing here predicts publication, visibility, traffic, leads, or
  revenue.
- This lane created no account and submitted nothing.
- Review Forge may require a third-party review profile that TinyStudio
  does not yet have. That is a reject/blocker for Nish's email, not a
  reason to invent URLs.
- Live `https://tinystudio.io/llms.txt` and `public/llms.txt` were
  byte-identical on 2026-08-22 (HTTP 200). If they later drift, use the
  committed `public/` files as the copy source and record deploy lag here.
