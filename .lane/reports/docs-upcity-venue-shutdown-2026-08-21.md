# Lane report: UpCity profile item — venue shutdown finding (2026-08-21)

Lane: tinystudio-io lane 5
Branch: `docs/upcity-venue-shutdown-2026-08-21`
Item: 3a3f9e0892 — "Prepare a truthful manual UpCity profile for the
human-reviewed Website Appraisal" [research desk 2026-08-21, risk: amber,
traction, NEEDS-NISH]

## Outcome

**Blocked — the venue no longer exists.** UpCity (upcity.com) shut down in
late November 2025; its domain now serves a "This site is no longer
supported… visit Capterra" decommissioning message. A truthful manual UpCity
profile cannot be prepared because there is no UpCity platform in 2026. The
item is retired with this evidence; no PR was opened because the finding is a
venue-shutdown record, not a profile handoff.

## What I did

1. **Published claims** to
   `/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-5.json` (only
   the `claims` field, atomic temp-file+rename):
   `docs/service/upcity-manual-profile-2026-08-21.md`,
   `.lane/reports/docs-upcity-venue-shutdown-2026-08-21.md`.
2. **Investigated** — read the growth-loop packet
   `upcity-manual-listing.md` and the backlog item; read the existing
   Clutch/G2/GoodFirms handoffs in `docs/service/` to confirm the item's
   expected deliverable shape (a prepared profile handoff).
3. **Probed the venue live** — direct fetches of `upcity.com/providers/`,
   `www.upcity.com/providers/`, `/our-community/guidelines/`, and
   `/our-community/methodology/` all fail: apex times out (curl 28), `www`
   does not resolve (`NS_ERROR_UNKNOWN_HOST` via browser, no A record via
   `getent`/`dig`), and the browser tool cannot load any UpCity URL.
4. **Cross-checked archives and news** — the Wayback capture of the
   guidelines page from 2026-03-09 serves the decommissioning message "This
   site is no longer supported. If you are looking for help finding software,
   please visit Capterra."; the 2025-11-07 captures of `/providers/` and
   `/our-community/methodology/` hold the pre-shutdown policy strings the
   packet quoted. Industry coverage (jeffsocialmarketing.com 2025-11,
   searchengineprojects.com, bigredseo.com) dates the shutdown to late
   November 2025 under Gartner Digital Markets consolidation.
5. **Re-verified TinyStudio's live truth** — `https://tinystudio.io/` and
   `/llms.txt` return HTTP 200; llms.txt still carries the offer, the
   human-review boundary, "run by Nish", "no base city or office address",
   "clients are never named", and `hello@tinystudio.io`; `public/llms.txt`
   and `public/offer.md` on this branch are byte-identical to live.
6. **Wrote the finding** — `docs/service/upcity-manual-profile-2026-08-21.md`
   records the venue-shutdown evidence, marks the GMB blocker moot, and
   recommends closing the backlog item as blocked. This lane report is the
   lane's evidence file.

## Files changed

- `docs/service/upcity-manual-profile-2026-08-21.md` — the venue-shutdown
  finding (the lane's claimed file).
- `.lane/reports/docs-upcity-venue-shutdown-2026-08-21.md` — this lane report.

## Verification evidence

- UpCity unreachable live: curl exit 28 on apex; `www.upcity.com` has no A
  record; browser reports `NS_ERROR_UNKNOWN_HOST`.
- Wayback 2026-03-09 capture of the guidelines page serves the
  decommissioning message (quoted in the finding).
- News coverage dates the shutdown to late November 2025 (sources quoted in
  the finding).
- TinyStudio live surfaces HTTP 200; llms.txt/offer.md byte-identical to
  committed source.
- `git diff --check` clean; `npm run check` and `npm test` pass (docs-only
  change).

## Closeout

Item 3a3f9e0892 is retired as **blocked — venue shut down**. No PR opened:
this is a finding that closes a dead-venue item, not a profile handoff for a
live venue. If UpCity ever returns, the item can be re-filed and a truthful
handoff prepared against the then-current venue.
