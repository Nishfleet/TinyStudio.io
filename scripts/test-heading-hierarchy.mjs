import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Deterministic regression guard for the dogfood finding
// "Heading hierarchy needs cleanup on home" (dogfood e6e153bdadd0 from
// runs/20260808T074205Z-msk2fl3n.json, observed "Heading jumps from H2 to H4")
// on /index.html, /agents.html, /pricing.html and /specimen.html.
//
// The finding engine (SEO Fix Kit, proof-seo/server/audit/engine.js ->
// shared/audit-engine.js headingHierarchyIssue) reads the RENDERED DOM:
// every h1..h6 in document order, first heading must be H1, and an adjacent
// level may increase by at most one. The four pages carry no script that
// creates or retags headings, so the served DOM order is exactly the markup
// order and a static parse is the deterministic equivalent of a rendered
// read. This file mirrors the engine rule 1:1 and pins the exact corrected
// outline per page, so the old shape (H2->H4 and H1->H3 jumps) fails loudly.

const PAGES = ["index.html", "agents.html", "pricing.html", "specimen.html"];

const read = (file) => readFileSync(new URL(`../public/${file}`, import.meta.url), "utf8");

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " "
};

function decodeEntities(text) {
  return text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (entity) => ENTITIES[entity]);
}

// Headings in rendered (document) order, exactly as a browser querySelectorAll
// over h1..h6 would report them.
function renderHeadings(html) {
  return [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((match) => ({
    level: Number(match[1][1]),
    text: decodeEntities(match[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
  }));
}

// 1:1 mirror of the finding engine's headingHierarchyIssue.
function hierarchyIssue(headings) {
  if (!headings.length) return "No rendered headings found.";
  const levels = headings.map((heading) => heading.level);
  if (levels[0] !== 1) {
    return `First rendered heading is H${levels[0]} instead of H1.`;
  }
  for (let index = 1; index < levels.length; index += 1) {
    if (levels[index] - levels[index - 1] > 1) {
      return `Heading jumps from H${levels[index - 1]} to H${levels[index]}.`;
    }
  }
  return "";
}

// The corrected outline, heading by heading in rendered order. The old shape
// differs exactly here: the track/FAQ/identity labels below were H4 under H2
// (and the roster/finding cards were H3 under H1), which is the reported jump.
const EXPECTED_OUTLINES = {
  "index.html": [
    ["H1", "Most of them leave before they ever get in touch."],
    ["H2", "answer none of the questions a buyer asks before committing."],
    ["H2", "What the appraisal gives you"],
    ["H2", "What we actually look at"],
    ["H3", "The money page"],
    ["H3", "The paid creative"],
    ["H3", "The unanswered"],
    ["H3", "The reach"],
    ["H2", "How the work runs"],
    ["H3", "Everything on the table"],
    ["H3", "The read"],
    ["H3", "The fix"],
    ["H3", "The loop"],
    ["H2", "This one. tinystudio.io."],
    ["H3", "What TinyStudio does"],
    ["H3", "What TinyStudio charges"],
    ["H3", "Where TinyStudio is based"],
    ["H3", "Who TinyStudio works with"],
    ["H3", "What is tinystudio.io"],
    ["H3", "Does TinyStudio publish client work"],
    ["H2", "One name goes on every audit. That is the ceiling, and it is deliberate."],
    ["H2", "Or have it closed, not merely found."],
    ["H2", "Before you ask"],
    ["H3", "What exactly do I get for free?"],
    ["H3", "Why only six a month?"],
    ["H3", "Do you guarantee more customers?"],
    ["H3", "What if I only want the appraisal?"],
    ["H2", "Why there are no logos on this site"]
  ],
  "agents.html": [
    ["H1", "Seven specialists, one human signature."],
    ["H2", "Landing Page Fixer"],
    ["H2", "Product Page Fixer"],
    ["H2", "Site Architecture Fixer"],
    ["H2", "Ad Angle Generator"],
    ["H2", "Competitor Watcher"],
    ["H2", "Email & SMS Generator"],
    ["H2", "Weekly Performance Analyst"],
    ["H3", "What the desk does"],
    ["H3", "What it is never allowed to do"],
    ["H2", "Why this isn't something you can just prompt"],
    ["H2", "Every week the page undersells you is a week of traffic you already paid for, walking out."]
  ],
  "pricing.html": [
    ["H1", "One price. One way to get your money back."],
    ["H2", "The Growth Desk"],
    ["H2", "How the clock is counted"],
    ["H3", "Everything on the table"],
    ["H3", "The read"],
    ["H3", "The fix"],
    ["H3", "The loop"],
    ["H2", "Before you ask"],
    ["H3", "Why is the appraisal free?"],
    ["H3", "Do you guarantee more customers?"],
    ["H3", "What if I am unhappy but you delivered?"],
    ["H3", "Why only six audits a month?"],
    ["H3", "Who actually does the work?"],
    ["H2", "The appraisal costs you an email. The rest is a decision you can make later."],
    ["H2", "Why there are no logos on this site"]
  ],
  "specimen.html": [
    ["H1", "Four ways this clinic loses people who were already sold."],
    ["H2", "The fee list is excellent, and the homepage never mentions it exists"],
    ["H2", "The headline could belong to any clinic in the country"],
    ["H2", "Two front doors, asking for different levels of commitment"],
    ["H2", "The proof is real, and it is on the wrong page"],
    ["H3", "Two passes not run"],
    ["H2", "Confidentiality"]
  ]
};

for (const page of PAGES) {
  test(`${page} keeps the corrected heading outline in rendered order`, () => {
    const headings = renderHeadings(read(page));
    const expected = EXPECTED_OUTLINES[page];

    assert.equal(
      hierarchyIssue(headings),
      "",
      `${page} must satisfy the finding engine's heading rule (H1 first, no level skip)`
    );
    assert.equal(
      headings.length,
      expected.length,
      `${page} must keep every heading of the corrected outline`
    );
    assert.deepEqual(
      headings.map((heading) => [`H${heading.level}`, heading.text]),
      expected,
      `${page} heading levels and text must match the corrected outline in rendered order`
    );
  });
}
