# Cloudflare Web Analytics beacon 404 on the live homepage — re-verify against current main and live

Date: 2026-08-12
Scope: the deployed `tinystudio.io` homepage and the rest of the zone, whose
Cloudflare Web Analytics beacon was found 404ing on every page load on
2026-08-09 (diagnosis: `docs/evidence/web-analytics-beacon-404-2026-08-09.md`,
"the site's only analytics" item) and was measured absent-but-still-broken on
2026-08-11 (`docs/evidence/web-analytics-beacon-404-reverify-2026-08-11.md`).
This receipt is a real-browser measurement of the deployed site plus direct
probes of Cloudflare's ingestion endpoints, re-run against the current live
state and current main head (18128e8, 2026-08-12). It is behavior evidence,
not a source check.

## Summary

The failure mode the item describes — a beacon POST that 404s on every load of
the live homepage — **still does not occur on the deployed site**: the
automatic injection remains off, so the served HTML of every page carries no
beacon script and no analytics request is made at all (measured in real
Chromium, not inferred). The site's analytics remains **entirely absent**
rather than broken: the zone's same-origin `/cdn-cgi/rum` ingestion endpoint is
still not provisioned (direct POST still answers 404), and the Web Analytics
site token quoted in the 2026-08-09 diagnosis is still rejected by Cloudflare's
ingestion endpoint. Both are zone/dashboard-level state that this repo does not
control, and the deploy token available to this worktree is still refused by
the Web Analytics API (`Authentication error` on the `rum/site_info/list`
endpoint), so restoring the analytics still cannot be performed from this
repo. Nothing in `src/worker.js`, `public/`, or `wrangler.jsonc` changed in the
interim, and the repo remains correctly configured for a healthy setup (CSP
already permits both the automatic and the manual Web Analytics flows).

## What was measured (live, 2026-08-12)

### 1. Real-browser check: no beacon is injected, no analytics request is made

Headless Chromium (Playwright 1.62.1) loaded each page, waited for network
idle, captured every request to `cloudflareinsights.com`,
`static.cloudflareinsights.com`, and the same-origin `/cdn-cgi/rum` path, then
read the DOM for any `script[data-cf-beacon]` or `script[src*="beacon.min.js"]`
tag:

| Page | HTTP | beacon tag in DOM | analytics requests |
|---|---|---|---|
| `https://tinystudio.io/` | 200 | none | none |
| `https://www.tinystudio.io/` | 200 | none | none |
| `https://tinystudio.io/pricing.html` | 200 | none | none |

Identical to the 2026-08-11 measurement: nothing 404s on any load because
nothing is injected or sent. (On 2026-08-09 the same browser captured the
edge-injected snippet with a revoked token and a `navigator.sendBeacon(
"/cdn-cgi/rum?")` call answered 404.)

### 2. Served HTML contains no beacon references (cache-busted)

Plain `curl` fetches of `https://tinystudio.io/?cb=20260812` and
`https://www.tinystudio.io/?cb=20260812` (cache-busting query string,
`Cache-Control: no-cache`) contain zero occurrences of `cloudflareinsights`,
`cdn-cgi/rum`, or `data-cf-beacon`; the only scripts in the home page are
`fonts.js` and `index.js` plus the JSON-LD block. The auto-injection-off state
is not a cache artifact.

### 3. The zone's same-origin RUM endpoint is still not provisioned

```
POST https://tinystudio.io/cdn-cgi/rum?
  Content-Type: application/json, Origin: https://tinystudio.io
→ HTTP/2 404, content-type: text/html, server: cloudflare
```

Identical to both prior measurements: Cloudflare's edge answers the
same-origin beacon path with its generic 404 before the Worker route is
reached, so no code in this repo can serve or proxy it. A healthy zone answers
this POST with 2xx. The endpoint remains unprovisioned — but since nothing
injects a beacon, no browser ever hits it.

### 4. The old Web Analytics token is still rejected by the ingestion endpoint

Re-probed against `POST https://cloudflareinsights.com/cdn-cgi/rum?` with the
32-hex site token quoted in the 2026-08-09 diagnosis doc (read from git, never
re-printed here — the gitleaks allowlist in `.gitleaks.toml` is scoped to that
diagnosis file only):
→ HTTP/2 404

The token the zone used to inject is still unknown/revoked on Cloudflare's
side.

### 5. The repo is unchanged and still ready for a healthy setup

- `src/worker.js` CSP (line 10, current main): `script-src 'self'
  https://static.cloudflareinsights.com; connect-src 'self'
  https://cloudflareinsights.com` — identical to both prior receipts, still
  correct for both the automatic flow (same-origin `/cdn-cgi/rum`, covered by
  `'self'`) and the manual JS-snippet flow.
- `wrangler.jsonc` still has no `web_analytics` config (automatic injection is
  dashboard-only today), and `grep -r "beacon\|cloudflareinsights" public/
  src/ wrangler.jsonc` still finds only the CSP allowlist entries.
- The full test suite is green on this branch (see below).

### 6. Why the restoration still cannot be done from this repo

