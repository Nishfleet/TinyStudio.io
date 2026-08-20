# Lane report: AI-search entity-and-offer controlled re-run (2026-08-20)

Lane: tinystudio-io lane 1
Branch: `docs/ai-search-entity-offer-rereverify-2026-08-20`
Item: `6efb99cca9` — "[unreviewed-by-opus] Re-establish verified AI-search entity and offer understanding after the 2026-08-08 15:04 liv"

## Outcome

The item's accept criterion is met again. The controlled re-run on
2026-08-20 (Google AI Overview q1-q8, Bing q1/q5/q7, DuckDuckGo q1/q2/q5,
anonymous sessions from the VPS Camoufox browser) recorded **four `found`
runs**, including **two new `wrong` → `found` transitions**:

- `q5-what-is-tinystudio-io` / google — `found` (holds from 08-15). AI
  Overview: "tinystudio.io is a boutique digital service run by a single
  operator named Nish... free website 'leak audits' for high-ticket service
  homepages... human-reviewed 'Growth Desk' service ($2,500/month)", citing
  tinystudio.io and tinystudio.io/pricing.
- `q6-client-work` / google — **new transition** `wrong` → `found`. AI
  Overview: "No, the website appraisal service TinyStudio explicitly states
  that it does not publish client work... no logos, no case studies, no
  testimonials", citing tinystudio.io.
- `q7-what-tinystudio-io-charges` / google — `found` (holds from 08-15). AI
  Overview: "$2,500 per month with a three-month minimum commitment... Homepage
  Leak Audit: Free", citing tinystudio.io and tinystudio.io/pricing.
- `q8-conversion-audit` / google — **new transition** `wrong` → `found`. AI
  Overview: "No, TinyStudio explicitly states it is not a conversion audit
  service, and it does not promise any conversion lift", citing
  tinystudio.io. (The 08-15 run opened with "Yes" and was recorded wrong;
  today's answer opens with "No" and matches the ground truth.)

The remaining runs stay honestly `wrong` (6) or `absent` (4): Google q2/q3
returned "Can't generate an AI overview right now. Try again later." on
both a first load and a same-session retry (recorded `absent` because we
ran the question and no answer came back; both were `wrong` on 08-15);
Bing q5/q7 absent with the tinystudio.io organic listing still carrying the
retired "TinyStudio Agent Desk" title (the same index lag as 08-09/08-12/
08-15); plus the two unchanged `not-tested` (ChatGPT, Perplexity).

## What was done

1. **Captures** — executed every runnable question-and-engine pair from
   the controlled registry on 2026-08-20; verbatim answers and cited URLs
   recorded in `evidence-fixtures/ai-search/evidence.json`, `testedOn`
   moved to 2026-08-20. Google was reachable from this host this date;
   q2/q3 served no AI Overview (recorded `absent` after a same-session
   retry each).
2. **Bundle** — regenerated the embedded `#ai-search-evidence` bundle in
   `public/audit.html`; the drift guard confirms byte-for-byte equality
   with the fixtures.
3. **Tests** — updated the q5/google wording assertion in
   `scripts/test-agent-ui.mjs` to the 2026-08-20 capture. Full suite
   passes.
4. **Receipt** — `docs/evidence/ai-search/2026-08-20-controlled-rerun.md`
   records the run, the four `found` runs (two new transitions), the honest
   `wrong`/`absent` remainder and the reproduction block.

## Files changed

- `evidence-fixtures/ai-search/evidence.json` — fresh 2026-08-20 captures
  (4 found, 6 wrong, 4 absent, 2 not-tested).
- `public/audit.html` — embedded bundle regenerated from fixtures.
- `scripts/test-agent-ui.mjs` — q5/google wording assertion updated to the
  current verified capture.
- `docs/evidence/ai-search/2026-08-20-controlled-rerun.md` — evidence
  receipt (new).
- `.lane/reports/docs-ai-search-entity-offer-rereverify-2026-08-20.md` —
  this report (new).

## Verification commands

- `npm run check` → "TinyStudio.io checks passed."
- `npm test` → 126 tests, 0 failures (7 suites).
- `git diff --check` → clean.

## Honest boundary

This is a one-day measurement on one set of engines, not a ranking or
visibility promise. Bing and DuckDuckGo still answer from other businesses
and their tinystudio.io organic listings still carry the retired Agent
Desk title (index lag outside this repo's control); Google q2/q3 served no
AI Overview on this date; ChatGPT and Perplexity remain `not-tested`. The
`found` runs are recorded against the strict-state rules with their full
citations, including the wrong-business sources the AI Overviews also
cited.
