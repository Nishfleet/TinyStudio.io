# Heading hierarchy on the six served pages — live-deployment verification

Date: 2026-08-09
Scope: the six served public pages — `index.html` (home) and `audit.html`, `agents.html`, `pricing.html`, `specimen.html`, `brief-requested.html` (dogfood finding e6e153bdadd0, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose heading outline skips
levels: a native document outline that jumps from an `h2` to an `h4`, or an
`h1` to an `h3`, loses the structure that lets a reader — or a search engine —
see which content belongs to which section. The audit run 20260808T074205Z-msk2fl3n
found exactly that fault on this site's own home page (finding e6e153bdadd0,
"Heading hierarchy needs cleanup on home"): before the fix, sections under an
`h2` on `public/index.html` used `h4` sub-headings (the homepage stops, the
identity block and the FAQ), and the same class of skip existed on the sibling
pages — `h1` -> `h3` roster headings on `agents.html`, `h1` -> `h3` findings on
`specimen.html`, `h2` -> `h4` gateboxes on `pricing.html`, and `h1` -> `h3` step
headings on `brief-requested.html` (verified against the parent of the fix
commit 7be3d8f).

The fix (PR #28, "fix(public): heading hierarchy cleanup on home and all six
served pages") retagged the sub-headings one level shallower so the native
outline descends without gaps, retargeted the affected CSS selectors with the
same property values (rendered appearance unchanged), and added a deterministic
regression test (`scripts/test-heading-hierarchy.mjs`, wired into `npm test`
as `test:headings`) that locks the corrected outline of each of the six served
pages and proves the checker rejects the pre-fix shapes.

This receipt closes the remaining gap: the live deployment was never measured
by a closeout lane. The measurement below verifies the deployed pages in real
Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its five sibling served pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). All six pages were visited at
  their final URLs (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`,
  `/brief-requested`), the addresses a browser actually lands on.
- Wait: `domcontentloaded`; every rendered `h1`–`h6` collected from the loaded
  document (headings hidden in comments, scripts or styles never appear in the
  DOM, matching the source-test parser).
- The same structural contract as the regression test was applied to each
  measured outline: exactly one `h1` and it is the first heading; no skipped
  levels when the outline descends (each heading is at most one level deeper
  than the previous one).
- Console errors and page errors captured per page; HTTP status and
  `Content-Security-Policy` presence captured from the served response.

## Results (deployed site, 2026-08-09)

| Page | HTTP | CSP header | heading outline | console errors | page errors | heading issues |
|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | `1-2-2-2-3-3-3-3-2-3-3-3-3-2-3-3-3-3-3-3-2-2-2-3-3-3-3-2` | none | none | none |
| audit.html (`/audit`) | 200 | yes | `1-2-2-3-3-3-3-2-2-2-2` | none | none | none |
| agents.html (`/agents`) | 200 | yes | `1-2-2-2-2-2-2-2-2-2-2-2` | none | none | none |
| pricing.html (`/pricing`) | 200 | yes | `1-2-2-3-3-3-3-2-3-3-3-3-3-2-2` | none | none | none |
| specimen.html (`/specimen`) | 200 | yes | `1-2-2-2-2-3-2` | none | none | none |
| brief-requested.html (`/brief-requested`) | 200 | yes | `1-2-2-2` | one, unrelated (see note) | none | none |

Homepage heading outline served live, in order:

> `h1` "Most of them leave before they ever get in touch." — `h2` "answer
> none of the questions a buyer asks before committing." — `h2` "What the
> appraisal gives you" — `h2` "What we actually look at" (`h3` x4) — `h2` "How
> the work runs" (`h3` x4) — `h2` "This one. tinystudio.io." (`h3` x6) — `h2`
> "One name goes on every audit..." — `h2` "Or have it closed, not merely
> found." — `h2` "Before you ask" (`h3` x4) — `h2` "Why there are no logos on
> this site"

Every page the finding class flagged — the home page first, plus the sibling
pages with the same skip shape — now serves exactly one `h1` as its first
heading and descends without gaps: no `h2` -> `h4`, no `h1` -> `h3`, anywhere.
The served outline of each page matches the locked corrected outline in
`scripts/test-heading-hierarchy.mjs` exactly.

## Note on the brief-requested console error

The only console error across all six pages is on `/brief-requested`:
the CSP blocks a placeholder Google Tag Manager script
(`https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX`) — the CSP's
`script-src` works as intended, and the error is unrelated to heading
hierarchy (no headings are involved). It is recorded here for honesty, not
because it relates to this finding.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const outline = await page.evaluate(() =>
  [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((el) => Number(el.tagName[1]))
);
```

3. Assert: status 200; `outline[0] === 1`; exactly one `1` in `outline`; for
   every adjacent pair `outline[i] <= outline[i - 1] + 1`; no page errors.
4. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`, `/brief-requested`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source test
`scripts/test-heading-hierarchy.mjs` (merged with the fix in PR #28), which
fails `npm test` on any of the six served pages whose heading outline
reintroduces a skip, drops the single `h1`, or moves it from the first
heading position. The served pages are the static files verbatim through the
Worker's ASSETS binding (`src/worker.js`), so the source guard and the served
bytes cannot drift unless the Worker's asset serving itself changes.

## Closeout

This closes dogfood finding e6e153bdadd0 ("Heading hierarchy needs cleanup on
home") against the deployed site: the code fix and the CI source test were
merged as PR #28, `npm run check` and `npm test` pass on current main, and
the live deployment now serves a gap-free heading outline with exactly one
leading `h1` on the home page and on all five sibling served pages.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (1cc7a4e, "fix(public): point
appraisal-page canonicals and JSON-LD @ids at the clean /audit URL (#56)") after
five further commits touched the public surface since the 2026-08-09 closeout —
95d2248 (preferred source pages for AI answers), c5e2f2b (de-index the retired
Agent Desk), ac05bec (mobile tap targets: CSS only), f9f0b0f (footer
attribution link), 1cc7a4e (canonical/JSON-LD URL cleanup on /audit) — none of
which changed a single heading tag in any of the six served pages (verified per
commit: `git show <sha> -- public/` contains zero `<h1>`–`<h6>` line changes),
and none of which was allowed to regress the guarantee. Three checks:

1. Source checks on this head: `npm run test:headings` passes 6/6 — the
   regression test locks the corrected outline of each of the six served
   pages and includes fixtures proving the checker rejects the pre-fix
   shapes (h2->h4 skips, non-leading or repeated `h1`, headings hidden in
   comments) — `npm run check` passes, and the full `npm test` suite passes.

2. Fresh live measurement of the deployed site (2026-08-11, headless Chromium,
   same method as the receipt above): every page returns 200 with the CSP
   header, serves exactly one leading `h1`, descends without skipped levels,
   and logs no page errors. Measured outlines (identical to the 2026-08-09
   measurement and to the locked outlines in `scripts/test-heading-hierarchy.mjs`):

   | Page | heading outline | heading issues |
   |---|---|---|
   | index.html (home, `/`) | `1-2-2-2-3-3-3-3-2-3-3-3-3-2-3-3-3-3-3-3-2-2-2-3-3-3-3-2` | none |
   | audit.html (`/audit`) | `1-2-2-3-3-3-3-2-2-2-2` | none |
   | agents.html (`/agents`) | `1-2-2-2-2-2-2-2-2-2-2-2` | none |
   | pricing.html (`/pricing`) | `1-2-2-3-3-3-3-2-3-3-3-3-3-2-2` | none |
   | specimen.html (`/specimen`) | `1-2-2-2-2-3-2` | none |
   | brief-requested.html (`/brief-requested`) | `1-2-2-2` | none (same unrelated GTM/CSP console note as the 2026-08-09 receipt) |

3. Deployment-lag note (honesty, not a heading issue): the live deployment
   currently lags current main by exactly the two newest commits — f9f0b0f
   (footer attribution link on home) and 1cc7a4e (canonical/JSON-LD URL
   cleanup on /audit). `diff` of the served bytes against main-minus-those-
   commits is empty for both pages; neither commit touches headings. The
   heading-hierarchy fix itself (PR #28) has been live since before the
   2026-08-09 closeout and its outlines remain intact today, so this finding
   is unaffected.

Finding e6e153bdadd0 ("Heading hierarchy needs cleanup on home") remains
closed on the code side (PR #28), in CI (`test:headings`), and against the
deployed site; this lane (2026-08-11) re-confirmed all three against current
main and found nothing further to change.
