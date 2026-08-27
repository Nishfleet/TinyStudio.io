---
name: verify-tinystudio-io
description: Launch, health-check, drive, and prove the TinyStudio.io public website (The Website Appraisal) locally. Use before claiming any TinyStudio.io change works end-to-end.
---

TinyStudio.io (repo `TinyStudio.io`) is a Cloudflare Workers app — npm, Node 20+, D1 bound as `DB`, AI binding present but not used by the current product. The current product is **The Website Appraisal** — a free leak audit of high-ticket service homepages, reviewed by a person — served from static assets with worker-first routing. The retired self-serve Agent Desk machinery remains in code but is not the current product.

Agents doing E2E verification MUST use this harness instead of improvising a launch, and whoever ships a feature updates the matching file in `features/` in the same PR.

## LAUNCH

### Primary — deterministic local dev server (use this)

```bash
npm run dev
```

What it does:

1. Starts `wrangler dev --remote --ip 127.0.0.1 --port 8788 --persist-to /tmp/tinystudio-agent-worker`.
2. Uses remote bindings (production D1, production AI) — preferred because it needs no local setup.
3. Serves static assets from `./public` with worker-first routing (`run_worker_first: ["/*"]`).

- Base URL: `http://127.0.0.1:8788`. Loopback only — never use `localhost`.
- Readiness: `curl -fsS http://127.0.0.1:8788/health` returns 200 with `{"ok":true,"service":"tinystudio-io-public",...}`. Allow up to 60s for first cold start.
- Launch it in the background with stdout+stderr captured to a log file, and record the PID.

```bash
mkdir -p /tmp/verify-tinystudio-io
npm run dev > /tmp/verify-tinystudio-io/server.log 2>&1 &
echo $! > /tmp/verify-tinystudio-io/server.pid
```

### Fallback — local mode (when remote auth is unavailable)

`wrangler dev --remote` needs Cloudflare credentials. In a non-interactive
environment without a `CLOUDFLARE_API_TOKEN`, use local mode instead. The
current product (The Website Appraisal) does not use the AI binding, so the
local AI "not supported" warning is harmless.

```bash
# Apply migrations to the local D1 simulator first (one-time per persist dir):
npx wrangler d1 migrations apply tinystudio_email_signups --local \
  --persist-to /tmp/tinystudio-local-proof

# Launch:
npx wrangler dev --local --ip 127.0.0.1 --port 8788 \
  --persist-to /tmp/tinystudio-local-proof \
  > /tmp/verify-tinystudio-io/server.log 2>&1 &
echo $! > /tmp/verify-tinystudio-io/server.pid
```

Readiness is the same: `curl -fsS http://127.0.0.1:8788/health` returns 200
with `ok:true` once the local D1 has the `email_signups` table.

### Never

- `npm run preview` — `vite preview` does not exist; this is a pure Worker, not a Vite app.
- `npm run build` — there is no build step; `wrangler deploy` uploads the worker directly.

## DOCTOR

`GET /health` — edge-only, asserts the current product's intake path (D1 `email_signups` table). Healthy means HTTP 200 with `ok:true`, `service:"tinystudio-io-public"`, `surface:"website-appraisal"`, `db:"configured"`, and `checks.signupsTable == true`.

```bash
curl -fsS http://127.0.0.1:8788/health
# {"ok":true,"service":"tinystudio-io-public","surface":"website-appraisal","db":"configured","checks":{"db":true,"signupsTable":true,"ai":true,"agentRunsTable":true,"usageLimitsTable":true},"routes":["tinystudio.io","www.tinystudio.io","app.tinystudio.io","api.tinystudio.io"]}
```

Page-level proof the instance is actually usable — SSR returns full HTML (assets served via worker), so curl + grep is a legitimate check:

```bash
curl -fsS 'http://127.0.0.1:8788/' | grep -c 'The Website Appraisal'
curl -fsS 'http://127.0.0.1:8788/audit' | grep -c 'leak audit'
curl -fsS 'http://127.0.0.1:8788/pricing' | grep -c 'Six a month'
```

