# Lane report: q5 ground-truth re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `docs/q5-ground-truth-reverify-2026-08-14`
Item: `a792ca1847` — "[unreviewed-by-opus] Replace the retired "Agent Desk" ground truth in the AI-search controlled questions (q5) — fi"

## Outcome

Closed. The retired Agent Desk ground truth in the `q5` controlled question has already been replaced on `origin/main` — commit `ed62202` ("fix(evidence): align AI-search q5 ground truth with the current offer, not the retired Agent Desk", 2026-08-11), merged via PR #43 (`ad9cee3`) — and this lane re-verified the replacement against the current head (`e9fc96a`) and the live deployment of that head. No code change was needed; the closeout evidence is recorded.

## Verification performed

1. **Fixture**: `evidence-fixtures/ai-search/controlled-questions.json` — the `q5` truth reads "tinystudio.io is TinyStudio's own site: the free leak audit of high-ticket service homepages, and the human-reviewed desk that closes what the audit finds." No "Agent Desk" appears in any question truth.
2. **Bundle == fixture**: the embedded bundle in `public/audit.html` is byte-identical to `{"questions": …, "evidence": …}` serialised from the two fixture files (`JSON.stringify` equality → true). Runs: 11 (9 `wrong`, 2 `not-tested`, 0 `found`), `testedOn: 2026-08-09`. No run relabelled; the `q5`/google run's stale Agent Desk answer is preserved verbatim as evidence.
3. **Source guard**: `npm run check` → exit 0, "TinyStudio.io checks passed." The AI-search evidence-artifact guard (`scripts/check-site.mjs` lines 751-807) enforces git-tracked fixtures, audit-page markers, the four strict states in `public/audit.js`, and byte-for-byte bundle/fixture equality.
4. **Full suite**: `npm test` → 117 tests, 0 failures (heading-hierarchy 6/6, sitemap 7/7, agent-worker 76/76, agent-ui 16/16, product-contract 8/8, first-viewport-audience 4/4). Only pre-existing, out-of-scope note: `/` overflows at 240/260px (does not gate exit code, unrelated to q5).
5. **Live served == source bytes** (2026-08-14): fresh HTTPS fetches of `/audit`, `/llms.txt`, `/offer.md` are byte-identical to their `public/` sources (md5 match on all three). The Cloudflare release-state record pins the deployed SHA at `e9fc96a`, the same commit as this lane's head.
6. **Tied surfaces**: homepage `#identity` `q5` row carries `data-ai-question="q5-what-is-tinystudio-io"` with the leak-audit wording; `llms.txt` and `offer.md` carry the matching `## Identity` block and the `q5` → homepage answer-readiness mapping.

## Files changed

- `docs/evidence/ai-search/2026-08-14-q5-ground-truth-reverify.md` — new evidence receipt recording the closeout on the current head and live site (the lane's claimed file).
- `.lane/reports/docs-q5-ground-truth-reverify-2026-08-14.md` — this report.

## Verification commands

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- `npm test` → exit 0, 117 tests / 0 failures.
- `git diff --check` → clean.
- Bundle equality probe (node) → `bundle === serialised fixtures: true`; `q5` truth printed verbatim.
- `curl https://tinystudio.io/{audit,llms.txt,offer.md} | md5sum` → identical to `public/` sources.

## Honest boundary

This lane claims nothing about any engine's answer. The `q5`/google run from 2026-08-09 still records `wrong` with the verbatim retired-Agent-Desk answer; only a future controlled re-run through the same fixture can measure whether engines now read the corrected yardstick and the live pages.
