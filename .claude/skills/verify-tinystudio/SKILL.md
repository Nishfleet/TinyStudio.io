---
name: verify-tinystudio
description: Launch, health-check, drive, and prove TinyStudio.io (The Website Appraisal + the human-reviewed desk) locally. Use before claiming any change to the public site works end-to-end.
---

TinyStudio.io (repo `TinyStudio.io`) is a Cloudflare Worker that serves the public
`tinystudio.io` / `www.tinystudio.io` family: the homepage, the Website Appraisal
flow, the human-reviewed desk, pricing, specimen, the MSP/IT buyer-intent page at
`/msp`, the legacy `/agent-desk` surface, the agent-readable truth at `/llms.txt`
and `/offer.md`, and the email-signup API at `/api/signups`. Single file: `src/worker.js`.
Storage: one D1 database (`tinystudio_email_signups`, binding `DB`) declared in
`wrangler.jsonc`. Workers AI binding (`env.AI`) is read by the legacy
`/api/agent-audit` endpoint; in local dev it is `not supported`, which is the
honest, intended state — local proof of the legacy endpoint only covers the
guard rails (validation, rate limit, storage failure paths), not generation.

Agents doing E2E verification MUST use this harness instead of improvising a
launch, and whoever ships a feature updates the matching file in `features/`
in the same PR. The harness is repo-local so the public site, the legacy
self-serve Agent Desk, and the retired app/api surfaces can all be proven in
one place without inventing a new launch each time.

## LAUNCH

### Primary — local deterministic server (use this)

```bash
mkdir -p /tmp/verify-tinystudio
./node_modules/.bin/wrangler dev --local \
  --ip 127.0.0.1 --port 8790 \
  --persist-to /tmp/verify-tinystudio > /tmp/verify-tinystudio/server.log 2>&1 &
echo $! > /tmp/verify-tinystudio/server.pid
```

What it does, in order:

1. Reads `wrangler.jsonc` and prepares a local D1 SQLite store at
   `/tmp/verify-tinystudio/v3/`. The `DB` binding becomes the local
   `tinystudio_email_signups` database; the `AI` binding is reported as
   `not supported` (Cloudflare Workers AI does not run inside the local
   workerd runtime, and the legacy `/api/agent-audit` endpoint will answer
   `ai_unavailable` / 503 — that is the local truth, not a misconfiguration).
2. Applies the migrations under `migrations/` against the local D1 store so
   the `email_signups`, `agent_runs`, and `agent_usage_limits` tables exist
   before any drive. Run this once per fresh `/tmp/verify-tinystudio` dir:

   ```bash
   ./node_modules/.bin/wrangler d1 migrations apply tinystudio_email_signups \
     --local --persist-to /tmp/verify-tinystudio
   ```

3. Starts `workerd` on `http://127.0.0.1:8790` and prints
   `[wrangler:info] Ready on http://127.0.0.1:8790`.

- Base URL: `http://127.0.0.1:8790`. Loopback only — Cloudflare routes this
  host family through a real zone in production, and the dev server is
  loopback by design.
- Readiness: `curl -fsS http://127.0.0.1:8790/` returns 200. Allow up to 60s
  for the first request; the Worker pulls the static assets from
  `public/` on first hit and the Cloudflare Vite plugin then warms the
  asset cache.
- Launch it in the background with stdout+stderr captured to a log file,
  and record the PID so cleanup can target the process group.

### Secondary — real-provider dev (visual only)

```bash
npm run dev
```

Wrangler's `dev` script uses `--remote`, so the dev server hits the real
Cloudflare D1 and AI bindings, and persists to `/tmp/tinystudio-agent-worker`.
Results are not deterministic and the dev server can fail closed if the
remote bindings are unavailable. Use it for visual checks only, never for
pass/fail assertions. Never run it and the local server on the same port at
the same time.

### Never

- `wrangler deploy` — that is a release. The safe-deploy wrapper is the
  only path that may push to production; the harness is local-only.
- `wrangler dev --remote` as a pass/fail signal — the real-provider path
  must not be the source of truth for "did this PR work".
- `npm run preview` — TinyStudio is a Worker, not a Vite SPA, and there is
  no preview script in `package.json`.

## DOCTOR

