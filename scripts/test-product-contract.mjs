// Product-contract regression test for the TinyStudio repository truth.
//
// TinyStudio's current offer is The Website Appraisal (free leak audit of
// high-ticket service homepages) delivered through a human-reviewed desk. The
// self-serve Agent Desk is retired: its /agent-desk surface and /api/agent-audit
// endpoint still exist as legacy mechanics but are not the current product.
//
// This test guards only files this contract owns (README.md, MEMORY.md,
// package.json, and the specs/ plans), so it tolerates unrelated repository
// growth and never parses public/ or src/ implementation details. It asserts
// public truths — product framing, spec status markers, the current-plan
// pointer, the legacy Agent Desk acknowledgement, and the npm test wiring —
// rather than frozen wording, prices, guarantees, or legal fragments.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// Framing strings that made the retired Agent Desk look like the current
// product. Their reappearance in the top-level truth files is the regression
// this test exists to reject.
const OLD_README_LEAD = "Self-serve TinyStudio Agent Desk for high-ticket pipeline setup.";
const OLD_MEMORY_LINE = "reopening as a self-serve AI workspace";
const OLD_PACKAGE_DESCRIPTION = "Self-serve TinyStudio Agent Desk on Cloudflare Workers.";

// Current truth markers the top-level files must carry.
const CURRENT_PRODUCT = "The Website Appraisal";
const CURRENT_DELIVERY = "human-reviewed";

// Spec status markers.
const MARKER_HISTORICAL = "Status: HISTORICAL";
const MARKER_SUPERSEDED = "Status: SUPERSEDED";
const MARKER_CURRENT = "Status: CURRENT";

// The one unmistakable path future agents must find to the current plan.
const CURRENT_PLAN_PATH = "specs/004-website-appraisal/plan.md";

const HISTORICAL_SPEC_FILES = [
  "specs/001-public-buyer-page/spec.md",
  "specs/001-public-buyer-page/plan.md",
  "specs/001-public-buyer-page/tasks.md",
  "specs/002-minimal-input-agent-desk/spec.md",
  "specs/002-minimal-input-agent-desk/plan.md",
  "specs/002-minimal-input-agent-desk/tasks.md"
];

// Returns a list of human-readable violations for the top-level framing of a
// current-product document; an empty list means the framing is correct.
export function currentFramingIssues(text) {
  const issues = [];
  if (!text.includes(CURRENT_PRODUCT)) {
    issues.push(`current product truth must name ${CURRENT_PRODUCT}`);
  }
  if (!text.includes(CURRENT_DELIVERY)) {
    issues.push(`current product truth must name ${CURRENT_DELIVERY} delivery`);
  }
  if (text.includes(OLD_README_LEAD)) {
    issues.push("README must not present the retired Agent Desk as the product lead");
  }
  if (text.includes(OLD_MEMORY_LINE)) {
    issues.push("MEMORY must not present the Agent Desk reopening framing");
  }
  return issues;
}

test("README.md frames the current product and points at the current plan", () => {
  const readme = read("README.md");
  const issues = currentFramingIssues(readme);
  assert.deepEqual(issues, [], issues.join("; "));
  // The retired Agent Desk must be documented as legacy, not removed or current.
  assert.ok(readme.includes("retired"), "README must mark the Agent Desk retired");
  assert.ok(readme.includes("legacy"), "README must mark the Agent Desk legacy");
  assert.ok(readme.includes("/agent-desk"), "README must document the legacy /agent-desk surface");
  assert.ok(readme.includes("/api/agent-audit"), "README must document the legacy /api/agent-audit endpoint");
  assert.ok(readme.includes(CURRENT_PLAN_PATH), "README must point at the current plan");
});

test("MEMORY.md frames the current product and points at the current plan", () => {
  const memory = read("MEMORY.md");
  const issues = currentFramingIssues(memory);
  assert.deepEqual(issues, [], issues.join("; "));
  assert.ok(memory.includes("retired"), "MEMORY must mark the Agent Desk retired");
  assert.ok(memory.includes("legacy"), "MEMORY must mark the Agent Desk legacy");
  assert.ok(memory.includes("/agent-desk"), "MEMORY must acknowledge the legacy /agent-desk surface");
  assert.ok(memory.includes("/api/agent-audit"), "MEMORY must acknowledge the legacy /api/agent-audit endpoint");
  assert.ok(memory.includes(CURRENT_PLAN_PATH), "MEMORY must point at the current plan");
});

