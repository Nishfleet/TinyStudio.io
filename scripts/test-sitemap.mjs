// Sitemap completeness regression test.
//
// The sitemap previously listed only the root, offer.md and llms.txt, leaving
// the four other indexable human pages (audit, agents, pricing, specimen) out
// of search-engine discovery. This test locks the defensive contract:
//
//   1. every indexable public page is present: the five human pages under
//      their clean extensionless URLs, plus the machine-readable pair
//      offer.md and llms.txt;
//   2. /brief-requested (noindex) and /agent-desk (legacy) are never listed;
//   3. every loc uses the https://tinystudio.io/ host, and HTML pages are
//      extensionless (the worker 307-redirects the .html twins to these).
//
// The same checker runs against embedded "known bad shape" fixtures so the
// test also proves it rejects the pre-fix three-URL sitemap, not just the
// current one.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const REQUIRED_LOCS = [
  "https://tinystudio.io/",
  "https://tinystudio.io/audit",
  "https://tinystudio.io/agents",
  "https://tinystudio.io/pricing",
  "https://tinystudio.io/specimen",
  "https://tinystudio.io/offer.md",
  "https://tinystudio.io/llms.txt"
];

const FORBIDDEN_LOCS = [
  "https://tinystudio.io/brief-requested",
  "https://tinystudio.io/brief-requested.html",
  "https://tinystudio.io/agent-desk",
  "https://tinystudio.io/agent-desk.html"
];

// Structural contract check. Returns a list of human-readable violations; an
// empty list means the sitemap is complete and correct.
export function sitemapIssues(xml) {
  const issues = [];
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].trim());
  if (locs.length === 0) {
    issues.push("sitemap has no <loc> entries");
    return issues;
  }
  for (const required of REQUIRED_LOCS) {
    if (!locs.includes(required)) issues.push(`missing loc: ${required}`);
  }
  for (const forbidden of FORBIDDEN_LOCS) {
    if (locs.includes(forbidden)) issues.push(`forbidden loc present: ${forbidden}`);
  }
  for (const loc of locs) {
    if (!loc.startsWith("https://tinystudio.io/")) {
      issues.push(`loc must use the https://tinystudio.io/ host: ${loc}`);
    }
    if (/\.html$/i.test(loc)) {
      issues.push(`HTML pages must be listed extensionless (clean URL): ${loc}`);
    }
  }
  return issues;
}

test("public/sitemap.xml lists every required loc and nothing forbidden", () => {
  const xml = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.deepEqual(sitemapIssues(xml), [], `sitemap: ${sitemapIssues(xml).join("; ") || "ok"}`);
});

test("checker rejects the known bad shape: the old three-URL sitemap", () => {
  const oldSitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url><loc>https://tinystudio.io/</loc></url>",
    "  <url><loc>https://tinystudio.io/offer.md</loc></url>",
    "  <url><loc>https://tinystudio.io/llms.txt</loc></url>",
    "</urlset>"
  ].join("\n");
  const issues = sitemapIssues(oldSitemap);
  for (const missing of ["https://tinystudio.io/audit", "https://tinystudio.io/agents", "https://tinystudio.io/pricing", "https://tinystudio.io/specimen"]) {
    assert.ok(issues.includes(`missing loc: ${missing}`), `expected missing-loc failure for ${missing}, got: ${issues.join("; ")}`);
  }
});

test("checker rejects a sitemap that lists /brief-requested or /agent-desk", () => {
  const withForbidden = [
    "<urlset>",
    ...REQUIRED_LOCS.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '  <url><loc>https://tinystudio.io/brief-requested</loc></url>',
    '  <url><loc>https://tinystudio.io/agent-desk</loc></url>',
    "</urlset>"
  ].join("\n");
  const issues = sitemapIssues(withForbidden);
  assert.ok(issues.includes("forbidden loc present: https://tinystudio.io/brief-requested"), `got: ${issues.join("; ")}`);
  assert.ok(issues.includes("forbidden loc present: https://tinystudio.io/agent-desk"), `got: ${issues.join("; ")}`);
});

test("checker rejects wrong hosts and .html paths", () => {
  const bad = [
    "<urlset>",
    ...REQUIRED_LOCS.map((loc) => `  <url><loc>${loc}</loc></url>`),
    '  <url><loc>http://tinystudio.io/audit</loc></url>',
    '  <url><loc>https://www.tinystudio.io/pricing</loc></url>',
    '  <url><loc>https://tinystudio.io/specimen.html</loc></url>',
    "</urlset>"
  ].join("\n");
  const issues = sitemapIssues(bad);
  assert.ok(issues.some((issue) => issue.includes("must use the https://tinystudio.io/ host: http://tinystudio.io/audit")), `got: ${issues.join("; ")}`);
  assert.ok(issues.some((issue) => issue.includes("must use the https://tinystudio.io/ host: https://www.tinystudio.io/pricing")), `got: ${issues.join("; ")}`);
  assert.ok(issues.some((issue) => issue.includes("extensionless") && issue.includes("specimen.html")), `got: ${issues.join("; ")}`);
});
