# Retired "TinyStudio Agent Desk" title/snippet in Google — re-verification and residual fix

Date: 2026-08-14
Scope: backlog item `f41c8af0f8` — "[unreviewed-by-opus] Google still presents
the retired self-serve 'TinyStudio Agent Desk' title/snippet for tinystudio.io".

Verdict in one line: **the finding's original target — the apex homepage — is
fixed and verified fixed on live; the retired name still reaches Google through
a duplicate host nobody had closed, and this change closes it.**

## Environment

- Source baseline: fresh `origin/main` at `5770bf3`.
- Live target: `https://tinystudio.io/`, `https://www.tinystudio.io/`,
  `http://www.tinystudio.io/`, and the served public pages.
- SERP measurement: Google `site:tinystudio.io`, 2026-08-14, real browser.

## Part 1 — what was already fixed (re-verified, no change needed)

The 2026-08-09 de-indexing pass (PR #46) put `noindex, nofollow` and retired
framing on the legacy desk surface. Re-verified on this head and on live:

- `public/agent-desk.html` head carries `<meta name="robots" content="noindex, nofollow" />`,
  titles itself `TinyStudio — the retired Agent Desk`, and its description opens
  "The self-serve Agent Desk is retired and is not the current offer."
- Live `https://tinystudio.io/agent-desk` → 200 serving exactly that head.
- Live `https://tinystudio.io/agent-desk.html` → 307 → `/agent-desk`, same head.
- The `check-site.mjs` dogfood guard ("Retired Agent Desk index guard") still
  fails the build if the robots meta or the retired framing is removed.
- The legacy surface stays absent from `sitemap.xml`, and `llms.txt`/`offer.md`
  keep the demotion statement.

**Live SERP, 2026-08-14 — the apex result is clean.** `site:tinystudio.io`
returns `https://tinystudio.io/` titled **"TinyStudio — The Website Appraisal"**
with the current leak-audit snippet. The title the finding reported
("tinystudio.io - TinyStudio Agent Desk", q5/google 2026-08-06) is **gone from
the apex homepage result**. That part of the finding is genuinely closed.

## Part 2 — the residual the finding is still right about

The same SERP still shows the retired product name, on a host nobody had
addressed:

| Indexed URL | Title Google presents |
|---|---|
| `https://tinystudio.io/` | TinyStudio — The Website Appraisal ✅ |
| `http://www.tinystudio.io/agents` | TinyStudio — The Desk **- TinyStudio Agent Desk** ❌ |
| `http://www.tinystudio.io/pricing.html` | Pricing & terms — **The Tiny Studio** ❌ |
| `http://www.tinystudio.io/specimen.html` | The Website Appraisal — specimen — **The Tiny Studio** ❌ |

The trailing "- TinyStudio Agent Desk" is Google's **site name** for the host,
not a page title. Google derives and caches a site name per host. `www.tinystudio.io`
is a *separate host entity* in the index, and its cached site name is still the
retired product's — from when the self-serve desk owned the root. The stale
"The Tiny Studio" titles fixed by PR #98 also survive on this host.

### Root cause

`wrangler.jsonc` routes `www.tinystudio.io/*` at this worker, but the worker's
host dispatch only special-cased `app.` and `api.`. `www` fell through to the
normal public-site handler, so the site answered **200** on a second hostname —
and over plain `http`, un-upgraded.

Measured on live before the fix:

- `http://www.tinystudio.io/` → `HTTP/1.1 200 OK` (no redirect, no HTTPS upgrade)
- `https://www.tinystudio.io/` → `200`, body **byte-identical** to the apex
  (`sha256 b37b0bbe…934e` on both)
- `http://tinystudio.io/` → `200` (apex over plain http; see "Not fixed here")

Every page's `canonical`, every `og:url`, `robots.txt` and all seven
`sitemap.xml` entries already name `https://tinystudio.io`. The duplicate host
contradicted all of them. A page-level canonical is only a *hint*; Google had
plainly not taken it, since it kept indexing www URLs and kept a separate,
stale site name for them.

## The change

`src/worker.js` — canonical-host redirect ahead of all other dispatch:

```js
if (host === "www.tinystudio.io") {
  const canonical = new URL(url);
  canonical.protocol = "https:";
  canonical.hostname = "tinystudio.io";
  canonical.port = "";
  return withSecurityHeaders(new Response(null, { status: 301, headers: { Location: canonical.toString() } }));
}
```

301 (not 302/307) is the point: it is the directive that collapses the
duplicate site entity — and its cached "TinyStudio Agent Desk" site name — into
the apex host. Path and query are preserved so campaign links keep working, and
plain `http` is upgraded to `https` in the same hop.

`scripts/test-agent-worker.mjs` — four guards:

1. www → `301` with `Location: https://tinystudio.io/`.
2. Path and query preserved; `http://www…/pricing?utm_source=x&utm_medium=y`
   → `https://tinystudio.io/pricing?utm_source=x&utm_medium=y`.
3. www never serves public-site HTML for `/`, `/audit`, `/agents`, `/agent-desk`
   (asserted against a stub `ASSETS` binding that would return page HTML).
4. The apex host and the retired `app.`/`api.` 410 hosts are unaffected.

## Verification

- `node scripts/check-site.mjs` → "TinyStudio.io checks passed."
- `node --test scripts/test-agent-worker.mjs` → 80 pass, 0 fail (76 before).
- Full suite green: headings 6, sitemap 7, UI 16, contract 8, viewport 4,
  narrow-pages pass, render-blocking pass.
- **Regression proof:** disabling the host check (`if (false)`) makes exactly
  the three behavioural tests fail (`# pass 77 / # fail 3`); restoring it
  returns 80/0. Guard 4 passes either way by design — it asserts the hosts this
  change must *not* touch.

## Not fixed here (deliberate, separate items)

- **`/agent-desk` canonical still names the apex root.** That is the other
  consolidation path for this same finding, and it is already fixed and waiting
  in **open PR #91** ("stop the retired Agent Desk from claiming the apex root
  as its canonical"), currently `MERGEABLE` but `BLOCKED` on review. Not
  duplicated here on purpose — this branch does not touch
  `public/agent-desk.html` or the `check-site.mjs` desk guard, so it does not
  conflict with #91 and the two compose.
- **`http://tinystudio.io/` (apex over plain http) answers 200.** Same class of
  duplicate-URL problem, different host; it is a Cloudflare "Always Use HTTPS" /
  HSTS concern rather than this finding's mechanism. Left for its own item.
- **`/agents` canonical points at `/agents.html`.** Covered by open PRs #142/#95.
- No SERP change is claimed as immediate: recrawl and site-name refresh are
  Google's timetable. What is claimed and proven is that the duplicate host —
  the last surface still handing Google the retired name — no longer exists.
