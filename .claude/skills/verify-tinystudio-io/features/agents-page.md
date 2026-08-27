# Agents Page `/agents` — Agent Desk Showcase

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/agents'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- Describes the human-reviewed Agent Desk (not the retired self-serve desk)
- Contains navigation back to homepage and to `/audit`, `/pricing`
- Security headers present (same as homepage)
- No Google Ads conversion tag

## Browser drive (optional)

Open `http://127.0.0.1:8788/agents` and verify:
- Page explains the human-reviewed desk
- Links work correctly