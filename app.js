import { projects } from "./data/projects.js?v=flat-artwork-20261118";
import { stories } from "./data/stories.js";

const taishinWork = document.querySelector("[data-taishin-work]");
const personalWork = document.querySelector("[data-personal-work]");
const tradingWork = document.querySelector("[data-trading-work]");
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
  image.decoding = "async";
  image.width = project.imageWidth || 1440;
  image.height = project.imageHeight || 900;
  return image;
}

function systemDiagram(project) {
  const visual = element("div", "system-diagram");
  visual.setAttribute("role", "img");
  const stages = project.id === "tcri-workbench"
    ? ["歷史資料", "風險分級", "預警訊號"]
    : project.id === "anc-alerts"
      ? ["資料驗證", "預測基線", "預警快照"]
      : project.id === "marketvault"
        ? ["擷取", "追溯", "唯讀使用"]
        : project.id === "tcri-cb-strategy"
          ? ["基本擇券", "進場比較", "退出與成本"]
        : project.id === "bln-pricing"
          ? ["輸入條件", "商品試算", "逐項核對"]
          : ["模型理解", "程式計算", "人工確認"];
  visual.setAttribute("aria-label", project.kicker + "的工作流程示意：" + stages.join(" → "));

  // Decorative line art only: no simulated metrics or implied product screens.
  // All styling stays inside this component; existing page layout is unchanged.
  const drawings = {
    validate: [
      ["M18 18h40v52H18z M28 32h20 M28 43h13 M28 54h17"],
      ["M52 51l8 8 18-22", true]
    ],
    baseline: [
      ["M14 18v52h68 M23 53h51", false, "4 5"],
      ["M22 58l11-10 12 4 12-15 10 4 13-16", true]
    ],
    snapshot: [
      ["M16 20h64v50H16z M16 32h64 M27 44h17 M27 57h17 M57 57h12"],
      ["M57 44h12", true]
    ],
    ingest: [
      ["M14 23h20 M14 44h20 M14 65h20 M34 23l17 21-17 21 M51 44h23"],
      ["M65 35l9 9-9 9", true]
    ],
    lineage: [
      ["M28 23c0-9 40-9 40 0s-40 9-40 0 M28 23v40c0 9 40 9 40 0V23 M28 43c0 9 40 9 40 0"],
      ["M40 31v27 M36 54l4 4 4-4", true]
    ],
    readonly: [
      ["M12 44h24 M36 44V20h18 M36 44h18 M36 44v24h18 M64 13h17v14H64z M64 37h17v14H64z M64 61h17v14H64z"],
      ["M36 44h18", true]
    ],
    inputs: [
      ["M16 24h24 M52 24h28 M16 44h43 M71 44h9 M16 64h11 M39 64h41 M40 18h12v12H40z M59 38h12v12H59z M27 58h12v12H27z"],
      ["M40 18h12v12H40z", true]
    ],
    pricing: [
      ["M13 53h70 M23 45v16 M48 45v16 M73 45v16 M23 30h50 M23 30v8 M73 30v8"],
      ["M48 20v20 M43 35l5 5 5-5", true]
    ],
    reconcile: [
      ["M16 21h29 M16 43h29 M16 65h29"],
      ["M57 19l5 5 12-12 M57 41l5 5 12-12 M57 63l5 5 12-12", true]
    ],
    select: [
      ["M16 19h64L57 44v22l-18 7V44z M27 29h42"],
      ["M43 51h10", true]
    ],
    compare: [
      ["M14 65h68 M23 20v34 M46 30v24 M69 15v39", false, "3 5"],
      ["M18 37h10 M41 45h10 M64 26h10 M23 37l23 8 23-19", true]
    ],
    costs: [
      ["M19 17h42v57l-7-4-7 4-7-4-7 4-7-4-7 4z M29 30h20 M29 41h15 M29 52h15"],
      ["M53 56h27 M73 49l7 7-7 7", true]
    ]
  };
  const icons = {
    "tcri-workbench": ["lineage", "baseline", "snapshot"],
    "anc-alerts": ["validate", "baseline", "snapshot"],
    marketvault: ["ingest", "lineage", "readonly"],
    "tcri-cb-strategy": ["select", "compare", "costs"],
    "bln-pricing": ["inputs", "pricing", "reconcile"]
  }[project.id] || ["inputs", "pricing", "reconcile"];
  const svgNS = "http://www.w3.org/2000/svg";
  const makeSvg = (viewBox) => {
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    return svg;
  };

  visual.append(element("p", "diagram-label", project.kicker));
  const flow = element("div", "diagram-flow");
  flow.style.cssText = "display:grid;grid-template-columns:minmax(0,1fr) 18px minmax(0,1fr) 18px minmax(0,1fr);gap:8px;align-items:start;margin-top:48px";
  stages.forEach((stage, index) => {
    const step = element("div", "diagram-step");
    step.style.cssText = "min-width:0;text-align:center";
    const icon = makeSvg("0 0 96 88");
    icon.style.cssText = "display:block;width:100%;max-width:108px;height:88px;margin:0 auto 20px";
    drawings[icons[index]].forEach(([d, accent, dash]) => {
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("d", d);
      path.setAttribute("stroke", accent ? "#e3977d" : "currentColor");
      if (dash) path.setAttribute("stroke-dasharray", dash);
      icon.append(path);
    });
    const number = element("p", "diagram-step-number", String(index + 1).padStart(2, "0"));
    number.style.cssText = "margin:0 0 8px;color:#b9c1c9;font-family:var(--font-mono);font-size:10px;line-height:1;letter-spacing:.12em";
    const label = element("p", "diagram-step-label", stage);
    label.style.cssText = "margin:0;font-size:clamp(11px,1.2vw,14px);line-height:1.6;letter-spacing:.03em;overflow-wrap:anywhere";
    step.append(icon, number, label);
    flow.append(step);
    if (index < stages.length - 1) {
      const connector = makeSvg("0 0 18 16");
      connector.style.cssText = "display:block;width:18px;height:16px;margin-top:36px;color:#91a0b1";
      const arrow = document.createElementNS(svgNS, "path");
      arrow.setAttribute("d", "M1 8h15 M11 3l5 5-5 5");
      connector.append(arrow);
      flow.append(connector);
    }
  });
  visual.append(flow);
  return visual;
}

