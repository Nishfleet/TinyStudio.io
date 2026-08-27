# MSP Page `/msp` — MSP/IT Buyer-Intent Surface

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/msp'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Targets MSP/IT buyers for The Website Appraisal
- Contains email signup form posting to `/api/signups`
- Security headers present (same as homepage)
- No Google Ads conversion tag

## Browser drive (optional)

Open `http://127.0.0.1:8788/msp` and verify:
- Page speaks to MSP/IT audience
- Email form works