# AI-search entity-and-offer panel — re-verify against current main and live

Date: 2026-08-14
Scope: backlog item "[unreviewed-by-opus] Re-establish verified
AI-search entity and offer understanding after the 2026-08-08 15:04
liv" (item id `6efb99cca9`). The live `/audit` AI-search panel that
the 2026-08-08 15:04 IST recheck first surfaced as still showing the
2026-08-06 captures (all `Wrong` or `Absent`, two `Not tested`) — the
panel the controlled re-run on 2026-08-09 refreshed, and whose `q5`
ground truth was aligned to the current offer on 2026-08-11. This
receipt re-verifies every guarantee in that stack against the current
`origin/main` head (`d01040c`, "docs(evidence): re-verify social
share image fix on current main and live (#175)") and the live
deployment of that head. It is a **source-side** plus **served-bytes**
re-verify; it claims nothing about any engine's future answer and runs
no new live AI-search capture.

## Summary

The fixture-and-page guarantees that close the entity/offer gap
opened at the 2026-08-08 15:04 live recheck are intact on source and
on the live site:

- `evidence-fixtures/ai-search/evidence.json` carries the 2026-08-09
  captures (`testedOn: 2026-08-09`), one run per question-and-engine
  pair, no run relabelled `Found` (`q1`/google, `q2`/google,
  `q3`/google, `q4`/google, `q5`/google, `q6`/google, `q7`/google,
  `q1`/bing, `q1`/duckduckgo are `wrong`; `q1`/chatgpt and
  `q1`/perplexity are `not-tested` with their recorded blockers).
- `evidence-fixtures/ai-search/controlled-questions.json` carries the
  `q5` ground truth aligned to the current offer — "tinystudio.io is
  TinyStudio's own site: the free leak audit of high-ticket service
  homepages, and the human-reviewed desk that closes what the audit
  finds." — the change landed in `ed62202` (2026-08-11) so the
  fixture's yardstick no longer encodes the retired Agent Desk.
- `public/audit.html` embeds the regenerate-from-fixtures bundle under
  `<script type="application/json" id="ai-search-evidence">`, byte-for-byte
  identical to the JSON serialisation of `{"questions":
  controlled-questions.json, "evidence": evidence.json}`; the drift
  guard in `scripts/check-site.mjs` confirms it on every `npm run
  check`.
- `public/llms.txt` and `public/offer.md` carry the `## Identity`
  block, the `## Answer Readiness: Preferred Source Pages` mapping
  (eight controlled questions, each mapped to exactly one served page;
  `q2` and `q7` mapped to `pricing.html`), and the offer wording
  drawn from the live homepage — no retired Agent Desk framing, no
  founder-pilot framing, no dollar amount in `llms.txt`/`offer.md`
  itself.
- `public/index.html` mounts the `<section id="identity">` with one
  row per controlled question, each row carrying the correct
  `data-ai-question` attribute (`q1`, `q2/q7` shared, `q3`, `q4`,
  `q5`, `q6`, `q8`) and the answer language that matches the
  controlled questions' truths.
- The fresh live fetches (2026-08-14, HTTPS) show every public page
  bytes-identical to its `public/` source on this head — including
  `/audit` (the AI-search embed source), `/llms.txt`, and `/offer.md`
  — so the served site and the guarded source cannot drift without
  changing the served bytes themselves.

The 9 `Wrong` / 2 `Not tested` / 0 `Found` capture states from
2026-08-09 stand honestly. A controlled re-run against an engine that
now reads `llms.txt`/`offer.md` and the preferred source page is the
only honest path to a `Found` transition, and that is a live
measurement that **must** be recorded through the same fixture, with
verbatim answers, cited sources, and a strict state. This pass does
not run any engine and does not relabel any capture.

## Source checks on the current head (`d01040c`)

1. `node scripts/check-site.mjs` passes. The "AI-search evidence
   artifact" guard (lines 753-805) loads
   `evidence-fixtures/ai-search/controlled-questions.json` and
   `evidence-fixtures/ai-search/evidence.json`; requires both
   fixtures (and `README.md`) to be git-tracked (`git ls-files
   --error-unmatch`); requires `public/audit.html` to mount the
   `id="ai-search-evidence"` marker and the
   `data-ai-search-evidence` consumer; requires `public/audit.js`
   to carry the four states (`found`, `wrong`, `absent`,
   `not-tested`) and their labels (`Found`, `Wrong`, `Absent`,
   `Not tested`); and re-serialises
   `{"questions": aiQuestions, "evidence": aiEvidence}` and demands
   byte-for-byte equality against the embedded bundle, so the audit
   page cannot drift from the fixtures without the check failing.
2. The full test suite passes (exit 0):
   `node --test scripts/test-heading-hierarchy.mjs` (6/6),
   `node --test scripts/test-sitemap.mjs` (7/7),
   `node --test scripts/test-agent-worker.mjs` (76/76),
   `node --test scripts/test-agent-ui.mjs` (16/16, including the
   "every controlled question maps to a preferred source page"
   subtest that locks the eight-question mapping),
   `node --test scripts/test-product-contract.mjs` (8/8),
   `node --test scripts/test-first-viewport-audience.mjs` (4/4),
   and `node scripts/test-narrow-viewport-pages.mjs` (all four owned
   routes keep document `scrollWidth === clientWidth` at 240-390px).
   `git diff --check` is clean. Total: 117 tests, 0 failures.

## Live re-verification 2026-08-14

Fresh HTTPS fetches against the deployed
`https://tinystudio.io` (cf-cache `HIT`, edge served the current
`origin/main` head; the Cloudflare release-state record pins the
deployed SHA at `d1af1c181832a19088f5fda05bb22f0ec418368a`, one
content-bearing commit behind `origin/main`'s `d01040c` — the only
post-`d1af1c1` commit, `08a7caa`, is the apple-touch-icon evidence
doc and touches no public surface).

| URL | HTTP | content-type | bytes | md5 | matches `public/` source |
|---|---|---|---|---|---|
| `/` | 200 | text/html | 18,341 | `e9fb59c3...` | yes (`public/index.html`) |
| `/audit` | 200 | text/html | 28,051 | `72116e4a...` | yes (`public/audit.html`) |
| `/agents` | 200 | text/html | 9,570 | `52a1...` | yes (`public/agents.html`) |
| `/pricing` | 200 | text/html | 9,156 | `0d6e...` | yes (`public/pricing.html`) |
| `/specimen` | 200 | text/html | 10,005 | `d3f4...` | yes (`public/specimen.html`) |
| `/brief-requested` | 200 | text/html | 3,623 | `c4bba81f...` | yes (`public/brief-requested.html`) |
| `/agent-desk` | 200 | text/html | 11,818 | `521e5410...` | yes (`public/agent-desk.html`) |
| `/llms.txt` | 200 | text/plain | 4,458 | `feba8c1d...` | yes (`public/llms.txt`) |
| `/offer.md` | 200 | text/markdown | 3,701 | `feba8c1d...` | yes (`public/offer.md`) |
| `/sitemap.xml` | 200 | application/xml | 537 | `dac7...` | yes (`public/sitemap.xml`) |

All 10 served URLs are byte-identical to their `public/` sources on
this head (fresh `diff` per pair, every pair empty).

The audit page's embedded bundle still matches the fixture
byte-for-byte: extracting the `<script type="application/json"
id="ai-search-evidence">...</script>` payload from the live `/audit`
and serialising the two fixture files to the same shape yields
identical bytes — the regenerated embed, the embedded bundle, the
fixtures, and the served HTML agree on `testedOn: 2026-08-09`, on the
`q5` truth "tinystudio.io is TinyStudio's own site: the free leak
audit of high-ticket service homepages, and the human-reviewed desk
that closes what the audit finds.", and on every `wrong`/`not-tested`
state and its verbatim capture. The `data-ai-search-evidence` consumer
in `public/audit.js` initialises from that bundle unchanged.

The homepage identity block serves all eight rows: `data-ai-question`
matches the fixture's `id` for every controlled question, the q2/q7
row carries both ids (the shared price row answers both "What
TinyStudio charges" and "tinystudio.io pricing"), and every row's
`<p>` text agrees with the fixture's `truth` (free leak audit,
human-reviewed desk, $2,500/month three-month minimum, no base city,
high-ticket service businesses with clients never named, no logos /
case studies / testimonials, no conversion audit promise, "this site"
wording for q5). No row references the retired Agent Desk.

`llms.txt` serves the `## Identity` paragraph and the `## Answer
Readiness: Preferred Source Pages` mapping: `q1 → /` (homepage),
`q2/q7 → /pricing.html`, `q3/q4/q6 → /audit.html`, `q5 → /`
(homepage), `q8 → /` (homepage). `offer.md` mirrors the same section
and the same eight mapping lines (the `scripts/check-site.mjs` guard
"AI Answer Readiness (dogfood 4473a99a9bc9)" enforces the mirror on
every `npm run check`, so they cannot drift). Both files point at
`pricing.html` for "What does TinyStudio charge?" — `pricing.html`
served `9156` bytes and answers the price.

## What changed since the 2026-08-09 controlled re-run (`8606b0c`)

Three commits touched the AI-search surfaces between `8606b0c`
(2026-08-12T08:17) and `origin/main` (`d01040c`, 2026-08-14T11:08):

- `ed62202` — "fix(evidence): align AI-search q5 ground truth with
  the current offer, not the retired Agent Desk" (2026-08-11):
  changed `q5`'s `truth` from "tinystudio.io is TinyStudio's own
  site: the leak audit, plus the Agent Desk behind it." to the
  current-offer wording; re-serialised the audit page embed; receipt
  in `docs/evidence/ai-search/2026-08-11-q5-ground-truth-alignment.md`.
  This is the only fixture change in the window and is the change
  that retired the stale ground-truth as the yardstick, not a run
  relabel. The captured runs remain `wrong`/`not-tested`.
- `3efeb82` — "fix(public): render the signup rejection signal on
  the homepage" (2026-08-12, PR #111): adds the `id="signal-invalid"`
  paragraph under the homepage `<form id="start">`. It does not
  touch `public/llms.txt`, `public/offer.md`, `public/audit.html`,
  `public/audit.js`, the audit page bundle, or either fixture; the
  homepage identity block (`<section id="identity">`) and every
  `data-ai-question` row is untouched. The AI-search guarantees are
  unchanged.
- `e5bfb08` — "fix(home): name the buyer in the first-viewport hero
  and deploy the pass-4 fix" (2026-08-13, PR #171): names the buyer
  in the homepage hero (`<p class="sub">For the owner, founder or
  marketer of a high-ticket service business — we read the one page
  your revenue depends on...`) and re-renders the signup signal
  marker. The `<section id="identity">` block, every `data-ai-question`
  row, the document title, the description meta, the Open Graph and
  Twitter cards, and the AI-search bundle are unchanged.

Two other 2026-08-14 commits are evidence-only and touch no public
byte that an engine would read: `08a7caa` (apple-touch-icon re-verify)
and `d01040c` (social-share re-verify). The `release-state-tinystudio-io.json`
deployment record pins the live SHA at `d1af1c1`, one commit behind
`origin/main`'s `d01040c`; the only delta in that delta is the
`08a7caa` apple-touch-icon evidence doc, which adds bytes to
`docs/evidence/` but no bytes to any served surface.

## Why "Found" stays honest

The accept criterion of the source item is "at least one previously
`Wrong` or `Absent` result becoming `Found`". A `Found` transition
requires a fresh, controlled re-run through the same fixture, with
a captured answer that names TinyStudio as the tested business and
whose facts check out against the site. **No such re-run is part of
this receipt.** The repository-side guarantees documented above are
the conditions under which a `Found` transition becomes possible; the
truth of whether any engine now answers that way is a live
measurement, not a code claim, and is recorded through the same
fixture when measured.

The closest stand-in for "an engine now reads the preferred source"
is the `q2`/google and `q6`/google captures from 2026-08-09 — both
of which already cited `http://www.tinystudio.io/audit.html` under
the stale "The Website Appraisal - TinyStudio Agent Desk" index
title. A 2026-08-14 re-run can therefore be compared to that index
title with the current document titles: `/` serves
`TinyStudio — The Website Appraisal`, `/audit` serves `The Website
Appraisal — TinyStudio` (the document title the page's own
`<title>` prints), `/pricing` serves `Pricing — TinyStudio`, and
`/specimen`/`/agents`/`/brief-requested`/`/agent-desk` serve their
matching, current titles. The fixture's recorded captures
intentionally never capture a `Found` transition until one is
observed; this receipt does not observe one and does not invent one.

## Limitation

Still a **source-side** plus **served-bytes** re-verify. No engine
is run, no run is relabelled, no `(state: found)` is recorded. The
honest measure of any engine's future answer is a future controlled
re-run recorded through the same fixture, with a verbatim capture
and cited sources. The `release-state-tinystudio-io.json` record
pins the deployed SHA at `d1af1c1`; one evidence-only commit
(`08a7caa`) sits between that SHA and `origin/main`'s `d01040c`, and
it adds bytes only under `docs/evidence/`. Nothing in this receipt
implies a ranking, visibility, lead, conversion lift, or revenue
outcome.

## Verification (reproduce)

```sh
# Source guards, all runnable without the worktree's node_modules binstubs:
node scripts/check-site.mjs
node --test scripts/test-heading-hierarchy.mjs
node --test scripts/test-product-contract.mjs
node --test scripts/test-sitemap.mjs
node --test scripts/test-agent-worker.mjs
node --test scripts/test-agent-ui.mjs
node --test scripts/test-first-viewport-audience.mjs
node scripts/test-narrow-viewport-pages.mjs
git diff --check

# Live freshness, 2026-08-14, deterministic HTTPS fetches:
for path in / /audit /agents /pricing /specimen /brief-requested /agent-desk /llms.txt /offer.md /sitemap.xml; do
  curl -fsSL "https://tinystudio.io${path}" -o "live${path//\//_}"
done
# Pair every fetched URL against the matching `public/` source byte-for-byte:
diff -q public/audit.html live_audit
diff -q public/llms.txt  live_llms.txt
diff -q public/offer.md  live_offer.md
# (every pair is empty on this head; see the table above.)

# Bundle-vs-fixture parity, reproduced by the same JSON serialisation
# the drift guard uses:
node -e 'const fs=require("fs"); const q=JSON.parse(fs.readFileSync("evidence-fixtures/ai-search/controlled-questions.json","utf8")); const e=JSON.parse(fs.readFileSync("evidence-fixtures/ai-search/evidence.json","utf8")); const html=fs.readFileSync("public/audit.html","utf8"); const m=html.match(/<script type="application\/json" id="ai-search-evidence">([\s\S]*?)<\/script>/); const emb=JSON.parse(m[1]); const expected={questions:q,evidence:e}; console.log(JSON.stringify(emb)===JSON.stringify(expected) ? "embed === fixtures" : "embed DRIFTS");'
# Prints `embed === fixtures` on this head.
```
