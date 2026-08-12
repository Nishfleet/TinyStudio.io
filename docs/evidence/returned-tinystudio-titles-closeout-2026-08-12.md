# Returned "The Tiny Studio" document titles — closeout receipt

Date: 2026-08-12
Scope: backlog item "[unreviewed-by-grok] Fix the returned "The Tiny Studio"
document titles after the prior naming item was worked — `/pricing` and
`/brief-requested` still ship the closed bug" (scout 2026-08-09, risk: amber,
parity-risk). The fix shipped as PR #98 (`d4a2c30`, "fix(public): give both
appraisal intake fields persistent labels and kill the two 'The Tiny Studio'
document titles", merged 2026-08-11). The item's last annotation marks
acceptance met; this receipt re-verifies every acceptance criterion against the
current head and live (2026-08-12) so the tracker item can tick without
re-opening by drift.

## What was measured

The item's acceptance criteria:

1. Live `/pricing` title reads `Pricing & terms — TinyStudio` (or an equally
   exact TinyStudio form).
2. Live `/brief-requested` title reads `Request received — TinyStudio`.
3. A deterministic check covers both pages plus the four other served
   appraisal titles so `The Tiny Studio` cannot return in document titles.
4. `npm run check` passes.

## Environment

- Source baseline: fresh `origin/main` at `ad9cee3` (HEAD of this worktree,
  parent of the fix commit is `d4a2c30` in ancestry).
- Live target: `https://tinystudio.io/` and the six served public pages.

## Results (repository, `origin/main` @ `ad9cee3`)

The six served document titles all name the brand as TinyStudio and none uses
the spaced "The Tiny Studio" form:

- `public/index.html` — `TinyStudio — The Website Appraisal`
- `public/audit.html` — `TinyStudio — The Website Appraisal`
- `public/agents.html` — `TinyStudio — The Desk`
- `public/pricing.html` — `TinyStudio — Pricing &amp; terms`
- `public/specimen.html` — `TinyStudio — The Website Appraisal — specimen`
- `public/brief-requested.html` — `Request received — TinyStudio`

`grep` across the six `<title>` tags returns zero matches for `The Tiny Studio`.

The deterministic guard is present in `scripts/check-site.mjs` (document-title
block, ~lines 1601-1633): every one of the six served appraisal pages must have
a `<title>` that names TinyStudio and must never contain the spaced "The Tiny
Studio" form. The retired `/agent-desk` surface is deliberately excluded — its
title frames itself as retired and it is `noindex` (unchanged design decision
from PR #98). The AI-search evidence bundle on `/audit` legitimately quotes
other businesses' names ("The Tiny Studio LA"), and the identity guard
explicitly strips script blocks before its stale-string scan.

## Results (live, 2026-08-12)

Fresh `curl` of the six served pages:

- `https://tinystudio.io/` titles `TinyStudio — The Website Appraisal`.
- `https://tinystudio.io/audit` titles `TinyStudio — The Website Appraisal`.
- `https://tinystudio.io/agents` titles `TinyStudio — The Desk`.
- `https://tinystudio.io/pricing` titles `TinyStudio — Pricing &amp; terms`.
- `https://tinystudio.io/specimen` titles
  `TinyStudio — The Website Appraisal — specimen`.
- `https://tinystudio.io/brief-requested` titles `Request received — TinyStudio`.

`The Tiny Studio` returns zero matches across the six served document titles.

## Full suite on the current head

- `npm run check` — "TinyStudio.io checks passed."
- `npm test` — 92/92 pass, exit 0: heading hierarchy 6/6, sitemap 7/7, worker
  55/55, agent UI + AI-answer readiness 16/16, product contract 8/8.

## Boundary note (owned elsewhere)

The `/pricing` and `/brief-requested` page footers still render the spaced
"`The Tiny Studio`" brand form in visible copy. That is a separate
visible-copy concern, outside this item's document-title scope, and is owned
by the open PR #112 (`fix/footer-brand-tinystudio`), which rewrites both
footer strings and extends the `check-site.mjs` stale-identity guard to cover
the pricing and brief-requested pages.

## Conclusion

All acceptance criteria are met on current main and live: `/pricing` serves
`TinyStudio — Pricing &amp; terms`, `/brief-requested` serves
`Request received — TinyStudio`, the deterministic check covers all six served
appraisal titles so the spaced form cannot return in document titles, and
`npm run check` passes. The item can be ticked.
