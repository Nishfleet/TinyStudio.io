import assert from "node:assert/strict";
import test from "node:test";
import worker from "../src/worker.js";

const METRIC_MARKER = "WEEKLY_SECRET_METRIC_7000";

const VALID_AGENT_OUTPUT = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- Recommended India-first path uses WhatsApp or lead forms before landing-page work.

# Implementation Checklist

- Set up the offer guardrails.
- Build WhatsApp or lead form validation before landing-page work.
- Keep all spend and publishing approval-gated.

# Weekly Fix Report

- Spend: WEEKLY_SECRET_METRIC_7000.
- Diagnose the current bottleneck from supplied weekly metrics.
- Fix booking friction before changing spend.`;

const TRACKER_AGENT_OUTPUT = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- Recommended first validation path.

# Implementation Checklist

- Set up the offer, funnel, creative, follow-up, CRM, and tracking work.
- Keep all spend and publishing approval-gated.

# Weekly Fix Report

- Metric tracker template: spend, raw leads, qualified leads, booked calls, showed calls, closed deals, and cash collected.
- Review the tracker weekly before changing campaign structure.`;

class FakeStatement {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
    this.values = [];
  }

  bind(...values) {
    this.values = values;
    return this;
  }

  async first() {
    this.db.calls.push({ method: "first", sql: this.sql, values: this.values });
    return { count: 1 };
  }

  async run() {
    this.db.calls.push({ method: "run", sql: this.sql, values: this.values });
    return { success: true };
  }

  async all() {
    this.db.calls.push({ method: "all", sql: this.sql, values: this.values });
    return { results: [] };
  }
}

class FakeDB {
  constructor() {
    this.calls = [];
  }

  prepare(sql) {
    return new FakeStatement(this, sql);
  }

  joinedBinds() {
    return JSON.stringify(this.calls.map((call) => call.values));
  }
}

class FakeAI {
  constructor(response) {
    this.response = response;
    this.calls = [];
  }

  async run(model, options) {
    this.calls.push({ model, options });
    const response = Array.isArray(this.response)
      ? this.response[Math.min(this.calls.length - 1, this.response.length - 1)]
      : this.response;
    return { response };
  }

  userPrompt() {
    return this.calls[0]?.options?.messages?.find((message) => message.role === "user")?.content || "";
  }
}

function agentRequest(body, headers = {}, url = "https://tinystudio.io/api/agent-audit") {
  return new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Origin": "https://tinystudio.io",
      "CF-Connecting-IP": "203.0.113.10",
      "User-Agent": "tinystudio-worker-test",
      ...headers
    },
    body: JSON.stringify(body)
  });
}

function validBody(overrides = {}) {
  return {
    email: "nish+worker-test@tinystudio.io",
    business: "India-based B2B growth consultant for service agencies.",
    offer: "INR 65000 guided setup sprint.",
    audience: "Agency founders in Tier 1 Indian cities.",
    proof: "Approved founder video and conservative screenshots.",
    market: "India-first validation",
    funnel: "WhatsApp or DMs",
    followup: "Spreadsheet and manual WhatsApp follow-up.",
    constraints: "No unapproved claims or ad account access.",
    ...overrides
  };
}

function minimalBody(overrides = {}) {
  return {
    email: "nish+minimal-test@tinystudio.io",
    business: "Solo founder sells a high-ticket offer to Indian agency owners through Instagram and WhatsApp.",
    ...overrides
  };
}

async function runAgent(response, body = validBody(), headers = {}, url) {
  const db = new FakeDB();
  const ai = new FakeAI(response);
  const res = await worker.fetch(agentRequest(body, headers, url), { DB: db, AI: ai });
  const json = await res.json();
  return { res, json, db, ai };
}

test("agent audit accepts minimal business snapshot and asks the model to infer missing context", async () => {
  const { json, ai } = await runAgent(VALID_AGENT_OUTPUT, minimalBody());

  assert.equal(json.ok, true);
  assert.match(ai.userPrompt(), /Offer: Not provided; infer from business snapshot/);
  assert.match(ai.userPrompt(), /Target buyer: Not provided; infer from business snapshot/);
  assert.match(ai.userPrompt(), /Only include blocker questions/);
  assert.match(ai.calls[0].options.messages[0].content, /Do not invent exact prices/);
  assert.match(ai.userPrompt(), /Keep assumptions directional/);
});

