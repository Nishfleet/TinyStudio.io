# Lane evidence: fix-ci-install-playwright-before-tests

**Branch:** `fix-ci-install-playwright-before-tests`
**Date:** 2026-08-23

## Symptom

PR #305 failed `verify` during `npm test` on runner `tinystudio-verify3`:
https://github.com/nish3451/TinyStudio.io/actions/runs/32622678080/job/97153164102

Failure at `scripts/test-narrow-viewport-pages.mjs:98`:
```
browserType.launch: Executable doesn't exist at
/var/lib/github-runners/tinystudio-verify3/.cache/ms-playwright/chromium_headless_shell-1234/...
```

## Root cause

Job `verify` in `.github/workflows/ci.yml` ran `npm test` (which includes Playwright browser suites) before any `npx playwright install chromium` step. The only install lived inside the later "Render-blocking regression check (real Chromium)" step — unreachable when `npm test` failed first on a cold browser cache.

## Fix (one-line diff)

After `npm ci`, insert:
```yaml
      - run: npx playwright install chromium
```

The render-blocking step's install remains unchanged below.

## Local verification

```
$ npm run check
TinyStudio.io checks passed.
```

## PR

- URL: https://github.com/nish3451/TinyStudio.io/pull/307
- Number: #307
- Head SHA: 35bbc36 (first commit; evidence commit follows)

## CI checks (PR #307)

| Check | Result |
|-------|--------|
| verify | pass (1m35s) — https://github.com/nish3451/TinyStudio.io/actions/runs/32625271589/job/97159548691 |
| Gitleaks | pass (16s) — https://github.com/nish3451/TinyStudio.io/actions/runs/32625271610/job/97159548681 |

No `--with-deps` contingency needed; plain `install chromium` sufficed.
