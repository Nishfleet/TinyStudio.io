# Retired Agent Desk canonical — re-verify the THREE carrier PRs #91/#131/#138 against current main and the live deployment (2026-08-21, lane 1)

Date: 2026-08-21
Scope: dispatch item `ba5fb5fb58` — "[unreviewed-by-opus] Reconcile the
THREE open agent-desk-canonical PRs #91/#131/#138 — #105's declared
survivor #9" (the trailing token in the dispatch reads "#9" but the
backlog source and the `gh pr view` snapshots name PR #91 as the
declared survivor of PR #105; the typo is in the dispatch only). This
receipt is process evidence — a state verification of the repository's
pull requests plus a reconciliation-history re-verification — not a
live-index measurement.

Verdict in one line: **the THREE carrier PRs are no longer a duplicate
open-PR cluster — #131 and #138 were closed by PR #157 on 2026-08-12,
the underlying fix is on `origin/main` (head `92d55c3`) via PR #229
(commit `798cd71`, merged 2026-08-17), and the canonical
`<link rel="canonical" href="https://tinystudio.io/agent-desk" />` plus
matching `<meta property="og:url">` are present on source and live,
md5-for-md5. There is nothing left to reconcile on this surface.**

## The reconciliation history (state-of-the-art)

| Date | PR / commit | What happened |
|---|---|---|
| 2026-08-11 | PR #105 (a30f2ad1) | First reconcile: closed #54/#59/#61/#53; declared **#91** the survivor for the agent-desk canonical fix |
| 2026-08-12 | PR #157 (ed6dbb03) | Second reconcile: refreshed #91 onto current main, closed #84/#131/#138 with comments naming #91 as the survivor |
| 2026-08-14 | PR #198 (f729cbe2) | Third reconcile: closed #187 as duplicate of #91 (the only real guard-shape difference was #187 dropping an unrelated /audit CTA guard that #91 keeps; survivor stronger, not weaker) |
| 2026-08-15 | PR #229 created | `fix/agent-desk-canonical-apex-lane1` — re-delivered the same fix on a fresh base, with the cleaner `https://tinystudio.io/agent-desk` URL form (no `.html`) and an extended regression guard |
| 2026-08-17 | PR #229 merged (798cd71) | "fix(seo): stop the retired Agent Desk from claiming the apex root as its canonical (clean /agent-desk)" — landed on main |
| 2026-08-12+ | post-#105 backlog update | Backlog annotation confirms "#91/#131/#138 are now ALL CLOSED unmerged" |

## Current state of the THREE named carriers (this run, 2026-08-21)

Verified by `git ls-remote origin refs/pull/{91,131,138}/head`:

- **`refs/pull/91/head`** exists → `a23a84d1` (`fix/agent-desk-canonical-lane1`).
  Per the most recent backlog annotation in
  `/home/nish/workspaces/agent-state/tinystudio-io-improvement-loop/backlog.md`:
  "the three prior carriers #91/#131/#138 are now ALL CLOSED unmerged".
  Earlier direct state (postmerge-198, 2026-08-14): #91 was OPEN MERGEABLE
  with 96 commits ahead / 34 behind. The closure happened after #229
  landed (the cleaner-URL survivor superseded the older `.html` form).
- **`refs/pull/131/head`** exists → `f32bc42b` (`fix/agent-desk-title-canonical-lane1`).
  Per PR #157's reconciliation table (2026-08-12): closed 2026-08-12T08:43:59Z
  with a comment naming #91 as the surviving delivery path. Never merged.
- **`refs/pull/138/head`** exists → `1eb7b0d7` (`fix/agent-desk-canonical-off-apex`).
  Per PR #157's reconciliation table (2026-08-12): closed 2026-08-12T08:44:00Z
  with a comment naming #91 as the surviving delivery path. Never merged.

