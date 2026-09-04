import { writeFileSync } from 'node:fs';

let seed = 20260901;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const round = (value, places = 1) => Number(value.toFixed(places));
const quarters = ['2023 Q1', '2023 Q2', '2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4'];
const labels = ['示範製造', '示範材料', '示範服務', '示範科技', '示範物流', '示範能源', '示範零售', '示範醫材', '示範建設', '示範軟體', '示範化工', '示範運輸'];
const industries = ['工業', '材料', '服務', '資訊', '運輸', '能源', '消費', '醫療'];
const worsening = new Set([2, 7, 8]);
const reasonPool = ['流動性與槓桿訊號變化', '營運資金週轉調整', '獲利能力與償債指標', '現金流覆蓋率變動'];
const driverSets = [
  [['roe', 'ROE', '%'], ['debt', '借款依存度', '%'], ['quick', '速動比率', 'x']],
  [['operatingMargin', '營益率', '%'], ['quick', '速動比率', 'x'], ['interestRate', '利息率', '%']],
  [['debt', '借款依存度', '%'], ['roe', 'ROE', '%'], ['collectionDays', '收款天數', '天'], ['quick', '速動比率', 'x']],
  [['inventoryDays', '存貨天數', '天'], ['operatingMargin', '營益率', '%'], ['debt', '借款依存度', '%']]
];

const companies = labels.map((name, index) => {
  const severe = worsening.has(index);
  const improving = index === 4 || index === 10;
  const base = 26 + (index % 6) * 7 + rand() * 5 + (severe ? 6 : 0);
  const trend = severe ? 3.3 : improving ? -1.25 : (rand() - .54) * .55;
  const series = quarters.map((period, q) => {
    const score = Math.max(12, Math.min(92, base + trend * q + (rand() - .5) * 6));
    const grade = Math.max(1, Math.min(9, Math.round(score / 11)));
    const alert = (severe && q >= 7 && (q === 8 || q === 10)) || (!severe && index % 5 === 0 && q === 9);
    const roe = round(13 - score / 8 + (rand() - .5) * 2);
    const roa = round(roe * (.39 + rand() * .12));
    const operatingMargin = round(roe * (1.35 + rand() * .18));
    const debt = round(24 + score * .58 + (rand() - .5) * 6);
    const quick = round(1.9 - score / 95 + (rand() - .5) * .16, 2);
    return { period, score: round(score), grade, alert, roe, roa, operatingMargin, debt, quick, interestRate: round(1.2 + score / 22 + rand() * .6), inventoryDays: Math.round(22 + score * 1.45 + rand() * 14), collectionDays: Math.round(26 + score * 1.12 + rand() * 12) };
  });
  series.forEach((point, q) => {
    const nextGrade = q < series.length - 1
      ? series[q + 1].grade
      : Math.max(1, Math.min(9, point.grade + Math.sign(trend) * (Math.abs(trend) > 1 ? 1 : 0)));
    const noise = rand() < .18 ? (rand() < .5 ? -1 : 1) : 0;
    point.modelGrade = Math.max(1, Math.min(9, nextGrade + noise));
  });
  const latest = series.at(-1), prior = series.at(-2);
  const movement = latest.score - prior.score > 1.5 ? 'deteriorated' : latest.score - prior.score < -1.5 ? 'improved' : 'stable';
  return {
    id: String(index + 1).padStart(4, '0'), name: `${name}${String.fromCharCode(65 + index)}`, industry: industries[index % industries.length], series,
    grade: latest.grade, score: latest.score, movement, signals: series.filter(point => point.alert).length,
    revenue: round(80 + index * 17 + rand() * 55), totalAssets: round(180 + index * 39 + rand() * 120),
    coverage: Math.round(72 + rand() * 27), complete: index % 7 !== 0, source: index % 3 === 0 ? '試算' : '合成基準',
    drivers: driverSets[index % driverSets.length].slice(0, 2 + (index % 3)),
    reason: reasonPool[index % reasonPool.length], updated: `2026-08-${String(12 + (index % 16)).padStart(2, '0')}`
  };
});

const payload = { generatedAt: '2026-09-01', quarters, runs: ['v210', 'v230'], companies };
writeFileSync(new URL('./companies.json', import.meta.url), JSON.stringify(payload, null, 2) + '\n');
writeFileSync(new URL('./companies.js', import.meta.url), `window.TCRI_DATA = ${JSON.stringify(payload)};\n`);
console.log(`Generated ${companies.length} synthetic companies.`);
