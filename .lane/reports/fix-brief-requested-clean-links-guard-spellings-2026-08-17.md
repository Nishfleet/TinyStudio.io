# Lane report: harden the brief-requested clean-links guard against every redirecting spelling (2026-08-17, lane 1)

Lane: tinystudio-io lane 1
Branch: `fix/brief-requested-clean-links-guard-spellings-2026-08-17`
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and
back links at clean non-307 paths — post-signup surface still carries the
redirecting-internal-link fault"

## Outcome

**Hardened.** The named fix (clean anchors on `/brief-requested` and the
guard entry) landed on `main` via PR #145 (`f9214c1`, 2026-08-14) and
remains landed on current `origin/main` (`f309dd4`). Live (2026-08-17)
`/brief-requested` serves 200 with the five clean anchors (`/`,
`/audit`, `/agents`, `/pricing`, `/`), the clean targets all return 200,
and the post-signup sub-resources all return 200.

This run found that the guard that is supposed to make the fault
impossible to return only matched the bare-filename spelling
(`href="audit.html"`). Three other redirecting spellings of the same
fault — `/audit.html`, `./audit.html`, and
`https://tinystudio.io/audit.html` (plus `https://www.…`, the
protocol-relative `//tinystudio.io/audit.html`, the
query-bearing `/audit.html?utm=x`, the fragment-bearing
`/audit.html#next`, and `brief-requested.html` itself) — were not
caught. PR #243 ships the guard hardening: every same-origin anchor
target is normalized before the lookup, single-quoted `href` is
accepted, and `brief-requested.html` → `/brief-requested` joins the
target map (live 307 verified).

## Verification performed

1. **Live probe of the surface** — `/brief-requested` 200 with five
   clean anchors; no `.html` anchor in the served HTML.
2. **Live probe of every target** — `/`, `/audit`, `/agents`, `/pricing`,
   `/shared.css`, `/brief-requested.css`, `/brief-requested.js`,
   `/fonts.js`, `/favicon.svg`, `/apple-touch-icon.png` all 200.
   `/brief-requested.html` → 307 `/brief-requested`.
3. **`check-site.mjs`** on current main → "TinyStudio.io checks
   passed." (exit 0).
4. **Negative probe** — re-introducing each of the nine redirecting
   spellings on `public/brief-requested.html` (restored between
   probes) → each makes `check-site.mjs` exit 1 with the targeted
   message naming the clean destination.
5. **False-positive probe** — off-site `https://inish.in/audit.html`,
   `mailto:`, `#start`, and the clean spellings `/audit` and
   `https://tinystudio.io/audit` → exit 0.
6. **Pre-fix proof** — re-introducing `/audit.html`, `./audit.html`,
   and `https://tinystudio.io/audit.html` on the pre-fix tree
   → `check-site.mjs` exit 0 (the unmodified guard walked past all
   three). Post-fix: each → exit 1.
7. **Full suite on the fix tree** — headings 6/6, sitemap 7/7,
   worker 80/80, UI, first-viewport-audience, narrow-viewport pages,
   narrow-viewport, render-blocking, product-contract 8/8.

## Files changed

- `scripts/check-site.mjs` — internal-links guard normalizes anchor
  targets and adds `brief-requested.html` to the target map.
- `docs/evidence/brief-requested-clean-links-rereverify-2026-08-17.md`
  — evidence receipt for this run.

## Delivery

- Branch: `fix/brief-requested-clean-links-guard-spellings-2026-08-17`
- Base: `origin/main` (`f309dd4`)
- Commit: `c039fbd fix(check): catch every redirecting spelling of an
  internal .html page link`
- PR: #243 against `main` (open)
