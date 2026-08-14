# Live /health surface and signup intake — re-verify against current main and live

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] The live worker /health
surface still reports `surface:"agent-desk"` and the signup intake so". This
receipt re-verifies the item's guarantee against the current `origin/main`
head (533ee19, "docs(evidence): re-verify render-blocking finding
b8f6046e942a against current main and live (2026-08-14) (#204)") and the live
deployment of that head. It is source-evidence plus live probes of the
deployed Worker.

## Summary

The failure mode the item describes — the live worker `/health` surface
reporting `surface:"agent-desk"`, with the signup intake labeled the same —
**no longer occurs, on source and on the live site**. The fix is already
merged in `origin/main`: PR #164 (`aeb34a9`, merged 2026-08-13) labeled the
current `/health` surface and the `/api/signups` intake as The Website
Appraisal (`website-appraisal`), never the retired Agent Desk. The commit
predates this review item, so the item queued `[unreviewed-by-opus]` against
already-fixed state.

Two source guards now enforce the guarantee, and both pass on the current
head:

- `scripts/test-agent-worker.mjs` — "worker /health names the current Website
  Appraisal surface, not the retired Agent Desk" asserts
  `body.surface === "website-appraisal"` and `!== "agent-desk"`; the
  signup-intake test asserts the `email_signups` row carries
  `website-appraisal`, never `agent-self-serve`.
- `src/worker.js` — the intake handler saves signups with the
  `APPRAISAL_SURFACE` (`"website-appraisal"`) constant and `/health` reports
  `surface: APPRAISAL_SURFACE`; the retired `agent-self-serve` label survives
  only on the legacy `/api/agent-audit` path.

Live probes 2026-08-14 confirm the deployed Worker serves the fixed labels.

## Source checks on the current head (533ee19)

1. `npm run check` passes (exit 0): the site source guard is green.
2. `npm test` passes (exit 0): agent-worker 76/76, agent-UI 16/16,
   heading-outline 6/6, sitemap 7/7, plus product-contract, viewport, and
   narrow-viewport suites — zero failures. The two /health tests specifically
   pass:
   - "worker /health names the current Website Appraisal surface, not the
     retired Agent Desk" — asserts `body.surface === "website-appraisal"`
     and `body.surface !== "agent-desk"`.
   - "worker /health verdict keys off the current intake path, not the
     retired Agent Desk machinery" — asserts the verdict depends only on the
     `email_signups` table, not the retired `agent_runs`/`agent_usage_limits`
     tables or the AI binding.
3. The signup-intake test ("legacy /api/agent-audit still labels its rows
   with the retired self-serve source" is the legacy path) asserts the
   current-intake `INSERT INTO email_signups` carries value
   `"website-appraisal"` in the source column and explicitly
   `notEqual "agent-self-serve"`.

## Live re-verification 2026-08-14

Direct probes of the deployed Worker:

- `GET https://tinystudio.io/health` → 200:
  `{"ok":true,"service":"tinystudio-io-public","surface":"website-appraisal",...}`
- `GET https://app.tinystudio.io/health` → serves the retired-app 410 page
  (the retired host no longer exposes a live /health; the retraction page
  points at The Website Appraisal), from PR #100.
- `GET https://api.tinystudio.io/health` → retired-API JSON naming The
  Website Appraisal as the current offer (from PR #100).

The apex `/health` — the surface the item flags — reports
`surface:"website-appraisal"` with `ok:true`.

## Limitation

This is a live-deployment measurement, not a CI gate on the deployed Worker.
The regression guard lives in `scripts/test-agent-worker.mjs`, which fails
`npm test` if `/health` ever names anything but the current offer or if the
current intake's signup rows carry the retired label; `npm run check` and
`npm test` both pass on the current head, and the live probes match the
source.

## Closeout

The item as stated — the live worker `/health` still reporting
`surface:"agent-desk"` and the signup intake so — is **closed against
current main and live**: the code-side fix (PR #164, `aeb34a9`, merged
2026-08-13) is in `origin/main`, the worker tests and site guard enforce the
label on both `/health` and the current intake, and the deployed site's
`/health` reports `surface:"website-appraisal"` with `ok:true` as probed
2026-08-14. The receipt now records the closeout on the current head so the
item cannot be re-opened by tracker drift.
