# Google Fonts css2 render-blocking fix — measured evidence

Date: 2026-08-08
Scope: `public/index.html` head + `public/shared.css` + the heads of `audit.html`, `agents.html`, `pricing.html`, `specimen.html`, `brief-requested.html` (dogfood finding b8f6046e942a).
This receipt records a real browser measurement. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or the hosted/live deployment.

## What was measured

The Google Fonts css2 stylesheet was fetched render-blocking on every public page — a `<link rel="stylesheet">` in the homepage head, and an `@import` chain inside `shared.css` for the shared pages. The fix preloads the same css2 URL as a style resource, promotes it via the same-origin `public/fonts.js` script, keeps a `<noscript>` fallback, and removes the `@import` from `shared.css`. `src/worker.js` registers `/fonts.js` in its `PUBLIC_ASSET_PATHS` allow-list (the worker 404s any unlisted asset-like path, and the production CSP forbids inline handlers/scripts, so a same-origin served script is the only promotion vehicle that works under the live CSP).

Two measurement passes, both in one Chromium session against local static copies (unfixed = parent commit tree, fixed = working tree):

1. **Status pass (unthrottled):** Chromium's `renderBlockingStatus` for the css2 resource, per page.
2. **Timing pass:** the font CDN request intercepted and delayed by 1500ms, comparing first-contentful-paint against the css2 response end. Fonts were verified to still load (`document.fonts.check("16px Karla")`, `check("30px Fraunces")`) and the stylesheet to apply (`link.sheet`).

### Production-CSP check (the reason the shape is what it is)

The live host serves `Content-Security-Policy` with `script-src 'self'` and no `unsafe-inline` (verified live via `curl -sI https://tinystudio.io/`). Under that exact header, an inline `onload="this.rel='stylesheet'"` swap is **blocked** — Chromium logs `Executing inline event handler violates...` and the font stylesheet never applies (`link.sheet` stays false, no font faces register). The candidate therefore uses a same-origin promotion script (`public/fonts.js`, allowed by `script-src 'self'`) instead of an inline handler. The timing pass below runs through a proxy that adds the exact production CSP header, so the measured shape is the shape that works in production.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Local static servers on 127.0.0.1:8131 (unfixed) and 127.0.0.1:8132 (fixed); CSP proxy on 8153/8154.
- Font CDN request intercepted and delayed by 1500ms for the timing pass.
- Wait: `domcontentloaded`, then poll paint/resource entries; `document.fonts.ready` before the font checks.

## Results

### renderBlockingStatus (unthrottled)

| Page | unfixed | fixed |
|---|---|---|
| index.html | blocking | non-blocking |
| audit.html | blocking | non-blocking |
| agents.html | blocking | non-blocking |
| pricing.html | blocking | non-blocking |
| specimen.html | blocking | non-blocking |
| brief-requested.html | blocking | non-blocking |

### First paint vs css2 response, under the production CSP header and a 1500ms CDN delay

| Page | unfixed FCP | unfixed waited for css2 | fixed FCP | fixed waited for css2 |
|---|---|---|---|---|
| index.html | 1816ms | yes | 148ms | no |
| audit.html | 1656ms | yes | 120ms | no |
| agents.html | 1668ms | yes | 68ms | no |
| pricing.html | 1680ms | yes | 76ms | no |
| specimen.html | 1652ms | yes | 72ms | no |
| brief-requested.html | 1660ms | yes | 88ms | no |

### Fonts still load, stylesheet still applies

Both states, all six pages: `fontsReady: "loaded"`, `karla: true`, `fraunces: true`, `sheetApplied: true` in the fixed state. First paint uses the fallback stack and swaps in via the existing `display=swap` in the URL. No CSP violations in the fixed state (the single console error on `brief-requested.html` is the pre-existing `gtag/js?id=AW-XXXXXXXXX` placeholder, present in both states).

## Exact verification method (reproduce)

1. Copy `public/` from the parent commit to `unfixed/` and the working tree to `fixed/`; serve on 127.0.0.1:8131 / 8132.
2. Run a proxy that adds the live CSP header (`Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; base-uri 'self'; frame-ancestors 'none'; form-action 'self'`) and forwards to 8131/8132.
3. Run this script per state per page with the optional CDN delay (requires `playwright` + Chromium):

```js
import { chromium } from "playwright";
const [url, delayMs] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
if (delayMs) {
  await page.route("**fonts.googleapis.com/css2**", async (route) => {
    const response = await route.fetch();
    await new Promise((resolve) => setTimeout(resolve, Number(delayMs)));
    await route.fulfill({ response });
  });
}
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
const result = await page.evaluate(async () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  let fcp = null, css2End = null, rbs = null;
  for (let i = 0; i < 80; i++) {
    const f = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
    if (f) fcp = Math.round(f.startTime);
    const c = performance.getEntriesByType("resource").find((r) => r.name.includes("css2"));
    if (c) { css2End = Math.round(c.responseEnd); rbs = c.renderBlockingStatus ?? null; }
    if (fcp !== null && (css2End !== null || !delayMs)) break;
    await sleep(50);
  }
  await document.fonts.ready;
  return { fcp, css2End, renderBlockingStatus: rbs,
    waitedForCss2: fcp !== null && css2End !== null ? fcp >= css2End : null,
    sheetApplied: [...document.querySelectorAll("link[href*='fonts.googleapis']")].some((l) => !!l.sheet),
    karla: document.fonts.check("16px Karla"), fraunces: document.fonts.check("30px Fraunces") };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
```

4. Run: `node measure.mjs http://127.0.0.1:8153/index.html 1500` (fixed, delayed), `node measure.mjs http://127.0.0.1:8154/index.html 1500` (unfixed, delayed), and without the delay for the status column.

## Limitation

This is local static-server proof, not CI proof and not a hosted/live claim. The repo's CI (`npm test`) has no browser dependency, so it runs only the source-string guards in `scripts/check-site.mjs` plus the worker/UI contract tests; a render-blocking regression can therefore still ship if the served HTML drifts and CI stays green. The live tinystudio.io deployment was not measured here; a deployed page could differ (CDN cache, different asset versions). To be CI-proof this measurement would need a browser step added to CI (not done — out of scope).
