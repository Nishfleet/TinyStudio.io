# App Store citation on /audit is live — deploy-lag closeout

Date: 2026-08-11
Scope: the tracker item "Ship origin/main past fa8d83c so merged PR #33 App
Store citation goes live — /audit still embeds the 404 Apple URL" (scout
2026-08-09, risk: amber). This receipt records the live-deployment
verification of that item's acceptance criteria against the current origin/main
head and the deployed site. It is behavior evidence, not a source check, and it
does not claim anything about ranking, traffic, or search results.

## What was measured

The scout finding recorded a one-merge deploy lag: `release-state-tinystudio-io.json`
pinned the last ship to `fa8d83c` (2026-08-09T12:37:49, PR #32) while origin/main
carried the merged but undeployed PR #33 (`aa64d7d`, "fix(public): repair broken
App Store citation on /audit"). The live `/audit` page still embedded the dead
bare-slug citation `https://apps.apple.com/app/tinystudio` (HTTP 404) while the
source carried the id-carrying form `https://apps.apple.com/us/app/tinystudio/id6448954288`
(HTTP 200).

The item's acceptance criteria (from the backlog entry):

- fleet-release (or equivalent `wrangler deploy`) ships `origin/main` ≥ `aa64d7d`;
- live `/audit` embedded App Store citation matches source
  (`.../us/app/tinystudio/id6448954288`) and resolves 200;
- `release-state-tinystudio-io.json` sha advances past `fa8d83c`;
- `npm run check` on the shipped revision.

## Environment

- Live target: `https://tinystudio.io/audit`, served by the deployed Cloudflare
  Worker (ASSETS binding; see `src/worker.js`).
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `dc95ebf` (PR #89, duplicate heading-hierarchy
  re-verify), fetched fresh via `git fetch origin`; the pages were fetched over
  HTTPS and compared against `public/audit.html` on that head.

## Results (2026-08-11)

### Release state is past the stuck SHA and past the fix

`release-state-tinystudio-io.json` pins:

```json
{ "sha": "354e725a612865196d2f40731c1840c269ea521a", "marker": null, "at": "2026-08-11T03:38:32" }
```

`354e725` (PR #78, structured-data re-verify) is strictly newer than `fa8d83c`,
and `git merge-base --is-ancestor aa64d7d 354e725` confirms PR #33's fix commit
is inside the deployed release. The pipeline has kept shipping since the
2026-08-09 acceptance annotations (release advanced `fa8d83c` → `a163327` →
`26bcfac` → ... → `354e725`).

### Live /audit embeds the fixed citation, source matches

- `GET https://tinystudio.io/audit` → HTTP 200; the embedded
  `#ai-search-evidence` bundle carries exactly one App Store URL, the
  id-carrying form `https://apps.apple.com/us/app/tinystudio/id6448954288`
  (1 occurrence, 0 bare-slug occurrences).
- `public/audit.html` on origin/main `dc95ebf` carries the same id-carrying form
  (1 occurrence, 0 bare-slug occurrences) — live matches source.
- The fixed URL resolves: `curl -sL` of
  `https://apps.apple.com/us/app/tinystudio/id6448954288` → **200** (final URL
  `https://apps.apple.com/us/app/tinystudio/id6448954288?mt=12`; the 301 before
  redirects is App Store's regional/storefront redirect, not a dead link).
- Baseline, the exact shape the finding flagged: `GET
  https://apps.apple.com/app/tinystudio` → **404** still, and it is absent from
  both the live page and the source.

### Deployment-lag picture

`git diff 354e725..dc95ebf -- public/ src/ scripts/` is empty: the five commits
between the deployed release and origin/main HEAD are all `docs(evidence)` /
`docs(service)` receipts, so zero product-code changes are waiting on the
pipeline for this item's scope (or any public surface).

## Source checks on the current head

1. `npm run check` passes: "TinyStudio.io checks passed." — including the
   "External citation links (dogfood 78fcaed682fa)" guard, which fails the build
   if any AI-search source URL on the App Store family of hosts
   (`apps.apple.com`, `itunes.apple.com`) lacks an app id, and refuses drift
   between the embedded bundle and the fixture.
2. `npm test` passes on `dc95ebf`: check + heading-hierarchy (6), sitemap (7),
   agent-worker (53), agent-UI (16) and product-contract (8) — 90 tests, 0
   failures.

## Exact verification method (reproduce)

1. Read `release-state-tinystudio-io.json` and confirm the `sha` is newer than
   `fa8d83c` and includes `aa64d7d`
   (`git merge-base --is-ancestor aa64d7d <sha>`).
2. Fetch `https://tinystudio.io/audit` and count occurrences of
   `apps.apple.com/us/app/tinystudio/id6448954288` (must be ≥ 1) and of the bare
   slug `apps.apple.com/app/tinystudio` (must be 0).
3. `curl -sL` the id-carrying URL and assert HTTP 200; `curl -s` the bare slug
   and observe 404 (baseline).
4. Run `npm run check` and `npm test` on origin/main.

## Limitation

This is a live-deployment measurement plus a release-state read, not a CI gate.
The offline source guard merged in PR #33 (checked in step 4) is what prevents
the dead form from silently returning in the source; the live page is the static
file verbatim through the Worker's ASSETS binding, so the source guard and the
served bytes cannot drift unless the Worker's asset serving itself changes. The
re-verification method above is the standing way to re-confirm the live state.

## Closeout

The tracker item "Ship origin/main past fa8d83c so merged PR #33 App Store
citation goes live" is closed: the release state pins `354e725`, strictly past
`fa8d83c` and containing PR #33 (`aa64d7d`); the live `/audit` page embeds the
id-carrying App Store citation matching source, and that URL resolves 200 while
the dead bare-slug baseline still returns 404; `npm run check` and `npm test`
pass on the current origin/main head (`dc95ebf`); and there is no deployment
lag in this item's scope — the only commits between the deployed release and
main are docs receipts. The dogfood finding 78fcaed682fa (broken external links)
is already closed separately in `docs/evidence/broken-external-links-2026-08-11.md`;
this receipt closes the deploy-lag item so it cannot re-open by drift.
