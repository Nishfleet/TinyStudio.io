# Specimen Page `/specimen` — Example Audit Output

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/specimen'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Shows a specimen/example of the Website Appraisal output
- Contains navigation back to homepage and to `/audit`, `/pricing`
- Security headers present (same as homepage)
- No Google Ads conversion tag

## Browser drive (optional)

Open `http://127.0.0.1:8788/specimen` and verify:
- Page shows a realistic example audit
- Links work correctly