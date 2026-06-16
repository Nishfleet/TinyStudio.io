import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const index = read("public/index.html");
const pipeline = read("public/pipeline-sprint/index.html");
const llms = read("public/llms.txt");
const offer = read("public/offer.md");
const wrangler = read("wrangler.jsonc");

const requiredIndexCopy = [
  "TinyStudio Revenue Leak Sprint",
  "Find the leak before the buyer does.",
  "Unlock the first signal",
  "data-signup-form",
  "The workflow is the product.",
  "Production system",
  "Search trust ledger",
  "Tangible Revenue Leak Sprint + Search Trust Layer",
  "Examples",
  "$1,000",
  "$2,500-$5,000",
  "7 days from payment and completed intake",
  "Refund and guarantee terms",
  "Who records the Loom audits?",
  "hello@tinystudio.io"
];

const requiredPipelineCopy = [
  "TinyStudio Pipeline Sprint",
  "Get a Pipeline Audit",
  "See What Gets Installed",
  "Offer Scorer",
  "Funnel Router",
  "Competitor Watch",
  "Lead Qualification Builder",
  "India Test Plan Generator",
  "Follow-Up Builder",
  "CRM Pipeline Builder",
  "Tracking QA Checklist",
  "Decision Report Generator",
  "No autonomous campaign publishing in the MVP",
  "does not save client data or connect to ad accounts",
  "data-pipeline-intake-form",
  "mailto:hello@tinystudio.io?subject=TinyStudio%20Pipeline%20Audit",
  "enctype=\"text/plain\"",
  "No client-side secrets"
];

const requiredTestPlanCopy = [
  "INR 500-INR 1,000/day",
  "4 first creatives",
  "Script is targeting",
  "WhatsApp or lead form first",
  "Lead-to-call metric ladder",
  "data-pipeline-audit-text",
  "Advanced tracking stays guided"
];

const requiredPublicArtifacts = [
  "does not promise revenue, ROAS, SEO rankings, AI visibility, conversion lift, or sales lift",
  "TinyStudio's operator records Loom audits",
  "does not auto-publish client work",
  "Pipeline Sprint does not guarantee ROAS, revenue, booked calls, or sales lift",
  "Fit guarantee before payment"
];

const forbiddenClaims = [
  "guaranteed revenue",
  "guaranteed ROAS",
  "guaranteed booked calls",
  "guaranteed calls",
  "guaranteed rankings",
  "guaranteed sales",
  "10x revenue",
  "10x sales",
  "rank #1",
  "rank number one",
  "fully autonomous ad buying",
  "30% booking rate",
  "80% show-up rate",
  "10%-18% close rate"
];

const failures = [];

for (const text of requiredIndexCopy) {
  if (!index.includes(text)) failures.push(`Missing required page copy: ${text}`);
}

for (const text of requiredPipelineCopy) {
  if (!pipeline.includes(text)) failures.push(`Missing required Pipeline Sprint copy: ${text}`);
}

for (const text of requiredTestPlanCopy) {
  const testPlanHaystack = `${pipeline}\n${read("public/script.js")}\n${llms}\n${offer}`;
  if (!testPlanHaystack.includes(text)) failures.push(`Missing required test-plan copy: ${text}`);
}

for (const text of requiredPublicArtifacts) {
  if (!index.includes(text) && !pipeline.includes(text) && !llms.includes(text) && !offer.includes(text)) {
    failures.push(`Missing required public artifact copy: ${text}`);
  }
}

for (const claim of forbiddenClaims) {
  const haystack = `${index}\n${pipeline}\n${llms}\n${offer}`.toLowerCase();
  if (haystack.includes(claim.toLowerCase())) {
    failures.push(`Forbidden claim found: ${claim}`);
  }
}

for (const route of ["tinystudio.io", "www.tinystudio.io", "app.tinystudio.io", "api.tinystudio.io"]) {
  if (!wrangler.includes(`"pattern": "${route}/*"`)) {
    failures.push(`Missing Cloudflare route: ${route}`);
  }
}

if (!read("src/worker.js").includes("TinyStudio app retired")) {
  failures.push("Missing app retirement response.");
}

if (!read("src/worker.js").includes("The old TinyStudio API has been retired")) {
  failures.push("Missing API retirement response.");
}

if (!read("src/worker.js").includes("email_signups")) {
  failures.push("Missing email signup storage path.");
}

if (!wrangler.includes("\"database_name\": \"tinystudio_email_signups\"")) {
  failures.push("Missing D1 signup database binding.");
}

if (!wrangler.includes("\"/pipeline-sprint/*\"")) {
  failures.push("Missing worker-first route for Pipeline Sprint security headers.");
}

if (!read("public/script.js").includes("/api/signups")) {
  failures.push("Missing email signup form submission path.");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("TinyStudio.io public site checks passed.");
