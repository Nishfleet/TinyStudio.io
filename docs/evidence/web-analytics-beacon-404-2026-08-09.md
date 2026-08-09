# Cloudflare Web Analytics beacon 404s on every load of the live homepage — diagnosis and required remediation

Date: 2026-08-09
Scope: the deployed `tinystudio.io` homepage (and by extension every page of the zone,
which receives the same auto-injected beacon). Item: "Cloudflare Web Analytics beacon
404s on every load of the live homepage — the site's only analytics".
This receipt records a real-browser measurement of the deployed site plus direct probes
of Cloudflare's ingestion endpoints. It is behavior evidence, not a source check.

## Summary

The site's only analytics — Cloudflare Web Analytics — is broken at the Cloudflare
dashboard/zone level, not in this repo. The zone's automatic-injection setting keeps
injecting the Web Analytics beacon with a **revoked/stale site token**, and the zone's
same-origin `/cdn-cgi/rum` ingestion endpoint is **not provisioned**, so Cloudflare's
edge answers the beacon's data POST with `404 Not Found` on every page load and no
analytics data is ever collected. Nothing in `src/worker.js`, `public/`, or
`wrangler.jsonc` controls the injection, the token, or the `/cdn-cgi/rum` endpoint —
all three are zone-level Cloudflare configuration. The fix must be applied in the
Cloudflare dashboard (steps below); no code change in this repo can restore the
beacon.

## What was measured (live, 2026-08-09)

### 1. The injected beacon and where it sends data

A real Chromium session loading `https://tinystudio.io/` receives an edge-injected
snippet (Cloudflare automatic setup — the string appears in the served HTML only, and
is **not** present anywhere in this repo; `grep -r "beacon\|cloudflareinsights" public/
src/ wrangler.jsonc` finds nothing):

```html
<script type="module"
  src="https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae34746b4dedf0b4dfa099e1781791509496"
  integrity="sha512-ZE9pZaUXND66v380QUtch/5sE9tPFh2zg45pR2PB0CVkCtOREv2AJKkSidISWkysEuQ0EH8faUU5du78bx87UQ=="
  data-cf-beacon='{"version":"2024.11.0","token":"9787ae152b2d48348a688d0f6e73a878","r":1}'
  crossorigin="anonymous"></script>
```

The current beacon script (its own `versions.js` reports `"2026.6.0"`) decides where to
POST as follows (decompressed from the served `beacon.min.js`):

```js
b = p.send && p.send.to
  ? p.send.to
  : void 0 === p.version ? "https://cloudflareinsights.com/cdn-cgi/rum" : null
// ...
sendObjectBeacon("", data, cb, !1, b)   // b === null here, so:
// o = i || `/cdn-cgi/rum?${t}`  →  same-origin relative path `/cdn-cgi/rum?`
```

Because the auto-injected config carries `"version":"2024.11.0"`, `b` is `null` and the
beacon POSTs to the **same-origin relative path** `/cdn-cgi/rum?` — i.e.
`https://tinystudio.io/cdn-cgi/rum?`. This matches Cloudflare's documented automatic
setup: "Using a domain proxied through Cloudflare with automatic setup will report stats
back to your own domain's `/cdn-cgi/rum` endpoint."

Captured in the browser by hooking `navigator.sendBeacon` and then backgrounding the
tab (the beacon sends on the load event and when the page becomes hidden):

```
{"m":"sendBeacon","u":"/cdn-cgi/rum?","ct":"application/json"}
```

### 2. The beacon's POST is answered with 404 by Cloudflare's edge

```
POST https://tinystudio.io/cdn-cgi/rum?   (Content-Type: application/json, Origin/Referer: https://tinystudio.io)
→ HTTP/2 404
  content-type: text/html; charset=UTF-8
  x-frame-options: SAMEORIGIN          ← Cloudflare's generic error page
  server: cloudflare
  cf-ray: <zone PoP ray>
```

