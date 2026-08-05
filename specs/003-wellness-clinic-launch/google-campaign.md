# Google Search campaign — the $300 test

Approved 2026-08-05. Google Search only. Meta excluded (needs ~$143–450/day to
leave the learning phase; both are above the ceiling).

**Budget:** $20/day × 15 days = $300. One metro. Manual CPC.
**Objective of this spend:** find out whether the landing page converts. Not to
find clients. Three briefs and a clear cost-per-brief is a successful test even
if nobody buys.

---

## Blocking decision before launch: currency and metro

Every piece of evidence we have is **London** — the seven clinics researched,
the specimen audit, the £72–£795 fee benchmarks. The site prices in **$2,500**.

A London clinic owner reading a dollar price assumes an overseas supplier and
prices in a timezone problem they do not want. **Recommendation: run London and
price in sterling — £1,950/month, three-month minimum.** That is close to the
dollar figure, sits naturally against the £795 top-line consultation fees these
clinics already charge, and removes the friction.

If the answer is instead "target US clinics," the research restarts — the seven-
clinic study, the specimen, and the fee benchmarks are all London and would not
survive the move. Do not run US traffic against London evidence.

Everything below assumes **London + £**. Swap both together if that changes.

---

## Structure

One campaign. Two ad groups. Nothing else — at four clicks a day, more structure
just starves each bucket.

```
Campaign: TS · London · Search · Leak Audit
  Networks:      Search only. Display OFF. Search partners OFF.
  Location:      Greater London. Target "presence" — NOT "presence or interest".
  Language:      English
  Bidding:       Manual CPC, £6.00 cap. No smart bidding — it needs ~30
                 conversions/month to learn and we will have single digits.
  Schedule:      Mon–Fri 08:00–19:00. Clinic owners do admin on weekdays;
                 weekend spend at this budget is waste.
  Daily budget:  £16 (≈$20)
```

### Ad group 1 — "Agency intent"

They know they want an outside firm. Highest intent, highest CPC.

| Keyword | Match |
|---|---|
| `[clinic marketing agency]` | exact |
| `[medical marketing agency london]` | exact |
| `[aesthetic clinic marketing agency]` | exact |
| `[private healthcare marketing agency]` | exact |
| `"clinic marketing agency london"` | phrase |
| `"med spa marketing agency"` | phrase |

### Ad group 2 — "Website problem intent"

They know the site is the problem and have not decided who fixes it.

| Keyword | Match |
|---|---|
| `[clinic website design agency]` | exact |
| `[medical website design london]` | exact |
| `"private clinic website design"` | phrase |
| `"clinic website not converting"` | phrase |
| `"healthcare landing page agency"` | phrase |
| `"website audit for clinics"` | phrase |

**Deliberately excluded:** broad match anywhere. At £16/day broad match will eat
the budget on adjacent nonsense before we learn anything.

---

## Negative keyword list (apply at campaign level, day 0)

```
jobs, job, salary, vacancy, hiring, career, careers, intern, internship,
course, courses, training, certification, diploma, degree, learn, tutorial,
how to, diy, template, templates, theme, themes, wordpress, wix, squarespace,
free, cheap, plugin, software, tool, tools, platform, crm,
examples, portfolio, best, top 10, list of, reviews of,
salary, freelance, freelancer, upwork, fiverr,
nhs, charity, veterinary, dental lab
```

`free` is a negative even though our own offer is free — searchers using it want
free *software*, not a free audit from an agency.

---

## Ads

Two responsive search ads per ad group. Every line below respects the promise
boundary: no revenue, ranking, ROAS, conversion, booked-call or sales-volume
claims.

**Headlines (mix and pin nothing except H1 in slot 1):**

- The 7-Day Clinic Site Sprint
- Free Leak Audit For Your Clinic
- We Find Where Your Site Leaks
- Named Leaks, With The Fix Beside
- Six Audits A Month, By Hand
- One Page. Seven Working Days.
- Complimentary And Yours To Keep
- London Wellness Clinics

**Descriptions:**

- We read the one page your bookings depend on the way a stranger reads it, then show you the exact points at which they leave. Free, and yours to keep.
- A short plain document — named leaks in priority order, each with its fix. No deck, no dashboard, no call required to receive it.

**Landing page:** `/` (the home page, form above the fold). Not a deep link —
the home page carries the 5-of-7 finding, which is the strongest thing we have.

---

## Tracking — do this before spending a penny

Without this the whole £300 tells you nothing.

1. **Thank-you page.** Form posts to the Worker, then redirects to
   `/brief-requested`. A conversion needs a URL to fire on.
2. **Google Ads conversion action** — "Brief requested", category *Submit lead
   form*, count **one** (not every), 30-day window. Fires on `/brief-requested`.
3. **GA4 + Ads link**, so search-term and landing-page reports line up.
4. **Verify with a live test submission before launch.** Submit the form
   yourself, confirm the conversion registers in Google Ads. An untracked
   campaign is indistinguishable from a failed one.
5. **UTMs** on the final URL so the brief request itself records the term that
   produced it.

---

## The 15 days

| Day | Action |
|---|---|
| 0 | Tracking verified with a live test submission. Negatives loaded. Ads approved. |
| 1 | Launch. Do not touch anything else today. |
| 2–3 | Read the **search terms report** daily. Add negatives. Change nothing else. |
| 4 | First real prune. Pause any keyword with 10+ clicks and no brief. |
| 5–10 | Hold. Do not adjust bids — churn resets what little signal exists. |
| 11 | Second prune. If one ad group is clearly dead, pause it and let the other have the budget. |
| 15 | Decide, against the rules below. |

**Only the search-terms report gets touched in the first ten days.** Everything
else is noise at this volume.

---

## Decision rules — fixed before spending

- **Scale** — 4+ briefs, under £40 each, 1+ call booked
- **Fix the page** — 15+ clicks but under 2 briefs (traffic fine, page isn't)
- **Change the offer** — under 15 clicks total (nobody wants this framing)
- **Stop** — 4+ briefs and zero calls (they want free, not the product)

Write these somewhere you cannot edit on day 15.

---

## What this test cannot tell you

- Whether the **service** is good. It measures a page, not a business.
- Whether **Meta** would work. Different channel, different economics.
- Whether **£1,950** is the right price. It tests interest in a free audit.

One retained client covers roughly a month of ads at full spend. That is the
only number that matters after day 15.
