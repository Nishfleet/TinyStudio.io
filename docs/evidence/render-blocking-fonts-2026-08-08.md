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

This is local static-server proof, not CI proof and not a hosted/live claim. The repo's CI (`npm test`) has no browser dependency, so it runs only the source-string guards in `scripts/check-site.mjs` plus the worker/UI contract tests; a render-blocking regression can therefore still ship if the served HTML drifts and CI stays green. The live tinystudio.io deployment was not measured here; a deployed page could differ (CDN cache, different asset versions).

### CI enforcement (added 2026-08-09)

The browser gap above is now closed: `.github/workflows/ci.yml` runs
`npm run check:render-blocking` as a browser step (`scripts/check-render-blocking.mjs`),
so the render-blocking guarantee no longer depends on CI staying source-green.
The check serves the six public pages statically under the exact production CSP
header, intercepts the css2 request and delays it, then asserts in real
Chromium that (1) the css2 resource is non-blocking, (2) first-contentful-paint
does not wait for it, (3) the only render-blocking resources are the site's own
same-origin stylesheets, and (4) the preload link is still promoted to a real
stylesheet under the production CSP. The css2 response is stubbed so the check
has no external network dependency; the static guards above keep the real font
URL and the no-JS fallback honest. A blocking shape (a `<link rel="stylesheet">`
or `@import` returning on any of the six pages) fails CI: measured locally, a
reintroduced blocking link holds first paint to the delayed css2 response
  (fcp 2780ms vs css2 end 2566ms) and the check fails with exit code 1.

### Live deployment verification (added 2026-08-09)

The limitation above — "The live tinystudio.io deployment was not measured here;
a deployed page could differ (CDN cache, different asset versions)" — is now
closed. On 2026-08-09 the deployed pages were measured in real Chromium
(Playwright 1.62.1, headless, unthrottled, no artificial CDN delay):

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 652 | 460 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 624 | 536 | same-origin audit.css, shared.css | yes / yes | yes |
| agents.html | non-blocking | 880 | 558 | same-origin agents.css, shared.css | yes / yes | yes |
| pricing.html | non-blocking | 720 | 531 | same-origin shared.css, pricing.css | yes / yes | yes |
| specimen.html | non-blocking | 796 | 623 | same-origin specimen.css, shared.css | yes / yes | yes |
| brief-requested.html | non-blocking | 668 | 527 | same-origin shared.css, brief-requested.css | yes / yes | yes |

The only render-blocking resources on any live page are the site's own
same-origin stylesheets — the exact allowance the CI check
(`scripts/check-render-blocking.mjs`) asserts. No render-blocking scripts and no
render-blocking external resources were observed, including on the homepage the
original dogfood run flagged. The Google Fonts css2 stylesheet is fetched
non-blocking on all six live pages, first paint does not wait for it, and fonts
still load and apply under the production CSP. This closes dogfood finding
b8f6046e942a ("Render-blocking resources on home") against the deployed site;
the code-side fix and the CI enforcement were already merged as PRs #20 and #23.

### Closeout re-verification (added 2026-08-09)

