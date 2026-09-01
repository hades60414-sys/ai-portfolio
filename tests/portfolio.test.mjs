import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import { projects } from "../data/projects.js";

const root = resolve(import.meta.dirname, "..");

test("portfolio reorganizes 14 systems into four categories and six featured cases", () => {
  assert.equal(projects.length, 14);
  assert.equal(new Set(projects.map(({ id }) => id)).size, projects.length);
  for (const category of ["taishin", "research", "ai-apps", "workflow"]) {
    assert.ok(projects.some((project) => project.category === category), "missing " + category);
  }
  const featured = projects.filter(({ featured }) => featured).sort((a, b) => a.featureRank - b.featureRank);
  assert.deepEqual(featured.map(({ id }) => id), ["tcri-workbench", "anc-alerts", "marketvault", "edge-validator", "chat-stock-ai", "options-assistant"]);
  assert.equal(featured.length, 6);
});

test("Taishin project claims and synthetic demo boundary are present", () => {
  const tcri = projects.find(({ id }) => id === "tcri-workbench");
  const anc = projects.find(({ id }) => id === "anc-alerts");
  const marketvault = projects.find(({ id }) => id === "marketvault");
  assert.equal(tcri.category, "taishin");
  assert.equal(tcri.demo, "demo/tcri/");
  assert.match(tcri.proof, /34 天/);
  assert.match(tcri.proof, /\+7\.38%/);
  assert.match(tcri.proof, /-5\.65%/);
  assert.match(tcri.boundary, /模擬回測、非實盤績效/);
  assert.match(anc.proof, /178/);
  assert.match(marketvault.role, /交易室市場資料需求/);
});

test("only verified repositories and demos are exposed", () => {
  const linked = projects.filter(({ link }) => link);
  assert.deepEqual(linked.map(({ id }) => id).sort(), ["edge-validator", "research-radar"]);
  assert.ok(linked.every(({ link }) => link.startsWith("https://github.com/hades60414-sys/")));
  const externalDemos = projects.filter(({ demo }) => demo?.startsWith("https://"));
  assert.deepEqual(externalDemos.map(({ id }) => id), ["edge-validator"]);
});

test("local media and social preview exist with matching file signatures", async () => {
  const signatures = new Map([[".png", "89504e470d0a1a0a"], [".jpg", "ffd8ff"], [".jpeg", "ffd8ff"]]);
  const media = [...projects.filter(({ image }) => image).map(({ image }) => image), "assets/og.png"];
  await Promise.all(media.map(async (image) => {
    const path = resolve(root, image);
    const signature = signatures.get(extname(path).toLowerCase());
    assert.ok(signature, "unsupported media extension: " + image);
    const bytes = await readFile(path);
    assert.equal(bytes.subarray(0, signature.length / 2).toString("hex"), signature, "mismatched media type: " + image);
  }));
});

test("page metadata, accessible navigation and dialog hooks remain intact", async () => {
  const [html, styles, app] = await Promise.all(["index.html", "styles.css", "app.js"].map((file) => readFile(resolve(root, file), "utf8")));
  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /<title>Mike 張大恒/);
  assert.match(html, /property="og:image" content="https:\/\/mike-zhang-portfolio\.hades60414\.chatgpt\.site\/assets\/og\.png"/);
  assert.match(html, /rel="canonical" href="https:\/\/mike-zhang-portfolio\.hades60414\.chatgpt\.site\/"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /class="skip-link" href="#main"/);
  assert.match(html, /data-menu-toggle/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /data-project-dialog aria-labelledby="project-dialog-title"/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(app, /article\.id = "case-" \+ project\.id/);
  assert.doesNotMatch(app, /innerHTML\s*=/);
});

test("dialogs lock scrolling and restore focus on close", async () => {
  const [app, styles] = await Promise.all(["app.js", "styles.css"].map((file) => readFile(resolve(root, file), "utf8")));
  assert.match(app, /classList\.toggle\("has-open-dialog"/);
  assert.match(app, /lastDialogTrigger\.focus\(\)/);
  assert.match(app, /projectDialog\.addEventListener\("close"/);
  assert.match(styles, /html\.has-open-dialog\s*\{[^}]*overflow:\s*hidden/s);
});

test("public page removes GRILL and keeps Email as a non-displayed placeholder", async () => {
  const [html, app, data] = await Promise.all(["index.html", "app.js", "data/projects.js"].map((file) => readFile(resolve(root, file), "utf8")));
  assert.doesNotMatch(html + app + data, /GRILL/i);
  assert.match(html, /<!-- TODO: Mike 提供公開 Email 後填入 -->/);
  assert.doesNotMatch(html, /09\d{2}[- ]?\d{3}[- ]?\d{3}/);
  assert.doesNotMatch(html, /[A-Za-z0-9._%+-]+@gmail\.com/i);
  await access(resolve(root, "assets/portrait-zhang-da-heng.png"));
});

test("preview server refuses a non-loopback bind", async () => {
  const result = await new Promise((resolveResult, reject) => {
    const child = spawn(process.execPath, [resolve(root, "scripts/serve.mjs")], { env: { ...process.env, HOST: ["0", "0", "0", "0"].join("."), PORT: "4174" }, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => resolveResult({ code, stderr }));
  });
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Refusing non-loopback HOST/);
});
