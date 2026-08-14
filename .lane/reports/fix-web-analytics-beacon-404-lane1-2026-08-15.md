# Lane 1 — Cloudflare Web Analytics beacon 404 closeout (2026-08-15)

Item: "Cloudflare Web Analytics beacon 404s on every load of the live homepage — the site's only analytics" (dogfood 455ee8966b).

## What I found

The item was already diagnosed and closed by earlier lane receipts, and a previous
lane-1 run had built the full closeout (evidence doc + CI regression guard) on branch
`fix/web-analytics-beacon-404-reverify-2026-08-14` — but never opened a PR for it, so
the finished work was sitting unmerged. My run re-verified the finding against the
current origin/main head (2d8599a) and live, then landed that work as a fresh PR.

## What I measured (2026-08-15, live + source)

1. **Real-browser check (Playwright Chromium, all 8 served pages)** — every page
   (`/`, `www`, `/pricing.html`, `/audit.html`, `/agents.html`, `/specimen.html`,
   `/brief-requested.html`, `/agent-desk.html`) loads 200, carries **0** beacon tags,
   and makes **0** analytics requests. The failure mode the item describes (a beacon
   POST 404ing on every load) no longer occurs: the zone's auto-injection is inactive.
2. **Endpoint probes** — `POST https://tinystudio.io/cdn-cgi/rum?` still answers
   Cloudflare's generic HTML 404 (not the worker's JSON 404), so the zone's
   same-origin RUM endpoint remains unprovisioned; the old site token is still
   rejected by `cloudflareinsights.com` (404). The analytics is absent, not broken.
3. **API-scope check** — the fleet token (`~/.config/fleet-console/cf.env`) is active
   (`/user/tokens/verify` → active) but the Web Analytics API rejects it
   (`/rum/site_info/list` → `Authentication error`), so restoring analytics genuinely
   cannot be done from this repo or this machine. This matches the prior receipts.
4. **CI guard negative test** — temporarily injecting the broken 2026-08-09 snippet
   into `public/index.html` makes the new `check-site.mjs` guard fail with exit 1 and
   two clear messages; restoring the file returns to clean. The guard catches
   re-injection.
5. **Test suite** — `npm test` all green (121 tests, 0 failures), including the new
   "Cloudflare Web Analytics beacon" guard; `npm run check` → "TinyStudio.io checks
   passed."

## What I changed

- `docs/evidence/web-analytics-beacon-404-reverify-2026-08-14.md` — re-verify receipt
  (real-browser measurement, endpoint probes, API-scope check, closeout), from the
  prior lane-1 run, cherry-picked onto current main.
- `scripts/check-site.mjs` — "Cloudflare Web Analytics beacon" CI guard asserting 0
  beacon tags in every served page and the worker CSP still permits both
  cloudflareinsights hosts (manual JS-snippet path stays open), from the prior lane-1
  run, cherry-picked onto current main.
- `.lane/reports/fix-web-analytics-beacon-404-lane1-2026-08-15.md` — this report.

## Outcome

The item is closed: the 404-on-every-load symptom no longer occurs (verified in real
Chromium and by probes on 2026-08-15), and a CI guard now fails any source change that
re-introduces the broken snippet. The remaining gap — the site has **no analytics at
all** because the zone-level Web Analytics setup is inactive and its `/cdn-cgi/rum`
endpoint is unprovisioned — requires Cloudflare dashboard access or a Web Analytics
API token, which this worktree does not have; the dashboard remediation steps are
recorded in `docs/evidence/web-analytics-beacon-404-2026-08-09.md`. PR opened from
branch `fix/web-analytics-beacon-404-lane1-2026-08-15`.
