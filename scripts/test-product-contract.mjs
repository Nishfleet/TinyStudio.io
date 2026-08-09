// Product-contract regression test: the repository contract must describe
// TinyStudio's current offer truthfully and never re-present the retired
// Agent Desk as current.
//
// The live site (public/offer.md, public/llms.txt, the public pages) calls
// The Website Appraisal — the free leak audit of high-ticket service
// homepages and the human-reviewed desk that closes what the audit finds —
// the current product. The self-serve Agent Desk is retired, but its API
// mechanics (`/api/agent-audit`, `/api/signups`, D1 usage metadata) remain
// live and must stay documented as legacy. The historical specs (001, 002,
// and the 003 campaign plan) are records, not current instructions.
//
// The contract enforced here is semantic, not a prose snapshot:
//
//   1. Every active contract file (README.md, MEMORY.md, package.json, and
//      the current plan specs/004-website-appraisal/plan.md) must name the
//      current product and never present the retired Agent Desk as current.
//   2. Every mention of the Agent Desk in an active file must carry a
//      legacy/retired marker in the same unit (paragraph or bullet), so the
//      retired product can only appear labeled as retired.
//   3. Exact phrases that only ever claimed the Agent Desk was the current
//      self-serve product are banned outright, so reactivation cannot hide
//      inside an otherwise legacy-labeled paragraph.
//   4. The legacy Agent Desk/API mechanics stay documented in the active
//      files (`/api/agent-audit`, the app.tinystudio.io retirement notices).
//   5. Every historical spec (001, 002, 003) carries a "Status: historical"
//      header so it cannot be mistaken for current instructions.
//   6. The current Website Appraisal plan exists, is marked current, and
//      follows the same active-file rules.
//
// The same checker runs against embedded "known bad shape" fixtures (the
// pre-fix claims on origin/main and plausible reactivations) so the test
// proves it rejects every regression it guards, not just the current files.

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const ROOT = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, ROOT), "utf8");

// Files that speak for the current product. They must name the current
// product and may mention the Agent Desk only when labeled as legacy.
const ACTIVE_FILES = ["README.md", "MEMORY.md", "package.json"];

// The current plan is an active contract document too.
const CURRENT_PLAN = "specs/004-website-appraisal/plan.md";

// Historical records: specs that built the retired Agent Desk and the
// earlier campaign plan. They are not current instructions.
const HISTORICAL_SPECS = [
  "specs/001-public-buyer-page/plan.md",
  "specs/001-public-buyer-page/spec.md",
  "specs/001-public-buyer-page/tasks.md",
  "specs/002-minimal-input-agent-desk/plan.md",
  "specs/002-minimal-input-agent-desk/spec.md",
  "specs/002-minimal-input-agent-desk/tasks.md",
  "specs/003-wellness-clinic-launch/plan.md"
];

const CURRENT_PRODUCT = "Website Appraisal";
const HUMAN_REVIEWED = "human-reviewed";

// A mention of the retired product is only truthful when the same unit
// (paragraph or bullet) also carries one of these markers, in any case.
const LEGACY_MARKERS = ["legacy", "retired", "demoted", "retirement"];

// Exact phrases that only ever claimed the Agent Desk was the current
// self-serve product. Their presence means the retired product is being
// presented as current again, even inside a marker-carrying paragraph.
const REACTIVATION_PHRASES = [
  "Self-serve TinyStudio Agent Desk",
  "Agent Desk on Cloudflare Workers",
  "self-serve AI workspace",
  "reopening as a self-serve"
];

// Split markdown into mention units: blank-line-separated blocks, with each
// bullet (and its wrapped continuation lines) as its own unit. A unit is the
// smallest place where a legacy marker can truthfully qualify an Agent Desk
// mention, so a reactivated bullet cannot hide inside a mixed list.
export function mentionUnits(text) {
  const units = [];
  let current = null;
  const flush = () => {
    if (current !== null) {
      units.push(current.replace(/\s+/g, " ").trim());
      current = null;
    }
  };
  for (const block of text.split(/\n\s*\n/)) {
    for (const line of block.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const isBullet = /^[-*]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed);
      if (isBullet) {
        flush();
        current = trimmed;
      } else if (current === null) {
        current = trimmed;
      } else {
        current += " " + trimmed;
      }
    }
    flush();
  }
  return units;
}

