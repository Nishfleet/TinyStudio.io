# sol-postmerge-162 waiting-room close — 2026-08-14

Date: 2026-08-14

## Report path (context)

- Source report:
  `/home/nish/workspaces/agent-state/tinystudio-io-improvement-loop/sol/postmerge-162.md`
- Triage note (Disposition QUEUED — unchanged):
  `/home/nish/workspaces/agent-state/tinystudio-io-improvement-loop/triage/sol-postmerge-162.md`
- Judgment: `steering/waiting-room-releases.md` (indexes 16-19, 24-27, 29-35,
  37-41, 57-62, 64-65, 69-74)

## Verdict

Runtime finding UNFOUNDED against current live: live `/agents` and
`/agents.css` are byte-equal to this worktree HEAD, and the closing-band
"Request the appraisal" CTA is present in live HTML. The original
2026-08-13 measurement was real deploy lag after merge `5de5187` (PR #162);
a later fleet-release shipped the band. Residual hole: none — PR #162
already added the `check-site.mjs` desk-band guard.

Named default honored: post-merge defect is machine-ownable work; close as
unfounded with proof when the finding does not hold.

## What was already true before this packet

- `public/agents.html` closing `.band` CTA (`<a class="cta" href="/#start">Request
  the appraisal</a>`) at line 154
- `public/agents.css` scoped `.band .cta` pill (`padding:16px 24px`) at lines 50-53
- `scripts/check-site.mjs` desk-band source guard (lines 340-359)
- Live match: live HTML/CSS byte-equal to worktree HEAD
- Homepage destination still exists: `public/index.html` has
  `<form class="lead two" id="start" ...>`

## What this packet did

- This close-out doc
- Backlog tick for the `sol-postmerge-162` waiting-room reconcile line
- Journal note (2026-08-14)
- Report packet `REPORT-PACKET-sol-postmerge-162.md`

## What was NOT done

- No HTML/CSS/worker change; no deploy; no migration; no payment; no
  auth-flow; no secret use; no second guard.

## Files changed

- `docs/evidence/sol-postmerge-162-waiting-room-close-2026-08-14.md` (this file)

## Live re-measurement (validation JSON)

```
{
  "agents_curl_statusline": "http=200 size=9570 redirect=",
  "css_statusline": "http=200 size=3439 redirect=",
  "live_html_sha256": "a042c6d95b4d18eb0e4d71b614ec1e3bb26c41cd15127b8db9e0328870f94ab6",
  "wt_html_sha256": "a042c6d95b4d18eb0e4d71b614ec1e3bb26c41cd15127b8db9e0328870f94ab6",
  "html_equal": true,
  "live_css_sha256": "0e9ba99dc7786a265d475d7cbd739877cc861941b5cbaca654b84a6c5ba5d903",
  "wt_css_sha256": "0e9ba99dc7786a265d475d7cbd739877cc861941b5cbaca654b84a6c5ba5d903",
  "css_equal": true,
  "has_cta": true,
  "has_band": true,
  "css_has_band_cta": true,
  "css_has_44px_padding": true,
  "check_has_desk_guard": true,
  "check_has_band_cta_style": true
}
```

## Rollback

Revert this close-out commit (`git revert` or `git checkout HEAD~1 -- <file>`)
if the evidence doc ever needs to be withdrawn; the triage note Disposition
stays QUEUED (re-open by editing the note). No product change to roll back.
