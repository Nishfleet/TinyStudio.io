# Lane report: CI queue re-starvation cleanup (lane 1, 2026-08-15)

Branch: `ci/starvation-requeue-cleanup-lane1-20260815`
Item: "The CI queue has re-starved past the closed 1126 acceptance: 9 runs queued up to 2h03m (18:00"

## What the item observed

The improvement-loop backlog item 1126 ("the single self-hosted CI runner is
the release choke point") was accepted 2026-08-13 (annotate 1134: queue down
from 59-62 to 23, main-tip checks green, `release-state` shipping). The queue
has since re-starved: 9 runs queued, the oldest waiting up to 2h03m from
18:00Z.

## Root cause of the re-starvation

The re-starvation is **not** a capacity regression on main — it is PR #206.

- Main's `.github/workflows/ci.yml` and `secret-scan.yml` route both required
  jobs (`verify`, `Gitleaks`) through `runs-on: [self-hosted, linux, x64,
  vps-verify]`. The shared `vps-verify` label is carried by **both** runner
  instances:
  - `netcup-rs2000-tinystudio-verify1` → `self-hosted | Linux | X64 |
    vps-verify | tinystudio-io`
  - `netcup-rs2000-tinystudio-verify2` → `self-hosted | Linux | X64 |
    vps-verify | tinystudio-io-verify2`
- Live proof that main already drains across both runners: run 31846416272
  (PR #112 footer branding) executed its `verify` job on
  `netcup-rs2000-tinystudio-verify2`; run 31846412323 (PR #142) executed on
  `netcup-rs2000-tinystudio-verify1`.
- PR #206 ("ci: spread verify and Gitleaks across two runner instances") was
  built against the assumption that a second runner did not exist and
  introduced a per-instance matrix: `runs-on: ${{ matrix.runner }}` with
  `runner: [[self-hosted, linux, x64, vps-verify, tinystudio-io-verify1],
  [self-hosted, linux, x64, vps-verify, tinystudio-io-verify2]]`.
- The label `tinystudio-io-verify1` is **not registered on any runner** —
  verify1's per-instance label is `tinystudio-io`. GitHub Actions cannot
  schedule a job whose `runs-on` requires an unregistered label, so **every
  matrix leg for the verify1 entry queues indefinitely** while the verify2
  legs complete.
- Every push to the `ci/runner-scaleout-tinystudio-io-lane1-20260814-230537`
  branch (18:00, 18:01, 19:02, 19:31, 20:01, 20:30, 21:01Z on 2026-08-14)
  therefore spawned 2 zombie jobs that never run. Those are the queued runs
  backing the "2h03m" observation — 9 queued at inspection, all but one from
  this branch. PR #206's current check rollup shows its verify1 `verify` and
  `Gitleaks` legs QUEUED, matching the diagnosis.

So the re-starvation item's premise ("the CI queue has re-starved") is real,
but the starvation source is the in-flight scale-out PR's unregistered label,
not the shared-label routing on main.

## Change

No workflow change is required on main — the shared `vps-verify` label
already reaches both runners, which is the correct fix for the original 1126
choke point and is live in `runs-on: [self-hosted, linux, x64, vps-verify]`.

- PR #206 is superseded by this finding and closed with a plain reason. Its
  matrix routes jobs to an unregistered label and cannot pass CI by design;
  the intended capacity outcome (both runners engaged) is already achieved
  by main's shared-label routing, and its `verify2` leg (which did run) only
  confirmed that.
- This report records the cause, the live runner-label evidence, and the
  queue state at closeout.

## Verification (live, 2026-08-14 23:0x IST)

- `gh api repos/nish3451/TinyStudio.io/actions/runners`:
  - `netcup-rs2000-tinystudio-verify1` busy=true, labels
    `self-hosted Linux X64 vps-verify tinystudio-io`
  - `netcup-rs2000-tinystudio-verify2` busy=true, labels
    `self-hosted Linux X64 vps-verify tinystudio-io-verify2`
- `gh run list --status queued`: 9 queued; 7 of 9 are
  `ci/runner-scaleout-tinystudio-io-lane1-20260814-230537` legs created
  18:00-21:01Z (the PR #206 matrix zombies).
- `gh pr view 206` check rollup: `verify`/`Gitleaks` on the
  `tinystudio-io-verify1` legs QUEUED; `verify`/`Gitleaks` on the
  `tinystudio-io-verify2` legs SUCCESS/COMPLETED.
- main-tip checks (`e0ee160`): `verify` completed success, `Gitleaks`
  completed success.
- `gh api repos/nish3451/TinyStudio.io/actions/runs/31846416272/jobs`:
  `verify` on `netcup-rs2000-tinystudio-verify2`; run 31846412323 on
  `netcup-rs2000-tinystudio-verify1` — main's shared label engages both.

## Not done

- No change to `.github/workflows/*` — main's routing is already correct.
- Runner provisioning/labels are VPS-side out-of-band state, not repo-owned
  files; no repo change needed there.
