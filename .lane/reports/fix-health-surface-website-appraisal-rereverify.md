# Lane 1 — re-verify the live /health surface and signup intake on current main and live (2026-08-14)

Branch: `fix/health-surface-website-appraisal-rereverify`
Item: `[unreviewed-by-opus] The live worker /health surface still reports
`surface:"agent-desk"` and the signup intake so`

## Verdict

CLOSED — already fixed and live. The item queued `[unreviewed-by-opus]`
against already-fixed state; no code change is needed.

## Evidence

- Fix commit `aeb34a9` (PR #164, merged 2026-08-13) labels the current
  `/health` surface and `/api/signups` intake as `website-appraisal`; the
  retired `agent-self-serve` label survives only on the legacy
  `/api/agent-audit` path. Both are in `origin/main` (533ee19).
- `src/worker.js:101` `APPRAISAL_SURFACE = "website-appraisal"`; `/health`
  reports `surface: APPRAISAL_SURFACE` (worker.js:1263); the intake handler
  saves signups with `APPRAISAL_SURFACE` (worker.js:376); the retired label
  is confined to the legacy path (worker.js:443, 1137).
- Guards: `scripts/test-agent-worker.mjs` asserts `/health` surface is
  `website-appraisal` and not `agent-desk` (test 52), asserts the verdict
  keys off the intake table only (test 53), and asserts the current-intake
  signup row carries `website-appraisal`, never `agent-self-serve`.
- `npm run check` → "TinyStudio.io checks passed." (exit 0).
- `npm test` → all suites green: agent-worker 76/76, agent-UI 16/16,
  heading-outline 6/6, sitemap 7/7, product-contract, viewport,
  narrow-viewport; zero failures. The only reported item is a pre-existing
  out-of-scope note (`/` overflows at 240px; does not gate the exit code).
- Live probes 2026-08-14:
  - `https://tinystudio.io/health` → 200,
    `{"ok":true,"service":"tinystudio-io-public","surface":"website-appraisal",...}`
  - `https://app.tinystudio.io/health` → retired-app 410 page naming The
    Website Appraisal (PR #100).
  - `https://api.tinystudio.io/health` → retired-API JSON naming The Website
    Appraisal as the current offer (PR #100).

## Files changed (this lane)

- `docs/evidence/health-surface-website-appraisal-rereverify-2026-08-14.md` —
  closeout receipt recording the re-verification on the current head and the
  live site, per the repo's established closeout pattern.

## Why no code change

The worker source on current main and the live deployment both already carry
the fix; there is no remaining code path that labels the current surface or
intake as `agent-desk`/`agent-self-serve` (the only surviving retired label
is confined to the legacy `/api/agent-audit` path by design). Changing code
would be a drive-by no-op.
