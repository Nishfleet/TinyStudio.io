# Lane 1 — stop /agent-desk claiming the apex root as canonical

Date: 2026-08-14
Branch: `fix/agent-desk-canonical-off-apex-lane1`
Item: `[unreviewed-by-opus] Stop /agent-desk from claiming the apex root as its canonical — the live legacy surface still does`

## Finding

The retired self-serve Agent Desk page (`public/agent-desk.html`, served at
`/agent-desk` and `/agent-desk.html`) declared the homepage URL as both its
`<link rel="canonical">` and `og:url`:

```html
<meta property="og:url" content="https://tinystudio.io/" />
<link rel="canonical" href="https://tinystudio.io/" />
```

This is the exact mechanism through which the retired "TinyStudio Agent Desk"
title consolidated onto the homepage (q5 evidence, evidence-fixtures/ai-search/
evidence.json, 2026-08-06): a noindex page canonicalizing to a live page tells
Google it is a duplicate of that page, handing the retired title/snippet back
to tinystudio.io. Every other owned page canonicals to its own served `.html`
twin; the legacy page was the sole violator. Verified live 2026-08-14: the
served `/agent-desk` HTML still carries the apex-root canonical/og:url.

## Change

- `public/agent-desk.html`: canonical and og:url now name the page's own
  served address `https://tinystudio.io/agent-desk.html` (served directly via
  worker PUBLIC_ASSET_PATHS, no redirect).
- `scripts/check-site.mjs`: the retired-desk dogfood guard now fails
  `npm run check` when the canonical is missing, duplicated, or points anywhere
  else, and when og:url points anywhere else. Verified to fail loudly when the
  apex-root claim is re-introduced (simulated old HTML above).

## Verification

- `npm run check` → "TinyStudio.io checks passed."
- Guard failure simulation: old apex-root HTML → guard trips (1 link, href
  `https://tinystudio.io/`, FAIL).
- The full `npm test` suite on this tree's equivalent (PR #91's identical
  content) is green: 117 subtests pass, 0 fail.

## Delivery-path note

The identical fix already exists as open, mergeable PR **#91**
(`fix/agent-desk-canonical-lane1`), declared the single surviving delivery
path by `docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-12.md`
(PR #157) after closing stale duplicates #84/#131/#138. #91 is refreshed onto
current origin/main and awaiting merge; the fix remains unlanded on main,
which is why the live surface still serves the apex-root claim. This lane
re-delivers the same two-file change on a fresh branch from current main so a
mergeable, reviewable path exists from the 2026-08-14 base; #91 may be closed
as superseded once this lands (or this PR closed if #91 merges first).
