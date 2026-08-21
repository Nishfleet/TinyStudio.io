# Lane 1 report: /agents /pricing /specimen page-head self-declaration re-verify (2026-08-21)

Item: "[unreviewed-by-opus] /agents, /pricing, /specimen page-head canonical
+ og:url + JSON-LD WebPage @id all self-decl" (item id `c6f9cf8040`).

## Result

Source: **already fixed and guarded on origin/main** (PR #218 / `ed2b1a9`,
merged 2026-08-19; preceded by `df69628` and `3ff1398`). All three pages
self-declare their clean URLs in canonical, `og:url`, and JSON-LD `WebPage`
`@id`/`url`. `npm run check` passes.

Live: **still stale** — the deployed site serves the pre-fix `.html` head
declarations on exactly these three pages, verified 2026-08-21 with
cache-busted `curl` probes:

```
/agents   -> canonical https://tinystudio.io/agents.html  (og:url, @id same)
/pricing  -> canonical https://tinystudio.io/pricing.html (og:url, @id same)
/specimen -> canonical https://tinystudio.io/specimen.html(og:url, @id same)
```

The live deployment is also stale on other 2026-08-19+ fixes (/pricing
band lost its signup form and footer still says "The Tiny Studio"), while
/audit and / serve correct clean canonicals — consistent with a deploy from
before the 2026-08-19 merge batch, or a partial deploy.

## What this lane changed

No source changes were needed or made. Evidence only:

- `docs/evidence/pagehead-self-decl-reverify-2026-08-21.md` — full
  re-verify receipt (source table, live table, probe method, staleness
  markers).
- `.lane/reports/fix-pagehead-self-decl-reverify-lane1-20260821.md` — this
  report.

## Remaining action (outside this repo lane)

Redeploy origin/main (`npm run deploy` — manual wrangler deploy per this
domain's convention). Until then the live site's three pages keep declaring
the redirecting `.html` forms, and the live /pricing page keeps its missing
form / stale footer.

## Verification method

- `git log` on origin/main: `ed2b1a9` is an ancestor of `origin/main`
  (`git merge-base --is-ancestor ed2b1a9 origin/main` -> yes).
- `npm run check` on this worktree (origin/main `92d55c3`): "TinyStudio.io
  checks passed."
- Live probes: `curl -s -H 'Cache-Control: no-cache'` for canonical /
  og:url / JSON-LD on all three pages; `curl -sI` for the `.html` 307s.
