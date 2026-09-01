export const projects = [
  {
    id: "tcri-workbench", title: "TCRI 信用風險預警平台", kicker: "信用風險", category: "taishin", featured: true, featureRank: 1,
    status: "Internship 2026", visibility: "restricted", year: "2026",
    summary: "以歷史財務訊號比對 TCRI 調評變動，提供上市櫃公司的風險分級與預警。",
    problem: "信用風險訊號分散時，調評前的變化不容易被及早看見。",
    role: "整理 Python 後端與 PHP 介面的工作流，讓清單、比較與趨勢檢視可在同一流程完成。",
    decision: "以歷史資料回測驗證預警訊號；公開版本只提供合成資料演示。",
    proof: "訊號平均領先 TCRI 調評 34 天；樣本外回測年化 +7.38%、最大回撤 -5.65%。",
    boundary: "模擬回測、非實盤績效；上線驗證進行中，未公開原始資料、公式或公司環境。",
    tags: ["Python / PHP", "歷史回測"], demo: "demo/tcri/"
  },
  {
    id: "anc-alerts", title: "ANC 預警＋回測平台", kicker: "風險預警", category: "taishin", featured: true, featureRank: 2,
    status: "Internship 2026", visibility: "restricted", year: "2026",
    summary: "以 ANC 指標做預測與風險分級，並用固定流程檢查資料與回測結果。",
    problem: "指標變化需要在資料驗證、預測與預警之間維持一致的判斷方式。",
    role: "參與 Python 核心與 PHP 儀表板的流程整理，將驗證結果與預警快照串接。",
    decision: "以 persistence 基線搭配預警規則，不將回測描述為即時訊號。",
    proof: "完成 178 檔標的 holdout 驗證；low-ANC recall 約 0.543，仍持續改善。",
    boundary: "不宣稱即時性；公開頁不含任何公司、代號、資料列或內部連線。",
    tags: ["資料驗證", "風險分級"]
  },
  {
    id: "marketvault", title: "MarketVault 市場資料管線", kicker: "市場資料基礎設施", category: "taishin", featured: true, featureRank: 3,
    status: "Internship 2026", visibility: "private", year: "2026",
    summary: "讓多個金融應用使用可追溯、可重跑且時間點一致的市場資料。",
    problem: "各自抓取資料會讓口徑、重現性與維護成本失去控制。",
    role: "設計資料模型、冪等 ingest、lineage 與唯讀存取層，實習期間延伸支援交易室市場資料需求。",
    decision: "以 PostgreSQL 一致儲存、DuckDB 分析，下游只透過唯讀 adapter 使用。",
    proof: "已由四個下游應用透過 adapter 或 import 使用。",
    boundary: "資料庫、Parquet、憑證與執行資料不公開。",
    tags: ["PostgreSQL / DuckDB", "Data lineage"]
  },
  {
    id: "edge-validator", title: "Edge Validator", kicker: "量化研究與驗證", category: "research", featured: true, featureRank: 4,
    status: "公開工具", visibility: "public", year: "2026",
    summary: "在相信回測前，先用統計流程檢查過度擬合與幸運值。",
    problem: "漂亮的回測曲線，未必能說明策略是否經得起多重檢定。",
    role: "負責產品定義、統計流程、Python 引擎、瀏覽器體驗與安全邊界。",
    decision: "將 DSR、PBO/CSCV、SPA、StepM、成本壓力與隨機重排納入同一套驗證流程。",
    proof: "同一 Python 引擎可在 Pyodide 與 pytest 執行，已有 142 項測試。",
    boundary: "研究驗證工具，不提供投資建議；CSV 留在瀏覽器。",
    tags: ["Python / Pyodide", "Statistical testing"], image: "assets/edge-validator.png", imageAlt: "Edge Validator 深色首頁，詢問策略是真實訊號還是雜訊擬合", demo: "https://hades60414-sys.github.io/edge-validator/", link: "https://github.com/hades60414-sys/edge-validator"
  },
  {
    id: "chat-stock-ai", title: "選股對話", kicker: "AI 應用", category: "ai-apps", featured: true, featureRank: 5,
    status: "私人案例", visibility: "private", year: "2026",
    summary: "將模糊的投資想法逐輪收斂成可重現的台股篩選條件。",
    problem: "傳統選股器要求使用者先理解資料欄位與篩選語法。",
    role: "負責對話流程、共用 Python core、FastAPI / Next.js 整合與本機安全收斂。",
    decision: "LLM 處理含糊語意；篩選狀態與最終名單由確定性程式管理。",
    proof: "Streamlit 與 Next.js / FastAPI 共用核心；規則模式無 API key 也可使用，測試 287/287 通過。",
    boundary: "程式庫與市場資料維持私人，不公開資料或日誌。",
    tags: ["LLM orchestration", "FastAPI / Next.js"], image: "assets/chat-stock.png", imageAlt: "選股對話介面，左側為逐輪對話，右側為收斂後股票清單"
  },
  {
    id: "options-assistant", title: "選擇權助手", kicker: "量化研究與驗證", category: "research", featured: true, featureRank: 6,
    status: "私人案例", visibility: "private", year: "2026",
    summary: "把自然語言市場觀點轉成候選策略，由程式處理定價與風險。",
    problem: "乘數、波動口徑與條款在流程間變動時，容易造成風險判斷偏差。",
    role: "負責風控流程、定價核心、規則驗證、情境壓測與人機分工。",
    decision: "採 anchor-first；模型負責解釋，Black-76、Greeks、排序與跨部位風險由程式計算。",
    proof: "內建 24 條無套利／合理性規則、跨部位全重定價與 55 項測試。",
    boundary: "不連接真實下單，帳戶、部位與憑證皆不公開。",
    tags: ["Black-76 / Greeks", "Human-in-the-loop"]
  },
  { id: "wild-alpha", title: "wild_alpha", kicker: "量化研究與驗證", category: "research", status: "內部研究", visibility: "internal", year: "2026", summary: "離線 LLM 將研究語料轉為 StrategyIR，再交由統計流程裁決。", problem: "搜尋越自動，越容易把多重嘗試後的偶然結果當成結論。", role: "負責研究架構、trial registry、封存 holdout 與可重現執行。", decision: "將離線解析、搜尋窗、封存樣本外與部署裁決分開處理。", proof: "保留零晉級與撤回舊結論，固定 seed 可重現 run。", boundary: "工作樹仍有研究變更，不提供下載或公開遠端。", tags: ["StrategyIR / GP", "Reproducible research"], image: "assets/wild-alpha.png", imageAlt: "wild_alpha 從語料解析、策略演化到統計驗證的系統架構" },
  { id: "auto-quant-btc", title: "auto-quant-btc", kicker: "量化研究與驗證", category: "research", status: "模擬研究", visibility: "internal", year: "2026", summary: "從資料、策略生成到回測的模擬研究流程。", problem: "自動化研究可能只是更快找到過度擬合的漂亮曲線。", role: "負責研究管線、試驗登記、成本模型、風險閘與乾跑紀錄。", decision: "將自動研究與任何真實執行能力分離，未經人工授權不進下一層。", proof: "預註冊、試驗家族分母、成本／滑價與風險閘皆納入模擬流程。", boundary: "不公開績效、程式或遠端入口。", tags: ["Simulation only", "Risk gates"], image: "assets/auto-quant.png", imageAlt: "自主量化研究農場的研究用權益曲線" },
  { id: "sector-radar", title: "族群雷達", kicker: "量化研究與驗證", category: "research", status: "內部研究", visibility: "internal", year: "2026", summary: "盤前整理族群相對強弱與隔夜連動，盤中只提示異常。", problem: "交易者需要的是值得注意的異常，而不是更多未校準的訊號。", role: "負責 point-in-time 回放、門檻校準、影子推播與唯讀資料整合。", decision: "先做歷史回放與影子運行，再決定訊號是否有資格提醒使用者。", proof: "輸出保留資料時間點與校準結果。", boundary: "資料來源授權與測試尚待收斂，不建立公開遠端。", tags: ["Calibration", "Read-only data"] },
  { id: "portfolio-dashboard", title: "投資組合儀表板", kicker: "AI 應用", category: "ai-apps", status: "私人應用", visibility: "private", year: "2026", summary: "整合多市場資產、匯率與歷史績效的本機工作介面。", problem: "資產散在試算表、券商截圖與不同市場時，報價與風險口徑很難一致。", role: "負責多資產資料整合、視覺解析流程、人工確認與本機操作介面。", decision: "影像模型只提出欄位，部位更新前由規則與使用者共同確認。", proof: "支援多資產點值、到期提醒與資料來源 fallback。", boundary: "個人持倉、券商截圖、資料庫與模型金鑰不公開。", tags: ["Vision AI", "Multi-asset"] },
  { id: "lab-llm-chat", title: "Lab LLM Chat", kicker: "AI 應用", category: "ai-apps", status: "私人 MVP", visibility: "private", year: "2026", summary: "提供實驗室本地模型的帳號、額度與歷史管理介面。", problem: "讓外部裝置使用本地模型，不能等同直接開放服務埠。", role: "負責 FastAPI 服務、JWT、每日額度、本地模型路由與遠端存取安全。", decision: "應用維持 loopback，外部使用只走具驗證的 tunnel 或私有網路。", proof: "使用者、額度與歷史都有明確邊界。", boundary: "使用者資料、JWT secret 與 provider key 不公開。", tags: ["Local LLM", "Authenticated ingress"] },
  { id: "research-radar", title: "Research Radar", kicker: "工具與工作流", category: "workflow", status: "公開工具", visibility: "public", year: "2026", summary: "每週整理 agent 與開發環境研究，再交由人工審核。", problem: "追論文容易變收藏，全自動套用又會讓未驗證想法直接進入實作。", role: "負責抓取、去重、主題路由、提案格式與人工 approval gate。", decision: "只有抓取排程自動化，是否實作保留人工審核。", proof: "無金鑰 arXiv 抓取、去重與 backlog 已公開。", boundary: "工具不會自行修改其他 repository。", tags: ["arXiv workflow", "Approval gate"], link: "https://github.com/hades60414-sys/research-radar" },
  { id: "daily-flow", title: "daily-flow", kicker: "工具與工作流", category: "workflow", status: "本機 PWA", visibility: "internal", year: "2026", summary: "將今日可完成的事情放回畫面中央的本機工作流。", problem: "待辦清單越完整，越容易變成維護焦慮。", role: "負責產品定義、確定性日程引擎、PWA、備份還原與本機資料體驗。", decision: "核心規劃不依賴 AI，任務預設保留在裝置。", proof: "IndexedDB、離線安裝、JSON 備份還原與 93 項測試。", boundary: "個人資料分流尚待完成，不建立公開遠端。", tags: ["PWA / IndexedDB", "Deterministic planning"] },
  { id: "task-gacha", title: "Task Gacha", kicker: "工具與工作流", category: "workflow", status: "私人 PWA", visibility: "private", year: "2026", summary: "用抽卡式選擇降低決定下一件任務的成本。", problem: "任務太多時，決定下一步本身就先消耗執行力。", role: "負責 React PWA、抽卡節奏、離線狀態、分享流程與視覺系統。", decision: "以有限機率與清楚回饋取代無限清單，資料優先留在裝置。", proof: "已有 111 項測試、build 與桌面 onboarding／抽卡 smoke。", boundary: "程式庫維持私人，公開前 QA 尚待收斂。", tags: ["React PWA", "Gamification"], image: "assets/task-gacha.png", imageAlt: "Task Gacha 的紫色分層卡片視覺" }
];
