# Lane 1 report — canonical-URL finding 6631c0ab0454 re-verification (2026-08-17)

Branch: `docs/canonical-rereverify-2026-08-17`
Item: [dogfood 6631c0ab0454] Missing canonical URL on home [dogfood 20260808T074205Z-msk2fl3n]
Base: origin/main @ 3dc5856

## Verdict

Already fixed and live; no code change needed on the finding's page. Finding
6631c0ab0454 was closed by PR #29 ("seo: add canonical URLs to the five public
pages") and has been re-verified on 2026-08-09, 08-11 (twice), 08-12, 08-13 and
08-14. This lane re-confirmed all three halves on 2026-08-17 against
origin/main head 3dc5856 and the deployed site:

1. Source + CI: the full `npm test` chain passes on 3dc5856. No `npm` binary
   exists on this host (`node` v22.23.1 present, `npm not found`), so each
   script in the `test` chain was run directly: `node scripts/check-site.mjs`
   → "TinyStudio.io checks passed", headings 6/6, sitemap 7/7, worker 80/80,
   ui 16/16, contract 8/8, first-viewport 4/4, narrow-pages 34/34 rows PASS,
   narrow 11/11 rows PASS. The "Canonical URLs (dogfood)" guard
   (`scripts/check-site.mjs`, ~lines 1792-1846) still enforces exactly one
   non-commented `<link rel="canonical">` inside `<head>` per page, a
   non-empty href pointing at the page's canonical `https://tinystudio.io`
   address (home: `https://tinystudio.io/`), and no URL duplicated across
   pages.
2. Live: headless Chromium (Playwright 1.62.1) measurement of the deployed
   site — all six served pages return 200 with a CSP header, each serves
   exactly one canonical link in `document.head` and one across the whole
   document, no console or page errors, six distinct hrefs. Home serves
   `<link rel="canonical" href="https://tinystudio.io/">`, unchanged from
   every prior receipt. The `.html` forms still 307 to their clean twins and
   `www.` still 301s to the apex the home canonical names.
3. Deployment parity: live matches origin/main byte-for-byte on all five
   public pages plus `/agent-desk` (curl -sL through the .html 307s diffed
   against `public/*.html`) — zero differences.

## What actually changed for this finding since 2026-08-14

Worth recording rather than rubber-stamping: at the 08-14 receipt the home
canonical was correct but **not exclusive**. The retired
`public/agent-desk.html` declared `canonical` and `og:url` pointing at
`https://tinystudio.io/` — the home page's own address — and the dogfood guard
never caught it because the guard's page list is the five public pages and the
retired surface is not one of them. PR #229 (798cd71a, landed 2026-08-17)
repointed both at the clean `https://tinystudio.io/agent-desk` and extended the
retired-desk section of `scripts/check-site.mjs` to require exactly one
canonical and one og:url naming that address. Verified: `git show
20b7cc6:public/agent-desk.html` carries the apex-root canonical, the file on
3dc5856 carries `/agent-desk`, and the live page serves `/agent-desk` with
`robots: noindex, nofollow`. As of today the home page's canonical is the only
claim on `https://tinystudio.io/` anywhere in the served site — strictly better
than the state the last receipt recorded, and nothing regressed.

## Range reviewed

33 commits landed on main since the last re-verify head 20b7cc6; six touched
`public/` or `scripts/check-site.mjs`: 2d8599a4 (#176 narrow-viewport CSS),
e0ee160b (#212 beacon closeout), a654ab49 (#211 AI-search re-run evidence),
0e7373fe (#213 `autocomplete="email"` on the lead forms), 798cd71a (#229
retired-desk canonical), 5ca6241a (#238 /favicon.ico). `git log -p
20b7cc6..3dc5856 -- public/index.html` contains exactly one hunk — the
`autocomplete="email"` attribute on the lead form's email input — so the
home-page canonical line is byte-identical to the one every prior receipt
measured. The "Canonical URLs (dogfood)" guard itself is untouched in range.

## Change in this PR

- `docs/evidence/canonical-urls-2026-08-09.md`: appended the 2026-08-17
  re-verification section to the standing receipt (source/CI, live browser
  measurement, deployment parity, and the agent-desk apex-root note).
- `.lane/reports/docs-canonical-rereverify-2026-08-17.md`: this report.

No production file changed; nothing on the finding's page needed a fix.

## Live measurement (2026-08-17)

| Page | HTTP | CSP | canonical in head | in full doc | href | console errors |
|---|---|---|---|---|---|---|
| `/` (home) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
| `/audit` | 200 | yes | 1 | 1 | `https://tinystudio.io/audit` | none |
| `/agents` | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
| `/pricing` | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
| `/specimen` | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |
| `/agent-desk` (retired, noindex) | 200 | yes | 1 | 1 | `https://tinystudio.io/agent-desk` | none |

## Limitation

Unchanged from the standing receipt: the live browser check is manual, not a
CI gate. What prevents regression in CI is the source-string guard in
`scripts/check-site.mjs`; the served pages are the static files verbatim
through the Worker's ASSETS binding, so source and served bytes cannot drift
unless the Worker's asset serving changes.
