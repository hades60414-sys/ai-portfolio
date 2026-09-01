import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { grillLines, projects } from "../data/projects.js";

const root = resolve(import.meta.dirname, "..");

test("portfolio has 13 uniquely addressable systems and four selected cases", () => {
  assert.equal(projects.length, 13);
  assert.equal(new Set(projects.map(({ id }) => id)).size, projects.length);

  const featured = projects.filter(({ featured }) => featured);
  assert.equal(featured.length, 4);
  assert.deepEqual(
    featured.sort((left, right) => left.featureRank - right.featureRank).map(({ id }) => id),
    ["edge-validator", "chat-stock-ai", "marketvault", "options-assistant"],
  );

  for (const project of featured) {
    for (const field of ["problem", "role", "decision", "proof", "boundary"]) {
      assert.ok(project[field]?.length > 20, project.id + " missing " + field);
    }
  }
});

test("every portfolio category has work", () => {
  for (const category of ["ai", "quant", "infra", "workflow"]) {
    assert.ok(projects.some((project) => project.category === category), "missing " + category);
  }
});

test("only verified public projects expose repository links", () => {
  const linked = projects.filter(({ link }) => link);
  assert.deepEqual(
    linked.map(({ id }) => id).sort(),
    ["edge-validator", "research-radar"],
  );
  assert.ok(linked.every(({ link }) => link.startsWith("https://github.com/hades60414-sys/")));
  assert.ok(
    projects
      .filter(({ visibility }) => visibility !== "public")
      .every(({ link, demo }) => link === undefined && demo === undefined),
  );
});

test("Edge Validator is the only direct live demo", () => {
  const demos = projects.filter(({ demo }) => demo);
  assert.deepEqual(demos.map(({ id }) => id), ["edge-validator"]);
  assert.equal(demos[0].demo, "https://hades60414-sys.github.io/edge-validator/");
});

test("local media and social preview exist with matching file signatures", async () => {
  const signatures = new Map([
    [".png", "89504e470d0a1a0a"],
    [".jpg", "ffd8ff"],
    [".jpeg", "ffd8ff"],
  ]);
  const media = [...projects.filter(({ image }) => image).map(({ image }) => image), "assets/og.png"];

  await Promise.all(media.map(async (image) => {
    const path = resolve(root, image);
    const signature = signatures.get(extname(path).toLowerCase());
    assert.ok(signature, "unsupported media extension: " + image);
    const bytes = await readFile(path);
    assert.equal(
      bytes.subarray(0, signature.length / 2).toString("hex"),
      signature,
      "mismatched media type: " + image,
    );
  }));
});

test("page has the Mike identity, essential metadata and accessibility hooks", async () => {
  const [html, styles, app] = await Promise.all([
    readFile(resolve(root, "index.html"), "utf8"),
    readFile(resolve(root, "styles.css"), "utf8"),
    readFile(resolve(root, "app.js"), "utf8"),
  ]);

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<title>Mike 張大恒/);
  assert.match(html, /property="og:image" content="assets\/og\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /class="skip-link" href="#main"/);
  assert.match(html, /data-menu-toggle/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-project-dialog aria-labelledby="project-dialog-title"/);
  assert.match(html, /data-grill-dialog aria-labelledby="grill-dialog-title"/);
  assert.match(html, /<noscript>/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(app, /article\.id = "case-" \+ project\.id/);
  assert.doesNotMatch(app, /innerHTML\s*=/);
});

test("modal dialogs lock scrolling and restore focus on close", async () => {
  const [app, styles] = await Promise.all([
    readFile(resolve(root, "app.js"), "utf8"),
    readFile(resolve(root, "styles.css"), "utf8"),
  ]);
  assert.match(app, /classList\.toggle\("has-open-dialog"/);
  assert.match(app, /lastDialogTrigger\.focus\(\)/);
  assert.match(app, /dialog\.addEventListener\("close"/);
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

test("resume material is integrated without public phone or personal email", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /id="about"/);
  assert.match(html, /ABOUT MIKE/);
  assert.match(html, /122/);
  assert.match(html, /NT\$80K\+/);
  assert.match(html, /證券商高級業務員/);
  assert.match(html, /國際聯貸實習生/);
  assert.doesNotMatch(html, /09\d{2}[- ]?\d{3}[- ]?\d{3}/);
  assert.doesNotMatch(html, /[A-Za-z0-9._%+-]+@gmail\.com/i);
  await access(resolve(root, "assets/portrait-zhang-da-heng.png"));
});

test("legacy AI-template identity is removed from the public page", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.doesNotMatch(html, /HADES\.SYSTEMS|PORTFOLIO:\/\/OVERVIEW|class="hero-orbit"/);
  assert.match(html, /MIKE 張大恒/);
});

test("GRILL ME stays short and constructive", () => {
  assert.ok(grillLines.length >= 4);
  assert.ok(grillLines.every(({ line, fix }) => line.length > 10 && fix.length > 10));
});
