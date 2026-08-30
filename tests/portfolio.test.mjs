import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
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

test("local media referenced by projects exists", async () => {
  await Promise.all(projects.filter(({ image }) => image).map(({ image }) => access(resolve(root, image))));
});

test("page has essential accessibility and security hooks", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /class="skip-link"/);
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
