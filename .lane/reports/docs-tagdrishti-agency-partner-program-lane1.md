# Lane 1 report: tinystudio-io — TagDrishti agency partner program

Item: `17c45c2150` — "TagDrishti ships an agency partner program (30% recurring, white-label, per-client status pag" [unreviewed-by-opus]

Branch: `docs-tagdrishti-agency-partner-program-lane1`

## Outcome

Wrote an internal competitive-intelligence assessment. TagDrishti's Agency Partner Program is live (HTTP 200). All three claimed features are backed by verbatim quotes from this run's `curl -L` bodies. No product surface changed. Item was not already present on origin/main (zero `agency partner program` hits; no `docs/tagdrishti-agency-partner-program-2026-08-23.md`).

## Files created

- `docs/tagdrishti-agency-partner-program-2026-08-23.md`
- `.lane/reports/docs-tagdrishti-agency-partner-program-lane1.md` (this file)

## Live fetches (this run, 2026-08-23)

Bodies saved under `/tmp/opencode/` (not in the worktree). Commands and raw status + effective-URL lines:

```
curl -sL -o /tmp/opencode/tagdrishti-for-agencies.html -m 25 -w '%{http_code} %{url_effective}\n' https://www.tagdrishti.com/for-agencies
200 https://www.tagdrishti.com/for-agencies
title: For Agencies: White-Label Tag Monitoring | TagDrishti

curl -sL -o /tmp/opencode/tagdrishti-solutions-agencies.html -m 25 -w '%{http_code} %{url_effective}\n' https://www.tagdrishti.com/solutions/agencies
200 https://www.tagdrishti.com/solutions/agencies
title: For Analytics Agencies Running 10+ Clients | TagDrishti

curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/
200 https://tinystudio.io/

curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/audit
200 https://tinystudio.io/audit

curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/pricing
200 https://tinystudio.io/pricing

curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/offer.md
200 https://tinystudio.io/offer.md

curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://tinystudio.io/llms.txt
200 https://tinystudio.io/llms.txt
```

Re-check (acceptance form):

```
$ curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://www.tagdrishti.com/for-agencies
200 https://www.tagdrishti.com/for-agencies

$ curl -sL -o /dev/null -m 25 -w '%{http_code} %{url_effective}\n' https://www.tagdrishti.com/solutions/agencies
200 https://www.tagdrishti.com/solutions/agencies
```

## grep -F of each TagDrishti quoted string against saved bodies

All of the following `grep -F '<quote>' /tmp/opencode/<saved-body>` exited 0:

- `30% of every invoice, every month, for as long as the client stays subscribed.` → `/tmp/opencode/tagdrishti-for-agencies.html` exit 0
- `# 30% recurring · no clawback · paid monthly via Paddle · 48-hour reply` → for-agencies exit 0
- `Agency Partner Program` → for-agencies exit 0
- `30% recurring` → for-agencies exit 0, solutions exit 0
- `Protect the retainer. Earn ` → for-agencies exit 0
- ` while you do it.` → for-agencies exit 0
- `Your logo, your colours, your subdomain. Clients bookmark your URL, not ours, and never see TagDrishti branding. Available on Agency and Agency Plus.` → for-agencies exit 0
- `ship white-label audit PDFs` → for-agencies exit 0
- `Agency partner program` → for-agencies exit 0, solutions exit 0
- `White-label, retainer-friendly` → for-agencies exit 0, solutions exit 0
- `per-client status page` → solutions exit 0 (NOT in for-agencies)
- `a client status page on your logo` → for-agencies exit 0 (meta description)
- `white-label` → for-agencies exit 0, solutions exit 0
- `30% recurring share.` → solutions exit 0
- `White-label PDFs, per-client status pages, 30% recurring revenue share if you resell.` → solutions exit 0
- `Per-client status page, no login` → solutions exit 0
- `Your logo, your colours, a secure link per account. No client login, no shared credentials, no confusion.` → solutions exit 0
- `White-label audit PDFs, per-client status pages, 30% recurring share` → solutions exit 0 (meta description; attributed in the doc)
- `per-client status pages` → solutions exit 0
- `30% recurring revenue share` → for-agencies exit 0, solutions exit 0

Hero H1 and the feature-card title wrap words in `<span>` / `<em>`, so the visible sentences are not one contiguous raw-HTML string. The doc quotes the contiguous fragments and does not invent a stitched quote.

## Drift / failed

- Item text truncates at "per-client status pag". Live `/solutions/agencies` completes it as "per-client status page".
- Exact label "per-client status page" is **not** on `/for-agencies` (uses visible H3 White-label status page. after stripping `<em>`, plus meta "a client status page on your logo"). Documented in the drift section.
- No competitor page failed. No TinyStudio surface failed.
- Pricing-tier counts and client-seat numbers were present on the competitor pages and were omitted per spec.

## Claims published (control plane, not in this PR)

`/home/nish/workspaces/agent-state/lanes/tinystudio-io/lane-1.json` `claims` set to:

```
["docs/tagdrishti-agency-partner-program-2026-08-23.md", ".lane/reports/docs-tagdrishti-agency-partner-program-lane1.md"]
```

No other field of that record was changed.

## Git / PR

- First commit: pending (filled after commit)
- PR: pending (filled after `gh pr create`)
