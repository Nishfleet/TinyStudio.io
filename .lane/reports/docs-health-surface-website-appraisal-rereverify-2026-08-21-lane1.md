# Lane 1 — Live /health surface and signup intake labels — re-verify (2026-08-21)

Branch: `docs/health-surface-website-appraisal-rereverify-2026-08-21-lane1`
Item: `a3ab4b7420` — "[unreviewed-by-opus] The live worker /health surface
still reports `surface:"agent-desk"` and the signup intake so"

## Outcome: CLOSED — the failure mode is gone on current main and live

The item's failure mode — `/health` reporting `surface:"agent-desk"` and the
signup intake labeled the same — does not occur on the current head
(`92d55c3`, fetched fresh from `origin/main`) or on the live deployment as
probed 2026-08-21. The fix (PR #164, `aeb34a9`, merged 2026-08-13) is already
in `origin/main`; the prior receipt
(`docs/evidence/health-surface-website-appraisal-rereverify-2026-08-14.md`)
closed the same state against `533ee19`, and this re-verify confirms the
guarantee held through the current head. This lane delivers a dated receipt
on the current head so the tracker cannot re-open the item by drift, the same
pattern the 2026-08-14 lane used.

## Source checks on current main (92d55c3)

1. `npm run check` → exit 0 ("TinyStudio.io checks passed."), including the
   `surface: APPRAISAL_SURFACE` guard in `scripts/check-site.mjs`.
2. `npm test` → exit 0, 126 pass / 0 fail across all suites.
   - `scripts/test-agent-worker.mjs` "worker /health names the current
     Website Appraisal surface, not the retired Agent Desk": asserts
     `body.surface === "website-appraisal"` and `!== "agent-desk"`.
   - Same file, signup-intake test: current-intake `INSERT INTO
     email_signups` carries `"website-appraisal"` and explicitly
     `notEqual "agent-self-serve"`.
   - Same file, "worker /health verdict keys off the current intake path":
     verdict depends only on `email_signups`, not the retired
     `agent_runs`/`agent_usage_limits` tables or the AI binding.
   - Legacy path keeps its own label: `/api/agent-audit` rows still carry
     `agent-self-serve` (tested).
3. Source: `src/worker.js` — `APPRAISAL_SURFACE = "website-appraisal"`
   (line 114); `/api/signups` saves via
   `saveEmailSignup(request, env, url, email, APPRAISAL_SURFACE, website)`
   (line 454); `/health` reports `surface: APPRAISAL_SURFACE` (line 1341).
   The retired label appears only on the legacy `/api/agent-audit` path
   (lines 521, 1215).

## Live probes 2026-08-21

- `GET https://tinystudio.io/health` → 200:
  `{"ok":true,"service":"tinystudio-io-public","surface":"website-appraisal","db":"configured","checks":{"db":true,"signupsTable":true,...}}`
- `GET https://app.tinystudio.io/health` → retired-app 410 page pointing at
  The Website Appraisal (no live /health on the retired host).
- `GET https://api.tinystudio.io/health` → retired-API JSON naming The
  Website Appraisal as the current offer.

## Files touched

- `docs/evidence/health-surface-website-appraisal-rereverify-2026-08-21.md`
  — the dated evidence receipt on the current head, mirroring the
  structure of the 2026-08-14 receipt with today's source checks and live
  probes.
- `.lane/reports/docs-health-surface-website-appraisal-rereverify-2026-08-21-lane1.md`
  — this lane report (lane-unique path; no shared report file touched).

No shared report files (`.lane/report.md`, `docs/status.md`) were written.
No production code changed: the fix already landed via PR #164; this lane's
deliverable is the re-verification receipt.

## Closeout

Item `a3ab4b7420` is closed: `/health` and the signup intake report
`website-appraisal` on current main and live. PR opened for the receipt.
