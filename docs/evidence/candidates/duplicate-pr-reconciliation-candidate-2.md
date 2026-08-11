# Duplicate open-PR reconciliation — candidate 2

Date: 2026-08-11 (snapshot taken 2026-08-11T00:55:56Z, live via `gh`/`git`)
Branch: `loop/tsio-reconcile-be39ef1-c2` (this candidate lives at
`docs/evidence/candidates/duplicate-pr-reconciliation-candidate-2.md` and
changes nothing else)
Backlog owner: `[ ] Reconcile the duplicate open fix PRs ...` (scout
2026-08-11, backlog.md line ~941, accept/verify quoted below where used).

This candidate reconciles the four duplicate open-PR clusters to **one
superior delivery path per surface**: the strongest truthful wording, the
strictest deterministic guard, the least merge repair, and no unique
valuable hunk lost. Phase 2 is PR-only: everything below happens as PR
merges, branch repairs, and close comments — no direct commits to main, no
deploy.

---

## 1. Live snapshot (2026-08-11T00:55:56Z, not the packet's stale summary)

### Base

- `origin/main` = `81fc379378327e196bf380792982b6eaac85bce9` (`docs(evidence): ship-verify structured-data finding 975fdb784275 past b004c11 against current main and live (#93)`).
- None of the four fixes has landed on main: `src/worker.js` still serves
  "TinyStudio.io now runs the self-serve Agent Desk from the main domain."
  on both retired hosts and `"surface": "agent-desk"` on `/health`;
  `public/agent-desk.html` still canonicalizes/`og:url`s to the apex root;
  none of the six public pages carries `<link rel="icon">`; the q5 truth in
  `evidence-fixtures/ai-search/controlled-questions.json` (and the embedded
  copy in `public/audit.html`) still says "the leak audit, plus the Agent
  Desk behind it".

### Every relevant PR, live state

| PR | Head branch | Head SHA | Mergeability (live) | Checks (live) |
|----|-------------|----------|---------------------|---------------|
| #54 | `fix/agent-desk-canonical` | `1d42b8d6a153684edfe5dfeb45c70e225d46ce61` | MERGEABLE / BEHIND | verify SUCCESS, Gitleaks SUCCESS |
| #91 | `fix/agent-desk-canonical-lane1` | `261cfefc10d2cb31b368885e81c2ef9a032941f4` | MERGEABLE / BLOCKED (Gitleaks queued only) | verify SUCCESS, Gitleaks QUEUED |
| #84 | `docs/evidence/agent-desk-title-canonical-2026-08-11` | `ff54045925f4de854a98e7d1e1dea6ebcec9724f` | MERGEABLE / CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #47 | `fix/serve-rel-icon-favicon` | `be1c597cb21969dddd700c97efdff9bffe176cc4` | CONFLICTING / DIRTY (only real conflict in the set) | verify SUCCESS, Gitleaks SUCCESS |
| #85 | `fix/rel-icon-favicon-lane1` | `146e0f0aae2c4b79487c7c9d68f7f0dc92a86966` | MERGEABLE / BLOCKED (checks running) | verify IN_PROGRESS, Gitleaks QUEUED |
| #53 | `fix/ai-search-q5-ground-truth-agent-desk-retired` | `8ce49e57eb682cf98bbadbc4abe3f25a2d500dbe` | MERGEABLE / BEHIND | verify SUCCESS, Gitleaks SUCCESS |
| #90 | `fix/q5-ground-truth-drop-agent-desk` | `54f706882383972e6db96b147c161d3b97dd17f6` | MERGEABLE / CLEAN | verify SUCCESS, Gitleaks SUCCESS |
| #62 | `fix/retired-surface-agent-desk-copy` | `a19f0fe922d9c2d7319b629c963c4bb6d2f6b4ea` | MERGEABLE / BLOCKED (Gitleaks queued only) | verify SUCCESS, Gitleaks QUEUED |
| #52 | `fix/google-ads-conversion-tag` | `20d2f9a4d5822f13c2a5843a341ab0e0b054ea40` | MERGEABLE / BEHIND | verify SUCCESS, Gitleaks SUCCESS |

