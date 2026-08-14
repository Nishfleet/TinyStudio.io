# Lane 1 — specimen in-content conversion CTA — re-verification (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `fix/specimen-in-content-cta-rereverify-2026-08-14`
Item: `94ec723c9e` — "[unreviewed-by-opus] The /specimen proof page contains
no in-content conversion CTA — the page the homepage routes"

## Outcome

**Closed. The /specimen proof page already carries an in-content conversion
CTA on `origin/main` and on the live site — the fix landed in PR #155
(`b81281f`, merged 2026-08-14), superseding the conflict-locked PR #107. No
code change was needed; this lane re-verified the fix against the current
head and the live deployment of that head, and recorded the closeout
evidence.**

## Verification performed

1. **Fix commit on current main** — `git merge-base --is-ancestor b81281f
   origin/main` → true; `origin/main` head is `2088b6b` (2026-08-14).
   PR #155's message explains it superseded the conflict-locked PR #107,
   which had carried the same change set since 2026-08-11 without landing.
2. **Fix commit in the deployed release** — the fleet deployment pin
   (`release-state-tinystudio-io.json`) records the live Worker release at
   sha `5c6521a` (2026-08-14); `git merge-base --is-ancestor b81281f
   5c6521a` → true.
3. **Source: the band CTA exists** — `public/specimen.html` lines 134-139
   carry the `.band` block with `<a class="cta" href="/#start">Request the
   appraisal</a>` and the no-guarantees note between the report and the
   footer. The homepage routes to this page: `public/index.html` line 250
   `<a class="xi19" href="/specimen">Read the specimen &rarr;</a>`.
4. **Source: CI guard exists** — `scripts/check-site.mjs` lines 1785-1812
   ("Specimen in-content conversion CTA") fail the build if the band, its
   CTA to `/#start`, the no-guarantees note, `.band .cta` styling, or the
   >=44px tap target (`padding:16px 24px`) regress.
5. **Site-wide checker** — `npm run check` → exit 0; "TinyStudio.io checks
   passed."
6. **Full test suite** — `npm test` → exit 0: headings 6/6, sitemap 7/7,
   agent-worker 76/76, agent-UI 8/8, product-contract 16/16, viewport 4/4,
   narrow-viewport 4/4 owned routes (the only reported item is the
   pre-existing, out-of-scope `/` overflow at 240px/260px, which does not
   gate the exit code).
7. **Live site** — `GET https://tinystudio.io/specimen` → HTTP 200; the
   served HTML carries the band CTA (two "Request the appraisal"
   occurrences — nav and in-content band). `GET
   https://tinystudio.io/specimen.html` → HTTP 307 → `/specimen`. The served
   body is byte-identical to committed `public/specimen.html` (normalized
   by stripping the `data-fonts-css` preload attribute the worker injects).

## Files changed

- `docs/evidence/specimen-in-content-cta-rereverify-2026-08-14.md` — new
  evidence receipt recording the closeout on the current head and live site
  (the lane's claimed file).
- `.lane/reports/specimen-in-content-cta-rereverify-2026-08-14.md` — this
  report.

## Verification commands

- `git merge-base --is-ancestor b81281f origin/main` → true.
- `git merge-base --is-ancestor b81281f 5c6521a` → true (deployed release
  is past the fix).
- `npm run check` → "TinyStudio.io checks passed." (exit 0).
- `npm test` → exit 0; all suites green.
- `curl -s -w "%{http_code}" https://tinystudio.io/specimen` → 200; body
  carries the `.band` CTA to `/#start` and the no-guarantees note; body
  byte-identical to source (normalized).
- `curl -s -w "%{http_code}" https://tinystudio.io/specimen.html` → 307 →
  `/specimen`.

## PR

- https://github.com/nish3451/TinyStudio.io/pull/195

## Honest boundary

This lane claims no behavioural change in the public surface — the fix
already shipped in PR #155. This lane makes no claim about pricing/legal
prose (owned by other lanes), the README/MEMORY/specs product-contract
wording, or any other review item.
