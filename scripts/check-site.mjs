import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

// The Agent Desk moved to /agent-desk when the leak-audit site took the root.
// These checks are about the Desk's markup, so they follow it.
const index = read("public/agent-desk.html");
const styles = read("public/styles.css");
const script = read("public/script.js");
const llms = read("public/llms.txt");
const offer = read("public/offer.md");
const robots = read("public/robots.txt");
const sitemap = read("public/sitemap.xml");
const worker = read("src/worker.js");
const wrangler = read("wrangler.jsonc");
const packageJson = read("package.json");
const wranglerConfig = JSON.parse(wrangler);

const failures = [];

const requiredIndexCopy = [
  "TinyStudio Agent Desk",
  "Build the pipeline system before you buy more ads.",
  "Cloudflare AI",
  "Self-serve",
  "Approval-gated",
  "data-agent-form",
  "Generate Pipeline Loop",
  "Business snapshot",
  "Give the agent raw context",
  "Optional detail pack",
  "Pipeline Brief, Implementation Checklist, and Weekly Fix Report",
  "Current weekly numbers",
  "data-output-tab",
  "No ad account access. No spend changes.",
  "The business snapshot, optional details, weekly metrics, and generated artifacts are processed for the output and are not saved by this app.",
  "hello@tinystudio.io"
];

const requiredAgentStack = [
  "Offer Agent",
  "Funnel Agent",
  "Creative Agent",
  "Qualification Agent",
  "Follow-Up Agent",
  "CRM Agent",
  "Tracking Agent",
  "Decision Agent"
];

const requiredScriptCopy = [
  "/api/agent-audit",
  "SECTION_LABELS",
  "normalizeSections",
  "renderMarkdown",
  "escapeHtml",
  "ERROR_MESSAGES",
  "showEmpty",
  "same_origin_required",
  "Add email and a business snapshot first.",
  "Agents are building the pipeline loop...",
  "Pipeline loop generated",
  "Copy section"
];

const requiredWorkerCopy = [
  "AGENT_MODELS",
  "AGENT_SECTION_HEADINGS",
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/openai/gpt-oss-20b",
  "agentAuditResponse",
  "agentInputWithInferredWeeklyMetrics",
  "inferWeeklyMetricsFromBusiness",
  "splitAgentSections",
  "missingAgentSections",
  "ensureWeeklyReportContract",
  "ensureWeeklyMetricSnapshot",
  "appendMetricsToCollect",
  "stripUnsupportedMetricValues",
  "stripUnsupportedMetricsFromArtifactSections",
  "metricLineContainsSuppliedValue",
  "metricComparableTokens",
  "metricLabelHasValueInClause",
  "metricLabelsWithValuesInLine",
  "currentMetricPhraseLabels",
  "normalizeMetricValueForCompare",
  "CURRENCY_AMOUNT_PATTERN",
  "WEEKLY_METRIC_LABELS",
  "unknownTopLevelHeadings",
  "hasUnsafeMatch",
  "hasApprovalGate",
  "scrubUnsupportedPrecision",
  "hasProvidedOfferPrice",
  "buildMetricSnapshot",
  "buildWeeklyTrackerReport",
  "Weekly metrics mode",
  "weeklySpend",
  "Do the heavy lifting",
  "Only include blocker questions",
  "Do not invent exact prices",
  "Keep assumptions directional",
  "Implementation Checklist",
  "Weekly Fix Report",
  "env.AI.run",
  "MAX_REQUEST_BYTES",
  "isAllowedOrigin",
  "isLoopbackHostname",
  "isLocalPreviewRequest",
  "hostHeaderHostname",
  "validateAgentRequest",
  "STALE_PUBLIC_PATHS",
  "unsafeOutputReasons",
  "ad account connection",
  "crm outcome sync",
  "agent_usage_limits",
  "agent_runs",
  "agent-self-serve",
  "daily_email_limit",
  "storesBusinessBrief: false",
  "noSpendChanges: true",
  "noAutopublishing: true"
];

const requiredPublicArtifacts = [
  "self-serve AI Agent Desk",
  "Cloudflare Workers AI generates the Pipeline Brief, Implementation Checklist, and Weekly Fix Report server-side",
  "Client-side code does not call model providers",
  "does not promise revenue, ROAS, profit, booked calls",
  "No campaign publishing",
  "No ad spend changes"
];

