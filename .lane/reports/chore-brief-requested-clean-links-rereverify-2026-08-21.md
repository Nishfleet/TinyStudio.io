# Lane report: brief-requested clean nav/back links re-verify (2026-08-21, lane 1)

Lane: tinystudio-io lane 1
Branch: `chore/brief-requested-clean-links-rereverify-2026-08-21`
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and
back links at clean non-307 paths — post-signup surface still carries the
redirecting-internal-link fault"

## Outcome

**Closed (no code change).** The fix landed on `main` via the survivor
delivery path PR #145 (`f9214c1`, 2026-08-14) and the guard hardening
PR #243 (`9f79c71`, 2026-08-15) that catches every redirecting spelling.
Both remain landed on current `origin/main` (`92d55c3`, 2026-08-20) and
the live site still serves the post-signup surface with five clean
anchors (verified 2026-08-21, all targets 200, `brief-requested.html` →
307 `/brief-requested`). No fix is claimed on this branch — opening a
duplicate would recreate the cluster the fleet reconciled in
2026-08-14.

## Verification performed (2026-08-21)

1. **Live probe of the surface** — `https://tinystudio.io/brief-requested`
   200, five `<a>` elements: `<a class="logo" href="/">`, `<a
   href="/audit">`, `<a href="/agents">`, `<a href="/pricing">`, `<a
   class="back" href="/">`. No `.html` anchor in the served HTML.
2. **Live probe of every target** — `/`, `/audit`, `/agents`,
   `/pricing`, `/shared.css`, `/brief-requested.css`,
   `/brief-requested.js`, `/fonts.js`, `/favicon.svg`,
   `/apple-touch-icon.png` all 200. `/brief-requested.html` → 307
   `/brief-requested`.
3. **Live probe of the redirecting `.html` twins** — `/audit.html`,
   `/agents.html`, `/pricing.html`, `/specimen.html`, `/index.html`,
   `/agent-desk.html` each 307 to its clean extensionless twin.
4. **`check-site.mjs`** on current main → "TinyStudio.io checks passed."
   (exit 0).
5. **Negative probe of the hardened guard** — all nine redirecting
   spellings (`audit.html`, `/audit.html`, `./audit.html`,
   `https://tinystudio.io/audit.html`,
   `https://www.tinystudio.io/audit.html`,
   `//tinystudio.io/audit.html`, `/audit.html?utm=foo`,
   `/audit.html#next`, `brief-requested.html`) re-introduced on
   `public/brief-requested.html` (restored between probes) → each makes
   `check-site.mjs` exit 1 with the targeted message naming the clean
   destination.
6. **False-positive probe** — off-site `https://inish.in/audit.html`,
   `mailto:`, `#start`, absolute clean
   `https://tinystudio.io/audit`, and
   `https://www.tinystudio.io/audit` → exit 0.
7. **Full suite on the tree** — headings 6/6, sitemap 7/7, worker
   83/83, product-contract 8/8.

## Files changed

- `docs/evidence/brief-requested-clean-links-rereverify-2026-08-21.md`
  — evidence receipt for this run.
- `.lane/reports/chore-brief-requested-clean-links-rereverify-2026-08-21.md`
  — this lane report.

No source code change.

## Delivery

- Branch: `chore/brief-requested-clean-links-rereverify-2026-08-21`
- Base: `origin/main` (`92d55c3`, 2026-08-20)
- PR: opened against origin/main carrying the evidence closeout
