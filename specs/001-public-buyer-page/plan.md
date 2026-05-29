# Implementation Plan: Public Buyer Page

## Scope

Build a small static website served by Cloudflare Workers Static Assets. Keep it independent from private app/API surfaces.

## Pieces

- `public/index.html` contains the public buyer page.
- `public/styles.css` contains the visual system.
- `public/script.js` handles small progressive interactions.
- `public/assets/proof-board.svg` provides the primary visual asset.
- `public/llms.txt` and `public/offer.md` expose agent-readable public offer truth.
- `src/worker.js` serves static assets with security headers and index fallback.
- `wrangler.jsonc` defines only the apex/www public routes.
- `scripts/check-site.mjs` validates required content and claim safety.

## Verification

- Run `npm test`.
- Run local static server.
- Use browser checks at desktop and mobile viewport sizes.
- Run `npm run deploy:dry-run` before live deploy.

## Fallback

If Cloudflare route ownership blocks deployment, keep the repo and GitHub remote ready, then wire the routes manually from the Cloudflare dashboard or restore from the previous Worker route.
