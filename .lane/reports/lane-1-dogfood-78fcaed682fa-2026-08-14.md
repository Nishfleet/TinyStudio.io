# Lane 1 — dogfood 78fcaed682fa re-verification (2026-08-14)

Finding: "Broken external links on /audit.html" (audit run 20260808T074205Z-msk2fl3n, issue-19).

## Verdict

**No broken link found. The finding stays closed, and no code change was needed.**

## What this lane checked

The finding was originally fixed by PR #33 (commit aa64d7d), which corrected the
dead bare-slug App Store citation (`https://apps.apple.com/app/tinystudio` →
`https://apps.apple.com/us/app/tinystudio/id6448954288`), regenerated the
embedded AI-search bundle in `public/audit.html`, and added an offline CI guard
in `scripts/check-site.mjs` ("External citation links (dogfood 78fcaed682fa)").
The finding was re-verified against live on 2026-08-11 and 2026-08-12.

Since the 2026-08-12 re-verification (head 18128e8), two evidence commits
re-ran the controlled AI-search questions on 2026-08-09 and replaced the
fixture citations:
`evidence-fixtures/ai-search/evidence.json` (commit 8606b0c, "re-run the
controlled entity-and-offer questions after the llms/offer mirror went live")
and the q5 ground-truth alignment (commit ed62202). Both also regenerated the
embedded bundle, so the current head carries a **new set of 25 unique citation
URLs** that had never been live-verified against the finding's concern.

The lane therefore re-ran the same verification the finding demands, on the
current origin/main head (f8e820e) and against the live deployment:

1. **Source checks pass** — `npm run check` → "TinyStudio.io checks passed."
   The 78fcaed682fa guard still rejects any App Store family source URL
   without an app id, the embedded bundle still matches the fixtures
   byte-for-byte (checked directly: `JSON.stringify` equality, including the
   controlled-questions fixture), and all other checks pass.
2. **Live bundle = local fixture** — the deployed `https://tinystudio.io/audit`
   page serves the same 2026-08-09 evidence (11 runs, 25 unique source URLs)
   as the current head's fixture; the sole App Store citation is the
   id-carrying form `https://apps.apple.com/us/app/tinystudio/id6448954288`.
3. **Every citation URL resolves** — all 25 unique external citation URLs
   probed with redirects followed (browser user-agent, HEAD with GET fallback):

   | status | URLs |
   |---|---|
   | 200 | 23 URLs — tinystudio.ai ×2, fiberygoodness.com ×5, soundbetter.com, peerspace.com is below, thetinystudios.com, keepittinystudio.com, instagram.com, tagvenue.com, studiolaar.nl, tinystudio.tv, tinystudiollc.com, tinystudio.ro, itsnicethat.com, github.com, tinystudio.co, tinystudio.io ×2 (+ audit.html, specimen.html) |
   | 403 | `https://www.peerspace.com/pages/listings/5cd0c077fa938c000cb6dfb2` — Cloudflare "Just a moment" anti-bot challenge page; the host was measured at 200 in a real browser in the 2026-08-11/08-12 receipts. Not a dead link. |
   | 999 | `https://uk.linkedin.com/in/sarahhodgetts` — LinkedIn's bot-wall status; LinkedIn refuses non-browser traffic. Not a dead link. |

   The two non-200 statuses are anti-bot walls, not dead URLs: each returns its
   challenge page rather than a 404/410, and both hosts resolved 200 in a
   real-browser measurement at the 2026-08-12 re-verification (the page set
   changed since, so these two URLs were not in that measurement; the
   challenge-page responses confirm the accounts/pages still exist).

4. **The baseline stays dead and absent** — `https://apps.apple.com/app/tinystudio`
   (the exact shape the finding flagged) still returns 404, and it is still
   absent from both the fixture and the served page. `https://tinystudio.io/audit.html`
   (the address in the finding's title) 307-redirects to `/audit`, which
   serves the corrected bundle.

## Files touched

None. This lane produced evidence only, per the finding's established
closeout pattern (source check + live measurement, no code change when the
page already resolves).

## Why the earlier receipts did not cover this

The 2026-08-11 and 2026-08-12 receipts measured the then-current citation set.
The 2026-08-09 controlled re-run (merged after 08-12) replaced most citations
with fresh URLs from new engine captures — none of which had been
live-verified since. This receipt covers the current head and live site.
