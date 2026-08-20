# Lane 1 report — canonical-URL finding 6631c0ab0454 re-verification (2026-08-20)

Branch: `docs/canonical-rereverify-2026-08-20`
Item: [dogfood 6631c0ab0454] Missing canonical URL on home [dogfood 20260808T074205Z-msk2fl3n]
Base: origin/main @ d0daea9

## Verdict

Already fixed and live; no code change needed on the finding's page. Finding
6631c0ab0454 was closed by PR #29 ("seo: add canonical URLs to the five public
pages") and has been re-verified on 2026-08-09, 08-11 (twice), 08-12, 08-13,
08-14 and 08-17. This lane re-confirmed all three halves on 2026-08-20 against
origin/main head d0daea9 and the deployed site:

1. Source + CI: the full `npm test` chain passes on d0daea9. No `npm` binary
   exists on this host (`node` v22.23.1, `npm not found`), so each script in
   the chain ran directly: `node scripts/check-site.mjs` →
   "TinyStudio.io checks passed"; headings 6/6, sitemap 7/7, worker 80/80,
   ui 16/16, contract 8/8, first-viewport 4/4, narrow-pages 34/34 rows PASS,
   narrow 11/11 rows PASS. The "Canonical URLs (dogfood)" guard
   (`scripts/check-site.mjs`, lines ~1893-1934) still enforces exactly one
   non-commented `<link rel="canonical">` inside `<head>` per page, a
   non-empty href pointing at the page's canonical `https://tinystudio.io`
   address (home: `https://tinystudio.io/`, audit: `https://tinystudio.io/audit`,
   agents: `https://tinystudio.io/agents`, pricing: `https://tinystudio.io/pricing`,
   specimen: `https://tinystudio.io/specimen`), and no URL duplicated across
   pages.
2. Live: headless Chromium (Playwright 1.62.1) measurement of the deployed
   site — all six served pages return 200 with a CSP header, each serves
   exactly one canonical link in `document.head` and one across the whole
   document, no console or page errors, six distinct hrefs. Home serves
   `<link rel="canonical" href="https://tinystudio.io/">`, unchanged from
   every prior receipt. The `.html` forms still 307 to their clean twins and
   `www.` still 301s to the apex the home canonical names.
3. Deployment parity: home canonical is byte-identical live vs source
   (`curl -s https://tinystudio.io/ | grep canonical` matches
   `grep canonical public/index.html`). Three other appraisal pages are
   lagging — see below.

## What actually changed for this finding since 2026-08-17

Eight commits landed on main since the last re-verify head 3dc5856: 9f79c71
(#243 internal-link spelling guard), ed2b1a9 (#218 appraisal-page clean
canonicals), 76fe17b (#194 pricing closing-callout signup), 23a7f06 (#112
TinyStudio footers), 66f7bd6 (#154 intake persistent labels), 43cc831 (#156
study freshness), dda25f2 (#245 closed-intake response), d0daea9 (#227
ai-search evidence). The only canonical-line change in any `public/*.html`
across this range is PR #218, and it touched `/agents`, `/pricing`, and
`/specimen` — not the home page the finding flags. `git log -p
3dc5856..d0daea9 -- public/index.html` contains exactly two hunks, both in
the body (`intake-website` and `intake-email` labels from #154); the home
canonical line is byte-identical to every prior receipt.

The "Canonical URLs (dogfood)" guard itself was extended by PR #218 to
expect the clean extensionless addresses for the three appraisal pages. The
guard's expected set on d0daea9 is exactly what the source files ship, so
the source-side guarantee the finding rests on is strictly stronger than at
the 08-17 receipt (where the three pages still named the redirecting `.html`
forms).

## Range reviewed

`git log -p 3dc5856..d0daea9 -- public/index.html` — 2 hunks, both body
labels (PR #154). Canonical line untouched.
`git log -p 3dc5856..d0daea9 -- public/audit.html public/agents.html
public/pricing.html public/specimen.html public/agent-desk.html` — canonical
line changes only on `public/agents.html`, `public/pricing.html`, and
`public/specimen.html` (PR #218). All four other pages' canonicals
byte-identical.
`git log -p 3dc5856..d0daea9 -- scripts/check-site.mjs` — guard extensions
from #218 and #243; the "Canonical URLs (dogfood)" section is functionally
strengthened, never weakened, in this range.

## Change in this PR

- `docs/evidence/canonical-urls-2026-08-09.md`: appended the 2026-08-20
  re-verification section (commit table, three-check summary, and the
  deployment-parity note for the three PR #218-lagging appraisal pages).
- `.lane/reports/docs-canonical-rereverify-2026-08-20.md`: this report.

No production file changed; nothing on the finding's page needed a fix.

## Live measurement (2026-08-20)

| Page | HTTP | CSP | canonical in head | in full doc | href | console errors |
|---|---|---|---|---|---|---|
| `/` (home) | 200 | yes | 1 | 1 | `https://tinystudio.io/` | none |
| `/audit` | 200 | yes | 1 | 1 | `https://tinystudio.io/audit` | none |
| `/agents` | 200 | yes | 1 | 1 | `https://tinystudio.io/agents.html` | none |
| `/pricing` | 200 | yes | 1 | 1 | `https://tinystudio.io/pricing.html` | none |
| `/specimen` | 200 | yes | 1 | 1 | `https://tinystudio.io/specimen.html` | none |
| `/agent-desk` (retired, noindex) | 200 | yes | 1 | 1 | `https://tinystudio.io/agent-desk` | none |

## Deployment-parity note

PR #218 (ed2b1a9, landed 2026-08-19) repointed the canonicals on
`/agents`, `/pricing`, and `/specimen` from the redirecting `.html` forms
(`https://tinystudio.io/agents.html` etc.) to the clean extensionless
addresses (`https://tinystudio.io/agents` etc.). Source on origin/main
matches the guard expectation (clean addresses) for all three pages, but
the live deployment still serves the `.html`-form canonicals — a deployment
lag, not a source regression. The retired `/agent-desk` does ship live with
the cleaned `/agent-desk` canonical from PR #229. The home finding is
unaffected by this lag: live home canonical is byte-identical to source
home canonical (`https://tinystudio.io/`), and has been unchanged across
every re-verification receipt since the closeout.

## Limitation

Unchanged from the standing receipt: the live browser check is manual, not a
CI gate. What prevents regression in CI is the source-string guard in
`scripts/check-site.mjs`; the served pages are the static files verbatim
through the Worker's ASSETS binding, so source and served bytes cannot drift
unless the Worker's asset serving changes.
