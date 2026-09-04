// kicker = 專案名稱（識別用小字），title = 成果標題（直接講解決了什麼）
// problem → role → proof 三欄構成三句故事：當時的困境 → 我做了什麼 → 現在的結果
// 技術細節與測試數只放 decision 與 tags，它們只在展開的案例摘要裡出現
export const projects = [
  {
    id: "tcri-workbench", title: "讓信用風險提早 34 天被看見", kicker: "TCRI 信用風險預警平台", category: "taishin", featured: true, featureRank: 1,
    status: "台新實習", visibility: "private", year: "2026",
    problem: "等到信評被調降，市場多半已經反應完了；風險單位想更早知道，但線索散在一份份財報裡。",
    role: "把歷年財報與信評變動放在一起比對，做出一套會提前亮燈的風險分級畫面。",
    proof: "訊號平均比 TCRI 調評早 34 天亮燈；依此訊號建構的樣本外回測年化 +7.38%、最大回撤 -5.65%。",
    decision: "先用歷史資料回測驗證訊號的領先性，公開版本只放合成資料的操作演示。原始資料、公式與公司環境不公開。",
    boundary: "模擬回測、非實盤績效，上線驗證仍在進行。",
    tags: ["Python / PHP 後台", "歷史回測驗證"], demo: "demo/tcri/"
  },
  {
    id: "anc-alerts", title: "把人工盯盤的風險指標變成自動亮燈", kicker: "ANC 預警與回測平台", category: "taishin", featured: true, featureRank: 2,
    status: "台新實習", visibility: "private", year: "2026",
    problem: "同一個指標，資料怎麼驗、預測怎麼算、什麼時候該示警，每個人的做法都不太一樣。",
    role: "把驗資料、算預測、分風險等級固定成同一條流程，每天輸出一份預警清單。",
    proof: "完成 178 檔標的的歷史驗證；從資料進來到預警產出，整段流程可以原樣重跑。",
    decision: "ANC 是一種每股淨值比類的財務指標。刻意用最保守的預測基線搭配明確的預警規則，不把回測結果講成即時訊號；最低分組裡實際出問題的標的目前約抓到一半，仍在改進。",
    boundary: "不宣稱即時性，公開頁不含公司、代號或內部連線。",
    tags: ["資料驗證流程", "風險分級規則"]
  },
  {
    id: "marketvault", title: "讓四個系統看到同一份市場資料", kicker: "MarketVault 市場資料管線", category: "taishin", featured: true, featureRank: 3,
    status: "台新實習", visibility: "private", year: "2026",
    problem: "每個應用各自抓資料，同一檔股票在不同畫面上會出現不同數字，事後查不出哪一步錯。",
    role: "設計集中儲存與每日更新的流程，替每筆資料記下來源與時間，只開放唯讀取用。",
    proof: "四個下游應用改用同一份資料；有了來源時戳，數字兜不攏時查得出是哪一步的問題。",
    decision: "用 PostgreSQL 集中儲存、DuckDB 做分析查詢，下游只走唯讀介面，避免有人改到來源；實習期間延伸支援交易室市場資料需求。",
    boundary: "資料庫、檔案、憑證與執行紀錄都不公開。",
    tags: ["PostgreSQL / DuckDB", "資料來源追溯"]
  },
  {
    id: "edge-validator", title: "先分辨這條回測曲線是實力還是運氣", kicker: "Edge Validator", category: "research", featured: true, featureRank: 4,
    status: "公開可試用", visibility: "public", year: "2026",
    problem: "策略試一百次，總會有幾條曲線很漂亮；但漂亮不代表下一次還會贏。",
    role: "把常用的過度擬合檢定包成同一個工具，上傳績效資料就能得到一份判讀。",
    proof: "工具已公開，任何人上傳自己的績效曲線都能當場得到判讀，檔案不離開瀏覽器。",
    decision: "納入 DSR、PBO/CSCV、SPA、StepM、交易成本壓力與隨機重排；同一份 Python 引擎同時跑在瀏覽器（Pyodide）與測試環境，142 項測試確保兩邊算出同一個結果。",
    boundary: "研究驗證工具，不提供投資建議。",
    tags: ["瀏覽器內計算", "統計檢定"], image: "assets/edge-validator.png", imageAlt: "Edge Validator 深色首頁，詢問策略是真實訊號還是雜訊擬合", demo: "https://hades60414-sys.github.io/edge-validator/", link: "https://github.com/hades60414-sys/edge-validator"
  },
  {
    id: "chat-stock-ai", title: "用講的就能選股，不用先學篩選語法", kicker: "選股對話", category: "ai-apps", featured: true, featureRank: 5,
    status: "私人專案", visibility: "private", year: "2026",
    problem: "傳統選股器要你先知道該用哪個欄位、填哪個數字，想法還沒成形就被介面卡住。",
    role: "改成對話：使用者講想法，系統反問把條件補齊，最後產出一份明確的名單。",
    proof: "同一份想法重跑會得到同一份名單；沒有金鑰時也能用純規則模式操作。",
    decision: "AI 只負責理解模糊語意，篩選條件與最終名單交給確定性程式管理，避免同樣的問題得到不同答案；同一套核心同時支撐兩種介面，287 項測試全數通過。",
    boundary: "程式庫與市場資料維持私人。",
    tags: ["對話式介面", "規則模式可離線"], image: "assets/chat-stock.png", imageAlt: "選股對話介面，左側為逐輪對話，右側為收斂後股票清單"
  },
  {
    id: "options-assistant", title: "把一句市場看法變成算得出風險的部位", kicker: "選擇權助手", category: "research", featured: true, featureRank: 6,
    status: "私人專案", visibility: "private", year: "2026",
    problem: "口語的市場看法要變成實際部位，中間的乘數與條款很容易弄錯，弄錯就是賠錢。",
    role: "讓模型只負責翻成候選策略，定價、風險與排序全部交給程式算。",
    proof: "內建 24 條檢查規則會攔下不合理的報價與組合，跨部位風險每次都完整重算。",
    decision: "採 anchor-first：先固定市場基準價再往下推導；定價用 Black-76、風險用 Greeks，最終決定權留給人；55 項測試涵蓋定價與規則。",
    boundary: "不連接真實下單，帳戶與部位皆不公開。",
    tags: ["選擇權定價", "人工最終確認"]
  },
  {
    id: "wild-alpha", title: "自動搜出的策略，一樣要通過統計審查", kicker: "wild_alpha", category: "research", status: "私人專案", visibility: "private", year: "2026",
    problem: "搜尋越自動，越容易把試了幾千次之後的偶然結果，當成真的發現。",
    role: "所有嘗試都登記在案，樣本外資料事先封存，最後由統計檢定決定誰能往下走。",
    proof: "曾經整輪沒有任何策略通過，也主動撤回過先前的結論；每一次執行都可以重現。",
    decision: "把語料解析、策略搜尋、封存樣本外驗證、是否上線的裁決分成四個彼此獨立的階段，避免互相污染；固定隨機種子讓每次執行可重跑。",
    boundary: "研究仍在進行，不提供下載或公開連結。",
    tags: ["可重現研究", "封存樣本外"], image: "assets/wild-alpha.png", imageAlt: "wild_alpha 從語料解析、策略演化到統計驗證的系統架構"
  },
  {
    id: "auto-quant-btc", title: "讓自動研究跑得再快也碰不到真實下單", kicker: "auto-quant-btc", category: "research", status: "私人專案", visibility: "private", year: "2026",
    problem: "自動化研究若直接接上下單，只是讓過度擬合的結果更快變成真金白銀的虧損。",
    role: "把資料、策略生成、成本估計與回測串成一條流程，末端加一道人工授權的關卡。",
    proof: "所有試驗都預先登記、成本與滑價都計入，整條流程只在模擬環境執行。",
    decision: "自動研究與真實執行能力完全分離，未經人工授權不會進到下一層，每次乾跑都留紀錄。",
    boundary: "不公開績效、程式或連結。",
    tags: ["僅模擬環境", "風險關卡"]
  },
  {
    id: "sector-radar", title: "盤中只在真的異常時才出聲", kicker: "族群雷達", category: "research", status: "私人專案", visibility: "private", year: "2026",
    problem: "交易台不缺訊號，缺的是「這一則值得抬頭看一眼」的判斷。",
    role: "先用歷史資料重放，找出不會一直誤報的門檻，通過了才讓訊號有資格推播。",
    proof: "每一筆輸出都記錄了當下用的是哪個時間點的資料，以及門檻的校準結果。",
    decision: "先做歷史回放與只記錄不推播的影子運行，再決定訊號是否有資格打擾使用者。",
    boundary: "資料來源授權與測試尚待收斂，不建立公開連結。",
    tags: ["門檻校準", "唯讀資料來源"]
  },
  {
    id: "portfolio-dashboard", title: "把散在各家券商的部位收成一張表", kicker: "投資組合儀表板", category: "ai-apps", status: "私人專案", visibility: "private", year: "2026",
    problem: "資產分散在不同券商與市場時，光是把今天的總值算對就要花掉一個晚上。",
    role: "做一個本機介面整合多市場資產與匯率，對帳截圖由人確認後才寫進部位。",
    proof: "支援多種資產的點值換算與到期提醒；單一資料來源失效時會自動改用備援。",
    decision: "影像辨識只負責提出欄位建議，部位更新一定要通過規則檢查與使用者確認才算數。",
    boundary: "個人持倉、券商截圖與各項金鑰不公開。",
    tags: ["截圖辨識輔助", "多市場資產"]
  },
  {
    id: "lab-llm-chat", title: "讓團隊用得到本地模型，又不對外裸奔", kicker: "Lab LLM Chat", category: "ai-apps", status: "私人專案", visibility: "private", year: "2026",
    problem: "要讓其他人用得到實驗室的模型，最快的做法是把服務直接開到外網——那也是最危險的做法。",
    role: "在模型前面加上帳號登入、每日用量上限與紀錄管理，服務本身只在本機監聽。",
    proof: "誰能用、能用多少、用過什麼都有明確界線；外部要用一律走需要驗證的通道。",
    decision: "應用維持只在本機監聽，外部存取只透過具驗證的通道或私有網路，不直接開放服務埠。",
    boundary: "使用者資料與各項金鑰不公開。",
    tags: ["本地模型代管", "登入與額度控管"]
  },
  {
    id: "research-radar", title: "每週把新研究整理好，要不要做由人決定", kicker: "Research Radar", category: "workflow", status: "公開可試用", visibility: "public", year: "2026",
    problem: "論文追著追著就變成收藏夾；但全自動照做，等於讓沒驗證過的想法直接進到生產環境。",
    role: "自動抓取、去重與分類，把每則研究整理成一份提案，最後留一道人工核可。",
    proof: "抓取不需要任何金鑰，去重結果與待辦清單都已公開可查。",
    decision: "只有抓取與整理自動化，是否實作永遠是人的決定。",
    boundary: "工具不會自行修改其他專案。",
    tags: ["每週自動整理", "人工核可關卡"], link: "https://github.com/hades60414-sys/research-radar"
  },
  {
    id: "daily-flow", title: "把今天真的做得完的事放回正中央", kicker: "daily-flow", category: "workflow", status: "私人專案", visibility: "private", year: "2026",
    problem: "待辦清單記得越完整，打開它就越像在看一份自己欠自己的帳單。",
    role: "改成每天只呈現今天排得進去的事，排程由固定規則算，不靠模型猜。",
    proof: "自用中，可離線安裝、資料留在裝置上，也能自行備份與還原。",
    decision: "核心規劃刻意不依賴 AI，才能保證同樣的輸入每次得到同樣的安排；93 項測試涵蓋排程與備份還原。",
    boundary: "個人資料分流尚待完成，不建立公開連結。",
    tags: ["離線可用", "資料留在裝置"]
  },
  {
    id: "task-gacha", title: "讓「下一件做什麼」不再耗掉一個早上", kicker: "Task Gacha", category: "workflow", status: "私人專案", visibility: "private", year: "2026",
    problem: "任務一多，光是決定先做哪一件，就會先把當天的執行力用掉一半。",
    role: "把選任務做成抽卡：一次只給有限的選項與清楚的回饋，抽到哪張就做哪張。",
    proof: "自用中，離線也能抽，抽完的狀態會留在裝置上。",
    decision: "用有限機率與明確回饋取代無限清單，資料優先留在裝置上；111 項測試涵蓋首次使用與抽卡流程。",
    boundary: "程式庫維持私人，公開前的檢查尚未完成。",
    tags: ["抽卡式選擇", "離線狀態保存"], image: "assets/task-gacha.png", imageAlt: "Task Gacha 的紫色分層卡片視覺"
  }
];
