# q5 ground truth — retired Agent Desk replaced, re-verify against current main and live (2026-08-21)

Date: 2026-08-21
Scope: the review-queue item "[unreviewed-by-opus] Replace the retired
"Agent Desk" ground truth in the AI-search controlled questions (q5)"
(item id `a792ca1847`). The `q5-what-is-tinystudio-io` ground truth in
`evidence-fixtures/ai-search/controlled-questions.json` previously named
the retired self-serve Agent Desk as part of the current offer. This
receipt re-verifies the replacement of that retired ground truth against
the current `origin/main` head (`92d55c3`, "fix(check): guard the apple
touch icon on every served page, and re-verify finding 98a7bf8e08fc
(2026-08-20) (#256)") and the live deployment of that head. It is a
source-side plus served-bytes re-verify; it claims nothing about any
engine's future answer and runs no new live AI-search capture.

## Summary

The retired Agent Desk ground truth has been replaced on source and on
the live site. The fix landed in commit `ed62202`
("fix(evidence): align AI-search q5 ground truth with the current offer,
not the retired Agent Desk", 2026-08-11), and is preserved verbatim on
the current head (`92d55c3`):

- `evidence-fixtures/ai-search/controlled-questions.json` — the `q5`
  truth reads "tinystudio.io is TinyStudio's own site: the free leak
  audit of high-ticket service homepages, and the human-reviewed desk
  that closes what the audit finds." No "Agent Desk" appears in any
  question truth; the linked text only references the "human-reviewed
  desk", the current offer.
- `public/audit.html` — the embedded AI-search bundle under
  `<script type="application/json" id="ai-search-evidence">` is
  byte-for-byte identical to the JSON serialisation of
  `{"questions": controlled-questions.json, "evidence": evidence.json}`,
  enforced by the drift guard in `scripts/check-site.mjs`
  (the "AI-search evidence artifact" section).
- `evidence-fixtures/ai-search/evidence.json` — the bundle carries the
  runs that mention the retired Agent Desk (`q5`/bing,
  `q7`/bing, `q5`/duckduckgo) with the Google's `q5` capture updated
  to the current offer on the 2026-08-20 re-run; no run relabels the
  retired Agent Desk as the current offer — those references are honest
  index-lag observations whose remediation text says so.

The tied surfaces that answer `q5` carry the same wording:

- `public/index.html` `#identity` — the `q5-what-is-tinystudio-io` row
  ("What is tinystudio.io" → "This site: the leak audit and the desk
  behind it.") with `data-ai-question="q5-what-is-tinystudio-io"`.
- `public/llms.txt` and `public/offer.md` — the `## Identity` block
  names "the free leak audit of high-ticket service homepages and the
  human-reviewed desk that closes what the audit finds"; the
  `## Answer Readiness: Preferred Source Pages` section maps
  `q5-what-is-tinystudio-io` to `https://tinystudio.io/` (homepage).

Both the prior receipt (`docs/evidence/ai-search/2026-08-14-q5-ground-truth-reverify.md`)
and the original alignment receipt
(`docs/evidence/ai-search/2026-08-11-q5-ground-truth-alignment.md`) are
on main and remain valid; this 2026-08-21 re-verification simply records
that the replacement has survived every commit between the original
alignment and the current head.

## Source checks on the current head (`92d55c3`)

1. `node scripts/check-site.mjs` passes ("TinyStudio.io checks passed.").
   The "AI-search evidence artifact" guard requires the two fixture
   files plus the README to be git-tracked, the audit page to mount
   the `id="ai-search-evidence"` marker and the `data-ai-search-evidence`
   consumer, `public/audit.js` to carry the four states (`found`,
   `wrong`, `absent`, `not-tested`) and their labels, and the embedded
   bundle to equal `{"questions": aiQuestions, "evidence": aiEvidence}`
   byte-for-byte.
2. The test suite passes on the current head (full run, 132 tests,
   0 failures):
   - `node --test scripts/test-heading-hierarchy.mjs` — 6/6
   - `node --test scripts/test-sitemap.mjs` — 7/7
   - `node --test scripts/test-agent-worker.mjs` — 83/83
   - `node --test scripts/test-agent-ui.mjs` — 16/16
   - `node --test scripts/test-product-contract.mjs` — 8/8
   - `node --test scripts/test-first-viewport-audience.mjs` — 4/4
   - `node --test scripts/test-study-freshness.mjs` — 2/2
   - `node scripts/test-narrow-viewport.mjs` — 11/11

   `git diff --check` is clean.
3. Independent re-serialisation: extracting the embedded bundle from
   `public/audit.html` and serialising the two fixture files gives
   byte-equal strings (`JSON.stringify(embedded) ===
   JSON.stringify({questions, evidence})` → true); the `q5` truth
   inside the bundle reads exactly the current-offer wording above;
   runs are recorded per the 2026-08-20 re-run (`testedOn:
   2026-08-20`).
4. Header trace: the bundle's `runs` array records the `q5`/google
   run as `state: "found"` with the current-offer capture ("a managed
   agent desk service priced at $2,500 a month..."), and the
   `q5`/bing and `q5`/duckduckgo runs as `absent` / `wrong` with
   the verbatim "retired 'TinyStudio Agent Desk' title" snippet
   preserved honestly as an index-lag observation. No run labels
   the retired Agent Desk as the current offer.

## Live re-verification 2026-08-21

The Cloudflare release-state record
(`/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`)
pins the deployed SHA at `b4d80f1c8736b59f75e07cb30a1fc7a3df078a01`
("docs(evidence): re-verify PR #42 + #43 serial-merge closeout on
current main (2026-08-17, lane 1) (#244)", 2026-08-17). Fresh HTTPS
fetches confirm the served bytes carry the replaced q5 truth:

| URL | HTTP | q5 truth snippet (live) | source match |
|---|---|---|---|
| `/audit` | 200 | "tinystudio.io is TinyStudio's own site: the free leak audit of high-ticket service homepages, and the human-reviewed desk that closes what the audit finds." | yes — fixture-truth and the live bundle contain the same phrasing |
| `/llms.txt` | 200 | `## Identity` block names "the free leak audit of high-ticket service homepages and the human-reviewed desk that closes what the audit finds" | yes — `md5sum` matches `public/llms.txt` |
| `/offer.md` | 200 | same `## Identity` block | yes — `md5sum` matches `public/offer.md` |

The live `/audit` bundle's `q5` truth is the current-offer wording
above; the live `llms.txt` and `offer.md` carry the matching identity
block and the `q5` → homepage answer-readiness mapping. The retired
"TinyStudio Agent Desk" string appears on live only inside the
`captured` text of three honest index-lag runs (`q5`/bing,
`q7`/bing, `q5`/duckduckgo) — never as the `truth` field of any
controlled question.

Note on live evidence freshness: the live `/audit` bundle carries the
2026-08-15 captures (not the 2026-08-20 re-run that followed the
2026-08-17 deployment); the controlled questions were untouched between
these two re-runs, so the q5 ground truth is identical on both. The
2026-08-20 re-run lands on the next deploy, which is the standard
re-verify cadence and not a q5 finding.

## What this pass deliberately did not do

- No new live AI-engine run was performed, and none is claimed. Whether
  an engine now answers `q5` correctly remains a live question, honestly
  measured only by a future controlled re-run through the same fixture.
- No captured run was relabelled, no test was added, no assertion was
  loosened. The `q5` truth is the same one the prior receipts recorded;
  the current receipt records that the replacement has survived every
  commit between the original alignment and the current head.
- No code, fixture, or page markup changed in this pass; the fixture
  and the audit-page embed remain byte-identical to `origin/main`.

## Verification (reproduce)

```sh
node scripts/check-site.mjs
node --test scripts/test-heading-hierarchy.mjs
node --test scripts/test-sitemap.mjs
node --test scripts/test-agent-worker.mjs
node --test scripts/test-agent-ui.mjs
node --test scripts/test-product-contract.mjs
node --test scripts/test-first-viewport-audience.mjs
node --test scripts/test-study-freshness.mjs
node scripts/test-narrow-viewport.mjs
git diff --check
```

## Closeout

The item as stated — replace the retired "Agent Desk" ground truth in
the AI-search controlled questions (`q5`) — is **closed against current
main and live**: the replacement landed in `ed62202` (merged via PR #43)
and is preserved verbatim on the current head (`92d55c3`); the drift
guard and the full test suite pass; the deployed `/audit` bundle,
`llms.txt` and `offer.md` serve the current-offer wording. The receipt
now records the closeout on the current head so the item cannot be
re-opened by tracker drift.
