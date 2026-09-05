import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { homedir, tmpdir } from "node:os";
import path from "node:path";

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

// Mobile layout regression, static guard: at 390x844 the /audit page
// previously overflowed horizontally (navlinks measured to x=569, the
// 53-of-89 stat to x=451). The mobile treatment must live in audit.css behind
// the shared 760px breakpoint and stack every overflowing block. These are
// deterministic SOURCE-STRING checks (fast, CI-safe, no browser, no network).
// They assert the guard rails, not the layout: the behavioral proof is the
// Chromium layout probe below, plus docs/evidence/audit-390-mobile-overflow-proof.md.
const auditCss = read("public/audit.css");
const auditMobile = auditCss.match(/@media \(max-width:760px\)\{([\s\S]*)\}\s*$/)?.[1] ?? "";

if (!auditMobile) {
  failures.push("Audit page must carry a mobile (max-width:760px) media query in audit.css.");
} else {
  const requireMobileRule = (label, pattern) => {
    if (!pattern.test(auditMobile)) failures.push(`Audit mobile layout must ${label}.`);
  };
  requireMobileRule("scale the 128px stat instead of leaving it nowrap at full size", /\.stat\{[^}]*clamp\(/);
  requireMobileRule("turn the nav into a wrapping two-tier layout", /\.navlinks\{[^}]*flex-wrap:wrap/);
  requireMobileRule("give the nav CTA its own full-width row", /\.navcta\{[^}]*1 1 100%/);
  requireMobileRule("stack the band stat and copy into one column", /\.bandgrid\{[^}]*grid-template-columns:1fr/);
  requireMobileRule("stack the four checks into one column", /\.checks\{[^}]*grid-template-columns:1fr/);
  requireMobileRule("let proof rows wrap instead of overflowing", /\.row\{[^}]*flex-wrap:wrap/);
}

// Behavioral layout probe (optional, no dependencies). When a real Chromium
// binary is available, this serves the audit page over localhost and measures
// the ACTUAL layout at 390x844 and 1280x800 over the DevTools protocol:
// document.scrollWidth vs clientWidth, elements escaping the viewport, and
// whether the mobile/desktop treatments applied. A browser-less environment
// gets a loud SKIP — the source guards above remain the CI-enforced floor.
// Finding a browser but failing to measure is a hard failure, never a silent
// pass.

const MEASURE_LAYOUT = `(async () => {
  const deadline = Date.now() + 15000;
  while (document.readyState !== "complete" && Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 50));
  }
  await document.fonts.ready;
  const root = document.documentElement;
  const vw = root.clientWidth;
  const offenders = [...document.querySelectorAll("body *")]
    .map((el) => [el, el.getBoundingClientRect()])
    .filter(([, r]) => r.width > 1 && r.right > vw + 0.5)
    .map(([el, r]) => {
      const name = typeof el.className === "string" && el.className ? "." + el.className.trim().split(/\\s+/)[0] : "";
      return el.tagName.toLowerCase() + name + " right=" + Math.round(r.right);
    });
  const css = (sel) => { const el = document.querySelector(sel); return el ? getComputedStyle(el) : null; };
  const checks = css(".checks");
  const band = css(".bandgrid");
  const stat = css(".stat");
  return {
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    bodyScrollWidth: document.body.scrollWidth,
    offenders,
    checksColumns: checks ? checks.gridTemplateColumns.split(" ").length : null,
    bandgridColumns: band ? band.gridTemplateColumns.split(" ").length : null,
    statFontSize: stat ? stat.fontSize : null
  };
})()`;

function findChromium() {
  for (const candidate of [process.env.CHROME_PATH, "chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome"]) {
    if (!candidate) continue;
    if (path.isAbsolute(candidate) && existsSync(candidate)) return candidate;
    try {
      const which = spawnSync("which", [candidate], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      if (which.status === 0 && which.stdout.trim()) return which.stdout.trim().split("\n")[0];
    } catch { /* keep looking */ }
  }
  if (process.platform === "linux") {
    const cacheDir = path.join(homedir(), ".cache", "ms-playwright");
    if (existsSync(cacheDir)) {
      for (const entry of readdirSync(cacheDir)) {
        const dir = path.join(cacheDir, entry);
        if (!statSync(dir).isDirectory()) continue;
        const shell = path.join(dir, "chrome-headless-shell-linux64", "chrome-headless-shell");
        if (existsSync(shell)) return shell;
        const chrome = path.join(dir, "chrome-linux", "chrome");
        if (existsSync(chrome)) return chrome;
      }
    }
  }
  return null;
}

async function runLayoutProbe() {
  if (typeof WebSocket === "undefined") {
    console.log("[layout probe] SKIPPED: needs Node >= 21 (global WebSocket) and a Chromium binary.");
    return;
  }
  if (process.platform === "win32") {
    console.log("[layout probe] SKIPPED on Windows: no Chromium discovery implemented here.");
    return;
  }
  const chromium = findChromium();
  if (!chromium) {
    console.log("[layout probe] SKIPPED: no Chromium found. Set CHROME_PATH (or install Chrome) to get real layout measurement; the source guards above still apply.");
    return;
  }

  const publicDir = new URL("../public/", import.meta.url).pathname;
  const server = createServer((req, res) => {
    const file = path.join(publicDir, new URL(req.url, "http://127.0.0.1").pathname.slice(1));
    if (!existsSync(file)) {
      res.writeHead(404);
      res.end("not found");
      return;
    }
    const mime = file.endsWith(".css") ? "text/css; charset=utf-8" : file.endsWith(".js") ? "text/javascript; charset=utf-8" : "text/html; charset=utf-8";
    res.writeHead(200, { "content-type": mime });
    res.end(readFileSync(file));
  });
  server.listen(0, "127.0.0.1");
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const serverUrl = `http://127.0.0.1:${server.address().port}`;

  const profile = mkdtempSync(path.join(tmpdir(), "audit-probe-"));
  // --no-sandbox: many Linux distros (Ubuntu 23.10+/AppArmor) deny unprivileged
  // userns, which headless Chrome requires for its sandbox. This probe only
  // loads localhost content into a throwaway temp profile, so the browser
  // sandbox is not a security boundary here.
  const chrome = spawn(chromium, ["--headless=new", "--no-sandbox", "--disable-gpu", `--user-data-dir=${profile}`, "--remote-debugging-port=0", "about:blank"], { stdio: "ignore" });
  try {
    const activePort = path.join(profile, "DevToolsActivePort");
    const deadline = Date.now() + 15_000;
    while (!existsSync(activePort) && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (!existsSync(activePort)) {
      failures.push("Layout probe: Chromium did not expose its DevTools port.");
      return;
    }
    const [debugPort] = readFileSync(activePort, "utf8").trim().split("\n");

    let target = null;
    for (let attempt = 0; attempt < 50 && !target; attempt++) {
      try {
        const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
        target = targets.find((entry) => entry.type === "page");
      } catch { /* not up yet */ }
      if (!target) await new Promise((r) => setTimeout(r, 100));
    }
    if (!target) {
      failures.push("Layout probe: could not reach Chromium DevTools target list.");
      return;
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = () => reject(new Error("DevTools websocket failed"));
    });
    const pending = new Map();
    let nextId = 0;
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    const send = (method, params = {}) => {
      const id = ++nextId;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    };

    for (const [viewport, checks] of [
      ["390x844", { clientWidth: 390, checksColumns: 1, bandgridColumns: 1 }],
      ["1280x800", { clientWidth: 1280, checksColumns: 4, bandgridColumns: 2, statFontSize: "128px" }]
    ]) {
      const [width, height] = viewport.split("x").map(Number);
      await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
      await send("Emulation.setScrollbarsHidden", { hidden: true });
      await send("Page.navigate", { url: `${serverUrl}/audit.html` });
      const evaluated = await send("Runtime.evaluate", { expression: MEASURE_LAYOUT, awaitPromise: true, returnByValue: true });
      if (evaluated.exceptionDetails) {
        failures.push(`Layout probe at ${viewport}: measurement threw in the page (${evaluated.exceptionDetails.text}).`);
        continue;
      }
      const measured = evaluated.result.value;
      console.log(`[layout probe] ${viewport}: scrollWidth=${measured.scrollWidth} clientWidth=${measured.clientWidth} offenders=${measured.offenders.length} checks=${measured.checksColumns} bandgrid=${measured.bandgridColumns} stat=${measured.statFontSize}`);
      if (measured.scrollWidth !== measured.clientWidth) {
        failures.push(`Layout probe at ${viewport}: page overflows horizontally, scrollWidth ${measured.scrollWidth} != clientWidth ${measured.clientWidth}.`);
      }
      for (const offender of measured.offenders) {
        failures.push(`Layout probe at ${viewport}: element escapes the viewport: ${offender}.`);
      }
      for (const [key, expected] of Object.entries(checks)) {
        if (measured[key] !== expected) {
          failures.push(`Layout probe at ${viewport}: expected ${key}=${expected}, measured ${measured[key]}.`);
        }
      }
    }
    ws.close();
  } finally {
    chrome.kill("SIGKILL");
    server.close();
    rmSync(profile, { recursive: true, force: true });
  }
}

try {
  await runLayoutProbe();
} catch (error) {
  failures.push(`Layout probe failed: ${error.message}`);
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
