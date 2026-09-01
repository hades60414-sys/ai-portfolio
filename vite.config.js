import { defineConfig } from "vite";
import { sites } from "@openai/sites-vite-plugin";

function staticWorker() {
  return {
    name: "mike-portfolio-static-worker",
    apply: "build",
    generateBundle() {
      const source = [
        "const securityHeaders = {",
        "  \"Content-Security-Policy\": \"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\",",
        "  \"Cross-Origin-Opener-Policy\": \"same-origin\",",
        "  \"Cross-Origin-Resource-Policy\": \"same-origin\",",
        "  \"Permissions-Policy\": \"camera=(), geolocation=(), microphone=()\",",
        "  \"Referrer-Policy\": \"no-referrer\",",
        "  \"X-Content-Type-Options\": \"nosniff\",",
        "  \"X-Frame-Options\": \"DENY\"",
        "};",
        "",
        "export default {",
        "  async fetch(request, env) {",
        "    if (!env.ASSETS || typeof env.ASSETS.fetch !== \"function\") {",
        "      return new Response(\"Static assets unavailable\", { status: 503, headers: securityHeaders });",
        "    }",
        "    const asset = await env.ASSETS.fetch(request);",
        "    const headers = new Headers(asset.headers);",
        "    for (const [name, value] of Object.entries(securityHeaders)) headers.set(name, value);",
        "    return new Response(asset.body, { status: asset.status, statusText: asset.statusText, headers });",
        "  }",
        "};",
        ""
      ].join("\n");

      this.emitFile({
        type: "asset",
        fileName: "server/index.js",
        source
      });
    }
  };
}

export default defineConfig({
  plugins: [sites(), staticWorker()],
  build: {
    target: "es2022"
  }
});
