# llms.txt / offer.md identity mirror — repository-side AI-search clarification pass

Date: 2026-08-08
Scope: `public/llms.txt`, `public/offer.md`, `scripts/check-site.mjs`,
`scripts/test-agent-ui.mjs`, `evidence-fixtures/ai-search/README.md`.
This receipt records a deterministic, repository-side clarification. It is not
a live AI-search measurement and it claims nothing about any engine's answer
after this change.

## Why this pass exists

The controlled AI-search evidence (evidence-fixtures/ai-search/evidence.json,
captured 2026-08-06) shows the engines answering the name "TinyStudio" with
other businesses, not with tinystudio.io:

- `q1-what-tinystudio-does` / google: a Mac subtitle app, a fibre-arts
  magazine and a Swiss design agency (sources: fiberygoodness.com,
  apps.apple.com, tinystudio.ch).
- `q2-what-tinystudio-charges` / google: four different businesses priced.
- `q3-where-tinystudio-is-based` / google: six studios in six cities.
- `q4-who-tinystudio-works-with` / google: a video production studio.
- `q6-client-work` / google: Tiny Studio LLC.
- `q1` / bing and duckduckgo: tinystudio.ai and the fibre-arts magazine.

Every captured Google/Bing/DuckDuckGo run on that day is `wrong` or `absent`.
The machine-readable pair the engines are most likely to read — `llms.txt`
and its mirror `offer.md` — carried the disambiguation facts only in
`offer.md`; `llms.txt` had no Identity section, and no check held the two
files to the same identity facts. The pair also still described the retired
offer — "The Website Correction", founder-pilot pricing, an MSP-only buyer —
long after the public site renamed itself around the Website Appraisal.

## What changed

1. `public/llms.txt` gained a `## Identity` section that states, from
   first-party facts already on the site: TinyStudio is the business behind
   tinystudio.io; the free leak audit of high-ticket service homepages; the
   human-reviewed desk that closes what the audit finds; run by Nish, who
   signs every audit; the same-name businesses this TinyStudio is not (Mac
   subtitle app, fibre-arts magazine, design agency, video production studio,
   Los Angeles venue, unrelated studio LLC); and that the site states no base
   city or office address. It also links its machine-readable mirror
   (`https://tinystudio.io/offer.md`) and the audit page that embeds the
   AI-search evidence artifact (`https://tinystudio.io/audit.html`).
2. `public/offer.md` gained the reciprocal mirror link to
   `https://tinystudio.io/llms.txt` under its existing `## Identity` section.
3. Both files' offer sections were brought to the current public-site
   wording, with no new claims: The Website Appraisal is the free leak audit
   of high-ticket service homepages, reviewed by a person, not autonomous
   software; the human-reviewed desk closes what the audit finds (month one
   corrects the costliest fault; months two and three build the loop); the
   appraisal is a written report on one page of your choosing, yours to keep;
   six appraisals a month, done by hand; buyers are high-ticket service
   businesses (clinics, surgeons, dentists, spas, dealers, brokers) and
   clients are never named. Price and terms now point at
   `https://tinystudio.io/pricing.html`; the retired Website Correction /
   founder-pilot / MSP-buyer wording was removed, and the Homepage, audit
   page and fixture questions were the only sources the new sentences were
   drawn from.
4. `scripts/check-site.mjs` now fails when:
   - any of the identity facts is missing from `llms.txt` (they were already
     required on the homepage, the audit page and `offer.md`);
   - any same-name disambiguation fact drifts out of `llms.txt` or
     `offer.md` (the pair must stay aligned);
   - the pair stops linking each other, or `llms.txt` stops pointing at the
     audit page's evidence artifact;
   - any current-offer fact (the appraisal, the human-reviewed desk,
     high-ticket service buyers, the pricing.html pointer) drifts out of
     either file;
   - either file restates a dollar amount or refund language instead of
     pointing at pricing.html;
   - either file revives the retired Website Correction, founder-pilot, or
     "Managed IT, MSP" buyer framing;
   - a cited source in the fixture lacks a title, or a run cites the same URL
     twice (strict source-host/citation validation, unchanged URL rules).
5. `scripts/test-agent-ui.mjs` asserts the same invariants as unit tests.
6. `evidence-fixtures/ai-search/README.md` documents the mirror and the
   offer-framing rules in its "Tied surfaces" section.

## What deliberately did not change

- The fixture: `controlled-questions.json` and `evidence.json` are
  byte-identical. Historical runs, states and verbatim captures are retained
  exactly as recorded on 2026-08-06. The audit page embed was not touched.
- `public/index.html`, `public/audit.html`, `public/pricing.html` and the
  other public pages: no change; the new offer sentences were drawn from
  their existing wording, and the identity section already carries every
  fact the mirror requires.
- No new live engine runs were performed, and none are claimed. The strict
  states (`found` / `wrong` / `absent` / `not-tested`) are unchanged.

## What is tested and what is not

Tested: the mirror, offer-framing and citation guards are deterministic
static checks that fail loudly on drift; `npm run check` and `npm test` both
exercise them, and this change passes both.

Not tested: whether any engine will now answer with tinystudio.io, or read
the offer correctly. That is a live question this pass cannot answer, and
nothing here implies a ranking, visibility, lead or revenue outcome. The
honest measure of that question is a future controlled re-run recorded
through the same fixture, with a captured answer, cited sources and a strict
state.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All four checks pass on this commit; the fixture files' git hashes are
unchanged relative to the commit before this pass.
