# Social share image on the five public pages — live-deployment verification

Date: 2026-08-11
Scope: the five public tinystudio.io pages — `index.html` (home) and the heads of `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding d87d715be3d0, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or share counts.

## What was measured

The leak audit this site sells flags a homepage whose served HTML cannot tell
a social platform what to show when the page is shared — the share card comes
back with no image, or a scraped guess. The audit run 20260808T074205Z-msk2fl3n
found exactly that fault on this site's own home page (finding d87d715be3d0,
"Social share image incomplete on home"): before the fix, `public/index.html`
— and every other public page — served zero `og:`/`twitter:` tags even though
`public/og-image.png` existed and was allow-listed in the worker (verified
against the parent of the fix commit eae1d87).

The fix (PR #31, "seo: complete the social share image on home") did three
things. First, it added the complete Open Graph + Twitter Card set to the head
of each of the five public pages: `og:title`, `og:description`, `og:type`,
`og:url`, `og:image` with `width`/`height`/`alt`, and the Twitter Card mirror
(`twitter:card` `summary_large_image`, `twitter:title`/`description`/`image`),
every value bound to the page's own head metadata — `og:description` and
`twitter:description` equal to the page's meta description, `og:url` equal to
the page's own absolute URL, `og:image` pointing at the absolute
`https://tinystudio.io/og-image.png`. Second, it regenerated the share image
itself (`scripts/generate-og-image.mjs`): the original `og-image.png` (PR #6)
was built while the root page was the retired TinyStudio Agent Desk, so its
copy advertised the legacy product; the new 1200x630 card uses the current
site's palette (`index.css` cream/ink/brass), the existing `favicon.svg` mark,
and copy verbatim from the current home page headline and meta description.
The generator refuses to write unless the Google Fonts load, every element
box sits inside the canvas, and the pixels contain the cream background, ink
text and brass accents. Third, it added a source-string CI guard
(`scripts/check-site.mjs`, "Social share tags (dogfood d87d715be3d0)"
section) that fails the build if any page loses a tag, duplicates one, moves
it out of `<head>`, uses the wrong attribute (`og:` must be `property=`,
`twitter:` must be `name=`), empties it, or mismatches it — including
`og:image:width`/`height` against the actual PNG header of `og-image.png`,
which the guard reads from the committed file.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). All five pages were visited at
  their final URLs (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`), the
  addresses a browser actually lands on.
- Wait: `domcontentloaded`; social tags read from `document.head` (a tag
  placed outside `<head>` would not count) and from the full document (a
  duplicated tag anywhere would count against the "exactly once" guarantee).
- For each page, the twelve required tags were counted and their `content`
  values collected, `og:description` and `twitter:description` compared with
  the page's `meta[name="description"]`, and console/page errors captured.
  HTTP status and `Content-Security-Policy` presence captured from the served
  response.
- `og-image.png` was fetched over HTTP separately and checked against the
  committed file byte-for-byte (SHA-256), as a PNG (signature, non-interlaced
  1200x630 header) and for the pixel content the generator asserts.

## Results (deployed site, 2026-08-11)

| Page | HTTP | CSP header | share tags in head | tags in full doc | og:description = meta | console errors | page errors |
|---|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | 12/12 | 12/12 | yes | none | none |
| audit.html (`/audit`) | 200 | yes | 12/12 | 12/12 | yes | none | none |
| agents.html (`/agents`) | 200 | yes | 12/12 | 12/12 | yes | none | none |
| pricing.html (`/pricing`) | 200 | yes | 12/12 | 12/12 | yes | none | none |
| specimen.html (`/specimen`) | 200 | yes | 12/12 | 12/12 | yes | none | none |

The twelve tags required per page: `og:title`, `og:description`, `og:type`,
`og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`,
`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` —
each present exactly once inside `<head>` and exactly once across the whole
document, each with a non-empty `content`, and `og:image`/`twitter:image`
equal to `https://tinystudio.io/og-image.png` with declared dimensions
1200x630 on every page.

Homepage share set served live (the full block, as served):

> ```html
> <meta property="og:title" content="TinyStudio — The Website Appraisal">
> <meta property="og:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
> <meta property="og:type" content="website">
> <meta property="og:url" content="https://tinystudio.io/">
> <meta property="og:image" content="https://tinystudio.io/og-image.png">
> <meta property="og:image:width" content="1200">
> <meta property="og:image:height" content="630">
> <meta property="og:image:alt" content="TinyStudio — The Website Appraisal">
> <meta name="twitter:card" content="summary_large_image">
> <meta name="twitter:title" content="TinyStudio — The Website Appraisal">
> <meta name="twitter:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
> <meta name="twitter:image" content="https://tinystudio.io/og-image.png">
> ```

The share image itself, fetched over HTTP:

- `GET https://tinystudio.io/og-image.png` → 200, `content-type: image/png`,
  345,042 bytes.
- Valid PNG (signature, 8-bit RGB, non-interlaced), 1200x630 — matching the
  declared `og:image:width`/`height` exactly.
- Byte-identical to the committed `public/og-image.png` (SHA-256
  `93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df`), so the
  served card is exactly the file the source guard checks and the generator
  produced.
- Pixel content (sampled from the decoded PNG, non-interlaced): corners and
  body in the site's cream family — e.g. top-left (245,239,228), matching the
  `--cream: #F6F0E5` (246,240,229) background, with warm brass accents
  (`--brass: #A47E3C` family, red > green > blue buckets) present — the
  cream/ink/brass palette the generator asserts, i.e. the current-offer card,
  not the retired Agent Desk artwork.

Every page the finding class flagged — the home page first, plus the sibling
pages with the same gap — now serves the complete share set inside its
`<head>`, exactly once, with descriptions bound to the page's own meta
description, URLs bound to the page's own address, and one shared
1200x630 `og-image.png` that is the current-offer card. The page the finding
flagged — the home page — serves the block quoted above.

## Source checks on the current head

Re-verified against the current origin/main head (ce02df9, "chore(ci):
allowlist the public Cloudflare Web Analytics beacon tag in one evidence doc
(#63)") after twelve further commits touched the public surface since the fix
landed (eae1d87, PR #31) — heading hierarchy, apple touch icon, structured
data, internal links, App Store citation repair on /audit, canonical URLs,
sitemap, preferred-source pages, Agent Desk de-index, tap targets, footer
link, audit canonical/JSON-LD URL cleanup — none of which was allowed to
regress the guarantee:

1. `npm run check` passes: the "Social share tags (dogfood d87d715be3d0)"
   guard in `scripts/check-site.mjs` finds each of the twelve tags exactly
   once, inside `<head>`, with the right attribute, non-empty content,
   `og:description` equal to the page's meta description, `og:url` equal to
   the page's own absolute URL, `og:image` equal to the absolute
   `og-image.png` URL, declared dimensions matching the committed PNG header,
   and every other site check (meta descriptions, canonical URLs, structured
   data, internal links, sitemap) passes too. The guard also refuses a
   non-PNG or non-1200x630 `og-image.png`.
2. `npm test` passes: the source checks above plus the heading-hierarchy
   (6/6), sitemap, agent-worker (53/53) and agent-UI (16/16) suites, and the
   product-contract suite (8/8) — all green.
3. The worker still allow-lists the image: `src/worker.js` line 52 serves
   `"/og-image.png"` from the public asset list (checked directly in this
   source read; the social-share guard itself does not enforce the
   allow-list), and the live fetch below returns it with HTTP 200.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const result = await page.evaluate(() => ({
  inHeadCounts: /* per tag: count of meta[property|name="<tag>"] in document.head */,
  inDocCounts:  /* per tag: count in the full document */,
  values:       /* per tag: its content attribute */,
  description:  document.head.querySelector('meta[name="description"]')?.content ?? null,
}));
```

3. Assert, per page and per tag (`og:` → `property`, `twitter:` → `name`):
   `inHeadCounts === 1` and `inDocCounts === 1`, non-empty `content`;
   `og:description` and `twitter:description` equal the page's meta
   description; `og:image` and `twitter:image` equal
   `https://tinystudio.io/og-image.png`; `og:image:width`/`height` are
   1200/630. Assert HTTP 200 with the CSP header and no console or page
   errors.
4. Fetch `https://tinystudio.io/og-image.png`: assert 200, `image/png`, valid
   PNG with a 1200x630 non-interlaced header, and byte-equality with the
   committed `public/og-image.png` (SHA-256).
5. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #31), which fails `npm
test` on any page whose share set is missing a tag, duplicated, outside the
head, malformed (wrong attribute or empty content), or mismatched against the
page's own metadata or against the committed `og-image.png` bytes. The served
pages are the static files verbatim through the Worker's ASSETS binding
(`src/worker.js`), so the source guard and the served bytes cannot drift
unless the Worker's asset serving itself changes. The measurement does not
claim what any social platform will render from these tags (platform
crawlers are out of scope); it verifies the served HTML carries the complete,
self-consistent set and the image behind it exists, is reachable, and is the
current-offer card.

## Closeout

This closes dogfood finding d87d715be3d0 ("Social share image incomplete on
home") against the deployed site: the code fix, the regenerated image and the
CI source guard were merged as PR #31, `npm run check` and `npm test` pass on
current main, and the live deployment now serves the complete Open Graph +
Twitter Card set — each tag exactly once, in `<head>`, bound to the page's own
metadata, pointing at a reachable 1200x630 current-offer `og-image.png` that
is byte-identical to the committed file — on the home page and on all four
sibling public pages.

One deployment-lag note, for the tracker: the live deployment lags current
main by exactly the two newest public-surface commits — f9f0b0f (footer
attribution link on home) and 1cc7a4e (canonical/JSON-LD URL cleanup on
/audit) — so the live audit page still serves the redirecting
`https://tinystudio.io/audit.html` form as its `og:url` and canonical, which
main already corrected to the clean `https://tinystudio.io/audit` (the guard
expectation updated with it in 1cc7a4e). Neither lagging commit touches a
social share tag on the home page: the page the finding flagged serves
`og:url` `https://tinystudio.io/` on both main and live, and its share set is
the one quoted above. When the pending deployment lands, the audit page's
`og:url` will match the guard automatically; until then the home page — the
finding's scope — is already correct.
