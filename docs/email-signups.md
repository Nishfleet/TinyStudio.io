# TinyStudio Email Signups

Emails from the cryptic landing page are stored in Cloudflare D1.

Database: `tinystudio_email_signups`

Table: `email_signups`

## Retrieve Latest Emails

```bash
export PATH="$HOME/.local/share/safe-deploy/bin:$PATH"
SAFE_DEPLOY_APPROVED='wrangler d1 execute tinystudio_email_signups --remote --command SELECT' npm run leads:list
```

## Export All Emails As JSON

```bash
export PATH="$HOME/.local/share/safe-deploy/bin:$PATH"
SAFE_DEPLOY_APPROVED='wrangler d1 execute tinystudio_email_signups --remote --command SELECT' npm run leads:export
```

The public site can write signups through `/api/signups`. There is no public endpoint that lists emails.
