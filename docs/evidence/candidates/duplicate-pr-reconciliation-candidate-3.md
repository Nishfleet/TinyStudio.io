# Duplicate open-PR reconciliation — Candidate 3

Date: 2026-08-11
Lane: DeepSeek V4 Flash (max), implementation worker, sealed packet.
Scope: PR-queue reconciliation only. This candidate is a decision receipt; it
closes nothing and merges nothing. All four fixes stay PR-only until the loop
merges the survivors named below.

Verdict: **REPAIR_THEN_SHIP** — one survivor (#47, favicon) is one rebase away
from ready; the other three survivors (#91, #53, #62) are mergeable-clean
today. The single repair is a one-hunk rebase with no coverage loss.

---

## 1. Timestamped live snapshot (2026-08-11T01:05:10Z)

Origin/main (fetched live, not the stale local branch):
`81fc379378327e196bf380792982b6eaac85bce9`

Local working branch: `loop/tsio-reconcile-be39ef1-c3` at
`dc95ebfdb40aec102e3b6b3155226a047d678ff9` (2 commits behind origin/main;
both are docs-only closeouts).

| PR | Head ref | Head SHA | State | Mergeable | Merge state | Checks |
|----|----------|----------|-------|-----------|-------------|--------|
| #54 | fix/agent-desk-canonical | 3a8817115b34effdd91d64ac2b2fe2fed96f6eed | OPEN | MERGEABLE | **BLOCKED** (verify QUEUED, never started) | verify QUEUED, Gitleaks SUCCESS |
| #91 | fix/agent-desk-canonical-lane1 | 261cfefc10d2cb31b368885e81c2ef9a032941f4 | OPEN | MERGEABLE | CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #84 | docs/evidence/agent-desk-title-canonical-2026-08-11 | ff54045925f4de854a98e7d1e1dea6ebcec9724f | OPEN | MERGEABLE | CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #47 | fix/serve-rel-icon-favicon | be1c597cb21969dddd700c97efdff9bffe176cc4 | OPEN | **CONFLICTING** | DIRTY | verify SUCCESS, Gitleaks SUCCESS |
| #85 | fix/rel-icon-favicon-lane1 | 146e0f0aae2c4b79487c7c9d68f7f0dc92a86966 | OPEN | MERGEABLE | CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #53 | fix/ai-search-q5-ground-truth-agent-desk-retired | 8ce49e57eb682cf98bbadbc4abe3f25a2d500dbe | OPEN | MERGEABLE | BEHIND | verify SUCCESS, Gitleaks SUCCESS |
| #90 | fix/q5-ground-truth-drop-agent-desk | 54f706882383972e6db96b147c161d3b97dd17f6 | OPEN | MERGEABLE | CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #62 | fix/retired-surface-agent-desk-copy | a19f0fe922d9c2d7319b629c963c4bb6d2f6b4ea | OPEN | MERGEABLE | CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #52 | fix/google-ads-conversion-tag | 20d2f9a4d5822f13c2a5843a341ab0e0b054ea40 | OPEN | MERGEABLE | BEHIND | verify SUCCESS, Gitleaks SUCCESS |

Live-vs-packet deltas recorded: the packet's snapshot is current except (a)
#47 is now CONFLICTING/DIRTY against a newer main (backlog annotation said the
same; confirmed by merge simulation — the conflict is one hunk in
`public/audit.html`, see §2.2), (b) #54's verify is QUEUED so its merge state
is BLOCKED, (c) no PR in the four clusters has been merged or closed since the
packet was written. Nothing else moved.

Changed files per PR (live):

- #54: docs/evidence/agent-desk-canonical-2026-08-09.md (new),
  public/agent-desk.html, scripts/check-site.mjs
- #91: docs/evidence/agent-desk-title-canonical-2026-08-11.md (new),
  public/agent-desk.html, scripts/check-site.mjs
- #84: docs/evidence/agent-desk-retired-title-2026-08-11.md (new),
  public/agent-desk.html, scripts/check-site.mjs, src/worker.js
- #47: public/agents.html, public/audit.html, public/brief-requested.html,
  public/index.html, public/pricing.html, public/specimen.html,
  scripts/check-site.mjs
- #85: public/agents.html, public/audit.html, public/index.html,
  public/pricing.html, public/specimen.html
- #53: evidence-fixtures/ai-search/controlled-questions.json, public/audit.html
- #90: evidence-fixtures/ai-search/controlled-questions.json, public/audit.html
- #62: docs/evidence/retired-surface-copy-2026-08-10.md (new),
  public/index.css, public/index.html, scripts/check-site.mjs,
  scripts/test-agent-worker.mjs, src/worker.js
- #52: public/brief-requested.html, public/brief-requested.js,
  scripts/check-site.mjs, scripts/test-agent-worker.mjs,
  specs/003-wellness-clinic-launch/tracking-setup.md, src/worker.js

Baseline gates on the working tree (ancestor of origin/main): `test-gate npm
test` exit 0 (6 headings + 7 sitemap + 53 worker + 16 UI + 8 contract all
pass), sgscan exit 0 (pre-existing warnings only), `git diff --check
origin/main...HEAD` clean.

---

## 2. Cluster decisions

### 2.1 Cluster 1 — Agent Desk canonical (#54, #91, #84)

**Survivor: #91.** **Close: #54, #84 (canonical half).**

Hunk accounting (live `git diff origin/main...pr{N}`):

| Hunk | #54 | #91 | #84 |
|------|-----|-----|-----|
| public/agent-desk.html: canonical + og:url `https://tinystudio.io/` → `https://tinystudio.io/agent-desk.html` | identical blob `1256449` | identical blob `1256449` | identical blob `1256449` |
| scripts/check-site.mjs: retired-desk guard — exactly one canonical link, must equal the page URL; og:url must equal the page URL | strict, plus comment rewrite | strict, plus different comment rewrite | looser: "self-referencing **or absent**", no comment change; adds separate worker-410 guard clause |
| Evidence doc | agent-desk-canonical-2026-08-09.md (new, dated 08-09) | agent-desk-title-canonical-2026-08-11.md (new, dated 08-11) | agent-desk-retired-title-2026-08-11.md (new, dated 08-11, spans 410 wire too) |

Why #91: the product hunk is byte-identical across all three, so the survivor
is decided by readiness and guard strength. #91 is the only one of the three
that is mergeable-CLEAN with a SUCCESS verify on a fresh origin/main base; its
body explicitly states it lands the canonical item on a fresh base and that
#54 is the same fix on a stale base. #54 is BLOCKED with verify QUEUED (drain
congestion) and its guard/comment is the same as #91's. #84's guard is the
weakest of the three — it accepts a canonical that is "absent", which is the
wrong direction for the apex-claim regression (the guard should require the
self-referencing form, as the surviving page change does). #84 also carries
the worker-410 half, which belongs to cluster 4 (§2.4), so #84 cannot be
merged as-is even if cluster 1 preferred it: its worker.js hunks collide with
#62's on the same two strings.

