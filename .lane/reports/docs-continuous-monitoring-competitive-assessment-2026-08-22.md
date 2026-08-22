# Lane 1 report: tinystudio-io — continuous monitoring competitive assessment

Branch: `docs/continuous-monitoring-competitive-assessment-2026-08-22`
Item: 528ec27d0d — "Continuous monitoring is now standard — TinyStudio's one-off audit + 3-month desk has no continuous monitoring, while competitors ship 'flag issues within hours' and 'monthly Share of Model tracking'" [unreviewed-by-opus]

## What this lane did

Wrote an internal competitive-intelligence assessment at
`docs/continuous-monitoring-competitive-assessment-2026-08-22.md` recording
that OnyxRank, BrightIQ, and Mod Op GEO ship continuous monitoring as a
standard feature while TinyStudio ships a one-off audit plus a fixed
three-month desk. No site copy, pricing, or product-structure change. Verdict:
the parity gap is factual, but the live site already addresses it via
positioning (option b partially live on `/audit` and `/msp`); whether that is
enough remains Nish-reserved. Item was not already on origin/main (zero
`continuous monitoring` hits in `docs/`).

## Evidence

- OnyxRank `https://onyxrank.com/services/technical-seo` (2026-08-22, `curl
  -L` HTTP 200): "Continuous technical SEO monitoring covering 50+ factors";
  "We monitor continuously and flag issues within hours, not in monthly
  reports"; automated checks "inside 24 hours of any deploy and inside one
  hour of any indexation drop" (item had "within one hour"; live says
  "inside"); "No issues stay open in 'recommended but not implemented'
  status".
- BrightIQ `https://brightiq.solutions/services/monthly-retainer/`
  (2026-08-22, HTTP 200): "Monthly Re-Crawl + Report"; "Monthly Share of
  Model" / "tracking, ChatGPT, Perplexity, Gemini, Claude"; "Quarterly
  deep-dive audits reset priorities"; "Dedicated Slack channel".
- Mod Op GEO `https://geo.modop.ai` (2026-08-22, HTTP 200): free AI Search
  Visibility Audit. "The GEO 50" is not on this page; live copy is the 25-
  element GEO Periodic Table, "Monthly Visibility Reports" with prompt-level
  tracking, and "continuously improving." "The GEO 50" confirmed separately
  at `https://www.modop.com/geo-50-benchmark/` (HTTP 200).
- TinyStudio live, `curl -L`, all HTTP 200 on 2026-08-22: `/`, `/audit`,
  `/pricing`, `offer.md`, `llms.txt`. Verbatim phrases quoted in the
  assessment (free leak audit, five working days, six a month, $2,500 /
  three-month minimum, weekly checks, fourteen-working-day refund, human
  signature, "not continuous monitoring").

## Claims published

- `docs/continuous-monitoring-competitive-assessment-2026-08-22.md`
- `.lane/reports/docs-continuous-monitoring-competitive-assessment-2026-08-22.md`

## Repository checks

`npm run check` and `npm test` were run on the branch and pass (full suite:
check + headings + sitemap + worker + ui + contract + study + viewport +
narrow-pages + narrow). Docs-only change; no `public/` or `src/` edits.
