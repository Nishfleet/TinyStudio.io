const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self' mailto:"
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

function assetRequest(url, request, pathname) {
  const nextUrl = new URL(url);
  nextUrl.pathname = pathname;
  return new Request(nextUrl, request);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return withSecurityHeaders(
        Response.json({
          ok: true,
          service: "tinystudio-io-public",
          routes: ["tinystudio.io", "www.tinystudio.io"]
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