No unique valuable hunk is lost by closing #54 and #84: the agent-desk.html
change exists verbatim in #91; #91's guard is strictly stronger than #84's
and equal to #54's; the evidence facts in #54's/#84's receipts (live-before
state, consolidation mechanism, 2026-08-09 pass reference) are all present in
#91's receipt.

Repair/rebase needed before #91 is ready: none. It is mergeable-CLEAN now.

### 2.2 Cluster 2 — Favicon coverage (#47, #85)

**Survivor: #47.** **Close: #85.** **Repair required: rebase #47 onto
origin/main.**

Hunk accounting:

- #85: adds `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`
  to **five** pages (index, audit, agents, pricing, specimen). No guard.
  MERGEABLE/CLEAN.
- #47: adds the same line to **all six served public pages** (index, audit,
  agents, pricing, specimen, **brief-requested**) and to the retired
  agent-desk.html guard list, plus a deterministic check-site.mjs favicon
  guard: exactly one `rel="icon"` per owned page head pointing at
  `/favicon.svg`; `public/favicon.svg` must exist, be a valid `<svg>`, and be
  git-tracked; the worker must keep serving `/favicon.svg`.

Coverage check (packet acceptance): the six served public pages are
index.html, audit.html, agents.html, pricing.html, specimen.html and
brief-requested.html (worker `PUBLIC_ASSET_PATHS`, confirmed on origin/main —
`/brief-requested` and `/brief-requested.html` are both served, and
`public/favicon.svg` is tracked at blob `7212a1d` on main). #85 covers only
five of six and ships no regression guard, so #85 cannot be the survivor.
#47 covers all six plus the guard — the only candidate meeting the
acceptance.

