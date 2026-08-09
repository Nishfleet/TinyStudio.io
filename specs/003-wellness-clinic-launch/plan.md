# 003 - Premium Wellness Clinic Launch

Status: approved by Nish 2026-08-05. Builds on the recovered minimal-input
Agent Desk (`specs/002-minimal-input-agent-desk/`).

Status: superseded by the current offer, the Website Appraisal
(`specs/004-website-appraisal/plan.md`). Historical record: the Growth Desk
retainer offer below is not the current offer. The money, pricing, and
guarantee body that follows is preserved verbatim.

## Goal

Land 3 retainer clients at $2,500/month, 3-month minimum, from premium wellness
clinics. Prove the funnel with a $300 Google Search test before any scale-up.

## Why this shape

Ad spend is funded on a credit card with a ~55-day float, so cash must arrive
before the bill. One retained client at $2,500/month covers a month of ads at
the eventual $100/day. The sprint alone never could: at a $1,000 one-off price
the cost per customer on paid traffic ($570-$2,100) straddles the price.

## The offer

- **Buyer:** premium wellness clinics with a live site and treatments priced
  $1,000+. Longevity, functional medicine, hormone/HRT, IV therapy, recovery.
- **Product:** Growth Desk retainer, **$2,500/month, 3-month minimum**
  ($7,500 committed).
- **Month 1** is the leak-fix sprint. **Months 2-3** are the weekly loop.
- **Guarantee:** if the named month-1 deliverables are not delivered by day 14,
  full refund. This is a *delivery* guarantee, never a satisfaction guarantee -
  a satisfaction clause on cold ad traffic means doing the sprint for free.
- **Promise boundary (unchanged):** no revenue, ranking, ROAS, conversion,
  booked-call or sales-volume guarantees.

## The funnel

```
Google Search ad
  -> landing page (wellness-clinic specific)
    -> free Pipeline Brief: email + one snapshot box
      -> brief delivered
        -> CTA: book a call
          -> $2,500/mo retainer, 3-month minimum
```

The free brief is not a nicety. It is the only conversion event cheap enough to
ever make paid traffic work at this price point.

## Page work (on `codex/pipeline-loop-agent-desk`)

1. Rewrite the hero for wellness clinics by name. Generic wording fails the
   repo's own specificity gate.
2. Change the ending: after the brief, present the retainer.
3. Add the delivery guarantee line.
4. Leave the proof section **empty** until a real case study exists. No
   invented logos, numbers, or testimonials.

## Google campaign

One campaign, one ad group, exact + phrase match only. **One metro**, not
national - $20/day cannot cover a country.

Keywords (high intent, low volume, affordable):

- wellness clinic website not converting
- med spa website leads
- clinic marketing agency
- wellness clinic seo
- longevity clinic marketing
- functional medicine marketing agency
- hormone clinic marketing
- iv therapy clinic marketing

Negatives: jobs, salary, course, template, free, wordpress theme, how to start,
intern, internship.

Bidding: manual CPC, cap ~$6. No smart bidding - there is nowhere near enough
conversion data for it to learn.

## The 15 days ($20/day = $300)

| Day | Action |
|---|---|
| 0 | Page live, brief flow verified end to end, conversion tracking firing |
| 1-3 | Launch. Read the search-terms report daily, add negatives |
| 4 | First real prune of wasted terms |
| 5-10 | Hold. Do not touch bids - churn resets what little learning exists |
| 11 | Second prune |
| 15 | Decide against the rules below |

## Decision rules (fixed before spending)

- **Scale** - 4+ briefs, under $50 each, 1+ call booked
- **Fix the page** - 15+ clicks but under 2 briefs (traffic fine, page isn't)
- **Change the offer** - under 15 clicks total (nobody wants this framing)
- **Stop** - 4+ briefs and zero calls (they want free, not the product)

## Explicitly not doing

- **No Meta.** Leaving its learning phase needs ~50 conversions/week. On the
  $2,500 sale that is ~$450/day; on the free brief ~$143/day. Both exceed the
  $100/day ceiling. Revisit only if briefs come in under $20 each at full spend.
- **No Reddit ads** - wrong intent for a $2,500/month B2B sale.
- **No multi-service bundle** (SEO + ads + leads). One outcome, one page.
- **No "AI agents" in the pitch.** Automation is how the margin works, never
  what is sold - selling agents invites the exact comparison we lose.
- **No proof claims** until a paying client exists.

## Open risk

Three case studies in one vertical is the entire asset - the 30-50% specialist
premium is paid for documented vertical results, and we have none yet. Do not
split across verticals to chase the first sale.
