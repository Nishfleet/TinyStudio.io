import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const index = read("public/index.html");
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
  "Generate Pipeline Brief",
  "No ad account access. No spend changes.",
  "The business brief is processed for the output and is not saved by this app.",
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
  "ERROR_MESSAGES",
  "showEmpty",
  "same_origin_required",
  "Agents are building the pipeline brief...",
  "Pipeline Brief generated",
  "Copy brief"
];

const requiredWorkerCopy = [
  "AGENT_MODELS",
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/openai/gpt-oss-20b",
  "agentAuditResponse",
  "env.AI.run",
  "MAX_REQUEST_BYTES",
  "validateAgentRequest",
  "STALE_PUBLIC_PATHS",
  "unsafeOutputReasons",
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
  "Cloudflare Workers AI generates the Pipeline Brief server-side",
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

for (const claim of forbiddenClaims) {
  const haystack = `${index}\n${script}\n${llms}\n${offer}`.toLowerCase();
  if (haystack.includes(claim.toLowerCase())) {
    failures.push(`Forbidden claim found: ${claim}`);
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
