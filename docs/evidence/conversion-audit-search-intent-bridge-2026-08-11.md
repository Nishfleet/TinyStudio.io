# Truthful search-intent bridge for "website conversion audit service" — repository-side declaration pass

Date: 2026-08-11
Scope: `public/index.html`, `public/audit.html`, `public/llms.txt`,
`public/offer.md`, `evidence-fixtures/ai-search/controlled-questions.json`,
`scripts/test-heading-hierarchy.mjs`.
This receipt records a deterministic, repository-side declaration. It is not
a live search-engine measurement and it claims nothing about any engine's
answer or ranking after this change.

## Why this pass exists

A buyer who searches "website conversion audit service" has a specific intent:
find the points where ready-to-buy visitors leave a page, and what each one
costs. TinyStudio's offer — The Website Appraisal, the free leak audit of
high-ticket service homepages — is the truthful nearest match to that intent,
but no owned surface spoke the phrase, so the search intent had nothing to
connect to. The gap cut both ways: a human searcher could not tell whether
the site was what they were looking for, and a machine reader asked "is this
a conversion audit service?" had no controlled answer and no declared
preferred source page.

The fix had to be a *truthful* bridge: it may not rename TinyStudio or The
Website Appraisal, and it must not claim to be a conversion audit service or
promise a conversion lift — the repo's no-guarantees boundary forbids
revenue, ranking, ROAS, conversion, booked-call, and sales-volume promises
(`MEMORY.md`, `offer.md` "Not Promised", `scripts/check-site.mjs`
`forbiddenClaims`).

## What changed

1. `public/index.html` — the homepage FAQ ("Before you ask") gained the entry
   "Is this a conversion audit?", answered plainly: not by that name, the
   appraisal is the leak audit (money page read the way a customer with
   intent reads it, each fault named in order of what it costs you, fix
   beside each), and no conversion lift is sold because nobody can promise
   one. The identity block gained the controlled-question row
   `q8-conversion-audit` ("Is TinyStudio a conversion audit service" — No,
   with the leak-audit truth), keeping the homepage's "answers every
   controlled question" invariant.
2. `evidence-fixtures/ai-search/controlled-questions.json` — the registry
   gained `q8-conversion-audit` (stable id, name, exact prompt, truth drawn
   from the site). No runs were added: the registry gains a question without
   requiring a run, and the captured runs never change to match the site.
3. `public/audit.html` — the embedded evidence bundle now carries q8 (the
   drift guard compares it byte-for-byte with the fixture), and the artifact
   copy says eight named questions.
4. `public/llms.txt` and `public/offer.md` — the machine-readable pair maps
   `q8-conversion-audit` to the homepage as its preferred source page (the
   page that owns the fact), and both Current Offer sections state the
   bridge: a "conversion audit" search intent is answered truthfully, the
   appraisal is the leak audit of the money page, and TinyStudio is not sold
   as a conversion audit service, so no conversion lift is promised.
5. `scripts/test-heading-hierarchy.mjs` — the locked homepage outline gained
   the two new h3 rows (identity block and FAQ), so the exact-outline guard
   still locks the page deliberately.

## What deliberately did not change

- The product name: TinyStudio and The Website Appraisal are not renamed, and
  no surface claims to be a "conversion audit service".
- The offer, price, terms, refunds, and guarantees: no dollar amount, refund
  language, or conversion/revenue promise was added anywhere; `pricing.html`
  still owns the price.
- The captured AI-search evidence: `evidence.json` and all runs are
  byte-identical; only the controlled-question registry grew.
- No new page, route, sitemap entry, or link surface.

## Verification

- `npm test` passes all six suites (check-site, heading hierarchy, sitemap,
  worker, agent UI, product contract) — 90 tests, 0 failures — including the
  mirror rule for the new mapping, the homepage disambiguation invariant, the
  embed/fixture equality guard, the locked heading outline, and the
  forbidden-claims scan.
- `npx wrangler@latest deploy --dry-run` exits clean.
- `git diff --check` is clean.
