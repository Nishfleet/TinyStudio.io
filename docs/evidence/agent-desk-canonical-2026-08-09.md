# Retired Agent Desk canonical: stop claiming the apex root

Date: 2026-08-09
Scope: `public/agent-desk.html` (head metadata), `scripts/check-site.mjs`
(regression guard). This receipt records a deterministic, repository-side
change to what the legacy surface declares about itself. It is not a live
Google-index measurement, and it claims nothing about when or whether Google's
search results change after this change.

## Why this pass exists

The de-indexing pass (`fix/agent-desk-retired-snippet`, PR #46, merged
2026-08-09) added `noindex, nofollow` and reframed the legacy head as retired,
but it left the head's `canonical` and `og:url` pointing at the apex root:

- `public/agent-desk.html` head carried
  `<link rel="canonical" href="https://tinystudio.io/" />` and
  `<meta property="og:url" content="https://tinystudio.io/" />` — a claim that
  the retired `/agent-desk` surface is the homepage.
- Live check 2026-08-09: `https://tinystudio.io/agent-desk` returns 200 and
  its served head still declared both apex-root tags.

That claim is the same mechanism the previous pass identified as how the
retired title consolidated onto tinystudio.io ("the legacy page's title
consolidated through its canonical"), and it violates the convention every
other owned page follows: each page carries exactly one canonical and one
`og:url` pointing at its own canonical `.html` address (`audit.html`,
`agents.html`, `pricing.html`, `specimen.html`, and the homepage's
`https://tinystudio.io/`). The legacy page was the lone exception, still
telling search engines and scrapers that the retired surface and the homepage
are the same URL.

## What changed

1. `public/agent-desk.html` head: `og:url` and the canonical link now point at
   the legacy page's own served `.html` address,
   `https://tinystudio.io/agent-desk.html` — the twin the worker serves
   directly alongside `/agent-desk`, and the form every other owned page
   canonicals to. The retired surface no longer claims the apex root.
2. `scripts/check-site.mjs` gains a regression guard inside the Retired Agent
   Desk index guard: `npm run check` fails when the legacy head carries other
   than exactly one canonical link, when that canonical is not
   `https://tinystudio.io/agent-desk.html`, when the `og:url` meta is missing,
   or when it is not `https://tinystudio.io/agent-desk.html` — so the apex
   claim cannot silently return.

## What deliberately did not change

- The `noindex, nofollow` robots meta, the retired title/description framing,
  and the retired og:/twitter framing from the previous pass.
- The visible legacy UI copy and the tool itself: `agent-desk.html` remains a
  working self-serve surface, still served at `/agent-desk` and
  `/agent-desk.html` (worker `PUBLIC_ASSET_PATHS`), so old deep links and
  bookmarks keep working. No redirect, no removal.
- `robots.txt`, `sitemap.xml`, and the worker's routing.
- The Organization structured-data block's `url: "https://tinystudio.io/"`:
  that is the Organization entity's URL (the business's homepage), the same
  value the homepage's own `@graph` declares — not a page-level canonical
  claim.
- The homepage and the other four public pages: their canonical and `og:url`
  tags already pointed at their own addresses.

## What is tested and what is not

Tested: the static guard fails loudly on regression (verified by restoring the
apex-root canonical and `og:url` into the head and re-running `npm run check`:
both new failures fire), and the full suite passes on this commit — `npm run
check` green, `npm test` green, exit code 0.

Not tested: whether or when Google changes anything in its results. This pass
only stops the legacy surface from claiming the apex root; it claims no
ranking, visibility, lead or revenue outcome. The honest measure is a future
controlled re-run recorded through the same AI-search fixture (or Search
Console), once enough time has passed for a recrawl.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit. Live-before state (2026-08-09):
`curl -s https://tinystudio.io/agent-desk | head` showed the `noindex,
nofollow` meta and retired framing from the previous pass, but the canonical
and `og:url` still pointing at `https://tinystudio.io/`. After deploy, the
same fetch should show `https://tinystudio.io/agent-desk.html` in both tags.

## Closeout

This closes the item against current main: the retired Agent Desk surface no
longer claims the apex root as its canonical or its `og:url` anywhere a search
engine or scraper reads, its canonical names its own served address in the
same form every other owned page uses, and CI fails if the apex claim ever
drifts back.
