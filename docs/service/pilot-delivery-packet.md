# TinyStudio.io E1 Pilot Delivery Packet (Template)

> **INTERNAL OPERATOR DOCUMENT.** Not served by the public site, not marketing copy.
> This is a fill-in template an operator runs before the epic E1 review gate.
> It defines one narrow, human-reviewed, finished-outcome pilot: observing a
> real generated Pipeline Brief end to end, without any performance promise.
>
> Fill slots marked `[[ FILL ]]`. Preserve every section. Do not soften the
> outcome check or the rollback conditions to make a pilot pass.

## Purpose

E1 ("Self-Serve Agent Desk", `specs/001-public-buyer-page/`) is implemented but
not yet live. The last open task is `[ ] Deploy Agent Desk routes after review gate.`
This packet is the operator's working paper for that review gate: it makes the
pre-deploy pilot observable, attributable, reversible, and human-signed before
the Agent Desk routes open to real traffic.

## 1. Problem

| Field | Content |
| --- | --- |
| Epic | E1 - Self-Serve Agent Desk |
| Spec | `specs/001-public-buyer-page/spec.md` |
| Plan | `specs/001-public-buyer-page/plan.md` |
| Open task it gates | `[ ] Deploy Agent Desk routes after review gate.` |
| Pilot date | `[[ FILL: YYYY-MM-DD ]]` |
| Pilot operator | `[[ FILL: name ]]` |
| Pilot scope | Deliver one finished, human-reviewed Pipeline Brief from the Agent Desk to `[[ FILL: internal observer / named stakeholder ]]`, proving the loop works before any route goes live. |

Why the pilot exists: the page generates a Pipeline Brief server-side through
Cloudflare Workers AI (`/api/agent-audit`) and the risk to the company is not
build risk but delivery-risk — the generated finished outcome being unusable,
unsafe, or unverifiable in front of a real visitor. The pilot is the smallest
run that can fail. It has no payment, auth, ad-platform, or live-traffic
component.

Non-goals of this packet:

- No pricing, legal, guarantee, or refund promises.
- No authentication or payment flows.
- No lead, email, or visitor data collection.
- No deploy, migration, or infrastructure change.
- No dependency, lockfile, or source-code change.
- No public marketing copy.
- No throughput, cost, quality, revenue, or conversion guarantees of any kind.

## 2. Baseline

Verified live state at the time the packet is opened. Operator re-verifies each
bullet, not just reads it.

- [ ] `npm test` passes (the check script `scripts/check-site.mjs` covers Agent Desk content, Worker behavior, claim-safety, routes, assets, and tracked migrations).
- [ ] `npm run deploy:dry-run` succeeds (routes are deployable but NOT deployed).
- [ ] `wrangler.jsonc` declares the `tinystudio.io`, `www`, `app`, `api` route family with D1, Workers AI binding, and `run_worker_first`.
- [ ] Migrations `0001_email_signups.sql`, `0002_agent_runs.sql`, `0003_agent_usage_limits.sql` exist and are tracked by git.
- [ ] Last deploy task in `specs/001-public-buyer-page/tasks.md` is still open.
- [ ] Git working tree is clean at the recorded base commit.
- [ ] Base commit `[[ FILL: git rev-parse HEAD ]]`.

Baseline result: `[[ FILL: PASS / FAIL with reason ]]`

## 3. Artifact Inventory

Every artifact the pilot consumes or produces, with its owner path. The pilot
is only as good as these being present and tracked.

| # | Artifact | Path | Role in pilot |
| --- | --- | --- | --- |
| A1 | Intake and output surface | `public/index.html` | Visitor-facing Agent Desk UI |
| A2 | Visual system | `public/styles.css` | Rendering/overlap check surface |
| A3 | Intake client | `public/script.js` | Posts to `/api/agent-audit`, renders brief |
| A4 | Agent-readable truth | `public/llms.txt`, `public/offer.md` | Source of pilot truth claims |
| A5 | Static/SEO files | `public/robots.txt`, `public/sitemap.xml`, `public/favicon.svg`, `public/og-image.png`, `public/apple-touch-icon.png` | Page integrity checks |
| A6 | Edge worker | `src/worker.js` | `/api/agent-audit`, `/api/signups`, rate limits, stale-path + retirement routing |
| A7 | Cloudflare config | `wrangler.jsonc` | Route family, D1, AI binding |
| A8 | Schema | `migrations/0001`-`0003` | Email + usage metadata, rate-limit counters |
| A9 | Check gate | `scripts/check-site.mjs` | `npm test`; the pilot's automated gate |
| A10 | Evidence | `docs/evidence/` | Pilot outputs, provenance, sign-off (section 4) |

