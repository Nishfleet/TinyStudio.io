# Lane 1 report — fix/llms-offer-clean-buyer-urls-lane1

Item: Point live llms.txt and offer.md buyer URLs at clean non-307 paths — the closed twin's fix PR.

## What

The deployed worker 307-redirects every `.html` form to its clean extensionless twin, so the buyer URLs in the machine-readable pair (`public/llms.txt`, `public/offer.md`) named addresses that redirect before they serve. This re-lands the closed twin PR #57 (`fix/llms-offer-clean-buyer-urls`, fix commit `d187f48`) onto current `origin/main`, per the repo's duplicate-fix reconciliation pattern (PR #145 re-landed #97 the same way; see `docs/evidence/duplicate-open-pr-clusters-residual-2026-08-11.md`).

Pointed at the clean paths that serve 200 (live-verified):

- `https://tinystudio.io/audit.html` → `https://tinystudio.io/audit`
- `https://tinystudio.io/pricing.html` → `https://tinystudio.io/pricing`

Changed in both files: the AI-search evidence artifact pointer, all preferred-source mappings (q2/q3/q4/q6/q7), and the price-and-terms pointers.

## Guard updates

- `scripts/check-site.mjs`: the offer-fact needle (`requiredPublicArtifacts`), the price-question preferred-source guard, the audit evidence-artifact pointer guard, and the surrounding comments/messages now require the clean forms.
- `scripts/test-agent-ui.mjs`: the offer-fact needle, the served-pages membership list, the price-question mapping assertion, and the audit/pricing pointer assertions now require the clean forms.

## Files

- `public/llms.txt` — audit/pricing buyer URLs → clean `/audit`, `/pricing`
- `public/offer.md` — audit/pricing buyer URLs → clean `/audit`, `/pricing`
- `scripts/check-site.mjs` — guard expectations moved to the clean forms
- `scripts/test-agent-ui.mjs` — test expectations moved to the clean forms

## Validation

- Live 2026-08-14: `/audit.html` and `/pricing.html` each return 307 to their clean twin; `/audit` and `/pricing` return 200.
- `npm run check` passes ("TinyStudio.io checks passed.").
- `npm test` green: 117 tests, 0 failures (headings 7, sitemap 6, worker 76, UI 16, contract 8, viewport 4). The only out-of-scope note is the pre-existing mobile viewport scrollWidth on `/` (reported, does not gate exit, identical on origin/main).
- Item verify: `grep -n "pricing\.html\|audit\.html" public/llms.txt public/offer.md` → no buyer-URL hits remain (only the prose "pricing.html" filename reference, which is not a URL).

## Re-land provenance

Cherry-picked the twin's fix commit `d187f48` onto fresh `origin/main` (`e36d6ca`), resolved three additive conflicts (q8-conversion-audit row and conversion-audit paragraph landed on main since #57; the guard comment drift), producing commit `a88a4c8`. Net diff shape matches the twin: 4 files, 43 insertions, 41 deletions.