Conflict diagnosis (simulated `git merge origin/main` into origin/pr-47):
exactly one conflict hunk, in `public/audit.html` — main changed the canonical
to the clean URL `<link rel="canonical" href="https://tinystudio.io/audit">`
(after #47's base), while #47's head still carries
`https://tinystudio.io/audit.html` from its stale base. `scripts/check-site.mjs`
and all other files auto-merge cleanly. Resolution: keep main's
`https://tinystudio.io/audit` canonical and add the favicon link — i.e. the
rebase changes nothing about #47's intended diff, only its base.

Repair steps before #47 is ready:
1. `git rebase origin/main` on `fix/serve-rel-icon-favicon`.
2. In public/audit.html keep `<link rel="canonical" href="https://tinystudio.io/audit">` (main's version) and add the `rel="icon"` line.
3. `npm run check` (guard exercises all seven pages), `npm test` via test-gate, `npm run check:render-blocking` (six pages).
4. Push. Ideally rebase immediately before its merge slot, because open PRs #95/#67/#68/#86/#96 also touch the same five public pages and any of them merging first re-triggers a trivial rebase.

No unique valuable hunk is lost by closing #85: every one of #85's five lines
is a subset of #47's change; #47 alone carries the sixth page and the guard.

### 2.3 Cluster 3 — AI-search q5 ground truth (#53, #90)

**Survivor: #53.** **Close: #90.**

Hunk accounting: both PRs change the same two lines — the q5 `truth` in
evidence-fixtures/ai-search/controlled-questions.json and the identical
string embedded in public/audit.html's `#ai-search-evidence` JSON. Either
merged second overwrites the other's wording on the same line (plain
conflict, not a merge). Wording:

- #53: "tinystudio.io is TinyStudio's own site: the free leak audit of
  high-ticket service homepages, and the human-reviewed desk that closes what
  the audit finds."
- #90: "tinystudio.io is TinyStudio's own site: the leak audit, plus the desk
  that closes the leaks the audit finds."

Wording check (packet acceptance — "q5 must match current first-party
identity"): llms.txt on origin/main, Identity section, states "the free leak
audit of high-ticket service homepages and the human-reviewed desk that
closes what the audit finds" (offer.md mirrors it). #53's wording is exactly
the llms.txt Identity sentence (plus a comma) wrapped in the q5 frame; #90's
drops "free", "high-ticket service homepages" and "human-reviewed" — the
three words that disambiguate this business. #53 is the only survivor
consistent with the machine-readable identity; #90's shorter wording also
silently re-broadens the entity confusion the q5 question exists to pin down.

State: both MERGEABLE with SUCCESS verify; #53 is BEHIND (stale base only).
Repair/rebase needed before #53 is ready: none required to merge; a cosmetic
rebase onto origin/main clears BEHIND. Recommend merging #53 before #90 is
closed so the drain cannot land the loser first.

No unique valuable hunk is lost by closing #90: both PRs are the same two
lines; only the wording differs, and the losing wording is the one that
contradicts llms.txt.

### 2.4 Cluster 4 — Retired app/api 410 copy (#62, #84)

**Survivor: #62.** **Close: #84 (410 half).**

Hunk accounting (src/worker.js, live diffs):

- Both #62 and #84 rewrite the same two strings — the `<p>` inside
  `retiredAppResponse()` and the `message` inside `retiredApiResponse()`
  (lines 1266–1295) — with different wording. Whichever merges second
  conflicts/overwrites.
- #62 wording: "The old TinyStudio app has been retired. TinyStudio.io now
  runs the Website Appraisal — the free leak audit of high-ticket service
  homepages." (and API mirror).
- #84 wording: "The old TinyStudio app has been retired, and so has the
  self-serve Agent Desk. TinyStudio.io's current offer is the Website
  Appraisal: the free leak audit of high-ticket service homepages." (and API
  mirror).

Coverage beyond the two shared strings:

| Coverage | #62 | #84 |
|----------|-----|-----|
| The two 410 strings name Website Appraisal | yes | yes |
| Health endpoint `surface: "agent-desk"` → `"website-appraisal"` (worker.js line 1231) | **yes** | no |
| Deterministic 410 regression guard | **yes** — three test-agent-worker.mjs tests: app 410 HTML names Website Appraisal and never "Agent Desk"; api 410 JSON same; /health pins `surface` | check-site.mjs regex guard ("now runs the self-serve Agent Desk") only |
| Homepage developer-REPLACE cleanup (index.html/index.css) + check-site guard | **yes** | no |
| Evidence receipt | retired-surface-copy-2026-08-10.md | agent-desk-retired-title-2026-08-11.md |

Wording check (packet acceptance — "retired 410 responses must name the
Website Appraisal and never reactivate the self-serve Agent Desk"): both
wordings name the Website Appraisal. #62 never mentions the Agent Desk at
all; #84 mentions it only as retired. Both pass the letter of the check; #62
is the stronger form because a crawlable 410 page naming the retired product
at all keeps the name live for scrapers, and #62's unit tests enforce the
stronger invariant (`doesNotMatch /Agent Desk/i` on the actual responses)
where #84's guard only rejects the exact old "now runs the self-serve Agent
Desk" sentence.

Why #62: strictly larger coverage, no unique hunk lost by closing #84's 410
half — #84's check-site 410 guard clause is subsumed by #62's three worker
tests (they exercise the real fetch path rather than a source regex), and
the health-surface string fix exists only in #62. #62 is mergeable-CLEAN
today. Closing #84's 410 half is the same action as closing #84 entirely
(§4), because #84's head cannot be split without repushing a foreign branch.

No unique valuable hunk is lost by closing #84's 410 half: the two strings
are rewritten by #62, the guard intent is preserved by stronger tests, and
the evidence facts live in #62's receipt.

---

## 3. Explicit treatments

### 3.1 PR #84 spans two clusters (Agent Desk canonical + worker 410 copy)

#84's head carries the canonical fix (agent-desk.html + check-site.mjs
guard) *and* the worker 410 copy (src/worker.js) plus one shared receipt. It
is the only PR in the set whose files collide with two different survivors:
its agent-desk.html hunk and check-site.mjs insertion point collide with #91
(the same canonical lines and the same guard location), and its worker.js
strings collide with #62. **Decision: close #84 in full.** Both halves have a
strictly stronger survivor (#91's guard requires the self-referencing
canonical where #84 permits "absent"; #62 fixes the health surface, adds
three deterministic tests, and never names the retired product in the 410
copy). Any attempt to "save" #84 would either require repushing its head
without worker.js — a mutation of another worker's branch outside this
packet's scope — or would create the exact double-merge conflict the
reconciliation exists to prevent. No hunk unique to #84 survives only in
#84.

### 3.2 PR #52 shares src/worker.js without owning the same strings

#52 (Google Ads conversion tag) is **not a twin** of #62/#84 and must not be
closed. Its src/worker.js hunks are at lines 10–21 (`GOOGLE_ADS_CSP`),
94–105 (`withSecurityHeaders` signature), and 1327–1380 (env-driven gtag
injection) — none touch `retiredAppResponse`/`retiredApiResponse`
(1266–1295) or `healthResponse` (1228–1231), so #52 and #62 merge cleanly in
src/worker.js. The packet's stale "wait for #52" gate is dead: #52's hunks do
not overlap the retired-copy strings, and vice versa. The **one** real
collision is scripts/test-agent-worker.mjs, where both #52 and #62 append
tests at end-of-file (after line 1045) — the second merger needs a rebase.
Integration order: merge #62 (cluster 4 survivor) before #52, then rebase
#52 onto the new main; nothing else changes for #52. Its check-site.mjs hunk
(line 570) does not overlap #62's (line 1046), #47's (1165), or #91's (1059).

---

## 4. Ordered integration actions

Execute in this order (each via the drain as the loop does; close comments
below are ready to paste):

1. **Close #54** with the dedupe comment (survivor #91) — removes the
   BLOCKED lane-0 twin before the drain can pick it up.
2. **Close #90** with the dedupe comment (survivor #53) — must precede #53's
   merge so the drain cannot land the losing q5 wording first.
3. **Close #85** with the dedupe comment (survivor #47).
4. **Close #84** with the dedupe comment (survivors #91 + #62).
5. **Merge #91** (cluster 1; CLEAN, verify SUCCESS, nothing required).
6. **Merge #53** (cluster 3; MERGEABLE; optional cosmetic rebase to clear
   BEHIND).
