# Appraisal-page canonicals and JSON-LD @ids at the clean non-307 URLs — lane 1 (2026-08-15)

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item f7a18209b7, `[unreviewed-by-opus]`).

## What the item asks

Every appraisal page must name, in its `<link rel="canonical">`, `og:url`,
and JSON-LD `WebPage` `@id`/`url`, the address that serves 200 — the clean
extensionless form — never the `.html` twin that the deployed worker
307-redirects to it.

## State before this change

PR #56 (commit `1cc7a4e`, "point appraisal-page canonicals and JSON-LD @ids
at the clean /audit URL") migrated only `public/audit.html`. The
`check-site.mjs` canonical guard carried the deferral note: "the audit
page's canonical is the clean /audit, while the remaining pages keep their
.html form here until they are migrated the same way." The three remaining
pages still named the redirecting `.html` forms in canonical, `og:url`, and
JSON-LD `WebPage` `@id`/`url`:

- `public/agents.html` -> `https://tinystudio.io/agents.html`
- `public/pricing.html` -> `https://tinystudio.io/pricing.html`
- `public/specimen.html` -> `https://tinystudio.io/specimen.html`

## Live measurement (2026-08-15)

`curl -sI` against the deployed site:

| Address | HTTP | Location |
|---|---|---|
| `https://tinystudio.io/agents.html` | 307 | `/agents` |
| `https://tinystudio.io/agents` | 200 | — |
| `https://tinystudio.io/pricing.html` | 307 | `/pricing` |
| `https://tinystudio.io/pricing` | 200 | — |
| `https://tinystudio.io/specimen.html` | 307 | `/specimen` |
| `https://tinystudio.io/specimen` | 200 | — |
| `https://tinystudio.io/audit.html` | 307 | `/audit` |
| `https://tinystudio.io/audit` | 200 | — |

The sitemap already lists the clean forms (`/audit`, `/agents`, `/pricing`,
`/specimen`), and the internal-links guard already forbids `.html` hrefs —
the canonicals, `og:url`s, and JSON-LD identities were the remaining places
naming the redirecting twins.

## Fix (commit df69628)

Four lines per page, the exact shape of PR #56's audit migration:

- `public/agents.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/agents` (`@id` keeps `#webpage`)
- `public/pricing.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/pricing` (`@id` keeps `#webpage`)
- `public/specimen.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/specimen` (`@id` keeps `#webpage`)
- `scripts/check-site.mjs`: the canonical, social-share (`og:url`) and
  structured-data (`WebPage` `@id`/`url`) guard expectations for the three
  pages moved to the clean forms; the canonical-guard comment no longer
  defers the migration.

No page's Organization/WebSite nodes, titles, descriptions, or internal
links changed. The `llms.txt` Answer Readiness section already maps to the
clean forms (`https://tinystudio.io/pricing`, `/audit`, `/`), and the
AI-search evidence fixture records verbatim historical citations, so neither
was touched.

## Source checks

`npm run check` -> "TinyStudio.io checks passed." The canonical guard now
expects exactly one non-commented `<link rel="canonical">` in `<head>` per
page pointing at `https://tinystudio.io/agents|pricing|specimen|audit|`
(home), all distinct.

`npm test` -> all suites pass:

| Suite | Result |
|---|---|
| check (site) | pass |
| headings | 6/6 |
| sitemap | 7/7 |
| worker | 80/80 |
| ui | 16/16 |
| contract | 8/8 |
| viewport | 4/4 |
| narrow pages / narrow | pass |

## Delivery

- Branch: `fix/appraisal-page-clean-canonicals-lane1` (pushed to origin)
- Commit: `df69628`
- Files: `public/agents.html`, `public/pricing.html`,
  `public/specimen.html`, `scripts/check-site.mjs`,
  `.lane/reports/fix-appraisal-page-clean-canonicals-lane1.md`
