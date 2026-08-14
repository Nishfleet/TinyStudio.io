# Lane 1 — retired-host Agent Desk message replaced by the Website Appraisal truth — re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `fix/lane1-retired-host-message-to-website-appraisal`
Item: `2e66c2839d` — "[unreviewed-by-opus] Replace the retired-host Agent Desk
message with the current Website Appraisal truth — both historical
subdomains still tell visitors the retired self-serve product is current"

## Outcome

**Closed. The retired-host Agent Desk message has already been replaced with
the current Website Appraisal truth on `origin/main` head `1114383`, and this
lane re-verified the replacement against the current head and the live
deployment of that head. No code change was needed; the closeout evidence is
recorded.**

## Verification performed

1. **Source state on the current head** — `src/worker.js`
   `retiredAppResponse` (line 1300) and `retiredApiResponse` (line 1322) on
   `origin/main` `1114383` carry the Website Appraisal truth and zero "Agent
   Desk" mentions; `grep -n "Agent Desk" src/worker.js` returns only four
   internal legacy-mechanics comments (lines 56, 99, 1230) and the legacy
   `/api/agent-audit` system prompt (line 848), never the retirement
   responses.
2. **Site-wide checker** — `node scripts/check-site.mjs` → exit 0;
   "TinyStudio.io checks passed."
3. **Worker test suite** — `node --test scripts/test-agent-worker.mjs` →
   exit 0; 76 tests, 0 failures. The two regression tests PR #100 added
   pass on this head — "retired app host frames the current offer as The
   Website Appraisal, not the Agent Desk" (worker test 58) and "retired
   API host frames the current offer as The Website Appraisal, not the
   Agent Desk" (worker test 59).
4. **Live retirement hosts match source** —
   `GET https://app.tinystudio.io/` → HTTP 410; body carries exactly one
   "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
   occurrences, byte-identical to `src/worker.js` line 1300 on the current
   head.
   `GET https://api.tinystudio.io/` → HTTP 410; body carries exactly one
   "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
   occurrences, byte-identical to `src/worker.js` line 1322 on the current
   head.
5. **Deployed release is past the fix** —
   `release-state-tinystudio-io.json` pins the live Cloudflare Worker
   release to `11143836bd88e32297bf7e26e34025e14706da18`; `git merge-base
   --is-ancestor 5ab84ea 11143836` confirms PR #100's fix commit is inside
   the deployed release.
6. **No regression since the 2026-08-12 closeout** — the four worker.js
   commits since `6534795` (`60d045c`, `7fc1b05`, `aeb34a9`, `66aa81e`) are
   unrelated or strengthen the same Website-Appraisal-over-Agent-Desk
   labelling; `git diff 5ab84ea..1114383 -- src/worker.js | grep "^\+.*Agent
   Desk"` returns only two legacy-mechanics comments, never the retirement
   responses.

## Files changed

- `docs/evidence/retired-hosts-appraisal-truth-rereverify-2026-08-14.md` —
  new evidence receipt recording the closeout on the current head and live
  site (the lane's claimed file).
- `.lane/reports/fix-lane1-retired-host-message-to-website-appraisal-rereverify-2026-08-14.md`
  — this report.

## Verification commands

- `git rev-parse origin/main` → `11143836bd88e32297bf7e26e34025e14706da18`.
- `grep -n "Agent Desk" src/worker.js` — only internal legacy comments
  (lines 56, 99, 1230) and the legacy `/api/agent-audit` system prompt
  (line 848); no retirement response.
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test scripts/test-agent-worker.mjs` → 76/76 pass; tests 58 and 59
  pass.
- `curl -s -w "%{http_code}" https://app.tinystudio.io/` → 410; the served
  HTML has one "The Website Appraisal" and zero "Agent Desk" / "self-serve
  Agent Desk" occurrences.
- `curl -s -w "%{http_code}" https://api.tinystudio.io/` → 410; the served
  JSON has one "The Website Appraisal" and zero "Agent Desk" / "self-serve
  Agent Desk" occurrences.

## Honest boundary

This lane claims no behavioural change in the public surface. The retired
`/agent-desk` page and the legacy `/api/agent-audit` endpoint remain
operational as legacy mechanics, exactly as the current plan's "Legacy
Mechanics (retired, still operational)" section describes. This lane
makes no claim about pricing/legal prose (owned by other lanes), the
README/MEMORY/specs product-contract wording (owned by the lane that closed
`e9b7a5a184`), or any other review item.
