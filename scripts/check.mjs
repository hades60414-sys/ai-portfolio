import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { projects } from "../data/projects.js";

const root = resolve(import.meta.dirname, "..");
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".svg", ".yml"]);
const ignored = new Set([".git", ".playwright-cli", "dist", "node_modules", "output", "tmp"]);
const failures = [];
const productionUrl = "https://mike-zhang-portfolio.hades60414.chatgpt.site/";

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const files = await walk(root);
for (const file of files) {
  if (!textExtensions.has(extname(file))) continue;
  const content = await readFile(file, "utf8");
  const display = relative(root, file);

  if (/\b(?:sk-ant-|AIza|ghp_|github_pat_|nvapi-|gsk_)[A-Za-z0-9_-]{8,}/.test(content)) {
    failures.push(`${display}: looks like a committed secret`);
  }

  if (/\b(?:09\d{2}[- ]?\d{3}[- ]?\d{3}|[A-Za-z0-9._%+-]+@gmail\.com)\b/i.test(content)) {
    failures.push(`${display}: public portfolio contains a private phone number or personal Gmail address`);
  }

  const ips = content.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? [];
  const unsafeIps = ips.filter((ip) => !ip.startsWith("127.") && ip !== "255.255.255.255");
  if (unsafeIps.length) failures.push(`${display}: non-loopback IP literal (${[...new Set(unsafeIps)].join(", ")})`);
}

const indexHtml = await readFile(join(root, "index.html"), "utf8");
for (const requiredMetadata of [
  `<link rel="canonical" href="${productionUrl}" />`,
  `<meta property="og:url" content="${productionUrl}" />`,
  `${productionUrl}assets/og.png`
]) {
  if (!indexHtml.includes(requiredMetadata)) failures.push(`index.html: missing production metadata ${requiredMetadata}`);
}

const robots = await readFile(join(root, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${productionUrl}sitemap.xml`)) failures.push("robots.txt: production sitemap URL is missing");

const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`<loc>${productionUrl}</loc>`)) failures.push("sitemap.xml: production home URL is missing");

const ids = projects.map((project) => project.id);
if (new Set(ids).size !== ids.length) failures.push("Project IDs must be unique");
if (projects.length !== 13) failures.push(`Expected 13 curated projects, found ${projects.length}`);

for (const project of projects) {
  for (const field of [
    "id",
    "title",
    "kicker",
    "category",
    "status",
    "visibility",
    "summary",
    "problem",
    "role",
    "decision",
    "proof",
    "boundary",
    "tags"
  ]) {
    if (!project[field]) failures.push(`${project.id || "unknown"}: missing ${field}`);
  }
  if (project.image) {
    try {
      const info = await stat(join(root, project.image));
      if (!info.isFile()) failures.push(`${project.id}: image is not a file`);
    } catch {
      failures.push(`${project.id}: missing image ${project.image}`);
    }
  }
}

const publicLinks = projects.filter((project) => project.link || project.demo);
if (publicLinks.some((project) => project.visibility !== "public")) {
  failures.push("Only public projects may expose repository or demo links");
}

if (projects.filter((project) => project.featured).length !== 4) {
  failures.push("Expected exactly four featured projects");
}

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`OK: ${projects.length} projects, ${files.length} repository files, no obvious secrets or unsafe IP literals.\n`);
}
