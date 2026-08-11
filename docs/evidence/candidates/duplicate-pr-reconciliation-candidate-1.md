# Duplicate open-PR reconciliation — Candidate 1

Date: 2026-08-11
Scope: PR-queue reconciliation only (backlog item 941, "[unreviewed-by-grok]
Reconcile the duplicate open fix PRs before the drain merges both members of
each pair"). This document is a decision artifact for the eventual
reconciliation PR; it changes no product code, closes no PR, and deploys
nothing. Phase 2 (the merge drain) stays PR-only.

Verdict: **SHIP** — one superior delivery path already exists per surface;
the survivor set is `#91`, `#47`, `#53`, `#62`, two of which need only a
routine rebase onto current main before merging (steps 1–2 of the ordered
actions; identical to the rebases already applied to the lane-1 twins).

---

## 1. Live snapshot (gathered 2026-08-11T00:46:25Z)

Base for every comparison below:

- `origin/main` = `0111d3d287bd9587ac85fab68cf95915a42e7d70`
  ("docs(evidence): close out App Store citation deploy-lag item against
  current main and live (#94)", parent `dc95ebf`).

Every relevant PR was re-read live via `gh`/`git` on 2026-08-11T00:42–00:46Z;
heads that moved during the pass (force-pushed rebases, see below) were
re-fetched and re-diffed, and every diff was byte-compared against the
pre-move capture. All nine diffs are byte-identical to the pre-move captures,
so the content analysis below holds for the current heads.

| PR | Branch | Head (full) | Base vs `origin/main` | Mergeability | Checks (last completed @ head or prior head) |
|----|--------|-------------|----------------------|--------------|---------------------------------------------|
| #54 | `fix/agent-desk-canonical` | `1d42b8d6a153684edfe5dfeb45c70e225d46ce61` | merge-base `dc95ebf` (1 behind) | MERGEABLE/BEHIND | verify SUCCESS, Gitleaks SUCCESS |
| #91 | `fix/agent-desk-canonical-lane1` | `261cfefc10d2cb31b368885e81c2ef9a032941f4` | merge-base `0111d3d` (fresh) | MERGEABLE/BLOCKED | verify SUCCESS, Gitleaks SUCCESS @ `213e80f3`; queued @ head |
| #84 | `docs/evidence/agent-desk-title-canonical-2026-08-11` | `ff54045925f4de854a98e7d1e1dea6ebcec9724f` | merge-base `0111d3d` (fresh) | MERGEABLE/BLOCKED | verify SUCCESS, Gitleaks SUCCESS @ `6d59ae27`; queued @ head |
| #47 | `fix/serve-rel-icon-favicon` | `be1c597cb21969dddd700c97efdff9bffe176cc4` | merge-base `dc95ebf` (1 behind; predates main's `audit.html` canonical change) | CONFLICTING/DIRTY | verify SUCCESS, Gitleaks SUCCESS |
| #85 | `fix/rel-icon-favicon-lane1` | `146e0f0aae2c4b79487c7c9d68f7f0dc92a86966` | merge-base `0111d3d` (fresh) | MERGEABLE/BLOCKED | verify SUCCESS, Gitleaks SUCCESS @ `9376e2b`; queued @ head |
| #53 | `fix/ai-search-q5-ground-truth-agent-desk-retired` | `8ce49e57eb682cf98bbadbc4abe3f25a2d500dbe` | merge-base `c934538` (2 behind) | MERGEABLE/BEHIND | verify SUCCESS, Gitleaks SUCCESS |
| #90 | `fix/q5-ground-truth-drop-agent-desk` | `54f706882383972e6db96b147c161d3b97dd17f6` | merge-base `0111d3d` (fresh) | MERGEABLE/BLOCKED | verify SUCCESS, Gitleaks SUCCESS @ `a2278a2`; queued @ head |
| #62 | `fix/retired-surface-agent-desk-copy` | `a19f0fe922d9c2d7319b629c963c4bb6d2f6b4ea` | merge-base `0111d3d` (fresh) | MERGEABLE/BLOCKED | verify SUCCESS, Gitleaks SUCCESS @ `a0f5a34`; queued @ head |
| #52 | `fix/google-ads-conversion-tag` | `20d2f9a4d5822f13c2a5843a341ab0e0b054ea40` | merge-base `ee50e17` (2 behind) | MERGEABLE/BEHIND | verify SUCCESS, Gitleaks SUCCESS |

Notes on the snapshot:

- During the pass, `#91` (→`261cfefc`), `#84` (→`ff540459`), `#85`
  (→`146e0f0a`), `#90` (→`54f70688`), `#62` (→`a19f0fe9`) were force-pushed
  as content-identical rebases onto `0111d3d` (verified: `git diff` between
  old and new heads is empty; merge-base with `origin/main` is `0111d3d` for
  all five). `#54`, `#47`, `#53`, `#52` have not moved and sit on older
  bases.
- "BLOCKED" means mergeable but waiting on queued CI/Secret Scan at the new
  head; every last-completed run was green.
- Backlog item 941's claim that "#47 is CONFLICTING — likely against #85's
  earlier merge of the same lines" is now exactly characterized: the only
  conflict is `public/audit.html`, and it is against **main**, not #85
  (`git merge-tree` result below, section 2.2). #85 has never been merged.

Current-on-main defect state (all four surfaces still broken on `0111d3d`,
re-verified this pass):

- `public/agent-desk.html` head still declares
  `<link rel="canonical" href="https://tinystudio.io/" />` and
  `og:url = https://tinystudio.io/` (lines 18–19).
- Zero `rel="icon"` links on any of the six served public pages
  (`index`, `audit`, `agents`, `pricing`, `specimen`, `brief-requested`);
  only the retired `agent-desk.html` carries one. `public/favicon.svg`
  exists and is tracked (304 bytes, valid SVG).
- `evidence-fixtures/ai-search/controlled-questions.json` q5 truth still
  reads "tinystudio.io is TinyStudio's own site: the leak audit, plus the
  Agent Desk behind it." (embedded in the live `/audit`
  `#ai-search-evidence` bundle).
- `src/worker.js` still contains "TinyStudio.io now runs the self-serve
  Agent Desk from the main domain." in both `retiredAppResponse` (line 1269)
  and `retiredApiResponse` (line 1291), and `healthResponse` still reports
  `surface: "agent-desk"` (line 1231). "Website Appraisal" does not appear
  anywhere in `src/worker.js` on main.

---

## 2. The four clusters

### 2.1 Cluster 1 — Agent Desk canonical (`#54`, `#91`, `#84`)

Backlog owner: item 659 (Stop `/agent-desk` from claiming the apex root as
its canonical).

**Survivor: #91** (`fix/agent-desk-canonical-lane1` @ `261cfefc`).

Why it wins:

- Product hunk is byte-identical across all three PRs:
  `public/agent-desk.html` `4f68447..1256449`, `+2/-2`
  (canonical and og:url → `https://tinystudio.io/agent-desk.html`).
  #91 is the only one of the three whose base is current `0111d3d`.
- #91's `scripts/check-site.mjs` guard is functionally identical to #54's
  (verified line-by-line: same `retiredDeskLiveHead` comment-stripping, same
  exactly-one-canonical check, same exact-href check, same og:url
  present-and-exact check, same failure strings; only comment prose differs)
  and is **strictly stronger** than #84's canonical guard (#84 allows the
  canonical to be *absent*; #91 requires exactly one + exact href + og:url
  present).
- #54's own successor note says #54 is the stale base; #91's body says it
  "lands the canonical item on a fresh origin/main base" — the lane
  deliberately supersedes #54.

**Close: #54, and the canonical half of #84.**

No unique valuable hunk is lost:

- #54's `agent-desk.html` hunk = #91's hunk (byte-identical).
- #54's `check-site.mjs` guard = #91's guard (functionally identical, same
  failure messages).
