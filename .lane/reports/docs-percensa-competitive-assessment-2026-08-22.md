# Lane 1 report: tinystudio-io — Percensa competitive assessment (7-reviewer, $49)

Branch: `docs/percensa-competitive-assessment-2026-08-22`
Item: 20d07458d0 — "Percensa ships a 7-reviewer model at $49 — a structural quality innovation over TinyStudio's" [unreviewed-by-opus]

## What this lane did

Wrote an internal competitive-intelligence assessment at
`docs/percensa-competitive-assessment-2026-08-22.md` comparing Percensa's
7-independent-reviewer $49 diagnosis product with TinyStudio's
7-specialist-pipeline + human-signature + treatment desk. No site copy,
pricing, or product-structure change. Verdict: independent convergence is a
real methodological difference on the diagnosis step; the two offers are not
substitutes, because Percensa is diagnosis-only and TinyStudio's desk includes
treatment. Item was not already present on origin/main (zero `percensa` hits).

## Evidence

- Percensa launch page
  `https://1111designs.com/introducing-percensa-the-website-review-we-kept-doing-by-hand/`
  (2026-08-22): curl HTTP 403 / Cloudflare; full body via WebFetch; search
  snippets match $49, 20–40 minutes, seven named independent reviewers,
  "diagnosis, not a treatment".
- `https://percensa.com/` and `/pricing` `/faq` `/method` `/start` `/terms`
  (all HTTP 200, 2026-08-22): purchase site exists; $49 one-time; no
  fourteen-working-day delivery guarantee (access-failure refund only).
- TinyStudio live, `curl -L`, all HTTP 200 on 2026-08-22: `/`, `/pricing`,
  `/agents`, `offer.md`, `llms.txt`. Verbatim phrases quoted in the
  assessment (free leak audit, five working days, six a month, $2,500 /
  three-month minimum, seven specialists, human signature, fourteen-working-day
  refund).

## Claims published

- `docs/percensa-competitive-assessment-2026-08-22.md`
- `.lane/reports/docs-percensa-competitive-assessment-2026-08-22.md`

## Repository checks

`npm run check` and `npm test` were run on the branch and pass (full suite:
check + headings + sitemap + worker + ui + contract + study + viewport +
narrow-pages + narrow). Docs-only change; no `public/` or `src/` edits.