// The first "Status:" line, if any. Historical specs must carry one; the
// current plan must carry one that does not mark it historical.
export function statusLine(text) {
  const match = text.match(/^\s*Status:[^\n]*/m);
  return match ? match[0].trim() : null;
}

// Active-contract checks. `active` maps file path -> file text. Returns a
// list of human-readable violations; an empty list means the contract holds.
export function contractIssues(active) {
  const issues = [];
  for (const [path, text] of Object.entries(active)) {
    if (!text.includes(CURRENT_PRODUCT)) {
      issues.push(`${path} must name the current product: "${CURRENT_PRODUCT}"`);
    }
    if (path !== "package.json" && !text.includes(HUMAN_REVIEWED)) {
      issues.push(`${path} must describe the delivery as "${HUMAN_REVIEWED}"`);
    }
    for (const phrase of REACTIVATION_PHRASES) {
      if (text.includes(phrase)) {
        issues.push(
          `${path} must not claim the retired Agent Desk is current (found ${JSON.stringify(phrase)})`
        );
      }
    }
    for (const unit of mentionUnits(text)) {
      if (!unit.includes("Agent Desk")) continue;
      const lower = unit.toLowerCase();
      if (!LEGACY_MARKERS.some((marker) => lower.includes(marker))) {
        issues.push(
          `${path} mentions the Agent Desk without a legacy/retired marker: ${JSON.stringify(unit.slice(0, 140))}`
        );
      }
    }
  }
  return issues;
}

// Historical specs must be unmistakably not-current instructions.
export function specStatusIssues(paths) {
  const issues = [];
  for (const path of paths) {
    const status = statusLine(read(path));
    if (!status) {
      issues.push(
        `${path} must carry a "Status:" line so it cannot be mistaken for current instructions`
      );
      continue;
    }
    if (!/\bhistorical\b/i.test(status)) {
      issues.push(`${path} status must mark the spec as historical: ${JSON.stringify(status)}`);
    }
  }
  return issues;
}

// The current plan must exist, be marked current (not historical), and name
// the current product.
export function currentPlanIssues(path) {
  const issues = [];
  if (!existsSync(new URL(path, ROOT))) {
    issues.push(`${path} must exist: the current Website Appraisal plan`);
    return issues;
  }
  const text = read(path);
  const status = statusLine(text);
  if (!status) {
    issues.push(`${path} must carry a "Status:" line`);
  } else if (/\bhistorical\b/i.test(status)) {
    issues.push(`${path} is the current plan and must not be marked historical: ${JSON.stringify(status)}`);
  }
  if (!text.includes(CURRENT_PRODUCT)) {
    issues.push(`${path} must name the current product: "${CURRENT_PRODUCT}"`);
  }
  return issues;
}

test("active contract files name The Website Appraisal as the current product", () => {
  const active = Object.fromEntries(ACTIVE_FILES.map((path) => [path, read(path)]));
  const issues = contractIssues(active);
  assert.deepEqual(issues, [], issues.join("; "));
});

test("legacy Agent Desk/API mechanics stay documented in the active contract", () => {
  const readme = read("README.md");
  const memory = read("MEMORY.md");
  assert.ok(readme.includes("/api/agent-audit"), "README must document the legacy /api/agent-audit mechanics");
  assert.ok(memory.includes("/api/agent-audit"), "MEMORY must document the legacy /api/agent-audit mechanics");
  assert.ok(memory.includes("app.tinystudio.io"), "MEMORY must document the app.tinystudio.io retirement notice");
});

test("every historical spec and campaign plan carries a Status: historical header", () => {
  const issues = specStatusIssues(HISTORICAL_SPECS);
  assert.deepEqual(issues, [], issues.join("; "));
});

test("the current Website Appraisal plan exists, is current, and follows the active contract", () => {
  const issues = currentPlanIssues(CURRENT_PLAN);
  assert.deepEqual(issues, [], issues.join("; "));
  const planIssues = contractIssues({ [CURRENT_PLAN]: read(CURRENT_PLAN) });
  assert.deepEqual(planIssues, [], planIssues.join("; "));
});

// ---- Known bad shapes: every regression this test guards, rejected ----

test("checker rejects the pre-fix README tagline (Agent Desk as current offer)", () => {
  const preFix = "# TinyStudio.io\n\nSelf-serve TinyStudio Agent Desk for high-ticket pipeline setup.";
  const issues = contractIssues({ "README.md": preFix });
  assert.ok(issues.some((issue) => issue.includes('must name the current product: "Website Appraisal"')), `got: ${issues.join("; ")}`);
  assert.ok(issues.some((issue) => issue.includes("Self-serve TinyStudio Agent Desk")), `got: ${issues.join("; ")}`);
  assert.ok(issues.some((issue) => issue.includes("without a legacy/retired marker")), `got: ${issues.join("; ")}`);
});

