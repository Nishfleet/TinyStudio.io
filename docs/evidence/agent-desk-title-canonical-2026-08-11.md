# Retired Agent Desk title/snippet: stop claiming the apex root as the canonical

Date: 2026-08-11
Scope: `public/agent-desk.html` (head canonical/og:url), `scripts/check-site.mjs`
(regression guard). This receipt records a deterministic, repository-side
change to what the legacy surface declares about itself. It is not a live
Google-index measurement, and it claims nothing about when or whether Google's
search results change after this change.

## Why this pass exists

Google has presented the retired self-serve "TinyStudio Agent Desk"
title/snippet for tinystudio.io. Two repository-side passes already addressed
the legacy page's own head (`docs/evidence/agent-desk-retired-title-2026-08-09.md`
added `noindex, nofollow` and retired framing), but one index-facing wire
remained: the legacy page still declared the homepage as its canonical.

- `public/agent-desk.html`, served at `/agent-desk` and `/agent-desk.html`
  (worker `PUBLIC_ASSET_PATHS`), still carried
  `<link rel="canonical" href="https://tinystudio.io/" />` and
  `<meta property="og:url" content="https://tinystudio.io/" />`.
- The 2026-08-09 receipt itself diagnosed the original mechanism: the legacy
  page's title "consolidated through its canonical" onto the homepage URL
  (`evidence-fixtures/ai-search/evidence.json`, q5 / google, 2026-08-06:
  "tinystudio.io - TinyStudio Agent Desk" attached to the homepage URL).
  The de-indexing pass cut the title and description wires but left the
  canonical wire in place.
- Live-before state (2026-08-11): `curl -s https://tinystudio.io/agent-desk`
  returned 200 with `noindex, nofollow`, the retired title/description — and
  still declared `https://tinystudio.io/` as its canonical and og:url. A
  noindex page whose canonical names a live page tells Google it is a
  duplicate of that page: the same consolidation that handed the retired
  title to tinystudio.io, re-declared on every recrawl until the removal is
  processed. Google's own guidance is that a page you do not want indexed
  should not canonicalize to another URL.

Every other owned page follows one convention — the canonical and og:url name
the page's own served address (`/specimen.html`, `/pricing.html`,
`/agents.html`, `/audit`) — and the legacy page was the only one claiming the
apex root.

## What changed

1. `public/agent-desk.html` head: the canonical and og:url now name the
   legacy page itself (`https://tinystudio.io/agent-desk.html`, the address
   the worker serves directly from `PUBLIC_ASSET_PATHS`, no redirect) instead
   of the homepage. The consolidation wire is cut: no page declares the
   retired surface as a duplicate of `tinystudio.io/` any more, so a recrawl
   can no longer merge the retired page's signals or title onto the homepage
   URL.
2. `scripts/check-site.mjs`: the retired-desk dogfood guard now fails `npm
   run check` when the legacy page's canonical is missing, duplicated, or
   points anywhere but `https://tinystudio.io/agent-desk.html`, and when its
   og:url points anywhere else — so the apex-root claim cannot silently
   return.

## What deliberately did not change

- The visible legacy UI copy and the tool itself: `agent-desk.html` remains a
  working self-serve surface, still served at `/agent-desk` and
  `/agent-desk.html` (worker `PUBLIC_ASSET_PATHS`), so old deep links and
  bookmarks keep working. No redirect, no removal.
- The `noindex, nofollow` meta, the retired title/description framing, and
  the Organization structured-data block from the 2026-08-09 pass.
- `robots.txt`, `sitemap.xml`, the worker's routing, and the homepage and
  the other four public pages (their own canonicals already name their own
  addresses).

## What is tested and what is not

Tested: the static guard fails loudly on regression (canonical re-pointed at
the apex root and `npm run check` fails; og:url re-pointed and `npm run
check` fails), and the full suite passes on this commit — `npm run check`
green, `npm test` green, exit code 0.

Not tested: whether or when Google drops the old title/snippet from its
results. De-indexing is a live process that starts only after Google recrawls
the page; nothing here implies a ranking, visibility, lead or revenue
outcome.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit. Live-before state (2026-08-11):
`curl -s https://tinystudio.io/agent-desk` showed the canonical and og:url
pointing at `https://tinystudio.io/`. After deploy, the same fetch should
show both naming `https://tinystudio.io/agent-desk.html`.

## Closeout

This closes the item against current main: the legacy Agent Desk surface no
longer claims the apex root as its canonical or og:url anywhere a search
engine or scraper reads, it declares its own served address instead, and CI
fails if the apex-root claim ever returns.
