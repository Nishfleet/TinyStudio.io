import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// No-dependency heading scanner. Reads a hand-written static HTML page and
// returns its semantic outline as [{ level, text }] entries in document order.
//
// A heading may override its implicit h1-h6 level with role="heading" plus
// aria-level="N" (WAI-ARIA: aria-level only takes effect on an element with
// role="heading"). The public pages use exactly this mechanism to correct a
// skipped outline — e.g. a styled <h4> card title that belongs at level 3 —
// without changing the rendered element and without losing the element-scoped
// CSS rules that style it (`.stop h4`, `.q h4`, ...). The scanner mirrors
// that: role="heading" + valid aria-level wins; otherwise the element's own
// level is used, exactly as assistive technology would expose it.
function scanOutline(html) {
  // Script/style bodies can contain tag-like text; they are never headings.
  const documentBody = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const entries = [];
  for (const match of documentBody.matchAll(/<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi)) {
    const implicit = Number(match[1]);
    const attributes = match[2] || "";
    const overridden =
      /\brole\s*=\s*"heading"/i.test(attributes) &&
      /aria-level\s*=\s*"([1-6])"/i.exec(attributes);
    const level = overridden ? Number(overridden[1]) : implicit;
    const text = match[3].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    entries.push({ level, text });
  }
  return entries;
}

// Expected semantic outlines, page by page. Only the LEVELS are asserted: the
// accompanying comments name each heading so the list stays maintainable when
// copy changes, and the assertion failure prints level -> heading text so a
// regression is located in one glance. The outlines keep the section structure
// visible (h2 blocks) with their sub-headings one level down (h3) and treat
// card grids without a container title as top-level sections (h2) — a page
// with a flat "levels only increase" rule would wrongly flatten or flag the
// footer-free card blocks below.
const EXPECTED_OUTLINES = {
  "public/index.html": [
    1,             // h1 — hero ("Most of them leave...")
    2,             // h2 — the finding band
    2,             // h2 — What the appraisal gives you
    2,             // h2 — What we actually look at
    3, 3, 3, 3,    // h3 — the four check cards
    2,             // h2 — How the work runs
    3, 3, 3, 3,    // h3 — the four timeline stops
    2,             // h2 — This one. tinystudio.io.
    3, 3, 3, 3, 3, 3, // h3 — the six identity answers
    2,             // h2 — One name goes on every audit...
    2,             // h2 — Or have it closed, not merely found.
    2,             // h2 — Before you ask
    3, 3, 3, 3,    // h3 — the four FAQ answers
    2              // h2 — Why there are no logos on this site
  ],
  "public/agents.html": [
    1,             // h1 — hero ("Seven specialists...")
    2, 2, 2, 2, 2, 2, 2, // h2 — the seven roster cards
    2, 2,          // h2 — the two gatebox titles
    2,             // h2 — Why this isn't something you can just prompt
    2              // h2 — band ("Every week the page undersells you...")
  ],
  "public/pricing.html": [
    1,             // h1 — hero ("One price...")
    2,             // h2 — The Growth Desk (plan card)
    2,             // h2 — How the clock is counted
    3, 3, 3, 3,    // h3 — the four timeline stops
    2,             // h2 — Before you ask
    3, 3, 3, 3, 3, // h3 — the five FAQ answers
    2,             // h2 — band ("The appraisal costs you an email...")
    2              // h2 — Why there are no logos on this site
  ],
  "public/specimen.html": [
    1,             // h1 — audit title ("Four ways this clinic loses people...")
    2, 2, 2, 2,    // h2 — the four findings
    2,             // h2 — Two passes not run
    2              // h2 — Confidentiality
  ]
};

function outlineDiagnostic(entries) {
  return entries.map(({ level, text }) => `h${level} — ${text}`).join("\n");
}

for (const [file, expected] of Object.entries(EXPECTED_OUTLINES)) {
  test(`${file} keeps the intended semantic heading outline`, () => {
    const actual = scanOutline(read(file)).map(({ level }) => level);
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      const rendered = scanOutline(read(file));
      assert.fail(
        `\n${file} heading outline drifted.\n` +
          `Expected levels: [${expected.join(", ")}]\n` +
          `Actual levels:   [${actual.join(", ")}]\n` +
          `Actual outline:\n${outlineDiagnostic(rendered)}`
      );
    }
  });
}

// The scanner itself must mirror the ARIA semantics the pages rely on:
// role="heading" + aria-level overrides the implicit element level, and an
// aria-level with no role="heading" must be ignored (WAI-ARIA).
test("scanner honors role=heading aria-level overrides", () => {
  const html =
    "<h1>Title</h1><h2>Section</h2>" +
    '<h4 role="heading" aria-level="3">Card title</h4>' +
    '<h3 aria-level="1">Not a heading override</h3>';
  assert.deepEqual(
    scanOutline(html).map(({ level, text }) => [level, text]),
    [
      [1, "Title"],
      [2, "Section"],
      [3, "Card title"],
      [3, "Not a heading override"]
    ]
  );
});

test("scanner ignores headings inside script blocks", () => {
  const html = "<h1>Title</h1><script>const t = \"<h2>fake</h2>\";</script><h2>Real</h2>";
  assert.deepEqual(scanOutline(html).map(({ level }) => level), [1, 2]);
});
