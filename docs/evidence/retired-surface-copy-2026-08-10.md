# Retired surfaces claimed a live Agent Desk — copy corrected to the current offer

Date: 2026-08-10
Scope: `src/worker.js` (retired app/api responses, health surface label) and `public/index.html` (developer REPLACE comments in the "Who signs it" section).

## Observed (live)

`https://app.tinystudio.io/` returned, alongside its intentional 410:

> The old TinyStudio app has been retired. TinyStudio.io now runs the **self-serve Agent Desk** from the main domain.

`https://api.tinystudio.io/` returned the same claim in its retired JSON message, and `https://tinystudio.io/health` reported `"surface":"agent-desk"`.

The Agent Desk is not the current offer. The legacy surface's own page frames itself as retired ("TinyStudio — the retired Agent Desk"), offer.md states "The earlier self-serve Agent Desk (one-shot Pipeline Brief) is demoted and is not the current offer," and the current offer is the Website Appraisal — the free leak audit of high-ticket service homepages. Two public surfaces and the health endpoint were therefore publishing product truth that contradicted the rest of the site, and both a human visiting the retired domain and an AI reading the retired JSON would walk away believing the Agent Desk is live.

Separately, the served homepage source (`public/index.html`, live since the leak-audit launch, commit 50d64c7) shipped two developer REPLACE comments inside the "Who signs it" section — the site's strongest credibility claim — including an empty `<p class="sig-note">` meant to carry "one true credential line". The paragraph was hidden by CSS (`display:none`) but the unfinished instruction was visible in the money page's source to any viewer.

## Fix

- Retired app page and retired API message now name the current offer: "TinyStudio.io now runs the Website Appraisal — the free leak audit of high-ticket service homepages." The retired framing and the 410s are unchanged.
- `/health` reports `"surface":"website-appraisal"`.
- The two REPLACE comments and the empty `sig-note` paragraph are removed from the homepage; the dead `.sig-note:empty` CSS rule is removed with them. No credential was invented — the removal only deletes placeholders.

## Guard (so it cannot return)

- `scripts/check-site.mjs`: every served marketing page (homepage, audit, agents, pricing, specimen, brief-requested) is rejected if it ships a `<!-- REPLACE:` comment.
- `scripts/test-agent-worker.mjs`: the retired app surface (410 HTML), the retired api surface (410 JSON), and `/health` are each asserted to name the Website Appraisal and never contain "Agent Desk", and the health `surface` field is pinned to `website-appraisal`.

## Verify

```bash
npm test   # check + headings + sitemap + worker + ui, all suites green
```

Live re-check after deploy:

```bash
curl -s https://app.tinystudio.io/ | grep -c "Agent Desk"   # 0
curl -s https://api.tinystudio.io/ | grep -c "Agent Desk"   # 0
curl -s https://tinystudio.io/health                        # "surface":"website-appraisal"
```
