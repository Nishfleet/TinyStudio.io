# Brief Requested Page `/brief-requested` — Thank You & Conversion

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/brief-requested'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Contains thank-you / confirmation messaging
- **Only page that may include Google Ads conversion tag** — when `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL` are both configured and well-formed
- If conversion tag is present:
  - Loads `https://www.googletagmanager.com/gtag/js?id=<ID>` async
  - Inline script calls `gtag('config', '<ID>')` and `gtag('event', 'conversion', {'send_to': '<ID>/<LABEL>'})`
  - CSP for this page allows `googletagmanager.com`, `googleadservices.com`, `googleads.g.doubleclick.net`, `google-analytics.com`, `stats.g.doubleclick.net` (see `GOOGLE_ADS_CSP` in worker)
- Security headers present, but with the Google Ads CSP variant when tag is active

## Browser drive (optional)

Open `http://127.0.0.1:8788/brief-requested` and verify:
- Page confirms the appraisal request was received
- If conversion env vars are set, network tab shows gtag requests
- No console errors