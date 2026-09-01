import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const required = [
  "dist/.openai/hosting.json",
  "dist/client/_headers",
  "dist/client/index.html",
  "dist/client/robots.txt",
  "dist/client/sitemap.xml",
  "dist/client/assets/og.png",
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

const headers = await readFile(resolve(root, "dist/client/_headers"), "utf8");
for (const requiredHeader of ["Content-Security-Policy", "X-Frame-Options: DENY", "X-Content-Type-Options: nosniff"]) {
  if (!headers.includes(requiredHeader)) throw new Error(`Static header policy is missing ${requiredHeader}`);
}

process.stdout.write(`OK: ${required.length} required Sites build artifacts.\n`);