"BLOCKED" here is queue noise (Gitleaks/verify still queued or running), not
a substantive gate. The only true conflict in the whole set is #47 against
main, caused by the canonical/og:url/`@id` clean-URL drift in
`public/audit.html` (`audit.html` → `audit`, 8 lines, landed by the
canonical-URL lane) plus 19 lines of guard drift in `scripts/check-site.mjs`
— both trivial to resolve on rebase (Section 3).

### Cluster diffs (byte-verified this run)

- **Agent Desk canonical (#54 / #91 / #84):** all three diff
  `public/agent-desk.html` to the identical blob (`4f68447..1256449`):
  `og:url` + canonical → `https://tinystudio.io/agent-desk.html`. Guards
  differ: #54/#91 push 39–40 lines (exactly-one canonical, exact href, og:url
  present + exact); #84 pushes 35 lines (self-referencing-or-absent
  canonical/og:url **plus** the 410-copy negative guard). Receipts differ
  only: #54 `agent-desk-canonical-2026-08-09.md`, #91
  `agent-desk-title-canonical-2026-08-11.md` (near-copy of #54's with a
  08-11 live check), #84 `agent-desk-retired-title-2026-08-11.md` (covers
  both wires).
- **Favicon (#47 / #85):** identical link markup
  (`<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`). #47: six
  pages (agents, audit, brief-requested, index, pricing, specimen) + a
  47-line `check-site.mjs` guard (all six + agent-desk, favicon.svg validity,
  git-tracked, worker allow-list). #85: five pages only (no
  brief-requested.html) and **no guard**.
- **q5 (#53 / #90):** same two lines (fixture JSON + embedded `audit.html`
  copy), competing wording — see Section 4.
- **Retired 410 copy (#62 / #84):** the same two `src/worker.js` strings
  (`retiredAppResponse`, `retiredApiResponse`), different wording — see
  Section 4. #62 additionally owns `surface: "agent-desk"` →
  `"website-appraisal"` on `/health`, the homepage REPLACE-comment removal
  (`public/index.html` + `.sig-note:empty` in `public/index.css`), the
  REPLACE-comment guard, and three worker tests. #52 touches `src/worker.js`
  in disjoint hunks (Section 5).

---

## 2. Survivors and closes, per cluster

### Cluster 1 — Agent Desk canonical (#54, #91, #84)

- **Survivor: #84** (`docs/evidence/agent-desk-title-canonical-2026-08-11`).
  It is the only CLEAN member (zero rebase risk), it carries the canonical
  fix **and** the 410-copy wire in one PR with one receipt covering both, and
  its guard is the only one that also pins the 410 copy. The product hunk is
  byte-identical to #54/#91's.
- **Repair before merge (mandatory, one commit on #84's branch):** fold the
  strictness of #54/#91's guard into #84's guard so no coverage is lost —
  #84's current guard passes when the canonical/`og:url` are *absent*; the
  survivor guard must require **exactly one canonical link** whose href is
  `https://tinystudio.io/agent-desk.html`, **an `og:url` that exists** and
  equals the same address, **and** #84's negative 410 assertion (worker must
  not contain `now runs the self-serve Agent Desk`). This is the union of
  all three guards: strictly stronger than any single member.
- **Close: #54, #91.** No unique valuable hunk lost: their product hunk is
  byte-identical to #84's; their guard strictness is folded into the repair;
  their receipts are superseded by #84's (which records both wires against
  the same live-before state); the 3-line comment tweak they carry is
  cosmetic and reproduced by the strengthened guard's comment.

### Cluster 2 — Favicon coverage (#47, #85)

- **Survivor: #47** (`fix/serve-rel-icon-favicon`).
- **Coverage check (passes):** the six served public pages are
  `index.html`, `audit.html`, `agents.html`, `pricing.html`,
  `specimen.html`, `brief-requested.html` — #47 links all six. #85 links
  five and omits `brief-requested.html`. The seventh served page,
  `agent-desk.html` (retired legacy), already carries the link on main, and
  #47's guard asserts it too. Deterministic regression guard: #47's 47-line
  `check-site.mjs` block (exactly one `rel="icon"` per head, exact
  `/favicon.svg` href, `favicon.svg` starts with `<svg` and is git-tracked,
  worker allow-list contains `"/favicon.svg"`). All guard preconditions hold
  on current main: `public/favicon.svg` is tracked and valid SVG, and the
  worker's `PUBLIC_ASSET_PATHS` already includes `"/favicon.svg"`.