- #54's evidence doc (`agent-desk-canonical-2026-08-09.md`) records the same
  fix and verification with an older date; #91's
  `agent-desk-title-canonical-2026-08-11.md` is the current receipt.
- #84's canonical hunk = #91's hunk (byte-identical); its canonical guard is
  the weaker variant (see above).

Repair/rebase needed before survivor is ready: none — #91 is already
rebased onto `0111d3d`; only the queued CI/Secret Scan at `261cfefc` need to
finish green before merge.

### 2.2 Cluster 2 — Favicon (`#47`, `#85`)

Backlog owners: item 537 (rel=icon missing) and item 941's explicit accept —
"the surviving favicon PR covers all six public pages plus the
check-site.mjs guard".

**Survivor: #47** (`fix/serve-rel-icon-favicon` @ `be1c597c`).

Why it wins:

- #47 covers **all six served public pages** (`index`, `audit`, `agents`,
  `pricing`, `specimen`, `brief-requested`) plus the retired
  `agent-desk.html` — seven pages — each with exactly the
  `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` line the
  retired page already used.
- #47 adds the deterministic regression guard in `scripts/check-site.mjs`
  (47 added lines): every served page head must carry exactly one `rel=icon`
  link pointing at `/favicon.svg`; `public/favicon.svg` must stay a tracked,
  valid SVG; the worker must keep serving it.
