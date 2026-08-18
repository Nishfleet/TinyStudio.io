# Lane 1 — Mobile tap targets re-verification (2026-08-17)

Item: `[unreviewed-by-opus] Mobile tap targets fall under WCAG sizes on every page: primary CTAs are 42px tall and nav li`

Branch: `docs/tap-target-rereverify-2026-08-17`
Base: `origin/main` at `5ca6241` (2026-08-17)

## Verdict

**Finding stays closed — no code change required.** The 44px tap-target
fix (PR #48, extended by #70 and #86, re-verified by #133, #230, #231)
remains intact on both current main and the live deployment. Every
standalone interactive element on all seven served pages measures
≥44px in height and width at 390x844; the only sub-44px elements are
inline text links inside sentences (`.xa1`, `.xi19`, `.xp1`), which are
exempt under WCAG 2.5.8/2.5.5 "Inline" and were intentionally excluded
from the fix.

## Changes since the 2026-08-15 re-verification (base cdfa877)

Twelve commits landed on main since the 2026-08-15 pass; none touched
the tap-target surface:

- `5ca6241` (#238, favicon.ico) — Worker routing + `public/favicon.svg`
  only; no CSS.
- `83a5974` (#237), `56c4e24` (#236), `b07ebc8` (#235), `7d3a8ae` (#234),
  `fdd5c20` (#233), `c5e46d3` (#232), `a654ab4` (#211), `e90b98f` (#45) —
  `docs/evidence/` and service handoff docs only.
- `798cd71` (#229, /agent-desk canonical) — link rel="canonical" on the
  retired Agent Desk page; no CSS.
- `0e7373f` (#213, autocomplete="email") — `public/index.html` and
  `public/audit.html` attribute additions on the two intake inputs; no
  CSS.
- `e72e59b` (#67, persistent intake labels + "The Tiny Studio" titles)
  — `public/index.html` and `public/audit.html` aria-label / document
  title / `id="start"` anchor only; no CSS.

`git diff origin/main..HEAD -- public/*.css` returns empty on the lane
head: no stylesheet drift since the 2026-08-15 base. The guard in
`scripts/check-site.mjs` still pins the ≥44px rules in all five
stylesheets (shared, index, audit, brief-requested, styles).

## Method

Full-element sweep in one fresh headless-Chromium session
(Playwright 1.62.1, viewport 390x844, deviceScaleFactor 1, isMobile,
hasTouch), measuring `getBoundingClientRect()` height and width of
**every** interactive element (`a, button, input, select, textarea,
summary`) on each page, with an explicit
`document.fonts.load("16px Karla")` before measuring (the font-loading
caveat recorded in the 2026-08-14 receipt):

- local static copy of `public/` from `origin/main` (served on a local
  node:http server with the Worker's pretty-URL behaviour: `/foo` →
  `/foo.html` when foo.html exists), and
- the live deployment `https://tinystudio.io` (same script, same
  session).

## Results — standalone targets at 390x844

Local main and live are identical element-for-element on every page:

| Page | total | standalone | inline | sub44 standalone | min h × min w |
|---|---|---|---|---|---|
| `/` | 10 | 8 | 2 | 0 | 44 × 44 |
| `/audit` | 33 | 10 | 23 | 0 | 44 × 44 |
| `/agents` | 8 | 6 | 2 | 0 | 45 × 44 |
| `/pricing` | 9 | 5 | 4 | 0 | 45 × 44 |
| `/specimen` | 8 | 6 | 2 | 0 | 45 × 44 |
| `/brief-requested` | 5 | 5 | 0 | 0 | 45 × 44 |
| `/agent-desk` | 25 | 25 | 0 | 0 | 44 × 49 |

No element under 44px in height or width among standalone targets on any
of the seven pages: home, /audit, /agents, /pricing, /specimen,
/brief-requested, /agent-desk. Per-class measurements (home as the
named CTA page):

| Element | main (min) | live (min) | status |
|---|---|---|---|
| `.logo` | 50 | 50 | ≥44 |
| `.navlinks a` | 45 (h) × 44 (w) | 45 × 44 | ≥44 |
| `.navcta` | 47 | 47 | ≥44 |
| lead-form `button` | 44 | 44 | ≥44 |
| `footer a` | 45 | 45 | ≥44 |
| `.back` | 45 | 45 | ≥44 |
| `.cta` (in-content, /audit /agents /specimen) | 46 | 46 | ≥44 |
| Agent Desk controls (`.brand`, inputs, buttons, tabs, summary, footer link) | 44–65.2 | 44–65.2 | ≥44 |

### Only sub-44px elements — inline text links, WCAG-exempt

The 2026-08-12, 2026-08-14 and 2026-08-15 receipts recorded the same
classes; still present on current main and live:

- `.xa1` — AI-search source citations in the audit page `Sources:`
  lines (audit.js injects these into `<p class="micro">` paragraphs).
- `.xi19` — "See the terms →" and "Read the specimen →" inline links.
- `.xp1` — "See the desk →" / "Read the specimen →" inline links on
  /pricing.

These are exempt from WCAG 2.5.8 Target Size (Minimum) and 2.5.5 Target
Size (Enhanced) under both criteria' "Inline" exception (target in a
sentence or block of text), are typographic by design, and are
intentionally left as-is — not part of the tap-target guard.

## Source checks on this head

- `npm run check` passes (exit 0, "TinyStudio.io checks passed.") — the
  tap-target guard in `scripts/check-site.mjs` enforces the exact
  ≥44px rules in `shared.css`, `index.css`, `audit.css`,
  `brief-requested.css` and `styles.css`.
- Full `npm test` suite passes on this head: 252 tests, 0 failures
  (check, headings 6/6, sitemap 7/7, worker 80/80, ui 16/16, contract
  8/8, viewport 4/4, narrow-pages 35/35, narrow 12/12), including the
  narrow-viewport Chromium regressions added by #174 and #176 and the
  `test-narrow-viewport-pages.mjs` 240-390 sweep across all five owned
  routes.
- `git diff --check` clean.

## Live checks

- All seven pages serve HTTP 200 at their clean URLs
  (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`,
  `/brief-requested`, `/agent-desk`).
- Full-element measurement at 390x844 matches the local main run
  element-for-element: every standalone target ≥44px, only the
  WCAG-exempt inline links under 44px.

## Files changed

- `docs/evidence/tap-targets-2026-08-09.md` — appended the 2026-08-17
  re-verification receipt (this lane's claimed evidence file).
- `.lane/reports/docs-tap-target-rereverify-2026-08-17.md` — this report.

## Closeout

The item as stated — "Mobile tap targets fall under WCAG sizes on every
page: primary CTAs are 42px tall and nav links ~15px" — is **closed
against current main (5ca6241) and live**: primary CTAs measure 44px,
nav links 45px, on every page, with the rules pinned by CI source
guards. No code change was required.