7. **Merge #62** (cluster 4; CLEAN, verify SUCCESS) — **before** #52, per
   §3.2.
8. **Repair + merge #47** (cluster 2): rebase onto the then-current main,
   resolve the single public/audit.html hunk keeping main's
   `https://tinystudio.io/audit` canonical, add the favicon line; re-run
   `npm run check`, `npm test` (via test-gate), `npm run check:render-blocking`.
9. **Rebase #52** onto the new main (EOF test-file collision with #62's
   appended tests) and let it proceed normally; nothing about it changes.
10. **Add the reconciliation receipt** `docs/evidence/duplicate-pr-reconciliation-2026-08-11.md`
    (closeout PR) stating the survivor/close mapping above, containing the
    marker lines `survivor: #91`, `survivor: #47`, `survivor: #53`,
    `survivor: #62`, and run the final verify command (§5) on that PR.

Ready-to-paste close comments (cross-referencing the survivor):

> **#54** — "Closing as superseded by #91: #91 lands the identical
> public/agent-desk.html canonical/og:url fix (byte-identical hunk) on a
> fresh origin/main base with verify SUCCESS; this PR's verify is still
> QUEUED (merge BLOCKED). Merging both would conflict on the same
> agent-desk.html lines and the same check-site.mjs guard block. Per
> duplicate-pr-reconciliation-candidate-3 (cluster 1), #91 is the single
> survivor; #54's strict guard and evidence are fully present in #91. No
> coverage lost."

