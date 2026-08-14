# Lane 1 — AI-search entity-and-offer re-verification (2026-08-14)

Item: "[unreviewed-by-opus] Re-establish verified AI-search entity
and offer understanding after the 2026-08-08 15:04 liv"
(item id `6efb99cca9`).

## Verdict

**Repository-side guarantees that close the entity/offer gap from
the 2026-08-08 15:04 IST live recheck are intact on source and on
the live site, on the current `origin/main` head (`d01040c`). No
code change was needed. The remaining accept criterion (a
controlled re-run through the fixture that yields a `Found`
transition) is genuinely a live-engine measurement and is honestly
left as the next step.**

## What this lane checked

The 2026-08-08 15:04 live recheck surfaced that `/audit`'s AI-search
panel still rendered the 2026-08-06 captures (every run `Wrong` or
`Absent`, two `Not tested`) after PR #19 (commit `6172ef9`,
"mirror TinyStudio identity and the Website Appraisal in
llms.txt/offer.md") and PR #18 (`add1166`, homepage identity block)
had merged and were deployed. The 2026-08-09 controlled re-run
(commit `8606b0c`) refreshed the captured runs and confirmed the gap
honestly; the 2026-08-11 q5 ground-truth alignment (commit `ed62202`)
retired the stale Agent Desk ground truth without relabelling any
captured run, so the fixture's yardstick no longer encodes the
retired product. Subsequent commits on `origin/main` are content-only
(`3efeb82` signup signal, `e5bfb08` buyer hero, `b81281f` specimen
CTA, `5de5187` agents CTA, `885a7a9` audit CTA, `4fb2084` agents
heading, `dc1542a` apple-touch-icon, `60d045c` ads tag) and do not
touch the AI-search surfaces.

The lane therefore re-verified, on the current `origin/main` head
(`d01040c`, "docs(evidence): re-verify social share image fix on
current main and live (#175)") and against the live deployment:

1. **Source checks pass** — `node scripts/check-site.mjs` →
   "TinyStudio.io checks passed." The AI-search evidence-artifact
   guard (`scripts/check-site.mjs` lines 753-805) requires the two
   fixture files plus the README to be git-tracked, the audit page
   to mount the `id="ai-search-evidence"` marker and the
   `data-ai-search-evidence` consumer, `public/audit.js` to carry
   the four states (`found`, `wrong`, `absent`, `not-tested`) and
   their labels, and the audit-page embedded bundle to equal
   `{"questions": aiQuestions, "evidence": aiEvidence}` byte-for-byte.
   The full test suite passes (117 tests, 0 failures).
2. **Bundle == fixture** — extract the embedded bundle from
   `public/audit.html` and serialise the two fixture files; the
   strings are byte-equal. Runs: 11 (9 `wrong`, 2 `not-tested`,
   0 `found`); `testedOn`: `2026-08-09`; `q5` truth reads "tinystudio.io
   is TinyStudio's own site: the free leak audit of high-ticket
   service homepages, and the human-reviewed desk that closes what
   the audit finds." (current offer, not retired Agent Desk).
3. **Live served == source bytes** — fresh HTTPS fetches on
   2026-08-14 for `/`, `/audit`, `/agents`, `/pricing`,
   `/specimen`, `/brief-requested`, `/agent-desk`, `/llms.txt`,
   `/offer.md`, `/sitemap.xml` are byte-identical to their `public/`
   sources on this head (every `diff -q` is empty). The Cloudflare
   release-state record (`/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`)
   pins the deployed SHA at `d1af1c1`, one evidence-only commit
   (`08a7caa`, apple-touch-icon re-verify) behind `origin/main`'s
   `d01040c`; that commit touches no public surface.

The full evidence is in
`docs/evidence/ai-search/2026-08-14-controlled-rerun-reverify.md`
(committed and pushed in this branch).

## What this lane did **not** do

- Did not run any AI engine. No `Found` transition is recorded.
- Did not relabel any captured run. All 9 `Wrong` / 2
  `Not tested` / 0 `Found` states from 2026-08-09 stand.
- Did not change code or fixtures. The fixture files and the audit
  page embed remain byte-identical to `origin/main`'s `d01040c`.
- Did not chase the gap to `Found`. The honest path to that is a
  controlled re-run through the same fixture by a worker with
  browser access; this lane does not have that capability.

## Files written

- `docs/evidence/ai-search/2026-08-14-controlled-rerun-reverify.md`
  (new, 262 lines) — full source-side + served-bytes re-verify with
  reproduction block.
- This report (`.lane/reports/docs-ai-search-entity-offer-rereverify-2026-08-14.md`).

## Branch / PR

- Branch: `docs/ai-search-entity-offer-rereverify-2026-08-14`
- Pushed: yes (one commit, the evidence doc).
- PR: pending — see
  `https://github.com/nish3451/TinyStudio.io/pull/new/docs/ai-search-entity-offer-rereverify-2026-08-14`.

## Honest outcome for the item

The "re-establish verified AI-search entity and offer
understanding" item is **partially verified** by this lane: every
guarantee the repository controls is intact and provably live. The
last step — a controlled re-run that proves an engine now answers
with tinystudio.io — is open, requires a browser-equipped worker,
and remains honestly the right next packet rather than a silent
relabel.
