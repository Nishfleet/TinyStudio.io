# /pricing closing-callout "Request the appraisal" action — re-verification (2026-08-21)

Date: 2026-08-21
Scope: the review-queue item "[unreviewed-by-opus] Put a real 'Request the
appraisal' action inside the pricing page's closing callout — its str..."
(item `fdfb56b09a`, review 2026-08-05, risk: amber). The fix landed in PR
#194 (`76fe17b`, "fix(public): put a real Request-the-appraisal signup form
in the /pricing closing callout") and was merged into `origin/main` on
2026-08-19. This lane re-verifies the item's acceptance criteria against the
current `origin/main` head and the live deployment. It is source plus
behavior evidence; it does not claim anything about ranking, traffic, or
search results.

## What was measured

The item's acceptance criteria (from the backlog entry): the /pricing
closing callout band ("The appraisal costs you an email. The rest is a
decision you can make later.") must carry a real "Request the appraisal"
action — an intake form posting website + email to `/api/signups`, so the
closing offer is actionable in place instead of a dead end — and the fix
must hold under the test suite on the current head.

## Source checks on the current head (origin/main `92d55c3`)

1. `public/pricing.html` closing `.band` (lines 129–138) embeds
   `<form class="lead two" action="/api/signups" method="post">` with:
   - a `website` input carrying a persistent `aria-label="Your website domain"`,
   - an `email` input carrying a persistent `aria-label="Your work email"`,
   - a submit `<button>Request the appraisal</button>`.
   The fix commit `76fe17b` (PR #194) is an ancestor of `origin/main`
   `92d55c3` (`git merge-base --is-ancestor 76fe17b 92d55c3` → 0).
2. `scripts/check-site.mjs` (lines 371–388) carries the static source guard
   pinning that shape: the band must keep a `form.lead` posting to
   `/api/signups`, both intake inputs must carry persistent non-empty
   `aria-label`s, and the submit must read "Request the appraisal".
3. `node scripts/check-site.mjs` passes on this head: "TinyStudio.io checks
   passed." (includes the pricing closing-callout guard).
4. The 2026-08-14 lane report `.lane/reports/fix-pricing-closing-callout-appraisal-action-lane1.md`
   and the 2026-08-14 reconciliation receipt
   `docs/evidence/duplicate-pricing-callout-prs-closeout-2026-08-14.md`
   document the fix's history: PRs #68 and #114 (byte-identical duplicates)
   were closed, PR #194 was the surviving delivery path, and it merged on
   2026-08-19.

## Commits to the guarded files since the fix merged

`git log --oneline 76fe17b..origin/main -- public/pricing.html
scripts/check-site.mjs` returns:

- `75cfef2` fix(public): keep /pricing lead-form bare inputs at a 44px tap
  target (#251)
- `66f7bd6` fix(a11y): give appraisal intake fields persistent, programmatic
  labels (#154)
- `ed2b1a9` fix(public): point appraisal-page canonicals and JSON-LD WebPage
  @ids at the clean non-307 URLs (#218)
- `23a7f06` fix(public): brand the pricing and brief-requested footers
  TinyStudio, and guard them (#112)
- `43cc831` fix(public): refresh the study figures to the 2026-08-12 scan
  and guard the daily-refresh promise (#156)

None of them removed the form, the submit label, or the guard. #251
strengthened the bare inputs' tap targets; #154 strengthened the persistent
labels the guard requires. The closing-callout action survives intact.

## Live deployment state (2026-08-21)

The deploy pin `release-state-tinystudio-io.json` (captured 2026-08-17)
records the live Worker release at `b4d80f1` (version 123), which predates
PR #194's merge (`76fe17b`, 2026-08-19). The live `https://tinystudio.io/pricing`
still serves the pre-#194 page: HTTP 200, closing `.band` with the
no-guarantees note but no intake form — the same deploy-lag pattern
documented for this site (e.g. `docs/evidence/ai-search-evidence-lag-2026-08-12.md`).
The fix is on `origin/main` and waits on the governed release pipeline to
ship the head that contains it. No source regression exists.

## Exact verification method (reproduce)

1. `git rev-parse origin/main` → `92d55c3…`.
2. `git merge-base --is-ancestor 76fe17b origin/main` → 0 (fix is in).
3. `grep -n 'action="/api/signups"' public/pricing.html` → the closing band
   form line; `grep -n 'Request the appraisal' public/pricing.html` → the
   nav CTA and the band's submit button.
4. `node scripts/check-site.mjs` → exit 0.
5. `curl -s https://tinystudio.io/pricing` → HTTP 200; current live body has
   no `form.lead` yet because the deployed release predates the fix.

## Limitation

This is a source plus live-deployment measurement. The static guard in
`scripts/check-site.mjs` is what prevents the dead-end callout from silently
returning; the live page will carry the form once the release pipeline ships
a head containing `76fe17b` (or later). The live 200-without-form observed
today is the documented deploy lag, not a regression in the repository.

## Closeout

The review item "Put a real 'Request the appraisal' action inside the
pricing page's closing callout" remains closed: the fix merged in PR #194
(`76fe17b`) is in `origin/main` `92d55c3`; `node scripts/check-site.mjs`
passes on the current head including the pricing closing-callout guard; and
the only commits to the guarded files since the fix merged (#251, #154,
#218, #112, #156) are unrelated or strengthening — none removed the form,
the submit label, or the guard. The live page's missing form is the known
deploy lag to a pre-2026-08-19 release, tracked by the release-state pin.
