# Pilot Delivery Packet — Operator Template

Internal TinyStudio.io operator document. Do not publish. This is not marketing
copy, not a contract, not a proposal, and not an offer.

## How to use this template

- Open one packet per narrow, human-reviewed, finished-outcome pilot.
- A pilot is finished-outcome when it delivers one bounded, reviewable result
  (for example, one readiness diagnosis, one funnel plan, one creative test set,
  or one decision plan) that a human reviews and accepts before it is delivered.
- The workflow is stage-gated: a gate blocks forward progress until an exit
  decision is recorded in the Gate Log. Do not jump gates.
- Replace every `<placeholder>` with pilot-specific text. Delete sections that do
  not apply and note the deletion in the Gate Log.
- Rollback is a single step: delete this packet file. It changes no code, schema,
  dependency, or deployment state.

## Evidence tagging

Every claim in a packet must be tagged with exactly one of these four markers.
An untagged claim defaults to `[UNVERIFIED]`.

| Tag | Meaning | Required companion |
| --- | --- | --- |
| `[FACT]` | Observed directly by the operator or a named source, with date and source. | `— observed <date>, <source>` |
| `[HYPOTHESIS]` | Informed guess the pilot is designed to test. Must be falsifiable and time-boxed. | `— test by <date>` |
| `[APPROVED]` | Explicit client approval for a scoped action or claim. | `— client <name>, <date>, scope: <what>`, channel `<channel>` |
| `[UNVERIFIED]` | Claim received but not yet confirmed. Never treated as fact, never relayed as fact. | `— awaiting confirmation` |

## 0. Packet Header

- Pilot ID: `<TS-PILOT-###>`
- Title: `<short, outcome-first title>`
- Owner (operator): `<name>`
- Opened: `<date>`
- Client: `<client name, if applicable>`
- Finished outcome: `<one sentence describing the deliverable>`
- Gate log:
  - `[ ]` Gate 1 Intake — open
  - `[ ]` Gate 2 Evidence capture — open
  - `[ ]` Gate 3 Review decisions — open
  - `[ ]` Gate 4 Implementation handoff — open
  - `[ ]` Gate 5 Acceptance — open
  - `[ ]` Gate 6 14-day measurement — open

## 1. Gate 1 — Intake

Purpose: agree that this is a narrow, single-outcome pilot before any work or
client conversation begins.

Entry criteria: a named owner, a named client (or an explicit internal-only
marker), and a proposed finished outcome.

Complete:

- Pilot scope (what the finished outcome includes):
  - `<one to three concrete deliverables>`
- Explicit non-goals (what the pilot does NOT include):
  - `<for example: no campaign publishing, no ad spend changes, no platform
    connections, no CRM outcome syncing, no pricing, no promises>`
- Why this pilot exists: `[HYPOTHESIS] — <what we want to learn> — test by <date>`
- Constraints that apply: `[FACT] — observed <date>, <source>`
  - Human review is required before any claims, ad spend, campaign publishing,
    platform connections, or compliance-sensitive actions are taken.
  - Public-facing copy must not promise revenue, ROAS, SEO ranking, AI
    visibility, conversion lift, booked calls, sales lift, autonomous ad buying,
    or unapproved ad spend changes.

Exit decision: the owner confirms the scope fits on one page, the non-goals are
real, and the pilot is reversible. Record: `Gate 1 passed by <name> on <date>`.

## 2. Gate 2 — Evidence Capture

Purpose: gather baseline truth before the pilot changes anything. Facts come
first; they are the ground the pilot stands on.

Entry criteria: Gate 1 passed.

Complete:

- Baseline state before the pilot:
  - `<what exists today, captured as screenshots, logs, exports, or a dated
    check> — [FACT] — observed <date>, <source>`
  - `<metric or signal to be compared at day 14> — [FACT] — observed <date>`
- Client-provided context:
  - `<claim the client made> — [UNVERIFIED] — awaiting confirmation`
  - `<claim the client made and you confirmed> — [FACT] — observed <date>, <source>`
  - `<claim the client made and you confirmed in writing> — [APPROVED] — client
    <name>, <date>, scope: <what>, channel <channel>`
- Open questions the evidence does not yet answer:
  - `<question>`

Rules:

- Do not write guesses into the baseline; guesses are `[HYPOTHESIS]` and live in
  the test plan, not the baseline.
- Anything the client says is `[UNVERIFIED]` until you observe it directly or
  get it in writing with a scope.
- Store evidence files under `docs/evidence/` alongside this packet and link
  them here.

Exit decision: the baseline is complete enough to run the pilot, and every
evidence line is tagged. Record: `Gate 2 passed by <name> on <date>`.

## 3. Gate 3 — Review Decisions

Purpose: a human reviews the evidence and records decisions and approvals before
anything is implemented or claimed.

Entry criteria: Gate 2 passed.

Complete:

