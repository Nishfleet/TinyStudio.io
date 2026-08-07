# /audit 390x844 horizontal overflow fix — measured evidence

Date: 2026-08-06
Scope: `public/audit.css` mobile block (candidate-3 fix) on `/audit` (`public/audit.html`).
This receipt records a real browser-layout measurement. It is behavior evidence, not a source check, and it does not claim anything about the hosted/live deployment.

## What was measured

A headless Chromium rendered `/audit` from a local static copy of `public/` (Google Fonts loaded over the network as in production). For each viewport we recorded `document.documentElement.scrollWidth` vs `clientWidth` and the `getBoundingClientRect()` boxes of the blocks that previously overflowed.

The "unfixed" variant is the exact same tree with the `@media (max-width:760px){...}` block removed from `public/audit.css`, so both states are measured with one method in one session.

## Environment

- Node v22.23.1, Playwright 1.61.0, Chromium (headless shell) 149.0.7827.55, revision 1228, Linux.
- Viewports: 390x844 (deviceScaleFactor 1) and 1280x800.
- Wait: `networkidle`, then `document.fonts.ready`.

## Results

| State | Viewport | scrollWidth | overflow | Off-canvas blocks |
|---|---|---|---|---|
| unfixed | 390x844 | **567** (client 390) | yes | `.navlinks` right=567.3, `.navcta` right=567.3, `.stat` right=449.8 |
| **fixed** | **390x844** | **390** | **no** | none — all blocks inside [20, 370] |
| fixed | 1280x800 | 1280 | no | none |
| unfixed | 1280x800 | 1280 | no | none |

Fixed 390x844 boxes: `.navlinks` [20,370], `.navcta` [20,370], `.bandgrid` [46,344], `.stat` [46,344] w=298, `.checks` [20,370], `.row` [20,370].

### Corroboration with the original failure record

The candidate-3 fix record in `scripts/check-site.mjs` cites the pre-fix page at 390x844 with navlinks to x=569 and the 53-of-89 stat to x=451. This session's unfixed re-measurement gives right edges 567.3 and 449.8 — the same failure, within 2px (rounding/font-loading variance between sessions).

### Desktop neutrality

The 1280x800 boxes of `.wrap`, `.navlinks`, `.navcta`, `.bandgrid`, `.stat`, `.checks`, `.row` are identical in the fixed and unfixed runs — the mobile block measurably changes nothing at desktop width.

## Exact verification method (reproduce)

1. Copy `public/` to `fixed-site/` and serve it on 127.0.0.1:8131 (`python3 -m http.server 8131 --directory fixed-site`). Copy it again to `unfixed-site/`, strip the mobile block from its `audit.css`, and serve that on 127.0.0.1:8132 (`python3 -m http.server 8132 --directory unfixed-site`).
2. For the unfixed variant, strip the mobile block from its `audit.css`:
   `css.replace(/@media \(max-width:760px\)\{[\s\S]*\}\s*$/, "")`.
3. Run this script per state/viewport (requires `npm i -D playwright && npx playwright install chromium` in any project):

```js
import { chromium } from "playwright";
const [url, width, height, label] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(height) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
const result = await page.evaluate((label) => {
  const de = document.documentElement;
  const w = de.clientWidth, sw = de.scrollWidth;
  const rects = {};
  for (const s of [".wrap","nav",".navlinks",".navcta",".phead","h1",".band",".bandgrid",".stat",".checks",".check",".rows",".row","footer"]) {
    const el = document.querySelector(s);
    if (!el) continue;
    const r = el.getBoundingClientRect();
    rects[s] = { left: +r.left.toFixed(1), right: +r.right.toFixed(1), width: +r.width.toFixed(1) };
  }
  return { label, viewport: { w }, scrollWidth: sw, horizontalOverflow: sw > w,
    offenders: Object.entries(rects).filter(([,r]) => r.right > w + 0.5 || r.left < -0.5).map(([s,r]) => `${s} right=${r.right}`),
    rects };
}, label);
console.log(JSON.stringify(result, null, 2));
await browser.close();
```

4. Run: `node measure.mjs http://127.0.0.1:8131/audit.html 390 844 fixed` (and the 8132/unfixed and 1280 variants).

## Limitation

This is local static-server proof, not CI proof and not a hosted/live claim. The repo's CI (`npm test`) has no browser dependency, so it runs only the source-string guards in `scripts/check-site.mjs` plus the worker/UI contract tests; a browser-layout regression can therefore still ship if the checked-in CSS drifts and CI stays green. The live tinystudio.io deployment was not measured here; a deployed page could differ (CDN cache, different asset versions). To be CI-proof this measurement would need a browser step added to CI (not done — out of scope).
