# Appraisal-page canonicals and JSON-LD @ids at the clean /audit URL — re-verification (2026-08-14, lane 1)

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item f7a18209b7, `[unreviewed-by-opus]`).

## What the item asks

The appraisal page (`public/audit.html`, served at `/audit`) must name, in its
`<link rel="canonical">`, `og:url`, and JSON-LD `WebPage` `@id`/`url`, the
address that serves 200 — the clean extensionless `/audit` — never the
`.html` twin that the deployed worker 307-redirects to it.

## Fix already landed on main

The fix is commit `1cc7a4e` ("fix(public): point appraisal-page canonicals and
JSON-LD @ids at the clean /audit URL (#56)"), merged into main via PR #56. It
changed exactly the four lines in `public/audit.html` (canonical, `og:url`,
JSON-LD `@id`, JSON-LD `url`) from the `.html` form to the clean `/audit`
form, and moved the `scripts/check-site.mjs` canonical guard expectation for
the audit page to `https://tinystudio.io/audit`.

Verification that the commit is on current origin/main (head `60d045c`):

- `git merge-base --is-ancestor 1cc7a4e origin/main` → true.
- `git log origin/main --oneline | grep 1cc7a4e` → present.
- Since the last re-verify of the audit page state (dc1542a), neither
  `public/audit.html` nor any canonical/audit line of `scripts/check-site.mjs`
  changed: `git diff dc1542a..origin/main -- public/audit.html` is empty, and
  the only guard diff adds the unrelated signup-signal and specimen-CTA
  guards. The new origin/main commit `60d045c` (#172, env-driven Google Ads
  tag) touches neither the audit page nor the canonical guard.

## Source checks on this head

`npm run check` → "TinyStudio.io checks passed." The canonical guard
(`scripts/check-site.mjs`, "Canonical URLs (dogfood)") requires exactly one
non-commented `<link rel="canonical">` inside `<head>` per page, pointing at
the page's canonical `https://tinystudio.io` address, with no URL duplicated
across pages; for the audit page the expected href is
`https://tinystudio.io/audit`.

`npm test` → all suites pass (check, headings 6/6, sitemap 7/7, worker 73/73,
ui 16/16, contract 8/8, buyer-audience 4/4; 0 failures).

## Live verification (2026-08-14)

Fresh curl against the deployed site:

| Address | HTTP | Location |
|---|---|---|
| `https://tinystudio.io/audit` | 200 | — |
| `https://tinystudio.io/audit.html` | 307 | `https://tinystudio.io/audit` |

The served `/audit` head carries:

- `<link rel="canonical" href="https://tinystudio.io/audit">`
- `<meta property="og:url" content="https://tinystudio.io/audit">`
- JSON-LD `WebPage` node with `"@id": "https://tinystudio.io/audit#webpage"`
  and `"url": "https://tinystudio.io/audit"`

So the canonical, og:url, and JSON-LD WebPage identity all name the address
that serves 200, and none of them names the 307-redirecting `.html` twin.

## Conclusion

The item's fix is landed on current origin/main, enforced by the CI guard,
and verified against the deployed site. Nothing further to change: the
`[unreviewed-by-opus]` tag is resolved by this re-verification record.

## Delivery

- Branch: `fix/audit-canonical-clean-url-reverify-lane1`
- Files: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-14.md`,
  `.lane/reports/fix-audit-canonical-clean-url-reverify-lane1.md`
