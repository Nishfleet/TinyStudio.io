# TinyStudio — UpCity profile: venue-shutdown finding (blocked)

Date: 2026-08-21
Scope: `docs/service/upcity-manual-profile-2026-08-21.md` — the evidence record
for the work item "Prepare a truthful manual UpCity profile for the
human-reviewed Website Appraisal" [research desk 2026-08-21, risk: amber,
traction, NEEDS-NISH]. Internal operator document. It records why a truthful
manual UpCity profile cannot be prepared, so the backlog item can be closed
rather than re-dispatched.

## Outcome

**Blocked — the venue no longer exists.** UpCity (upcity.com) was shut down in
late November 2025 by its owner, Gartner Digital Markets, and its domain now
serves a "This site is no longer supported… visit Capterra" message. There is
no UpCity platform on which to create or claim a TinyStudio profile in 2026.
The truthful action is to close the backlog item as blocked, not to prepare a
profile handoff.

This is not the same as the Clutch/G2/GoodFirms items: those venues are live
and their handoffs remain actionable. UpCity's venue is gone, so no amount of
truthful first-party copy can be submitted anywhere.

## The GMB blocker is moot

The research-desk packet (2026-08-21) quoted UpCity's Community Guidelines —
"All providers in the community are required to have a Google My Business
listing" — and flagged that TinyStudio's llms.txt states "The site states no
base city or office address", requiring Nish's decision on whether to create a
GMB listing. That requirement is now moot: the guidelines page it came from no
longer exists because the whole site is offline.

## Evidence (verified 2026-08-21)

### UpCity's domain is offline

- `www.upcity.com` does not resolve: `dig`/`getent` from this VPS returns no
  A record, and the browser tool reports `NS_ERROR_UNKNOWN_HOST` for
  `https://www.upcity.com/providers/`.
- `https://upcity.com/providers/` (apex) times out on connection (curl exit
  28, no HTTP response) from this VPS, via direct fetch, and via the browser
  tool.
- Wayback Machine capture of `https://www.upcity.com/our-community/guidelines/`
  from 2026-03-09 (`web.archive.org/web/20260309225644/`) serves, verbatim:
  "This site is no longer supported. If you are looking for help finding
  software, please visit Capterra." — a decommissioning message, not the
  guidelines content.
- Independent industry coverage dates the shutdown to late November 2025 and
  confirms the redirect to Capterra: "UpCity Shuts Down: Website Offline as
  Users Are Redirected to Capterra" (jeffsocialmarketing.com, 2025-11),
  "UpCity Shuts Down — What Agencies And Small Businesses Need To Know"
  (searchengineprojects.com), and "UpCity Shut Down Without Warning"
  (bigredseo.com). Gartner Digital Markets also divested Capterra, Software
  Advice, and GetApp to G2 in January 2026.

### The research-desk packet's page quotes are stale

The packet cites `upcity.com/providers/`, `upcity.com/our-community/guidelines/`,
and `upcity.com/our-community/methodology/` as "fetched 2026-08-21". The live
domain does not serve those pages today. The quoted strings ("Claim your free
UpCity profile…", "All providers in the community are required to have a
Google My Business listing", "Recommendability Ratings cannot be purchased")
match archived pre-shutdown captures — for example the 2025-11-07 Wayback
capture of `/providers/` ("Claim your free UpCity profile and start gathering
customer reviews to reach millions of active buyers across UpCity and
Capterra — Gartner Digital Markets' sites for service providers") and the
2025-11-07 capture of `/our-community/methodology/` ("Recommendability
Ratings cannot be purchased"). The packet likely captured cached or archived
content after the domain went offline. Either way, the venue is not live.

### TinyStudio's live product truth (unchanged, re-verified 2026-08-21)

- Live `https://tinystudio.io/` and `https://tinystudio.io/llms.txt` both
  return HTTP 200.
- Live llms.txt still states: the offer ("The Website Appraisal — the free
  leak audit of high-ticket service homepages — and the human-reviewed desk
  that closes what the audit finds"), "reviewed by a person, not autonomous
  software", "Six appraisals a month, done by hand", "run by Nish, who signs
  every audit", "The site states no base city or office address", "clients
  are never named", "Contact: hello@tinystudio.io", and the price-and-terms
  pointer to `https://tinystudio.io/pricing`.
- `public/llms.txt` and `public/offer.md` on this branch are byte-identical to
  the live served bytes (curl diff: zero differences).

## What this finding does not claim

- It does not claim UpCity will never return. If UpCity (or a successor
  service) becomes live again, the backlog item can be re-filed and a
  truthful handoff prepared against the then-current venue.
- It does not claim the 2026-08-21 packet fabricated evidence. The quoted
  policy strings match pre-shutdown archived captures; the packet's fetch
  simply post-dates the venue's decommissioning.
- It makes no recommendation about Capterra. Capterra is a separate venue with
  its own listing rules and is out of scope for this item.

## Recommendation

1. Close the backlog item as **blocked — venue shut down** (this finding is
   the receipt).
2. Optionally annotate the growth-loop packet `upcity-manual-listing.md` with
   this finding so future research desks do not re-surface UpCity.
3. Do not create a profile on the live Capterra service surface without a
   fresh, separate research-desk item — Capterra's provider listing rules are
   not covered by this item's packet.

## Verification

- `git diff --check` is clean on this branch.
- `npm run check` and `npm test` pass on this branch (no public surfaces
  changed; this is a docs-only finding).
