# AI-search controlled re-run reconciliation — PR #128 stranded re-run landed against current main

Date: 2026-08-15
Scope: the 2026-08-12 AI-search controlled re-run (PR #128, branch
`lane1/ai-search-rerun-entity-offer-20260812`), stranded CONFLICTING and
unowned; the live `/audit` evidence panel it was meant to refresh; and the
`q5` ground truth on current main. This receipt records the reconciliation
of that re-run onto the current `origin/main` head (`05efed1`) so the fresh
2026-08-12 captures are no longer stranded behind a dead PR. It is a
repository-side reconciliation; it runs no new live engine capture.

## Why this pass exists

PR #128 carried the only fresh 2026-08-12 AI-search captures (DuckDuckGo
q1/q2/q5, Bing q1/q5/q7 — all `Wrong` or `Absent`). It went `CONFLICTING`
against main because main moved past its base (18128e8) with the 2026-08-09
controlled re-run (8606b0c), the q5 ground-truth alignment (ed62202, merged
via PR #43), the /audit in-content request CTA (885a7a9), and the retired
Agent Desk ground-truth drop (ed62202's equivalent, 60958fc reverified
2026-08-14). The PR had no owner and no one resolved it, so the 2026-08-12
measurement never reached main and the live `/audit` panel kept rendering
the 2026-08-09 record.

## What the reconciliation changes

1. `evidence-fixtures/ai-search/evidence.json` — carries the 2026-08-12
   captures verbatim from PR #128's branch (the six runnable pairs), with
   `testedOn` moved to 2026-08-12. The 2026-08-06 Google captures and the
   two `not-tested` runs are retained with their original tested dates, and
   the one-run-per-pair rule is respected: the Google pair is untouched
   because no Google run was executed on 2026-08-12 (CAPTCHA). Nothing is
   relabelled `Found`. The 2026-08-09 Google/Bing/DuckDuckGo captures that
   main carried are superseded for the pairs the 2026-08-12 run actually
   executed; they remain in git history.
2. `evidence-fixtures/ai-search/controlled-questions.json` — unchanged from
   current main; the `q5` truth is main's ("the free leak audit of
   high-ticket service homepages, and the human-reviewed desk that closes
   what the audit finds"), not the retired Agent Desk wording PR #128's
   branch carried. The ground-truth replacement already landed on main via
   PR #43 (ed62202) and was re-verified on 2026-08-14 (60958fc); the
   stranded branch predates it and must not resurrect it.
3. `public/audit.html` — the embedded AI-search bundle is regenerated from
   the two fixtures, so the drift guard (`scripts/check-site.mjs`) passes.
   All other audit-page bytes (including the in-content request CTA from
   885a7a9) are main's, unchanged.
4. `scripts/test-agent-ui.mjs` — the strict-state set assertion now expects
   `["absent", "not-tested", "wrong"]`, because the 2026-08-12 fixture
   reintroduces `absent` runs (Bing q5/q7). The 2026-08-09 fixture carried
   no `absent` runs, so the previous expectation `["not-tested", "wrong"]`
   reflected that specific fixture, not a schema invariant; the `check-site`
   guard already validates every state, `absent` included, so this is the
   only test-side change the 2026-08-12 capture set requires.
5. `docs/evidence/ai-search/2026-08-12-controlled-rerun.md` — the original
   receipt from the stranded branch, with a reconciliation note (this
   document) so the historical measurement and its landing path stay
   auditable.

## What deliberately did not change

- `evidence-fixtures/ai-search/README.md` — byte-identical; the existing
  `testedAt`, absent-sources, and strict-state rules already cover the
  2026-08-12 capture set, and the PR's receipt already states no README
  change is needed.
- No captured run, engine metadata, or `not-tested` reason changed. No live
  engine state was edited.
- No page-specific remediation (`remediation.page`) is claimed anywhere.
- PR #128 and PR #137 (the duplicate q5 ground-truth drop, now superseded
  by main's ed62202) are left open for the fleet controller to close; this
  lane does not own other lanes' PRs.

## What is tested and what is not

Tested: `npm run check` passes (the AI-search evidence-artifact guard,
including the byte-for-byte embedded-bundle equality); the full suite passes
(121 tests, 0 failures, including the updated strict-state set assertion and
the q5 under-claim test); `git diff --check` is clean.

Not tested: whether any engine now answers with tinystudio.io or reads the
offer correctly. The 2026-08-12 captures show the runnable engines still
answer from other businesses and the stale Agent Desk index entries; Google
could not be re-run from this host (CAPTCHA). The backlog item "Re-establish
verified AI-search entity and offer understanding after the 2026-08-08 15:04
live recheck" honestly stays open pending a source-backed `Found` transition
from a non-blocked session and separate deployment proof. Nothing here
implies a ranking, visibility, lead, or revenue outcome.

## Verification (reproduce)

```sh
npm run check
npm test
git diff --check
```
