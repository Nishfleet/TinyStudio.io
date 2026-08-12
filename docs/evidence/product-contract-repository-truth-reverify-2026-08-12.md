# Repository product contract: retired Agent Desk replaced by The Website Appraisal — re-verify 2026-08-12

Date: 2026-08-12
Scope: backlog item "[unreviewed-by-grok] Replace the retired Agent Desk as
the repository's active product contract — README, MEMORY, package metadata,
and the 'current plan' still direct agents to rebuild the wrong homepage"
(scout 2026-08-09, risk: amber, parity-risk). The finding was fixed and merged
as PR #58 (`11864a7`, "docs(contract): make the Website Appraisal the active
repo truth"), the abandoned round-1 candidate lane was closed out by PR #72
(`872fd23`), and a closeout receipt re-verified the item on 2026-08-11. This
receipt re-verifies every acceptance criterion against the current head
(`ad9cee3`, 2026-08-12) and live, because the item is still tagged
unreviewed-by-grok and origin/main has moved since the 2026-08-11 receipt
(verified at `872fd23`).

## What changed on main since the 2026-08-11 receipt

Commits between `872fd23` and `ad9cee3` (2026-08-12): three AI-search evidence
commits (`8606b0c`, `62eec0a`, `ed62202`), a docs/evidence ship-verify commit
(`43c9e14`), and merges of PR #141 and #43. None touch `README.md`, `MEMORY.md`,
`package.json`, the specs, or `scripts/test-product-contract.mjs` — the
product-contract surfaces are unchanged since the 2026-08-11 verification.
The item's acceptance criteria were re-checked deterministically on this head.

## Acceptance criteria — repository (current head `ad9cee3`)

1. README, package description, and active MEMORY/current-plan guidance
   describe The Website Appraisal and human-reviewed delivery truth.
   - `README.md` opens "TinyStudio's public website: The Website Appraisal —
     the free leak audit of high-ticket service homepages — and the
     human-reviewed desk that closes what the audit finds" and declares
     `specs/004-website-appraisal/plan.md` the current product contract under
     "Current Plan"; the Agent Desk is documented only as a retired legacy
     surface.
   - `MEMORY.md` states the current offer is The Website Appraisal with
     human-reviewed delivery, names `specs/004-website-appraisal/plan.md` the
     current plan, marks the self-serve Agent Desk retired, and preserves the
     still-live legacy mechanics under "Legacy Agent Desk".
   - `package.json` description: "TinyStudio public website: The Website
     Appraisal and the human-reviewed desk on Cloudflare Workers."
2. Historical Agent Desk specs are clearly labeled historical/retired (or
   superseded by a current Appraisal plan) without erasing still-live
   `/api/agent-audit` mechanics.
   - `specs/001-public-buyer-page/plan.md` and `spec.md`:
     "Status: HISTORICAL — retired."
   - `specs/002-minimal-input-agent-desk/plan.md` and `spec.md`:
     "Status: HISTORICAL — retired."
   - `specs/003-wellness-clinic-launch/plan.md`: "Status: SUPERSEDED —
     historical campaign plan."
   - `specs/004-website-appraisal/plan.md`: "Status: CURRENT", describing the
     public contract, legacy mechanics (still-live `/api/agent-audit`), and
     boundaries.
3. One deterministic check fails if active product descriptors again call the
   public root a self-serve Agent Desk.
   - `scripts/test-product-contract.mjs` (wired in as `npm run test:contract`,
     part of the `npm test` chain) rejects old Agent Desk framings and
     misplaced/conflicting status claims; the "known bad shape" fixtures prove
     the rejections.
4. `npm test` passes; `/api/agent-audit` tests remain truthful and passing.

## Results (2026-08-12, fresh run on this head)

- `npm run test:contract` — 8/8 pass, incl. fixtures "checker rejects the old
  Agent Desk framings" and "checker rejects misplaced, conflicting, and
  contradictory truth".
- `npm run check` — "TinyStudio.io checks passed."
- `npm run test:headings` — 6/6; `npm run test:sitemap` — 7/7;
  `npm run test:worker` — 55/55 (incl. legacy `/api/agent-audit` mechanics);
  `npm run test:ui` — 16/16.
- Full `npm test` chain — 92/92 pass, exit 0.

## Results (live, 2026-08-12)

- `https://tinystudio.io/` titles "TinyStudio — The Website Appraisal" with
  zero Agent Desk / self-serve mentions on the homepage.
- `https://tinystudio.io/agent-desk` titles "TinyStudio — the retired Agent
  Desk".
- `https://tinystudio.io/llms.txt` presents "## Legacy Self-Serve Agent Desk …
  is demoted and is not the product TinyStudio sells" alongside The Website
  Appraisal as current.

## Conclusion

The item's acceptance criteria are met on current main and live: repository
instructions and metadata (README, MEMORY, package description, current plan)
name The Website Appraisal and human-reviewed delivery as the active product
contract, the retired Agent Desk is labeled historical/retired without erasing
still-live `/api/agent-audit` mechanics, the deterministic contract guard is
wired into `npm test`, and the full suite (92/92) plus live surfaces verify the
current truth on this head. Nothing further to change; the item can be ticked.