test("agent audit uses current metrics supplied inside the required business snapshot", async () => {
  const metricAwareOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- Use WhatsApp or lead forms before landing-page work.

# Implementation Checklist

- Build the first validation loop from the supplied current numbers.
- Keep all spend and publishing approval-gated.

# Weekly Fix Report

- Raw leads: 42 and booked calls: 8 points to a qualification or confirmation leak.
- Fix booking friction before changing spend.`;
  const { json, ai } = await runAgent(metricAwareOutput, minimalBody({
    business: "India-based consultant. Last week spent INR 7,000, got 42 leads, and booked 8 calls from WhatsApp follow-up."
  }));

  assert.equal(json.ok, true);
  assert.match(ai.userPrompt(), /Weekly metrics mode: metrics provided/);
  assert.match(ai.userPrompt(), /Spend: INR 7,000/);
  assert.match(ai.userPrompt(), /Raw leads: 42/);
  assert.match(ai.userPrompt(), /Booked calls: 8/);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.match(json.sections.weeklyFixReport, /\*\*Booked calls\*\*: 8/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
});

test("agent audit accepts loopback preview origins on alternate local ports", async () => {
  const { json } = await runAgent(VALID_AGENT_OUTPUT, minimalBody(), {
    Origin: "http://127.0.0.1:8789"
  }, "http://127.0.0.1:8789/api/agent-audit");

  assert.equal(json.ok, true);
});

test("agent audit accepts loopback preview origins when remote dev preserves loopback host", async () => {
  const { json } = await runAgent(VALID_AGENT_OUTPUT, minimalBody(), {
    Origin: "http://127.0.0.1:8789",
    Host: "127.0.0.1:8789"
  }, "https://tinystudio-preview.example.workers.dev/api/agent-audit");

  assert.equal(json.ok, true);
});

test("agent audit rejects loopback origins against production hosts", async () => {
  const { res, json } = await runAgent(VALID_AGENT_OUTPUT, minimalBody(), {
    Origin: "http://127.0.0.1:8789"
  });

  assert.equal(res.status, 403);
  assert.equal(json.ok, false);
  assert.equal(json.error, "cross_site_blocked");
});

test("agent audit rejects missing business snapshot", async () => {
  const { res, json } = await runAgent(VALID_AGENT_OUTPUT, minimalBody({ business: "" }));

  assert.equal(res.status, 400);
  assert.equal(json.ok, false);
  assert.equal(json.error, "invalid_input");
  assert.equal(json.message, "Add a business snapshot first.");
});

test("agent audit scrubs exact prices and age ranges the model invents from minimal input", async () => {
  const inventedPrecisionOutput = `# Pipeline Brief

- Offer: A guided high-ticket setup sprint for agency founders, priced at USD 5,000-$7,000.
- Offer price is INR 75,000.
- Agency can charge $5k for this package.
- INR 75,000 sprint for agency founders.
- Validate the offer with INR 500-INR 1,000/day for 7 days.
- Target Buyer: Agency founders aged 25-45 looking to scale.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
  const { json } = await runAgent(inventedPrecisionOutput, minimalBody());

  assert.equal(json.ok, true);
  assert.match(json.sections.pipelineBrief, /agency founders/);
  assert.doesNotMatch(json.sections.pipelineBrief, /foundeactual/);
  assert.match(json.sections.pipelineBrief, /price not supplied; use the actual offer price/);
  assert.match(json.sections.pipelineBrief, /age range not supplied/);
  assert.doesNotMatch(json.sections.pipelineBrief, /USD 5,000/);
  assert.doesNotMatch(json.sections.pipelineBrief, /\$7,000/);
  assert.doesNotMatch(json.sections.pipelineBrief, /INR 75,000/);
  assert.doesNotMatch(json.sections.pipelineBrief, /\$5k/);
  assert.match(json.sections.pipelineBrief, /INR 500-INR 1,000\/day/);
  assert.doesNotMatch(json.sections.pipelineBrief, /aged 25-45/);
});

