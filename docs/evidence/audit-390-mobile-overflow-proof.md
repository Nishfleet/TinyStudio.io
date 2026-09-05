# /audit mobile overflow fix: measured layout proof

Date: 2026-08-06
Scope: the `public/audit.css` mobile treatment (candidate-3) for the 390x844 horizontal overflow regression.

## What this is

Behavioral evidence, measured with a real browser engine against the checked-in files. It is not a static guess and not a substitute for testing the deployed site (see Limitations). The CI source-string guards live in `scripts/check-site.mjs`; the same file carries the optional Chromium layout probe that reproduces the measurements below whenever a browser is available.

## Environment

- Node v22.23.1, Linux (VPS).
- Chromium: Google Chrome for Testing 149.0.7827.55 (Playwright-managed headless shell, `~/.cache/ms-playwright/chromium_headless_shell-1228`).
- Fonts: Fraunces/Karla loaded live from fonts.googleapis.com (measured with `document.fonts.ready`); `fontsStatus` was `loaded` during every run.
- Measurement method: served `public/` over `http://127.0.0.1:<ephemeral>` (node:http), drove Chromium over the DevTools protocol, emulated viewport with `Emulation.setDeviceMetricsOverride` + `setScrollbarsHidden`, then evaluated in-page: `document.documentElement.scrollWidth` vs `clientWidth`, plus every element whose `getBoundingClientRect().right` exceeded the viewport width ("offenders").

## Unfixed failure (HEAD `public/audit.css`, before candidate-3)

Recreated by swapping `git show HEAD:public/audit.css` into the tree and running the probe:

| Viewport | scrollWidth | clientWidth | Offenders |
| --- | --- | --- | --- |
| 390x844 | **567** | 390 | 27 elements past the right edge |

Worst offenders (element right edge vs 390px viewport):

- `div.navlinks` -> 567, `a.navcta` -> 567 (nav escapes the viewport by 177px)
- `div.stat` -> 450 (128px nowrap stat)
- band copy column (`div`, `h2`, `p`, `.note`) -> 704
- check columns 2 and 3 -> 444 and 536 (`.checks` stayed 4 columns)

1280x800 was clean even before the fix (scrollWidth 1280, no offenders).

## Fixed measurements (candidate-3, as checked in)

| Viewport | scrollWidth | clientWidth | Offenders | checks cols | bandgrid cols | stat font-size |
| --- | --- | --- | --- | --- | --- | --- |
| 390x844 | **390** | **390** | 0 | 1 | 1 | 81.9px (clamp 72-128) |
| 1280x800 | **1280** | **1280** | 0 | 4 | 2 | 128px |

Desktop proof at 1280x800: no overflow, `.checks` still 4 columns, `.bandgrid` still 2 columns, `.stat` still 128px — the media query is additive and leaves desktop layout untouched.

## How to reproduce

```sh
# 1. Behavioral probe (runs automatically when a Chromium binary is found):
npm run check
#   -> "[layout probe] 390x844: scrollWidth=390 clientWidth=390 offenders=0 checks=1 bandgrid=1 stat=81.9px"
#   -> "[layout probe] 1280x800: scrollWidth=1280 clientWidth=1280 offenders=0 checks=4 bandgrid=2 stat=128px"

# 2. Prove the probe detects the regression (recreate the unfixed failure):
cp public/audit.css /tmp/audit.css.fixed
git show HEAD:public/audit.css > public/audit.css
npm run check   # expected: FAIL - scrollWidth 567 != clientWidth 390, offenders listed
cp /tmp/audit.css.fixed public/audit.css

# 3. Chromium discovery order: $CHROME_PATH, then $PATH (chromium,
#    chromium-browser, google-chrome, google-chrome-stable, chrome), then the
#    Linux Playwright browser cache (~/.cache/ms-playwright/...).
```

Without a browser the probe prints `[layout probe] SKIPPED: no Chromium found...` and exits 0; the source-string guards still run. That is the CI situation (GitHub Actions has no Chrome), so CI enforces the static guards only.

## Limitations

- Local/live proof is not CI proof: the measurements are real but run against a local static render; the probe auto-skips where no browser exists, so CI does not re-verify layout behavior.
- This is not a test of the hosted/live deployment — no claim about what tinystudio.io serves.
- Font metrics can vary by environment and network; assertions are font-robust (no font-width thresholds), but exact pixel numbers above reflect this environment.
- Measured with Chrome for Testing 149; other engines may differ slightly.