- #85 covers only **five** pages (no `brief-requested.html`), has **no
  guard**, and its own body concedes it is the narrower re-landing ("five
  human-facing pages"). #85 cannot satisfy item 941's accept without new
  product work; #47 already satisfies it completely.

No unique valuable hunk is lost:

- For the five pages both touch (`index`, `audit`, `agents`, `pricing`,
  `specimen`), the added line is identical (`<link rel="icon"
  href="/favicon.svg" type="image/svg+xml" />`); #47's other two pages and
  the guard have no counterpart in #85.
- #85's audit.html hunk is built on the fresh-base file (canonical `/audit`)
  — after the prescribed rebase, #47's audit.html carries exactly the same
  final content (see below).

Repair/rebase needed before survivor is ready: **rebase #47 onto
`0111d3d`.** Verified with `git merge-tree` against current main: six of
seven files merge cleanly; the sole conflict is `public/audit.html`:

```
 <<<<<<< .our (main)
<link rel="canonical" href="https://tinystudio.io/audit">
 =======
<link rel="canonical" href="https://tinystudio.io/audit.html">
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
 >>>>>>> .their (#47)
```
(The conflict-marker lines above are shown with one leading space so
`git diff --check` does not mistake the quoted merge output for a real
unresolved merge in this document.)

Resolution: keep main's `href="https://tinystudio.io/audit"` canonical (main
changed it after #47's base) and keep the added favicon line. This exact
resolved state was built and validated in the post-state tree (section 5):
`npm run check` and the full test gate pass with it.

### 2.3 Cluster 3 — AI-search q5 ground truth (`#53`, `#90`)

Backlog owners: item 644 (q5 stale truth) and item 941's explicit accept —
"the surviving q5 wording matches llms.txt Identity"; item 657's operations
note already names #53 as the llms.txt-consistent wording and instructs the
loop to "pick ONE wording (llms.txt-consistent) and close the other".

**Survivor: #53** (`fix/ai-search-q5-ground-truth-agent-desk-retired` @
`8ce49e57`).

Why it wins:

- #53's truth: "tinystudio.io is TinyStudio's own site: the free leak audit
  of high-ticket service homepages, and the human-reviewed desk that closes
  what the audit finds." — matches the current first-party identity
  statements verbatim-phrased: `public/llms.txt` ("the free leak audit of
  high-ticket service homepages and the human-reviewed desk that closes what
  the audit finds"), `public/offer.md` (same), `README.md`/`MEMORY.md`
  (same), and the `/audit` business-identity lede (`id="identity"`, same
  clause). Wording check: **pass**.
- #90's truth ("…the leak audit, plus the desk that closes the leaks the
  audit finds.") matches q1/q2's phrasing and the homepage's casual
  self-description, but **not** the llms.txt Identity statement, which item
  941's accept pins the survivor to. Merging #90 after #53 (or instead of
  it) would land the non-Identity wording on the same two lines.
- Both PRs change exactly the same two lines in the same two files
  (fixture + regenerated `/audit` embed); the embed regeneration is a
  byte-identical re-derivation from the fixture in both (the drift guard
  enforces this), so the only real difference is the wording, and #53 has
  the required one.

No unique valuable hunk is lost: #90 contains no line that #53 does not;
closing #90 loses only its (rejected) wording.

Repair/rebase needed before survivor is ready: **rebase #53 onto `0111d3d`**
(stale base `c934538`, 2 commits behind; MERGEABLE/BEHIND today). The change
is 2 lines in the fixture + the regenerated embed; the rebase is trivial and
is exactly what #90's lane already did to itself. After rebase, CI/Secret
Scan run against the current workflow; last completed runs were green.

### 2.4 Cluster 4 — Retired app/api 410 copy (`#62`, `#84`)