test("agent audit preserves exact prices and age ranges when the user supplies them", async () => {
  const suppliedPrecisionOutput = `# Pipeline Brief

- Offer: A guided setup sprint, priced at INR 75,000.
- Target Buyer: Agency founders aged 25-45 looking to scale.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
  const { json } = await runAgent(suppliedPrecisionOutput, validBody({
    offer: "INR 75,000 guided setup sprint.",
    audience: "Agency founders aged 25-45."
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.pipelineBrief, /priced at INR 75,000/);
  assert.match(json.sections.pipelineBrief, /aged 25-45/);
});

test("agent audit returns structured sections and avoids storing weekly metrics or artifacts", async () => {
  const markers = {
    business: "BUSINESS_SECRET_CONTEXT_001",
    offer: "OFFER_SECRET_CONTEXT_001",
    audience: "AUDIENCE_SECRET_CONTEXT_001",
    proof: "PROOF_SECRET_CONTEXT_001",
    followup: "FOLLOWUP_SECRET_CONTEXT_001",
    constraints: "CONSTRAINTS_SECRET_CONTEXT_001",
    metric: METRIC_MARKER,
    bottleneck: "BOTTLENECK_SECRET_CONTEXT_001"
  };
  const artifactMarker = "Readiness diagnosis for the offer";
  const { json, db, ai } = await runAgent(VALID_AGENT_OUTPUT, validBody({
    business: markers.business,
    offer: markers.offer,
    audience: markers.audience,
    proof: markers.proof,
    followup: markers.followup,
    constraints: markers.constraints,
    weeklySpend: markers.metric,
    rawLeads: "36",
    qualifiedLeads: "14",
    bookedCalls: "5",
    showedCalls: "3",
    closedDeals: "0",
    cashCollected: "INR 0",
    bottleneck: markers.bottleneck
  }));

  assert.equal(json.ok, true);
  assert.deepEqual(Object.keys(json.sections).sort(), ["implementationChecklist", "pipelineBrief", "weeklyFixReport"]);
  assert.equal(json.sections.pipelineBrief.startsWith("# Pipeline Brief"), true);
  assert.equal(json.sections.implementationChecklist.startsWith("# Implementation Checklist"), true);
  assert.equal(json.sections.weeklyFixReport.startsWith("# Weekly Fix Report"), true);
  assert.equal(json.safety.storesBusinessBrief, false);
  assert.match(ai.userPrompt(), new RegExp(markers.metric));

  const storedValues = db.joinedBinds();
  for (const marker of Object.values(markers)) {
    assert.doesNotMatch(storedValues, new RegExp(marker));
  }
  assert.doesNotMatch(storedValues, new RegExp(artifactMarker));
});

test("agent audit strips invented current metrics from brief and checklist sections", async () => {
  const crossSectionInventedMetrics = `# Pipeline Brief

- Use the business snapshot to build the first offer route.
- Assumption: 40 raw leads and 6 booked calls per week means follow-up is the bottleneck.
- Keep the first pass focused on WhatsApp or lead forms.

# Implementation Checklist

- Draft the first four creative tests from the business snapshot.
- 88 leads came in, so build the qualification sheet around that volume.
- Keep spend and publishing approval-gated.

# Weekly Fix Report

- For the next 7 days, track raw leads and booked calls before diagnosing the leak.`;
  const { json } = await runAgent(crossSectionInventedMetrics);

  assert.equal(json.ok, true);
  assert.match(json.sections.pipelineBrief, /Use the business snapshot/);
  assert.match(json.sections.implementationChecklist, /Draft the first four creative tests/);
  assert.doesNotMatch(json.brief, /40 raw leads/);
  assert.doesNotMatch(json.brief, /6 booked calls/);
  assert.doesNotMatch(json.brief, /88 leads came in/);
});

test("agent audit preserves contextual no-metrics weekly guidance and appends metrics to collect", async () => {
  const { json, ai } = await runAgent(TRACKER_AGENT_OUTPUT);

  assert.equal(json.ok, true);
  assert.match(ai.userPrompt(), /Spend: Not provided/);
  assert.match(json.sections.weeklyFixReport, /Review the tracker weekly before changing campaign structure/);
  assert.match(json.sections.weeklyFixReport, /Metrics To Collect/);
});

test("agent audit keeps cadence numbers from being treated as invented metrics", async () => {
  const cadenceReport = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- For the next 7 days, track raw leads and booked calls before diagnosing the leak.
- Use a 15-day review only if lead volume is too low.`;
  const { json } = await runAgent(cadenceReport);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /For the next 7 days, track raw leads and booked calls/);
  assert.match(json.sections.weeklyFixReport, /Metrics To Collect/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
});

test("agent audit treats bottleneck-only context as no weekly metrics", async () => {
  const { json, ai } = await runAgent(TRACKER_AGENT_OUTPUT, validBody({
    bottleneck: "Leads reply but do not book."
  }));

  assert.equal(json.ok, true);
  assert.match(ai.userPrompt(), /Weekly metrics mode: no metrics provided/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Current Metric Snapshot/);
  assert.match(json.sections.weeklyFixReport, /Metrics To Collect/);
});

test("agent audit replaces invented no-metrics diagnosis with the tracker fallback", async () => {
  const inventedNoMetricsReport = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend was INR 9,999 and raw leads were 88, so optimize the campaign.`;
  const { json } = await runAgent(inventedNoMetricsReport);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /INR 9,999/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b88\b/);
});

test("agent audit replaces invented no-metrics table values with the tracker fallback", async () => {
  const inventedNoMetricsTable = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

| Metric | Current week |
| --- | --- |
| Spend | INR 9,999 |
| Raw leads | 88 |`;
  const { json } = await runAgent(inventedNoMetricsTable);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /INR 9,999/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b88\b/);
});

test("agent audit replaces invented no-metrics values when values precede metric labels", async () => {
  const inventedNoMetricsBeforeLabel = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- INR 9,999 in spend and 88 raw leads suggests campaign structure is working.`;
  const { json } = await runAgent(inventedNoMetricsBeforeLabel);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /INR 9,999/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b88\b/);
});

test("agent audit replaces invented plain-language no-metrics values", async () => {
  const inventedPlainLanguageMetrics = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- 88 leads came in; fix qualification next.
- 6 calls showed last week, so tighten reminders.`;
  const { json } = await runAgent(inventedPlainLanguageMetrics);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b88\b/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b6\b/);
});

