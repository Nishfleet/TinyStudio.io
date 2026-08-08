# Homepage meta description — live-deployment verification

Date: 2026-08-09
Scope: the five public tinystudio.io pages — `index.html` (home) and the heads of `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 18dd05c10709, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose served HTML carries no
description — a homepage that leaves the search snippet to whatever the crawler
guesses. The audit run 20260808T074205Z-msk2fl3n found exactly that fault on
this site's own home page (finding 18dd05c10709, "Missing meta description on
home"): before the fix, `public/index.html` — and every other public page —
served zero `meta name="description"` tags (verified against the parent of
commit c0862d4).

The fix (PR #21, "seo: add truthful page meta descriptions") added exactly one
non-empty description to each of the five public pages, kept it within a
practical search-snippet length (≤ 160 chars), distinct per page, and free of
the offer promises this repo refuses to make. It also added a source-string CI
guard (`scripts/check-site.mjs`, "Meta descriptions (dogfood)" section) that
fails the build if any page drifts: more than one tag, empty content, > 160
chars, a duplicate of another page's description, or a forbidden promise.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`).
- Wait: `domcontentloaded`; description tags read from `document.head` (a tag
  placed outside `<head>` would not count) and from the full document (a
  duplicated tag anywhere would count against the "exactly once" guarantee).
- Console errors and page errors captured per page; HTTP status and
  `Content-Security-Policy` presence captured from the served response.

## Results (deployed site, 2026-08-09)

| Page | HTTP | CSP header | description tags in head | tags in full doc | non-empty | length | unique | console errors |
|---|---|---|---|---|---|---|---|---|
| index.html (home) | 200 | yes | 1 | 1 | yes | 150 | yes | none |
| audit.html | 200 | yes | 1 | 1 | yes | 157 | yes | none |
| agents.html | 200 | yes | 1 | 1 | yes | 155 | yes | none |
| pricing.html | 200 | yes | 1 | 1 | yes | 153 | yes | none |
| specimen.html | 200 | yes | 1 | 1 | yes | 145 | yes | none |

Homepage description served live (150 chars):

> TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.

All five descriptions are distinct; none duplicates another page's; none
contains a forbidden promise; each fits a search snippet. The page the finding
flagged — the home page — now serves exactly one valid, non-empty meta
description in its head.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const meta = await page.evaluate(() => ({
  inHeadCount: document.head.querySelectorAll("meta[name='description']").length,
  inDocCount: document.querySelectorAll("meta[name='description']").length,
  content: document.head.querySelector("meta[name='description']")?.getAttribute("content") ?? null,
}));
```

3. Assert: status 200, `inHeadCount === 1`, `inDocCount === 1`, content
   non-empty after trim, length ≤ 160, and the trimmed content is unique
   across the five pages.
4. Run against `https://tinystudio.io/`, `/audit.html`, `/agents.html`,
   `/pricing.html`, `/specimen.html`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #21), which fails `npm
test` on any page whose description tag is missing, duplicated, empty, too
long, duplicated across pages, or promising something the repo refuses to
promise. The served pages are the static files verbatim through the Worker's
ASSETS binding (`src/worker.js`), so the source guard and the served bytes
cannot drift unless the Worker's asset serving itself changes.

## Closeout

This closes dogfood finding 18dd05c10709 ("Missing meta description on home")
against the deployed site: the code fix and the CI source guard were merged as
PR #21, and the live deployment now serves exactly one valid, non-empty,
unique meta description on the home page and on all four sibling public pages.
