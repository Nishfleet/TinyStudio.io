# Agent Desk Page `/agent-desk` — Retired (static page)

## HTTP drive

```bash
curl -fsS 'http://127.0.0.1:8788/agent-desk'
```

## Assertions

- Status 200
- Content-Type: `text/html; charset=utf-8`
- `<title>` contains "retired Agent Desk" (the page is the static retirement notice, served as 200)
- Body explains the self-serve desk is retired and points to the current public site (`https://tinystudio.io/`)
- Marked `noindex, nofollow` in metadata
- Security headers present
- No Google Ads conversion tag

> Note: the worker's 410-Gone retired response only fires on the
> `app.tinystudio.io` and `api.tinystudio.io` hosts — not on
> `tinystudio.io/agent-desk`. On the apex and `www` hosts, `/agent-desk`
> is a plain static page in `public/agent-desk.html` that explains the
> retirement and links to the public site. Treat it as a 200, not a 410.

## Browser drive (optional)

Open `http://127.0.0.1:8788/agent-desk` and verify:
- Page shows retirement message
- Link to main site works
