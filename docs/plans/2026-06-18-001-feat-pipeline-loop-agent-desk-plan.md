---
title: feat: Pipeline Loop Agent Desk
type: feat
date: 2026-06-18
execution: code
---

# feat: Pipeline Loop Agent Desk

## Summary

Expand the TinyStudio Agent Desk from a single Pipeline Brief generator into a three-artifact applied-AI workflow: Pipeline Brief, Implementation Checklist, and Weekly Fix Report. The app remains self-serve, server-side AI powered, claim-safe, and approval-gated for external account or spend actions.

---

## Problem Frame

The current Agent Desk proves TinyStudio can collect high-ticket pipeline context and generate a useful first brief. The next product layer should bridge AI output into operational work: what to build first, what to track weekly, and what to fix next without positioning TinyStudio as an autonomous ad agency.

---

## Requirements

**Agent workflow**

- R1. The Agent Desk must generate three distinct artifacts from one intake: Pipeline Brief, Implementation Checklist, and Weekly Fix Report.
- R2. The Weekly Fix Report must use optional current-week metrics when supplied and must fall back to a tracker template when metrics are absent.
- R3. The Implementation Checklist must convert the diagnosis into approval-gated setup work across offer, funnel, creative, qualification, follow-up, CRM, tracking, and decision cadence.

**Public UI**

- R4. The public page must expose the three-artifact workflow as the first-class self-serve experience.
- R5. The intake must collect optional weekly lead-to-call metrics without making them required and without implying guaranteed performance targets.
- R6. The output panel must let users inspect and copy each artifact separately while preserving a useful all-in-one response for fallback.

**Safety and data boundary**

- R7. The Worker must keep AI generation server-side through Cloudflare Workers AI and must not store submitted business briefs or generated artifacts.
- R8. Public copy and generated output must avoid revenue, ROAS, booked-call, ranking, AI-visibility, conversion-lift, sales-lift, profit, or autonomous ad-buying guarantees.
- R9. Ad spend changes, campaign publishing, platform connections, CRM outcome syncing, claims, and compliance-sensitive work must remain approval-gated.

**Verification**

- R10. Static content checks must validate the new artifacts, section contract, safety language, and Cloudflare AI boundary.
- R11. A sample high-ticket scenario must exercise the end-to-end agent response and prove the outputs are useful without manual explanation.

---

## Key Technical Decisions

- **Single API response with structured sections:** The Worker should ask the model for exact top-level headings, split the markdown into named sections, and return both `sections` and a backward-compatible combined `brief`. This keeps the client simple while preserving compatibility with the existing one-output contract.
- **Optional metrics as prompt context only:** Weekly numbers belong in the request prompt and browser UI, not in D1. Existing D1 usage logging should remain lightweight and should not capture the business brief, the weekly metrics, or generated artifacts.
- **Client-side tabs over multiple API calls:** One agent run should produce all three artifacts. Tabs only change presentation, which keeps AI cost, rate limits, and consistency predictable.
- **Safety filter on combined generated text:** Existing forbidden-claim detection should run against the full generated response before any section is returned, so unsafe content cannot leak through a secondary tab.

---

## Implementation Units

### U1. Worker section contract

- **Goal:** Generate and return Pipeline Brief, Implementation Checklist, and Weekly Fix Report as structured sections.
- **Requirements:** R1, R2, R3, R7, R8, R9
- **Dependencies:** None
- **Files:** `src/worker.js`, `scripts/check-site.mjs`
- **Approach:** Extend the agent input with optional weekly metrics, update the prompt to require exact headings, add a section splitter, validate that all three sections are present, and keep the combined `brief` response for compatibility.
- **Patterns to follow:** Existing `/api/agent-audit` validation, retry, safety-filter, and no-brief-storage behavior in `src/worker.js`.
- **Test scenarios:** Submit a valid request with weekly metrics and expect all three response sections; submit a valid request without metrics and expect the Weekly Fix Report to become a tracker template; confirm unsafe generated claims are still rejected.
- **Verification:** Static checks cover the section splitter, prompt headings, metrics fields, and forbidden claims.