Re-checked on 2026-08-12 with the Cloudflare API token available to this
worktree (`~/.config/fleet-console/cf.env`): the token authenticates
(`/user/tokens/verify` → active) and reaches accounts and zones, but the Web
Analytics API rejects it — `GET
/accounts/{account_id}/rum/site_info/list` returns `{"success":false,
"errors":[{"code":10000,"message":"Authentication error"}]}`. The token lacks
the Web Analytics permission, so neither re-creating the site nor minting a
manual-mode token is possible from this repo or this machine. No code-side
workaround exists: the edge answers `/cdn-cgi/rum` before any Worker, and the
only token the zone ever knew is revoked. The dashboard steps to restore
analytics are recorded in the 2026-08-09 diagnosis doc.

### 7. Independent lane-1 re-verification and acceptance verdict (2026-08-12)

An independent headless-Chromium run (this lane, Playwright 1.62.1, fresh
session, the same method as section 1) re-measured the deployed site:

| Page | viewport | HTTP | beacon tag in DOM | analytics requests | console errors |
|---|---|---|---|---|---|
| `https://tinystudio.io/` | 1280x900 | 200 | none | none | 0 |
| `https://tinystudio.io/` | 390x844 | 200 | none | none | 0 |
| `https://tinystudio.io/pricing.html` | 1280x900 | 200 | none | none | 0 |
| `https://www.tinystudio.io/` | 1280x900 | 200 | none | none | 0 |

Against the item's acceptance criteria — fresh live loads of `/` on desktop
and mobile report zero console errors, and the beacon either demonstrably
collects (dashboard receipt) or is removed from the zone configuration — the
criterion is met on this run: zero console errors on `/` at 1280x900 and
390x844, and the beacon is absent from the zone configuration (no edge
injection, no beacon tag in the served HTML, no analytics request fired). A
direct `POST https://tinystudio.io/cdn-cgi/rum?` probe still answers the edge's
generic 404, but no browser request ever reaches it while the injection stays
off. Only the dashboard-side receipt / analytics restoration remains
(actions in the 2026-08-09 diagnosis doc, restored to this branch so the
reference chain is complete on main).

## Source checks on the current head

1. `npm test` passes on this branch (current main + this receipt): the
   `check-site.mjs` source guards, heading-hierarchy (6/6), sitemap (7/7),
   agent-worker (53/53), agent-UI (16/16), and product-contract (8/8) suites
   are all green. This doc is the only diff from main.
2. `.gitleaks.toml` on main already carries the scoped allowlist for
   `docs/evidence/web-analytics-beacon-404-2026-08-09.md` (added in PR #63,
   commit ce02df9); this re-verify file avoids re-printing the beacon token so
   no allowlist change is needed.
3. `src/worker.js` CSP is unchanged from the diagnosis (checked directly in
   this source read; see section 5).

## Exact verification method (reproduce)

1. Browser check (requires `playwright` + Chromium, the same dependency the CI
   render-blocking step installs): for each of `https://tinystudio.io/`,
   `https://www.tinystudio.io/`, `https://tinystudio.io/pricing.html`, launch
   a headless Chromium page, record every request whose URL contains
   `cloudflareinsights` or `cdn-cgi/rum`, wait for network idle plus 1.5 s,
   then assert `document.querySelectorAll('script[data-cf-beacon],
   script[src*="beacon.min.js"]').length === 0` and the request log is empty.
2. Endpoint probes:
   - `curl -X POST "https://tinystudio.io/cdn-cgi/rum?" -H "Content-Type:
     application/json" -H "Origin: https://tinystudio.io" -d '{}'` → expect
     not 2xx (measured: 404).
   - `curl -X POST "https://cloudflareinsights.com/cdn-cgi/rum?" -H
     "Content-Type: application/json" -d '{"siteToken":"<token from the
     2026-08-09 doc>"}'` → expect not 2xx (measured: 404).
3. Source: `grep -r "beacon\|cloudflareinsights" public/ src/ wrangler.jsonc`
   → only the CSP allowlist in `src/worker.js`.
4. API scope check: `curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   https://api.cloudflare.com/client/v4/accounts/{account}/rum/site_info/list`
   → Authentication error (Web Analytics permission absent).

## Limitation

This is a live-deployment measurement, not a CI gate: the automatic-injection
state and the `/cdn-cgi/rum` provisioning are Cloudflare dashboard state that
no test in this repo can assert on, and a future dashboard change could turn
the 404-on-every-load back on (or restore working analytics) without this repo
noticing. The measurement verifies the deployed zone's behavior on the date
above; it does not claim anything about traffic, rankings, or dashboard
configurations beyond what is directly probed.

## Closeout

The item as stated — "Cloudflare Web Analytics beacon 404s on every load of the
live homepage — the site's only analytics" — remains **closed against current
main and live**: the beacon is not injected on any page, so nothing 404s on
any load, verified in real Chromium and by direct endpoint probes on
2026-08-12. The diagnosis (2026-08-09) and the first re-verify (2026-08-11)
are the record of the original failure and its mechanism; this receipt
confirms the state is unchanged a day later.

The remaining gap — the site currently has **no analytics at all**, because
the zone's automatic Web Analytics setup is inactive and its `/cdn-cgi/rum`
endpoint is unprovisioned — cannot be closed from this repo: restoring it
requires Cloudflare dashboard access or an API token with the Web Analytics
permission, neither of which this worktree has (the available token is refused
by the Web Analytics API). The dashboard steps to restore analytics are
recorded in the 2026-08-09 diagnosis doc, and the repo's CSP is already ready
for either restoration path.