- Test plan from the intake hypothesis:
  - `[HYPOTHESIS] — <the claim to test> — test by <date>`
  - Success signal for the pilot: `<measurable, narrow signal>`
- Decisions taken at this gate:
  - `<decision> — decided by <name> on <date>`
- Client approvals required and obtained:
  - `<scoped action or claim> — [APPROVED] — client <name>, <date>, scope:
    <what>, channel <channel>`
- Approvals still missing:
  - `<scoped action or claim> — [UNVERIFIED] — awaiting client confirmation`

Rules:

- No implementation, no public claims, and no client-facing claims pass this
  gate without a recorded decision and, where money or external accounts are
  touched, an `[APPROVED]` line.
- An `[APPROVED]` line is the only acceptable proof of client consent. A verbal
  "sounds good" is `[UNVERIFIED]` until confirmed on a recorded channel.

Exit decision: every action that changes the client's money, accounts, platform
state, or public claims carries a decision and an `[APPROVED]` line where
required. Record: `Gate 3 passed by <name> on <date>`.

## 4. Gate 4 — Implementation Handoff

Purpose: hand the packet to implementation as a bounded task, and keep the
implementation on the approved plan.

Entry criteria: Gate 3 passed.

Complete:

- Handoff boundary:
  - Implementation may: `<list the exact files, artifacts, or deliverables>`
  - Implementation may NOT: `<list the excluded surface: pricing, legal
    promises, auth, payments, leads data, deploy/migration changes,
    dependencies, lockfile edits, public marketing copy, ad-platform changes>`
- Reference sources handed over: `<links to evidence, decisions, approvals>`
- Verification expected before acceptance: `<the tests or checks that prove the
  outcome>` — run `npm test` in this repo when the outcome touches the public
  site or Worker.

Rules:

- The implementation may only produce what Gate 3 approved. New scope discovered
  during handoff goes back to Gate 3.
- The handoff records what changed and what did not, so the pilot stays
  reversible.

Exit decision: the deliverable is produced, tagged evidence is attached, and the
expected verification runs. Record: `Gate 4 passed by <name> on <date>`.

## 5. Gate 5 — Acceptance

Purpose: a human reviews the finished outcome against the intake definition and
the Gate 3 success signal before it is treated as done.

Entry criteria: Gate 4 passed.

Complete:

- Acceptance criteria (from Gate 1 and Gate 3):
  - `<criterion>`
- Review result per criterion:
  - `<criterion> — met / not met — evidence: <link or note>`
- Outcome status:
  - `[FACT] — delivered outcome as reviewed — observed <date>`
  - `[HYPOTHESIS] — confirmed / refuted / inconclusive — observed <date>`
- Rework loop, if any:
  - `<what failed, what is sent back to, and the new gate entry>`

Rules:

- Only a named human signs acceptance. No automated check, model, or agent may
  mark a finished outcome accepted.
- Unverified claims do not count as delivered outcomes; convert them to
  `[FACT]` with evidence or keep them `[UNVERIFIED]` and exclude them from
  acceptance.

Exit decision: every criterion is met or explicitly waived with a reason.
Record: `Gate 5 passed by <name> on <date>`.

## 6. Gate 6 — 14-Day Measurement

Purpose: observe the pilot's narrow outcome for 14 days after delivery, compare
against the baseline from Gate 2, and close the packet.

Entry criteria: Gate 5 passed.

Complete:

- Measurement window: `<delivery date> + 14 days, through <date>`
- Day-14 read:
  - Baseline signal (from Gate 2): `<value> — [FACT] — observed <date>`
  - Day-14 signal: `<value> — [FACT] — observed <date>`
- Interpretation:
  - `<change observed> — [FACT] — observed <date>`
  - `<what we believe caused it> — [HYPOTHESIS] — test by <date>`
- Close decision (choose one):
  - `[ ]` Close — outcome delivered and measured; lessons noted.
  - `[ ]` Extend — one re-measurement at `<date>`; state why.
  - `[ ]` Re-run — return to Gate 2 or Gate 3; state what changed.

Rules:

- The 14-day window measures the agreed narrow signal only. Do not convert
  short-window observations into lasting claims about revenue, ROAS, rankings,
  or sales.
- A measured signal is `[FACT]`; an explanation for it is `[HYPOTHESIS]`.

Exit decision: a close decision is recorded and the packet is archived under
`docs/evidence/`. Record: `Gate 6 closed by <name> on <date>`.

## Appendix — Scope guardrails

This packet must never itself introduce:

- Pricing or payment terms.
- Legal promises, guarantees, or contractual language.
- Authentication or payments flows.
- Leads data, email lists, or customer folder material.
- Deploy or migration changes.
- New dependencies or lockfile edits.
- Public marketing copy.

If a pilot needs any of these, it is no longer a narrow finished-outcome pilot;
stop and reopen the scope at Gate 1.
