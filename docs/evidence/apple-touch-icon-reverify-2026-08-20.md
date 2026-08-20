# Apple touch icon on home — re-verify against current main and live, and close the guard's blind spot

Date: 2026-08-20
Scope: the dogfood finding "Apple touch icon missing on home" (finding
98a7bf8e08fc, audit 20260808T074205Z-msk2fl3n). This receipt re-verifies the
finding's guarantee against the current `origin/main` head (`743cdb7`, "Merge
pull request #246 from nish3451/docs/evidence-product-contract-round1-harvest-2026-08-20")
and the live deployment, and records a real gap found in the guard that was
supposed to keep the finding closed — plus the fix for it.

## Summary

The failure mode the finding describes — a served page carrying no
`<link rel="apple-touch-icon">`, leaving iOS Safari to derive a home-screen
icon from a screenshot — **does not occur on source or on the live site
today**. The home page and all six sibling pages each serve exactly one
correct link, and the icon behind it is a reachable, valid 180x180 PNG
byte-identical to the committed file (measured 2026-08-20, below).

What this receipt adds beyond the 2026-08-11/14/15/17 receipts is that the
guard protecting the fix had a blind spot. `scripts/check-site.mjs` checked a
**hardcoded list of seven pages**. Any public HTML page added after that list
was written was unguarded: it could ship with no apple-touch-icon link and CI
would stay green. That is this site's own audit finding, re-created on a new
page, undetected. Verified by experiment, then fixed in this branch: the guard
now derives its page list from `public/*.html` on disk, so every served HTML
page is covered by default.

## The gap, demonstrated (2026-08-20, on `743cdb7` before the fix)

Dropped a new served-shaped page into `public/` with no apple-touch-icon link
and ran the guard:

```
$ cat > public/__probe-newpage.html <<'HTML'
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Probe</title></head>
<body><h1>Probe</h1></body></html>
HTML
$ node scripts/check-site.mjs
TinyStudio.io checks passed.          # exit 0 — un-iconed page, CI green
```

The un-iconed page passed because `iconPages` in `scripts/check-site.mjs`
enumerated seven filenames by hand. The probe file was deleted immediately and
is not part of this branch.

## The fix (commit `ed40c8b`)

`scripts/check-site.mjs`, "Apple touch icon (dogfood)" section:

- The page list is now read off disk — `readdirSync(public/)` filtered to
  `.html`, sorted — instead of being hardcoded, so a page added tomorrow is
  guarded the moment it exists. Pages with a known filename keep their
  human-readable label (`homepage`, `audit page`, …); an unrecognised new page
  is reported by its path (`public/<file>.html`).
- A rename or deletion cannot silently shrink the guarded set: each known
  served page is asserted to still exist, and its absence is a failure with a
  named message.
- The per-page assertions themselves are unchanged: exactly one
  `<link rel="apple-touch-icon">` inside `<head>`, `href` exactly
  `/apple-touch-icon.png`, the asset a git-tracked valid PNG, and
  `/apple-touch-icon.png` still in the Worker's public asset allow-list.

### Guard behaviour after the fix

| Case | Guard result |
|---|---|
| Clean tree (all seven pages correct) | passes, exit 0 |
| New `public/*.html` with no icon link | **fails**: `Apple touch icon link must appear exactly once in the head of public/__probe-newpage.html (found 0).` exit 1 |
| New `public/*.html` pointing elsewhere | **fails**: `Apple touch icon on public/__probe-newpage.html must point at /apple-touch-icon.png (found "/wrong.png").` exit 1 |
| Known served page renamed away | **fails**, exit 1 (see note) |

Note on the rename case: with `public/specimen.html` moved aside, the run
fails at an earlier `read("public/specimen.html")` in the script (ENOENT,
exit 1) before reaching the new existence check. The build fails loudly either
way; the explicit check is the backstop that keeps the apple-touch-icon
guarantee named if that earlier read ever becomes conditional.

## Source checks on the current head (`743cdb7` + `ed40c8b`)

`npm` is not installed on this runner, so each `npm test` step was run
directly with `node` (Node v22.23.1), which is what the npm scripts invoke:

