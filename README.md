# TinyStudio.io

Locked public coming-soon surface for TinyStudio.io.

## What This Repo Owns

- The public `tinystudio.io` and `www.tinystudio.io` coming-soon page.
- Email capture through `/api/signups`, stored in Cloudflare D1.
- The intentional retirement responses for `app.tinystudio.io` and `api.tinystudio.io`.
- Agent-readable lockdown state at `/llms.txt` and `/offer.md`.

## What This Repo Does Not Own

- Any live private TinyStudio app/API product.
- Client data, prospect folders, analytics exports, or private sprint work.
- Public sprint offers, pricing, revenue claims, ROAS claims, booked-call claims, ranking claims, or sales-lift promises while lockdown is active.

## Commands

```bash
npm test
npm run dev
npm run deploy:dry-run
npm run deploy
```

Deploys are guarded by the machine-level `safe-deploy` wrapper.
