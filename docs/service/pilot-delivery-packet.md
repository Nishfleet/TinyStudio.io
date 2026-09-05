# Pilot Delivery Packet — Website Revenue Leak Fix Sprint

> Internal operator template. Not public marketing copy. Do not publish outside TinyStudio.
>
> One packet per sprint, one packet per page/funnel fix. A sprint is finished only when every
> section below is complete and the Definition of Done is true.

## How to Use

1. Copy this file for each new sprint and rename it with the Sprint ID, e.g. `docs/service/pilot-delivery-packet-e1-001.md`.
2. Fill every `<field>`. A blank field means the section is not done.
3. Complete sections top to bottom. The sprint cannot advance past Section 5 (Human Review) until a human signs off.
4. Keep it narrow: one page or one funnel step per packet. If the investigation surfaces a second leak, open a new packet instead of widening this one.
5. Every claim in every section must point at a falsifiable artifact: a URL, a file path, a screenshot, or an export with a timestamp. An unsourced claim is not evidence.

## Sprint Header

| Field | Value |
|---|---|
| Sprint ID | `E1-<n>` |
| Customer alias | `<alias — never a real name, email, or company>` |
| Page / funnel target | `<exact path or funnel step>` |
| Sprint goal (one sentence) | `<what the fix is meant to achieve, stated as a measurable change>` |
| Opened by / date | `<operator> / <YYYY-MM-DD>` |
| Status | `pending` \| `evidence-gathering` \| `proposal-ready` \| `under-review` \| `in-handoff` \| `measuring` \| `done` \| `stopped` |

## 1. Scope

- **In scope:** the single page or funnel step this packet will fix. Name it exactly.
- **Out of scope (explicit):** everything the operator found but will not touch. Anything not listed here is out of scope by default.
- **Narrowness check:** if more than one page/funnel step is needed, stop and split into separate packets. State the split here.

## 2. Access Boundaries

- **Read access granted:** which systems/pages the operator may view, and how access was granted (who, when). Record only the access TinyStudio controls.
- **Write access granted:** which systems/pages the operator may edit, and who approved it.
- **Never touched by this sprint:** ad spend, campaign publishing, ad-platform write actions, credentials/keys, payments, billing, authentication, lead/contact data, deploys, migrations, dependency or lockfile changes.
- **Customer-private data:** any customer folders, analytics exports, or private sprint files stay outside this repo. This packet may reference them by path only; it never copies their contents in.

## 3. Source Evidence

Every claim about a leak must be falsifiable. Complete one row per finding before proposing any change.

| # | Claim (what leaks) | Evidence artifact | Location of artifact | Collected (date, by) |
|---|---|---|---|---|
| 1 | `<e.g. CTA is below the fold on mobile>` | `<screenshot / session export / page snapshot>` | `<path or URL>` | `<YYYY-MM-DD, operator>` |
| 2 | `<e.g. funnel step 3 drops 70%>` | `<export / analytics reference>` | `<path or URL>` | `<YYYY-MM-DD, operator>` |

- **Baseline facts only:** record what was observed. Do not record a preferred explanation as a fact.
- **Counter-evidence sought:** what the operator looked for to disprove each claim, and what was found (or that none was found).

## 4. Proposed Change

- **Problem statement:** one or two sentences, citing Section 3 rows by number.
- **Exact change:** the precise edit — which element, which page, what it becomes. Must be reviewable by a human without access to the operator's head.
- **Before / after:** paths to the before snapshot and the after preview (or a paste of the diff if the artifact is a file).
- **Reversibility:** how the change is rolled back, and who can do it. The change must be reversible; if it is not, stop and re-scope.
- **Risk:** what could go wrong, for whom, and the severity. If the change touches money-adjacent or externally visible behavior, say so here explicitly.

## 5. Human Review

- **Reviewer:** `<human name/role — required>`.
- **Review date:** `<YYYY-MM-DD>`.
- **Review checklist — all must be true for approval:**
  - [ ] Every Section 3 claim is sourced and checkable.
  - [ ] The Section 4 change matches the evidence and does not exceed Section 1 scope.
  - [ ] No access boundary from Section 2 is crossed.
  - [ ] The change is reversible and the rollback path is stated.
  - [ ] No pricing, legal promise, revenue/ROAS/lift guarantee, or public marketing claim is introduced.
- **Verdict:** `approved` \| `changes-required` \| `rejected`.
- **Changes required / rejection reason:** `<exact feedback>`.
- **If changes-required:** the packet returns to Section 4 and the review repeats before any next step.

## 6. Handoff

- **Delivered artifact:** what is being handed off (the approved change and its evidence bundle).
- **Owner now:** who owns the artifact after this sprint; TinyStudio remains accountable for the repo, the customer keeps ownership of their site.
- **Where it lives:** exact paths — the repo file(s) this packet may own, and the out-of-repo evidence bundle path.
- **What the next owner needs:** any context that is not obvious from the artifact.
- **Not part of handoff:** no deploy, migration, dependency, lockfile, payment, authentication, or ad-platform steps. If the next owner needs one of these, it is a separate packet.

## 7. Measurement

- **Baseline (falsifiable):** the metric and its starting value, citing the Section 3 artifact it came from.
- **Target (falsifiable):** the value change this fix is meant to produce, and the window it must hold for.
- **Measurement window:** `<start date> — <end date>`.
- **How measured:** the tool or export used, and who reads it.
- **Attribution guard:** this measurement is correlational. The packet records what changed; it must not promise or claim causal revenue/ROAS/lift as an outcome of TinyStudio's work.

## 8. Continue / Stop Decision

Taken at the end of the measurement window, by a human, with the Section 7 numbers in front of them.

- **Decision date:** `<YYYY-MM-DD>`.
- **Decision:** `continue` \| `stop`.
- **Stop reasons (any of these force stop, and the packet is closed):**
  - [ ] The change was rolled back (Section 4) and stayed rolled back.
  - [ ] The measurement shows no change or a regression, and no further hypothesis is worth one more packet.
  - [ ] A new access boundary, risk, or compliance concern appeared.
  - [ ] The customer or a TinyStudio human closed the engagement.
- **Continue:** only if the measurement moved toward the Section 7 target and the next leak is already identified. Record the next Sprint ID here: `<E1-<n+1>>`.

## Definition of Done

All of the following must be true for the sprint to be `done`:

- [ ] Sections 1–4 are fully filled with falsifiable artifacts, no blank fields.
- [ ] Section 5 shows a human `approved` verdict.
- [ ] Section 6 names the delivered artifact and its owner.
- [ ] Section 7 has a baseline, target, window, and measurement method, recorded before the change shipped.
- [ ] Section 8 records a `continue` or `stop` decision with reasons.
- [ ] No pricing, legal promise, revenue/ROAS/lift guarantee, public marketing copy, lead data, auth, payment, deploy, migration, dependency, or lockfile change entered this packet.
- [ ] This packet owns only its own file; it did not modify customer site code, repo code, or repo configuration.

If any checkbox is false, the status stays at the earliest incomplete section and the packet does not close.
