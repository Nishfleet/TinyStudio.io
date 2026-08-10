# Structured data on the five public pages — live-deployment verification

Date: 2026-08-09
Scope: the five public tinystudio.io pages — `index.html` (home) and `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 975fdb784275, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose served HTML gives a
machine reader nothing to hold onto — no schema.org markup at all — so a
search engine has to guess what the page is, who publishes it, and what it is
about. The audit run 20260808T074205Z-msk2fl3n found exactly that fault on
this site's own home page (finding 975fdb784275, "Structured data opportunity
on home"): before the fix, `public/index.html` — and every other public page —
served zero `application/ld+json` blocks (verified against the parent of the
fix commit b004c11).

The fix (PR #32, "seo: add schema.org structured data to the five public
pages") added exactly one `application/ld+json` block to the head of each of
the five public pages: a `@graph` with a stable TinyStudio `Organization` node
(the same entity on every page), a `WebSite` node, and the page's own
`WebPage` node. Every value is bound to the page's own head metadata — the
`WebPage` name to the `og:title`, the description to the meta description, the
url to the `og:url` — so the structured data cannot drift from what the page
actually says. The `Organization` node is identical on all five pages (its
description is the stable homepage meta description), and the price stays
where it belongs: `pricing.html` owns it, so no other page's block restates a
dollar amount. It also added a source-string CI guard
(`scripts/check-site.mjs`, "Structured data (dogfood 975fdb784275)" section)
that fails the build if any page loses its block, duplicates one, breaks the
JSON, moves it out of `<head>`, mismatches its own metadata, or introduces an
extra node.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). All five pages were visited at
  their final URLs (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`), the
  addresses a browser actually lands on.
- Wait: `domcontentloaded`; `application/ld+json` blocks read from
  `document.head` (a block placed outside `<head>` would not count) and from
  the full document (a duplicated block anywhere would count against the
  "exactly once" guarantee).
- Each served block was parsed as JSON and checked against the same contract
  as the CI guard: `@context` is `https://schema.org`, the `@graph` is an
  array of nodes with unique `@id` values, exactly one `Organization` node
  (stable `@id`, name `TinyStudio`, url, served logo, homepage-meta
  description), exactly one `WebSite` node (stable `@id`, site url, name,
  `inLanguage` "en", publisher pointing at the `Organization`), and exactly one
  `WebPage` node (its own `@id` and url in the page's canonical `.html` form,
  name equal to the decoded `og:title`, description equal to the meta
  description, `inLanguage` "en", `isPartOf` the `WebSite`, `about` the
  `Organization`).
- Console errors and page errors captured per page; HTTP status and
  `Content-Security-Policy` presence captured from the served response.

## Results (deployed site, 2026-08-09)

