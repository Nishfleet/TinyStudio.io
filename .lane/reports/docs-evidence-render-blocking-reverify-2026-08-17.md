# Lane 1 — dogfood b8f6046e942a re-verification (2026-08-17)

Finding: "Render-blocking resources on home" (dogfood run
20260808T074205Z-msk2fl3n).

## Verdict

**The font stylesheet loads non-blocking on all six public pages, in CI and
on live — the finding stays closed, and no code change was needed.**

## What this lane checked

The finding was originally fixed by PR #20 (commit c5599bc: preload the
Google Fonts css2 URL as a style resource, promote it via the same-origin
`public/fonts.js` script, keep a `<noscript>` fallback, drop the `@import`
from `shared.css`) and enforced in CI by PR #23 (`npm run
check:render-blocking`, real Chromium under the production CSP). It has been
re-verified against live on 2026-08-09, 2026-08-10, 2026-08-11, 2026-08-13
and 2026-08-14.

Since the 2026-08-14 re-verification (head 0ff0694), the commits that landed
on main were: 05efed1 (retire the duplicate www host), e0ee160 (Web
Analytics beacon close-out), 2d8599a (hero-mock viewport CSS), 51d5849 and
ffc1672 (domain-valuation intent bridge), c447585 (llms.txt/offer.md clean
buyer URLs), 0e7373f (email autocomplete on lead forms), 798cd71 (retired
Agent Desk canonical off the apex root) and the docs-only re-verification
receipts. None touched the font loading shape (no new head resources in the
six public pages, no stylesheet/`@import` changes). One page-path note: the
Agent Desk retirement lands the desk page at `/agents`; `/desk` itself now
returns a JSON 404, so the desk measurement below uses the current served
path `/agents`.

The lane therefore re-ran the same verification the finding demands, on the
current origin/main head (798cd71) and against the live deployment:

1. **Browser check passes** — `npm run check:render-blocking` on the current
   working tree (real Chromium, production CSP, css2 intercepted and delayed
   2500ms, stubbed response): all six pages PASS — css2 non-blocking,
   first-contentful-paint never waits for it (homepage 356ms, audit 120ms,
   desk 280ms, pricing 96ms, specimen 156ms, brief-requested 300ms; the
   css2 response arrives at 2500ms, i.e. ~2.2–2.4s after first paint), no
   render-blocking resources other than the site's own same-origin
   stylesheets, promoted sheet applied.

2. **Full suite passes** — `npm test`: static source guards ("TinyStudio.io
   checks passed") plus heading hierarchy (6), sitemap (7), agent-worker
   (80), agent-UI (16), product-contract (8), first-viewport-audience (4) —
   121 tests, 0 failures. `git diff --check` is clean.

3. **Live re-measurement** in real Chromium (unthrottled), served with the
   production CSP header emitted by the worker (verified via
   `curl -sI https://tinystudio.io/`):

   | Page | css2 renderBlockingStatus | FCP (ms) | css2 responseEnd (ms) | Render-blocking resources | Fonts load (Karla / Fraunces) | Promoted sheet applied |
   |---|---|---|---|---|---|---|
   | index.html (home) | non-blocking | 232 | 180 | same-origin index.css only | yes / yes | yes |
   | audit.html | non-blocking | 192 | 159 | same-origin shared.css, audit.css | yes / yes | yes |
   | agents.html (desk, served at /agents) | non-blocking | 208 | 104 | same-origin shared.css, agents.css | yes / yes | yes |
   | pricing.html | non-blocking | 164 | 140 | same-origin shared.css, pricing.css | yes / yes | yes |
   | specimen.html | non-blocking | 176 | 97 | same-origin shared.css, specimen.css | yes / yes | yes |
   | brief-requested.html | non-blocking | 160 | 108 | same-origin shared.css, brief-requested.css | yes / yes | yes |

   On the unthrottled live run the preloaded css2 (a non-blocking style
   preload, fetched at preload priority from the first byte) can finish
   before first-contentful-paint lands (homepage 232ms FCP vs 180ms css2
   end; desk 208ms vs 104ms) — the same ordering every earlier live run
   showed. That is timing, not blocking: the deterministic delayed-css2 run
   above paints ~2.2–2.4s before the css2 response arrives, so first paint
   cannot be waiting on it.

4. **No source/live drift** — the six live pages fetched through real
   Chromium are byte-identical to `public/` on this head, so the deployed
   HTML and the guarded source cannot drift without changing the served
   bytes.

## Files touched

- `docs/evidence/render-blocking-fonts-2026-08-08.md` — appended the
  2026-08-17 closeout re-verification receipt (the finding's established
  closeout pattern: source check + live measurement, no code change when
  the guarantee already holds).

## Why the earlier receipts did not cover this

The 2026-08-14 receipt verified head 0ff0694. This receipt re-checks the
browser guarantee, the CI guard and the live served bytes on the current
head (798cd71) and against the live site on 2026-08-17. Nothing changed in
the font loading region since the 2026-08-14 receipt, so the finding remains
closed with no code change.