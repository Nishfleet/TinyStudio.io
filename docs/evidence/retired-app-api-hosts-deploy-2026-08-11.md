# Retired app/api hosts name The Website Appraisal — live-deployment verification

Date: 2026-08-11
Scope: the tracker item "Ship origin/main past 872fd23 so merged PR #100
(retired app/api hosts name The Website Appraisal, not the Agent Desk) and #99
go live" (scout 2026-08-11 04:14 UTC, risk: amber, `[unreviewed-by-grok]`). At
scout time `release-state-tinystudio-io.json` pinned the last ship to `872fd23`
(2026-08-11T08:38:22 IST, PR #72) while origin/main carried the merged but
undeployed PR #100 (`5ab84ea`, "fix(worker): retired app/api hosts name The
Website Appraisal, not the Agent Desk") and #99 (`e6f42c1`), and the live
`app.tinystudio.io` / `api.tinystudio.io` retirement messages still claimed the
main domain runs the self-serve Agent Desk. This receipt records the
live-deployment verification of that item's acceptance criteria against the
current origin/main head and the deployed site. It is behavior evidence, not a
source check, and it does not claim anything about ranking, traffic, or search
results.

## What was measured

The scout finding recorded a two-merge deploy lag: the release pipeline pinned
the last ship to `872fd23` (PR #72) while origin/main carried the merged but
undeployed PR #100 (`5ab84ea`, "fix(worker): point the retired app/api hosts at
The Website Appraisal, not the Agent Desk") and #99 (`e6f42c1`, retired
Agent-Desk repository product-contract closeout). The live retirement hosts
still served the stale Agent Desk framing: `app.tinystudio.io` returned the
self-serve Agent Desk sentence and `api.tinystudio.io` returned it as JSON,
while the merged source (`src/worker.js`) already carried the canonical Website
Appraisal truth.

The item's acceptance criteria (from the backlog entry):

- fleet-release (or equivalent `wrangler deploy`) ships `origin/main` ≥ `5ab84ea`;
- live `app.tinystudio.io` / `api.tinystudio.io` retirement messages match source:
  they name The Website Appraisal (free leak audit of high-ticket service
  homepages) and never point at the retired Agent Desk;
- `release-state-tinystudio-io.json` sha advances past `872fd23`;
- `npm run check` / `npm test` on the shipped revision.

## Environment

- Live targets: `https://app.tinystudio.io/` (retired app host) and
  `https://api.tinystudio.io/` (retired API host), served by the deployed
  Cloudflare Worker's retirement handlers in `src/worker.js`.
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `e7f0b47` (PR #104, ship-verify receipt),
  fetched fresh via `git fetch origin`; live bytes were fetched over HTTPS and
  compared string-for-string against `src/worker.js` on that head.

## Results (2026-08-11)

### Release state is past the stuck SHA and past the fix

`release-state-tinystudio-io.json` pins:

```json
{ "sha": "e6f42c146209d6d895aa6ac13d900286bea0b3f0", "marker": null, "at": "2026-08-11T10:49:53" }
```

`e6f42c1` (PR #99, the last merge before the ship) is strictly newer than the
stuck `872fd23`, and `git merge-base --is-ancestor 5ab84ea e6f42c1` confirms
PR #100's fix commit is inside the deployed release. `git log 872fd23..e6f42c1`
shows exactly the two merges the item named: `5ab84ea` (#100) and `e6f42c1`
(#99).

### Live retirement hosts name the current offer, matching source

- `GET https://app.tinystudio.io/` → **HTTP 410**; the served HTML carries
  exactly one "The Website Appraisal" and exactly one "free leak audit of
  high-ticket service homepages", and **zero** "Agent Desk" / "self-serve Agent
  Desk" occurrences.
- `GET https://api.tinystudio.io/` → **HTTP 410**; the served JSON carries the
  same truth (`ok:false, status:"retired"`) with exactly one "The Website
  Appraisal" and one "free leak audit of high-ticket service homepages", and
  **zero** "Agent Desk" occurrences.
- The live sentences are byte-identical to `src/worker.js` on origin/main
  `e7f0b47` (line 1269 for the app host, line 1291 for the API host):

  - app live: `The old TinyStudio app has been retired. TinyStudio.io now runs
    The Website Appraisal — the free leak audit of high-ticket service
    homepages, reviewed by a person — and the human-reviewed desk that closes
    what the audit finds.`
  - api live: `The old TinyStudio API has been retired. TinyStudio.io now runs
    The Website Appraisal — the free leak audit of high-ticket service
    homepages — and the human-reviewed desk that closes what the audit finds.`

  (String equality checked by extracting the served sentence and the source
  string and comparing; both matched exactly.)

### Deployment-lag picture

`git diff e6f42c1..e7f0b47 --stat` shows the only commits between the deployed
release and origin/main HEAD are `1e78ecf` (#106, "fix(ci): point check-site
copy guards at the current homepage, not the retired /agent-desk" —
`scripts/check-site.mjs`, CI-guard-only, changes no served bytes) and `e7f0b47`
(#104, a docs receipt). `git diff e6f42c1..e7f0b47 -- src/worker.js public/` is
empty: the worker code carrying PR #100 is deployed, and nothing in this item's
scope (or any served surface) is waiting on the pipeline.

## Source checks on the current head

1. `npm run check` passes: "TinyStudio.io checks passed." (site guards: meta
   descriptions, canonical URLs, structured data, internal links, sitemap).
2. `npm test` passes on `e7f0b47`: check + heading-hierarchy (6), sitemap (7),
   agent-worker (55), agent-UI (16) and product-contract (8) — 92 tests, 0
   failures, exit code 0. The two regression tests PR #100 added pass on this
   head ("retired app host frames the current offer as The Website Appraisal,
   not the Agent Desk", "retired API host frames the current offer as The
   Website Appraisal, not the Agent Desk"), asserting the 410 responses name
   the current offer and never point at the Agent Desk.

## Exact verification method (reproduce)

1. Read `release-state-tinystudio-io.json` and confirm the `sha` is newer than
   `872fd23` and includes `5ab84ea`
   (`git merge-base --is-ancestor 5ab84ea <sha>`).
2. Fetch `https://app.tinystudio.io/` and `https://api.tinystudio.io/`; assert
   HTTP 410, at least one "The Website Appraisal" and one "free leak audit of
   high-ticket service homepages", and zero "Agent Desk" / "self-serve Agent
   Desk" occurrences in each body.
3. Compare the served sentences string-for-string with `src/worker.js` on
   origin/main (`retiredAppResponse` and `retiredApiResponse`).
4. Run `npm run check` and `npm test` on origin/main.

## Limitation

This is a live-deployment measurement plus a release-state read, not a CI gate.
The regression tests merged in PR #100 (run in step 4) are what prevent the
stale Agent Desk framing from silently returning in the source; the live
retirement responses are generated by the deployed worker code, so this
measurement is the standing way to re-confirm the live state. The re-check
above can be repeated any time.

## Closeout

The tracker item "Ship origin/main past 872fd23 so merged PR #100 (retired
app/api hosts name The Website Appraisal, not the Agent Desk) and #99 go live"
is closed: the release state pins `e6f42c1`, strictly past `872fd23` and
containing PR #100 (`5ab84ea`) and #99; the live `app.tinystudio.io` and
`api.tinystudio.io` retirement messages name The Website Appraisal matching
source byte-for-byte and never point at the retired Agent Desk; `npm run check`
and `npm test` pass on the current origin/main head (`e7f0b47`, 92 tests, 0
failures); and the only commits between the deployed release and main are a
CI-guard-only fix and a docs receipt — nothing this item covers is waiting on
the pipeline.
