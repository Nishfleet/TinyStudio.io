# Audit Page `/audit` — Leak Audit Landing Page

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/audit'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Contains "leak audit" (the core promise)
- Contains email signup form posting to `/api/signups`
- Form has email input with `name="email"` and optional `website` field
- Form submits to `/api/signups` with `method="POST"`
- Security headers present (same as homepage)
- No Google Ads conversion tag (only on `/brief-requested`)

## Browser drive (optional)

Open `http://127.0.0.1:8788/audit` and verify:
- Page explains the leak audit service
- Email form works and submits correctly
- On success, redirects to `/brief-requested`
- On invalid email, shows error or redirects with `?signal=invalid`