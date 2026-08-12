# Homepage lead-form tablet squeeze — re-verify against current main and live

Date: 2026-08-12
Scope: the review-queue item "[unreviewed-by-grok] Stop the homepage intake
form from squeezing domain+email inputs to ~100px at tablet width". This
receipt re-verifies the item's guarantee against the current `origin/main`
head (5864e39, 2026-08-12) and the live deployment of that head. It is
source-evidence plus a real-browser layout measurement of both a local static
copy of current main and the deployed site, using the same method and
viewport set as the original behavioral receipt
`docs/evidence/lead-form-tablet-squeeze-2026-08-10.md`.

## Summary

The failure mode the item describes — the homepage intake form
(`form.lead.two`) squeezing the domain and email inputs to ~100px at tablet
width — **no longer occurs, on source and on the live site**. The code-side
fix is already merged in `origin/main` as PR #96 (`6f85c61`,
"fix(public): stop the homepage intake form squeezing its inputs at tablet
width", merged 2026-08-11): the checks-header rules that shared the `.lead`
class with the form are scoped to `.checks .lead`, and the two-field form
now stacks below its own `max-width:900px` breakpoint with an explicit
`gap:18px`. Measured again in real Chromium on 2026-08-12 on the current
head and live: tablet widths (761–900px) render the form stacked with inputs
at **623–762px full width** (previously 88–139px and clipped), and the
one-line layout at 901px+ keeps **209/208px** inputs with the
"yourwebsite.com" placeholder fully visible — identical to the fixed-state
numbers recorded in the original receipt. Mobile (390px) is unchanged at
332/332px.

The item was tagged `unreviewed-by-grok` because it predates the merge of
PR #96 (authored 2026-08-10, fixed on 2026-08-11); it has never been closed
out against the merged state. This receipt records the closeout on the
current head so the item cannot be re-opened by tracker drift.

## Source checks on the current head (5864e39)

1. `npm run check` passes. The "Lead-form tablet squeeze guard"
   (`scripts/check-site.mjs`) pins all four fix invariants on the served
   homepage CSS: the checks-header rule is scoped as
   `.checks .lead{display:flex;justify-content:space-between;align-items:flex-end;gap:70px}`
   (so the shared class cannot leak its `gap:70px` treatment onto the form);
   the form carries its own `@media (max-width:900px)` stacking breakpoint;
   the stacked form rule is
   `form.two{flex-direction:column;align-items:stretch;border-radius:20px;padding:8px;max-width:100%;gap:18px}`;
   and the old `max-width:760px` stacking form is rejected. It also asserts
   the behavioral receipt `docs/evidence/lead-form-tablet-squeeze-2026-08-10.md`
   still records its unfixed/fixed measurements and method, so the guard
   stays distinguishable from the browser proof.
2. `npm test` passes on the current head: check-site (6), heading-hierarchy
   (7), sitemap (55), agent-worker (16), agent-UI, and product-contract (8)
   suites — 92 tests total, zero failures.
3. The served live stylesheet carries the fix: `https://tinystudio.io/index.css`
   contains the scoped `.checks .lead` rule and the `max-width:900px` form
   breakpoint (cache-busted fetch, 2026-08-12).

## Browser re-verification 2026-08-12

Real Chromium (Playwright 1.62.1, headless, Karla font confirmed loaded via
`document.fonts.ready`) measured `getBoundingClientRect()` widths of the
form, both inputs, and the submit button, computed `flex-direction`/`gap`,
placeholder fit, and `scrollWidth == clientWidth` — against (a) a local
static copy of the current `origin/main` `public/` served on 127.0.0.1, and
(b) the live `https://tinystudio.io` deployment. Results were identical
between the two, and identical to the fixed-state column of the original
receipt:

| Viewport | layout | gap | i1/i2 (local) | i1/i2 (live) | placeholder fits | overflow |
|---|---|---|---|---|---|---|
| 390 | column | 18px | 332 / 332 | 332 / 332 | yes | none |
| 761 | column | 18px | 623 / 623 | 623 / 623 | yes | none |
| 768 | column | 18px | 630 / 630 | 630 / 630 | yes | none |
| 800 | column | 18px | 662 / 662 | 662 / 662 | yes | none |
| 834 | column | 18px | 696 / 696 | 696 / 696 | yes | none |
| 900 | column | 18px | 762 / 762 | 762 / 762 | yes | none |
| 901 | row | normal | 209 / 208 | 209 / 208 | yes | none |
| 1024 | row | normal | 209 / 208 | 209 / 208 | yes | none |
| 1280 | row | normal | 209 / 208 | 209 / 208 | yes | none |

Unfixed reference (from the original receipt, re-measured 2026-08-11 on the
pre-fix tree): 88/87px at 761px, 103/102px at 768px, and never above 139px
at any width, with the "yourwebsite.com" placeholder clipped at every
viewport ≥761px. The submit button is 294px in every one-line layout and
full-width when stacked, unchanged by the fix. `document.documentElement`
`scrollWidth == clientWidth` at every viewport in both runs — no horizontal
overflow introduced or remaining.

Checks-header neutrality re-confirmed: the "What we actually look at"
header (`.checks .lead`) renders `space-between / gap 70px` at 761px+ and
`space-between / gap 18px` at 390px in both runs, exactly as recorded in the
original receipt; the audit page form (shared.css, no `.lead` rule) is
untouched by this item.

## Repro steps

1. Source guard: `npm run check` — the "Lead-form tablet squeeze guard"
   section fails if the scoped `.checks .lead` rule, the 900px stacking
   breakpoint, the explicit 18px gap, or the absence of the 760px stack
   regression change in `public/index.css`, or if the evidence receipt's
   anchors drift.
2. Browser probe (Playwright 1.62.1, chromium headless): serve a copy of
   `public/` locally, then per viewport (761/768/800/834/900/901/1024/1280,
   height 900) load `/`, wait `networkidle` + `document.fonts.ready`, and
   record `form.two` input widths, `flex-direction`, `gap`, placeholder fit,
   and `scrollWidth == clientWidth`. Fixed-state values are the table above;
   the identical script run against `https://tinystudio.io` produces the
   same numbers (measured 2026-08-12).

## Closeout

The item as stated — "Stop the homepage intake form from squeezing
domain+email inputs to ~100px at tablet width" — is **closed against
current main and live**: the code-side fix (PR #96) is merged in
`origin/main`, the CI guard in `scripts/check-site.mjs` pins the fix shape,
`npm run check` and `npm test` (92 tests) pass on the current head
(5864e39), the live stylesheet carries the fix, and real-Chromium
measurement of both the current-head static copy and the deployed site on
2026-08-12 shows full-width stacked inputs (623–762px) at tablet widths and
209/208px inputs with a fitting placeholder at 901px+, with no horizontal
overflow. No code change is needed or proposed. The receipt now records the
closeout on the current head so the item cannot be re-opened by tracker
drift.
