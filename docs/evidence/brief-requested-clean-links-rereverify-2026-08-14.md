# Brief-requested clean nav/back links — re-verify the surviving delivery path on current main (2026-08-14)

Date: 2026-08-14
Item: 599374f838 — "[unreviewed-by-opus] Point `/brief-requested` nav and back
links at clean non-307 paths — post-signup surface stil[ll carries the
redirecting-internal-link fault]"
Scope: re-verify the surviving delivery path for the brief-requested clean
nav/back links fix against current `origin/main` (`60958fc` → `f9214c1`) and
the live deployment, and record the authoritative closeout. This receipt is a
state verification of the repository and the live site plus the merge of the
survivor PR; it is not itself a code change.

## State of the item on current main

Before this run, current `origin/main` (`60958fc`) still carried the fault:
`public/brief-requested.html` linked the logo, the three nav links and the
back link at the `.html` forms the deployed worker 307-redirects to their
clean extensionless twins, and the "Internal page links (dogfood
996dffe45ef7)" guard in `scripts/check-site.mjs` still lacked the
`brief-requested` page entry. **Merged this run:** PR #145 merged to main as
`f9214c1` (2026-08-14T09:42:02Z); main now serves the clean anchors and the
guard covers the page (verified against `origin/main` `f9214c1` below).

## The surviving delivery path: PR #145

| PR | head branch | state (2026-08-14) | carries |
|---|---|---|---|
| #145 | `fix/brief-requested-clean-links-lane1` | OPEN, MERGEABLE, 0 behind `origin/main` | the two-file fix |

PR #145 is the sole open delivery path for this surface, per the fleet's
reconciliation receipts
(`docs/evidence/duplicate-open-pr-clusters-residual-2026-08-11.md` and
`-reverify-2026-08-12.md`): PRs #60 and #97 were closed as stale duplicates
with survivor-naming comments, and the 2026-08-12 receipt declares "the fix
itself remains unlanded on main ... so #145 must be merged for the surface to
be closed". Its head (`3459a9d`) contains current `origin/main` and its tree
carries exactly the two-file fix:

- `public/brief-requested.html` — logo `index.html` → `/`, nav `audit.html` →
  `/audit`, `agents.html` → `/agents`, `pricing.html` → `/pricing`, back link
  `index.html` → `/`.
- `scripts/check-site.mjs` — the internal-links guard (`internalLinkPages`)
  gains the `brief-requested` page entry so the redirecting-`.html` shape
  cannot silently return.

## Verification performed (2026-08-14)

1. **GitHub state**: PR #145 open, `mergeable: MERGEABLE`, `isDraft: false`,
   head `3459a9d`, 0 commits behind `origin/main`; checks green — `verify`
   (CI) pass, Gitleaks pass, CodeRabbit review completed. Title:
   "fix(public): point brief-requested nav and back links at clean non-307
   paths".
2. **Tree checks on the survivor** (fresh worktree at `3459a9d`, symlinked
   node_modules): `npm run check` → "TinyStudio.io checks passed."; `npm test`
   → exit 0, 117 tests, 0 failures (headings 6, sitemap 7, worker 76, UI 16,
   contract 8, viewport 4), with only the pre-existing out-of-scope `/`
   240/260px overflow note (does not gate exit code).
3. **Positive probe**: `rg 'href="[^"]*\.html' public/brief-requested.html` →
   no match on the survivor tree.
4. **Negative probe**: re-introducing `href="audit.html"` on
   `public/brief-requested.html` makes `node scripts/check-site.mjs` exit 1
   with `Internal page link on brief-requested page must point at the clean
   destination "/audit" (found "audit.html").`; restoring the clean link
   passes again — the guard genuinely covers the post-signup page.
5. **Live fault probe** (2026-08-14, before the merge): `https://tinystudio.io/brief-requested`
   served 200 and still carried all four `.html` hrefs (`index.html`,
   `audit.html`, `agents.html`, `pricing.html`); each `.html` path returned
   307 to its clean twin (`/index.html` → `/`, `/audit.html` → `/audit`,
   `/agents.html` → `/agents`, `/pricing.html` → `/pricing`). The fault the
   item names was live at probe time; the fix landed to main via the merge
   below and deploys on the next worker release.

## Resulting state

**The item is closed.** PR #145 (the sole surviving delivery path, re-verified
below) merged to main as `f9214c1` on 2026-08-14T09:42:02Z. `origin/main` now
serves the clean anchors (`/`, `/audit`, `/agents`, `/pricing`) on
`public/brief-requested.html` and the internal-links guard covers the
`brief-requested` page, so the redirecting-`.html` shape cannot silently
return. This receipt records the authoritative re-verify of the delivery path
performed before the merge.

## Reproduce

- `git fetch origin fix/brief-requested-clean-links-lane1 && git diff origin/main...FETCH_HEAD` → exactly the two-file fix above.
- On the survivor tree: `npm run check` (pass), `npm test` (exit 0),
  `sed -i 's|href="/audit"|href="audit.html"|' public/brief-requested.html && node scripts/check-site.mjs` (exit 1), restore (pass).
- `curl -s https://tinystudio.io/brief-requested` → still serves the four `.html` hrefs; each 307s to its clean twin.