The response is Cloudflare's own generic 404 error page, **not** the worker's 404
(which is JSON with the worker's security headers — `x-frame-options: DENY`,
`Content-Security-Policy`, etc.). The edge answers `/cdn-cgi/rum` before the Worker
route (`tinystudio.io/*` with `run_worker_first`) is ever reached, so no code in
`src/worker.js` can intercept or proxy this request. A healthy zone answers the
same-origin beacon POST with 2xx and returns `405` (with `Allow: POST, OPTIONS`) only
for non-POST methods; a **404 for POST means the zone's RUM endpoint is not
provisioned**.

### 3. The zone's analytics token is rejected by Cloudflare's ingestion endpoint

The token carried by the injected snippet (`9787ae152b2d48348a688d0f6e73a878`) is
rejected by Cloudflare's own ingestion endpoint, while a known-live token is accepted:

| Request (POST, JSON body incl. `siteToken`) | Result |
|---|---|
| `https://cloudflareinsights.com/cdn-cgi/rum?` with token `9787ae152b2d48348a688d0f6e73a878` (tinystudio.io) | **404** |
| Same with `Origin`/`Referer` = `https://www.tinystudio.io` | **404** |
| `https://cloudflareinsights.com/cdn-cgi/rum?` with token `0e4e2cbcce704d70ae3734c3c001ebca` (live Web Analytics site for pages.cloudflare.com) | **204** |
| `OPTIONS` preflight on the same endpoint | 200 (endpoint is alive) |

Conclusion: the token the zone keeps injecting is unknown/revoked on Cloudflare's side
(the analytics site was deleted or its automatic setup is stale), and the zone's
same-origin `/cdn-cgi/rum` processing is inactive. Both are dashboard-level state.

### 4. Repo state is already correct for a healthy setup

- `src/worker.js` CSP: `script-src 'self' https://static.cloudflareinsights.com;
  connect-src 'self' https://cloudflareinsights.com` — this correctly permits both the
  automatic flow (same-origin `/cdn-cgi/rum`, covered by `'self'`) and the manual flow
  (`cloudflareinsights.com`), and permits loading `beacon.min.js`.
- `wrangler.jsonc` contains no `web_analytics` config; the `web_analytics` Worker
  binding is not present in wrangler 3.100+/4.x config schemas — automatic injection is
  a dashboard-only feature today.
- No beacon script, token, or analytics reference exists in `public/`, `src/`, or
  `wrangler.jsonc`.

## Required remediation (Cloudflare dashboard — requires account access)

Nothing in this repo can fix the 404; the following dashboard steps are required
(recommended order):

1. Open the Web Analytics page in the Cloudflare dashboard
   (`dash.cloudflare.com` → Web Analytics) and open **Manage site** for the
   `tinystudio.io` site.
2. **Re-create or re-enable the site/automatic setup** for the `tinystudio.io` zone:
   the cleanest path is to delete the broken site entry and re-add the hostname
   through "Select a hostname from the drop-down menu" (automatic setup), which
   provisions the zone's `/cdn-cgi/rum` endpoint and issues a fresh token. (The
   alternative "Enable with JS Snippet installation" mode requires embedding the
   snippet manually in `public/*.html`; the CSP above already permits that flow, but
   the same-origin automatic mode is preferable for a zone fully served by a Worker.)
3. Verify: `POST https://tinystudio.io/cdn-cgi/rum?` returns 2xx (not 404), the
   injected snippet carries the new token, and page-view data appears in the Web
   Analytics dashboard within a few minutes.
4. The `Cache-Control: public, max-age=0, must-revalidate` header already in use is
   fine — automatic injection is happening (verified), so the `public, no-transform`
   caveat from the Web Analytics FAQ does not apply here.

If dashboard access is unavailable, the item cannot be completed: the 404 will persist
on every load until the zone-level Web Analytics state is repaired. No code-side
workaround exists because (a) the edge answers `/cdn-cgi/rum` before the Worker, and
(b) the only token known to the zone is rejected by Cloudflare's ingestion endpoint.
