# Lane 1 — retired "TinyStudio Agent Desk" title/snippet re-verification (2026-08-17)

Finding (item `f41c8af0f8`): "Google still presents the retired self-serve
'TinyStudio Agent Desk' title/snippet for tinystudio.io".

## Verdict

**All code-side paths that handed Google the retired "TinyStudio Agent Desk"
name are closed on current main and verified on live. The last one — the
legacy `/agent-desk` page's canonical and og:url still claiming the apex
root — was merged today as PR #229 (commit `798cd71`) and is served
correctly in production. No new code change was needed; this lane lands the
re-verification receipt.**

## What this lane checked

The finding had two root causes, both already merged before this lane:

1. **Legacy page → apex-root canonical consolidation.** `public/agent-desk.html`
   declared canonical/og:url at `https://tinystudio.io/`, so Google
   consolidated the retired title onto the homepage URL. Fixed by PR #46
   (2026-08-09: `noindex, nofollow` + retired framing) and PR #229
   (2026-08-17: canonical/og:url now name the clean `/agent-desk`; the
   `check-site.mjs` desk guard now requires exactly one canonical and one
   og:url, both pointing at `/agent-desk`).
2. **Duplicate `www` host with a cached "TinyStudio Agent Desk" site name.**
   `www.tinystudio.io` answered 200 with a byte-identical copy over plain
   http. Fixed by PR #181 (`05efed1`): the worker now 301s every www request
   to the apex, preserving path/query and upgrading to https.

Re-verified on the current origin/main head (`7d3a8ae`) and against live on
2026-08-17:

1. **Live HTTP:**
   - `https://tinystudio.io/` → `200`, title "TinyStudio — The Website
     Appraisal", canonical self, zero "Agent Desk" in the served HTML.
   - `https://www.tinystudio.io/`, `http://www.tinystudio.io/` → `301` →
     `https://tinystudio.io/`; deep paths and query preserved
     (`/agents`, `/pricing?utm_source=x&utm_medium=y`,
     `/does-not-exist`).
   - `https://tinystudio.io/agent-desk` → `200`, `noindex, nofollow`,
     canonical + og:url `https://tinystudio.io/agent-desk`.
   - `https://tinystudio.io/agent-desk.html` → `307` → `/agent-desk`.
   - `https://app.tinystudio.io/` and `https://api.tinystudio.io/` → `410`
     naming the current offer.
   - `robots.txt`, `sitemap.xml` (apex-only), `llms.txt` and `offer.md`
     (demotion statements) all served correctly.
2. **Static checks and tests:** `npm run check` → "TinyStudio.io checks
   passed." `npm test` → headings 6, sitemap 7, worker 80, UI 16, contract
   8, viewport 4 — 121 tests, 0 failures — plus narrow-viewport and
   render-blocking passes green. `git diff --check` clean.
3. **SERP measurement attempt:** curl fetches of DuckDuckGo/Bing were
   bot-blocked (returned bot pages / unrelated results). A real-user
   browser search session is required to observe Google's index state, and
   recrawl is Google's timetable. What the repository serves is fully
   verified; any residual cached presentation is index refresh, not
   something this repo still emits.

## Files changed

- `docs/evidence/agent-desk-retired-title-rereverify-2026-08-17.md` — full
  re-verification receipt (root causes, code + CI state, live table,
  reproduce commands, non-claims, closeout).
- `.lane/reports/lane1-google-retired-agent-desk-snippet.md` — this report.

## Outcome

The item is closed against current main and live: no served surface still
declares the retired "TinyStudio Agent Desk" title/snippet, the legacy page
is excluded from the index and can no longer claim the apex root, the
duplicate www entity is retired by 301, and CI fails if any of it drifts.