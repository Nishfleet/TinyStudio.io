# Lane 1: /agents, /pricing, /specimen page-head self-declaration

Branch: `fix/clean-pagehead-self-decl-2026-08-14`
PR: https://github.com/nish3451/TinyStudio.io/pull/210
Commit: `3ff1398`

## Change

All three pages now self-declare their clean extensionless URLs in the head
(the same form the worker serves at 200 and the sitemap lists), matching
`/audit`:

| Page | canonical / og:url / WebPage @id+url |
| --- | --- |
| /agents | `https://tinystudio.io/agents` (`agents#webpage`) |
| /pricing | `https://tinystudio.io/pricing` (`pricing#webpage`) |
| /specimen | `https://tinystudio.io/specimen` (`specimen#webpage`) |

Before: all three declared the `.html` twin, which the worker 307-redirects.

## Files touched

- `public/agents.html` — canonical, og:url, WebPage @id/url -> clean
- `public/pricing.html` — same
- `public/specimen.html` — same
- `scripts/check-site.mjs` — page-URL expectation tables (social share, structured data, canonical) now require the clean URL on all five pages; canonical comment updated

## Validation

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `npm test` (full suite: check, headings, sitemap, worker, ui, contract, viewport, narrow-pages) → exit 0

## Notes

- The `.html` twins remain allow-listed and served; this change only fixes what the pages declare about themselves. No redirect/route behavior changed.