function visualFor(project) {
  const figure = element("figure", "case-visual");
  if (project.image) figure.classList.add("has-image");
  figure.append(project.image ? projectImage(project, "case-image") : systemDiagram(project));
  figure.append(element("figcaption", "media-caption", project.imageCaption || (project.image ? "專案畫面" : "工作流程示意")));
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
    element("p", "story-role", project.role)
  );
  if (project.highlight) {
    const result = element("section", "story-proof performance-highlight");
    result.setAttribute("aria-label", project.proof);
    result.append(element("p", "performance-title", project.highlight.title), element("p", "performance-period", project.highlight.period));
    const metrics = element("dl", "performance-metrics");
    for (const [label, value] of project.highlight.metrics) {
      const item = element("div", "");
      item.append(element("dt", "", label), element("dd", "", value));
      metrics.append(item);
    }
    result.append(metrics, element("p", "performance-note", project.highlight.note));
    block.append(result);
  } else block.append(element("p", "story-proof", project.proof));
  return block;
}

function actionArea(project) {
  const actions = element("div", "case-actions");
  if (project.demoNotice) actions.append(element("p", "demo-notice", project.demoNotice));
  if (project.demo) actions.append(projectLink(project.id === "tcri-workbench" ? "開啟互動 Demo" : "開啟 Demo", project.demo, "button button-solid"));
  if (project.link) actions.append(projectLink("GitHub ↗", project.link, "text-action link-action"));
  for (const document of project.documents || []) {
    const link = projectLink(document.label + " ↗", document.href, "text-action document-link");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    actions.append(link);
  }
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
  if (project.category === "taishin" || project.area === "trading") copy.append(element("p", "case-boundary", project.boundary));
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
  taishinWork.replaceChildren(...selected.filter((project) => project.category === "taishin" && project.area !== "trading").map(selectedCase));
  tradingWork.replaceChildren(...selected.filter((project) => project.area === "trading").map(selectedCase));
  personalWork.replaceChildren(...selected.filter((project) => project.category !== "taishin" && project.area !== "trading").map(selectedCase));
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
  if (project.demoNotice) actions.append(element("p", "demo-notice", project.demoNotice));
  if (project.demo) actions.append(projectLink(project.id === "tcri-workbench" ? "開啟互動 Demo" : "開啟 Demo", project.demo, "button button-solid"));
  if (project.link) actions.append(projectLink("GitHub ↗", project.link, "text-action link-action"));
  for (const document of project.documents || []) {
    const link = projectLink(document.label + " ↗", document.href, "text-action document-link");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    actions.append(link);
  }
  if (!project.demo && !project.link && !project.documents?.length) actions.append(element("span", "private-label", "無公開程式庫或資料入口"));
  fragment.append(meta, title);
  if (project.image) {
    const media = element("figure", "dialog-media");
    const fullImage = projectLink("", project.image, "image-link");
    fullImage.target = "_blank";
    fullImage.rel = "noopener noreferrer";
    fullImage.setAttribute("aria-label", "開啟 " + project.kicker + " 完整畫面（另開視窗）");
    fullImage.append(projectImage(project, "dialog-image"));
    media.append(fullImage, element("figcaption", "media-caption", (project.imageCaption || "專案畫面") + " · 點圖查看完整畫面 ↗"));
    fragment.append(media);
  }
  // 有詳述者在 dialog 用長文取代三句摘要；沒有的沿用 story(project, "dialog-story")
  const longform = stories[project.id];
  if (longform?.length) {
    const caseStory = element("div", "dialog-longform");
    longform.forEach((text) => caseStory.append(element("p", "", text)));
    fragment.append(caseStory);
  } else {
    fragment.append(story(project, "dialog-story"));
  }
  if (project.details?.length) {
    const research = element("div", "dialog-research");
    project.details.forEach(({ title, text }) => {
      const section = element("section", "");
      section.append(element("h3", "", title), element("p", "", text));
      research.append(section);
    });
    fragment.append(research);
  }
  fragment.append(details, tags, actions);
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
