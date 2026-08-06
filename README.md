# TinyStudio.io

Self-serve TinyStudio Agent Desk for high-ticket pipeline setup.

## What This Repo Owns

- The public `tinystudio.io` and `www.tinystudio.io` Agent Desk.
- Cloudflare Workers AI generation through `/api/agent-audit` for Pipeline Brief, Implementation Checklist, and Weekly Fix Report outputs.
- Email capture through `/api/signups`, stored in Cloudflare D1.
- Lightweight agent usage metadata in Cloudflare D1, including daily rate-limit counters.
- The intentional retirement responses for `app.tinystudio.io` and `api.tinystudio.io`.
- Agent-readable public product truth at `/llms.txt` and `/offer.md`.

## What This Repo Does Not Own

- Any live private TinyStudio app/API product.
- Client folders, analytics exports, payment data, private sprint work, or ad-platform credentials.
- Revenue claims, ROAS claims, booked-call claims, ranking claims, sales-lift promises, autonomous ad buying, ad spend changes, campaign publishing, or ad-platform write actions.
- Storage of submitted business snapshots, optional detail inputs, weekly metrics, or generated artifacts; the Agent Desk processes context for the generated output and stores only email plus lightweight usage metadata.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

Deploys are guarded by the machine-level `safe-deploy` wrapper.
