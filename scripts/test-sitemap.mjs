// Sitemap regression test for the TinyStudio.io public pages.
//
// The complete sitemap must list every indexable public page: the root, the
// four extensionless human pages (/audit /agents /pricing /specimen), plus the
// two auxiliary plain-text endpoints (/offer.md /llms.txt). Pages marked
// noindex (/brief-requested) and the legacy agent desk (/agent-desk) must stay
// out, and every loc must use the https://tinystudio.io/ origin with clean
// extensionless paths for HTML pages.
//
// This test parses the real public/sitemap.xml and locks the exact URL set, so
// a future edit that drops a page or leaks a noindex page fails
// deterministically. The same validator is run against fixtures of the old
// three-URL sitemap and of a leaked-page sitemap to prove it rejects the
// pre-fix state, not just the current one.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const SITEMAP_PATH = "public/sitemap.xml";
const ORIGIN = "https://tinystudio.io/";

// The complete, indexable URL set, locked in canonical order (root, human
// pages, auxiliary endpoints).
const EXPECTED_LOCS = [
  "https://tinystudio.io/",
  "https://tinystudio.io/audit",
  "https://tinystudio.io/agents",
  "https://tinystudio.io/pricing",
  "https://tinystudio.io/specimen",
  "https://tinystudio.io/offer.md",
  "https://tinystudio.io/llms.txt",
];

// Hard exclusions: noindex page and legacy agent desk must never appear.
const FORBIDDEN_FRAGMENTS = ["brief-requested", "agent-desk"];

// The pre-fix state: only /, /offer.md and /llms.txt were listed.
const OLD_THREE_URL_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tinystudio.io/</loc>
  </url>
  <url>
    <loc>https://tinystudio.io/offer.md</loc>
  </url>
  <url>
    <loc>https://tinystudio.io/llms.txt</loc>
  </url>
</urlset>`;

export function toXml(locs) {
  const urls = locs
    .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Extract the <loc> values from a sitemap document, whitespace-trimmed.
export function parseLocs(xml) {
  const locs = [];
  const pattern = /<loc>([^<]+)<\/loc>/g;
  for (const match of xml.matchAll(pattern)) {
    locs.push(match[1].trim());
  }
  return locs;
}

// Validate a loc list against the sitemap contract. Returns an array of
// human-readable problems (empty when the list is valid).
export function sitemapProblems(locs) {
  const problems = [];
  const seen = new Set();
  for (const loc of locs) {
    if (seen.has(loc)) {
      problems.push(`duplicate loc: ${loc}`);
    }
    seen.add(loc);
    if (!loc.startsWith(ORIGIN)) {
      problems.push(`loc not under ${ORIGIN}: ${loc}`);
      continue;
    }
    const path = loc.slice(ORIGIN.length);
    if (FORBIDDEN_FRAGMENTS.some((fragment) => path.includes(fragment))) {
      problems.push(`forbidden page listed: ${loc}`);
    }
    if (path.endsWith(".html")) {
      problems.push(`html page not extensionless: ${loc}`);
    }
  }
  for (const expected of EXPECTED_LOCS) {
    if (!seen.has(expected)) {
      problems.push(`missing expected loc: ${expected}`);
    }
  }
  for (const loc of seen) {
    if (!EXPECTED_LOCS.includes(loc)) {
      problems.push(`unexpected extra loc: ${loc}`);
    }
  }
  return problems;
}

test("public/sitemap.xml lists exactly the complete indexable URL set", () => {
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  assert.ok(xml.trimStart().startsWith("<?xml"), "sitemap must start with the XML declaration");
  assert.ok(xml.includes("<urlset"), "sitemap must contain a urlset element");
  assert.ok(xml.includes("</urlset>"), "sitemap must close the urlset element");

  const locs = parseLocs(xml);
  assert.deepEqual(locs, EXPECTED_LOCS, "sitemap loc set or order changed");
  assert.deepEqual(sitemapProblems(locs), [], "sitemap must satisfy the contract");
});

test("rejects the old three-URL sitemap (pre-fix state)", () => {
  const locs = parseLocs(OLD_THREE_URL_SITEMAP);
  const problems = sitemapProblems(locs);
  assert.notDeepEqual(problems, [], "old sitemap must fail validation");
  assert.ok(
    problems.some((problem) => problem.startsWith("missing expected loc:")),
    "old sitemap must report the missing pages"
  );
});

test("rejects a sitemap that leaks noindex or legacy pages", () => {
  const leaked = [
    ...EXPECTED_LOCS,
    "https://tinystudio.io/brief-requested",
    "https://tinystudio.io/agent-desk",
  ];
  const problems = sitemapProblems(parseLocs(toXml(leaked)));
  assert.ok(
    problems.some((problem) => problem === "forbidden page listed: https://tinystudio.io/brief-requested"),
    "brief-requested leak must be reported"
  );
  assert.ok(
    problems.some((problem) => problem === "forbidden page listed: https://tinystudio.io/agent-desk"),
    "agent-desk leak must be reported"
  );
});

test("rejects an extensionless-HTML regression", () => {
  const regression = EXPECTED_LOCS.map((loc) => {
    const path = loc.slice(ORIGIN.length);
    return path === "" || path.includes(".") ? loc : `${ORIGIN}${path}.html`;
  });
  const problems = sitemapProblems(parseLocs(toXml(regression)));
  assert.ok(
    problems.some((problem) => problem.includes("not extensionless")),
    "an .html loc must be reported as not extensionless"
  );
});
