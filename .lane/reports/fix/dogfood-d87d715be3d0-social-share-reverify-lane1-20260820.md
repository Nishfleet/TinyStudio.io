# Lane 1 — dogfood d87d715be3d0 re-verification on current main and live (2026-08-20)

Finding: "Social share image incomplete on home" (audit run `20260808T074205Z-msk2fl3n`).

## Verdict

**The fix is intact on the current head and on the live deployment. The
finding has stayed closed across every intervening commit. No code change
was needed in this lane.**

## What this lane checked

The finding was originally resolved by PR #31 (commit `eae1d87`, "seo:
complete the social share image on home"). PR #31 did three things on the
five public pages (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`):

1. Added the complete Open Graph + Twitter Card set — `og:title`,
   `og:description`, `og:type`, `og:url`, `og:image` with
   `og:image:width`/`og:image:height`/`og:image:alt`, and the Twitter Card
   mirror (`twitter:card` `summary_large_image`, `twitter:title`,
   `twitter:description`, `twitter:image`) — every tag exactly once inside
   `<head>`, each value bound to the page's own meta description and
   absolute URL, and `og:image`/`twitter:image` pointing at the absolute
   `https://tinystudio.io/og-image.png`.
2. Regenerated the share image itself (`scripts/generate-og-image.mjs`) so
   the 1200x630 card uses the current site's cream/ink/brass palette, the
   existing `favicon.svg` mark, and copy verbatim from the current home
   page headline and meta description. The generator refuses to write
   unless the Google Fonts load, every element box sits inside the canvas,
   and the pixels contain the cream background, ink text, and brass
   accents.
3. Added the "Social share tags (dogfood d87d715be3d0)" source-string
   guard to `scripts/check-site.mjs`, which fails the build if any page
   loses a tag, duplicates one, moves it out of `<head>`, uses the wrong
   attribute (`og:` → `property=`, `twitter:` → `name=`), empties it, or
   mismatches it — including matching `og:image:width`/`og:image:height`
   against the actual PNG header of `og-image.png`, which the guard reads
   from the committed file.

The finding was verified live in real Chromium on 2026-08-11
(`docs/evidence/social-share-image-2026-08-11.md`, PR #76), its
fingerprint was confirmed dropped by a rerun of the same SEO Fix Kit
engine on 2026-08-12
(`docs/evidence/social-share-image-dogfood-rerun-2026-08-12.md`, PR #122),
the lane-1 closeout on 2026-08-13 re-verified it on head `5209ec7`
(`docs/evidence/social-share-image-lane1-closeout-2026-08-13.md`), and the
most recent scheduled dogfood batch (run `20260816T013000Z-msv4nw6f`,
2026-08-16) reports zero social-share findings on the `tinystudio-io`
scope (home + the four sibling public pages).

The lane-1 queue nevertheless re-issued the item today. This receipt
re-verifies the resolution on the current origin/main head (`d0daea9`,
"evidence(ai-search): controlled entity-and-offer re-run with first Found
transitions", 2026-08-15, #227) and against the live deployment, so the
item can close with a reason and cannot re-open by drift.

## Results

### Source head `d0daea9`: the twelve-tag set is intact on every page

The current head differs from the 2026-08-13 closeout head `5209ec7` by
17 further commits — PR #227 (`d0daea9`), #245 (`dda25f2b`), #156
(`43cc8315`), #154 (`66f7bd60`), #112 (`23a7f06d`), #218 (`ed2b1a9e`),
#194 (`76fe17b1`), #243 (`9f79c717`), #244 (`b4d80f1c`), #242
(`f309dd45`), #241 (`4efeb4db`), #240 (`3dc58567`), #239 (`b4631a3c`),
#238 (`5ca6241a`), #237 (`83a59742`), #236 (`56c4e249`), #235
(`b07ebc80`), #234 (`7d3a8ae0`), #229 (`798cd71a`), #213 (`0e7373fe`).
None of these commits touched the twelve social share tags on the home
page or the committed `og-image.png` (confirmed with `git log --oneline
-- public/index.html public/og-image.png scripts/check-site.mjs` filtered
to those files since `5209ec7`; every result is either a
heading-hierarchy, study-freshness, accessibility-label, footer-brand,
canonical-cleanup, in-content-CTA, redirecting-link-guard, favicon-ico,
noindex-domain-canonical, autocomplete-email, intake-cap,
brief-requested, agent-desk-deindex, or evidence-receipt commit — none
of which alters a share tag or the committed share image).

The committed `public/og-image.png` is byte-identical to the file that
shipped live on 2026-08-11 and was measured live today (see Live section
below):

```
93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df  public/og-image.png
```

`file public/og-image.png` reports a valid 1200x630 non-interlaced 8-bit
RGB PNG, matching the declared `og:image:width`/`og:image:height`
exactly.

`public/index.html` still carries the complete twelve-tag share set in
its `<head>`, each tag exactly once, with the correct attribute per tag,
non-empty content, `og:description` and `twitter:description` equal to
the page's meta description, `og:url` bound to
`https://tinystudio.io/`, and `og:image`/`twitter:image` pointing at
`https://tinystudio.io/og-image.png` with declared dimensions 1200x630:

```html
<meta property="og:title" content="TinyStudio — The Website Appraisal">
<meta property="og:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://tinystudio.io/">
<meta property="og:image" content="https://tinystudio.io/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="TinyStudio — The Website Appraisal">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TinyStudio — The Website Appraisal">
<meta name="twitter:description" content="TinyStudio: the free leak audit of high-ticket service homepages. Each fault named in order of what it costs you, with the fix beside it. Six a month.">
<meta name="twitter:image" content="https://tinystudio.io/og-image.png">
```

The same set sits in the heads of the four sibling public pages, each
bound to its own meta description and its own absolute URL.

### Guard: `npm run check` passes on the current head

```
> tinystudio-io@0.1.0 check
> node scripts/check-site.mjs

TinyStudio.io checks passed.
```

The "Social share tags (dogfood d87d715be3d0)" section of
`scripts/check-site.mjs` (lines 1542–1643) enforces, per page: each of
the twelve tags exactly once, inside `<head>`, with the correct
attribute, non-empty content, `og:description` equal to the page's meta
description, `og:url` equal to the page's own absolute URL, `og:image`
equal to the absolute `og-image.png` URL, and `og:image:width`/
`og:image:height` matched against the committed PNG header. The guard
also refuses a non-PNG or non-1200x630 `og-image.png`.

The full test suite (122 tests across `test-agent-worker`, `test-agent-ui`,
`test-product-contract`, `test-study-freshness`, `test-sitemap`, and
`test-heading-hierarchy`) passes on the current head.

### Live: the deployed site serves the complete set, byte-identical image

Fetched from the live deployment on 2026-08-20:

- `GET https://tinystudio.io/` → HTTP 200, `content-type: text/html`,
  `cf-cache-status: HIT`. The served HTML carries the twelve-tag share
  set byte-identical to the source head (every `og:`/`twitter:` tag
  present once, with the right attribute, non-empty content, and the
  bound meta-description/URL/image that the guard checks).
- `GET https://tinystudio.io/og-image.png` → HTTP 200,
  `content-type: image/png`, 345,042 bytes,
  `cf-cache-status: HIT`. The body is SHA-256
  `93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df` —
  byte-identical to the committed `public/og-image.png`.

### Finding ledger: still `active: false`

`finding-ledger.json` carries this finding (`cc679de4ffdf8285de6a`,
patternKey `d87d715be3d0`) as:

```
active: false
resolvedAt: 2026-08-16T01:30:00.230Z
resolvedRunId: 20260816T013000Z-msv4nw6f
```

The most recent scheduled batch (`20260816T013000Z-msv4nw6f`, 2026-08-16)
reports zero social-share findings on the `tinystudio-io` scope — the
seven residual findings on that domain are unrelated (canonical-URL
redirects on /agents, /pricing, /specimen, owned by finding
`6631c0ab0454`; render-blocking CSS on /audit, /agents, /pricing,
/specimen, owned by finding `b8f6046e942a`). The home page finding
list on that run is empty. The backlog `state: "added"` on the ledger
entry is the stale item this lane was dispatched for; the ledger's own
engine verdict has already moved the finding to `active: false`.

## Conclusion

Nothing further to change. The finding's fix (PR #31) is present on the
current head (`d0daea9`), the CI guard holds it in source, every test in
the suite passes, and the live deployment serves the complete
twelve-tag share set with a reachable 1200x630 current-offer
`og-image.png` that is byte-identical to the committed file. The lane
closes the item with a reason: already fixed and closed (PR #31 + PR #76
+ PR #122), re-verified on 2026-08-13 (head `5209ec7`), re-verified
again here on 2026-08-20 (head `d0daea9`) — no code change required.
