# Search-intent bridge second pass: domain-valuation distinction on the conversion-audit bridge

Date: 2026-08-12
Scope: `public/index.html`, `public/llms.txt`, `public/offer.md`.
This receipt records the second, `[unreviewed-by-grok]` review pass over the
truthful search-intent bridge for "website conversion audit service" (backlog
item, scout 2026-08-09, risk: amber, traction). The first pass shipped via
PR #102 (`2ae7504`, `fix/conversion-audit-search-intent-bridge`) and its
receipt is `docs/evidence/conversion-audit-search-intent-bridge-2026-08-11.md`.
This pass checked the item's acceptance criteria against current origin/main
and closed the one element the first pass had not covered. It claims nothing
about any engine's answer or ranking; the live-search half of the item's
acceptance remains a recrawl-time measurement, not a repository change.

## What the first pass shipped (verified against origin/main `ad9cee3`)

- Homepage FAQ entry "Is this a conversion audit?" with a plain, truthful
  answer (no conversion-audit naming, no conversion-lift promise).
- Homepage identity block row `q8-conversion-audit` ("Is TinyStudio a
  conversion audit service" — No, with the leak-audit truth), keeping the
  homepage's "answers every controlled question" invariant.
- `evidence-fixtures/ai-search/controlled-questions.json` gained
  `q8-conversion-audit`; `public/audit.html` embeds the byte-for-byte-equal
  bundle; `public/llms.txt` and `public/offer.md` map the question to the
  homepage as its preferred source page and state the bridge in their
  Current Offer sections.
- No page, route, sitemap entry, link surface, product name, price, or
  guarantee changed.

## What this second pass found and closed

The item's acceptance criteria require the intent surface to "distinguish
human-reviewed evidence from instant AI audit output and domain valuation".
The first pass covered the conversion-audit half of that and the
human-reviewed/instant-AI distinction (four passes by hand, a person's name
on every audit, the AI-search evidence states on /audit) — but **nothing on
any owned surface distinguished The Website Appraisal from a domain-value
appraisal**. That distinction is the original problem that opened the item:
Google interprets "website appraisal service" as domain valuation
(GoDaddy/Dynadot/EstiBot/Saw in the scout's captured first page), and a
buyer or machine reader landing on the appraisal name had no plain answer
that the appraisal prices nothing and values no domain.

Closed with copy-only changes, keeping the product name and the
no-guarantees boundary intact:

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

- `npm test` passes all suites (92 tests, 0 failures) including the
  forbidden-claims scan, the llms.txt/offer.md mirror rules, the homepage
  disambiguation invariant, the embed/fixture equality guard, and the locked
  heading outline.
- `npm run check` passes.
- `git diff --check` is clean.
