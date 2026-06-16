# Project Memory

## Current Shape

- This repo is the new deployable public website source for `tinystudio.io`.
- The Growth Brain operating repo remains at `/Users/nish/Documents/TINY STUDIO` and is the source of offer/delivery truth.
- This repo should stay public-surface only: no client data, secrets, private prospect notes, or internal delivery folders.
- As of the lockdown pass, `tinystudio.io` is a cryptic coming-soon page with email capture only. Do not re-expose old sprint pages, pricing, or offer details unless Nish explicitly asks to reopen the site.

## Product Truth

- Public product truth during lockdown: TinyStudio.io is not publishing public sprint offers, pricing, claims, public case studies, or product access.
- Email capture is the only public conversion path. Emails are stored in the `tinystudio_email_signups` D1 database through `/api/signups`.
- Previous offer logic is private/backlog context while the site is locked.
- Public copy must not promise revenue, ROAS, SEO ranking, AI visibility, conversion lift, booked calls, sales lift, autonomous ad buying, or unapproved ad spend changes.

## Private Backlog Context

- Previous offer work is private backlog context while the site is locked.
- Do not publish offer details, pricing, test-plan mechanics, ad-platform language, or old product claims on TinyStudio.io until Nish explicitly reopens the public site.

## Deployment Boundary

- The intended Cloudflare Worker route patterns now own the whole TinyStudio.io domain family:
  - `tinystudio.io`
  - `www.tinystudio.io`
  - `app.tinystudio.io`
  - `api.tinystudio.io`
- `app.tinystudio.io` should return an intentional retired notice.
- `api.tinystudio.io` should return an intentional retired JSON response.

## Verification

- Run `npm test` before any deploy.
- For visual changes, run the local server and inspect desktop and mobile browser views.
- During lockdown, verify old deep links such as `/pipeline-sprint/` render the same coming-soon page.
