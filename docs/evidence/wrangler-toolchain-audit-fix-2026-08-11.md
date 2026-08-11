# Locked Wrangler toolchain audit findings — upgrade to 4.120.1 and closeout

Date: 2026-08-11
Scope: the review item "Upgrade the locked Wrangler toolchain from 4.103.0 to
a fixed release — `npm audit` now reports [four high-severity findings]"
(review queue, unreviewed-by-grok), closed by this PR against current
origin/main.
This receipt records the dependency-tree verification and the toolchain
re-validation. It is a source/offline check plus a local dry-run bundle
check, not a live-deployment measurement (nothing in the dependency change
touches served bytes).

## What the item claimed

- The lockfile pinned `wrangler` at 4.103.0.
- `npm audit` reported high-severity findings reachable through that
  toolchain.

## What `npm audit` reported on main (2026-08-11, pre-fix)

| package | vulnerable range | advisories | severity |
|---|---|---|---|
| `sharp` | `<0.35.0` | GHSA-f88m-g3jw-g9cj (libvips CVEs CVE-2026-33327, CVE-2026-33328, CVE-2026-35590, CVE-2026-35591) | high |
| `undici` | `7.0.0 – 7.28.0` | GHSA-8xcm-r25x-g524, GHSA-4cwx-7wf7-3272, GHSA-m8rv-5g2x-5cg5, GHSA-jr45-8vmc-qm54, GHSA-v3r7-h72x-cjcm | high |

Four high-severity findings total. Both packages were reachable only through
the `wrangler` → `miniflare` chain: `wrangler 4.103.0` depended on
`miniflare 4.20260617.1`, which depended on the vulnerable `sharp` and
`undici`. `sharp` and `undici` have no other consumers in the tree (the
lockfile was diff-checked after the fix; see below).

## The fix

- `package.json`: `"wrangler": "^4.93.0"` → `"wrangler": "^4.120.1"` — the
  range floor is raised to the first fixed release, so a future `npm install`
  cannot resolve the lockfile back below the fixed range.
- `package-lock.json`: regenerated; `wrangler` → `4.120.1` (which depends on
  `miniflare 5.20260804.0-alpha`), `sharp` → `0.35.2` (≥ 0.35.0), `undici`
  → `7.29.0` (> 7.28.0), `esbuild` unchanged (`0.28.1`, same as 4.103.0).
- No other dependency changed: the only version deltas in the lockfile diff
  are within the wrangler/miniflare subtree (`esbuild`'s transitive platform
  packages, `workerd`, `unenv`, `@cloudflare/unenv-preset`, `ws`, `youch`,
  `sharp`, `undici`). No production dependency of the Worker changed — the
  Worker ships no node_modules at deploy time (bundled by wrangler), so this
  is a build-toolchain change only.

## Verification (all on this branch, wrangler 4.120.1)

1. `npm audit` → `found 0 vulnerabilities` (was 4 high).
2. `npm test` passes (exit 0): `npm run check` (site checks: meta
   descriptions, canonical URLs, structured data, internal links, sitemap,
   worker config contract), then heading-hierarchy 6/6, sitemap 7/7,
   agent-worker, agent-UI and product-contract suites — all green.
3. `npm run check:render-blocking` passes: all six served pages load the
   Google Fonts stylesheet non-blocking under the production CSP in real
   Chromium (CI-parity browser check).
4. `wrangler deploy --dry-run` passes: reads 30 files from `public/`, total
   upload 54.15 KiB / gzip 15.07 KiB, binds `DB` (D1), `AI` and `ASSETS`
   resolved, `--dry-run: exiting now`. The bundle builds under 4.120.1.
   (One local-environment note: this machine has a stray empty
   `/home/nish/package.json` outside the repo that breaks Node tooling which
   walks three directory levels up from a worktree; the dry-run was
   re-verified with that file moved aside and in a same-depth copy under
   `/tmp`, and passes in both. The self-hosted CI runner checks out under
   `/var/lib/github-runners/verify*/_work/…`, where no such file exists.)
5. Scope check on the resolved tree: `npm ls wrangler miniflare sharp undici`
   resolves `wrangler@4.120.1`, `miniflare@5.20260804.0-alpha`,
   `sharp@0.35.2`, `undici@7.29.0`, all deduped, no extraneous or missing
   packages.

## Limitation

`npm audit` reflects the advisory database at run time; a future advisory
against the now-current ranges would need its own fix. The lockfile change
touches only the build toolchain — the served site is static assets plus the
wrangler-bundled Worker, so this PR changes no served bytes. CI runs the same
gates (`npm ci`, `npm test`, Chromium render-blocking check,
`wrangler deploy --dry-run`) against this PR before merge.

## Closeout

This closes the review item "Upgrade the locked Wrangler toolchain from
4.103.0 to a fixed release": the lockfile now pins the fixed chain
`wrangler 4.120.1` → `miniflare 5.20260804.0-alpha` → `sharp 0.35.2` /
`undici 7.29.0`, `npm audit` reports zero vulnerabilities, `npm test` and the
render-blocking browser check pass, and the worker bundles cleanly under the
upgraded toolchain.
