# Implementation Plan: Self-Serve Agent Desk

> **Status: HISTORICAL — retired.** Records the original Agent Desk
> implementation. The self-serve Agent Desk is retired and is not the current
> product; the current offer is The Website Appraisal
> (`specs/004-website-appraisal/plan.md`). Body kept as a historical record.

## Scope

Serve a self-serve AI Agent Desk from the TinyStudio.io domain family while keeping ad-platform actions, claims, and money-sensitive decisions approval-gated.

## Pieces

- `public/index.html` contains the Agent Desk intake and output surface.
- `public/styles.css` contains the visual system.
- `public/script.js` posts intake to `/api/agent-audit` and renders the generated Pipeline Brief, Implementation Checklist, and Weekly Fix Report.
- `public/llms.txt` and `public/offer.md` expose agent-readable Agent Desk truth.
- `src/worker.js` serves allowed assets with security headers and returns the Agent Desk for stale public paths.
- `src/worker.js` writes launch emails through `/api/signups`.
- `src/worker.js` runs Cloudflare Workers AI through `env.AI` and returns structured agent sections.
- `src/worker.js` rate-limits agent runs with daily D1 counters and lightweight usage metadata.
- `src/worker.js` returns retired responses for `app.tinystudio.io` and `api.tinystudio.io`.
- `wrangler.jsonc` defines apex, www, app, api route patterns, D1, assets, and Workers AI binding.
- `scripts/check-site.mjs` validates Agent Desk content, structured output sections, AI binding, safety rails, and claim safety.

## Verification

- Run `npm test`.
- Apply D1 migrations locally and remotely before live deploy.
- Run Worker checks against `/`, `/api/agent-audit`, `/pipeline-sprint/`, and public artifacts.
- Use browser checks at desktop and mobile viewport sizes.
- Run `npm run deploy:dry-run` before live deploy.
- After deploy, verify `/`, `/api/agent-audit`, `/pipeline-sprint/`, and `/pipeline-sprint/index.html`.

## Fallback

If Cloudflare Workers AI is unavailable, keep the Agent Desk page behind the existing safe error state and do not claim live AI generation until the binding works.
