import { writeFileSync } from 'node:fs';

let seed = 20260904;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const round = (value, places = 1) => Number(value.toFixed(places));
const quarters = ['2023 Q3', '2023 Q4', '2024 Q1', '2024 Q2', '2024 Q3', '2024 Q4', '2025 Q1', '2025 Q2', '2025 Q3', '2025 Q4', '2026 Q1', '2026 Q2'];

const roster = [
  ['7723', '築間', '觀光餐旅'], ['3272', '東碩', '電子—電腦及週邊設備'], ['2330', '台積電', '半導體'], ['2454', '聯發科', '半導體'],
  ['2303', '聯電', '半導體'], ['3711', '日月光投控', '半導體'], ['6415', '矽力-KY', '半導體'], ['2317', '鴻海', '其他電子'],
  ['2382', '廣達', '電腦及週邊設備'], ['2357', '華碩', '電腦及週邊設備'], ['2376', '技嘉', '電腦及週邊設備'], ['3231', '緯創', '電腦及週邊設備'],
  ['2308', '台達電', '電子零組件'], ['2327', '國巨', '電子零組件'], ['3037', '欣興', '電子零組件'], ['8046', '南電', '電子零組件'],
  ['3008', '大立光', '光電'], ['2409', '友達', '光電'], ['2412', '中華電', '通信網路'], ['3045', '台灣大', '通信網路'],
  ['4904', '遠傳', '通信網路'], ['2345', '智邦', '通信網路'], ['1101', '台泥', '水泥'], ['1102', '亞泥', '水泥'],
  ['1301', '台塑', '塑膠'], ['1303', '南亞', '塑膠'], ['1326', '台化', '塑膠'], ['6505', '台塑化', '油電燃氣'],
  ['2002', '中鋼', '鋼鐵'], ['2027', '大成鋼', '鋼鐵'], ['1216', '統一', '食品'], ['1210', '大成', '食品'],
  ['2912', '統一超', '貿易百貨'], ['2603', '長榮', '航運'], ['2609', '陽明', '航運'], ['2615', '萬海', '航運'],
  ['2610', '華航', '航運'], ['2618', '長榮航', '航運'], ['2727', '王品', '觀光餐旅'], ['2542', '興富發', '建材營造'],
  ['5522', '遠雄', '建材營造'], ['1477', '聚陽', '紡織纖維'], ['1402', '遠東新', '紡織纖維'], ['9904', '寶成', '其他'],
  ['9910', '豐泰', '其他'], ['2105', '正新', '橡膠'], ['2207', '和泰車', '汽車'], ['1519', '華城', '電機機械']
];

const worsening = new Set(['7723', '3272', '2303', '2409', '2609', '2542']);
const improving = new Set(['2330', '2412', '2912']);
/* 弱訊號組：有方向但分數不高，落 MEDIUM/LOW 分層，讓三層都有人 */
const weakDown = new Set(['2027', '1402', '9904', '2610', '5522']);
const weakUp = new Set(['2308', '1216']);
const rated = new Set(['7723', '3272', '2303']);
const drivers = [['roa', '稅後資產報酬率', '%'], ['roe', '稅後權益報酬率', '%'], ['totalScore', '試算總分', '分']];

