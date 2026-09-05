# candidate-report.md — Mobile horizontal overflow fix

Date: 2026-08-06
Scope: `tinystudio.io` public pages `/`, `/pricing`, `/agents` at 390px mobile viewport.
No commit, no PR (per instruction). Only public CSS changed; no lockfiles/deps/migrations.

## Evidence (measured, headless Chromium 1228 via CDP, fonts loaded, no scrollbar)

Harness: `/tmp/opencode/measure.mjs` — CDP `Emulation.setDeviceMetricsOverride`, then
`document.documentElement.scrollWidth` vs `clientWidth` plus per-element bounding boxes.

| page   | before (390px) | after (390px) |
|--------|----------------|---------------|
| `/`    | 575px          | 390px (= viewport, clean) |
| `/pricing.html` | 473px   | 390px         |
| `/agents.html`  | 624px   | 390px         |
| desktop 1280px (all three) | 1280px clean | 1280px clean, nav geometry byte-identical (left 100 / right 1180 / width 1080) |
| 320px (all three) | n/a     | 320px (= viewport, clean) |
| `/specimen.html` 390px (shared-shell bystander) | 473px | 390px |
| `/brief-requested.html` 390px | 390px | 390px |
| `/audit.html` 390px (out of scope, own CSS) | 569px | 501px (nav fixed; its own `audit.css` band grid remains pre-existing) |

## Root causes (shared, not route-specific)

1. **Nav row, all pages.** `.navlinks` is a non-wrapping flex row (gap 34–36px) with a
   nowrap CTA pill; at 390px it overflowed the `.wrap` (right edge ≈ 473–479px) on every
   page. Defined twice: `shared.css` (pricing/agents/audit/specimen/brief-requested) and
   `index.css` (`/` is standalone). This alone produced the /pricing and /specimen overflow.
2. **`/` (`index.css`)** — `.finding` grid `auto 1fr` with a `white-space:nowrap` 132px
   stat forced the band to ~705px; `.checkgrid` (4 cols), `.method .track` (4 cols),
   `.offer` flex with `flex-shrink:0` price (reached 575px, the measured scroll width),
   and `.who` flex pushed the "Everyone welcome to ask" label to 422px.
3. **`/pricing` (`pricing.css`)** — `.plan` grid `1.25fr .95fr` (right column to 579px,
   the measured width) and `.track` 4-col grid (stop to 452px).
4. **`/agents` (`agents.css`)** — `.ag` grid `56px 1.15fr 1.45fr auto` with nowrap
   `.gate` (grid to ~624px, the measured width), `.gatebox` 2-col and `.stack` 3-col grids.
5. **`.wrap` shell** — fixed 60px side padding on ≤390px leaves only 270px of content
   width; part of why everything overflowed.

## Fix (64 insertions, 0 deletions, 4 files — additive CSS only)

Added `@media (max-width:760px)` blocks (the site's existing breakpoint convention) to:

- `public/shared.css` — `.wrap{padding:0 24px}`; `nav{flex-wrap:wrap}`;
  `.navlinks{flex-wrap:wrap;width:100%}`; nav link/CTA padding 15px → 44–47px tall.
- `public/index.css` — same shell/nav rules; `.finding` → single column with
  `clamp(64px,24vw,104px)` stat (fits 320–760px); `.checkgrid`, `.track` → single
  column with border/dot adjustments; `.who`, `.offer` stack; `.price` left-aligned.
- `public/pricing.css` — `.plan` → single column (`.l` border-bottom), `.track` stacked.
- `public/agents.css` — `.ag` → single column, `.gatebox` and `.stack` stack.

All rules are inside `max-width:760px` media queries, so desktop (≥761px) is untouched
(verified: 1280px and 768px geometry identical pre/post). No `overflow-x` clipping was
added anywhere; content now genuinely fits, nothing is off-canvas or hidden.

## Acceptance check

- No horizontal overflow at 390px on `/`, `/pricing`, `/agents`: scrollWidth == clientWidth == 390; zero elements beyond viewport.
- No off-canvas required content: all previously clipped/off-screen elements (nav links, finding body, price block, gate labels, who-label) verified inside the viewport by bounding boxes.
- Navigation usable: links wrap below the logo; every link ≥44px tall (measured 45px links, 47px CTA).
- Desktop unchanged: 1280px and 768px measurements identical to baseline.
- Evidence: numbers above; harness + scripts in `/tmp/opencode/` (measure.mjs, geo.mjs, taps.mjs) reproducible against `python3 -m http.server` in `public/`.

## Gates

- `npm run check` — passed.
- `npm test` — passed (worker + UI suites).
- `sgscan` — exit 0; warnings only, all pre-existing, none touch the 4 changed CSS files.

## Durable regression check — decision

Not added: the repo has no browser-based test infrastructure (`npm test` runs node-only
static/worker checks), and the assumptions forbid new dependencies/lockfile changes, so a
headless-browser overflow test cannot ship without violating scope. Recommend a follow-up:
a Playwright/Chromium smoke test asserting `document.documentElement.scrollWidth ===
clientWidth` at 390px on `/`, `/pricing`, `/agents`.

## Out of scope / notes

- `/audit.html` still overflows at 390px (501px) from its own `audit.css` finding-band and
  checkgrid patterns — pre-existing, not in the measured evidence set, and not fixed here
  to keep the change narrow. It improved from 569px via the shared nav fix.
- Visual check of rendered screenshots was not possible in this model (no image input);
  layout correctness was verified with DOM geometry probes instead (stacking order,
  element bounds, grid template columns).
