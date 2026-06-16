# TinyStudio.io

Public buyer pages for TinyStudio's Tangible Revenue Leak Sprint + Search Trust Layer and the secondary Pipeline Sprint offer lane.

## What This Repo Owns

- The public `tinystudio.io` and `www.tinystudio.io` website.
- The intentional retirement responses for `app.tinystudio.io` and `api.tinystudio.io`.
- The buyer-facing offer, price, timeline, FAQs, and refund/guarantee terms.
- The secondary `/pipeline-sprint/` public offer page and guided audit intake helper.
- The buyer-safe workflow/features view: intake, production system, human review, handoff loop, artifacts, and proof gates.
- Agent-readable public copy at `/llms.txt` and `/offer.md`.

## What This Repo Does Not Own

- Any live private TinyStudio app/API product.
- Client data, prospect folders, analytics exports, or private sprint work.
- Revenue, ROAS, ranking, or sales-lift promises.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

Deploys are guarded by the machine-level `safe-deploy` wrapper.
