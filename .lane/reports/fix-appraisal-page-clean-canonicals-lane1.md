# Lane 1 report — appraisal-page canonicals and JSON-LD @ids at clean non-307 URLs

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item f7a18209b7, `[unreviewed-by-opus]`).

Branch: `fix/appraisal-page-clean-canonicals-lane1`
Commit: `df69628`

## What was wrong

PR #56 (commit 1cc7a4e) migrated only the audit page's canonical, `og:url`,
and JSON-LD `WebPage` `@id`/`url` from the `.html` form to the clean `/audit`
form. The three remaining appraisal pages still named the 307-redirecting
`.html` twins in all three places:

- `public/agents.html` -> `https://tinystudio.io/agents.html`
- `public/pricing.html` -> `https://tinystudio.io/pricing.html`
- `public/specimen.html` -> `https://tinystudio.io/specimen.html`

Live verification (2026-08-15, `curl -sI`):

| Address | HTTP | Location |
|---|---|---|
| `https://tinystudio.io/agents.html` | 307 | `/agents` |
| `https://tinystudio.io/agents` | 200 | — |
| `https://tinystudio.io/pricing.html` | 307 | `/pricing` |
| `https://tinystudio.io/pricing` | 200 | — |
| `https://tinystudio.io/specimen.html` | 307 | `/specimen` |
| `https://tinystudio.io/specimen` | 200 | — |

The sitemap already lists the clean forms (`/audit`, `/agents`, `/pricing`,
`/specimen`), and the internal-links guard already forbids `.html` hrefs — the
canonicals and JSON-LD were the remaining place naming the redirecting twins.

## Change

- `public/agents.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/agents` (+`#webpage`)
- `public/pricing.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/pricing` (+`#webpage`)
- `public/specimen.html`: canonical, `og:url`, JSON-LD `@id`/`url` ->
  `https://tinystudio.io/specimen` (+`#webpage`)
- `scripts/check-site.mjs`: the canonical, social-share and structured-data
  guard expectations for the three pages moved to the clean forms (the same
  shape PR #56 used for the audit page), and the canonical-guard comment no
  longer defers the migration.

## Evidence

- `npm run check` -> "TinyStudio.io checks passed." (canonical guard now
  expects `/agents`, `/pricing`, `/specimen`)
- `npm test` -> all suites pass: check, headings 6/6, sitemap 7/7, worker
  80/80, ui 16/16, contract 8/8, viewport 4/4, narrow pages + narrow
  viewports.
- Live 307/200 measurement above.
- Evidence doc: `docs/evidence/appraisal-canonicals-clean-urls-lane1-2026-08-15.md`
