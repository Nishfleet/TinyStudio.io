# Locked Wrangler toolchain: 4.103.0 → fixed release — re-verify 2026-08-12

Date: 2026-08-12
Scope: backlog item "[unreviewed-by-grok] Upgrade the locked Wrangler
toolchain from 4.103.0 to a fixed release — `npm audit` now reports [four
high-severity findings]" (scout 2026-08-09/11, risk: high). The finding was
fixed and merged as PR #101 (`37ddaed`, "fix(deps): upgrade locked wrangler
toolchain to 4.120.1 (npm audit: 4 high -> 0)", 2026-08-11), with a closeout
receipt at `docs/evidence/wrangler-toolchain-audit-fix-2026-08-11.md`. This
receipt re-verifies every acceptance criterion against the current head
(`ad9cee3`, 2026-08-12) and a fresh `npm ci`, because the item is still tagged
unreviewed-by-grok and origin/main has moved since the 2026-08-11 receipt.

## What changed on main since the 2026-08-11 receipt

Commits between `37ddaed` and `ad9cee3` (2026-08-12): favicon/`rel=icon`
fixes (`9302611`, `18128e8`), intake-form label and document-title fixes
(`d4a2c30`), PR #29 closeout (`a0b83b0`), a ship-verify evidence commit
(`43c9e14`), an AI-search evidence commit (`8606b0c`), a CodeRabbit MD040
doc fix (`62eec0a`), an AI-search ground-truth fix (`ed62202`), and merges of
PR #141 and #43. **None touch `package.json` or `package-lock.json`** (0
commits in that path), so the toolchain lock is byte-identical to the
2026-08-11 fix. This is a source/offline check plus a local dry-run bundle
check, not a live-deployment measurement (nothing in the dependency change
touches served bytes).

## Acceptance criteria — current head `ad9cee3`, fresh `npm ci`

1. The lockfile pins `wrangler` at a release ≥ the first fixed release, with
   the vulnerable `sharp` and `undici` chains out of range.
   - `package.json`: `"wrangler": "^4.120.1"` (range floor raised from
     `^4.93.0` so future installs cannot resolve below the fixed range).
   - `package-lock.json`: `wrangler@4.120.1` → `miniflare@5.20260804.0-alpha`
     → `sharp@0.35.2` (≥ 0.35.0, fixes GHSA-f88m-g3jw-g9cj) and
     `undici@7.29.0` (> 7.28.0, fixes GHSA-8xcm-r25x-g524 and four more).
2. `npm audit` reports zero vulnerabilities on a fresh install from the
   lockfile (was 4 high at 4.103.0).
3. The full `npm test` gate chain passes under the locked toolchain.
4. The worker bundles cleanly: `wrangler deploy --dry-run` passes.

## Results (2026-08-12, fresh `npm ci` on this head)

1. `npm ci` — installs cleanly from the lockfile, `found 0 vulnerabilities`.
2. `npm audit` — `found 0 vulnerabilities` (was 4 high).
3. `npm ls wrangler miniflare sharp undici` — `wrangler@4.120.1`,
   `miniflare@5.20260804.0-alpha`, `sharp@0.35.2`, `undici@7.29.0`, all
   deduped under wrangler, no extraneous or missing packages.
4. `npm test` — exit 0: `npm run check` ("TinyStudio.io checks passed."),
   heading-hierarchy 6/6, sitemap 7/7, agent-worker 55/55, agent-UI 16/16,
   product-contract 8/8 — 92/92 green.
5. `node_modules/.bin/wrangler deploy --dry-run` — `⛅️ wrangler 4.120.1`,
   reads 30 files from `public/`, total upload 54.37 KiB / gzip 15.15 KiB,
   binds `DB` (D1), `AI` and `ASSETS` resolved, `--dry-run: exiting now.`,
   exit 0. The bundle builds under the locked 4.120.1.

## Conclusion

The item's acceptance criteria are met on current main: the lockfile pins the
fixed chain `wrangler 4.120.1` → `miniflare 5.20260804.0-alpha` → `sharp
0.35.2` / `undici 7.29.0` and has not drifted since PR #101 merged,
`npm audit` reports zero vulnerabilities from a fresh `npm ci`, the full test
gate chain (92/92) passes, and the worker bundles cleanly under the upgraded
toolchain. Nothing further to change; the item can be ticked.
