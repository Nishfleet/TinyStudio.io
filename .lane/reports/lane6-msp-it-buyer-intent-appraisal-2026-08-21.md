# Lane 6 — MSP/IT buyer-intent page (item 3c3234f91f)

## Item

Build an MSP/IT-specific buyer-intent page that funnels to the Website
Appraisal research desk.

## What shipped

New `/msp` surface (public/msp.html + msp.css + msp.js):

- Buyer-intent hero aimed at MSP, managed IT and cybersecurity firms
  ("For the owner, founder or marketer of an MSP, managed IT or
  cybersecurity firm").
- Funnels into the current product intake: the same two-field
  website + email form posting to `/api/signups` (the Website Appraisal
  research desk intake), the same "six a month" cap line, and the same
  no-call promise.
- In-content sections: the four leak passes, the questions an IT buyer
  needs settled before they will talk to you, what the appraisal checks,
  what lands in your inbox, and the desk terms link (the research desk
  at $2,500/mo is linked from /pricing).
- Closing dark band with the "Request the appraisal" CTA and the
  no-guarantees note; confidentiality section identical to the other
  current pages.
- Follows the shared design system (shared.css, fonts.js preload,
  `.phead`/`.band`/`.lead two` form, reveal animation) and the site's
  claim policy: no revenue/ranking/ROAS/booking guarantees, no invented
  study numbers (the "61%" headline was replaced by an explicit
  no-invented-numbers statement), no client logos.

## Registration

- src/worker.js PUBLIC_ASSET_PATHS: /msp.html, /msp, /msp.css, /msp.js
- public/sitemap.xml: https://tinystudio.io/msp
- llms.txt / offer.md: page list + Answer Readiness preferred-source
  entry `msp-buyer-intent -> https://tinystudio.io/msp`
- README.md, MEMORY.md, specs/004-website-appraisal/plan.md: /msp
  documented as the MSP/IT buyer-intent surface
- scripts/check-site.mjs: page added to every owned-page guard
  (claim pages, fonts, icons, favicon, beacon, meta description, social
  share, structured data, internal links, canonical, title, responsive)
- scripts/test-sitemap.mjs: EXPECTED_LOCS + /msp
- scripts/test-heading-hierarchy.mjs: locked outline for msp.html
- scripts/test-narrow-viewport-pages.mjs: /msp route, owned
- scripts/check-render-blocking.mjs: msp page

## Verification

- `npm test` — all suites pass (check, headings, sitemap, worker, ui,
  contract, study, viewport, narrow-pages, narrow)
- `npm run check:render-blocking` — msp page non-blocking fonts under
  production CSP, PASS
- `npm run deploy:dry-run` — bundle OK, 33 assets read
- Narrow-viewport sweep (real Chromium, 240-390px): /msp
  scrollWidth === clientWidth at every width after the `.row .v`
  white-space fix
- Visual check at 1280x900 and 390x844: hero, form, band CTA all
  render cleanly, no overlap, no overflow

## Note on the retired MSP framing

The old "Website Correction / founder-pilot / MSP-only buyer" offer was
removed from llms.txt/offer.md earlier and a guard rejects its revival
there. This page does not revive it: it sells the current offer (The
Website Appraisal) to an MSP/IT audience and funnels into the same
`/api/signups` intake as every other current page.
