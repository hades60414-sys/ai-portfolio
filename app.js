import { grillLines, projects } from "./data/projects.js";

const selectedWork = document.querySelector("[data-selected-work]");
const projectList = document.querySelector("[data-project-list]");
const projectDialog = document.querySelector("[data-project-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");
const grillDialog = document.querySelector("[data-grill-dialog]");
const grillLine = document.querySelector("[data-grill-line]");
const grillFix = document.querySelector("[data-grill-fix]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const dialogs = [projectDialog, grillDialog];

const categoryLabels = {
  ai: "APPLIED AI",
  quant: "QUANT / RISK",
  infra: "DATA INFRA",
  workflow: "WORKFLOW"
};

let grillIndex = 0;
let lastDialogTrigger = null;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function setDialogState() {
  document.documentElement.classList.toggle("has-open-dialog", dialogs.some((dialog) => dialog.open));
}

function openDialog(dialog, trigger) {
  lastDialogTrigger = trigger || document.activeElement;
  if (!dialog.open) dialog.showModal();
  setDialogState();
}

function externalLink(label, href, className) {
  const link = element("a", className, label);
  link.href = href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
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

function marketvaultDiagram() {
  const visual = element("div", "system-diagram");
  visual.setAttribute("role", "img");
  visual.setAttribute("aria-label", "市場資料從資料擷取、可追溯儲存到四個唯讀下游應用的流程");

  const label = element("p", "diagram-label", "ONE SOURCE / FOUR PRODUCTS");
  const flow = element("div", "diagram-flow");
  ["INGEST", "TRACE", "STORE", "SERVE"].forEach((name, index) => {
    const node = element("span", "", name);
    flow.append(node);
    if (index < 3) flow.append(element("i", "", "→"));
  });
  const consumers = element("ul", "diagram-consumers");
  ["ChatStock", "wild_alpha", "Portfolio", "Options"].forEach((name) => {
    consumers.append(element("li", "", name));
  });
  visual.append(label, flow, consumers);
  return visual;
}

function optionsDiagram() {
  const visual = element("div", "decision-diagram");
  visual.setAttribute("role", "img");
  visual.setAttribute("aria-label", "語意由模型解析，價格和風險由程式計算，最後由人決定的流程");

  const stages = [
    ["01", "LLM", "理解市場觀點"],
    ["02", "CODE", "定價 · Greeks · 規則"],
    ["03", "HUMAN", "確認 · 裁決"]
  ];
  stages.forEach(([number, title, copy], index) => {
    const stage = element("div", "decision-stage");
    stage.append(
      element("span", "", number),
      element("strong", "", title),
      element("p", "", copy)
    );
    visual.append(stage);
    if (index < stages.length - 1) visual.append(element("i", "", "→"));
  });
  return visual;
}

function visualFor(project) {
  const figure = element("figure", "case-visual");
  if (project.image) {
    figure.append(projectImage(project, "case-image"));
  } else if (project.id === "marketvault") {
    figure.append(marketvaultDiagram());
  } else {
    figure.append(optionsDiagram());
  }
  return figure;
}

function fact(label, copy) {
  const item = element("div", "case-fact");
  item.append(element("dt", "", label), element("dd", "", copy));
  return item;
}

function actionArea(project, triggerLabel) {
  const actions = element("div", "case-actions");
  if (project.demo) actions.append(externalLink("LIVE DEMO ↗", project.demo, "button button-solid"));
  if (project.link) actions.append(externalLink("GITHUB ↗", project.link, "text-action link-action"));

  const details = element("button", "text-action", triggerLabel || "CASE NOTES ↗");
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
  meta.append(
    element("span", "", String(index + 1).padStart(2, "0") + " / " + project.kicker),
    element("span", "", project.status)
  );

  const title = element("h3", "", project.title);
  const summary = element("p", "case-summary", project.summary);
  const facts = element("dl", "case-facts");
  facts.append(
    fact("THE PROBLEM", project.problem),
    fact("MY ROLE", project.role),
    fact("KEY DECISION", project.decision),
    fact("EVIDENCE", project.proof),
    fact("BOUNDARY", project.boundary)
  );

  const tags = element("ul", "tag-list");
  project.tags.slice(0, 2).forEach((tag) => tags.append(element("li", "", tag)));
  copy.append(meta, title, summary, facts, tags, actionArea(project));
  article.append(visualFor(project), copy);
  return article;
}

function indexRow(project, index) {
  const row = element("article", "project-row");
  const number = element("span", "project-number", String(index + 1).padStart(2, "0"));
  const category = element("span", "project-category", categoryLabels[project.category]);
  const titleWrap = element("div", "project-title");
  titleWrap.append(element("h4", "", project.title), element("p", "", project.summary));
  const status = element("span", "project-status", project.status);
  const open = element("button", "project-open", "OPEN ↗");
  open.type = "button";
  open.dataset.projectId = project.id;
  open.setAttribute("aria-label", "查看 " + project.title + " 案例摘要");
  row.append(number, category, titleWrap, status, open);
  return row;
}

function renderPortfolio() {
  const selected = projects
    .filter((project) => project.featured)
    .sort((left, right) => left.featureRank - right.featureRank);
  selectedWork.replaceChildren(...selected.map(selectedCase));
  projectList.replaceChildren(...projects.map(indexRow));
}

function dialogVisual(project) {
  if (project.visibility === "restricted") return null;
  if (project.image) {
    const media = element("div", "dialog-media");
    media.append(projectImage(project, "dialog-image"));
    return media;
  }
  return null;
}

function showProject(id, trigger) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;

  const fragment = document.createDocumentFragment();
  const media = dialogVisual(project);
  if (media) fragment.append(media);

  const meta = element("div", "dialog-meta");
  meta.append(element("span", "", project.kicker), element("span", "", project.status + " / " + project.year));
  const title = element("h2", "", project.title);
  title.id = "project-dialog-title";
  const summary = element("p", "dialog-summary", project.summary);
  const details = element("dl", "dialog-facts");
  details.append(
    fact("THE PROBLEM", project.problem),
    fact("MY ROLE", project.role),
    fact("KEY DECISION", project.decision),
    fact("EVIDENCE", project.proof),
    fact("BOUNDARY", project.boundary)
  );

  const actions = element("div", "dialog-actions");
  if (project.demo) actions.append(externalLink("OPEN LIVE DEMO ↗", project.demo, "button button-solid"));
  if (project.link) actions.append(externalLink("VIEW GITHUB ↗", project.link, "text-action link-action"));
  if (!project.demo && !project.link) actions.append(element("span", "private-label", "NO PUBLIC REPOSITORY"));

  fragment.append(meta, title, summary, details, actions);
  dialogContent.replaceChildren(fragment);
  openDialog(projectDialog, trigger);
}

function updateGrill() {
  const item = grillLines[grillIndex % grillLines.length];
  grillLine.textContent = "「" + item.line + "」";
  grillFix.textContent = item.fix;
}

function showGrill(trigger) {
  updateGrill();
  openDialog(grillDialog, trigger);
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  primaryNav.classList.remove("is-open");
}

function scrollToCurrentHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
    });
  });
}

