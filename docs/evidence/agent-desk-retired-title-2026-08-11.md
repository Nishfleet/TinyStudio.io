# Retired Agent Desk title/snippet: cut the canonical consolidation wire

Date: 2026-08-11
Scope: `public/agent-desk.html` (head canonical/og:url), `src/worker.js`
(retired 410 response copy), `scripts/check-site.mjs` (regression guard).
Follow-up to `docs/evidence/agent-desk-retired-title-2026-08-09.md`, which
added `noindex, nofollow` and retired framing to the legacy surface. This
receipt records the second, deterministic pass: the two remaining wires that
could still feed the retired "TinyStudio Agent Desk" title/snippet to Google
were cut. It is not a live Google-index measurement and claims nothing about
when or whether Google's search results change.

## Why this pass exists

Google still presents the retired self-serve "TinyStudio Agent Desk"
title/snippet for tinystudio.io. The 2026-08-09 pass is verified live (both
fetches below), so the stale presentation can no longer come from the legacy
page's own title or description — those are gone. Two index-facing wires
remained:

1. **The canonical/og:url wire.** The 2026-08-09 receipt itself diagnosed the
   original mechanism: "the legacy page's title consolidated through its
   canonical" onto the homepage URL. The pass added `noindex, nofollow` but
   left `<link rel="canonical" href="https://tinystudio.io/">` and
   `<meta property="og:url" content="https://tinystudio.io/">` in place.
   Live-before state (2026-08-11):
   `curl -s https://tinystudio.io/agent-desk` served `noindex, nofollow`,
   the retired title/description — and still declared the homepage as the
   page's canonical and og:url. A noindex page whose canonical names a live
   page tells Google it is a duplicate of that page: exactly the consolidation
   that handed the retired title to tinystudio.io, still declared on every
   recrawl until the removal is processed. Google's own guidance is that a
   page you do not want indexed should not canonicalize to another URL.
2. **The retired-410 copy wire.** `app.tinystudio.io` and `api.tinystudio.io`
   respond 410 Gone with the copy "TinyStudio.io now runs the self-serve
   Agent Desk from the main domain." Live-before state (2026-08-11): both
   fetches returned that sentence. It re-presents the retired self-serve
   product as the current thing the main domain runs, and the pages stay
   crawlable until the 410 is processed.

## What changed

1. `public/agent-desk.html` head: the canonical and og:url now name the
   legacy page itself (`https://tinystudio.io/agent-desk.html`) instead of the
   homepage. The consolidation wire is cut: no indexed page points the legacy
   surface at `tinystudio.io/` any more, so a recrawl can no longer merge the
   retired page's signals or title onto the homepage URL.
2. `src/worker.js`: the retired 410 responses (app and api) no longer claim
   the main domain runs the self-serve Agent Desk. They now say the app and
   the self-serve Agent Desk are both retired and that TinyStudio.io's
   current offer is the Website Appraisal.
3. `scripts/check-site.mjs`: the retired-desk dogfood guard now fails `npm
   run check` when the legacy page's canonical or og:url points anywhere but
   the legacy page itself (or is absent), and when the worker's retired 410
   copy claims the main domain "now runs the self-serve Agent Desk" — so
   neither wire can silently return.

## What deliberately did not change

- The legacy surface itself: `agent-desk.html` remains a working self-serve
  page served at `/agent-desk` and `/agent-desk.html`, still `noindex,
  nofollow`, still retired-framed. Old deep links and bookmarks keep working.
- `robots.txt`, `sitemap.xml`, the homepage, and the other public pages:
  their titles and descriptions were already current.
- No redirect was added for `/agent-desk`: the page stays reachable, it is
  just no longer indexable or canonicalizable onto the homepage.

## What is tested and what is not

Tested: the extended guard fails loudly on regression (the canonical and the
410 copy are asserted directly), and the full suite passes on this commit —
`npm run check` green, `npm test` green, exit code 0.

Not tested: whether or when Google drops the old title/snippet from its
results. De-indexing and re-consolidation are live processes that start only
after Google recrawls the pages; nothing here implies a ranking, visibility,
lead or revenue outcome. The honest measure is a future controlled re-run
recorded through `evidence-fixtures/ai-search` (or Search Console), once
enough time has passed for a recrawl.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit. Live-before state (2026-08-11):

```
curl -s https://tinystudio.io/agent-desk      # noindex + retired head, canonical/og:url still -> homepage
curl -s https://app.tinystudio.io/            # 410 body still claimed the main domain runs the Agent Desk
curl -s https://api.tinystudio.io/            # 410 JSON message made the same claim
```

After deploy, the same fetches should show the self-canonical
`https://tinystudio.io/agent-desk.html` and the corrected 410 copy.

## Closeout

This closes the repository-side item against current main: the legacy Agent
Desk surface no longer declares itself a duplicate of the homepage through
its canonical or og:url, the retired 410 responses no longer present the
retired self-serve Agent Desk as the main domain's current offer, and CI
fails if either returns.