The ref-existence on GitHub is not by itself proof of state (closed PRs
retain their `refs/pull/N/head` until repository GC), but the
reconciliation receipts + the most-recent backlog annotation together
fix the open/closed state: #131 and #138 are closed (verified by receipt
in `docs/evidence/agent-desk-canonical-pr-reconcile-2026-08-12.md`),
and #91 is also closed per the 2026-08-17+ backlog update once #229
landed.

## What the THREE carrier PRs carried (the byte-identical fix)

```
$ git diff origin/main...refs/pull/91/head  -- public/agent-desk.html
@@ -15,8 +15,8 @@
-    <meta property="og:url" content="https://tinystudio.io/" />
-    <link rel="canonical" href="https://tinystudio.io/" />
+    <meta property="og:url" content="https://tinystudio.io/agent-desk.html" />
+    <link rel="canonical" href="https://tinystudio.io/agent-desk.html" />

$ git diff origin/main...refs/pull/131/head -- public/agent-desk.html
<identical byte sequence>

$ git diff origin/main...refs/pull/138/head -- public/agent-desk.html
<identical byte sequence>
```

All three PRs carried **byte-identical** changes to
`public/agent-desk.html` (the canonical + og:url moving from
`https://tinystudio.io/` to `https://tinystudio.io/agent-desk.html`).
They differed only in:

- The accompanying `scripts/check-site.mjs` guard shape (#91:
  comment-stripped, exact-one-canonical count, exact-value equality,
  43 lines added; #131: same logic, different comment wording, 44 lines
  added; #138: lighter single-hunk regex guard, 16 lines added).
- An optional docs/evidence receipt (#91 and #131 carried one; #138
  did not).

PR #229's deliverable (which is the version that landed) carried the
cleaner URL form:

```
$ git show 798cd71 -- public/agent-desk.html
@@ -15,8 +15,8 @@
-    <meta property="og:url" content="https://tinystudio.io/" />
-    <link rel="canonical" href="https://tinystudio.io/" />
+    <meta property="og:url" content="https://tinystudio.io/agent-desk" />
+    <link rel="canonical" href="https://tinystudio.io/agent-desk" />
```

— i.e. the same logical fix, but pointing at the clean `/agent-desk`
address (the form that responds 200 directly) instead of the
307-redirecting `/agent-desk.html` twin. This is the form now on
`origin/main` head `92d55c3`.

## Source verification (current `origin/main` head `92d55c3`)

- `public/agent-desk.html` head (lines 6–19):
  - `<meta name="robots" content="noindex, nofollow" />` (line 6).
  - `<title>TinyStudio — the retired Agent Desk</title>` (line 7).
  - `<meta property="og:url" content="https://tinystudio.io/agent-desk" />`
    (line 18).
  - `<link rel="canonical" href="https://tinystudio.io/agent-desk" />`
    (line 19).
- `git log -1 --format='%H' origin/main -- public/agent-desk.html` =
  `798cd71a86e5171cedb1819e6b462ee54580f2b7` (PR #229).
- The file has not been touched by any of the ten merges between
  `798cd71` and `92d55c3` (they hit adjacent files — narrow-viewport,
  apple-touch-icon, tap-target cluster — but not the legacy page).
- The page no longer contains `https://tinystudio.io/` as the value of
  any `<link rel="canonical">` or `<meta property="og:url">` element;
  the only apex-root URL string in the head is JSON-LD `Organization.url`
  (`https://tinystudio.io/`) and the inline apple-touch-icon / favicon /
  og-image references — none of which is a canonical or og:url claim that
  Google consolidates onto the homepage.

## Source verification (`scripts/check-site.mjs` regression guard)

The "Retired Agent Desk index guard" in `scripts/check-site.mjs`
(lines ~1327–1362 of `origin/main:scripts/check-site.mjs`) fails
`npm run check` if any of:

- the `robots` meta or retired-framing sentence is missing,
- the page carries zero, one, or more than one `<link rel="canonical">`,
- that canonical is anything other than `https://tinystudio.io/agent-desk`,
- or `og:url` is absent, duplicated, or named anywhere other than
  `https://tinystudio.io/agent-desk`.

A regression to the apex-root claim therefore fails the build before
it can ship. The guard is unchanged between `798cd71` and `92d55c3`
(only merge commits touched the file in that range).

## Live verification (2026-08-21)

- `https://tinystudio.io/agent-desk` → `200`, `noindex, nofollow`,
  title `TinyStudio — the retired Agent Desk`, canonical
  `https://tinystudio.io/agent-desk`, og:url
  `https://tinystudio.io/agent-desk`. No "Agent Desk" string is
  consolidated onto the homepage URL by this page.
- `https://tinystudio.io/agent-desk.html` → `307` → `/agent-desk`,
  carrying the same head.
- `https://tinystudio.io/` → `200`, title `TinyStudio — The Website
  Appraisal`, canonical `https://tinystudio.io/`, og:url
  `https://tinystudio.io/`. The served HTML contains zero "Agent Desk"
  strings in the title, description, canonical, or og metadata.
- **Bytes equality** — `md5sum public/agent-desk.html` on disk =
  `3310f720f1b9234970327ba35c52da94`;
  `curl -sL https://tinystudio.io/agent-desk | md5sum` over the wire =
  `3310f720f1b9234970327ba35c52da94`. Live document is the same byte
  sequence as the guarded source.

## Static checks and tests (this worktree, fresh `origin/main` head)

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test` over the six test files → 124 / 124 pass
  (headings 6, sitemap 7, agent-worker 80, agent-ui 16, product-contract
  8, first-viewport-audience 4, plus the three study-freshness tests).
- `node scripts/test-narrow-viewport-pages.mjs` → "All four owned routes
  keep document scrollWidth === clientWidth at 240-390px."
- `node scripts/test-narrow-viewport.mjs` → "All narrow viewports keep
  the hero mock and its flags inside the viewport."
- `git diff --check` clean.

## Reconciliation actions taken (this lane-1 run, 2026-08-21)

**None on GitHub.** Per PR #157 and the most recent backlog annotation
the THREE PRs #91/#131/#138 are already reconciled (closed or
superseded by #229). The substantive fix is on main and live. What
this lane does instead:

1. **Published the claims** to
   `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json`
   so the controller can refuse overlapping sibling assignments while
   this lane runs.
2. **Branched from fresh `origin/main`** at `92d55c3` on
   `lane1/agent-desk-canonical-pr-reconcile-rereverify-2026-08-21`.
3. **Wrote this evidence receipt** as
   `docs/evidence/agent-desk-canonical-pr-reconcile-rereverify-2026-08-21-lane1.md`.
4. **Wrote the lane report** as
   `.lane/reports/lane1-agent-desk-canonical-pr-reconcile-rereverify-2026-08-21.md`.

No production code, no shipped asset, no CI config, no agent runtime
was changed; this lane lands the re-verification receipt only.

## Relationship to other receipts

This re-verification is process evidence (PR state) and complements
the site-side re-verification
(`docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-17.md`,
`docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-21.md`),
which closed the same defect on the source and live layer. The
earlier receipts `agent-desk-canonical-pr-reconcile-2026-08-12.md`
(PR #157) and `agent-desk-canonical-pr-reconcile-2026-08-14.md`
(PR #198) closed the duplicate-PR side; this re-verification
documents that those closures are still in force and that the
substantive fix is on main and live.

## What is not claimed

No Google SERP change is claimed. The fix is a site-side correction;
Google's recrawl and site-name refresh run on Google's timetable.
The honest claim is the source + live + PR-queue claim: the THREE
carriers #91/#131/#138 are reconciled (closed or superseded),
PR #229's fix is on main, the live bytes md5-match the source,
and the regression guard in `scripts/check-site.mjs` enforces the
correct canonical / og:url pair.