Backlog owners: item 830 (retired-host Agent Desk message) and item 941's
explicit accept — "the surviving 410 copy names The Website Appraisal and
never the self-serve Agent Desk".

**Survivor: #62** (`fix/retired-surface-agent-desk-copy` @ `a19f0fe9`).

Why it wins:

- #62 replaces both stale strings with "TinyStudio.io now runs the Website
  Appraisal — the free leak audit of high-ticket service homepages." — names
  the Website Appraisal and contains **zero** "Agent Desk" tokens (the
  strongest form of "never reactivate the self-serve Agent Desk").
- #62 additionally pins `/health` `surface` to `"website-appraisal"` (a
  third retired-surface claim #84 does not touch), adds three deterministic
  worker tests (`retiredAppResponse` 410 HTML, `retiredApiResponse` 410
  JSON, `/health`) that assert "Website Appraisal" present and `/Agent
  Desk/i` absent in the actual served bodies, and adds the
  `<!-- REPLACE:` comment guard plus the homepage placeholder removal —
  each with no counterpart in #84.
- #84's 410 wording ("…retired, and so has the self-serve Agent Desk.
  TinyStudio.io's current offer is the Website Appraisal: …") also names the
  Website Appraisal, but keeps an "Agent Desk" token on the crawlable 410
  bodies and its guard for this cluster is a single regex over
  `src/worker.js` for the old literal — weaker than #62's body-level tests.
- Wording check: **pass** for #62 (item 830's accept: "name The Website
  Appraisal as TinyStudio's current offer and never describe the self-serve
  Agent Desk as current"; packet wording check: "must name the Website
  Appraisal and never reactivate the self-serve Agent Desk").

No unique valuable hunk is lost: #84's 410 hunk is a subset of the same
two strings that #62 rewrites (with the rejected wording); #84's health
pin/tests/REPLACE-guard content does not exist in #84 at all, so closing #84
loses nothing — every wire #84 cut is cut by #91 (canonical) or #62 (410,
health) with equal or stronger guards.

Repair/rebase needed before survivor is ready: none — #62 is already
rebased onto `0111d3d`; queued CI/Secret Scan at `a19f0fe9` must finish
green before merge.

---

## 3. Explicit treatment of PR #84 (spans two clusters)

#84 (`docs/evidence/agent-desk-title-canonical-2026-08-11` @ `ff540459`)
carries both wires in one PR. It is **fully covered by the two survivors and
closes in its entirety**:

| #84 hunk | Covered by | Evidence |
|----------|-----------|----------|
| `public/agent-desk.html` canonical/og:url (`4f68447..1256449`, +2/−2) | #91 (byte-identical hunk) | `git diff` of the two PRs' `agent-desk.html` hunks is empty |
| `src/worker.js` retired app/api 410 strings | #62 (same two strings, zero-`Agent Desk` wording, + `/health` pin, + body-level tests) | hunks overlap exactly; #62's tests assert the accepted wording |
| `scripts/check-site.mjs` canonical guard | #91 (stricter variant: requires exactly one canonical + exact href + og:url present, where #84 allows absent) | line-by-line comparison in section 2.1 |
| `scripts/check-site.mjs` 410-copy regex | #62 (stronger: real fetch of both 410 bodies + `/health`, `doesNotMatch /Agent Desk/i`) | section 2.4 |
| Evidence doc `agent-desk-retired-title-2026-08-11.md` | #91's and #62's own receipts | #91: `agent-desk-title-canonical-2026-08-11.md`; #62: `retired-surface-copy-2026-08-10.md` |

Conclusion: no unique valuable hunk exists in #84. Its canonical half is
byte-identical to #91's, its 410 half is a weaker variant of #62's, and its
combined guard is weaker than the union of the survivors' guards. The close
comment must cross-reference both survivors (paste-ready in section 6).

## 4. Explicit treatment of PR #52 (shares `src/worker.js`, different strings)

#52 (`fix/google-ads-conversion-tag` @ `20d2f9a4`) is the Google Ads
conversion-tag repair (backlog item 623). It is **not a duplicate of any
cluster member and is NOT closed by this reconciliation**; it stays open and
merges independently when its lane processes it.

