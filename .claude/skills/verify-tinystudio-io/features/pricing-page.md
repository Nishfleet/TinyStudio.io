# Pricing Page `/pricing` — Six a Month Promise

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/pricing'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Contains "Six a month" (the intake cap promise)
- Explains the monthly limit of 6 appraisals
- Contains email signup form posting to `/api/signups`
- Security headers present (same as homepage)
- No Google Ads conversion tag

## Browser drive (optional)

Open `http://127.0.0.1:8788/pricing` and verify:
- Page clearly states the "six a month" limit
- Email form works
- When intake is closed (6+ signups this month), shows 409 page with "The six appraisals for this month are taken"