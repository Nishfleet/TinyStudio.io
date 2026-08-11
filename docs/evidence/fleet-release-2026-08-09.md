# Fleet release past the stuck release-state SHA — live-deployment verification

Date: 2026-08-09
Scope: the fleet release pipeline for tinystudio.io (scout finding, "Ship
origin/main past the stuck fleet-release SHA" — merged PRs #28 (heading
hierarchy) and #30 (apple-touch-icon) were on main but not live).
This receipt records a live measurement of the deployed site plus the release
state. It is behavior evidence, not a source check, and it does not claim
anything about ranking, traffic, or search results.

## What was measured

The fleet's hourly release pipeline (fleet-release) pins the last successful
deploy in `release-state-tinystudio-io.json` and refuses to ship a main SHA
whose required checks are not green. At scout time the release state was stuck
at `eae1d87c` (PR #31, og-image) while origin/main carried two merged but
undeployed fixes: PR #28 (`7be3d8f`, heading hierarchy cleanup on home and all
six served pages) and PR #30 (`b004c11`, apple touch icon on the five public
pages). The live homepage still served 14× `<h4>` (source had 0) and zero
`apple-touch-icon` link tags.

This receipt verifies, against current main and live, the acceptance criteria
of that finding: the release state has advanced past `eae1d87c`, the live
homepage no longer has heading-level skips, and every appraisal page serves a
working `rel=apple-touch-icon`.

## Environment

