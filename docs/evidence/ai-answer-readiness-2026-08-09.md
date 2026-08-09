# Answer Readiness: preferred source pages — repository-side declaration pass

Date: 2026-08-09
Scope: `public/llms.txt`, `public/offer.md`, `scripts/check-site.mjs`,
`scripts/test-agent-ui.mjs`, `evidence-fixtures/ai-search/README.md`.
This receipt records a deterministic, repository-side declaration. It is not
a live AI-search measurement and it claims nothing about any engine's answer
after this change.

## Why this pass exists

Dogfood finding 4473a99a9bc9 from audit run 20260808T074205Z-msk2fl3n:
"AI Answer Readiness: preferred source pages are unclear." The controlled
AI-search evidence shows what that costs:

- `q5-what-is-tinystudio-io` / google (`wrong`): the engine named
  tinystudio.io but described the retired Agent Desk — "an AI agent platform
  designed to turn business strategies ... into practical lead-to-call
  execution plans" — while the cited page, the homepage, presents the leak
  audit first. The engine read the right site and still grabbed the wrong
  description: nothing told it the homepage is the preferred source for
  "what TinyStudio is".
- `q7-what-tinystudio-io-charges` / google (`absent`): the organic results
  carried the note "Missing: pricing" even though `pricing.html` states the
  price. Nothing pointed the engine at `pricing.html` as the preferred
  source for the price.

Neither `llms.txt` nor `offer.md` declared which page owns which fact, so an
engine had to guess which of the five public pages to read for each question
a buyer asks before committing.

## What changed

1. `public/llms.txt` gained an `## Answer Readiness: Preferred Source Pages`
   section: one bullet per controlled question, each naming exactly one
   preferred source page — the page that owns the fact. "What TinyStudio
   does" and "What is tinystudio.io" map to the homepage, whose identity
   block answers them (q1 and q5); the price questions (q2, q7) map to
   `pricing.html`, which owns the price; where-based, who-with and
   client-work (q3, q4, q6) map to the audit page, which carries those
   statements and the evidence artifact.
2. `public/offer.md` mirrors the same heading and the same seven mapping
   lines, so the machine-readable pair cannot drift.
3. `scripts/check-site.mjs` now fails when:
   - either file loses the Answer Readiness section;
   - a controlled question is unmapped, mapped to two pages, or mapped to a
     page the worker does not serve (membership checked against the sitemap
     loc set, excluding `llms.txt` and `offer.md` themselves);
   - a price question (q2, q7) maps anywhere but `pricing.html`;
   - the mirror drifts (the two files no longer carry the same
     question-to-page mapping).
4. `scripts/test-agent-ui.mjs` asserts the same invariants as unit tests.
5. `evidence-fixtures/ai-search/README.md` documents the mapping in its
   "Tied surfaces" section, citing the finding it answers.

## What deliberately did not change

- The fixture: `controlled-questions.json` and `evidence.json` are
  byte-identical. Historical runs, states and verbatim captures are retained
  exactly as recorded on 2026-08-06. The audit page embed was not touched.
- No public page markup changed; the mapping only names pages that already
  state the facts it points at.
- No new live engine runs were performed, and none are claimed. The strict
  states (`found` / `wrong` / `absent` / `not-tested`) are unchanged.

## What is tested and what is not

Tested: the section, coverage, served-page membership, price ownership and
mirror guards are deterministic static checks that fail loudly on drift;
`npm run check` and `npm test` both exercise them, and this change passes
both.

Not tested: whether any engine will now cite the preferred page, or answer
the price. That is a live question this pass cannot answer, and nothing here
implies a ranking, visibility, lead or revenue outcome. The honest measure
of that question is a future controlled re-run recorded through the same
fixture, with a captured answer, cited sources and a strict state.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit; the fixture files' git hashes are
unchanged relative to the commit before this pass.

## Closeout

This closes dogfood finding 4473a99a9bc9 ("AI Answer Readiness: preferred
source pages are unclear") against current main: the machine-readable pair
now declares, per controlled question, the preferred source page an engine
should read first, and CI fails if that declaration drifts, unmaps a
question, names an unserved page, or lets a price question point anywhere
but `pricing.html`.
