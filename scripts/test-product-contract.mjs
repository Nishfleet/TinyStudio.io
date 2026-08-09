// Product-contract regression test for the TinyStudio repository truth.
//
// TinyStudio's current offer is The Website Appraisal (free leak audit of
// high-ticket service homepages) delivered through a human-reviewed desk. The
// self-serve Agent Desk is retired: its /agent-desk surface and /api/agent-audit
// endpoint still exist as legacy mechanics but are not the current product.
//
// This test guards the repository contract deterministically:
//
//   1. README.md, MEMORY.md and package.json present The Website Appraisal and
//      human-reviewed delivery as current truth, never the Agent Desk;
//   2. README.md and MEMORY.md point at the current plan so "read the current
//      plan" resolves unambiguously;
//   3. specs 001 and 002 are unmistakably HISTORICAL, spec 003 is SUPERSEDED,
//      and the current plan exists at specs/004-website-appraisal/plan.md with
//      the CURRENT marker;
//   4. the legacy /agent-desk surface and /api/agent-audit endpoint stay
//      documented as legacy/operational rather than removed;
//   5. known-bad fixtures (the old Agent Desk framings) are rejected, so the
//      checker proves it rejects the regressions it guards, not just that the
//      current files pass.
//
// Status is only accepted in the leading status banner immediately after each
// document's H1; conflicting status claims are rejected, an active Agent Desk
// framing fails even when the required current-product terms also appear, and
// the current plan's no-guarantees boundary requires an explicit negation tied
// to guarantee/promise language rather than a frozen sentence — every clause
// carrying guarantee/promise language must carry that negation itself, and a
// demotion word never excuses an active Agent Desk claim elsewhere on the line.
//
// The guard is deliberately scoped to repository contract truth. Runtime
// behavior of public/ and src/ is owned by the application test suite, exact
// pricing/legal prose is owned by the public copy files, and the dependency
// inventory is owned by package-lock.json — none of those belong here.

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

// The current plan every historical/superseded record must point at.
const CURRENT_PLAN = "specs/004-website-appraisal/plan.md";

const HISTORICAL_SPEC_FILES = [
  "specs/001-public-buyer-page/spec.md",
  "specs/001-public-buyer-page/plan.md",
  "specs/001-public-buyer-page/tasks.md",
  "specs/002-minimal-input-agent-desk/spec.md",
  "specs/002-minimal-input-agent-desk/plan.md",
  "specs/002-minimal-input-agent-desk/tasks.md"
];

// --- Leading status banner -------------------------------------------------

// The status banner is the blockquote that begins immediately after the
// document's first H1 heading (only blank lines may intervene). A status
// marker anywhere else in the document does not satisfy the contract.
function leadingStatusBanner(text) {
  const lines = text.split(/\r?\n/);
  const h1 = lines.findIndex((line) => /^#\s/.test(line));
  if (h1 === -1) return null;
  let i = h1 + 1;
  while (i < lines.length && /^\s*$/.test(lines[i])) i += 1;
  if (i >= lines.length || !lines[i].startsWith(">")) return null;
  const banner = [];
  while (i < lines.length && lines[i].startsWith(">")) {
    banner.push(lines[i]);
    i += 1;
  }
  return banner.join("\n");
}

// True when `marker` sits in the leading banner, not merely somewhere in the
// document body.
function hasLeadingStatus(text, marker) {
  const banner = leadingStatusBanner(text);
  return banner !== null && banner.includes(marker);
}

// Status markers that contradict each expected marker wherever they appear:
// a document may claim exactly one spec status.
const CONFLICTING_STATUS = {
  [MARKER_HISTORICAL]: [MARKER_CURRENT, MARKER_SUPERSEDED],
  [MARKER_SUPERSEDED]: [MARKER_CURRENT, MARKER_HISTORICAL],
  [MARKER_CURRENT]: [MARKER_HISTORICAL, MARKER_SUPERSEDED]
};

// Other status markers the document also claims anywhere in its body, if any.
function conflictingStatusMarkers(text, marker) {
  return CONFLICTING_STATUS[marker].filter((other) => text.includes(other));
}

// --- Current-product framing ----------------------------------------------

// Lines that mention the Agent Desk must never present it as current, active,
// reopening, back, or the product/offer — even in a document that also names
// The Website Appraisal and human-reviewed delivery. The active claim is
// detected first: a demotion word ("retired", "legacy") elsewhere on the line
// does not excuse a line that reactivates the desk; the line passes only when
// the clause holding the active claim carries its own explicit negation
// ("not", "never", "no longer", "without").
const AGENT_DESK_ACTIVE_PATTERNS = [
  /reopen/i,
  /Agent Desk[^\n.]{0,120}(current|active|alive|returning|back)/i,
  /(current|active|alive|returning)[^\n.]{0,120}Agent Desk/i,
  /Agent Desk[^\n.]{0,160}(is|remains|becomes?)\s+(the|our|a)?\s*(current\s+)?(product|offer)/i
];
const AGENT_DESK_NEGATED = /\b(not|never|no longer|without)\b/i;

// Returns violations for lines that present the retired Agent Desk as alive.
function agentDeskFramingIssues(text) {
  const issues = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/\bAgent Desk\b/i.test(line)) continue;
    const activeMatch = AGENT_DESK_ACTIVE_PATTERNS
      .map((pattern) => line.match(pattern))
      .find((match) => match !== null);
    if (activeMatch === undefined) continue;
    const claimEnd = activeMatch.index + activeMatch[0].length;
    if (!AGENT_DESK_NEGATED.test(clauseAround(line, claimEnd - 1))) {
      issues.push(`must not present the retired Agent Desk as current, reopening, or the product/offer: ${line.trim()}`);
    }
  }
  return issues;
}