| Page | HTTP | CSP header | ld+json blocks in head | blocks in full doc | graph nodes | WebPage @id | console errors | page errors |
|---|---|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/#webpage` | none | none |
| audit.html (`/audit`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/audit.html#webpage` | none | none |
| agents.html (`/agents`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/agents.html#webpage` | none | none |
| pricing.html (`/pricing`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/pricing.html#webpage` | none | none |
| specimen.html (`/specimen`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/specimen.html#webpage` | none | none |

Homepage structured data served live (the full block, as served):

> ```json
> {
>   "@context": "https://schema.org",
>   "@graph": [
>     {
>       "@type": "Organization",
>       "@id": "https://tinystudio.io/#organization",
>       "name": "TinyStudio",
>       "url": "https://tinystudio.io/",
>       "logo": "https://tinystudio.io/apple-touch-icon.png",
>       "description": "TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month."
>     },
>     {
>       "@type": "WebSite",
>       "@id": "https://tinystudio.io/#website",
>       "url": "https://tinystudio.io/",
>       "name": "TinyStudio",
>       "inLanguage": "en",
>       "publisher": { "@id": "https://tinystudio.io/#organization" }
>     },
>     {
>       "@type": "WebPage",
>       "@id": "https://tinystudio.io/#webpage",
>       "url": "https://tinystudio.io/",
>       "name": "TinyStudio — The Website Appraisal",
>       "description": "TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.",
>       "inLanguage": "en",
>       "isPartOf": { "@id": "https://tinystudio.io/#website" },
>       "about": { "@id": "https://tinystudio.io/#organization" }
>     }
>   ]
> }
> ```

Every page the finding class flagged — the home page first, plus the sibling
pages with the same gap — now serves exactly one valid
`application/ld+json` block, inside its `<head>`, whose parsed graph carries
exactly one `Organization`, one `WebSite` and one `WebPage` node. On every
page the `WebPage` node's `@id` and `url` take the page's canonical `.html`
form (the same addresses the canonical links and `og:url` tags point at), the
`Organization` description equals the stable homepage meta description, and
no block restates a dollar amount (the price remains `pricing.html`'s to
state). The block a machine reader gets on the page the finding flagged — the
home page — is the block quoted above.

## Source checks on the current head

Re-verified against the current origin/main head (d0c789e, "docs(evidence):
close out internal-links finding 996dffe45ef7 against current main and live",
merged 2026-08-09) after the subsequent page edits (canonical URLs, sitemap) —
none of which was allowed to regress the guarantee:

1. `npm run check` passes: the "Structured data (dogfood 975fdb784275)" guard
   finds exactly one valid schema.org `@graph` block in the head of each of
   the five public pages, bound to each page's own metadata, and every other
   site check (meta descriptions, canonical URLs, structured data, internal
   links, sitemap) passes too.
2. `npm test` passes: the source checks above plus the heading-hierarchy,
   sitemap, agent-worker and agent-UI suites (15/15 UI subtests, all suites
   green).

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const result = await page.evaluate(() => ({
  inHeadCount: document.head.querySelectorAll("script[type='application/ld+json']").length,
  inDocCount: document.querySelectorAll("script[type='application/ld+json']").length,
  block: document.querySelector("script[type='application/ld+json']")?.textContent ?? null,
}));
```

3. Parse `block` as JSON and assert: `@context === "https://schema.org"`; the
   `@graph` is an array with unique `@id` values and exactly one `Organization`
   (stable `@id` `https://tinystudio.io/#organization`, name `TinyStudio`,
   url `https://tinystudio.io/`, logo `https://tinystudio.io/apple-touch-icon.png`,
   description equal to the homepage meta description), exactly one `WebSite`
   (stable `@id` `https://tinystudio.io/#website`, site url, name `TinyStudio`,
   `inLanguage` "en", publisher `@id` pointing at the `Organization`), and
   exactly one `WebPage` (its own `.html`-form `@id` and url, name equal to
   the decoded `og:title`, description equal to the meta description,
   `inLanguage` "en", `isPartOf` the `WebSite`, `about` the `Organization`).
4. Assert: status 200, `inHeadCount === 1`, `inDocCount === 1`, no console or
   page errors.
5. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #32), which fails `npm
test` on any page whose structured data block is missing, duplicated, outside
the head, invalid JSON, non-schema.org, missing a graph node, or mismatched
against the page's own metadata. The served pages are the static files
verbatim through the Worker's ASSETS binding (`src/worker.js`), so the source
guard and the served bytes cannot drift unless the Worker's asset serving
itself changes.

## Closeout

This closes dogfood finding 975fdb784275 ("Structured data opportunity on
home") against the deployed site: the code fix and the CI source guard were
merged as PR #32, `npm run check` and `npm test` pass on current main, and
the live deployment now serves exactly one valid schema.org `@graph` block —
a stable `Organization`, the `WebSite`, and the page's own `WebPage` — on the
home page and on all four sibling public pages.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (8b42e0a, "docs(evidence):
close out apple touch icon finding 98a7bf8e08fc against current main and
live (#77)") after five commits touched the public surface since the
2026-08-09 closeout — 95d2248 (preferred source pages for AI answers),
c5e2f2b (de-index the retired Agent Desk), ac05bec (mobile tap targets: CSS
only), f9f0b0f (footer attribution link on home), 1cc7a4e (canonical/JSON-LD
URL cleanup on /audit). Only the last touched a structured-data block — the
audit page's `WebPage` `@id`/`url` moved from the redirecting
`https://tinystudio.io/audit.html` to the clean `https://tinystudio.io/audit`
(plus the page's canonical and `og:url`), with the `check-site.mjs` guard
expectation updated in the same commit to match (verified per commit: `git
show <sha> -- public/` contains no `ld+json`/`@id`/`@graph` change in any
other commit). The home-page block the finding flagged is byte-identical to
the one the closeout measured (diff of the served block against
`public/index.html` on this head: zero differences). Three checks:

1. Source checks on this head: `npm run check` passes — the "Structured data
   (dogfood 975fdb784275)" guard in `scripts/check-site.mjs` requires exactly
   one `application/ld+json` block in the head of each of the five pages, a
   valid schema.org `@graph` with unique `@id` values, exactly one
   `Organization` node (stable `@id` `https://tinystudio.io/#organization`,
   name `TinyStudio`, url `https://tinystudio.io/`, served logo, homepage-meta
   description), exactly one `WebSite` node (stable `@id`
   `https://tinystudio.io/#website`, publisher pointing at the `Organization`),
   and exactly one `WebPage` node bound to the page's own metadata — and the
   full `npm test` suite passes (check, headings 6/6, sitemap 7/7, worker 53,
   ui 16, contract 8).

2. Fresh live measurement of the deployed site (2026-08-11, headless
   Chromium, same method as the receipt above, `domcontentloaded` wait,
   blocks counted in `document.head` and the full document, each block parsed
   and checked against the same contract as the CI guard, console/page errors
   captured): every page returns 200 with the CSP header, serves exactly one
   `application/ld+json` block in its head and one across the whole document
   whose graph carries exactly one `Organization`, one `WebSite` and one
   `WebPage` node with unique `@id` values (organization and site nodes
   matching the stable entities, `WebPage` bound to the page's own metadata),
   and logs no console or page errors.

   | Page | HTTP | CSP header | ld+json blocks in head | blocks in full doc | graph nodes | WebPage @id | console errors |
   |---|---|---|---|---|---|---|---|
   | index.html (home, `/`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/#webpage` | none |
   | audit.html (`/audit`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/audit.html#webpage` | none |
   | agents.html (`/agents`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/agents.html#webpage` | none |
   | pricing.html (`/pricing`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/pricing.html#webpage` | none |
   | specimen.html (`/specimen`) | 200 | yes | 1 | 1 | Organization, WebSite, WebPage | `https://tinystudio.io/specimen.html#webpage` | none |

   Homepage structured data served live, unchanged from the closeout receipt
   (the block quoted above; diffed byte-for-byte against `public/index.html`
   on this head: identical).

3. Deployment-lag note (honesty, not a structured-data regression): the live
   deployment lags current main by at least the two newest public-surface
   commits — f9f0b0f (footer attribution link on home) and 1cc7a4e
   (canonical/JSON-LD URL cleanup on /audit) — so the live audit page still
   names the redirecting `https://tinystudio.io/audit.html` form in its
   `WebPage` `@id`/`url` that PR #56 already corrected on main to the clean
   `/audit` (matching the lag this lane's canonical re-verification
   documented on the same page). Neither lagging commit touches the home
   page's block; the address the finding flagged (home, `/`) is identical on
   main and live and was already served correctly at the 2026-08-09 closeout.

Finding 975fdb784275 ("Structured data opportunity on home") remains closed
on the code side (PR #32), in CI (`npm run check` guard), and against the
deployed site; this lane (2026-08-11) re-confirmed all three against current
main and found nothing further to change on the finding's page.
