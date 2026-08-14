# Retired-host Agent Desk message replaced by the Website Appraisal truth — re-verification (2026-08-14)

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] Replace the retired-host
Agent Desk message with the current Website Appraisal truth — both historical
subdomains still tell visitors the retired self-serve product is current"
(item `2e66c2839d`, review 2026-08-05, risk: amber, parity-risk). The original
runtime fix landed in PR #100 (`5ab84ea`, "fix(worker): point the retired
app/api hosts at The Website Appraisal, not the Agent Desk") and was closed
against `ad9cee3` on 2026-08-12 by the closeout receipt
`docs/evidence/retired-hosts-appraisal-truth-closeout-2026-08-12.md`. This
lane re-verifies the item's acceptance criteria against the current
`origin/main` head and the live deployment of that head. It is source plus
behavior evidence; it does not claim anything about ranking, traffic, or
search results.

## What was measured

The item's acceptance criteria (from the backlog entry): both
historical-subdomain retirement bodies must tell visitors the current offer
truth — they name The Website Appraisal (the free leak audit of high-ticket
service homepages) and never point at the retired self-serve Agent Desk as the
current product — and the fix must hold under the test suite on the current
head. The same re-check as the 2026-08-12 closeout, against the head that
moved past it.

## Source checks on the current head (origin/main `1114383`)

1. `src/worker.js` `retiredAppResponse` (line 1280) and `retiredApiResponse`
   (line 1316) carry the Website Appraisal truth and zero "Agent Desk"
   mentions:
   - app (line 1300): `The old TinyStudio app has been retired. TinyStudio.io
     now runs The Website Appraisal — the free leak audit of high-ticket
     service homepages, reviewed by a person — and the human-reviewed desk
     that closes what the audit finds.`
   - api (line 1322): `The old TinyStudio API has been retired. TinyStudio.io
     now runs The Website Appraisal — the free leak audit of high-ticket
     service homepages — and the human-reviewed desk that closes what the
     audit finds.`
2. `grep -n "Agent Desk" src/worker.js` returns four lines and every one is
   either an internal legacy-mechanics comment (lines 56, 99, 1230) or the
   system prompt inside `/api/agent-audit` (line 848); no retirement
   response carries "Agent Desk". This is unchanged from the 2026-08-12
   closeout's measurement against `ad9cee3`.
3. `node scripts/check-site.mjs` passes ("TinyStudio.io checks passed.").
4. `node --test scripts/test-agent-worker.mjs` passes on this head: 76 tests,
   0 failures, exit code 0. The two regression tests PR #100 added pass — "retired
   app host frames the current offer as The Website Appraisal, not the Agent
   Desk" (worker test 58) and "retired API host frames the current offer as
   The Website Appraisal, not the Agent Desk" (worker test 59) — asserting
   each 410 response names the current offer and never points at the retired
   Agent Desk.

## Commits between the 2026-08-12 closeout and this re-verification

`git log --oneline 6534795..1114383 -- src/worker.js` (the only head commits
that touched worker.js in the window since the previous receipt) returns:

- `60d045c` fix(worker): make the Google Ads conversion tag env-driven
  instead of a dead placeholder (#172)
- `7fc1b05` test(worker): storage-failure honesty — 503 storage_unavailable
  on missing/broken D1 (#165)
- `aeb34a9` fix(worker): label the current /health surface and /api/signups
  intake as The Website Appraisal, not the retired Agent Desk (#164)
- `66aa81e` test(worker): cover signup daily rate-limit branches
  (daily_ip_limit / daily_email_limit) (#161)

`git diff 5ab84ea..1114383 -- src/worker.js | grep -E "^\+.*Agent Desk"`
returns only two comment lines inside the legacy-mechanics notes; no
retirement response was edited to re-introduce Agent Desk framing. PR #164
explicitly aligned the `/health` surface and `/api/signups` intake with the
same Website Appraisal labelling; PRs #172, #165, #161 change other
concerns (Ads tag, D1 failure honesty, signup rate-limit branches) and do
not touch the retirement messages.

## Live checks (2026-08-14)

`release-state-tinystudio-io.json` pins the deployed Cloudflare Worker
release to `11143836bd88e32297bf7e26e34025e14706da18` (PR #190, the docs
closeout of the parallel Agent Desk product-contract review item), and
`git merge-base --is-ancestor 5ab84ea 11143836` confirms PR #100's fix
commit is inside the deployed release.

- `GET https://app.tinystudio.io/` → **HTTP 410**; body carries exactly one
  "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
  occurrences.
- `GET https://api.tinystudio.io/` → **HTTP 410**; body carries exactly one
  "The Website Appraisal" and zero "Agent Desk" / "self-serve Agent Desk"
  occurrences.

Both live bodies match the source strings on `origin/main` `1114383`
byte-for-byte (string equality checked against the served sentence and
`src/worker.js` on the current head).

## Exact verification method (reproduce)

1. `git rev-parse origin/main` → `1114383…`.
2. `grep -n "Agent Desk" src/worker.js` — match only the internal legacy
   comment, the engine-behind-the-brief comment, the system prompt, and the
   legacy-mechanics note; never the retirement responses.
3. `node scripts/check-site.mjs` → exit 0.
4. `node --test scripts/test-agent-worker.mjs` → exit 0; tests 58 and 59 pass.
5. `curl -s -w "%{http_code}" https://app.tinystudio.io/` → 410, and the
   body string-search returns one "The Website Appraisal" and zero "Agent
   Desk" / "self-serve Agent Desk" occurrences.
6. `curl -s -w "%{http_code}" https://api.tinystudio.io/` → 410, same
   string-search result.

## Limitation

This is a source plus live-deployment measurement. The two regression
tests PR #100 added (worker tests 58 and 59) are what prevent stale Agent
Desk framing from silently returning to the retirement responses; the live
retirement responses are generated by the deployed worker code, so the
live re-check above is the standing way to re-confirm the deployed state.

## Closeout

The review item "Replace the retired-host Agent Desk message with the
current Website Appraisal truth — both historical subdomains still tell
visitors the retired self-serve product is current" remains closed: the
runtime fix merged in PR #100 (`5ab84ea`) is in `origin/main` `1114383` and
in the live Cloudflare Worker release `11143836bd88e32297bf7e26e34025e14706da18`;
both retired-host 410 bodies name The Website Appraisal and never the
retired Agent Desk; `node scripts/check-site.mjs` and
`node --test scripts/test-agent-worker.mjs` (76 tests, 0 failures) pass on
the current head; the only commits to `src/worker.js` since the 2026-08-12
closeout are unrelated fixes (#172, #165, #164, #161) — none of them
reintroduced Agent Desk framing into the retirement responses.
