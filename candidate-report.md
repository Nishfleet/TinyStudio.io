# Candidate Report — TinyStudio.io mobile overflow fix (tinystudio-ux-4)

## Goal

Smallest complete fix for horizontal overflow on the public pages `/`, `/pricing`,
`/agents` at 390 CSS px, preserving the current public story and desktop layout.

## Root cause (measured before)

Served the repo's `public/` via a static server and measured layout in a headless
browser popup at 390px viewport width (same technique as the CDP receipt, which was
reproduced exactly: `/` 575px, `/agents` 626px ≈ receipt's 624px, `/pricing` 475px ≈
receipt's 500px; residual 1–5% difference is font-loading variance).

| Page | Before (scrollWidth) | After (scrollWidth) |
|---|---|---|
| `/` (index.html) | 575 | 390 |
| `/pricing` | 475 | 390 |
| `/agents` | 626 | 390 |

Offenders mapped per page (right-edge overflow beyond 390px):

- **All pages — off-canvas nav**: `.navlinks` (4 links + CTA, gap 34–36px) rendered at
  right edge 475–481px. `.wrap` padding was 60px/side.
- **`/`**: `.offer .price .big` `$2,500` @ 88px (right edge 575 = page scrollWidth);
  `.finding` grid (`auto 1fr`, 132px nowrap stat) pushed the heading/body entirely
  outside its `overflow:hidden` box (536–706px) — body copy invisible on mobile;
  `.checkgrid` 4-col (right edge 552); `.track` 4-col (465); `.spec .browser` mock
  collapsed to 56px wide with its pin flags clipped.
- **`/pricing`**: `.plan` 2-col grid; `.r` price column (304px wide) sat beyond the
  grid's `overflow:hidden` box — `Per month…` and the Delivery guarantee were cut off.
  `.track` 4-col (454).
- **`/agents`**: `.stack` 3-col (right edge 626 = scrollWidth); `.ag` 4-col rows with
  nowrap `Human-approved` gates (up to 510); `.gatebox` 2-col right column clipped
  (416).

## Fix

CSS-only, additive, all inside `@media (max-width:760px)` blocks — desktop byte-for-byte
untouched (verified: at 1547px viewport, `matchMedia('(max-width:760px)')` false,
scrollWidth == clientWidth, `.plan` still 2 columns, nav still one row nowrap).

- `public/shared.css` (pricing/agents/audit/specimen/brief-requested): `.wrap` padding
  → 24px; nav + `.navlinks` wrap (all links and the CTA stay visible and tappable,
  no JS/hamburger); `.phead h1` → 44px; `section h2` → 34px; `.band` padding/type scale.
- `public/index.css` (homepage): same nav/wrap/padding fixes; `.finding` stacks to one
  column with `.stat` at `clamp(64px,22vw,132px)`; `.checkgrid` → 2 columns; `.track` →
  2 columns (decorative top line hidden); `.offer` stacks with `.price` left-aligned and
  `.big` at `clamp(56px,20vw,88px)`; `.spec` stacks; mock pin flags scaled so the
  annotations fit the frame.
- `public/pricing.css`: `.plan` stacks (`1fr`), `.l` border-right → bottom, `.r`
  left-aligned, `.big` clamped; `.track` → 2 columns; `.q` → 1 column.
- `public/agents.css`: `.ag` rows → `56px 1fr` with `.reads`/`.gate` on column 2
  (gates stay on-canvas); `.gatebox` → 1 column; `.stack` → 1 column.

No HTML, JS, worker, wrangler, package, or migration files changed. No dependencies.
No copy or product changes.

## Verification

- After: all three pages report `scrollWidth 390 == clientWidth 390`; zero elements with
  right edge > 392px; zero content clipped by `overflow:hidden` containers (`.finding`,
  `.plan`, `.gatebox`, `.browser` all fully on-canvas — the previously invisible
  finding body and pricing warranty now render).
- Desktop: at 1547px, no overflow, media queries inactive, nav single-row nowrap,
  `.plan` two columns.
- `npm run check` — passed.
- `npm test` (check + worker 50/50 + UI 1/1) — passed.
- `sgscan .` — identical output before/after (11 pre-existing warnings in `worker.js` /
  `study/`, none touched; no secrets/errors introduced).

## Scope compliance

Only `public/{shared,index,pricing,agents}.css` modified (65 insertions, 0 deletions).
Temp measurement harness files were removed. Nothing committed. Desktop 1280 receipt
behavior preserved by construction (media-query-gated).
