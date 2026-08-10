# Apple touch icon on the five public pages — live-deployment verification

Date: 2026-08-11
Scope: the five public tinystudio.io pages — `index.html` (home) and `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 98a7bf8e08fc, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or install counts.

## What was measured

The leak audit this site sells flags a homepage whose served HTML carries no
apple touch icon, leaving iOS Safari to derive a home-screen icon from a
screenshot of the page. The audit run 20260808T074205Z-msk2fl3n found exactly
that fault on this site's own home page (finding 98a7bf8e08fc, "Apple touch
icon missing on home"): before the fix, `public/index.html` — and every other
public page — served no `<link rel="apple-touch-icon">` at all, even though
`public/apple-touch-icon.png` existed (added with the site's icon set in PR
#6, commit 3b1243d) and was already allow-listed in the Worker
(`src/worker.js`, `"/apple-touch-icon.png"`). The asset was served; no page
referenced it.

The fix (PR #30, "fix(public): add apple touch icon to the five public pages
(finding 98a7bf8e08fc)", commit b004c11) did two things. First, it added
`<link rel="apple-touch-icon" href="/apple-touch-icon.png" />` to the head of
each of the five public pages: `index.html`, `audit.html`, `agents.html`,
`pricing.html`, `specimen.html`. Second, it added a source-string CI guard
(`scripts/check-site.mjs`, "Apple touch icon (dogfood)" section) that fails
the build if any of the five pages loses the link, duplicates it, moves it
out of `<head>`, or points it anywhere other than `/apple-touch-icon.png`;
the guard also refuses a `public/apple-touch-icon.png` that is not a valid
PNG or is not tracked by git, and refuses a Worker that no longer serves
`/apple-touch-icon.png` from the public asset allow-list — so a dropped,
rewritten, or unserved file cannot silently leave the pages pointing at
nothing.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). All five pages were visited at
  their final URLs (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`), the
  addresses a browser actually lands on.
- Wait: `domcontentloaded`; the link read from `document.head` (a tag placed
  outside `<head>` would not count) and from the full document (a duplicated
  tag anywhere would count against the "exactly once" guarantee).
- For each page, the `link[rel="apple-touch-icon"]` tags were counted in
  `<head>` and across the full document, their `href` values collected,
  HTTP status and `Content-Security-Policy` presence captured from the served
  response, and console/page errors captured.
- `apple-touch-icon.png` was fetched over HTTP separately and checked against
  the committed file byte-for-byte (SHA-256), as a PNG (signature,
  non-interlaced 180x180 header).

## Results (deployed site, 2026-08-11)

| Page | HTTP | CSP header | link in head | link in full doc | href | console errors | page errors |
|---|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none | none |
| audit.html (`/audit`) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none | none |
| agents.html (`/agents`) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none | none |
| pricing.html (`/pricing`) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none | none |
| specimen.html (`/specimen`) | 200 | yes | 1 | 1 | `/apple-touch-icon.png` | none | none |

Homepage head as served (the block the finding class flags, quoted verbatim):

> ```html
> <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
> ```

The icon itself, fetched over HTTP:

- `GET https://tinystudio.io/apple-touch-icon.png` → 200,
  `content-type: image/png`, 2,232 bytes.
- Valid PNG (signature, 8-bit RGB, non-interlaced), 180x180 — the size iOS
  Safari requests for a home-screen icon.
- Byte-identical to the committed `public/apple-touch-icon.png` (SHA-256
  `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645`), so the
  served icon is exactly the file the source guard checks.

Every page the finding class flagged — the home page first, plus the sibling
pages with the same gap — now serves exactly one apple-touch-icon link inside
its `<head>`, pointing at the allow-listed, git-tracked, valid 180x180 PNG.
The page the finding flagged — the home page — serves the link quoted above.

## Source checks on the current head

