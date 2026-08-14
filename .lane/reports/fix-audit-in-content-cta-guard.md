# Lane 1 report — /audit in-content request CTA

Branch: `fix/audit-in-content-cta-guard` → PR https://github.com/nish3451/TinyStudio.io/pull/199

## Outcome

The item ("The /audit proof page has no in-content request CTA") is **already fixed on current main** by merged PR #159 (commit 885a7a9, merged into origin/main before this lane started). The closing conversion band with the "Request the appraisal" pill exists in `public/audit.html` and the scoped `.band .cta` styles exist in `public/audit.css`.

What was missing is the same regression protection the sibling proof pages have:

- `/specimen` has an in-content CTA guard in `check-site.mjs` (~L1785).
- `/agents` desk has an in-content CTA guard in `check-site.mjs` (~L340).
- `/audit` — the money page — had **none**.

## Change

`scripts/check-site.mjs` (+26 lines): static-source guard mirroring the specimen/desk guards:

- The closing `.band` between the proof and `#confidential` must keep a `.cta` link to `#start` labelled `Request the appraisal`.
- The band must keep the no-guarantees note (`No revenue, ranking, ROAS, conversion, booked-call or sales-volume guarantees. Only the work.`).
- `audit.css` must keep the scoped `.band .cta` pill styling with `padding:16px 24px` (>=44px tap target).

## Verification

- `npm test` full suite passes, exit 0 (check, headings, sitemap, worker, ui, contract, viewport, narrow-pages).
- Mutation check: changed the CTA label in a scratch edit → `check-site.mjs` failed with `Audit conversion band must carry a .cta link to #start labelled "Request the appraisal".`; restored → passes.

## Files touched

- `scripts/check-site.mjs` — added the audit in-content CTA regression guard.

## Live re-verification

Live tinystudio.io/audit serves the #159 closing band (curl check): `The evidence is above. The read is free.` band with the `Request the appraisal` pill present.
