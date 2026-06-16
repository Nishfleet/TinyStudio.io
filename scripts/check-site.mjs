import { existsSync, readFileSync } from "node:fs";

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

const failures = [];

const requiredIndexCopy = [
  "TinyStudio — Coming Soon",
  "Something is being wired.",
  "TinyStudio is dark while the next public surface is built.",
  "action=\"/api/signups\"",
  "method=\"post\"",
  "data-signup-form",
  "Email for launch access",
  "Leave a signal",
  "Launch access only"
];

const requiredScriptCopy = [
  "/api/signups",
  "Signal saved. We will write when the door opens.",
  "That did not save. Try again in a moment."
];

const requiredWorkerCopy = [
  "PUBLIC_ASSET_PATHS",
  "locked-coming-soon",
  "email_signups",
  "wantsHtmlRedirect",
  "The old TinyStudio API has been retired",
  "TinyStudio app retired"
];

const oldPublicOfferCopy = [
  "Revenue Leak Sprint",
  "Pipeline Sprint",
  "Tangible Revenue Leak Sprint",
  "Search Trust Layer",
  "India High-Ticket Test Plan Generator",
  "$2,500-$5,000",
  "$1,000",
  "INR 500-INR 1,000/day",
  "Get a Pipeline Audit",
  "Offer Scorer",
  "Funnel Router"
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

for (const text of requiredIndexCopy) {
  if (!index.includes(text)) failures.push(`Missing lockdown page copy: ${text}`);
}

for (const text of requiredScriptCopy) {
  if (!script.includes(text)) failures.push(`Missing signup script copy: ${text}`);
}

for (const text of requiredWorkerCopy) {
  if (!worker.includes(text)) failures.push(`Missing worker lock/save behavior: ${text}`);
}

for (const text of oldPublicOfferCopy) {
  const haystack = `${index}\n${script}\n${llms}\n${offer}\n${sitemap}`.toLowerCase();
  if (haystack.includes(text.toLowerCase())) {
    failures.push(`Old public offer copy still exposed: ${text}`);
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

if (!wrangler.includes("\"run_worker_first\": [\"/*\"]")) {
  failures.push("Worker is not configured to run before all public assets.");
}

if (!robots.includes("Disallow: /")) {
  failures.push("Robots file should disallow indexing during lockdown.");
}

if (sitemap.includes("pipeline-sprint") || sitemap.includes("offer.md") || sitemap.includes("llms.txt")) {
  failures.push("Sitemap should only expose the root coming-soon URL.");
}

if (!llms.includes("temporarily closed") || !offer.includes("temporarily closed")) {
  failures.push("Agent-readable files must say the public site is closed.");
}

if (!styles.includes(".lockdown-shell") || !styles.includes(".capture-form")) {
  failures.push("Missing lockdown visual styles.");
}

if (existsSync(new URL("../public/pipeline-sprint/index.html", import.meta.url))) {
  failures.push("Pipeline Sprint page should not remain as a public asset.");
}

if (existsSync(new URL("../public/assets/proof-board.svg", import.meta.url))) {
  failures.push("Old public offer visual asset should not remain exposed.");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("TinyStudio.io lockdown checks passed.");
