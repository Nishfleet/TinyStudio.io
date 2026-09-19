# docs/service/g2-service-profile-2026-08-09.md — re-verify report (2026-08-20, lane 1)

- Branch: `docs/g2-service-profile-rereverify-2026-08-20`
- Commit: 274b1a1 (single commit on this branch; off `origin/main` head d0daea9)
- Repo head at re-verify time: `d0daea9` "evidence(ai-search): controlled entity-and-offer re-run with first Found transitions (2026-08-15) (#227)"
- Previous re-verify commit: `e9fc96a` (2026-08-14)
- Live site date: 2026-08-20

## What this lane changed

One new re-verify section appended to `docs/service/g2-service-profile-2026-08-09.md`
under "Re-verification (added 2026-08-20, lane 1)". It records:

1. Commit-count scope (126 commits since `e9fc96a`, 21 touching `public/`).
2. The 11 public-touching commits that change identity/offer/contact/price/boundary
   strings (76fe17b, ed2b1a9, 23a7f06, 9b0589a5, c4475858, ffc1672b, 798cd71a,
   43cc831, 66f7bd6, dda25f2, 9f79c71), distinguishing them from the
   semantic/layout-only changes (0e7373fe, 2d8599a4, a654ab49).
3. Diff stat: 8 public files changed, 58 insertions(+), 50 deletions(-); diffs are
   clean-URL canonical/og:url/JSON-LD rewrites on `/agents`, `/pricing`,
   `/specimen`, brief-requested internal-link rewrite, controlled-question URL
   list and price-and-terms pointer in `llms.txt`/`offer.md` migrated to the
   clean canonical, new domain-valuation distinction paragraph in `llms.txt`/
   `offer.md`, intake-form `<label>` markup on `/` and `/audit`, source-only
   TinyStudio-branded footer on `/pricing` and `/brief-requested` (live still
   serves "The Tiny Studio" — deployment lag), new signup form in the `/pricing`
   callout, refreshed study figures (89→91 readable, 53→56 with no FAQ),
   retired `/agent-desk` clean canonical, `autocomplete="email"` on email input.
4. Live surface checks (all 2026-08-20):
   - `https://tinystudio.io/llms.txt` and `https://tinystudio.io/offer.md`:
     byte-identical to source (curl diff: zero differences). Verbatim offer,
     "reviewed by a person, not autonomous software", six-a-month cap,
     "run by Nish, who signs every audit", no base city, clients never named,
     contact `hello@tinystudio.io`, price pointer to `https://tinystudio.io/pricing`,
     domain-value boundary ("Nor is the appraisal a domain-value estimate: no
     domain is priced and no resale value is estimated"), conversion-audit
     boundary ("TinyStudio is not sold as a conversion audit service, so no
     conversion lift is promised").
   - `https://tinystudio.io/pricing`: HTTP 200 (clean URL; `pricing.html`
     307-redirects); four occurrences of "the appraisal is free, the desk is
     $2,500 a month on a three-month minimum"; zero occurrences of "hourly rate",
     "project size", or "minimum project". Deployment lag noted: source footer
     now reads "TinyStudio · tinystudio.io" but live still reads "The Tiny Studio";
     source canonical now points to `/pricing` but live still points to
     `/pricing.html`. Functionally both resolve to the same page.
   - `https://tinystudio.io/audit`: HTTP 200; q3 still answered with "The site
     does not state a base city or office address"; q6 still answered with
     "no logos, no case studies, no testimonials, no 'as seen at'".
   - `https://tinystudio.io/`: HTTP 200; "Where TinyStudio is based" disclosure
     and "Request the appraisal" intake CTA present.
5. G2 official-page re-fetch (2026-08-20, plain HTTP): all three sources
   (`sell.g2.com/create-a-profile`, `g2digitalmarkets.com/listing-guidelines`,
   `research.g2.com/methodology/research-faq`) still document the flow and
   copy rules this handoff relies on. Listing Guidelines still "Last updated on
   May 4, 2026"; all copy rules (no first-person, no URLs/email/CTA in
   description, no superlatives, no suffixes) intact.
6. Repository checks on this head pass: `node scripts/check-site.mjs` returns
   "TinyStudio.io checks passed." and `node --test scripts/test-*.mjs` runs
   128 tests across 9 suites, all green, exit 0.

## Truthfulness fix in the base content (this lane)

The two active references to the price-and-terms pointer now read
`https://tinystudio.io/pricing` (the site's own clean canonical;
`pricing.html` 307-redirects to it) instead of the legacy
`https://tinystudio.io/pricing.html`. This matches:

- the 2026-08-15 fix the parallel Clutch handoff landed, and
- the live source files on this head (`public/llms.txt`, `public/offer.md`,
  `public/pricing.html`), all of which already point at the clean canonical.

Historical re-verify sections were left untouched. The change is a pointer
correction; the offer, price, contact, and boundary strings are unchanged.

## What this lane did not change

- The "Prepared profile content (copy-paste)" table is unchanged. Every value
  still maps to live first-party text.
- The "Never on the profile" list is unchanged. No boundary string weakened.
- The "Manual submission runbook (Nish, human only)" is unchanged. The
  submission remains a human action by Nish; nothing automated.
- The "Acceptance / verification" criteria are unchanged.
- The "Reject conditions" list is unchanged. None of the four blockers triggered.
- The receipt block remains unfilled; no G2 profile URL or rejection exists in
  the product state on this head.
- The 2026-08-09 external-search baseline was not re-run this lane (public search
  endpoints have blocked scripted queries from the VPS in previous lanes).
  The 2026-08-09 baseline stands with its own caveat: it is a baseline, not
  proof of non-existence.

## Outcome

Same result as the 2026-08-09 preparation and the 2026-08-11, 2026-08-12,
and 2026-08-14 re-verifications: every field in the table can still be
filled truthfully from live first-party surfaces, nothing needs to move
to the "Never on the profile" list, and no reject condition is triggered.
The handoff is ready for Nish's manual submission with the canonical price
pointer corrected.

## Verification commands run

```
curl -sS -o /tmp/llms-live.txt https://tinystudio.io/llms.txt  # HTTP 200; byte-identical to public/llms.txt
curl -sSL -o /tmp/offer-live.md https://tinystudio.io/offer.md  # HTTP 200; byte-identical to public/offer.md
curl -sSL -o /tmp/pricing-live.html https://tinystudio.io/pricing  # HTTP 200; price string x4; no hourly/project figures
curl -sSL -o /tmp/audit-live.html https://tinystudio.io/audit  # HTTP 200; q3/q6 answers present
node scripts/check-site.mjs  # "TinyStudio.io checks passed."
node --test scripts/test-*.mjs  # 128 tests, 9 suites, all green
git diff --stat e9fc96a..origin/main -- public/llms.txt public/offer.md \
  public/pricing.html public/audit.html public/index.html public/agents.html \
  public/specimen.html public/brief-requested.html  # 8 files, +58/-50
git log --oneline e9fc96a..origin/main -- public/  # 21 commits
git log --oneline e9fc96a..origin/main  # 126 commits
```
