# Lane 1 — dogfood 4473a99a9bc9 re-verification (2026-08-22)

Finding: "AI Answer Readiness: preferred source pages are unclear" (audit run
20260808T074205Z-msk2fl3n).

## Verdict

**Already resolved on current origin/main and live. No PR opened; the item is
retired via `fleet-resolve-item` so it does not re-dispatch.**

## Why

The fix landed as PR #42 (commit 95d2248, "fix(public): declare preferred
source pages for AI answers (dogfood 4473a99a9bc9)"): an
`## Answer Readiness: Preferred Source Pages` section in both
`public/llms.txt` (line 37) and `public/offer.md` (line 11), one preferred
source page per controlled question, plus the "AI Answer Readiness (dogfood
4473a99a9bc9)" guard in `scripts/check-site.mjs` and unit assertions in
`scripts/test-agent-ui.mjs`. The subsequent controlled engine re-run (PR #227,
receipt `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`) moved
q5/google and q7/google from `wrong`/`absent` to `found` — the exact gaps the
original finding described. The finding has since been re-verified on main on
2026-08-11, -12, -14, -15 and -20 (latest: PR #260).

## What this lane checked today (2026-08-22)

Worktree branched from fresh origin/main (0a382be).

1. Source state: `public/llms.txt`, `public/offer.md`,
   `scripts/check-site.mjs`, `scripts/test-agent-ui.mjs` and
   `evidence-fixtures/ai-search/` have a zero diff against the 2026-08-20
   receipt head (`git diff 163c0b4..HEAD -- <paths>` empty). The guard still
   requires: the section in BOTH files, exactly-one-page mapping per
   controlled question, served-page membership against the sitemap loc set,
   price questions (q2/q7) → clean `/pricing`, and the `offer.md` mirror.
   `npm run check` passes; full `npm test` passes (126 tests, 0 failures,
   exit 0), including the "every controlled question maps to a preferred
   source page" subtest.

2. Fresh live measurement (2026-08-22, HTTPS fetch against
   `https://tinystudio.io`):

   | URL | HTTP | content-type | bytes | vs source |
   |---|---|---|---|---|
   | `/llms.txt` | 200 | text/plain | 5337 | byte-identical |
   | `/offer.md` | 200 | text/markdown | 4082 | byte-identical |
   | `/sitemap.xml` | 200 | application/xml | 595 | used for membership |

   The deploy lag noted by the 2026-08-20 receipt (live pinned at b4d80f1)
   has since closed: served bytes now match source exactly (`diff` empty both
   files), so live serves the guarded declaration itself.

3. Live mapping re-checked question-by-question against the fixture registry
   (8 controlled questions): q1 → `/`, q2 → `/pricing`, q3 → `/audit`,
   q4 → `/audit`, q5 → `/`, q6 → `/audit`, q7 → `/pricing`, q8 → `/`. Every
   question maps to exactly one served page per the live sitemap; both price
   questions point at `/pricing`; `offer.md` mirrors the identical mapping.
   All eight checks pass.

## Outcome

No product change was needed and none was made. Per the dispatch contract's
already-resolved rule, no PR was opened; the item was retired:

```
fleet-resolve-item resolve --workspace <worktree> --item-id 841926c5db \
  --status resolved \
  --receipt-note 'already resolved on main by PR #42 (95d2248); re-verified on main and live 2026-08-22' \
  --receipt-pr 42
```
