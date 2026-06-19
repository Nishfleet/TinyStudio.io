const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; base-uri 'self'; frame-ancestors 'none'; form-action 'self'"
};

const PUBLIC_ASSET_PATHS = new Set([
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/favicon.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/offer.md"
]);

const STALE_PUBLIC_PATHS = new Set([
  "/pipeline-sprint/",
  "/pipeline-sprint/index.html"
]);

const ALLOWED_ORIGINS = new Set([
  "https://tinystudio.io",
  "https://www.tinystudio.io",
  "http://127.0.0.1:8788",
  "http://localhost:8788"
]);
const AGENT_MODELS = [
  "@cf/mistralai/mistral-small-3.1-24b-instruct",
  "@cf/qwen/qwen3-30b-a3b-fp8",
  "@cf/openai/gpt-oss-20b",
  "@cf/meta/llama-3.2-3b-instruct"
];
const MAX_FIELD_LENGTH = 1800;
const MAX_REQUEST_BYTES = 24000;
const SOFT_AGENT_RUNS_PER_EMAIL_PER_DAY = 5;
const MAX_AGENT_RUNS_PER_IP_PER_DAY = 20;

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function jsonResponse(body, init = {}) {
  return withSecurityHeaders(
    Response.json(body, {
      ...init,
      headers: {
        "Cache-Control": "no-store",
        ...(init.headers || {})
      }
    })
  );
}

function cleanHeader(value, limit = 320) {
  return value ? value.slice(0, limit) : "";
}

function cleanField(value, limit = MAX_FIELD_LENGTH) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function readRequestBody(request) {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    try {
      return await readJsonBody(request);
    } catch (error) {
      if (error.message === "request_too_large") throw error;
      return {};
    }
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    const text = await readTextBodyWithLimit(request);
    return Object.fromEntries(new URLSearchParams(text).entries());
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return {};

  const body = {};
  for (const [key, value] of formData.entries()) {
    body[key] = value;
  }
  return body;
}

async function readTextBodyWithLimit(request) {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const chunks = [];
  let size = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      throw new Error("request_too_large");
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new TextDecoder().decode(bytes);
}

async function readJsonBody(request) {
  const text = await readTextBodyWithLimit(request);
  return text ? JSON.parse(text) : {};
}

function requestTooLarge(request) {
  const contentLength = Number(request.headers.get("Content-Length") || 0);
  return Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES;
}

function validateAgentRequest(request) {
  const contentType = request.headers.get("Content-Type") || "";
  const origin = request.headers.get("Origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse({ ok: false, error: "cross_site_blocked" }, { status: 403 });
  }

  if (request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return jsonResponse({ ok: false, error: "cross_site_blocked" }, { status: 403 });
  }

  if (contentType.includes("application/json")) {
    return null;
  }

  if (contentType.includes("application/x-www-form-urlencoded") && origin && ALLOWED_ORIGINS.has(origin)) {
    return null;
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return jsonResponse({ ok: false, error: "same_origin_required" }, { status: 403 });
  }

  return jsonResponse({ ok: false, error: "unsupported_media_type" }, { status: 415 });
}

function wantsHtmlRedirect(request) {
  const accept = request.headers.get("Accept") || "";
  const contentType = request.headers.get("Content-Type") || "";
  return accept.includes("text/html") && !contentType.includes("application/json");
}

function htmlRedirect(url, signal) {
  const nextUrl = new URL(url);
  nextUrl.pathname = "/";
  nextUrl.search = `?signal=${encodeURIComponent(signal)}`;
  return withSecurityHeaders(Response.redirect(nextUrl.toString(), 303));
}

function signupPagePath(request, fallback) {
  const referer = request.headers.get("Referer");

  if (!referer) return fallback;

  try {
    const refererUrl = new URL(referer);
    return refererUrl.pathname || fallback;
  } catch {
    return fallback;
  }
}