test("agent audit repairs a missing weekly report with the tracker fallback when no metrics are supplied", async () => {
  const missingWeeklyReport = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.`;
  const { json } = await runAgent(missingWeeklyReport);

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Lead-to-Call Metric Tracker Template/);
  assert.match(json.brief, /# Pipeline Brief/);
  assert.match(json.brief, /# Implementation Checklist/);
});

test("agent audit inserts a metric snapshot when the model omits supplied metrics", async () => {
  const outputWithoutMetricEcho = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(outputWithoutMetricEcho, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42",
    bottleneck: "Leads reply but do not book."
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Current Metric Snapshot/);
  assert.match(json.sections.weeklyFixReport, /INR 7,000/);
  assert.match(json.brief, /Leads reply but do not book\./);
});

test("agent audit strips exact values for weekly metrics the user did not supply", async () => {
  const outputWithInventedOmittedMetrics = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 7,000.
- Raw leads: 42.
- Closed deals: 2.
- Cash collected: USD 5,000.
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(outputWithInventedOmittedMetrics, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Closed deals: 2/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Cash collected: USD 5,000/);
});

test("agent audit keeps cadence guidance when weekly metrics are partially supplied", async () => {
  const cadenceWithMetrics = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 7,000.
- For the next 7 days, track raw leads and booked calls before diagnosing the leak.`;
  const { json } = await runAgent(cadenceWithMetrics, validBody({
    weeklySpend: "INR 7,000"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /For the next 7 days, track raw leads and booked calls/);
});

test("agent audit strips plain-language values for weekly metrics the user did not supply", async () => {
  const outputWithPlainLanguageOmittedMetrics = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 7,000.
- 88 leads came in; fix qualification next.
- 6 calls showed last week, so tighten reminders.`;
  const { json } = await runAgent(outputWithPlainLanguageOmittedMetrics, validBody({
    weeklySpend: "INR 7,000"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b88 leads\b/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /\b6 calls\b/);
});

test("agent audit strips conflicting model values for weekly metrics the user supplied", async () => {
  const outputWithConflictingMetricValues = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 70,000.
- Raw leads: 99.
- Booked calls: 80.
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(outputWithConflictingMetricValues, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42",
    bookedCalls: "8"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Spend: INR 70,000/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Raw leads: 99/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /Booked calls: 80/);
});

test("agent audit preserves metric diagnosis that matches supplied weekly values", async () => {
  const outputWithMatchingMetricDiagnosis = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Booked calls: 8 out of 18 qualified leads points to a booking or confirmation leak.
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(outputWithMatchingMetricDiagnosis, validBody({
    qualifiedLeads: "18",
    bookedCalls: "8"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Booked calls: 8 out of 18 qualified leads/);
  assert.match(json.sections.weeklyFixReport, /\*\*Qualified leads\*\*: 18/);
  assert.match(json.sections.weeklyFixReport, /\*\*Booked calls\*\*: 8/);
});

test("agent audit preserves partial metric diagnosis that names missing metrics without values", async () => {
  const partialMetricDiagnosis = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 7,000; raw leads not provided, so collect them before changing spend.`;
  const { json } = await runAgent(partialMetricDiagnosis, validBody({
    weeklySpend: "INR 7,000"
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /raw leads not provided/);
  assert.match(json.sections.weeklyFixReport, /\*\*Spend\*\*: INR 7,000/);
});

test("agent audit inserts the full metric snapshot when the model echoes only one metric", async () => {
  const partialMetricEcho = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Spend: INR 7,000.
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(partialMetricEcho, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42",
    qualifiedLeads: "21",
    bottleneck: "Leads reply but do not book."
  }));

  assert.equal(json.ok, true);
  assert.match(json.sections.weeklyFixReport, /Current Metric Snapshot/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.match(json.sections.weeklyFixReport, /\*\*Qualified leads\*\*: 21/);
  assert.match(json.sections.weeklyFixReport, /\*\*Current bottleneck\*\*: Leads reply but do not book\./);
});

test("agent audit replaces model-made metric snapshots with the server snapshot", async () => {
  const conflictingSnapshot = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

## Current Metric Snapshot
- Spend: INR 999
- Raw leads: 999

## Bottleneck Diagnosis
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(conflictingSnapshot, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42"
  }));

  const snapshotMatches = json.sections.weeklyFixReport.match(/Current Metric Snapshot/g) || [];
  assert.equal(json.ok, true);
  assert.equal(snapshotMatches.length, 1);
  assert.match(json.sections.weeklyFixReport, /INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /INR 999/);
});

test("agent audit replaces deeply nested model-made metric snapshots with the server snapshot", async () => {
  const conflictingSnapshot = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

### Current Metric Snapshot
- Spend: INR 999
- Raw leads: 999

### Bottleneck Diagnosis
- Diagnose booking friction before changing spend.`;
  const { json } = await runAgent(conflictingSnapshot, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42"
  }));

  const snapshotMatches = json.sections.weeklyFixReport.match(/Current Metric Snapshot/g) || [];
  assert.equal(json.ok, true);
  assert.equal(snapshotMatches.length, 1);
  assert.match(json.sections.weeklyFixReport, /INR 7,000/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 42/);
  assert.doesNotMatch(json.sections.weeklyFixReport, /INR 999/);
});

test("agent audit rejects model output that only contains a metric snapshot for the weekly report", async () => {
  const snapshotOnly = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

## Current Metric Snapshot
- Spend: INR 7,000`;
  const { res, json } = await runAgent(snapshotOnly, validBody({
    weeklySpend: "INR 7,000"
  }));

  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
});

test("agent audit preserves zero-valued weekly metrics from JSON callers", async () => {
  const { json, ai } = await runAgent(VALID_AGENT_OUTPUT, validBody({
    weeklySpend: 0,
    rawLeads: 0,
    qualifiedLeads: 0,
    bookedCalls: 0,
    showedCalls: 0,
    closedDeals: 0,
    cashCollected: 0
  }));

  assert.equal(json.ok, true);
  assert.match(ai.userPrompt(), /Spend: 0/);
  assert.match(json.sections.weeklyFixReport, /\*\*Raw leads\*\*: 0/);
  assert.match(json.sections.weeklyFixReport, /\*\*Closed deals\*\*: 0/);
  assert.match(json.sections.weeklyFixReport, /\*\*Cash collected\*\*: 0/);
});

test("agent audit does not let the metric snapshot hide an empty weekly report", async () => {
  const emptyWeeklyReport = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report`;
  const { res, json } = await runAgent(emptyWeeklyReport, validBody({
    weeklySpend: "INR 7,000",
    rawLeads: "42"
  }));

  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
});

test("agent audit rejects ROI and ROAS calculations", async () => {
  const roiOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- ROAS would be 8.6x and ROI of 760%.`;
  const { res, json } = await runAgent(roiOutput, validBody({
    weeklySpend: "INR 7,000",
    cashCollected: "INR 60,000"
  }));

  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
});

test("agent audit rejects unsafe generated claims before returning sections", async () => {
  const unsafeOutput = `# Pipeline Brief

- This plan has guaranteed revenue.

# Implementation Checklist

- Publish campaigns.

# Weekly Fix Report

- Guaranteed booked calls.`;
  const { res, json } = await runAgent(unsafeOutput);

  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
});

for (const [name, unsafeLine] of [
  ["specific lead promise", "This cannot guarantee calls, but it will generate 20 leads next week."],
  ["unqualified campaign publishing", "Publish campaigns."],
  ["unapproved publishing", "Publish ads without approval."],
  ["approval-first unapproved publishing", "Without approval, publish campaigns."],
  ["approval not needed publishing", "No approval needed to publish campaigns."],
  ["approval not needed account connection", "Approval is not needed to connect your Meta ad account."],
  ["unapproved spend change", "Change ad spend without approval."],
  ["autonomous ad buying", "This is fully autonomous ad buying."],
  ["ad account connection", "Connect your Meta ad account before reviewing the plan."],
  ["generic ad account connection", "Connect the ad account before reviewing the plan."],
  ["crm outcome sync", "Sync CRM outcomes back to Meta."]
]) {
  test(`agent audit rejects unsafe generated output: ${name}`, async () => {
    const unsafeOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- ${unsafeLine}

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
    const { res, json } = await runAgent(unsafeOutput);

    assert.equal(res.status, 502);
    assert.equal(json.ok, false);
    assert.equal(json.error, "empty_agent_output");
  });
}

test("agent audit allows explicit approval-gated negatives", async () => {
  const approvalGatedOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- Do not publish ads without approval.

# Implementation Checklist

- Do not change ad spend without approval.
- After approval, publish campaigns.
- Publish campaigns only after approval.
- After human approval, connect your Meta ad account.
- Keep platform connection work approval-gated.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
  const { json } = await runAgent(approvalGatedOutput);

  assert.equal(json.ok, true);
  assert.match(json.sections.pipelineBrief, /Do not publish ads without approval/);
});

for (const [name, unsafeLine] of [
  ["approval-gated lead promise", "This will generate 20 leads after approval."],
  ["approval-gated revenue guarantee", "This has guaranteed revenue once approved."]
]) {
  test(`agent audit rejects unsafe outcome claims even when approval-gated: ${name}`, async () => {
    const unsafeOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.
- ${unsafeLine}

# Implementation Checklist

- Publish campaigns only after approval.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
    const { res, json } = await runAgent(unsafeOutput);

    assert.equal(res.status, 502);
    assert.equal(json.ok, false);
    assert.equal(json.error, "empty_agent_output");
  });
}

test("agent audit rejects model output that adds a fourth top-level section", async () => {
  const extraSectionOutput = `# Pipeline Brief

- Readiness diagnosis for the offer and funnel.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Fix booking friction before changing spend.

# Acme Coaching Pipeline

- Extra model section that should not be returned.`;
  const warnings = [];
  const originalWarn = console.warn;

  console.warn = (...args) => warnings.push(args.join(" "));
  let result;
  try {
    result = await runAgent(extraSectionOutput);
  } finally {
    console.warn = originalWarn;
  }

  const { res, json } = result;
  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
  assert.match(warnings.join("\n"), /unknown top-level headings \(1\)/);
  assert.doesNotMatch(warnings.join("\n"), /Acme Coaching Pipeline/);
});

test("agent audit falls back to the next model after unsafe output", async () => {
  const firstUnsafeOutput = `# Pipeline Brief

- This plan has guaranteed revenue.

# Implementation Checklist

- Set up the offer and approval gates.

# Weekly Fix Report

- Fix booking friction before changing spend.`;
  const { json, ai } = await runAgent([firstUnsafeOutput, VALID_AGENT_OUTPUT]);

  assert.equal(json.ok, true);
  assert.equal(json.model, "@cf/qwen/qwen3-30b-a3b-fp8");
  assert.equal(ai.calls.length, 2);
  assert.doesNotMatch(json.brief, /guaranteed revenue/i);
});

test("agent audit rejects model output that misses required sections", async () => {
  const incompleteOutput = `# Pipeline Brief

- Brief only.`;
  const { res, json } = await runAgent(incompleteOutput);

  assert.equal(res.status, 502);
  assert.equal(json.ok, false);
  assert.equal(json.error, "empty_agent_output");
});

test("signup handler accepts a bare-domain website with a test email and stores the normalized URL", async () => {
  const db = new FakeDB();
  const env = { DB: db, AI: new FakeAI("") };
  const res = await worker.fetch(
    new Request("https://tinystudio.io/api/signups", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://tinystudio.io",
        "Accept": "text/html",
        "User-Agent": "tinystudio-worker-test"
      },
      body: new URLSearchParams({ website: "example.com", email: "audit-check+test@example.com" }).toString()
    }),
    env
  );

  assert.equal(res.status, 303);
  assert.equal(new URL(res.headers.get("Location")).pathname, "/brief-requested");
  const insert = db.calls.find((call) => call.sql.includes("INSERT INTO email_signups"));
  assert.ok(insert, "signup handler must persist through the existing email_signups path");
  assert.equal(insert.values[0], "audit-check+test@example.com");
  assert.equal(insert.values[7], "https://example.com");
  // The current appraisal intake must label its rows with the current offer,
  // never the retired self-serve Agent Desk surface name.
  assert.equal(insert.values[1], "website-appraisal", "current intake signups must carry the current-offer source label");
  assert.notEqual(insert.values[1], "agent-self-serve", "current intake signups must not carry the retired Agent Desk source label");
});

