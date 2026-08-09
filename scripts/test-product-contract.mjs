// Product-contract regression guard.
//
// Dependency-free: node:test, node:assert/strict, node:fs, node:url only.
//
// Keeps the repository contract truthful: the repo descriptors (README.md,
// MEMORY.md, package.json) must describe the Website Appraisal and the
// human-reviewed desk as the current offer, the Agent Desk must stay
// explicit legacy context, and the specs must make supersession and current
// plan discovery unambiguous. Also guards the public agent-readable truth
// files (llms.txt, offer.md) read-only, so the demotion and price/refund
// rules cannot drift.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (rel) =>
  readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), "utf8");

const README = read("README.md");
const MEMORY = read("MEMORY.md");
const PACKAGE = read("package.json");
const S001_PLAN = read("specs/001-public-buyer-page/plan.md");
const S001_SPEC = read("specs/001-public-buyer-page/spec.md");
const S001_TASKS = read("specs/001-public-buyer-page/tasks.md");
const S002_PLAN = read("specs/002-minimal-input-agent-desk/plan.md");
const S002_SPEC = read("specs/002-minimal-input-agent-desk/spec.md");
const S002_TASKS = read("specs/002-minimal-input-agent-desk/tasks.md");
const S003 = read("specs/003-wellness-clinic-launch/plan.md");
const S004 = read("specs/004-website-appraisal/plan.md");
const LLMS = read("public/llms.txt");
const OFFER = read("public/offer.md");

test("README describes the Website Appraisal and human-reviewed delivery as the current offer", () => {
  assert.ok(README.includes("Website Appraisal"), "README names the Website Appraisal");
  assert.ok(README.includes("human-reviewed desk"), "README names the human-reviewed desk");
  assert.ok(!README.includes("Self-serve TinyStudio Agent Desk"), "README no longer presents the Agent Desk as the current identity");
});

test("README preserves Agent Desk and API mechanics as explicit legacy context", () => {
  assert.ok(README.includes("legacy Agent Desk"), "README marks the Agent Desk as legacy");
  assert.ok(README.includes("not the current offer"), "README demotes the Agent Desk");
  assert.ok(README.includes("/api/agent-audit"), "README documents the live legacy agent-audit API");
  assert.ok(README.includes("/api/signups"), "README documents the live signups API");
  assert.ok(README.includes("/agent-desk"), "README documents the retired legacy surface");
});

test("MEMORY.md reflects the Website Appraisal, human review, and legacy mechanics", () => {
  assert.ok(MEMORY.includes("Website Appraisal"), "MEMORY names the Website Appraisal");
  assert.ok(/Human review/i.test(MEMORY), "MEMORY states the human review boundary");
  assert.ok(MEMORY.includes("demoted"), "MEMORY marks the Agent Desk as demoted");
  assert.ok(MEMORY.includes("/api/agent-audit"), "MEMORY documents the live legacy agent-audit API");
  assert.ok(MEMORY.includes("but not submitted business context"), "MEMORY keeps the no-storage boundary");
  assert.ok(MEMORY.includes("not the current offer"), "MEMORY demotes the Agent Desk");
});

test("historical Agent Desk plans (001, 002) are visibly superseded and point at the current plan", () => {
  for (const [name, doc] of Object.entries({
    "001 plan": S001_PLAN,
    "001 spec": S001_SPEC,
    "001 tasks": S001_TASKS,
    "002 plan": S002_PLAN,
    "002 spec": S002_SPEC,
    "002 tasks": S002_TASKS,
  })) {
    assert.ok(doc.includes("SUPERSEDED"), `${name} carries the SUPERSEDED status`);
    assert.ok(doc.includes("specs/004-website-appraisal"), `${name} points at the current plan`);
  }
  assert.ok(S001_TASKS.includes("- [x] Deploy Agent Desk routes"), "001 tasks are closed out (routes live as the legacy surface)");
});

test("spec 003 keeps its approval status and price/legal terms while being relabeled", () => {
  assert.ok(S003.includes("Status: approved by Nish 2026-08-05"), "003 keeps its approval record");
  assert.ok(S003.includes("Superseded as the current plan"), "003 is labeled superseded as the current plan");
  assert.ok(S003.includes("specs/004-website-appraisal/plan.md"), "003 points at the current plan");
  assert.ok(S003.includes("$2,500/month, 3-month minimum"), "003 price terms are preserved");
  assert.ok(S003.includes("delivery guarantee"), "003 delivery guarantee is preserved");
  assert.ok(S003.includes("full refund"), "003 refund term is preserved");
  assert.ok(S003.includes("never a satisfaction guarantee"), "003 guarantee boundary is preserved");
});

test("specs/004 is the canonical current plan covering surfaces, legacy boundary, safety, and verification", () => {
  assert.ok(S004.includes("current plan"), "004 declares itself the current plan");
  assert.ok(S004.includes("Present Surfaces"), "004 covers present surfaces");
  assert.ok(S004.includes("/audit.html") && S004.includes("/agents.html") && S004.includes("/pricing.html"), "004 names the appraisal, desk, and pricing pages");
  assert.ok(S004.includes("Legacy Boundary"), "004 covers the legacy boundary");
  assert.ok(S004.includes("/api/agent-audit") && S004.includes("/agent-desk"), "004 documents the live legacy API and retired surface");
  assert.ok(S004.includes("app.tinystudio.io"), "004 documents the app/api retirement");
  assert.ok(S004.includes("Safety"), "004 covers safety");
  assert.ok(/Human review/i.test(S004), "004 states the human review boundary");
  assert.ok(S004.includes("Verification"), "004 covers verification");
  assert.ok(S004.includes("npm test") && S004.includes("test-product-contract"), "004 wires in the product-contract guard");
});

test("current plan discovery is obvious from the repo descriptors", () => {
  assert.ok(README.includes("specs/004-website-appraisal/plan.md"), "README names the current plan path");
  assert.ok(MEMORY.includes("specs/004-website-appraisal/plan.md"), "MEMORY names the current plan path");
  assert.ok(README.includes("Current Plan"), "README has a discoverable Current Plan section");
});

test("public agent-readable truth keeps the demotion and price/refund rules", () => {
  assert.ok(LLMS.includes("The Website Appraisal"), "llms.txt names the Website Appraisal");
  assert.ok(LLMS.includes("Legacy Self-Serve Agent Desk"), "llms.txt keeps the legacy Agent Desk section");
  assert.ok(OFFER.includes("is not the current offer"), "offer.md keeps the Agent Desk demotion statement");
  assert.doesNotMatch(LLMS + OFFER, /\$\s?\d/, "llms.txt and offer.md must not restate a dollar amount");
  assert.doesNotMatch(LLMS + OFFER, /\brefund\w*\b/i, "llms.txt and offer.md must not restate refund terms");
});

test("the product-contract guard is wired into npm test", () => {
  assert.ok(
    PACKAGE.includes('"test:product-contract": "node --test scripts/test-product-contract.mjs"'),
    "package.json exposes test:product-contract"
  );
  assert.ok(PACKAGE.includes("npm run test:product-contract"), "npm test chain includes test:product-contract");
});
