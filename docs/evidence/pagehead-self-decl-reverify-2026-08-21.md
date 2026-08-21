# Page-head self-declaration on /agents, /pricing, /specimen — re-verify (2026-08-21)

Item: "[unreviewed-by-opus] /agents, /pricing, /specimen page-head canonical +
og:url + JSON-LD WebPage @id all self-decl" (finding item `c6f9cf8040`,
lane-1 packet 2026-08-21).

## What the item asks

Each of the three appraisal pages must declare its own clean URL in all three
machine-readable head surfaces:

- `<link rel="canonical">` -> the page's clean extensionless URL
- `<meta property="og:url">` -> the same clean URL
- JSON-LD `WebPage` `@id`/`url` -> the same clean URL (`@id` with `#webpage`)

The clean forms are the addresses that serve 200; the `.html` twins 307 to
them, so declaring a `.html` form would hand search engines and social
scrapers a redirecting address.

## Source state (origin/main @ 92d55c3, 2026-08-21)

All three pages self-declare correctly in source. This was fixed by PR #218
(commit `ed2b1a9`, "point appraisal-page canonicals and JSON-LD WebPage @ids
at the clean non-307 URLs", merged 2026-08-19), preceded by the lane-1 fix
commit `df69628` (2026-08-15) and its re-landing `3ff1398`.

| Page | canonical | og:url | WebPage `@id` | WebPage `url` |
|---|---|---|---|---|
| /agents | `https://tinystudio.io/agents` | same | `https://tinystudio.io/agents#webpage` | `https://tinystudio.io/agents` |
| /pricing | `https://tinystudio.io/pricing` | same | `https://tinystudio.io/pricing#webpage` | `https://tinystudio.io/pricing` |
| /specimen | `https://tinystudio.io/specimen` | same | `https://tinystudio.io/specimen#webpage` | `https://tinystudio.io/specimen` |

`npm run check` passes ("TinyStudio.io checks passed") on this worktree at
origin/main `92d55c3`. The canonical guard (`scripts/check-site.mjs`) asserts
exactly one canonical per page naming the clean URL, and the structured-data
guard asserts the `WebPage` `@id`/`url` bindings.

## Live state (2026-08-21)

The deployed site still serves the pre-fix `.html` self-declarations on
exactly these three pages:

| Live URL | canonical | og:url | WebPage `@id` | WebPage `url` |
|---|---|---|---|---|
| `https://tinystudio.io/agents` | `https://tinystudio.io/agents.html` | same | `.../agents.html#webpage` | `https://tinystudio.io/agents.html` |
| `https://tinystudio.io/pricing` | `https://tinystudio.io/pricing.html` | same | `.../pricing.html#webpage` | `https://tinystudio.io/pricing.html` |
| `https://tinystudio.io/specimen` | `https://tinystudio.io/specimen.html` | same | `.../specimen.html#webpage` | `https://tinystudio.io/specimen.html` |

Probed 2026-08-21 ~04:26 UTC with `curl -s -H 'Cache-Control: no-cache'`
against `https://tinystudio.io/{agents,pricing,specimen}`. The `.html` twins
307 to the clean forms (verified `curl -sI`), so the live pages' own
declarations point at addresses that redirect.

The same probes show the deployment is stale beyond this item:

- `/pricing` closing `.band` has no signup form (the `form.lead` fixed by PR
  #194 / #219 is absent; only the heading, sub, note and CTA-less note
  remain), and the footer still reads `The Tiny Studio` (fixed by #112).
- `/agents`, `/pricing`, `/specimen` all serve the old `.html` head
  declarations (this item).
- `/audit` and `/` serve the correct clean canonicals, and the
  `/brief-requested` page carries the apple-touch-icon — so the deployment
  is not uniformly ancient; it appears to be a partial deploy (or one from a
  branch that carried the newer /audit work but not the 2026-08-19 merge of
  #218/#112).

## Verdict

The source fix for this item is complete and merged on origin/main; CI
guards (`npm run check`) enforce it. The item's fault is no longer present
in the repository. What remains is deployment staleness: the live site has
not been redeployed from current main, so it still serves the pre-fix head
declarations on /agents, /pricing and /specimen.

No further source change is proposed by this lane. The lane report
(`.lane/reports/fix-pagehead-self-decl-reverify-lane1-20260821.md`) records
the same findings; a deploy of origin/main (`npm run deploy`, manual per the
domain's deployment convention) is the remaining action to make the live
site match the source.
