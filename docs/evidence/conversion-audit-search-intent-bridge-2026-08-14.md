# Search-intent bridge closeout: domain-valuation distinction on the conversion-audit bridge

Date: 2026-08-14
Scope: `public/index.html`, `public/llms.txt`, `public/offer.md`.
This receipt closes the search-intent bridge for "website conversion audit
service" (backlog item c8d7048dba) against current origin/main. It records a
deterministic, repository-side declaration only. It is not a live
search-engine measurement and claims nothing about any engine's answer or
ranking after this change; the live-search half of the item's acceptance
remains a recrawl-time measurement.

## Why this pass exists

The first pass shipped via PR #102 (`2ae7504`,
`fix/conversion-audit-search-intent-bridge`), receipt
`docs/evidence/conversion-audit-search-intent-bridge-2026-08-11.md`: the
homepage FAQ answers "Is this a conversion audit?" plainly, the identity
block carries controlled-question row `q8-conversion-audit`, and the
llms.txt / offer.md pair mirrors the bridge statement in Current Offer. That
met the conversion-audit half of the item's acceptance criteria.

The item also requires the intent surface to distinguish The Website
Appraisal from a *domain-value appraisal*: Google reads "website appraisal
service" as domain valuation, and no owned surface answered that confusion.
That distinction never landed on main. The second-pass branch
`fix/conversion-audit-bridge-domain-valuation` (PR #151) carried the copy
but drifted 120 commits behind main and was never merged, so main's intent
surface still stopped at the conversion-audit answer. This lane re-applies
the copy-only distinction against current origin/main head `5c6521a`.

## What changed

Copy-only, keeping the product name and the no-guarantees boundary intact:

1. `public/index.html` — the "Is this a conversion audit?" FAQ answer now
   states plainly: the appraisal is not a domain-value appraisal; no domain
   is priced, no resale estimate is made, and the report puts no value on
   the site itself.
2. `public/llms.txt` and `public/offer.md` — the machine-readable pair
   mirrors the same sentence in the Current Offer bridge statement, so the
   two mirrors cannot drift apart.

## What deliberately did not change

- The product names (TinyStudio, The Website Appraisal), the offer, the
  price, refund terms, and the guarantee posture.
- `controlled-questions.json`, `evidence.json`, and the /audit embedded
  bundle: `q8-conversion-audit` answers the conversion-audit question and is
  untouched; captured runs are byte-identical.
- No new page, route, sitemap entry, or link surface.

## Verification

- `npm test` passes all suites, including the forbidden-claims scan, the
  llms.txt/offer.md mirror rules, the homepage disambiguation invariant, the
  embed/fixture equality guard, and the locked heading outline.
- `npm run check` passes.
- `git diff --check` is clean.
