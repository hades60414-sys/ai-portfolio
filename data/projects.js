// kicker = 專案名稱（識別用小字），title = 成果標題（直接講解決了什麼）
// problem → role → proof 三欄構成卡片上的三句故事：當時的困境 → 我做了什麼 → 現在的結果
export const projects = [
  {
    id: "tcri-workbench", title: "讓信用風險提早 34 天被看見", kicker: "TCRI 信用風險預警平台", category: "taishin", featured: true, featureRank: 1,
    status: "台新實習 2026", visibility: "restricted", year: "2026",
    summary: "在信評被調整之前，先從財務訊號找出可能出事的公司。",
    problem: "等到信評被調降，市場多半已經反應完了；風險單位想更早知道，但線索散在一份份財報裡。",
    role: "把歷年財報和信評變動放在一起比對，整理出一套會提前亮燈的風險分級，再做成可以篩選、比較、看趨勢的操作畫面。",
    proof: "回測顯示預警訊號平均比 TCRI 調評早 34 天出現；同期樣本外年化 +7.38%、最大回撤 -5.65%。",
    decision: "先用歷史資料回測驗證訊號有沒有領先性，公開版本只放合成資料的操作演示。",
    boundary: "模擬回測、非實盤績效；上線驗證仍在進行，原始資料、公式與公司環境都不公開。",
    tags: ["Python / PHP 後台", "歷史回測驗證"], demo: "demo/tcri/"
  },
  {
    id: "anc-alerts", title: "把人工盯盤的風險指標變成自動亮燈", kicker: "ANC 預警與回測平台", category: "taishin", featured: true, featureRank: 2,
    status: "台新實習 2026", visibility: "restricted", year: "2026",
    summary: "每天自動檢查資料、算出預測，再把需要注意的標的挑出來。",
    problem: "同一個指標，資料怎麼驗、預測怎麼算、什麼時候該示警，每個人手上的做法都不太一樣。",
    role: "把驗資料、算預測、分風險等級三件事固定成同一條流程，結果直接輸出成每天可看的預警清單與趨勢圖。",
    proof: "完成 178 檔標的的歷史驗證；從資料進來到預警產出，整段流程可以原樣重跑。",
    decision: "刻意用最保守的預測基線搭配明確的預警規則，不把回測結果講成即時訊號。低 ANC 的抓取率約 0.543，是仍在改進中的指標。",
    boundary: "不宣稱即時性；公開頁不含任何公司、代號、資料列或內部連線。",
    tags: ["資料驗證流程", "風險分級規則"]
  },
  {
    id: "marketvault", title: "讓四個系統看到同一份市場資料", kicker: "MarketVault 市場資料管線", category: "taishin", featured: true, featureRank: 3,
    status: "台新實習 2026", visibility: "private", year: "2026",
    summary: "一份可追溯、可重跑、時間點一致的市場資料，給多個應用共用。",
    problem: "每個應用各自抓資料，同一檔股票在不同畫面上會出現不同數字，事後也查不出是哪一步錯的。",
    role: "設計集中儲存與每日更新的流程，替每筆資料記下來源與時間，並開放唯讀介面給下游取用；實習期間延伸支援交易室市場資料需求。",
    proof: "目前有四個應用共用同一份資料；同一天的更新重跑不會產生重複或不一致。",
    decision: "用 PostgreSQL 集中儲存、DuckDB 做分析查詢，下游一律只透過唯讀介面取用，避免有人直接改到來源。",
    boundary: "資料庫、檔案、憑證與執行紀錄都不公開。",
    tags: ["PostgreSQL / DuckDB", "資料來源追溯"]
  },
  {
    id: "edge-validator", title: "先分辨這條回測曲線是實力還是運氣", kicker: "Edge Validator", category: "research", featured: true, featureRank: 4,
    status: "公開工具", visibility: "public", year: "2026",
    summary: "用統計檢定判斷策略績效是真訊號，還是試太多次之後的幸運值。",
    problem: "策略試一百次，總會有幾條曲線很漂亮；但漂亮不代表下一次還會贏。",
    role: "把幾種常用的過度擬合檢定包成同一個工具，上傳績效資料就能得到一份「這條曲線經不經得起考驗」的判讀。",
    proof: "工具已公開可直接使用，計算全在瀏覽器內完成，同一套計算程式有 142 項測試把關。",
    decision: "納入 DSR、PBO/CSCV、SPA、StepM、交易成本壓力與隨機重排；同一份 Python 引擎同時跑在瀏覽器（Pyodide）與測試環境，確保兩邊算出同一個結果。",
    boundary: "研究驗證工具，不提供投資建議；上傳的檔案不會離開瀏覽器。",
    tags: ["瀏覽器內計算", "統計檢定"], image: "assets/edge-validator.png", imageAlt: "Edge Validator 深色首頁，詢問策略是真實訊號還是雜訊擬合", demo: "https://hades60414-sys.github.io/edge-validator/", link: "https://github.com/hades60414-sys/edge-validator"
  },
  {
    id: "chat-stock-ai", title: "用講的就能選股，不用先學篩選語法", kicker: "選股對話", category: "ai-apps", featured: true, featureRank: 5,
    status: "私人案例", visibility: "private", year: "2026",
    summary: "把模糊的投資想法，一輪一輪問成一份可以再跑一次的台股名單。",
    problem: "傳統選股器要你先知道該用哪個欄位、填哪個數字，想法還沒成形就被介面卡住。",
    role: "改成對話式介面：使用者講想法，系統反問把條件補齊，最後產出一份條件明確、隨時能重跑的名單。",
    proof: "同一套核心同時支撐兩種介面；沒有 API 金鑰也能用純規則模式操作，287 項測試全數通過。",
    decision: "AI 只負責理解模糊語意，篩選條件與最終名單一律交給確定性程式管理，避免同樣的問題得到不同答案。",
    boundary: "程式庫與市場資料維持私人，不公開資料或操作紀錄。",
    tags: ["對話式介面", "規則模式可離線"], image: "assets/chat-stock.png", imageAlt: "選股對話介面，左側為逐輪對話，右側為收斂後股票清單"
  },
  {
    id: "options-assistant", title: "把一句市場看法變成算得出風險的部位", kicker: "選擇權助手", category: "research", featured: true, featureRank: 6,
    status: "私人案例", visibility: "private", year: "2026",
    summary: "從一句市場看法生成候選策略，定價與風險全部交給程式算。",
    problem: "口語的市場看法要變成實際部位，中間的乘數、契約條款與波動口徑很容易弄錯，而弄錯就是真的賠錢。",
    role: "讓模型只負責把看法翻成候選策略，定價、風險值與部位排序全部交給程式計算，並在最後跑一遍合理性檢查。",
    proof: "內建 24 條檢查規則會攔下不合理的報價與組合，跨部位風險每次都完整重算，整體有 55 項測試。",
    decision: "採 anchor-first：先固定市場基準價再往下推導；定價用 Black-76、風險用 Greeks，最終決定權留給人。",
    boundary: "不連接真實下單，帳戶、部位與憑證皆不公開。",
    tags: ["選擇權定價", "人工最終確認"]
  },
  {
    id: "wild-alpha", title: "自動搜出的策略，一樣要通過統計審查", kicker: "wild_alpha", category: "research", status: "內部研究", visibility: "internal", year: "2026",
    summary: "自動從研究語料長出策略構想，再交給統計流程判生死。",
    problem: "搜尋越自動，越容易把試了幾千次之後的偶然結果，當成真的發現。",
    role: "建立一套研究流程：所有嘗試都登記在案，樣本外資料事先封存，最後由統計檢定決定哪一條可以往下走。",
    proof: "曾經整輪沒有任何策略通過，也主動撤回過先前的結論；固定隨機種子後每一次執行都可以重現。",
    decision: "把語料解析、策略搜尋、封存樣本外驗證、是否上線的裁決分成四個彼此獨立的階段，避免互相污染。",
    boundary: "研究仍在進行，不提供下載或公開連結。",
    tags: ["可重現研究", "封存樣本外"], image: "assets/wild-alpha.png", imageAlt: "wild_alpha 從語料解析、策略演化到統計驗證的系統架構"
  },
  {
    id: "auto-quant-btc", title: "讓自動研究跑得再快也碰不到真實下單", kicker: "auto-quant-btc", category: "research", status: "模擬研究", visibility: "internal", year: "2026",
    summary: "從資料、策略生成到回測全自動的模擬流程，刻意不接任何執行能力。",
    problem: "自動化研究若直接接上下單，只是讓過度擬合的結果更快變成真金白銀的虧損。",
    role: "把資料、策略生成、成本估計與回測串成一條可重跑的流程，並在末端加上一道人工授權才過得去的關卡。",
    proof: "所有試驗都預先登記、成本與滑價都計入，整條流程只在模擬環境執行並留下乾跑紀錄。",
    decision: "自動研究與真實執行能力完全分離，未經人工授權不會進到下一層。",
    boundary: "不公開績效、程式或連結。",
    tags: ["僅模擬環境", "風險關卡"]
  },
  {
    id: "sector-radar", title: "盤中只在真的異常時才出聲", kicker: "族群雷達", category: "research", status: "內部研究", visibility: "internal", year: "2026",
    summary: "盤前整理族群相對強弱，盤中只提示超出常態的變化。",
    problem: "交易台不缺訊號，缺的是「這一則值得抬頭看一眼」的判斷。",
    role: "先用歷史資料重放，找出不會一直誤報的門檻；通過之後才讓訊號有資格推播給人。",
    proof: "每一筆輸出都記錄了當下用的是哪個時間點的資料，以及門檻的校準結果。",
    decision: "先做歷史回放與只記錄不推播的影子運行，再決定訊號是否有資格打擾使用者。",
    boundary: "資料來源授權與測試尚待收斂，不建立公開連結。",
    tags: ["門檻校準", "唯讀資料來源"]
  },
  {
    id: "portfolio-dashboard", title: "把散在各家券商的部位收成一張表", kicker: "投資組合儀表板", category: "ai-apps", status: "私人應用", visibility: "private", year: "2026",
    summary: "整合多市場資產、匯率與歷史績效的本機工作介面。",
    problem: "資產分散在不同券商與市場時，光是把今天的總值算對就要花掉一個晚上。",
    role: "做一個本機介面整合多市場資產與匯率，並讓對帳截圖能被自動讀成欄位、由人確認後才寫進部位。",
    proof: "支援多種資產的點值換算與到期提醒；單一資料來源失效時會自動改用備援來源。",
    decision: "影像辨識只負責提出欄位建議，部位更新一定要通過規則檢查與使用者確認才算數。",
    boundary: "個人持倉、券商截圖、資料庫與模型金鑰不公開。",
    tags: ["截圖辨識輔助", "多市場資產"]
  },
  {
    id: "lab-llm-chat", title: "讓團隊用得到本地模型，又不對外裸奔", kicker: "Lab LLM Chat", category: "ai-apps", status: "私人 MVP", visibility: "private", year: "2026",
    summary: "替實驗室的本地模型加上帳號、每日額度與對話紀錄管理。",
    problem: "要讓其他人用得到實驗室的模型，最快的做法是把服務直接開到外網——那也是最危險的做法。",
    role: "在模型前面加上帳號登入、每日用量上限與對話紀錄管理，並讓服務本身只在本機監聽。",
    proof: "使用者、額度與紀錄各有明確界線；外部要用一律走需要驗證的通道。",
    decision: "應用維持只在本機監聽，外部存取只透過具驗證的通道或私有網路，不直接開放服務埠。",
    boundary: "使用者資料與各項金鑰不公開。",
    tags: ["本地模型代管", "登入與額度控管"]
  },
  {
    id: "research-radar", title: "每週把新研究整理好，要不要做由人決定", kicker: "Research Radar", category: "workflow", status: "公開工具", visibility: "public", year: "2026",
    summary: "自動抓取與整理研究進展，是否導入保留人工審核。",
    problem: "論文追著追著就變成收藏夾；但全自動照做，等於讓沒驗證過的想法直接進到生產環境。",
    role: "自動化抓取、去重與分類，把每則研究整理成一份提案，最後留一道人工核可的關卡。",
    proof: "抓取不需要任何金鑰，去重結果與待辦清單都已公開可查。",
    decision: "只有抓取與整理自動化，是否實作永遠是人的決定。",
    boundary: "工具不會自行修改其他專案。",
    tags: ["每週自動整理", "人工核可關卡"], link: "https://github.com/hades60414-sys/research-radar"
  },
  {
    id: "daily-flow", title: "把今天真的做得完的事放回正中央", kicker: "daily-flow", category: "workflow", status: "本機 PWA", visibility: "internal", year: "2026",
    summary: "只排今天、資料留在自己裝置上的待辦工作流。",
    problem: "待辦清單記得越完整，打開它就越像在看一份自己欠自己的帳單。",
    role: "改成每天只呈現今天排得進去的事，排程由固定規則計算而不靠模型猜，資料預設留在使用者的裝置上。",
    proof: "可離線安裝使用，支援自行備份與還原，有 93 項測試。",
    decision: "核心規劃刻意不依賴 AI，才能保證同樣的輸入每次得到同樣的安排。",
    boundary: "個人資料分流尚待完成，不建立公開連結。",
    tags: ["離線可用", "資料留在裝置"]
  },
  {
    id: "task-gacha", title: "讓「下一件做什麼」不再耗掉一個早上", kicker: "Task Gacha", category: "workflow", status: "私人 PWA", visibility: "private", year: "2026",
    summary: "用抽卡的方式決定下一個任務，降低選擇的成本。",
    problem: "任務一多，光是決定先做哪一件，就會先把當天的執行力用掉一半。",
    role: "把選任務做成抽卡：一次只給有限的選項與清楚的回饋，抽到哪張就開始做哪張。",
    proof: "有 111 項測試，並跑過完整的首次使用與抽卡流程驗證。",
    decision: "用有限機率與明確回饋取代無限清單，資料優先留在裝置上。",
    boundary: "程式庫維持私人，公開前的檢查尚未完成。",
    tags: ["抽卡式選擇", "離線狀態保存"], image: "assets/task-gacha.png", imageAlt: "Task Gacha 的紫色分層卡片視覺"
  }
];
