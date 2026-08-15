# Lane report: CI queue re-starvation re-verification (lane 1, 2026-08-15, second pass)

Branch: `ci/starvation-rereverify-lane1-20260815`
Item: "The CI queue has re-starved past the closed 1126 acceptance: 9 runs queued up to 2h03m (18:00"

## Verdict

Already resolved — no repo change required. This is a re-confirmation of the
diagnosis recorded in PR #214 (`ci/starvation-requeue-cleanup-lane1-20260815`)
and re-verified in PR #217 (`ci/starvation-reverify-lane1-20260815`): the
"9 runs queued up to 2h03m" observation was caused by PR #206's per-instance
matrix routing its `tinystudio-io-verify1` legs to a label that no registered
runner carries. PR #206 is closed (2026-08-14T22:36:18Z), its zombie legs are
gone, and the queue is draining normally across both runners.

## Live verification (2026-08-15 03:45Z–04:17Z, via GitHub API)

- Runners registered and online:
  - `netcup-rs2000-tinystudio-verify1` — labels `self-hosted Linux X64 vps-verify tinystudio-io`
  - `netcup-rs2000-tinystudio-verify2` — labels `self-hosted Linux X64 vps-verify tinystudio-io-verify2`
- Both workflows on main route through the shared `vps-verify` label:
  - `.github/workflows/ci.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
  - `.github/workflows/secret-scan.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
- Queue state at first inspection (~03:45Z): **zero queued, zero in-progress**.
- A concurrent 04:01Z wave (8 runs across PRs #91/#142/#194/#210/#211/#213/#218
  and this branch) produced a transient backlog: 4 queued at peak, oldest wait
  ~14m (04:01:12Z–04:15:28Z). It fully drained — zero queued by 04:15:28Z —
  and PR #224's own `verify` (run 31863339003, on
  `netcup-rs2000-tinystudio-verify1`) and `Gitleaks` (run 31863339025, picked
  up at 04:10Z) both PASSED. Max queue wait observed: ~14 minutes, orders of
  magnitude below the item's 2h03m.
- Recent drain times:
  - main pushes 03:43:00Z → done 03:43:16Z / 03:44:35Z (~16s–95s)
  - PR branches 03:39:27Z → done 03:39:48Z / 03:41:07Z (~21s–100s)
  - 03:01Z batch of 8 PR runs → all done 03:04:10Z–03:10:12Z (≤ ~9m, two runners engaged)
- No open PR modifies `.github/workflows/*` (scanned all 14 open PRs by diff
  name-only). No workflow runs exist on PR #206's branch.
- PR #206: CLOSED, not merged.

## Conclusion

The item's premise ("the CI queue has re-starved") no longer holds as of
2026-08-15 04:17Z: the queue fully drains (max observed wait ~14m during a
concurrent 8-run wave, vs the item's 2h03m), both runners are online and
sharing load through the shared `vps-verify` label, and the unregistered-label
source (PR #206) is closed. PR #224's own CI completed green end-to-end during
the observation window. Item closes as already resolved / no-op, consistent
with PR #214 and PR #217.

## Not done

- No change to `.github/workflows/*` — main's shared-label routing is already
  the correct fix for the original 1126 choke point.
- No runner provisioning changes — runner labels are VPS-side out-of-band state.
