# Lane 1 — appraisal email autocomplete fix

- Branch: `fix/appraisal-email-autocomplete`
- PR: https://github.com/nish3451/TinyStudio.io/pull/213
- Item: appraisal email field lacks `autocomplete="email"` on `/` and `/audit`

## Change

Added `autocomplete="email"` to the appraisal email input in the `#start`
lead form on both pages, matching the `autocomplete="url"` already on the
website field:

- `public/index.html` (line 77)
- `public/audit.html` (line 82)

The email input on `public/agent-desk.html` already had
`autocomplete="email"`, so it was left untouched.

## Verification

- `npm run check` — TinyStudio.io checks passed
- `npm run test:contract` — 8/8 pass