| Step (`package.json` script) | Command | Result |
|---|---|---|
| `check` | `node scripts/check-site.mjs` | PASS (exit 0) |
| `test:headings` | `node --test scripts/test-heading-hierarchy.mjs` | PASS |
| `test:sitemap` | `node --test scripts/test-sitemap.mjs` | PASS |
| `test:worker` | `node --test scripts/test-agent-worker.mjs` | PASS |
| `test:ui` | `node --test scripts/test-agent-ui.mjs` | PASS |
| `test:contract` | `node --test scripts/test-product-contract.mjs` | PASS |
| `test:study` | `node --test scripts/test-study-freshness.mjs` | PASS |
| `test:viewport` | `node --test scripts/test-first-viewport-audience.mjs` | PASS |
| `test:narrow-pages` | `node scripts/test-narrow-viewport-pages.mjs` | PASS (exit 0) |
| `test:narrow` | `node scripts/test-narrow-viewport.mjs` | PASS (exit 0) |

The committed asset is a 180x180, 8-bit truecolour, non-interlaced PNG of
2,232 bytes (read from the PNG IHDR chunk).

## Live re-verification 2026-08-20

Measured against the deployed site at `https://tinystudio.io`:

| Check | Result |
|---|---|
| `GET /` | 200, `text/html`, 18,543 bytes |
| `rel="apple-touch-icon" href="/apple-touch-icon.png"` in `/` | present, exactly once |
| Same link on all seven served pages | `/`, `/audit`, `/pricing`, `/agents`, `/specimen`, `/brief-requested`, `/agent-desk` — each 1 |
| `GET /apple-touch-icon.png` | 200, `content-type: image/png`, 2,232 bytes |
| Served icon SHA-256 | `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645` |
| Committed icon SHA-256 | `5c7dfa48b0287f2a6cf01775132d536427f7bcfa8e36caee561e1ddf2546d645` |

The served icon is byte-identical to the committed file, and matches the
2026-08-17 measurement — no drift.

## Exact verification method (reproduce)

1. Source guard: `node scripts/check-site.mjs` (i.e. `npm run check`).
2. Full suite: the ten commands in the table above (i.e. `npm test`).
3. Blind-spot proof: create `public/__probe-newpage.html` with no
   apple-touch-icon link, run the guard, delete the probe. Before `ed40c8b`
   it passed; after `ed40c8b` it fails naming the file.
4. Live probe:
   `for p in / /audit /pricing /agents /specimen /brief-requested /agent-desk; do curl -s "https://tinystudio.io$p" | grep -c 'rel="apple-touch-icon" href="/apple-touch-icon.png"'; done`
   → `1` seven times;
   `curl -s -o /tmp/live-icon.png -w '%{http_code} %{content_type} %{size_download}' https://tinystudio.io/apple-touch-icon.png`
   → `200 image/png 2232`; `sha256sum /tmp/live-icon.png public/apple-touch-icon.png` → identical.

## Limitation

The live probe is a manual measurement, not a CI gate: a future deployment
could regress while CI stays green. What prevents that in source is the
now-self-maintaining guard in `scripts/check-site.mjs`. The served pages are
the static files verbatim through the Worker's ASSETS binding (`src/worker.js`),
so source and served bytes cannot drift unless the Worker's asset serving
itself changes. This receipt does not claim what iOS Safari renders on a
specific device — caches and platform rendering are out of scope; it verifies
the served HTML carries the link and the icon behind it is reachable and valid.

Known adjacent gap, deliberately out of scope: the favicon guard immediately
below in the same file still uses a hardcoded `faviconPages` list and has the
identical blind spot. It belongs to the separate favicon finding, so it is
recorded here for that lane rather than changed by this one.

## Closeout

The finding as stated — "Apple touch icon missing on home" — is **closed
against current main and live**: the code-side fix (PRs #30 and #123) is
merged, `origin/main` at `743cdb7` plus this branch passes the full suite, and
the deployed site serves exactly one `/apple-touch-icon.png` link in the head
of the home page and all six siblings, backed by an allow-listed, git-tracked,
valid 180x180 PNG byte-identical to the committed file, as measured on
2026-08-20. Beyond re-confirming it, this branch removes the way the finding
could have quietly re-opened on a new page: the guard now covers every served
HTML page rather than a hardcoded seven.
