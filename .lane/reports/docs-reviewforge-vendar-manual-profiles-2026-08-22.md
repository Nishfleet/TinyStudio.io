# tinystudio-io lane 1 — Review Forge + Vendar manual profile handoffs

- Lane: tinystudio-io lane 1
- Branch: `docs/reviewforge-vendar-manual-profiles-2026-08-22`
- Item id: `5836ff47e1`
- Full item text: `Review Forge and Vendar are two new free B2B discovery venues TinyStudio is absent from [research desk 2026-08-21, risk: green, traction]`

## Outcome

Prepared operator handoffs, not live listings. Not already-resolved: origin/main
had zero `reviewforge` / `Review Forge` / `vendar` matches; live venue search
found no tinystudio.io profile on either venue. `fleet-resolve-item` was not
run. Submission remains a human action by Nish.

## Claims published to lane-1.json

- `docs/service/reviewforge-manual-profile-2026-08-22.md`
- `docs/service/vendar-manual-profile-2026-08-22.md`
- `.lane/reports/docs-reviewforge-vendar-manual-profiles-2026-08-22.md`

Stdout of the atomic claims write: `claims-ok`. No other lane-1.json field
changed.

## Live first-party curl (2026-08-22)

| URL | HTTP | vs committed `public/` |
| --- | --- | --- |
| `https://tinystudio.io/llms.txt` | 200 | byte-identical (`diff -q` silent) |
| `https://tinystudio.io/offer.md` | 200 | byte-identical (`diff -q` silent) |
| `https://tinystudio.io/pricing` | 200 | live page states `the appraisal is free, the desk is $2,500 a month on a three-month minimum` (4 occurrences) |
| `https://tinystudio.io/audit` | 200 | q3 no base city; q6 no logos/case studies/testimonials |
| `https://tinystudio.io/` | 200 | `data-study="readable"` = `88`; `data-study="readable_word"` = `eighty-eight` |

No deploy lag. Copy source is committed `public/` (identical to live).

## Venue pages read and quoted strings present

Review Forge (HTTP 200; browser session also read homepage + about):

- Homepage: `An independent directory of B2B service companies with direct links to verified reviews on Google, Trustpilot, G2, Clutch, and GoodFirms.` — present
- Homepage: `No company can pay us to be removed, hidden, or promoted. Companies are listed because they operate in the space, not because they paid for placement.` — present
- About: `We do not accept payment for placement, removal, hiding, or promotion. There is no premium tier. There is no featured slot for sale.` — present
- About methodology paragraph (all three listing conditions) — present
- Contact: only `elizabeth5@gmail.com` (`mailto:elizabeth5@gmail.com`) on homepage + about. No self-serve form.

Vendar (HTTP 200; browser session read `/`, `/marketing/seo`, `/participate`; did not click `Send request`, paid-package request buttons, or `/admin/login`):

- `Proof-ranked US agencies. No Clutch-style pay-to-rank.` — present
- `1,200+ US agency profiles ranked by proof, not by ad spend.` — present
- `position is calculated from case study depth, client proof, and verified performance — not invoices.` — present
- `Claim your profile. Get approved visibility.` — present
- `Participation gives you a verified badge, approved city surfaces, and structured profile review. Ranking stays editorial.` — present
- `Connect is free. Verify is trust. Package badge is quarterly visibility.` — present on `/participate`
- `From $299/quarter` + `City Core launch price.` — present on homepage
- Participate form fields and `Send request` button — present. Live defaults: Start with = Profile connection; Package interest = City Growth Quarter ($599/q); Campaign goal = Test one city-service launch quarter. Handoff requires changing the last two.

`venue-claim` binary exists; allowlist/policy for these venues is empty. Disposition: manual-only. No `venue-claim claim` was run.

## Search results for TinyStudio on both venues

Review Forge:

- Homepage search box: `TinyStudio` then `tinystudio.io`. Page body contained neither string; no company card.
- `/seo-company-reviews/` does not contain TinyStudio/tinystudio.io.
- Sitemap 719 URLs: no tinystudio loc (only unrelated `testiny-reviews`).
- `site:reviewforge.reviews TinyStudio` / `tinystudio.io`: homepage and category pages, no tinystudio.io profile.

Vendar:

- `/`, `/marketing/seo`, `/participate` page text: no TinyStudio, no tinystudio.io.
- `site:vendar.org TinyStudio` / `tinystudio.io`: unrelated studios (StudioLabs, BX Studio, Karpi Studio, etc.), not this TinyStudio.

In-repo Clutch/G2/GoodFirms receipts still unfilled (`Submitted: <date>`). No live review-platform URLs supplied in the handoffs.

## Checks and tests

- `npm run check` exits 0 and prints `TinyStudio.io checks passed.`
- `npm test` exits 0 (check, headings, sitemap, worker, ui, contract, study, viewport, narrow-pages, narrow).

## PR

https://github.com/nish3451/TinyStudio.io/pull/294

## Explicit

No account created. No form submitted. No paid package selected. No other
worktree touched. No file under `public/`, `src/`, `scripts/`, or existing
`docs/service/` handoffs was edited. Shared `.lane/report.md` was left
untouched.
