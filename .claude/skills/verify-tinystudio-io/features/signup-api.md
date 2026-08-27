# Signup API `/api/signups` — Email Intake

## HTTP drive (JSON)

```bash
curl -fsS -X POST 'http://127.0.0.1:8788/api/signups' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","website":"https://example.com"}'
```

## Assertions (JSON)

- Status 201 on first signup in month
- Response: `{"ok":true,"message":"signal_saved"}`
- Security headers present
- Rate limited: 6 per calendar month (returns 409 with `{"ok":false,"error":"intake_closed",...}` on 7th+)
- Invalid email returns 400 with `{"ok":false,"error":"invalid_email"}`
- Missing email returns 400
- Storage failure returns 503 with `{"ok":false,"error":"storage_unavailable"}`

## HTTP drive (HTML form submit)

```bash
curl -fsS -X POST 'http://127.0.0.1:8788/api/signups' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -H 'Accept: text/html' \
  -d 'email=test@example.com&website=https://example.com'
```

## Assertions (HTML)

- Status 303 redirect to `/brief-requested` on success
- Status 303 redirect to `/?signal=invalid` on invalid email
- Status 409 with closed-intake HTML page when monthly cap reached

## CORS / Origin checks

- Same-origin form posts allowed
- Cross-site JSON posts blocked (403 `cross_site_blocked`)
- Cross-site form posts blocked (403 `cross_site_blocked`) unless from allowed origin
- `OPTIONS` preflight returns 200 with `{"ok":true}`

## Database verification (remote)

```bash
wrangler d1 execute tinystudio_email_signups --remote \
  --command "SELECT email, source, page_path, created_at, updated_at FROM email_signups WHERE email='test@example.com' ORDER BY updated_at DESC LIMIT 1" \
  --json
```

- Row exists with `source = "website-appraisal"`
- `page_path` reflects the referring page