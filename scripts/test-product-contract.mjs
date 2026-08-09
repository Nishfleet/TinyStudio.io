// Deterministic regression guard for the repository's product contract.
//
// TinyStudio's current product is The Website Appraisal — the free leak audit
// of high-ticket service homepages — and the human-reviewed desk that closes
// what the audit finds (public truth: public/index.html, public/llms.txt,
// public/offer.md). The self-serve Agent Desk is retired; /api/agent-audit is
// a still-live legacy mechanism. The contract documents (README.md, MEMORY.md,
// package.json) and the spec status markers must keep describing exactly that.
//
// This test has no dependencies beyond node:test and node:assert/strict, so it
// runs in CI exactly as it runs locally. It is designed to FAIL against the
// pre-appraisal origin/main (README/MEMORY/package.json still called the
// Agent Desk the current product, specs 001/002 had no historical markers,
// specs/004 did not exist) and to PASS on a branch where the contract
// documents and markers match the current product.
//
//   node --test scripts/test-product-contract.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
// Case- and whitespace-insensitive compare, so line-wrapped prose and heading
// case cannot hide drift. Blockquote markers ("^> ") are stripped first so a
// reflowed marker line still reads as plain prose.
const norm = (text) => text.toLowerCase().replace(/^>\s?/gm, "").replace(/\s+/g, " ");

const README = read("README.md");
const MEMORY = read("MEMORY.md");
const PACKAGE = read("package.json");
const PACKAGE_JSON = JSON.parse(PACKAGE);
const PACKAGE_DESCRIPTION = PACKAGE_JSON.description ?? "";

const CURRENT_PLAN_PATH = "specs/004-website-appraisal/plan.md";
const LEGACY_DELIVERABLE = "Pipeline Brief, Implementation Checklist, and Weekly Fix Report";

// The old current-product framings. If any of these reappears, the repo has
// silently regressed to presenting the retired self-serve Agent Desk as the
// current product.
const OLD_PACKAGE_DESCRIPTION = "Self-serve TinyStudio Agent Desk on Cloudflare Workers.";
const OLD_README_SUBJECT = "Self-serve TinyStudio Agent Desk for high-ticket pipeline setup.";
const OLD_MEMORY_REOPENING = "reopening as a self-serve AI workspace";

const readPlan004 = () =>
  existsSync(new URL(`../${CURRENT_PLAN_PATH}`, import.meta.url)) ? read(CURRENT_PLAN_PATH) : "";

// ---- Current product descriptors -----------------------------------------

test("README.md names The Website Appraisal and human-reviewed delivery as the current product", () => {
  const content = norm(README);
  assert.ok(content.includes(norm("The Website Appraisal")), "README must name The Website Appraisal");
  assert.ok(content.includes("human-reviewed"), "README must name the human-reviewed desk");
  assert.ok(content.includes(norm("free leak audit")), "README must keep the current offer descriptor");
});

test("MEMORY.md names The Website Appraisal and human-reviewed delivery as the current product", () => {
  const content = norm(MEMORY);
  assert.ok(content.includes(norm("The Website Appraisal")), "MEMORY.md must name The Website Appraisal");
  assert.ok(content.includes("human-reviewed"), "MEMORY.md must name the human-reviewed desk");
  assert.ok(content.includes(norm("free leak audit")), "MEMORY.md must keep the current offer descriptor");
});

test("package.json names the current product, not the self-serve Agent Desk", () => {
  assert.ok(
    PACKAGE_DESCRIPTION.includes("The Website Appraisal"),
    `package.json description must name The Website Appraisal: ${JSON.stringify(PACKAGE_DESCRIPTION)}`
  );
  assert.ok(
    PACKAGE_DESCRIPTION.includes("human-reviewed"),
    `package.json description must name the human-reviewed desk: ${JSON.stringify(PACKAGE_DESCRIPTION)}`
  );
  assert.notEqual(
    PACKAGE_DESCRIPTION,
    OLD_PACKAGE_DESCRIPTION,
    "package.json description must not be the retired Agent Desk description"
  );
  assert.ok(
    !norm(PACKAGE_DESCRIPTION).includes("agent desk"),
    `package.json description must not present the Agent Desk as the product: ${JSON.stringify(PACKAGE_DESCRIPTION)}`
  );
});

// ---- No new price, performance, or outcome claims --------------------------

test("active guidance adds no new price, performance, or outcome claims", () => {
  for (const [fileName, content] of [
    ["README.md", README],
    ["MEMORY.md", MEMORY]
  ]) {
    assert.ok(
      !/\$\s?\d/.test(content),
      `${fileName} must not restate a dollar amount; pricing.html owns the price`
    );
    for (const phrase of [
      "guaranteed revenue",
      "guaranteed roas",
      "guaranteed booked calls",
      "guaranteed sales",
      "guaranteed profit",
      "10x revenue",
      "10x sales",
      "rank #1"
    ]) {
      assert.ok(
        !norm(content).includes(phrase),
        `${fileName} must not promise: ${phrase}`
      );
    }
  }
});

// ---- The old self-serve framing must not return ----------------------------