const forbiddenClaims = [
  "guaranteed revenue",
  "guaranteed ROAS",
  "guaranteed booked calls",
  "guaranteed calls",
  "guaranteed rankings",
  "guaranteed sales",
  "guaranteed profit",
  "10x revenue",
  "10x sales",
  "rank #1",
  "rank number one",
  "fully autonomous ad buying",
  "autonomously publish",
  "change ad spend for you",
  "30% booking rate",
  "80% show-up rate",
  "10%-18% close rate"
];

for (const text of requiredIndexCopy) {
  if (!index.includes(text)) failures.push(`Missing Agent Desk page copy: ${text}`);
}

for (const text of requiredAgentStack) {
  if (!index.includes(text)) failures.push(`Missing Agent Desk agent: ${text}`);
}

for (const text of requiredScriptCopy) {
  if (!script.includes(text)) failures.push(`Missing agent script behavior: ${text}`);
}

for (const text of requiredWorkerCopy) {
  if (!worker.includes(text)) failures.push(`Missing worker agent behavior: ${text}`);
}

for (const text of requiredPublicArtifacts) {
  const haystack = `${llms}\n${offer}`;
  if (!haystack.includes(text)) failures.push(`Missing public artifact copy: ${text}`);
}

function formFieldTags(html) {
  return [...html.matchAll(/<(input|textarea|select)\b[^>]*>/gi)].map((match) => match[0]);
}

function fieldName(tag) {
  return tag.match(/\bname="([^"]+)"/i)?.[1] || "";
}

const formFields = formFieldTags(index);
const requiredFields = formFields
  .filter((tag) => /\srequired(?:\s|>|=)/i.test(tag))
  .map(fieldName)
  .filter(Boolean)
  .sort();
const expectedRequiredFields = ["business", "email"];

if (JSON.stringify(requiredFields) !== JSON.stringify(expectedRequiredFields)) {
  failures.push(`Agent Desk must require only email and business fields. Found required fields: ${requiredFields.join(", ") || "none"}`);
}

for (const optionalName of [
  "market",
  "funnel",
  "offer",
  "audience",
  "proof",
  "followup",
  "constraints",
  "weeklySpend",
  "rawLeads",
  "qualifiedLeads",
  "bookedCalls",
  "showedCalls",
  "closedDeals",
  "cashCollected",
  "bottleneck"
]) {
  const field = formFields.find((tag) => fieldName(tag) === optionalName);
  if (!field) {
    failures.push(`Missing optional Agent Desk field: ${optionalName}`);
  } else if (/\srequired(?:\s|>|=)/i.test(field)) {
    failures.push(`Optional Agent Desk field must not be required: ${optionalName}`);
  }
}

const siteHome = read("public/index.html");
const siteAudit = read("public/audit.html");

// Conversion-friction regression: the signup website field must accept a bare
// business domain (example.com) at the browser level instead of requiring a
// scheme via type="url", while still rejecting malformed entries and staying
// required. The server's normalizeWebsite keeps the URL-safety gate.
const VALID_WEBSITES = ["example.com", "www.example.com", "https://example.com", "example.com/page", "https://example.com/"];
const INVALID_WEBSITES = ["example", "not a domain", "example..com", "example.com/with space", "https://"];

function websiteField(html) {
  return html.match(/<input\b[^>]*name="website"[^>]*>/i)?.[0] || "";
}

for (const [pageName, pageHtml] of [["homepage", siteHome], ["audit page", siteAudit]]) {
  const field = websiteField(pageHtml);
  if (!field) {
    failures.push(`Signup form on ${pageName} must keep a website input.`);
    continue;
  }
  if (/\btype="url"/i.test(field)) {
    failures.push(`Signup website field on ${pageName} must not use type="url" (rejects bare domains like example.com).`);
  }
  if (!/\srequired(?:\s|>|=)/i.test(field)) {
    failures.push(`Signup website field on ${pageName} must stay required.`);
  }
  const pattern = field.match(/\bpattern="([^"]+)"/i)?.[1];
  if (!pattern) {
    failures.push(`Signup website field on ${pageName} must carry a domain pattern.`);
    continue;
  }
  const compiled = new RegExp(`^(?:${pattern})$`, "i");
  for (const value of VALID_WEBSITES) {
    if (!compiled.test(value)) failures.push(`Signup website pattern on ${pageName} must accept ${value}.`);
  }
  for (const value of INVALID_WEBSITES) {
    if (compiled.test(value)) failures.push(`Signup website pattern on ${pageName} must reject ${JSON.stringify(value)}.`);
  }
}

