# Appraisal-page canonicals and JSON-LD @ids at the clean /audit URL — re-verification (2026-08-17, lane 1)

Item: "Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean
URLs that do not 307" (finding item f7a18209b7, `[unreviewed-by-opus]`).

Base: `origin/main` head `f309dd45` (2026-08-17).
Prior receipt: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-14.md`
on commit `60d045c`. The prior close-out's fix is commit `1cc7a4e` (PR #56 —
"fix(public): point appraisal-page canonicals and JSON-LD @ids at the clean
/audit URL"), which pointed the four lines in `public/audit.html` at the
extensionless `/audit` and updated the `scripts/check-site.mjs` canonical
guard's expectation for the audit page.

## What the item asks

The appraisal page (`public/audit.html`, served at `/audit`) must name, in its
`<link rel="canonical">`, `og:url`, and JSON-LD `WebPage` `@id`/`url`, the
address that serves 200 — the clean extensionless `/audit` — never the
`.html` twin that the deployed Worker 307-redirects to it.

## Re-confirmed on this head

`git merge-base --is-ancestor 1cc7a4e origin/main` → true. The fix commit is
on the current head.

### Source unchanged since the last receipt

`git diff 60d045c..origin/main -- public/audit.html` is empty. No commit
between the prior receipt and today's head (`f309dd45`) touched the canonical,
`og:url`, JSON-LD `@id`, or JSON-LD `url` lines of `public/audit.html`.
`git log --oneline origin/main -- public/audit.html | head` confirms the
most recent audit-page commit is `0e7373fe` ("fix(appraisal): add
autocomplete=\"email\" to appraisal lead forms on / and /audit (#213)",
2026-08-14), which only added `autocomplete="email"` to the lead form input
and left the head meta block byte-identical.

`git diff 60d045c..origin/main -- scripts/check-site.mjs` shows only
unrelated additions to the dogfood guard (sign-up-signal, specimen-CTA,
retired-desk canonical expectation per PR #229). The audit-page expectation
in the canonical guard (`https://tinystudio.io/audit`) is unchanged from
the prior receipt.

### Source on the current head

`public/audit.html` head (head = `f309dd45`):

- Line 8: `<link rel="canonical" href="https://tinystudio.io/audit">`
- Line 14: `<meta property="og:url" content="https://tinystudio.io/audit">`
- Line 23-`</script>`: JSON-LD `@graph` containing
  - Organization `@id` `https://tinystudio.io/#organization`
  - WebSite `@id` `https://tinystudio.io/#website`
  - WebPage `@id` `https://tinystudio.io/audit#webpage` with
    `url` `https://tinystudio.io/audit`

All four fields name `https://tinystudio.io/audit` — the clean extensionless
URL that serves 200 — never the 307-redirecting `.html` twin.

### CI on the current head

`node scripts/check-site.mjs` → `TinyStudio.io checks passed.` The canonical
guard ("Canonical URLs (dogfood)") still requires exactly one non-commented
`<link rel="canonical">` inside `<head>` per page, pointing at the page's
canonical `https://tinystudio.io` address, with no URL duplicated across
pages; for the audit page the expected href is `https://tinystudio.io/audit`.

## Live verification (2026-08-17)

Fresh probes against the deployed Worker:

| Address | HTTP | Location |
|---|---|---|
| `https://tinystudio.io/audit` | `200` | — |
| `https://tinystudio.io/audit.html` | `307` | `https://tinystudio.io/audit` |

The served `/audit` head (curl -L → no redirect taken, just parsed) carries:

- `<link rel="canonical" href="https://tinystudio.io/audit">`
- `<meta property="og:url" content="https://tinystudio.io/audit">`
- JSON-LD WebPage node with `"@id": "https://tinystudio.io/audit#webpage"`
  and `"url": "https://tinystudio.io/audit"`

So the four fields on the served page match the committed source byte-for-byte,
name the address that serves 200, and none of them names the 307-redirecting
`.html` twin.

## Conclusion

The item's fix is landed on current `origin/main`, enforced by the canonical
guard in `scripts/check-site.mjs`, byte-identical between source and live on
the current head, and intact against every change landed between the prior
receipt (`60d045c`) and today's head (`f309dd45`). Nothing further to change:
the `[unreviewed-by-opus]` tag is resolved by this re-verification record.

## Delivery

- Branch: `fix/audit-canonical-clean-url-reverify-2026-08-17`
- Files: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-17.md`,
  `.lane/reports/fix-audit-canonical-clean-url-reverify-2026-08-17.md`
