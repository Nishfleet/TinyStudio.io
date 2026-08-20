# Lane report — tinystudio-io lane 1 (docs/evidence-apple-touch-icon-rereverify-2026-08-20)

## The one item

- [ ] [dogfood 98a7bf8e08fc] Apple touch icon missing on home [dogfood 20260808T074205Z-msk2fl3n] [authorized-by-nish 20...

## Outcome

Done, with a real fix rather than another re-verification receipt.

The finding itself was already fixed and stayed fixed: on `origin/main`
`743cdb7` and on live, the home page and all six sibling pages each serve
exactly one `<link rel="apple-touch-icon" href="/apple-touch-icon.png" />`,
and the served icon is byte-identical to the committed 180x180 PNG.

The guard that was supposed to keep it fixed had a blind spot, and this
branch closes it. `scripts/check-site.mjs` checked a hardcoded list of seven
pages, so any public HTML page added later could ship with no
apple-touch-icon link and CI would stay green — this site's own audit finding,
re-created on a new page, undetected. Proved it by dropping an un-iconed
`public/__probe-newpage.html` and watching `node scripts/check-site.mjs` print
"checks passed" (exit 0). The guard now reads its page list from
`public/*.html` on disk, so every served page is guarded by default, and
asserts each known served page still exists so a rename cannot shrink the set.

## Evidence

`docs/evidence/apple-touch-icon-reverify-2026-08-20.md` — source checks, the
blind-spot demonstration before and after, guard behaviour table, live
measurement, reproduction commands, limitations.

## Files changed

- `scripts/check-site.mjs` — apple-touch-icon guard derives its page list from
  `public/*.html` instead of a hardcoded seven; added a missing-known-page
  check; added `readdirSync` to the `node:fs` import. Per-page assertions
  unchanged.
- `docs/evidence/apple-touch-icon-reverify-2026-08-20.md` — new receipt.
- `.lane/reports/docs/evidence-apple-touch-icon-rereverify-2026-08-20.md` —
  this report (lane-unique path; no shared report file touched).

## Verification

`npm` is not installed on this runner, so each `npm test` step ran directly
with `node` v22.23.1. All ten steps pass: `check-site`, heading-hierarchy,
sitemap, agent-worker, agent-UI, product-contract, study-freshness,
first-viewport-audience, narrow-viewport-pages, narrow-viewport.

Negative tests on the hardened guard: un-iconed new page → fails naming the
file; new page pointing at `/wrong.png` → fails naming the wrong href; known
page renamed away → fails (at an earlier read of the same file, ENOENT, exit
1; the new existence check is the backstop). Tree restored and green after
each; no probe files are part of this branch.

## Left undone, deliberately

The `faviconPages` guard directly below in the same file has the identical
hardcoded blind spot. It belongs to the separate favicon finding, so it is
recorded in the receipt for that lane rather than changed here.
