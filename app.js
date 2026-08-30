import { grillLines, projects } from "./data/projects.js";

const featuredGrid = document.querySelector("[data-featured-grid]");
const projectGrid = document.querySelector("[data-project-grid]");
const emptyState = document.querySelector("[data-empty]");
const projectDialog = document.querySelector("[data-project-dialog]");
const dialogContent = document.querySelector("[data-dialog-content]");
const grillDialog = document.querySelector("[data-grill-dialog]");
const grillLine = document.querySelector("[data-grill-line]");
const grillFix = document.querySelector("[data-grill-fix]");
const dialogs = [projectDialog, grillDialog];

let activeFilter = "all";
let grillIndex = 0;

function syncDialogState() {
  document.documentElement.classList.toggle("has-open-dialog", dialogs.some((dialog) => dialog.open));
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
  syncDialogState();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tagList(tags) {
  return tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("");
}

function mediaMarkup(project, eager = false) {
  if (project.image) {
    return `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.imageAlt)}" ${eager ? "" : 'loading="lazy"'} />`;
  }

  return `
    <div class="generated-visual visual-${escapeHtml(project.accent)}" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
      <strong>${escapeHtml(project.id.slice(0, 2).toUpperCase())}</strong>
    </div>`;
}

function featuredCard(project, index) {
  return `
    <article class="featured-card accent-${escapeHtml(project.accent)} reveal" data-category="${escapeHtml(project.category)}">
      <button class="card-hitbox" type="button" data-project-id="${escapeHtml(project.id)}" aria-label="查看 ${escapeHtml(project.title)} 詳情"></button>
      <div class="featured-media">${mediaMarkup(project, index < 2)}</div>
      <div class="featured-body">
        <div class="card-meta"><span>0${index + 1} / FEATURED</span><span>${escapeHtml(project.year)}</span></div>
        <p class="card-kicker">${escapeHtml(project.kicker)}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.summary)}</p>
        <ul class="tag-list">${tagList(project.tags)}</ul>
        <span class="card-arrow" aria-hidden="true">↗</span>
      </div>
    </article>`;
}

function projectCard(project) {
  return `
    <article class="project-card accent-${escapeHtml(project.accent)} reveal" data-category="${escapeHtml(project.category)}">
      <button class="card-hitbox" type="button" data-project-id="${escapeHtml(project.id)}" aria-label="查看 ${escapeHtml(project.title)} 詳情"></button>
      <div class="small-visual">${mediaMarkup(project)}</div>
      <div class="card-meta"><span>${escapeHtml(project.status)}</span><span>${escapeHtml(project.year)}</span></div>
      <p class="card-kicker">${escapeHtml(project.kicker)}</p>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.summary)}</p>
      <ul class="tag-list">${tagList(project.tags)}</ul>
      <span class="card-arrow" aria-hidden="true">↗</span>
    </article>`;
}

function renderProjects() {
  const visible = projects.filter((project) => activeFilter === "all" || project.category === activeFilter);
  const featured = visible.filter((project) => project.featured);
  const remaining = visible.filter((project) => !project.featured);

  featuredGrid.innerHTML = featured.map(featuredCard).join("");
  projectGrid.innerHTML = remaining.map(projectCard).join("");
  emptyState.hidden = visible.length !== 0;
}

function showProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;

  const link = project.link
    ? `<a class="button button-primary" href="${escapeHtml(project.link)}" target="_blank" rel="noreferrer">查看 GitHub ↗</a>`
    : `<span class="local-label">LOCAL / PRIVATE REPOSITORY</span>`;

  dialogContent.innerHTML = `
    <div class="dialog-media accent-${escapeHtml(project.accent)}">${mediaMarkup(project, true)}</div>
    <div class="dialog-meta"><span>${escapeHtml(project.kicker)}</span><span>${escapeHtml(project.status)} · ${escapeHtml(project.year)}</span></div>
    <h2>${escapeHtml(project.title)}</h2>
    <p class="dialog-summary">${escapeHtml(project.summary)}</p>
    <div class="dialog-columns">
      <div><small>THE PROBLEM</small><p>${escapeHtml(project.problem)}</p></div>
      <div><small>THE EVIDENCE</small><p>${escapeHtml(project.proof)}</p></div>
    </div>
    <ul class="tag-list">${tagList(project.tags)}</ul>
    <div class="dialog-action">${link}</div>`;

  openDialog(projectDialog);
}

function showGrill() {
  const item = grillLines[grillIndex % grillLines.length];
  grillLine.textContent = `「${item.line}」`;
  grillFix.textContent = item.fix;
  openDialog(grillDialog);
}

document.addEventListener("click", (event) => {
  const projectTrigger = event.target.closest("[data-project-id]");
  if (projectTrigger) showProject(projectTrigger.dataset.projectId);

  const filter = event.target.closest("[data-filter]");
  if (filter) {
    activeFilter = filter.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((button) => {
      const active = button === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    renderProjects();
  }

  if (event.target.closest("[data-dialog-close]")) projectDialog.close();
  if (event.target.closest("[data-grill-open]")) showGrill();
  if (event.target.closest("[data-grill-close]")) grillDialog.close();
  if (event.target.closest("[data-grill-next]")) {
    grillIndex = (grillIndex + 1) % grillLines.length;
    showGrill();
  }
});

dialogs.forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener("close", syncDialogState);
});

const header = document.querySelector("[data-header]");
window.addEventListener(
  "scroll",
  () => header.classList.toggle("is-scrolled", window.scrollY > 24),
  { passive: true }
);

document.querySelector("[data-year]").textContent = new Date().getFullYear();
renderProjects();
