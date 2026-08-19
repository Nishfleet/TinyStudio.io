# Parked PRs #116/#128/#137 — triage closeout (2026-08-18)

Date: 2026-08-18
Scope: the backlog item "triage parked PRs #116 #128 #137 — land/rebase/close
with reasons". This receipt records the current GitHub state of each parked
PR and the disposition taken for each. It is process evidence, not a
live-site measurement; the site-side verification of each fix is carried by
the surviving delivery path and by the repo's standing `npm run check` and
`npm test` suites.

## Current GitHub state (2026-08-18, this run)

| PR | head branch | state | disposition |
|---|---|---|---|
| #116 | `fix/signup-monthly-cap-lane1` | CLOSED 2026-08-18T15:40:46Z, never merged | **REBASE → land #245** |
| #128 | `lane1/ai-search-rerun-entity-offer-20260812` | CLOSED 2026-08-18T15:40:45Z, never merged | **CLOSE — already landed via #211** |
| #137 | `fix/q5-ground-truth-drop-agent-desk-lane1` | CLOSED 2026-08-18T15:40:45Z, never merged | **CLOSE — already landed via ed62202** |

## PR #116 — six-a-month intake cap → REBASE, land #245

`fix(worker): honor the six-a-month intake cap with a truthful closed-intake
response`. The original branch was cut before main gained the daily
rate-limit tests (`CountingStatement`/`CountingDB`), the storage-failure
honesty tests, and the `APPRAISAL_SURFACE` health labeling, so it went
`CONFLICTING`/`DIRTY` against current main.

The fix was rebased onto current `origin/main` as **PR #245**
(`triage/pr116-rebase-20260818`, head `f8fc481`), which:
- keeps main's `APPRAISAL_SURFACE` label on the signup row (not the retired
  `agent-self-serve` label the old branch used),
- keeps main's storage-failure try/catch and makes the cap increment fail
  closed to `503 storage_unavailable`,
- adds the monthly-cap tests as a separate block with a `capSignupRequest`
  helper (no collision with main's `signupRequest({accept})`).

#245 is `MERGEABLE` (no conflicts) and is the surviving delivery path for the
#116 fix. **Disposition: land #245.** Local smoke on the single most relevant
test file (`node --test scripts/test-agent-worker.mjs`) passes 83/83. CI
(`verify` + `Gitleaks`) is queued but the self-hosted `vps-verify` runners
are offline at triage time, so the merge is pending CI green.

## PR #128 — AI-search controlled re-run → CLOSE (already landed)

`evidence(ai-search): controlled entity-and-offer re-run on 2026-08-12
(Bing, DuckDuckGo)`. The stranded 2026-08-12 re-run was reconciled onto
current main by **PR #211** (`reconcile/ai-search-rerun-pr128-2026-08-15`,
merged 2026-08-15T18:30:57Z, merge commit `a654ab4`). The evidence fixture on
`origin/main` carries `testedOn: 2026-08-12` with 15 runs, confirming the
content landed. **Disposition: close with reason "already landed via #211".**

## PR #137 — drop retired Agent Desk from q5 ground truth → CLOSE (already landed)

`fix(evidence): drop retired Agent Desk from q5 ground truth in AI-search
controlled questions`. The same intent already landed on main via commit
`ed62202` ("fix(evidence): align AI-search q5 ground truth with the current
offer, not the retired Agent Desk"), which is an ancestor of `origin/main`.
The q5 truth on main now reads "tinystudio.io is TinyStudio's own site: the
free leak audit of high-ticket service homepages, and the human-reviewed
desk that closes what the audit finds." — the retired Agent Desk is already
dropped. **Disposition: close with reason "already landed via ed62202".**

## Net result

- #128 and #137 are closed with reasons; their content is already on main.
- #116's fix is rebased and ready as #245; landing is pending CI green
  (self-hosted runners offline at triage time).
