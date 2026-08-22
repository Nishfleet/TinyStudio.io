# Lane 1 — refresh study figures to the 2026-08-22 scan

Item `632cbd9d00`: the public study figures were stale under "this number is today's" / "refreshed daily".

## What was already true

- PR #156 (`43cc831`, merged 2026-08-19) replaced the original **53 of 89** (snapshot 2026-08-06) and added `scripts/test-study-freshness.mjs`.
- origin/main `ed69cab` and live `https://tinystudio.io/` served **56 of 91** from snapshot `2026-08-17.json`.

## What was still broken

`npm run test:study` failed on origin/main:

```
newest snapshot is 2026-08-17 (4 days old) but the site promises "refreshed daily"
```

The daily scan writes into `/home/nish/workspaces/products/TinyStudio.io-agent-self-serve/study/snapshots/` and those files were not imported into GitHub. Snapshots for 2026-08-20, 2026-08-21, and 2026-08-22 existed in that checkout and not in this repo.

## What this branch does

Imported the missing daily series and re-ran `python3 study/render.py` so only `data-study` spans change:

| | before (2026-08-17) | today (2026-08-22) |
|---|---|---|
| no_faq / readable | 56 of 91 | **54 of 88** |
| no_price | 57 | 55 |
| blocked | 8 | 11 |
| attempted / industries / geos | 99 / 13 / 8 | unchanged |

Files:

- `study/snapshots/2026-08-20.json`
- `study/snapshots/2026-08-21.json`
- `study/snapshots/2026-08-22.json` (`scanned_at` 2026-08-22T01:30:31+00:00)
- `public/{index,audit,pricing,specimen,msp}.html`

## Proof

- `python3 study/render.py --check` → `pages match snapshot 2026-08-22`
- `npm run test:study` → 2 pass, 0 fail
- `npm run check` → `TinyStudio.io checks passed.`

The scan/deploy path that writes snapshots into a dirty local checkout and skips Cloudflare deploy (missing `~/.config/cloudflare/env`) is unchanged; it is the same root cause recorded on PR #156 and is out of this packet's file claims.
