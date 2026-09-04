(() => {
  'use strict';
  const data = window.TCRI_DATA;
  const $ = id => document.getElementById(id);
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
  const gradeToken = value => value >= 10 ? 'D' : value;
  const gradeClass = value => value >= 10 ? 'gD' : `g${value}`;
  const scoreText = value => value === null || value === undefined ? '—' : Number(value).toFixed(2);
  const state = { period: data.quarters.length - 1, q: '', move: '', band: '', gmin: 0, gmax: 0, size: 50, page: 1, sort: 'risk', dir: 'desc', sortExplicit: false };

  /* ---- 每季預測視圖：方向＝試算 vs 現行；分數/分層/名次同季計算 ---- */
  const BAND_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1, '': 0 };
  const viewCache = {};
  const buildViews = index => {
    if (viewCache[index]) return viewCache[index];
    const latestIndex = data.quarters.length - 1;
    const rows = data.companies.map(company => {
      const point = company.series[index];
      const isLatest = index === latestIndex;
      const prevGrade = point.grade;
      const predGrade = isLatest ? company.series[latestIndex].modelGrade : point.modelGrade;
      const delta = predGrade - prevGrade;
      const direction = isLatest ? company.prediction.direction : (delta > 0 ? 'DOWN' : delta < 0 ? 'UP' : 'FLAT');
      const scoreDown = point.scoreDown, scoreUp = point.scoreUp;
      const alertScore = direction === 'DOWN' ? scoreDown : direction === 'UP' ? scoreUp : Math.max(scoreDown, scoreUp);
      const band = isLatest ? company.prediction.band
        : (direction === 'DOWN' && alertScore >= .7 ? 'HIGH' : direction !== 'FLAT' && alertScore >= .45 ? 'MEDIUM' : direction !== 'FLAT' ? 'LOW' : '');
      const rated = isLatest && company.prediction.rated;
      const reason = direction === 'FLAT' ? '' : (isLatest ? company.reason : `試算${gradeToken(predGrade)} vs 現評${gradeToken(prevGrade)}`);
      return { company, point, prevGrade, predGrade, delta, direction, scoreDown, scoreUp, alertScore, band, rated, reason };
    });
    const downOrder = [...rows].sort((a, b) => b.scoreDown - a.scoreDown);
    const upOrder = [...rows].sort((a, b) => b.scoreUp - a.scoreUp);
    downOrder.forEach((row, i) => { row.rankDown = i + 1; });
    upOrder.forEach((row, i) => { row.rankUp = i + 1; });
    viewCache[index] = rows;
    return rows;
  };
  const stats = rows => {
    const out = { DOWN: 0, UP: 0, FLAT: 0, HIGH: 0, MEDIUM: 0, LOW: 0, NOBAND: 0, NA: 0, total: rows.length };
    rows.forEach(row => { out[row.direction]++; if (row.band) out[row.band]++; else out.NOBAND++; });
    return out;
  };

  /* ---- 展開列：評等走勢（酒紅實線 vs 灰藍虛線）＋驅動明細 ---- */
  const gradeChart = (company, index) => {
    const points = company.series.slice(Math.max(0, index + 1 - 12), index + 1), n = points.length;
    const w = 560, h = 168, l = 30, r = 74, t = 12, b = 26, pw = w - l - r, ph = h - t - b;
    const x = i => l + (n === 1 ? pw / 2 : pw * i / (n - 1));
    const y = v => t + (v - 1) / 9 * ph;
    const seriesSvg = (field, color, dash) =>
      `<polyline points="${points.map((p, i) => `${x(i).toFixed(1)},${y(p[field]).toFixed(1)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` +
      points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p[field]).toFixed(1)}" r="2.4" fill="${color}"/>`).join('');
    const formal = points.at(-1).grade, model = points.at(-1).modelGrade, lx = l + pw + 6;
    const endLabels = formal === model
      ? `<text x="${lx}" y="${(y(formal) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#8d1730">現評=試算${gradeToken(formal)}</text>`
      : `<text x="${lx}" y="${(y(formal) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#8d1730">現評${gradeToken(formal)}</text><text x="${lx}" y="${(y(model) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#64748b">試算${gradeToken(model)}</text>`;
    const grid = [1, 4, 7, 10].map(g => `<line x1="${l}" y1="${y(g).toFixed(1)}" x2="${l + pw}" y2="${y(g).toFixed(1)}" stroke="#e4ded9" stroke-width="1"/><text x="${l - 6}" y="${(y(g) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#8a817c">${g === 10 ? 'D' : g}</text>`).join('');
    return `<svg class="grade-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(company.name)} 正式評等與模型等級近 ${n} 季走勢"><title>正式評等實線；模型試算虛線</title>${grid}${seriesSvg('grade', '#8d1730', '')}${seriesSvg('modelGrade', '#64748b', '5 4')}${endLabels}<text x="${l}" y="${h - 8}" font-size="10" fill="#8a817c">${points[0].period}</text><text x="${l + pw}" y="${h - 8}" text-anchor="end" font-size="10" fill="#8a817c">${points.at(-1).period}</text></svg>`;
  };
  const sparkline = (company, key, label, index) => {
    const points = company.series.slice(Math.max(0, index + 1 - 12), index + 1);
    const values = points.map(p => p[key]), min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
    const w = 132, h = 32, pad = 4;
    const x = i => pad + (w - pad * 2) * i / (points.length - 1), y = v => h - pad - (h - pad * 2) * (v - min) / span;
    const last = values.length - 1;
    return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}近 ${points.length} 季走勢"><title>${esc(label)}近 ${points.length} 季走勢</title><polyline points="${values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ')}" fill="none" stroke="#64748b" stroke-width="1.6"/><circle cx="${x(last).toFixed(1)}" cy="${y(values[last]).toFixed(1)}" r="2.4" fill="#8d1730"/></svg>`;
  };
  const valueText = (value, unit) => `${Number(value).toFixed(unit === '分' ? 0 : 1)}${unit}`;
  const driversHtml = (row, index) => {
    const company = row.company, prior = company.series[Math.max(0, index - 1)], point = row.company.series[index];
    if (!company.drivers?.length) {
      if (row.direction === 'FLAT') return `<p class="detail-text muted">持平：兩個方向都未過門檻${row.band === '' ? '' : `，但分數落在 ${row.band} 觀察分層`}。</p>`;
      return `<p class="detail-text muted">${row.predGrade !== row.prevGrade ? '本列主要訊號為試算等級與現評背離（見左側評等走勢），無其他財報驅動指標。' : '無單一顯著財報驅動；模型分數由多項小幅訊號組成（見左側評等走勢與分數名次）。'}</p>`;
    }
    const list = company.drivers.map(([key, label, unit]) => {
      const delta = Number(point[key]) - Number(prior[key]);
      return `<div class="driver-row"><span class="driver-name">${label}</span><span class="driver-vals">${valueText(prior[key], '')} → <strong>${valueText(point[key], '')}</strong>${unit}<em class="driver-delta">${delta > 0 ? '+' : ''}${valueText(delta, '')}</em></span>${sparkline(company, key, label, index)}</div>`;
    }).join('');
    return `<div class="driver-list">${list}</div><p class="detail-text muted">基準季＝${prior.period}；數值為合成財報原值，走勢為近 12 季。</p>`;
  };
  const detailRowHtml = (row, index) => {
    const c = row.company;
    return `<tr class="detail-row" id="detail-${c.id}" hidden><td colspan="7"><div class="detail-shell"><div class="detail-chart-col"><h4 class="detail-title">評等走勢（近 12 季）<a class="detail-jump" href="platform.html?q=${encodeURIComponent(c.id)}" target="_blank" rel="noopener" title="到 TCRI平台 檢視 ${esc(c.name)} 的完整歷史與財務指標（新分頁）">在 TCRI平台 開啟 ${c.id} →</a></h4>${gradeChart(c, index)}<p class="detail-text muted">實線＝正式評等（合成，依評等發布月份歸季）；虛線＝本系統試算等級。兩線分岔＝試算與現評背離。</p><div class="detail-metrics"><div class="detail-metric" title="同季全體公司依該方向分數排序的名次"><span>降級分數 / 名次</span><strong>${scoreText(row.scoreDown)} ・ #${row.rankDown}</strong></div><div class="detail-metric" title="同季全體公司依該方向分數排序的名次"><span>升級分數 / 名次</span><strong>${scoreText(row.scoreUp)} ・ #${row.rankUp}</strong></div><div class="detail-metric"><span>訊號季</span><strong>${data.quarters[index]}</strong></div></div></div><div><h4 class="detail-title">${row.direction === 'FLAT' ? '主要觀察指標' : '主要驅動明細'}</h4>${driversHtml(row, index)}<p class="detail-text muted">模型推估之主要驅動因子，非官方原因。分層 ${row.band === '' ? '—' : row.band}：HIGH／MEDIUM 是歷史校準的固定分數線；LOW 屬本季名次、會隨新財報變動。</p></div></div></td></tr>`;
  };

  /* ---- 主表 ---- */
  const dirView = value => value === 'DOWN' ? { text: '↓ 降級', badge: 'badge-bad', row: 'is-down' } : value === 'UP' ? { text: '↑ 升級', badge: 'badge-good', row: 'is-up' } : { text: '→ 維持', badge: 'badge-neutral', row: 'is-flat' };
  const pill = (grade, title) => `<span class="grade-pill ${gradeClass(grade)}" title="${esc(title)}">${gradeToken(grade)}</span>`;
  const predictedPill = (grade, title) => `<span class="grade-pill predicted ${gradeClass(grade)}" title="${esc(title)}">${gradeToken(grade)}</span>`;
  const bandTag = band => band === '' ? '<span class="dash">—</span>' : `<span class="band-tag is-${band.toLowerCase()}">${band}</span>`;
  const rowHtml = (row, index) => {
    const c = row.company, view = dirView(row.direction);
    const pct = (Math.max(0, Math.min(1, row.alertScore)) * 100).toFixed(1);
    const tone = row.direction === 'DOWN' ? '' : row.direction === 'UP' ? ' is-up' : ' is-flat';
    const mark = row.direction === 'FLAT' ? ' ↕' : '';
    const scoreTitle = row.direction === 'DOWN' ? '降級分數 score_down（未校準排序分數，非機率）' : row.direction === 'UP' ? '升級分數 score_up（未校準排序分數，非機率）' : '維持：兩個方向都未過門檻，顯示降級／升級較高者。未校準排序分數，非機率。';
    const deltaNote = row.delta === 0 ? '等級不變' : (row.delta > 0 ? `+${row.delta} 級` : `${row.delta} 級`);
    const predCell = row.rated
      ? `${pill(c.prediction.ratedGrade, `已正式評為 ${gradeToken(c.prediction.ratedGrade)}；模型當時預測 ${gradeToken(row.predGrade)}。季度切換後此值將成為現行。`)}<span class="upd-flag" title="已正式評等（此欄顯示實際結果，非預測）">已評</span>`
      : predictedPill(row.predGrade, '模型試算等級（與 TCRI平台 門檻等級的試算同值）');
    return `<tr class="company-row ${view.row}">
      <td class="sticky-company"><button class="stock-button" type="button" aria-expanded="false" aria-controls="detail-${c.id}" data-target="detail-${c.id}">${esc(c.name)}</button><span class="stock-code">${c.id}</span></td>
      <td>${esc(c.industry)}</td>
      <td class="mid"><span class="grade-flow ${view.row}">${pill(row.prevGrade, '現行正式等級（本次預測基準；季度切換後才輪替）')}<span class="grade-arrow">→</span>${predCell}</span></td>
      <td class="mid"><span class="badge ${view.badge}" title="${deltaNote}">${view.text}</span></td>
      <td class="score-cell" title="${scoreTitle}"><span class="score-line"><span class="score-num is-dim stock-code">${scoreText(row.alertScore)}${mark}</span><span class="metric-track${tone}"><span style="width:${pct}%"></span></span></span></td>
      <td class="mid">${bandTag(row.band)}</td>
      <td class="reason-cell">${row.reason === '' ? '<span class="dash">—</span>' : esc(row.reason)}</td>
    </tr>${detailRowHtml(row, index)}`;
  };

  /* ---- 排序 ---- */
  const sortValue = row => ({
    stock: row.company.id, industry: row.company.industry, prev_grade: row.prevGrade,
    delta: { DOWN: 2, UP: 1, FLAT: 0 }[row.direction], alert_score: row.alertScore,
    risk: ({ DOWN: 2, UP: 1, FLAT: 0 }[row.direction] * 100) + BAND_RANK[row.band] * 10 + row.alertScore
  })[state.sort];
  const applySort = rows => rows.sort((a, b) => {
    const left = sortValue(a), right = sortValue(b);
    const cmp = typeof left === 'string' ? left.localeCompare(right, 'zh-Hant') : left - right;
    return (cmp === 0 ? a.company.id.localeCompare(b.company.id) : cmp) * (state.dir === 'asc' ? 1 : -1);
  });

  /* ---- render ---- */
  const render = () => {
    const index = state.period, views = buildViews(index), all = stats(views);
    $('predict-period').textContent = data.quarters[index];
    /* 摘要四格 */
    const completeCount = data.companies.filter(c => c.complete).length;
    const compPct = (completeCount / data.companies.length * 100);
    $('predict-summary').innerHTML =
      `<div class="metric"><span class="metric-label">優先複核 HIGH</span><strong class="metric-value is-hero">${all.HIGH}</strong><span class="metric-note is-unknown">今天先看這幾家</span></div>` +
      `<div class="metric"><span class="metric-label">本季家數</span><strong class="metric-value">${all.total}</strong></div>` +
      `<div class="metric" title="歷史回測：過去達 HIGH 門檻（降級方向）的公司，實際被調降的比例（合成演示固定值）。"><span class="metric-label">HIGH 分層・歷史命中率</span><strong class="metric-value is-quiet">30%</strong><span class="metric-note is-unknown">歷史回測，非本季</span></div>` +
      `<div class="metric"><span class="metric-label">資料完整度</span><strong class="metric-value">${compPct.toFixed(1)}%</strong><span class="metric-note">大致出完</span><span class="metric-track is-ok"><span style="width:${compPct.toFixed(1)}%"></span></span></div>`;
    /* 側欄導覽（不受關鍵字/區間影響） */
    const bandNav = [['HIGH', 'HIGH 優先複核', all.HIGH], ['MEDIUM', 'MEDIUM 次順位', all.MEDIUM], ['LOW', 'LOW 本季名次', all.LOW]];
    $('band-nav').innerHTML = bandNav.map(([key, label, count]) => {
      const active = state.band === key;
      return `<button class="movement-card${active ? ' is-active' : ''}" type="button" data-band="${key}" title="${active ? `目前只看 ${key}，再點一下取消篩選` : `點一下只看 ${key} 分層`}"><span>${active ? '✓ ' : ''}${label}</span><strong>${count}</strong></button>`;
    }).join('') + `<div class="movement-card is-static" title="未落入任何分層，不列入優先複核"><span>無分層</span><strong>${all.NOBAND}</strong></div>`;
    const moveNav = [['DOWN', '↓ 降級', all.DOWN], ['UP', '↑ 升級', all.UP], ['FLAT', '→ 維持', all.FLAT]];
    $('move-nav').innerHTML = moveNav.map(([key, label, count]) => {
      const active = state.move === key;
      return `<button class="movement-card${active ? ' is-active' : ''}" type="button" data-move="${key}" title="${active ? '再點一下取消篩選' : '點一下只看' + label}"><span>${active ? '✓ ' : ''}${label}</span><strong>${count}</strong></button>`;
    }).join('') + `<div class="movement-card is-static" title="方向無法判定"><span>— 未知</span><strong>${all.NA}</strong></div>`;
    $('side-clear').hidden = state.band === '' && state.move === '';
    /* 篩選＋排序＋分頁 */
    let rows = views.filter(row =>
      (!state.q || `${row.company.id} ${row.company.name} ${row.company.industry}`.toLocaleLowerCase('zh-Hant').includes(state.q)) &&
      (!state.move || row.direction === state.move) &&
      (!state.band || row.band === state.band) &&
      (!state.gmin || row.prevGrade >= state.gmin) &&
      (!state.gmax || row.prevGrade <= state.gmax));
    rows = applySort(rows);
    const totalPages = Math.max(1, Math.ceil(rows.length / state.size));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.size, pageRows = rows.slice(start, start + state.size);
    const hasFilter = state.q || state.move || state.band || state.gmin || state.gmax;
    const sortText = state.sortExplicit ? { stock: '公司', industry: '產業', prev_grade: '現行等級', delta: '方向', alert_score: '風險分數', risk: '風險優先' }[state.sort] + (state.dir === 'asc' ? '（升冪）' : '（降冪）') : '風險優先（預設）';
    $('list-meta').innerHTML = `第 ${rows.length === 0 ? 0 : start + 1}–${start + pageRows.length} 筆，共 ${rows.length} 筆${hasFilter ? '（已篩選）' : ''} <span class="badge badge-neutral" title="預設排序：降級優先 → 分層 → 該方向分數由高到低">排序：${sortText}</span>`;
    $('predict-rows').innerHTML = pageRows.length ? pageRows.map(row => rowHtml(row, index)).join('') : '<tr><td colspan="7" class="empty-state">沒有符合條件的資料。請放寬篩選或改選其他季別。</td></tr>';
    $('page-meta').textContent = `第 ${state.page} / ${totalPages} 頁・預設排序：降級優先 → 分層（HIGH→MEDIUM→LOW→無）→ 該方向分數由高到低`;
    $('prev-page').disabled = state.page <= 1;
    $('next-page').disabled = state.page >= totalPages;
    document.querySelectorAll('[data-sort]').forEach(button => button.classList.toggle('is-active', button.dataset.sort === state.sort));
    $('foot-line').textContent = `來源 合成資料（generate.mjs 固定 seed）・產生 ${data.generatedAt}・載入 ${data.companies.length} 列・SYNTHETIC DEMO・模型推估，非官方評等，僅供人工複核。`;
    fitDetailShells();
    /* 匯出 */
    $('p-export').onclick = () => {
      const text = [['代號', '公司', '產業', '現行', '預測', '方向', '分層', '風險分數'], ...rows.map(row => [row.company.id, row.company.name, row.company.industry, gradeToken(row.prevGrade), gradeToken(row.predGrade), row.direction, row.band || '—', scoreText(row.alertScore)])].map(record => record.map(v => `"${v}"`).join(',')).join('\r\n');
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob(['﻿' + text], { type: 'text/csv' }));
      link.download = `TCRI_prediction_${data.quarters[index].replace(' ', '')}_synthetic.csv`;
      link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 500);
    };
  };

  /* ---- 明細寬度綁表格可視寬（原版 fitDetailShells） ---- */
  const tableWrap = document.querySelector('.table-wrap');
  function fitDetailShells() {
    if (!tableWrap) return;
    const width = tableWrap.clientWidth;
    document.querySelectorAll('.detail-shell').forEach(shell => { shell.style.width = width + 'px'; });
  }
  window.addEventListener('resize', fitDetailShells);

  /* ---- 事件 ---- */
  $('f-period').innerHTML = data.quarters.map((q, i) => `<option value="${i}"${i === data.quarters.length - 1 ? ' selected' : ''}>${q} · ${data.companies.length} 家</option>`).join('');
  $('f-gmin').innerHTML = '<option value="">≥ 不限</option>' + Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">≥ ${gradeToken(i + 1)}</option>`).join('');
  $('f-gmax').innerHTML = '<option value="">≤ 不限</option>' + Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">≤ ${gradeToken(i + 1)}</option>`).join('');
  $('generated-at').textContent = data.generatedAt;
  const readFilters = () => {
    state.period = Number($('f-period').value);
    state.q = $('f-q').value.trim().toLocaleLowerCase('zh-Hant');
    state.move = $('f-move').value; state.band = $('f-band').value;
    state.gmin = Number($('f-gmin').value) || 0; state.gmax = Number($('f-gmax').value) || 0;
    state.size = Number($('f-size').value); state.page = 1;
  };
  $('predict-filters').addEventListener('submit', event => { event.preventDefault(); readFilters(); render(); });
  ['f-period', 'f-move', 'f-band', 'f-gmin', 'f-gmax', 'f-size'].forEach(id => $(id).addEventListener('change', () => { readFilters(); render(); }));
  $('f-q').addEventListener('input', () => { readFilters(); render(); });
  $('f-clear').onclick = () => { $('f-q').value = ''; $('f-move').value = ''; $('f-band').value = ''; $('f-gmin').value = ''; $('f-gmax').value = ''; readFilters(); render(); };
  $('side-clear').onclick = () => { $('f-move').value = ''; $('f-band').value = ''; readFilters(); render(); };
  document.addEventListener('click', event => {
    const bandCard = event.target.closest('[data-band]');
    if (bandCard) { $('f-band').value = state.band === bandCard.dataset.band ? '' : bandCard.dataset.band; readFilters(); render(); return; }
    const moveCard = event.target.closest('[data-move]');
    if (moveCard) { $('f-move').value = state.move === moveCard.dataset.move ? '' : moveCard.dataset.move; readFilters(); render(); return; }
    const sortButton = event.target.closest('[data-sort]');
    if (sortButton) {
      const key = sortButton.dataset.sort;
      if (state.sort === key) state.dir = state.dir === 'asc' ? 'desc' : 'asc';
      else { state.sort = key; state.dir = key === 'stock' || key === 'industry' ? 'asc' : 'desc'; }
      state.sortExplicit = !(key === 'risk' && state.dir === 'desc');
      state.page = 1; render(); return;
    }
    const toggleButton = event.target.closest('[data-target]');
    if (toggleButton) {
      const detail = $(toggleButton.dataset.target), open = toggleButton.getAttribute('aria-expanded') === 'true';
      toggleButton.setAttribute('aria-expanded', String(!open));
      detail.hidden = open;
      if (!open) fitDetailShells();
    }
  });
  $('prev-page').onclick = () => { state.page--; render(); };
  $('next-page').onclick = () => { state.page++; render(); };
  /* 緊湊檢視（記在 localStorage） */
  const DENSITY_KEY = 'tcri-predict-density';
  const applyDensity = compact => { document.body.classList.toggle('is-compact', compact); $('density-toggle').textContent = compact ? '標準檢視' : '緊湊檢視'; };
  let stored = null; try { stored = localStorage.getItem(DENSITY_KEY); } catch (e) { stored = null; }
  applyDensity(stored === '1');
  $('density-toggle').onclick = () => { const compact = !document.body.classList.contains('is-compact'); applyDensity(compact); try { localStorage.setItem(DENSITY_KEY, compact ? '1' : '0'); } catch (e) {} };
  /* 按 / 直接跳到搜尋框 */
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.ctrlKey || event.altKey || event.metaKey) return;
    const tag = event.target?.tagName?.toLowerCase() ?? '';
    if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
    event.preventDefault(); $('f-q').focus(); $('f-q').select();
  });
  render();
})();