Re-verified against the current origin/main head (a163327, "seo: add canonical
URLs to the five public pages", merged 2026-08-09) after the subsequent page
edits (heading hierarchy, apple-touch icon, schema.org, meta descriptions,
canonical URLs, internal-link cleanup, App Store citation) — none of which was
allowed to regress the guarantee. Two fresh measurements:

1. `npm run check:render-blocking` on the current working tree (real Chromium,
   production CSP, css2 intercepted and delayed 2500ms, stubbed response): all
   six pages PASS — css2 non-blocking, first-contentful-paint never waits for it
   (homepage 320ms, audit 84ms, desk 56ms, pricing 52ms, specimen 72ms,
   brief-requested 68ms), no render-blocking resources other than the site's
   own same-origin stylesheets, promoted sheet applied.

2. Live re-measurement of the deployed pages in real Chromium (unthrottled):

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 692 | 491 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 432 | 199 | same-origin audit.css, shared.css | yes / yes | yes |
| agents.html | non-blocking | 356 | 142 | same-origin shared.css, agents.css | yes / yes | yes |
| pricing.html | non-blocking | 360 | 139 | same-origin shared.css, pricing.css | yes / yes | yes |
| specimen.html | non-blocking | 340 | 156 | same-origin shared.css, specimen.css | yes / yes | yes |
| brief-requested.html | non-blocking | 300 | 130 | same-origin shared.css, brief-requested.css | yes / yes | yes |

Same result as the earlier verification passes: no render-blocking scripts, no
render-blocking external resources, first paint never waits for the font
stylesheet, fonts still load and apply. Finding b8f6046e942a ("Render-blocking
resources on home") remains closed on the code side (PRs #20 and #23), in CI
(`npm run check:render-blocking`), and against the deployed site; this lane
(2026-08-09) re-confirmed all three and found nothing further to change.

### Closeout re-verification (added 2026-08-10)

Re-verified against the current origin/main head (536b3c9, "ci: move
ubuntu-latest jobs to VPS verification runners", merged 2026-08-10) after the
commits that landed since the 2026-08-09 closeout — cd9184c (sitemap),
95d2248 (preferred source pages: llms.txt/offer.md only), c5e2f2b (de-index the
retired Agent Desk: head meta/JSON-LD text, no new resources), ac05bec (tap
targets: CSS padding only) and the CI-runner commits (no public assets). None
of them introduced a render-blocking shape; the full test suite (`npm test`,
82 tests: static source guards, heading hierarchy, sitemap, worker contract,
UI contract) passes on this head. Two fresh measurements:

1. `npm run check:render-blocking` on the current working tree at 536b3c9
   (real Chromium, production CSP, css2 intercepted and delayed 2500ms,
   stubbed response): all six pages PASS — css2 non-blocking,
   first-contentful-paint never waits for it (homepage 816ms, audit 368ms,
   desk 460ms, pricing 504ms, specimen 612ms, brief-requested 464ms; the
   css2 response arrives at 2500ms, i.e. ~1700ms after first paint), no
   render-blocking resources other than the site's own same-origin
   stylesheets, promoted sheet applied.

2. Live re-measurement of the deployed pages in real Chromium (unthrottled),
   served with the production CSP header:

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 1036 | 631 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 668 | 573 | same-origin audit.css, shared.css | yes / yes | yes |
| agents.html | non-blocking | 472 | 571 | same-origin shared.css, agents.css | yes / yes | yes |
| pricing.html | non-blocking | 340 | 598 | same-origin shared.css, pricing.css | yes / yes | yes |
| specimen.html | non-blocking | 332 | 459 | same-origin specimen.css, shared.css | yes / yes | yes |
| brief-requested.html | non-blocking | 300 | 472 | same-origin shared.css, brief-requested.css | yes / yes | yes |

On the unthrottled live run the preloaded css2 (a non-blocking style preload,
fetched at preload priority from the first byte) can finish before
first-contentful-paint lands on the slower pages — the same ordering the
2026-08-09 live run showed (home 692ms vs css2 end 491ms). That is timing, not
blocking: the deterministic delayed-css2 run above paints ~1700ms before the
css2 response arrives, so first paint cannot be waiting on it.

Same result as every earlier pass: no render-blocking scripts, no
render-blocking external resources, first paint never waits for the font
stylesheet, fonts still load and apply under the production CSP. Finding
b8f6046e942a ("Render-blocking resources on home") remains closed on the code
side (PRs #20 and #23), in CI (`npm run check:render-blocking`), and against
the deployed site; this lane (2026-08-10) re-confirmed all three on the
current head and found nothing further to change.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (9302611, "fix(public): serve
rel=icon favicon on every page so browsers stop 404ing /favicon.ico", merged
2026-08-11) after the commits that landed since the 2026-08-10 closeout —
notably 9302611 (rel=icon favicon link), d4a2c30 (intake-field labels and
document titles), 37ddaed (wrangler toolchain upgrade, no public assets),
2ae7504 (search-intent bridge), 1e78ecf and 5ab84ea (retired-Agent-Desk
worker/check-site corrections), 6f85c61 and 0ad7481 (CSS layout/tap-target
fixes), 1cc7a4e (canonicals and JSON-LD @ids), f9f0b0f (homepage footer link),
plus the docs-only re-verification receipts. None of them introduced a
render-blocking shape; the full test suite passes on this head (`npm test`,
92 tests across heading hierarchy, sitemap, worker contract, UI contract and
product contract, plus the static source guards — "TinyStudio.io checks
passed"). Two fresh measurements:

1. `npm run check:render-blocking` on the current working tree at 9302611
   (real Chromium, production CSP, css2 intercepted and delayed 2500ms,
   stubbed response): all six pages PASS — css2 non-blocking,
   first-contentful-paint never waits for it (homepage 224ms, audit 132ms,
   desk 216ms, pricing 176ms, specimen 160ms, brief-requested 160ms; the
   css2 response arrives at 2500ms, i.e. ~2.3s after first paint), no
   render-blocking resources other than the site's own same-origin
   stylesheets, promoted sheet applied.

2. Live re-measurement of the deployed pages in real Chromium (unthrottled),
   served with the production CSP header emitted by the worker (verified via
   `curl -sI https://tinystudio.io/`):

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 388 | 473 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 216 | 82 | same-origin shared.css, audit.css | yes / yes | yes |
| agents.html | non-blocking | 188 | 69 | same-origin shared.css, agents.css | yes / yes | yes |
| pricing.html | non-blocking | 212 | 46 | same-origin shared.css, pricing.css | yes / yes | yes |
| specimen.html | non-blocking | 172 | 61 | same-origin specimen.css, shared.css | yes / yes | yes |
| brief-requested.html | non-blocking | 212 | 56 | same-origin shared.css, brief-requested.css | yes / yes | yes |

On the unthrottled live run the preloaded css2 (a non-blocking style preload,
fetched at preload priority from the first byte) can finish before
first-contentful-paint lands on the homepage (388ms FCP vs 473ms css2 end) —
the same ordering the 2026-08-09 and 2026-08-10 runs showed (692 vs 491 and
1036 vs 631 on home). That is timing, not blocking: the deterministic
delayed-css2 run above paints ~2.3s before the css2 response arrives, so
first paint cannot be waiting on it.

Same result as every earlier pass: no render-blocking scripts, no
render-blocking external resources, first paint never waits for the font
stylesheet, fonts still load and apply under the production CSP. Finding
b8f6046e942a ("Render-blocking resources on home") remains closed on the code
side (PRs #20 and #23), in CI (`npm run check:render-blocking`), and against
the deployed site; this lane (2026-08-11) re-confirmed all three on the
current head and found nothing further to change.

### Closeout re-verification (added 2026-08-13)

Re-verified against the current origin/main head (885a7a9, "fix(public): add
in-content request CTA to the /audit proof page (#159)", merged 2026-08-13)
after the commits that landed since the 2026-08-11 closeout — 278df7f
(docs: re-verify this finding, no public assets), 7fc1b05 (worker
storage-failure honesty: 503 storage_unavailable on missing/broken D1),
5de5187 (in-content request CTA on the /agents desk page) and 885a7a9
(in-content request CTA on the /audit proof page) — none of which touched the
font loading shape. The full test suite passes on this head (`npm test`:
static source guards — "TinyStudio.io checks passed" — plus heading hierarchy
6, sitemap 7, worker 68, UI 16 and product contract 8; 105 tests, 0
failures). Two fresh measurements:

1. `npm run check:render-blocking` on the current working tree at 885a7a9
   (real Chromium, production CSP, css2 intercepted and delayed 2500ms,
   stubbed response): all six pages PASS — css2 non-blocking,
   first-contentful-paint never waits for it (homepage 296ms, audit 132ms,
   desk 104ms, pricing 200ms, specimen 396ms, brief-requested 252ms; the
   css2 response arrives at 2500ms, i.e. ~2.1–2.4s after first paint), no
   render-blocking resources other than the site's own same-origin
   stylesheets, promoted sheet applied.

2. Live re-measurement of the deployed pages in real Chromium (unthrottled),
   served with the production CSP header emitted by the worker (verified via
   `curl -sI https://tinystudio.io/`):

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 728 | 544 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 552 | 517 | same-origin shared.css, audit.css | yes / yes | yes |
| agents.html | non-blocking | 388 | 528 | same-origin shared.css, agents.css | yes / yes | yes |
| pricing.html | non-blocking | 376 | 485 | same-origin pricing.css, shared.css | yes / yes | yes |
| specimen.html | non-blocking | 308 | 470 | same-origin specimen.css, shared.css | yes / yes | yes |
| brief-requested.html | non-blocking | 244 | 477 | same-origin shared.css, brief-requested.css | yes / yes | yes |

On the unthrottled live run the preloaded css2 (a non-blocking style preload,
fetched at preload priority from the first byte) can finish before
first-contentful-paint lands on the homepage (728ms FCP vs 544ms css2 end) —
the same ordering every earlier live run showed. That is timing, not
blocking: the deterministic delayed-css2 run above paints ~2.1–2.4s before
the css2 response arrives, so first paint cannot be waiting on it.

Same result as every earlier pass: no render-blocking scripts, no
render-blocking external resources, first paint never waits for the font
stylesheet, fonts still load and apply under the production CSP. Finding
b8f6046e942a ("Render-blocking resources on home") remains closed on the code
side (PRs #20 and #23), in CI (`npm run check:render-blocking`), and against
the deployed site; this lane (2026-08-13) re-confirmed all three on the
current head and found nothing further to change.

### Closeout re-verification (added 2026-08-14)

Re-verified against the current origin/main head (0ff0694, "docs(evidence):
close the duplicate specimen-CTA PR #107/#155 cluster on current state",
merged 2026-08-14) after the commits that landed since the 2026-08-13
closeout — 7fc1b05 (worker storage-failure honesty: 503 storage_unavailable
on missing/broken D1), 5de5187 (in-content request CTA on the /agents desk
page), 885a7a9 (in-content request CTA on the /audit proof page), d981610
(CI guard for the /audit in-content CTA) and the docs-only re-verification
receipts — none of which touched the font loading shape. The full test suite
passes on this head (`npm test`: static source guards — "TinyStudio.io
checks passed" — plus heading hierarchy 6, sitemap 7, worker 76, UI 16 and
product contract 8; 117 tests, 0 failures). Two fresh measurements:

1. `npm run check:render-blocking` on the current working tree at 0ff0694
   (real Chromium, production CSP, css2 intercepted and delayed 2500ms,
   stubbed response): all six pages PASS — css2 non-blocking,
   first-contentful-paint never waits for it (homepage 240ms, audit 120ms,
   desk 116ms, pricing 188ms, specimen 128ms, brief-requested 136ms; the
   css2 response arrives at 2500ms, i.e. ~2.3s after first paint), no
   render-blocking resources other than the site's own same-origin
   stylesheets, promoted sheet applied.

2. Live re-measurement of the deployed pages in real Chromium (unthrottled),
   served with the production CSP header emitted by the worker (verified via
   `curl -sI https://tinystudio.io/`):

| Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
|---|---|---|---|---|---|---|
| index.html (home) | non-blocking | 388 | 172 | same-origin index.css only | yes / yes | yes |
| audit.html | non-blocking | 236 | 91 | same-origin shared.css, audit.css | yes / yes | yes |
| agents.html | non-blocking | 308 | 101 | same-origin shared.css, agents.css | yes / yes | yes |
| pricing.html | non-blocking | 240 | 86 | same-origin pricing.css, shared.css | yes / yes | yes |
| specimen.html | non-blocking | 172 | 76 | same-origin specimen.css, shared.css | yes / yes | yes |
| brief-requested.html | non-blocking | 240 | 91 | same-origin shared.css, brief-requested.css | yes / yes | yes |

On the unthrottled live run the preloaded css2 (a non-blocking style preload,
fetched at preload priority from the first byte) can finish before
first-contentful-paint lands (homepage 388ms FCP vs 172ms css2 end) — the
same ordering every earlier live run showed. That is timing, not blocking:
the deterministic delayed-css2 run above paints ~2.3s before the css2
response arrives, so first paint cannot be waiting on it.

The live pages were also fetched through a real browser context and compared
byte-for-byte against `public/` on this head: all six are identical, so the
deployed HTML and the guarded source cannot drift without changing the
served bytes.

Same result as every earlier pass: no render-blocking scripts, no
render-blocking external resources, first paint never waits for the font
stylesheet, fonts still load and apply under the production CSP. Finding
b8f6046e942a ("Render-blocking resources on home") remains closed on the code
side (PRs #20 and #23), in CI (`npm run check:render-blocking`), and against
the deployed site; this lane (2026-08-14) re-confirmed all three on the
current head and found nothing further to change.
