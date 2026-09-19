# Appraisal-page canonicals and JSON-LD WebPage @ids at clean non-307 URLs — re-verification (2026-08-21, lane 1)

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item `f7a18209b7`, `[unreviewed-by-opus]`).

## What the item asks

The appraisal page (`public/audit.html`, served at `/audit`) must name, in its
`<link rel="canonical">`, `og:url`, and JSON-LD `WebPage` `@id`/`url`, the
address that serves 200 — the clean extensionless `/audit` — never the
`.html` twin that the deployed worker 307-redirects to it. A canonical that
names the redirecting form tells search engines to consolidate ranking
signals onto a 307 hop, not onto the page that actually serves 200.

## Fix already landed on main

Two commits, on the current `origin/main` (`92d55c3`):

1. `1cc7a4e` — "fix(public): point appraisal-page canonicals and JSON-LD
   @ids at the clean /audit URL (#56)". Migrated the audit page's canonical,
   `og:url`, JSON-LD `@id`, and JSON-LD `url` from the `.html` form to the
   clean `/audit` form, and moved the `scripts/check-site.mjs` canonical guard
   expectation for the audit page to `https://tinystudio.io/audit`.
2. `ed2b1a9` — "fix(public): point appraisal-page canonicals and JSON-LD
   WebPage @ids at the clean non-307 URLs (#218)". Same migration for the
   remaining three appraisal pages (`agents`, `pricing`, `specimen`), plus
   their `og:url`, JSON-LD `@id`/`url`, and the matching check-site guard
   expectations.

Verification that both commits are on current `origin/main`:

- `git merge-base --is-ancestor 1cc7a4e origin/main` → true.
- `git merge-base --is-ancestor ed2b1a9 origin/main` → true.
- `git log origin/main --oneline -- public/audit.html` → the audit page was
  last touched by the `d0daea9` evidence commit (content-additive only); no
  canonical/JSON-LD regression since.
- `git diff 75cfef2..92d55c3 -- public/audit.html` → empty (the recent
  pricing tap-target and apple-touch-icon guards touched only `pricing.html`
  / `check-site.mjs`, not the audit page).

## Source checks on this head

`node scripts/check-site.mjs` → "TinyStudio.io checks passed." The canonical
guard ("Canonical URLs (dogfood)") requires exactly one non-commented
`<link rel="canonical">` inside `<head>` per page, pointing at the page's
canonical `https://tinystudio.io` address, with no URL duplicated across
pages; for the audit page the expected href is
`https://tinystudio.io/audit`.

The structured-data guard further requires the JSON-LD `WebPage` node's
`@id` to equal `${pageUrl}#webpage` — so the `@id` and the `url` both stay
on the clean form by construction.

Full suite on this head (without `npm`, which is not installed on this
VPS, so each script is invoked directly with `node`):

| Suite | Result |
|---|---|
| `scripts/check-site.mjs` | pass |
| `scripts/test-heading-hierarchy.mjs` | 6/6 |
| `scripts/test-agent-worker.mjs` | 83/83 |
| `scripts/test-agent-ui.mjs` | 16/16 |
| `scripts/test-product-contract.mjs` | 8/8 |
| `scripts/test-sitemap.mjs` | 7/7 |
| `scripts/test-study-freshness.mjs` | 2/2 |
| `scripts/test-narrow-viewport.mjs` | all narrow viewports PASS |
| `scripts/test-narrow-viewport-pages.mjs` | all four owned routes PASS |

## Live verification (2026-08-21)

Fresh curl against the deployed site:

| Address | HTTP | Location |
|---|---|---|
| `https://tinystudio.io/audit` | 200 | — |
| `https://tinystudio.io/audit.html` | 307 | `https://tinystudio.io/audit` |

The served `/audit` head (and the served `/audit.html` head after the 307
lands on `/audit`) carries:

- `<link rel="canonical" href="https://tinystudio.io/audit">`
- `<meta property="og:url" content="https://tinystudio.io/audit">`
- JSON-LD `WebPage` node with `"@id": "https://tinystudio.io/audit#webpage"`
  and `"url": "https://tinystudio.io/audit"`

So the canonical, og:url, and JSON-LD WebPage identity all name the address
that serves 200, and none of them names the 307-redirecting `.html` twin.

## Conclusion

The item's fix is landed on current origin/main, enforced by the CI guard,
verified against the deployed site, and intact across the recent apple-touch
and pricing tap-target changes. Nothing further to change: the
`[unreviewed-by-opus]` tag is resolved by this re-verification record.

## Delivery

- Branch: `fix/appraisal-page-clean-canonicals-rereverify-lane1-2026-08-21`
- Files: `docs/evidence/appraisal-page-clean-canonicals-rereverify-2026-08-21.md`,
  `.lane/reports/fix-appraisal-page-clean-canonicals-rereverify-lane1-2026-08-21.md`