// --- Clause boundaries ------------------------------------------------------

// Clauses are separated at contrast words (but, however, yet) and at
// sentence/semicolon boundaries. Commas and colons never split clauses, so
// ordinary comma-separated outcome lists stay together.
const CLAUSE_SEPARATOR = /\s*;\s*|[.!?]\s+|\s+\b(?:but|however|yet)\b\s*,?\s+/gi;

// Returns the trimmed clauses of `line` split at clause boundaries.
function clausesOf(line) {
  const clauses = [];
  let start = 0;
  for (const match of line.matchAll(CLAUSE_SEPARATOR)) {
    const clause = line.slice(start, match.index).trim();
    if (clause !== "") clauses.push(clause);
    start = match.index + match[0].length;
  }
  const tail = line.slice(start).trim();
  if (tail !== "") clauses.push(tail);
  return clauses;
}

// Returns the trimmed clause of `line` that contains character offset `index`.
function clauseAround(line, index) {
  let start = 0;
  for (const match of line.matchAll(CLAUSE_SEPARATOR)) {
    if (index < match.index) return line.slice(start, match.index).trim();
    start = match.index + match[0].length;
  }
  return line.slice(start).trim();
}

// --- No-guarantees boundary ------------------------------------------------

// Returns the text of a `## Heading` section up to the next `## ` heading.
function sectionText(text, heading) {
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) return null;
  const end = lines.findIndex((line, index) => index > start && /^##\s/.test(line));
  return lines.slice(start + 1, end === -1 ? undefined : end).join("\n");
}

// The current plan keeps its no-guarantees boundary only when at least one
// Boundaries clause ties an explicit negation (no, not, never, must not,
// without) to guarantee/promise language — and every other clause carrying
// guarantee/promise language is negated too. Clauses are split at contrast
// words (but, however, yet) and sentence/semicolon boundaries, never inside
// comma-separated outcome lists, so a negation in one clause does not excuse a
// positive guarantee/promise claim in another. Exact sentences are not frozen.
const GUARANTEE_TERMS = /\b(guarantee|guarantees|promise|promises)\b/i;
const GUARANTEE_NEGATIONS = /\b(no|not|never|must not|without)\b/i;

function boundaryGuaranteeIssues(text) {
  const section = sectionText(text, "## Boundaries");
  if (section === null) {
    return ["spec 004 must keep a Boundaries section"];
  }
  const issues = [];
  let negated = false;
  for (const line of section.split(/\r?\n/)) {
    for (const clause of clausesOf(line)) {
      if (!GUARANTEE_TERMS.test(clause)) continue;
      if (GUARANTEE_NEGATIONS.test(clause)) {
        negated = true;
        continue;
      }
      issues.push(`spec 004 Boundaries must tie an explicit negation (no, not, never, must not, without) to guarantee/promise language: ${clause.trim()}`);
    }
  }
  if (!negated) {
    issues.push("spec 004 Boundaries must tie an explicit negation (no, not, never, must not, without) to guarantee/promise language");
  }
  return issues;
}

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
  issues.push(...agentDeskFramingIssues(text));
  return issues;
}

test("README.md frames The Website Appraisal as the current product", () => {
  const readme = read("README.md");
  const issues = currentFramingIssues(readme);
  assert.deepEqual(issues, [], issues.join("; "));
  assert.ok(readme.includes(CURRENT_PLAN), "README must point at the current plan");
  // The retired Agent Desk must be documented as legacy, not removed or current.
  assert.ok(readme.includes("retired"), "README must mark the Agent Desk retired");
  assert.ok(readme.includes("legacy"), "README must mark the Agent Desk legacy");
  assert.ok(readme.includes("/agent-desk"), "README must document the legacy /agent-desk surface");
  assert.ok(readme.includes("/api/agent-audit"), "README must document the legacy /api/agent-audit endpoint");
});

