# Retired Agent Desk canonical — reconcile the four open delivery paths to #91

Date: 2026-08-12
Scope: the open pull requests that each carry the retired Agent Desk
canonical/og:url fix (`public/agent-desk.html` stops claiming the apex root),
reconciled so that exactly one superior delivery path remains open for the
surface. This receipt records a state verification of the repository's pull
requests plus the reconciliation actions taken; it is process evidence, not a
live-site measurement.

## The problem

PR #105 (`docs/evidence/duplicate-open-pr-clusters-2026-08-11.md`) reconciled
the duplicate open-PR clusters and declared **#91** the surviving delivery
path for the retired Agent Desk canonical fix, closing the stale #54. After
that declaration, two more lanes re-created the same fix on fresh bases
(#131, #138) without checking the declared survivor, and the older #84 —
which #105 had left open as the carrier of a separate worker 410-copy wire —
remained open with the same canonical fix on board. Result: four open PRs
carried the same `public/agent-desk.html` change, and the declared survivor
#91 had conflict-locked against main (12 PRs of main evolution since its
base, including the `scripts/check-site.mjs` rename of the retired-desk
variable from `index` to `retiredDesk`).

Four open delivery paths for one surface is the same defect #105/#109 closed:
reviewers cannot tell which is canonical, the stale branches conflict-lock
against main, and a merge of the wrong one re-introduces drift.

## The four carriers (GitHub state, 2026-08-12)

| PR | head branch | created | mergeability | carries |
|---|---|---|---|---|
| #91 | `fix/agent-desk-canonical-lane1` | 2026-08-10T22:58Z | CONFLICTING → **MERGEABLE** after refresh | the fix + robust guard + `docs/evidence/agent-desk-title-canonical-2026-08-11.md` |
| #84 | `docs/evidence/agent-desk-title-canonical-2026-08-11` | 2026-08-10T21:29Z | CONFLICTING | the fix + guard + worker 410 copy (superseded by #100) + its own evidence doc |
| #131 | `fix/agent-desk-title-canonical-lane1` | 2026-08-11T22:44Z | MERGEABLE | the fix + guard + `docs/evidence/agent-desk-title-canonical-2026-08-12.md` |
| #138 | `fix/agent-desk-canonical-off-apex` | 2026-08-12T00:08Z | MERGEABLE | the fix + minimal guard |

### Fix content is identical everywhere

- The `public/agent-desk.html` change is **byte-identical on all four
  branches** (verified: `git diff` of the file between any pair of the four
  branch tips is empty): canonical and og:url move from
  `https://tinystudio.io/` to the page's own served address
  `https://tinystudio.io/agent-desk.html`.
- The `scripts/check-site.mjs` guards differ in shape but enforce the same
  two invariants: the retired desk page must carry exactly one canonical
  naming its own served address (never the apex root), and an og:url naming
  its own served address. #91 carries the strongest form (comment-stripping,
  exact-one-canonical count, exact-value equality); #131 carries the same
  logic with different comment wording; #138 carries a shorter regex form of
  the same invariants. No branch's guard covers anything the others do not.
- The only non-canonical content on any of the four branches was #84's
  `src/worker.js` 410 copy for the retired app/api hosts — and that wire was
  landed by **#100** (merged, `5ab84ea`), whose current-offer wording now
  ships on main. #84's worker lines conflict with main's and carry no fix
  main lacks.
- No other open PR touches `public/agent-desk.html` (verified by scanning
  every open PR's changed files, 2026-08-12).

## Reconciliation actions taken (2026-08-12, lane-1 run)

1. **Refreshed the declared survivor #91 onto current `origin/main`** (merge
   `333099f`): the only conflict was the retired-desk head line in
   `scripts/check-site.mjs` (main's `retiredDesk` variable rename); resolved
   to main's variable naming with #91's guard, so the branch tree differs
   from main by exactly the fix (`public/agent-desk.html` + the canonical
   guard + the 2026-08-11 evidence receipt). Verified on the refreshed tree:
   `npm run check` green, `npm test` green (92 subtests: 6 headings, 7
   sitemap, 55 worker, 16 UI, 8 contract), `git diff --check` clean.
   Mergeability confirmed after push: `mergeStateStatus: BLOCKED`
   (awaiting review, no conflict).
2. **Closed PR #131** (2026-08-12T08:43:59Z), comment naming #91 as the
   surviving delivery path: opened after #105's declaration; zero unique fix
   content over #91 (byte-identical `agent-desk.html`, equivalent guard,
   evidence-doc currency only).
3. **Closed PR #138** (2026-08-12T08:44:00Z), comment naming #91 as the
   surviving delivery path: same shape as #131.
4. **Closed PR #84** (2026-08-12T08:44:06Z), comment naming #91 as the
   surviving delivery path for the canonical fix and #100 as the landed
   delivery of the 410-copy wire: both wires this branch carried are
   delivered, and it was conflict-locked against main.

## Resulting state

Exactly one open delivery path for the retired Agent Desk canonical fix:
**#91** (`fix/agent-desk-canonical-lane1`), sitting on current
`origin/main` with the fix, the regression guard, and the evidence receipt,
mergeable and awaiting review. The canonical fix itself remains unlanded on
main (main's `public/agent-desk.html` still declares the apex root), so #91
must be merged for the surface to be closed — this receipt only reconciles
the delivery paths.

## Verification (reproduce)

- `git diff <any pair of the four branch tips> -- public/agent-desk.html` →
  empty.
- `npm run check` and `npm test` on the refreshed #91 tree → green (above).
- GitHub state: #91 open and MERGEABLE; #84, #131, #138 closed with
  comments naming the survivor.