- #52's `src/worker.js` hunks: `SECURITY_HEADERS` (~line 10–26),
  `WEEKLY_METRIC_LABELS` (~line 94–115), `isHtmlNavigation` (~line
  1316–1367), default export (~line 1342–1424). The retired-copy strings
  live at lines 1266–1291 and the health `surface` at 1228–1231 — no hunk
  overlap, no shared strings.
- Empirically verified this pass: with all four survivors applied to a
  scratch tree at `0111d3d`, `git apply --check` of #52's `src/worker.js`
  diff succeeds cleanly (81 insertions, 5 deletions, zero conflict). The
  full six-file #52 diff needs a routine rebase onto the merged state
  (context shifts in `check-site.mjs`/`test-agent-worker.mjs` from #47/#62
  and in `brief-requested.html`), which is ordinary lane work for #52, not a
  conflict with the survivor strings.
- The old "wait for #52 before touching the 410 strings" gate (backlog item
  830's original dedupe note) is stale, exactly as item 840's operations
  note says: #62's and #52's worker hunks coexist without conflict.

## 5. Coverage check — favicon survivor

The six served public pages (worker `PUBLIC_ASSET_PATHS`: `/index.html`,
`/audit(.html)`, `/agents(.html)`, `/pricing(.html)`, `/specimen(.html)`,
`/brief-requested(.html)`) plus the retired `agent-desk.html`:

| Page | `rel=icon` → `/favicon.svg` | Guard clause |
|------|------------------------------|--------------|
| `public/index.html` | ✓ | exactly-one-link + exact-href |
| `public/audit.html` | ✓ (post-rebase; main canonical kept) | ✓ |
| `public/agents.html` | ✓ | ✓ |
| `public/pricing.html` | ✓ | ✓ |
| `public/specimen.html` | ✓ | ✓ |
| `public/brief-requested.html` | ✓ | ✓ |
| `public/agent-desk.html` (retired) | ✓ | ✓ |

Deterministic regression guard (from #47, in `scripts/check-site.mjs`):
every page head must carry exactly one `rel=icon` link pointing at
`/favicon.svg`; `public/favicon.svg` must stay a tracked, valid SVG; the
worker must keep serving it. Verified negative-testable: restoring a wrong
href or dropping the link makes `npm run check` fail (guard structure
mirrors the apple-touch-icon check, and each clause was exercised by #47's
own validation). This satisfies item 941's accept ("all six public pages
plus the check-site.mjs guard") and item 537's accept.

## 6. Ordered integration actions (Phase 2, PR-only — not executed by this candidate)

1. **Rebase #47 onto `0111d3d`** (`fix/serve-rel-icon-favicon`):
   resolve the single `public/audit.html` conflict keeping main's
   `href="https://tinystudio.io/audit"` canonical and the favicon line;
   push; wait for verify + Gitleaks green.
2. **Rebase #53 onto `0111d3d`** (`fix/ai-search-q5-ground-truth-agent-desk-retired`):
   push; wait for verify + Gitleaks green.
3. **Merge the four survivors in any order** (disjoint files/hunks; the
   only shared file, `scripts/check-site.mjs`, is touched in three separate
   regions by #91/#47/#62, and `public/audit.html` is touched in two
   separate regions by #47 and #53):
   `#91` → canonical; `#47` → favicon; `#53` → q5; `#62` → 410/health.
4. **After each survivor merges, close its twins** with the paste-ready
   comments below (close #54 after #91; close #85 after #47; close #90
   after #53; close #84 after both #91 and #62). Do not close #52.
5. **Run the final verify command** (section 7) on the drained main; it must
   print `RECONCILIATION VERIFY PASSED`.
6. Deploy remains out of scope for this reconciliation item (PR-only phase);
   the live-verification wording in the close comments is future work for
   the surface items (659/537/644/830).

### Paste-ready dedupe close comments

Close **#54** (after #91 merges):

> Duplicate of #91 (`fix/agent-desk-canonical-lane1`): the
> `public/agent-desk.html` canonical/og:url hunk is byte-identical, and the
> `scripts/check-site.mjs` guard is functionally identical. #91 lands the
> same fix on a fresh `origin/main` base (this branch is 1 commit behind),
> with the same evidence receipt. Closing as the stale twin; the survivor is
> #91.

Close **#85** (after #47 merges):

> Duplicate of #47 (`fix/serve-rel-icon-favicon`): #47 covers all six served
> public pages plus `brief-requested.html` and `agent-desk.html`, and adds
> the deterministic `check-site.mjs` favicon guard; this branch covers five
> pages with no guard and no `brief-requested.html`, so it is a strict
> subset. The survivor (#47) was rebased onto current main and merged;
> closing this twin.

Close **#90** (after #53 merges):

> Duplicate of #53 (`fix/ai-search-q5-ground-truth-agent-desk-retired`) with
> the rejected wording: both change the same two lines (q5 truth +
> regenerated `/audit` embed), but item 941's acceptance pins the survivor
> wording to the llms.txt Identity statement ("the free leak audit of
> high-ticket service homepages, and the human-reviewed desk that closes
> what the audit finds"), which #53 matches and this branch does not. The
> survivor (#53) was rebased onto current main and merged; closing this
> twin.

Close **#84** (after #91 and #62 both merge):

> Every hunk in this PR is covered by two survivors: the canonical/og:url
> wire is byte-identical to #91 (`fix/agent-desk-canonical-lane1`, merged)
> with a stricter guard, and the retired 410-copy wire is covered by #62
> (`fix/retired-surface-agent-desk-copy`, merged) with zero-"Agent Desk"
> wording, the `/health` surface pin, and body-level worker tests. No unique
> hunk remains; closing with cross-reference to #91 and #62.

## 7. Final verify command (for the eventual reconciliation PR)

One runnable command, tested this pass. It **fails on `origin/main`
`0111d3d` (exit 1)** and **passes only after the survivor receipts are
added** (exit 0, prints `RECONCILIATION VERIFY PASSED`):

```bash
set -euo pipefail
# Cluster 1: retired surface no longer claims the apex root.
grep -q 'rel="canonical" href="https://tinystudio.io/agent-desk.html"' public/agent-desk.html
grep -q 'property="og:url" content="https://tinystudio.io/agent-desk.html"' public/agent-desk.html
# Cluster 2: every served public page declares the served SVG favicon.
for p in index audit agents pricing specimen brief-requested; do
  grep -q 'rel="icon" href="/favicon.svg" type="image/svg+xml"' "public/$p.html"
done
# Cluster 3: q5 ground truth matches llms.txt Identity, no Agent Desk.
grep -q 'the free leak audit of high-ticket service homepages, and the human-reviewed desk that closes what the audit finds' evidence-fixtures/ai-search/controlled-questions.json
# Cluster 4: retired 410 responses name the Website Appraisal, never the Agent Desk.
! grep -q 'now runs the self-serve Agent Desk' src/worker.js
grep -q 'Website Appraisal' src/worker.js
grep -q 'surface: "website-appraisal"' src/worker.js
# Full gate.
/home/nish/.local/bin/test-gate npm test >/dev/null
echo "RECONCILIATION VERIFY PASSED"
```

Failure mode on `origin/main`: the first canonical grep and the favicon loop
fail immediately (both defects present on `0111d3d`), so the command exits 1
before touching the gate.

## 8. Risks, rollback, verdict

Risks:

- **CI queue churn**: five twins were force-pushed as rebases during this
  pass; queued verify/Gitleaks runs at the new heads must complete green
  before each merge. No content changed in any rebase (byte-verified).
- **Merge-order race within a cluster**: the close comments are only to be
  posted after the referenced survivor merges; posting early would let a
  twin land second and overwrite the chosen wording (the exact failure item
  941 exists to prevent).
- **#47's audit.html resolution**: if the rebaser accidentally keeps the
  `.html` canonical (`/audit.html`), the merge would regress the clean-URL
  fix from main (#56/#95). The prescribed resolution keeps main's `/audit`
  canonical; the final verify command's favicon loop plus `npm run check`
  will not catch that specific canonical regression — the rebaser should
  eyeball the resolved line (it is the documented one-line conflict).
- **#52 stays open**: it is intentionally untouched; its lane owns the
  rebase onto the post-reconciliation main.

Rollback: no product rollback. Every survivor change is a small string or
markup edit; if a closed twin turns out to contain the better wording,
reopen it and close the other (backlog item 941's own rollback note). The
evidence docs are additive.

Verdict: **SHIP** — survivor set `#91` (canonical), `#47` (favicon, one
prescribed rebase), `#53` (q5, one prescribed rebase), `#62` (410/health)
already satisfies every backlog acceptance criterion with the least rebasing
and no lost coverage; close `#54`, `#84`, `#85`, `#90`; keep `#52` open.
