# Lane 1 report: "No call at any point" public-promise gap

Branch: `fix/no-call-intake-truth`

## Finding

The Website Appraisal publicly promises **"No call at any point"** on the homepage (`/`) and the MSP buyer-intent page (`/msp`), but the promise was missing from:

1. The canonical, machine-readable offer mirrors:
   - `public/offer.md`
   - `public/llms.txt`
2. Two live intake surfaces that post to `/api/signups`:
   - `public/audit.html` (form micro-note only said "Yours to keep either way")
   - `public/pricing.html` (new closing-callout form had no micro-note at all)

Because `offer.md` and `llms.txt` are described in `MEMORY.md` and the current plan as the source of public truth, a missing core promise there is a public-promise gap. The inconsistent form notes also weaken the intake surfaces that convert.

This is a tier-1 product-truth / tier-2 public-promise fix, not a revenue, ROAS, ranking, conversion, AI-visibility or booked-call promise.

## Fix

- `public/offer.md`: added the "No call at any point" clause to the `Current Offer` section.
- `public/llms.txt`: added the same clause to the `Current Offer: The Website Appraisal` section.
- `public/audit.html`: added the phrase to the form micro-note.
- `public/pricing.html`: added the form micro-note that now includes the phrase.
- `scripts/check-site.mjs`:
  - added `No call at any point.` to `requiredPublicArtifacts` (guards both canonical mirrors).
  - added a new source guard that checks the phrase appears on every intake surface (`/`, `/audit`, `/pricing`, `/msp`).

## Verification

- `npm test` green on branch `fix/no-call-intake-truth`.
- `node scripts/check-site.mjs` reports `TinyStudio.io checks passed.`
- All 83 worker tests, 16 UI/contract tests, heading, sitemap, study, viewport and narrow-viewport tests passed.

## Files touched

- `public/offer.md`
- `public/llms.txt`
- `public/audit.html`
- `public/pricing.html`
- `scripts/check-site.mjs`
- `.fleet-spec/2132047-23111-1787466094/lane-1.json`
- `.lane/reports/fix-no-call-intake-truth.md`

PACKET COMPLETE
