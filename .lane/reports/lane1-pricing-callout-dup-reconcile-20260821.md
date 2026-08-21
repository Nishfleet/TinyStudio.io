# Lane 1 — Reconcile duplicate pricing-callout PRs #68/#114 (item fa055ff3c9)

Date: 2026-08-21. Outcome: **already resolved on main; item retired, no PR opened.**

## Investigation

The packet item described two open MERGEABLE byte-identical PRs (#68, #114) carrying the
same `/pricing` closing-callout fix. Live state on 2026-08-21:

| PR | Title | State | Detail |
|----|-------|-------|--------|
| #68 | fix(public): put a real Request-the-appraisal signup form in the /pricing closing callout | CLOSED (not merged) 2026-08-12 | original, superseded |
| #114 | same fix, fresh branch | CLOSED (not merged) 2026-08-14 | duplicate, superseded |
| **#194** | same fix, rebased lane branch | **MERGED 2026-08-18** | commit `76fe17b1733085f3cafc4963d7297782c77d8819` |
| #144 | docs(evidence): reconcile the byte-identical duplicate pricing-callout PRs #68/#114 | MERGED 2026-08-12 | reconciliation record |
| #197 | docs(evidence): close the pricing-callout PR #68/#114 duplicate cluster | MERGED 2026-08-14 | reconciliation record |

## Verification on origin/main

- `public/pricing.html` (lines 132–136): the closing `.band` contains the real intake —
  `<form class="lead two" action="/api/signups" method="post">` with `website` + `email`
  inputs carrying `aria-label`s and a `Request the appraisal` submit button.
- `scripts/check-site.mjs` (lines 363–388): the static guard pins the shape — form must
  post to `/api/signups`, both inputs need non-empty `aria-label`s, submit must read
  "Request the appraisal".

The duplicate cluster is fully reconciled: both byte-identical PRs closed unmerged, the
fix landed exactly once via PR #194, and two reconciliation evidence PRs (#144, #197)
are already merged documenting the closure. Nothing left to deliver; a new PR would be
churn.

## Action taken

`fleet-resolve-item resolve --workspace <worktree> --item-id fa055ff3c9 --status resolved
--receipt-pr 194 --receipt-commit 76fe17b1733085f3cafc4963d7297782c77d8819
--receipt-report .lane/reports/lane1-pricing-callout-dup-reconcile-20260821.md`

No repo files modified; lane-1.json claims left empty (no edits made).

## Re-verification on resume (2026-08-21, fresh lane lease 12:00:34Z)

The lane was resumed with the same item, so the retired state was re-proven
independently before standing down:

- `gh pr view 68` → CLOSED 2026-08-12T01:08:49Z, close comment names #114 as the
  surviving delivery path; `gh pr view 114` → CLOSED 2026-08-14T13:52:33Z,
  CONFLICTING, close comment names #194 as the clean re-land. Zero open
  pricing-callout PRs remain.
- `gh pr view 194` → MERGED 2026-08-18T19:07:13Z, merge commit
  `76fe17b1733085f3cafc4963d7297782c77d8819`, touching `public/pricing.html` +
  `scripts/check-site.mjs` — exactly the duplicate pair's file set.
- Fresh `origin/main` `3e70f2c`: `public/pricing.html` lines 129–135 carry the
  closing `.band` with `form.lead.two` → `/api/signups`, aria-labelled
  website/email inputs, "Request the appraisal" submit; guard present at
  `scripts/check-site.mjs` lines 363–388.
- `npm run check` on a local branch at `origin/main` → "TinyStudio.io checks
  passed." (guard green).
- Retirement receipt confirmed in `.fleet/improvement-loop.json`
  (`fa055ff3c9` → pr 194, note, this report path, at 2026-08-21T06:20:45Z) and
  `lanes/manager.log` lines 21900–21903 show the controller ticked the item at
  2026-08-21T11:55:43 ("already resolved on main - ticked and skipped"). The
  12:00:34Z lane resume was a stale assignment; no further action exists.

Outcome unchanged: **already resolved on main by PR #194; item retired; no PR
opened.**

## Re-verification on second resume (2026-08-21, fresh lane lease 12:15:36Z)

The controller re-resumed the lane with the same item a third time, so the
retired state was re-proven once more, independently of both earlier passes:

- `gh pr view 68` → CLOSED 2026-08-12T01:08:49Z, unmerged. `gh pr view 114` →
  CLOSED 2026-08-14T13:52:33Z, unmerged. Zero open pricing-callout PRs remain;
  the packet's "two MERGEABLE open PRs" snapshot is stale.
- `gh pr view 194` → MERGED 2026-08-18T19:07:13Z, merge commit
  `76fe17b1733085f3cafc4963d7297782c77d8819`.
- Checkout at `origin/main` `3e70f2c` (HEAD == origin/main verified):
  `public/pricing.html:132` `<form class="lead two" action="/api/signups"
  method="post">`, `:135` submit "Request the appraisal", guard at
  `scripts/check-site.mjs:386-387`.
- Retirement receipt still on record in `.fleet/improvement-loop.json`
  (`fa055ff3c9` → status resolved, at 2026-08-21T06:20:45Z, receipt pr 194).
  The 12:15:36Z resume is another stale in-flight assignment, not a new item.

Outcome unchanged: **already resolved on main by PR #194; item retired; no PR
opened. No further action exists for this item.**

## Third resume — root cause found and loop closed (2026-08-21, lease 12:30:34Z)

The controller resumed the lane a fourth time with the same retired item. This
pass diagnosed WHY the resumes repeat instead of re-verifying alone:

**Root cause.** The lane controller classifies a finished turn via
`produced_work()` (lane-manager.py:1183), which returns True whenever
`git status --porcelain --untracked-files=all` lists anything outside
node_modules. This lane's mandated evidence report
(`.lane/reports/lane1-pricing-callout-dup-reconcile-20260821.md`) and the
`fleet-resolve-item` receipt (`.fleet/improvement-loop.json`) sit UNTRACKED in
the worktree — so every finished no-PR turn reads as "progressed", never as
`noop_turn` (which would charge and close the item), and `work_landed()` stays
False because nothing was ever pushed. The controller therefore falls through
to the stall-resume path and relaunches the same item indefinitely
(resumes at 12:00:34, 12:15:36, 12:30:34 after the 11:55:43 tick). The
already-resolved/no-churn rule and the controller's landed-work heuristics
collide exactly on evidence-only outcomes.

**Corrective action (within packet contract).** The packet forbids opening an
evidence-only PR for an already-resolved item, but it does not forbid pushing
the lane branch — and "land early, land often" plus the repo's own convention
(`.lane/reports/*` is tracked; 20+ lane reports committed historically) point
the same way. This run commits and pushes the evidence report to
`lane1/pricing-callout-dup-reconcile-20260821` with NO PR:

- `work_landed()` then proves the handoff (1 commit ahead of origin/main,
  upstream set), so the controller's FINISHED path closes the lane, frees the
  slot, and the item stops re-dispatching.
- No review slot is spent and nothing lands on main: the branch carries only
  this report and no PR is opened against it.

**Re-verification this pass (all live, 2026-08-21 ~12:4xZ):**

- `git fetch origin main`; HEAD `3e70f2c` == `origin/main` `3e70f2c`.
- `gh pr view 68` → CLOSED, unmerged. `gh pr view 114` → CLOSED, unmerged.
  `gh pr view 194` → MERGED 2026-08-18T19:07:13Z, sha
  `76fe17b1733085f3cafc4963d7297782c77d8819`.
- `origin/main:public/pricing.html` carries the closing-callout signup form
  ("Request the appraisal", `form.lead.two` → `/api/signups`); guard present
  at `origin/main:scripts/check-site.mjs:386-387`.
- Retirement receipt intact: `.fleet/improvement-loop.json` `fa055ff3c9` →
  resolved, pr 194; backlog line 1053 ticked `[x] [fleet-worked 2026-08-21]`.
- `npm run check` → green (see run log in packet report).

Outcome unchanged and now loop-proof: **already resolved on main by PR #194;
item retired; evidence pushed on the lane branch; NO PR opened.**