async function saveEmailSignup(request, env, url, email, source) {
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO email_signups (email, source, page_path, referer, user_agent, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(email) DO UPDATE SET
       source = excluded.source,
       page_path = excluded.page_path,
       referer = excluded.referer,
       user_agent = excluded.user_agent,
       updated_at = excluded.updated_at`
  )
    .bind(
      email,
      source,
      signupPagePath(request, url.pathname),
      cleanHeader(request.headers.get("Referer"), 500),
      cleanHeader(request.headers.get("User-Agent"), 500),
      now,
      now
    )
    .run();
}

async function signupResponse(request, env, url) {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405 });
  }

  if (!env.DB) {
    return jsonResponse({ ok: false, error: "storage_unavailable" }, { status: 503 });
  }

  if (requestTooLarge(request)) {
    return jsonResponse({ ok: false, error: "request_too_large" }, { status: 413 });
  }

  let body;
  try {
    body = await readRequestBody(request);
  } catch (error) {
    if (error.message === "request_too_large") {
      return jsonResponse({ ok: false, error: "request_too_large" }, { status: 413 });
    }
    body = {};
  }
  const email = normalizeEmail(body.email);

  if (!isValidEmail(email)) {
    if (wantsHtmlRedirect(request)) {
      return htmlRedirect(url, "invalid");
    }
    return jsonResponse({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  await saveEmailSignup(request, env, url, email, "agent-self-serve");

  if (wantsHtmlRedirect(request)) {
    return htmlRedirect(url, "saved");
  }

  return jsonResponse({ ok: true, message: "signal_saved" }, { status: 201 });
}

async function hashIp(request, bucket) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
  if (!ip) return "";

  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${bucket}:${ip}`));
  return [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function incrementUsageCounter(env, bucketKey) {
  const now = new Date().toISOString();
  const result = await env.DB.prepare(
    `INSERT INTO agent_usage_limits (bucket_key, count, first_seen_at, updated_at)
     VALUES (?, 1, ?, ?)
     ON CONFLICT(bucket_key) DO UPDATE SET
       count = count + 1,
       updated_at = excluded.updated_at
     RETURNING count`
  )
    .bind(bucketKey, now, now)
    .first();

  return Number(result?.count || 0);
}

async function enforceAgentLimits(request, env, email, url) {
  if (!env.DB) {
    return { ok: false, response: jsonResponse({ ok: false, error: "storage_unavailable" }, { status: 503 }) };
  }

  try {
    const bucket = new Date().toISOString().slice(0, 10);
    const ipHash = await hashIp(request, bucket);

    if (ipHash) {
      const ipCount = await incrementUsageCounter(env, `ip:${bucket}:${ipHash}`);

      if (ipCount > MAX_AGENT_RUNS_PER_IP_PER_DAY) {
        return { ok: false, response: jsonResponse({ ok: false, error: "daily_ip_limit" }, { status: 429 }) };
      }
    }

    const emailCount = await incrementUsageCounter(env, `email:${bucket}:${email}`);
    if (emailCount > SOFT_AGENT_RUNS_PER_EMAIL_PER_DAY) {
      console.warn("tinystudio_agent_soft_email_limit", JSON.stringify({ emailCount }));
      return { ok: false, response: jsonResponse({ ok: false, error: "daily_email_limit" }, { status: 429 }) };
    }

    await env.DB.prepare(
      `INSERT INTO agent_runs (id, email, source, page_path, ip_hash, user_agent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        crypto.randomUUID(),
        email,
        "agent-self-serve",
        signupPagePath(request, url.pathname),
        ipHash,
        cleanHeader(request.headers.get("User-Agent"), 500),
        new Date().toISOString()
      )
      .run();
  } catch (error) {
    console.warn("tinystudio_agent_storage_failed", error.message || "storage failed");
    return { ok: false, response: jsonResponse({ ok: false, error: "storage_unavailable" }, { status: 503 }) };
  }

  return { ok: true };
}

function agentInput(body) {
  return {
    email: normalizeEmail(body.email),
    business: cleanField(body.business),
    offer: cleanField(body.offer),
    audience: cleanField(body.audience),
    proof: cleanField(body.proof),
    market: cleanField(body.market),
    funnel: cleanField(body.funnel),
    followup: cleanField(body.followup),
    constraints: cleanField(body.constraints)
  };
}

function validateAgentInput(input) {
  if (!isValidEmail(input.email)) return "Add a valid email first.";
  if (!input.business) return "Add the business context first.";
  if (!input.offer) return "Add the high-ticket offer first.";
  if (!input.audience) return "Add the target buyer first.";
  return "";
}

function agentSystemPrompt() {
  return [
    "You are TinyStudio's Pipeline Agent Desk for high-ticket coaches, consultants, service businesses, course sellers, and agencies.",
    "Generate a practical lead-to-call pipeline brief from the user's inputs.",
    "Act like a coordinated team of specialist agents: Offer Agent, Funnel Agent, Creative Agent, Qualification Agent, Follow-Up Agent, CRM Agent, Tracking Agent, and Decision Agent.",
    "Stay proof-safe. Do not promise revenue, ROAS, profit, booked calls, sales lift, or specific close rates.",
    "Do not invent testimonials, client quotes, named outcomes, fake proof, or before/after results.",
    "Do not say the system will deliver a specific number of calls, clients, sales, or revenue.",
    "Do not require a kickoff or sales call to complete the self-serve output; the user may request help separately.",
    "Do not say you will publish ads, change budgets, connect to ad accounts, send messages, or replace the sales team.",
    "Do not imply this app sends emails, WhatsApp messages, DMs, SMS, or CRM updates. It only drafts scripts, maps, and checklists unless the user separately implements them.",
    "Keep Meta/Google actions approval-gated and mention human approval where needed.",
    "For India-first high-ticket validation, you may suggest WhatsApp message ads or lead forms before a landing page and a small INR 500-INR 1,000/day validation range only as a test-plan input, not a profit promise.",
    "Do not calculate ROI. Do not include internal benchmark targets like 30% booking, 80% show-up, or 10%-18% close rate.",
    "Return markdown only. Use short section headings and concrete bullet points."
  ].join("\n");
}

function agentUserPrompt(input) {
  return [
    "Build the self-serve TinyStudio Pipeline Brief for this user.",
    "",
    `Business: ${input.business}`,
    `Offer: ${input.offer}`,
    `Target buyer: ${input.audience || "Not provided"}`,
    `Proof/assets: ${input.proof || "Not provided"}`,
    `Market/channel preference: ${input.market || "Not provided"}`,
    `Current funnel: ${input.funnel || "Not provided"}`,
    `Current follow-up/CRM: ${input.followup || "Not provided"}`,
    `Constraints: ${input.constraints || "Not provided"}`,
    "",
    "Required output sections:",
    "1. Readiness diagnosis",
    "2. Recommended funnel path",
    "3. Audience and pain map",
    "4. First four creative tests",
    "5. Lead qualification form",
    "6. Follow-up and setter flow",
    "7. CRM and tracking checklist",
    "8. 7-day or 15-day decision plan",
    "9. Approval gates and risks"
  ].join("\n");
}

function extractAiText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (typeof result.response === "string") return result.response;
  if (typeof result.result?.response === "string") return result.result.response;
  if (typeof result.text === "string") return result.text;
  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((part) => part.text || part.content || "").join("\n").trim();
  }
  return "";
}

function scrubUnsafeOutput(text) {
  return String(text || "")
    .replace(/guaranteed\s+(revenue|roas|booked calls?|sales|profit)/gi, "projected $1")
    .replace(/fully autonomous ad buying/gi, "approval-gated ad workflow")
    .replace(/I doubled my qualified calls in 30 days\./gi, "Use only a real approved proof clip; do not invent client outcomes.")
    .replace(/delivers\s+X\s+qualified calls per week/gi, "sets up the follow-up and tracking system")
    .replace(/delivers\s+\d+\s+qualified calls per week/gi, "sets up the follow-up and tracking system")
    .replace(/will deliver\s+\d+\s+qualified calls/gi, "will support qualified-call tracking")
    .replace(/will generate\s+\d+\s+qualified calls/gi, "will support qualified-call tracking")
    .replace(/Automated emails and WhatsApp messages/gi, "Drafted email and WhatsApp sequence for human-approved automation")
    .replace(/automate your lead-to-call process/gi, "map your lead-to-call process")
    .replace(/automate your lead-to-call/gi, "map your lead-to-call")
    .replace(/30%\s+booking\s+rate/gi, "booking-rate benchmark")
    .replace(/80%\s+show-up\s+rate/gi, "show-up benchmark")
    .replace(/10%\s*-\s*18%\s+close\s+rate/gi, "close-rate benchmark")
    .slice(0, 12000);
}

function unsafeOutputReasons(text) {
  const value = String(text || "");
  const checks = [
    ["outcome guarantee", /\bguaranteed\s+(revenue|roas|booked calls?|qualified calls?|sales|profit)\b/i],
    ["ranking guarantee", /\b(guaranteed?|guarantees?|promise[sd]?)\s+(seo\s+)?rankings?\b/i],
    ["ai visibility guarantee", /\b(guaranteed?|guarantees?|promise[sd]?)\s+(ai\s+)?visibility\b/i],
    ["conversion lift guarantee", /\b(guaranteed?|guarantees?|promise[sd]?)\s+conversion\s+lift\b/i],
    ["sales lift guarantee", /\b(guaranteed?|guarantees?|promise[sd]?)\s+sales[-\s]?lift\b/i],
    ["10x claim", /\b10x\s+(revenue|sales|profit|roas|booked calls?|qualified calls?)\b/i],
    ["rank number one", /\brank\s*(#\s*1|number\s+one|first)\b/i],
    ["guaranteed calls", /\bguaranteed\s+calls?\b/i],
    ["specific outcome count", /\bwill\s+(deliver|generate|produce)\s+\d+\s+(booked calls?|qualified calls?|clients|sales|leads)\b/i],
    ["autonomous ad buying", /\bfully autonomous ad buying\b/i],
    ["unapproved publishing", /\bpublish\s+(ads?|campaigns?)\s+without\s+approval\b/i],
    ["unapproved spend change", /\bchange\s+(ad\s+)?spend\s+without\s+approval\b/i],
    ["invented proof", /\bi doubled my qualified calls in 30 days\b/i]
  ];

  return checks.filter(([, pattern]) => hasUnsafeMatch(value, pattern)).map(([reason]) => reason);
}

function hasUnsafeMatch(text, pattern) {
  const globalPattern = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`);

  for (const match of text.matchAll(globalPattern)) {
    const prefix = text.slice(Math.max(0, match.index - 48), match.index).toLowerCase();
    if (/\b(no|not|never|without|cannot|can't|doesn't|does not|do not|won't|will not)\b/.test(prefix)) {
      continue;
    }
    return true;
  }

  return false;
}

async function agentAuditResponse(request, env, url) {
  if (request.method === "OPTIONS") {
    return jsonResponse({ ok: true });
  }

  if (request.method !== "POST") {
    return jsonResponse({ ok: false, error: "method_not_allowed" }, { status: 405 });
  }

  if (!env.AI) {
    return jsonResponse({ ok: false, error: "ai_unavailable" }, { status: 503 });
  }

  const requestError = validateAgentRequest(request);
  if (requestError) return requestError;

  if (requestTooLarge(request)) {
    return jsonResponse({ ok: false, error: "request_too_large" }, { status: 413 });
  }

  let body;
  try {
    body = await readRequestBody(request);
  } catch (error) {
    if (error.message === "request_too_large") {
      return jsonResponse({ ok: false, error: "request_too_large" }, { status: 413 });
    }
    body = {};
  }
  const input = agentInput(body);
  const validationError = validateAgentInput(input);

  if (validationError) {
    return jsonResponse({ ok: false, error: "invalid_input", message: validationError }, { status: 400 });
  }

  const limit = await enforceAgentLimits(request, env, input.email, url);
  if (!limit.ok) return limit.response;

  await saveEmailSignup(request, env, url, input.email, "agent-self-serve");

  const messages = [
    { role: "system", content: agentSystemPrompt() },
    { role: "user", content: agentUserPrompt(input) }
  ];

  let brief = "";
  let model = "";
  const modelErrors = [];

  for (const candidateModel of AGENT_MODELS) {
    try {
      const aiResult = await env.AI.run(candidateModel, {
        messages,
        temperature: 0.35,
        max_tokens: 1800
      });
      const rawBrief = extractAiText(aiResult);
      const rawUnsafeReasons = unsafeOutputReasons(rawBrief);
      const candidateBrief = scrubUnsafeOutput(rawBrief);
      const scrubbedUnsafeReasons = unsafeOutputReasons(candidateBrief);
      const unsafeReasons = [...new Set([...rawUnsafeReasons, ...scrubbedUnsafeReasons])];

      if (candidateBrief && unsafeReasons.length === 0) {
        brief = candidateBrief;
        model = candidateModel;
        break;
      }

      modelErrors.push(`${candidateModel}: ${candidateBrief ? `unsafe output (${unsafeReasons.join(", ")})` : "empty output"}`);
    } catch (error) {
      modelErrors.push(`${candidateModel}: ${error.message || "failed"}`);
    }
  }

  if (!brief) {
    console.warn("tinystudio_agent_ai_failed", JSON.stringify({ modelErrors }));
    return jsonResponse({ ok: false, error: "empty_agent_output" }, { status: 502 });
  }

  return jsonResponse({
    ok: true,
    mode: "cloudflare-workers-ai",
    model,
    brief,
    safety: {
      approvalGated: true,
      storesBusinessBrief: false,
      noSpendChanges: true,
      noAutopublishing: true,
      noOutcomeGuarantee: true
    }
  });
}

async function healthResponse(env) {
  const checks = {
    ai: Boolean(env.AI),
    db: Boolean(env.DB),
    agentRunsTable: false,
    usageLimitsTable: false
  };

  if (env.DB) {
    try {
      const tableResult = await env.DB.prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' AND name IN ('agent_runs', 'agent_usage_limits')"
      ).all();
      const tables = new Set((tableResult.results || []).map((row) => row.name));
      checks.agentRunsTable = tables.has("agent_runs");
      checks.usageLimitsTable = tables.has("agent_usage_limits");
    } catch (error) {
      console.warn("tinystudio_health_check_failed", error.message || "health check failed");
    }
  }

  const ok = checks.ai && checks.db && checks.agentRunsTable && checks.usageLimitsTable;

  return jsonResponse(
    {
      ok,
      service: "tinystudio-io-public",
      surface: "agent-desk",
      ai: checks.ai ? "configured" : "missing",
      db: checks.db ? "configured" : "missing",
      checks,
      routes: ["tinystudio.io", "www.tinystudio.io", "app.tinystudio.io", "api.tinystudio.io"]
    },
    { status: ok ? 200 : 503 }
  );
}

function notFoundResponse(error, status = 404) {
  return jsonResponse({ ok: false, error }, { status });
}

function rootRedirect(url) {
  return withSecurityHeaders(Response.redirect(new URL("/", url).toString(), 307));
}

function retiredAppResponse() {
  return withSecurityHeaders(
    new Response(
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>TinyStudio App Retired</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fffdf7;color:#171713;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      main{width:min(720px,calc(100% - 40px));padding:48px;border:1px solid rgba(23,23,19,.14);border-radius:8px;background:#fff}
      h1{margin:0;font-size:clamp(38px,6vw,72px);line-height:1;letter-spacing:0}
      p{color:#57534b;font-size:18px;line-height:1.55}
      a{display:inline-flex;align-items:center;min-height:46px;padding:0 16px;border-radius:8px;background:#171713;color:#fffdf7;font-weight:800;text-decoration:none}
    </style>
  </head>
  <body>
    <main>
      <h1>TinyStudio app retired.</h1>
      <p>The old TinyStudio app has been retired. TinyStudio.io now runs the self-serve Agent Desk from the main domain.</p>
      <a href="https://tinystudio.io/">Go to TinyStudio.io</a>
    </main>
  </body>
</html>`,
      {
        status: 410,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    )
  );
}

function retiredApiResponse() {
  return withSecurityHeaders(
    Response.json(
      {
        ok: false,
        status: "retired",
        message: "The old TinyStudio API has been retired. TinyStudio.io now runs the self-serve Agent Desk from the main domain.",
        publicSite: "https://tinystudio.io/"
      },
      {
        status: 410,
        headers: {
          "Cache-Control": "no-store"
        }
      }
    )
  );
}

function assetRequest(url, request, pathname) {
  const nextUrl = new URL(url);
  nextUrl.pathname = pathname;
  return new Request(nextUrl, request);
}

function isAssetLikePath(pathname) {
  return /\.[a-z0-9]{1,12}$/i.test(pathname);
}

function isHtmlNavigation(request) {
  const accept = request.headers.get("Accept") || "";
  return (request.method === "GET" || request.method === "HEAD") && accept.includes("text/html");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.hostname.toLowerCase();

    if (host === "app.tinystudio.io") {
      return retiredAppResponse();
    }

    if (host === "api.tinystudio.io") {
      return retiredApiResponse();
    }

    if (url.pathname === "/api/signups") {
      return signupResponse(request, env, url);
    }

    if (url.pathname === "/api/agent-audit") {
      return agentAuditResponse(request, env, url);
    }

    if (url.pathname === "/health") {
      return healthResponse(env);
    }

    if (PUBLIC_ASSET_PATHS.has(url.pathname)) {
      const assetResponse = await env.ASSETS.fetch(request);
      return withSecurityHeaders(assetResponse);
    }

    if ((request.method === "GET" || request.method === "HEAD") && STALE_PUBLIC_PATHS.has(url.pathname)) {
      return rootRedirect(url);
    }

    if (url.pathname.startsWith("/api/")) {
      return notFoundResponse("api_not_found");
    }

    if (isAssetLikePath(url.pathname)) {
      return notFoundResponse("asset_not_found");
    }

    if (!isHtmlNavigation(request)) {
      return notFoundResponse("not_found");
    }

    const indexResponse = await env.ASSETS.fetch(assetRequest(url, request, "/index.html"));
    return withSecurityHeaders(indexResponse);
  }
};
