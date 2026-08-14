# Agents desk in-content request CTA — re-verification (2026-08-14)

Date: 2026-08-14
Scope: the review-queue item "[unreviewed-by-opus] The /agents desk page has
no in-content request CTA — its closing urgency band and the whole page
offered no conversion afford beyond the nav CTA" (item `176d096557`). This
receipt re-verifies the item's acceptance criteria against the current
`origin/main` head (`548fc9c`, "docs(evidence): close the stray root-level
data.json item as already resolved (#160) (#200)", merged 2026-08-14) and
the live deployment of that head. It is source plus live-deployment
evidence; it does not claim anything about ranking, traffic, or conversion
behavior.

## Summary

The failure mode the item describes — the /agents desk page ending at its
closing urgency band with no in-content way to act — **no longer occurs, on
source and on the live site**. The code-side fix is already merged in
`origin/main`: PR #162 (`5de5187`, "fix(public): add in-content request CTA
to the /agents desk page", merged 2026-08-13) added a `.cta` pill into the
closing `.band` linking to `/#start` labelled "Request the appraisal",
styled in `public/agents.css` with a >=44px tap target
(`padding:16px 24px`), and added a static source guard in
`scripts/check-site.mjs` that fails CI if the band, its CTA, or its tap
target regress. Re-measured on 2026-08-14: the live
`https://tinystudio.io/agents` serves the band CTA, and the full test suite
passes on the current head.

## Source checks on the current head (origin/main `548fc9c`)

1. `public/agents.html` carries the in-content conversion CTA inside the
   closing urgency band immediately before the footer (lines 151-156):

   ```html
   <div class="band">
     <h2>Every week the page undersells you is a week of traffic you already paid for, walking out.</h2>
     <p>That is the only urgency we will ever sell you. Not a countdown, not a discount that expires — just the plain arithmetic that the visitors arriving today are leaving through the same gap they left through last month.</p>
     <a class="cta" href="/#start">Request the appraisal</a>
     <div class="note">We make no claim about how much that costs you. We will show you where it happens; what it is worth is yours to judge.</div>
   </div>
   ```

   The CTA targets `/#start`, the same request surface as the nav CTA (the
   desk page carries no form of its own), so a reader who finishes the
   roster, the gate list and the "why this isn't something you can just
   prompt" section has an in-content next step.
2. `public/agents.css` styles the band CTA and keeps the >=44px hit area:
   `.band .cta` is present with `padding:16px 24px`, `border-radius:999px`,
   uppercase pill styling, and the same light-on-dark treatment as the
   /specimen and /audit closing bands.
3. `scripts/check-site.mjs` (the "Desk page in-content request CTA" block,
   lines 340-360) statically guards the shape: it requires a `.band` block
   between the roster content and the footer, a `.cta` link to `/#start`
   labelled "Request the appraisal", `.band .cta` styling in agents.css,
   and the 16px/24px padding. CI fails if any piece regresses.
4. `npm run check` passes (exit 0, "TinyStudio.io checks passed.").
5. `npm test` passes (exit 0) on the current head: check-site, heading
   hierarchy (6/6), sitemap (7/7), agent-worker (76/76), agent-UI (8/8),
   product-contract (16/16), viewport (4/4), and narrow-viewport suites —
   all green, zero failures, `/agents` PASS at every tested width 240-390px.
   (The only reported item is a pre-existing, out-of-scope note that `/`
   overflows at 240px and 260px; it does not gate the exit code and does
   not touch the agents desk CTA.)
6. `git merge-base --is-ancestor 5de5187 origin/main` → true: PR #162's fix
   commit is on current main.

## Live checks (2026-08-14)

- `GET https://tinystudio.io/agents` → HTTP 200; the served HTML carries
  the `.band` block with `<a class="cta" href="/#start">Request the
  appraisal</a>` verbatim (two "Request the appraisal" occurrences: the
  nav CTA and the in-content band CTA).
- `GET https://tinystudio.io/agents.html` → HTTP 307 → `/agents` (the
  extensionless twin is canonical).
- The served `/agents` body is byte-identical to the committed
  `public/agents.html` (compared normalized by stripping the
  `data-fonts-css` preload attribute, which the worker injects at serve
  time), so the live page is exactly the file the source guard checks.
- `release-state-tinystudio-io.json` (the fleet's deployment pin) records
  the live Cloudflare Worker release at sha `895ad9c` (2026-08-14); `git
  merge-base --is-ancestor 5de5187 895ad9c` → true, so PR #162's fix
  commit is inside the deployed release.

## Repro steps

1. Source guard: `npm run check` — the "Desk page in-content request CTA"
   section fails if the `.band` block, its `.cta` link to `/#start`, the
   `.band .cta` styling, or the 16px/24px padding regress.
2. `npm test` — the full suite (headings, sitemap, worker, UI, contract,
   viewport, narrow-viewport) passes on the current head.
3. `curl -s https://tinystudio.io/agents` → HTTP 200; grep for
   `class="cta"` `href="/#start"` → present in the band before the footer.
4. `git merge-base --is-ancestor 5de5187 origin/main` and `... 895ad9c` →
   both true.

## Limitation

This is a source plus live-deployment measurement, not a behavioral
conversion test. The static guard in `scripts/check-site.mjs` is what
prevents the band CTA from silently regressing; the live re-check above is
the standing way to re-confirm the deployed state.

## Closeout

The review item "[unreviewed-by-opus] The /agents desk page has no
in-content request CTA" is **closed against current main and live**: PR
#162 (`5de5187`) is merged in `origin/main` `548fc9c` and inside the
deployed release `895ad9c`; the /agents closing urgency band carries an
in-content `.cta` to `/#start` labelled "Request the appraisal" with the
>=44px tap target; the live site serves the band CTA; and `npm run check`
plus `npm test` pass on the current head. The receipt now records the
closeout on the current head so the item cannot be re-opened by tracker
drift.
