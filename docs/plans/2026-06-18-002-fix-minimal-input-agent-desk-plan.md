---
title: fix: Minimal-input Agent Desk
type: fix
date: 2026-06-18
execution: code
---

# fix: Minimal-input Agent Desk

## Summary

Make the Pipeline Loop Agent Desk feel agent-native: customers provide a small business seed, and the agents infer the offer, buyer, funnel, hooks, follow-up, CRM, tracking, and weekly fix loop unless a real blocker remains.

---

## Problem Frame

The current page looks and behaves like an agency intake form. That makes paying customers do diagnosis work the agents should handle, and it weakens the promise that TinyStudio is self-serve with AI doing the heavy lifting.

---

## Requirements

- R1. The public form must require only email and a compact business snapshot.
- R2. Optional fields must stay available for better output, but they must not dominate the first screen.
- R3. The Worker must accept minimal input and prompt the model to infer missing pieces, mark assumptions, and ask only true blocker questions.
- R4. The generated artifacts must stay claim-safe and approval-gated for spend, publishing, platform connections, and compliance-sensitive actions.
- R5. Existing structured section, metric snapshot, storage, and safety tests must keep passing.

---

## Key Technical Decisions

- **Keep one endpoint:** `/api/agent-audit` remains the only agent run endpoint so rate limits, storage boundaries, and safety filtering stay centralized.
- **Use business snapshot as the seed:** The existing `business` field becomes the one required context field, avoiding a data migration or extra API contract.
- **Progressive disclosure:** Offer, audience, proof, follow-up, metrics, and funnel controls move behind an optional detail section rather than being removed.
- **Prompt over workflow code:** Missing-input behavior belongs in the system/user prompt so the agents use judgment instead of hard-coded questionnaire logic.

---

## Implementation Units

### U1. Minimal-input validation

- **Goal:** Let customers run the agents with only email and business snapshot.
- **Requirements:** R1, R3, R5
- **Dependencies:** None
- **Files:** `src/worker.js`, `public/script.js`, `scripts/test-agent-worker.mjs`, `scripts/test-agent-ui.mjs`
- **Approach:** Relax validation to require only `email` and `business`; update client-side messages and tests to prove offer/audience are optional.
- **Patterns to follow:** Existing `validateAgentInput`, `ERROR_MESSAGES`, and mocked Worker/UI tests.
- **Test scenarios:** Minimal body succeeds; missing business seed fails; UI submits without offer/audience.
- **Verification:** `npm test`.

### U2. Agent-heavy prompt behavior

- **Goal:** Make the agent infer missing offer, buyer, funnel, creative, follow-up, CRM, and metrics assumptions before asking questions.
- **Requirements:** R3, R4, R5
- **Dependencies:** U1
- **Files:** `src/worker.js`, `scripts/test-agent-worker.mjs`
- **Approach:** Add prompt guidance for assumption-making, blocker-only questions, and customer-delight output. Keep the existing no-guarantee and approval-gated constraints.
- **Patterns to follow:** Current `agentSystemPrompt`, `agentUserPrompt`, and unsafe-output scrubber.
- **Test scenarios:** Minimal prompt includes inference guidance and labels absent optional fields as missing context rather than invalid input.
- **Verification:** Worker tests and live API smoke.

### U3. Progressive-disclosure intake UI

- **Goal:** Replace the visible questionnaire with a compact agent workspace.
- **Requirements:** R1, R2
- **Dependencies:** U1
- **Files:** `public/index.html`, `public/styles.css`, `scripts/check-site.mjs`
- **Approach:** Keep email, business snapshot, and constraints visible; move market, funnel, offer, audience, proof, follow-up, and weekly numbers into a collapsible optional section.
- **Patterns to follow:** Existing single-page Agent Desk layout and output tabs.
- **Test scenarios:** Desktop and mobile render without oversized form controls; optional details remain accessible.
- **Verification:** Browser check at `http://127.0.0.1:8788/`.

---

## Scope Boundaries

- No ad account, CRM, WhatsApp, SMS, email, or payment platform write automation in this fix.
- No storage of business snapshots, optional details, metrics, or generated artifacts.
- No public claims about guaranteed outcomes.
- No new paid onboarding, account provisioning, or subscription logic.

---

## Risks & Dependencies

- **Weak seed risk:** Some users will submit vague snapshots. Mitigation: prompt the agent to make explicit assumptions and ask only true blocker questions.
- **Over-inference risk:** The model may invent proof or outcomes. Mitigation: preserve the existing unsafe-output filter and no-invented-proof prompt rules.
- **Hidden detail risk:** Power users may miss optional fields. Mitigation: keep the optional drawer visible, short, and clearly labeled.
