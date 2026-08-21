# Lane report: q5 ground-truth re-verify (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `docs/q5-ground-truth-reverify-2026-08-21`
Item: `a792ca1847` — "[unreviewed-by-opus] Replace the retired "Agent Desk" ground truth in the AI-search controlled questions (q5) — fi"

## Outcome

Closed. The retired Agent Desk ground truth in the `q5` controlled question has already been replaced on `origin/main` — commit `ed62202` ("fix(evidence): align AI-search q5 ground truth with the current offer, not the retired Agent Desk", 2026-08-11), merged via PR #43 — and this lane re-verified the replacement against the current head (`92d55c3`) and the live deployment of that head. No code change was needed; the closeout evidence is recorded.

## Verification performed

1. **Fixture**: `evidence-fixtures/ai-search/controlled-questions.json` — the `q5` truth reads "tinystudio.io is TinyStudio's own site: the free leak audit of high-ticket service homepages, and the human-reviewed desk that closes what the audit finds." No "Agent Desk" appears in any question truth (the phrase "agent desk" appears only in the lowercase common-noun phrase, never as the retired product name).
2. **Bundle == fixture**: the embedded bundle in `public/audit.html` is byte-identical to `{"questions": …, "evidence": …}` serialised from the two fixture files (`JSON.stringify` equality → true). The test-on date is the 2026-08-20 re-run; the q5 truth inside the bundle is the current-offer wording. No run relabelled.
3. **Source guard**: `node scripts/check-site.mjs` → exit 0, "TinyStudio.io checks passed." The AI-search evidence-artifact guard enforces git-tracked fixtures, audit-page markers, the four strict states in `public/audit.js`, and byte-for-byte bundle/fixture equality.
4. **Full suite**: 132 tests, 0 failures — heading-hierarchy 6/6, sitemap 7/7, agent-worker 83/83, agent-ui 16/16, product-contract 8/8, first-viewport-audience 4/4, study-freshness 2/2, narrow-viewport 11/11. `git diff --check` clean.
5. **Live served == source bytes** (2026-08-21): `md5sum` of `public/llms.txt` matches `https://tinystudio.io/llms.txt`; `md5sum` of `public/offer.md` matches `https://tinystudio.io/offer.md`. The Cloudflare release-state record pins the deployed SHA at `b4d80f1c8736b59f75e07cb30a1fc7a3df078a01` (2026-08-17); the controlled-questions fixture was untouched between that deploy and the current head, so the q5 truth on live matches the source.
6. **Tied surfaces**: homepage `#identity` `q5` row carries `data-ai-question="q5-what-is-tinystudio-io"` with the leak-audit wording; `llms.txt` and `offer.md` carry the matching `## Identity` block and the `q5` → homepage answer-readiness mapping.

## Files changed

- `docs/evidence/ai-search/2026-08-21-q5-ground-truth-reverify.md` — new evidence receipt recording the closeout on the current head and live site (the lane's claimed file).
- `.lane/reports/docs-q5-ground-truth-reverify-2026-08-21.md` — this report.

## Verification commands

- `node scripts/check-site.mjs` → exit 0, "TinyStudio.io checks passed."
- `node --test scripts/test-agent-ui.mjs` → 16/16 pass.
- `node --test scripts/test-product-contract.mjs` → 8/8 pass.
- `node --test scripts/test-agent-worker.mjs` → 83/83 pass.
- `git diff --check` → clean.
- Bundle equality probe (node) → `bundle === serialised fixtures: true`; `q5` truth printed verbatim.
- `md5sum public/llms.txt` matches `curl https://tinystudio.io/llms.txt`; `md5sum public/offer.md` matches `curl https://tinystudio.io/offer.md`.

## Honest boundary

This lane claims nothing about any engine's answer. The `q5`/bing and `q5`/duckduckgo runs from the 2026-08-15 re-run still record the verbatim retired-Agent-Desk organic snippet observation; only a future controlled re-run through the same fixture can measure whether engines now read the corrected yardstick and the live pages.
