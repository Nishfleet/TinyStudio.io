# Stop retired `/agent-desk` from claiming the apex root as its canonical — re-verification on current main and live (2026-08-21)

Date: 2026-08-21
Scope: backlog item `67d184c9a7` — "[unreviewed-by-opus] Stop `/agent-desk`
from claiming the apex root as its canonical — the live legacy surface
still…" (truncated in the lane controller; the substantive concern is the
apex-root canonical / og:url on the legacy self-serve surface).

Verdict in one line: **the retired `/agent-desk` surface no longer claims
the apex root as its canonical or og:url on `origin/main` (head `92d55c3`,
this re-verification's commit on 2026-08-21) and is verified live on
2026-08-21 — the page now names itself (`https://tinystudio.io/agent-desk`),
the live bytes match the guarded source md5-for-md5, the regression guard
in `scripts/check-site.mjs` enforces it, and no new code change was
needed; this lane lands the re-verification receipt with the worktree
already at the post-fix head.**

## Environment

- Source baseline: `origin/main` at `92d55c3` (the post-`#256` head,
  2026-08-20; the apple-touch-icon guard merged on top of #229's
  Agent-Desk canonical fix).
- Live target: `https://tinystudio.io/agent-desk`,
  `https://tinystudio.io/agent-desk.html`, `https://tinystudio.io/`,
  and the five other site-wide pages.
- Live fetches below were made on 2026-08-21 via `curl` against the
  production hostname (Cloudflare edge serves the bytes directly; no
  proxy).
- Worktree: `tinystudio-io-lane1-20260821-020532`, branch
  `lane1/agent-desk-canonical-apex-rereverify-2026-08-21` (cut from
  fresh `origin/main` at `92d55c3`).

## Why the item is reopened in the lane

The item text in the lane ledger is truncated at the dispatch boundary
("…the live legacy surface still…"), so this lane reads the substantive
concern as: **the live legacy `/agent-desk` surface still declares the
apex root as its canonical or og:url.** That is the exact consolidation
mechanism by which Google once presented the retired "TinyStudio Agent
Desk" title/snippet for `tinystudio.io`: the legacy page's head metadata
named `https://tinystudio.io/` as its own canonical, so Google
consolidated the retired title onto the homepage URL. The lane therefore
re-checks precisely that claim on the current `origin/main` head and on
the live deployment of that head.

The previous lane-1 receipt
(`docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-17.md`,
`.lane/reports/fix-agent-desk-canonical-apex-rereverify-lane1-2026-08-17.md`)
closed the same item against `origin/main` head `4efeb4d`. This lane
re-verifies that the fix is still in place four days later, against
`92d55c3` (which contains ten subsequent merges — the
narrow-viewport/apple-touch-icon/tap-target cluster and follow-ups —
that touched neighbouring files but not `public/agent-desk.html`).

## Re-verification: source on current main (commit `92d55c3`)

- `public/agent-desk.html` head (line-numbered, file unchanged since
  `798cd71`):
  - `<meta name="robots" content="noindex, nofollow" />` (line 6) — the
    page opts out of indexing entirely.
  - `<title>TinyStudio — the retired Agent Desk</title>` (line 7) —
    title names itself as the retired legacy surface, not the current
    offer.
  - Description opens "The self-serve Agent Desk is retired and is not
    the current offer. TinyStudio's current offer is the free leak audit
    of high-ticket service homepages." (lines 8–10) — framing is
    "retired", not "active".
  - `<meta property="og:url" content="https://tinystudio.io/agent-desk" />`
    (line 18) — og:url names the clean `/agent-desk` address (the form
    that serves 200, not the 307-redirecting `/agent-desk.html` twin).
  - `<link rel="canonical" href="https://tinystudio.io/agent-desk" />`
    (line 19) — canonical names the same clean address.
  - The page no longer contains `https://tinystudio.io/` as the value
    of a `<link rel="canonical">` or `<meta property="og:url">`
    element; the only apex-root URL string in the head is the JSON-LD
    `Organization.url` (`https://tinystudio.io/`) and the inline
    `apple-touch-icon`/favicon/og-image references — none of which are
    a canonical or og:url claim that Google consolidates onto the
    homepage.
- `git log -1 --format='%H' origin/main -- public/agent-desk.html`
  returns `798cd71a86e5171cedb1819e6b462ee54580f2b7` — PR #229 is the
  last commit that touched the legacy page; nothing between `798cd71`
  and `92d55c3` (the current head, ten subsequent merges) has touched
  the file.
- `src/worker.js` route table still lists `/agent-desk` and
  `/agent-desk.html` in `PUBLIC_ASSET_PATHS` (the legacy surface stays
  reachable for old links) and still returns the asset bytes verbatim;
  no rewrites to the served head are applied by the worker.
- `scripts/check-site.mjs` "Retired Agent Desk index guard" (lines
  ~1327–1362) still fails `npm run check` if
  - the `robots` meta or retired-framing sentence is missing,
  - the page carries zero, one, or more than one `<link rel="canonical">`,
  - that canonical is anything other than
    `https://tinystudio.io/agent-desk`,
  - or `og:url` is absent, duplicated, or named anywhere other than
    `https://tinystudio.io/agent-desk`.

  A regression to the apex-root claim therefore fails the build before
  it can ship.

## Re-verification: live (2026-08-21)

- `https://tinystudio.io/agent-desk` → `200`, `noindex, nofollow`,
  `<title>TinyStudio — the retired Agent Desk</title>`, description
  opens "The self-serve Agent Desk is retired and is not the current
  offer.", canonical `https://tinystudio.io/agent-desk`, og:url
  `https://tinystudio.io/agent-desk`. No "Agent Desk" string is
  consolidated onto the homepage URL by this page.
- `https://tinystudio.io/agent-desk.html` → `307` → `/agent-desk`,
  carrying the same head.
- `https://tinystudio.io/` → `200`,
  `<title>TinyStudio — The Website Appraisal</title>`, canonical
  `https://tinystudio.io/`, og:url `https://tinystudio.io/`. The served
  HTML contains zero "Agent Desk" strings in the title, description,
  canonical, or og metadata.
- The other served pages (`/audit`, `/agents`, `/pricing`,
  `/specimen`, `/brief-requested`) all carry self canonicals at their
  own clean addresses; none of them is the apex root claimed by
  `/agent-desk`.
- **Bytes equality** — `md5sum public/agent-desk.html` =
  `3310f720f1b9234970327ba35c52da94` on disk;
  `curl -sS https://tinystudio.io/agent-desk | md5sum` =
  `3310f720f1b9234970327ba35c52da94` over the wire. The live document
  is the same byte sequence as the guarded source — the only
  possibility for divergence is a Cloudflare cache that hasn't seen
  the fix, and that is provably not happening here.

## Verification (reproduce on this head)

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test scripts/test-heading-hierarchy.mjs` → 6 / 6 pass.
- `node --test scripts/test-sitemap.mjs` → 7 / 7 pass (sitemap still
  has no `/agent-desk` loc; the test asserts that the checker rejects
  an `/agent-desk` sitemap entry).
- `node --test scripts/test-agent-worker.mjs` → 80 / 80 pass
  (includes the `agent-desk` canonical-shape assertions, the `www` →
  301 redirect, and the `/brief-requested` only Google Ads tag guard).
- `node --test scripts/test-agent-ui.mjs` → 16 / 16 pass.
- `node --test scripts/test-product-contract.mjs` → 8 / 8 pass
  (product-contract test still requires `README.md` and the spec 004
  plan to document the legacy `/agent-desk` surface, and asserts the
  legacy surface's retired framing).
- `node --test scripts/test-first-viewport-audience.mjs` → 4 / 4 pass.
- `node --test scripts/test-study-freshness.mjs` → all pass.
- `node scripts/test-narrow-viewport-pages.mjs` → "All four owned
  routes keep document scrollWidth === clientWidth at 240-390px."
- `node scripts/test-narrow-viewport.mjs` → "All narrow viewports keep
  the hero mock and its flags inside the viewport."
- Combined `node --test` count for the six test files above: 124 tests,
  0 failures (the +3 tests vs 2026-08-17 come from later agent-worker
  branches that were merged between `4efeb4d` and `92d55c3`).
- `git diff --check` clean.

## Negative test (the guard fires on regression)

The regression guard was last exercised end-to-end on 2026-08-17 in the
previous lane (a `/tmp`-only diff to `public/agent-desk.html` flipping
both `<link rel="canonical">` and `<meta property="og:url">` to
`https://tinystudio.io/`, after which `node scripts/check-site.mjs`
exits non-zero with both "Retired Agent Desk canonical must point at
`https://tinystudio.io/agent-desk` (found `https://tinystudio.io/`)"
and the matching `og:url` message; restoring the correct values
returns the script to green). The guard lines in
`scripts/check-site.mjs` are unchanged between `4efeb4d` and
`92d55c3` — `git log origin/main -- scripts/check-site.mjs | tail -10`
shows only merge commits, no functional edits — so the guard's
behaviour on regression is identical to that receipt.

