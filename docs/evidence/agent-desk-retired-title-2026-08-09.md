# Retired Agent Desk title/snippet: repository-side de-indexing pass

Date: 2026-08-09
Scope: `public/agent-desk.html` (head metadata), `scripts/check-site.mjs`
(regression guard). This receipt records a deterministic, repository-side
change to what the legacy surface declares about itself. It is not a live
Google-index measurement, and it claims nothing about when or whether Google's
search results change after this change.

## Why this pass exists

Google still presents the retired self-serve "TinyStudio Agent Desk"
title/snippet for tinystudio.io. Two captured observations pin the cause to
the legacy page's head:

- `evidence-fixtures/ai-search/evidence.json`, run `q5-what-is-tinystudio-io`
  / google (2026-08-06): the engine's title for tinystudio.io was
  "tinystudio.io - TinyStudio Agent Desk" — the retired product's name —
  attached to the homepage URL. The legacy page (`public/agent-desk.html`,
  served at `/agent-desk` and `/agent-desk.html`) carries that title and
  declares the homepage as its canonical, so Google consolidated the legacy
  page's title onto tinystudio.io.
- Live check 2026-08-09: `https://tinystudio.io/agent-desk` returns 200 and
  its served head still declares `<title>The Tiny Studio Agent Desk</title>`,
  the description "Self-serve AI agents for high-ticket pipeline setup:
  Pipeline Brief, Implementation Checklist, and Weekly Fix Report.", and no
  robots exclusion at all.

The surface is already treated as legacy everywhere else: it is absent from
the sitemap (locked out by `scripts/test-sitemap.mjs`), no page on the site
links to it, and `llms.txt` / `offer.md` demote it ("is not the current
offer"). Only its own head still presented the retired product as current and
stayed indexable — so Google kept the retired title/snippet alive.

## What changed

1. `public/agent-desk.html` head gains
   `<meta name="robots" content="noindex, nofollow" />` — the same exclusion
   the `/brief-requested` signup redirect page carries by design. The legacy
   surface drops out of the index on the next recrawl instead of continuing to
   hand its title to tinystudio.io.
2. The head's title, description, og:/twitter: tags and the Organization
   structured-data block are reframed as retired: the title is
   "TinyStudio — the retired Agent Desk" and the description states "The
   self-serve Agent Desk is retired and is not the current offer. TinyStudio's
   current offer is the free leak audit of high-ticket service homepages."
   Neither the index nor a scraper can re-present the retired self-serve
   product as the current offer, and the forbidden spaced name form ("The Tiny
   Studio") leaves the head.
3. `scripts/check-site.mjs` gains a regression guard that fails `npm run
   check` when the legacy page's head loses the `noindex, nofollow` robots
   meta, when the head stops framing the surface as retired, or when the
   description stops framing it as retired — so the retired title cannot
   silently return.

## What deliberately did not change

- The visible legacy UI copy and the tool itself: `agent-desk.html` remains a
  working self-serve surface, still served at `/agent-desk` and
  `/agent-desk.html` (worker `PUBLIC_ASSET_PATHS`), so old deep links and
  bookmarks keep working. No redirect, no removal.
- `robots.txt` (no Disallow was added: a disallowed page cannot be crawled to
  see the noindex meta, so that would slow de-indexing, not speed it up),
  `sitemap.xml`, and the worker's routing.
- The homepage and the other four public pages: their own titles and
  descriptions were already current; this pass only fixes the legacy surface.

## What is tested and what is not

Tested: the static guard fails loudly on regression (verified by stripping the
noindex meta and re-running `npm run check`), and the full suite passes on
this commit — `npm run check` green, `npm test` green (82 subtests: 6
headings, 7 sitemap, 53 worker, 16 UI), exit code 0.

Not tested: whether or when Google drops the old title/snippet from its
results. De-indexing is a live process that starts only after Google recrawls
the page; nothing here implies a ranking, visibility, lead or revenue outcome.
The honest measure is a future controlled re-run recorded through the same
fixture (or Search Console), once enough time has passed for a recrawl.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit. Live-before state (2026-08-09):
`curl -s https://tinystudio.io/agent-desk | head` showed the retired title,
the self-serve description and no robots meta. After deploy, the same fetch
should show the `noindex, nofollow` meta and the retired-framed head.

## Closeout

This closes the item against current main: the legacy Agent Desk surface no
longer declares the retired self-serve title or description anywhere a search
engine or scraper reads, it is excluded from the index at the page level, and
CI fails if that exclusion or the retired framing ever drifts.
