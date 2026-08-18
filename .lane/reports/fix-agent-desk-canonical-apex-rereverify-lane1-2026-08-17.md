# Lane 1 — Stop retired `/agent-desk` from claiming the apex root as its canonical — re-verify (2026-08-17)

Lane: tinystudio-io lane 1
Branch: `fix/agent-desk-canonical-apex-rereverify-lane1-2026-08-17`
Item: `67d184c9a7` — "[unreviewed-by-opus] Stop `/agent-desk` from claiming
the apex root as its canonical — the live legacy surface still…"
(truncated at dispatch)

## Outcome

**Closed. The retired `/agent-desk` surface no longer claims the apex
root as its canonical or og:url on `origin/main` (head `4efeb4d`) and is
verified live on 2026-08-17. No code change was needed; this lane lands
the re-verification receipt.**

## What this lane checked

The lane reads the truncated item text as: "the live legacy `/agent-desk`
surface still declares the apex root as its canonical / og:url". That is
the exact consolidation path by which Google once presented the retired
"TinyStudio Agent Desk" title/snippet for `tinystudio.io` — the legacy
page's head metadata named `https://tinystudio.io/` as its own canonical,
so Google consolidated the retired title onto the homepage URL. The fix
landed in PR #229 (commit `798cd71`, merged 2026-08-17) and is the
canonical version of the older open PR #91 (which pointed the canonical
at the 307-redirecting `/agent-desk.html` form).

Re-verified on the current `origin/main` head (`4efeb4d`) and against the
live deployment of that head on 2026-08-17:

1. **Source — `public/agent-desk.html`** carries
   `<meta name="robots" content="noindex, nofollow" />`, titles itself
   "TinyStudio — the retired Agent Desk", and both canonical and og:url
   name `https://tinystudio.io/agent-desk`. The page no longer contains
   `https://tinystudio.io/` as the value of any `<link rel="canonical">`
   or `<meta property="og:url">` element. The clean `/agent-desk`
   address serves 200 directly; the `.html` twin serves 307 to it.
2. **Source — `scripts/check-site.mjs`** "Retired Agent Desk index guard"
   fails `npm run check` if the page drops the `noindex, nofollow` meta,
   the retired-framing description, the canonical, the og:url, or if any
   of them is duplicated or points anywhere other than
   `https://tinystudio.io/agent-desk`. A regression to the apex-root
   claim therefore fails the build before it can ship.
3. **Live — `https://tinystudio.io/agent-desk`** serves `200` with
   `noindex, nofollow`, canonical `https://tinystudio.io/agent-desk`,
   and og:url `https://tinystudio.io/agent-desk`. The
   `https://tinystudio.io/agent-desk.html` twin serves `307` to it.
4. **Live — `https://tinystudio.io/`** serves `200` with title "TinyStudio
   — The Website Appraisal" and zero "Agent Desk" strings in the served
   HTML. The other served pages (`/audit`, `/agents`, `/pricing`,
   `/specimen`, `/brief-requested`) all carry self canonicals at their
   own addresses; none of them is the apex root claimed by `/agent-desk`.
5. **Static checks and tests** all green:
   - `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
   - `node --test scripts/test-agent-worker.mjs` → 80 / 80
   - `node --test scripts/test-sitemap.mjs` → 7 / 7
   - `node --test scripts/test-heading-hierarchy.mjs` → 6 / 6
   - `node --test scripts/test-product-contract.mjs` → 8 / 8
   - `node --test scripts/test-agent-ui.mjs` → 16 / 16
   - `node --test scripts/test-first-viewport-audience.mjs` → 4 / 4
   - Total: 121 tests, 0 failures.
   - `git diff --check` clean.
6. **Negative test (in `/tmp`, not committed)** — with
   `public/agent-desk.html` reverted to canonical `https://tinystudio.io/`
   and og:url `https://tinystudio.io/`, `node scripts/check-site.mjs`
   exits non-zero with both "Retired Agent Desk canonical must point at
   `https://tinystudio.io/agent-desk`" and "Retired Agent Desk og:url
   must point at `https://tinystudio.io/agent-desk`" messages;
   restoring the correct values returns `npm run check` to green. The
   guard is live and the fix is regression-proof.

## Files changed

- `docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-17.md` —
  full re-verification receipt (environment, source check, live check,
  reproduce, negative test, closeout, non-claims).
- `.lane/reports/fix-agent-desk-canonical-apex-rereverify-lane1-2026-08-17.md`
  — this report.

## Non-claim

No Google SERP change is claimed. Google's recrawl and site-name refresh
run on Google's timetable, and SERP fetches are bot-blocked (DuckDuckGo
HTML and Bing both returned bot pages / unrelated results when probed
2026-08-17). The honest claim is the site-side one: the legacy page no
longer names the apex root as its canonical or og:url on the current
head or on live, the regression guard catches any drift, and no served
surface still consolidates the retired "TinyStudio Agent Desk" title
onto the homepage URL.

## Relationship to other receipts

This receipt complements — and does not overlap — the parent finding's
re-verification (`docs/evidence/agent-desk-retired-title-rereverify-2026-08-17.md`,
lane report `.lane/reports/lane1-google-retired-agent-desk-snippet.md`),
which closes both the apex-root canonical claim and the duplicate
`www` site entity. This lane is specifically scoped to the canonical
claim, so a future reader can see one receipt per concern even though
both were fixed in the same PR cluster.