test("checker rejects the pre-fix package.json description", () => {
  const preFix = '{\n  "name": "tinystudio-io",\n  "description": "Self-serve TinyStudio Agent Desk on Cloudflare Workers."\n}';
  const issues = contractIssues({ "package.json": preFix });
  assert.ok(issues.some((issue) => issue.includes("Agent Desk on Cloudflare Workers")), `got: ${issues.join("; ")}`);
  assert.ok(issues.some((issue) => issue.includes("without a legacy/retired marker")), `got: ${issues.join("; ")}`);
});

test("checker rejects an unlabeled Agent Desk bullet inside a mixed list", () => {
  const mixed = [
    "- The Website Appraisal site.",
    "- The retired Agent Desk surface stays served.",
    "- The public tinystudio.io Agent Desk."
  ].join("\n");
  const issues = contractIssues({ "README.md": mixed });
  assert.ok(
    issues.some((issue) => issue.includes("public tinystudio.io Agent Desk") && issue.includes("without a legacy/retired marker")),
    `got: ${issues.join("; ")}`
  );
});

test("checker rejects reactivation hidden inside a marker-carrying paragraph", () => {
  const sneaky = "The retired Agent Desk's mechanics remain, and the site is reopening as a self-serve AI workspace for high-ticket pipeline setup.";
  const issues = contractIssues({ "MEMORY.md": `The Website Appraisal is current and ${HUMAN_REVIEWED}.\n\n${sneaky}` });
  assert.ok(issues.some((issue) => issue.includes("reopening as a self-serve")), `got: ${issues.join("; ")}`);
});

test("checker accepts truthful legacy-labeled Agent Desk documentation", () => {
  const truthful = [
    "The Website Appraisal is the current product, delivered by the human-reviewed desk.",
    "",
    "The retired Agent Desk's legacy API mechanics remain live: /api/agent-audit."
  ].join("\n");
  assert.deepEqual(contractIssues({ "README.md": truthful }), []);
});

test("checker rejects a historical spec without a Status line", () => {
  const noStatus = "# Feature Specification: Self-Serve Agent Desk\n\n## User Outcome\n\nVisitors can submit pipeline context.";
  assert.ok(
    specStatusIssuesForText(noStatus).some((issue) => issue.includes('must carry a "Status:" line')),
    "expected a missing-status violation"
  );
});

test("checker rejects a historical spec whose Status line lacks the historical marker", () => {
  const statusLine_ = "Status: approved by Nish 2026-08-05.";
  assert.ok(
    specStatusIssuesForText(`# 003 - Premium Wellness Clinic Launch\n\n${statusLine_}\n`).some((issue) => issue.includes("must mark the spec as historical")),
    "expected an unmarked-status violation"
  );
});

test("checker rejects a current plan marked historical", () => {
  const plan = "# 004 - The Website Appraisal\n\nStatus: historical — this plan described the retired Agent Desk.\n\nThe Website Appraisal is current.";
  const issues = currentPlanIssuesForText(plan);
  assert.ok(issues.some((issue) => issue.includes("must not be marked historical")), `got: ${issues.join("; ")}`);
});

// Helpers so the fixture tests can run the checkers against strings.
function specStatusIssuesForText(text, path = "fixture.md") {
  const issues = [];
  const status = statusLine(text);
  if (!status) {
    issues.push(`${path} must carry a "Status:" line so it cannot be mistaken for current instructions`);
  } else if (!/\bhistorical\b/i.test(status)) {
    issues.push(`${path} status must mark the spec as historical: ${JSON.stringify(status)}`);
  }
  return issues;
}

function currentPlanIssuesForText(text, path = CURRENT_PLAN) {
  const issues = [];
  const status = statusLine(text);
  if (!status) {
    issues.push(`${path} must carry a "Status:" line`);
  } else if (/\bhistorical\b/i.test(status)) {
    issues.push(`${path} is the current plan and must not be marked historical: ${JSON.stringify(status)}`);
  }
  if (!text.includes(CURRENT_PRODUCT)) {
    issues.push(`${path} must name the current product: "${CURRENT_PRODUCT}"`);
  }
  return issues;
}
