# Homepage `/` — The Website Appraisal

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Contains "The Website Appraisal" (exact phrase, the product name)
- Contains "leak audit" (the core promise)
- Contains navigation links to `/audit`, `/pricing`, `/agents`
- Contains email signup form posting to `/api/signups`
- Security headers present: `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`
- CSP does not allow `unsafe-inline` scripts or styles

## Browser drive (optional)

Open `http://127.0.0.1:8788/` and verify:
- Hero section renders with the appraisal promise
- Email input accepts text and submits to `/api/signups`
- Navigation works to `/audit`, `/pricing`, `/agents`
- No console errors