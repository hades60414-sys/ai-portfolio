import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { grillLines, projects } from "../data/projects.js";

const root = resolve(import.meta.dirname, "..");

test("curated inventory is complete and uniquely addressable", () => {
  assert.equal(projects.length, 13);
  assert.equal(new Set(projects.map(({ id }) => id)).size, projects.length);
  assert.ok(projects.filter(({ featured }) => featured).length >= 4);
});

test("every filter category has work", () => {
  for (const category of ["ai", "quant", "infra", "workflow"]) {
    assert.ok(projects.some((project) => project.category === category), `missing ${category}`);
  }
});

test("private projects do not expose inaccessible repository links", () => {
  const chatStock = projects.find(({ id }) => id === "chat-stock-ai");
  assert.ok(chatStock);
  assert.equal(chatStock.link, undefined);
});

test("repository links are limited to verified public GitHub projects", () => {
  const linkedProjects = projects.filter(({ link }) => link);
  assert.deepEqual(
    linkedProjects.map(({ id }) => id).sort(),
    ["edge-validator", "research-radar"],
  );
  assert.ok(
    linkedProjects.every(({ link }) => link.startsWith("https://github.com/hades60414-sys/")),
  );
});

test("local media referenced by projects exists", async () => {
  const signatures = new Map([
    [".png", "89504e470d0a1a0a"],
    [".jpg", "ffd8ff"],
    [".jpeg", "ffd8ff"],
  ]);

  await Promise.all(projects.filter(({ image }) => image).map(async ({ image }) => {
    const path = resolve(root, image);
    const signature = signatures.get(extname(path).toLowerCase());
    assert.ok(signature, `unsupported media extension: ${image}`);
    const bytes = await readFile(path);
    assert.equal(bytes.subarray(0, signature.length / 2).toString("hex"), signature, `mismatched media type: ${image}`);
  }));
});

test("page has essential accessibility and security hooks", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /class="header-cta"[^>]*aria-label="合作 \/ 聯絡"/);
  assert.match(html, /data-project-dialog aria-labelledby="project-dialog-title"/);
  assert.match(html, /data-grill-dialog aria-labelledby="grill-dialog-title"/);
  assert.match(html, /prefers-reduced-motion|styles\.css/);
});

test("modal dialogs lock background scrolling and release it on close", async () => {
  const [app, styles] = await Promise.all([
    readFile(resolve(root, "app.js"), "utf8"),
    readFile(resolve(root, "styles.css"), "utf8"),
  ]);
  assert.match(app, /classList\.toggle\("has-open-dialog"/);
  assert.match(app, /addEventListener\("close", syncDialogState\)/);
  assert.match(styles, /html\.has-open-dialog\s*\{[^}]*overflow:\s*hidden/s);
});

test("preview server refuses a non-loopback bind", async () => {
  const result = await new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, [resolve(root, "scripts/serve.mjs")], {
      env: { ...process.env, HOST: ["0", "0", "0", "0"].join("."), PORT: "4174" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolveResult({ code, stderr }));
  });

  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Refusing non-loopback HOST/);
});

test("source portfolio is integrated as a privacy-safe profile", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /id="about"/);
  assert.match(html, /HUMAN LAYER/);
  assert.match(html, /122/);
  assert.match(html, /NT\$80K\+/);
  assert.match(html, /證券商高級業務員/);
  assert.doesNotMatch(html, /09\d{2}[- ]?\d{3}[- ]?\d{3}/);
  assert.doesNotMatch(html, /[A-Za-z0-9._%+-]+@gmail\.com/i);
  await access(resolve(root, "assets/portrait-zhang-da-heng.png"));
});

test("grill mode stays constructive", () => {
  assert.ok(grillLines.length >= 4);
  assert.ok(grillLines.every(({ line, fix }) => line.length > 10 && fix.length > 10));
});
