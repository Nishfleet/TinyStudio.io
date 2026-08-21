# Lane report: fix/pricing-closing-callout-appraisal-action-rereverify-2026-08-21

Date: 2026-08-21
Lane: tinystudio-io lane 1
Item: "[unreviewed-by-opus] Put a real 'Request the appraisal' action inside the pricing page's closing callout — its str..."

## Outcome

**Already fixed on current origin/main** (`92d55c3`) by merged PR #194
(commit `76fe17b`, merged 2026-08-19), then hardened by PR #251 (44px tap
targets on the bare inputs) and PR #154 (persistent programmatic labels).
Re-verification-only closeout — no production code change was needed.

## What I verified

- `public/pricing.html` closing `.band` carries `<form class="lead two"
  action="/api/signups" method="post">` with website + email inputs carrying
  persistent `aria-label`s and a `<button>Request the appraisal</button>`
  submit — the real, actionable intake the item asked for.
- `scripts/check-site.mjs` (lines 371–388) holds the static source guard
  pinning that shape; `node scripts/check-site.mjs` passes
  ("TinyStudio.io checks passed.").
- `git merge-base --is-ancestor 76fe17b origin/main` → 0.
- Commits to `public/pricing.html` / `scripts/check-site.mjs` since the fix
  merged: #251, #154, #218, #112, #156 — none remove the form, label, or
  guard.
- The live `https://tinystudio.io/pricing` still serves the pre-#194 page
  (HTTP 200, no `form.lead`): the deployed release pin
  (`release-state-tinystudio-io.json`, 2026-08-17, `b4d80f1`) predates the
  fix. Documented deploy-lag pattern for this site; not a source regression.

## Files touched

- `docs/evidence/pricing-closing-callout-appraisal-action-rereverify-2026-08-21.md`
  — re-verification receipt with source + live checks and reproduction steps.
- `.lane/reports/fix-pricing-closing-callout-appraisal-action-rereverify-2026-08-21.md`
  — this report.

## Delivery

- Branch: `fix/pricing-closing-callout-appraisal-action-rereverify-2026-08-21`
  (from origin/main `92d55c3`)
- PR: opened against main.