# Internal page links point at final clean URLs — live-deployment verification

Date: 2026-08-09
Scope: the five public tinystudio.io pages — `index.html` (home) and `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 996dffe45ef7, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose internal links do not
point at the final destination URL: every link that resolves through a
redirect is a redirecting internal link, and search engines value the link at
the redirected address, not at the hop it started from. The audit run
20260808T074205Z-msk2fl3n found exactly that fault on this site's own home
page (finding 996dffe45ef7, "Redirecting internal links on home"): before the
fix, `public/index.html` linked its logo, navigation and specimen call-out at
`index.html`, `audit.html`, `agents.html`, `pricing.html` and `specimen.html`
(verified against the parent of the fix commit 44b241c). The deployed worker
serves extensionless twins for all five pages and 307-redirects every `.html`
form to its clean twin — verified live, `curl -sI https://tinystudio.io/audit.html`
returns `307 Location: /audit` — so each of those home links was a
redirecting internal link.

The fix (PR #34, "fix(public): point internal page links at final clean
URLs") changed all five public pages to point every page link at the clean
URL the worker serves (`/`, `/audit`, `/agents`, `/pricing`, `/specimen` —
never at a `.html` file that resolves to it), and added a source-string CI
guard (`scripts/check-site.mjs`, "Internal page links (dogfood 996dffe45ef7)"
section) that fails the build if any of the five pages carries an anchor whose
target is one of the five `.html` page names.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding; see
  `src/worker.js`). All five pages were visited at their final URLs (`/`,
  `/audit`, `/agents`, `/pricing`, `/specimen`), the addresses a browser
  actually lands on.
- Wait: `domcontentloaded`; every anchor with a non-external, non-`mailto:`,
  non-`tel:`, non-hash-only href collected from the loaded document.
- Each internal link target was then probed with `maxRedirects: 0` — a
  redirecting link returns a 3xx with a `Location` header, a clean link
  returns 200 with no `Location`.
- Console errors and page errors captured per page; HTTP status,
  `Content-Security-Policy` presence, final URL and any load-time redirect
  chain captured from the served response.

## Results (deployed site, 2026-08-09)

### Per-page load

| Page | HTTP | CSP header | final URL | redirects during load | console errors | internal link probes |
|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | `https://tinystudio.io/` | none | none | 5 |
| audit.html (`/audit`) | 200 | yes | `https://tinystudio.io/audit` | none | none | 5 |
| agents.html (`/agents`) | 200 | yes | `https://tinystudio.io/agents` | none | none | 5 |
| pricing.html (`/pricing`) | 200 | yes | `https://tinystudio.io/pricing` | none | none | 6 |
| specimen.html (`/specimen`) | 200 | yes | `https://tinystudio.io/specimen` | none | none | 5 |

### Internal link probes

Every internal link target on every page returned **200 with no `Location`
header** — zero redirecting internal links. The probes, per page:

- homepage (`/`): `/`, `/audit`, `/agents`, `/pricing`, `/specimen`
- audit page (`/audit`): `/`, `/audit`, `/specimen`, `/agents`, `/pricing`
- desk page (`/agents`): `/`, `/audit`, `/agents`, `/pricing`, `/#start`
- pricing page (`/pricing`): `/`, `/audit`, `/agents`, `/pricing`, `/#start`, `/specimen`
- specimen page (`/specimen`): `/`, `/audit`, `/agents`, `/pricing`, `/#start`

(`/#start` is a same-page hash link on the clean address; the probe resolves
the path before `#` to `/` and confirms it serves 200 with no redirect.)

### The `.html` forms the pre-fix home linked at (baseline)

Probed the same way, all five still 307-redirect to their clean twins — the
exact shape the finding flagged, now absent from every page link:

| `.html` form | status | `Location` |
|---|---|---|
| `index.html` | 307 | `/` |
| `audit.html` | 307 | `/audit` |
| `agents.html` | 307 | `/agents` |
| `pricing.html` | 307 | `/pricing` |
| `specimen.html` | 307 | `/specimen` |

In-browser demonstration of what a pre-fix link did: navigating
`https://tinystudio.io/audit.html` in Chromium follows the redirect —
request chain `[307] /audit.html` → `[200] /audit`, final URL
`https://tinystudio.io/audit`.

## Source checks on the current head

Re-verified against the current origin/main head (8b42e0a, "docs(evidence):
close out apple touch icon finding 98a7bf8e08fc against current main and live",
merged 2026-08-11) after the page edits that landed since the first receipt
(canonicals on the appraisal page, the homepage footer daily-reads link, the
44px tap-target pass, the Agent Desk de-index, the AI-answer source pages) —
none of which was allowed to regress the guarantee:

1. `npm run check` passes: the "Internal page links (dogfood 996dffe45ef7)"
   guard finds no anchor targeting any `.html` page name on any of the five
   public pages, and every other site check (meta descriptions, canonical
   URLs, structured data, internal links, sitemap) passes too.
2. `npm test` passes: the source checks above plus the heading-hierarchy,
   sitemap, agent-worker, agent-UI and product-contract suites (16/16 UI
   subtests, 90 tests total, all suites green).

## Live re-verification 2026-08-11

Re-ran the deployed-site measurement below in real Chromium (Playwright
1.62.1, headless) against the live `https://tinystudio.io` — the current
deployment of the current main:

- All five pages still load 200 at their final clean URLs (`/`, `/audit`,
  `/agents`, `/pricing`, `/specimen`) with zero console errors, zero page
  errors, and no load-time redirects.
- Every internal link on every page still probes `200` with no `Location`
  header (`maxRedirects: 0`), including the home page the finding flagged:
  home's anchors are `/`, `/audit`, `/agents`, `/pricing`, `/specimen` (plus
  the same-page `#start` CTA). Zero redirecting internal links site-wide.
- The five `.html` forms the pre-fix home linked at still 307-redirect to
  their clean twins (`index.html` → `/`, `audit.html` → `/audit`,
  `agents.html` → `/agents`, `pricing.html` → `/pricing`,
  `specimen.html` → `/specimen`) — the exact shape the finding flagged, still
  present only on unlinked addresses.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const hrefs = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")));
```

3. For every internal href (not external, not `mailto:`/`tel:`, not
   hash-only), probe the absolute target with `maxRedirects: 0` and assert
   `status === 200` and no `Location` header:

```js
const pr = await context.request.get(abs, { maxRedirects: 0 });
// assert pr.status() === 200 && pr.headers()["location"] === undefined
```

4. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`. Baseline: probe the five `.html` forms and observe the 307 +
   `Location` (this is the shape the finding flagged, now present only on
   unlinked addresses).

## Closeout

Nothing further to change: the code-side fix (PR #34) and CI enforcement (the
"Internal page links (dogfood 996dffe45ef7)" guard in `scripts/check-site.mjs`)
are merged in origin/main, `npm run check` and `npm test` pass on the current
head (8b42e0a), and the deployed site serves zero redirecting internal links
on all five public pages — including the home page the finding flagged — as
re-measured in real Chromium on 2026-08-11. The receipt now records the
closeout on the current head so the finding cannot be re-opened by tracker
drift.
