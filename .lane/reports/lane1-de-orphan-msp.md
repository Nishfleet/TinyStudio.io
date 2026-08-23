# Lane 1 evidence: de-orphan /msp

**Branch:** `lane1/de-orphan-msp`
**Item:** c2a74c2da9 — /msp vertical intent page orphan
**Date:** 2026-08-23

## Goal

Every sitemap-listed indexable HTML page — including `/msp` — is reachable by at least one same-origin in-content link from another indexable page, with a static-source guard in `scripts/check-site.mjs` that fails CI if any becomes an orphan again.

## Changes

1. **`scripts/check-site.mjs`** — Added indexable-page orphan guard after the internal-link guard loop (commit `de89b0a`). Guards exactly six pages: `/`, `/audit`, `/agents`, `/pricing`, `/specimen`, `/msp`. Requires ≥1 clean extensionless inlink from another page in the set.

2. **`public/audit.html`** — One contextual in-content link to `/msp` in the "Then it is entirely your call" section (commit `e6fdac3`). Uses existing `xa1` inline-link class. No nav/footer changes.

## Acceptance

### A. Orphan reproduces (after commit 1, before commit 2)

```
node scripts/check-site.mjs; echo "exit=$?"
```

```
- Indexable page /msp is an orphan: no other indexable page links to it.
exit=1
```

PASS.

### B. Guard passes after the link (after commit 2)

```
node scripts/check-site.mjs; echo "exit=$?"
```

```
TinyStudio.io checks passed.
exit=0
```

PASS.

### C. Full suite green

```
npm test
```

Exit 0. All test suites passed.

### D. Exactly one clean inlink, outside msp.html

```
grep -n 'href="/msp"' public/index.html public/audit.html public/agents.html public/pricing.html public/specimen.html public/msp.html
```

```
public/audit.html:139:    <p class="lede">The same four-pass appraisal runs for MSP and IT service firms, read the way their buyers read it. <a class="xa1" href="/msp">Read the MSP &amp; IT services edition &rarr;</a></p>
```

Exactly one hit in `audit.html`. PASS.

### E. No redirecting twin introduced

```
grep -n 'msp\.html' public/index.html public/audit.html public/agents.html public/pricing.html public/specimen.html
```

No matches (grep exit 1). PASS.

## Files touched

- `scripts/check-site.mjs` (orphan guard)
- `public/audit.html` (one `/msp` inlink)

## Not touched (per spec)

- `public/msp.html`, sitemap, worker, nav, other HTML pages, test files, package.json
