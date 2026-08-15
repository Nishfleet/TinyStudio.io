# Lane report: truthful manual GoodFirms profile — already prepared, close-out re-verify (2026-08-15)

Lane: tinystudio-io lane 1
Branch: `docs/goodfirms-closeout-rereverify-2026-08-15`
Item: 07d7a4fb59 — "Prepare a truthful manual GoodFirms profile for the
human-reviewed Website Appraisal" [research desk 2026-08-14, risk: green,
traction]

## Outcome: already prepared and merged — re-verified, closed out

No new preparation was needed. The first-capture handoff
`docs/service/goodfirms-manual-profile-2026-08-15.md` was prepared by the
previous lane run and merged as PR #219 (commit `1151ddd`, an ancestor of the
current `origin/main` head). This lane re-fired on the same item after that
merge and recorded a close-out re-verify: the handoff's field-by-field
truthfulness map still holds against current main and the live site, no
reject condition is triggered, and the human manual submission remains the
open action.

## What I did

1. **Published claims** to
   `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` (only
   the `claims` field, atomic temp-file+rename):
   `docs/service/goodfirms-manual-profile-2026-08-15.md`,
   `.lane/reports/docs-goodfirms-closeout-rereverify-2026-08-15.md`.
2. **Investigated** — found the item's packet
   (`goodfirms-manual-listing.md`, 2026-08-14) and that the handoff already
   existed on `origin/main` via PR #219. Established the close-out precedent
   from PR #215/#216/#217 (re-verify "already resolved by PR X" with
   evidence, no new code).
3. **Branched from fresh `origin/main`** (`1151ddd`) as
   `docs/goodfirms-closeout-rereverify-2026-08-15`.
4. **Live-checked** all seven first-party surfaces: `/`, `/audit.html`,
   `/pricing.html`, `/agents.html`, `/specimen.html`, `llms.txt`, `offer.md`
   — all HTTP 200 and byte-identical to committed source (no deployment
   lag). Verified verbatim: the offer, "reviewed by a person, not autonomous
   software", "Six appraisals a month, done by hand", "run by Nish, who
   signs every audit", "The site states no base city or office address",
   "clients are never named", `hello@tinystudio.io`, the pricing pointer.
5. **Re-verified the no-invention fields**: full scan of `public/*.html`,
   `llms.txt`, `offer.md` finds no phone/`tel:`, no founded year, no
   TinyStudio social URLs (the only instagram/linkedin matches are inside
   the `/audit` AI-search evidence JSON, cited for unrelated businesses),
   no certification — so Year founded / Phone / Social profiles /
   Certification stay blank exactly as the table instructs.
6. **Cross-checked the GoodFirms official pages** via Wayback Machine
   snapshots (live pages return HTTP 403 to scripted fetches from the VPS;
   the prior lane's real-browser re-fetch of 2026-08-15 stands): get-listed
   (2026-06-28 snapshot), get-listed flow help (2025-10-13), free-listing
   help (2025-08-14), approval-window help (2025-08-14), terms of use
   (2026-07-23). All quoted strings match the handoff's evidence.
7. **Re-ran the search baseline**: `site:goodfirms.co tinystudio.io
   TinyStudio` still returns no exact TinyStudio/tinystudio.io profile —
   consistent with the handoff's auto-listing caveat.
8. **No GoodFirms receipt** exists in the product state; receipt block
   remains unfilled; human submission is the open action.
9. **Ran the repo checks**: `npm run check` → "TinyStudio.io checks passed."
   (full `npm test` suite green on this head).

## Files changed

- `docs/service/goodfirms-manual-profile-2026-08-15.md` — appended the
  2026-08-15 close-out re-verification section (the lane's claimed file).
- `.lane/reports/docs-goodfirms-closeout-rereverify-2026-08-15.md` — this
  lane report.

## Verification evidence

- `npm run check` → exit 0, "TinyStudio.io checks passed."
- Live curl diffs of all seven surfaces vs committed source: zero
  differences.
- Wayback snapshots of the five GoodFirms official URLs: all quoted policy
  strings present, matching the handoff.
- Search baseline: no exact TinyStudio/tinystudio.io GoodFirms profile.

## Closeout

PR opened at https://github.com/nish3451/TinyStudio.io/pull/NNN. Item
07d7a4fb59 is already prepared (PR #219); handoff re-verified unchanged and
ready for Nish's manual submission.