## DRIVE

Per-feature steps live in `features/`:

| Feature | File |
| --- | --- |
| Homepage `/` (The Website Appraisal) | `features/homepage.md` |
| Audit page `/audit` | `features/audit-page.md` |
| Pricing page `/pricing` | `features/pricing-page.md` |
| Agents page `/agents` | `features/agents-page.md` |
| Specimen page `/specimen` | `features/specimen-page.md` |
| MSP page `/msp` | `features/msp-page.md` |
| Brief requested `/brief-requested` | `features/brief-requested.md` |
| Agent Desk `/agent-desk` (retired) | `features/agent-desk.md` |
| Signup API `/api/signups` | `features/signup-api.md` |
| Health endpoint `/health` | `features/health-endpoint.md` |

Two drive styles:

- **HTTP drive** — curl against the SSR HTML. Enough for CI-less proof on a server, and it sees everything the worker rendered.
- **Browser drive** — Playwright or an interactive browser tool. Required for anything about clicking, focus, keyboard, or JS behavior.

### Deterministic inputs on the 8788 server

Fully deterministic on a plain anonymous request, no headers:

- `GET /` → 200, contains "The Website Appraisal", contains "leak audit", navigation links to `/audit`, `/pricing`, `/agents`.
- `GET /audit` → 200, contains "leak audit", contains email signup form posting to `/api/signups`.
- `GET /pricing` → 200, contains "Six a month", contains the monthly intake promise.
- `GET /api/signups` (POST with valid email) → 201 JSON `{ok:true,message:"signal_saved"}` or 303 redirect to `/brief-requested` for HTML accept.
- `GET /health` → 200, `ok:true`, `surface:"website-appraisal"`.

The retired self-serve Agent Desk surfaces are not the current product:

- `/agent-desk` on the main host → 200, serves the static `public/agent-desk.html` page (noindex, no navigation links to it from the current site). The page itself states the self-serve desk is retired.
- `app.tinystudio.io` host → 410 HTML (`retiredAppResponse`).
- `api.tinystudio.io` host → 410 JSON (`retiredApiResponse`).
- `/api/agent-audit` → still a functioning legacy AI endpoint (uses the `AI` binding). Not the current product; do not drive it for appraisal verification.

### Test-only surfaces — never drive these

- The AI binding is only exercised by the legacy `/api/agent-audit` path. Do not drive it for the current product.

## EVIDENCE

**Server log.** App logs are single-line JSON on the dev server's stdout/stderr, secrets redacted. The captured launch log IS the log evidence.

**DB state (read-only, remote).**

```bash
wrangler d1 execute tinystudio_email_signups --remote \
  --command "SELECT email, source, page_path, created_at, updated_at FROM email_signups ORDER BY updated_at DESC LIMIT 10" \
  --json
```

**HTML proof.** Save the fetched SSR HTML, or the matching excerpt, for every drive.

**Screenshots** (browser drives): `/`, `/audit`, `/pricing`, and the feature under test.

**What counts as proof:** readiness 200 + doctor pass + the feature's observable state from its `features/` file, captured to files. A claim in a transcript is not proof.

Store evidence OUTSIDE the repo tree — a run directory under `/tmp`, or the caller's evidence directory. Never commit evidence into this repo.

## CLEANUP

Kill the dev server by its recorded PID, and kill the process group: workerd children survive a bare SIGINT. Never `pkill` by matching command text.

```bash
kill -- -"$(ps -o pgid= -p "$(cat /tmp/verify-tinystudio-io/server.pid)" | tr -d ' ')" 2>/dev/null
lsof -i :8788   # must print nothing
```

- `/tmp/tinystudio-agent-worker` may be deleted or left in place; the next `dev` run reuses it.
- Leave `node_modules`, `package-lock.json`, and any `.tsbuildinfo` untouched. Do not run `npm run typecheck` as part of cleanup — this repo has no TypeScript build step.
- Cleanup preserves evidence. Teardown never deletes the captured log, HTML, screenshots, or DB-query output.