> **#90** — "Closing as superseded by #53: both PRs replace the same q5
> ground-truth line in evidence-fixtures/ai-search/controlled-questions.json
> and the embedded copy in public/audit.html; whichever merges second
> overwrites the first. #53's wording matches the current first-party
> identity in llms.txt/offer.md ('the free leak audit of high-ticket service
> homepages ... the human-reviewed desk that closes what the audit finds');
> #90's shorter wording drops 'free', 'high-ticket service homepages' and
> 'human-reviewed' and re-broadens the entity confusion q5 exists to pin
> down. Per duplicate-pr-reconciliation-candidate-3 (cluster 3), #53 is the
> survivor."

> **#85** — "Closing as superseded by #47: #47 adds the same rel=icon link to
> all six served public pages — including brief-requested.html, which this PR
> misses — plus the deterministic check-site.mjs favicon guard (exactly one
> rel=icon per page pointing at /favicon.svg; SVG tracked and valid; worker
> allow-list). Merging both would conflict on the five shared page heads.
> #47 is currently one trivial rebase from clean (single audit.html hunk
> against main's newer clean-URL canonical, already resolved in the rebase
> plan). Per duplicate-pr-reconciliation-candidate-3 (cluster 2), #47 is the
> survivor."

> **#84** — "Closing as superseded by #91 and #62: #84 spans two clusters,
> and each half collides with its survivor. The canonical/og:url half is the
> same agent-desk.html hunk as #91 with a *weaker* guard (accepts 'absent'
> where #91 requires the self-referencing URL). The worker 410 half is the
> same two src/worker.js strings #62 rewrites; #62 additionally fixes the
> /health surface label, adds three deterministic worker tests pinning the
> 410 wording (never 'Agent Desk', always Website Appraisal), and removes the
> homepage REPLACE placeholders with a guard. Whichever member of each pair
> merged second would conflict or overwrite. Per
> duplicate-pr-reconciliation-candidate-3 (clusters 1 and 4), #91 and #62 are
> the survivors; #84's check-site 410 guard clause is subsumed by #62's
> tests."

