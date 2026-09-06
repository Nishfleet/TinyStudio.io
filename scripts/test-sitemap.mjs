// Sitemap completeness regression test.
//
// The sitemap is the crawler-facing index of the human-facing pages. It must
// list every indexable public page (the home page plus /audit, /agents,
// /pricing and /specimen) at the same clean, extensionless URLs the worker
// serves, keep the two machine-readable mirrors (/offer.md, /llms.txt), and
// never list the noindex (/brief-requested) or legacy (/agent-desk) pages.
//
// The expected loc list is locked in exact order, so the pre-fix three-URL
// sitemap (only /, /offer.md and /llms.txt) fails deterministically: missing
// entries, a .html twin, an added noindex page, or a reorder all break it.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const sitemap = read("public/sitemap.xml");
const robots = read("public/robots.txt");

const EXPECTED_LOCS = [
  "https://tinystudio.io/",
  "https://tinystudio.io/offer.md",
  "https://tinystudio.io/llms.txt",
  "https://tinystudio.io/audit",
  "https://tinystudio.io/agents",
  "https://tinystudio.io/pricing",
  "https://tinystudio.io/specimen"
];

const NOT_ALLOWED_LOCS = [
  "https://tinystudio.io/brief-requested",
  "https://tinystudio.io/brief-requested.html",
  "https://tinystudio.io/agent-desk",
  "https://tinystudio.io/agent-desk.html"
];

function locsOf(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((match) => match[1]);
}

test("sitemap is well-formed XML", () => {
  const urlset = sitemap.match(/<urlset\b[^>]*>([\s\S]*?)<\/urlset>/i)?.[1];
  assert.ok(urlset, "sitemap must be a urlset document");
  assert.ok(/<urlset\b[^>]*xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap), "urlset must use the sitemaps.org 0.9 namespace");
});

test("sitemap lists exactly the indexable pages, in order", () => {
  const locs = locsOf(sitemap);
  assert.deepEqual(locs, EXPECTED_LOCS);
});

test("every loc is an absolute tinystudio.io URL", () => {
  for (const loc of locsOf(sitemap)) {
    assert.ok(loc.startsWith("https://tinystudio.io/"), `loc must use https://tinystudio.io/: ${loc}`);
    const rest = loc.slice("https://tinystudio.io/".length);
    // Only the home page may be the bare origin (path ""); every other page
    // must name a path under it.
    if (loc !== "https://tinystudio.io/") {
      assert.ok(rest.length > 0, `loc must name a path: ${loc}`);
    }
    assert.ok(!/\s/.test(loc), `loc must not contain whitespace: ${loc}`);
  }
});

test("HTML pages use the clean extensionless paths, not .html twins", () => {
  for (const page of ["/audit", "/agents", "/pricing", "/specimen"]) {
    assert.ok(locsOf(sitemap).includes(`https://tinystudio.io${page}`), `sitemap must list /${page}`);
    assert.ok(!locsOf(sitemap).includes(`https://tinystudio.io${page}.html`), `sitemap must not list the .html twin of /${page}`);
  }
});

test("noindex and legacy pages are not listed", () => {
  for (const loc of NOT_ALLOWED_LOCS) {
    assert.ok(!locsOf(sitemap).includes(loc), `sitemap must not list ${loc}`);
  }
});

test("robots.txt still points at the sitemap", () => {
  assert.ok(robots.includes("Sitemap: https://tinystudio.io/sitemap.xml"), "robots.txt must reference the sitemap URL");
});
