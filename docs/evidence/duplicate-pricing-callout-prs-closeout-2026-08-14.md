# Duplicate pricing-callout PRs #68/#114 — reconciliation closeout (2026-08-14)

Date: 2026-08-14
Scope: the review item "[unreviewed-by-opus] Reconcile the byte-identical
duplicate pricing-callout PRs #68/#114 — two MERGEABLE open PRs". This
receipt records a state verification of the repository's pull requests plus
the reconciliation actions taken; it is process evidence, not a live-site
measurement. The site-side verification of the fix itself is carried by the
surviving delivery path PR #194 and by the repo's standing `npm run check`
suite.

Prior receipts: `docs/evidence/duplicate-pricing-callout-prs-2026-08-12.md`
(PR #144, merged) closed #68 and named #114 the surviving delivery path.

## The item's premise (from the review queue)

Two open PRs carried the same fix — a real "Request the appraisal" signup
form inside the /pricing closing callout band — and both were MERGEABLE:
PR #68 (`fix/pricing-closing-callout-appraisal-action`) and PR #114
(`fix/pricing-closing-callout-appraisal-action-lane1`). Byte-identical
diffs, so a reviewer cannot tell which is canonical; merging the wrong one
re-introduces drift.

## Current GitHub state (2026-08-14, this run)

The premise has partially decayed; the fix still has not landed on main.

| PR | head branch | state (2026-08-14) | mergeability |
|---|---|---|---|
| #68 | `fix/pricing-closing-callout-appraisal-action` | CLOSED 2026-08-12T01:08:49Z, never merged | — |
| #114 | `fix/pricing-closing-callout-appraisal-action-lane1` | OPEN | CONFLICTING (DIRTY) |
| #194 | `fix/pricing-closing-callout-appraisal-action-lane1-20260814` | OPEN (created 2026-08-14T12:23:29Z) | MERGEABLE (CLEAN) |

- **#68** was closed by the 2026-08-12 reconciliation (PR #144) as the stale
  duplicate; #114 was named the surviving delivery path.
- **#114** is still open but has degraded: its branch accumulated a long
  series of automated `Merge branch 'main'` commits (33 commits, head
  29d695e), and it is now CONFLICTING — `scripts/check-site.mjs` changed on
  both sides in the region of the pricing guard, so the branch can no longer
  be merged as-is.
- **#194** re-lands the same fix on a fresh branch from current origin/main
  (created 2026-08-14): `public/pricing.html` +5 and `scripts/check-site.mjs`
  +27, plus a lane-report doc. `mergeStateStatus: CLEAN`, `npm run check`
  green on its tree.

## The fix content is identical across all three PRs

`gh pr diff 68`, `gh pr diff 114` and `gh pr diff 194` were byte-identical
for the two production files on the 2026-08-12 run (#68 vs #114) and this
run (#114 vs #194):

- `public/pricing.html` (+5): the closing `.band` gains
  `<form class="lead two" action="/api/signups" method="post">` with
  website + email inputs carrying persistent programmatic `aria-label`s and
  a "Request the appraisal" submit button.
- `scripts/check-site.mjs` (+27): static source guard pinning that shape —
  the band must keep a `form.lead` posting to `/api/signups`, both intake
  inputs must carry non-empty `aria-label`s, and the submit must read
  "Request the appraisal".

Only differences found: a comment word inside the guard's docstring ("Grok
finding" in #114 vs "review item" in #194) and #194's extra
`.lane/reports/fix-pricing-closing-callout-appraisal-action-lane1.md`.

Current main carries none of it: `public/pricing.html` on origin/main has no
`form.lead` and no in-band "Request the appraisal" button — the single nav
CTA (`/ #start`) is the only request path.

## Reconciliation actions taken (2026-08-14, this run)

The closure below is the actual GitHub state change, preceded by a comment
naming the surviving delivery path:

- Closed PR **#114** (stale conflicting duplicate): #194 re-lands the
  byte-identical fix on the fresh base and is the surviving delivery path.
- Kept open, as the single delivery path: **#194** (MERGEABLE, CLEAN, the
  only open PR carrying the pricing-callout fix).

Pre-closure verification on this run (2026-08-14):

- Per-cluster diffs confirmed the branches carry identical fix content
  (`gh pr diff 114` vs `gh pr diff 194`: only the guard comment wording and
  the lane report differ; production files identical).
- `npm run check` green on the survivor's own tree
  (`fix/pricing-closing-callout-appraisal-action-lane1-20260814`): "TinyStudio.io
  checks passed." — including the pricing closing-callout guard.
- `npm test` all non-Chromium suites green on that tree (headings, sitemap,
  worker, UI contracts, product contract, viewport); the only viewport
  "failure" is the pre-existing out-of-scope `/` @ 240px note that does not
  gate.

## What closes the item

- The /pricing closing-callout fix now has exactly one delivery path: PR
  **#194** (open, MERGEABLE, CLEAN, guard green on its own tree).
- The stale duplicates are both closed: #68 (2026-08-12) and #114 (this
  run); neither carried any change the survivor lacks.
- The fix itself remains unmerged on main and awaits the governed review
  pipeline to land #194.
