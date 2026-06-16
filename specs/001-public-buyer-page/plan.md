# Implementation Plan: Locked Coming-Soon Page

## Scope

Serve a locked, cryptic coming-soon page from the TinyStudio.io domain family while preserving private email capture for launch access.

## Pieces

- `public/index.html` contains the locked coming-soon page and email form.
- `public/styles.css` contains the visual system.
- `public/script.js` handles progressive email capture.
- `public/llms.txt` and `public/offer.md` expose agent-readable lockdown truth, not offer details.
- `src/worker.js` serves allowed assets with security headers and returns the locked page for stale public paths.
- `src/worker.js` writes launch emails through `/api/signups`.
- `src/worker.js` returns retired responses for `app.tinystudio.io` and `api.tinystudio.io`.
- `wrangler.jsonc` defines apex, www, app, and api route patterns. Existing DNS stays in place.
- `scripts/check-site.mjs` validates lockdown content, email capture, stale-offer removal, and claim safety.

## Verification

- Run `npm test`.
- Run local static server.
- Use browser checks at desktop and mobile viewport sizes.
- Run `npm run deploy:dry-run` before live deploy.
- After deploy, verify `/`, `/pipeline-sprint/`, and `/pipeline-sprint/index.html` show the locked page.

## Fallback

If Cloudflare route ownership blocks deployment, keep the repo and GitHub remote ready, then wire the routes manually from the Cloudflare dashboard or restore from the previous Worker route.
