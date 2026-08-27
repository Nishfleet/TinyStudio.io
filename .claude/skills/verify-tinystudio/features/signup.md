# Email signup intake — `/api/signups`

The intake endpoint behind the audit, agents, msp, and brief-requested
forms. Persists the email plus lightweight usage metadata to the
D1 `tinystudio_email_signups.email_signups` table; the response is
either JSON for fetch-style callers or an HTML redirect for the
plain-form callers. Enforces the `MAX_APPRAISALS_PER_MONTH` ("six a
month") ceiling, and the per-IP daily rate limit.

The endpoint's `source` and `page_path` columns are NOT body
parameters. `source` is hard-coded to `APPRAISAL_SURFACE`
(`"website-appraisal"`) for this endpoint, and `page_path` is
derived from the `Referer` request header by `signupPagePath()` in
`src/worker.js`, falling back to `/api/signups` when no Referer is
present. The `website` field is the only body field beyond `email`
that is read (`normalizeWebsite(body.website)`), and it is optional.

## How users reach it

Every form on the public site (the audit page, the MSP page, the
brief-requested redirect target) posts to this endpoint. There is no
direct UI on the homepage pointing at the JSON path.

## How to drive it

JSON drive (the path the harness uses):

1. `POST /api/signups` with `Content-Type: application/json` and
   `{"email":"<unique>@example.com"}` and a `Referer: http://127.0.0.1:8790/audit`
   header — expect 201 (the create) with
   `{"ok":true,"message":"signal_saved"}`. The Referer is what makes
   the stored `page_path` resolve to `/audit`; without it the column
   falls back to `/api/signups`.
2. The row appears in the local D1 `email_signups` table with
   `source = "website-appraisal"` (the value of `APPRAISAL_SURFACE`)
   and `page_path = "/audit"` (from the Referer). Query it:

   ```bash
   ./node_modules/.bin/wrangler d1 execute tinystudio_email_signups --local \
     --persist-to /tmp/verify-tinystudio \
     --command "SELECT email, source, page_path, referer FROM email_signups WHERE email LIKE 'verify-%@example.com' ORDER BY updated_at DESC LIMIT 5" \
     --json
   ```

3. `POST` with a malformed email — expect 400
   `{"ok":false,"error":"invalid_email"}`. The Worker also offers an
   HTML redirect on form-encoded callers; the JSON path is the
   harness's path.
4. `GET /api/signups` — expect 405 `method_not_allowed`. The intake is
   POST-only.
5. `OPTIONS /api/signups` — expect 200 `{"ok":true}` (CORS preflight).
6. The "six a month" ceiling: after `MAX_APPRAISALS_PER_MONTH` JSON
   signups in a single calendar month from the same dev server, the
   next request returns 409 `intake_closed` and the response message
   reads `The six appraisals for this month are taken. The intake is
   closed until the next.`. In local dev, the counter lives in the
   `agent_usage_limits` table; if the table does not exist the
   endpoint answers 503 `storage_unavailable` (this is why LAUNCH
   applies the migrations before any drive).
7. A storage failure (no `env.DB` binding) returns 503
   `storage_unavailable`. In local dev this is only reproducible by
   launching the server without the D1 binding; the harness's normal
   launch path is to run with `--local` and the `DB` binding always
   present, so the storage-failure path is a documented guard rail,
   not a routine assertion.

```bash
EMAIL="verify-$(date +%s)@example.com"
curl -fsS -X POST \
  -H "Content-Type: application/json" \
  -H "Referer: http://127.0.0.1:8790/audit" \
  -d "{\"email\":\"$EMAIL\"}" \
  http://127.0.0.1:8790/api/signups
# {"ok":true,"message":"signal_saved"}

curl -s -o /dev/null -w "GET %{http_code}\n" http://127.0.0.1:8790/api/signups
# 405

curl -s -o /dev/null -w "OPTIONS %{http_code}\n" -X OPTIONS http://127.0.0.1:8790/api/signups
# 200
```

## What proves success

- A 201 JSON response on a clean POST.
- The new row is readable from the local D1 database with
  `source = "website-appraisal"` and `page_path` equal to the
  Referer's pathname (or `/api/signups` if no Referer).
- The 405 on GET, the 200 on OPTIONS, and the 400 on a malformed
  email all match the worker's documented guard rails.
- The intake-closed (409) and storage-unavailable (503) responses
  are reachable, even if not exercised on every drive (these are
  regression-class signals, not routine ones).

## Local honesty note

- The "six a month" counter is a per-month bucket. The harness must
  reset the counter (or use a fresh `/tmp/verify-tinystudio` dir)
  to run a clean intake drive, or it will see 409 on every call
  after the sixth in a given month.
- The form-encoded HTML-redirect path returns 200 with a 302
  redirect; the JSON path returns 201. Both are correct for their
  respective callers.
- The intake is the only current-product dependency on D1. If a
  PR breaks D1 wiring, `/api/signups` is the first place that
  fails — the `/health` endpoint reports the wiring state
  separately, and the audit/msp pages render fine without D1
  (their forms just submit against a broken backend).
- The `source` and `page_path` columns in `email_signups` are set
  by the worker, not by the request body. Do not extend the API
  to take them as inputs without first changing `saveEmailSignup`
  in `src/worker.js`; the worker unit test suite
  (`scripts/test-agent-worker.mjs`) asserts the schema and
  would catch the change.
