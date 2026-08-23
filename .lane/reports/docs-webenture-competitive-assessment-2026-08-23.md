# Lane 1 report: tinystudio-io — WebEnture competitive assessment

Branch: `docs-webenture-competitive-assessment-2026-08-23`

Item: 43654ea7f6 — "WebEnture — 57 AI agents, goal-first audit platform with Growth Roadmap and monitoring, launc" [unreviewed-by-opus] (note truncation: stored wording ends at "launc"; live blog evidence on 2026-08-23 resolves it to launched 2026-08-01)

## What this lane did

Fetched four WebEnture URLs and five TinyStudio first-party surfaces live with `curl -L` on 2026-08-23 (all HTTP 200). Wrote an internal competitive-intelligence assessment at `docs/webenture-competitive-assessment-2026-08-23.md`. Verdict: YES-with-caveats — 57 AI agents, 17 goal-based workflows, Growth Roadmap, monitoring-as-tier-feature, Free/Pro/Agency pricing, launched 2026-08-01, and Udaan Technologies are accurate against live quotes. No public surfaces, pricing, positioning, or product structure were changed. Item was not already present on origin/main (zero `webenture` hits).

## Evidence

- `curl -sL -o /tmp/webenture-root.html -m 25 -w '%{http_code} %{url_effective}\n' https://webenture.com/` → `200 https://www.webenture.com/` — "One crawl. 57 AI agents."; "17 goal-based workflows"; Pro `$29` `/month` and Agency `$99` `/month` as split fragments; "Scheduled monitoring"; "Free to start".
- `curl -sL -o /tmp/webenture-website-audit.html -m 25 -w '%{http_code} %{url_effective}\n' https://webenture.com/website-audit` → `200 https://www.webenture.com/website-audit` — "57 specialist AI agents and goal-based workflows"; "scheduled monitoring catches SEO and speed regressions".
- `curl -sL -o /tmp/webenture-blog.html -m 25 -w '%{http_code} %{url_effective}\n' https://webenture.com/blog/webenture-is-live` → `200 https://www.webenture.com/blog/webenture-is-live` — `<time dateTime="2026-08-01">August 1, 2026</time>`; "officially live from 1 August 2026"; "Pro ($29/mo) ... monitoring. Agency ($99/mo)"; "Free accounts get 5 scans a month".
- `curl -sL -o /tmp/webenture-press.html -m 25 -w '%{http_code} %{url_effective}\n' https://webenture.com/press` → `200 https://www.webenture.com/press` — "Udaan Technologies Pvt. Ltd."; "17 goal-based workflows group related agents"; "expanded monitoring" in the Free/Pro/Agency paragraph.
- `curl -sL -o /tmp/tinystudio-root.html -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/` → `200 https://tinystudio.io/` — "The free leak audit of high-ticket service homepages"; desk "$2,500 a month, on a three-month minimum".
- `curl -sL -o /tmp/tinystudio-audit.html -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/audit` → `200 https://tinystudio.io/audit` — "Depth, not breadth. One day's record, signed by a person — not continuous monitoring."
- `curl -sL -o /tmp/tinystudio-pricing.html -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/pricing` → `200 https://tinystudio.io/pricing` — "$2,500" "Per month · Three-month minimum"; rewrite/rebuild + handoff + weekly loop; "a person signing every client-facing output".
- `curl -sL -o /tmp/tinystudio-offer.md -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/offer.md` → `200 https://tinystudio.io/offer.md` — free leak audit + human-reviewed desk; Nish signs every audit.
- `curl -sL -o /tmp/tinystudio-llms.txt -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/llms.txt` → `200 https://tinystudio.io/llms.txt` — same offer facts as `offer.md`.

## Claims published

- `docs/webenture-competitive-assessment-2026-08-23.md`
- `.lane/reports/docs-webenture-competitive-assessment-2026-08-23.md`

## Repository checks

`npm run check` and `npm run test` were run on the branch and passed (docs-only change; no `public/` or `src/` edits).

## Git / PR

- First commit: pending (filled after commit)
- PR: pending (filled after `gh pr create`)