- **Repair before merge (mandatory):** rebase #47 onto current main and
  resolve two files: `public/audit.html` (8 lines of canonical/`og:url`/
  `@id` clean-URL drift — the favicon link hunk re-applies verbatim after
  the drift) and `scripts/check-site.mjs` (19 lines of guard drift from
  other lanes; the favicon block is inserted at its own site after the
  apple-touch-icon allow-list check). `git merge-base` of #47 with main is
  `f9f0b0f6a2aec83d0916c886fb8365b9e79af381`; nothing else in #47's file set
  has drifted.
- **Close: #85.** No unique valuable hunk lost: #85's five links are a
  strict subset of #47's six with identical markup, and #85 has no guard and
  no receipt to preserve.

### Cluster 3 — AI-search q5 ground truth (#53, #90)

- **Survivor: #53** (`fix/ai-search-q5-ground-truth-agent-desk-retired`).
  Wording wins on the first-party identity check (Section 4).
- **Repair before merge (mandatory, trivial):** rebase onto main (BEHIND);
  the hunk is one line in `controlled-questions.json` plus the matching line
  in the embedded `audit.html` JSON, both against the current blob
  `941e1d7...` — no drift expected.
- **Close: #90.** No unique valuable hunk lost: same two files, same one
  line each; only the wording differs, and #90's wording loses the identity
  match (Section 4). No guard, no receipt in either.

### Cluster 4 — Retired app/api 410 copy (#62, #84)

- **Survivor wording: #84's.** Both strings on both retired hosts become:
  "The old TinyStudio app/API has been retired, and so has the self-serve
  Agent Desk. TinyStudio.io's current offer is the Website Appraisal: the
  free leak audit of high-ticket service homepages." (Section 4.)
- **#84 is not closed** — it is the cluster-1 survivor and its 410 copy is
  the cluster-4 winner; it merges with the guard repair from Section 2.
- **#62 is not closed.** It carries unique valuable hunks that must ship:
  the `/health` `surface` pin to `"website-appraisal"`, the removal of the
  two `<!-- REPLACE:` comments and the empty `.sig-note` from the live
  homepage source (`public/index.html`, `public/index.css`), the
  REPLACE-comment regression guard, and three worker tests (retired app,
  retired api, health).
- **Repair before #62 merges (mandatory):** rebase onto post-#84 main and
  (a) **surrender** #62's two 410-copy hunks to #84's copy — they edit the
  same two strings, so the rebase resolves them to the survivor wording,
  and (b) **relax the two `assert.doesNotMatch(/Agent Desk/i)` assertions**
  in its new tests to `assert.doesNotMatch(/now runs the self-serve Agent
  Desk/i)` — the survivor copy legitimately names the Agent Desk to retire
  it, and the deterministic invariant that matters is that the main domain
  never "runs" it again (this matches #84's check-site guard exactly). The
  `assert.match(html, /Website Appraisal/)` assertions pass unchanged
  against the survivor copy.

### Net result: exactly one open delivery path per surface

| Surface | Open PR(s) after reconciliation | Closed |
|---------|--------------------------------|--------|
| Agent Desk canonical wire | #84 (merged, guard repaired) | #54, #91 |
| Favicon (six pages + guard) | #47 (merged, rebased) | #85 |
| q5 ground truth | #53 (merged, rebased) | #90 |
| Retired 410 copy | #84 (merged) — #62 merged with copy surrendered | — |
| `/health` surface + homepage REPLACE cleanup | #62 (merged, rebased) | — |
| Google Ads conversion tag | #52 (unaffected, see Section 5) | — |

---

## 3. Explicit treatment of #84 (spans two clusters) and #52 (same file, different hunks)

### PR #84

#84 is the **only PR that owns wires in two clusters** (cluster 1:
`agent-desk.html` canonical/`og:url`; cluster 4: the two retired 410
strings), and it is the only CLEAN PR in the entire set. The reconciliation
therefore makes #84 the survivor of **both** clusters rather than splitting
it: its canonical hunk is byte-identical to #54/#91's (so nothing is lost by
closing them), and its 410 copy is the wording winner (Section 4). The only
change needed on #84's branch is the guard-strengthening commit (exactly-one
canonical + `og:url` presence, folded from #54/#91). If instead #84 were
closed and #54 kept, its 410 hunks would have to be re-carried by #62's lane
with a second wording conflict — strictly more repair for the same end
state.

