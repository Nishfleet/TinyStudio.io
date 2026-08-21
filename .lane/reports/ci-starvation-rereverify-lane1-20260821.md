# Lane report: CI queue re-starvation re-verification (lane 1, 2026-08-21)

Branch: `ci/starvation-rereverify-lane1-20260821`
Item: "The single self-hosted CI runner is the release choke point — ~60 queued verify/Gitleaks runs"

## Verdict

Already resolved — no repo change required. This is the third re-confirmation
of the diagnosis recorded in PR #214 (`ci/starvation-requeue-cleanup-lane1-20260815`),
re-verified in PR #217 (`ci/starvation-reverify-lane1-20260815`) and PR #224
(`ci/starvation-rereverify-lane1-20260815`): main's shared `vps-verify` label
already reaches **both** self-hosted runner instances, and the "~60 queued"
observation is a transient wave (the 19:01Z batch of ~30 PRs × 2 jobs),
fully drained in minutes. No workflow change is warranted.

## Live verification (2026-08-21 03:35Z–03:45Z, via GitHub API)

- Runners registered and online, both idle at inspection:
  - `netcup-rs2000-tinystudio-verify1` — labels `self-hosted Linux X64 vps-verify tinystudio-io`
  - `netcup-rs2000-tinystudio-verify2` — labels `self-hosted Linux X64 vps-verify tinystudio-io-verify2`
- Queue state at inspection: **zero queued, zero in-progress** (`gh run list
  --status queued|in_progress` both empty).
- Both workflows on main route through the shared `vps-verify` label:
  - `.github/workflows/ci.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
  - `.github/workflows/secret-scan.yml` → `runs-on: [self-hosted, linux, x64, vps-verify]`
- Shared label engages both runners (job-level proof, 19:01Z wave):
  - run 32406421682 `verify` → `netcup-rs2000-tinystudio-verify1`
  - run 32406448301 `verify` → `netcup-rs2000-tinystudio-verify1`
  - run 32406458318 `verify` → `netcup-rs2000-tinystudio-verify2`
  - run 32406453899 `Gitleaks` → `netcup-rs2000-tinystudio-verify2`
  - run 32406436263 `Gitleaks` → `netcup-rs2000-tinystudio-verify2`
- The item's "~60 queued" premise maps to the 19:01:38Z–19:02:03Z batch:
  22 runs in the 18:55Z–19:15Z window alone (11 PRs × 2 workflows), every
  one completed/success; longest drain 19:01:41Z→19:12:16Z (~10.5m) for a
  full 22-run wave across two runners. All 100 recent runs completed; the
  oldest recent run finished ~15 minutes before inspection.
- No open PR modifies `.github/workflows/*` (scanned all 33 open PRs by
  diff name-only).
- main-tip (`92d55c3`) `verify` + `Gitleaks` both success (runs
  32404746704 / 32404746595, 2026-08-20T18:43Z).

## Conclusion

The item's premise ("the single self-hosted CI runner is the release choke
point") no longer holds: two runners are online, both engage through the
shared `vps-verify` label, and a ~60-job wave drains in ~10 minutes with
zero queue left behind. Consistent with PRs #214, #217, #224 — closes as
already resolved / no-op.

## Not done

- No change to `.github/workflows/*` — main's shared-label routing is
  already the correct fix for the original 1126 choke point.
- No runner provisioning changes — runner labels are VPS-side out-of-band
  state, not repo-owned files.
