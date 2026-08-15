# Lane report: tinystudio-io lane 1 — social share image on home (re-verification)

Item: `[dogfood d87d715be3d0] Social share image incomplete on home [dogfood 20260808T074205Z-msk2fl3n]`

## Verdict

Already fixed and closed. The finding's fix (PR #31, commit `eae1d87`) is
present on the current origin/main head `9944fec` and the live deployment
serves the complete twelve-tag share set with a reachable 1200x630
`og-image.png`. Re-verified fresh on 2026-08-15 — no code change required.

## Why this lane exists

The item re-entered the queue after prior closeouts (2026-08-11 PR #76,
2026-08-12 PR #122, 2026-08-13 PR #168, 2026-08-14 PR #175). The prior
closeouts verified heads up to `afb5d49`; this lane re-verifies against the
newer current head `9944fec` (fresh origin/main checkout) and the live
deployment, so the item can close with a reason and cannot re-open by drift.

## What was checked

### Source head (9944fec)

- `git merge-base --is-ancestor eae1d87 HEAD` confirms the fix commit
  `eae1d87` ("seo: complete the social share image on home (dogfood
  d87d715be3d0) (#31)") is in history.
- `git diff eae1d87 HEAD -- public/index.html` filtered to `og:`/`twitter:`
  lines shows zero changes: the twelve share tags are byte-identical to the
  fix commit. The only later head additions to the page head are canonical,
  favicon/icon, and JSON-LD lines that do not touch a share tag.
- `public/index.html` `<head>` carries the full twelve-tag Open Graph +
  Twitter Card set, each exactly once, with correct attributes, non-empty
  content, `og:description`/`twitter:description` equal to the page's meta
  description, `og:url` bound to `https://tinystudio.io/`, and
  `og:image`/`twitter:image` bound to `https://tinystudio.io/og-image.png`
  with declared dimensions 1200x630.
- `public/og-image.png` is a valid non-interlaced 1200x630 PNG, SHA-256
  `93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df` —
  byte-identical to the file measured on 2026-08-11 through 2026-08-14.
- CI guard green on current head:

  ```
  > tinystudio-io@0.1.0 check
  > node scripts/check-site.mjs
  TinyStudio.io checks passed.
  ```

  The "Social share tags (dogfood d87d715be3d0)" section of
  `scripts/check-site.mjs` enforces per page: each of the twelve tags exactly
  once, inside `<head>`, correct attribute, non-empty content,
  `og:description` equal to the page's meta description, `og:url` equal to
  the page's own absolute URL, `og:image` equal to the absolute `og-image.png`
  URL, and `og:image:width`/`height` matched against the committed PNG
  header; it also refuses a non-PNG or non-1200x630 `og-image.png`.

### Live deployment (2026-08-15)

- `GET https://tinystudio.io/` → 200; served HTML carries the complete
  twelve-tag share set in `<head>` (12 `og:`/`twitter:` lines, 5+ matching
  `og:image`/`twitter:image`), `og:url` `https://tinystudio.io/`.
- `GET https://tinystudio.io/og-image.png` → HTTP 200, `content-type:
  image/png`, 345,042 bytes; downloaded bytes SHA-256
  `93109e72af34c2476f2ddd5a7104352e30c13536677e8c6aa7f80be96b3b08df` —
  identical to the committed file.

## Delivery

No source change was needed. This lane's deliverable is this re-verification
receipt, committed on branch
`docs/evidence-social-share-lane1-rereverify-2026-08-15` and opened as a PR
against main, closing the item with a reason.
