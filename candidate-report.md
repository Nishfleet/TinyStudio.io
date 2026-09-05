# Candidate report — TinyStudio.io 390px horizontal overflow fix (worktree tinystudio-ux-5)

Status: complete, verified, **not committed** (per packet: do not commit, push, or PR).

## Root cause (verified in browser at 390x844, served from this worktree)

All three routes share the same defect class: fixed multi-column layouts whose
min-content width exceeds the 390px viewport. Nothing wraps or stacks below
desktop width. Measured with a same-origin 390px iframe (media queries follow
the iframe viewport) against the unmodified files:

| Route | clientWidth | scrollWidth | Overflow |
|---|---|---|---|
| `/` (index) | 390 | **575** | 185px |
| `/pricing` | 390 | **475** | 85px |
| `/agents` | 390 | **626** | 236px |

(Matches the verified live numbers 575 / ~500 / 624; fonts account for the small delta.)

### Offending layouts (all confirmed by element-level rect measurements)

**All routes**
- `nav .navlinks` — flex row, no wrap; ~300px of links + logo exceed the 270px content column (`.wrap` padding 60px each side). Nav off-canvas to ~475-481px.

**`/` (index)**
- `.finding` — `grid-template-columns:auto 1fr` with a 132px nowrap stat ("53 of 89", ~340px wide) forces the grid min-content to ~590px; the `.body` column lands at x=536-706 and is **hard-clipped** by `.finding{overflow:hidden}` (visible stat column also cut at 390). This was the off-canvas text.
- `.offer .price` — `flex-shrink:0` 88px "$2,500" (~300px) + 90px gap → extends to x=575 (the page's max scrollWidth).
- `.checkgrid` (4 columns, min-content ~660px) and `.track` (4 columns, "Days 1–5" labels) overflow to ~465-552px.
- `.navlinks` same as above.

**`/pricing`**
- `.plan` — `1.25fr .95fr` grid; `.r` column min-content (~304px incl. padding, driven by 82px "$2,500") → right edge 580px; clipped by `.plan{overflow:hidden}`.
- `.track` (4 columns) → 454px.
- `.navlinks` same as above.

**`/agents`**
- `.stack` — 3 columns, min-content from "Specialised," (~136px/cell) → right edge 626px (the page's max scrollWidth).
- `.ag` roster — `56px 1.15fr 1.45fr auto` grid with nowrap `.gate` ("Human-approved", 116px) → rows to ~510px.
- `.gatebox` — 2 columns → `.never` to 416px.
- `.navlinks` same as above.

## Fix (smallest shared correction)

One appended `@media (max-width:760px)` block per page stylesheet — the breakpoint
already used by the existing stacked lead-form rules. Only stacking, wrapping and
padding changes; zero content removed; no new `overflow` hiding added (existing
`body{overflow-x:hidden}` untouched).

- `public/shared.css` — `.wrap` padding 60→20px, `nav`/`.navlinks` wrap, `.band` padding on mobile.
- `public/index.css` — same nav/wrap, plus `.finding` stacks 1fr with stat scaled 132→120px (~309px, fits 350px column), `.checkgrid` 2-col, `.track` 1-col, `.offer` column with `.price` allowed to shrink.
- `public/pricing.css` — `.plan` stacks 1fr (`.l`/`.r` padding 46/50→32/28, `.r` left-aligned), `.track` 1-col.
- `public/agents.css` — `.ag` stacks 1fr, `.gatebox` stacks, `.stack` 1-col with divider borders swapped to bottom.

Breakpoint is ≤760px only, so ≥761px (including the 1280px acceptance viewport) is byte-for-byte the previous layout: verified `.wrap` padding stays 60px at 1280.

## Verification (evidence)

Real browser (Camoufox/Chromium), static serve of this worktree's `public/`:

**390x844 after fix**

| Route | scrollWidth | overflow | max element right edge |
|---|---|---|---|
| `/` | 390 | **0** | 390 (body) |
| `/pricing` | 390 | **0** | 390 (body) |
| `/agents` | 390 | **0** | 390 (body) |

- Nav: all five links (logo, The audit, The desk, Pricing, Request an audit) visible in-viewport and `elementFromPoint`-clickable on all three routes.
- Previously hard-clipped `.finding` content now fully rendered (stat right edge 357px, body 48-357px); lead form in view (20-370px).
- **1280x800 after fix:** all three routes scrollWidth == 1280, wrap padding 60px (media query inactive) → desktop unchanged, no overflow.

**Regression gate** — `scripts/check-site.mjs` gains a deterministic no-dependency
guardrail (same architecture as the existing copy checks): each page CSS must
keep its mobile stacking rules (flattened-CSS substring assertions against the
`@media (max-width:760px)` block). Deleting any of the fixed rules fails
`npm run check` and therefore `npm test`.

**Commands**
- `npm run check` → "TinyStudio.io Agent Desk checks passed." (includes new responsive guardrail)
- `npm test` → all pass (50 worker + 1 UI + check)
- `sgscan` → ran against the working tree; only pre-existing WARNINGs in untouched files (`ci.yml` mutable action tags, `agent-desk.html` SRI, `audit.html`/`index.html` form CSRF heuristic, `study/*.py` urllib) — none in the five changed files.

## Files changed

| File | Why |
|---|---|
| `public/shared.css` | Mobile wrap/nav/band stacking for shared pages (pricing, agents) |
| `public/index.css` | Mobile stacking: finding, checkgrid, track, offer, nav |
| `public/pricing.css` | Mobile stacking: plan, track |
| `public/agents.css` | Mobile stacking: roster, gatebox, stack |
| `scripts/check-site.mjs` | Deterministic regression guardrail for the mobile rules |

## Notes / out of scope

- `audit.html` (not a packet-verified route) shows the same root-cause class at
  390px (128px nowrap `.stat` in `auto 1fr` bandgrid, 4-col `.checks`, nowrap
  `.row` values; scrollWidth 500). Its nav already benefits from the shared.css
  fix. The `.stat`/grid fix was intentionally left out to keep the diff within
  the packet's verified three-route scope; identical pattern available in
  `public/audit.css` if desired.
- Nothing committed/pushed; changes exist only in this candidate worktree.
