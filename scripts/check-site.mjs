import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const index = read("public/index.html");
const llms = read("public/llms.txt");
const offer = read("public/offer.md");
const wrangler = read("wrangler.jsonc");

const requiredIndexCopy = [
  "TinyStudio Revenue Leak Sprint",
  "Find the leak before the buyer does.",
  "Unlock the first signal",
  "data-signup-form",
  "Tangible Revenue Leak Sprint + Search Trust Layer",
  "Examples",
  "$1,000",
  "$2,500-$5,000",
  "7 days from payment and completed intake",
  "Refund and guarantee terms",
  "Who records the Loom audits?",
  "hello@tinystudio.io"
];

const requiredPublicArtifacts = [
  "does not promise revenue, ROAS, SEO rankings, AI visibility, conversion lift, or sales lift",
  "TinyStudio's operator records Loom audits",
  "Fit guarantee before payment"
];

const forbiddenClaims = [
  "guaranteed revenue",
  "guaranteed ROAS",
  "guaranteed rankings",
  "guaranteed sales",
  "10x revenue",
  "10x sales",
  "rank #1",
  "rank number one"
];

const failures = [];

for (const text of requiredIndexCopy) {
  if (!index.includes(text)) failures.push(`Missing required page copy: ${text}`);
}

for (const text of requiredPublicArtifacts) {
  if (!index.includes(text) && !llms.includes(text) && !offer.includes(text)) {
    failures.push(`Missing required public artifact copy: ${text}`);
  }
}

for (const claim of forbiddenClaims) {
  const haystack = `${index}\n${llms}\n${offer}`.toLowerCase();
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

if (!read("public/script.js").includes("/api/signups")) {
  failures.push("Missing email signup form submission path.");
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("TinyStudio.io public site checks passed.");
