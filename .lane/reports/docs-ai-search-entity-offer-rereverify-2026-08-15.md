# Lane report: AI-search entity-and-offer controlled re-run (2026-08-15)

Lane: tinystudio-io lane 1
Branch: `docs/ai-search-entity-offer-rereverify-2026-08-15`
Item: `6efb99cca9` — "[unreviewed-by-opus] Re-establish verified AI-search entity and offer understanding after the 2026-08-08 15:04 liv"

## Outcome

The item's accept criterion is met for the first time. The controlled
re-run on 2026-08-15 (Google AI Overview q1-q8, Bing q1/q5/q7, DuckDuckGo
q1/q2/q5, anonymous sessions from the VPS Camoufox browser) recorded **two
`wrong` → `found` transitions**:

- `q5-what-is-tinystudio-io` / google — AI Overview: "TinyStudio is a
  specialized platform offering free website leak audits for high-ticket
  service homepages, along with a managed agent desk service priced at
  $2,500 a month", citing tinystudio.io.
- `q7-what-tinystudio-io-charges` / google — AI Overview: free audit;
  $2,500/month desk on a three-month minimum, citing tinystudio.io; the
  organic listing now shows the correct "TinyStudio — The Website
  Appraisal" title.

The remaining runs stay honestly `wrong` (9) or `absent` (2, both Bing,
whose organic tinystudio.io listing still carries the retired "TinyStudio
Agent Desk" title — the same index lag as 08-09/08-12), plus the two
unchanged `not-tested` (ChatGPT, Perplexity).

## What was done

1. **Captures** — executed every runnable question-and-engine pair from
   the controlled registry on 2026-08-15; verbatim answers and cited URLs
   recorded in `evidence-fixtures/ai-search/evidence.json`, `testedOn`
   moved to 2026-08-15. Google was reachable from this host this date
   (no CAPTCHA, unlike 2026-08-12).
2. **Bundle** — regenerated the embedded `#ai-search-evidence` bundle in
   `public/audit.html`; the drift guard confirms byte-for-byte equality
   with the fixtures.
3. **Tests** — updated the two UI tests that hard-coded the retired
   "all wrong / q5 wrong" expectations to assert the current verified
   record (all four states present; q5/google `found` with tinystudio.io
   citation and no page-specific fix). Full suite passes.
4. **Receipt** — `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`
   records the run, the transitions, the honest `wrong`/`absent` remainder
   and the reproduction block.

## Files changed

- `evidence-fixtures/ai-search/evidence.json` — fresh 2026-08-15 captures
  (2 found, 9 wrong, 2 absent, 2 not-tested).
- `public/audit.html` — embedded bundle regenerated from fixtures.
- `scripts/test-agent-ui.mjs` — state-structure and q5 tests assert the
  current verified record.
- `docs/evidence/ai-search/2026-08-15-controlled-rerun.md` — evidence
  receipt (new).
- `.lane/reports/docs-ai-search-entity-offer-rereverify-2026-08-15.md` —
  this report (new).

## Verification commands

- `npm run check` → "TinyStudio.io checks passed."
- `npm test` → 121 tests, 0 failures (headings 6/6, sitemap 7/7, worker
  80/80, ui 16/16, contract 8/8, viewport 4/4, narrow suites pass).
- `git diff --check` → clean.

## Honest boundary

This is a one-day measurement on one set of engines, not a ranking or
visibility promise. Bing and DuckDuckGo still answer from other businesses
and their tinystudio.io organic listings still carry the retired Agent
Desk title (index lag outside this repo's control); ChatGPT and Perplexity
remain `not-tested`. The `found` transitions are recorded against the
strict-state rules with their full citations, including the wrong-business
sources the AI Overviews also cited.
