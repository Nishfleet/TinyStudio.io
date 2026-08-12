# q5 ground-truth alignment — the controlled questions now name the current offer, not the retired Agent Desk

Date: 2026-08-11
Scope: `evidence-fixtures/ai-search/controlled-questions.json`, `public/audit.html`
(embedded bundle), `docs/evidence/ai-search/2026-08-09-controlled-rerun.md`.
This receipt records a repository-side correction to the controlled-question
ground truth. It is not a live AI-search measurement and it claims nothing
about any engine's answer after this change.

## Why this pass exists

The controlled re-run of 2026-08-09 (docs/evidence/ai-search/2026-08-09-controlled-rerun.md)
recorded all nine fresh runs as `Wrong` and left the backlog item "Re-establish
verified AI-search entity and offer understanding after the 2026-08-08 15:04
live recheck" honestly open. Its "What deliberately did not change" section
named the remaining gap:

> `controlled-questions.json` is byte-identical. The `q5` truth still names
> the Agent Desk; replacing that retired ground truth is a separate open item
> and was not claimed by this pass.

`q5-what-is-tinystudio-io` ("What is tinystudio.io?") is the question that
asks an engine to name the business behind the domain. Its ground truth still
described the retired self-serve Agent Desk ("the leak audit, plus the Agent
Desk behind it") long after the Agent Desk was demoted and the public site
renamed itself around The Website Appraisal. A ground truth that names a
retired product as part of the current offer cannot verify offer
understanding; it only encodes the same stale description the engines already
answered with. The truth now matches the live site's own identity statement,
which the homepage, `llms.txt` and `offer.md` already carry.

## What changed

1. `evidence-fixtures/ai-search/controlled-questions.json` — the `q5` truth
   changed from "tinystudio.io is TinyStudio's own site: the leak audit, plus
   the Agent Desk behind it." to "tinystudio.io is TinyStudio's own site: the
   free leak audit of high-ticket service homepages, and the human-reviewed
   desk that closes what the audit finds." This is the site's own identity
   wording; no new claim was added and no captured run was touched.
2. `public/audit.html` — the embedded AI-search bundle was regenerated from
   the two fixture files, so the drift guard (`scripts/check-site.mjs`) keeps
   passing. The bundle is the `{"questions": ..., "evidence": ...}` object;
   only the `q5` truth line inside it changed.
3. `docs/evidence/ai-search/2026-08-09-controlled-rerun.md` — a note records
   that the `q5` ground truth was aligned to the current offer on 2026-08-11,
   so the historical receipt does not silently outdate.

## What deliberately did not change

- `evidence-fixtures/ai-search/evidence.json`: byte-identical. The captured
  runs, strict states, verbatim answers and remediation notes from 2026-08-09
  (and the retained 2026-08-06 history) are unchanged. No run was relabelled.
- No new live engine runs were performed, and none are claimed. This pass
  only fixes the yardstick the fixture checks answers against.
- No public page markup, `llms.txt`, `offer.md`, or check script changed;
  every fact in the new truth was already asserted on the live pages and by
  the existing mirror checks.

## What is tested and what is not

Tested: the fixture, the embedded bundle, the strict-state checks, the
`testedAt`/absent rules and the source-host validation all pass `npm run
check` and `npm test`; `git diff --check` is clean.

Not tested: whether any engine will now answer with tinystudio.io or read the
offer correctly. That remains a live question, honestly measured only by a
future controlled re-run through the same fixture. Nothing here implies a
ranking, visibility, lead, or revenue outcome.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```