### PR #52

#52 (`fix/google-ads-conversion-tag`) shares `src/worker.js` but owns **none
of the same strings**: its hunks are the page-scoped CSP constant and
`withSecurityHeaders` signature at the top of the file, the
`googleAdsConversion`/`googleAdsLoader`/`googleAdsScript` helpers, and the
env-driven injection inside the `PUBLIC_ASSET_PATHS` branch of `fetch` —
never `retiredAppResponse()` (line ~1249), `retiredApiResponse()` (line
~1285), or the `healthResponse` surface field (line ~1231). Its check-site
hunk (Google Ads placeholder guards, ~line 570) and its test additions
(appended at the end of `test-agent-worker.mjs`, as are #62's) are likewise
disjoint in content. **#52 is not a twin and must not be closed.** It merges
independently in any order; at worst its EOF test append and #62's EOF test
append need a normal rebase when both are in flight. No wording decision in
this candidate touches #52.

---

## 4. Wording checks

### q5 must match current first-party identity

First-party identity (README.md first paragraph, `public/llms.txt` Identity,
`public/offer.md` Identity, and the live `audit.html` lede all agree):
"the free leak audit of high-ticket service homepages and the human-reviewed
desk that closes what the audit finds".

- #53: "tinystudio.io is TinyStudio's own site: **the free leak audit of
  high-ticket service homepages, and the human-reviewed desk that closes
  what the audit finds.**" — matches the identity wording almost verbatim
  and keeps the audit page's lede and its embedded `#ai-search-evidence`
  copy consistent with each other.
- #90: "tinystudio.io is TinyStudio's own site: **the leak audit, plus the
  desk that closes the leaks the audit finds.**" — drops "free",
  "high-ticket service homepages" and "human-reviewed" (the offer's two
  strongest qualifiers) and would leave the lede/embed mismatch (the lede
  says "human-reviewed desk that closes what the audit finds").

**Winner: #53.** This also matches the backlog owner item's accept
("the surviving q5 wording matches llms.txt Identity").

### Retired 410 responses must name the Website Appraisal and never reactivate the self-serve Agent Desk

- #62: "The old TinyStudio app has been retired. TinyStudio.io **now runs**
  the Website Appraisal — the free leak audit of high-ticket service
  homepages." — names the Website Appraisal, never mentions the Agent Desk,
  but keeps the "now runs … from the main domain" construction that the
  stale copy used, and leaves the old app's audience (the people who knew
  the Agent Desk as the successor product) unanswered about what happened
  to it.
- #84: "The old TinyStudio app has been retired, **and so has the
  self-serve Agent Desk. TinyStudio.io's current offer is the Website
  Appraisal**: the free leak audit of high-ticket service homepages." —
  names the Website Appraisal, retires the Agent Desk explicitly (the
  strongest possible non-reactivation: it cannot be mistaken for a live
  product), and mirrors `offer.md`'s own "TinyStudio's current offer: The
  Website Appraisal" construction.