Re-verified against the current origin/main head (6a914b6, "docs(evidence):
close out social share image finding d87d715be3d0 against current main and
live (#76)") after ten further commits touched the public surface since the
fix landed (b004c11, PR #30) — structured data, App Store citation repair on
/audit, internal links, canonical URLs, sitemap, preferred-source pages,
Agent Desk de-index, tap targets, footer link, audit canonical/JSON-LD URL
cleanup — none of which was allowed to regress the guarantee:

1. `npm run check` passes: the "Apple touch icon (dogfood)" guard in
   `scripts/check-site.mjs` finds exactly one `link rel="apple-touch-icon"`
   inside the head of each of the five pages, pointing at
   `/apple-touch-icon.png`, with `public/apple-touch-icon.png` a valid,
   git-tracked PNG and the Worker allow-list still serving it; every other
   site check (meta descriptions, canonical URLs, structured data, internal
   links, social share tags, sitemap) passes too.
2. `npm test` passes: the source checks above plus the heading-hierarchy
   (6/6), sitemap (7/7), agent-worker (53/53) and agent-UI (16/16) suites,
   and the product-contract suite (8/8) — all green.
3. The worker still allow-lists the icon: `src/worker.js` line 51 serves
   `"/apple-touch-icon.png"` from the public asset list (checked directly in
   this source read; the apple-touch guard itself enforces the allow-list),
   and the live fetch below returns it with HTTP 200.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const result = await page.evaluate(() => ({
  inHeadCount: document.head.querySelectorAll('link[rel="apple-touch-icon"]').length,
  inDocCount:  document.querySelectorAll('link[rel="apple-touch-icon"]').length,
  hrefs:       [...document.querySelectorAll('link[rel="apple-touch-icon"]')].map((l) => l.getAttribute("href")),
}));
```

3. Assert, per page: HTTP 200 with the CSP header; `inHeadCount === 1` and
   `inDocCount === 1`; the single `href` exactly `/apple-touch-icon.png`;
   no console or page errors.
4. Fetch `https://tinystudio.io/apple-touch-icon.png`: assert 200,
   `image/png`, valid PNG with a 180x180 non-interlaced header, and
   byte-equality with the committed `public/apple-touch-icon.png` (SHA-256).
5. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #30), which fails `npm
test` on any page whose apple-touch-icon link is missing, duplicated, outside
the head, or pointed anywhere but `/apple-touch-icon.png`, and on any
commit that drops or corrupts `public/apple-touch-icon.png` or removes it
from the Worker allow-list. The served pages are the static files verbatim
through the Worker's ASSETS binding (`src/worker.js`), so the source guard
and the served bytes cannot drift unless the Worker's asset serving itself
changes. The measurement does not claim what iOS Safari will render on a
specific device (caches and platform rendering are out of scope); it
verifies the served HTML carries the link and the icon behind it exists, is
reachable, and is a valid 180x180 PNG.

## Closeout

This closes dogfood finding 98a7bf8e08fc ("Apple touch icon missing on home")
against the deployed site: the code fix and the CI source guard were merged
as PR #30, `npm run check` and `npm test` pass on current main, and the live
deployment now serves exactly one `<link rel="apple-touch-icon">` pointing at
`/apple-touch-icon.png` in the head of the home page and of all four sibling
public pages, backed by an allow-listed, git-tracked, valid 180x180 PNG that
is byte-identical to the committed file.

One deployment-lag note, for the tracker: the live deployment lags current
main by exactly the two newest public-surface commits — f9f0b0f (footer
attribution link on home) and 1cc7a4e (canonical/JSON-LD URL cleanup on
/audit) — so the live audit page still serves the redirecting
`https://tinystudio.io/audit.html` form as its `og:url` and canonical, which
main already corrected to the clean `https://tinystudio.io/audit`. Neither
lagging commit touches the apple-touch-icon link on any page: the home page —
the finding's scope — serves the link quoted above on both main and live, and
its icon is byte-identical to the committed file. When the pending deployment
lands, the remaining pages will match main automatically; until then the
finding is already closed on the deployed site.
