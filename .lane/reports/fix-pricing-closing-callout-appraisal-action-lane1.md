# Lane report: fix/pricing-closing-callout-appraisal-action-lane1-20260814

Date: 2026-08-14
Lane: tinystudio-io lane 1
Item: "[unreviewed-by-opus] Put a real 'Request the appraisal' action inside the pricing page's closing callout — its str..."

## The item

The /pricing closing callout band ("The appraisal costs you an email. The rest is a decision you can make later.") ended in a dead end: no intake form, no action, while every other served conversion surface (home, /audit) carried a real signup form.

## What I did

Re-created the fix that had been built and reviewed in PR #68/#114 (2026-08-10/11, both closed without merging) on a fresh branch from origin/main:

- **`public/pricing.html`** (+5): the closing `.band` now embeds a `form.lead.two` posting website + email to `/api/signups`, with a "Request the appraisal" submit button and persistent programmatic `aria-label`s — identical field shapes to the audit page's intake form.
- **`scripts/check-site.mjs`** (+27): static source guard pinning the shape — the pricing `.band` must keep a `form.lead` posting to `/api/signups`, both intake inputs must carry persistent `aria-label`s, and the submit must read "Request the appraisal" — so the dead end cannot silently return.

No CSS change needed: `shared.css` already styles `form.lead.two` (one-line desktop, stacking under 760px) and the `.band` block, and pricing.html already loads shared.css.

## Verification

- `npm run check` — "TinyStudio.io checks passed." (includes the new guard; the guard regex matches the current band → confidential section structure via `\s*`).
- `npm test` suites (all non-Chromium): test:headings 6/6, test:sitemap 7/7, test:worker 76/76, test:ui 16/16, test:contract 8/8, test:viewport 4/4 — all pass.
- `test:narrow-pages` (real Chromium layout test): fails with `page.goto: Timeout 30000ms` **identically on clean origin/main** (verified by stashing my change and running it against main) — a pre-existing environmental failure on this box under heavy parallel fleet load, unrelated to this change (the change adds a form only, no CSS).

## Delivery

- Branch: `fix/pricing-closing-callout-appraisal-action-lane1-20260814` (from origin/main 80e73ff)
- Commit: d9ff7d7
- PR: https://github.com/nish3451/TinyStudio.io/pull/194
