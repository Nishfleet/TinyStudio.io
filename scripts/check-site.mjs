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
  "The Tiny Studio Agent Desk",
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
  "The Website Appraisal",
  "free leak audit of high-ticket service homepages",
  "human-reviewed desk",
  "clinics, surgeons, dentists, spas",
  "clients are never named",
  "not autonomous software",
  "There are no revenue, ranking, ROAS, conversion, booked-call, or sales-volume guarantees",
  "Client-side code does not call model providers",
  "No campaign publishing",
  "No ad spend changes",
  "https://tinystudio.io/pricing.html"
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
  // llms.txt and offer.md are mirrors of the same offer contract. A fact must
  // appear in BOTH (case-insensitively, since one file may head it while the
  // other embeds it mid-sentence, and llms.txt wraps prose across lines), so
  // neither file can silently drift.
  const normalized = (content) => content.toLowerCase().replace(/\s+/g, " ");
  const needle = normalized(text);
  if (!normalized(llms).includes(needle)) failures.push(`Missing offer fact in llms.txt: ${text}`);
  if (!normalized(offer).includes(needle)) failures.push(`Missing offer fact in offer.md: ${text}`);
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

// Mobile layout regression: at 390x844 the /audit page previously overflowed
// horizontally (navlinks measured to x=569, the 53-of-89 stat to x=451).
// The mobile treatment must live in audit.css behind the shared 760px
// breakpoint and stack every overflowing block. These checks below are
// STATIC SOURCE GUARDS (regex over audit.css), not behavioral tests: CI has
// no browser. The behavioral, measured layout proof for this fix lives in
// docs/evidence/audit-mobile-overflow-390x844-2026-08-06.md (unfixed 567px
// scrollWidth at 390x844, fixed 390px, desktop 1280px unchanged).
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

