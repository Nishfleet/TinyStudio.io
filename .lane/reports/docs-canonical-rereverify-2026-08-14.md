# Lane 1 report — canonical-URL finding 6631c0ab0454 re-verification (2026-08-14)

Branch: `docs/canonical-rereverify-2026-08-14`
Item: [dogfood 6631c0ab0454] Missing canonical URL on home

## Verdict

Already fixed and live. Finding 6631c0ab0454 was closed by PR #29
("seo: add canonical URLs to the five public pages") and has been
re-verified on 2026-08-09, 2026-08-11 (twice), 2026-08-12, and
2026-08-13 against current main and the deployed site. This lane
re-confirmed all three halves on 2026-08-14 against origin/main head
20b7cc6:

1. Source + CI: `npm test` passes on 20b7cc6 ("TinyStudio.io checks
   passed"). The "Canonical URLs (dogfood)" guard in
   `scripts/check-site.mjs` enforces exactly one non-commented
   `<link rel="canonical">` inside `<head>` per page, a non-empty href
   pointing at the page's canonical `https://tinystudio.io` address
   (home: `https://tinystudio.io/`), and no URL duplicated across pages.
2. Live: all five public pages serve exactly one canonical link in the
   head; home serves `<link rel="canonical" href="https://tinystudio.io/">`,
   unchanged from every prior receipt.
3. Deployment parity: live matches origin/main byte-for-byte on all five
   public pages (curl -sL through the .html 307s diffed against source).

Commits since the last re-verify (dc1542a..20b7cc6): 51d5849 (#151
domain-valuation bridge) and 20b7cc6 (#208 buyer-audience evidence).
`git log -p dc1542a..20b7cc6 -- public/index.html` shows no canonical-line
change; the only `scripts/check-site.mjs` edit in range is a comment
rewrite, no functional guard change.

## Change

- `docs/evidence/canonical-urls-2026-08-09.md`: appended the 2026-08-14
  re-verification section (58 lines) to the standing evidence receipt.

## Evidence

- Source guard: `scripts/check-site.mjs` lines ~1699-1744.
- Live home canonical (2026-08-14): `curl -s https://tinystudio.io/` →
  `<link rel="canonical" href="https://tinystudio.io/">`
- Prior receipts: `docs/evidence/canonical-urls-2026-08-09.md` (closeout +
  re-verifications 2026-08-11/12/13).
