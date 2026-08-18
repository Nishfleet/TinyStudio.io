# Duplicate specimen-CTA PRs #107/#155 — reconciliation closeout (2026-08-14)

Date: 2026-08-14
Scope: the review item "[unreviewed-by-opus] Reconcile the duplicate
specimen-CTA PRs #107/#155 — byte-identical specimen.html band hunks".
This receipt records a state verification of the repository's pull requests
plus the reconciliation finding; it is process evidence, not a live-site
measurement. The site-side verification of the fix itself is carried by the
merged fix commit PR #155 and by the repo's standing `npm run check` and
`npm test` suites, re-run on the current head.

Prior receipts: `docs/evidence/specimen-in-content-cta-rereverify-2026-08-14.md`
(PR #195, merged 2026-08-14) already re-verified the fix content on main
and live; this receipt is the sibling review item's closeout for the PR
cluster itself.

## The item's premise (from the review queue)

Two PRs carried the same fix — an in-content conversion CTA band on the
/specimen proof page — with byte-identical `public/specimen.html` band
hunks: PR #107 (`fix/specimen-conversion-cta`) and PR #155
(`fix/specimen-conversion-cta-lane1`). A reviewer cannot tell which is
canonical from the diff alone; the reconciliation must name the surviving
delivery path and close the stale duplicate.

## Current GitHub state (2026-08-14, this run)

The premise has fully decayed: the fix has landed and no duplicate remains
open.

| PR | head branch | state (2026-08-14) | mergeability |
|---|---|---|---|
| #107 | `fix/specimen-conversion-cta` | CLOSED 2026-08-14T11:06:43Z, never merged | — |
| #155 | `fix/specimen-conversion-cta-lane1` | **MERGED** 2026-08-13T22:09:21Z (`b81281f`) | merged |

- **#155** is the surviving delivery path and already landed: its fix
  commit `b81281f` ("fix(public): add in-content conversion CTA to the
  /specimen proof page (#155)") is on `origin/main`
  (`git merge-base --is-ancestor b81281f origin/main` → true; head
  `d981610`, 2026-08-14).
- **#107** was closed 2026-08-14 without merging. Its branch went
  conflict-locked against main; PR #155's supersession note records that
  #107 had carried the same change set since 2026-08-11 without landing
  and was stale.
- **No open PR carries the specimen-CTA fix.** The open-PR set
  (`gh pr list --state open`, 2026-08-14) contains no specimen-CTA
  delivery path.

## The duplicate claim is confirmed: byte-identical specimen.html hunks

The item says the two PRs carry byte-identical `public/specimen.html` band
hunks. Verified by diffing each branch against its own merge-base with
main, restricted to `public/specimen.html`:

- PR #107 (`fix/specimen-conversion-cta`): hunk `@@ -130,6 +130,13 @@`,
  +7 lines.
- PR #155 (`fix/specimen-conversion-cta-lane1`): hunk `@@ -131,6 +131,13 @@`,
  +7 lines.

The two hunks are byte-identical in content: the `.band` block with the
`<h2>That was a real one. Yours is read the same way.</h2>` headline, the
four-passes copy line, `<a class="cta" href="/#start">Request the
appraisal</a>`, and the no-guarantees `.note`. The only differences in the
raw diffs are the git index lines and the one-line hunk context offset
(#107 was cut from an earlier main; #155 from a later one) — the added
lines match exactly. The companion files (`public/specimen.css` +7,
`public/specimen.js` 1/1, `scripts/check-site.mjs` +29, and the locked
heading-hierarchy outline) are also identical in shape across both PRs per
their file lists.

## The fix is on current main and live

1. **Fix commit on current main** — `git merge-base --is-ancestor b81281f
   origin/main` → true; origin/main head `d981610` (2026-08-14).
2. **Source: the band CTA exists** — `public/specimen.html` lines 134-139
   carry the `.band` block between the report and the footer with
   `<a class="cta" href="/#start">Request the appraisal</a>` and the
   no-guarantees note; the homepage routes its "Read the specimen"
   call-out to `/specimen` (`public/index.html`).
3. **Source: CI guard exists** — `scripts/check-site.mjs` ("Specimen
   in-content conversion CTA" block) fails the build if the band, its CTA
   to `/#start`, the no-guarantees note, `.band .cta` styling, or the
   >=44px tap target (`padding:16px 24px`) regress.
4. **Live site** — fetched `https://tinystudio.io/specimen` (2026-08-14):
   the page serves `class="band"`, the "Request the appraisal" CTA, and
   the `/#start` target (two occurrences each: nav CTA + band CTA, as
   expected).
5. **Test suite** — `npm run check` passes (exit 0) and `npm test` passes
   on origin/main head `d981610`, including the specimen CTA guard.

## Reconciliation finding

**The review item is already resolved; no action was needed on GitHub
state.** #155 merged the fix into main on 2026-08-13 and deployed; #107
was closed on 2026-08-14 as the stale duplicate. The surviving delivery
path is the merged PR #155 (commit `b81281f`). There is no open duplicate
to close and no surviving open delivery path to name — the cluster is
fully resolved, and the review-queue item can be closed as already
resolved.

## Evidence

- This file: `docs/evidence/specimen-cta-prs-107-155-closeout-2026-08-14.md`
- Lane report: `.lane/reports/reconcile-specimen-cta-prs-107-155-2026-08-14.md`
- Related prior receipt (fix-content re-verify): `docs/evidence/specimen-in-content-cta-rereverify-2026-08-14.md`
