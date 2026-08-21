# Retired "TinyStudio Agent Desk" title/snippet in Google — live SERP measurement on a real-user browser session (2026-08-20)

Date: 2026-08-20
Scope: backlog item `f41c8af0f8` — "[unreviewed-by-opus] Google still presents
the retired self-serve 'TinyStudio Agent Desk' title/snippet for
tinystudio.io".

Verdict in one line: **this lane performed the live Google SERP measurement
prior lanes could not (bot-blocked via curl), and it confirms the item's
observation with one precise residual: Google's top organic result is the
retired `www.tinystudio.io` entity, whose cached site-name still reads
"TinyStudio Agent Desk" ("TinyStudio — The Website Appraisal - TinyStudio
Agent Desk", `www.tinystudio.io › audit`), while the apex result and the AI
Overview are current and correct. The residual is Google-cached index state
on the retired www entity, not something this repository still serves; the
repo-side levers that exist are all verified closed and enforced in CI.**

## Environment

- Source baseline: fresh `origin/main` at `d0daea9` (2026-08-15), branch
  `lane1/google-retired-agent-desk-snippet-rereverify-20260820`.
- Measurement: anonymous Google session (English, US, no personalisation)
  from the VPS via the Camoufox anti-detection browser — the same tool the
  controlled AI-search re-runs used. Executed 2026-08-20 ~14:11–14:15 UTC.
- Prior lanes (2026-08-09, 2026-08-12, 2026-08-17) could not measure the
  SERP: curl of DuckDuckGo/Bing was bot-blocked and Google's `/sorry/`
  CAPTCHA blocked the VPS IP on 2026-08-12. This lane's browser session got
  through without a CAPTCHA and captured the live SERP directly.

## What the finding was

Google presented the retired self-serve product's name — "tinystudio.io -
TinyStudio Agent Desk" — for the tinystudio.io site. Two root causes were
identified and both have been fixed and merged (PR #46: noindex + retired
framing on the legacy page; PR #229: the legacy page's canonical/og:url now
name the clean `/agent-desk` instead of the apex root; PR #181: every
`www.tinystudio.io` request 301s to the apex, preserving path/query):

1. The legacy `agent-desk.html` declared the apex root as its canonical, so
   Google consolidated the retired title onto the homepage URL.
2. A duplicate `www` host carried its own cached site name — "TinyStudio
   Agent Desk" — from when the desk owned the root, served byte-identical at
   200 over plain http.

Prior re-verification lanes closed the item's code-side causes and noted the
residual could only be Google's recrawl timetable, but the SERP itself had
never been measured from a real-user session.

## What this lane measured (live SERP, 2026-08-20)

### Google, query `tinystudio.io` (top organic results, verbatim)

| # | Title (verbatim) | Display URL | State |
|---|---|---|---|
| 1 | **TinyStudio — The Website Appraisal - TinyStudio Agent Desk** | `http://www.tinystudio.io › audit` | stale www entity: current page title + retired site-name suffix |
| 2 | TinyStudio — The Website Appraisal | `https://tinystudio.io` | current, clean |

- The #1 result's snippet ("The business under test, stated precisely:
  TinyStudio is the business behind this site, tinystudio.io — the free leak
  audit of high-ticket service homepages and ...") is **current audit-page
  content** — Google has recrawled the page content, but still attaches the
  retired "TinyStudio Agent Desk" name as the site-name for the `www`
  entity's URL.
- The #2 apex result is fully current: correct title, no retired name.
- The AI Overview on the same SERP is current and correct ("TinyStudio
  provides free leak audits and website appraisals for high-ticket service
  homepages. They review real pages, copy, numbers, and competitors to
  identify faults and fixes, limiting intake to six audits per month."),
  citing `tinystudio.io` — consistent with the fixture's `found` states for
  q5/q7 on 2026-08-15.
- The controlled-question state (q5 "What is tinystudio.io?") therefore
  holds: the AI Overview names the tested business with facts that check out
  against the site; the organic #1 presentation is the residual the item
  tracks.

### Live HTTP re-verification (2026-08-20, same run)

| Surface | Result |
|---|---|
| `http://www.tinystudio.io/audit` | `301` → `https://tinystudio.io/audit` (the exact URL Google displays) |
| `https://www.tinystudio.io/audit` | `301` → `https://tinystudio.io/audit` |
| `https://www.tinystudio.io/` | `301` → `https://tinystudio.io/` |
| `https://tinystudio.io/audit` | `200`, `<title>TinyStudio — The Website Appraisal</title>`, self-canonical `https://tinystudio.io/audit` |
| `https://tinystudio.io/` | `200`, `<title>TinyStudio — The Website Appraisal</title>`, self-canonical |
| `https://tinystudio.io/agent-desk` | `200`, `noindex, nofollow`, "TinyStudio — the retired Agent Desk", canonical + og:url `https://tinystudio.io/agent-desk` |

All pages serve WebSite/Organization JSON-LD naming the site "TinyStudio"
with `url: https://tinystudio.io/` — the apex only, no www, no "Agent Desk".

## What is not claimed

- No change to Google's index state was made or could be made from this
  repo. The residual is Google's cached site-name on the retired `www`
  entity, which this repository no longer serves (301 to the apex) and
  which Google must re-crawl and re-consolidate on its own timetable.
- No Search Console lever was available: no `google-site-verification`
  token exists in the repo or in `tinystudio.io` TXT records, so a
  re-crawl request or site-name fix cannot be submitted from here (owner
  action, out of lane scope).
- This is a measurement, not a fix. It claims nothing about ranking,
  visibility, leads, or revenue.

## Verification (reproduce)

```sh
npm run check        # "TinyStudio.io checks passed."
npm test             # headings, sitemap, worker, UI, contract, study,
                     # viewport, narrow — 0 failures (121 tests, 2026-08-17
                     # baseline; re-run this lane)
git diff --check     # clean
```

Live SERP reproduce: open an anonymous Google session, query
`tinystudio.io`; observe result #1 as recorded above.

## Closeout

The item's remaining residual is precisely located: Google's cached
site-name "TinyStudio Agent Desk" on the retired `www.tinystudio.io` entity,
displayed on the top organic result whose content Google has already
refreshed. The repo serves nothing that still declares that name; CI fails
if the retired framing, the canonical, or the www redirect ever drift. This
lane lands the first real-user SERP measurement receipt; the residual
closes only when Google's index refresh consolidates the www entity — an
external timetable, tracked by re-running this measurement.
