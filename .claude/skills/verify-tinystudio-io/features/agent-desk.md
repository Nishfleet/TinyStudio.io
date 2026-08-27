# Agent Desk Page `/agent-desk` — Retired Self-Serve Surface

The self-serve Agent Desk is retired and is not the current product. It remains
served as a frozen legacy surface (de-indexed, no page links to it from the
current site).

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/agent-desk'
```

## Assertions

- Status 200 (serves the static `public/agent-desk.html` page)
- Content-Type: `text/html; charset=utf-8`
- `<meta name="robots" content="noindex, nofollow">` present
- Page states the self-serve Agent Desk is retired
- Page points to the current offer (The Website Appraisal)
- Security headers present (same as homepage)
- No Google Ads conversion tag

## Retired-host 410 surfaces (separate from `/agent-desk`)

These hosts return 410 Gone, not the `/agent-desk` path on the main host:

- `app.tinystudio.io` (any path) → 410 HTML (`retiredAppResponse`): contains "TinyStudio app retired."
- `api.tinystudio.io` (any path) → 410 JSON (`retiredApiResponse`): `{"ok":false,"status":"retired",...}`

## Browser drive (optional)

Open `http://127.0.0.1:8788/agent-desk` and verify:
- Page shows the retirement message
- Link to main site works
