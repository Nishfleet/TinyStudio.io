# AI-search visibility — evidence fixtures

Controlled, fictional evidence for the AI-search check section on
`public/audit.html`. Nothing here is a real business: the fixture business
"Wolsey & Hare" is invented so the demonstration carries no real name.

## What each file is

- `fixture.json` — the manifest. One entry per run, one run per state, four
  states in total:
  - `found` — the business is named, and the capture matches its own page.
  - `misrepresented` — the business is named, but the capture is wrong against
    the business's own page (`againstPage` shows the contradiction).
  - `absent` — the business is not named in an answer it should win.
  - `not-tested` — the run was not done. It has no capture, no engine, no date,
    and it is never counted as a finding.
- `runs/run-N.json` — the captured-evidence artifact for each run: what was
  asked, which engine was checked, the date, the verbatim capture, and what the
  business's own page says. `run-4.json` documents why the run was not done.

## How the page cites it

Every run on `public/audit.html` states the prompt, the engine, the date, the
verbatim capture, and the evidence file path, e.g.:

    Evidence: evidence-fixtures/ai-search/runs/run-2.json

A reviewer can open that file and see the capture and the page claim it is
checked against. The audit page is served statically (the worker serves only
`public/`), so the fixture data is embedded in the page markup and these files
are the source of truth the checks validate against.

## How a run is added

1. Add the run to `fixture.json` under `runs` — one of the four states above.
2. Add `runs/run-N.json` with the capture and the page claim it is checked
   against.
3. Mirror prompt, capture, engine and evidence path onto the audit page.
4. `npm test` — the fixture, its evidence artifacts and the page must agree.

## Boundaries

- No ranking or lead guarantee — a capture is a fact observed on a named date,
  not a promise about tomorrow.
- No publishing on the business's behalf — we do not contact engines, buy
  placement, or change what they say.
- No storage of captured answers — captures go into the business's own audit
  document and nowhere else.
