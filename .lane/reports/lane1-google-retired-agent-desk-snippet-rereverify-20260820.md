# Lane 1 — retired "TinyStudio Agent Desk" title/snippet: first live SERP measurement (2026-08-20)

Item `f41c8af0f8` — "Google still presents the retired self-serve
'TinyStudio Agent Desk' title/snippet for tinystudio.io".

## Verdict

**The item's observation still holds in one precise place, now measured from
a real-user Google session (Camoufox, no CAPTCHA): Google's top organic
result for `tinystudio.io` is the retired `www.tinystudio.io` entity —
"TinyStudio — The Website Appraisal - TinyStudio Agent Desk",
`http://www.tinystudio.io › audit` — with the retired site-name appended to
the current page title. The apex result (#2) and the AI Overview are
current and correct. All repo-side levers are verified closed and live
(www → apex 301 on the exact displayed URL; audit page current; legacy page
noindex + self-canonical), so the residual is Google-cached index state on
the retired www entity, on Google's recrawl timetable.**

Prior lanes (2026-08-09/12/17) closed the code-side causes but could not
measure the SERP (curl bot-blocked; Google `/sorry/` CAPTCHA on
2026-08-12). This lane succeeded where they could not and pinned the
residual to the www entity.

## What was measured (2026-08-20, ~14:11–14:15 UTC)

- Google `tinystudio.io`: #1 `TinyStudio — The Website Appraisal - TinyStudio
  Agent Desk` / `http://www.tinystudio.io › audit`; #2 `TinyStudio — The
  Website Appraisal` / `https://tinystudio.io`. The #1 snippet is current
  audit-page content — Google refreshed the content but kept the cached
  www site-name.
- AI Overview on the same SERP: current and correct, citing tinystudio.io —
  consistent with the fixture's `found` q5/q7 states.
- Live: `http://www.tinystudio.io/audit` and `https://www.tinystudio.io/audit`
  → `301` to `https://tinystudio.io/audit` (200, current title, self-canonical);
  `/agent-desk` → 200 `noindex, nofollow`, retired framing, self-canonical.
- JSON-LD on every public page: WebSite/Organization name "TinyStudio",
  apex URL only.
- No Search Console lever: no `google-site-verification` token in repo or
  DNS TXT; re-crawl request is an owner action, out of lane scope.

## Files changed

- `docs/evidence/agent-desk-retired-title-rereverify-2026-08-20.md` — full
  measurement receipt (live SERP table, live HTTP table, what is/is not
  claimed, reproduce).
- `.lane/reports/lane1-google-retired-agent-desk-snippet-rereverify-20260820.md`
  — this report.

## Outcome

The item stays open on the residual: Google's cached site-name on the
retired `www` entity. It closes only when Google's index refresh
consolidates that entity — external, tracked by re-running this same
measurement. The repository itself emits nothing that still presents the
retired name, and CI fails if it ever drifts.
