# Conversion tracking — do this before spending anything

Without this, £300 buys you a number you cannot interpret. An untracked campaign
and a failed campaign look identical on day 15.

---

## Blocking integration decision (read first)

The five-page site (index / audit / specimen / agents / pricing) currently lives
in a scratchpad, **not in this repo**, and is not wired to the Worker. The
recovered June work in `public/` is a different surface — the minimal-input Agent
Desk.

They are not competitors. They compose:

| Piece | Role |
|---|---|
| Five-page site | The public site. Sells the 7-Day Sprint, carries the 19-clinic study. |
| Minimal-input Agent Desk (`/api/agent-audit`) | The engine behind the free brief — the lead magnet the site asks for. |

**The Agent Desk stops being the product and becomes the mechanism.** That
matches the acked E1 direction (demote the one-shot self-serve hero) without
throwing away the June work.

Nothing below can be tested until the site is actually deployed at
`tinystudio.io`. Sequence: land the site → wire the form → then tracking.

---

## 1. The thank-you page — built

`brief-requested.html`. Three properties that matter:

- **`noindex, nofollow`** — it must never be reachable organically, or the
  conversion count inflates with people who never submitted anything.
- **Fires the conversion once, on load.** It is the only page that fires it.
- **Sells nothing.** No upsell, no calendar embed. It says what happens next and
  stops. The offer is that no call is required; the thank-you page has to honour
  that or the promise was a lie one click in.

## 2. Forms — wired

Both lead forms now `POST` to `/api/agent-audit` with a named, required `email`
field. Two paths have to land on the same page:

- **JavaScript path** — on a successful response, `window.location = "/brief-requested"`.
- **No-JS path** — the Worker's `htmlRedirect()` currently sends to `/?signal=…`.
  **Change it to `/brief-requested`**, or a browser with JS disabled converts
  silently and untracked.

Both paths, one destination. Otherwise the conversion rate is quietly wrong.

## 3. Google Ads conversion action — needs the console (you, not me)

I cannot create this without account access. Exact steps:

1. Google Ads › **Goals › Conversions › New conversion action › Website**
2. Enter `tinystudio.io`, choose **Set up manually**
3. Configure:
   - Goal: **Submit lead form**
   - Conversion name: `Brief requested`
   - Value: **Don't use a value** (a free audit has no revenue; a fake value
     corrupts every report later)
   - Count: **One** — not Every. One person requesting twice is one lead.
   - Click-through window: **30 days**
   - Attribution: **Data-driven**, or last-click if data-driven is unavailable
4. Tag setup → copy the **conversion ID** (`AW-…`) and the **conversion label**
5. Set both on the Worker so the tag is emitted at request time — no code
   change, and no placeholder can ever ship as a dead conversion:
   - `wrangler secret put GOOGLE_ADS_CONVERSION_ID` → the `AW-…` ID
   - `wrangler secret put GOOGLE_ADS_CONVERSION_LABEL` → the conversion label
   - (For `wrangler dev --remote`, put both in `.dev.vars` instead.)
   The Worker validates both (`AW-` + digits; a 10+ character alphanumeric
   label) and injects the gtag loader + conversion event into
   `/brief-requested` **only** when both are set and well-formed. With either
   missing or malformed, the page ships with no tag at all — a dead tag is
   never served. The CSP allowances for gtag are scoped to that one noindex
   page's response; every other page keeps the strict CSP.

## 4. GA4 + Ads link

Admin › Product links › Google Ads. Without it, the search-terms report and the
landing-page behaviour cannot be read against each other.

## 5. Verify — non-negotiable

1. Deploy.
2. Submit the form yourself with a real address.
3. Confirm you land on `/brief-requested`.
4. Google Ads › Conversions — the action shows **"Recording conversions"**, not
   "No recent conversions". Tag Assistant confirms the event fired.
5. Only then set the campaign live.

If step 4 does not go green, **do not launch.** Every day of spend before the tag
works is a day of data you cannot use.

---

## Checklist

- [ ] Site landed in the repo and deployed to `tinystudio.io`
- [ ] `htmlRedirect()` in `src/worker.js` points at `/brief-requested`
- [ ] JS success path redirects to `/brief-requested`
- [ ] Conversion action created — Submit lead form, no value, count One, 30 days
- [ ] `GOOGLE_ADS_CONVERSION_ID` and `GOOGLE_ADS_CONVERSION_LABEL` set on the Worker (`wrangler secret put`; `.dev.vars` for dev)
- [ ] GA4 linked to Ads
- [ ] Live test submission verified as a recorded conversion
- [ ] Negatives loaded, ads approved
- [ ] **Then** launch
