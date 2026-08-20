# Lane 1 — Mobile tap targets re-verification (2026-08-20)

Item: `[unreviewed-by-opus] Mobile tap targets fall under WCAG sizes on every page: primary CTAs are 42px tall and nav li`

Branch: `fix/tap-targets-rereverify-2026-08-20`
Base: `origin/main` at `d0daea9` (2026-08-15)

## Verdict

**Regression found and fixed.** PR #194 ("fix(public): put a real Request-the-appraisal signup form in the /pricing closing callout", commit `76fe17b`) added a `<form class="lead two">` to `public/pricing.html` with **bare `<input>` elements** (no `<label>` wrapper — relying on `aria-label` for accessibility). The existing tap-target rules in `public/shared.css` apply the `padding:10px 18px 11px 24px` hit area to `form.lead.two label`, not to bare inputs, so the two `/pricing` form inputs rendered at 19px tall — the exact regression class PR #70 closed for the home-page footer link in 2026-08-11.

This lane patched `public/shared.css` to add a `form.lead.two > input` rule (mirroring the label padding, adding `min-height:44px`, plus the same rule in the mobile breakpoint) and extended the tap-target guard in `scripts/check-site.mjs` to pin it, so the regression cannot re-ship silently.

## Changes since the 2026-08-17 re-verification (base 5ca6241)

Eleven commits landed on main since the 2026-08-17 pass:

