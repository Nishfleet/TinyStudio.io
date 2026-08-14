# Lane report: brief-requested clean nav/back links re-verify (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `chore/brief-requested-clean-links-rereverify-2026-08-14`
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and back links at clean non-307 paths — post-signup surface still carries the redirecting-internal-link fault"

## Outcome

**Closed.** The fix landed to main via the surviving delivery path PR #145
(`fix/brief-requested-clean-links-lane1`), the sole open PR for this surface
after the fleet's duplicate-cluster reconciliation closed #60 and #97. This
lane re-verified the survivor tree authoritatively, then merged PR #145
(merged as `f9214c1`, 2026-08-14T09:42:02Z). The fault the item named was
still live at probe time (verified 2026-08-14: `/brief-requested` served all
four `.html` hrefs, each 307-redirecting to its clean twin); `origin/main`
now serves the clean anchors and the internal-links guard covers the
post-signup page. No code change was made on this branch — opening a
duplicate would have recreated the cluster the fleet reconciled.

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
5. **Live probe** (before the merge): `/brief-requested` serves 200 with the
   four `.html` hrefs; each `.html` path 307s to its clean twin.
6. **Landing**: PR #145 merged to main as `f9214c1` (2026-08-14T09:42:02Z);
   `origin/main` now carries the clean anchors and the guard entry (verified
   against `f9214c1`).

## Files changed

- `docs/evidence/brief-requested-clean-links-rereverify-2026-08-14.md` — new
  evidence receipt recording the authoritative re-verify and the merge of the
  survivor PR (the lane's claimed file).

## Delivery

- Branch: `chore/brief-requested-clean-links-rereverify-2026-08-14`
- PR: opened against origin/main carrying the evidence closeout.
- Fix delivery: survivor PR #145 merged to main (`f9214c1`), the sole
  delivery path the fleet's reconciliation declared must merge to close this
  surface.