test("worker /health names the current Website Appraisal surface, not the retired Agent Desk", async () => {
  class HealthStatement extends FakeStatement {
    async all() {
      this.db.calls.push({ method: "all", sql: this.sql, values: this.values });
      return { results: [{ name: "email_signups" }, { name: "agent_runs" }, { name: "agent_usage_limits" }] };
    }
  }

  class HealthDB extends FakeDB {
    prepare(sql) {
      return new HealthStatement(this, sql);
    }
  }

  const res = await worker.fetch(new Request("https://tinystudio.io/health"), { DB: new HealthDB(), AI: {} });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.service, "tinystudio-io-public");
  assert.equal(body.surface, "website-appraisal", "health surface must name the current offer");
  assert.notEqual(body.surface, "agent-desk", "health surface must not name the retired Agent Desk");
  assert.equal(body.ok, true);
});

test("worker /health verdict keys off the current intake path, not the retired Agent Desk machinery", async () => {
  // The current product depends on the D1 email_signups table behind
  // /api/signups. The retired Agent Desk's AI binding and agent tables must
  // not gate the current product's readiness verdict: a green /health while
  // the signup path is broken would be a false positive, and a red /health
  // when the appraisal intake is healthy would be a false alarm. The env
  // deliberately carries no AI binding — the current product has no model
  // dependency.
  class HealthStatement extends FakeStatement {
    async all() {
      this.db.calls.push({ method: "all", sql: this.sql, values: this.values });
      return { results: [{ name: "email_signups" }] };
    }
  }

  class HealthDB extends FakeDB {
    prepare(sql) {
      return new HealthStatement(this, sql);
    }
  }

  const res = await worker.fetch(new Request("https://tinystudio.io/health"), { DB: new HealthDB() });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true, "the current product is ready even without the retired Agent Desk machinery");
  assert.equal(body.checks.signupsTable, true, "the intake table is present");
  assert.equal(body.checks.ai, false, "the retired AI binding is absent");
  assert.equal(body.checks.agentRunsTable, false, "the retired agent_runs table is absent");
  assert.equal(body.checks.usageLimitsTable, false, "the retired usage-limits table is absent");
});