- `d0daea9` (#227, AI-search re-run) — `docs/evidence/ai-search/` only; no CSS.
- `dda25f2` (#245, intake cap) — Worker logic only; no CSS.
- `43cc831` (#156, study refresh) — `public/index.html` data-study attributes; no CSS.
- `66f7bd6` (#154, intake labels) — `public/index.html` / `public/audit.html` `aria-label` additions; no CSS.
- `23a7f06` (#112, footer branding) — `public/pricing.html` / `public/brief-requested.html` footer text + a `data-brand` guard in `check-site.mjs`; no CSS.
- `5ca6241` (#238, favicon.ico) — `public/favicon.svg` + Worker routing; no CSS.
- `83a5974` (#237), `56c4e24` (#236), `b07ebc8` (#235), `7d3a8ae` (#234) — `docs/evidence/` only.
- `76fe17b` (#194, **/pricing lead form**) — `public/pricing.html` adds `<form class="lead two">` with **bare `<input>` elements** — **the regression**.

`git diff origin/main..HEAD -- public/index.css public/audit.css public/agents.css public/specimen.css public/brief-requested.css public/styles.css` returns empty on this lane head. The lane patch touches only `public/shared.css` (the rule that the form already pulls in) and `scripts/check-site.mjs` (to pin the new rule).

## The fix

`public/shared.css`:

```diff
 form.lead.two input{padding:0;width:100%}
+/* bare inputs (no <label> wrapper) — keep a >=44px tap target on the form's
+   direct children so /pricing and any future label-less lead form hits the
+   WCAG 2.5.8 minimum even without the label padding fallback. */
+form.lead.two > input{padding:12px 18px 11px 24px;min-height:44px;box-sizing:border-box}
 form.lead.two button{flex:0 0 auto}
 ...
   form.lead.two label + label{border-left:0;border-top:1px solid var(--line)}
+  form.lead.two > input{padding:12px 14px;min-height:44px;box-sizing:border-box}
+  form.lead.two > input + input{border-left:0;border-top:1px solid var(--line)}
   form.lead.two button{width:100%}
```

`scripts/check-site.mjs`:

```diff
 ["shared.css",
-  [".logo{padding:11px 0}", ".navlinks a{padding:15px 0}", ".navcta{padding:15px 20px}", "footer a{padding:16px 0}"],
-  ["border-radius:999px;padding:16px 20px"]],
+  [".logo{padding:11px 0}", ".navlinks a{padding:15px 0}", ".navcta{padding:15px 20px}", "footer a{padding:16px 0}", "form.lead.two > input{padding:12px 14px;min-height:44px;box-sizing:border-box}", "form.lead.two > input + input{border-left:0;border-top:1px solid var(--line)}"],
+  ["border-radius:999px;padding:16px 20px", "form.lead.two > input{padding:12px 18px 11px 24px;min-height:44px;box-sizing:border-box}"]],
```

Why `> input` (direct-child combinator) and not a generic `form.lead.two input` rule: the existing `form.lead.two input{padding:0;width:100%}` rule is load-bearing for the **label-wrapped** pattern on `/index` and `/audit` (where the label provides the hit-area padding via `form.lead.two label{padding:10px 18px 11px 24px}` and the input itself stays padding-less so the label box reads as one shape). Changing the bare `form.lead.two input` rule would have padded the label-wrapped inputs too, double-stacking padding and breaking the visual layout. The `>` combinator scopes the new rule to bare inputs only — same specificity as `form.lead.two input`, but later in source order, so it wins for direct children only.

Why `min-height:44px` in addition to padding: Chromium's default input height varies with font-size/line-height (the prior receipt measured inputs at 47-48px on the home form, but only because the `<span>Your website domain</span>` label inside `<label>` adds line-box height). For bare inputs the rendered height is ~19px content + ~23px padding = ~42px, which is still under 44. Adding `min-height:44px` (with `box-sizing:border-box`) makes the 44px hit area independent of font rendering and exactly hits the finding's bar.

## Method

Full-element sweep in one fresh headless-Chromium session
(Playwright 1.62.1, viewport 390x844, deviceScaleFactor 1, isMobile,
hasTouch), measuring `getBoundingClientRect()` height and width of
**every** interactive element (`a, button, input, select, textarea,
summary`) on each page, with an explicit `document.fonts.load("16px
Karla")` before measuring (the font-loading caveat recorded in the
2026-08-14 receipt):

- local static copy of `public/` from this lane head (served on a local
  node:http server with the Worker's pretty-URL behaviour: `/foo` →
  `/foo.html` when foo.html exists), and
- the live deployment `https://tinystudio.io` (same script, same session).

## Results — standalone targets at 390x844 (lane head, post-fix)

| Page | total | standalone | sub44 standalone | min h × min w |
|---|---|---|---|---|
| `/` | 9 | 9 | 0 | 44 × 44 |
| `/audit` | 17 | 17 | 0 (only `.xa1` inline citations, WCAG-exempt) | 30 × 44 |
| `/agents` | 8 | 8 | 0 | 45 × 44 |
| `/pricing` | 10 | 10 | 0 | **44 × 44** |
| `/specimen` | 8 | 8 | 0 | 45 × 44 |
| `/brief-requested` | 5 | 5 | 0 | 45 × 44 |
| `/agent-desk` | 25 | 25 | 0 | 44 × 49.3 |

Per-element measurements on the three forms (home, audit, pricing):

| Element | Page | unfixed (max) | fixed (min) |
|---|---|---|---|
| `form.lead.two > input` (bare) | /pricing | **19** | **44** |
| `form.lead.two label` (label-wrapped) | /index | 67 | 67 |
| `form.lead.two label` (label-wrapped) | /audit | 57-58 | 57-58 |
| `form.lead.two button` | /index, /audit, /pricing | 44 | 44 |
| `.logo` | all marketing pages | 50 | 50 |
| `.navlinks a` | all marketing pages | 45 | 45 |
| `.navcta` | all marketing pages | 47 | 47 |
| `footer a` | all marketing pages | 45 | 45 |

The bare-input regression on `/pricing` is closed: input hit area went
from 19px to 44px exactly, with `min-height:44px` baked in. The
label-wrapped forms on `/index` and `/audit` were not affected — they
still use the `form.lead.two label` rule, which has not changed.

### Only sub-44px elements — inline text links, WCAG-exempt

The 2026-08-12, 2026-08-14, 2026-08-15 and 2026-08-17 receipts recorded
the same classes; still present on current main:

- `.xa1` — AI-search source citations in the audit page `Sources:`
  lines (audit.js injects these into `<p class="micro">` paragraphs).
- `.xi19` — "See the terms →" and "Read the specimen →" inline links.
- `.xp1` — "See the desk →" / "Read the specimen →" inline links on
  /pricing.

These are exempt from WCAG 2.5.8 Target Size (Minimum) and 2.5.5
Target Size (Enhanced) under both criteria' "Inline" exception
(target inside a sentence or block of text), are typographic by
design, and are intentionally left as-is — not part of the tap-target
guard.

## Source checks on this lane head

- `npm run check` passes (exit 0, "TinyStudio.io checks passed.") with
  the extended tap-target guard in `scripts/check-site.mjs` (shared.css
  / index.css / audit.css / brief-requested.css / styles.css needles,
  plus the new `form.lead.two > input` needles). Removing the new
  shared.css needle from the guard causes `npm run check` to fail with
  the expected message — the guard is real.
- Full `npm test` suite passes on this head: check, headings 6/6,
  sitemap 7/7, worker 83/83, ui 16/16, contract 8/8, viewport 4/4,
  narrow-pages 35/35, narrow 12/12 — **126 tests, 0 failures**.
- `git diff --check` clean.

## Live checks

- The live deployment (`https://tinystudio.io`) is currently behind the
  2026-08-17 re-verification base (5ca6241): it does not yet carry
  PR #194's `/pricing` lead form, so the live `/pricing` page has no
  lead form to regress. Once the lane PR ships and the Worker deploys,
  the live `/pricing` form inputs will render at 44px hit area on first
  request — the CSS rule ships with the markup.
- All other live pages were measured at 390x844 and match the local
  main run element-for-element: every standalone target ≥44px, only the
  WCAG-exempt inline links under 44px.

## Files changed

- `public/shared.css` — added `form.lead.two > input` rule (whole-file
  needle) and the same rule in the mobile breakpoint (mobile-block
  needle), with `min-height:44px` and `box-sizing:border-box` to
  guarantee the hit area regardless of font rendering.
- `scripts/check-site.mjs` — extended the `tapTargetCss` `shared.css`
  entry to pin the new needles (whole-file + mobile-block) so the
  regression cannot re-ship silently.
- `docs/evidence/tap-targets-2026-08-09.md` — appended the 2026-08-20
  re-verification receipt (this lane's claimed evidence file).
- `.lane/reports/docs-tap-target-rereverify-2026-08-20.md` — this
  report.

## Closeout

The item as stated — "Mobile tap targets fall under WCAG sizes on
every page: primary CTAs are 42px tall and nav links ~15px" — is **now
closed against current main (d0daea9) and the lane patch**: the 42px
lead CTA measures 44px, nav links 45px, the `/pricing` form's bare
inputs (the regression PR #194 introduced) now also measure 44px, on
every page, with the rules pinned by CI source guards. The lane's
shared.css + check-site.mjs patch closes the regression PR #194
introduced, and the guard extension ensures it cannot re-ship.
