# Lane 1 — agents desk in-content request CTA — re-verification (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `fix/agents-desk-cta-rereverify-lane1-2026-08-21`
Item: `176d096557` — "[unreviewed-by-opus] The /agents desk page has no
in-content request CTA — its closing urgency band and the whole page
convert only through the top nav"

## Outcome

**Closed. The /agents desk page already carries an in-content conversion
CTA on `origin/main` and on the live site — the fix landed in PR #162
(`5de5187`, merged 2026-08-13), adding the "Request the appraisal" pill
into the closing urgency `.band` of `public/agents.html`. No code change
was needed; this lane re-verified the fix against the current head
(`92d55c3`) and the live deployment of that head, and recorded the
closeout evidence.**

## Verification performed

1. **Fix commit on current main** — `git merge-base --is-ancestor 5de5187
   HEAD` → true; `origin/main` head is `92d55c3` (2026-08-20). The fix is
   in the lineage.
2. **Source: the band CTA exists** — `public/agents.html` lines 151-156
   carry the `.band` block with `<a class="cta" href="/#start">Request the
   appraisal</a>` and the no-guarantees note between the roster content
   and the footer; `public/agents.css` `.band .cta` keeps the >=44px pill
   (`padding:16px 24px`).
3. **Source: CI guard exists** — `scripts/check-site.mjs` lines 390-410
   ("Desk page in-content request CTA") fail the build if the band, its
   CTA to `/#start`, `.band .cta` styling, or the >=44px tap target
   regress.
4. **Site-wide checker** — `node scripts/check-site.mjs` → exit 0;
   "TinyStudio.io checks passed."
5. **Adjacent test suites** — `test-heading-hierarchy.mjs` 6/6,
   `test-sitemap.mjs` 7/7, `test-product-contract.mjs` 8/8, all green on
   the current head.
6. **Live site** — `GET https://tinystudio.io/agents` → HTTP 200; the
   served HTML carries the band CTA (two "Request the appraisal"
   occurrences — nav and in-content band). `GET
   https://tinystudio.io/agents.html` → HTTP 307 → `/agents`. The served
   body is byte-identical to the committed `public/agents.html`
   (9570 bytes; the worker does not rewrite this page, so no preload-tag
   normalisation is required).

## Files changed

- `docs/evidence/agents-desk-cta-rereverify-2026-08-21.md` — new
  evidence receipt recording the closeout on the current head and live
  site (the lane's claimed file).
- `.lane/reports/fix-agents-desk-cta-rereverify-lane1-2026-08-21.md` —
  this report.

## Verification commands

- `git merge-base --is-ancestor 5de5187f23ee89237ac086a183ff108dc8fb20f5
  HEAD` → true.
- `node scripts/check-site.mjs` → "TinyStudio.io checks passed." (exit 0).
- `node --test scripts/test-heading-hierarchy.mjs` → 6/6 pass.
- `node --test scripts/test-sitemap.mjs` → 7/7 pass.
- `node --test scripts/test-product-contract.mjs` → 8/8 pass.
- `curl -s -w "%{http_code}" https://tinystudio.io/agents` → 200; body
  carries the `.band` CTA to `/#start`; body byte-identical to source.
- `curl -s -w "%{http_code}" https://tinystudio.io/agents.html` → 307 →
  `/agents`.

## PR

- Will be opened against `nish3451/TinyStudio.io` as
  `fix/agents-desk-cta-rereverify-lane1-2026-08-21` — docs-only, no
  behavioural change in the public surface.

## Honest boundary

This lane claims no behavioural change in the public surface — the fix
already shipped in PR #162. This lane makes no claim about pricing/legal
prose (owned by other lanes), the README/MEMORY/specs product-contract
wording, or any other review item.
