# Website Appraisal — `/audit`

The leak-audit page: the public Website Appraisal flow that fronts the
human-reviewed desk. Served by the Worker from `public/audit.html`
through the `PUBLIC_ASSET_PATHS` allow-list, with the
`public/audit.css` and `public/audit.js` assets co-served from the same
list.

## How users reach it

Open `http://127.0.0.1:8790/audit` directly, or follow `The appraisal`
in the homepage nav (`<div class="navlinks"><a
href="/audit">The appraisal</a>...`). The form is also the homepage's
in-page `#start` target via the `Request the appraisal` navlink.

## How to drive it

1. `GET /audit` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The page has a form whose action posts to `/api/signups`. Required
   field name is `email`; the source/pagePath are derived from the
   request and the `source` query parameter when present, not the
   form's hidden inputs.
3. The required copy from `scripts/check-site.mjs` covers the audit
   framing: at minimum the `audit` page must mention the appraisal and
   the human-reviewed desk.
4. The legacy `/agent-desk` URL is NOT linked from this page; the audit
   page is a current-offer surface.

```bash
curl -fsS http://127.0.0.1:8790/audit -o /tmp/verify-tinystudio/audit.html
grep -c 'action="/api/signups"' /tmp/verify-tinystudio/audit.html
grep -c 'name="email"' /tmp/verify-tinystudio/audit.html
curl -s -o /dev/null -w "audit.css %{http_code}\n" http://127.0.0.1:8790/audit.css
curl -s -o /dev/null -w "audit.js  %{http_code}\n" http://127.0.0.1:8790/audit.js
```

## What proves success

- HTTP 200 on `/audit`, `/audit.css`, `/audit.js`.
- The signup form posts to `/api/signups` (the action attribute is the
  source of truth; hidden inputs for email must exist).
- Required-copy strings are present: the page's framing must be the
  current-offer audit, not the retired self-serve Agent Desk.

## Local honesty note

The audit page is pure HTML/CSS/JS — no AI binding, no D1 read on
render. Local proof is byte-identical to production for this page.
The D1 read/write happens on the form's POST to `/api/signups`, which
`features/signup.md` covers.
