# AI-search evidence fixture

This directory is the data model behind the AI-search evidence artifact on the
audit page (`public/audit.html`, section `#ai-search`). It is the single source
of truth; the page embeds a copy of both files, and `scripts/check-site.mjs`
fails if the embedded copy drifts from these files.

## Files

- `controlled-questions.json` — the registry of named controlled questions.
  Each question carries a stable `id`, a short `name`, the exact `prompt`
  sent to each engine, and a `truth` the verdict is checked against. The truth
  statements are drawn from the live site, not from what we wish were true.
- `evidence.json` — the captured runs. One `run` per question-and-engine
  pair, with the verbatim answer (or observation), the pages the engine cited,
  and a remediation note.

## The four states — strict and distinct

| State | Meaning | The run must carry |
|---|---|---|
| `found` | An AI answer existed, named the tested business, and its facts checked out against the site. | `captured` verbatim answer, `sources` the engine cited |
| `wrong` | An AI answer existed but described a different business, or contradicted the site. | `captured` verbatim answer, `sources` the engine cited |
| `absent` | We ran the question and no AI answer came back at all. | `captured` observation of what came back instead, no `sources` expected |
| `not-tested` | We did not run the question. | `reason` — never `captured` or `sources` |

`absent` and `not-tested` are deliberately impossible to confuse: `absent`
records what we observed after running the question; `not-tested` records why
we did not run it. The checks in `scripts/check-site.mjs` and the renderer
tests in `scripts/test-agent-ui.mjs` enforce the difference.

## Honesty rules

1. `captured` is quoted verbatim from the engine's answer, truncated with `...`
   where cut. It is never paraphrased as if it were a quote.
2. Every `source` is a page the engine actually cited; the URL is the page as
   shown, not a guess at what the engine "must have" read.
3. A run is added only after the question was actually executed and the
   capture recorded, with `testedAt` and `engine`.
4. `remediation` is page-specific (`remediation.page`) only when this run's
   own sources include a page on the tested business's site — the checks
   verify the same-domain link. A same-domain citation is necessary but not
   sufficient: when the answer's content does not match what the cited page
   actually says, the remediation says so and claims no page-specific fix.
   Otherwise remediation says plainly that no page-specific fix is claimed.
5. The fixture never promises ranking, leads, visibility, or autonomous
   publishing. It records what was observed on one day on one set of engines,
   and it changes when the evidence changes.
6. Nothing here captures customer briefs, emails, phones, or credentials —
   the controlled-test business is first-party and non-client.

## Adding a run

1. Add or reuse a question in `controlled-questions.json` (stable id, name,
   exact prompt, truth).
2. Run the question against the engine; copy the answer verbatim and the
   cited pages.
3. Add the run to `evidence.json` with the state it actually earned.
4. Regenerate the embedded bundle in `public/audit.html` (the bundle is the
   two files under one `{"questions": ..., "evidence": ...}` object) so the
   drift guard passes, then run `npm run check` and `npm test`.
