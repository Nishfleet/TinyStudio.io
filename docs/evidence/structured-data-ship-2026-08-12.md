# PR #32 structured data on the five appraisal pages — ship verification past b004c11

Date: 2026-08-12
Scope: the tracker item "Ship origin/main past b004c11 so merged PR #32
structured data goes live — five appraisal pages still serve zero JSON-LD"
(scout 2026-08-09, risk: amber, `[unreviewed-by-grok]`, backlog item
f81db44bb8). At scout time `release-state-tinystudio-io.json` pinned the last
ship to `b004c11` (2026-08-09T11:38:40 IST, PR #30) while origin/main carried
the merged but undeployed PR #32 (`fa8d83c`, "seo: add schema.org structured
data to the five public pages"), and live `/`, `/audit`, `/pricing`,
`/agents`, `/specimen` each served zero `application/ld+json` blocks. This
receipt records the live-deployment verification of that item's acceptance
criteria against the current origin/main head and the deployed site. It is
behavior evidence, not a source check, and it does not claim anything about
ranking, traffic, or search results.

## What was measured

The scout finding recorded a one-merge deploy lag: the release pipeline pinned
the last ship to `b004c11` (PR #30, apple touch icon) while origin/main
carried the merged but undeployed PR #32 (`fa8d83c`), which adds exactly one
`application/ld+json` block to the head of each of the five public pages — a
schema.org `@graph` with a stable TinyStudio `Organization` node, a `WebSite`
node, and the page's own `WebPage` node, all bound to the page's own head
metadata. At scout time the live pages still served zero structured data.

The item's acceptance criteria (from the backlog entry):

- fleet-release (or equivalent `wrangler deploy`) ships `origin/main` ≥ `fa8d83c`;
- live loads of all five appraisal pages include at least one
  `script[type="application/ld+json"]` matching source;
- `release-state-tinystudio-io.json` sha advances past `b004c11`;
- `npm run check` on the shipped revision.

## Environment

- Live targets: `https://tinystudio.io/`, `/audit`, `/pricing`, `/agents`,
  `/specimen`, served by the deployed Cloudflare Worker's ASSETS binding
  (`src/worker.js` serves the static `public/*.html` files verbatim).
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `18128e8` (PR #113, "serve rel=icon on
  /brief-requested and guard favicon links in check-site.mjs"), fetched fresh
  via `git fetch origin`; live bytes were fetched over HTTPS and compared
  JSON-for-JSON against the `application/ld+json` blocks in `public/*.html`
  on that head.

## Results (2026-08-12)

1. Main is 56 commits past b004c11, and PR #32 is in that history:
   `git log --oneline origin/main --not b004c11` shows 56 commits, and
   `git log --format="%h %s" origin/main --grep="#32"` shows `fa8d83c`
   "seo: add schema.org structured data to the five public pages (dogfood
   975fdb784275) (#32)" — an ancestor of the origin/main head `18128e8`.

2. Release state is past b004c11: `release-state-tinystudio-io.json` pins
   `sha 18128e87c4c52ea79703a46fd1f84a508937c71b` (2026-08-12T00:38:42) —
   byte-identical to the current origin/main head, well past `fa8d83c`.

3. Live loads of all five appraisal pages include at least one
   `script[type="application/ld+json"]` (fresh curl, 2026-08-12):

   | Page | HTTP | `application/ld+json` blocks | served block vs source |
   |---|---|---|---|
   | `/` | 200 | 1 | identical |
   | `/audit` | 200 | 1 | identical |
   | `/pricing` | 200 | 1 | identical |
   | `/agents` | 200 | 1 | identical |
   | `/specimen` | 200 | 1 | identical |

   Each served block was extracted and parsed as JSON, then compared to the
   block in the matching `public/*.html` file on the origin/main head: all
   five pairs are identical. The served `WebPage` `@id`s are
   `https://tinystudio.io/#webpage` (home), `/audit#webpage`,
   `/pricing.html#webpage`, `/agents.html#webpage`, `/specimen.html#webpage` —
   the same nodes the "Structured data (dogfood 975fdb784275)" CI guard in
   `scripts/check-site.mjs` enforces on source.

4. Source and CI on the shipped revision: `npm run check` passes
   ("TinyStudio.io checks passed.") on a clean checkout of origin/main
   `18128e8`, the full `npm test` suite passes (headings 6/6, sitemap 7/7,
   worker 55, ui 16, contract 8), and GitHub Actions CI reports `success`
   on the origin/main head `18128e8`.

## Closeout

The item's acceptance is met against the current origin/main head and the
deployed site: origin/main is 56 commits past b004c11 with PR #32 (`fa8d83c`)
in that history, release state pins the current main head, all five appraisal
pages serve exactly one `application/ld+json` block identical to source, and
`npm run check` / `npm test` pass on the shipped revision. This is the same
conclusion the earlier "Ship verification" section in
`docs/evidence/structured-data-2026-08-09.md` (added 2026-08-11, PR #93)
reached; this receipt re-confirms it fresh against the current head and live
site (2026-08-12). Nothing further on this item remains to ship.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser/curl check
above runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #32), which fails `npm
test` on any page whose structured data block is missing, duplicated, outside
the head, invalid JSON, non-schema.org, missing a graph node, or mismatched
against the page's own metadata, plus the fleet-release pipeline that keeps
the deployed Worker current with origin/main.