---

## 5. Final verify command for the eventual reconciliation PR

Must fail on origin/main and pass only after the reconciliation receipt is
added. One command, run from the repo root on the reconciliation PR's merge
state (also runs after merge on main):

```
test -s docs/evidence/duplicate-pr-reconciliation-2026-08-11.md && rg -q 'survivor: #91' docs/evidence/duplicate-pr-reconciliation-2026-08-11.md && rg -q 'survivor: #47' docs/evidence/duplicate-pr-reconciliation-2026-08-11.md && rg -q 'survivor: #53' docs/evidence/duplicate-pr-reconciliation-2026-08-11.md && rg -q 'survivor: #62' docs/evidence/duplicate-pr-reconciliation-2026-08-11.md && npm run check
```

Why it discriminates: on origin/main today the file does not exist, so
`test -s` fails the whole chain (exit 1) even though `npm run check` passes —
verified against the live tree. The four `rg` markers force the receipt to
name every survivor; the receipt is authored only after steps 1–9 of §4, so
the command passes only once the reconciliation is actually performed and
recorded. (Prefer `/home/nish/.local/bin/test-gate npm test` over raw
`npm test` whenever a full-suite run is wanted; `npm run check` is the
lightweight per-merge gate this repo already runs in `verify`.)

---

## 6. Risks, rollback, verdict

Risks:
- **Drain race:** if the drain auto-merges a loser (#54/#90/#85/#84) before
  the closes land, the winning twin conflicts and needs a trivial rebase —
  no content loss in any scenario, because every loser hunk exists verbatim
  in its survivor. Closes are ordered first in §4 to make this unlikely.
- **#52/#62 test-file collision:** both append at EOF of
  scripts/test-agent-worker.mjs; merging #62 first and rebasing #52
  afterwards is mandatory (already ordered).
- **#47 rebase timing:** open PRs #95/#67/#68/#86/#96 touch the same public
  pages; rebase #47 immediately before its merge slot and re-run `npm run
  check` + `check:render-blocking`.
- **Live drift:** this snapshot is 2026-08-11T01:05:10Z; if any PR in the
  four clusters moves before execution, re-verify with `gh pr view` and the
  byte-diff commands in §2 before acting.
- **q5/410 wording is the product-truth surface:** the surviving wording is
  pinned by #53's fixture+embedded JSON pair and by #62's worker tests, so a
  future edit that drifts from llms.txt fails CI (contract/check suites
  exist on main).

Rollback: the reconciliation changes PR state only. If a survivor misbehaves
after merge, revert the single PR via the drain (all four are small,
single-purpose diffs); the closed twins can be reopened and merged as
exact-content fallbacks (each loser's product hunk is byte-identical or a
subset of the survivor's, so fallback never loses coverage). The receipts
(closed-PR evidence docs) remain in git history; the q5 fixture and 410
strings are covered by the existing contract and worker tests.

Verdict: **REPAIR_THEN_SHIP** — merge #91, #53, #62 as-is; rebase #47 (one
hunk) before merging; close #54, #85, #90, #84; leave #52 untouched except a
post-#62 rebase.
