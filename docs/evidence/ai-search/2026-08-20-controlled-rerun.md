# Controlled AI-search re-run — entity and offer understanding re-verified with four `found` runs (2026-08-20)

Date: 2026-08-20
Scope: `evidence-fixtures/ai-search/evidence.json`, `public/audit.html`
(embedded bundle), `scripts/test-agent-ui.mjs`.
This receipt records a controlled re-run of the named entity-and-offer
questions against the same engines on 2026-08-20, replacing the 2026-08-15
captures for every runnable pair. It is a measurement, not a fix, and it
claims nothing about ranking, leads, visibility, or any engine's future
answer beyond what was captured on this day.

## Why this pass exists

The backlog item "Re-establish verified AI-search entity and offer
understanding after the 2026-08-08 15:04 live recheck" (item id `6efb99cca9`)
tracks the live `/audit` AI-search panel. The 2026-08-15 controlled re-run
(PR #227) recorded the first `Found` transitions (q5/google and q7/google);
this pass is the follow-up measurement on 2026-08-20, executed from the VPS
via the Camoufox browser, to re-establish the verified entity-and-offer
understanding on a fresh date and to check whether the `found` state holds.

The item's accept criterion: a controlled before/after re-run of the same
named questions and engines with verbatim answers, cited URLs, engine, date,
and strict `found / wrong / absent / not-tested` states, where at least one
previously `Wrong` or `Absent` result becomes `Found`. This pass is that
re-run, executed 2026-08-20, and the criterion is met again — with four
`found` runs, including two new transitions (q6/google and q8/google).

## What was run

Same questions and engines as the controlled registry, anonymous sessions,
English (US), no personalisation, executed 2026-08-20:

- Google AI Overview: `q1` What does TinyStudio do?, `q2` How much does
  TinyStudio charge?, `q3` Where is TinyStudio based?, `q4` Who does
  TinyStudio work with?, `q5` What is tinystudio.io?, `q6` Does TinyStudio
  publish client work?, `q7` tinystudio.io pricing, `q8` Is TinyStudio a
  conversion audit service?. Google was reachable from this host on this
  date; two queries (q2, q3) returned the engine message "Can't generate an
  AI overview right now. Try again later." on both a first load and a
  same-session retry, and are recorded `absent` because we ran the question
  and no answer came back.
- Bing AI-generated answer: `q1`, `q5`, `q7`. No AI-generated answer was
  served for q5 or q7; those runs are `absent` with the observed organic
  result recorded. The tinystudio.io organic listing on Bing still carries
  the retired "TinyStudio Agent Desk" title on all three queries.
- DuckDuckGo Search Assist: `q1`, `q2`, `q5`.
- ChatGPT and Perplexity: not re-run; the recorded blockers (sign-in
  requirement; automated-session challenge) are unchanged, so the two
  `not-tested` runs from 2026-08-06 are retained with their reasons.

## What came back

Four `found` runs — the item's accept criterion is met again, with two new
transitions:

- `q5-what-is-tinystudio-io` / google: **`found`** (was `found` on
  2026-08-15; the state holds). The AI Overview reads: "tinystudio.io is a
  boutique digital service run by a single operator named Nish. It provides
  free website \"leak audits\" for high-ticket service homepages, along with
  a paid human-reviewed \"Growth Desk\" service ($2,500/month) that rewrites,
  rebuilds, and optimizes pages to fix conversion and search-trust issues."
  It cites tinystudio.io and tinystudio.io/pricing. The answer names the
  tested business and its facts check out against the site, so the strict
  state is `found`.
- `q6-client-work` / google: **`wrong` → `found`** (new transition). The AI
  Overview reads: "No, the website appraisal service TinyStudio explicitly
  states that it does not publish client work. They maintain a strict policy
  of no logos, no case studies, no testimonials, and no \"as seen at\"
  acknowledgments." It cites tinystudio.io. The answer matches the ground
  truth (TinyStudio does not publish client work), so the strict state is
  `found`.
- `q7-what-tinystudio-io-charges` / google: **`found`** (was `found` on
  2026-08-15; the state holds). The AI Overview reads: "TinyStudio charges
  $2,500 per month with a three-month minimum commitment for its agent desk
  service. Homepage Leak Audit: Free (yours to keep, no obligation
  required). Agent Desk Service: $2,500/month (runs on a 3-month minimum
  term to fix and close conversion leaks found on high-ticket service
  homepages). Guarantee: Delivery is guaranteed on time or the first month
  is refunded; no revenue or ranking guarantees are made." It cites
  tinystudio.io and tinystudio.io/pricing (plus TinyMCE, a different
  business, recorded in the run's sources). The pricing facts check out
  against the site.
- `q8-conversion-audit` / google: **`wrong` → `found`** (new transition).
  The AI Overview reads: "No, TinyStudio explicitly states it is not a
  conversion audit service, and it does not promise any conversion lift.
  Instead, it functions as a free leak appraisal for high-ticket service
  homepages (ranking faults with a fix beside each) and operates as a
  human-reviewed desk that follows up to close the findings it identifies."
  It cites tinystudio.io. The answer now opens with "No", matching the
  ground truth (TinyStudio is not a conversion audit service) — a direct
  improvement over the 2026-08-15 run, which opened with "Yes".

The remaining runs are `Wrong` or `Absent`, honestly recorded:

- `q1`/google: the AI Overview enumerates five different businesses
  (subtitle app, fibre-arts magazine, tinystudio.tv, dance software, craft
  boxes); no tinystudio.io (wrong).
- `q2`/google: `absent` — no AI Overview; the engine returned "Can't
  generate an AI overview right now. Try again later." on both attempts
  (previously `wrong` on 08-15).
- `q3`/google: `absent` — no AI Overview; same engine message on both
  attempts (previously `wrong` on 08-15).
- `q4`/google: the AI Overview describes tinystudio.tv's clients (Manchester
  City, British Cycling, etc.) (wrong).
- `q1`/bing: the AI-generated answer describes tinystudio.co's tool suite,
  a GitHub Arduino IDE project, and tinystudio.ai's subtitle app (wrong);
  the tinystudio.io listing still carries the retired Agent Desk title.
- `q5`/bing and `q7`/bing: `absent` — no AI-generated answer; the organic
  tinystudio.io listing still carries the retired "TinyStudio Agent Desk"
  title and description, the same index lag documented on 2026-08-09,
  2026-08-12 and 2026-08-15.
- `q1`/duckduckgo: the fibre-arts magazine (wrong).
- `q2`/duckduckgo: the Mac app priced as free (wrong).
- `q5`/duckduckgo: names tinystudio.io but describes the Mac app via the
  App Store citation; the organic tinystudio.io listing still carries the
  retired Agent Desk title (wrong).

No page-specific remediation (`remediation.page`) is claimed anywhere: the
`found` runs' tinystudio.io citations support the answers' content, and the
fixture's page-specific-fix rule applies to fixes the repo should make,
none of which this pass proposes. The stale Bing/DuckDuckGo organic titles
remain an index-lag observation, not a repo-side fix.

## What changed

1. `evidence-fixtures/ai-search/evidence.json` carries the fresh 2026-08-20
   captures, one run per question-and-engine pair, `testedOn` moved to
   2026-08-20. The 2026-08-15 (and earlier) captures remain in git history,
   so the before/after stays auditable. States: 4 `found`, 6 `wrong`,
   4 `absent`, 2 `not-tested`.
2. `public/audit.html` embeds the regenerated bundle; the live panel (once
   deployed) will render the 2026-08-20 record.
3. `scripts/test-agent-ui.mjs` updates the q5/google wording assertion to
   the 2026-08-20 capture ("free website \"leak audits\" for high-ticket
   service homepages").

## What deliberately did not change

- `controlled-questions.json` is byte-identical. The ground truths are
  unchanged; only the captured evidence advanced.
- `public/llms.txt`, `public/offer.md`, `public/index.html`: no change. The
  answer-readiness declaration and identity mirror already carry the facts
  the `found` answers now read.
- No captured run was relabelled to force a state; every verdict follows
  the strict-state rules against the ground truth.
- No live engine state was edited; captures are quoted verbatim with `...`
  only where cut, and the fixture never captures email addresses (the
  DuckDuckGo q5 organic snippet contained a contact address and is not
  quoted here).

## What is tested and what is not

Tested: the fixture, the embedded bundle, the strict-state checks, the
source-host validation and the updated UI assertions all pass `npm run
check` and `npm test` (126 tests, 0 failures); `git diff --check` is clean.

Not tested: whether the other engines (Bing, DuckDuckGo) will also answer
with tinystudio.io, whether Google's `found` answers persist beyond this
day, and whether Google re-serves AI Overviews for q2/q3 (both were
`absent` on this date after a same-session retry). That remains a live
question, honestly measured only by a future controlled re-run through the
same fixture. Nothing here implies a ranking, visibility, lead, or revenue
outcome.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```
