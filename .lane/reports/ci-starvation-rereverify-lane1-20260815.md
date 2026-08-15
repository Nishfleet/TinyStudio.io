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

## Live verification (2026-08-15 ~03:45Z, via GitHub API)

- Runners registered and online:
  - `netcup-rs2000-tinystudio-verify1` — labels `self-hosted Linux X64 vps-verify tinystudio-io`
  - `netcup-rs2000-tinystudio-verify2` — labels `self-hosted Linux X64 vps-verify tinystudio-io-verify2`
- Both workflows on main route through the shared `vps-verify` label:
  - `.github/workflows/ci.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
  - `.github/workflows/secret-scan.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
- Queue state: **zero queued runs**, zero in-progress runs at inspection
  (~03:45Z). Runs on the 14 open PRs and main all completed SUCCESS.
- Recent drain times (all well within normal bounds):
  - main pushes 03:43:00Z → done 03:43:16Z / 03:44:35Z (~16s–95s)
  - PR branches 03:39:27Z → done 03:39:48Z / 03:41:07Z (~21s–100s)
  - 03:01Z batch of 8 PR runs → all done 03:04:10Z–03:10:12Z (≤ ~9m, two runners engaged)
- No open PR modifies `.github/workflows/*` (scanned all 14 open PRs by diff
  name-only). No workflow runs exist on PR #206's branch.
- PR #206: CLOSED, not merged.

## Conclusion

The item's premise ("the CI queue has re-starved") no longer holds as of
2026-08-15 03:45Z: queue depth is zero, both runners are online and sharing
load through the shared `vps-verify` label, and the unregistered-label source
(PR #206) is closed. Item closes as already resolved / no-op, consistent with
PR #214 and PR #217.

## Not done

- No change to `.github/workflows/*` — main's shared-label routing is already
  the correct fix for the original 1126 choke point.
- No runner provisioning changes — runner labels are VPS-side out-of-band state.
