# Specimen in-content conversion CTA — re-verification (2026-08-20, lane 1)

Date: 2026-08-20
Scope: the review item "[unreviewed-by-opus] The /specimen proof page
contains no in-content conversion CTA — the page the homepage routes" (item
`94ec723c9e`, lane 1). This receipt re-verifies the item's acceptance
criteria against the current `origin/main` head (`92d55c3`, "fix(check):
guard the apple touch icon on every served page, and re-verify finding
98a7bf8e08fc (2026-08-20) (#256)", merged 2026-08-20) and the live
deployment. It is source-plus-live verification evidence; it does not claim
anything about ranking, traffic, or search results.

Prior receipts for the same item: `docs/evidence/specimen-in-content-cta-rereverify-2026-08-14.md`
(PR #195) and `docs/evidence/specimen-cta-prs-107-155-closeout-2026-08-14.md`.
This receipt is a fresh re-verification on the current head so the item
cannot be re-opened by tracker drift.

## Summary

The failure mode the item describes — the /specimen proof page ending
without an in-content conversion CTA — **does not occur on the current
`origin/main` head, nor on the live site**. The code-side fix has been on
main since 2026-08-13: PR #155 (`b81281f`, "fix(public): add in-content
conversion CTA to the /specimen proof page (#155)", merged 2026-08-13)
added a dark `.band` block between the report and the footer carrying an
explicit `.cta` link to `/#start` labelled "Request the appraisal", a
no-guarantees note, a >=44px tap target (`padding:16px 24px`), and a static
source guard in `scripts/check-site.mjs` that fails CI if any piece
regresses. All of it is intact on the current head (`92d55c3`).

## Source checks on the current head (origin/main `92d55c3`)

1. `public/specimen.html` (lines 134-139) carries the in-content conversion
   band immediately before the footer:

   ```html
   <div class="band">
     <h2>That was a real one. Yours is read the same way.</h2>
     <p>Four passes, by hand, and a plain document with each fault named in
     order of what it costs you — the fix beside it. Thirty seconds to ask,
     findings inside five working days, yours to keep either way.</p>
     <a class="cta" href="/#start">Request the appraisal</a>
     <div class="note">No revenue, ranking, ROAS, conversion, booked-call or
     sales-volume guarantees. Only the work.</div>
   </div>
   ```

   The CTA targets `/#start`, the same request surface as the nav CTA, so a
   reader who finishes the sample has an in-content next step.
2. The homepage routes its "Read the specimen" call-out to exactly this
   page: `public/index.html` line 250 ends the confidentiality section with
   `<a href="/specimen">Read the specimen &rarr;</a>`.
3. `public/specimen.css` styles the band CTA and keeps the >=44px hit area:
   `.band .cta` is present with `padding:16px 24px`.
4. `scripts/check-site.mjs` (the "Specimen in-content conversion CTA" block,
   lines 2020-2047) statically guards the shape: it requires a `.band` block
   between the report and the footer, a `.cta` link to `/#start` labelled
   "Request the appraisal", the no-guarantees note, `.band .cta` styling,
   and the 16px/24px padding. CI fails if any piece regresses.
5. `npm run check` passes on the current head (exit 0, "TinyStudio.io
   checks passed.").
6. `git merge-base --is-ancestor b81281f origin/main` → true: PR #155's fix
   commit is on the current head.

## Live checks (2026-08-20)

- `GET https://tinystudio.io/specimen` → HTTP 200; the served HTML carries
  the `.band` block with `<a class="cta" href="/#start">Request the
  appraisal</a>` and the no-guarantees note ("Request the appraisal"
  appears twice: the nav CTA and the in-content band CTA).

## Repro steps

1. Source guard: `npm run check` — the "Specimen in-content conversion CTA"
   section fails if the `.band` block, its `.cta` link to `/#start`, the
   no-guarantees note, `.band .cta` styling, or the 16px/24px padding
   regress.
2. `curl -s https://tinystudio.io/specimen` → HTTP 200; grep for
   `class="band"` and `class="cta" href="/#start"` → both present before the
   footer.
3. `git merge-base --is-ancestor b81281f origin/main` → true.

## Limitation

This is a source-plus-live verification, not a behavioral conversion test.
The static guard in `scripts/check-site.mjs` is what prevents the band CTA
from silently regressing; the live re-check above is the standing way to
re-confirm the deployed state.

## Closeout

The review item "[unreviewed-by-opus] The /specimen proof page contains no
in-content conversion CTA — the page the homepage routes" is **closed
against current main and live**: PR #155 (`b81281f`) is merged in
`origin/main` `92d55c3`; the specimen page carries an in-content `.band`
conversion CTA to `/#start` with the >=44px tap target; the homepage routes
its "Read the specimen" call-out to `/specimen`; the live site serves the
band CTA; and `npm run check` passes on the current head. No code change was
needed in this lane — the item was already resolved and this receipt records
the closeout on the current head so the item cannot be re-opened by tracker
drift.