test("MEMORY.md frames The Website Appraisal as the current product", () => {
  const memory = read("MEMORY.md");
  const issues = currentFramingIssues(memory);
  assert.deepEqual(issues, [], issues.join("; "));
  assert.ok(memory.includes(CURRENT_PLAN), "MEMORY must point at the current plan");
  assert.ok(memory.includes("retired"), "MEMORY must mark the Agent Desk retired");
  assert.ok(memory.includes("legacy"), "MEMORY must mark the Agent Desk legacy");
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
    assert.ok(hasLeadingStatus(file, MARKER_HISTORICAL), `${path} must carry ${MARKER_HISTORICAL} in the banner immediately after its H1`);
    assert.deepEqual(conflictingStatusMarkers(file, MARKER_HISTORICAL), [], `${path} must not also claim CURRENT or SUPERSEDED status`);
    assert.ok(file.includes("retired"), `${path} must state the Agent Desk is retired`);
    assert.ok(file.includes(CURRENT_PLAN), `${path} must point at the current plan`);
  }
});

test("spec 003 is superseded and points at the current plan", () => {
  const plan = read("specs/003-wellness-clinic-launch/plan.md");
  assert.ok(hasLeadingStatus(plan, MARKER_SUPERSEDED), "spec 003 must carry the SUPERSEDED marker in the banner immediately after its H1");
  assert.deepEqual(conflictingStatusMarkers(plan, MARKER_SUPERSEDED), [], "spec 003 must not also claim CURRENT or HISTORICAL status");
  assert.ok(plan.includes(CURRENT_PLAN), "spec 003 must point at the current plan");
  // Spec 003's money/legal body is preserved by the repo, not asserted here:
  // the guard does not couple to exact pricing or legal sentence fragments.
});