Anything a pilot needs that is not in this inventory must be added to the
inventory before the pilot can be called complete.

## 4. Evidence Provenance

Evidence is captured following the repo convention already used at
`docs/evidence/mobbin-reference-runs/`: a dated subdirectory holding a raw
artifact plus a human-readable brief. The pilot writes one evidence set:

```
docs/evidence/e1-pilot/
  <date>-<run-tag>/          # e.g. 2026-08-05-run-1
    raw-output.txt           # verbatim Agent Desk response for the sample scenario
    run-manifest.json        # run id, timestamp, model id, prompt hash, page path
    brief.md                 # human-readable outcome summary and rubric grade
  README.md                  # index of runs + pointer to this packet
```

Provenance rules (mandatory):

- Every claim in the pilot report maps to a raw artifact in `docs/evidence/e1-pilot/`; no claim without an artifact.
- `run-manifest.json` records: run id, UTC timestamp, model id from `AGENT_MODELS`, hash of the exact prompt submitted, and the URL used. This makes each finished brief attributable to a concrete run.
- Raw outputs are captured verbatim; the human-readable brief is written by the operator and is not a rewrite of evidence.
- Evidence is PII-free: no emails, no lead/visitor data, no submitted business content beyond the operator's own synthetic sample scenario. Sample scenarios are fictional high-ticket situations written by the operator, not real client briefs.
- Evidence is credential-free: no tokens, keys, or account identifiers.
- Source references use portable refs (`git:tinystudio-io@<sha>`, file paths), never absolute machine paths.
- The evidence set must be committed to the repo (or staged) by the same git identity that signs the packet; uncommitted evidence is not evidence.

## 5. Reviewer Sign-Off

A human reviewer, not the operator, signs. The reviewer personally performs the
section 8 outcome check against the evidence set; a reviewer who cannot access
the raw artifacts must refuse to sign.

- Reviewer name: `[[ FILL ]]`
- Reviewer role: `[[ FILL ]]`
- Review date: `[[ FILL ]]`
- Artifacts reviewed: `[[ FILL: list evidence paths, e.g. docs/evidence/e1-pilot/2026-08-05-run-1/ ]]`
- The reviewer personally verified (tick all that apply):
  - [ ] Ran `npm test` on the base commit and saw it pass.
  - [ ] Opened the raw output(s) and confirmed they are the unedited captured responses.
  - [ ] Confirmed each brief contains every required Pipeline Brief section.
  - [ ] Confirmed the briefs contain none of the forbidden claims.
  - [ ] Confirmed no PII or submitted client briefs appear in the evidence set.
  - [ ] Confirmed the run manifest matches the raw output (timestamps, model, prompt hash).
- Verdict: `[[ FILL: APPROVED / NOT APPROVED ]]`
- Blocking findings (none if approved): `[[ FILL ]]`
- Signature: `[[ FILL: name + date ]]`

The signed verdict is the review gate artifact the deploy task in `tasks.md`
depends on. Nothing deploys on an unapproved or unsigned verdict.

## 6. Implementation-Ready Handoff

When the verdict is `APPROVED`, this section tells the next implementer exactly
what the pilot has established and what remains out of this packet's scope.

Ready state delivered:

- A working end-to-end Agent Desk run with a real, attributable generated brief (or a recorded FAIL that blocks handoff).
- A reviewer-signed verdict and committed evidence set.
- A clean, known base commit for the deploy.

What the handoff does NOT include (belongs to a separate deploy increment):

- Running `npm run deploy`, applying remote migrations, or changing
  `wrangler.jsonc` routes. This packet is documentation only and must not be
  the vehicle for live deploy or migration changes.
- Any dependency, lockfile, or `package.json` change.
- Any change to `public/` copy, `src/worker.js`, or the schema.

Handoff note for the deploy increment (informational, not performed here):

