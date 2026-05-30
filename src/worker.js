const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; base-uri 'self'; frame-ancestors 'none'; form-action 'self' mailto:"
};

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

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

async function readSignupEmail(request) {
  const contentType = request.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    return normalizeEmail(body.email);
  }

  const formData = await request.formData().catch(() => null);
  return normalizeEmail(formData?.get("email"));
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

  const email = await readSignupEmail(request);

  if (!isValidEmail(email)) {
    return jsonResponse({ ok: false, error: "invalid_email" }, { status: 400 });
  }

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
      "cryptic-landing-page",
      url.pathname,
      cleanHeader(request.headers.get("Referer"), 500),
      cleanHeader(request.headers.get("User-Agent"), 500),
      now,
      now
    )
    .run();

  return jsonResponse({ ok: true, message: "signal_saved" }, { status: 201 });
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
      <p>The old TinyStudio app has been retired as part of the TinyStudio.io overhaul. The public TinyStudio buyer page is now the source of truth.</p>
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
        message: "The old TinyStudio API has been retired as part of the TinyStudio.io overhaul.",
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

    if (url.pathname === "/health") {
      return withSecurityHeaders(
        Response.json({
          ok: true,
          service: "tinystudio-io-public",
          routes: ["tinystudio.io", "www.tinystudio.io", "app.tinystudio.io", "api.tinystudio.io"]
        })
      );
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      return withSecurityHeaders(assetResponse);
    }

    if (!url.pathname.includes(".")) {
      const indexResponse = await env.ASSETS.fetch(assetRequest(url, request, "/index.html"));
      return withSecurityHeaders(indexResponse);
    }

    return withSecurityHeaders(new Response("Not found", { status: 404 }));
  }
};
