# tinystudio-io lane 1 — SE Ranking Agency Catalog + Zinn Hub SEO Audit Marketplace manual profile handoffs

- Lane: tinystudio-io lane 1
- Branch: `docs/seranking-zinnhub-manual-profiles-2026-08-22`
- Item id: `2bed1d3786`
- Full item text: `[unreviewed-by-opus] SE Ranking Agency Catalog and Zinn Hub SEO Audit Marketplace are two new free B2B listing venues TinyStudio is absent from [research desk 2026-08-22 19:00 IST, risk: green, traction]`

## Outcome

Prepared operator handoffs, not live listings. Retire-branch did **not** trigger: origin/main had zero `seranking` / `zinnhub` venue files; live venue HTML and `site:` searches found no tinystudio.io profile on either venue. Unrelated "Studio" / "tinychubs" hits do not count. `fleet-resolve-item` was not run. Submission remains a human action by Nish.

Recorded blockers (not solved): SE Ranking catalog placement is paid-gated (annual Pro and Business + Agency Pack emailed form). Zinn Hub sells fixed-price audits; TinyStudio's offer is a free appraisal plus a desk on the pricing page — no invented SKU.

## Claims published to lane-1.json

- `docs/service/seranking-agency-catalog-manual-profile-2026-08-22.md`
- `docs/service/zinnhub-seo-audit-marketplace-manual-profile-2026-08-22.md`
- `.lane/reports/docs-seranking-zinnhub-manual-profiles-2026-08-22.md`

Stdout of the atomic claims write: `claims-ok`. No other lane-1.json field changed.

## Live first-party curl (2026-08-22)

| URL | HTTP | vs committed `public/` / notes |
| --- | --- | --- |
| `https://tinystudio.io/llms.txt` | 200 | byte-identical (`diff -q` silent; `LLMS-IDENTICAL`) |
| `https://tinystudio.io/offer.md` | 200 | byte-identical (`diff -q` silent; `OFFER-IDENTICAL`) |
| `https://tinystudio.io/pricing` | 200 | live page states `the desk is $2,500 a month on a three-month minimum` (4 occurrences) |
| `https://tinystudio.io/audit` | 200 | q3 no base city; q6 no logos/case studies/testimonials |
| `https://tinystudio.io/` | 200 | `data-study="readable"` = `88`; `data-study="readable_word"` = `eighty-eight` |
| `https://seranking.com/agencies/` | 200 | zero `tinystudio` hits |
| `https://seranking.com/agency-pack.html` | 200 | zero `tinystudio` hits; "Starting at $69/per month billed annually" |
| `https://help.seranking.com/hc/en-us/articles/18786039690780-What-is-the-Agency-Catalog` | 403 | bot challenge; packet captures stand; do not bypass |
| `https://zinnhub.com/marketplaces/seo-audit-marketplace/` | 200 | zero `tinystudio` hits |
| `https://zinnhub.com/become-freelancer/` | 200 | onboarding page exists; nothing completed |
| `https://zinnhub.com/dashboard/zinner/` | 200 | login page (`https://zinnhub.com/logins/`); nothing signed in |

No deploy lag. Copy source is committed `public/` (identical to live).

## Quoted venue strings with sources

SE Ranking `/agencies/` FAQ (HTTP 200, 2026-08-22):

> Securing a spot in the Agency Catalog is pretty straightforward. All you have to do is purchase SE Ranking’s Agency Pack, and then you can apply. … The Agency Pack is only available to agencies with the annual Pro and Business pricing plans. We send a form by email to users with our Agency Pack, all of whom must fill out the form in order to get featured in our Agency Catalog.

SE Ranking `/agency-pack.html` (HTTP 200, 2026-08-22): "Starting at $69/per month billed annually, you get:" and "Only available for users with annual subscriptions". Agency catalog feature: "With SE Ranking’s Agency Pack, you’ll be featured in our exclusive Catalog".

Packet line "listing appears free" is CONTRADICTED. No self-serve catalog application URL was found beyond `/agencies/`, `/agency-pack.html`, and the emailed form.

Zinn Hub marketplace (HTTP 200, 2026-08-22):

> The marketplace connecting site owners, marketing managers and agencies with verified SEO auditors

> Compare the audit type, the depth and the price listing by listing, and filter Zinners by category, minimum rating or Zinner type.

Observed listing-card prices on the fetched page: `$12.00` through `$441.00`. FAQ Micro Zinn: `$5`, `$10`, `$15` or `$20`. Auditor hourly rows: `$10.00`/hr through `$200.00`/hr. Packet range `$22.50–$200` is narrower than live and may be stale.

## Baseline-search results

SE Ranking:

- `/agencies/` and `/agency-pack.html` page text: no TinyStudio, no tinystudio.io (grep `-c -i tinystudio` = 0 and 0).
- `site:seranking.com TinyStudio` / `tinystudio.io`: unrelated Studio agency profiles (Undertk Studio, Yello Studio, and similar), not tinystudio.io.

Zinn Hub:

- Marketplace / become-freelancer / dashboard-zinner page text: no TinyStudio, no tinystudio.io.
- `site:zinnhub.com TinyStudio` / `tinystudio.io`: unrelated tinychubs video services, not this TinyStudio.

Unrelated "Tiny Studio" entities (Mac subtitle app, fibre-arts magazine, design agency, video studio, a venue that shares the name, unrelated LLC) do not count.

In-repo Clutch/G2/GoodFirms receipts still unfilled (`Submitted: <date>`). No live review-platform URLs supplied in the handoffs.

## Checks and tests

- `npm run check` exits 0 and prints `TinyStudio.io checks passed.`
- `npm test` exits 0 (check, headings, sitemap, worker, ui, contract, study, viewport, narrow-pages, narrow).
- TABLES-CLEAN: no `$[0-9]` / ROAS / guarant / ranking inside table rows of either new doc.
- Firmographic grep counts: 0 and 0.
- Mandated strings present (≥1 per file); pricing phrase count 1 and 1.
- Claims JSON: `claims-ok`.
- Diff vs `origin/main` is exactly the three spec files; `public`/`src`/`scripts` empty.

## PR

https://github.com/nish3451/TinyStudio.io/pull/299

## Explicit

No account created. No form submitted. Nothing purchased. No other worktree touched.
