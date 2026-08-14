# Specimen in-content conversion CTA — re-verification (2026-08-14)

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] The /specimen proof page
contains no in-content conversion CTA — the page the homepage routes" (item
`94ec723c9e`). This receipt re-verifies the item's acceptance criteria
against the current `origin/main` head (`2088b6b`, "docs(evidence):
re-verify brief-requested clean-links survivor PR #145 on current main and
live (2026-08-14)", merged 2026-08-14) and the live deployment of that
head. It is source plus live-deployment evidence; it does not claim anything
about ranking, traffic, or search results.

## Summary

The failure mode the item describes — the /specimen proof page ending
without any in-content conversion CTA — **no longer occurs, on source and on
the live site**. The code-side fix is already merged in `origin/main`: PR
#155 (`b81281f`, "fix(public): add in-content conversion CTA to the /specimen
proof page", merged 2026-08-14) added a dark `.band` block between the report
and the footer carrying an explicit `.cta` link to `/#start` labelled
"Request the appraisal", a no-guarantees note, a >=44px tap target
(`padding:16px 24px`), and a static source guard in `scripts/check-site.mjs`
that fails CI if the band, its CTA, or its tap target regresses. The commit
superseded the conflict-locked PR #107, which had carried the same change
set since 2026-08-11 without landing. Re-measured on 2026-08-14: the live
`https://tinystudio.io/specimen` serves the band and CTA, and the full test
suite passes on the current head.

## Source checks on the current head (origin/main `2088b6b`)

1. `public/specimen.html` carries the in-content conversion band immediately
   before the footer (lines 134-139):

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
   `<a class="xi19" href="/specimen">Read the specimen &rarr;</a>`.
3. `public/specimen.css` styles the band CTA and keeps the >=44px hit area:
   `.band .cta` is present with `padding:16px 24px`.
4. `scripts/check-site.mjs` (the "Specimen in-content conversion CTA" block,
   lines 1785-1812) statically guards the shape: it requires a `.band` block
   between the report and the footer, a `.cta` link to `/#start` labelled
   "Request the appraisal", the no-guarantees note, `.band .cta` styling,
   and the 16px/24px padding. CI fails if any piece regresses.
5. `npm run check` passes (exit 0, "TinyStudio.io checks passed.").
6. `npm test` passes (exit 0) on the current head: `check-site` plus the
   heading-hierarchy (6/6), sitemap (7/7), agent-worker (76/76),
   agent-UI (8/8), product-contract (16/16), viewport (4/4), and
   narrow-viewport suites — all green, zero failures. (The only reported
   item is a pre-existing, out-of-scope note that `/` overflows at 240px
   and 260px; it does not gate the exit code and does not touch the
   specimen CTA.)
7. `git merge-base --is-ancestor b81281f origin/main` → true: PR #155's fix
   commit is on current main.

## Live checks (2026-08-14)

- `GET https://tinystudio.io/specimen` → HTTP 200; the served HTML carries
  the `.band` block with `<a class="cta" href="/#start">Request the
  appraisal</a>` and the no-guarantees note verbatim (two "Request the
  appraisal" occurrences: the nav CTA and the in-content band CTA).
- `GET https://tinystudio.io/specimen.html` → HTTP 307 → `/specimen` (the
  extensionless twin is canonical).
- The served `/specimen` body is byte-identical to the committed
  `public/specimen.html` (compared normalized by stripping the
  `data-fonts-css` preload attribute, which the worker injects at serve
  time), so the live page is exactly the file the source guard checks.
- `release-state-tinystudio-io.json` (the fleet's deployment pin) records
  the live Cloudflare Worker release at sha `5c6521a` (2026-08-14); `git
  merge-base --is-ancestor b81281f 5c6521a` → true, so PR #155's fix commit
  is inside the deployed release.

## Repro steps

1. Source guard: `npm run check` — the "Specimen in-content conversion CTA"
   section fails if the `.band` block, its `.cta` link to `/#start`, the
   no-guarantees note, `.band .cta` styling, or the 16px/24px padding
   regress.
2. `npm test` — the full suite (headings, sitemap, worker, UI, contract,
   viewport, narrow-viewport) passes on the current head.
3. `curl -s https://tinystudio.io/specimen` → HTTP 200; grep for
   `class="cta"` `href="/#start"` → present in the band before the footer.
4. `git merge-base --is-ancestor b81281f origin/main` and `... 5c6521a` →
   both true.

## Limitation

This is a source plus live-deployment measurement, not a behavioral
conversion test. The static guard in `scripts/check-site.mjs` is what
prevents the band CTA from silently regressing; the live re-check above is
the standing way to re-confirm the deployed state.

## Closeout

The review item "[unreviewed-by-opus] The /specimen proof page contains no
in-content conversion CTA — the page the homepage routes" is **closed
against current main and live**: PR #155 (`b81281f`) is merged in
`origin/main` `2088b6b` and inside the deployed release `5c6521a`; the
specimen page carries an in-content `.band` conversion CTA to `/#start`
with the >=44px tap target; the homepage routes its "Read the specimen"
call-out to `/specimen`; the live site serves the band CTA; and `npm run
check` plus `npm test` pass on the current head. The receipt now records
the closeout on the current head so the item cannot be re-opened by tracker
drift.
