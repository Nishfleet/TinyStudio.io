// Semantic product-truth contract test for the repository-level docs.
//
// The live surfaces say TinyStudio's current offer is the Website Appraisal —
// the free leak audit of high-ticket service homepages — and the
// human-reviewed desk that closes what the audit finds, while the retired
// self-serve Agent Desk survives only as legacy mechanics. README.md,
// MEMORY.md, the package description, and the specs/ layer must agree with
// that truth: a future change that quietly revives the self-serve Agent Desk
// as the current product — or drifts the current-offer facts — fails here
// deterministically.
//
// The guard reads only repository-level contract files (nothing under
// public/, which scripts/check-site.mjs owns) and has no dependencies beyond
// node:test. Run it standalone with:
//
//   node --test scripts/test-product-contract.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const low = (text) => text.toLowerCase();
// Fold line wraps before matching prose (docs wrap at ~80 columns).
const flat = (text) => low(text).replace(/\s+/g, " ");

const README = read("README.md");
const MEMORY = read("MEMORY.md");
const PACKAGE = read("package.json");
const PACKAGE_JSON = JSON.parse(PACKAGE);

// Every spec that documents the Agent Desk era must carry an explicit
// superseded/historical marker so none of them can be read as current.
const historicalSpecs = {
  "001 plan": "specs/001-public-buyer-page/plan.md",
  "001 spec": "specs/001-public-buyer-page/spec.md",
  "001 tasks": "specs/001-public-buyer-page/tasks.md",
  "002 plan": "specs/002-minimal-input-agent-desk/plan.md",
  "002 spec": "specs/002-minimal-input-agent-desk/spec.md",
  "002 tasks": "specs/002-minimal-input-agent-desk/tasks.md",
  "003 plan": "specs/003-wellness-clinic-launch/plan.md"
};
const historicalText = Object.fromEntries(
  Object.entries(historicalSpecs).map(([name, path]) => [name, read(path)])
);

const SPEC_004 = existsSync(new URL("../specs/004-website-appraisal/plan.md", import.meta.url))
  ? read("specs/004-website-appraisal/plan.md")
  : "";

// The legacy safety rails that must stay recorded beside any Agent Desk
// mention, and the legacy endpoints that must stay discoverable.
const LEGACY_RAILS = [
  "no campaign publishing",
  "no ad spend changes",
  "no ad account connection",
  "no prospect message sending"
];
const LEGACY_ENDPOINTS = ["/api/agent-audit", "/api/signups"];

test("package description names the current offer, not a self-serve product", () => {
  const description = PACKAGE_JSON.description;
  assert.ok(
    description.includes("Website Appraisal"),
    "package description must name the Website Appraisal as the current offer"
  );
  assert.ok(
    !low(description).includes("self-serve"),
    "package description must not frame the repo as a self-serve product"
  );
});

test("README presents the Website Appraisal and human-reviewed delivery as current", () => {
  assert.ok(README.includes("Website Appraisal"), "README must name the current offer");
  assert.ok(README.includes("human-reviewed"), "README must state human-reviewed delivery");
  assert.ok(
    !README.includes("Self-serve TinyStudio Agent Desk"),
    "README must not open with the old self-serve Agent Desk framing"
  );
  assert.ok(
    !README.includes("reopening as a self-serve"),
    "README must not claim a self-serve reopening"
  );
});

test("Agent Desk framing survives only as legacy, with mechanics discoverable", () => {
  assert.ok(
    /legacy agent desk|retired agent desk/.test(low(README)),
    "README must frame the Agent Desk as legacy or retired, never current"
  );
  for (const rail of LEGACY_RAILS) {
    assert.ok(flat(README).includes(rail), `README must keep the legacy safety rail: ${rail}`);
  }
  for (const endpoint of LEGACY_ENDPOINTS) {
    assert.ok(
      flat(README + MEMORY).includes(endpoint),
      `legacy mechanics must stay discoverable in README or MEMORY: ${endpoint}`
    );
  }
});

test("MEMORY records the Website Appraisal as current and the Agent Desk as legacy", () => {
  assert.ok(MEMORY.includes("Website Appraisal"), "MEMORY must name the current offer");
  assert.ok(
    /legacy agent desk|retired agent desk/.test(low(MEMORY)),
    "MEMORY must frame the Agent Desk as legacy or retired, never current"
  );
  for (const drift of [
    "reopening as a self-serve AI workspace",
    "agentic operating system",
    "Self-serve TinyStudio Agent Desk"
  ]) {
    assert.ok(!MEMORY.includes(drift), `MEMORY must not drift to superseded framing: ${drift}`);
  }
});

test("old specs are visibly historical and one current plan is obvious", () => {
  for (const [name, text] of Object.entries(historicalText)) {
    assert.ok(
      /superseded|historical/.test(low(text)),
      `${name} must be marked superseded or historical`
    );
  }
  assert.ok(SPEC_004, "specs/004-website-appraisal/plan.md must exist as the current plan");
  assert.ok(SPEC_004.includes("Website Appraisal"), "004 plan must name the current offer");
  assert.ok(SPEC_004.includes("human-reviewed"), "004 plan must state human-reviewed delivery");
});

test("the current plan invents no performance, price, or guarantee claims", () => {
  for (const forbidden of ["ROAS", "guaranteed", "10x", "$"]) {
    assert.ok(
      !SPEC_004.includes(forbidden),
      `004 plan must not invent ${JSON.stringify(forbidden)} claims`
    );
  }
});

test("the contract guard is wired into npm test", () => {
  assert.equal(
    PACKAGE_JSON.scripts["test:contract"],
    "node --test scripts/test-product-contract.mjs",
    "package.json must expose the contract guard as test:contract"
  );
  assert.ok(
    PACKAGE_JSON.scripts.test.includes("test:contract"),
    "npm test must run the contract guard"
  );
});
