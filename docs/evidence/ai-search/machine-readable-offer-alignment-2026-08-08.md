# Machine-readable offer aligned to the rendered routes

Date: 2026-08-08
Scope: public/llms.txt, public/offer.md, scripts/check-site.mjs, scripts/test-agent-ui.mjs

## The defect

The machine-readable offer contract (`public/llms.txt`, `public/offer.md`)
sold a different product from every rendered route and from the controlled
AI-search ground truths:

- `llms.txt`/`offer.md` stated "The Website Correction", $1,000 founder
  pilots, a buyer of "founder-led Managed IT, MSP, and cybersecurity
  companies", and a seven-working-day single-page fix.
- The rendered routes (`/`, `/audit`, `/pricing`) present The Website
  Appraisal — a free leak audit of high-ticket service homepages — plus The
  Growth Desk at $2,500 a month on a three-month minimum, six audits a month,
  findings in five working days, and a delivery guarantee.
- `evidence-fixtures/ai-search/controlled-questions.json` carries truths
  drawn from the live site (per `evidence-fixtures/ai-search/README.md`) —
  the same leak audit and $2,500 Growth Desk facts. `llms.txt` also carried
  none of the "which TinyStudio" disambiguation every other owned surface
  states, which is the one surface an AI reader is most likely to consume.

An AI reader of `llms.txt` therefore answered the controlled questions
("What does TinyStudio do?", "How much does TinyStudio charge?", "Who does
TinyStudio work with?") with facts that contradict the site's own answers.
That is a root-cause entity/offer inconsistency, not a wording issue.

## The resolution

The rendered routes and the controlled-question truths are the authoritative
product claims — the fixture README says truths are "drawn from the live
site, not from what we wish were true". `llms.txt` and `offer.md` now state
the same offer as the site, and `llms.txt` gains the identity
disambiguation the other owned surfaces already carried.

- `public/llms.txt`: identity block, current offer (The Website Appraisal +
  The Growth Desk), delivery guarantee, seven specialists with a human
  signature, study evidence, no-guarantee list, data handling, legacy Agent
  Desk with its safety rails.
- `public/offer.md`: the same contract in offer-sheet form; the `## Identity`
  section is unchanged.
- `scripts/check-site.mjs`: `requiredPublicArtifacts` now asserts the aligned
  facts in both files, a new guard refuses the retired Website Correction
  pitch in the machine-readable contract, and the identity facts are now
  required in `llms.txt` too.
- `scripts/test-agent-ui.mjs`: mirrors the same assertions in node:test form.

## Not changed, not claimed

- `evidence-fixtures/ai-search/*` stays byte-identical; the four strict
  states and every captured run are retained as the historical record.
- No pricing or legal copy on rendered pages was touched; the $2,500 figure
  and the delivery guarantee are the site's own.
- No live AI-search result is claimed or fabricated, and no new engine runs
  were made. This is a repository-side consistency correction only.

## Verification

`npm run check`, `npm test`, `git diff --check`, and `sgscan` all pass; see
the implementation handoff for the exact outputs.
