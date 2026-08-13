# Answer Readiness: preferred source pages — repository-side declaration pass

Date: 2026-08-09
Scope: `public/llms.txt`, `public/offer.md`, `scripts/check-site.mjs`,
`scripts/test-agent-ui.mjs`, `evidence-fixtures/ai-search/README.md`.
This receipt records a deterministic, repository-side declaration. It is not
a live AI-search measurement and it claims nothing about any engine's answer
after this change.

## Why this pass exists

Dogfood finding 4473a99a9bc9 from audit run 20260808T074205Z-msk2fl3n:
"AI Answer Readiness: preferred source pages are unclear." The controlled
AI-search evidence shows what that costs:

- `q5-what-is-tinystudio-io` / google (`wrong`): the engine named
  tinystudio.io but described the retired Agent Desk — "an AI agent platform
  designed to turn business strategies ... into practical lead-to-call
  execution plans" — while the cited page, the homepage, presents the leak
  audit first. The engine read the right site and still grabbed the wrong
  description: nothing told it the homepage is the preferred source for
  "what TinyStudio is".
- `q7-what-tinystudio-io-charges` / google (`absent`): the organic results
  carried the note "Missing: pricing" even though `pricing.html` states the
  price. Nothing pointed the engine at `pricing.html` as the preferred
  source for the price.

Neither `llms.txt` nor `offer.md` declared which page owns which fact, so an
engine had to guess which of the five public pages to read for each question
a buyer asks before committing.

## What changed

1. `public/llms.txt` gained an `## Answer Readiness: Preferred Source Pages`
   section: one bullet per controlled question, each naming exactly one
   preferred source page — the page that owns the fact. "What TinyStudio
   does" and "What is tinystudio.io" map to the homepage, whose identity
   block answers them (q1 and q5); the price questions (q2, q7) map to
   `pricing.html`, which owns the price; where-based, who-with and
   client-work (q3, q4, q6) map to the audit page, which carries those
   statements and the evidence artifact.
2. `public/offer.md` mirrors the same heading and the same seven mapping
   lines, so the machine-readable pair cannot drift.
3. `scripts/check-site.mjs` now fails when:
   - either file loses the Answer Readiness section;
   - a controlled question is unmapped, mapped to two pages, or mapped to a
     page the worker does not serve (membership checked against the sitemap
     loc set, excluding `llms.txt` and `offer.md` themselves);
   - a price question (q2, q7) maps anywhere but `pricing.html`;
   - the mirror drifts (the two files no longer carry the same
     question-to-page mapping).
4. `scripts/test-agent-ui.mjs` asserts the same invariants as unit tests.
5. `evidence-fixtures/ai-search/README.md` documents the mapping in its
   "Tied surfaces" section, citing the finding it answers.

## What deliberately did not change

- The fixture: `controlled-questions.json` and `evidence.json` are
  byte-identical. Historical runs, states and verbatim captures are retained
  exactly as recorded on 2026-08-06. The audit page embed was not touched.
- No public page markup changed; the mapping only names pages that already
  state the facts it points at.
- No new live engine runs were performed, and none are claimed. The strict
  states (`found` / `wrong` / `absent` / `not-tested`) are unchanged.

## What is tested and what is not

Tested: the section, coverage, served-page membership, price ownership and
mirror guards are deterministic static checks that fail loudly on drift;
`npm run check` and `npm test` both exercise them, and this change passes
both.

Not tested: whether any engine will now cite the preferred page, or answer
the price. That is a live question this pass cannot answer, and nothing here
implies a ranking, visibility, lead or revenue outcome. The honest measure
of that question is a future controlled re-run recorded through the same
fixture, with a captured answer, cited sources and a strict state.

## Verification (reproduce)

```
npm run check
npm test
git diff --check
```

All three checks pass on this commit; the fixture files' git hashes are
unchanged relative to the commit before this pass.

## Closeout

