# Controlled AI-search re-run — fresh entity-and-offer captures (Bing, DuckDuckGo) with the Google run blocked

Date: 2026-08-12
Scope: `evidence-fixtures/ai-search/evidence.json`, `public/audit.html` (embedded
bundle).
This receipt records a controlled re-run of the named entity-and-offer
questions against the engines reachable from this environment on 2026-08-12:
DuckDuckGo Search Assist (q1, q2, q5) and Bing's AI-generated answer (q1, q5,
q7). It is a measurement, not a fix, and it claims nothing about ranking,
leads, visibility, or any engine's future answer.

## Why this pass exists

The backlog item "Re-establish verified AI-search entity and offer
understanding after the 2026-08-08 15:04 live recheck" tracks the live
`/audit` AI-search panel. The previous controlled re-run (2026-08-09,
commit efbc355, branch `fix/ai-search-rerun-entity-offer`) was never merged
to `origin/main`, so the live panel still rendered the 2026-08-06 captures.
This lane re-establishes the fixture's verified record on main with fresh
captures from 2026-08-12. The item's accept requires a controlled before/
after re-run of the same named questions and engines with verbatim answers,
cited URLs, engine, date, and strict `found / wrong / absent / not-tested`
states, claiming page-specific remediation only when an answer cites a
tinystudio.io page. This pass is that re-run for the engines that could be
executed.

## What was run

Same questions as the controlled registry, anonymous sessions, English (US),
no personalisation, executed 2026-08-12 from the VPS (Camoufox browser):

- DuckDuckGo Search Assist: `q1` What does TinyStudio do?, `q2` How much does
  TinyStudio charge?, `q5` What is tinystudio.io?
- Bing AI-generated answer: `q1` What does TinyStudio do?, `q5` What is
  tinystudio.io?, `q7` tinystudio.io pricing.
- Google AI Overview: **not run**. Every Google surface
  (www.google.com/search, google.co.uk, `gbv=1`, `udm=14`) returned the
  `/sorry/` CAPTCHA for this VPS IP on 2026-08-12. The last verified Google
  captures on main remain the 2026-08-06 record; no Google run was executed
  or fabricated on this date.
- ChatGPT and Perplexity: not re-run; the recorded blockers (sign-in
  requirement; automated-session challenge) are unchanged, so the two
  `not-tested` runs from 2026-08-06 were retained with their reasons.

## What came back

All six fresh runs are `Wrong` or `Absent`. No `Found` transition occurred,
so the item's accept criterion — at least one previously `Wrong` or `Absent`
result becoming `Found` — is not met, and the item honestly stays open.

- `q1`/duckduckgo: the fibre-arts magazine (fiberygoodness.com); answer text
  identical to the 2026-08-06 capture.
- `q2`/duckduckgo: the Mac subtitle app priced as free, citing its App Store
  listing.
- `q5`/duckduckgo: the answer names tinystudio.io but describes the Mac
  subtitle app (a different business) via the App Store citation; the
  organic tinystudio.io result on the same page still carried the retired
  "TinyStudio Agent Desk" title and Agent Desk description.
- `q1`/bing: an Arduino-IDE project (GitHub), tinystudio.co, and a tool
  directory.
- `q5`/bing: **absent** — no AI answer; organic results only, with the
  tinystudio.io listing still titled "TinyStudio Agent Desk" ("Self-serve AI
  agents for high-ticket pipeline setup...").
- `q7`/bing: **absent** — no AI answer; organic results only, with the
  tinystudio.io listing still carrying the retired Agent Desk title, and no
  tinystudio.io pricing surfaced.

The persistent stale "TinyStudio Agent Desk" title on the Bing and
DuckDuckGo organic listings for tinystudio.io — three days after the
de-indexing and retitling work landed on main — is the same index lag the
2026-08-09 re-run documented, still present on 2026-08-12. It is recorded
here as observation, not as a page-specific remediation claim, because the
fixture's honesty rules allow page-specific fixes only when a run's own
sources include a page on the tested business's site and the answer's
content matches it.

## What changed

1. `evidence-fixtures/ai-search/evidence.json` carries the fresh 2026-08-12
   captures for the six runnable pairs (DuckDuckGo q1/q2/q5, Bing q1/q5/q7),
   `testedOn` moved to 2026-08-12. The 2026-08-06 Google captures and the
   two `not-tested` runs are retained with their original tested dates; the
   fixture's one-run-per-pair rule means the Google pair is untouched because
   no Google run was executed on this date. Prior captures remain in git
   history; nothing was relabelled `Found`.
2. `public/audit.html` embeds the regenerated bundle; the live panel now
   renders the 2026-08-12 record.
3. `evidence-fixtures/ai-search/README.md` and the fixture checks are
   unchanged; the existing `testedAt`, absent-sources and strict-state guards
   already cover this pass.

## What deliberately did not change

- `controlled-questions.json` is byte-identical. The `q5` truth still names
  the Agent Desk; replacing that retired ground truth is tracked by the
  separate open PR that drops the Agent Desk from q5 (the fixture's
  yardstick change is out of scope for this measurement pass).
- No page-specific remediation (`remediation.page`) is claimed anywhere.
- The engines' metadata and the `not-tested` runs' reasons are unchanged.
- No live engine state was edited; captures are quoted verbatim with `...`
  only where cut.

## What is tested and what is not

Tested: the fixture, the embedded bundle, the strict-state checks, the
source-host validation and the `testedAt`/absent rules all pass
`npm run check` and `npm test`; `git diff --check` is clean.

Not tested: whether any engine will now answer with tinystudio.io or read
the offer correctly. The runnable engines still answer from other businesses
and the stale Agent Desk index entries; Google could not be re-run from this
host on 2026-08-12 (CAPTCHA), so the item remains open pending a
source-backed `Found` transition from a non-blocked Google session and
separate deployment proof. Nothing here implies a ranking, visibility, lead,
or revenue outcome.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```
