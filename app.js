import { projects } from "./data/projects.js";

const taishinWork = document.querySelector("[data-taishin-work]");
const personalWork = document.querySelector("[data-personal-work]");
const projectGroups = document.querySelector("[data-project-groups]");
const projectDialog = document.querySelector("[data-project-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const categoryLabels = {
  taishin: "台新實習",
  research: "量化研究與驗證",
  "ai-apps": "AI 應用",
  workflow: "工具與工作流"
};
let lastDialogTrigger = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setDialogState() {
  document.documentElement.classList.toggle("has-open-dialog", projectDialog.open);
}

function openDialog(trigger) {
  lastDialogTrigger = trigger || document.activeElement;
  if (!projectDialog.open) projectDialog.showModal();
  setDialogState();
}

function projectLink(label, href, className) {
  const link = element("a", className, label);
  link.href = href;
  if (/^https?:/.test(href)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  return link;
}

function projectImage(project, className) {
  const image = element("img", className);
  image.src = project.image;
  image.alt = project.imageAlt;
  image.loading = project.featured ? "eager" : "lazy";
  image.width = 1280;
  image.height = 800;
  return image;
}

function systemDiagram(project) {
  const visual = element("div", "system-diagram");
  visual.setAttribute("role", "img");
  visual.setAttribute("aria-label", project.kicker + "的工作流程示意");
  const stages = project.id === "tcri-workbench"
    ? ["歷史資料", "風險分級", "預警訊號"]
    : project.id === "anc-alerts"
      ? ["資料驗證", "預測基線", "預警快照"]
      : project.id === "marketvault"
        ? ["擷取", "追溯", "唯讀使用"]
        : ["模型理解", "程式計算", "人工確認"];
  visual.append(element("p", "diagram-label", project.kicker));
  const flow = element("div", "diagram-flow");
  stages.forEach((stage, index) => {
    flow.append(element("span", "", stage));
    if (index < stages.length - 1) flow.append(element("i", "", "→"));
  });
  visual.append(flow);
  return visual;
}

function visualFor(project) {
  const figure = element("figure", "case-visual");
  figure.append(project.image ? projectImage(project, "case-image") : systemDiagram(project));
  return figure;
}

function fact(label, copy) {
  const item = element("div", "case-fact");
  item.append(element("dt", "", label), element("dd", "", copy));
  return item;
}

// 三句故事：當時的困境 → 我做了什麼 → 現在的結果
function story(project, className) {
  const block = element("div", className);
  block.append(
    element("p", "story-problem", project.problem),
    element("p", "story-role", project.role),
    element("p", "story-proof", project.proof)
  );
  return block;
}

function actionArea(project) {
  const actions = element("div", "case-actions");
  if (project.demo) actions.append(projectLink(project.id === "tcri-workbench" ? "開啟互動 Demo" : "開啟 Demo", project.demo, "button button-solid"));
  if (project.link) actions.append(projectLink("GitHub ↗", project.link, "text-action link-action"));
  const details = element("button", "text-action", "查看案例摘要");
  details.type = "button";
  details.dataset.projectId = project.id;
  actions.append(details);
  return actions;
}

function selectedCase(project, index) {
  const article = element("article", "case-spread");
  article.id = "case-" + project.id;
  if (index % 2 === 1) article.classList.add("case-reverse");
  const copy = element("div", "case-copy");
  const meta = element("div", "case-meta");
  meta.append(element("span", "", project.kicker), element("span", "", project.status));
  copy.append(meta, element("h3", "", project.title), story(project, "case-story"));
  if (project.category === "taishin") copy.append(element("p", "case-boundary", project.boundary));
  copy.append(actionArea(project));
  article.append(visualFor(project), copy);
  return article;
}

function indexRow(project, index) {
  const row = element("article", "project-row");
  const open = project.featured
    ? projectLink("回到案例 ↑", "#case-" + project.id, "project-open")
    : element("button", "project-open", "查看");
  if (project.featured) open.setAttribute("aria-label", "回到上方的 " + project.kicker + " 案例");
  else {
    open.type = "button";
    open.dataset.projectId = project.id;
    open.setAttribute("aria-label", "查看 " + project.kicker + " 案例摘要");
  }
  const title = element("div", "project-title");
  title.append(element("h4", "", project.title), element("p", "", project.kicker));
  row.append(element("span", "project-number", String(index + 1).padStart(2, "0")), title, element("span", "project-status", project.status), open);
  return row;
}

function renderPortfolio() {
  const selected = projects.filter((project) => project.featured).sort((a, b) => a.featureRank - b.featureRank);
  taishinWork.replaceChildren(...selected.filter((project) => project.category === "taishin").map(selectedCase));
  personalWork.replaceChildren(...selected.filter((project) => project.category !== "taishin").map((project, index) => selectedCase(project, index)));
  const groups = Object.keys(categoryLabels).map((category) => {
    const section = element("section", "index-group");
    const heading = element("h3", "", categoryLabels[category]);
    const list = element("div", "project-list");
    const grouped = projects.filter((project) => project.category === category);
    list.replaceChildren(...grouped.map(indexRow));
    section.append(heading, list);
    return section;
  });
  projectGroups.replaceChildren(...groups);
}

function showProject(id, trigger) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;
  const fragment = document.createDocumentFragment();
  const meta = element("div", "dialog-meta");
  meta.append(element("span", "", project.kicker), element("span", "", project.status + " / " + project.year));
  const title = element("h2", "", project.title);
  title.id = "project-dialog-title";
  const details = element("dl", "dialog-facts");
  details.append(fact("關鍵做法", project.decision), fact("公開邊界", project.boundary));
  const tags = element("ul", "tag-list");
  project.tags.forEach((tag) => tags.append(element("li", "", tag)));
  const actions = element("div", "dialog-actions");
  if (project.demo) actions.append(projectLink(project.id === "tcri-workbench" ? "開啟互動 Demo" : "開啟 Demo", project.demo, "button button-solid"));
  if (project.link) actions.append(projectLink("GitHub ↗", project.link, "text-action link-action"));
  if (!project.demo && !project.link) actions.append(element("span", "private-label", "無公開程式庫或資料入口"));
  fragment.append(meta, title, story(project, "dialog-story"), details, tags, actions);
  dialogContent.replaceChildren(fragment);
  openDialog(trigger);
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
}

function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(id);
  if (!target) return;
  requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - header.offsetHeight), behavior: "auto" })));
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-project-id]");
  if (trigger) showProject(trigger.dataset.projectId, trigger);
  if (event.target.closest("[data-dialog-close]") || event.target === projectDialog) projectDialog.close();
});
menuToggle.addEventListener("click", () => {
  const next = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(next));
  primaryNav.classList.toggle("is-open", next);
});
primaryNav.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && primaryNav.classList.contains("is-open")) closeMenu(); });
projectDialog.addEventListener("close", () => {
  setDialogState();
  if (lastDialogTrigger && document.contains(lastDialogTrigger)) lastDialogTrigger.focus();
});
window.addEventListener("scroll", () => header.classList.toggle("is-scrolled", window.scrollY > 16), { passive: true });
window.addEventListener("hashchange", scrollToCurrentHash);
window.addEventListener("load", scrollToCurrentHash, { once: true });
document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderPortfolio();
scrollToCurrentHash();
