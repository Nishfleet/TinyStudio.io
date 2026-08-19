# Controlled AI-search re-run — first Found transitions for entity and offer understanding (2026-08-15)

Date: 2026-08-15
Scope: `evidence-fixtures/ai-search/evidence.json`, `public/audit.html` (embedded
bundle), `scripts/test-agent-ui.mjs`.
This receipt records a controlled re-run of the named entity-and-offer
questions against the same engines on 2026-08-15, replacing the 2026-08-09
captures for every runnable pair. It is a measurement, not a fix, and it
claims nothing about ranking, leads, visibility, or any engine's future
answer beyond what was captured on this day.

## Why this pass exists

The backlog item "Re-establish verified AI-search entity and offer
understanding after the 2026-08-08 15:04 live recheck" (item id `6efb99cca9`)
tracks the live `/audit` AI-search panel. The 2026-08-08 15:04 IST live
recheck surfaced that the panel still rendered the 2026-08-06 captures
(every run `Wrong` or `Absent`, two `Not tested`) after the llms.txt/offer.md
identity mirror (PR #19) and the homepage identity block (PR #18) had
shipped. The 2026-08-09 controlled re-run refreshed the captures and kept
the item honestly open: all nine fresh runs were `Wrong`. The 2026-08-11 q5
ground-truth alignment (PR #43) retired the stale Agent Desk ground truth
without relabelling any captured run. The 2026-08-12 re-run (Bing,
DuckDuckGo) also produced no `Found` transition and was stranded unmerged
until the reconcile commit `816c0bd` landed it on current main.

The item's accept criterion: a controlled before/after re-run of the same
named questions and engines with verbatim answers, cited URLs, engine, date,
and strict `found / wrong / absent / not-tested` states, where at least one
previously `Wrong` or `Absent` result becomes `Found`. This pass is that
re-run, executed 2026-08-15 from the VPS (Camoufox browser), and for the
first time the criterion is met: two Google AI Overview runs transitioned to
`Found`.

## What was run

Same questions and engines as the controlled registry, anonymous sessions,
English (US), no personalisation, executed 2026-08-15:

- Google AI Overview: `q1` What does TinyStudio do?, `q2` How much does
  TinyStudio charge?, `q3` Where is TinyStudio based?, `q4` Who does
  TinyStudio work with?, `q5` What is tinystudio.io?, `q6` Does TinyStudio
  publish client work?, `q7` tinystudio.io pricing, `q8` Is TinyStudio a
  conversion audit service?. Google was reachable from this host on this
  date (no CAPTCHA), unlike 2026-08-12.
- Bing AI-generated answer: `q1`, `q5`, `q7`.
- DuckDuckGo Search Assist: `q1`, `q2`, `q5`.
- ChatGPT and Perplexity: not re-run; the recorded blockers (sign-in
  requirement; automated-session challenge) are unchanged, so the two
  `not-tested` runs from 2026-08-06 are retained with their reasons.

## What came back

Two `Found` transitions — the item's accept criterion is met:

- `q5-what-is-tinystudio-io` / google: **`wrong` → `found`**. The AI
  Overview now reads: "TinyStudio is a specialized platform offering free
  website leak audits for high-ticket service homepages, along with a
  managed agent desk service priced at $2,500 a month to help businesses
  close conversion gaps." It cites the tinystudio.io homepage ("TinyStudio
  — The Website Appraisal") plus the fibre-arts magazine. The answer names
  the tested business and its facts check out against the site, so the
  strict state is `found`; the wrong-business citation is recorded in the
  remediation note but does not change the verdict on the answer's content.
- `q7-what-tinystudio-io-charges` / google: **`wrong` → `found`**. The AI
  Overview reads: "TinyStudio provides a free website leak audit for
  high-ticket service homepages. Their ongoing service—the agent desk that
  implements fixes to close those leaks—costs $2,500 per month with a
  three-month minimum commitment." It cites tinystudio.io (and TinyMCE, a
  different business, recorded in the note). The organic tinystudio.io
  listing now carries the correct current title "TinyStudio — The Website
  Appraisal" with the price snippet — the "Missing: pricing" gap from the
  answer-readiness finding is gone on this engine.

The remaining runs are `Wrong` or `Absent`, honestly recorded:

- `q1`/google: the fibre-arts magazine and the Mac subtitling app (wrong).
- `q2`/google: four other businesses' pricing, none tinystudio.io (wrong).
- `q3`/google: other studios' cities (wrong).
- `q4`/google: the tinystudio.tv video agency's clients (wrong).
- `q6`/google: the fibre-arts magazine's client-work policy (wrong; no
  tinystudio.io citation this run, unlike 2026-08-09).
- `q8`/google: the AI Overview answers "Yes, TinyStudio provides a free
  leak audit ... followed by a paid retainer service to fix those
  conversion issues." Its substantive facts match the site, but the
  controlled question's ground truth says TinyStudio is *not* a conversion
  audit service; the answer's opening "Yes" contradicts that truth, so the
  run is `wrong` with the nuance recorded.
- `q1`/bing: the Arduino IDE and the Mac app (wrong).
- `q5`/bing and `q7`/bing: `absent` — no AI answer; the organic
  tinystudio.io listing still carries the retired "TinyStudio Agent Desk"
  title and description, the same index lag documented on 2026-08-09 and
  2026-08-12.
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

1. `evidence-fixtures/ai-search/evidence.json` carries the fresh 2026-08-15
   captures, one run per question-and-engine pair, `testedOn` moved to
   2026-08-15. The 2026-08-09 (and retained 2026-08-06) captures remain in
   git history, so the before/after stays auditable. States: 2 `found`,
   9 `wrong`, 2 `absent`, 2 `not-tested`.
2. `public/audit.html` embeds the regenerated bundle; the live panel (once
   deployed) will render the 2026-08-15 record.
3. `scripts/test-agent-ui.mjs` asserts the current verified record: the
   fixture now carries all four strict states, and the q5/google test
   asserts the `found` state, the tinystudio.io citation and the no-page-
   specific-fix rule instead of the retired "q5 is wrong" expectation.

## What deliberately did not change

- `controlled-questions.json` is byte-identical. The ground truths are
  unchanged; only the captured evidence advanced.
- `public/llms.txt`, `public/offer.md`, `public/index.html`: no change. The
  answer-readiness declaration and identity mirror already carry the facts
  the `found` answers now read.
- No captured run was relabelled to force a state; every verdict follows
  the strict-state rules against the ground truth.
- No live engine state was edited; captures are quoted verbatim with `...`
  only where cut, and the fixture never captures email addresses (one
  organic snippet on DuckDuckGo q5 contained a contact address and is not
  quoted here).

## What is tested and what is not

Tested: the fixture, the embedded bundle, the strict-state checks, the
source-host validation and the updated UI assertions all pass `npm run
check` and `npm test` (121 tests, 0 failures); `git diff --check` is clean.

Not tested: whether the other engines (Bing, DuckDuckGo) will also answer
with tinystudio.io, and whether Google's `found` answers persist. That
remains a live question, honestly measured only by a future controlled
re-run through the same fixture. Nothing here implies a ranking,
visibility, lead, or revenue outcome.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```
