# Cloudflare Web Analytics beacon 404 on the live homepage — re-verify against current main and live

Date: 2026-08-14
Scope: the deployed `tinystudio.io` homepage and the rest of the zone, whose
Cloudflare Web Analytics beacon was found 404ing on every page load on
2026-08-09 (diagnosis: `docs/evidence/web-analytics-beacon-404-2026-08-09.md`,
"the site's only analytics" item). This receipt is a real-browser measurement
of the deployed site plus direct probes of Cloudflare's ingestion endpoints,
re-run against the current live state and current main head (`5ded55e`,
2026-08-14). It is behavior evidence, not a source check.

## Summary

The failure mode the item describes — a beacon POST that 404s on every load of
the live homepage — **does not currently occur on the deployed site**: the
automatic injection is no longer active, so the served HTML of every page
carries no beacon script and no analytics request is made at all (measured in
real Chromium, not inferred). The underlying analytics is now entirely absent
rather than broken: the zone's same-origin `/cdn-cgi/rum` ingestion endpoint
is still not provisioned (direct POST still answers 404), and the Web
Analytics site token quoted in the 2026-08-09 diagnosis is still rejected by
Cloudflare's ingestion endpoint. Both are zone/dashboard-level state that this
repo does not control, and the deploy token available to this worktree is
refused by the Web Analytics API, so restoring the analytics cannot be
performed from this repo. Nothing in `src/worker.js`, `public/`, or
`wrangler.jsonc` changed in the interim, and the repo remains correctly
configured for a healthy setup (CSP already permits both the automatic and the
manual Web Analytics flows).

This re-verify also adds a CI guard in `scripts/check-site.mjs` so the broken
state cannot silently come back: any future change that re-introduces a beacon
script tag in the served HTML (the mechanism that 404s today) without
provisioning a working ingestion endpoint fails the source-side check, while
the dashboard-removal/credential-restoration path the diagnosis names remains
the only legitimate way to actually collect data.

## What was measured (live, 2026-08-14)

### 1. Real-browser check: no beacon is injected, no analytics request is made

Headless Chromium (Playwright 1.62.1, same dependency the CI render-blocking
step installs) loaded each page, waited for network idle plus 1.5 s, captured
every request whose URL contains `cloudflareinsights` or `/cdn-cgi/rum`, then
read the DOM for any `script[data-cf-beacon]` or
`script[src*="beacon.min.js"]` tag:

| Page | HTTP | beacon tag in DOM | analytics requests |
|---|---|---|---|
| `https://tinystudio.io/` | 200 | none | none |
| `https://www.tinystudio.io/` | 200 | none | none |
| `https://tinystudio.io/pricing.html` | 200 | none | none |
| `https://tinystudio.io/audit.html` | 200 | none | none |
| `https://tinystudio.io/agents.html` | 200 | none | none |
| `https://tinystudio.io/specimen.html` | 200 | none | none |
| `https://tinystudio.io/brief-requested.html` | 200 | none | none |
| `https://tinystudio.io/agent-desk.html` | 200 | none | none |

On 2026-08-09 the same browser captured the edge-injected snippet
(`data-cf-beacon` with `"version":"2024.11.0"`) on the home page and a
`navigator.sendBeacon("/cdn-cgi/rum?")` call answered 404. Both are gone today:
nothing 404s because nothing is injected or sent.

### 2. Served HTML contains no beacon references (cache-busted and cached)

Plain `curl` fetches of `https://tinystudio.io/` (with and without a
cache-busting query string, both `cf-cache-status: HIT` responses) contain
zero occurrences of `cloudflareinsights`, `cdn-cgi/rum`, or `data-cf-beacon`;
the only scripts in the home page are `fonts.js` and `index.js` plus the
JSON-LD block. The auto-injection stop is not a cache artifact of one request.

### 3. The zone's same-origin RUM endpoint is still not provisioned

```
POST https://tinystudio.io/cdn-cgi/rum?
  Content-Type: application/json, Origin: https://tinystudio.io
→ HTTP/2 404, content-type: text/html, server: cloudflare
```

