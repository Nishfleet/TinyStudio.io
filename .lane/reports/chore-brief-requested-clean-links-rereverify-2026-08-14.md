# Lane report: brief-requested clean nav/back links re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `chore/brief-requested-clean-links-rereverify-2026-08-14`
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and back links at clean non-307 paths — post-signup surface still carries the redirecting-internal-link fault"

## Outcome

The fix is implemented and verified on the surviving delivery path PR #145
(`fix/brief-requested-clean-links-lane1`), the sole open PR for this surface
after the fleet's duplicate-cluster reconciliation closed #60 and #97. The
fault the item names is still live (verified 2026-08-14: `/brief-requested`
serves all four `.html` hrefs, each 307-redirecting to its clean twin), so
this lane re-verified the survivor tree authoritatively and recorded the
closeout: `main` and live carry the fault until PR #145 is merged. The
[unreviewed-by-opus] tag is resolved by this re-verify plus the CI-green
survivor; no code change was made on this branch because PR #145 already
carries the byte-identical fix and is mergeable against current
`origin/main` — opening a duplicate would recreate the cluster the fleet
reconciled.

## Verification performed

1. **GitHub state**: PR #145 open, MERGEABLE, 0 behind `origin/main`
   (`60958fc`), checks green (verify pass, Gitleaks pass, CodeRabbit
   completed).
2. **Tree checks** (fresh worktree at head `3459a9d`): `npm run check` passes;
   `npm test` exit 0 — 117 tests, 0 failures. Only known out-of-scope `/`
   240/260px overflow note (does not gate exit).
3. **Positive probe**: no `href="*.html"` anchors on `public/brief-requested.html`.
4. **Negative probe**: re-introducing `href="audit.html"` makes
   `check-site.mjs` exit 1 with the guard message; restore passes.
5. **Live probe**: `/brief-requested` serves 200 with the four `.html` hrefs;
   each `.html` path 307s to its clean twin.

## Files changed

- `docs/evidence/brief-requested-clean-links-rereverify-2026-08-14.md` — new
  evidence receipt recording the authoritative re-verify (the lane's claimed
  file).

## Delivery

- Branch: `chore/brief-requested-clean-links-rereverify-2026-08-14`
- PR: opened against origin/main carrying the evidence closeout; the actual
  fix lands via the survivor PR #145.