test("README.md, MEMORY.md and package.json stop framing the self-serve Agent Desk as the current product", () => {
  assert.ok(
    !norm(README).includes(norm(OLD_README_SUBJECT)),
    "README must not open with the retired Agent Desk subject line"
  );
  assert.ok(
    !norm(MEMORY).includes(norm(OLD_MEMORY_REOPENING)),
    "MEMORY.md must not describe the site as reopening as a self-serve AI workspace"
  );
  assert.ok(
    !norm(README).includes("self-serve tiny studio agent desk"),
    "README must not name the self-serve Agent Desk as the product"
  );
});

// ---- Legacy mechanics stay documented ---------------------------------------

test("the legacy Agent Desk and /api/agent-audit remain documented as legacy", () => {
  for (const [fileName, content] of [
    ["README.md", README],
    ["MEMORY.md", MEMORY]
  ]) {
    const normalized = norm(content);
    assert.ok(normalized.includes("/api/agent-audit"), `${fileName} must document the /api/agent-audit mechanism`);
    assert.ok(normalized.includes("legacy"), `${fileName} must frame the Agent Desk mechanics as legacy`);
    assert.ok(normalized.includes("retired"), `${fileName} must frame the Agent Desk surface as retired`);
    assert.ok(
      normalized.includes(norm(LEGACY_DELIVERABLE)),
      `${fileName} must name the legacy deliverable ${LEGACY_DELIVERABLE}`
    );
    assert.ok(
      normalized.includes("not the current offer"),
      `${fileName} must state the Agent Desk is not the current offer`
    );
  }
});

// ---- Historical / current plan markers --------------------------------------

test("specs 001 and 002 are unmistakably historical", () => {
  for (const spec of ["001-public-buyer-page", "002-minimal-input-agent-desk"]) {
    for (const file of ["plan.md", "spec.md", "tasks.md"]) {
      const content = norm(read(`specs/${spec}/${file}`));
      assert.ok(content.includes("status: historical"), `specs/${spec}/${file} must carry the historical status marker`);
      assert.ok(content.includes("superseded"), `specs/${spec}/${file} must carry the superseded marker`);
      assert.ok(content.includes("no longer"), `specs/${spec}/${file} must state the product is no longer current`);
      assert.ok(
        content.includes("current product plan"),
        `specs/${spec}/${file} must point at the current product plan`
      );
      assert.ok(
        content.includes("004-website-appraisal"),
        `specs/${spec}/${file} must point at specs/004-website-appraisal/plan.md`
      );
    }
  }
});

test("spec 003 cannot be mistaken for the current product plan and keeps its pricing wording", () => {
  const plan003 = read("specs/003-wellness-clinic-launch/plan.md");
  assert.ok(
    norm(plan003).includes("status: not the current product plan"),
    "spec 003 must carry the NOT THE CURRENT PRODUCT PLAN marker"
  );
  assert.ok(
    norm(plan003).includes("004-website-appraisal"),
    "spec 003 must point at specs/004-website-appraisal/plan.md as the current plan"
  );
  // Preserved verbatim as approved; the marker must never erode the wording.
  assert.ok(plan003.includes("$2,500"), "spec 003 must keep its approved pricing wording");
  assert.ok(plan003.includes("3-month minimum"), "spec 003 must keep its approved terms wording");
  assert.ok(plan003.includes("full refund"), "spec 003 must keep its approved guarantee wording");
  assert.ok(/delivery\s*\*?guarantee/i.test(plan003), "spec 003 must keep its approved delivery-guarantee wording");
});

test("specs/004-website-appraisal/plan.md is the obvious current plan", () => {
  const plan004 = readPlan004();
  assert.ok(plan004, "specs/004-website-appraisal/plan.md must exist as the current product plan");
  assert.ok(norm(plan004).includes("current product plan"), "plan 004 must declare itself the current product plan");
  assert.ok(norm(plan004).includes(norm("The Website Appraisal")), "plan 004 must name The Website Appraisal");
  assert.ok(norm(plan004).includes("human-reviewed"), "plan 004 must name the human-reviewed desk");
  assert.ok(norm(plan004).includes("/api/agent-audit"), "plan 004 must document the legacy /api/agent-audit mechanism");
  assert.ok(norm(plan004).includes("test-product-contract.mjs"), "plan 004 must own the contract regression guard");
  assert.ok(norm(plan004).includes("historical"), "plan 004 must demote specs 001/002 as historical");
  assert.ok(
    norm(plan004).includes("not the current product plan"),
    "plan 004 must demote spec 003 as not the current product plan"
  );
});

test("README.md and MEMORY.md point at the current plan", () => {
  assert.ok(
    norm(README).includes("specs/004-website-appraisal/plan.md"),
    "README must point at specs/004-website-appraisal/plan.md as the current plan"
  );
  assert.ok(
    norm(MEMORY).includes("specs/004-website-appraisal/plan.md"),
    "MEMORY.md must point at specs/004-website-appraisal/plan.md as the current plan"
  );
});

test("the contract guard is wired into npm test", () => {
  assert.ok(
    PACKAGE.includes('"test:contract": "node --test scripts/test-product-contract.mjs"'),
    "package.json must expose test:contract running scripts/test-product-contract.mjs"
  );
  const testScript = PACKAGE_JSON.scripts.test ?? "";
  assert.ok(
    testScript.includes("test:contract"),
    `npm test must run the contract guard: ${JSON.stringify(testScript)}`
  );
});
