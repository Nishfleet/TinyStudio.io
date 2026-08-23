# Lane report — TinyAudits manual profile handoff

- **Item ID:** `7a1b5ce7ff`
- **Title:** TinyAudits directory — curated 100+ audit tools/services directory TinyStudio is absent from
- **Date:** 2026-08-23
- **Branch:** `docs-tinyaudits-manual-profile-2026-08-23`

## Live verification log

| URL | HTTP | Date | Decisive quote |
| --- | --- | --- | --- |
| `https://tinyaudits.com/` | 200 | 2026-08-23 | "Browse a curated directory of specialized audit services and tools"; "Curated Audits Only — We manually vet every tool and service provider listing"; "Audits by Real Humans — No generic, automated AI generator printouts" |
| `https://tinyaudits.com/audits/new` | 200 | 2026-08-23 | Five Submission Criteria including "1:1 Consultation Availability"; "$29 one-time fee"; "Manual review completed within 48 hours."; fields `Audit URL`, `Your Email Address`, button `Confirm Submission` |
| `https://tinyaudits.com/submit` | 200 | 2026-08-23 | "List Your Audit Free →"; "100% Free Listing Status Open"; `href="/users/sign_up"` |
| `https://tinyaudits.com/about` | 200 | 2026-08-23 | "For Industry Experts ... List specialized diagnostic profiles" |
| `https://index.dodopayments.com/tinyaudits` | 200 | 2026-08-23 | Dodo Index profile *about* TinyAudits; outbound `[Visit TinyAudits](https://tinyaudits.com?utm_source=index.dodopayments.com)` — corroboration only, not submission venue |
| `https://tinyaudits.com/audits` | 200 | 2026-08-23 | No `TinyStudio` / `tinystudio` in page body |
| `https://tinyaudits.com/sitemap.xml` | 301 (redirect loop) | 2026-08-23 | curl max redirects exceeded; no sitemap grep possible |
| `https://tinystudio.io/llms.txt` | 200 | 2026-08-23 | Byte-identical to `public/llms.txt` |
| `https://tinystudio.io/offer.md` | 200 | 2026-08-23 | Byte-identical to `public/offer.md` |
| `https://tinystudio.io/pricing` | 200 | 2026-08-23 | "the appraisal is free, the desk is $2,500 a month on a three-month minimum" |
| `https://tinystudio.io/` | 200 | 2026-08-23 | "Six a month."; "No call at any point."; `data-study="readable"` = 88 |
| `https://tinystudio.io/specimen` | 200 | 2026-08-23 | Sample report shape (clinic not a client) |

## Absence baseline

- `/audits` page: no TinyStudio/tinystudio strings.
- Category pages (landing-page, website-performance, seo, web-ui-ux): no matches.
- Sitemap: unreachable (redirect loop).
- Web search `site:tinyaudits.com TinyStudio` and `site:tinyaudits.com tinystudio.io`: no tinystudio.io listing; unrelated "studio" entities only.
- Unrelated "Tiny Studio" entities excluded per llms.txt Identity.

## Category decision

**Chosen:** `landing-page-audit` (Landing Page) — first qualifying category in spec order.

**Quoted definition** (fetched 2026-08-23 from
`https://tinyaudits.com/categories/landing-page-audit`):

> Landing page audits diagnose why your page isn't converting — whether you're
> driving traffic from ads, email, or SEO. They evaluate headline clarity,
> value proposition strength, CTA design and placement, social proof, form
> friction, page speed, and mobile experience to help you turn more clicks
> into customers.

**Justification:** The Website Appraisal is a written report on the buyer's
chosen high-ticket service homepage — each fault named in cost order with the
fix beside each. Describable as landing-page evaluation without promising
conversion lift, rankings, speed metrics, or UX-redesign deliverables. Skipped
`website-performance-audit` (speed/Core Web Vitals framing),
`seo-audit` (ranking claims), `web-ui-ux-audit` (UX-redesign framing).

## Criteria-map verdicts

| Criterion | Verdict |
| --- | --- |
| Clear & Fixed Scope | PASS |
| 1:1 Consultation Availability | CONFLICT / BLOCKER CANDIDATE |
| No Sales Call Required | PASS |
| Standalone Action Items | PASS |
| Honest Offer Pricing | PASS |

## Files created

- `docs/service/tinyaudits-manual-profile-2026-08-23.md`
- `.lane/reports/docs-tinyaudits-manual-profile-2026-08-23.md`

## Commands run

| Command | Outcome |
| --- | --- |
| Claims published to `lane-1.json` | OK |
| `git switch -C docs-tinyaudits-manual-profile-2026-08-23 origin/main` | OK |
| `npm test` | (see below) |
| `git push -u origin docs-tinyaudits-manual-profile-2026-08-23` | (see below) |
| `gh pr create` | (see below) |

## Open blockers / unknowns

1. 1:1 Consultation Availability vs "No call at any point." — unresolved until TinyAudits answers.
2. $29 `/audits/new` vs free `/users/sign_up` path — unresolved contradiction.
3. Category selection mechanics unknown (form showed only Audit URL + email).
4. Sitemap unreachable on this run.

## PR

(Updated after PR creation.)
