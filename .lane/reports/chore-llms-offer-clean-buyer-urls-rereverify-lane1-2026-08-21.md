# Lane report: llms.txt and offer.md clean buyer URLs — re-verify the closed twin's fix on current main and live (2026-08-21, lane 1)

Lane: tinystudio-io lane 1
Branch: `chore/llms-offer-clean-buyer-urls-rereverify-lane1-2026-08-21`
Item: 7a215e4e7a — "[unreviewed-by-opus] Point live llms.txt and offer.md buyer URLs at clean non-307 paths — the closed twin's fix PR"

## Outcome

**Closed.** The fix landed to main via the surviving delivery path PR #202
(`fix/llms-offer-clean-buyer-urls-lane1`), the sole merged delivery for this
surface after the fleet's duplicate-cluster reconciliation closed the twin
PR #57 (`fix/llms-offer-clean-buyer-urls`, fix commit `d187f48`) as the
stale-base duplicate. This lane re-verified the survivor tree authoritatively
against the current `origin/main` (`92d55c3`, post-merge `c4475858`) and the
live deployment: every buyer URL the machine-readable pair names serves 200
on the live worker, no `.html` buyer-URL references remain in either file,
and the check-site and agent-ui guards require the clean form (negative
probe re-introducing `pricing.html` exits 1 with the named guard message;
restore passes).

No code change was made on this branch — opening a duplicate of PR #202
would have recreated the cluster the fleet reconciled.

## Verification performed (2026-08-21)

1. **GitHub state**: PR #57 closed (2026-08-15T18:42:47Z) with a comment
   naming survivor #202; PR #202 merged to `origin/main` as `c4475858`
   (squash, 2026-08-15T18:42:47Z); `origin/main` head `92d55c3` carries the
   fix.
2. **Live probes**:
   - `/llms.txt` → HTTP/2 200 (`text/plain`), md5 matches worktree
     `public/llms.txt`.
   - `/offer.md` → HTTP/2 200 (`text/markdown`), md5 matches worktree
     `public/offer.md`.
   - `/audit.html` → HTTP/2 307 → `/audit`; `/audit` → 200.
   - `/pricing.html` → HTTP/2 307 → `/pricing`; `/pricing` → 200.
3. **Tree checks** on the worktree HEAD (`92d55c3`): `PATH="$HOME/.local/bin:$PATH" npm run check`
   → "TinyStudio.io checks passed."; `PATH="$HOME/.local/bin:$PATH" npm test` →
   exit 0, 126 tests, 0 failures (headings 6, sitemap 7, worker 83, UI 16,
   contract 8, study 2, viewport 4, narrow-pages exit 0, narrow exit 0).
4. **Buyer-URL inventory**: `grep -nE "https://tinystudio\.io/(audit|pricing)" public/llms.txt public/offer.md`
   → 13 hits, all clean (`/audit` or `/pricing`, no `.html` buyer URLs).
5. **Negative probe**: a single-line revert (replace
   `https://tinystudio.io/pricing` with `https://tinystudio.io/pricing.html`
   on `public/llms.txt` line 66) makes `node scripts/check-site.mjs` exit 1
   with the guard messages
   "Price question {q2,q7}-what-tinystudio-{charges,io-charges} must map to
   the clean /pricing (the pricing page owns the price)" and the matching
   `offer.md must mirror the preferred source page …` messages. Restore
   passes.
6. **Landing**: PR #202 already merged to `origin/main` (`c4475858`) — the
   fleet's sole delivery path for this surface; no re-land is needed.

## Files changed

- `docs/evidence/llms-offer-clean-buyer-urls-rereverify-2026-08-21-lane1.md`
  — new evidence receipt recording the authoritative re-verify against
  current `origin/main` (`92d55c3`) and live (the lane's claimed file).
- `.lane/reports/chore-llms-offer-clean-buyer-urls-rereverify-lane1-2026-08-21.md`
  — this lane-1 closeout.

## Delivery

- Branch: `chore/llms-offer-clean-buyer-urls-rereverify-lane1-2026-08-21`
- PR: opened against `origin/main` carrying the evidence closeout.
- Fix delivery: PR #202 merged to main (`c4475858`), the sole delivery path
  the fleet's reconciliation declared must merge to close this surface.
