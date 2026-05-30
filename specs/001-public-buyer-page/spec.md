# Feature Specification: Public Buyer Page

## User Outcome

Qualified buyers can visit `tinystudio.io`, understand the exact TinyStudio sprint offer, see what is included, know the price and timeline, understand the refund/guarantee terms, and contact TinyStudio without needing a private explanation first.

## Non-Goals

- Build a SaaS app.
- Add payment collection.
- Add a lead database or CRM.
- Replace sales calls or Loom audits.
- Promise revenue, ROAS, rankings, AI visibility, or sales lift.
- Keep the old private app/API subdomains alive.

## Requirements

- Public page must name the offer clearly.
- Public page must include exact deliverables.
- Public page must include example use cases without pretending they are paid client case studies.
- Public page must include price ranges and founder proof-client pricing.
- Public page must include the 7-day timeline.
- Public page must include FAQs.
- Public page must include refund/guarantee terms.
- Public page must include a contact path using `hello@tinystudio.io`.
- Public page must disclose that outcomes are not guaranteed.
- Public page must include agent-readable `/llms.txt` and `/offer.md`.
- Cloudflare config must route `tinystudio.io`, `www.tinystudio.io`, `app.tinystudio.io`, and `api.tinystudio.io`.
- `app.tinystudio.io` must return an intentional retired notice.
- `api.tinystudio.io` must return an intentional retired JSON response.

## Acceptance Checks

- `npm test` passes.
- The page includes offer, examples, price, timeline, FAQs, refund/guarantee terms, and contact CTA.
- The copy avoids revenue, ROAS, ranking, AI visibility, conversion-lift, and sales-lift guarantees.
- Cloudflare routes include `app.tinystudio.io` and `api.tinystudio.io` so the old Website Manager app/API are no longer exposed there.
- Desktop and mobile browser checks render without obvious overlap or blank visual sections.

## Data Touched

- Public website copy only.
- No customer, prospect, analytics, payment, or private app data.

## Launch Risk

The main risk is overclaiming before market proof exists. The control is explicit founder-proof positioning, exact scope, and outcome disclaimers.
