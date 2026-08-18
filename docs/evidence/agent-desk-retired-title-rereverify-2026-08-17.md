# Retired "TinyStudio Agent Desk" title/snippet in Google — re-verification on current main and live (2026-08-17)

Date: 2026-08-17
Scope: backlog item `f41c8af0f8` — "[unreviewed-by-opus] Google still presents
the retired self-serve 'TinyStudio Agent Desk' title/snippet for tinystudio.io".

Verdict in one line: **every code-side path that fed Google the retired
"TinyStudio Agent Desk" name is closed on current main and verified on live —
the last one (the legacy page's canonical still claiming the apex root) was
merged today as PR #229 and is served correctly — so this lane lands the
closing re-verification receipt with no new code change needed.**

## Environment

- Source baseline: fresh `origin/main` at `7d3a8ae` (PR #234, 2026-08-17).
- Live target: `https://tinystudio.io/`, `https://www.tinystudio.io/`,
  `http://www.tinystudio.io/`, `https://app.tinystudio.io/`,
  `https://api.tinystudio.io/`, and every served public page.
- All live fetches below were made on 2026-08-17 ~00:32–00:38 UTC.

## What the finding was

Captured in `evidence-fixtures/ai-search/evidence.json` (q5/google 2026-08-06
and q5/q7/bing 2026-08-12): Google presented the retired self-serve product's
name — "tinystudio.io - TinyStudio Agent Desk" — for the tinystudio.io site,
with the description "Self-serve AI agents for high-ticket pipeline setup:
offer, funnel, creative, qualification, follow-up, CRM, tracking, and decision
plans." Two root causes were identified and each has been fixed and merged:

1. **Legacy page claimed the apex root as its canonical.** `public/agent-desk.html`
   (served at `/agent-desk`) declared canonical/og:url pointing at
   `https://tinystudio.io/` — Google consolidated the retired title onto the
   homepage URL. Fixed in two stages: PR #46 (2026-08-09) added
   `noindex, nofollow` + retired framing to the page; PR #229 (2026-08-17,
   commit `798cd71`, merged today) made its canonical and og:url name the
   legacy page itself (`https://tinystudio.io/agent-desk`) so the retired
   name stops being handed to the apex root.
2. **Duplicate `www` host carried its own cached site name.** Google indexed
   `www.tinystudio.io` as a separate site entity whose cached site name was
   still "TinyStudio Agent Desk" (from when the desk owned the root), served
   as a byte-identical copy at 200 over plain http. Fixed by PR #181
   (commit `05efed1`): the worker now 301s every `www.tinystudio.io` request
   to the canonical apex, preserving path and query, upgrading http to https.

## What this lane re-verified (current main, code + CI)

- `src/worker.js` still carries the canonical-host redirect ahead of all
  other dispatch: `host === "www.tinystudio.io"` → `301` with
  `Location: https://tinystudio.io/` (path/query preserved, `https` forced,
  port cleared).
- `public/agent-desk.html` head carries exactly one
  `<meta name="robots" content="noindex, nofollow" />`, titles itself
  "TinyStudio — the retired Agent Desk", its description opens "The
  self-serve Agent Desk is retired and is not the current offer.", and its
  canonical and og:url both name `https://tinystudio.io/agent-desk`.
- `scripts/check-site.mjs` "Retired Agent Desk index guard" (extended by
  #229) fails `npm run check` if the robots meta or retired framing is
  removed, or if the canonical / og:url are absent, duplicated, or point
  anywhere other than the clean `/agent-desk`.
- `scripts/test-agent-worker.mjs` guards: www → 301 with the apex Location;
  path/query preserved; www never serves public-site HTML; apex and the
  retired `app.`/`api.` hosts unaffected.
- `robots.txt`: no Disallow (a disallowed page cannot be crawled to see the
  noindex meta — deliberate, unchanged).
- `sitemap.xml`: seven apex URLs only; the legacy surface stays absent.
- `llms.txt` / `offer.md`: keep the demotion — "Legacy Self-Serve Agent
  Desk" / "The earlier self-serve Agent Desk … is demoted and is not the
  current offer."
- No served public page outside the legacy surface carries the retired
  product name in its own head metadata. The only other "TinyStudio Agent
  Desk" string in served HTML is inside the `ai-search-evidence` JSON
  fixture embedded in `/audit` — historical capture evidence describing the
  past SERP state, on a page whose own `<title>`/`description`/canonical
  are current; not presented title or snippet.

## What this lane re-verified (live)

| Surface | Result |
|---|---|
| `https://tinystudio.io/` | `200`; `<title>TinyStudio — The Website Appraisal</title>`; canonical `https://tinystudio.io/`; og:title/description current; zero "Agent Desk" occurrences in the served HTML |
| `/audit`, `/agents`, `/pricing`, `/specimen`, `/brief-requested` | `200`; current titles, self canonicals, current descriptions |
| `https://www.tinystudio.io/` | `301` → `https://tinystudio.io/` |
| `http://www.tinystudio.io/` | `301` → `https://tinystudio.io/` |
| `https://www.tinystudio.io/agents`, `http://www.tinystudio.io/pricing?utm_source=x&utm_medium=y`, `https://www.tinystudio.io/does-not-exist` | `301` with path/query preserved to the apex equivalent |
| `https://tinystudio.io/agent-desk` | `200`; `noindex, nofollow`; "TinyStudio — the retired Agent Desk"; canonical + og:url `https://tinystudio.io/agent-desk` |
| `https://tinystudio.io/agent-desk.html` | `307` → `/agent-desk`, same head |
| `https://app.tinystudio.io/` | `410` "TinyStudio app retired." naming the current offer |
| `https://api.tinystudio.io/` | `410` JSON "retired" naming the current offer |
| `robots.txt`, `sitemap.xml`, `llms.txt`, `offer.md` | All served, apex-only, demotion statements intact |

## Verification (reproduce)

```
npm run check        # "TinyStudio.io checks passed."
npm test             # headings 6, sitemap 7, worker 80, UI 16, contract 8,
                     # viewport 4 — 121 tests, 0 failures; narrow-viewport
                     # and render-blocking passes green
git diff --check     # clean
```

All three pass on this head.

## What is not claimed

No SERP change is claimed and none could be: Google's recrawl and site-name
refresh run on Google's timetable, and SERP measurement requires a
real-user search session (curl SERP fetches are bot-blocked — attempted
2026-08-17, DuckDuckGo HTML and Bing both returned bot pages / unrelated
results). The honest claim is the site-side one: the two consolidation
paths by which the retired name reached Google — the legacy page claiming
the apex root as canonical, and the duplicate `www` site entity — are both
closed in code, enforced in CI, and verified live. Any residual "TinyStudio
Agent Desk" presentation in Google is cached index state awaiting Google's
recrawl, not something this repository still serves.

## Closeout

The item's code-side causes are fully closed against current main and live.
The lane lands this re-verification receipt (this file) and its lane report
(`.lane/reports/lane1-google-retired-agent-desk-snippet.md`).