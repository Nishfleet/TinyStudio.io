# Lane 1 — dogfood f41c8af0f8 (retired "TinyStudio Agent Desk" title in Google)

Date: 2026-08-14
Branch: `docs/agent-desk-index-reverify-lane1-20260814`
Base: fresh `origin/main` @ `5770bf3`

## Verdict

The finding was **half closed and half live**. The apex homepage — the exact
target named in the finding — is fixed and now verified fixed against a real
Google SERP. But the retired name still reaches Google through
`www.tinystudio.io`, a byte-identical duplicate of the site that no PR had
touched. This lane closed that host.

## What this lane did

1. Re-verified the shipped `noindex` + retired-framing fix on head and live.
2. Measured the live Google SERP (`site:tinystudio.io`, real browser) instead of
   trusting the repo state — which is what surfaced the residual.
3. Traced the residual to `wrangler.jsonc` routing `www.tinystudio.io/*` at a
   worker whose host dispatch only handled `app.`/`api.`.
4. Shipped a 301 canonical-host redirect plus four behavioural tests.

Full measurements, tables and root cause in
`docs/evidence/agent-desk-index-reverify-2026-08-14.md`.

## Key evidence

- Live SERP apex result: "TinyStudio — The Website Appraisal" ✅ (finding's
  original symptom gone).
- Live SERP www results still carry Google's cached site name
  "**- TinyStudio Agent Desk**" and the stale "The Tiny Studio" titles.
- `https://www.tinystudio.io/` served bytes `sha256 b37b0bbe…934e`, identical to
  the apex; `http://www.tinystudio.io/` answered 200 with no HTTPS upgrade.

## Files touched

- `src/worker.js` — canonical-host 301 for `www.tinystudio.io`.
- `scripts/test-agent-worker.mjs` — 4 new guards.
- `docs/evidence/agent-desk-index-reverify-2026-08-14.md` — evidence receipt.
- `.lane/reports/docs/agent-desk-index-reverify-lane1-20260814.md` — this file.

No shared report file was written.

## Tests

`check-site` pass · worker 80/0 (was 76) · headings 6 · sitemap 7 · UI 16 ·
contract 8 · viewport 4 · narrow-pages pass · render-blocking pass.
Regression proof: disabling the host check yields `# pass 77 / # fail 3`.

## Overlap avoided

Open PR **#91** already fixes the `/agent-desk` canonical (the other
consolidation path for this same finding); it is `MERGEABLE` but `BLOCKED` on
review. This branch deliberately does not touch `public/agent-desk.html` or the
`check-site.mjs` desk guard, so it does not conflict and the two compose.
Open PRs #142/#95 cover the `/agents` canonical. Not duplicated here.
