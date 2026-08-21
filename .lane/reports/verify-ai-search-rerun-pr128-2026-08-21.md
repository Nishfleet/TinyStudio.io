# Lane 1 report — re-verify the stranded 2026-08-12 AI-search re-run (PR #128)

Branch: `verify/ai-search-rerun-pr128-2026-08-21`
PR: (opened from this branch)
Base: fresh `origin/main`

## Outcome

Done. The 2026-08-12 AI-search controlled re-run is no longer stranded: PR
#128's content landed on main via PR #211 (merge `a654ab4`, 2026-08-15) and
is the record the live `/audit` evidence panel renders today (2026-08-12,
15 runs). Re-verified against current main and the live site on 2026-08-21.

## Evidence

- PR #128: CLOSED 2026-08-18, never merged, head
  `lane1/ai-search-rerun-entity-offer-20260812`.
- Merge commit `a654ab4` carries `testedOn: 2026-08-12`, 15 runs; the six
  fresh 2026-08-12 runs (DuckDuckGo q1/q2/q5, Bing q1/q5/q7 — 4 `wrong`,
  2 `absent`) are byte-identical to PR #128's head fixture.
- Live `https://tinystudio.io/audit`: embedded bundle `testedOn 2026-08-12`,
  15 runs (10 wrong, 3 absent, 2 not-tested).
- Triage closeout 2026-08-18 (`parked-prs-116-128-137-triage-closeout`)
  recorded the same disposition: "CLOSE — already landed via #211".

## Files

- `docs/evidence/ai-search/2026-08-21-pr128-reverify.md` — re-verify receipt
  (this pass's only repo change; no fixture or code touched).

## Honest limits

- No new live engine capture was run in this pass.
- Main's fixture has since advanced (PR #227, 2026-08-15 re-run, two `found`
  transitions, merged 2026-08-19), but the live panel still renders the
  2026-08-12 record — a deploy lag observed, not altered, by this lane.
- No ranking, visibility, lead, or revenue outcome is claimed.