test("the current plan exists at specs/004-website-appraisal/plan.md", () => {
  const plan = read(CURRENT_PLAN);
  assert.ok(hasLeadingStatus(plan, MARKER_CURRENT), "spec 004 must carry the CURRENT marker in the banner immediately after its H1");
  assert.deepEqual(conflictingStatusMarkers(plan, MARKER_CURRENT), [], "spec 004 must not also claim HISTORICAL or SUPERSEDED status");
  assert.ok(plan.includes(CURRENT_PRODUCT), "spec 004 must name The Website Appraisal");
  assert.ok(plan.includes(CURRENT_DELIVERY), "spec 004 must name human-reviewed delivery");
  assert.deepEqual(boundaryGuaranteeIssues(plan), [], boundaryGuaranteeIssues(plan).join("; "));
  assert.ok(plan.includes("/audit"), "spec 004 must keep the /audit appraisal surface");
  assert.ok(plan.includes("/agents"), "spec 004 must keep the /agents desk surface");
  assert.ok(plan.includes("/pricing"), "spec 004 must keep the /pricing surface");
  assert.ok(plan.includes("/agent-desk"), "spec 004 must document the legacy /agent-desk surface");
  assert.ok(plan.includes("/api/agent-audit"), "spec 004 must document the legacy /api/agent-audit endpoint");
  assert.ok(plan.includes("legacy"), "spec 004 must cover legacy mechanics");
  assert.ok(plan.includes("## Verification"), "spec 004 must have a Verification section");
  assert.ok(plan.includes("node --test scripts/test-product-contract.mjs"), "spec 004 must cite the contract test");
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

test("checker rejects misplaced, conflicting, and contradictory truth (fixtures)", () => {
  // Misplaced status: markers buried in the body do not satisfy the
  // leading-banner rule, no matter how many of them appear.
  const misplacedStatus =
    "# Fake Feature Specification\n" +
    "\n" +
    "## Body\n" +
    "\n" +
    `This record is old: ${MARKER_HISTORICAL}. The plan claims ${MARKER_CURRENT} ` +
    `and also ${MARKER_SUPERSEDED}, but none of these sit in a banner after the H1.\n`;
  assert.equal(hasLeadingStatus(misplacedStatus, MARKER_HISTORICAL), false, "a marker later in the document must not count as the leading banner");
  assert.equal(hasLeadingStatus(misplacedStatus, MARKER_CURRENT), false, "a marker later in the document must not count as the leading banner");

  // Conflicting status: a HISTORICAL banner cannot coexist with a CURRENT
  // claim elsewhere in the document.
  const conflictingHistorical =
    "# Fake Feature Specification\n" +
    "\n" +
    `> **${MARKER_HISTORICAL} — retired.** Record kept for history.\n` +
    "\n" +
    "## Body\n" +
    "\n" +
    `Live again: this record is ${MARKER_CURRENT} from now on.\n`;
  assert.deepEqual(
    conflictingStatusMarkers(conflictingHistorical, MARKER_HISTORICAL),
    [MARKER_CURRENT],
    "a HISTORICAL spec that also claims CURRENT status must be rejected"
  );

  // Conflicting status: a SUPERSEDED plan cannot be reactivated as CURRENT.
  const conflictingSuperseded =
    "# Fake Campaign Plan\n" +
    "\n" +
    `> **${MARKER_SUPERSEDED} — historical campaign plan.**\n` +
    "\n" +
    "## Body\n" +
    "\n" +
    `Reactivated: this plan is ${MARKER_CURRENT} again.\n`;
  assert.deepEqual(
    conflictingStatusMarkers(conflictingSuperseded, MARKER_SUPERSEDED),
    [MARKER_CURRENT],
    "a SUPERSEDED plan that also claims CURRENT status must be rejected"
  );

  // Conflicting status: a CURRENT plan cannot claim HISTORICAL status.
  const conflictingCurrent =
    "# Fake Current Plan\n" +
    "\n" +
    `> **${MARKER_CURRENT}.** The current plan.\n` +
    "\n" +
    "## Body\n" +
    "\n" +
    `Superseded by an older record: ${MARKER_HISTORICAL}.\n`;
  assert.deepEqual(
    conflictingStatusMarkers(conflictingCurrent, MARKER_CURRENT),
    [MARKER_HISTORICAL],
    "a CURRENT plan that also claims HISTORICAL status must be rejected"
  );

  // Contradictory current-product framing: the required terms are present,
  // but the self-serve Agent Desk is still presented as reopening/current.
  const contradictoryFraming =
    "The Website Appraisal is the audit product; delivery is human-reviewed.\n" +
    "The self-serve Agent Desk is reopening as the current offer.\n";
  const framingIssues = currentFramingIssues(contradictoryFraming);
  assert.ok(framingIssues.some((issue) => issue.includes("Agent Desk")), `got: ${framingIssues.join("; ")}`);

  // A demotion word must not excuse an active claim: "retired" describes the
  // desk, not the reopening, so the reactivation is still a regression.
  const demotedReopening = "The retired Agent Desk is reopening as the current offer.\n";
  const demotedIssues = currentFramingIssues(demotedReopening);
  assert.ok(
    demotedIssues.some((issue) => issue.includes("must not present the retired Agent Desk")),
    `a demotion word must not excuse an active Agent Desk claim, got: ${demotedIssues.join("; ")}`
  );

  // Positive guarantee/promise wording: the Boundaries section promises an
  // outcome without an explicit negation.
  const positiveGuarantee =
    "# Implementation Plan: Fake\n" +
    "\n" +
    "## Boundaries\n" +
    "\n" +
    "- We guarantee the report within 90 days or a full refund.\n" +
    "- Pricing is set on /pricing.\n";
  assert.ok(boundaryGuaranteeIssues(positiveGuarantee).length > 0, "a positive guarantee must be rejected");

  // Mixed guarantee wording: a safely negated guarantee/promise line does not
  // excuse a separate positive guarantee/promise line in the same Boundaries
  // section; the section must be rejected even though a negation exists.
  const mixedGuarantee =
    "# Implementation Plan: Fake\n" +
    "\n" +
    "## Boundaries\n" +
    "\n" +
    "- No invented outcomes or guarantees: no revenue or ranking promises.\n" +
    "- We guarantee the report within 90 days or a full refund.\n";
  const mixedIssues = boundaryGuaranteeIssues(mixedGuarantee);
  assert.ok(
    mixedIssues.some((issue) => issue.includes("guarantee the report within 90 days")),
    `the unnegated guarantee line must be reported even with a safe negated line, got: ${mixedIssues.join("; ")}`
  );

  // Clause-scoped guarantee check: a negation in one clause ("No refunds")
  // must not excuse a positive guarantee claim after a contrast boundary.
  const clauseGuarantee =
    "# Implementation Plan: Fake\n" +
    "\n" +
    "## Boundaries\n" +
    "\n" +
    "- No refunds are available, but we guarantee a report within 90 days.\n";
  const clauseIssues = boundaryGuaranteeIssues(clauseGuarantee);
  assert.ok(
    clauseIssues.some((issue) => issue.includes("guarantee a report within 90 days")),
    `a negation outside the guarantee clause must not excuse it, got: ${clauseIssues.join("; ")}`
  );
});