if (!index.includes("role=\"tabpanel\"") || !index.includes("aria-labelledby=\"output-tab-pipelineBrief\"")) {
  failures.push("Agent output must expose a proper tabpanel relationship.");
}

for (const claim of forbiddenClaims) {
  const haystack = `${index}\n${script}\n${llms}\n${offer}`.toLowerCase();
  if (haystack.includes(claim.toLowerCase())) {
    failures.push(`Forbidden claim found: ${claim}`);
  }
}

// AI-search visibility check — the fifth check of the reviewed audit.
// The audit page reports found / wrong / absent / not-tested with captured
// evidence, never a promise of visibility or ranking. The fixture in
// evidence-fixtures is the canonical evidence record; the page embeds an
// inline copy that must not drift from it.

const AI_SEARCH_STATES = ["found", "wrong", "absent", "not-tested"];
const AI_SEARCH_EVIDENCE_STATES = ["found", "wrong", "absent"];

let aiSearchFixture = null;
try {
  aiSearchFixture = JSON.parse(read("evidence-fixtures/ai-search/visibility-check.json"));
} catch {
  failures.push("AI-search evidence fixture must be valid JSON at evidence-fixtures/ai-search/visibility-check.json.");
}

if (aiSearchFixture) {
  if (aiSearchFixture.check_id !== "ai-search-visibility") {
    failures.push("AI-search evidence fixture must carry check_id 'ai-search-visibility'.");
  }
  if (aiSearchFixture.kind !== "specimen") {
    failures.push("AI-search evidence fixture must be marked kind 'specimen'.");
  }
  if (!Array.isArray(aiSearchFixture.records) || aiSearchFixture.records.length === 0) {
    failures.push("AI-search evidence fixture must contain at least one record.");
  }
  const seenIds = new Set();
  for (const [position, record] of (aiSearchFixture.records || []).entries()) {
    const where = `AI-search fixture record ${position + 1}`;
    if (!record || typeof record !== "object") {
      failures.push(`${where} must be an object.`);
      continue;
    }
    if (typeof record.id !== "string" || !record.id) {
      failures.push(`${where} must carry a non-empty string id.`);
    } else if (seenIds.has(record.id)) {
      failures.push(`${where} repeats id '${record.id}'.`);
    } else {
      seenIds.add(record.id);
    }
    if (!AI_SEARCH_STATES.includes(record.state)) {
      failures.push(`${where} must resolve to one of ${AI_SEARCH_STATES.join(", ")}; got '${record.state}'.`);
    }
    if (typeof record.surface !== "string" || !record.surface) {
      failures.push(`${where} must name the surface tested.`);
    }
    if (record.state === "not-tested") {
      if (record.prompt !== undefined) failures.push(`${where} (not-tested) must not carry a prompt — it was not asked.`);
      if (record.evidence !== undefined) failures.push(`${where} (not-tested) must not carry evidence — none was captured.`);
      if (record.fix !== undefined) failures.push(`${where} (not-tested) must not carry a fix — there is no evidence to support one.`);
      if (typeof record.reason !== "string" || !record.reason) {
        failures.push(`${where} (not-tested) must state why the surface was not tested.`);
      }
    } else {
      if (typeof record.prompt !== "string" || !record.prompt) {
        failures.push(`${where} (${record.state}) must carry the named prompt that was asked.`);
      }
      if (typeof record.tested_at !== "string" || !record.tested_at) {
        failures.push(`${where} (${record.state}) must carry the date it was tested.`);
      }
      const evidence = record.evidence;
      if (!evidence || typeof evidence.quote !== "string" || !evidence.quote) {
        failures.push(`${where} (${record.state}) must quote the captured answer.`);
      }
      if (!evidence || typeof evidence.source !== "string" || !evidence.source) {
        failures.push(`${where} (${record.state}) must reference the source the answer came from.`);
      }
      if (record.fix !== undefined && !AI_SEARCH_EVIDENCE_STATES.includes(record.state)) {
        failures.push(`${where} (${record.state}) must not carry a fix — only wrong or absent evidence supports one.`);
      }
    }
  }
}

const inlineEvidenceMatch = siteAudit.match(/<script type="application\/json" id="ai-search-evidence">([\s\S]*?)<\/script>/);
if (!inlineEvidenceMatch) {
  failures.push("Audit page must embed the AI-search evidence fixture inline.");
} else {
  try {
    if (JSON.stringify(JSON.parse(inlineEvidenceMatch[1])) !== JSON.stringify(JSON.parse(read("evidence-fixtures/ai-search/visibility-check.json")))) {
      failures.push("Audit page inline AI-search evidence must match evidence-fixtures/ai-search/visibility-check.json.");
    }
  } catch {
    failures.push("Audit page inline AI-search evidence must be valid JSON.");
  }
}

