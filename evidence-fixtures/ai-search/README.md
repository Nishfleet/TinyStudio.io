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
  and a remediation note. A `retests` array holds the before/after pairs that
  prove a real Found transition (see below).

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

## Before/after retests — how a Found verdict is proven

A `found` verdict is a transition claim: it says the site's controlled answers
got better after a change. A transition claim is only recordable as a `retest`
— a rerun of a baseline question on the same engine — and a retest is only
valid when it can point at a captured baseline run that was NOT found. This is
what makes the packet decide-able instead of persuasive: the before is a real
captured run in `runs`, the after is a real captured rerun in `retests`, and
the checks refuse to accept either half on its own.

- `runs` are baseline captures. A baseline may be `wrong`, `absent`, or
  `not-tested` — never `found`. A `found` verdict without a before/after pair
  is rejected as missing provenance.
- `retests` are reruns of the same question on the same engine, recorded after
  a site change. A retest may be `found`, `wrong`, or `absent` — never
  `not-tested` (a rerun we did not run is not a retest). Each retest carries
  `questionId`, `engine`, `state`, `retestedAt`, the verbatim `captured`
  answer, the `sources` the engine cited, and optionally `remediation`.
- A retest must bind to exactly one baseline run with the same `questionId`
  and `engine` (this is the business-identity tie: before and after answer the
  same controlled question about the same business). A retest with no baseline,
  or a baseline that was already `found`, or a baseline that was
  `not-tested`, is an impossible state transition and is rejected.
- At most one retest per question/engine pair. Recording two retests for the
  same pair would let the flattering one be picked later.
- `retestedAt` must be a real ISO date, no earlier than the panel's `testedOn`
  and no earlier than the baseline's own `testedAt`.
- A `found` retest must cite the tested business's own site among its sources,
  and any `remediation.page` must resolve to that same site — the same
  citation rules as a `found` run.
- A question found on its very first controlled test cannot be recorded yet:
  there is no "before", so there is nothing to prove a transition from. That
  snapshot claim is out of scope for this packet; record the baseline first and
  let a later retest prove the verdict. (Reversible: the model can grow a
  first-test-found marker if that case ever arrives.)
- The checks in `scripts/check-site.mjs` enforce the model at build time; the
  renderer in `public/audit.js` displays whatever bundle it is given, so a bad
  bundle fails the gate before it can be served as persuasion.

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
5. A `found` verdict is claimed only as a `retest` bound to a non-found
   baseline run; the artifact never displays a Found verdict that the checks
   would not accept. With no retests recorded, the audit page says so and
   claims no transition.
6. The fixture never promises ranking, leads, visibility, or autonomous
   publishing. It records what was observed on one day on one set of engines,
   and it changes when the evidence changes.
7. Nothing here captures customer briefs, emails, phones, or credentials —
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

## Adding a run

1. Add or reuse a question in `controlled-questions.json` (stable id, name,
   exact prompt, truth).
2. Run the question against the engine; copy the answer verbatim and the
   cited pages.
3. Add the run to `evidence.json` with the state it actually earned. A
   baseline run is `wrong`, `absent`, or `not-tested` — never `found`.
4. Regenerate the embedded bundle in `public/audit.html` (the bundle is the
   two files under one `{"questions": ..., "evidence": ...}` object) so the
   drift guard passes, then run `npm run check` and `npm test`.

## Adding a retest (recording a Found transition)

1. Confirm the baseline run for the same `questionId` and `engine` already
   exists in `runs` with state `wrong` or `absent` — that run is the "before".
   If it does not, add it first; without it there is no provenance.
2. Run the same prompt against the same engine after the site change; copy the
   answer verbatim and the cited pages.
3. Add the retest to `evidence.json`'s `retests` array with the state it
   actually earned (`found` for a proven transition, `wrong`/`absent` for a
   rerun that did not improve), `retestedAt` at least as late as the baseline's
   `testedAt`, and the same `remediation` rules as any run.
4. Regenerate the embedded bundle in `public/audit.html`, then run
   `npm run check` and `npm test`. The checks refuse a retest whose baseline
   is missing, was never tested, was already found, or is later than the
   retest, so the packet cannot claim an improvement it did not observe.