- Deploys are guarded by the machine-level `safe-deploy` wrapper; the deploy
  task follows the existing `migrate:remote` then `deploy` sequence in
  `package.json` and the environment prefix pattern documented in
  `docs/email-signups.md`.
- Post-deploy verification per `specs/001-public-buyer-page/plan.md`:
  `/`, `/api/agent-audit`, `/pipeline-sprint/`, and `app`/`api` retirement responses.

Handoff recipient: `[[ FILL ]]` | Handoff date: `[[ FILL ]]`

## 7. Rollback and Stop Conditions

Stop conditions (any one true => stop the pilot, mark outcome FAIL, do not deploy):

1. `npm test` fails at the base commit.
2. The sample `/api/agent-audit` run does not return a Pipeline Brief (error state instead of output).
3. Any generated brief is missing a required Pipeline Brief section or contains a forbidden claim.
4. Any brief or evidence set contains PII or a real (non-synthetic) business brief.
5. The run manifest cannot be reconciled with the raw output (provenance broken).
6. A reviewer is not available to sign the verdict.

Rollback (all reversible; the pilot touches no live traffic):

- Primary rollback: the Agent Desk routes are NOT deployed, so rollback is
  simply not deploying. There is no live state to revert.
- If routes are already live when a later run of this packet finds a failure,
  rollback is `git revert` of the deployed state, re-run `npm test`, then
  re-deploy the previous working commit per the existing deploy sequence.
- Evidence rollback: delete the dated run subdirectory under
  `docs/evidence/e1-pilot/` and re-run; an invalid evidence set is removed, not
  patched.

Exit criteria from a FAIL: record the failed outcome and its artifacts in the
evidence set (a failing pilot is evidence too), update `tasks.md` with the
finding, and keep the deploy task unchecked.

## 8. Falsifiable Outcome Check

Pre-registered, pass/fail, with a fixed rubric. The check is falsifiable: the
grade is computed from the evidence set by the reviewer, and any single failed
item fails the pilot. There is no partial credit and no claim of quality,
speed, cost, revenue, or conversion is asserted.

Sample scenario (operator-provided synthetic, high-ticket):
`[[ FILL: one fictional business brief, e.g. founder-led $5k retainer offer, existing site, no ad account context ]]`

Rubric (all items pass to approve):

| # | Check | Pass condition (observable in evidence) |
| --- | --- | --- |
| 1 | Delivery | The `/api/agent-audit` run returns a Pipeline Brief, not an error state. |
| 2 | Completeness | Brief contains all eight sections: Offer, Funnel, Creative, Qualification, Follow-Up, CRM, Tracking, Decision. |
| 3 | Claim safety | Brief and page copy contain none of the `forbiddenClaims` list in `scripts/check-site.mjs` and no revenue/ROAS/booking/ranking/sales-lift promise. |
| 4 | No stored brief | The run records only email + lightweight usage metadata per schema; the evidence set contains no stored business brief and the raw manifest shows the synthetic scenario was only processed for output. |
| 5 | Provenance | `run-manifest.json` matches `raw-output.txt` (model id, timestamp, prompt hash) with no gap. |
| 6 | Human attribution | Every brief section can be attributed by the reviewer to the raw output; no operator-supplemented content. |
| 7 | Integrity | `npm test` passes at the base commit and the evidence set is committed. |

Outcome: `[[ FILL: PASS / FAIL ]]` — computed by `[[ FILL: reviewer ]]` on `[[ FILL: date ]]`.

A PASS means exactly: the E1 Agent Desk delivered one attributable,
human-reviewed Pipeline Brief with no stored brief and no unsafe claim, on the
recorded commit. It means nothing more. It is not a guarantee of future
behavior under real traffic, of AI output quality, or of business results.

---

## Appendix: Quick Commands

```bash
npm test                        # automated gate (A9)
npm run deploy:dry-run          # deployability check (no deploy)
git rev-parse HEAD              # base commit for the packet
# Evidence capture: record /api/agent-audit response verbatim to
# docs/evidence/e1-pilot/<date>-<run-tag>/raw-output.txt with a run manifest.
```

## Appendix: Ownership

- This packet owns one file: `docs/service/pilot-delivery-packet.md`.
- It does not edit, deploy, migrate, or replace any artifact in section 3.
- Created as part of epic E1's review-gate preparation. Reversible by deleting
  this file and the (empty) `docs/service/` tree; no other file references it.
