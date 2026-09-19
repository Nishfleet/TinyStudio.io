# Legacy self-serve Agent Desk — `/agent-desk` + `/api/agent-audit`

The retired self-serve Agent Desk, kept operational as a legacy
surface. The desk page is served from `public/agent-desk.html` through
the `PUBLIC_ASSET_PATHS` allow-list (the page is noindex and never
linked from current product copy; it must still render). The
generation endpoint is `POST /api/agent-audit`, guarded by the
worker's input validation, request-size cap, and per-email / per-IP
rate limit. The desk uses the `env.AI` Workers AI binding; the local
dev server does not run Workers AI inside workerd, so the endpoint
exercises the guard rails (validation, rate limit, storage failure
paths) but the AI call itself returns empty, which the endpoint
honestly surfaces as `502 empty_agent_output` after the model
attempts fail. Production runs the same endpoint against the real
Workers AI models listed in `AGENT_MODELS` in `src/worker.js`.

The seven specialist names that the desk page enumerates — `Offer
Agent`, `Funnel Agent`, `Creative Agent`, `Qualification Agent`,
`Follow-Up Agent`, `CRM Agent`, `Tracking Agent` — are asserted on
`agent-desk.html` by `scripts/check-site.mjs` `requiredAgentStack`.
The current `/agents` Desk page intentionally does NOT list them
(covered by `features/agents.md`); the two surfaces are
deliberately separate and the contract enforces that.

## How users reach it

Direct URL only. The current homepage, audit, agents, pricing,
specimen, and msp pages never link to `/agent-desk`. Old deep links
from before the desk retired — bookmarks, third-party directories,
search engines that have not re-crawled the noindex — still resolve.

## How to drive it

1. `GET /agent-desk` — expect 200 and `Content-Type: text/html; charset=utf-8`.
   The page is the legacy self-serve desk UI: the
   `requiredAgentStack` names are all present, and the safety-rail
   copy about no-spend/no-publishing/no-ad-account is in the page
   body.
2. `POST /api/agent-audit` with a malformed JSON body (no
   `email`, no `business`) — expect 400
   `{"ok":false,"error":"invalid_input","message":"Add a valid
   email first."}` in local dev, because validation runs before
   the AI call.
3. `POST /api/agent-audit` with a valid body — validation
   passes, the worker calls `env.AI` for every model in
   `AGENT_MODELS`, and every call returns empty inside workerd
   (Workers AI is not supported in the local runtime). The worker
   surfaces this as 502 `{"ok":false,"error":"empty_agent_output"}`.
   This is the local truth: validation passed, the AI binding
   was reachable, every model attempt produced nothing.
4. `POST /api/agent-audit` with an oversized body (the worker's
   `requestTooLarge` ceiling) — expect 413 `request_too_large`.
5. `GET /api/agent-audit` — expect 405 `method_not_allowed`.
6. `OPTIONS /api/agent-audit` — expect 200 `{"ok":true}` (CORS
   preflight).

```bash
# legacy page renders
curl -s -o /dev/null -w "GET /agent-desk %{http_code}\n" http://127.0.0.1:8790/agent-desk

# all 7 specialist names present
curl -fsS http://127.0.0.1:8790/agent-desk -o /tmp/verify-tinystudio/agent-desk.html
for a in "Offer Agent" "Funnel Agent" "Creative Agent" "Qualification Agent" "Follow-Up Agent" "CRM Agent" "Tracking Agent"; do
  grep -c "$a" /tmp/verify-tinystudio/agent-desk.html
done

# validation guard rail
curl -s -X POST -H "Content-Type: application/json" -d '{}' http://127.0.0.1:8790/api/agent-audit
# {"ok":false,"error":"invalid_input","message":"Add a valid email first."}

# preflight
curl -s -X OPTIONS http://127.0.0.1:8790/api/agent-audit
# {"ok":true}
```

## What proves success

- HTTP 200 on `/agent-desk`.
- All seven specialist names are present on `/agent-desk` (the
  contract that `check-site.mjs` enforces).
- The `/api/agent-audit` endpoint answers 400 on a malformed
  body, 405 on a non-POST method, 200 on OPTIONS, and 502
  `empty_agent_output` on a valid body in local dev (the local
  runtime cannot serve Workers AI and the endpoint is honest
  about the empty result).
- The `503 ai_unavailable` response is reachable only on a
  server launched with no `env.AI` binding — the harness's
  local launch path always binds `AI`, so the 503 is a
  documented guard rail, not a routine assertion in this
  harness.

## Local honesty note

- The legacy endpoint is NOT exercised end-to-end in local dev.
  Production proof is the live `https://tinystudio.io/api/agent-audit`
  against the real `env.AI` binding, where the response carries
  generated content in the `brief` field. Local proof covers the
  guard rails; the harness does not pretend otherwise.
- The retired `app.tinystudio.io` and `api.tinystudio.io` host
  surfaces (different concern, different code path) are also
  out-of-scope for local dev. See SKILL.md "Test-only surfaces —
  never drive these".
- The Agent Desk is described as retired in `MEMORY.md` and the
  product-contract test asserts no current-product page calls it
  the current offer. The desk page itself is allowed to be the
  desk; that is not a contract violation.
