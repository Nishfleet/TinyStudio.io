# Lane report: CI queue re-starvation re-verification (lane 1, 2026-08-15)

Branch: `ci/starvation-reverify-lane1-20260815`
Item: "The CI queue has re-starved past the closed 1126 acceptance: 9 runs queued up to 2h03m (18:00"

## Verdict

Already resolved. The item's observation is the same one PR #214 (commit `e7777f3`,
report `.lane/reports/ci-starvation-requeue-cleanup-lane1-20260815.md`) diagnosed and
closed out: the 9-run / 2h03m queue was PR #206's per-instance matrix routing its
`tinystudio-io-verify1` legs to a label no registered runner carries. PR #206 is closed,
its branch has zero live runs, and the current queue is normal PR traffic draining in
minutes across both runners. No repo change is required — main's shared-label routing is
already the correct fix.

## Live verification (2026-08-14 ~23:50Z, via GitHub API)

- Runners registered:
  - `netcup-rs2000-tinystudio-verify1` — labels `self-hosted Linux X64 vps-verify tinystudio-io`, online, busy
  - `netcup-rs2000-tinystudio-verify2` — labels `self-hosted Linux X64 vps-verify tinystudio-io-verify2`, online, busy
- Both workflows on main route through the shared `vps-verify` label:
  - `.github/workflows/ci.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
  - `.github/workflows/secret-scan.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
- Both runners engaged by the shared label (live proof):
  - run 31850906258 (main push, CI verify) → `netcup-rs2000-tinystudio-verify1`, success
  - run 31850638635 (PR #112, CI verify) → `netcup-rs2000-tinystudio-verify2`, success
- Queue state: 11 queued runs, all `pull_request` events created 23:49:30–23:49:55Z
  (PRs #91, #112, #142, #194, #210, #211) — seconds-to-minutes old, normal concurrent
  PR traffic; 2 runs in progress. No queued run older than ~1 minute.
- Zero workflow runs exist on `ci/runner-scaleout-tinystudio-io-lane1-20260814-230537`
  (PR #206's branch) — the zombie legs are gone. PR #206 is CLOSED.
- No open PR (of 14 listed) modifies `.github/workflows/*`.
- Recent completes drain fast: main push 23:35:52 → done 23:37:22 (~90s);
  PR #112 23:31:03 → done 23:32:48 (~1m45s).

## Conclusion

The "re-starved past the closed 1126 acceptance" premise no longer holds. Queue depth
and age are within normal PR-traffic bounds, both runners are healthy and sharing load,
and the unregistered-label source (PR #206) is closed. Item can be closed as already
resolved / no-op, consistent with PR #214's close-out.

## Not done

- No change to `.github/workflows/*` — routing is already correct.
- No runner provisioning changes — labels are VPS-side out-of-band state.
