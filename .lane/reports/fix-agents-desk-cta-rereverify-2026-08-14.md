# Lane 1 — agents desk in-content request CTA — re-verification (2026-08-14)

Lane: tinystudio-io lane 1
Branch: `fix/agents-desk-cta-rereverify-2026-08-14`
Item: `176d096557` — "[unreviewed-by-opus] The /agents desk page has no
in-content request CTA — its closing urgency band and the whole"

## Outcome

**Closed. The /agents desk page already carries an in-content conversion
CTA on `origin/main` and on the live site — the fix landed in PR #162
(`5de5187`, merged 2026-08-13), adding the "Request the appraisal" pill
into the closing urgency `.band` of `public/agents.html`. No code change
was needed; this lane re-verified the fix against the current head and the
live deployment of that head, and recorded the closeout evidence.**

## Verification performed

1. **Fix commit on current main** — `git merge-base --is-ancestor 5de5187
   origin/main` → true; `origin/main` head is `548fc9c` (2026-08-14).
2. **Fix commit in the deployed release** — the fleet deployment pin
   (`release-state-tinystudio-io.json`) records the live Worker release at
   sha `895ad9c` (2026-08-14); `git merge-base --is-ancestor 5de5187
   895ad9c` → true.
3. **Source: the band CTA exists** — `public/agents.html` lines 151-156
   carry the `.band` block with `<a class="cta" href="/#start">Request the
   appraisal</a>` and the no-guarantees note between the roster content and
   the footer; `public/agents.css` `.band .cta` keeps the >=44px pill
   (`padding:16px 24px`).
4. **Source: CI guard exists** — `scripts/check-site.mjs` lines 340-360
   ("Desk page in-content request CTA") fail the build if the band, its
   CTA to `/#start`, `.band .cta` styling, or the >=44px tap target
   regress.
5. **Site-wide checker** — `npm run check` → exit 0; "TinyStudio.io checks
   passed."
6. **Full test suite** — `npm test` → exit 0: headings 6/6, sitemap 7/7,
   agent-worker 76/76, agent-UI 8/8, product-contract 16/16, viewport 4/4,
   narrow-viewport 4/4, `/agents` PASS at 240-390px (the only reported item
   is the pre-existing, out-of-scope `/` overflow at 240px/260px, which
   does not gate the exit code).
7. **Live site** — `GET https://tinystudio.io/agents` → HTTP 200; the
   served HTML carries the band CTA (two "Request the appraisal"
   occurrences — nav and in-content band). `GET
   https://tinystudio.io/agents.html` → HTTP 307 → `/agents`. The served
   body is byte-identical to committed `public/agents.html` (normalized
   by stripping the `data-fonts-css` preload attribute the worker
   injects).

## Files changed

- `docs/evidence/agents-desk-cta-rereverify-2026-08-14.md` — new evidence
  receipt recording the closeout on the current head and live site (the
  lane's claimed file).
- `.lane/reports/fix-agents-desk-cta-rereverify-2026-08-14.md` — this
  report.

## Verification commands

- `git merge-base --is-ancestor 5de5187 origin/main` → true.
- `git merge-base --is-ancestor 5de5187 895ad9c` → true (deployed release
  is past the fix).
- `npm run check` → "TinyStudio.io checks passed." (exit 0).
- `npm test` → exit 0; all suites green.
- `curl -s -w "%{http_code}" https://tinystudio.io/agents` → 200; body
  carries the `.band` CTA to `/#start`; body byte-identical to source
  (normalized).
- `curl -s -w "%{http_code}" https://tinystudio.io/agents.html` → 307 →
  `/agents`.

## PR

- https://github.com/nish3451/TinyStudio.io/pull/ (opened as
  `fix/agents-desk-cta-rereverify-2026-08-14`)

## Honest boundary

This lane claims no behavioural change in the public surface — the fix
already shipped in PR #162. This lane makes no claim about pricing/legal
prose (owned by other lanes), the README/MEMORY/specs product-contract
wording, or any other review item.
