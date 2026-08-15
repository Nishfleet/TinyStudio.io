# Lane 1 report — reconcile the stranded 2026-08-12 AI-search re-run (PR #128)

Branch: `reconcile/ai-search-rerun-pr128-2026-08-15`
PR: https://github.com/nish3451/TinyStudio.io/pull/211 (MERGEABLE, open)
Base: fresh `origin/main` `2d8599a`

## Outcome

Done. The 2026-08-12 AI-search controlled re-run that was stranded in
CONFLICTING unowned PR #128 is re-landed on current main via PR #211.

## What was found

PR #128 carried the only fresh 2026-08-12 AI-search captures (DuckDuckGo
q1/q2/q5, Bing q1/q5/q7 — all `Wrong` or `Absent`) but went CONFLICTING
against main (main moved past its base with the 2026-08-09 controlled
re-run, the q5 ground-truth alignment via PR #43, the /audit in-content
request CTA, and the retired Agent Desk ground-truth drop). It had no owner
and no one resolved it, so the live `/audit` panel kept rendering the
2026-08-09 record.

## What the reconciliation changes

1. `evidence-fixtures/ai-search/evidence.json` — 2026-08-12 captures
   verbatim from PR #128's branch, `testedOn` 2026-08-12; 2026-08-06 Google
   captures and `not-tested` runs retained; nothing relabelled `Found`.
2. `evidence-fixtures/ai-search/controlled-questions.json` — unchanged
   (main's current q5 truth stands; the stranded branch's retired Agent
   Desk wording predates PR #43 and is not resurrected).
3. `public/audit.html` — embedded AI-search bundle regenerated from the
   fixtures; drift guard passes.
4. `scripts/test-agent-ui.mjs` — strict-state set now expects
   `["absent", "not-tested", "wrong"]` (the 2026-08-12 Bing runs
   reintroduce `absent`).
5. `docs/evidence/ai-search/2026-08-12-controlled-rerun.md` — original
   receipt plus reconciliation note.
6. `docs/evidence/ai-search/2026-08-14-rerun-reconcile.md` — this pass's
   receipt.

## Verification

- `npm run check` passes (embedded-bundle drift guard)
- `npm test` passes (121 tests, 0 failures)
- `git diff --check` clean
- Branch rebased cleanly on fresh `origin/main`; PR #211 reports
  `mergeable: MERGEABLE`

## Honest limits

No live engine run happened in this pass. The backlog item "Re-establish
verified AI-search entity and offer understanding after the 2026-08-08
15:04 live recheck" honestly stays open: all six fresh 2026-08-12 runs are
`Wrong` or `Absent`, Google could not be re-run (CAPTCHA), and no `Found`
transition occurred. No ranking, visibility, lead, or revenue outcome is
claimed. PR #128 and PR #137 are left open for the fleet controller to
close; this lane does not own other lanes' PRs.
