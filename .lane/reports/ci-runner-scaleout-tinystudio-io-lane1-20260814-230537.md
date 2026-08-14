# Lane report: CI runner scale-out for the self-hosted runner choke point

Branch: `ci/runner-scaleout-tinystudio-io-lane1-20260814-230537`
Item: "The single self-hosted CI runner is the release choke point — ~60 queued verify/Gitleaks runs"

## Finding (live state at 2026-08-14 ~23:00 IST)

- The repo has exactly **one** self-hosted runner: `netcup-rs2000-tinystudio-verify1`
  (labels `self-hosted, Linux, X64, vps-verify, tinystudio-io`), a hardened
  systemd instance of the `github-runner-tinystudio@` template on the
  `github-tinystudio.slice` (CPUWeight 80).
- Both workflows (`CI` → job `verify`, `Secret Scan` → job `Gitleaks`) pin
  `runs-on: [self-hosted, linux, x64, vps-verify]`, which today only this one
  runner satisfies. Every PR and every push to main therefore serializes
  ~70 s of verify + ~10 s of Gitleaks on a single executor; bursts (the
  documented ~60 queued runs, and the 34-open-PR fleet incidents) queue
  linearly.
- Current queue depth at inspection: **0 queued / 0 in progress** (16 open
  PRs). The burst is intermittent, but the structural single-executor limit
  is unchanged — the choke point re-appears with every fleet fan-out.
- Measured per-run cost (run 31824436668, verify job 94845093580):
  npm ci 3 s (cache hits), npm test 30 s, Chromium render-blocking check
  27 s, wrangler dry-run 2 s. A second runner roughly halves fleet drain
  time for verify and Gitleaks alike.
- The VPS (netcup-rs2000, 8 cores) already hosts the identical hardened
  runner pattern per repo (e.g. 0509 runs three instances
  `verify1/2/3` on one slice), so the scale-out approach is the established
  fleet convention, not a new pattern.

## Change

`.github/workflows/ci.yml` and `.github/workflows/secret-scan.yml`: replace
the single-label `runs-on` with a 2-element matrix over the per-instance
runner labels `tinystudio-io-verify1` / `tinystudio-io-verify2` (both carry
the shared `self-hosted, linux, x64, vps-verify` labels). The job names
(`verify`, `Gitleaks`) are unchanged, so the branch-protection required
checks keep their exact contexts.

Rationale for keeping everything on self-hosted VPS runners: governance
(`agent-contract.md`, `governance.md`) prefers VPS CI runners, and prior PRs
(#64/#65/#66) deliberately moved these jobs off `ubuntu-latest`; moving
Gitleaks to GitHub-hosted would also split the secret-scan evidence trail.

## Not done in this PR (host provisioning)

The GitHub-side runner does not exist yet. Provisioning it requires running
on the VPS as root/sudo (creating user `ghatiny-verify2`, installing the
runner under `/var/lib/github-runners/tinystudio-verify2`, adding the systemd
unit instance + label `tinystudio-io-verify2`, and starting it). That is
outside the repo's owned files, so it is documented here as the follow-up
step; until it runs, the verify2 matrix leg stays queued ("No runner
satisfies...") and verify/Gitleaks behave exactly as today on verify1.

## Verification

- YAML parses (node yaml); workflow job names unchanged (`verify`,
  `Gitleaks`) → required-check contexts preserved.
- Job-level matrix with self-hosted label arrays is the standard Actions
  pattern used across the fleet.
- No runtime gate or site logic touched; the repo's npm suite is unaffected.
