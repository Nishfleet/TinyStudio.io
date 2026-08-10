# Controlled AI-search re-run — fresh entity-and-offer captures after the llms.txt/offer.md identity mirror

Date: 2026-08-09
Scope: `evidence-fixtures/ai-search/evidence.json`, `public/audit.html` (embedded
bundle), `scripts/check-site.mjs`, `scripts/test-agent-ui.mjs`,
`evidence-fixtures/ai-search/README.md`.
This receipt records a controlled re-run of the same named questions against
the same engines, replacing the 2026-08-06 captures with fresh verbatim
captures from 2026-08-09. It is a measurement, not a fix, and it claims
nothing about ranking, leads, visibility, or any engine's future answer.

## Why this pass exists

The backlog item "Re-establish verified AI-search entity and offer
understanding after the 2026-08-08 15:04 live recheck" tracks the live
`/audit` AI-search panel: as of 2026-08-08 15:04 IST it still rendered the
2026-08-06 captures, all `Wrong` or `Absent` (plus two `Not tested`), while
the machine-readable clarification — the llms.txt/offer.md identity mirror
(PR #19, commit 6172ef9, merged 2026-08-08) and the homepage identity block —
had been merged and was live since 2026-08-09 04:12 IST. The item's accept
requires a controlled before/after re-run of the same named questions and
engines with verbatim answers, cited URLs, engine, date, and strict
`found / wrong / absent / not-tested` states, claiming page-specific
remediation only when an answer cites a tinystudio.io page. This pass is
that re-run; it re-establishes the fixture's verified record against the
current live site after the clarification shipped.

## What was run

Same questions and engines as the 2026-08-06 capture, anonymous sessions,
English (US), no personalisation:

- Google AI Overview: `q1` What does TinyStudio do?, `q2` How much does
  TinyStudio charge?, `q3` Where is TinyStudio based?, `q4` Who does
  TinyStudio work with?, `q5` What is tinystudio.io?, `q6` Does TinyStudio
  publish client work?, `q7` tinystudio.io pricing.
- Bing AI-generated answer: `q1`.
- DuckDuckGo Search Assist: `q1`.
- ChatGPT and Perplexity: not re-run; the recorded blockers (sign-in
  requirement; automated-session challenge) are unchanged, so the two
  `not-tested` runs from 2026-08-06 were retained with their reasons.

## What came back

All nine fresh runs are `Wrong`. No `Found` transition occurred, so the
item's accept criterion — at least one previously `Wrong` or `Absent` result
becoming `Found` — is not met, and the item honestly stays open.

- `q1`/google: the Mac subtitle app (tinystudio.ai), its App Store listing,
  and the fibre-arts magazine.
- `q2`/google: four different businesses priced (dance-studio software,
  The Tiny Studio LA, Keep It Tiny Studio, tinyStudio Creative Life). The AI
  Overview's sources also included `www.tinystudio.io/audit.html` under the
  stale index title "The Website Appraisal - TinyStudio Agent Desk", but the
  answer's content does not match what that page says.
- `q3`/google: four studios in four cities; no base-city statement is read.
- `q4`/google: Tiny Studio TV, a video production studio on a different
  domain.
- `q5`/google: the retired "TinyStudio Agent Desk" description, citing
  `tinystudio.io/` under its stale index title.
- `q6`/google: other entities' client-work policies; the module also cited
  `www.tinystudio.io/audit.html`, whose content does not support the answer.
- `q7`/google: **state changed `absent` → `wrong`** — the pricing query now
  produces an AI answer ("does not publicly list explicit pricing tiers...
  functioning instead as an AI-driven lead-to-call planning desk"), built
  from the stale Agent Desk index entry for tinystudio.io pages and
  contradicting the live pricing page. The verbatim capture is truncated
  with `...` before an email address the answer published, because the
  fixture must never capture email addresses.
- `q1`/bing: an Arduino-IDE project (GitHub), tinystudio.co, and the
  tinystudio.ai subtitle app.
- `q1`/duckduckgo: the fibre-arts magazine (answer text identical to the
  2026-08-06 capture).

## What changed

1. `evidence-fixtures/ai-search/evidence.json` carries the fresh 2026-08-09
   captures, one run per question-and-engine pair, `testedOn` moved to
   2026-08-09. The 2026-08-06 captures remain in git history, so the
   before/after stays auditable; nothing was relabelled `Found`.
2. `public/audit.html` embeds the regenerated bundle; the live panel now
   renders the 2026-08-09 record.
3. `scripts/check-site.mjs` now fails when a run lacks `testedAt` (the
   README requires engine and date on every run) or when an `absent` run
   carries sources (the README says no sources are expected for `absent`);
   `scripts/test-agent-ui.mjs` asserts the same invariants.
4. `evidence-fixtures/ai-search/README.md` states that a re-run replaces the
   pair's run and that the prior capture stays in git history.

## What deliberately did not change

- `controlled-questions.json` is byte-identical. The `q5` truth still names
  the Agent Desk; replacing that retired ground truth is a separate open
  item and was not claimed by this pass. (Update 2026-08-11: that separate
  item is now done — the `q5` truth was aligned to the current offer in
  `docs/evidence/ai-search/2026-08-11-q5-ground-truth-alignment.md`.)
- No page-specific remediation (`remediation.page`) is claimed anywhere:
  the same-domain citations in the `q2`, `q6` and `q7` runs do not support
  the answers' content, which the fixture rules say is necessary before a
  page-specific fix can be claimed.
- The engines' metadata and the `not-tested` runs' reasons are unchanged.
- No live engine state was edited; captures are quoted verbatim with `...`
  only where cut.

## What is tested and what is not

Tested: the fixture, the embedded bundle, the strict-state checks, the
source-host validation and the new `testedAt`/absent rules all pass
`npm run check` and `npm test`; `git diff --check` is clean.

Not tested: whether any engine will now answer with tinystudio.io or read
the offer correctly. This re-run shows the engines still answer from the
stale Agent Desk index entries (the separate live-SERP item documents the
same staleness on Google and DuckDuckGo), so the item remains open pending a
source-backed `Found` transition and separate deployment proof. Nothing here
implies a ranking, visibility, lead, or revenue outcome.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```
