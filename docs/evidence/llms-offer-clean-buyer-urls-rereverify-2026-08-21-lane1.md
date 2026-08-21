# llms.txt and offer.md clean buyer URLs — re-verify the closed twin's fix on current main and live (2026-08-21)

Date: 2026-08-21
Item: 7a215e4e7a — "[unreviewed-by-opus] Point live llms.txt and offer.md
buyer URLs at clean non-307 paths — the closed twin's fix PR"
Scope: authoritative re-verification of the closed twin's fix (`fix(public):
point llms.txt and offer.md buyer URLs at the clean non-307 paths`, commit
`d187f48`, the original twin PR #57 on `fix/llms-offer-clean-buyer-urls`)
against current `origin/main` (`92d55c3`) and the live deployment. The fix
itself is already on `origin/main` via the lane-1 survivor PR #202 (squash
merge `c4475858`, 2026-08-15T18:42:47Z) — the byte-identical re-land of the
closed twin onto current `origin/main`. This receipt is a state verification
of the repository and the live site, not a code change. Opening a duplicate
of #202 would recreate the duplicate open-PR cluster the lane-1 run on
2026-08-15 reconciled (per the earlier
`docs/evidence/duplicate-open-pr-clusters-residual-2026-08-11.md` pattern
that closed PRs #60 and #97 in favor of survivor #145, and the same shape
applied to PR #57 → survivor #202 here).

## State of the item on current main

`origin/main` (`92d55c3`, "fix(check): guard the apple touch icon on every
served page, and re-verify finding 98a7bf8e08fc (2026-08-20) (#256)") carries
the fix as merged via PR #202 (`c4475858`):

- `public/llms.txt` — every buyer URL the machine-readable pair names
  (`/audit`, `/pricing`) points at the clean form that serves 200.
- `public/offer.md` — every buyer URL named by the file (`/audit`, `/pricing`)
  points at the clean form that serves 200.
- `scripts/check-site.mjs` — the `requiredPublicArtifacts` needle, the
  price-question preferred-source guard, the audit evidence-artifact pointer
  guard, and the surrounding comments/messages now require the clean forms.
- `scripts/test-agent-ui.mjs` — the offer-fact needle, the served-pages
  membership list, the price-question mapping assertion, and the
  audit/pricing pointer assertions now require the clean forms.

Verified line-by-line on the worktree HEAD (see "Source check on the current
head" below).

## Live verification (2026-08-21, against the deployed worker)

| URL | live status | notes |
|---|---|---|
| `https://tinystudio.io/llms.txt` | HTTP/2 200 (`text/plain`) | serves the current `public/llms.txt` byte-for-byte (md5 `1c508e57c4f3f7de9794a8772e437918`, matches worktree) |
| `https://tinystudio.io/offer.md` | HTTP/2 200 (`text/markdown`) | serves the current `public/offer.md` byte-for-byte (md5 `30d0c61fe828c71a2506dab9a3843ca3`, matches worktree) |
| `https://tinystudio.io/audit.html` | HTTP/2 307 → `location: /audit` | worker 307 still in place, unchanged from the twin's fix |
| `https://tinystudio.io/audit` | HTTP/2 200 (`text/html`) | clean form, serves the audit page |
| `https://tinystudio.io/pricing.html` | HTTP/2 307 → `location: /pricing` | worker 307 still in place, unchanged from the twin's fix |
| `https://tinystudio.io/pricing` | HTTP/2 200 (`text/html`) | clean form, serves the pricing page |

The twin's fix's premise — that the deployed worker 307-redirects every
`.html` form to its clean extensionless twin — still holds. The fix's
prescription — that the machine-readable pair name only the clean forms in
their buyer URLs — also still holds on the live deployment (verified via the
md5 match against `public/llms.txt` and `public/offer.md` in the worktree).

## Source check on the current head (`92d55c3`)

`npm` is not on the runner's default PATH; `npm test` was re-run with
`PATH="$HOME/.local/bin:$PATH"` (which adds `/home/nish/.local/bin/npm`).

| Step (`package.json` script) | Result |
|---|---|
| `check` (`node scripts/check-site.mjs`) | PASS — "TinyStudio.io checks passed." |
| `test:headings` (`node --test scripts/test-heading-hierarchy.mjs`) | PASS — 6/6 |
| `test:sitemap` (`node --test scripts/test-sitemap.mjs`) | PASS — 7/7 |
| `test:worker` (`node --test scripts/test-agent-worker.mjs`) | PASS — 83/83 |
| `test:ui` (`node --test scripts/test-agent-ui.mjs`) | PASS — 16/16 |
| `test:contract` (`node --test scripts/test-product-contract.mjs`) | PASS — 8/8 |
| `test:study` (`node --test scripts/test-study-freshness.mjs`) | PASS — 2/2 |
| `test:viewport` (`node --test scripts/test-first-viewport-audience.mjs`) | PASS — 4/4 |
| `test:narrow-pages` (`node scripts/test-narrow-viewport-pages.mjs`) | PASS — exit 0, all owned routes keep `document.scrollWidth === clientWidth` at 240-390px |
| `test:narrow` (`node scripts/test-narrow-viewport.mjs`) | PASS — exit 0, all narrow viewports keep the hero mock inside the viewport |

Total: 126 tests, 0 failures. The only known out-of-scope note — the
pre-existing mobile viewport `scrollWidth` overflow on `/` (reported in
earlier lane-1 receipts, does not gate exit, identical on `origin/main`)
was not re-triggered here because the same `/` row continues to read PASS in
`test:narrow` (240/260/280/320px).

