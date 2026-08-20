# Lane 1 report — appraisal-page canonicals and JSON-LD WebPage @ids at clean non-307 URLs (2026-08-21 re-verify)

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item `f7a18209b7`, `[unreviewed-by-opus]`).

Branch: `fix/appraisal-page-clean-canonicals-rereverify-lane1-2026-08-21`
Commit: pending (WIP push)

## Status

Item already landed on origin/main. This lane is a re-verification, not a
fresh fix.

## Why the source already names the clean URLs

Two commits, both ancestors of current `origin/main` (`92d55c3`):

1. `1cc7a4e` (PR #56) — migrated the audit page's canonical, `og:url`,
   JSON-LD `@id`, and JSON-LD `url` from the `.html` form to the clean
   `/audit` form.
2. `ed2b1a9` (PR #218) — same migration for `agents`, `pricing`, and
   `specimen`.

`scripts/check-site.mjs` enforces both migrations:

- Canonical guard expects exactly one non-commented `<link rel="canonical">`
  per page, inside `<head>`, with no URL duplicated across pages, and for
  the audit page the expected href is `https://tinystudio.io/audit`.
- Structured-data guard expects the JSON-LD `WebPage` `@id` to equal
  `${pageUrl}#webpage`, so the `@id` stays on the clean form by
  construction.

## Evidence

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- Test suites (no `npm` on this VPS, scripts invoked directly with `node`):
  - `test-heading-hierarchy.mjs` → 6/6
  - `test-agent-worker.mjs` → 83/83
  - `test-agent-ui.mjs` → 16/16
  - `test-product-contract.mjs` → 8/8
  - `test-sitemap.mjs` → 7/7
  - `test-study-freshness.mjs` → 2/2
  - `test-narrow-viewport.mjs` → all narrow viewports PASS
  - `test-narrow-viewport-pages.mjs` → all four owned routes PASS
- Live 307/200 measurement:
  - `https://tinystudio.io/audit` → 200 (clean, no redirect)
  - `https://tinystudio.io/audit.html` → 307 → `https://tinystudio.io/audit`
- Served `/audit` head (verified live, 2026-08-21):
  - `<link rel="canonical" href="https://tinystudio.io/audit">`
  - `<meta property="og:url" content="https://tinystudio.io/audit">`
  - JSON-LD `WebPage` node: `"@id": "https://tinystudio.io/audit#webpage"`,
    `"url": "https://tinystudio.io/audit"`

## Files touched

- `docs/evidence/appraisal-page-clean-canonicals-rereverify-2026-08-21.md`
  (new evidence doc, this re-verification)
- `.lane/reports/fix-appraisal-page-clean-canonicals-rereverify-lane1-2026-08-21.md`
  (this lane report)

No source/asset change required: the item is already live and enforced.
