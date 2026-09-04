(() => {
  'use strict';
  const data = window.TCRI_DATA;
  const $ = id => document.getElementById(id);
  const grade = (n, simulated = false) => `<span class="grade-pill g${n}${simulated ? ' simulated' : ''}">${n}</span>`;
  const direction = value => value === 'DOWN' ? '<span class="badge badge-bad">↓ 降級</span>' : value === 'UP' ? '<span class="badge badge-good">↑ 升級</span>' : '<span class="badge badge-neutral">→ 維持</span>';
  const band = value => `<span class="band-tag is-${value.toLowerCase()}">${value}</span>`;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const gradeToken = value => value >= 10 ? 'D' : value;
  const prediction = (point, run, companyId) => {
    const prior = point.grade;
    // v210 對照版：部分警示公司的試算等級較保守（+1 級），模擬不同 run 的批次差異
    const next = Math.min(9, point.modelGrade + (run === 'v210' && point.alert && Number(companyId) % 3 === 0 ? 1 : 0));
    const delta = next - prior;
    const dir = delta > 0 || (point.alert && next >= 6) ? 'DOWN' : delta < 0 ? 'UP' : 'FLAT';
    const score = Math.min(99, Math.round(point.score + (dir === 'DOWN' ? 9 : dir === 'UP' ? 4 : 0)));
    return { prior, next, dir, score, band: dir === 'DOWN' && score >= 78 ? 'HIGH' : dir !== 'FLAT' && score >= 56 ? 'MEDIUM' : dir !== 'FLAT' ? 'LOW' : '—' };
  };
  const rankRows = (index, run) => data.companies.map(c => ({ id: c.id, score: prediction(c.series[index], run, c.id).score })).sort((a, b) => b.score - a.score).reduce((ranks, row, rank) => (ranks[row.id] = rank + 1, ranks), {});
  const valueText = (value, unit) => `${Number(value).toFixed(unit === 'x' ? 2 : unit === '天' ? 0 : 1)}${unit === 'x' ? '' : unit}`;
  const deltaText = (current, prior, unit) => {
    const delta = Number(current) - Number(prior), decimals = unit === 'x' ? 2 : unit === '天' ? 0 : 1;
    return `${delta > 0 ? '+' : ''}${delta.toFixed(decimals)}${unit === 'x' ? '' : unit}`;
  };
  const gradeChart = (company, selectedIndex) => {
    const points = company.series.slice(Math.max(0, selectedIndex + 1 - 12), selectedIndex + 1), n = points.length, w = 560, h = 168, left = 30, right = 74, top = 12, bottom = 26, plotWidth = w - left - right, plotHeight = h - top - bottom;
    const x = i => left + (n === 1 ? plotWidth / 2 : plotWidth * i / (n - 1));
    const y = value => top + (value - 1) / 9 * plotHeight;
    const series = (field, color, dash) => {
      const coords = points.map((point, i) => `${x(i).toFixed(1)},${y(point[field]).toFixed(1)}`);
      return `<polyline points="${coords.join(' ')}" fill="none" stroke="${color}" stroke-width="2"${dash ? ` stroke-dasharray="${dash}"` : ''}/>` + points.map((point, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(point[field]).toFixed(1)}" r="2.4" fill="${color}"/>`).join('');
    };
    const formal = points.at(-1).grade, model = points.at(-1).modelGrade, labelX = left + plotWidth + 6;
    const endLabels = formal === model ? `<text x="${labelX}" y="${(y(formal) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#8d1730">現評=試算${gradeToken(formal)}</text>` : `<text x="${labelX}" y="${(y(formal) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#8d1730">現評${gradeToken(formal)}</text><text x="${labelX}" y="${(y(model) + 4).toFixed(1)}" font-size="11" font-weight="700" fill="#64748b">試算${gradeToken(model)}</text>`;
    const grid = [1, 4, 7, 10].map(value => `<line x1="${left}" y1="${y(value).toFixed(1)}" x2="${left + plotWidth}" y2="${y(value).toFixed(1)}" stroke="#e4ded9" stroke-width="1"/><text x="${left - 6}" y="${(y(value) + 4).toFixed(1)}" text-anchor="end" font-size="10" fill="#8a817c">${value === 10 ? 'D' : value}</text>`).join('');
    return `<svg class="grade-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(company.name)} 正式評等與模型等級近 ${n} 季走勢"><title>正式評等實線；模型試算虛線</title>${grid}${series('grade', '#8d1730', '')}${series('modelGrade', '#64748b', '5 4')}${endLabels}<text x="${left}" y="${h - 8}" font-size="10" fill="#8a817c">${points[0].period}</text><text x="${left + plotWidth}" y="${h - 8}" text-anchor="end" font-size="10" fill="#8a817c">${points.at(-1).period}</text></svg>`;
  };
  const sparkline = (company, key, label, unit, selectedIndex) => {
    const points = company.series.slice(Math.max(0, selectedIndex + 1 - 12), selectedIndex + 1), values = points.map(point => point[key]), min = Math.min(...values), max = Math.max(...values), span = max - min || 1, w = 132, h = 32, pad = 4;
    const x = i => pad + (w - pad * 2) * i / (points.length - 1), y = value => h - pad - (h - pad * 2) * (value - min) / span, coords = values.map((value, i) => `${x(i).toFixed(1)},${y(value).toFixed(1)}`), last = values.length - 1;
    return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(label)}近 12 季走勢，範圍 ${valueText(min, unit)} 至 ${valueText(max, unit)}"><title>${escapeHtml(label)}近 12 季走勢</title><polyline points="${coords.join(' ')}" fill="none" stroke="#64748b" stroke-width="1.6"/><circle cx="${x(last).toFixed(1)}" cy="${y(values[last]).toFixed(1)}" r="2.4" fill="#8d1730"/></svg>`;
  };
  const drivers = (company, point, index, x) => {
    const prior = company.series[Math.max(0, index - 1)];
    if (!company.drivers?.length) {
      if (x.dir === 'FLAT') return `<p class="detail-text muted">持平：兩個方向都未過門檻${x.band === '—' ? '' : `，但分數落在 ${x.band} 觀察分層`}。</p>`;
      return `<p class="detail-text muted">${x.next !== point.grade ? '本列主要訊號為試算等級與現評背離（見左側評等走勢），無其他財報驅動指標。' : '無單一顯著財報驅動；模型分數由多項小幅訊號組成（見左側評等走勢與分數名次）。'}</p>`;
    }
    return `<div class="driver-list">${company.drivers.map(([key, label, unit]) => `<div class="driver-row"><span class="driver-name">${label}</span><span class="driver-vals">${valueText(prior[key], unit)} → <strong>${valueText(point[key], unit)}</strong><em class="driver-delta">${deltaText(point[key], prior[key], unit)}</em></span>${sparkline(company, key, label, unit, index)}</div>`).join('')}</div><p class="detail-text muted">基準季＝${prior.period}；數值為合成財報原值，走勢為近 12 季。</p>`;
  };
  const detailRow = (company, point, x, index, rank) => `<tr class="detail-row" id="detail-${company.id}" hidden><td colspan="9"><div class="detail-shell"><div class="detail-chart-col"><h4 class="detail-title">評等走勢（近 12 季）<a class="detail-jump" href="platform.html?q=${encodeURIComponent(company.id)}" target="_blank" rel="noopener" title="到 TCRI平台檢視 ${escapeHtml(company.name)} 的完整歷史與財務指標（新分頁）">在 TCRI平台 開啟 ${company.id} →</a></h4>${gradeChart(company, index)}<p class="detail-text muted">實線＝正式評等（合成）；虛線＝模型試算等級。兩線分岔＝試算與現評背離。</p><div class="detail-metrics"><div class="detail-metric"><span>警示分數 / 名次</span><strong>${x.score} ・ #${rank}</strong></div><div class="detail-metric"><span>模型試算</span><strong>${gradeToken(x.next)}</strong></div><div class="detail-metric"><span>訊號季</span><strong>${point.period}</strong></div></div></div><div><h4 class="detail-title">${x.dir === 'FLAT' ? '主要觀察指標' : '主要驅動明細'}</h4>${drivers(company, point, index, x)}<p class="detail-text muted">分層 ${x.band}：HIGH／MEDIUM 為固定分數線；LOW 屬當季相對名次訊號。</p></div></div></td></tr>`;
  const render = () => {
    const run = $('p-run').value, query = $('p-search').value.trim().toLowerCase(), filter = $('p-direction').value, index = data.quarters.indexOf($('p-period').value), ranks = rankRows(index, run);
    const rows = data.companies.map(c => ({ c, point: c.series[index], x: prediction(c.series[index], run, c.id) })).filter(({ c, x }) => (!query || `${c.id} ${c.name} ${c.industry}`.toLowerCase().includes(query)) && (filter === 'all' || x.dir === filter)).sort((a, b) => ({ HIGH: 3, MEDIUM: 2, LOW: 1, '—': 0 }[b.x.band] - { HIGH: 3, MEDIUM: 2, LOW: 1, '—': 0 }[a.x.band]) || b.x.score - a.x.score);
    $('predict-period').textContent = $('p-period').value;
    const alerts = rows.filter(row => row.x.dir === 'DOWN').length, high = rows.filter(row => row.x.band === 'HIGH').length;
    $('predict-summary').innerHTML = [['本次預測', $('p-period').value, `<span class="metric-note">${run}</span>`], ['觀察公司', rows.length, ''], ['降級預警', alerts, ''], ['高優先複核', high, ''], ['平均警示分數', rows.length ? Math.round(rows.reduce((sum, row) => sum + row.x.score, 0) / rows.length) : '—', '']].map(([label, value, note]) => `<div class="metric"><span class="metric-label">${label}</span><strong class="metric-value">${value}</strong>${note}</div>`).join('');
    $('predict-rows').innerHTML = rows.length ? rows.map(({ c, point, x }) => `<tr class="company-row"><td><button class="stock-button" type="button" data-detail-toggle="detail-${c.id}" aria-expanded="false" aria-controls="detail-${c.id}" aria-label="展開 ${escapeHtml(c.name)} 的預測明細">${escapeHtml(c.name)}</button><span class="stock-code">${c.id}</span></td><td>${escapeHtml(c.industry)}</td><td>${grade(x.prior)}<span class="reference-note">官方評等</span></td><td>${grade(x.next, true)}<span class="reference-note">模型試算</span></td><td>${direction(x.dir)}</td><td>${x.band === '—' ? '—' : band(x.band)}</td><td><strong>${x.score}</strong></td><td><span class="reason-chip">${escapeHtml(c.reason)}</span></td><td>${run}</td></tr>${detailRow(c, point, x, index, ranks[c.id])}`).join('') : '<tr><td colspan="9" class="empty-cell">沒有符合的公司</td></tr>';
    $('p-export').onclick = () => {
      const text = [['代號', '公司', '官方等級', '模型試算', '方向', '分層', '警示分數'], ...rows.map(({ c, x }) => [c.id, c.name, x.prior, x.next, x.dir, x.band, x.score])].map(record => record.map(value => `"${value}"`).join(',')).join('\r\n');
      const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob(['\ufeff' + text], { type: 'text/csv' })); link.download = `TCRI_prediction_${$('p-period').value}_${run}.csv`; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 500);
    };
  };
  $('p-period').innerHTML = data.quarters.map(quarter => `<option>${quarter}</option>`).join('');
  $('p-period').value = data.quarters.at(-1);
  $('generated-at').textContent = data.generatedAt;
  $('predict-filters').addEventListener('submit', event => { event.preventDefault(); render(); });
  ['p-period', 'p-run', 'p-direction'].forEach(id => $(id).addEventListener('change', render));
  $('p-search').addEventListener('input', render);
  $('p-clear').onclick = () => { $('p-search').value = ''; $('p-direction').value = 'all'; render(); };
  $('predict-rows').addEventListener('click', event => {
    const button = event.target.closest('[data-detail-toggle]');
    if (!button) return;
    const detail = $(button.dataset.detailToggle), expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    detail.hidden = expanded;
  });
  render();
})();