// The behavioral layout proof (real Chromium measurement, local static copy)
// is checked in so the static guards above stay distinguishable from it.
// Existence and section anchors only — this does not re-verify measurements.
const overflowReceipt = read("docs/evidence/audit-mobile-overflow-390x844-2026-08-06.md");
for (const anchor of [
  "unfixed",
  "390x844",
  "**fixed**",
  "**390**",
  "1280x800",
  "not CI proof",
  "Exact verification method"
]) {
  if (!overflowReceipt.includes(anchor)) {
    failures.push(`Overflow evidence receipt must record the ${JSON.stringify(anchor)} section.`);
  }
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

// Responsive regression guard: each public route's stylesheet must keep its
// mobile block, or a 390px phone view regains horizontal overflow.
const responsiveCss = [
  ["shared.css", ["@media (max-width:760px)", ".wrap{padding:0 20px}", ".navlinks{flex-wrap:wrap"]],
  ["index.css", ["@media (max-width:760px)", ".wrap{padding:0 20px}", ".navlinks{flex-wrap:wrap"]],
  ["pricing.css", ["@media (max-width:760px)", ".plan{grid-template-columns:1fr"]],
  ["agents.css", ["@media (max-width:760px)", ".ag{grid-template-columns:1fr", ".gatebox{grid-template-columns:1fr"]]
];
for (const [file, needles] of responsiveCss) {
  const css = read(`public/${file}`);
  for (const needle of needles) {
    if (!css.includes(needle)) failures.push(`Missing mobile responsive rule in ${file}: ${needle}`);
  }
}

// Render-blocking font stylesheet guards (dogfood finding b8f6046e942a).
// The Google Fonts css2 stylesheet was fetched render-blocking on every public
// page — a <link rel="stylesheet"> in the homepage head, and an @import chain
// inside shared.css for the shared pages (audit, agents, pricing, specimen,
// brief-requested). The fix preloads the same css2 URL as a style resource,
// promotes it via the same-origin public/fonts.js script, and removes the
// @import from shared.css. An inline onload swap is FORBIDDEN: the worker's
// Content-Security-Policy (script-src 'self', no 'unsafe-inline') blocks
// inline event handlers, so that shape silently drops the fonts under the
// production CSP. These are STATIC SOURCE GUARDS (regex over the served
// files), not network-timing tests: CI has no browser, so they assert the
// blocking shape cannot return, not that the font CDN is fast.
const fontCssHref = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;0,9..144,400;1,9..144,200;1,9..144,300&family=Karla:wght@300;400;500;600;700&display=swap";

const fontPages = [
  ["homepage", siteHome],
  ["audit page", siteAudit],
  ["desk page", read("public/agents.html")],
  ["pricing page", read("public/pricing.html")],
  ["specimen page", read("public/specimen.html")],
  ["brief-requested page", read("public/brief-requested.html")]
];

const sharedCss = read("public/shared.css");
let fontScript = "";
try {
  fontScript = read("public/fonts.js");
} catch {
  failures.push("public/fonts.js must exist (same-origin font promotion script).");
}

// The shared stylesheet must not carry the @import chain that blocked first
// paint on every page that links it.
if (/@import\b[^;]*fonts\.googleapis\.com/i.test(sharedCss)) {
  failures.push("shared.css must not @import the Google Fonts stylesheet (render-blocking chain).");
}

// The same-origin promotion script must exist and re-insert the preloaded URL
// as a real stylesheet (script-src 'self' allows it; inline onload does not),
// and the worker must serve it — the PUBLIC_ASSET_PATHS allow-list is the
// only path to /fonts.js, and an unlisted asset gets a 404.
if (fontScript) {
  if (!fontScript.includes('link[rel="preload"][as="style"][data-fonts-css]')) {
    failures.push("fonts.js must select the preload link via [data-fonts-css].");
  }
  if (!fontScript.includes('link.rel = "stylesheet"') || !fontScript.includes('document.head.appendChild(link)')) {
    failures.push("fonts.js must promote the preload link to a stylesheet.");
  }
}
if (!worker.includes('"/fonts.js"')) {
  failures.push("Worker must serve /fonts.js from the public asset allow-list.");
}

for (const [pageName, pageHtml] of fontPages) {
  // Fonts must still load (visual contract): preload as style + promotion.
  if (!pageHtml.includes(`rel="preload" as="style" data-fonts-css href="${fontCssHref}"`)) {
    failures.push(`${pageName} must preload the font stylesheet (non-blocking): ${fontCssHref}`);
  }
  // The promotion must come from the same-origin script, never an inline
  // handler: the production CSP blocks inline onload, silently dropping fonts.
  if (/<link\b[^>]*data-fonts-css[^>]*\bonload=/i.test(pageHtml)) {
    failures.push(`${pageName} must not use an inline onload for the font preload (blocked by the production CSP).`);
  }
  if (!pageHtml.includes('<script src="fonts.js" defer></script>')) {
    failures.push(`${pageName} must load the same-origin font promotion script.`);
  }
  // No-JS fallback must keep a blocking link inside <noscript>.
  if (!pageHtml.includes(`<noscript><link rel="stylesheet" href="${fontCssHref}"></noscript>`)) {
    failures.push(`${pageName} must keep the font stylesheet as a noscript fallback.`);
  }
  // A render-blocking font link must not appear outside <noscript> (attribute
  // order-insensitive, since rel= and href= may appear in either order).
  const outsideNoscript = pageHtml.replace(/<noscript>[\s\S]*?<\/noscript>/gi, "");
  const blockingFontLink = [...outsideNoscript.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((tag) => /\brel="stylesheet"/i.test(tag) && /href="https:\/\/fonts\.googleapis\.com[^"]*css2/i.test(tag));
  if (blockingFontLink) {
    failures.push(`${pageName} must not load the font stylesheet render-blocking (link rel=stylesheet): ${blockingFontLink}`);
  }
}

// The behavioral font-timing proof (real Chromium measurement, local static
// copies, simulated CDN delay) is checked in so the static guards above stay
// distinguishable from it. Existence and section anchors only — this does not
// re-verify measurements.
const fontReceipt = read("docs/evidence/render-blocking-fonts-2026-08-08.md");
for (const anchor of [
  "unfixed",
  "1500ms",
  "non-blocking",
  "waited for css2",
  "Karla",
  "not CI proof",
  "Exact verification method"
]) {
  if (!fontReceipt.includes(anchor)) {
    failures.push(`Font render-blocking evidence receipt must record the ${JSON.stringify(anchor)} section.`);
  }
}

// The static guards cannot see behavior, so CI must run the browser check
// (scripts/check-render-blocking.mjs) alongside them; these guards keep that
// wiring from drifting: the script, the package.json entry, the CI step, and
// the production CSP the browser check asserts under (mirrored from the
// worker, which the check cannot import).
let renderBlockingScript = "";
try {
  renderBlockingScript = read("scripts/check-render-blocking.mjs");
} catch {
  failures.push("scripts/check-render-blocking.mjs must exist (browser render-blocking guard).");
}
const ciWorkflow = read(".github/workflows/ci.yml");
if (!packageJson.includes('"check:render-blocking": "node scripts/check-render-blocking.mjs"')) {
  failures.push("package.json must expose the browser render-blocking check as check:render-blocking.");
}
if (!ciWorkflow.includes("npm run check:render-blocking")) {
  failures.push("CI must run the browser render-blocking check (npm run check:render-blocking).");
}
if (renderBlockingScript) {
  const workerCsp = worker.match(/Content-Security-Policy":\s*"([^"]+)"/)?.[1] ?? "";
  if (!workerCsp || !renderBlockingScript.includes(workerCsp)) {
    failures.push("scripts/check-render-blocking.mjs must mirror the worker's production CSP string.");
  }
}

if (existsSync(new URL("../public/pipeline-sprint/index.html", import.meta.url))) {
  failures.push("Pipeline Sprint page should not remain as a separate stale public asset.");
}

// ---- AI-search evidence artifact ---------------------------------------
// The audit page carries a controlled-test evidence artifact for AI-search
// discoverability. Fixtures in evidence-fixtures/ai-search/ are the single
// source of truth; the audit page embeds a copy of both files and this block
// refuses to let the embedded bundle drift from them.
const AI_STATES = ["found", "wrong", "absent", "not-tested"];
let aiQuestions = null;
let aiEvidence = null;
try {
  aiQuestions = JSON.parse(read("evidence-fixtures/ai-search/controlled-questions.json"));
  aiEvidence = JSON.parse(read("evidence-fixtures/ai-search/evidence.json"));
} catch (error) {
  failures.push(`AI-search fixture must exist and be valid JSON: ${error.message}`);
}

if (aiQuestions && aiEvidence) {
  for (const fixture of ["evidence-fixtures/ai-search/controlled-questions.json", "evidence-fixtures/ai-search/evidence.json", "evidence-fixtures/ai-search/README.md"]) {
    try {
      execFileSync("git", ["ls-files", "--error-unmatch", fixture], {
        cwd: new URL("..", import.meta.url),
        stdio: "ignore"
      });
    } catch {
      failures.push(`AI-search fixture must be tracked by git: ${fixture}`);
    }
  }

  const auditScript = read("public/audit.js");

  if (!siteAudit.includes('id="ai-search-evidence"') || !siteAudit.includes('data-ai-search-evidence')) {
    failures.push("Audit page must mount the AI-search evidence artifact.");
  }

  for (const state of AI_STATES) {
    if (!auditScript.includes(state)) failures.push(`Audit script must represent the state: ${state}`);
  }
  for (const label of ["Found", "Wrong", "Absent", "Not tested"]) {
    if (!auditScript.includes(label)) failures.push(`Audit script must label the state: ${label}`);
  }

  const bundleMatch = siteAudit.match(/<script type="application\/json" id="ai-search-evidence">([\s\S]*?)<\/script>/);
  if (!bundleMatch) {
    failures.push("Audit page must embed the AI-search evidence bundle.");
  } else {
    let embedded = null;
    try {
      embedded = JSON.parse(bundleMatch[1]);
    } catch (error) {
      failures.push("Audit page AI-search bundle must be valid JSON.");
    }
    if (embedded) {
      const expected = { questions: aiQuestions, evidence: aiEvidence };
      if (JSON.stringify(embedded) !== JSON.stringify(expected)) {
        failures.push("Audit page AI-search bundle must match evidence-fixtures/ai-search/ (regenerate the embed).");
      }
    }
  }

  const questions = aiQuestions.questions || [];
  const questionIds = new Set();
  for (const question of questions) {
    for (const field of ["id", "name", "prompt", "truth"]) {
      if (typeof question[field] !== "string" || !question[field]) {
        failures.push(`AI-search question must carry ${field}: ${JSON.stringify(question.id || question)}`);
      }
    }
    if (questionIds.has(question.id)) failures.push(`AI-search question id must be unique: ${question.id}`);
    questionIds.add(question.id);
  }
  if (!questions.length) failures.push("AI-search fixture must name at least one controlled question.");

  const engines = new Map((aiEvidence.engines || []).map((engine) => [engine.id, engine]));
  for (const engine of aiEvidence.engines || []) {
    if (!engine.id || !engine.name) failures.push("AI-search engine entries must carry id and name.");
  }

  const runs = aiEvidence.runs || [];
  if (!runs.length) failures.push("AI-search fixture must carry at least one captured run.");
  for (const run of runs) {
    if (!AI_STATES.includes(run.state)) failures.push(`AI-search run has an unknown state: ${run.state}`);
    if (!questionIds.has(run.questionId)) failures.push(`AI-search run references an unknown question: ${run.questionId}`);
    if (!engines.has(run.engine)) failures.push(`AI-search run references an unknown engine: ${run.engine}`);
    if (run.state === "not-tested") {
      if (!run.reason) failures.push(`not-tested run must state a reason: ${run.questionId}/${run.engine}`);
      if (run.captured || (run.sources || []).length) {
        failures.push(`not-tested run must not carry an answer or sources: ${run.questionId}/${run.engine}`);
      }
    } else {
      if (!run.captured) failures.push(`run must capture what was observed: ${run.questionId}/${run.engine}`);
      if (run.state !== "absent" && !(run.sources || []).length) {
        failures.push(`run must cite its sources: ${run.questionId}/${run.engine}`);
      }
    }
    if (run.remediation && run.remediation.page) {
      let siteHost = "";
      try {
        siteHost = new URL(aiEvidence.business.site).hostname;
      } catch {
        failures.push("AI-search business site must be a valid URL.");
      }
      const sameDomain = (run.sources || []).some((source) => {
        try {
          return new URL(source.url).hostname === siteHost;
        } catch {
          return false;
        }
      });
      if (siteHost && !sameDomain) {
        failures.push(`page-specific remediation needs same-domain evidence: ${run.questionId}/${run.engine}`);
      }
    }
  }

  // Source-host validation: every source is a page the engine actually cited,
  // so its URL must be a well-formed absolute http(s) URL with a real host, it
  // must carry a title a machine reader can cite, and a run must not cite the
  // same page twice.
  for (const run of runs) {
    const citedUrls = new Set();
    for (const source of run.sources || []) {
      if (typeof source.title !== "string" || !source.title.trim()) {
        failures.push(`AI-search source must carry a title: ${run.questionId}/${run.engine} ${JSON.stringify(source.url)}`);
      }
      let parsedUrl = null;
      try {
        parsedUrl = new URL(source.url);
      } catch {
        parsedUrl = null;
      }
      if (!parsedUrl || !/^https?:$/.test(parsedUrl.protocol) || !parsedUrl.hostname || !parsedUrl.hostname.includes(".") || /\s/.test(source.url)) {
        failures.push(`AI-search source URL must be a valid absolute http(s) URL: ${run.questionId}/${run.engine} ${JSON.stringify(source.url)}`);
      }
      if (citedUrls.has(source.url)) {
        failures.push(`AI-search source URLs must be unique within a run: ${run.questionId}/${run.engine} ${JSON.stringify(source.url)}`);
      }
      citedUrls.add(source.url);
    }
  }

  // External citation links (dogfood 78fcaed682fa, audit run
  // 20260808T074205Z-msk2fl3n): the engine found apps.apple.com/app/tinystudio
  // returning 404 on /audit.html (issue-19, "Broken external links on
  // /audit.html"). The App Store family of hosts resolves only the
  // id-carrying forms — https://apps.apple.com/app/<numeric-id> or
  // https://apps.apple.com/<region>/app/<slug>/id<digits> — so a bare slug
  // such as /app/tinystudio is structurally dead. This rule is checked
  // offline, so CI never depends on the network.
  for (const run of runs) {
    for (const source of run.sources || []) {
      let parsedUrl = null;
      try {
        parsedUrl = new URL(source.url);
      } catch {
        parsedUrl = null;
      }
      if (!parsedUrl) continue;
      const host = parsedUrl.hostname.replace(/^www\./, "");
      if (host === "apps.apple.com" || host === "itunes.apple.com") {
        const path = parsedUrl.pathname;
        const carriesAppId = /^\/app\/\d+/.test(path) || /\/id\d+/.test(path);
        if (!carriesAppId) {
          failures.push(`AI-search source URL is a dead App Store form (must carry an app id): ${run.questionId}/${run.engine} ${JSON.stringify(source.url)}`);
        }
      }
    }
  }

  // Strict state transition: "found" means the answer named the tested business
  // and its facts checked out against the site — so the run must cite the
  // business's own site. This prevents relabeling a wrong/absent result as
  // found without the site itself among the cited pages.
  let businessHost = "";
  try {
    businessHost = new URL(aiEvidence.business.site).hostname;
  } catch {
    failures.push("AI-search business site must be a valid URL.");
  }
  if (businessHost) {
    for (const run of runs) {
      if (run.state === "found") {
        const citesOwnSite = (run.sources || []).some((source) => {
          try {
            return new URL(source.url).hostname === businessHost;
          } catch {
            return false;
          }
        });
        if (!citesOwnSite) {
          failures.push(`found run must cite the tested business's own site: ${run.questionId}/${run.engine}`);
        }
      }
    }
  }

  // The homepage disambiguation block must answer every controlled question:
  // each fixture question id appears in a data-ai-question attribute inside the
  // id="identity" section, and every referenced id must exist in the fixture.
  const homepageIdentitySection = siteHome.match(/<section[^>]*id="identity"[\s\S]*?<\/section>/i)?.[0] || "";
  const referencedQuestionIds = [...homepageIdentitySection.matchAll(/\bdata-ai-question="([^"]+)"/gi)]
    .flatMap((match) => match[1].trim().split(/\s+/))
    .filter(Boolean);
  const referencedSet = new Set(referencedQuestionIds);
  if (!homepageIdentitySection.includes("data-ai-identity")) {
    failures.push("Homepage disambiguation block must carry data-ai-identity.");
  }
  for (const question of questions) {
    if (!referencedSet.has(question.id)) {
      failures.push(`Homepage disambiguation block must answer the controlled question: ${question.id}`);
    }
  }
  for (const ref of referencedSet) {
    if (!questionIds.has(ref)) {
      failures.push(`Homepage disambiguation block references an unknown question id: ${ref}`);
    }
  }

  const fixtureText = JSON.stringify(aiQuestions) + "\n" + JSON.stringify(aiEvidence);
  if (/[\w.+-]+@[\w-]+\.[\w.]{2,}/.test(fixtureText)) {
    failures.push("AI-search fixture must not capture email addresses.");
  }
  if (/\+\d[\d\s()-]{6,}\d/.test(fixtureText)) {
    failures.push("AI-search fixture must not capture phone numbers.");
  }
  if (/\b(password|credential|api[_-]?key|secret token|client brief|customer brief)\b/i.test(fixtureText)) {
    failures.push("AI-search fixture must not capture credentials or customer briefs.");
  }

  const aiSection = siteAudit.match(/<section id="ai-search">[\s\S]*?<\/section>/i)?.[0] || "";
  const artifactCopy = aiSection.replace(/<script[\s\S]*?<\/script>/, "");
  const promisePatterns = [
    /\bguarantee\w*\b/i,
    /\bautonomous\b/i,
    /\bpublish\w*\b/i,
    /\bwill\s+(rank|publish|deliver|generate)\b/i,
    /\brank\s*(#\s*\d|number\s+one|first)\b/i
  ];
  for (const pattern of promisePatterns) {
    if (pattern.test(artifactCopy)) failures.push(`Forbidden claim in AI-search artifact copy: ${pattern}`);
  }

  const narrativeFields = [];
  questions.forEach((question) => narrativeFields.push(question.truth));
  runs.forEach((run) => {
    if (run.remediation) narrativeFields.push(run.remediation.text);
    if (run.reason) narrativeFields.push(run.reason);
  });
  (aiEvidence.engines || []).forEach((engine) => narrativeFields.push(engine.note));
  narrativeFields.push(aiEvidence.business?.note || "");
  const narrativeText = narrativeFields.filter(Boolean).join("\n");
  for (const pattern of [
    /\bguarantee\w*\b/i,
    /\bautonomous\b/i,
    /\bwill\s+(rank|publish|deliver|generate)\b/i,
    /\brank\s*(#\s*\d|number\s+one|first)\b/i
  ]) {
    if (pattern.test(narrativeText)) failures.push(`Forbidden claim in AI-search fixture narrative: ${pattern}`);
  }
}

// ---- TinyStudio identity clarification -------------------------------------
// One precise identity must run through every owned public surface: TinyStudio
// is the business behind tinystudio.io — the free leak audit of high-ticket
// service homepages plus the human-reviewed desk that closes what it finds. The
// clarification must be present on the homepage, the audit page, in llms.txt
// and in offer.md, and the ambiguous or retired framings ("The Tiny Studio",
// the spaced name form, and the self-serve Agent Desk product names) must not
// reappear in visible copy. The embedded AI-search evidence bundle is a
// verbatim record of captured engine answers that legitimately quotes other
// businesses' names, so script blocks are stripped before the stale-string
// scan. The homepage identity section also answers the controlled AI-search
// questions one row at a time (see the data-ai-question tie above).
const ownedPages = [
  ["homepage", siteHome],
  ["audit page", siteAudit],
  ["desk page", read("public/agents.html")],
  ["specimen page", read("public/specimen.html")]
];

const identityFacts = [
  "tinystudio.io",
  "Mac subtitle app",
  "fibre-arts magazine",
  "human-reviewed",
  "states no base city or office address"
];

// llms.txt is the machine-readable surface; offer.md is its mirror. A fact a
// machine reader needs to tell TinyStudio apart must appear in BOTH files, so
// neither file can silently drift while the other keeps answering.
for (const phrase of identityFacts) {
  if (!siteHome.includes(phrase)) failures.push(`Homepage must state the TinyStudio identity: ${phrase}`);
  if (!siteAudit.includes(phrase)) failures.push(`Audit page must state the TinyStudio identity: ${phrase}`);
  if (!llms.includes(phrase)) failures.push(`llms.txt must state the TinyStudio identity: ${phrase}`);
  if (!offer.includes(phrase)) failures.push(`offer.md must state the TinyStudio identity: ${phrase}`);
}

// The same-name disambiguation list is the load-bearing part of the identity:
// the engines' wrong answers (evidence-fixtures/ai-search/evidence.json) were
// built from exactly these other businesses. The list must be mirrored between
// llms.txt and offer.md, and the machine-readable pair must link each other.
const identityDisambiguation = [
  "Mac subtitle app",
  "fibre-arts magazine",
  "design agency",
  "video production studio",
  "Los Angeles venue",
  "unrelated studio LLC",
  "states no base city or office address",
  "run by Nish"
];

for (const phrase of identityDisambiguation) {
  if (!llms.toLowerCase().includes(phrase.toLowerCase())) {
    failures.push(`llms.txt must mirror the disambiguation fact: ${phrase}`);
  }
  if (!offer.toLowerCase().includes(phrase.toLowerCase())) {
    failures.push(`offer.md must mirror the disambiguation fact: ${phrase}`);
  }
}

if (!/^## Identity$/m.test(llms)) {
  failures.push("llms.txt must carry the machine-readable Identity section.");
}
if (!llms.includes("https://tinystudio.io/offer.md")) {
  failures.push("llms.txt must link its machine-readable mirror: offer.md.");
}
if (!offer.includes("https://tinystudio.io/llms.txt")) {
  failures.push("offer.md must link its machine-readable mirror: llms.txt.");
}
if (!llms.includes("https://tinystudio.io/audit.html")) {
  failures.push("llms.txt must point at the audit page that carries the AI-search evidence artifact.");
}

// The machine-readable pair states the current offer in the site's own words
// and points at pricing.html for price and terms. It must not restate the
// pricing page's specifics (dollar amounts, refund language) or revive the
// retired Website Correction / founder-pilot / MSP-buyer framing.
const staleOfferPhrases = [
  "Website Correction",
  "founder pilot",
  "founder-pilot",
  "Managed IT, MSP"
];
for (const phrase of staleOfferPhrases) {
  if (llms.toLowerCase().includes(phrase.toLowerCase())) {
    failures.push(`llms.txt must not revive the retired offer framing: ${phrase}`);
  }
  if (offer.toLowerCase().includes(phrase.toLowerCase())) {
    failures.push(`offer.md must not revive the retired offer framing: ${phrase}`);
  }
}
if (/\$\s?\d/.test(llms)) {
  failures.push("llms.txt must not restate a dollar amount; pricing.html owns the price.");
}
if (/\$\s?\d/.test(offer)) {
  failures.push("offer.md must not restate a dollar amount; pricing.html owns the price.");
}
if (/\brefund\w*\b/i.test(llms)) {
  failures.push("llms.txt must not restate refund terms; pricing.html owns them.");
}
if (/\brefund\w*\b/i.test(offer)) {
  failures.push("offer.md must not restate refund terms; pricing.html owns them.");
}

if (!siteHome.includes('id="identity"')) {
  failures.push("Homepage must carry the identity clarification (id=\"identity\").");
}
if (!siteAudit.includes('id="identity"')) {
  failures.push("Audit page must carry the identity clarification (id=\"identity\").");
}
if (!offer.includes("## Identity")) {
  failures.push("offer.md must carry the machine-readable Identity section.");
}
if (!offer.includes("is not the current offer")) {
  failures.push("offer.md must keep the legacy Agent Desk demotion statement.");
}

const staleIdentityStrings = [
  "The Tiny Studio",  // collides with "The Tiny Studio LA", an unrelated venue
  "Tiny Studio",      // the spaced name form is never used by this business
  "self-serve",       // the retired Agent Desk framing
  "Pipeline Brief",   // the retired Agent Desk deliverable
  "Agent Desk"        // the retired product name
];

for (const [pageName, pageHtml] of ownedPages) {
  const visibleCopy = pageHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  for (const stale of staleIdentityStrings) {
    if (visibleCopy.toLowerCase().includes(stale.toLowerCase())) {
      failures.push(`Stale identity string on ${pageName}: ${stale}`);
    }
  }
  if (!pageHtml.includes("tinystudio.io")) {
    failures.push(`Every owned page must anchor the identity to the domain: ${pageName}`);
  }
}

// ---- Meta descriptions (dogfood) -------------------------------------------
// The leak audit this site sells flags a homepage whose served HTML carries no
// description, so the site's own five public pages must not carry the same
// fault. Each page keeps exactly one valid, non-empty description meta tag in
// its head, within a practical search-snippet length, distinct per page, and
// free of the offer promises the repo refuses to make.
const metaDescriptionPages = [
  ["homepage", siteHome],
  ["audit page", siteAudit],
  ["desk page", read("public/agents.html")],
  ["pricing page", read("public/pricing.html")],
  ["specimen page", read("public/specimen.html")]
];

const seenDescriptions = new Map();
for (const [pageName, pageHtml] of metaDescriptionPages) {
  const tags = [...pageHtml.matchAll(/<meta\b[^>]*\bname="description"[^>]*>/gi)].map((match) => match[0]);
  if (tags.length !== 1) {
    failures.push(`Meta description must appear exactly once in the head of ${pageName} (found ${tags.length}).`);
    continue;
  }
  const content = tags[0].match(/\bcontent="([^"]*)"/i)?.[1] ?? "";
  const trimmed = content.trim();
  if (!trimmed) {
    failures.push(`Meta description on ${pageName} must not be empty.`);
    continue;
  }
  if (trimmed.length > 160) {
    failures.push(`Meta description on ${pageName} must fit a search snippet (${trimmed.length} > 160 chars).`);
  }
  const prior = seenDescriptions.get(trimmed);
  if (prior) {
    failures.push(`Meta description on ${pageName} must be unique; it duplicates ${prior}.`);
  } else {
    seenDescriptions.set(trimmed, pageName);
  }
  for (const claim of forbiddenClaims) {
    if (trimmed.toLowerCase().includes(claim.toLowerCase())) {
      failures.push(`Meta description on ${pageName} must not promise: ${claim}`);
    }
  }
}

// ---- Apple touch icon (dogfood) ---------------------------------------------
// The leak audit this site sells flags a homepage whose served HTML carries no
// apple touch icon, leaving iOS Safari to derive a home-screen icon from a
// screenshot of the page (finding 98a7bf8e08fc, "Apple touch icon missing on
// home"), so the site's own five public pages must not carry that fault either.
// Each page keeps exactly one <link rel="apple-touch-icon"> inside its head,
// pointing at the served /apple-touch-icon.png asset, and the asset itself must
// stay a tracked, valid PNG so a dropped or rewritten file cannot silently
// leave the pages pointing at nothing.
const iconPages = [
  ["homepage", siteHome],
  ["audit page", siteAudit],
  ["desk page", read("public/agents.html")],
  ["pricing page", read("public/pricing.html")],
  ["specimen page", read("public/specimen.html")]
];

for (const [pageName, pageHtml] of iconPages) {
  const head = pageHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
  const links = [...head.matchAll(/<link\b[^>]*\brel="apple-touch-icon"[^>]*>/gi)].map((match) => match[0]);
  if (links.length !== 1) {
    failures.push(`Apple touch icon link must appear exactly once in the head of ${pageName} (found ${links.length}).`);
    continue;
  }
  const href = links[0].match(/\bhref="([^"]*)"/i)?.[1] ?? "";
  if (href.trim() !== "/apple-touch-icon.png") {
    failures.push(`Apple touch icon on ${pageName} must point at /apple-touch-icon.png (found ${JSON.stringify(href)}).`);
  }
}

const iconBytes = readFileSync(new URL("../public/apple-touch-icon.png", import.meta.url), "latin1");
if (!iconBytes.startsWith("\x89PNG\r\n\x1a\n")) {
  failures.push("public/apple-touch-icon.png must be a valid PNG file.");
}
try {
  execFileSync("git", ["ls-files", "--error-unmatch", "public/apple-touch-icon.png"], {
    cwd: new URL("..", import.meta.url),
    stdio: "ignore"
  });
} catch {
  failures.push("public/apple-touch-icon.png must be tracked by git.");
}
if (!worker.includes('"/apple-touch-icon.png"')) {
  failures.push("Worker must serve /apple-touch-icon.png from the public asset allow-list.");
}

// ---- Social share tags (dogfood d87d715be3d0) -----------------------------
// The leak audit this site sells flags a homepage whose served HTML cannot
// tell a social platform what to show when the page is shared — the share
// card comes back with no image, or a scraped guess. The audit run
// 20260808T074205Z-msk2fl3n found exactly that fault on this site's own home
// page (finding d87d715be3d0, "Social share image incomplete on home"):
// public/index.html served zero og:/twitter: tags even though
// public/og-image.png exists and is allow-listed in the worker. Each public
// page must now carry a complete, per-page share set in its head: og:title,
// og:description, og:type, og:url, og:image with width/height/alt, and the
// Twitter Card mirror. og:description must equal the page's meta description
// so the two cannot drift; og:image must be the absolute og-image.png URL and
// its declared dimensions must match the actual PNG header; og:url must be
// the page's own absolute URL; and every tag must sit inside <head>, exactly
// once.
const socialSharePages = [
  ["homepage", siteHome, "https://tinystudio.io/"],
  ["audit page", siteAudit, "https://tinystudio.io/audit.html"],
  ["desk page", read("public/agents.html"), "https://tinystudio.io/agents.html"],
  ["pricing page", read("public/pricing.html"), "https://tinystudio.io/pricing.html"],
  ["specimen page", read("public/specimen.html"), "https://tinystudio.io/specimen.html"]
];
const SOCIAL_IMAGE_URL = "https://tinystudio.io/og-image.png";

// og: tags must use property=, twitter: tags must use name= (either is a
// malformed tag that platforms ignore), and the attribute boundary must not
// let data-property or data-name pass.
const socialShareAttr = (key) => (key.startsWith("og:") ? "property" : "name");
const shareTagIn = (html, key) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map((match) => match[0])
    .filter((tag) => new RegExp(`(?:^|\\s)${socialShareAttr(key)}="${key}"`, "i").test(tag));

const ogImage = readFileSync(new URL("../public/og-image.png", import.meta.url));
if (!ogImage.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
  failures.push("public/og-image.png must be a PNG file (the social share image).");
} else if (ogImage.readUInt32BE(16) !== 1200 || ogImage.readUInt32BE(20) !== 630) {
  failures.push(`og-image.png must be 1200x630 to match og:image:width/height (found ${ogImage.readUInt32BE(16)}x${ogImage.readUInt32BE(20)}).`);
}

for (const [pageName, pageHtml, pageUrl] of socialSharePages) {
  const head = pageHtml.match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? "";
  const description = pageHtml.match(/<meta\b[^>]*\bname="description"[^>]*>/i)?.[0]?.match(/\bcontent="([^"]*)"/i)?.[1] ?? "";
  const expected = new Map([
    ["og:title", ""], // non-empty, per page
    ["og:description", description],
    ["og:type", "website"],
    ["og:url", pageUrl],
    ["og:image", SOCIAL_IMAGE_URL],
    ["og:image:width", "1200"],
    ["og:image:height", "630"],
    ["og:image:alt", ""], // non-empty, per page
    ["twitter:card", "summary_large_image"],
    ["twitter:title", ""], // non-empty, per page
    ["twitter:description", description],
    ["twitter:image", SOCIAL_IMAGE_URL]
  ]);
  for (const [key, expectedContent] of expected) {
    const inDoc = shareTagIn(pageHtml, key);
    if (inDoc.length !== 1) {
      failures.push(`Social share tag ${key} must appear exactly once on ${pageName} (found ${inDoc.length}).`);
      continue;
    }
    const inHead = shareTagIn(head, key);
    if (inHead.length !== 1) {
      failures.push(`Social share tag ${key} on ${pageName} must sit inside <head>.`);
      continue;
    }
    const content = inHead[0].match(/\bcontent="([^"]*)"/i)?.[1] ?? "";
    if (expectedContent === "" && !content.trim()) {
      failures.push(`Social share tag ${key} on ${pageName} must not be empty.`);
    } else if (expectedContent !== "" && content !== expectedContent) {
      failures.push(`Social share tag ${key} on ${pageName} must be ${JSON.stringify(expectedContent)} (found ${JSON.stringify(content)}).`);
    }
  }
}

// ---- Structured data (dogfood 975fdb784275) --------------------------------
// The leak audit this site sells flags a homepage whose served HTML gives a
// machine reader nothing to hold onto — no schema.org markup at all — so the
// site's own five public pages must not carry that fault either. Each page
// keeps exactly one application/ld+json block in its head: a @graph with a
// stable Organization node (the same entity on every page), a WebSite node,
// and the page's own WebPage node. Every value is bound to the page's own
// head metadata — name to the og:title, description to the meta description,
// url to the og:url — so the structured data cannot drift from what the page
// actually says. The Organization node is identical on all five pages, and
// the price stays where it belongs: pricing.html owns it, so no other page's
// block may restate a dollar amount.
const structuredDataPages = [
  ["homepage", siteHome, "https://tinystudio.io/"],
  ["audit page", siteAudit, "https://tinystudio.io/audit.html"],
  ["desk page", read("public/agents.html"), "https://tinystudio.io/agents.html"],
  ["pricing page", read("public/pricing.html"), "https://tinystudio.io/pricing.html"],
  ["specimen page", read("public/specimen.html"), "https://tinystudio.io/specimen.html"]
];

const ORGANIZATION_ID = "https://tinystudio.io/#organization";
const WEBSITE_ID = "https://tinystudio.io/#website";
const ORGANIZATION_NAME = "TinyStudio";
const ORGANIZATION_LOGO = "https://tinystudio.io/apple-touch-icon.png";
const ORGANIZATION_DESCRIPTION =
  siteHome.match(/<meta\b[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/i)?.[1] ?? "";

// The page node name is bound to the og:title, whose HTML entities (e.g. the
// pricing page's "&amp;") must be decoded before comparison.
const decodeEntities = (text) =>
  text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const jsonLdBlocksIn = (html) =>
  [...html.matchAll(/<script\b[^>]*\btype="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => match[1]);

const ogTitleOf = (html) =>
  html.match(/<meta\b[^>]*\bproperty="og:title"[^>]*\bcontent="([^"]*)"/i)?.[1] ?? "";

for (const [pageName, pageHtml, pageUrl] of structuredDataPages) {
  const blocks = jsonLdBlocksIn(pageHtml);
  if (blocks.length !== 1) {
    failures.push(`Structured data must appear exactly once on ${pageName} (found ${blocks.length}).`);
    continue;
  }
  const head = pageHtml.match(/<head\b[\s\S]*?<\/head>/i)?.[0] ?? "";
  if (jsonLdBlocksIn(head).length !== 1) {
    failures.push(`Structured data on ${pageName} must sit inside <head>.`);
  }

  let graph = null;
  try {
    graph = JSON.parse(blocks[0]);
  } catch (error) {
    failures.push(`Structured data on ${pageName} must be valid JSON (${error.message}).`);
    continue;
  }
  if (graph["@context"] !== "https://schema.org") {
    failures.push(`Structured data on ${pageName} must use the schema.org context.`);
  }
  if (!Array.isArray(graph["@graph"])) {
    failures.push(`Structured data on ${pageName} must use an @graph array.`);
    continue;
  }

  const nodes = graph["@graph"];
  const nodeIds = nodes.map((node) => node["@id"]).filter(Boolean);
  if (new Set(nodeIds).size !== nodeIds.length) {
    failures.push(`Structured data on ${pageName} must use unique @id values within the graph.`);
  }

  const orgNodes = nodes.filter((node) => node["@type"] === "Organization");
  const siteNodes = nodes.filter((node) => node["@type"] === "WebSite");
  const pageNodes = nodes.filter((node) => node["@type"] === "WebPage");
  if (orgNodes.length !== 1) {
    failures.push(`Structured data on ${pageName} must carry exactly one Organization node (found ${orgNodes.length}).`);
  } else {
    const org = orgNodes[0];
    if (org["@id"] !== ORGANIZATION_ID) {
      failures.push(`Organization on ${pageName} must use the stable @id ${ORGANIZATION_ID}.`);
    }
    if (org.name !== ORGANIZATION_NAME) {
      failures.push(`Organization on ${pageName} must be named ${ORGANIZATION_NAME} (found ${JSON.stringify(org.name)}).`);
    }
    if (org.url !== "https://tinystudio.io/") {
      failures.push(`Organization on ${pageName} must point at https://tinystudio.io/ (found ${JSON.stringify(org.url)}).`);
    }
    if (org.logo !== ORGANIZATION_LOGO) {
      failures.push(`Organization on ${pageName} must use the served logo ${ORGANIZATION_LOGO} (found ${JSON.stringify(org.logo)}).`);
    }
    if (org.description !== ORGANIZATION_DESCRIPTION) {
      failures.push(`Organization description on ${pageName} must match the homepage meta description (stable entity).`);
    }
  }

  if (siteNodes.length !== 1) {
    failures.push(`Structured data on ${pageName} must carry exactly one WebSite node (found ${siteNodes.length}).`);
  } else {
    const site = siteNodes[0];
    if (site["@id"] !== WEBSITE_ID) {
      failures.push(`WebSite on ${pageName} must use the stable @id ${WEBSITE_ID}.`);
    }
    if (site.url !== "https://tinystudio.io/" || site.name !== ORGANIZATION_NAME) {
      failures.push(`WebSite on ${pageName} must carry the site url and the TinyStudio name.`);
    }
    if (site.inLanguage !== "en") {
      failures.push(`WebSite on ${pageName} must declare inLanguage "en".`);
    }
    if (site.publisher?.["@id"] !== ORGANIZATION_ID) {
      failures.push(`WebSite on ${pageName} must name the Organization as its publisher.`);
    }
  }

  const metaDescription = pageHtml.match(/<meta\b[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/i)?.[1] ?? "";
  const ogTitle = ogTitleOf(pageHtml);
  if (pageNodes.length !== 1) {
    failures.push(`Structured data on ${pageName} must carry exactly one WebPage node (found ${pageNodes.length}).`);
  } else {
    const page = pageNodes[0];
    if (page["@id"] !== `${pageUrl}#webpage`) {
      failures.push(`WebPage on ${pageName} must use the @id ${pageUrl}#webpage.`);
    }
    if (page.url !== pageUrl) {
      failures.push(`WebPage on ${pageName} must carry its own url ${pageUrl} (found ${JSON.stringify(page.url)}).`);
    }
    if (page.name !== decodeEntities(ogTitle)) {
      failures.push(`WebPage name on ${pageName} must equal the og:title (${JSON.stringify(decodeEntities(ogTitle))}).`);
    }
    if (page.description !== metaDescription) {
      failures.push(`WebPage description on ${pageName} must equal the meta description.`);
    }
    if (page.inLanguage !== "en") {
      failures.push(`WebPage on ${pageName} must declare inLanguage "en".`);
    }
    if (page.isPartOf?.["@id"] !== WEBSITE_ID) {
      failures.push(`WebPage on ${pageName} must belong to the WebSite node.`);
    }
    if (page.about?.["@id"] !== ORGANIZATION_ID) {
      failures.push(`WebPage on ${pageName} must be about the Organization node.`);
    }
  }

  // The price is pricing.html's to state; no other page's structured data may
  // restate a dollar amount (the pricing page mirrors its own meta
  // description, which legitimately carries the price).
  if (pageName !== "pricing page" && /\$\s?\d/.test(blocks[0])) {
    failures.push(`Structured data on ${pageName} must not restate a dollar amount; pricing.html owns the price.`);
  }
  for (const claim of forbiddenClaims) {
    if (blocks[0].toLowerCase().includes(claim.toLowerCase())) {
      failures.push(`Structured data on ${pageName} must not promise: ${claim}`);
    }
  }
  if (/\+\d[\d\s()-]{6,}\d/.test(blocks[0])) {
    failures.push(`Structured data on ${pageName} must not capture phone numbers.`);
  }
}

for (const migration of ["migrations/0002_agent_runs.sql", "migrations/0003_agent_usage_limits.sql"]) {  if (!existsSync(new URL(`../${migration}`, import.meta.url))) {
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

console.log("TinyStudio.io checks passed.");
