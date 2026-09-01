import { defineConfig } from "vite";
import { sites } from "@openai/sites-vite-plugin";
import { copyFile, mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const projectImageNames = ["auto-quant.png", "chat-stock.png", "edge-validator.png", "task-gacha.png", "wild-alpha.png"];

function staticWorker() {
  return {
    name: "mike-portfolio-static-worker",
    apply: "build",
    async buildStart() {
      await rm(resolve(import.meta.dirname, "dist"), { recursive: true, force: true });
    },
    async closeBundle() {
      const dist = resolve(import.meta.dirname, "dist");
      const client = resolve(dist, "client");
      const server = resolve(dist, "server");
      const htmlPath = resolve(client, "index.html");
      const indexHtml = await readFile(htmlPath, "utf8");
      const source = [
        `const indexHtml = ${JSON.stringify(indexHtml)};`,
        "",
        "const securityHeaders = {",
        "  \"Content-Security-Policy\": \"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'\",",
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
        "    const url = new URL(request.url);",
        "    if (url.pathname === \"/\" || url.pathname === \"/index.html\") {",
        "      if (request.method !== \"GET\" && request.method !== \"HEAD\") {",
        "        return new Response(null, { status: 405, headers: { ...securityHeaders, Allow: \"GET, HEAD\" } });",
        "      }",
        "      return new Response(request.method === \"HEAD\" ? null : indexHtml, {",
        "        status: 200,",
        "        headers: { ...securityHeaders, \"Cache-Control\": \"public, max-age=0, must-revalidate\", \"Content-Type\": \"text/html; charset=UTF-8\" }",
        "      });",
        "    }",
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

      await mkdir(resolve(client, "assets"), { recursive: true });
      await mkdir(server, { recursive: true });
      await unlink(htmlPath);
      await Promise.all([
        ...projectImageNames.map((name) =>
          copyFile(resolve(import.meta.dirname, "assets", name), resolve(client, "assets", name))
        ),
        copyFile(resolve(import.meta.dirname, "assets", "og.png"), resolve(client, "assets", "og.png")),
        copyFile(resolve(import.meta.dirname, "robots.txt"), resolve(client, "robots.txt")),
        copyFile(resolve(import.meta.dirname, "sitemap.xml"), resolve(client, "sitemap.xml")),
        writeFile(resolve(server, "index.js"), source, "utf8"),
        writeFile(
          resolve(server, "wrangler.json"),
          JSON.stringify({
            topLevelName: "mike-zhang-portfolio",
            name: "mike-zhang-portfolio",
            compatibility_date: "2026-05-15",
            compatibility_flags: ["nodejs_compat"],
            main: "index.js",
            rules: [{ type: "ESModule", globs: ["**/*.js", "**/*.mjs"] }],
            no_bundle: true,
            assets: {
              binding: "ASSETS",
              directory: "../client",
              html_handling: "auto-trailing-slash",
              not_found_handling: "none",
              run_worker_first: false
            },
            observability: { enabled: true }
          }),
          "utf8"
        )
      ]);
    }
  };
}

export default defineConfig({
  plugins: [sites(), staticWorker()],
  build: {
    outDir: "dist/client",
    target: "es2022"
  }
});
