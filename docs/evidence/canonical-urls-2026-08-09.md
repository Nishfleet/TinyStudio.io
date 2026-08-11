# Canonical URLs on the five public pages — live-deployment verification

Date: 2026-08-09
Scope: the five public tinystudio.io pages — `index.html` (home) and the heads of `audit.html`, `agents.html`, `pricing.html`, `specimen.html` (dogfood finding 6631c0ab0454, audit 20260808T074205Z-msk2fl3n).
This receipt records a real-browser measurement of the deployed site. It is behavior evidence, not a source check, and it does not claim anything about ranking, traffic, or search results.

## What was measured

The leak audit this site sells flags a homepage whose served HTML carries no
canonical URL, leaving search engines to guess which address is the page —
canonical duplication, trailing slashes, `.html` vs extensionless twins, and
tracking parameters all feed the same guessing problem. The audit run
20260808T074205Z-msk2fl3n found exactly that fault on this site's own home page
(finding 6631c0ab0454, "Missing canonical URL on home"): before the fix,
`public/index.html` — and every other public page — served zero
`<link rel="canonical">` tags (verified against the parent of the fix commit
a163327).

The fix (PR #29, "seo: add canonical URLs to the five public pages") added
exactly one canonical link to each of the five public pages, placed it inside
`<head>`, and pointed it at the absolute `https://tinystudio.io` address the
page is served under (the `.html` form; the worker also serves extensionless
twins, and the `.html` forms 307-redirect to them — so the canonical is the
single unambiguous address for the page). It also added a source-string CI
guard (`scripts/check-site.mjs`, "Canonical URLs (dogfood)" section) that
fails the build if any page drifts: more than one link, a link outside
`<head>`, a commented-out link, an empty `href`, a wrong address, or a URL
duplicated across pages.

This receipt closes the remaining gap: the live deployment was never measured.
The measurement below verifies the deployed pages in real Chromium.

## Environment

- Node v22, Playwright 1.62.1, Chromium headless (ms-playwright cache).
- Live target: `https://tinystudio.io/` and its four sibling public pages,
  served by the deployed Cloudflare Worker (ASSETS binding, which serves the
  static files verbatim; see `src/worker.js`). The `.html` forms were visited
  through their final URLs (`/audit`, `/agents`, `/pricing`, `/specimen`), the
  addresses a browser actually lands on.
- Wait: `domcontentloaded`; canonical links read from `document.head` (a link
  placed outside `<head>` would not count) and from the full document (a
  duplicated link anywhere would count against the "exactly once" guarantee).
- Console errors and page errors captured per page; HTTP status and
  `Content-Security-Policy` presence captured from the served response.

## Results (deployed site, 2026-08-09)

| Page | HTTP | CSP header | canonical links in head | links in full doc | href | console errors |
|---|---|---|---|---|---|---|
| index.html (home, `/`) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
| audit.html (`/audit`) | 200 | yes | 1 | 1 | `https://tinystudio.io/audit.html` | none |
| agents.html (`/agents`) | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
| pricing.html (`/pricing`) | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
| specimen.html (`/specimen`) | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |

Homepage canonical served live:

> `<link rel="canonical" href="https://tinystudio.io/">`

All five canonical links are distinct, each sits inside the served `<head>`,
and each points at the canonical `https://tinystudio.io` address of the page
(the `.html` form, matching the CI guard's expectation for the five public
pages). The page the finding flagged — the home page — now serves exactly one
canonical link in its head, pointing at `https://tinystudio.io/`.

## Exact verification method (reproduce)

1. Requires `playwright` + Chromium (same dependency the CI render-blocking
   step installs).
2. For each page, launch a headless Chromium context, capture console/page
   errors, then:

```js
const response = await page.goto(url, { waitUntil: "domcontentloaded" });
const csp = await response.headerValue("content-security-policy");
const result = await page.evaluate(() => ({
  inHeadCount: document.head.querySelectorAll("link[rel='canonical']").length,
  inDocCount: document.querySelectorAll("link[rel='canonical']").length,
  href: document.head.querySelector("link[rel='canonical']")?.getAttribute("href") ?? null,
}));
```

3. Assert: status 200, `inHeadCount === 1`, `inDocCount === 1`, a non-empty
   `href`, no console or page errors, and the `href` is unique across the five
   pages.
4. Run against `https://tinystudio.io/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`.

## Limitation

This is a live-deployment measurement, not a CI gate: the browser check above
runs manually, so a future deployment could still regress while CI stays
green. What prevents that regression today is the source-string guard in
`scripts/check-site.mjs` (merged with the fix in PR #29), which fails `npm
test` on any page whose canonical link is missing, duplicated, commented out,
outside the head, empty, wrong-address, or duplicated across pages. The served
pages are the static files verbatim through the Worker's ASSETS binding
(`src/worker.js`), so the source guard and the served bytes cannot drift unless
the Worker's asset serving itself changes.

## Closeout

This closes dogfood finding 6631c0ab0454 ("Missing canonical URL on home")
against the deployed site: the code fix and the CI source guard were merged as
PR #29, and the live deployment now serves exactly one valid, non-empty,
unique canonical link on the home page and on all four sibling public pages.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (1cc7a4e, "fix(public): point
appraisal-page canonicals and JSON-LD @ids at the clean /audit URL (#56)") after
five further commits touched the public surface since the 2026-08-09 closeout —
95d2248 (preferred source pages for AI answers), c5e2f2b (de-index the retired
Agent Desk), ac05bec (mobile tap targets: CSS only), f9f0b0f (footer
attribution link on home), 1cc7a4e (canonical/JSON-LD URL cleanup on /audit).
Only the last touched a canonical link — the audit page's moved from the
redirecting `https://tinystudio.io/audit.html` to the clean
`https://tinystudio.io/audit`, with the `check-site.mjs` guard expectation
updated to match (verified per commit: `git show <sha> -- public/` contains no
canonical-line change in any other commit). The home-page canonical the
finding flagged is byte-identical to the one the closeout measured. Three
checks:

1. Source checks on this head: `npm run check` passes — the "Canonical URLs
   (dogfood)" guard in `scripts/check-site.mjs` requires exactly one
   non-commented `<link rel="canonical">` inside `<head>` per page, with a
   non-empty href pointing at the page's canonical `https://tinystudio.io`
   address (home expected: `https://tinystudio.io/`) and no URL duplicated
   across pages — and the full `npm test` suite passes (check, headings 6/6,
   sitemap, worker, ui, contract).

2. Fresh live measurement of the deployed site (2026-08-11, headless Chromium,
   same method as the receipt above, `domcontentloaded` wait, canonical read
   from `document.head` and from the full document, console/page errors
   captured): every page returns 200 with the CSP header, serves exactly one
   canonical link in its head and one across the whole document, and logs no
   console or page errors. Measured canonical hrefs (unique across pages):

   | Page | HTTP | CSP header | canonical links in head | links in full doc | href | console errors |
   |---|---|---|---|---|---|---|
   | index.html (home, `/`) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
   | audit.html (`/audit`) | 200 | yes | 1 | 1 | `https://tinystudio.io/audit.html` | none |
   | agents.html (`/agents`) | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
   | pricing.html (`/pricing`) | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
   | specimen.html (`/specimen`) | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |

   Homepage canonical served live, unchanged from the closeout receipt:

   > `<link rel="canonical" href="https://tinystudio.io/">`

3. Deployment-lag note (honesty, not a canonical regression): the live
   deployment lags current main by exactly the two newest commits — f9f0b0f
   (footer attribution link on home) and 1cc7a4e (canonical/JSON-LD URL
   cleanup on /audit) — so the live audit page still names the redirecting
   `https://tinystudio.io/audit.html` form that PR #56 already corrected on
   main to the clean `/audit`. Neither lagging commit touches the home page's
   canonical; the address the finding flagged (home, `https://tinystudio.io/`)
   is identical on main and live and was already served correctly at the
   2026-08-09 closeout.

Finding 6631c0ab0454 ("Missing canonical URL on home") remains closed on the
code side (PR #29), in CI (`npm run check` guard), and against the deployed
site; this lane (2026-08-11) re-confirmed all three against current main and
found nothing further to change on the finding's page.

### Ship verification, "origin/main past 2e042258 so merged PRs #56 and #70 go live" (added 2026-08-11)

This section closes the deploy-lag item that tracked shipping main past
2e042258 so the merged PR #56 (clean `/audit` canonical/og:url/JSON-LD) and
PR #70 (homepage footer attribution) reach production. The deployment-lag
note above (point 3, recorded earlier on 2026-08-11) is hereby resolved.
Both halves of the item are verified true on this head (e6f42c1, current
origin/main):

1. Main is 25 commits past 2e042258 and both named PRs are in that history:
   `git log --oneline origin/main --not 2e042258` shows 25 commits, including
   `1cc7a4e` "point appraisal-page canonicals and JSON-LD @ids at the clean
   /audit URL (#56)" and `f9f0b0f` "link Nish's daily reads from the homepage
   footer (#70)" — plus every later public-facing merge (#86 footer tap
   target, #96 tablet form, #100 retired-hosts truth, #99 docs).

2. The live deployment now matches origin/main byte-for-byte on all five
   public pages: `curl https://tinystudio.io/{/,/audit,/agents,/pricing,/specimen}`
   diffed against the `public/*.html` files on this head shows zero
   differences on every page. The live audit page serves the clean
   `https://tinystudio.io/audit` canonical and og:url, JSON-LD WebPage
   `@id`/`url` `https://tinystudio.io/audit#webpage`/`https://tinystudio.io/audit`,
   and `curl -I https://tinystudio.io/audit` returns HTTP 200 with no
   `Location` header (no 307); the live home page head contains the
   `Nish's daily reads · inish.in` footer line from #70.

3. Ship mechanism and release state: the armed fleet-release pipeline
   (policy "on") shipped this head at 2026-08-11T10:49:53 IST from a clean
   detached worktree of the exact sha, accepted against the live URL
   ("live HTTP 200, marker ok"), and `release-state-tinystudio-io.json` now
   pins `e6f42c1`, strictly past 2e042258. The round also carried the two
   commits that had landed after the previous 08:38 deploy of 872fd23 — #100
   (app/api 410 messages now name The Website Appraisal, verified live on
   both hosts) and #99 (docs).

4. Source and CI on this head: `npm run check` passes ("TinyStudio.io checks
   passed"; the canonical guard enforces exactly one link per page), the full
   `npm test` suite passes (headings 6/6, sitemap 7/7, worker 55/55, ui 16/16,
   contract 8/8), and GitHub Actions `verify` and `Gitleaks` both report
   success on e6f42c1.

The item is satisfied: origin/main is past 2e042258, the merged PRs #56 and
#70 are served live (along with everything merged since), and nothing further
on this item remains to ship.

### Re-verification (added 2026-08-12, lane 1)

Re-verified against the current origin/main head (18128e8, "fix(public): serve
rel=icon on /brief-requested and guard favicon links in check-site.mjs (#113)")
after six further commits touched the public surface since the last re-verify
at ee50e17: 0ad7481 (home-page footer tap target), 6f85c61 (tablet-width
intake form), 2ae7504 (search-intent bridge for "conversion audit"), d4a2c30
(appraisal intake field labels and document titles), 9302611 (rel=icon
favicon on every page), 18128e8 (rel=icon on /brief-requested and the favicon
guard). None touched a canonical link or the canonical guard:
`git log -p ee50e17..origin/main -- public/` and
`git diff ee50e17..origin/main -- scripts/check-site.mjs` contain no
canonical-line change, so the home-page canonical the finding flagged is
byte-identical to the one every prior receipt measured. Three checks:

1. Source checks on this head: `npm run check` passes ("TinyStudio.io checks
   passed") — the "Canonical URLs (dogfood)" guard in
   `scripts/check-site.mjs` requires exactly one non-commented
   `<link rel="canonical">` inside `<head>` per page, with a non-empty href
   pointing at the page's canonical `https://tinystudio.io` address (home
   expected: `https://tinystudio.io/`) and no URL duplicated across pages —
   and the full `npm test` suite passes (check, headings 6/6, sitemap 7/7,
   worker 55/55, ui 16/16, contract 8/8).

2. Fresh live measurement of the deployed site (2026-08-12, headless
   Chromium, same method as the closeout receipt above, `domcontentloaded`
   wait, canonical read from `document.head` and from the full document,
   console/page errors captured): every page returns 200 with the CSP header,
   serves exactly one canonical link in its head and one across the whole
   document, and logs no console or page errors. Measured canonical hrefs
   (unique across pages):

   | Page | HTTP | CSP header | canonical links in head | links in full doc | href | console errors |
   |---|---|---|---|---|---|---|
   | index.html (home, `/`) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
   | audit.html (`/audit`) | 200 | yes | 1 | 1 | `https://tinystudio.io/audit` | none |
   | agents.html (`/agents`) | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
   | pricing.html (`/pricing`) | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
   | specimen.html (`/specimen`) | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |

   Homepage canonical served live, unchanged from every prior receipt:

   > `<link rel="canonical" href="https://tinystudio.io/">`

3. Deployment parity: the live deployment matches origin/main byte-for-byte
   on all five public pages — `curl -sL https://tinystudio.io/{index,audit,
   agents,pricing,specimen}.html` (following the .html forms' 307 redirects to
   their clean extensionless twins) diffed against the `public/*.html` files
   on this head shows zero differences on every page, so no deployment lag and
   no drift between the source guard and the served bytes.

Finding 6631c0ab0454 ("Missing canonical URL on home") remains closed on the
code side (PR #29), in CI (`npm run check` guard), and against the deployed
site; this lane (2026-08-12) re-confirmed all three against current main and
live and found nothing further to change on the finding's page.
