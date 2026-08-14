# Lane 1 — Mobile tap targets re-verification (2026-08-14)

Item: `[unreviewed-by-opus] Mobile tap targets fall under WCAG sizes on every page: primary CTAs are 42px tall and nav li`

Branch: `fix/tap-targets-rereverify-2026-08-14`
Base: `origin/main` at `7ad776a` (2026-08-14)

## Verdict

**Finding stays closed — no code change required.** The 44px tap-target
fix (PR #48, extended by #70) remains intact on both current main and the
live deployment. Every standalone interactive element on all seven served
pages measures ≥44px in height and width at 390x844; the only sub-44px
elements are inline text links inside sentences (`.xa1`, `.xi19`, `.xp1`),
which are exempt under WCAG 2.5.8/2.5.5 "Inline" and were intentionally
excluded from the fix.

## Method

Full-element sweep in one fresh headless-Chromium session
(Playwright 1.62.1, viewport 390x844, deviceScaleFactor 1), measuring
`getBoundingClientRect()` height and width of **every** interactive
element (`a, button, input, select, textarea, summary`) on each page:

- local static copy of `public/` from `origin/main` (served on
  127.0.0.1:8133), and
- the live deployment `https://tinystudio.io` (same script, same session).

This is the same method as the 2026-08-12 full-element re-verification,
plus an explicit `document.fonts.load()` for Karla/Fraunces before
measuring. (Initial run without the explicit load produced transient
43px/41.3px readings for the lead button and shortest nav label — a
font-loading artifact: with Karla loaded the same elements measure
44px and 45x44px. This is noted as a caveat, not a regression.)

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
| Agent Desk controls (`.brand`, inputs, selects, buttons, tabs, summary, footer link) | 44–65.2 | 44–65.2 | ≥44 |

No element under 44px in height or width among standalone targets on any
page: home, /audit, /agents, /pricing, /specimen, /brief-requested,
/agent-desk.

### Only sub-44px elements — inline text links, WCAG-exempt

| Page | Element | size | reason |
|---|---|---|---|
| home | `.xi19` "Read the specimen →" | 19×159 | inline in sentence |
| /audit | `.xa1` citation links (32) + "See the terms →", "Read the specimen →" | 15–30 × 75–346 | inline in `Sources:` lines |
| /pricing | `.xp1` "See the desk →", "Read the specimen →" | 18–19 × 110–159 | inline in sentence |

These are the same elements the 2026-08-12 evidence already identified and
excluded: targets inside a sentence/block of text fall under the WCAG
2.5.8 (Minimum) and 2.5.5 (Enhanced) "Inline" exception; they are
typographic by design, not discrete controls. Growing them would balloon
paragraph line-height for zero compliance gain. They are intentionally not
part of the tap-target guard.

## No overflow introduced

`document.documentElement.scrollWidth == clientWidth == 390` on all seven
pages, both main and live.

## CI

`npm run check` passes on the lane head (`7ad776a`): the static tap-target
source guards in `scripts/check-site.mjs` (shared.css, index.css, audit.css,
brief-requested.css, styles.css needles) all still pin the ≥44px rules.

## Caveats

- `document.fonts` reports some Karla faces `unloaded` even after the
  explicit load (network subsetting); the loaded faces were enough to
  render production metrics — the same elements that transiently read
  43px/41.3px with no loaded faces measure 44px and 45×44 with Karla
  available.
- This is a static-copy + live measurement, not CI; the CI source guards
  remain the regression backstop.

## Files touched

- `.lane/reports/fix/tap-targets-rereverify-2026-08-14.md` (this report).

No production files changed — the finding is verified closed.