**Winner: #84's copy** for both `retiredAppResponse()` and
`retiredApiResponse()`. The deterministic guard that protects it is the
negative invariant "worker must not contain `now runs the self-serve Agent
Desk`" (already in #84's check-site hunk; #62's relaxed tests assert the
same phrase, Section 2).

---

## 5. Evidence that no unique valuable hunk is lost

| PR | Unique hunks | Disposition |
|----|--------------|-------------|
| #54 | product hunk (identical to #84), strict guard, 08-09 receipt, comment tweak | closed; strictness folded into #84's repair; receipt superseded by #84's |
| #91 | product hunk (identical), near-identical strict guard, 08-11 receipt | closed; same folding |
| #84 | canonical hunk, canonical+410 guard, dual-wire receipt | **survivor** (both clusters), guard repaired to the union |
| #85 | five page links, no guard | closed; strict subset of #47's six links |
| #47 | six page links + 47-line guard | **survivor**, rebase repair |
| #90 | one-line wording | closed; wording loses (Section 4) |
| #53 | one-line wording (identity-matching) | **survivor**, rebase repair |
| #62 | health surface pin, homepage REPLACE removal, REPLACE guard, 3 tests, 08-10 receipt | **not closed**; rebase + copy surrender + test relaxation |
| #52 | Google Ads env-driven tag (worker/check-site/tests/spec) | **not closed**, not a twin, no overlap (Section 3) |

The two receipts that merge with survivors: #84's
`docs/evidence/agent-desk-retired-title-2026-08-11.md` and #62's
`docs/evidence/retired-surface-copy-2026-08-10.md` (the latter's wording
still describes the health/REPLACE fixes accurately after the copy
surrender). Recommended (not blocking): add a short receipt to #47
(favicon) and #53 (q5) so every surface has a closeout record in the
established format.

---

## 6. Ordered integration actions (ready to execute)

1. **Repair #84**: add the guard-strengthening commit to
   `fix/agent-desk-title-canonical-2026-08-11` (exactly-one canonical +
   `og:url` presence + the 410 negative guard). Run
   `/home/nish/.local/bin/test-gate npm test` and `npm run check` on the
   branch.
2. **Merge #84.**
3. **Close #54 and #91** with the dedupe comments below (cross-reference
   the survivor).
4. **Repair #62**: rebase `fix/retired-surface-agent-desk-copy` onto
   post-#84 main; resolve the two 410 strings to #84's copy; relax the two
   `doesNotMatch(/Agent Desk/i)` assertions to
   `doesNotMatch(/now runs the self-serve Agent Desk/i)`; keep the health
   pin, REPLACE removal, REPLACE guard, and the other assertions. Run the
   gate. **Merge #62.**
5. **Repair #47**: rebase `fix/serve-rel-icon-favicon` onto main; resolve
   `public/audit.html` (8-line canonical drift) and `scripts/check-site.mjs`
   (19-line drift); the guard must pass with `agent-desk.html`'s existing
   link. Run the gate. **Merge #47.**
6. **Close #85** with the dedupe comment below.
7. **Rebase #53** (`fix/ai-search-q5-ground-truth-agent-desk-retired`) onto
   main; run the gate. **Merge #53.**
8. **Close #90** with the dedupe comment below.
9. **#52**: no action from this candidate; merges independently.
10. Post-merge on main: run the final verify command (Section 7) and
    `/home/nish/.local/bin/test-gate npm test`.

### Ready-to-paste dedupe close comments

> **#54** — Closing as a proven twin of #84. `public/agent-desk.html` diffs
> byte-identical (`og:url` + canonical → `https://tinystudio.io/agent-desk.html`);
> #84 additionally carries the retired 410-copy wire with the same receipt
> and is CLEAN. #54's stricter exactly-one-canonical/og:url assertions were
> folded into #84's regression guard before merge, so no coverage is lost.
> Surviving PR: #84 (`docs/evidence/agent-desk-title-canonical-2026-08-11`).

> **#91** — Closing as a proven twin of #84. Product hunk is byte-identical
> to #84's (`og:url` + canonical → `https://tinystudio.io/agent-desk.html`);
> guard strictness folded into #84's guard during reconciliation. Surviving
> PR: #84 (`docs/evidence/agent-desk-title-canonical-2026-08-11`).

> **#85** — Closing as a proven twin of #47. #47 covers all six served
> public pages (incl. `brief-requested.html`, which this PR omits) with the
> same link markup, plus the deterministic `check-site.mjs` favicon guard
> (exactly-one `rel="icon"`, exact `/favicon.svg` href, asset validity and
> worker allow-list) that this PR lacks. Surviving PR: #47
> (`fix/serve-rel-icon-favicon`).

