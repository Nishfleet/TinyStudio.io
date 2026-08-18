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

## Re-verification against current main and live (added 2026-08-11)

Re-verified the finding against the current origin/main head (354e725,
"docs(evidence): re-verify structured-data finding 975fdb784275 against
current main and live", merged 2026-08-11) with the same headless-Chromium
method, one fresh session, on a local static copy of `public/` and on the
live deployment.

### Result: one regression found and fixed

The 2026-08-09 fix (PR #48) grew the footer links inside `shared.css`, but
the home page loads only `index.css` (its own standalone stylesheet), whose
mobile block had no `footer a` rule. PR #70 (2026-08-11) then added the
"inish.in" link to the home-page footer, so current main shipped a 13px hit
area for that link at 390x844 — the only element under the 44px bar on any
page. This lane fixed it by mirroring the `shared.css` rule into
`index.css`'s mobile block (`footer a{padding:16px 0}`) and extending the
`scripts/check-site.mjs` tap-target guard for `index.css` so the same
regression fails CI.

### Fresh measurements (390x844)

- Before the lane fix (head 354e725): every element ≥44px except home
  `footer a` at **13px** (`h:13, w:60.8`). All other pages' footer links
  were 45px, nav links 45px, nav CTA 47px, lead CTA 44px, logo 50px —
  matching the 2026-08-09 receipt.
- After the lane fix: **every interactive element on every served page
  ≥44px**, including home `footer a` at **45px**. Minimum heights across
  all seven pages: `.logo` 50, `.navlinks a` 45, `.navcta` 47, `form
  button` 44, `.back` 45, `footer a` 44 (home 45), `.brand` 44,
  `.agent-form button` 44, `.output-tabs button` 44, `.output-actions
  button` 44, `input` 44, `.agent-footer a` 44, `.optional-panel summary`
  65.2. Widths all ≥44 (smallest: 44px nav label).
- Desktop neutrality: at 1280x800 the home footer link is still 13px
  (unchanged; the rule lives only inside the `max-width:760px` block).
- No overflow introduced: `scrollWidth == clientWidth == 390` on home at
  390x844, and 1280 at 1280x800.

### Source and suite checks on the head

`npm run check` passes on the lane head with the extended guard (removing
the new `index.css` needle makes it fail), and the full `npm test` suite
passes (check, headings 6/6, sitemap 7/7, worker 53/53, ui 16/16, contract
8/8).

### Live measurement

`https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`, `/specimen` at
390x844 (2026-08-11): logo 50px, nav links 45px, nav CTA 47px, lead CTA
44px, inputs ≥47px, footer links 45px on /audit, /agents, /pricing and
/specimen. The live home page is currently behind main (its footer predates
PR #70, so it has no footer link at all); every live element measured is
≥44px, and once current main deploys, the home footer link ships at 45px.

Same bar as the 2026-08-09 fix: every page now keeps ≥44px touch targets
inside the mobile blocks, this time including the home-page footer link,
and the guard in `scripts/check-site.mjs` covers `index.css` so the
regression cannot re-ship silently.

## Re-verification against current main and live, full-element sweep (2026-08-12)

Re-verified the finding once more against the current origin/main head
(18128e8, "fix(public): serve rel=icon on /brief-requested and guard
favicon links in check-site.mjs", merged 2026-08-12) and the live
deployment, one fresh headless-Chromium session, with a broader method
than the 2026-08-09 and 2026-08-11 runs: instead of the thirteen fixed
selectors, every interactive element on every page (`a, button, input,
select, textarea, summary`) was measured at 390x844, on a local static
copy of `public/` and on `https://tinystudio.io` itself.

### Result: no regression; the finding stays closed

- Every standalone (non-inline) target on every served page — home,
  /audit, /agents, /pricing, /specimen, /brief-requested, /agent-desk —
  is ≥44px in both height and width, on main and on live: logo 50,
  nav links 45, nav CTA 47, lead-form button 44, form inputs 47–48,
  footer links 44–45, `.back` 45, and all Agent Desk controls (brand 44,
  submit 44, tabs 44, copy 44, inputs 44, footer link 44, disclosure
  summary 65.2). This covers the changes that landed since the
  2026-08-11 run: the homepage two-field form tablet fix (#96), the
  persistent intake-field labels (#98), the conversion-audit FAQ rows
  (#102, text only — no new interactive elements) and the favicon
  link-tag changes (#85, #113).
- The live deployment now matches main: a per-element diff of the two
  measurement runs shows zero differences, and the home page now carries
  the footer "inish.in" link at 45px (the 2026-08-11 run noted live home
  was behind main).
- The only elements under 44px anywhere are **inline text links inside
  sentences** (`.xa1`/`.xp1`/`.xi19`: "See the terms →", "Read the
  specimen →", and the citation links inside the audit page's AI-search
  evidence `Sources:` lines, which audit.js injects into `<p class="micro">`
  paragraphs). These are exempt from WCAG 2.5.8 Target Size (Minimum) and
  2.5.5 Target Size (Enhanced) under both criteria' "Inline" exception
  (target in a sentence or block of text), and they are typographic by
  design, not discrete controls; the finding's 44px bar has always applied
  to standalone targets. Growing them into 44px hit areas would balloon
  paragraph line-height on touch devices for zero compliance gain, so they
  are intentionally left as-is and are not part of the tap-target guard.
- No overflow introduced: `scrollWidth == clientWidth == 390` on all
  seven pages at 390x844, on main and on live.
- `npm run check` passes on this lane head; the static guards in
  `scripts/check-site.mjs` (shared.css, index.css, audit.css,
  brief-requested.css, styles.css needles) all still pin the ≥44px rules
  that this re-verification measures.

Conclusion: the review item "Mobile tap targets fall under WCAG sizes on
every page: primary CTAs are 42px tall and nav links ~15px" remains
closed — the 42px lead CTA now measures 44px, nav links 45px, on both
current main and the live deployment, with the tap-target rules pinned by
CI source guards.

## Re-verification against current main and live (added 2026-08-15)

Re-verified the finding once more against the current origin/main head
(cdfa877, "docs(evidence): re-verify favicon rel=icon finding
017eb201fc against current main and live", merged 2026-08-15) and the
live deployment, one fresh headless-Chromium session (Playwright 1.62.1,
390x844, deviceScaleFactor 1, isMobile), with the same full-element
sweep method as the 2026-08-12 and 2026-08-14 runs: every interactive
element (`a, button, input, select, textarea, summary`) measured at
390x844 on a local static copy of `public/` and on `https://tinystudio.io`
itself, with an explicit `document.fonts.load("16px Karla")` before
measuring (the font-loading caveat recorded in the 2026-08-14 receipt).

### Changes since the 2026-08-14 receipt (base 7ad776a)

- `2d8599a` (#176, "keep the hero mock and its flags inside the viewport
  below 320px"): index.css layout-only — `.spec`/`.browser` `min-width:0`,
  flag text wrapping, sub-340px `.row`/`.who .sc` wrapping. No tap-target
  rule changed.
- `afb5d49` (#174, "wrap the /agents hero h1 at 280px"): shared.css
  `.phead h1` `overflow-wrap:anywhere`. No tap-target rule changed.
- `c447585` (#202) / `ffc1672` (#193): llms.txt / offer.md text and URL
  changes only — no CSS touched.

The guard in `scripts/check-site.mjs` still pins the ≥44px rules in all
five stylesheets (shared, index, audit, brief-requested, styles), and
`npm run check` passes on this head.

### Result: no regression; the finding stays closed

- Every standalone (non-inline) target on every served page — home,
  /audit, /agents, /pricing, /specimen, /brief-requested, /agent-desk —
  is ≥44px in both height and width, on main and on live: logo 50,
  nav links 45, nav CTA 47, lead-form button 44, form inputs 47–48,
  footer links 44–45, `.back` 45, the in-content `.cta` links added by
  #155/#159/#162 (46px, already measured in the 2026-08-14 run), and
  all Agent Desk controls (brand 44, submit 44, tabs 44, copy 44, inputs
  44, footer link 44, disclosure summary 65.2). This covers the changes
  that landed since the 2026-08-12 run — the #176 and #174 layout fixes
  included — none of which touched a tap-target rule.
- The live deployment matches main: a per-element diff of the two
  measurement runs shows the same elements at the same sizes; the only
  sub-44px elements on either are the WCAG-exempt inline text links
  (`.xa1` audit Sources: citations, `.xi19`/`.xp1` "See the terms →",
  "Read the specimen →", "See the desk →"), which remain intentionally
  excluded from the 44px bar under the WCAG 2.5.8/2.5.5 "Inline"
  exception, as recorded in the 2026-08-12 receipt.
- No overflow introduced: `scrollWidth == clientWidth == 390` on all
  seven pages at 390x844, on main and on live.
- `npm run check` passes on this head, and the full `npm test` suite
  passes (242 tests, 0 failures), including the narrow-viewport Chromium
  regressions added by #174 and #176.

Conclusion: the review item "Mobile tap targets fall under WCAG sizes on
every page: primary CTAs are 42px tall and nav links ~15px" remains
closed — the 42px lead CTA measures 44px, nav links 45px, on both
current main (cdfa877) and the live deployment, with the tap-target
rules pinned by CI source guards.

## Re-verification against current main and live (added 2026-08-17)

Re-verified the finding once more against the current origin/main head
(5ca6241, "fix(public): serve /favicon.ico from the canonical SVG so
legacy clients stop 404-ing", merged 2026-08-17) and the live
deployment, one fresh headless-Chromium session (Playwright 1.62.1,
390x844, deviceScaleFactor 1, isMobile, hasTouch), with the same
full-element sweep method as the 2026-08-12, 2026-08-14 and 2026-08-15
runs: every interactive element (`a, button, input, select, textarea,
summary`) measured at 390x844 on a local static copy of `public/` and
on `https://tinystudio.io` itself, with an explicit
`document.fonts.load("16px Karla")` before measuring (the font-loading
caveat recorded in the 2026-08-14 receipt).

### Changes since the 2026-08-15 receipt (base cdfa877)

Twelve commits landed on main since the 2026-08-15 re-verification; none
touched the tap-target surface:

- `5ca6241` (#238, favicon.ico) — `public/favicon.svg` + Worker routing
  only; no CSS.
- `83a5974` (#237, GoodFirms service doc), `56c4e24` (#236, retired Agent
  Desk title/snippet doc), `b07ebc8` (#235, apple-touch-icon doc),
  `7d3a8ae` (#234, render-blocking doc), `fdd5c20` (#233, Google Ads
  conversion doc), `c5e46d3` (#232, Clutch doc) — `docs/evidence/` and
  service handoff docs only.
- `798cd71` (#229, /agent-desk canonical) — `public/agent-desk.html` link
  rel="canonical" only.
- `0e7373f` (#213, autocomplete="email") — `public/index.html` and
  `public/audit.html` attribute additions on the two intake `<input
  type="email">` fields; no CSS or sizing touched.
- `a654ab4` (#211, AI-search re-run) — `docs/evidence/` only.
- `e90b98f` (#45, Web Analytics beacon 404) — diagnostic doc only.
- `e72e59b` (#67, persistent intake labels + "The Tiny Studio" titles) —
  `public/index.html` and `public/audit.html` aria-label / document
  title / `id="start"` anchor only; no CSS.

`git diff origin/main..HEAD -- public/*.css` returns empty on the lane
head: no stylesheet drift since the 2026-08-15 base. The guard in
`scripts/check-site.mjs` still pins the ≥44px rules in all five
stylesheets (shared, index, audit, brief-requested, styles), and
`npm run check` passes on this head.

### Result: no regression; the finding stays closed

Full-element sweep at 390x844, one fresh Playwright session, local main
and live:

| Page | total | standalone | inline | sub44 standalone | min h × min w |
|---|---|---|---|---|---|
| `/` | 10 | 8 | 2 | 0 | 44 × 44 |
| `/audit` | 33 | 10 | 23 | 0 | 44 × 44 |
| `/agents` | 8 | 6 | 2 | 0 | 45 × 44 |
| `/pricing` | 9 | 5 | 4 | 0 | 45 × 44 |
| `/specimen` | 8 | 6 | 2 | 0 | 45 × 44 |
| `/brief-requested` | 5 | 5 | 0 | 0 | 45 × 44 |
| `/agent-desk` | 25 | 25 | 0 | 0 | 44 × 49 |

Local main and the live `https://tinystudio.io` match element-for-element
on every page (same Playwright session, same viewport, same script);
zero standalone targets under 44px on any of the seven served pages.
The home page minimum is 44x44 (form submit button, footer link,
navlinks); nav links 45, nav CTA 47, inputs 47–48, footer links 45, all
Agent Desk controls 44–65.2, in-content `.cta` links 46 — same as the
2026-08-15 receipt.

The only sub-44px elements anywhere are the WCAG-exempt inline text
links (`.xa1` audit Sources: citations, `.xi19`/`.xp1` "See the terms
→", "Read the specimen →", "See the desk →"), which remain intentionally
excluded from the 44px bar under the WCAG 2.5.8/2.5.5 "Inline"
exception (target inside a sentence or block of text), as recorded in
the 2026-08-12 and 2026-08-15 receipts.

No overflow introduced: `scrollWidth == clientWidth == 390` on all
seven pages at 390x844, on main and on live (asserted in
`scripts/test-narrow-viewport-pages.mjs`, which sweeps 240/260/280/300/
320/360/390 and all five owned routes — 35/35 PASS on the lane head).

### Source and suite checks on the lane head

- `npm run check` passes on this lane head with the tap-target guard in
  `scripts/check-site.mjs` (shared.css, index.css, audit.css,
  brief-requested.css, styles.css needles, plus the pinned evidence
  anchors "unfixed", "390x844", "44px", "not CI proof", "Exact
  verification method").
- Full `npm test` suite passes on this head: check, headings 6/6,
  sitemap 7/7, worker 80/80, ui 16/16, contract 8/8, viewport 4/4,
  narrow-pages and narrow suites (35/35 narrow-pages, 12/12 narrow).
- `git diff --check` clean.

### Live checks

- All seven pages serve HTTP 200 at their clean URLs (`/`, `/audit`,
  `/agents`, `/pricing`, `/specimen`, `/brief-requested`, `/agent-desk`).
- Full-element measurement at 390x844 matches the local main run
  element-for-element: every standalone target ≥44px, only the
  WCAG-exempt inline links under 44px.

Conclusion: the review item "Mobile tap targets fall under WCAG sizes on
every page: primary CTAs are 42px tall and nav links ~15px" remains
closed — the 42px lead CTA measures 44px, nav links 45px, on both
current main (5ca6241) and the live deployment, with the tap-target
rules pinned by CI source guards.
