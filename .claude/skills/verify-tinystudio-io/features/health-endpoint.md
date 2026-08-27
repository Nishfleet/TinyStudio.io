# Health Endpoint `/health` — Readiness Probe

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/health'
```

## Assertions

- Status 200 (healthy) or 503 (unhealthy)
- Content-Type: `application/json`
- JSON structure:
  ```json
  {
    "ok": true,
    "service": "tinystudio-io-public",
    "surface": "website-appraisal",
    "db": "configured",
    "checks": {
      "db": true,
      "signupsTable": true,
      "ai": true,
      "agentRunsTable": true,
      "usageLimitsTable": true
    },
    "routes": ["tinystudio.io","www.tinystudio.io","app.tinystudio.io","api.tinystudio.io"]
  }
  ```
- `ok: true` **iff** `checks.db == true` AND `checks.signupsTable == true` (the current product's intake path)
- `checks.ai`, `checks.agentRunsTable`, `checks.usageLimitsTable` report legacy Agent Desk machinery state but do NOT affect `ok`
- Security headers present
- No-cache headers: `Cache-Control: no-store`

## Failure modes

- `ok: false`, status 503 when D1 binding missing or `email_signups` table missing
- This is the signal the uptime monitor (`.github/workflows/uptime-health.yml` equivalent) alerts on