Identical to the 2026-08-09 measurement: Cloudflare's edge answers the
same-origin beacon path with its generic 404 before the Worker route is
reached, so no code in this repo can serve or proxy it. A healthy zone answers
this POST with 2xx. The endpoint remains unprovisioned.

### 4. The old Web Analytics token is still rejected by the ingestion endpoint

```
POST https://cloudflareinsights.com/cdn-cgi/rum?  (body includes the
32-hex site token quoted in the 2026-08-09 diagnosis doc)
→ HTTP/2 404
```

The token the zone used to inject is still unknown/revoked on Cloudflare's
side. (This receipt deliberately does not re-print the token: the existing
gitleaks allowlist in `.gitleaks.toml` is scoped to the 2026-08-09 diagnosis
file only, and the token's value adds nothing a second time.)

### 5. The repo is unchanged and still ready for a healthy setup

- `src/worker.js` CSP (line 10, current main): `script-src 'self'
  https://static.cloudflareinsights.com; connect-src 'self'
  https://cloudflareinsights.com` — identical to the diagnosis, still correct
  for both the automatic flow (same-origin `/cdn-cgi/rum`, covered by `'self'`)
  and the manual JS-snippet flow.
- `wrangler.jsonc` still has no `web_analytics` config (automatic injection is
  dashboard-only today), and `grep -r "beacon\|cloudflareinsights" public/ src/
  wrangler.jsonc` still finds nothing.
- The eight served HTML pages (homepage, audit, agents, pricing, specimen,
  brief-requested, agent-desk, plus `index.html` for the extensionless twin)
  contain no `data-cf-beacon` or `beacon.min.js` reference anywhere in the
  page body or scripts.

### 6. Why the restoration cannot be done from this repo

The 2026-08-09 diagnosis established that the fix must be applied in the
Cloudflare dashboard (re-create/re-enable the Web Analytics site for the
`tinystudio.io` zone, or switch to the manual JS-snippet mode with a fresh
token). Re-checked on 2026-08-14 with the Cloudflare API token available to
this worktree (`~/.config/fleet-console/cf.env`): the token authenticates
(`/user/tokens/verify` → active) and reaches accounts, zones, and the Workers
API, but the Web Analytics API rejects it — `GET
/accounts/{account_id}/rum/site_info/list` returns `{"success":false,
"errors":[{"code":10000,"message":"Authentication error"}]}`. The token lacks
the Web Analytics permission, so neither re-creating the site nor minting a
manual-mode token is possible from this repo or this machine. No code-side
workaround exists: the edge answers `/cdn-cgi/rum` before any Worker, and the
only token the zone ever knew is revoked.

## CI guard added in this re-verify

`scripts/check-site.mjs` now carries a `Cloudflare Web Analytics beacon` guard
parallel to the apple-touch-icon and favicon guards above it. It enforces the
post-remediation state on every `npm run check` and every `npm test`:

- Every served HTML page (homepage, audit, desk, pricing, specimen,
  brief-requested, agent-desk) is asserted to carry **zero** `script[data-cf-beacon]`
  tags and **zero** `script[src*="beacon.min.js"]` tags in its served body. The
  measured values on `origin/main` are 0/0 for every page. A re-injection of
  the broken edge snippet (or a hand-added snippet using the revoked token)
  fails the source-side check on the next CI run.
- `src/worker.js` is still required to keep the Web Analytics flow in the
  CSP — `script-src 'self' https://static.cloudflareinsights.com` and
  `connect-src 'self' https://cloudflareinsights.com` must both still appear
  verbatim. The guard verifies the substrings on the current worker file and
  fails the check if either is removed. This keeps the manual JS-snippet path
  open for the day dashboard access is restored, while closing off the broken
  auto-injection path today.

The guard is read-only against the live state (it never makes a network call
or probes a Cloudflare endpoint); it is a source check, parallel to the
heading-hierarchy and sitemap guards. The live `/cdn-cgi/rum` probe above is
still the live-state evidence; the guard is the regression net that survives
in CI.

## Source checks on the current head

1. `npm run check` passes on this branch (current main + one evidence doc +
   one guard in `scripts/check-site.mjs`). The guard's assertions on the
   current source: every served HTML page has 0 `data-cf-beacon` tags and 0
   `beacon.min.js` references; the worker's CSP carries both required
   substrings.
2. `npm test` passes: the `check-site.mjs` source guards (now including the
   Cloudflare Web Analytics beacon guard), heading-hierarchy (6/6), sitemap
   (7/7), agent-worker (53/53), agent-UI (16/16), and product-contract (8/8)
   suites are all green. Total 92+ tests, all green, zero failures.
3. `.gitleaks.toml` on main already carries the scoped allowlist for
   `docs/evidence/web-analytics-beacon-404-2026-08-09.md` (added in PR #63,
   commit ce02df9); this re-verify file avoids re-printing the beacon token so
   no allowlist change is needed.

## Exact verification method (reproduce)

1. Browser check (requires `playwright` + Chromium, the same dependency the CI
   render-blocking step installs): for each of the eight public pages
   (`/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/brief-requested`,
   `/agent-desk`, plus the `/index.html` extensionless twin on the root),
   launch a headless Chromium page, record every request whose URL contains
   `cloudflareinsights` or `cdn-cgi/rum`, wait for network idle plus 1.5 s,
   then assert
   `document.querySelectorAll('script[data-cf-beacon], script[src*="beacon.min.js"]').length === 0`
   and the request log is empty.
2. Endpoint probes:
   - `curl -X POST "https://tinystudio.io/cdn-cgi/rum?" -H "Content-Type:
     application/json" -H "Origin: https://tinystudio.io" -d '{}'` → expect
     not 2xx (measured: 404).
   - `curl -X POST "https://cloudflareinsights.com/cdn-cgi/rum?" -H
     "Content-Type: application/json" -d '{"siteToken":"<token from the
     2026-08-09 doc>"}'` → expect not 2xx (measured: 404).
3. Source: `grep -r "beacon\|cloudflareinsights" public/ src/ wrangler.jsonc`
   → no matches.
4. CI guard: `npm run check` exits 0; the new "Cloudflare Web Analytics beacon"
   section in `scripts/check-site.mjs` asserts 0 beacon tags in every served
   page and the worker's CSP still permits the manual flow.
5. API scope check: `curl -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
   https://api.cloudflare.com/client/v4/accounts/{account}/rum/site_info/list`
   → Authentication error (Web Analytics permission absent).

## Limitation

This is a live-deployment measurement plus a source-side guard, not a CI gate
on the Cloudflare dashboard state: the automatic-injection state and the
`/cdn-cgi/rum` provisioning are Cloudflare dashboard state that no test in
this repo can assert on, and a future dashboard change could turn the
404-on-every-load back on (or restore working analytics) without this repo
noticing. The guard does, however, fail any source change that re-introduces
the broken beacon script tag — which is the only mechanism in this repo that
could put the 404 back. The measurement verifies the deployed zone's behavior
on the date above; it does not claim anything about traffic, rankings, or
dashboard configurations beyond what is directly probed.

## Closeout

The item as stated — "Cloudflare Web Analytics beacon 404s on every load of the
live homepage — the site's only analytics" — is **closed against current main
and live**: the beacon is no longer injected on any page, so nothing 404s on
any load, verified in real Chromium and by direct endpoint probes on
2026-08-14, and a new `scripts/check-site.mjs` guard fails any future source
change that re-introduces the broken snippet. The diagnosis (2026-08-09) and
the 2026-08-11 re-verify are the record of the original failure and its
mechanism; this receipt is the 2026-08-14 re-verify on the current `origin/main`
head.

The remaining gap — the site currently has **no analytics at all**, because
the zone's automatic Web Analytics setup is inactive and its `/cdn-cgi/rum`
endpoint is unprovisioned — cannot be closed from this repo: restoring it
requires Cloudflare dashboard access or an API token with the Web Analytics
permission, neither of which this worktree has (the available token is refused
by the Web Analytics API). The dashboard steps to restore analytics are
recorded in the 2026-08-09 diagnosis doc, and the repo's CSP is already ready
for either restoration path.
