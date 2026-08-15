# Lane 1 — Mobile tap targets re-verification (2026-08-15)

Item: `[unreviewed-by-opus] Mobile tap targets fall under WCAG sizes on every page: primary CTAs are 42px tall and nav li`

Branch: `fix/tap-targets-rereverify-2026-08-15`
Base: `origin/main` at `cdfa877` (2026-08-15)

## Verdict

**Finding stays closed — no code change required.** The 44px tap-target
fix (PR #48, extended by #70) remains intact on both current main and the
live deployment. Every standalone interactive element on all seven served
pages measures ≥44px in height and width at 390x844; the only sub-44px
elements are inline text links inside sentences (`.xa1`, `.xi19`, `.xp1`),
which are exempt under WCAG 2.5.8/2.5.5 "Inline" and were intentionally
excluded from the fix.

## Changes since the 2026-08-14 re-verification (base 7ad776a)

Three commits touched the tap-target surface since the last receipt:

- `2d8599a` (#176, "keep the hero mock and its flags inside the viewport
  below 320px") — index.css layout-only changes (`.spec`/`.browser`
  `min-width:0`, flag wrapping, sub-340px row/who wrapping). No tap-target
  rule changed; all 44px paddings and min-heights intact.
- `afb5d49` (#174, "wrap the /agents hero h1 at 280px") — shared.css
  `.phead h1` `overflow-wrap:anywhere` addition, outside the mobile
  tap-target rules. No tap-target rule changed.
- `c447585` (#202) / `ffc1672` (#193) — llms.txt / offer.md text and URL
  changes only; no CSS touched.

No commit since the 2026-08-12 full-element sweep removed, weakened, or
moved any of the ≥44px rules. The tap-target guard in
`scripts/check-site.mjs` still pins the exact rules in all five
stylesheets, and `npm run check` passes on this head.

## Method

Full-element sweep in one fresh headless-Chromium session
(Playwright 1.62.1, viewport 390x844, deviceScaleFactor 1, isMobile),
measuring `getBoundingClientRect()` height and width of **every**
interactive element (`a, button, input, select, textarea, summary`) on
each page, with an explicit `document.fonts.load("16px Karla")` before
measuring (the font-loading caveat recorded in the 2026-08-14 receipt):

- local static copy of `public/` from `origin/main` (served on a local
  node:http server), and
- the live deployment `https://tinystudio.io` (same script, same session).

## Results — standalone targets at 390x844

Local main and live are identical:

| Element | main (min) | live (min) | status |
|---|---|---|---|
| `.logo` | 50 | 50 | ≥44 |
| `.navlinks a` | 45 (h) × 44 (w) | 45 × 44 | ≥44 |
| `.navcta` | 47 | 47 | ≥44 |
| lead-form `button` | 44 | 44 | ≥44 |
| `footer a` | 44–45 | 44–45 | ≥44 |
| `.back` | 45 | 45 | ≥44 |
| `.cta` (in-content, /audit /agents /specimen) | 46 | 46 | ≥44 |
| Agent Desk controls (`.brand`, inputs, buttons, tabs, summary, footer link) | 44–65.2 | 44–65.2 | ≥44 |

No element under 44px in height or width among standalone targets on any
page: home, /audit, /agents, /pricing, /specimen, /brief-requested,
/agent-desk.

### Only sub-44px elements — inline text links, WCAG-exempt

The 2026-08-12 and 2026-08-14 receipts recorded the same classes:

- `.xa1` — AI-search source citations in the audit page `Sources:` lines
  (audit.js injects these into `<p class="micro">` paragraphs)
- `.xi19` — "See the terms →" and "Read the specimen →" inline links
- `.xp1` — "See the desk →" / "Read the specimen →" inline links on /pricing

These are exempt from WCAG 2.5.8 Target Size (Minimum) and 2.5.5 Target
Size (Enhanced) under both criteria' "Inline" exception (target in a
sentence or block of text), are typographic by design, and are
intentionally left as-is — not part of the tap-target guard.

## Source checks on this head

- `npm run check` passes (exit 0, "TinyStudio.io checks passed.") — the
  tap-target guard in `scripts/check-site.mjs` enforces the exact ≥44px
  rules in `shared.css`, `index.css`, `audit.css`, `brief-requested.css`
  and `styles.css`.
- Full `npm test` suite passes on this head: 242 tests, 0 failures
  (check, headings 6/6, sitemap 7/7, worker 80/80, ui 16/16, contract
  8/8, viewport 4/4, narrow-pages and narrow suites), including the
  narrow-viewport Chromium regressions added by #174 and #176.
- `git diff --check` clean.

## Live checks

- All seven pages serve HTTP 200 at their clean URLs
  (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`,
  `/brief-requested`, `/agent-desk`).
- Full-element measurement at 390x844 matches the local main run
  element-for-element: every standalone target ≥44px, only the
  WCAG-exempt inline links under 44px.

## Files changed

- `docs/evidence/tap-targets-2026-08-09.md` — appended the 2026-08-15
  re-verification receipt (this lane's claimed evidence file).
- `.lane/reports/tap-targets-rereverify-2026-08-15.md` — this report.

## Closeout

The item as stated — "Mobile tap targets fall under WCAG sizes on every
page: primary CTAs are 42px tall and nav links ~15px" — is **closed
against current main (cdfa877) and live**: primary CTAs measure 44px,
nav links 45px, on every page, with the rules pinned by CI source guards.
No code change was required.
