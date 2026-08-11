# Repository product contract: retired Agent Desk replaced by The Website Appraisal — closeout receipt

Date: 2026-08-11
Scope: backlog item "[unreviewed-by-grok] Replace the retired Agent Desk as
the repository's active product contract — README, MEMORY, package metadata,
and the 'current plan' still direct agents to rebuild the wrong homepage"
(scout 2026-08-09, risk: amber, parity-risk). The finding was already fixed
and merged as PR #58 (`11864a7`, "docs(contract): make the Website Appraisal
the active repo truth"), and the abandoned round-1 candidate lane was closed
out against main by PR #72 (`872fd23`). This receipt re-verifies every
acceptance criterion of the item against the current head and live (2026-08-11)
so the tracker item cannot re-open by drift — the last annotation on the item
("still-seen 2026-08-11") is stale product-checkout evidence that contradicts
current `origin/main`.

## What was measured

The item's acceptance criteria:

1. README, package description, and active MEMORY/current-plan guidance
   describe The Website Appraisal and human-reviewed delivery truth.
2. Historical Agent Desk specs are clearly labeled historical/retired (or
   superseded by a current Appraisal plan) without erasing still-live
   `/api/agent-audit` mechanics.
3. One deterministic check fails if active product descriptors again call the
   public root a self-serve Agent Desk.
4. `npm test` passes; `/api/agent-audit` tests remain truthful and passing.

## Environment

- Source baseline: fresh `origin/main` at `872fd23`
  (`docs(evidence): close out the abandoned product-contract round-1 lane
  against current main (#72)`).
- Live target: `https://tinystudio.io/` and the public surfaces served by the
  deployed Cloudflare Worker.

## Results (repository, `origin/main` @ `872fd23`)

### README / MEMORY / package metadata name The Website Appraisal as current

- `README.md` opens "TinyStudio's public website: The Website Appraisal — the
  free leak audit of high-ticket service homepages — and the human-reviewed
  desk that closes what the audit finds" and declares
  `specs/004-website-appraisal/plan.md` the current product contract under
  "Current Plan"; the retired Agent Desk is documented only as a retired
  legacy surface.
- `MEMORY.md` states the current offer is The Website Appraisal with
  human-reviewed delivery, names `specs/004-website-appraisal/plan.md` the
  current plan, and marks the self-serve Agent Desk retired; the "Legacy Agent
  Desk" section preserves the still-live mechanics.
- `package.json` description: "TinyStudio public website: The Website
  Appraisal and the human-reviewed desk on Cloudflare Workers."

### Specs carry unambiguous current/historical markers

- `specs/001-public-buyer-page/plan.md`: "Status: HISTORICAL — retired."
- `specs/002-minimal-input-agent-desk/plan.md`: "Status: HISTORICAL — retired."
- `specs/003-wellness-clinic-launch/plan.md`: "Status: SUPERSEDED — historical
  campaign plan."
- `specs/004-website-appraisal/plan.md`: "Status: CURRENT", describing the
  public contract, legacy mechanics (still-live `/api/agent-audit`), and
  boundaries.

### Deterministic regression guard is present and wired in

- `scripts/test-product-contract.mjs` (no new dependencies, run via
  `npm run test:contract`) rejects any return to active Agent Desk framing and
  validates the HISTORICAL/SUPERSEDED/CURRENT markers; it is part of the
  `npm test` chain. The "known bad shape" fixtures prove it rejects the old
  README lead, old package description, and misplaced/conflicting status
  claims.

### Full suite on the current head

- `npm run check` — "TinyStudio.io checks passed."
- `npm test` — 90/90 pass, exit 0: heading hierarchy 7/7, sitemap 6/6, worker
  (incl. legacy `/api/agent-audit` mechanics) 53/53, agent UI + AI-answer
  readiness 16/16, product contract 8/8.

## Results (live, 2026-08-11)

- `https://tinystudio.io/` titles "TinyStudio — The Website Appraisal" and
  mentions The Website Appraisal with zero Agent Desk / self-serve mentions.
- `https://tinystudio.io/agent-desk` titles "TinyStudio — the retired Agent
  Desk".
- `https://tinystudio.io/pricing` titles "Pricing & terms — The Tiny Studio".
- `https://tinystudio.io/llms.txt` presents "## Legacy Self-Serve Agent Desk …
  is demoted and is not the product TinyStudio sells" alongside The Website
  Appraisal as current.
- `https://tinystudio.io/offer.md` states the Agent Desk "is demoted and is
  not the current offer".

## Conclusion

The item's acceptance criteria are met on current main and live: repository
instructions and metadata (README, MEMORY, package description, current plan)
name The Website Appraisal and human-reviewed delivery as the active product
contract, the retired Agent Desk is labeled historical/retired without erasing
still-live `/api/agent-audit` mechanics, the deterministic contract guard is
wired into `npm test`, and the full suite (90/90) plus live surfaces verify
the current truth. Nothing further to change; the item can be ticked.
