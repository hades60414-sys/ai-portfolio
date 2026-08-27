import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";
import { projects } from "../data/projects.js";

const root = resolve(import.meta.dirname, "..");
const textExtensions = new Set([".html", ".css", ".js", ".mjs", ".json", ".md", ".svg", ".yml"]);
const ignored = new Set([".git", "node_modules"]);
const failures = [];

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

  const ips = content.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? [];
  const unsafeIps = ips.filter((ip) => !ip.startsWith("127.") && ip !== "255.255.255.255");
  if (unsafeIps.length) failures.push(`${display}: non-loopback IP literal (${[...new Set(unsafeIps)].join(", ")})`);
}

const ids = projects.map((project) => project.id);
if (new Set(ids).size !== ids.length) failures.push("Project IDs must be unique");
if (projects.length !== 13) failures.push(`Expected 13 curated projects, found ${projects.length}`);

for (const project of projects) {
  for (const field of ["id", "title", "kicker", "category", "summary", "problem", "proof"]) {
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

if (failures.length) {
  process.stderr.write(`${failures.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`OK: ${projects.length} projects, ${files.length} repository files, no obvious secrets or unsafe IP literals.\n`);
}
