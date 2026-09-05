// Heading-hierarchy regression check for the public pages named by the
// dogfood finding. Treats the rendered (accessibility-tree) heading order as
// the contract: the effective level of a heading is its explicit aria-level
// when present, otherwise its element level — the same computation axe-core
// and Lighthouse use for their heading-order checks.
//
// A page fails if it has other than one H1 at the root, or any heading that
// skips a level above the previous heading (1 -> 3, 2 -> 4, ...).
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const PUBLIC_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public");

const PAGES = ["index.html", "agents.html", "pricing.html", "specimen.html"];

// Effective levels in document order for one page's rendered headings.
function headingLevels(html) {
  const withoutInert = html
    .replace(/<!--[\s\S]*?-->/g, "") // comments
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");
  const levels = [];
  for (const match of withoutInert.matchAll(/<h([1-6])([^>]*)>/gi)) {
    const [, tagLevel, attrs] = match;
    const aria = attrs.match(/aria-level=["'](\d+)["']/i);
    const level = aria ? Number(aria[1]) : Number(tagLevel);
    if (level >= 1 && level <= 6) levels.push(level);
  }
  return levels;
}

function assertNoSkippedLevels(levels, file) {
  assert.ok(levels.length >= 4, `${file}: expected at least 4 rendered headings, found ${levels.length} (parser made no sense of the page)`);
  assert.equal(levels[0], 1, `${file}: first heading must be the H1 root, got level ${levels[0]}`);
  assert.equal(levels.filter((level) => level === 1).length, 1, `${file}: must have exactly one H1`);
  for (let i = 1; i < levels.length; i++) {
    assert.ok(
      levels[i] <= levels[i - 1] + 1,
      `${file}: skipped heading level — heading ${i + 1} is level ${levels[i]} after level ${levels[i - 1]}`,
    );
  }
}

for (const file of PAGES) {
  test(`no skipped heading levels in ${file}`, () => {
    const html = readFileSync(path.join(PUBLIC_DIR, file), "utf8");
    assertNoSkippedLevels(headingLevels(html), file);
  });
}

// The check itself must not silently rot: if the page set ever changes, the
// test set must change with it.
test("covers exactly the four pages named by the dogfood finding", () => {
  const sorted = [...PAGES].sort();
  assert.deepEqual(sorted, ["agents.html", "index.html", "pricing.html", "specimen.html"]);
});
