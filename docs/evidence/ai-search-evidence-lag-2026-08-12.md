# PR #43 AI-search evidence on /audit — fresh deploy lag past 5864e39

Date: 2026-08-12
Scope: fresh live-delivery finding in the same class as the closed
`676/703/716/742/934/953/994` ship items. Merged PR #43
(`fix/ai-search-rerun-entity-offer`, "evidence(ai-search): re-run the
controlled entity-and-offer questions after the llms/offer mirror went live")
is on origin/main but is **not** live: the deployed site still embeds the
2026-08-06 evidence artifact whose q5 ground truth teaches the retired
self-serve Agent Desk as what tinystudio.io is. This receipt records the gap
against the current origin/main head and the deployed site, names the
deployment blocker, and gives the release pipeline a receipt to act on when
credentials are restored. It is behavior evidence, not a source check, and it
does not claim anything about ranking, traffic, or search results.

## What was measured

Merged PR #43 carries two commits that rewrite the AI-search evidence the
`/audit` page embeds in `public/audit.html`:

- `8606b0c` — "evidence(ai-search): re-run the controlled entity-and-offer
  questions after the llms/offer mirror went live" (2026-08-12T08:17:32+05:30):
  the embedded artifact advances from `testedOn: 2026-08-06` to
  `testedOn: 2026-08-09` with nine fresh captured runs.
- `ed62202` — "fix(evidence): align AI-search q5 ground truth with the current
  offer, not the retired Agent Desk" (2026-08-12T08:19:45+05:30): q5's truth
  changes from "the leak audit, plus the Agent Desk behind it" (retired
  product) to "the free leak audit of high-ticket service homepages, and the
  human-reviewed desk that closes what the audit finds" (current offer).

The gap's acceptance criteria (this class's pattern, from the prior ship
items):

- fleet-release (or equivalent `wrangler deploy`) ships `origin/main` ≥ `ad9cee3`;
- live `/audit` embedded artifact matches source (`testedOn: 2026-08-09`, q5
  truth naming the human-reviewed desk);
- `release-state-tinystudio-io.json` sha advances past `5864e39`;
- `npm run check` on the shipped revision.

## Environment

- Live target: `https://tinystudio.io/audit`, served by the deployed
  Cloudflare Worker's ASSETS binding (`src/worker.js` serves the static
  `public/audit.html` verbatim).
- Release state: `/home/nish/workspaces/agent-state/lanes/release-state-tinystudio-io.json`
  (fleet-release's last-successful-release record).
- Source baseline: `origin/main` at `ad9cee3` ("Merge pull request #43",
  2026-08-12T08:24:14+05:30), fetched fresh via `git fetch origin`; live bytes
  were fetched over HTTPS and compared against `public/audit.html` on that
  head.

## Results (2026-08-12)

1. Main carries the fix and the pinned release does not:
   `git merge-base --is-ancestor 8606b0c origin/main` and
   `git merge-base --is-ancestor ed62202 origin/main` both confirm PR #43's
   commits are ancestors of the origin/main head `ad9cee3`. The only commits
   in `5864e39..origin/main` touching `public/` or `src/` are exactly those
   two. `release-state-tinystudio-io.json` pins
   `sha 5864e39274c830440ebc3dbd0a26f03865c8961d` (2026-08-12T06:37:42) —
   deployed ~1h47m **before** PR #43 merged (08:24:14+05:30).

2. Live `/audit` is byte-identical to the pinned release and still teaches
   the retired Agent Desk:

   | Check | Result |
   |---|---|
   | md5 of live `https://tinystudio.io/audit` | `4018721f9f657c1400a5b38048e9a7c3` |
   | md5 of `public/audit.html` at `5864e39` | `4018721f9f657c1400a5b38048e9a7c3` (identical) |
   | md5 of `public/audit.html` at `origin/main` (`ad9cee3`) | `72116e4a6daa6a26280b647e8ad171be` |
   | embedded `testedOn` live | `2026-08-06` |
   | embedded q5 truth live | `tinystudio.io is TinyStudio's own site: the leak audit, plus the Agent Desk behind it.` |
   | embedded `testedOn` on `origin/main` | `2026-08-09` |
   | embedded q5 truth on `origin/main` | `tinystudio.io is TinyStudio's own site: the free leak audit of high-ticket service homepages, and the human-reviewed desk that closes what the audit finds.` |

   The live page therefore still presents the retired self-serve Agent Desk
   as part of the current offer — the exact parity failure merged PR #43
   fixes in source — while live `llms.txt` and `offer.md` (verified
   byte-identical to origin/main this run) already teach the human-reviewed
   desk. Live `/audit` is the only public page that differs from origin/main:
   `/`, `/agents`, `/pricing`, `/specimen`, `/brief-requested`,
   `/agent-desk`, `llms.txt`, and `offer.md` all match their `public/`
   sources byte-for-byte (fresh HTTPS fetches, 2026-08-12).

3. No open PR carries this ship. Open ship-verify PRs #140 (past `b004c11`,
   structured data) and the merged #141 (past `fa8d83c`, App Store citation)
   cover older SHAs; #139 covers the `#28/#30` fleet-release item at
   `18128e8`; #146 closes the PR #42+#43 serial-merge review item (both
   merged) without verifying live deployment of #43's content. Nothing open
   mentions `5864e39` or `ad9cee3`.

4. Source checks on the to-be-shipped revision: `npm run check` passes
   ("TinyStudio.io checks passed.") on a clean checkout of origin/main
   `ad9cee3`; the full `npm test` suite passes — headings 6/6, sitemap 7/7,
   worker 55, ui 16, contract 8 (92 tests, 0 failures). The browser walk
   (desktop 1280x900 + mobile 390x844, all seven pages) shows no overflow and
   no console errors beyond the known `/brief-requested` placeholder-gtag CSP
   violation owned by PR #136.

## Deployment blocker (Nish-reserved)

The gap cannot be closed from a worker lane: the fleet release pipeline is
blocked on an expired Cloudflare credential. `fleet-release.log` records
`2026-08-12T08:54:07 NOTIFY: tinystudio-io: CANNOT RELEASE: wrangler is not
authenticated (login expired?) - run wrangler login or set
CLOUDFLARE_API_TOKEN where this timer runs; nothing can deploy until then`,
and the local `wrangler whoami` confirms `You are not authenticated`.
Restoring the wrangler login / `CLOUDFLARE_API_TOKEN` (Nish-reserved) is the
only remaining action; the next fleet-release tick then ships `origin/main`
≥ `ad9cee3` automatically and this item's acceptance becomes verifiable
live.

## Closeout status

Open — acceptance not yet met against the live site (live `/audit` still
serves the 2026-08-06 artifact). The receipt above pins the exact gap so the
item can be re-verified the moment the credential is restored. No product
code change is proposed: the fix is merged and merely undelivered.
