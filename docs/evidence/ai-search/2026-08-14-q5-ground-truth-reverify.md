# q5 ground truth — retired Agent Desk replaced, re-verify against current main and live

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] Replace the retired
"Agent Desk" ground truth in the AI-search controlled questions (q5)"
(item id `a792ca1847`). The `q5-what-is-tinystudio-io` ground truth in
`evidence-fixtures/ai-search/controlled-questions.json` still named the
retired self-serve Agent Desk as part of the current offer. This receipt
re-verifies the replacement of that retired ground truth against the current
`origin/main` head (`e9fc96a`, "docs(evidence): re-verify tap-target
finding on current main and live (2026-08-14) (#183)") and the live
deployment of that head. It is a source-side plus served-bytes re-verify;
it claims nothing about any engine's future answer and runs no new live
AI-search capture.

## Summary

The retired Agent Desk ground truth has been replaced on source and on the
live site. The fix landed in commit `ed62202`
("fix(evidence): align AI-search q5 ground truth with the current offer,
not the retired Agent Desk", 2026-08-11), merged to `origin/main` via PR #43
(`ad9cee3`, "Merge pull request #43 from
nish3451/fix/ai-search-rerun-entity-offer"), and is preserved verbatim on
the current head:

- `evidence-fixtures/ai-search/controlled-questions.json` — the `q5` truth
  reads "tinystudio.io is TinyStudio's own site: the free leak audit of
  high-ticket service homepages, and the human-reviewed desk that closes
  what the audit finds." No "Agent Desk" appears in any question truth.
- `public/audit.html` — the embedded AI-search bundle under
  `<script type="application/json" id="ai-search-evidence">` is
  byte-for-byte identical to the JSON serialisation of
  `{"questions": controlled-questions.json, "evidence": evidence.json}`,
  enforced by the drift guard in `scripts/check-site.mjs` (lines 751-807).
- `docs/evidence/ai-search/2026-08-09-controlled-rerun.md` — carries the
  2026-08-11 alignment note, so the historical receipt does not silently
  outdate.
- `docs/evidence/ai-search/2026-08-11-q5-ground-truth-alignment.md` — the
  original alignment receipt, on main.

No captured run was touched: `evidence.json` keeps the 2026-08-09 captures
(`testedOn: 2026-08-09`), 11 runs — 9 `wrong` (including
`q5`/google@2026-08-09, whose verbatim answer still describes the retired
Agent Desk, quoted honestly with its remediation), 2 `not-tested`
(`q1`/chatgpt, `q1`/perplexity), 0 `found`. The yardstick no longer encodes
the retired product; the stale answers are preserved as the evidence they
are.

The tied surfaces that answer `q5` carry the same wording:

- `public/index.html` `#identity` — the `q5-what-is-tinystudio-io` row
  ("What is tinystudio.io" → "This site: the leak audit and the desk behind
  it.") with `data-ai-question="q5-what-is-tinystudio-io"` (line 190).
- `public/llms.txt` and `public/offer.md` — the `## Identity` block names
  "the free leak audit of high-ticket service homepages and the
  human-reviewed desk that closes what the audit finds"; the
  `## Answer Readiness: Preferred Source Pages` section maps
  `q5-what-is-tinystudio-io` to `https://tinystudio.io/` (homepage) in both
  files, and the mirror checks fail if the pair drifts.

## Source checks on the current head (`e9fc96a`)

1. `node scripts/check-site.mjs` passes ("TinyStudio.io checks passed.").
   The "AI-search evidence artifact" guard (lines 751-807) requires the two
   fixture files plus the README to be git-tracked, the audit page to mount
   the `id="ai-search-evidence"` marker and the `data-ai-search-evidence`
   consumer, `public/audit.js` to carry the four states (`found`, `wrong`,
   `absent`, `not-tested`) and their labels (`Found`, `Wrong`, `Absent`,
   `Not tested`), and the embedded bundle to equal
   `{"questions": aiQuestions, "evidence": aiEvidence}` byte-for-byte.
2. The full test suite passes (117 tests, 0 failures):
   `node --test scripts/test-heading-hierarchy.mjs` (6/6),
   `node --test scripts/test-sitemap.mjs` (7/7),
   `node --test scripts/test-agent-worker.mjs` (76/76),
   `node --test scripts/test-agent-ui.mjs` (16/16, including the
   "every controlled question maps to a preferred source page" subtest that
   locks the eight-question mapping),
   `node --test scripts/test-product-contract.mjs` (8/8),
   `node --test scripts/test-first-viewport-audience.mjs` (4/4).
   `git diff --check` is clean.
3. Independent re-serialisation: extracting the embedded bundle from
   `public/audit.html` and serialising the two fixture files gives
   byte-equal strings (`JSON.stringify(embedded) ===
   JSON.stringify({questions, evidence})` → true); the `q5` truth inside
   the bundle reads exactly the current-offer wording above; runs are
   11 (9 `wrong`, 2 `not-tested`, 0 `found`), `testedOn` `2026-08-09`.

## Live re-verification 2026-08-14

The Cloudflare release-state record
(`/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`)
pins the deployed SHA at `e9fc96ab018c0ed538d103e0994c8ed70c363673` — the
same commit as this lane's `origin/main` head. Fresh HTTPS fetches confirm
the served bytes match the source:

| URL | HTTP | md5 (live) | md5 (public/ source) | match |
|---|---|---|---|---|
| `/audit` | 200 | `7162b128...` | `7162b128...` | yes |
| `/llms.txt` | 200 | `d14e5d56...` | `d14e5d56...` | yes |
| `/offer.md` | 200 | `bb06b34d...` | `bb06b34d...` | yes |

The live `/audit` page embeds the same `q5` truth — "tinystudio.io is
TinyStudio's own site: the free leak audit of high-ticket service
homepages, and the human-reviewed desk that closes what the audit finds."
— quoted verbatim from the served page's bundle. The live `llms.txt` and
`offer.md` carry the matching identity and the `q5` → homepage answer-
readiness mapping.

## What this pass deliberately did not do

- No new live AI-engine run was performed, and none is claimed. Whether an
  engine now answers `q5` correctly remains a live question, honestly
  measured only by a future controlled re-run through the same fixture.
- No captured run was relabelled: the 9 `wrong` / 2 `not-tested` / 0
  `found` states from 2026-08-09 stand, including the `q5`/google run whose
  verbatim answer describes the retired Agent Desk.
- No code, fixture, or page markup changed in this pass; the fixture and
  the audit-page embed remain byte-identical to `origin/main`.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```

## Closeout

The item as stated — replace the retired "Agent Desk" ground truth in the
AI-search controlled questions (`q5`) — is **closed against current main
and live**: the replacement landed in `ed62202` (merged via PR #43) and is
preserved verbatim on the current head (`e9fc96a`); the drift guard and the
full test suite pass; the deployed `/audit` bundle, `llms.txt` and
`offer.md` serve the current-offer wording byte-identical to source. The
receipt now records the closeout on the current head so the item cannot be
re-opened by tracker drift.
