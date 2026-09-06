// Sitemap regression test for public/sitemap.xml.
//
// The TinyStudio.io sitemap must list every indexable public page: the five
// human-facing pages (/pricing, /audit, /specimen, /agents, /) plus the
// machine-readable offer.md and llms.txt, in crawl-priority order (money and
// conversion first, then specimen, agents, root, then machine-readable). It
// must never list the noindex /brief-requested page or the legacy /agent-desk
// page, and every loc must be a clean https://tinystudio.io URL.
//
// The check is file-based and deterministic: it fails on the old three-URL
// sitemap (/ , /offer.md, /llms.txt) and passes on the complete one.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITEMAP_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "sitemap.xml"
);

// Locked crawl-priority order. Any missing page, extra page, reordering, or
// unclean URL changes this list and fails the test.
const EXPECTED_LOCS = [
  "https://tinystudio.io/pricing",
  "https://tinystudio.io/audit",
  "https://tinystudio.io/specimen",
  "https://tinystudio.io/agents",
  "https://tinystudio.io/",
  "https://tinystudio.io/offer.md",
  "https://tinystudio.io/llms.txt"
];

export function sitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

test("sitemap lists every indexable page in crawl-priority order", () => {
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  assert.deepEqual(sitemapLocs(xml), EXPECTED_LOCS);
});

test("sitemap never lists excluded pages", () => {
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  for (const excluded of ["/brief-requested", "/agent-desk"]) {
    assert.ok(
      !sitemapLocs(xml).some((loc) => loc.includes(excluded)),
      `sitemap must not list ${excluded}`
    );
  }
});

test("every loc is an https://tinystudio.io URL with clean paths", () => {
  const xml = readFileSync(SITEMAP_PATH, "utf8");
  for (const loc of sitemapLocs(xml)) {
    assert.ok(
      loc.startsWith("https://tinystudio.io/"),
      `loc must be on tinystudio.io: ${loc}`
    );
    if (loc.endsWith("/")) continue; // root
    assert.ok(
      !loc.includes(".html"),
      `HTML pages must be extensionless: ${loc}`
    );
  }
});
