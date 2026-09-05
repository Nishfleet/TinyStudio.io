# Candidate report — TinyStudio.io mobile horizontal overflow fix

**Packet:** tinystudio-ux-3 (DeepSeek V4 Flash / high) · **Date:** 2026-08-06

## Result

Fixed. All three public routes now measure `scrollWidth == clientWidth` at 390x844,
with zero elements outside the viewport. Desktop 1280x800 unchanged. No commit,
push, or PR made, per packet constraints.

## Root cause

No responsive breakpoints existed in the public stylesheets. Every page shipped
desktop-only rules that force content wider than 390px:

- **Shell (all routes):** `.wrap` keeps `padding:0 60px` (leaving 270px of usable
  width) and `nav`/`.navlinks` never wrap, so the logo plus four links — including
  the pill CTA "Request an audit" — are laid out at desktop width and spill past
  the viewport (`.navlinks` reached right edge 475-481px on all three routes).
- **Card/grid rules per route:**
  - `/` (`index.css`): `.finding` grid `auto 1fr` with the 132px `white-space:nowrap`
    stat (340px wide) pushes the section body fully off-screen (clipped by the
    section's `overflow:hidden` — hidden, not just scrolled); `.checkgrid` 4-col,
    `.track` 4-col, `.offer` flex with 88px `$2,500` price, `.meta` 3-col, `.spec`
    2-col, `.q` 2-col all overflow.
  - `/pricing` (`pricing.css`): `.plan` 2-col grid whose right column min-content
    (82px `$2,500`) alone exceeds 390; `.track` 4-col, `.q` 2-col overflow.
  - `/agents` (`agents.css`): `.ag` 4-col roster grid (gate badges pushed to
    right edge ~510px), `.gatebox` 2-col, `.stack` 3-col overflow.

## Change

One shared, content-preserving responsive correction: additive `@media
(max-width:760px)` blocks in each route's stylesheet (single-column stacking,
wrapping nav with 10-14px gaps, 20px wrap gutters, size-down only for the two
`white-space`-forced price/stat displays so they fit). No global clipping added
(no new `overflow-x`), no copy/HTML/worker changes, no dependencies.

| File | Change |
| --- | --- |
| `public/shared.css` | Mobile block: `.wrap` gutters 60→20px, wrapping `nav`/`.navlinks`, `.band`/`section`/`footer` spacing (applies to `/pricing`, `/agents`) |
| `public/index.css` | Mobile block: shell + `/` grids (`.meta`, `.finding` + stat 132→56px, `.spec`, `.checkgrid`, `.track`, `.who`, `.offer` + price 88→52px, `.q`, `footer`) |
| `public/pricing.css` | Mobile block: `.plan` 2-col→1-col (right column borders become bottom border), `.plan .big` 82→56px, `.track`, `.q` |
| `public/agents.css` | Mobile block: `.ag` 4-col→1-col, `.gatebox` 2-col→1-col, `.stack` 3-col→1-col |
| `scripts/check-site.mjs` | Responsive regression guard: each route stylesheet must keep its mobile block (`.wrap{padding:0 20px}`, `.navlinks{flex-wrap:wrap}`, per-page grid collapses) or `npm run check` fails |

## Verification (live browser, 390x844 and 1280x800, post-fix)

Measured via real layout (`document.documentElement.scrollWidth` vs `clientWidth`
plus per-element bounding rects in Firefox via the camofox browser):

| Route | Before scrollW/clientW | After scrollW/clientW | Elements outside 390 (post-fix) |
| --- | --- | --- | --- |
| `/` | 575 / 390 | **390 / 390** | none |
| `/pricing` | 475 / 390 (packet: 500 — font-render variance) | **390 / 390** | none |
| `/agents` | 626 / 390 (packet: 624) | **390 / 390** | none |

- Desktop 1280x800: all three routes `1280 / 1280`, zero offenders; nav still one
  row (nav height 66px); `.plan` still 2-col, `.ag` still 4-col, `.stack` still
  3-col, `.gatebox` still 2-col. No regressions.
- Nav "Request an audit" CTA: fits inside viewport at 390px (was at right edge
  481px); at 1280 it sits at right edge 1180px within the 1220px content box.

## Automated checks

- `npm run check` (incl. new responsive guard): **TinyStudio.io Agent Desk checks passed.**
- `npm run test:worker`: 50/50 pass.
- `npm run test:ui`: 1/1 pass.
- `sgscan`: exit 0; only pre-existing warnings (ci.yml mutable tag, pre-existing
  integrity/CSRF/urllib findings) — none in changed files.
- `git diff --stat`: 5 files, 88 insertions, 0 deletions.

## Not done (out of scope per packet)

- No commit / push / PR; no auth, payment, lead, schema, dependency, deploy,
  legal, or pricing changes; audit/specimen/brief-requested pages' page-specific
  grids untouched (shared shell improvements apply to them incidentally).
