# Brief-requested clean nav/back links — re-verify on current main and live (2026-08-21)

Date: 2026-08-21
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and
back links at clean non-307 paths — post-signup surface still carries the
redirecting-internal-link fault"
Scope: re-verify the named surface on current `origin/main` (`92d55c3`,
2026-08-20) and against `https://tinystudio.io`. No code change is
claimed — the lane only records that the fix is still landed and the
guard still catches every redirecting spelling.

## State of the item on current main

- `public/brief-requested.html` on `origin/main` (`92d55c3`) carries only
  clean anchors: logo `/`, nav `/audit`, `/agents`, `/pricing`, back `/`.
  No `.html` anchor remains on the post-signup page. The five anchors
  match the survivor PR #145 (`f9214c1`, 2026-08-14) and the guard
  hardening PR #243 (`9f79c71`, 2026-08-15).
- `scripts/check-site.mjs` lists `brief-requested page` in the internal
  page links guard and the target map includes `brief-requested.html` →
  `/brief-requested` (PR #243).

So the served bytes are clean. The fault is gone on the page the item
names, the guard is hardened, and nothing in the four days since the
2026-08-17 re-verify touched the post-signup surface or its guard.

## Verification performed (2026-08-21)

1. **Live probe of the named surface.** `curl -sI
   https://tinystudio.io/brief-requested` returns 200; the page's `<a>`
   elements are five (probed with `curl -s
   https://tinystudio.io/brief-requested | grep -oE '<a[^>]*href=\"...\"'>`):
   `<a class="logo" href="/">`, `<a href="/audit">`, `<a href="/agents">`,
   `<a href="/pricing">`, `<a class="back" href="/">`. No `href="*.html"`
   anchor is present in the live HTML.
2. **Live probe of every link target the post-signup surface ships.**
   `/`, `/audit`, `/agents`, `/pricing`, `/shared.css`,
   `/brief-requested.css`, `/brief-requested.js`, `/fonts.js`,
   `/favicon.svg`, `/apple-touch-icon.png` all 200.
   `/brief-requested.html` → 307 `/brief-requested`.
3. **Live probe of the redirecting `.html` twins** of every public
   surface. `/audit.html`, `/agents.html`, `/pricing.html`,
   `/specimen.html`, `/index.html`, `/agent-desk.html` each return 307
   to its clean extensionless twin (`/audit`, `/agents`, `/pricing`,
   `/specimen`, `/`, `/agent-desk`). The redirect chain the guard
   defends against is live.
4. **Static source guard on current main.** `node scripts/check-site.mjs`
   → "TinyStudio.io checks passed." (exit 0).
5. **Negative probe of the hardened guard** (each redirecting spelling
   re-introduced on `public/brief-requested.html`, page restored between
   probes). All nine spellings are blocked:
   - `audit.html` → `Internal page link on brief-requested page must
     point at the clean destination "/audit" (found "audit.html").`
   - `/audit.html` → … `(found "/audit.html")`.
   - `./audit.html` → … `(found "./audit.html")`.
   - `https://tinystudio.io/audit.html` → … `(found
     "https://tinystudio.io/audit.html")`.
   - `https://www.tinystudio.io/audit.html` → … `(found
     "https://www.tinystudio.io/audit.html")`.
   - `//tinystudio.io/audit.html` → … `(found
     "//tinystudio.io/audit.html")`.
   - `/audit.html?utm=foo` → … `(found "/audit.html?utm=foo")`.
   - `/audit.html#next` → … `(found "/audit.html#next")`.
   - `brief-requested.html` → … `must point at the clean destination
     "/brief-requested" (found "brief-requested.html").`
6. **False-positive probe.** Off-site `https://inish.in/audit.html`,
   `mailto:hi@tinystudio.io`, `#start`, absolute clean
   `https://tinystudio.io/audit`, and `https://www.tinystudio.io/audit`
   each exit 0 (no spurious failures).
7. **Full suite on the fix tree** — all green: headings 6/6,
   sitemap 7/7, worker 83/83, product-contract 8/8.

## Files changed

- `docs/evidence/brief-requested-clean-links-rereverify-2026-08-21.md`
  — this evidence receipt (the lane's claimed file).
- `.lane/reports/chore-brief-requested-clean-links-rereverify-2026-08-21.md`
  — lane report.

No source code is changed on this lane; opening a duplicate fix would
recreate the cluster the fleet reconciled in 2026-08-14.

## Delivery

- Branch: `chore/brief-requested-clean-links-rereverify-2026-08-21`
- Base: `origin/main` (`92d55c3`, 2026-08-20, head
  `fix(check): guard the apple touch icon on every served page…`)
- PR: opened against origin/main carrying the evidence closeout
