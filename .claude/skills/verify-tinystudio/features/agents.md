# The Desk — `/agents`

The Desk page: the human-reviewed description that fronts the
seven-agent review stack. This page is the *current* surface; the
seven specialist names (Offer Agent, Funnel Agent, etc.) live on
the legacy self-serve Agent Desk at `/agent-desk`, not here. The
Desk page is what `https://tinystudio.io/agents` serves in
production, and it carries the "one name goes on every audit"
ceiling language and the seven-specialists framing in its meta
description. Served by the Worker from `public/agents.html`
through the `PUBLIC_ASSET_PATHS` allow-list, with
`public/agents.css` and `public/agents.js` co-served.

## How users reach it

Open `http://127.0.0.1:8790/agents` directly, or follow `The desk`
in the homepage nav.

## How to drive it

1. `GET /agents` — expect 200 and `Content-Type: text/html; charset=utf-8`.
2. The page meta description carries the seven-specialists framing:
   `Seven specialists, one human signature. Each does a single
   job on your actual pages and numbers; nothing reaches you
   until a person has read and signed it.`
3. The page title is exactly `TinyStudio — The Desk`.
4. The page links to the legacy self-serve Agent Desk at
   `/agent-desk` for the operational generation endpoint. The
   seven specialist names (Offer Agent, Funnel Agent, etc.) are
   on that legacy surface, not on this Desk page — the
   `scripts/check-site.mjs` `requiredAgentStack` list is asserted
   against `public/agent-desk.html`, not `public/agents.html`.
5. The "one name goes on every audit" ceiling language is
   referenced (the desk is one person, six a month, no exceptions).

```bash
curl -fsS http://127.0.0.1:8790/agents -o /tmp/verify-tinystudio/agents.html
grep -c 'TinyStudio — The Desk' /tmp/verify-tinystudio/agents.html
grep -c 'Seven specialists, one human signature' /tmp/verify-tinystudio/agents.html
curl -s -o /dev/null -w "agents.css %{http_code}\n" http://127.0.0.1:8790/agents.css
curl -s -o /dev/null -w "agents.js  %{http_code}\n" http://127.0.0.1:8790/agents.js
```

## What proves success

- HTTP 200 on `/agents`, `/agents.css`, `/agents.js`.
- The exact page title appears at least once.
- The seven-specialists framing is present in the meta description
  (or the page body if the meta is refactored later).
- The page does NOT enumerate the seven specialist names by hand —
  that is the legacy `/agent-desk` surface, and the product
  contract deliberately keeps the two separate.

## Local honesty note

- The seven specialist names live on the *legacy* self-serve Agent
  Desk at `/agent-desk` (covered by `features/legacy-agent-desk.md`).
  The `/agents` Desk page is the current human-reviewed surface
  and intentionally does not list them. The
  `scripts/check-site.mjs` regression test enforces this split
  by asserting the names on `retiredDesk` only.
- The page is pure HTML/CSS/JS. No D1, no AI on render. Local
  proof is byte-identical to production for this page.
