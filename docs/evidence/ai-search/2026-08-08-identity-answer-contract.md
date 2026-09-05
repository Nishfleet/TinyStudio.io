# AI-search answer contract receipt

Repository-side identity/offer clarification for the controlled AI-search
artifact. Date: 2026-08-08. This receipt records the deterministic binding
between the controlled questions and the first-party answer surface. It is
not a re-run of the engines and it invents no live results.

## What a buyer's assistant receives

A buyer's assistant that reads this site gets the same unambiguous, current,
first-party facts the controlled questions ask about, from these surfaces:

- `public/index.html`, `section id="identity"` — one row per controlled
  question, each row tagged `data-ai-question` with the fixture question
  id(s). This is the canonical answer surface.
- `public/llms.txt` and `public/offer.md` — the machine-readable identity
  statement and offer truth, including the disambiguation from the other
  businesses that share the name.
- `public/audit.html` — the identity paragraph and the embedded AI-search
  evidence bundle.

## The answer contract

Every question in `evidence-fixtures/ai-search/controlled-questions.json`
carries `answerFacts`: the canonical first-party facts a correct answer must
state, drawn from the site's own copy when the question was registered.
`scripts/check-site.mjs` fails if any answer fact is absent from the homepage
identity section (case-insensitive, section-wide, so wording may change but a
fact may not disappear), and `scripts/test-agent-ui.mjs` asserts the same
binding. The fixture never changes to match the site: the site is what gets
edited to answer the questions the evidence asks, and when the site's answer
genuinely changes, the answer facts are updated with it.

## The four states — unchanged and strict

`found`, `wrong`, `absent`, and `not-tested` keep their established meanings
from the fixture README: a verdict is earned by the captured run, never by
repository copy. `found` still requires the engine to have cited the tested
business's own site, and `absent` and `not-tested` remain impossible to
confuse.

## No live results were invented

The evidence bundle (`evidence.json`) is byte-identical to the captured runs
of 2026-08-06: `testedOn`, engines, verbatim answers, sources, remediations.
ChatGPT and Perplexity remain `not-tested` with their recorded reasons. The
clarification is repository-side only: it binds first-party facts to the
controlled questions and claims no ranking, leads, visibility, or any live AI
outcome.

## Uncertainty is preserved

- No page-specific remediation is claimed without a same-domain citation, and
  the q5 run keeps its under-claim: the homepage's own description is not
  credited with producing the engine's answer.
- The site states no base city or office address, and the surfaces say so
  rather than guessing.
- This receipt changes no pricing or legal copy; the offer surfaces keep their
  own statements.

## Exact verification method

- `/home/nish/.local/bin/test-gate npm run check` — site checks, including
  fixture/bundle drift, the question tie, answer facts, identity facts, and
  this receipt's anchors.
- `/home/nish/.local/bin/test-gate npm test` — worker and UI tests, including
  the mirrored answer-facts and identity-facts assertions.
- `git diff --check` — whitespace check.
- `sgscan` — secret scan.

All four passed on 2026-08-08.