## Buyer-URL inventory on `public/llms.txt` and `public/offer.md` (2026-08-21)

Every `https://tinystudio.io/{audit,pricing}` reference in the two files
points at the clean form that serves 200. The grep:

```
$ grep -nE "https://tinystudio\.io/(audit|pricing)" public/llms.txt public/offer.md
public/llms.txt:22:The audit page (https://tinystudio.io/audit) carries the controlled
public/llms.txt:33:- q2-what-tinystudio-charges (What TinyStudio charges): https://tinystudio.io/pricing
public/llms.txt:34:- q3-where-tinystudio-is-based (Where TinyStudio is based): https://tinystudio.io/audit
public/llms.txt:35:- q4-who-tinystudio-works-with (Who TinyStudio works with): https://tinystudio.io/audit
public/llms.txt:37:- q6-client-work (Does TinyStudio publish client work): https://tinystudio.io/audit
public/llms.txt:38:- q7-what-tinystudio-io-charges (What tinystudio.io charges): https://tinystudio.io/pricing
public/llms.txt:66:Price and terms: https://tinystudio.io/pricing
public/offer.md:16:- q2-what-tinystudio-charges (What TinyStudio charges): https://tinystudio.io/pricing
public/offer.md:17:- q3-where-tinystudio-is-based (Where TinyStudio is based): https://tinystudio.io/audit
public/offer.md:18:- q4-who-tinystudio-works-with (Who TinyStudio works with): https://tinystudio.io/audit
public/offer.md:20:- q6-client-work (Does TinyStudio publish client work): https://tinystudio.io/audit
public/offer.md:21:- q7-what-tinystudio-io-charges (What tinystudio.io charges): https://tinystudio.io/pricing
public/offer.md:40:https://tinystudio.io/pricing
```

No `.html` buyer-URL matches remain in either file. The only remaining
`pricing.html` strings are prose file-name references (not URLs):

```
$ grep -nE "pricing\.html|audit\.html" public/llms.txt public/offer.md
public/llms.txt:6:terms are on pricing.html.
public/offer.md:3:… the desk's price and terms are on pricing.html.
```

These two prose mentions — "the desk's price and terms are on pricing.html" —
are outside the closed twin's fix scope: the twin (commit `d187f48`) and its
re-land (`a88a4c8` / squash `c4475858`) only changed URL references. They
are a separate prose polish, touched independently by `4b599d9a`
("fix(public): point llms.txt and offer.md at clean /pricing URL and add
Pages index") on branch `growth/geo-llms-pricing-clean-b` /
`origin/pr/275` — a separate lane's delivery path that is not part of this
lane-1 item. The item `7a215e4e7a` named the closed twin's fix PR, and the
twin did not change prose, only URLs.

## Guard re-probe (positive / negative)

The price-question guard in `scripts/check-site.mjs` and the offer-fact
needle in `scripts/test-agent-ui.mjs` were both written to require the clean
form. Re-probe:

- **Positive**: `grep -nE 'https://tinystudio\.io/pricing"' public/llms.txt public/offer.md` → multiple hits (above); no `.html` buyer-URL hits remain.
- **Positive** (URL acceptance): `node scripts/check-site.mjs` exits 0 with
  the machine-readable pair in its current state.
- **Negative** (single-line revert): replacing `https://tinystudio.io/pricing`
  with `https://tinystudio.io/pricing.html` on `public/llms.txt` line 66
  makes `check-site.mjs` exit 1 with
  `requiredPublicArtifacts: missing "https://tinystudio.io/pricing"`. Restore
  passes. (Probed and reverted in place — the worktree is clean.)

## The surviving delivery path: PR #202

| PR | head branch | state (2026-08-21) | carries |
|---|---|---|---|
| #57 | `fix/llms-offer-clean-buyer-urls` | CLOSED | the original twin fix (`d187f48`), never merged, conflict-locked against current main; closed 2026-08-15T18:42:47Z with a comment naming survivor #202 |
| #202 | `fix/llms-offer-clean-buyer-urls-lane1` | **MERGED** to `origin/main` as `c4475858` | the byte-identical twin fix on a fresh `origin/main` base |

`c4475858` is a squash merge of `fix/llms-offer-clean-buyer-urls-lane1`
(`a88a4c8` + the four sibling main-merge commits + the lane-1 closeout
`.lane/reports/fix-llms-offer-clean-buyer-urls-lane1.md`); the diff against
its single parent (`ffc1672`) is the same five-file fix the twin carried
(`public/llms.txt`, `public/offer.md`, `scripts/check-site.mjs`,
`scripts/test-agent-ui.mjs`, plus the lane-1 receipt). #202 is the sole
merged delivery path for this surface; #57 was closed as the stale duplicate
of the same shape the fleet's residual reconciliation closed #60 and #47 in
favor of survivors #97 and #85.

## What closes the item

- The closed twin's fix is live on `origin/main` (`92d55c3`, post-`c4475858`).
- Every buyer URL the machine-readable pair names serves 200 on the deployed
  worker; no `.html` buyer-URL references remain in either file.
- The check-site and agent-ui guards require the clean form; a one-line
  revert makes the suite exit 1 with the named guard message.
- The stale duplicate PR #57 was closed on 2026-08-15 with a comment naming
  the survivor #202; the cluster is reconciled.

No code change was made on this branch — opening a duplicate of PR #202 would
have recreated the duplicate open-PR cluster the fleet reconciled. The lane's
sole contribution is this receipt and its lane-1 closeout, both committed on
`chore/llms-offer-clean-buyer-urls-rereverify-lane1-2026-08-21`.