test("legacy /api/agent-audit still labels its rows with the retired self-serve source", async () => {
  const db = new FakeDB();
  const ai = new FakeAI(VALID_AGENT_OUTPUT);
  const res = await worker.fetch(agentRequest(validBody()), { DB: db, AI: ai });
  assert.equal(res.status, 200);
  const signupInsert = db.calls.find((call) => call.sql.includes("INSERT INTO email_signups"));
  assert.ok(signupInsert, "agent audit must persist through the existing email_signups path");
  assert.equal(signupInsert.values[1], "agent-self-serve", "the legacy surface keeps its own source label");
  const runInsert = db.calls.find((call) => call.sql.includes("INSERT INTO agent_runs"));
  assert.ok(runInsert, "agent audit must record the legacy run");
  assert.equal(runInsert.values[2], "agent-self-serve", "the legacy run keeps its own source label");
});

test("signup handler redirects a rejected email to /?signal=invalid so the homepage can render it", async () => {
  // The browser's type=email accepts "a@b", but the worker's stricter regex
  // requires a dot in the domain. The rejection must 303 back to the homepage
  // with ?signal=invalid (rendered by public/index.js), not fail silently.
  const db = new FakeDB();
  const env = { DB: db, AI: new FakeAI("") };
  const res = await worker.fetch(
    new Request("https://tinystudio.io/api/signups", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Origin": "https://tinystudio.io",
        "Accept": "text/html",
        "User-Agent": "tinystudio-worker-test"
      },
      body: new URLSearchParams({ website: "example.com", email: "a@b" }).toString()
    }),
    env
  );

  assert.equal(res.status, 303);
  const location = new URL(res.headers.get("Location"));
  assert.equal(location.pathname, "/");
  assert.equal(location.searchParams.get("signal"), "invalid");
  const insert = db.calls.find((call) => call.sql.includes("INSERT INTO email_signups"));
  assert.equal(insert, undefined, "rejected signup must not persist a row");
});