> **#90** — Closing as a proven twin of #53. Both change the same two lines
> (fixture JSON + embedded `audit.html` copy); #53's wording matches the
> site's first-party identity ("the free leak audit of high-ticket service
> homepages, and the human-reviewed desk that closes what the audit finds"
> — llms.txt/offer.md/audit lede), this PR's shorter wording drops "free",
> "high-ticket" and "human-reviewed" and would desync the audit lede from
> its embedded evidence. Surviving PR: #53
> (`fix/ai-search-q5-ground-truth-agent-desk-retired`).

---

## 7. Final verify command for the eventual reconciliation PR

One runnable command, to be run from the repo root on the reconciled branch
after all integration actions. It **fails on origin/main** (verified:
`VERIFY FAIL: 410 copy still reactivates the Agent Desk`, exit 1) and
**passes only after the selected survivor receipt** —
`docs/evidence/agent-desk-retired-title-2026-08-11.md` (#84, the dual-wire
receipt) — **is present on the branch** (verified on a simulated reconciled
tree: `VERIFY PASS`, exit 0).

```bash
set -euo pipefail
fail() { echo "VERIFY FAIL: $1"; exit 1; }
# 1. Retired 410 copy: must name the Website Appraisal and never claim the
#    main domain runs the self-serve Agent Desk.
rg -q "now runs the self-serve Agent Desk" src/worker.js && fail "410 copy still reactivates the Agent Desk"
# 2. q5 ground truth: must match the first-party identity wording
#    (llms.txt/offer.md/README Identity).
rg -q "the free leak audit of high-ticket service homepages, and the human-reviewed desk" evidence-fixtures/ai-search/controlled-questions.json || fail "q5 truth does not match first-party identity"
# 3. Favicon: deterministic regression guard present (covers all six served
#    public pages).
rg -q "Favicon link must appear exactly once" scripts/check-site.mjs || fail "favicon regression guard missing"
# 4. Agent Desk canonical wire cut: the legacy head must canonicalize to its
#    own served address, never the apex root.
rg -q '<link rel="canonical" href="https://tinystudio.io/agent-desk.html" />' public/agent-desk.html || fail "agent-desk canonical is not self-referencing"
# 5. Selected survivor receipt: present on the branch, absent from origin/main.
git show origin/main:docs/evidence/agent-desk-retired-title-2026-08-11.md >/dev/null 2>&1 && fail "survivor receipt already on origin/main"
test -s docs/evidence/agent-desk-retired-title-2026-08-11.md || fail "survivor receipt not present on the reconciliation branch"
echo "VERIFY PASS"
```

---

## 8. Risks, rollback, verdict

### Risks

- **Ordering:** #62's and #52's test hunks both append at the end of
  `test-agent-worker.mjs`; if both are in flight, the later rebase needs a
  normal EOF-hunk resolution (content disjoint, no semantic risk).
- **Guard repair on #84** must land before the merge or the exactly-one /
  presence assertions from #54/#91 are lost; the risk is a sloppy rebase
  that drops the fold-in. Covered by the verify command's marker 3/4 shape
  (guards present) and `npm test`.
- **#47's rebase** must not resurrect the old `audit.html` canonical href
  while resolving the drift — the 8-line clean-URL drift is the only real
  conflict in the whole set.
- **Wording regression:** a future editor could reintroduce "now runs the
  self-serve Agent Desk" or shorten q5 again; both are pinned by the verify
  command markers 1–2 and by #84/#62's guards/tests.
- **Live adoption is not verified by this candidate** — it is PR-queue
  reconciliation only; the live findings (backlog items 658/537/644/827)
  remain open until the merged fixes deploy and are re-verified live.

### Rollback

All four fixes are small string/markup edits plus static guards. If a
closed twin turns out to contain the better wording, reopen it and close
the other — the backlog owner item's rollback says exactly this and nothing
in this candidate depends on irreversible state. The verify command is the
gate: if markers 1–5 fail, the reconciliation is incomplete, not rolled
forward.

### Verdict

**REPAIR_THEN_SHIP** — with the four named repairs (guard fold-in on #84,
410-copy surrender + test relaxation on #62, rebase of #47, rebase of #53)
the drain can merge one PR per surface with zero double-apply risk; no
cluster requires new product work and none of the closed twins carries a
unique valuable hunk.
