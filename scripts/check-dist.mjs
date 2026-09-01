import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const required = [
  "dist/.openai/hosting.json",
  "dist/client/robots.txt",
  "dist/client/sitemap.xml",
  "dist/client/assets/auto-quant.png",
  "dist/client/assets/chat-stock.png",
  "dist/client/assets/edge-validator.png",
  "dist/client/assets/og.png",
  "dist/client/assets/task-gacha.png",
  "dist/client/assets/wild-alpha.png",
  "dist/server/index.js",
  "dist/server/wrangler.json"
];

for (const path of required) {
  const info = await stat(resolve(root, path));
  if (!info.isFile() || info.size === 0) throw new Error(`Missing or empty build artifact: ${path}`);
}

const config = JSON.parse(await readFile(resolve(root, "dist/server/wrangler.json"), "utf8"));
if (config.main !== "index.js" || config.assets?.directory !== "../client" || config.assets?.binding !== "ASSETS") {
  throw new Error("Static worker asset binding is not configured for dist/client");
}
if (config.assets?.not_found_handling !== "none" || config.assets?.run_worker_first !== false) {
  throw new Error("The document shell must fall through to the worker while static assets stay asset-first");
}

try {
  await stat(resolve(root, "dist/client/index.html"));
  throw new Error("index.html must be served by the worker so production security headers cannot be bypassed");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const worker = await readFile(resolve(root, "dist/server/index.js"), "utf8");
for (const requiredContent of ["Mike 張大恒", "Content-Security-Policy", "X-Frame-Options", "indexHtml"]) {
  if (!worker.includes(requiredContent)) throw new Error(`Worker shell is missing ${requiredContent}`);
}

const handler = (await import(pathToFileURL(resolve(root, "dist/server/index.js")).href)).default;
const response = await handler.fetch(new Request("https://portfolio.test/"), {
  ASSETS: { fetch: async () => new Response(null, { status: 404 }) }
});
if (response.status !== 200 || !response.headers.get("Content-Security-Policy")?.includes("frame-ancestors 'none'")) {
  throw new Error("Worker document shell did not return the production security policy");
}
if (!(await response.text()).includes("Mike 張大恒")) throw new Error("Worker document shell is missing the portfolio identity");

process.stdout.write(`OK: ${required.length} required Sites build artifacts.\n`);