test("package.json describes the current product and wires the contract test", () => {
  const pkg = JSON.parse(read("package.json"));
  const issues = currentFramingIssues(pkg.description);
  assert.deepEqual(issues, [], issues.join("; "));
  assert.ok(!pkg.description.includes(OLD_PACKAGE_DESCRIPTION), "package.json must not carry the old Agent Desk description");
  assert.ok(pkg.scripts["test:contract"] === "node --test scripts/test-product-contract.mjs", "test:contract must run the contract test");
  assert.ok(pkg.scripts.test.includes("test:contract"), "npm test must include the contract test");
});

test("specs 001 and 002 are unmistakably historical implementation records", () => {
  for (const path of HISTORICAL_SPEC_FILES) {
    const file = read(path);
    assert.ok(file.includes(MARKER_HISTORICAL), `${path} must carry the ${MARKER_HISTORICAL} marker`);
    assert.ok(file.includes("retired"), `${path} must state the Agent Desk is retired`);
    assert.ok(file.includes(CURRENT_PLAN_PATH), `${path} must point at the current plan`);
  }
});

test("spec 003 is superseded and defers to the current plan", () => {
  const plan = read("specs/003-wellness-clinic-launch/plan.md");
  assert.ok(plan.includes(MARKER_SUPERSEDED), "spec 003 must carry the SUPERSEDED marker");
  assert.ok(plan.includes(CURRENT_PLAN_PATH), "spec 003 must point at the current plan");
});

test("the current plan exists at specs/004-website-appraisal/plan.md", () => {
  const plan = read(CURRENT_PLAN_PATH);
  assert.ok(plan.includes(MARKER_CURRENT), "spec 004 must carry the CURRENT marker");
  assert.ok(plan.includes(CURRENT_PRODUCT), "spec 004 must name The Website Appraisal");
  assert.ok(plan.includes(CURRENT_DELIVERY), "spec 004 must name human-reviewed delivery");
  assert.ok(plan.includes("/agent-desk"), "spec 004 must document the legacy /agent-desk surface");
  assert.ok(plan.includes("/api/agent-audit"), "spec 004 must document the legacy /api/agent-audit endpoint");
  assert.ok(plan.includes("legacy"), "spec 004 must cover legacy mechanics");
  assert.ok(plan.includes("## Boundaries"), "spec 004 must keep its boundaries section");
  assert.ok(plan.includes("## Verification"), "spec 004 must have a Verification section");
  assert.ok(plan.includes("node --test scripts/test-product-contract.mjs"), "spec 004 must cite the contract test");
  // The current plan adds no prices and no new promises: pricing/legal copy is
  // owned at /pricing, so dollar amounts here are a product-contract regression.
  assert.ok(!/\$\s?\d/.test(plan), "spec 004 must not carry prices (pricing copy lives at /pricing)");
});

test("checker rejects the old Agent Desk framings (fixtures)", () => {
  const oldReadme = "# TinyStudio.io\n\nSelf-serve TinyStudio Agent Desk for high-ticket pipeline setup.\n";
  const oldMemory = "As of the Agent Desk pass, `tinystudio.io` is reopening as a self-serve AI workspace for high-ticket pipeline setup.\n";
  const oldDescription = "Self-serve TinyStudio Agent Desk on Cloudflare Workers.";

  const readmeIssues = currentFramingIssues(oldReadme);
  assert.ok(readmeIssues.some((issue) => issue.includes("product lead")), `got: ${readmeIssues.join("; ")}`);

  const memoryIssues = currentFramingIssues(oldMemory);
  assert.ok(memoryIssues.some((issue) => issue.includes("Agent Desk reopening framing")), `got: ${memoryIssues.join("; ")}`);

  const descriptionIssues = currentFramingIssues(oldDescription);
  assert.ok(descriptionIssues.some((issue) => issue.includes("must name The Website Appraisal")), `got: ${descriptionIssues.join("; ")}`);
});
