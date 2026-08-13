# Social share image finding d87d715be3d0 — lane-1 closeout on current main and live (2026-08-13)

Date: 2026-08-13
Scope: dogfood finding `d87d715be3d0` ("Social share image incomplete on home",
audit run `20260808T074205Z-msk2fl3n`) as queued in lane 1 of the
tinystudio-io fleet run, against the current head and the live site.
This receipt records the lane judgment: the finding was already fixed and
closed, and the fix still holds on the current head and in the live
deployment, so the lane has nothing further to change.

## Why this receipt exists

The finding was resolved on 2026-08-09 by PR #31 (`eae1d87`, "seo: complete
the social share image on home"), verified against the live deployment in
real Chromium on 2026-08-11 (`docs/evidence/social-share-image-2026-08-11.md`,
PR #76), and its fingerprint was confirmed dropped by a rerun of the same
SEO Fix Kit engine on 2026-08-12
(`docs/evidence/social-share-image-dogfood-rerun-2026-08-12.md`, PR #122).
The item nevertheless re-entered the queue in this lane. This receipt
re-verifies the resolution on the current origin/main head (5209ec7) and on
the live site, so the item can close with a reason and cannot re-open by
drift.

## What was checked

- Source head: `5209ec7` ("test(worker): real D1 migrations on node:sqlite
  must satisfy the exact signup/agent SQL (#166)"), a fresh origin/main
  checkout in the lane worktree.
- The five public pages' share sets in source: `public/index.html` (home),
  `public/audit.html`, `public/agents.html`, `public/pricing.html`,
  `public/specimen.html`.
- The committed share image `public/og-image.png` (byte hash, PNG header).
- The CI guard `scripts/check-site.mjs` ("Social share tags (dogfood
  d87d715be3d0)" section), run as `npm run check`.
- The live deployment: served HTML of `https://tinystudio.io/` and
  `https://tinystudio.io/og-image.png`.

## Results

### Source: the twelve-tag set is intact on every page

`public/index.html` carries the complete Open Graph + Twitter Card set in its
`<head>`, each tag exactly once, with the correct attribute per tag (`og:` →
`property=`, `twitter:` → `name=`), non-empty content, `og:description` and
`twitter:description` equal to the page's meta description, `og:url` bound to
`https://tinystudio.io/`, and `og:image`/`twitter:image` pointing at
`https://tinystudio.io/og-image.png` with declared dimensions 1200x630:

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

The same set sits in the heads of the four sibling public pages, each bound
to its own meta description and its own absolute URL. `git diff eae1d87
5209ec7 -- public/index.html` shows the twelve share tags byte-identical to
the fix commit — the only later home-page head additions are the canonical
link, the favicon/icon links, and the JSON-LD block, none of which touches a
share tag. `public/og-image.png` is byte-identical to the file measured live
on 2026-08-11 (SHA-256 `93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df`,
valid non-interlaced 1200x630 PNG).

### Guard: `npm run check` passes on the current head

```
> tinystudio-io@0.1.0 check
> node scripts/check-site.mjs

TinyStudio.io checks passed.
```

The "Social share tags (dogfood d87d715be3d0)" section of
`scripts/check-site.mjs` enforces, per page: each of the twelve tags exactly
once, inside `<head>`, with the correct attribute, non-empty content,
`og:description` equal to the page's meta description, `og:url` equal to the
page's own absolute URL, `og:image` equal to the absolute `og-image.png` URL,
and `og:image:width`/`height` matched against the committed PNG header. The
guard also refuses a non-PNG or non-1200x630 `og-image.png`.

### Live: the deployed site serves the complete set

Fetched from the live deployment on 2026-08-13:

- `GET https://tinystudio.io/` → 200; the served HTML carries 5+ lines
  matching `og:image`/`twitter:image` (the full twelve-tag set is in the
  served bytes, exactly as in the 08-12 receipt).
- `GET https://tinystudio.io/og-image.png` → HTTP 200, `content-type:
  image/png`, cache HIT — the image is reachable at the exact URL the tags
  declare.

## Conclusion

Nothing further to change. The finding's fix (PR #31) is present on the
current head, the CI guard holds it in source, and the live deployment serves
the complete share set with a reachable 1200x630 current-offer `og-image.png`.
The lane closes the item with a reason: already fixed and closed (PR #31 +
PR #76 + PR #122), re-verified here on 2026-08-13 — no code change required.