const companies = roster.map(([id, name, industry], index) => {
  const isWorsening = worsening.has(id), isImproving = improving.has(id);
  const baseGrade = Math.max(2, Math.min(8, 4 + (index % 4) + (isWorsening ? 1 : 0) - (isImproving ? 1 : 0)));
  const drift = isWorsening ? .32 : isImproving ? -.22 : (random() - .5) * .12;
  const baseRevenue = 60 + Math.pow(random(), 2) * 5200;
  const gradePath = quarters.map((_, quarterIndex) =>
    Math.max(2, Math.min(8, Math.round(baseGrade + drift * quarterIndex + (random() - .5) * .55))));
  const series = quarters.map((period, quarterIndex) => {
    const grade = gradePath[quarterIndex];
    /* 模型試算領先官方 1–2 季（惡化/改善公司看得到虛線先行），其餘小幅擾動 */
    const lead = (isWorsening || isImproving) ? 2 : 1;
    const modelGrade = Math.max(2, Math.min(9, gradePath[Math.min(quarterIndex + lead, gradePath.length - 1)] + (random() < .18 ? (random() < .5 ? 1 : -1) : 0)));
    const roa = round(5.8 - grade * .72 - drift * quarterIndex * .8 + (random() - .5) * .8);
    const roe = round(roa * (1.75 + random() * .3));
    const operatingMargin = round(Math.max(-4, roa * (1.4 + random() * .5) + 2.5));
    const totalScore = Math.round(-154 - grade * 10 - quarterIndex * drift * 7 + (random() - .5) * 9);
    const scoreDown = round(Math.max(.08, Math.min(.98, .18 + grade * .07 + (isWorsening ? .22 : 0) + (random() - .5) * .12)), 2);
    const scoreUp = round(Math.max(.05, Math.min(.88, .34 - grade * .025 + (isImproving ? .35 : 0) + (random() - .5) * .1)), 2);
    return {
      period, grade, modelGrade, roa, roe, operatingMargin, totalScore, score: totalScore, scoreDown, scoreUp,
      debt: round(24 + grade * 4.2 + (random() - .5) * 5),
      quick: round(Math.max(.4, 2.1 - grade * .16 + (random() - .5) * .2), 2),
      interestRate: round(1.4 + grade * .28 + (random() - .5) * .3),
      inventoryDays: Math.round(34 + grade * 6 + (random() - .5) * 10),
      collectionDays: Math.round(48 + grade * 8 + (random() - .5) * 12),
      coverage: 92 + (index % 8),
      alert: isWorsening && quarterIndex > 7
    };
  });
  const latest = series.at(-1), prior = series.at(-2);
  const predictionDelta = isWorsening || weakDown.has(id) ? 1 : isImproving || weakUp.has(id) ? -1 : 0;
  if (weakDown.has(id)) latest.scoreDown = round(.32 + random() * .3, 2);
  if (weakUp.has(id)) latest.scoreUp = round(.3 + random() * .28, 2);
  latest.modelGrade = Math.max(2, Math.min(9, latest.grade + predictionDelta));
  const direction = predictionDelta > 0 ? 'DOWN' : predictionDelta < 0 ? 'UP' : 'FLAT';
  const riskScore = direction === 'DOWN' ? latest.scoreDown : direction === 'UP' ? latest.scoreUp : Math.max(latest.scoreDown, latest.scoreUp);
  const band = direction === 'DOWN' && riskScore >= .7 ? 'HIGH' : direction !== 'FLAT' && riskScore >= .45 ? 'MEDIUM' : direction !== 'FLAT' ? 'LOW' : '';
  /* 原因欄照 v3 口徑：試算 vs 現評 ＋ 一項有數字的變動；FLAT 不給變動理由 */
  const reason = direction === 'DOWN'
    ? `試算${latest.modelGrade} vs 現評${latest.grade}，稅後資產報酬率 ${prior.roa}→${latest.roa}% +${predictionDelta}`
    : direction === 'UP'
      ? `試算${latest.modelGrade} vs 現評${latest.grade}，稅後權益報酬率 ${prior.roe}→${latest.roe}% ${predictionDelta}`
      : '—';
  const movement = latest.grade > prior.grade ? 'deteriorated' : latest.grade < prior.grade ? 'improved' : 'stable';
  return {
    id, name, industry, series, drivers,
    revenue: round(baseRevenue), totalAssets: round(baseRevenue * (1.3 + random() * 1.4)),
    grade: latest.grade, score: latest.totalScore, movement, signals: series.filter(point => point.alert).length,
    coverage: latest.coverage, complete: (index % 11) !== 3, source: '合成資料', reason,
    prediction: { direction, band, riskScore, scoreDown: latest.scoreDown, scoreUp: latest.scoreUp, rankDown: 0, rankUp: 0, rated: rated.has(id), ratedGrade: Math.max(2, Math.min(9, latest.modelGrade)) },
    updated: '2026-09-04'
  };
});

const sortedDown = [...companies].sort((a, b) => b.prediction.scoreDown - a.prediction.scoreDown);
const sortedUp = [...companies].sort((a, b) => b.prediction.scoreUp - a.prediction.scoreUp);
sortedDown.forEach((company, index) => { company.prediction.rankDown = index + 1; });
sortedUp.forEach((company, index) => { company.prediction.rankUp = index + 1; });

const payload = { generatedAt: '2026-09-04 09:30', quarters, runs: ['predict-view-3.2.0'], companies };
writeFileSync(new URL('./companies.json', import.meta.url), JSON.stringify(payload, null, 2) + '\n');
writeFileSync(new URL('./companies.js', import.meta.url), `window.TCRI_DATA = ${JSON.stringify(payload)};\n`);
console.log(`Generated ${companies.length} synthetic companies.`);
