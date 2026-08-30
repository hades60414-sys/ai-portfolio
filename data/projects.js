export const projects = [
  {
    id: "edge-validator",
    title: "Edge Validator",
    kicker: "策略照妖鏡",
    category: "quant",
    featured: true,
    status: "可公開展示",
    year: "2026",
    summary: "把回測報酬丟進一套反過來懷疑你的統計流程，先找過度擬合，再決定策略值不值得繼續。",
    problem: "多數回測工具幫你找到看起來會賺的策略，卻沒有回答：這條曲線是不是從大量嘗試中碰巧挑到的？",
    proof: "瀏覽器端運算、七道統計閘、純靜態部署；支援多策略矩陣與缺值 fail-closed。",
    tags: ["Forensic backtest", "Statistics", "Privacy-first"],
    image: "assets/edge-validator.png",
    imageAlt: "Edge Validator 深色首頁，標題詢問策略是真實還是雜訊擬合",
    link: "https://github.com/hades60414-sys/edge-validator",
    accent: "mint"
  },
  {
    id: "chat-stock-ai",
    title: "選股對話",
    kicker: "散戶的 AI 投資夥伴",
    category: "ai",
    featured: true,
    status: "功能完成",
    year: "2026",
    summary: "用自然語言逐輪收斂台股候選，不用在數十個篩選器裡猜哪顆按鈕代表自己的投資觀點。",
    problem: "傳統選股器要求使用者先理解資料欄位，再把模糊想法翻譯成一排條件。",
    proof: "規則模式可離線 demo，LLM 模式保留跨輪上下文；Python core 同時供 Streamlit 與 Next.js 前端使用。",
    tags: ["Conversational AI", "FastAPI", "Next.js"],
    image: "assets/chat-stock.png",
    imageAlt: "選股對話介面，左側顯示逐輪對話，右側顯示收斂後股票清單",
    accent: "blue"
  },
  {
    id: "wild-alpha",
    title: "wild_alpha",
    kicker: "抗過擬合策略搜尋",
    category: "quant",
    featured: true,
    status: "研究系統",
    year: "2026",
    summary: "讓 LLM 在離線階段解析與變異策略，再用固定種子、凍結試驗登記與樣本外檢定把幸運曲線淘汰。",
    problem: "策略搜尋越自動，試驗次數越容易失控；如果不記錄失敗嘗試，最佳結果幾乎必然膨脹。",
    proof: "搜尋軌與部署軌嚴格分離；trial registry、DSR/PBO、成本 haircut 與多重檢定一起進裁決。",
    tags: ["LLM × GP", "Reproducibility", "Research"],
    image: "assets/wild-alpha.png",
    imageAlt: "wild alpha 系統架構圖，從語料解析、策略演化到統計驗證與部署裁決",
    accent: "amber"
  },
  {
    id: "marketvault",
    title: "marketvault",
    kicker: "跨市場資料底座",
    category: "infra",
    featured: true,
    status: "本機運行",
    year: "2026",
    summary: "把台股、美股、匯率、期貨與選擇權資料收進可追溯的 PostgreSQL 倉庫，供四個下游專案唯讀使用。",
    problem: "每個應用各抓一份資料，會同時遇到限流、口徑不一致、不可重現與維護成本。",
    proof: "冪等 ingest、來源 lineage、point-in-time safe access layer、DuckDB 分析與離線 fallback。",
    tags: ["PostgreSQL", "DuckDB", "Data lineage"],
    accent: "violet"
  },
  {
    id: "portfolio-dashboard",
    title: "投資組合儀表板",
    kicker: "本機資產作業台",
    category: "ai",
    status: "本機運行",
    year: "2026",
    summary: "整合台美股、衍生品、匯率與歷史績效；也能用視覺模型從券商截圖更新部位，再由規則驗證。",
    problem: "資產散在 Excel、券商截圖與不同市場，報價、結算和風險口徑很難保持一致。",
    proof: "即時報價、多資產點值、到期提醒、截圖解析後人工確認；marketvault 不可用時自動退回公開來源。",
    tags: ["Vision AI", "Streamlit", "Multi-asset"],
    accent: "blue"
  },
  {
    id: "options-assistant",
    title: "選擇權助手",
    kicker: "觀點翻譯 × 衍生品風控",
    category: "quant",
    status: "受控展示",
    year: "2026",
    summary: "把自然語言市場觀點轉成可驗證的選擇權候選；LLM 只解釋，價格、Greeks 與排序全由程式計算。",
    problem: "衍生品最危險的不是公式難，而是乘數、波動口徑與條款在流程間悄悄變掉。",
    proof: "anchor-first 波動流程、24 條無套利／合理性規則、Black-76 與跨部位情境壓測。",
    tags: ["Derivatives", "Risk", "Human-in-loop"],
    accent: "amber"
  },
  {
    id: "auto-quant-btc",
    title: "auto-quant-btc",
    kicker: "自主量化研究農場",
    category: "quant",
    status: "研究 / 模擬盤",
    year: "2026",
    summary: "從資料、策略生成、嚴格回測、風控到模擬盤的一體化研究系統；真錢開關刻意留給人。",
    problem: "自動化研究很容易把搜尋速度誤當成 edge，最後只加速找到更漂亮的過度擬合。",
    proof: "預註冊、試驗家族分母、成本與滑價、風險閘、乾跑 ledger；未授權不解開真錢三鎖。",
    tags: ["Autonomous research", "Backtest", "Risk gates"],
    image: "assets/auto-quant.png",
    imageAlt: "自主量化研究農場的 ensemble 權益曲線",
    accent: "mint"
  },
  {
    id: "sector-radar",
    title: "族群雷達",
    kicker: "盤中注意力輔助器",
    category: "quant",
    status: "影子運行",
    year: "2026",
    summary: "盤前整理族群相對強弱、breadth、籌碼與隔夜連動；盤中只把注意力推向值得看的異常。",
    problem: "交易者不是缺更多訊號，而是缺一套知道何時該看、也知道何時該閉嘴的注意力系統。",
    proof: "point-in-time 歷史回放、影子推播、門檻校準與下游資料唯讀。",
    tags: ["Market radar", "Calibration", "Read-only"],
    accent: "violet"
  },
  {
    id: "tcri-workbench",
    title: "TCRI Risk Workbench",
    kicker: "舊系統風險現代化",
    category: "infra",
    status: "受管制環境",
    year: "2026",
    summary: "在舊版 MSSQL 與 PHP 7.2 約束下，建立可重跑的信用門檻計算、唯讀 API view 與查詢工作台。",
    problem: "風險規則卡在舊 notebook 與相容性受限環境，難以排程、追溯與給既有網站安全消費。",
    proof: "冪等部署、季度覆蓋率防呆、歷史回填、唯讀 view；帳密與主機設定從環境注入。",
    tags: ["MSSQL", "Legacy integration", "Risk"],
    image: "assets/tcri-workbench.png",
    imageAlt: "TCRI 門檻等級查詢工作台，顯示季度摘要與公司列表",
    accent: "red"
  },
  {
    id: "lab-llm-chat",
    title: "Lab LLM Chat",
    kicker: "實驗室本地模型入口",
    category: "ai",
    status: "MVP",
    year: "2026",
    summary: "讓實驗室 4080 主機上的 Ollama 能以有帳號、額度與歷史的聊天介面提供給教授和學生使用。",
    problem: "把本地模型給外部裝置用，不能等同把 Ollama port 直接開到公網。",
    proof: "FastAPI、JWT、每日額度、本地模型優先；外部存取只走 authenticated tunnel 或私有網路。",
    tags: ["Local LLM", "FastAPI", "Secure access"],
    accent: "blue"
  },
  {
    id: "research-radar",
    title: "Research Radar",
    kicker: "提案制研究雷達",
    category: "workflow",
    status: "每週運行",
    year: "2026",
    summary: "定期掃描最新 agent 與開發環境研究，把論文轉成可審的具體改進提案，但不自行改碼。",
    problem: "追論文容易變成收藏；全自動套用論文又容易把未驗證想法直接灌進生產環境。",
    proof: "無金鑰抓取、去重、主題路由、backlog；智慧篩選與實作之間保留人工裁決。",
    tags: ["Research ops", "arXiv", "Approval gate"],
    accent: "violet"
  },
  {
    id: "daily-flow",
    title: "daily-flow",
    kicker: "個人任務節奏器",
    category: "workflow",
    status: "PWA",
    year: "2026",
    summary: "把今天真正能做完的事情放回畫面中央，用節奏、儀式與本機資料減少任務工具本身的摩擦。",
    problem: "待辦清單越完整，越容易變成維護焦慮；真正缺的是下一步與一天結束時的收束感。",
    proof: "local-first PWA、備份還原、可選 AI 輔助；核心流程不依賴帳號或雲端。",
    tags: ["PWA", "Local-first", "Product design"],
    accent: "amber"
  },
  {
    id: "task-gacha",
    title: "Task Gacha",
    kicker: "把下一步交給機率",
    category: "workflow",
    status: "PWA",
    year: "2026",
    summary: "用抽卡式任務選擇降低『現在到底做哪一件』的決策成本，讓回饋與進度有更明確的節奏。",
    problem: "有時不是沒有任務，而是選擇太多；每次決定下一步都先消耗一輪執行力。",
    proof: "React PWA、離線可用、可分享狀態與一致的圖像系統。",
    tags: ["React", "Gamification", "Offline"],
    image: "assets/task-gacha.png",
    imageAlt: "Task Gacha 的紫色分層卡片視覺",
    accent: "violet"
  }
];

export const grillLines = [
  {
    line: "你不是缺專案，你是缺一個願意刪掉七成細節的首頁。",
    fix: "這個作品集先把 13 個系統壓成四條能力主線；深度留到專案詳情，不在第一屏傾倒。"
  },
  {
    line: "測試很多不等於價值清楚；訪客不會因為 500 個綠點就突然理解你解了什麼問題。",
    fix: "每張卡固定回答三件事：問題、做法、證據。測試數只在它能支持主張時出現。"
  },
  {
    line: "本機能跑是工程里程碑，不是發佈策略。把服務綁到所有網卡也不叫部署。",
    fix: "服務預設 loopback；外部流量經有身分驗證的 HTTPS ingress，位址與憑證一律設定化。"
  },
  {
    line: "量化專案最會做漂亮曲線，也最容易讓漂亮曲線替方法論說謊。",
    fix: "作品集優先展示 trial registry、樣本外、成本與證偽流程；績效圖只當證據的一部分。"
  },
  {
    line: "你把 LLM 放進很多流程，但真正稀有的不是模型，是你知道哪些地方不該讓它做主。",
    fix: "把『LLM 解析、程式計算、人類裁決』寫成跨專案設計原則，讓約束本身成為作品。"
  }
];
