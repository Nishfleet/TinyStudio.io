# External citation links on /audit resolve — live-deployment verification

Date: 2026-08-11
Scope: the audit page (`public/audit.html`, served at `/audit`) and the AI-search evidence it embeds (dogfood finding 78fcaed682fa, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The audit run 20260808T074205Z-msk2fl3n found a broken external link on this
site's own audit page (finding 78fcaed682fa, "Broken external links on
/audit.html", tracked as issue-19): the AI-search evidence embedded in
`public/audit.html` cited `https://apps.apple.com/app/tinystudio` — a bare
App Store slug — and that URL returned 404. App Store family hosts resolve
only the id-carrying forms (`/app/<numeric-id>` or
`/<region>/app/<slug>/id<digits>`); the bare-slug form is structurally dead.

The fix (PR #33, "fix(public): repair broken App Store citation on /audit",
commit aa64d7d) did three things. First, it corrected the citation in the
evidence fixture (`evidence-fixtures/ai-search/evidence.json`, the
q1-what-tinystudio-does/google run) from the dead slug form to the
id-carrying `https://apps.apple.com/us/app/tinystudio/id6448954288`. Second,
it regenerated the embedded bundle in `public/audit.html` so the served page
carried the same corrected URL. Third, it added an offline source guard
(`scripts/check-site.mjs`, "External citation links (dogfood 78fcaed682fa)"
section) that fails the build if any AI-search source URL on the App Store
family of hosts (`apps.apple.com`, `itunes.apple.com`) lacks an app id — the
dead form cannot silently return, and CI never depends on the network.

This receipt closes the remaining gap: the live deployment was never
measured. The measurement below verifies the deployed page in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/audit`, served by the deployed
  Cloudflare Worker (ASSETS binding, which serves the static files verbatim;
  see `src/worker.js`), visited at the address a browser actually lands on.
  The `.html` form the finding's title names 307-redirects to this URL — see
  the baseline section below.
- Wait: `domcontentloaded`, then the rendered evidence table; every rendered
  `a[href]` with an http(s) href collected from the loaded document. The
  audit page renders each cited source as a link only for validated absolute
  http(s) URLs (`audit.js`, `safeUrl`), so the rendered links are exactly the
  external citations the page presents.
- Each external link was then probed with redirects followed — the request a
  browser click would make.
- Console errors and page errors captured per load; HTTP status,
  `Content-Security-Policy` presence and final URL captured from the served
  response.

## Results (deployed site, 2026-08-11)

- `GET https://tinystudio.io/audit` → HTTP 200 with the CSP header, final URL
  `https://tinystudio.io/audit`, no console errors, no page errors.
- 15 external anchor links rendered on the page (the evidence table mounts
  every cited source as a link; the same page is cited by more than one run,
  which is why the count is higher than the unique-URL count of 11). Every
  one resolved HTTP 200:

| # | link | status |
|---|---|---|
| 1 | https://www.fiberygoodness.com/whatistinystudio | 200 |
| 2 | https://apps.apple.com/us/app/tinystudio/id6448954288 | 200 |
| 3 | https://tinystudio.ch/ | 200 |
| 4 | https://www.fiberygoodness.com/ | 200 |
| 5 | https://www.tagvenue.com/ | 200 |
| 6 | https://www.getspaces.com/ | 200 |
| 7 | https://www.instagram.com/t.i.n.y.studio/ | 200 |
| 8 | https://www.tagvenue.com/ | 200 |
| 9 | https://www.studiolaar.nl/projects/tiny-studios | 200 |
| 10 | https://www.tinystudio.tv/ | 200 |
| 11 | https://www.fiberygoodness.com/ | 200 |
| 12 | https://www.tinystudiollc.com/ | 200 |
| 13 | https://tinystudio.ai/about-tinystudio/ | 200 |
| 14 | https://tinystudio.ai/ | 200 |
| 15 | https://www.fiberygoodness.com/ | 200 |

- The App Store citation renders as the id-carrying form
  `https://apps.apple.com/us/app/tinystudio/id6448954288` and resolves 200 —
  the shape the finding required.
- The embedded bundle on the served page was parsed back out and checked with
  the same predicate the source guard applies: it carries exactly one App
  Store URL, the id-carrying form.
- Baseline, the exact shape the finding flagged: `GET
  https://apps.apple.com/app/tinystudio` → **404**. It is still dead, and it
  is now absent from the page.
- The `.html` address in the finding's title: `GET
  https://tinystudio.io/audit.html` → **307** with `Location: /audit`; a
  Chromium navigation to it lands on `https://tinystudio.io/audit` (request
  chain 307 → 200). The page the finding names is the same page measured
  above, at its final URL.

## Source checks on the current head

Re-verified against the current origin/main head (8b42e0a, "docs(evidence):
close out apple touch icon finding 98a7bf8e08fc against current main and live
(#77)") after ten further commits touched the public surface since the fix
landed (aa64d7d, PR #33) — canonical URLs, internal links, sitemap,
preferred-source pages, Agent Desk de-index, tap targets, footer link, audit
canonical/JSON-LD URL cleanup, social share image, apple touch icon — none of
which was allowed to regress the guarantee:

1. `npm run check` passes: the "External citation links (dogfood
   78fcaed682fa)" guard finds no dead App Store form among the AI-search
   sources, the embedded bundle still matches the fixture byte-for-byte (the
   guard refuses drift between the two), and every other site check (meta
   descriptions, canonical URLs, structured data, internal links, social
   share tags, sitemap) passes too.
2. `npm test` passes: the source checks above plus the heading-hierarchy
   (6/6), sitemap (7/7), agent-worker (53/53), agent-UI (16/16) and
   product-contract (8/8) suites — all green.
3. The guard's predicates, applied directly to both forms: the pre-fix bare
   slug `/app/tinystudio` is rejected (it carries no app id), the fixed form
   `/us/app/tinystudio/id6448954288` is accepted.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. Launch a headless Chromium context with console/page error capture, then
   load the deployed page and collect every rendered external anchor:

```js
const response = await page.goto("https://tinystudio.io/audit", { waitUntil: "domcontentloaded" });
await page.waitForSelector("[data-ai-search-evidence] .row");
const links = await page.evaluate(() =>
  [...document.querySelectorAll("a[href]")]
    .map((a) => a.getAttribute("href"))
    .filter((h) => /^https?:/i.test(h))
    .filter((h) => new URL(h).hostname.replace(/^www\./, "") !== "tinystudio.io"));
```

3. Probe every collected link with redirects followed and assert status 200:

```js
for (const href of links) {
  const pr = await context.request.get(href, { timeout: 30000 });
  // assert pr.status() === 200
}
```

4. Parse the served page's `#ai-search-evidence` bundle; assert every source
   URL on `apps.apple.com` / `itunes.apple.com` matches
   `/^\/app\/\d+/` or `/\/id\d+/` (the guard's predicate).
5. Baseline: probe `https://apps.apple.com/app/tinystudio` and observe 404;
   probe `https://tinystudio.io/audit.html` with `maxRedirects: 0` and
   observe 307 + `Location: /audit`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the offline source guard in
`scripts/check-site.mjs` (merged with the fix in PR #33), which fails `npm
test` on any App Store family source URL without an app id, and on any drift
between the embedded bundle and the fixture. The served page is the static
file verbatim through the Worker's ASSETS binding, so the source guard and
the served bytes cannot drift unless the Worker's asset serving itself
changes. The guard is deliberately offline and scoped to the App Store family
of hosts; the other third-party citation hosts are outside it (a foreign page
can rot independently of anything this repo does), which is why this receipt
also probes every rendered external link on the live page, and why re-running
the method above is the standing way to re-verify.

## Closeout

This closes dogfood finding 78fcaed682fa ("Broken external links on
/audit.html") against the deployed site: the code fix and the offline CI
guard were merged as PR #33, `npm run check` and `npm test` pass on current
main, and the live audit page — at `/audit`, the final URL of the
`.html` address the finding names — now renders every external citation link
resolving 200. The App Store citation is served at the id-carrying form the
finding requires, the dead bare-slug form is absent from both the served
bundle and the fixture, and there is no deployment lag: the live page already
serves the corrected bundle.

### Re-verification (added 2026-08-12, lane 1)

Re-verified against the current origin/main head (18128e8, "fix(public):
serve rel=icon on /brief-requested and guard favicon links in check-site.mjs
(#113)") after seven further commits touched the public surface since the
closeout measurement at 8b42e0a: 0ad7481 (home-page footer tap target),
6f85c61 (tablet-width intake form), 1e78ecf (CI copy-guard target page),
2ae7504 (search-intent bridge for "conversion audit"), d4a2c30 (appraisal
intake field labels and document titles), 9302611 (rel=icon favicon on every
page), 18128e8 (rel=icon on /brief-requested and the favicon guard). None
touched an AI-search evidence citation or the citation guard:
`git log -p 8b42e0a..origin/main -- public/audit.html evidence-fixtures/ai-search/`
is empty, and the "External citation links (dogfood 78fcaed682fa)" guard in
`scripts/check-site.mjs` is byte-identical to the one the closeout measured.
Three checks:

1. Source checks on this head: `npm run check` passes ("TinyStudio.io checks
   passed") — the guard still refuses any AI-search source URL on the App
   Store family of hosts (`apps.apple.com`, `itunes.apple.com`) that lacks an
   app id, and still refuses drift between the embedded bundle on the audit
   page and the fixture — and the full `npm test` suite passes (check,
   headings 6/6, sitemap, worker, ui, contract; 92 subtests, 0 failures).

2. Fresh live measurement of the deployed site (2026-08-12, headless
   Chromium, same method as the closeout receipt above: `domcontentloaded`
   wait, then the rendered evidence table, every rendered `a[href]` with an
   http(s) href collected, console/page errors captured): `GET
   https://tinystudio.io/audit` → HTTP 200 with the CSP header, no console
   errors, no page errors, and all 15 rendered external anchor links resolved
   HTTP 200 with redirects followed (the same 12 unique URLs as the closeout:
   fiberygoodness.com ×3, tagvenue.com ×2, apps.apple.com id-carrying form,
   tinystudio.ch, getspaces.com, instagram.com, studiolaar.nl, tinystudio.tv,
   tinystudiollc.com, tinystudio.ai ×2):

   | # | link | status |
   |---|---|---|
   | 1 | https://www.fiberygoodness.com/whatistinystudio | 200 |
   | 2 | https://apps.apple.com/us/app/tinystudio/id6448954288 | 200 |
   | 3 | https://tinystudio.ch/ | 200 |
   | 4 | https://www.fiberygoodness.com/ | 200 |
   | 5 | https://www.tagvenue.com/ | 200 |
   | 6 | https://www.getspaces.com/ | 200 |
   | 7 | https://www.instagram.com/t.i.n.y.studio/ | 200 |
   | 8 | https://www.tagvenue.com/ | 200 |
   | 9 | https://www.studiolaar.nl/projects/tiny-studios | 200 |
   | 10 | https://www.tinystudio.tv/ | 200 |
   | 11 | https://www.fiberygoodness.com/ | 200 |
   | 12 | https://www.tinystudiollc.com/ | 200 |
   | 13 | https://tinystudio.ai/about-tinystudio/ | 200 |
   | 14 | https://tinystudio.ai/ | 200 |
   | 15 | https://www.fiberygoodness.com/ | 200 |

3. Baseline, the exact shape the finding flagged: `GET
   https://apps.apple.com/app/tinystudio` → **404** again today — still dead,
   and still absent from both the served page and the fixture. The `.html`
   address in the finding's title: `GET https://tinystudio.io/audit.html` →
   **307** with `Location: /audit`; a Chromium navigation to it lands on
   `https://tinystudio.io/audit` (request chain 307 → 200).

Finding 78fcaed682fa ("Broken external links on /audit.html") remains closed
on the code side (PR #33), in CI (`npm run check` guard), and against the
deployed site; this lane (2026-08-12) re-confirmed all three against current
main and live and found nothing further to change on the finding's page.