## Why no code change was needed

The original fix lives in commit `798cd71` (PR #229, merged
2026-08-17): "fix(seo): stop the retired Agent Desk from claiming the
apex root as its canonical (clean /agent-desk)". The earlier
`public/agent-desk.html` declared
`<link rel="canonical" href="https://tinystudio.io/" />` and
`<meta property="og:url" content="https://tinystudio.io/" />`. The PR
re-pointed both at the legacy page's own 200-serving address
(`https://tinystudio.io/agent-desk`) and extended
`scripts/check-site.mjs` to require exactly one canonical and one
og:url, both naming that address.

Since then, ten additional merges touched the worktree (the
narrow-viewport/apple-touch-icon/tap-target cluster and follow-ups)
but none changed `public/agent-desk.html`, the canonical guard, the
sitemap test, or the product-contract test. The live bytes match
this head md5-for-md5, confirming the production deployment is also
on the same content.

A related re-verification receipt for the parent finding
(`f41c8af0f8`) records that the apex-root canonical and the duplicate
`www` site entity are both closed; see
`docs/evidence/agent-desk-retired-title-rereverify-2026-08-17.md` and
the same-lane report at
`.lane/reports/lane1-google-retired-agent-desk-snippet.md`. This lane
therefore lands the canonical-specific re-verification receipt
without overlapping the parent one.

## What is not claimed

No Google SERP change is claimed and none could be measured from this
worktree: Google's recrawl and site-name refresh run on Google's
timetable, and SERP fetches are bot-blocked (DuckDuckGo HTML and Bing
both returned bot pages / unrelated results when probed
2026-08-17 and 2026-08-20). The honest claim is the site-side one: the
legacy page no longer names the apex root as its canonical or og:url
on the current head or on live, the live bytes md5-match the guarded
source, the regression guard catches any drift, and no served surface
still consolidates the retired "TinyStudio Agent Desk" title onto the
homepage URL.

## Closeout

The item's substantive concern is closed against `origin/main` (head
`92d55c3`) and the live deployment: the legacy `/agent-desk` page no
longer claims the apex root as its canonical or og:url, the guard in
`scripts/check-site.mjs` enforces it, and the live bytes md5-match the
guarded source. This lane lands the re-verification receipt (this
file) and its lane report
(`.lane/reports/lane1-agent-desk-canonical-apex-rereverify-2026-08-21.md`).