test("worker serves the same-origin font promotion script (render-blocking fix b8f6046e942a)", async () => {
  // The production CSP (script-src 'self', no unsafe-inline) blocks inline
  // onload handlers, so the pages promote the preloaded Google Fonts css2
  // stylesheet through public/fonts.js. The worker must serve it (it sits in
  // the PUBLIC_ASSET_PATHS allow-list) or the fonts silently never apply.
  const served = new Map([
    ["/fonts.js", "text/javascript;charset=UTF-8"]
  ]);
  const env = {
    ASSETS: {
      fetch(request) {
        const path = new URL(request.url).pathname;
        if (!served.has(path)) return Promise.resolve(new Response("missing", { status: 404 }));
        return Promise.resolve(new Response("// font promotion", { status: 200, headers: { "Content-Type": served.get(path) } }));
      }
    }
  };
  const res = await worker.fetch(new Request("https://tinystudio.io/fonts.js"), env);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("Content-Type") || "", /javascript/);
});

test("worker does not serve unlisted asset-like paths outside the public allow-list", async () => {
  const env = { ASSETS: { fetch: async () => new Response("should not be reached", { status: 200 }) } };
  const res = await worker.fetch(new Request("https://tinystudio.io/not-listed.js"), env);
  assert.equal(res.status, 404);
});

test("retired app host frames the current offer as The Website Appraisal, not the Agent Desk", async () => {
  const res = await worker.fetch(new Request("https://app.tinystudio.io/"), {});
  assert.equal(res.status, 410);
  const html = await res.text();
  assert.match(html, /The Website Appraisal/, "retired app host must name the current offer");
  assert.match(html, /free leak audit of high-ticket service homepages/, "retired app host must state the current offer truth");
  assert.doesNotMatch(html, /self-serve Agent Desk/, "retired app host must not point at the retired Agent Desk as the current offer");
});

test("retired API host frames the current offer as The Website Appraisal, not the Agent Desk", async () => {
  const res = await worker.fetch(new Request("https://api.tinystudio.io/"), {});
  assert.equal(res.status, 410);
  const body = await res.json();
  assert.equal(body.ok, false);
  assert.equal(body.status, "retired");
  assert.match(body.message, /The Website Appraisal/, "retired API host message must name the current offer");
  assert.match(body.message, /free leak audit of high-ticket service homepages/, "retired API host message must state the current offer truth");
  assert.doesNotMatch(body.message, /self-serve Agent Desk/, "retired API host message must not point at the retired Agent Desk as the current offer");
});

// --- Signup daily rate limits (daily_ip_limit / daily_email_limit) ---
//
// Production enforces two independent daily caps before any agent run:
// MAX_AGENT_RUNS_PER_IP_PER_DAY (20) and SOFT_AGENT_RUNS_PER_EMAIL_PER_DAY
// (5), both keyed by UTC day in agent_usage_limits.bucket_key. The shared
// FakeDB above returns count 1 for every upsert, so neither cap could ever
// trip in the suite; these tests drive real per-bucket counters and assert
// the exact boundary, the two limits' independence, and the day rollover.

class CountingStatement extends FakeStatement {
  async first() {
    this.db.calls.push({ method: "first", sql: this.sql, values: this.values });
    if (this.sql.includes("INSERT INTO agent_usage_limits")) {
      const bucketKey = this.values[0];
      const count = (this.db.counts.get(bucketKey) || 0) + 1;
      this.db.counts.set(bucketKey, count);
      return { count };
    }
    return { count: 1 };
  }
}

class CountingDB extends FakeDB {
  constructor() {
    super();
    this.counts = new Map();
  }

  prepare(sql) {
    return new CountingStatement(this, sql);
  }
}

function runAgentLimit(db, ai, body, headers, env = {}) {
  return worker.fetch(agentRequest(body, headers), { DB: db, AI: ai, ...env });
}