This closes dogfood finding 4473a99a9bc9 ("AI Answer Readiness: preferred
source pages are unclear") against current main: the machine-readable pair
now declares, per controlled question, the preferred source page an engine
should read first, and CI fails if that declaration drifts, unmaps a
question, names an unserved page, or lets a price question point anywhere
but `pricing.html`.

### Closeout re-verification (added 2026-08-11)

Re-verified against the current origin/main head (8b42e0a,
"docs(evidence): close out apple touch icon finding 98a7bf8e08fc against
current main and live (#77)") after thirteen further commits touched main
since the 2026-08-09 closeout. Four of them touched the public surface or
the guard file: c5e2f2b (de-index the retired Agent Desk: `agent-desk.html`
plus a new `check-site.mjs` guard block), ac05bec (mobile tap targets:
CSS-only plus a new tap-target guard block in `check-site.mjs`), f9f0b0f
(footer daily-reads link on home), 1cc7a4e (audit-page canonical/og:url/
JSON-LD cleanup). None regressed the Answer Readiness declaration:
`public/llms.txt`, `public/offer.md`, `scripts/test-agent-ui.mjs` and
`evidence-fixtures/ai-search/` are byte-identical to the closeout commit
95d2248 (`git diff 95d2248..HEAD -- <file>` is empty for each), and the only
`check-site.mjs` edit in that range touching the guard's neighborhood is a
comment refresh in 1cc7a4e on the sitemap-membership note — the
`ANSWER_READINESS_HEADING` section, its question-coverage loop, its
exactly-one-page rule, its served-page membership check, its price-ownership
rule and its mirror check are all unchanged. The audit-page embed was not
touched (1cc7a4e changes only canonical, `og:url` and JSON-LD `@id`/`url`
lines).

Three checks:

1. Source checks on this head: `npm run check` passes — the "AI Answer
   Readiness (dogfood 4473a99a9bc9)" guard in `scripts/check-site.mjs`
   requires both `llms.txt` and `offer.md` to carry the `## Answer
   Readiness: Preferred Source Pages` section, maps every controlled
   question in the fixture to exactly one served page (sitemap membership,
   either spelling), forces the price questions (q2, q7) to `pricing.html`,
   and fails if `offer.md` mirrors a different page — and the full `npm
   test` suite passes (check, headings, sitemap, worker 53/53, UI 16/16
   including the "every controlled question maps to a preferred source
   page" subtest, contract 8/8; 90 tests total). `git diff --check` is
   clean.

2. Fresh live measurement of the deployed site (2026-08-11, HTTPS fetch
   against `https://tinystudio.io`, same deterministic checks the source
   guard runs, applied to the served bytes):

   | URL | HTTP | content-type | CSP header | bytes | Answer Readiness section |
   |---|---|---|---|---|---|
   | `/llms.txt` | 200 | text/plain | yes | 4076 | present |
   | `/offer.md` | 200 | text/markdown | yes | 3319 | present |
   | `/sitemap.xml` | 200 | — | — | — | used for membership |

   The live section carries all seven controlled questions, each mapped to
   exactly one served page: q1 → `https://tinystudio.io/` (homepage), q2 →
   `https://tinystudio.io/pricing.html`, q3 → `https://tinystudio.io/audit.html`,
   q4 → `https://tinystudio.io/audit.html`, q5 →
   `https://tinystudio.io/` (homepage), q6 → `https://tinystudio.io/audit.html`,
   q7 → `https://tinystudio.io/pricing.html`. Both price questions point at
   `pricing.html`, which owns the price; every mapped page is a served page
   per the live sitemap; and `offer.md` mirrors the identical
   question-to-page mapping. The served bytes are byte-identical to
   `public/llms.txt` and `public/offer.md` on this head, so the deployed
   pair and the guarded source cannot drift without changing the served
   bytes themselves.

3. The fixture is untouched: `evidence-fixtures/ai-search/controlled-questions.json`
   and `evidence.json` remain byte-identical to the closeout commit, so the
   checks above ran against the same question registry the 2026-08-09 pass
   used.

### Closeout re-verification (added 2026-08-12)

Re-verified against the current origin/main head (18128e8, "fix(public): serve
rel=icon on /brief-requested and guard favicon links in check-site.mjs (#113)")
after twenty-six further commits touched main since the 2026-08-11
re-verification (b04b225, head 8b42e0a). The only change to the declaration
itself is an extension, not a regression: 2ae7504 (#102, "truthful search
intent bridge for 'conversion audit'") added `q8-conversion-audit` to the
controlled-question registry and mapped it to the homepage as its preferred
source page in both `llms.txt` and `offer.md`, grew the audit-page embed's
question rows to eight, and stated the truthful conversion-audit bridge in
both Current Offer sections. The declaration now names eight controlled
questions, up from seven; its own receipt is
`docs/evidence/conversion-audit-search-intent-bridge-2026-08-11.md`. The other
commits in the range touching the guard file or the public surface did not
touch the Answer Readiness region: 1e78ecf (#106) refactors the copy-guard
head to read the current homepage instead of the retired `/agent-desk` and
moves the retired page's framing guards below it (verified: no diff lines in
the `ANSWER_READINESS_HEADING` block, its question-coverage loop, its
exactly-one-page rule, its served-page membership check, its price-ownership
rule or its mirror check); d4a2c30 (#98) edits document titles; 9302611 (#85)
and 18128e8 (#113) add favicon markup plus a favicon guard block; 6f85c61
(#96) and 0ad7481 (#86) are CSS-only tap-target fixes; 37ddaed (#101) locks
the wrangler toolchain. `scripts/test-agent-ui.mjs` and
`evidence-fixtures/ai-search/evidence.json` are byte-identical to the
2026-08-11 re-verification commit.

Three checks:

1. Source checks on this head: `npm run check` passes — the "AI Answer
   Readiness (dogfood 4473a99a9bc9)" guard in `scripts/check-site.mjs`
   requires both `llms.txt` and `offer.md` to carry the `## Answer
   Readiness: Preferred Source Pages` section, maps every controlled
   question in the fixture (now eight, including q8) to exactly one served
   page (sitemap membership, either spelling), forces the price questions
   (q2, q7) to `pricing.html`, and fails if `offer.md` mirrors a different
   page — and the full `npm test` suite passes (check, headings, sitemap,
   worker 55/55, UI 16/16 including the "every controlled question maps to
   a preferred source page" subtest, contract 8/8; 92 tests total).
   `git diff --check` is clean.

2. Fresh live measurement of the deployed site (2026-08-12, HTTPS fetch
   against `https://tinystudio.io`, the same deterministic checks the
   source guard runs, applied to the served bytes):

   | URL | HTTP | content-type | bytes | Answer Readiness section |
   |---|---|---|---|---|
   | `/llms.txt` | 200 | text/plain | 4458 | present |
   | `/offer.md` | 200 | text/markdown | 3701 | present |
   | `/sitemap.xml` | 200 | — | 537 (7 locs) | used for membership |

   The live section carries all eight controlled questions, each mapped to
   exactly one served page: q1 → `https://tinystudio.io/` (homepage), q2 →
   `https://tinystudio.io/pricing.html`, q3 → `https://tinystudio.io/audit.html`,
   q4 → `https://tinystudio.io/audit.html`, q5 →
   `https://tinystudio.io/` (homepage), q6 → `https://tinystudio.io/audit.html`,
   q7 → `https://tinystudio.io/pricing.html`, q8 →
   `https://tinystudio.io/` (homepage). Both price questions point at
   `pricing.html`, which owns the price; every mapped page is a served page
   per the live sitemap; and `offer.md` mirrors the identical
   question-to-page mapping. The served bytes are byte-identical to
   `public/llms.txt` and `public/offer.md` on this head, so the deployed
   pair and the guarded source cannot drift without changing the served
   bytes themselves.

3. The fixture is untouched by this range except for the deliberate q8
   registry entry from 2ae7504: `evidence-fixtures/ai-search/evidence.json`
   remains byte-identical to the 2026-08-11 re-verification, and the
   checks above ran against the same question registry the guard reads.

## Limitation (unchanged)

This is still a repository-side declaration plus a served-bytes measurement,
not a live engine run: nothing here claims that any engine now cites the
preferred page or answers the price. That question remains a future
controlled re-run recorded through the same fixture, with a captured answer,
cited sources and a strict state — and the tracker cannot re-open the
declaration itself, because it is now guarded on both sides of the deploy
boundary.
