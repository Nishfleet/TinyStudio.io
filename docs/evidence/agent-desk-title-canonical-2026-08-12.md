# Retired Agent Desk title/snippet: stop claiming the apex root as the canonical

Date: 2026-08-12
Scope: `public/agent-desk.html` (head canonical/og:url), `scripts/check-site.mjs`
(regression guard). This receipt records a deterministic, repository-side
change to what the legacy surface declares about itself. It is not a live
Google-index measurement, and it claims nothing about when or whether Google's
search results change after this change.

## Why this pass exists

Google has presented the retired self-serve "TinyStudio Agent Desk"
title/snippet for tinystudio.io. Two earlier repository-side passes already
addressed the legacy surface's own head
(`docs/evidence/agent-desk-retired-title-2026-08-09.md` added `noindex,
nofollow` and retired framing; PR #100 pointed the retired `app.`/`api.` 410
hosts at The Website Appraisal), but one index-facing wire remained: the
legacy page still declared the homepage as its canonical.

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
- Live-before state (2026-08-12): `curl -s https://tinystudio.io/agent-desk`
  returned 200 with `noindex, nofollow`, the retired title/description — and
  still declared `https://tinystudio.io/` as its canonical and og:url. A
  noindex page whose canonical names a live page tells Google it is a
  duplicate of that page: the same consolidation that handed the retired
  title to tinystudio.io, re-declared on every recrawl until the removal is
  processed. Google's own guidance is that a page you do not want indexed
  should not canonicalize to another URL.

Every other owned page follows one convention — the canonical and og:url name
the page's own served `.html` twin (`/agents.html`, `/pricing.html`,
`/specimen.html`, and the audit page's clean `/audit`) — and the legacy page
was the only one claiming the apex root.

## What changed

1. `public/agent-desk.html` head: the canonical and og:url now name the
   legacy page itself (`https://tinystudio.io/agent-desk.html`, the same
   self-address form the desk, pricing and specimen pages use) instead of the
   homepage. The consolidation wire is cut: no page declares the retired
   surface as a duplicate of `tinystudio.io/` any more, so a recrawl can no
   longer merge the retired page's signals or title onto the homepage URL.
2. `scripts/check-site.mjs`: the retired-desk dogfood guard now fails `npm
   run check` when the legacy page's canonical is missing, duplicated, or
   points anywhere but `https://tinystudio.io/agent-desk.html`, and when its
   og:url points anywhere else — so the apex-root claim cannot silently
   return. (Regression verified by reverting the HTML change: both
   assertions fire on the old apex-root values.)

## What deliberately did not change

- The visible legacy UI copy and the tool itself: `agent-desk.html` remains a
  working self-serve surface, still served at `/agent-desk` and
  `/agent-desk.html`, still `noindex, nofollow`, still retired-framed. Old
  deep links and bookmarks keep working.
- `robots.txt` (no Disallow was added: a disallowed page cannot be crawled to
  see the noindex meta, so that would slow de-indexing, not speed it up),
  `sitemap.xml`, the worker's routing, and the 410 hosts (already corrected
  by PR #100, verified live 2026-08-12).
- The homepage and the other public pages: their own titles, descriptions and
  canonicals were already current; this pass only fixes the legacy surface.
- No redirect was added for `/agent-desk`: the page stays reachable, it is
  just no longer indexable or canonicalizable onto the homepage.

## What is tested and what is not

Tested: the extended guard fails loudly on regression (the canonical and the
og:url are asserted directly), and the full suite passes on this commit —
`npm run check` green, `npm test` green (92 subtests: 6 headings, 7 sitemap,
55 worker, 16 UI, 8 product contract), exit code 0.

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

All three checks pass on this commit. Live-before state (2026-08-12):

```
curl -s https://tinystudio.io/agent-desk   # noindex + retired head, canonical/og:url still -> homepage
curl -s https://app.tinystudio.io/         # 410, already names The Website Appraisal (PR #100)
curl -s https://api.tinystudio.io/         # 410, already names The Website Appraisal (PR #100)
```

After deploy, the same fetch of `/agent-desk` should show the self-canonical
`https://tinystudio.io/agent-desk.html`.

## Closeout

This closes the repository-side item against current main: the legacy Agent
Desk surface no longer declares itself a duplicate of the homepage through
its canonical or og:url, and CI fails if either returns.