`GET /health` — edge-only JSON. Healthy means HTTP 200 with `ok:true` and
every value in `checks` true:

- `db` — `env.DB` is bound.
- `signupsTable` — the `email_signups` table exists (the current-product
  intake path depends on it).
- `ai` — `env.AI` is bound. In `--local` mode the binding is `true` even
  though the runtime cannot serve generation; the binding's presence is
  what `/health` checks. The 503 vs 200 split on the legacy
  `/api/agent-audit` is enforced by the endpoint itself, not by `/health`.
- `agentRunsTable`, `usageLimitsTable` — the legacy Agent Desk tables
  exist. They must remain operational, even though the desk is retired.

```bash
curl -fsS http://127.0.0.1:8790/health
# {"ok":true,"service":"tinystudio-io-public","surface":"website-appraisal",
#  "db":"configured","checks":{...},"routes":[...]}
```

A `local D1 without migrations` worker answers 503 with `ok:false` and
`checks.signupsTable:false`. The fix is the migrations step in LAUNCH, not a
code change.

Page-level proof the instance is actually usable — the Worker returns full
SSR HTML for every indexable page, so curl + grep is a legitimate check and
a browser is only needed for interaction or visual proof:

```bash
for path in / /audit /agents /pricing /specimen /msp; do
  printf "%-12s %s\n" "$path" "$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:8790$path")"
done
```

## DRIVE

Per-feature steps live in `features/`:

| Feature | File |
| --- | --- |
| Homepage `/` | `features/homepage.md` |
| Website Appraisal flow `/audit` | `features/audit.md` |
| Human-reviewed desk `/agents` | `features/agents.md` |
| Pricing `/pricing` | `features/pricing.md` |
| Specimen report `/specimen` | `features/specimen.md` |
| MSP/IT buyer-intent page `/msp` | `features/msp.md` |
| Email signup intake `/api/signups` | `features/signup.md` |
| Legacy self-serve Agent Desk `/agent-desk` + `/api/agent-audit` | `features/legacy-agent-desk.md` |
| Machine-readable truth `/llms.txt` and `/offer.md` | `features/llms-offer.md` |

Two drive styles:

- **HTTP drive** — curl against the SSR HTML. Enough for CI-less proof on a
  server, and it sees everything the Worker rendered.
- **Browser drive** — an interactive browser tool. Required for anything
  about clicking, focus, keyboard, or visual layout. The repo's
  `scripts/test-narrow-viewport.mjs` Playwright checks are the closest the
  repo has to a real browser drive; run them with `npm run test:narrow`
  and `npm run test:narrow-pages`.

### Deterministic inputs on the 8790 server

- `GET /` — 200, `<title>TinyStudio — The Website Appraisal</title>`,
  `<link rel="canonical" href="https://tinystudio.io/">`, and the
  `data-ai-question` question blocks are all rendered.
- `GET /audit` — 200, contains the appraisal CTA.
- `GET /agents` — 200, the legacy agent stack section is present.
- `GET /pricing` — 200, the price `2,500 a month` and the three-month
  minimum are present.
- `GET /specimen` — 200, the study link to the
  `eighty-eight`-site analysis is present.
- `GET /msp` — 200, the MSP/IT buyer-intent copy is present, and the
  primary CTA funnels into the same `audit` form the homepage uses.
- `GET /llms.txt` — 200, `text/plain`, declares TinyStudio's current
  offer is The Website Appraisal and that the Agent Desk is retired.
- `GET /offer.md` — 200, `text/markdown`, mirrors the same product
  truth.
- `GET /sitemap.xml` — 200, exactly the five HTML pages plus
  `/llms.txt` and `/offer.md` (the same set the test-sitemap test
  asserts in `scripts/test-sitemap.mjs`).
- `GET /agent-desk` — 200, the legacy self-serve Agent Desk surface.
  The page is noindex and never linked from current product copy; it
  must still render and not 500.
- `GET /robots.txt` — 200, points at the sitemap.
- `GET /favicon.ico` — 200, `image/x-icon` (legacy fallback that serves
  the bytes of `public/favicon.svg` so old clients and crawlers stop
  404-ing).
