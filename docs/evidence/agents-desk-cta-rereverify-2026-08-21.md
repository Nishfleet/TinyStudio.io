# Agents desk in-content request CTA — re-verification (2026-08-21)

Date: 2026-08-21
Lane: tinystudio-io lane 1 (`fix/agents-desk-cta-rereverify-lane1-2026-08-21`)
Scope: the review-queue item `[unreviewed-by-opus] The /agents desk page has
no in-content request CTA — its closing urgency band and the whole page
convert only through the top nav` (item `176d096557`). This receipt
re-verifies the item's acceptance criteria against the current `origin/main`
head (`92d55c3`, "fix(check): guard the apple touch icon on every served
page, and re-verify finding 98a7bf8e08fc (2026-08-20) (#256)", merged
2026-08-20) and the live deployment of that head. It is source plus
live-deployment evidence; it does not claim anything about ranking,
traffic, or conversion behaviour.

## Summary

The failure mode the item describes — the /agents desk page ending at its
closing urgency band with no in-content way to act — **does not occur, on
source and on the live site**. The code-side fix is already merged in
`origin/main`: PR #162 (`5de5187`, "fix(public): add in-content request CTA
to the /agents desk page", merged 2026-08-13) added a `.cta` pill into the
closing `.band` linking to `/#start` labelled "Request the appraisal",
styled in `public/agents.css` with a >=44px tap target
(`padding:16px 24px`), and added a static source guard in
`scripts/check-site.mjs` that fails CI if the band, its CTA, or its tap
target regress. Re-measured on 2026-08-21: `5de5187` is an ancestor of the
current `origin/main` head, the live `https://tinystudio.io/agents` serves
the band CTA, and the full test suite passes on the current head.

## Source checks on the current head (origin/main `92d55c3`)

1. **The fix commit is an ancestor of HEAD.** `git merge-base --is-ancestor
   5de5187f23ee89237ac086a183ff108dc8fb20f5 HEAD` → exit 0, true. PR #162
   is in the lineage of the current branch.

2. **`public/agents.html` carries the in-content conversion CTA inside the
   closing urgency band immediately before the footer (lines 151-156):**

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
   prompt" section has an in-content next step. The nav CTA at line 72 and
   the in-content band CTA at line 154 are the only two `href="/#start"`
   anchors on the page — the band CTA is the in-content affordance the
   item asked for.

3. **`public/agents.css` styles the band CTA and keeps the >=44px hit area:**

   ```css
   /* in-content conversion CTA on the closing urgency band — pill link, >=44px hit area.
      Scoped to .band .cta so nothing else on the page is touched. Mirrors the
      /specimen and /audit closing bands. */
   .band .cta{display:inline-block;margin-top:26px;border:1px solid rgba(242,234,220,.4);border-radius:999px;
     padding:16px 24px;font-size:10px;letter-spacing:.14em;text-transform:uppercase;font-weight:600;
     color:#F2EADC;text-decoration:none;transition:border-color var(--mid) var(--ease),background var(--mid) var(--ease)}
   .band .cta:hover,.band .cta:focus-visible{border-color:var(--brass-lt);background:rgba(201,165,102,.14)}
   ```

   `padding:16px 24px` gives the pill a >=44px hit area on both axes
   (16+16+content height ≈ 50px tall, 24+24+content width well above
   44px), matching the WCAG 2.5.8 minimum tap target and the site's own
   `.navcta` standard.

4. **`scripts/check-site.mjs` (the "Desk page in-content request CTA"
   block, lines 390-410) statically guards the shape.** It requires:

   - a `.band` block between the roster content and the footer;
   - a `<a class="cta" href="/#start">Request the appraisal</a>` anchor
     inside that band;
   - `.band .cta` styling in `public/agents.css`;
   - the 16px/24px padding on the `.band .cta` rule.

   CI fails (`node scripts/check-site.mjs` exits 1) if any of those four
   pieces regress. This is a STATIC SOURCE GUARD — regex over the served
   HTML/CSS — not a behavioural test, because CI has no browser.

5. **`npm run check` (alias for `node scripts/check-site.mjs`) passes on
   the current head:** exit 0, "TinyStudio.io checks passed." The
   negative probe (replacing the band's `<a class="cta">` with a plain
   `<a>`) was run earlier and reproduced the guard's failure message
   "Desk closing urgency band must carry a .cta link to /#start labelled
   \"Request the appraisal\"." (verified by the same guard that triggered
   the original PR #162).

6. **Headings, sitemap, and product-contract tests pass on the current
   head:**
   - `node --test scripts/test-heading-hierarchy.mjs` → 6/6 pass
   - `node --test scripts/test-sitemap.mjs` → 7/7 pass
   - `node --test scripts/test-product-contract.mjs` → 8/8 pass

7. **`public/agents.js` does not need a JS change for this fix.** The
   reveal-on-scroll IntersectionObserver already targets `.band` (line 1
   of the selector list), so the in-content band CTA enters with the
   rest of the closing band without any extra wiring.

## Live site checks (HTTPS, 2026-08-21)

1. **`GET https://tinystudio.io/agents`** → HTTP 200. The served HTML
   carries:
   - the nav CTA: `<a class="navcta" href="/#start">Request the
     appraisal</a>` (line 72 of `public/agents.html`)
   - the in-content band CTA: `<a class="cta" href="/#start">Request the
     appraisal</a>` (line 154 of `public/agents.html`)

   Two `Request the appraisal` strings in the served body, one `class="cta"`
   selector — exactly matching the source. The body is byte-identical to
   the committed `public/agents.html` (9570 bytes; the worker does not
   rewrite this page, so no preload-tag normalisation is required).

2. **`GET https://tinystudio.io/agents.html`** → HTTP 307 → `/agents`.
   The redirect target serves the same body as `/agents`.

## Files this lane adds

- `docs/evidence/agents-desk-cta-rereverify-2026-08-21.md` — this
  receipt.
- `.lane/reports/fix-agents-desk-cta-rereverify-lane1-2026-08-21.md` —
  lane report and outcome.

No code, config, copy, route, or asset is changed on this branch — the
fix already shipped in PR #162 and would regress the cluster the fleet
reconciled if recreated.

## Honest boundary

This lane claims no behavioural change in the public surface — the fix
already shipped in PR #162 and is verified against the current
`origin/main` head (`92d55c3`) and the live deployment of that head.
This lane makes no claim about pricing/legal prose (owned by other
lanes), the README/MEMORY/specs product-contract wording, or any other
review item.
