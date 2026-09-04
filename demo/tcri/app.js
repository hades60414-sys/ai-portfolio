(() => {
  'use strict';
  const data = window.TCRI_DATA;
  if (!data) throw new Error('Synthetic demo data is unavailable. Run data/generate.mjs once.');
  const $ = id => document.getElementById(id);
  const colors = ['#8d1730', '#216449', '#1f5f8f', '#9a6410', '#755277'];
  const state = { page: 1, perPage: 8, selected: [], expanded: null, grade: '', sort: 'grade', direction: 'asc', metric: 'grade', periodIndex: data.quarters.length - 1 };
  const safeStorage = { get: () => { try { return JSON.parse(localStorage.getItem('tcri-synthetic-compare') || '[]'); } catch (_) { return []; } }, set: value => { try { localStorage.setItem('tcri-synthetic-compare', JSON.stringify(value)); } catch (_) {} } };
  state.selected = safeStorage.get().filter(id => data.companies.some(c => c.id === id)).slice(0, 5);
  const fmt = value => Number(value).toFixed(1);
  const current = company => {
    const point = company.series[state.periodIndex], previous = company.series[Math.max(0, state.periodIndex - 1)];
    const movement = state.periodIndex === 0 ? 'newgrade' : point.grade < previous.grade ? 'improved' : point.grade > previous.grade ? 'deteriorated' : 'stable';
    return { ...company, point, previous, movement };
  };
  const badge = (grade, simulated = false) => `<span class="grade-pill g${grade}${simulated ? ' simulated' : ''}">${grade}</span>`;
  const movement = value => value === 'improved' ? '<span class="movement movement-up">↓ 改善</span>' : value === 'deteriorated' ? '<span class="movement movement-down">↑ 惡化</span>' : value === 'newgrade' ? '<span class="badge badge-good">首次評等</span>' : '<span class="badge badge-neutral">持平</span>';
  const matches = row => {
    const query = $('search').value.trim().toLocaleLowerCase('zh-Hant');
    const status = $('status').value;
    const searchMatch = !query || `${row.name} ${row.id} ${row.industry}`.toLocaleLowerCase('zh-Hant').includes(query);
    const statusMatch = status === 'all' || (status === 'complete' && row.complete) || (status === 'warning' && row.signals) || row.movement === status;
    return searchMatch && statusMatch && (!state.grade || String(row.point.grade) === state.grade);
  };
  const sortValue = row => ({ name: row.name, industry: row.industry, revenue: row.revenue, score: row.point.score, grade: row.point.grade, movement: { improved: -1, stable: 0, deteriorated: 1, newgrade: 2 }[row.movement], roe: row.point.roe, roa: row.point.roa, margin: row.point.operatingMargin, updated: row.updated })[state.sort];
  const rows = () => data.companies.map(current).filter(matches).sort((a, b) => {
    const left = sortValue(a), right = sortValue(b);
    const result = typeof left === 'string' ? left.localeCompare(right, 'zh-Hant') : left - right;
    return result === 0 ? a.id.localeCompare(b.id) : result * (state.direction === 'asc' ? 1 : -1);
  });
  const toast = text => { const node = $('toast'); node.textContent = text; node.classList.add('is-visible'); clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove('is-visible'), 2600); };
  const renderSummary = () => {
    const all = data.companies.map(current), complete = all.filter(c => c.complete).length, coverage = Math.round(all.reduce((sum, c) => sum + c.coverage, 0) / all.length), alerts = all.filter(c => c.signals).length, average = all.reduce((sum, c) => sum + c.point.score, 0) / all.length;
    $('summary').innerHTML = [
      ['目前季度', data.quarters[state.periodIndex], '<span class="metric-note">合成季度</span>'],
      ['公司涵蓋率', `${coverage}%`, ''],
      ['資料完整率', `${Math.round(complete / all.length * 100)}%`, `<span class="metric-track"><span style="width:${complete / all.length * 100}%"></span></span>`],
      ['完整公司', complete, ''], ['警示訊號', alerts, ''], ['平均總分', fmt(average), '']
    ].map(([label, value, note]) => `<div class="metric"><span class="metric-label">${label}</span><strong class="metric-value">${value}</strong>${note}</div>`).join('');
  };
  const detail = row => `<tr class="detail-row" data-detail="${row.id}" ${state.expanded === row.id ? '' : 'hidden'}><td colspan="15"><div class="detail-shell"><div><h4 class="detail-title">財務指標與評等依據</h4><div class="detail-metrics"><div class="detail-metric"><span>資產總額(億)</span><strong>${fmt(row.totalAssets)}</strong></div><div class="detail-metric"><span>速動比率</span><strong>${row.point.quick}</strong></div><div class="detail-metric"><span>借款依存度</span><strong>${fmt(row.point.debt)}%</strong></div><div class="detail-metric"><span>利息率</span><strong>${fmt(row.point.interestRate)}%</strong></div><div class="detail-metric"><span>存貨天數</span><strong>${row.point.inventoryDays}</strong></div><div class="detail-metric"><span>收款天數</span><strong>${row.point.collectionDays}</strong></div><div class="detail-metric"><span>資料覆蓋率</span><strong>${row.coverage}%</strong></div><div class="detail-metric"><span>加權理由</span><strong>${row.reason}</strong></div></div></div><div><h4 class="detail-title">歷史門檻等級</h4><canvas class="mini-chart" data-mini-chart="${row.id}" aria-label="${row.name} 歷史門檻等級走勢"></canvas><div class="chart-status">門檻等級走勢；合成資料不補值</div></div></div></td></tr>`;
  const renderRows = () => {
    const list = rows(), totalPages = Math.max(1, Math.ceil(list.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage, visible = list.slice(start, start + state.perPage);
    $('company-rows').innerHTML = visible.length ? visible.map(row => {
      const selected = state.selected.includes(row.id), warning = row.signals || !row.complete;
      return `<tr class="company-row${selected ? ' is-selected' : ''}${warning ? ' is-warning' : ''}" data-stock="${row.id}"><td class="sticky-check"><input class="compare-box" type="checkbox" data-compare="${row.id}" aria-label="加入 ${row.name} 走勢比較" ${selected ? 'checked' : ''}></td><td class="sticky-company"><button class="stock-button" type="button" data-expand="${row.id}" aria-expanded="${state.expanded === row.id}">${row.name}</button><span class="stock-code">${row.id}</span></td><td>${row.industry}</td><td>${fmt(row.revenue)}</td><td><strong>${fmt(row.point.score)}</strong></td><td>${row.point.grade}</td><td>${badge(row.point.grade, row.source === '試算')}<span class="reference-note">${row.source}</span></td><td>${badge(row.previous.grade, row.source === '試算')}<span class="reference-note">${data.quarters[Math.max(0, state.periodIndex - 1)]}</span></td><td>${movement(row.movement)}</td><td>${fmt(row.point.roe)}%</td><td>${fmt(row.point.roa)}%</td><td>${fmt(row.point.operatingMargin)}%</td><td>${row.updated}</td><td>${row.complete ? '<span class="badge badge-good">完整</span>' : '<span class="badge badge-bad">待補</span>'}${row.signals ? '<span class="badge badge-warn">警示</span>' : ''}</td><td title="${row.reason}"><span class="reason-chip">${row.reason}</span></td></tr>${detail(row)}`;
    }).join('') : '<tr><td colspan="15" style="text-align:center">目前條件沒有符合的合成公司</td></tr>';
    $('result-count').textContent = `第 ${list.length ? start + 1 : 0}–${Math.min(start + state.perPage, list.length)} 筆，共 ${list.length} 筆`;
    $('page-label').textContent = `第 ${state.page} / ${totalPages} 頁`;
    $('prev-page').disabled = state.page === 1; $('next-page').disabled = state.page === totalPages;
    document.querySelectorAll('[data-sort]').forEach(button => button.classList.toggle('is-active', button.dataset.sort === state.sort));
    if (state.expanded) requestAnimationFrame(() => drawSingle(state.expanded));
  };
  const renderGrades = () => {
    const all = data.companies.map(current), count = grade => all.filter(c => c.point.grade === grade).length, max = Math.max(...Array.from({ length: 9 }, (_, i) => count(i + 1)), 1);
    $('grade-grid').innerHTML = Array.from({ length: 9 }, (_, i) => i + 1).map(grade => `<button class="grade-card${state.grade === String(grade) ? ' is-active' : ''}" data-grade="${grade}" type="button" aria-pressed="${state.grade === String(grade)}"><span class="grade-card-top">${badge(grade)}<strong>${count(grade)}</strong></span><span class="grade-bar"><span style="width:${count(grade) / max * 100}%"></span></span></button>`).join('');
    $('clear-grade').hidden = !state.grade;
  };
  const renderMovement = () => {
    const all = data.companies.map(current), config = [['improved','↓ 評等改善'], ['deteriorated','↑ 評等惡化'], ['stable','− 評等持平'], ['newgrade','＋ 首次評等']];
    $('movement-grid').innerHTML = config.map(([key, label]) => `<button class="movement-card${$('status').value === key ? ' is-active' : ''}" data-status="${key}" type="button"><span>${label}</span><strong>${all.filter(c => c.movement === key).length}</strong></button>`).join('');
  };
  const resizeCanvas = canvas => { const ratio = Math.max(1, window.devicePixelRatio || 1), box = canvas.getBoundingClientRect(), width = Math.max(1, Math.round(box.width)), height = Math.max(1, Math.round(box.height)); canvas.width = width * ratio; canvas.height = height * ratio; const ctx = canvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height); return { ctx, width, height }; };
  const drawChart = (canvas, companies, metric) => {
    if (!canvas) return;
    const { ctx, width, height } = resizeCanvas(canvas), points = data.quarters.length, pad = { left: 31, right: 12, top: 14, bottom: 24 };
    if (!companies.length) { ctx.fillStyle = '#68636a'; ctx.font = '13px sans-serif'; ctx.fillText('從表格勾選公司開始比較', 15, 32); return; }
    const gradeMode = metric === 'grade', min = gradeMode ? 1 : 0, max = gradeMode ? 9 : 100;
    const x = i => points === 1 ? pad.left : pad.left + (width - pad.left - pad.right) * i / (points - 1);
    const y = value => pad.top + (height - pad.top - pad.bottom) * (gradeMode ? (value - min) / (max - min) : 1 - (value - min) / (max - min));
    ctx.font = '10px "Segoe UI",sans-serif'; ctx.lineWidth = 1;
    for (let tick = gradeMode ? 1 : 0; tick <= max; tick += gradeMode ? 2 : 25) { ctx.strokeStyle = '#e4dfe1'; ctx.beginPath(); ctx.moveTo(pad.left, y(tick)); ctx.lineTo(width - pad.right, y(tick)); ctx.stroke(); ctx.fillStyle = '#6f686c'; ctx.fillText(String(tick), 4, y(tick) + 3); }
    data.quarters.forEach((label, i) => { if (i % 3 === 0) { ctx.fillStyle = '#6f686c'; ctx.fillText(label.slice(2), x(i) - 13, height - 7); } });
    companies.forEach((company, ci) => { const color = colors[ci % colors.length]; ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash(company.source === '試算' ? [5, 4] : []); ctx.beginPath(); company.series.forEach((point, i) => { const value = gradeMode ? point.grade : point.score; i ? ctx.lineTo(x(i), y(value)) : ctx.moveTo(x(i), y(value)); }); ctx.stroke(); ctx.setLineDash([]); company.series.forEach((point, i) => { const value = gradeMode ? point.grade : point.score; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x(i), y(value), 3.2, 0, Math.PI * 2); ctx.fill(); }); });
  };
  const drawSingle = id => { const company = data.companies.find(c => c.id === id); drawChart(document.querySelector(`[data-mini-chart="${id}"]`), company ? [company] : [], 'grade'); };
  const renderCompare = () => {
    const selected = state.selected.map(id => data.companies.find(c => c.id === id)).filter(Boolean);
    $('compare-count').textContent = selected.length;
    $('selected-list').innerHTML = selected.length ? selected.map(c => `<span class="selected-chip">${c.name}<button type="button" data-remove="${c.id}" aria-label="移除 ${c.name}">×</button></span>`).join('') : '<span class="compare-empty">尚未選擇公司</span>';
    $('chart-legend').innerHTML = selected.map((c, i) => `<span class="legend-item"><i class="legend-dot" style="background:${colors[i % colors.length]}"></i>${c.name} ${c.id}</span>`).join('');
    $('chart-status').textContent = selected.length ? `已載入 ${selected.length} 家公司；合成序列不補值` : '請從表格勾選公司';
    requestAnimationFrame(() => drawChart($('compare-chart'), selected, state.metric));
  };
  const renderMailbox = () => { $('mailbox-list').innerHTML = data.companies.slice(0, 3).map((company, index) => `<li><button class="stock-button" data-mail="${company.id}">${company.id} ${company.name}</button><span>${index + 1} 日前</span></li>`).join(''); };
  const render = () => { renderSummary(); renderRows(); renderGrades(); renderMovement(); renderCompare(); };
  const select = id => { if (state.selected.includes(id)) state.selected = state.selected.filter(value => value !== id); else if (state.selected.length >= 5) { toast('最多同時比較 5 家公司；請先移除一家公司。'); return false; } else state.selected.push(id); safeStorage.set(state.selected); return true; };
  $('period').innerHTML = data.quarters.slice().reverse().map((period, reverseIndex) => `<option value="${data.quarters.length - 1 - reverseIndex}">${period} · ${data.companies.length} 家</option>`).join('');
  $('period').value = state.periodIndex;
  $('filters').addEventListener('submit', event => { event.preventDefault(); state.page = 1; render(); });
  ['search', 'status', 'page-size', 'period'].forEach(id => $(id).addEventListener(id === 'search' ? 'input' : 'change', () => { if (id === 'page-size') state.perPage = Number($('page-size').value); if (id === 'period') state.periodIndex = Number($('period').value); state.page = 1; render(); }));
  $('clear-filters').addEventListener('click', () => { $('search').value = ''; $('status').value = 'all'; state.grade = ''; state.page = 1; render(); });
  $('clear-grade').addEventListener('click', () => { state.grade = ''; state.page = 1; render(); });
  $('prev-page').addEventListener('click', () => { state.page--; renderRows(); }); $('next-page').addEventListener('click', () => { state.page++; renderRows(); });
  $('density-toggle').addEventListener('click', () => { const compact = document.body.classList.toggle('is-compact'); $('density-toggle').setAttribute('aria-pressed', compact); $('density-toggle').textContent = compact ? '舒適檢視' : '緊湊檢視'; toast(compact ? '已切換為緊湊檢視' : '已切換為舒適檢視'); });
  $('clear-compare').addEventListener('click', () => { state.selected = []; safeStorage.set([]); renderRows(); renderCompare(); toast('已清除走勢比較名單'); });
  $('export-page').addEventListener('click', () => { const rowsText = [['公司','代號','產業','總分','門檻等級'], ...rows().slice((state.page - 1) * state.perPage, state.page * state.perPage).map(row => [row.name, row.id, row.industry, fmt(row.point.score), row.point.grade])]; const csv = rowsText.map(record => record.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\r\n'); const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })); link.download = `TCRI_synthetic_${data.quarters[state.periodIndex].replace(' ', '_')}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 1000); toast('已產生本頁合成資料 CSV'); });
  document.addEventListener('click', event => {
    const grade = event.target.closest('[data-grade]'), status = event.target.closest('[data-status]'), sort = event.target.closest('[data-sort]'), expand = event.target.closest('[data-expand]'), remove = event.target.closest('[data-remove]'), metric = event.target.closest('[data-metric]'), mail = event.target.closest('[data-mail]');
    if (grade) { state.grade = state.grade === grade.dataset.grade ? '' : grade.dataset.grade; state.page = 1; render(); }
    if (status) { $('status').value = $('status').value === status.dataset.status ? 'all' : status.dataset.status; state.page = 1; render(); }
    if (sort) { state.direction = state.sort === sort.dataset.sort ? (state.direction === 'asc' ? 'desc' : 'asc') : 'asc'; state.sort = sort.dataset.sort; renderRows(); }
    if (expand) { state.expanded = state.expanded === expand.dataset.expand ? null : expand.dataset.expand; renderRows(); }
    if (remove) { select(remove.dataset.remove); renderRows(); renderCompare(); }
    if (metric) { state.metric = metric.dataset.metric; document.querySelectorAll('[data-metric]').forEach(button => button.classList.toggle('is-active', button === metric)); renderCompare(); }
    if (mail) { $('search').value = mail.dataset.mail; state.page = 1; $('mailbox-panel').hidden = true; $('mailbox-toggle').setAttribute('aria-expanded', 'false'); render(); }
  });
  document.addEventListener('change', event => { if (!event.target.matches('[data-compare]')) return; if (!select(event.target.dataset.compare)) event.target.checked = false; renderRows(); renderCompare(); });
  $('mailbox-toggle').addEventListener('click', () => { const panel = $('mailbox-panel'), open = panel.hidden; panel.hidden = !open; $('mailbox-toggle').setAttribute('aria-expanded', open); });
  document.addEventListener('keydown', event => { if (event.key !== 'Escape') return; $('mailbox-panel').hidden = true; $('mailbox-toggle').setAttribute('aria-expanded', 'false'); if (state.expanded) { state.expanded = null; renderRows(); } });
  window.addEventListener('resize', () => { clearTimeout(window.__tcriResize); window.__tcriResize = setTimeout(() => { renderCompare(); if (state.expanded) drawSingle(state.expanded); }, 120); });
  const deepLinkQuery = new URLSearchParams(window.location.search).get('q');
  if (deepLinkQuery) $('search').value = deepLinkQuery.slice(0, 40);
  renderMailbox(); render();
})();
