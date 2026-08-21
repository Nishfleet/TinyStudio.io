# Lane 1 — retired-host Agent Desk message replaced by the Website Appraisal truth — re-verify (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `docs/retired-hosts-appraisal-truth-rereverify-2026-08-21`
Item: `2e66c2839d` — "[unreviewed-by-opus] Replace the retired-host Agent Desk
message with the current Website Appraisal truth — both historical
subdomains still tell visitors the retired self-serve product is current"

## Outcome

**Closed. The retired-host Agent Desk message remains replaced with the
current Website Appraisal truth on `origin/main` head `92d55c3` and on the
live retirement hosts. No code change was needed; this lane re-verified the
replacement against the current head, the test suite, and the live
deployment, and recorded the evidence.**

## Verification performed

1. **Source state on the current head** — `src/worker.js`
   `retiredAppResponse` (line 1358) and `retiredApiResponse` (line 1394) on
   `origin/main` `92d55c3` carry the Website Appraisal truth and zero "Agent
   Desk" mentions; `grep -n "Agent Desk" src/worker.js` returns only
   internal legacy-mechanics comments (lines 56, 112, 1308, 1469, 1474) and
   the legacy `/api/agent-audit` system prompt (line 926), never the
   retirement responses.
2. **Site-wide checker** — `node scripts/check-site.mjs` → exit 0;
   "TinyStudio.io checks passed."
3. **Worker test suite** — `node --test scripts/test-agent-worker.mjs` →
   exit 0; 83 tests, 0 failures. The two regression tests PR #100 added
   pass on this head — "retired app host frames the current offer as The
   Website Appraisal, not the Agent Desk" (line 1235) and "retired API host
   frames the current offer as The Website Appraisal, not the Agent Desk"
   (line 1244).
4. **No regression since the 2026-08-14 re-verify** — the three worker.js
   commits since `11143836` (`dda25f2` #245 intake cap, `5ca6241` #238
   favicon, `05efed1` #181 www-host redirect) are unrelated to the
   retirement messages; `git diff 11143836..origin/main -- src/worker.js`
   shows only added comments, never edits to the 410 bodies.
5. **Live retirement hosts match the fix** —
   `GET https://app.tinystudio.io/` → HTTP 410; body carries exactly one
   "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
   occurrences.
   `GET https://api.tinystudio.io/` → HTTP 410; body carries exactly one
   "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
   occurrences.

## Files changed

- `docs/evidence/retired-hosts-appraisal-truth-rereverify-2026-08-21.md` —
  new evidence receipt recording the closeout on the current head and live
  site (the lane's claimed file).
- `.lane/reports/docs-retired-hosts-appraisal-truth-rereverify-2026-08-21.md`
  — this report.

## Verification commands

- `git rev-parse origin/main` → `92d55c3ede64be3cfb8c40b144967b371ac24982`.
- `grep -n "Agent Desk" src/worker.js` — only internal legacy comments
  (lines 56, 112, 1308, 1469, 1474) and the legacy `/api/agent-audit`
  system prompt (line 926); no retirement response.
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test scripts/test-agent-worker.mjs` → 83/83 pass; tests 58 and 59
  pass.
- `curl -s -o /dev/null -w "%{http_code}" https://app.tinystudio.io/` →
  410; the served HTML has one "The Website Appraisal" and zero "Agent
  Desk" / "self-serve Agent Desk" occurrences.
- `curl -s -o /dev/null -w "%{http_code}" https://api.tinystudio.io/` →
  410; the served JSON has one "The Website Appraisal" and zero "Agent
  Desk" / "self-serve Agent Desk" occurrences.

## Honest boundary

This lane claims no behavioural change in the public surface; it is a
re-verification receipt only. The retired `/agent-desk` page and the legacy
`/api/agent-audit` endpoint remain operational as legacy mechanics, exactly
as the current plan's "Legacy Mechanics (retired, still operational)"
section describes. This lane makes no claim about pricing/legal prose,
README/MEMORY/specs product-contract wording, or any other review item.
