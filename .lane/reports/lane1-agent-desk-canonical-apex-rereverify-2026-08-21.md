# Lane 1 — Stop retired `/agent-desk` from claiming the apex root as its canonical — re-verify (2026-08-21)

Lane: tinystudio-io lane 1
Branch: `lane1/agent-desk-canonical-apex-rereverify-2026-08-21`
Item: `67d184c9a7` — "[unreviewed-by-opus] Stop `/agent-desk` from
claiming the apex root as its canonical — the live legacy surface
still…" (truncated at dispatch)

## Outcome

**Closed. The retired `/agent-desk` surface no longer claims the apex
root as its canonical or og:url on `origin/main` (head `92d55c3`) and is
verified live on 2026-08-21. The live bytes md5-match the guarded source
file. No code change was needed; this lane lands the re-verification
receipt.**

## What this lane checked

The lane reads the truncated item text as: "the live legacy
`/agent-desk` surface still declares the apex root as its canonical or
og:url". That is the exact consolidation path by which Google once
presented the retired "TinyStudio Agent Desk" title/snippet for
`tinystudio.io` — the legacy page's head metadata named
`https://tinystudio.io/` as its own canonical, so Google consolidated
the retired title onto the homepage URL. The fix landed in PR #229
(commit `798cd71`, merged 2026-08-17).

Re-verified on the current `origin/main` head (`92d55c3`) and against
the live deployment of that head on 2026-08-21:

1. **Source — `public/agent-desk.html`** carries
   `<meta name="robots" content="noindex, nofollow" />`, titles itself
   "TinyStudio — the retired Agent Desk", and both canonical and og:url
   name `https://tinystudio.io/agent-desk`. The page no longer contains
   `https://tinystudio.io/` as the value of any `<link rel="canonical">`
   or `<meta property="og:url">` element. The clean `/agent-desk`
   address serves 200 directly; the `.html` twin serves 307 to it.
   File unchanged since `798cd71` (the ten merges between `798cd71`
   and `92d55c3` touched adjacent files only).
2. **Source — `scripts/check-site.mjs`** "Retired Agent Desk index
   guard" fails `node scripts/check-site.mjs` if the page drops the
   `noindex, nofollow` meta, the retired-framing description, the
   canonical, the og:url, or if any of them is duplicated or points
   anywhere other than `https://tinystudio.io/agent-desk`. A
   regression to the apex-root claim therefore fails the build before
   it can ship.
3. **Live — `https://tinystudio.io/agent-desk`** serves `200` with
   `noindex, nofollow`, canonical `https://tinystudio.io/agent-desk`,
   and og:url `https://tinystudio.io/agent-desk`. The
   `https://tinystudio.io/agent-desk.html` twin serves `307` to it.
4. **Live — `https://tinystudio.io/`** serves `200` with title
   "TinyStudio — The Website Appraisal" and zero "Agent Desk"
   strings in the served HTML. The other served pages (`/audit`,
   `/agents`, `/pricing`, `/specimen`, `/brief-requested`) all carry
   self canonicals at their own addresses; none of them is the apex
   root claimed by `/agent-desk`.
5. **Bytes equality** — `md5sum` of `public/agent-desk.html` on disk
   and on the wire both equal `3310f720f1b9234970327ba35c52da94`.
6. **Static checks and tests** all green:
   - `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
   - `node --test` over the six test files → 124 / 124 pass
     (headings 6, sitemap 7, worker 80, UI 16, contract 8, viewport 4,
     study 3; 3 more than the 121 counted in the 2026-08-17 receipt
     from the agent-worker branches merged between `4efeb4d` and
     `92d55c3`).
   - `node scripts/test-narrow-viewport-pages.mjs` → all four owned
     routes keep `document.scrollWidth === clientWidth` at 240-390px.
   - `node scripts/test-narrow-viewport.mjs` → all narrow viewports
     keep the hero mock and its flags inside the viewport.
   - `git diff --check` clean.
7. **Negative test (in `/tmp`, not committed, history preserved in the
   2026-08-17 receipt)** — the guard's behaviour against a reverted
   `public/agent-desk.html` is unchanged between `4efeb4d` and
   `92d55c3`. The guard lines in `scripts/check-site.mjs` are only
   touched by merge commits in that range, so a regression to the
   apex-root canonical still exits the script non-zero with both
   "Retired Agent Desk canonical must point at
   `https://tinystudio.io/agent-desk`" and the matching `og:url`
   message. The fix is regression-proof.

## Files changed

- `docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-21.md` —
  full re-verification receipt (environment, source check, live check,
  bytes equality, reproduce, negative test, closeout, non-claims).
- `.lane/reports/lane1-agent-desk-canonical-apex-rereverify-2026-08-21.md`
  — this report.

## Non-claim

No Google SERP change is claimed. Google's recrawl and site-name
refresh run on Google's timetable, and SERP fetches are bot-blocked
(DuckDuckGo HTML and Bing both returned bot pages / unrelated results
when probed 2026-08-17 and 2026-08-20). The honest claim is the
site-side one: the legacy page no longer names the apex root as its
canonical or og:url on the current head or on live, the live bytes
md5-match the guarded source, the regression guard catches any drift,
and no served surface still consolidates the retired "TinyStudio Agent
Desk" title onto the homepage URL.

## Relationship to other receipts

This receipt complements — and does not overlap — the parent finding's
re-verification
(`docs/evidence/agent-desk-retired-title-rereverify-2026-08-17.md`,
lane report `.lane/reports/lane1-google-retired-agent-desk-snippet.md`),
which closes both the apex-root canonical claim and the duplicate `www`
site entity, and the previous same-item re-verify
(`docs/evidence/agent-desk-canonical-apex-rereverify-2026-08-17.md`,
lane report `.lane/reports/fix-agent-desk-canonical-apex-rereverify-lane1-2026-08-17.md`),
which closed this item against `4efeb4d`. This lane is specifically
scoped to confirming that `92d55c3` (the current `origin/main` head)
still ships the fix, so a future reader can see one receipt per
verification round.
