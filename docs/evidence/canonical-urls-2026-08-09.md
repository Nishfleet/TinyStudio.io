# Canonical URLs on the five public pages — live-deployment verification

Date: 2026-08-09
Scope: the five public tinystudio.io pages — `index.html` (home) and the heads of `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 6631c0ab0454, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose served HTML carries no
canonical URL, leaving search engines to guess which address is the page —
canonical duplication, trailing slashes, `.html` vs extensionless twins, and
tracking parameters all feed the same guessing problem. The audit run
20260808T074205Z-msk2fl3n found exactly that fault on this site's own home page
(finding 6631c0ab0454, "Missing canonical URL on home"): before the fix,
`public/index.html` — and every other public page — served zero
`<link rel="canonical">` tags (verified against the parent of the fix commit
a163327).

The fix (PR #29, "seo: add canonical URLs to the five public pages") added
exactly one canonical link to each of the five public pages, placed it inside
`<head>`, and pointed it at the absolute `https://tinystudio.io` address the
page is served under (the `.html` form; the worker also serves extensionless
twins, and the `.html` forms 307-redirect to them — so the canonical is the
single unambiguous address for the page). It also added a source-string CI
guard (`scripts/check-site.mjs`, "Canonical URLs (dogfood)" section) that
fails the build if any page drifts: more than one link, a link outside
`<head>`, a commented-out link, an empty `href`, a wrong address, or a URL
duplicated across pages.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). The `.html` forms were visited
  through their final URLs (`/audit`, `/agents`, `/pricing`, `/specimen`), the
  addresses a browser actually lands on.
- Wait: `domcontentloaded`; canonical links read from `document.head` (a link
  placed outside `<head>` would not count) and from the full document (a
  duplicated link anywhere would count against the "exactly once" guarantee).
- Console errors and page errors captured per page; HTTP status and
  `Content-Security-Policy` presence captured from the served response.

## Results (deployed site, 2026-08-09)

| Page | HTTP | CSP header | canonical links in head | links in full doc | href | console errors |
|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
| audit.html (`/audit`) | 200 | yes | 1 | 1 | `https://tinystudio.io/audit.html` | none |
| agents.html (`/agents`) | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
| pricing.html (`/pricing`) | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
| specimen.html (`/specimen`) | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |

Homepage canonical served live:

> `<link rel="canonical" href="https://tinystudio.io/">`

All five canonical links are distinct, each sits inside the served `<head>`,
and each points at the canonical `https://tinystudio.io` address of the page
(the `.html` form, matching the CI guard's expectation for the five public
pages). The page the finding flagged — the home page — now serves exactly one
canonical link in its head, pointing at `https://tinystudio.io/`.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const csp = await response.headerValue("content-security-policy");
const result = await page.evaluate(() => ({
  inHeadCount: document.head.querySelectorAll("link[rel='canonical']").length,
  inDocCount: document.querySelectorAll("link[rel='canonical']").length,
  href: document.head.querySelector("link[rel='canonical']")?.getAttribute("href") ?? null,
}));
```

3. Assert: status 200, `inHeadCount === 1`, `inDocCount === 1`, a non-empty
   `href`, no console or page errors, and the `href` is unique across the five
   pages.
4. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #29), which fails `npm
test` on any page whose canonical link is missing, duplicated, commented out,
outside the head, empty, wrong-address, or duplicated across pages. The served
pages are the static files verbatim through the Worker's ASSETS binding
(`src/worker.js`), so the source guard and the served bytes cannot drift unless
the Worker's asset serving itself changes.

## Closeout

This closes dogfood finding 6631c0ab0454 ("Missing canonical URL on home")
against the deployed site: the code fix and the CI source guard were merged as
PR #29, and the live deployment now serves exactly one valid, non-empty,
unique canonical link on the home page and on all four sibling public pages.
