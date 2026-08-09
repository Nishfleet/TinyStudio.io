# Mobile tap targets — 44px hit-area fix, measured evidence

Date: 2026-08-09
Scope: `public/shared.css`, `public/index.css`, `public/audit.css`, `public/brief-requested.css` (marketing shell) and `public/styles.css` (retired Agent Desk) — the finding that mobile tap targets fall under WCAG sizes on every page (primary CTAs 42px tall, nav links ~15px).
This receipt records real browser-layout measurements. It is behavior evidence, not a source check, and it does not claim anything about the hosted/live deployment.

## What was measured

A headless Chromium rendered every served page from a local static copy of `public/` (Google Fonts loaded over the network as in production). For each page at 390x844 we recorded `getBoundingClientRect()` height and width for every interactive element: the logo, the nav links, the nav CTA, the lead-form submit button, the footer links, and on the Agent Desk the brand link, submit button, disclosure summary, output tabs, copy button, text inputs and the footer link.

The "unfixed" variant is the exact pre-change tree: same `public/`, but the six stylesheets replaced by their `origin/main` (HEAD) versions, so both states are measured with one method in one session.

## Environment

- Node v22.23.1, Playwright 1.60.0, Chromium headless (rev 1228 family), Linux.
- Viewports: 390x844 (deviceScaleFactor 1) and 1280x800.
- Wait: `networkidle`, then `document.fonts.ready`.

## Results — element height (px) at 390x844, unfixed → fixed

All elements are ≥44px after the fix; every unfixed value below 44px was brought to ≥44px.

| Element | Page(s) | unfixed (max) | fixed (min) |
|---|---|---|---|
| `.logo` | all marketing pages | 28 | 50 |
| `.navlinks a` (text links) | all marketing pages | 15 (43 for the full-width CTA row on /audit) | 45 |
| `.navcta` | home, /agents, /pricing, /specimen | 35 | 47 |
| `.navcta` (full-width row) | /audit | 43 | 47 |
| `form button` (lead CTA) | home, /audit | 42 | 44 |
| `.back` | /brief-requested | 43* | 45 |
| `footer a` | /audit, /agents, /pricing, /specimen | 13 | 45 |
| `.brand` | /agent-desk | 32 | 44 |
| `.agent-form button` | /agent-desk | 42 | 44 |
| `.output-tabs button` | /agent-desk | 34 | 44 |
| `.output-actions button` | /agent-desk | 40 | 44 |
| `input` | /agent-desk | 40 | 44 |
| `.agent-footer a` | /agent-desk | 16 | 44 |
| `.optional-panel summary` | /agent-desk | 65.2 | 65.2 (already ≥44; untouched) |

\* `.back` was 43px after the first pass (13.5px Karla line-height is tighter than the 1.2 estimate), so its padding was raised to 15px 0; the 45px value is the final measured state.

Every row: `fixed min ≥ 44` — no element on any page remains under the bar. Widths were all ≥44 as well (smallest measured width: 44px on the shortest nav label).

## Desktop neutrality

At 1280x800 on /audit, the fixed and unfixed runs are identical for `.logo` (28px), `.navlinks a` (15px), `.navcta` (35px), `footer a` (13px) — the nav/footer padding grows only inside the `max-width:760px` (and 680px for the Desk) blocks. The one intentional global change is the lead-form submit button, 42px → 44px on every viewport, which is the "primary CTAs are 42px tall" half of the finding; the 2px difference is not visually measurable in the pill form (row height 56.3 → 58.3px).

## No horizontal overflow introduced

At 390x844, `document.documentElement.scrollWidth == clientWidth == 390` on all seven pages in both fixed and unfixed runs — the larger nav hit areas change row heights only.

## Exact verification method (reproduce)

1. Copy `public/` to `fixed-site/` and serve it on 127.0.0.1:8131 (`python3 -m http.server 8131 --directory fixed-site`). Copy it again to `unfixed-site/` and overwrite the six changed stylesheets with their `origin/main` versions (`git show origin/main:public/shared.css > unfixed-site/shared.css`, same for `index.css`, `audit.css`, `brief-requested.css`, `styles.css`), then serve it on 127.0.0.1:8132.
2. Run this script per state (requires `npm i -D playwright && npx playwright install chromium` in any project):

```js
import { chromium } from "playwright";
const [baseUrl, label] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const results = { label, viewport: "390x844" };
const sel = { ".logo": ".logo", ".navlinks a": ".navlinks a", ".navcta": ".navcta",
  "form button": "form button", ".back": ".back", "footer a": "footer a",
  ".brand": ".brand", ".agent-form button": ".agent-form button", ".optional-panel summary": ".optional-panel summary",
  ".output-tabs button": ".output-tabs button", ".output-actions button": ".output-actions button",
  "input": "input", ".agent-footer a": ".agent-footer a" };
for (const [key, path] of [["home","index.html"],["audit","audit.html"],["agents","agents.html"],["pricing","pricing.html"],["specimen","specimen.html"],["brief","brief-requested.html"],["desk","agent-desk.html"]]) {
  await page.goto(`${baseUrl}/${path}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  results[key] = await page.evaluate((sel) => {
    const out = {};
    for (const [name, selector] of Object.entries(sel)) {
      const els = [...document.querySelectorAll(selector)];
      out[name] = els.map((el) => { const r = el.getBoundingClientRect(); return { h: +r.height.toFixed(1), w: +r.width.toFixed(1) }; });
    }
    return out;
  }, sel);
}
console.log(JSON.stringify(results, null, 2));
await browser.close();
```

3. Run: `node measure.mjs http://127.0.0.1:8132 unfixed` and `node measure.mjs http://127.0.0.1:8131 fixed`, then check every `h` in the fixed run is ≥ 44 and at least one `h` per element class in the unfixed run is < 44.

## Limitation

This is local static-server proof, not CI proof and not a hosted/live claim. The repo's CI (`npm test`) has no browser dependency, so it runs only the source-string guards in `scripts/check-site.mjs` (which now pin the tap-target rules and this receipt's anchors) plus the worker/UI contract tests; a browser-layout regression can therefore still ship if the checked-in CSS drifts and CI stays green. The live tinystudio.io deployment was not measured here; a deployed page could differ (CDN cache, different asset versions). To be CI-proof this measurement would need a browser step added to CI (not done — out of scope).