- `POST /api/signups` with JSON
  `{"email":"<unique>@example.com","source":"verify-harness","pagePath":"/audit"}`
  — 200, `{"ok":true,"message":"signal_saved"}`. The row lands in the
  local D1 `email_signups` table; query it with
  `wrangler d1 execute tinystudio_email_signups --local
   --persist-to /tmp/verify-tinystudio --command "SELECT email, source,
   page_path FROM email_signups WHERE source='verify-harness' ORDER BY
   updated_at DESC LIMIT 5" --json`.

### Test-only surfaces — never drive these

The retired `app.tinystudio.io` and `api.tinystudio.io` host names route
to the worker's `retiredAppResponse` / `retiredApiResponse` in
production. **`wrangler dev --local` does NOT honor the Host header the
way the production routing layer does** — the workerd process answers
every request with `url.hostname === "127.0.0.1"` regardless of the
incoming `Host:`, so a curl with `-H "Host: app.tinystudio.io"` lands
on the regular Worker and gets the homepage, not the retired notice.
The retirement pages therefore CANNOT be proven in local dev. They are
proven in production by the live `https://app.tinystudio.io/`
(response contains `<h1>The old TinyStudio app has been retired</h1>`)
and the live `https://api.tinystudio.io/` (response is the retired-API
JSON). Document the production proof in the PR; do not pretend local
dev proved it.

The legacy `/api/agent-audit` endpoint exists for the same reason the
legacy `/agent-desk` does: it is operational legacy, not the current
product. Local proof of that endpoint only covers the validation and
rate-limit guard rails (a malformed payload returns 400 `invalid_input`;
an oversized body returns 413 `request_too_large`; the endpoint requires
`POST` and answers 405 on anything else). Generation itself answers
503 `ai_unavailable` in local dev because `env.AI` is not supported
inside workerd; the production endpoint generates against the real
Workers AI models listed in `AGENT_MODELS` in `src/worker.js`.

## EVIDENCE

**Server log.** App logs are single-line JSON on the dev server's
stdout/stderr, secrets redacted. There is no log file otherwise — the
captured launch log IS the log evidence.

**DB state (read-only).**

```bash
./node_modules/.bin/wrangler d1 execute tinystudio_email_signups --local \
  --persist-to /tmp/verify-tinystudio \
  --command "SELECT email, source, page_path, created_at, updated_at FROM email_signups ORDER BY updated_at DESC LIMIT 5" \
  --json
```

**HTML proof.** Save the fetched SSR HTML, or the matching excerpt, for
every drive. The same files are what the repo's `scripts/check-site.mjs`
and `scripts/test-product-contract.mjs` unit checks assert on, so saving
the HTML lets you cross-check the static contract at the same time.

**Screenshots** (browser drives): `/`, `/audit`, `/agents`, `/pricing`,
`/specimen`, `/msp`, and the feature under test.

**What counts as proof:** readiness 200 + doctor pass + the feature's
observable state from its `features/` file, captured to files. A claim
in a transcript is not proof.

Store evidence OUTSIDE the repo tree — under `/tmp/verify-tinystudio/`
or the caller's evidence directory. Never commit evidence into this
repo.

## CLEANUP

Kill the dev server by its recorded PID, and kill the process group:
workerd children survive a bare SIGINT. Never `pkill` by matching
command text — the fleet-wipe lessons check (fleet-ops#533) forbids
substring command-line matching because it has killed the wrong
process more than once. Use the PID file and the process group:

```bash
kill -- -"$(ps -o pgid= -p "$(cat /tmp/verify-tinystudio/server.pid)" | tr -d ' ')" 2>/dev/null
lsof -i :8790   # must print nothing
```

- `/tmp/verify-tinystudio/` (the local D1 store) may be deleted in full
  on the next launch; the LAUNCH block above re-prepares it. Never
  delete it while the dev server is still running, or wrangler will hold
  a deleted file handle and the next migration will fail.
- Leave `node_modules`, `package-lock.json`, `migrations/`, `public/`,
  and `src/` untouched. Do not run `npm run typecheck` or `wrangler
  deploy --dry-run` as part of cleanup — neither is needed for local
  proof, and the deploy dry-run emits telemetry that can shadow
  evidence.
- Cleanup preserves evidence. Teardown never deletes the captured log,
  HTML, screenshots, or DB-query output under `/tmp/verify-tinystudio/`.