const requiredAuditAiSearchCopy = [
  "Five checks, by hand",
  "The five checks",
  "The AI-search check",
  '<span class="t">Found</span>',
  '<span class="t">Wrong</span>',
  '<span class="t">Absent</span>',
  '<span class="t">Not tested</span>',
  'Not tested is not "invisible"',
  "specimen record",
  "No revenue, ranking, AI-visibility or booking guarantees",
  "The money page",
  "The paid creative",
  "The unanswered",
  "The reach"
];

for (const text of requiredAuditAiSearchCopy) {
  if (!siteAudit.includes(text)) failures.push(`Missing audit AI-search copy: ${text}`);
}

const forbiddenAiSearchClaims = [
  "guaranteed AI visibility",
  "guaranteed AI-search visibility",
  "guaranteed AI ranking",
  "rank in AI search",
  "top of ChatGPT",
  "top of Perplexity",
  "visible in ChatGPT",
  "visible in Perplexity",
  "first result in AI search"
];

for (const claim of forbiddenAiSearchClaims) {
  if (siteAudit.toLowerCase().includes(claim.toLowerCase())) {
    failures.push(`Forbidden AI-search claim on audit page: ${claim}`);
  }
}

for (const route of ["tinystudio.io", "www.tinystudio.io", "app.tinystudio.io", "api.tinystudio.io"]) {
  if (!wrangler.includes(`"pattern": "${route}/*"`)) {
    failures.push(`Missing Cloudflare route: ${route}`);
  }
}

if (!wrangler.includes("\"ai\":") || !wrangler.includes("\"binding\": \"AI\"")) {
  failures.push("Missing Cloudflare Workers AI binding.");
}

if (!wrangler.includes("\"preview_database_id\"")) {
  failures.push("Remote Worker dev needs a D1 preview database binding.");
}

for (const database of wranglerConfig.d1_databases || []) {
  if (database.preview_database_id === database.database_id) {
    failures.push("D1 preview database must not point at the production database.");
  }
}

if (!wrangler.includes("\"run_worker_first\": [\"/*\"]")) {
  failures.push("Worker is not configured to run before all public assets.");
}

if (!packageJson.includes("\"migrate:remote\"") || !packageJson.includes("d1 migrations apply tinystudio_email_signups --remote")) {
  failures.push("Deploy scripts must include the remote D1 migration command.");
}

if (!packageJson.includes("\"test:worker\"") || !packageJson.includes("scripts/test-agent-worker.mjs")) {
  failures.push("Worker agent contract tests must be wired into package scripts.");
}

if (!packageJson.includes("\"test:ui\"") || !packageJson.includes("scripts/test-agent-ui.mjs")) {
  failures.push("Agent UI interaction tests must be wired into package scripts.");
}

if (!packageJson.includes("\"dev\": \"wrangler dev --remote")) {
  failures.push("Dev script must run the Worker preview, not a static-only server.");
}

if (!packageJson.includes("\"deploy\": \"npm run migrate:remote && wrangler deploy\"")) {
  failures.push("Deploy script must apply migrations before wrangler deploy.");
}

if (!robots.includes("Allow: /")) {
  failures.push("Robots file should allow indexing after reopening.");
}

if (!sitemap.includes("https://tinystudio.io/")) {
  failures.push("Sitemap should expose the root Agent Desk URL.");
}

if (!styles.includes(".agent-shell") || !styles.includes(".agent-form") || !styles.includes(".agent-output")) {
  failures.push("Missing Agent Desk visual styles.");
}

if (existsSync(new URL("../public/pipeline-sprint/index.html", import.meta.url))) {
  failures.push("Pipeline Sprint page should not remain as a separate stale public asset.");
}

for (const migration of ["migrations/0002_agent_runs.sql", "migrations/0003_agent_usage_limits.sql"]) {
  if (!existsSync(new URL(`../${migration}`, import.meta.url))) {
    failures.push(`Missing migration: ${migration}`);
    continue;
  }

  try {
    execFileSync("git", ["ls-files", "--error-unmatch", migration], {
      cwd: new URL("..", import.meta.url),
      stdio: "ignore"
    });
  } catch {
    failures.push(`Migration must be tracked by git: ${migration}`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("TinyStudio.io Agent Desk checks passed.");
