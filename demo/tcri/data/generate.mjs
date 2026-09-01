import { writeFileSync } from 'node:fs';

let seed = 20260901;
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const round = (value, places = 1) => Number(value.toFixed(places));
const quarters = ['2023 Q3','2023 Q4','2024 Q1','2024 Q2','2024 Q3','2024 Q4','2025 Q1','2025 Q2','2025 Q3','2025 Q4','2026 Q1','2026 Q2'];
const labels = ['示範製造','示範材料','示範服務','示範科技','示範物流','示範能源','示範零售','示範醫材','示範建設','示範軟體','示範化工','示範運輸','示範食品','示範光電','示範通路','示範機電'];
const industries = ['工業','材料','服務','資訊','運輸','能源','消費','醫療'];
const worsening = new Set([2, 7, 13]);

const companies = labels.map((name, index) => {
  const severe = worsening.has(index);
  const improving = index === 4 || index === 10;
  const base = 26 + (index % 6) * 7 + rand() * 5 + (severe ? 6 : 0);
  const trend = severe ? 3.3 : improving ? -1.25 : (rand() - .54) * .55;
  const series = quarters.map((period, q) => {
    const score = Math.max(12, Math.min(92, base + trend * q + (rand() - .5) * 6));
    const grade = Math.max(1, Math.min(9, Math.round(score / 11)));
    const alert = severe && q >= 7 && (q === 8 || q === 10) || (!severe && index % 5 === 0 && q === 9);
    return { period, score: round(score), grade, alert, roe: round(13 - score / 8 + (rand() - .5) * 2), debt: round(24 + score * .58 + (rand() - .5) * 6), quick: round(1.9 - score / 95 + (rand() - .5) * .16, 2) };
  });
  const latest = series.at(-1), prior = series.at(-2);
  const movement = latest.score - prior.score > 1.5 ? 'deteriorated' : latest.score - prior.score < -1.5 ? 'improved' : 'stable';
  return { id: String(index + 1).padStart(4, '0'), name: `${name}${String.fromCharCode(65 + index)}`, industry: industries[index % industries.length], series, grade: latest.grade, score: latest.score, movement, signals: series.filter(point => point.alert).length, revenue: round(80 + index * 17 + rand() * 55), updated: '2026-08-28' };
});
const payload = { generatedAt: '2026-09-01', quarters, companies };
writeFileSync(new URL('./companies.json', import.meta.url), JSON.stringify(payload, null, 2) + '\n');
writeFileSync(new URL('./companies.js', import.meta.url), `window.TCRI_DATA = ${JSON.stringify(payload)};\n`);
console.log(`Generated ${companies.length} synthetic companies.`);
