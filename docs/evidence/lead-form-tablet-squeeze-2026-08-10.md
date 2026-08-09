# Homepage lead form — tablet squeeze fix, measured evidence

Date: 2026-08-10
Scope: `public/index.css` — the homepage intake form (`form.lead.two`) squeezed the domain and email inputs to ~100px at tablet width. The two-field form shares the `.lead` class with the checks-section header, whose `gap:70px / justify-content:space-between / align-items:flex-end` treatment leaked onto the form (via the `.lead` selector) and, together with the nowrap submit button, starved the inputs of width below desktop sizes.
This receipt records real browser-layout measurements. It is behavior evidence, not a source check, and it does not claim anything about the hosted/live deployment.

## What was measured

A headless Chromium rendered the homepage from a local static copy of `public/` (Google Fonts loaded over the network as in production; `document.fonts.ready` waited on, Karla confirmed loaded). For each viewport we recorded `getBoundingClientRect()` width for the form, both inputs, and the submit button, plus the computed `flex-direction`/`gap`, whether the "yourwebsite.com" placeholder's measured text width fits inside the first input's visible text area (input width minus its 42px horizontal padding), and whether `document.documentElement.scrollWidth == clientWidth` (no horizontal overflow).

The "unfixed" variant is the exact pre-change tree: same `public/`, but `index.css` (and its HTML/JS dependencies) replaced by the `origin/main` (HEAD) versions, so both states are measured with one method in one session.

## Environment

- Node v22.23.1, Playwright 1.62.1, bundled Chromium headless, Linux.
- Viewports: 390x900 and 761/768/800/834/900/901/1024/1280 wide x900 (deviceScaleFactor 1).
- Wait: `networkidle`, then `document.fonts.ready`; Karla `document.fonts.check("16px Karla")` confirmed true in every run.

## Results — input widths (px), unfixed → fixed

| Viewport | layout (**unfixed**) | i1/i2 (**unfixed**) | layout (**fixed**) | i1/i2 (**fixed**) |
|---|---|---|---|---|
| 390 | column, gap 18px | 332 / 332 | column, gap 18px | 332 / 332 (identical) |
| 761 | row, gap 70px | **99 / 98** | column, gap 18px | 623 / 623 |
| 768 | row, gap 70px | **103 / 102** | column, gap 18px | 630 / 630 |
| 800 | row, gap 70px | **119 / 118** | column, gap 18px | 662 / 662 |
| 834 | row, gap 70px | **136 / 135** | column, gap 18px | 696 / 696 |
| 900 | row, gap 70px | **139 / 138** | column, gap 18px | 762 / 762 |
| 901 | row, gap 70px | **139 / 138** | row, no gap | 209 / 208 |
| 1024 | row, gap 70px | **139 / 138** | row, no gap | 209 / 208 |
| 1280 | row, gap 70px | **139 / 138** | row, no gap | 209 / 208 |

Submit button: 294px (nowrap) in every row layout, unfixed and fixed. The unfixed "yourwebsite.com" placeholder text (~140px at 16px Karla) does **not** fit the first input's visible area at any viewport ≥761px — including desktop, where the leaked 70px gaps cap the inputs at 139px (97px visible). After the fix the placeholder fits at every width: 167px visible in the 901px+ one-line layout, full-width in the stacked layout below.

## What changed

1. The checks-header rules `.lead{...}` (desktop and mobile) are scoped to `.checks .lead`, so the shared class can no longer leak its `gap:70px / space-between / flex-end` treatment onto the lead form.
2. The two-field form's stacked breakpoint moves from `max-width:760px` to its own `max-width:900px`, with an explicit `gap:18px` (previously inherited from the leaked `.lead` mobile rule), so tablet widths (761–900px) stack full-width instead of squeezing.

## Deliberate desktop change

At ≥901px the one-line form loses the accidental 70px gaps: inputs grow 139 → 208px and the placeholders render fully. This matches the identical two-field form on /audit (shared.css), which never had the `.lead` leak and rendered 264px inputs at 1024px. The submit button (294px) and the pill styling are unchanged. At ≤390px the stacked mobile layout is pixel-identical before and after (332/332 inputs, gap 18px).

## Checks header neutrality

The scoped `.checks .lead` selector leaves the "What we actually look at" header exactly as before: 1024px `space-between / gap 70px / flex-end` row; 390px column with `gap 18px`. The audit page is untouched (its form was never squeezed: shared.css has no `.lead` class rule and its shorter button leaves 224–264px inputs; measured pre-fix).

## No horizontal overflow introduced

At every viewport in both runs, `document.documentElement.scrollWidth == clientWidth` (761px: 761; 768px: 768; 901px: 901; …). The stacked form is `max-width:100%` inside the existing 60px `.wrap` padding.

## Not CI proof

This is local static-server proof, not CI proof and not a hosted/live claim. The repo's CI (`npm test`) has no browser dependency, so it runs only the source-string guards in `scripts/check-site.mjs` (which now pin the lead-form rules and this receipt's anchors) plus the worker/UI contract tests; a browser-layout regression can therefore still ship if the checked-in CSS drifts and CI stays green. The live tinystudio.io deployment was not measured here; a deployed page could differ (CDN cache, different asset versions). To be CI-proof this measurement would need a browser step added to CI (not done — out of scope).

## Exact verification method (reproduce)

1. Copy `public/` to `fixed-site/` and serve it on 127.0.0.1:8131 (`python3 -m http.server 8131 --directory fixed-site`). Copy it again to `unfixed-site/` and overwrite `index.css` (and `index.html`, `index.js`, `fonts.js` for a clean tree) with their `origin/main` versions (`git show origin/main:public/index.css > unfixed-site/index.css`), then serve it on 127.0.0.1:8132.
2. Run this per state and viewport (requires `npm i -D playwright && npx playwright install chromium` in any project):

```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 768, height: 900 });
await page.goto("http://127.0.0.1:8131/");   // or :8132 for unfixed
await page.waitForLoadState("networkidle");
await page.evaluate(() => document.fonts.ready);
const m = await page.evaluate(() => {
  const form = document.querySelector("form.two");
  const inputs = [...form.querySelectorAll("input")];
  const r = (el) => Math.round(el.getBoundingClientRect().width);
  return {
    i1: r(inputs[0]), i2: r(inputs[1]), btn: r(form.querySelector("button")),
    direction: getComputedStyle(form).flexDirection, gap: getComputedStyle(form).gap,
    scrollOK: document.documentElement.scrollWidth === document.documentElement.clientWidth
  };
});
console.log(m);
```

Unfixed at 768px: `{ i1: 103, i2: 102, btn: 294, direction: "row", gap: "70px", scrollOK: true }`. Fixed at 768px: `{ i1: 630, i2: 630, btn: 630, direction: "column", gap: "18px", scrollOK: true }`. Fixed at 1024px: `{ i1: 209, i2: 208, btn: 294, direction: "row", gap: "normal", scrollOK: true }`.
