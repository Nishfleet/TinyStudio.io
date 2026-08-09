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

## Tied surfaces

The homepage identity section (`public/index.html`, `id="identity"`) leads with
a compact "which TinyStudio" disambiguation block: one row per controlled
question, each row tagged with the fixture question id(s) via
`data-ai-question`. `scripts/check-site.mjs` fails if any controlled question
is not answered on the homepage or if a referenced id does not exist in the
fixture, and the same invariant is asserted in `scripts/test-agent-ui.mjs`. The
fixture never changes to match the site — the site is what gets edited to
answer the questions the evidence asks.

The machine-readable mirror pair — `public/llms.txt` and `public/offer.md` —
carries the identity facts a machine reader needs to tell TinyStudio apart
from the same-name businesses the wrong answers were built from: the
disambiguation list, the operator, and the no-base-city statement. The checks
fail if any mirrored identity or disambiguation fact drifts between the two
files, or if the pair stops linking each other, and `llms.txt` must point at
the audit page that embeds this evidence artifact. The pair also carries the
current offer in the site's own words — the free leak audit, the
human-reviewed desk that closes findings, and high-ticket service buyers —
and points at pricing.html for price and terms instead of restating them: the
checks fail if either file carries a dollar amount or refund language, or
revives the retired Website Correction or founder-pilot framing. Same rule as
above: the site files are what get edited; the fixture's captured runs never
change to match them.

The pair also carries an answer-readiness mapping: an `## Answer Readiness:
Preferred Source Pages` section in both files declares, per controlled
question, the preferred source page an engine should read first — the page
that owns the fact. The checks fail if a question is unmapped, mapped to more
than one page, mapped to a page the worker does not serve (sitemap
membership), or mapped differently between the two files; price questions
must map to `pricing.html`, which owns the price. This is the direct answer
to dogfood finding 4473a99a9bc9 ("AI Answer Readiness: preferred source pages
are unclear", audit run 20260808T074205Z-msk2fl3n): the engines' q5/google
run cited tinystudio.io but described the retired Agent Desk, and the
q7/google run came back "Missing: pricing". The mapping names the page that
owns each fact so an engine does not have to guess. Same rule as above: the
site files are what get edited; the fixture's captured runs never change to
match them.

## Adding a run

1. Add or reuse a question in `controlled-questions.json` (stable id, name,
   exact prompt, truth).
2. Run the question against the engine; copy the answer verbatim and the
   cited pages.
3. Add the run to `evidence.json` with the state it actually earned.
4. Regenerate the embedded bundle in `public/audit.html` (the bundle is the
   two files under one `{"questions": ..., "evidence": ...}` object) so the
   drift guard passes, then run `npm run check` and `npm test`.
