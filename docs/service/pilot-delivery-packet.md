# Pilot Delivery Packet

Internal TinyStudio operator template. One packet per pilot that reaches a
finished outcome, from brief to proof packet. Copy this file for each pilot
and fill every field with evidence, not prose.

A generic AI can write a plausible-looking packet about nothing. This template
gates on evidence: a concrete artifact, sources with timestamps, human review
decisions, client acceptance, implementation notes, and a follow-up signal. If
any required evidence does not exist, write `[MISSING: <what is needed and why>]`
and keep the packet in DRAFT. Never invent an artifact, source, decision,
acceptance, or signal to make the packet look complete. A packet with missing
evidence is honest; a packet with fabricated evidence is a failed delivery.

This packet is internal operating material only. It must not contain pricing,
legal promises, authentication, payments, lead records, deployment or migration
changes, dependencies, or public marketing copy.

## Pilot Metadata

- Pilot name:
- Epic / feature: Epic E1
- Operator:
- Packet opened (date):
- Packet status: DRAFT | COMPLETE | APPROVED | REJECTED

## 1. Brief

What the pilot was meant to prove, who asked for it, and the finish line.

- Requested by:
- Outcome the pilot must demonstrate:
- Finish line (what "done" looks like):

## 2. Concrete Artifact Delivered

Name the actual finished artifact and where it lives. A generic summary is not
an artifact. This gate fails unless a named, locatable deliverable exists.

- Artifact name:
- Type (page, brief, sequence, campaign, report, other):
- Location / path / URL:
- Finished on (date):
- If no locatable artifact was delivered: `[MISSING: artifact location]`

## 3. Evidence Sources and Timestamps

For every claim above, list the source and when it was produced. A screenshot,
link, file path, run output, or commit hash with a timestamp beats a
recollection. One line per piece of evidence.

| Evidence | Source / location | Timestamp |
| --- | --- | --- |
|  |  |  |
|  |  |  |

- For every claim without a source: `[MISSING: evidence source and timestamp]`

## 4. Human Reviewer Decisions

Who reviewed the artifact and what did they decide. Record the person, the
date, and the decision.

- Reviewer:
- Reviewed on (date):
- Decision (approve / request changes / reject):
- Decision notes (quote or summarize what the reviewer said):

## 5. Client Acceptance

How the client accepted the finished outcome.

- Accepted by (name / role):
- Accepted on (date):
- Acceptance channel (email, call note, sign-off, other):
- Acceptance wording (quote or attachment reference):
- If acceptance is not recorded: `[MISSING: client acceptance evidence]`

## 6. Implementation Notes

What was actually built or run, and how it differs from the brief.

- Steps taken:
- Deviations from the brief and why:
- Problems hit and how they were resolved:

## 7. Follow-Up Signal

The measurable condition that decides what happens after this pilot. State the
signal, the threshold, and the action each outcome triggers. If the signal has
no evidence yet, mark it missing rather than assuming it was met.

- Signal (what is measured):
- Threshold (number or observable state):
- Result (evidence and timestamp):
- Outcome if threshold met:
- Outcome if threshold missed:
- If the signal has not been observed: `[MISSING: follow-up signal evidence]`

## Completeness Gate

Before marking the packet COMPLETE, confirm all of the following exist:

- [ ] A named, locatable concrete artifact (section 2)
- [ ] Evidence sources with timestamps for every claim (section 3)
- [ ] A human reviewer decision (section 4)
- [ ] Client acceptance (section 5)
- [ ] Implementation notes (section 6)
- [ ] A follow-up signal with observed result or a MISSING marker (section 7)
- [ ] No `[MISSING: ...]` markers remaining in sections that should be complete
