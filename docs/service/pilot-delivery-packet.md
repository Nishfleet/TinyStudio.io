# TinyStudio Pilot Delivery Packet

Internal operator template for a narrow, human-reviewed, finished-outcome pilot.
One packet per pilot. Fill it out as the pilot runs and complete it before the
pilot is closed.

The packet exists so TinyStudio pilots produce an artifact a human can review,
reject, or accept — not a claim an agent made and moved on from. A pilot is only
"delivered" when a human has accepted it using the gates in this packet.

## When to Use This Template

Use this packet when you are running a single, narrow pilot that has a
definable before state, a definable after state, and a human who must approve
the finished outcome. Do not use it for open-ended experiments, for work that
is already covered by an approved plan, or for anything that changes ad spend,
publishes campaigns, or moves money — those stay outside this packet and
require their own approval.

## Packet Identity

| Field | Value |
| --- | --- |
| Pilot ID | `E1-<short-name>-<YYYYMMDD>` |
| Date opened | `YYYY-MM-DD` |
| Date closed | `YYYY-MM-DD` (fill at close) |
| Operator (owner) | `Nish` |
| Reviewer | `Nish` (or named human) |
| Pilot title | `<one line, what is being tested>` |

## 1. Pilot Statement

State the narrow outcome in one sentence, in terms a human can verify.

- **Outcome:** `<What is the finished outcome of this pilot? e.g. "Prove the
  agent audit endpoint returns a usable pipeline brief for a high-ticket
  services offer.">`
- **Scope (in):** `<What exactly is included?>`
- **Scope (out):** `<What is explicitly excluded? e.g. "No ad account changes,
  no campaign publishing, no client data.">`
- **Success definition:** `<What observable result means the pilot passed?>`

## 2. Measurement Baseline

Record the before state before the pilot starts. Every metric must name a
source and a number. No baseline means the after state cannot be judged.

| Metric | Baseline value | Source / how measured | Captured on |
| --- | --- | --- | --- |
| `<metric, e.g. brief generation latency>` | `<value>` | `<tool/link/command>` | `YYYY-MM-DD` |
| `<metric 2>` | `<value>` | `<tool/link/command>` | `YYYY-MM-DD` |

Baseline notes:
- `<Any context needed to read the baseline numbers.>`

## 3. Evidence Citations

Every claim in this packet must point at a citation a human can open. Fill one
row per claim. A citation is a file path, commit, URL, or stored screenshot —
not a memory.

| Claim | Evidence citation | Where it lives (path/URL/commit) | Captured on |
| --- | --- | --- | --- |
| `<claim>` | `<what to open>` | `<path/URL/commit>` | `YYYY-MM-DD` |

Evidence rules:
- No row may say "N/A" or "trust me". If a claim has no evidence, remove the claim.
- Evidence must be captured at the time of the run, not reconstructed afterward.
- Keep evidence inside this repo's `docs/evidence/` tree or a link Nish can open.

## 4. Before / After Artifact Links

Concrete links to what changed. The reviewer must be able to open the before
and after without asking.

- **Before artifact:** `<path/URL to the state before the pilot>`
- **After artifact:** `<path/URL to the state after the pilot>`
- **Diff / change record:** `<commit range, PR, or file-level diff>`
- **Visual record (if UI changed):** `<screenshot path or URL>`

If any of these is empty, the packet is not ready for review.

## 5. Human Review & Acceptance

This section is the gate. Nothing else in the packet matters until a human
fills this in.

- **Reviewer:** `Nish`
- **Reviewed on:** `YYYY-MM-DD`

Checklist (reviewer completes):

- [ ] Read the pilot statement and confirmed the outcome matches the before/after artifacts.
- [ ] Opened each evidence citation in section 3 and confirmed the claim matches the citation.
- [ ] Opened the before and after artifacts in section 4.
- [ ] Confirmed the measurement baseline in section 2 was captured before the change.
- [ ] Confirmed no unsupported claims are being made (see section 6).
- [ ] Confirmed the handoff in section 7 names an owner and a next step.
- [ ] Decision: **Accepted** / **Rejected** / **Changes requested**.

Review notes:
- `<What the reviewer verified and any conditions.>`

## 6. Unsupported Claims & Approval Gates

State explicitly what this pilot does NOT claim, and what must happen before
any claim or action that is outside the pilot.

Unsupported claims — this pilot does not claim or imply:

- [ ] No revenue, ROAS, profit, booked-call, ranking, or conversion guarantees.
- [ ] No claim that the pilot outcome generalizes beyond the tested case.
- [ ] No claim that the pilot result is a finished client deliverable.
- [ ] No claim that the pilot changes ad spend, publishes campaigns, or touches
      client accounts.

Approval gates — before any of the following happens, a human must approve in
writing (add a dated note here):

- `[] <Action needing approval, e.g. "Promoting the after state to production.">`
- `[] <Action needing approval>`

## 7. Implementation Handoff

If the accepted outcome needs to go somewhere next, name it. If the pilot is
informational only, say so.

- **Handoff to:** `<person, repo, or "no handoff — informational only">`
- **What is handed over:** `<artifact, file, or decision>`
- **Owner of next step:** `<name>`
- **Next step and deadline:** `<action>, <YYYY-MM-DD>`
- **Follow-up ticket / task ID:** `<link or ID, or "none">`

## 8. Pilot Close

Fill when the pilot is closed.

- **Closed on:** `YYYY-MM-DD`
- **Final outcome:** `<accepted / rejected / superseded>`
- **What was learned:** `<one or two sentences for the next pilot>`
- **References to update:** `<docs/MEMORY.md entry, README, or "none">`

---

## Usage Notes for the Operator

- Copy this file to `docs/service/pilot-<short-name>-<YYYYMMDD>.md` per pilot.
  Do not edit this template to record a single pilot.
- Fill sections 1-4 as the pilot runs. Sections 5-8 are only filled by a human
  at review and close.
- A packet without a completed section 5 review is a draft, not a delivery.
- If a field is genuinely not applicable, write "not applicable for this
  pilot" rather than leaving it blank — a blank field is ambiguous.
- This template is internal. Nothing in it is marketing copy, pricing, legal
  promise, or public-facing material.