document.addEventListener("click", (event) => {
  const projectTrigger = event.target.closest("[data-project-id]");
  if (projectTrigger) showProject(projectTrigger.dataset.projectId, projectTrigger);

  const grillTrigger = event.target.closest("[data-grill-open]");
  if (grillTrigger) showGrill(grillTrigger);

  if (event.target.closest("[data-dialog-close]")) projectDialog.close();
  if (event.target.closest("[data-grill-close]")) grillDialog.close();
  if (event.target.closest("[data-grill-next]")) {
    grillIndex = (grillIndex + 1) % grillLines.length;
    updateGrill();
  }

  if (event.target === projectDialog) projectDialog.close();
  if (event.target === grillDialog) grillDialog.close();
});

menuToggle.addEventListener("click", () => {
  const next = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(next));
  primaryNav.classList.toggle("is-open", next);
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && primaryNav.classList.contains("is-open")) closeMenu();
});

dialogs.forEach((dialog) => {
  dialog.addEventListener("close", () => {
    setDialogState();
    if (lastDialogTrigger && document.contains(lastDialogTrigger)) lastDialogTrigger.focus();
  });
});

window.addEventListener(
  "scroll",
  () => header.classList.toggle("is-scrolled", window.scrollY > 16),
  { passive: true }
);
window.addEventListener("hashchange", scrollToCurrentHash);
window.addEventListener("load", scrollToCurrentHash, { once: true });

document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderPortfolio();
scrollToCurrentHash();
