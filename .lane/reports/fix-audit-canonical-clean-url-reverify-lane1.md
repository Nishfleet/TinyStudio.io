# Lane report — fix/audit-canonical-clean-url-reverify-lane1

## Item

Point appraisal-page canonicals and JSON-LD WebPage @ids at the clean URLs
that do not 307 (item f7a18209b7, `[unreviewed-by-opus]`).

## Outcome

**Already fixed and deployed; re-verified and closed out.**

The requested change is commit `1cc7a4e` (PR #56), already on origin/main.
This lane's work was to re-verify the item against current main and live and
record the closeout, resolving the `[unreviewed-by-opus]` tag.

Evidence: `docs/evidence/audit-canonical-clean-url-reverify-2026-08-14.md`.

## Verification performed

1. `public/audit.html` on current origin/main (`60d045c`) carries canonical
   `https://tinystudio.io/audit`, `og:url` `https://tinystudio.io/audit`, and
   JSON-LD `WebPage` `@id` `https://tinystudio.io/audit#webpage` /
   `url` `https://tinystudio.io/audit`.
2. Live: `curl -I https://tinystudio.io/audit` → 200, no Location;
   `curl -I https://tinystudio.io/audit.html` → 307 to
   `https://tinystudio.io/audit`. The served `/audit` head matches source.
3. `npm run check` passes (canonical guard expects the clean `/audit` for the
   audit page); `npm test` passes (114 tests, 0 failures).
4. No canonical/audit-line change since the last re-verify (`git diff
   dc1542a..origin/main -- public/audit.html` empty; guard diffs unrelated).

## Delivery

- Branch: `fix/audit-canonical-clean-url-reverify-lane1`
- PR: opened against origin/main.
