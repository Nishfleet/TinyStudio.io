# PR #33 App Store citation on /audit — ship verification past fa8d83c

Date: 2026-08-12
Scope: the tracker item "Ship origin/main past fa8d83c so merged PR #33 App
Store citation goes live — /audit still embeds the 404 Apple URL" (scout
2026-08-09, risk: amber, `[unreviewed-by-grok]`). At scout time
`release-state-tinystudio-io.json` pinned the last ship to `fa8d83c`
(2026-08-09T12:37:49 IST, PR #32) while origin/main carried the merged but
undeployed PR #33 (`aa64d7d`, "fix(public): repair broken App Store citation
on /audit"), and live `/audit` still embedded the dead bare-slug citation
`https://apps.apple.com/app/tinystudio` (HTTP 404). This receipt records the
live-deployment verification of that item's acceptance criteria against the
current origin/main head and the deployed site. It is behavior evidence, not
a source check, and it does not claim anything about ranking, traffic, or
search results.

## What was measured

The scout finding recorded a one-merge deploy lag: the release pipeline pinned
the last ship to `fa8d83c` (PR #32, structured data) while origin/main
carried the merged but undeployed PR #33 (`aa64d7d`), which replaces the
broken App Store citation in the `/audit` evidence embed and in
`evidence-fixtures/ai-search/evidence.json` with the id-carrying live form
`https://apps.apple.com/us/app/tinystudio/id6448954288`, and adds an offline
CI guard in `scripts/check-site.mjs` that rejects any App Store family
citation URL without an app id. At scout time the live `/audit` page still
embedded the 404 bare-slug form.

The item's acceptance criteria (from the backlog entry):

- fleet-release (or equivalent `wrangler deploy`) ships `origin/main` ≥ `aa64d7d`;
- live `/audit` embedded App Store citation matches source
  (`.../us/app/tinystudio/id6448954288`) and resolves 200;
- `release-state-tinystudio-io.json` sha advances past `fa8d83c`;
- `npm run check` on the shipped revision.

## Environment

- Live target: `https://tinystudio.io/audit`, served by the deployed
  Cloudflare Worker's ASSETS binding (`src/worker.js` serves the static
  `public/*.html` files verbatim).
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `18128e8` (PR #113, "serve rel=icon on
  /brief-requested and guard favicon links in check-site.mjs"), fetched fresh
  via `git fetch origin`; live bytes were fetched over HTTPS and compared
  against `public/audit.html` on that head.

## Results (2026-08-12)

1. Main is 55 commits past fa8d83c, and PR #33 is in that history:
   `git rev-list --count fa8d83c..origin/main` = 55, and
   `git merge-base --is-ancestor aa64d7d origin/main` confirms PR #33's fix
   commit (`aa64d7d` "fix(public): repair broken App Store citation on /audit
   (dogfood 78fcaed682fa) (#33)") is an ancestor of the origin/main head
   `18128e8`.

2. Release state is past fa8d83c and contains the fix:
   `release-state-tinystudio-io.json` pins
   `sha 18128e87c4c52ea79703a46fd1f84a508937c71b` (2026-08-12T00:38:42) —
   byte-identical to the current origin/main head, strictly newer than
   `fa8d83c`, and `git merge-base --is-ancestor aa64d7d 18128e87...` confirms
   PR #33's fix commit is inside the deployed release.

3. Live `/audit` embeds exactly the fixed citation, matching source
   (fresh curl, 2026-08-12):

   | Check | Result |
   |---|---|
   | Citation URL(s) embedded in live `https://tinystudio.io/audit` | `https://apps.apple.com/us/app/tinystudio/id6448954288` only |
   | Citation URL(s) in `origin/main:public/audit.html` (`18128e8`) | `https://apps.apple.com/us/app/tinystudio/id6448954288` only |
   | HEAD of the fixed id-carrying URL (`-L`) | HTTP 200 (Apple's regional 301 redirect followed to the `?mt=12` form) |
   | HEAD of the dead bare-slug baseline `https://apps.apple.com/app/tinystudio` (`-L`) | HTTP 404 (unchanged baseline) |

   The live `/audit` page and the source `public/audit.html` on the origin/main
   head each embed exactly one App Store citation, and they are the same
   string — the id-carrying form that resolves 200 — while the bare-slug form
   the scout flagged still returns 404.

4. Source and CI on the shipped revision: `npm run check` passes
   ("TinyStudio.io checks passed.") on a clean checkout of origin/main
   `18128e8`, the full `npm test` suite passes (headings 6/6, sitemap 7/7,
   worker 55, ui 16, contract 8 — 92 tests, 0 failures), and GitHub Actions
   CI reports `success` on the origin/main head `18128e8`.

## Closeout

The item's acceptance is met against the current origin/main head and the
deployed site: origin/main is 55 commits past fa8d83c with PR #33 (`aa64d7d`)
in that history, release state pins the current main head (which contains the
fix), live `/audit` embeds the id-carrying App Store citation identical to
source and that URL resolves 200 while the dead bare-slug baseline still
returns 404, and `npm run check` / `npm test` pass on the shipped revision.
This is the same conclusion the earlier closeout
`docs/evidence/app-store-citation-deploy-2026-08-11.md` (PR #94) reached; this
receipt re-confirms it fresh against the current head and live site
(2026-08-12). Nothing further on this item remains to ship.

## Limitation

This is a live-deployment measurement, not a CI gate: the curl check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the offline source guard merged
in PR #33 (`scripts/check-site.mjs`, "External citation links (dogfood
78fcaed682fa)" section), which fails `npm test` on any App Store family
citation URL that lacks an app id, plus the fleet-release pipeline that keeps
the deployed Worker current with origin/main.
