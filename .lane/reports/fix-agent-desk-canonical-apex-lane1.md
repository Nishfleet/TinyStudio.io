# Lane 1 — retired "TinyStudio Agent Desk" title/snippet (f41c8af0f8) — 2026-08-15

## Verdict

The one remaining repo-side mechanism still feeding the retired name to
Google is closed: the legacy `/agent-desk` surface no longer declares the
apex root as its canonical/og:url, and a regression guard now fails the
build if that claim returns. The canonical fix has been blocked in open PR
#91 since 2026-08-10; this branch lands the corrected version.

## Why the item was still live

- The 2026-08-09 de-indexing pass (PR #46) added `noindex, nofollow` and
  retired framing to `public/agent-desk.html` — that part has held.
- The 2026-08-14 pass (the www-host 301) collapsed the duplicate
  `www.tinystudio.io` site entity that carried the stale "TinyStudio Agent
  Desk" site name — that part has held too.
- But `public/agent-desk.html` still declared
  `<link rel="canonical" href="https://tinystudio.io/" />` and
  `og:url` = `https://tinystudio.io/` — the exact consolidation mechanism by
  which the retired title reached the homepage URL (q5/google capture
  2026-08-06). Verified live on 2026-08-15: `/agent-desk` serves that
  apex-root claim, and the page is noindex, so its canonical tells Google the
  legacy surface is a duplicate of the homepage.
- The canonical fix has been open in PR #91 since 2026-08-10 and is still
  unmerged on main; main and live therefore still served the apex-root claim.

## The change

- `public/agent-desk.html`: canonical and og:url now name the legacy page's
  own address `https://tinystudio.io/agent-desk` — the clean form that serves
  200 — never the apex root. (PR #91 pointed them at `/agent-desk.html`, but
  that form 307-redirects to `/agent-desk`; the repo's own canonical
  convention, which the audit page already follows, requires naming the
  200-serving address.)
- `scripts/check-site.mjs`: the retired-desk index guard now also requires
  exactly one canonical and one og:url, both naming
  `https://tinystudio.io/agent-desk`. Regression proof: re-pointing them at
  the apex root makes `npm run check` fail with both messages.

## Verification

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `npm test` → 121 tests, 0 failures (6 headings, 7 sitemap, 80 agent-worker,
  16 agent-UI, 8 product-contract, 4 first-viewport-audience), plus the
  narrow-viewport suite PASS.
- `git diff --check` clean.
- Guard negative test: apex-root canonical → `npm run check` exit 1 with
  both canonical and og:url failures; restored fix → green.
- Live baseline (2026-08-15, before deploy): `/agent-desk` 200 carrying
  `canonical https://tinystudio.io/` + `og:url https://tinystudio.io/`;
  `/agent-desk.html` 307 → `/agent-desk`.

## Files touched

- `public/agent-desk.html` — canonical/og:url point at the legacy page's own
  200-serving address.
- `scripts/check-site.mjs` — guard requires canonical/og:url =
  `https://tinystudio.io/agent-desk`.
- `.lane/reports/fix-agent-desk-canonical-apex-lane1.md` — this report.

## PR relationship

PR #91 (`fix/agent-desk-canonical-lane1`) carries the same fix intent but
points the canonical at the 307-redirecting `/agent-desk.html` form and its
guard covers only the canonical, not og:url. This branch is the corrected
delivery; #91 is closed as superseded so exactly one delivery path remains.
