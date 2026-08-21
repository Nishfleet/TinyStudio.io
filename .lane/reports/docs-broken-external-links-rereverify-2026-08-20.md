# Broken external links on /audit.html — re-verify against current main and live (2026-08-20)

Date: 2026-08-20
Scope: dogfood finding 78fcaed682fa, "Broken external links on /audit.html"
(audit run 20260808T074205Z-msk2fl3n, issue-19). This receipt re-verifies the
finding's guarantee against the current `origin/main` head (0540cf9, "Merge
pull request #247") and the live deployment, in the same pattern as the
2026-08-11 closeout (PR #33 fix, aa64d7d) and the 2026-08-12, 2026-08-14 and
2026-08-15 re-verifications.

## Summary

The failure mode the finding describes — `/audit.html` presenting an external
citation link that returns 404 — **does not occur, on source and on the live
site**. The code-side fix has been merged since 2026-08-11 (PR #33, aa64d7d):
the dead bare-slug App Store citation
`https://apps.apple.com/app/tinystudio` was replaced by the id-carrying
`https://apps.apple.com/us/app/tinystudio/id6448954288`, the embedded
AI-search bundle in `public/audit.html` was regenerated, and an offline CI
guard was added in `scripts/check-site.mjs` ("External citation links
(dogfood 78fcaed682fa)" section) that fails the build if any App Store
family source URL lacks an app id or if the embedded bundle drifts from the
fixtures. Re-verified today: the source checks pass, the live page serves
200 at both `/audit` and `/audit.html`, every one of the 15 unique citation
URLs on the live page resolves 200, and the dead bare-slug baseline still
returns 404.

## Source checks on the current head (0540cf9)

1. `npm run check` passes ("TinyStudio.io checks passed."). The 78fcaed682fa
   guard in `scripts/check-site.mjs` still rejects any AI-search source URL
   on the App Store family of hosts (`apps.apple.com`, `itunes.apple.com`)
   that lacks an app id, and still refuses drift between the embedded bundle
   on the audit page and the fixtures — it builds the expected bundle as
   `{ questions: aiQuestions, evidence: aiEvidence }` from
   `evidence-fixtures/ai-search/controlled-questions.json` and
   `evidence-fixtures/ai-search/evidence.json` and requires the embedded
   copy to match byte-for-byte.
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   viewport, narrow-viewport-pages and narrow-viewport suites — all green,
   zero failures.
3. **Embedded bundle = fixtures**: parsed the `#ai-search-evidence` JSON
   script in `public/audit.html` directly; it equals
   `{ questions: <controlled-questions.json>, evidence: <evidence.json> }`
   byte-for-byte. The current fixture carries 16 runs with 16 unique
   citation URLs (from the 2026-08-15 controlled re-run, commit d0daea9).

### Drift check since the last receipt (2026-08-15)

The 2026-08-15 re-verification measured head e35b4bf. Between that head and
this one (0540cf9), the citation surface changed only in ways that leave the
guarantee intact:

- `public/audit.html` and `evidence-fixtures/ai-search/`: no changes since
  the 2026-08-15 controlled re-run (commit d0daea9, the last commit to
  touch either). The embedded bundle and the fixtures are exactly what the
  2026-08-15 receipt measured.
- `scripts/check-site.mjs`: the "External citation links (dogfood
  78fcaed682fa)" guard section is unchanged since the fix.

## Live re-verification 2026-08-20

Measured the deployed site:

1. `GET https://tinystudio.io/audit` → HTTP 200 and
   `GET https://tinystudio.io/audit.html` → HTTP 200 (the address in the
   finding's title; the worker serves the same static file at both
   spellings — `"/audit.html"` is in the Worker's public asset
   allow-list). The page's embedded `#ai-search-evidence` bundle parses and
   carries 15 runs with 15 unique external citation URLs.
2. **Every citation URL on the live page resolves** — all 15 unique source
   URLs probed with redirects followed (browser user-agent, GET):

   | status | URLs |
   |---|---|
   | 200 | all 15 — fiberygoodness.com ×4, apps.apple.com id-carrying form (×2 spellings, with and without `?mt=12`), github.com, tinystudio.co, toolidx.com, tinystudio.ch, tagvenue.com, getspaces.com, instagram.com, studiolaar.nl, tinystudio.tv, tinystudio.io, tinystudiollc.com |

   No 404/410 on any citation.
3. **The App Store citation renders as the id-carrying form**
   (`https://apps.apple.com/us/app/tinystudio/id6448954288`, with `?mt=12`
   on the embedded variant) and both resolve 200 — the shape the finding
   required.
4. **Baselines**:
   - `GET https://apps.apple.com/app/tinystudio` → **404** — the exact dead
     form the finding flagged is still dead, and still absent from both the
     served bundle and the fixture.
   - The only other external URLs on the page are the font preload/script
     links (`fonts.googleapis.com/css2?...` → 200, `fonts.gstatic.com` bare
     preconnect host → no resource requested; expected). The page contains
     no other outbound `href`/`src` targets.

### Note: live bundle lags the current fixture (deployment gap, not a regression)

The live page currently serves the 2026-08-12 evidence set (15 runs, mostly
2026-08-06/08-12 captures), while current `origin/main` carries the
2026-08-15 controlled re-run (16 runs, commit d0daea9, PR #227). The live
bundle is therefore not byte-identical to the committed fixtures at this
moment — the deployment is simply behind the merged evidence commit. This
does not affect the finding's guarantee: every live citation URL resolves
200 (table above), and once the next deployment ships current main the
served bundle will match the fixture again (the source guard enforces the
equality at build time, and the worker serves the static file verbatim).
No dead link exists on either surface.

## Exact verification method (reproduce)

1. Source guard: `npm run check` — the "External citation links (dogfood
   78fcaed682fa)" section fails if any App Store family source URL lacks an
   app id, or if the embedded bundle drifts from the fixtures.
2. Full suite: `npm test` — all suites pass (exit 0).
3. Live probe: fetch `https://tinystudio.io/audit` and
   `https://tinystudio.io/audit.html` (both 200), parse the
   `#ai-search-evidence` JSON script, assert every unique citation URL
   resolves with redirects followed, and probe the dead-slug baseline
   (`https://apps.apple.com/app/tinystudio` → 404).

## Limitation

This is a live-deployment measurement, not a CI gate: the URL probes run
manually, so a future deployment could still regress while CI stays green.
What prevents that regression today is the offline source guard in
`scripts/check-site.mjs` (merged with the fix in PR #33), which fails
`npm test` on any App Store family source URL without an app id and on any
drift between the embedded bundle and the fixture. The guard is deliberately
offline and scoped to the App Store family of hosts; the other third-party
citation hosts are outside it (a foreign page can rot independently of
anything this repo does), which is why this receipt also probes every
citation URL on the live page, and why re-running the method above is the
standing way to re-verify.

## Closeout

The finding as stated — "Broken external links on /audit.html" — is **closed
against current main and live**: the code-side fix (PR #33, aa64d7d) is
merged in `origin/main`, the CI guard in `scripts/check-site.mjs` enforces
the App Store id-carrying form and the bundle-fixture byte equality, `npm
run check` and `npm test` pass on the current head (0540cf9), and the
deployed audit page serves 200 at both `/audit` and `/audit.html` with all
15 live citation URLs resolving 200, as re-measured on 2026-08-20. No code
change was needed; this receipt records the closeout on the current head so
the finding cannot be re-opened by tracker drift.