### U2. Public workflow UI

- **Goal:** Make the page read as a self-serve workflow desk rather than a single brief generator.
- **Requirements:** R4, R5, R6, R8, R9
- **Dependencies:** U1
- **Files:** `public/index.html`, `public/script.js`, `public/styles.css`, `scripts/check-site.mjs`
- **Approach:** Add an optional weekly metrics group to the intake, render three output tabs backed by the structured API response, keep copy buttons scoped to the active artifact, and preserve a clear empty/error state.
- **Patterns to follow:** Existing Agent Desk layout, form submission, progressive enhancement, and status handling in `public/index.html`, `public/script.js`, and `public/styles.css`.
- **Test scenarios:** Load the page at desktop and mobile sizes; generate from sample context; switch tabs; copy the active artifact; verify empty, loading, success, and error states do not overlap or require technical explanation.
- **Verification:** Browser inspection plus static checks confirm artifact labels, metric fields, output tabs, and safety copy.

### U3. Public truth and repo docs

- **Goal:** Keep machine-readable and maintainer-facing truth aligned with the new three-artifact workflow.
- **Requirements:** R4, R8, R9, R10
- **Dependencies:** U1, U2
- **Files:** `public/llms.txt`, `public/offer.md`, `README.md`, `MEMORY.md`, `specs/001-public-buyer-page/plan.md`, `specs/001-public-buyer-page/spec.md`, `specs/001-public-buyer-page/tasks.md`
- **Approach:** Update public docs to say the Agent Desk generates a Pipeline Brief, Implementation Checklist, and Weekly Fix Report. Preserve the no-guarantee and approval-gated boundaries.
- **Patterns to follow:** Existing public truth files use short, direct claim-safe wording.
- **Test scenarios:** Static content checks should fail if the new sections or safety boundaries are missing.
- **Verification:** `npm test` validates content, safety claims, and AI boundary checks.

### U4. End-to-end verification and review

- **Goal:** Prove the implementation works locally before any ship path.
- **Requirements:** R10, R11
- **Dependencies:** U1, U2, U3
- **Files:** `scripts/check-site.mjs`
- **Approach:** Run the normal test command, run syntax checks where useful, browser-check desktop and mobile, and exercise `/api/agent-audit` with a sample high-ticket scenario.
- **Patterns to follow:** Existing project verification in `README.md`, `MEMORY.md`, and `specs/001-public-buyer-page/plan.md`.
- **Test scenarios:** Static test pass; sample AI response has all three artifacts; no forbidden claims; rendered page is nonblank and usable.
- **Verification:** Final report lists exact checks run and any unverified items.

---

## Scope Boundaries

- No payment collection, account provisioning, or paid subscription logic.
- No Meta, Google, CRM, WhatsApp, SMS, or email platform write automation.
- No campaign publishing, ad spend changes, CRM outcome syncing, or lead-message sending.
- No storage of submitted business briefs, weekly metrics, or generated artifacts.
- No public guarantees for revenue, ROAS, booked calls, profit, rankings, AI visibility, conversion lift, or sales lift.

---

## Risks & Dependencies

- **Model shape drift:** The model may ignore exact headings. Mitigation: parse sections defensively, retry through existing fallback models, and fail safely if required artifacts are missing.
- **Overclaiming by generation:** The model may produce unsafe claims. Mitigation: run the existing safety detector on the full response before returning it.
- **Metric interpretation risk:** Weekly metrics can be incomplete or noisy. Mitigation: ask the model to diagnose bottlenecks and next checks, not guarantee outcomes.
- **AI availability:** The feature depends on Cloudflare Workers AI binding. Mitigation: keep the existing safe unavailable state.

---

## Documentation / Operational Notes

No D1 migration is planned because the new inputs and outputs are not stored. Any deploy path must still run the review gate and existing `npm test` before publishing.