test("per-IP daily signup limit: 20 succeed, the 21st from the same IP returns 429 daily_ip_limit", async () => {
  const db = new CountingDB();
  const ai = new FakeAI(VALID_AGENT_OUTPUT);
  const ip = "203.0.113.77";

  for (let i = 1; i <= 20; i += 1) {
    const res = await runAgentLimit(
      db,
      ai,
      validBody({ email: `ip-burst-${i}@tinystudio.io` }),
      { "CF-Connecting-IP": ip }
    );
    assert.equal(res.status, 200, `request ${i} (the 20th is the exact per-IP boundary) must succeed`);
  }

  // Fresh email, same IP: the IP cap must fire on its own, not be masked by
  // an email cap (each email above is distinct, so email counts never rise).
  const blocked = await runAgentLimit(
    db,
    ai,
    validBody({ email: "ip-burst-21@tinystudio.io" }),
    { "CF-Connecting-IP": ip }
  );
  assert.equal(blocked.status, 429, "the 21st request from the same IP must be refused");
  const body = await blocked.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, "daily_ip_limit");
  assert.match(blocked.headers.get("Content-Type") || "", /application\/json/);
});

test("per-email daily signup limit: 5 succeed, the 6th for the same email returns 429 daily_email_limit", async () => {
  const db = new CountingDB();
  const ai = new FakeAI(VALID_AGENT_OUTPUT);
  const email = "email-burst@tinystudio.io";

  for (let i = 1; i <= 5; i += 1) {
    const res = await runAgentLimit(
      db,
      ai,
      validBody({ email }),
      { "CF-Connecting-IP": `203.0.113.1${i}` }
    );
    assert.equal(res.status, 200, `request ${i} (the 5th is the exact per-email boundary) must succeed`);
  }

  // Fresh IP, same email: the email cap must fire on its own, not be masked
  // by an IP cap (each IP above is distinct, so IP counts never rise).
  const blocked = await runAgentLimit(
    db,
    ai,
    validBody({ email }),
    { "CF-Connecting-IP": "203.0.113.99" }
  );
  assert.equal(blocked.status, 429, "the 6th request for the same email must be refused");
  const body = await blocked.json();
  assert.equal(body.ok, false);
  assert.equal(body.error, "daily_email_limit");
  assert.match(blocked.headers.get("Content-Type") || "", /application\/json/);
});

test("daily email limit resets after the day rolls over (controlled clock, no sleeping)", async () => {
  const db = new CountingDB();
  const ai = new FakeAI(VALID_AGENT_OUTPUT);
  const email = "rollover-email@tinystudio.io";
  const dayOne = "2026-08-12T10:00:00.000Z";
  const dayTwo = "2026-08-13T02:00:00.000Z";

  for (let i = 1; i <= 5; i += 1) {
    const res = await runAgentLimit(db, ai, validBody({ email }), {}, { AGENT_LIMITS_NOW: dayOne });
    assert.equal(res.status, 200, `request ${i} on day one must succeed`);
  }

  const blocked = await runAgentLimit(db, ai, validBody({ email }), {}, { AGENT_LIMITS_NOW: dayOne });
  assert.equal(blocked.status, 429, "the 6th request on day one must be refused");
  assert.equal((await blocked.json()).error, "daily_email_limit");

  const allowed = await runAgentLimit(db, ai, validBody({ email }), {}, { AGENT_LIMITS_NOW: dayTwo });
  assert.equal(allowed.status, 200, "the same email must be allowed again once the day rolls over");
});

test("daily IP limit resets after the day rolls over (controlled clock, no sleeping)", async () => {
  const db = new CountingDB();
  const ai = new FakeAI(VALID_AGENT_OUTPUT);
  const ip = "203.0.113.55";
  const dayOne = "2026-08-12T10:00:00.000Z";
  const dayTwo = "2026-08-13T02:00:00.000Z";

  for (let i = 1; i <= 20; i += 1) {
    const res = await runAgentLimit(
      db,
      ai,
      validBody({ email: `ip-rollover-${i}@tinystudio.io` }),
      { "CF-Connecting-IP": ip },
      { AGENT_LIMITS_NOW: dayOne }
    );
    assert.equal(res.status, 200, `request ${i} on day one must succeed`);
  }

  const blocked = await runAgentLimit(
    db,
    ai,
    validBody({ email: "ip-rollover-blocked@tinystudio.io" }),
    { "CF-Connecting-IP": ip },
    { AGENT_LIMITS_NOW: dayOne }
  );
  assert.equal(blocked.status, 429, "the 21st request on day one must be refused");
  assert.equal((await blocked.json()).error, "daily_ip_limit");

  const allowed = await runAgentLimit(
    db,
    ai,
    validBody({ email: "ip-rollover-blocked@tinystudio.io" }),
    { "CF-Connecting-IP": ip },
    { AGENT_LIMITS_NOW: dayTwo }
  );
  assert.equal(allowed.status, 200, "the same IP must be allowed again once the day rolls over");
});
