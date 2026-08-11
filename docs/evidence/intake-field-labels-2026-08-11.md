# Appraisal intake fields — persistent programmatic labels, measured evidence

Date: 2026-08-11
Scope: `public/index.html` and `public/audit.html` — both appraisal intake
forms (`form.lead.two`) named their website and email fields only with
`placeholder` and `title` attributes. Neither is a programmatic label:
placeholder is a hint that is not associated with the field and disappears
visually as the buyer types, and `title` is a tooltip. No field carried a
`<label>`, `aria-label` or `aria-labelledby`, so assistive tech and the
browser's own validation announcements had no stable, associated name for
the field. This receipt records real browser accessible-name measurements.
It is behavior evidence, not a source check, and it does not claim anything
about the hosted/live deployment.

## What was measured

A headless browser rendered the homepage and /audit from local static copies
of `public/` (Google Fonts loaded over the network as in production). For
each intake input we read the browser-computed accessible name via
`locator.ariaSnapshot()` (the name a screen reader announces), plus whether
the input carries any programmatic label source (`aria-label` attribute or a
`label[for]` element).

The "unfixed" variant is the exact pre-change tree: same `public/`, but
`index.html` and `audit.html` replaced by their `origin/main` (HEAD
`e6f42c1`) versions, so both states are measured with one method in one
session.

## Environment

- Node v22.23.1, Playwright 1.62.1, headless Chromium / Firefox / WebKit,
  Linux.
- Viewport: 1280x800 (deviceScaleFactor 1). Wait: `networkidle`.
- The measurement was run identically in all three engines because
  placeholder-derived names are engine-dependent behavior — a name that
  works in one browser is not a label.

## Results — accessible name per input, unfixed → fixed (all three engines identical)

| Page | Input | label sources (unfixed) | accessible name (unfixed) | label sources (fixed) | accessible name (fixed) |
|---|---|---|---|---|---|
| home | website | none (`aria-label` absent, no `label[for]`) | "Enter your domain, like example.com" — the `title` tooltip, not a label | `aria-label="Your website domain"` | "Your website domain" |
| home | email | none | "Your work email" — the `placeholder` hint, not a label | `aria-label="Your work email"` | "Your work email" |
| /audit | website | none | "Enter your domain, like example.com" — the `title` tooltip | `aria-label="Your website domain"` | "Your website domain" |
| /audit | email | none | "Your work email" — the `placeholder` hint | `aria-label="Your work email"` | "Your work email" |

Unfixed `ariaSnapshot()` lines: `- textbox "Enter your domain, like
example.com":` (+ `- /placeholder: yourwebsite.com` child) and `- textbox
"Your work email"`. Fixed: `- textbox "Your website domain"` and `- textbox
"Your work email"`. Every unfixed field: `hasAriaLabel: false`,
`hasForLabel: false`, `hasTitle: true` on the website field only. Every
fixed field: `hasAriaLabel: true`, and the accessible name is now declared
by the page itself instead of borrowed from a hint attribute — identical
across Chromium, Firefox and WebKit, before and after typing.

## What changed

Each intake input on both pages now carries a stable `aria-label` that names
the field ("Your website domain", "Your work email"). The placeholders stay
as visual hints; `title` stays on the website field as a hint. An
`aria-label` is a persistent attribute — it cannot disappear while typing —
and it is the programmatic name source with the highest precedence for
these inputs, so the accessible name is deterministic in every engine.

`scripts/check-site.mjs` now rejects any `website`/`email` intake input on
the homepage or /audit that lacks a non-empty `aria-label` (fails on
`origin/main`, passes here), so the regression cannot re-ship silently.

## Design neutrality

The two inputs' visible rendering is byte-identical before and after: the
labels are attributes on the existing inputs, no element, class or rule was
added, and the pill form layout, placeholders and button are untouched.

## Not CI proof

This is local static-server proof, not CI proof and not a hosted/live
claim. The repo's CI (`npm test`) has no browser dependency, so it runs only
the source-string guards in `scripts/check-site.mjs` (which now pin the
intake `aria-label` rule and this receipt's anchors) plus the worker/UI
contract tests; a browser-visible regression can therefore still ship if
the checked-in HTML drifts and CI stays green. The live tinystudio.io
deployment was not measured here; a deployed page could differ (CDN cache,
different asset versions). To be CI-proof this measurement would need a
browser step added to CI (not done — out of scope).

## Exact verification method (reproduce)

1. Copy `public/` to `fixed-site/` and serve it on 127.0.0.1:8131
   (`python3 -m http.server 8131 --directory fixed-site`). Copy it again to
   `unfixed-site/` and overwrite `index.html` and `audit.html` with their
   `origin/main` versions (`git show origin/main:public/index.html >
   unfixed-site/index.html`, same for `audit.html`), then serve it on
   127.0.0.1:8132.
2. Run this per state and engine (requires `npm i -D playwright && npx
   playwright install` in any project):

```js
import { chromium, firefox, webkit } from "playwright";
const [baseUrl, label, engineArg] = process.argv.slice(2);
const launch = { chromium, firefox, webkit }[engineArg || "chromium"];
const browser = await launch.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const out = { label, pages: {} };
for (const [key, path] of [["home", "index.html"], ["audit", "audit.html"]]) {
  await page.goto(`${baseUrl}/${path}`, { waitUntil: "networkidle", timeout: 60000 });
  out.pages[key] = {};
  for (const sel of ["input[name=website]", "input[name=email]"]) {
    const loc = page.locator(sel);
    const snapshot = (await loc.ariaSnapshot().catch(() => "")) || "";
    const textbox = snapshot.split("\n").find((l) => l.includes("textbox")) || "";
    const m = textbox.match(/^-\s*textbox(?: "(.*)")?/);
    out.pages[key][sel] = {
      accessibleName: m ? (m[1] ?? "(empty)") : "(no textbox node)",
      hasAriaLabel: ((await page.getAttribute(sel, "aria-label")) ?? "").length > 0,
      hasForLabel: (await page.locator(`label[for="${await page.getAttribute(sel, "id")}"]`).count()) > 0
    };
  }
}
console.log(JSON.stringify(out, null, 2));
await browser.close();
```

3. Run `node measure.mjs http://127.0.0.1:8132 unfixed chromium` (and
   `firefox`, `webkit`), then the same for `http://127.0.0.1:8131 fixed`.
   Unfixed: every input reports `hasAriaLabel: false` and a name borrowed
   from `title`/`placeholder`. Fixed: every input reports `hasAriaLabel:
   true` and the declared name, identically in all three engines.
