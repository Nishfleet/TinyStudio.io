# Lane report: retire duplicate-PR cluster item f3c90474c1 (2026-08-22, lane 1)

- Lane: tinystudio-io lane 1
- Branch: `chore/duplicate-pr-clusters-residual-retire-2026-08-22`
- Item id: `f3c90474c1`
- Title: Reconcile the two residual duplicate fix-PR clusters after #105 — brief-requested clean links

## Outcome

**Already resolved / no code change.** Both residual post-PR-#105 clusters are at their terminal state on GitHub, on `origin/main`, and on the live site. No duplicate or drift was found. Item `f3c90474c1` is retired with receipt PR #274 (`dbdb3e8c8f57ce1ab84537f73dc0635600f514a5`). No product source files were changed and no PR was opened.

- **Cluster 1 — brief-requested clean links:** #60 CLOSED, #97 CLOSED, survivor #145 MERGED (`f9214c1ef26fa44b5dd72662fe5ef87dcabdd246`).
- **Cluster 2 — rel=icon favicon:** #47 CLOSED, #85 MERGED (`9302611b6714f517eda542fe2c4af3b024d60ee4`), #113 MERGED (`18128e87c4c52ea79703a46fd1f84a508937c71b`).
- **2026-08-21 reverify:** #274 MERGED (`dbdb3e8c8f57ce1ab84537f73dc0635600f514a5`).

## Verification performed

### GitHub state of PRs #60, #97, #145, #47, #85, #113, #274

| PR | state | headRefName | mergeCommit.oid |
| --- | --- | --- | --- |
| 60 | CLOSED | `fix/brief-requested-clean-nav-links` | — |
| 97 | CLOSED | `fix/brief-requested-clean-links` | — |
| 145 | MERGED | `fix/brief-requested-clean-links-lane1` | `f9214c1ef26fa44b5dd72662fe5ef87dcabdd246` |
| 47 | CLOSED | `fix/serve-rel-icon-favicon` | — |
| 85 | MERGED | `fix/rel-icon-favicon-lane1` | `9302611b6714f517eda542fe2c4af3b024d60ee4` |
| 113 | MERGED | `fix/serve-rel-icon-brief-requested` | `18128e87c4c52ea79703a46fd1f84a508937c71b` |
| 274 | MERGED | `chore/duplicate-pr-clusters-residual-closeout-rereverify-2026-08-21` | `dbdb3e8c8f57ce1ab84537f73dc0635600f514a5` |

### Open-PR changed-files scan

`gh pr list --state open --limit 100` then `gh pr view --json files` for each. `grep` for cluster paths (`public/{index,pricing,audit,agents,specimen,msp,brief-requested,agent-desk}.html`, `scripts/check-site.mjs`, `src/worker.js`) printed nothing. Pass.

### `origin/main` source checks

- `git merge-base --is-ancestor dbdb3e8c8f57ce1ab84537f73dc0635600f514a5 origin/main` — exit 0.
- Base of this branch: `5dbe7487ff1034e98490c53b5b3487aece80796e` (`origin/main`).
- `grep -c 'rel="icon"'` on `public/{index,pricing,audit,agents,specimen,msp,brief-requested,agent-desk}.html` — each line is `1`.
- `public/brief-requested.html` unique `<a … href="…">` anchors, no `.html`:

```text
<a class="back" href="/"
<a class="logo" href="/"
<a href="/agents"
<a href="/audit"
<a href="/pricing"
```

### `npm run check` and `npm test`

- `npm run check` — exit 0, output `TinyStudio.io checks passed.`
- `npm test` — exit 0, 51421 ms, all suites green: headings 6/6, sitemap 7/7, worker 83/83, UI 16/16, contract 8/8, study 2/2, viewport 4/4, narrow-pages PASS, narrow PASS.

### Live probes against `https://tinystudio.io`

- `GET /brief-requested` — `HTTP/2 200`.
- Live brief-requested anchors match the five clean source anchors above; no `.html`.
- `/favicon.svg` `content-type: image/svg+xml`.
- `/favicon.ico` `content-type: image/x-icon`.
- For `/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/brief-requested`, `/agent-desk`: `rel="icon"` count is `1`; no `href` ending in `.html`.
- `.html` twins `/index.html`, `/audit.html`, `/agents.html`, `/pricing.html`, `/specimen.html` each return `HTTP/2 307` to `/`, `/audit`, `/agents`, `/pricing`, `/specimen`.

### Negative probe of the internal-link guard

Copied `public/brief-requested.html`, replaced `href="/audit"` with `href="audit.html"`, ran `npm run check`. Output matched:

`Internal page link on brief-requested page must point at the clean destination "/audit" (found "audit.html").`

File restored; working tree clean of that mutation.

## Files changed

Report only (item already resolved):

- `.lane/reports/chore-duplicate-pr-clusters-residual-retire-2026-08-22.md` — this lane report.

No source files changed.

## Delivery

- Branch: `chore/duplicate-pr-clusters-residual-retire-2026-08-22`
- Base commit: `5dbe7487ff1034e98490c53b5b3487aece80796e` (`origin/main`)
- Report commit: `9544425`
- PR opened: no (already resolved on main; evidence-only PR is churn)
- `fleet-resolve-item resolve` ran; `fleet-resolve-item status` printed `f3c90474c1  resolved  pr=274`

PACKET COMPLETE
