# Brief-requested clean nav/back links — re-verify the surface and harden the guard on current main (2026-08-17)

Date: 2026-08-17
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and
back links at clean non-307 paths — post-signup surface still carries the
redirecting-internal-link fault"
Scope: re-verify the survivor surface on current `origin/main` (`f309dd4`),
record that the named fix remains landed, and ship a follow-on guard
hardening that closes a hole the survivor inherited. The evidence is a
state verification plus a single, scoped code change.

## State of the item on current main

- `public/brief-requested.html` on `origin/main` (`f309dd4`) already
  carries only clean anchors: logo `/`, nav `/audit`, `/agents`,
  `/pricing`, back `/`. No `.html` anchor remains on the post-signup
  page. The logo→home, three nav links and back link are the same five
  anchors the survivor PR #145 landed (merged `f9214c1`, 2026-08-14).
- `scripts/check-site.mjs` already lists `brief-requested page` in the
  "Internal page links (dogfood 996dffe45ef7)" guard.

So the served bytes are clean. The fault is gone on the page the item
names.

## The hole this run found

The guard that is supposed to make the fault impossible to return was
comparing the raw `href` against the bare filename in a small map:
`{ "audit.html": "/audit", "agents.html": "/agents", ... }`. That covers
exactly one spelling of the fault. The wire is not so polite. On the
live deployment (probed 2026-08-17):

- `https://tinystudio.io/audit` → 200
- `https://tinystudio.io/audit.html` → 307 → `/audit`
- `https://www.tinystudio.io/audit.html` → 307 → `/audit`
- `//tinystudio.io/audit.html` → 307 → `/audit` (protocol-relative)

So `audit.html`, `./audit.html`, `/audit.html`,
`https://tinystudio.io/audit.html`, `https://www.tinystudio.io/audit.html`,
`//tinystudio.io/audit.html`, `/audit.html?utm=x`, `/audit.html#next`, and
`brief-requested.html` itself (verified live:
`/brief-requested.html` → 307 → `/brief-requested`) are nine different
spellings of the same redirecting-internal-link fault. Re-introducing
each of them on the pre-fix tree made `node scripts/check-site.mjs` exit
0 — the guard walked straight past seven of the nine. CI was not
catching the fault in any of its redirecting forms.

The follow-on landing this run ships: the guard now normalizes every
same-origin anchor target before the lookup (drop query/fragment,
resolve same-origin absolute and protocol-relative URLs, strip leading
`./`, `../`, `/`; skip off-site links and non-navigational schemes), and
`brief-requested.html` is added to the map (its live 307 to
`/brief-requested` is verified).

## Verification performed (2026-08-17)

1. **Live probe of the named surface.** `curl -s
   https://tinystudio.io/brief-requested` returns 200; the page's
   `<a>` elements are five: `<a class="logo" href="/">`, `<a
   href="/audit">`, `<a href="/agents">`, `<a href="/pricing">`, `<a
   class="back" href="/">`. No `href="*.html"` anchor is present in
   the live HTML.
2. **Live probe of every link target the post-signup surface ships.**
   `/` 200, `/audit` 200, `/agents` 200, `/pricing` 200, and the
   sub-resources `/shared.css`, `/brief-requested.css`,
   `/brief-requested.js`, `/fonts.js`, `/favicon.svg`,
   `/apple-touch-icon.png` all 200. `/brief-requested.html` → 307
   `/brief-requested`.
3. **Static source guard on current main.** `node
   scripts/check-site.mjs` → "TinyStudio.io checks passed." (exit 0).
4. **Negative probe of the hardened guard** (post-fix tree,
   `public/brief-requested.html` `<a href="/audit">` replaced one at a
   time with each spelling; the page was restored between probes).
   Each of the nine redirecting spellings above makes
   `check-site.mjs` exit 1 with the targeted message:
   `Internal page link on brief-requested page must point at the clean
   destination "/audit" (found "...").` (or `/brief-requested` for the
   self-redirect).
5. **False-positive probe.** `https://inish.in/audit.html`,
   `mailto:hello@tinystudio.io`, `#start`, `/audit`,
   `https://tinystudio.io/audit` → exit 0 (no spurious failures).
6. **Pre-fix proof.** On the pre-fix tree, re-introducing
   `/audit.html`, `./audit.html`, and
   `https://tinystudio.io/audit.html` on `public/brief-requested.html`
   each made `check-site.mjs` exit 0 (the guard walked past all three);
   all three 307 to `/audit` on the live site. Post-fix: each of the
   same three re-introductions → exit 1 with the targeted message.
7. **Full suite on the fix tree** — all green: headings 6/6,
   sitemap 7/7, worker 80/80, UI, first-viewport-audience,
   narrow-viewport pages, narrow-viewport, render-blocking,
   product-contract 8/8.

## Files changed

- `scripts/check-site.mjs` — the internal-links guard normalizes the
  anchor target before matching, accepts single-quoted `href='...'`,
  and adds `brief-requested.html` → `/brief-requested` to the target
  map.

## Delivery

- Branch: `fix/brief-requested-clean-links-guard-spellings-2026-08-17`
- Base: `origin/main` (`f309dd4`)
- Single commit: `c039fbd fix(check): catch every redirecting spelling
  of an internal .html page link`
- PR: #243 against `main`
