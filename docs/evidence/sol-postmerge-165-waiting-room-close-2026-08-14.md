# sol-postmerge-165 waiting-room close — 2026-08-14

Report path: /home/nish/workspaces/agent-state/tinystudio-io-improvement-loop/sol/postmerge-165.md

Verdict: finding HELD. PR #165 returned 503 on a thrown `email_signups` write
but still recorded IP + email quota and an `agent_runs` row. Fix: save the
lead first; roll back partial quota on later storage throws inside
`enforceAgentLimits`.

Named default honored: post-merge defect is machine-ownable work; fixed
because the finding holds.

## What this packet did

- worker reorder + rollback (`src/worker.js`)
- tests (`scripts/test-agent-worker.mjs`)
- check-site guard (`scripts/check-site.mjs`)
- this close-out
- backlog tick, journal note

## What was NOT done

- no deploy
- no migration
- no payment
- no auth-flow
- no secret use
- no live signup POST

## Files changed

- `src/worker.js` — persist `email_signups` before consuming quota; roll back
  partial quota/`agent_runs` writes when a later storage write throws inside
  `enforceAgentLimits`.
- `scripts/test-agent-worker.mjs` — strengthen the email_signups-failure
  test; add rollback coverage; teach CountingDB to honor injected failures
  and decrements; pin the decrement SQL on the real schema.
- `scripts/check-site.mjs` — add a source-order guard that
  `agentAuditResponse` calls `saveEmailSignup` before `enforceAgentLimits`,
  and that the rollback warn token exists.
- `docs/evidence/sol-postmerge-165-waiting-room-close-2026-08-14.md` — this
  close-out.

## Proof

`npm run test:worker` exit 0, 78/78 tests pass. New/strengthened tests:

- storage failure: agent audit returns 503 storage_unavailable when the
  email_signups write throws and never runs the model (now also asserts no
  quota and no agent_runs were recorded)
- storage failure: agent audit rolls back quota when the agent_runs insert
  throws
- storage failure: agent audit rolls back the IP counter when the email
  counter write throws

`npm run check` exit 0 ("TinyStudio.io checks passed."). `npm test` exit 0.

## Rollback

Revert the product commit (fix/sol-postmerge-165-usage-on-503); triage
Disposition stays QUEUED.