- Live target: `https://tinystudio.io/` and the five appraisal pages, served
  by the deployed Cloudflare Worker (ASSETS binding; see `src/worker.js`).
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `ac05bec` (PR #48, mobile tap targets),
  fetched fresh; the pages were fetched over HTTPS and compared against
  `public/*.html` on that head.

## Results (deployed site, 2026-08-09)

### Release state advanced past the stuck SHA

`release-state-tinystudio-io.json` now pins:

```json
{ "sha": "c5e2f2b88322e09f22114bd96d590d414c86ce03", "at": "2026-08-09T19:38:21" }
```

`c5e2f2b` (PR #46) is strictly newer than the stuck `eae1d87c` and includes
every merge from #28 through #46 — the two PRs the finding named are live.

### Live homepage heading hierarchy

Fetched `https://tinystudio.io/` and counted rendered heading tags:

| heading | count |
|---|---|
| h1 | 1 |
| h2 | 9 |
| h3 | 18 |
| h4+ | 0 |

No heading-level skip (no `h2`→`h4`) remains on the live homepage; the
outline descends `1-2-3` matching `public/index.html` on origin/main. The
sibling appraisal pages also serve skip-free outlines (`/audit` 1-2-3,
`/pricing` 1-2-3, `/agents` 1-2, `/specimen` 1-2-3), consistent with the
regression suite in `scripts/test-heading-hierarchy.mjs`.

### apple-touch-icon on every appraisal page

Each of the five public pages serves `<link rel="apple-touch-icon"
href="/apple-touch-icon.png">` in its head, and the icon itself resolves:

```
$ curl -s -o /dev/null -w '%{http_code} %{content_type}\n' https://tinystudio.io/apple-touch-icon.png
200 image/png
```

Pages verified: `/` (home), `/audit`, `/pricing`, `/agents`, `/specimen` —
all five carry the link and the asset returns HTTP 200.

## Source checks on the current head

1. `npm run check` passes: "TinyStudio.io checks passed." (site guards: meta
   descriptions, canonical URLs, structured data, internal links, sitemap).
2. `npm test` passes: the source checks plus the heading-hierarchy, sitemap,
   agent-worker and agent-UI suites — all green, exit code 0.
3. The heading-hierarchy regression suite (`scripts/test-heading-hierarchy.mjs`)
   locks the corrected outline of each of the six served pages and proves the
   checker rejects the pre-fix shapes; the sitemap suite
   (`scripts/test-sitemap.mjs`) locks the clean-URL loc set.

## Exact verification method (reproduce)

1. Read `release-state-tinystudio-io.json` and confirm the `sha` is newer than
   `eae1d87c` (any merge ≥ `b004c11` satisfies the finding).
2. Fetch each of `/`, `/audit`, `/pricing`, `/agents`, `/specimen` and assert
   each head contains `<link rel="apple-touch-icon" href="/apple-touch-icon.png">`
   and that `https://tinystudio.io/apple-touch-icon.png` returns 200.
3. Fetch `/` and count heading tags: exactly one `h1`, no `h4`/`h5`/`h6`, and
   no level skips in the descending outline.
4. Run `npm run check` and `npm test` on origin/main.

## Limitation

This is a live-deployment measurement plus a release-state read, not a CI
gate. At measurement time origin/main HEAD is `ac05bec` (PR #48, mobile tap
targets) while the release state pins `c5e2f2b` — one merge ahead on main that
the hourly pipeline has not yet shipped because its required checks on
`ac05bec` are failing to start (GitHub Actions job startup is blocked
account-wide: "recent account payments have failed or your spending limit
needs to be increased"; the same block is visible on the other fleet repos).
That gap belongs to the mobile-tap-targets finding, not to this one: every
merge the fleet-release finding named (PRs #28 and #30) is deployed and
live-verified here. Nothing in this item requires a bypass of the release
gate; the pipeline will ship `ac05bec` once its checks can start and go green.

## Closeout

Nothing further to change for this item: the two merged PRs the finding named
(PR #28 heading hierarchy, PR #30 apple-touch-icon) are both present in the
deployed release (`release-state-tinystudio-io.json` sha `c5e2f2b`, past the
stuck `eae1d87c`), the live homepage shows zero heading-level skips matching
source, all five appraisal pages serve `rel=apple-touch-icon` resolving HTTP
200, and `npm run check` / `npm test` pass on the current origin/main head.
The receipt now records the closeout on the current head so the finding cannot
be re-opened by tracker drift.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (`c934538`, "docs(evidence):
re-verify meta-description finding 18dd05c10709 against current main and live
(#73)"). The release pipeline has kept advancing since the 2026-08-09
closeout, so the finding's named scope is re-confirmed today rather than
re-filed. Three checks, using the receipt's own exact verification method:

1. Release state still strictly past the stuck SHA:
   `release-state-tinystudio-io.json` pins
   `354e725a612865196d2f40731c1840c269ea521a` at `2026-08-11T03:38:32`
   (PR #78, structured-data re-verify) — newer than `eae1d87c` by every
   merge from #28 through #78, and the pipeline's own state file was
   updated this morning, so the release is actively shipping rather than
   stalled. The two PRs the finding named (#28 `7be3d8f`, #30 `b004c11`)
   are long since included in the deployed release.

2. Live pages match source (fetched over HTTPS 2026-08-11, parsed heading
   tags and head links):

   - All six served pages serve exactly one leading `h1`, zero
     `h4`/`h5`/`h6`, and gap-free descending outlines, identical to the
     outlines locked in `scripts/test-heading-hierarchy.mjs` (home
     `1-2-2-2-3-3-3-3-2-3-3-3-3-2-3-3-3-3-3-3-2-2-2-3-3-3-3-2`, `/audit`
     `1-2-2-3-3-3-3-2-2-2-2`, `/pricing` `1-2-2-3-3-3-3-2-3-3-3-3-3-2-2`,
     `/agents` `1-2-2-2-2-2-2-2-2-2-2-2`, `/specimen` `1-2-2-2-2-3-2`,
     `/brief-requested` `1-2-2-2`).
   - Each of the five appraisal pages serves
     `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` in its
     head (`/`, `/audit`, `/pricing`, `/agents`, `/specimen`), and
     `https://tinystudio.io/apple-touch-icon.png` returns `200 image/png`.
     `/brief-requested` carries the link in neither source nor live — it is
     outside PR #30's five-page scope, so there is no parity gap.

3. Source checks on this head: `npm run check` passes ("TinyStudio.io
   checks passed.") and the full `npm test` passes (check + heading-
   hierarchy, sitemap, agent-worker, agent-UI and product-contract suites;
   90 tests, 0 failures) on `c934538`.

Deployment-lag note (honesty, not a finding regression): the deployed
release (`354e725`) currently lags origin/main HEAD by exactly the three
newest commits — `d70bea0`, `ee50e17`, `c934538` (all `docs(evidence)`
re-verify receipts). `git diff 354e725..origin/main -- public/ src/ scripts/`
is empty: zero product-code changes are pending, so nothing this finding
covers (or any public surface) is waiting on the pipeline.

Finding "Ship origin/main past the stuck fleet-release SHA — merged PRs #28
(heading hierarchy) and #30 (apple-touch-icon)" remains closed: the release
state is past the stuck `eae1d87c`, the named PRs are deployed, live heading
outlines and apple-touch icons match source, and `npm run check` / `npm test`
pass on the current origin/main head. This lane (2026-08-11) re-confirmed all
three and found nothing further to change.
