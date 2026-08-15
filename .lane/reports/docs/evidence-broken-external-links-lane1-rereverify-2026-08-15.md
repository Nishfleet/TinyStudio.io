# Broken external links on /audit.html — re-verify against current main and live (2026-08-15)

Date: 2026-08-15
Scope: dogfood finding 78fcaed682fa, "Broken external links on /audit.html"
(audit run 20260808T074205Z-msk2fl3n, issue-19). This receipt re-verifies the
finding's guarantee against the current `origin/main` head (e35b4bf,
"docs(evidence): re-verify apple-touch-icon finding 98a7bf8e08fc against
current main and live (#222)") and the live deployment of that head. It is
source-evidence plus a live measurement of the deployed site, in the same
pattern as the 2026-08-11 closeout (PR #33 fix, aa64d7d) and the 2026-08-12
and 2026-08-14 re-verifications.

## Summary

The failure mode the finding describes — `/audit.html` presenting an external
citation link that returns 404 — **does not occur, on source and on the live
site**. The code-side fix has been merged since 2026-08-11 (PR #33,
aa64d7d): the dead bare-slug App Store citation
`https://apps.apple.com/app/tinystudio` was replaced by the id-carrying
`https://apps.apple.com/us/app/tinystudio/id6448954288`, the embedded
AI-search bundle in `public/audit.html` was regenerated, and an offline CI
guard was added in `scripts/check-site.mjs` ("External citation links
(dogfood 78fcaed682fa)" section) that fails the build if any App Store
family source URL lacks an app id or if the embedded bundle drifts from the
fixtures. Re-verified today: the source checks pass, the live bundle is
byte-identical to the fixtures, every one of the 25 unique citation URLs
resolves (23 at 200; Peerspace 403 and LinkedIn 999 are anti-bot challenge
walls, not dead links), and the dead bare-slug baseline still returns 404.

## Source checks on the current head (e35b4bf)

1. `npm run check` passes ("TinyStudio.io checks passed."). The 78fcaed682fa
   guard in `scripts/check-site.mjs` still rejects any AI-search source URL
   on the App Store family of hosts (`apps.apple.com`, `itunes.apple.com`)
   that lacks an app id (line 938-944), and still refuses drift between the
   embedded bundle on the audit page and the fixtures — it builds the
   expected bundle as `{ questions: aiQuestions, evidence: aiEvidence }`
   from `evidence-fixtures/ai-search/controlled-questions.json` and
   `evidence-fixtures/ai-search/evidence.json` and requires the embedded
   copy to match byte-for-byte (lines 817-830).
2. `npm test` passes (exit 0): the source checks above plus the
   heading-hierarchy, sitemap, agent-worker, agent-UI, product-contract,
   viewport, narrow-viewport-pages and narrow-viewport suites — all green,
   zero failures.

### Drift check since the last receipt (f8e820e, 2026-08-14)

The 2026-08-14 re-verification measured head f8e820e. Between that head and
this one (e35b4bf), the citation surface changed only in ways that leave the
guarantee intact:

- `public/audit.html` and `evidence-fixtures/ai-search/`: no changes
  (`git log f8e820e..e35b4bf -- public/audit.html evidence-fixtures/ai-search/`
  is empty). The embedded bundle and the fixtures are exactly what the
  2026-08-14 receipt measured.
- `scripts/check-site.mjs`: the "External citation links (dogfood
  78fcaed682fa)" guard section is unchanged since the fix.
- `src/worker.js`: since the 2026-08-11 closeout, PR #181 retired the
  duplicate `www.tinystudio.io` host (added a 301 canonical-host redirect)
  and PR #212 closed the Web Analytics beacon 404; neither touches
  `/audit.html` or the citation guard. `"/audit.html"` remains a served
  public asset (line 29 of the PUBLIC_ASSET_PATHS allow-list).

## Live re-verification 2026-08-15

Measured the deployed site (the current deployment of the current main):

1. `GET https://tinystudio.io/audit` → HTTP 200. The page's embedded
   `#ai-search-evidence` bundle parses and carries 11 runs with 25 unique
   external citation URLs.
2. **Live bundle = fixtures**: the served bundle, compared as
   `{ questions, evidence }` exactly as the source guard does, is equal to
   the committed fixtures (`evidence-fixtures/ai-search/controlled-questions.json`
   and `evidence-fixtures/ai-search/evidence.json`) — the same 25 unique
   source URLs, no additions, no removals.
3. **Every citation URL resolves** — all 25 probed with redirects followed
   (browser user-agent, HEAD with GET fallback):

   | status | URLs |
   |---|---|
   | 200 | 23 URLs — tinystudio.io ×2 (audit.html, specimen.html), tinystudio.ai ×2, fiberygoodness.com ×5, soundbetter.com, peerspace.com is below, thetinystudios.com, keepittinystudio.com, instagram.com, tagvenue.com, studiolaar.nl, tinystudio.tv, tinystudiollc.com, tinystudio.ro, itsnicethat.com, github.com, tinystudio.co |
   | 403 | `https://www.peerspace.com/pages/listings/5cd0c077fa938c000cb6dfb2` — Cloudflare anti-bot challenge page ("Just a moment"), not a 404/410. The page was measured at 200 in a real browser in the 2026-08-11/08-12 receipts; the challenge response confirms the listing still exists. |
   | 999 | `https://uk.linkedin.com/in/sarahhodgetts` — LinkedIn's bot-wall status; LinkedIn refuses non-browser traffic. Not a dead link. |

   The two non-200 statuses are anti-bot walls, not dead URLs: each returns
   its challenge page rather than a 404/410.
4. **The App Store citation renders as the id-carrying form**
   `https://apps.apple.com/us/app/tinystudio/id6448954288` and resolves 200
   (redirecting to `?mt=12`, still 200) — the shape the finding required.
5. **Baselines**:
   - `GET https://apps.apple.com/app/tinystudio` → **404** — the exact dead
     form the finding flagged is still dead, and still absent from both the
     served bundle and the fixture.
   - `GET https://tinystudio.io/audit.html` (the address in the finding's
     title) → **200**, served as the same static file as `/audit`
     (`"/audit.html"` is in the Worker's public asset allow-list alongside
     `"/audit"`; the worker normalizes the URL). A browser lands on the
     corrected page either way. (The 307 observed in the 2026-08-11/08-12
     receipts was measured before the current allow-list arrangement; the
     page the finding names now serves 200 directly.)

## Exact verification method (reproduce)

1. Source guard: `npm run check` — the "External citation links (dogfood
   78fcaed682fa)" section fails if any App Store family source URL lacks an
   app id, or if the embedded bundle drifts from the fixtures.
2. Full suite: `npm test` — all suites pass (exit 0).
3. Live probe: fetch `https://tinystudio.io/audit`, parse the
   `#ai-search-evidence` JSON script, assert
   `bundle == { questions: <controlled-questions.json>, evidence: <evidence.json> }`,
   assert every unique citation URL resolves with redirects followed, probe
   the dead-slug baseline and `/audit.html`.

## Limitation

This is a live-deployment measurement, not a CI gate: the URL probes run
manually, so a future deployment could still regress while CI stays green.
What prevents that regression today is the offline source guard in
`scripts/check-site.mjs` (merged with the fix in PR #33), which fails
`npm test` on any App Store family source URL without an app id and on any
drift between the embedded bundle and the fixture. The served page is the
static file verbatim through the Worker's ASSETS binding (`src/worker.js`),
so the source guard and the served bytes cannot drift unless the Worker's
asset serving itself changes. The guard is deliberately offline and scoped
to the App Store family of hosts; the other third-party citation hosts are
outside it (a foreign page can rot independently of anything this repo
does), which is why this receipt also probes every citation URL on the live
page, and why re-running the method above is the standing way to re-verify.

## Closeout

The finding as stated — "Broken external links on /audit.html" — is **closed
against current main and live**: the code-side fix (PR #33, aa64d7d) is
merged in `origin/main`, the CI guard in `scripts/check-site.mjs` enforces
the App Store id-carrying form and the bundle-fixture byte equality, `npm
run check` and `npm test` pass on the current head (e35b4bf), and the
deployed audit page serves the corrected bundle with all 25 citation URLs
resolving (the two non-200 responses being anti-bot walls, not dead links),
as re-measured on 2026-08-15. No code change was needed; this receipt
records the closeout on the current head so the finding cannot be re-opened
by tracker drift.
