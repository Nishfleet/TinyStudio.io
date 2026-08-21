# Lane 1 — dogfood 4473a99a9bc9 re-verification (2026-08-20)

Finding: "AI Answer Readiness: preferred source pages are unclear" (audit run
20260808T074205Z-msk2fl3n).

## Verdict

**The preferred-source declaration is in place, guarded, and live — the
finding stays closed. One deploy-lag note for the release pipeline: the live
`/audit` page still serves the 2026-08-12 AI-search evidence record; the
2026-08-15 controlled re-run with its first `found` transitions (PR #227) is
merged on origin/main but not yet deployed.**

## What this lane checked

The finding was originally fixed by PR #42 (commit 95d2248), which added the
"## Answer Readiness: Preferred Source Pages" section to `public/llms.txt` and
`public/offer.md` (one preferred source page per controlled question), and
added the "AI Answer Readiness (dogfood 4473a99a9bc9)" guard in
`scripts/check-site.mjs` plus unit assertions in `scripts/test-agent-ui.mjs`
that fail loudly when a question is unmapped, mapped to two pages, mapped to
an unserved page, mapped away from the pricing page for a price question, or
mirrored inconsistently between the two files. Prior re-verifications:
2026-08-11, 2026-08-12, 2026-08-14, 2026-08-15.

Since the 2026-08-15 re-verification (head 50c6b39), no commit touched the
declaration files (`git diff 50c6b39..origin/main -- public/llms.txt
public/offer.md` is empty) and no commit touched the Answer Readiness guard
block in `scripts/check-site.mjs` (the `ANSWER_READINESS_HEADING` section,
its question-coverage loop, its exactly-one-page rule, its served-page
membership check, its price-ownership rule and its mirror check are
unchanged; the post-50c6b39 guard-file edits are new regions: monthly intake
cap, pricing closing-callout form, /favicon.ico fallback, retired-desk
canonical, internal-link normalization). The one Answer-Readiness-relevant
change in the range is PR #227 (d0daea9, merged 2026-08-19): the controlled
entity-and-offer re-run of 2026-08-15, which advanced the AI-search evidence
fixture and the `/audit` embed from `testedOn: 2026-08-12` to
`testedOn: 2026-08-15` — q5/google and q7/google transitioned `wrong`/`absent`
→ `found`, with the "Missing: pricing" gap from the original finding gone
(documented in `docs/evidence/ai-search/2026-08-15-controlled-rerun.md`).
`scripts/test-agent-ui.mjs` updated its q5 assertion to the `found` state;
the fixture's controlled questions are unchanged.

The lane therefore re-ran the same verification the finding demands, on the
current origin/main head (0540cf9) and against the live deployment:

1. **Source checks pass** — `npm run check` → "TinyStudio.io checks passed."
   The 4473a99a9bc9 guard still requires both `llms.txt` and `offer.md` to
   carry the Answer Readiness section, maps every controlled question (all
   eight, including q8) to exactly one served page (sitemap membership,
   either spelling), forces the price questions (q2, q7) to the pricing
   page, and fails if `offer.md` mirrors a different page. The full `npm
   test` suite passes: check, headings (6), sitemap (7), agent-worker (83),
   agent-UI (16) including the "every controlled question maps to a
   preferred source page" subtest, product-contract (8), study (2),
   first-viewport-audience (4), narrow-viewport-pages (4) — 126 tests, 0
   failures. `git diff --check` is clean.

2. **Live declaration = source** — fresh HTTPS fetches against the deployed
   `https://tinystudio.io` on 2026-08-20:

   | URL | HTTP | content-type | bytes | Answer Readiness section |
   |---|---|---|---|---|
   | `/llms.txt` | 200 | text/plain | 4607 | present |
   | `/offer.md` | 200 | text/markdown | 3855 | present |
   | `/sitemap.xml` | 200 | — | 537 (7 locs) | used for membership |

   The live section carries all eight controlled questions, each mapped to
   exactly one served page: q1 → `https://tinystudio.io/` (homepage), q2 →
   `https://tinystudio.io/pricing`, q3 → `https://tinystudio.io/audit`,
   q4 → `https://tinystudio.io/audit`, q5 →
   `https://tinystudio.io/` (homepage), q6 → `https://tinystudio.io/audit`,
   q7 → `https://tinystudio.io/pricing`, q8 →
   `https://tinystudio.io/` (homepage). Both price questions point at the
   pricing page, which owns the price; every mapped page is a served page
   per the live sitemap (`/pricing` and `/audit` both serve 200 directly,
   while the old `.html` twins 307-redirect to them); and `offer.md`
   mirrors the identical question-to-page mapping. The served bytes are
   byte-identical to `public/llms.txt` and `public/offer.md` on this head
   (`diff` empty), so the deployed pair and the guarded source cannot drift
   without changing the served bytes themselves.

3. **The pages the mapping names still answer their questions** — the
   homepage identity block still carries one `data-ai-question` row per
   controlled question (q1-q8, with q2/q7 sharing the price row), the q5 row
   answers "This site: the leak audit and the desk behind it", the q7 row
   states the $2,500-a-month desk price, and no visible homepage copy frames
   the retired Agent Desk as the offer. The pricing page states the
   $2,500-a-month desk price on a three-month minimum.

4. **Deploy-lag note (not a regression of this finding)** — the live
   `/audit` page still embeds the 2026-08-12 AI-search evidence record
   (q5/google `wrong`, q7/google `absent` "Missing: pricing"), while source
   on origin/main embeds the 2026-08-15 record (q5/google and q7/google
   `found`, the "Missing: pricing" gap gone). `/home/nish/workspaces/
   agent-state/lanes/release-state-tinystudio-io.json` pins the deployed
   sha at b4d80f1 (2026-08-17), which is an ancestor of origin/main — the
   merged-but-undelivered range includes d0daea9 (PR #227, 2026-08-19) and
   the 2026-08-20 merges #246/#247. This is the established deploy-lag
   pattern (see `docs/evidence/ai-search-evidence-lag-2026-08-12.md` and
   the release-state record); it does not affect the Answer Readiness
   declaration, which is live and correct. The next fleet-release tick
   ships the current origin/main, after which the live `/audit` embed will
   match source and this note can be cleared.

## Files touched

- `docs/evidence/ai-answer-readiness-2026-08-09.md` — appended this
  re-verification receipt (source checks, live measurement, page-truth spot
  checks, deploy-lag note).
- `.lane/reports/lane1-ai-answer-readiness-reverify-2026-08-20.md` — this
  lane report.

No product code changed: the finding's established closeout pattern is
source check + live measurement, with no code change when the declaration
already holds.

## Why the earlier receipts did not cover this

The 2026-08-15 receipt verified head 50c6b39. This receipt re-checks the
declaration, the guard, the fixture agreement and the live served bytes on
the current head (0540cf9) and against the live site on 2026-08-20, and
specifically covers the one Answer-Readiness-relevant change since then
(PR #227's 2026-08-15 controlled re-run with the first `found` transitions)
plus the release pipeline's current pinned sha. Nothing regressed the Answer
Readiness region, so the finding remains closed with no code change.
