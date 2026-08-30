# 專案盤點與 GitHub 備份分級

盤點原則：只收錄自有作品與核心系統；第三方 clone、評估用 staging、下載範例、依賴套件與無關舊作不算作品。網站目前整理 13 個系統。

| 專案 | 作品集定位 | GitHub 建議 | 發佈前注意 |
|---|---|---|---|
| Edge Validator | 量化驗證產品 | 公開候選；已有 remote | 推送前再跑靜態檢查與互動測試 |
| ChatStock | 對話式 AI 選股 | 既有 private remote；工作樹乾淨且與 upstream 同步 | 不提交市場 DB、`.env`、日誌；使用者策略執行仍需強 sandbox，作品集不提供私人 repo 外鏈 |
| wild_alpha | 抗過擬合研究系統 | 私有備份優先 | 研究輸出、原始資料與論文素材要分流 |
| marketvault | 市場資料底座 | 私有 repository | 排除 DB、Parquet、備份、憑證與 `.env` |
| 投資組合儀表板 | 個人資產作業台 | 私有 repository | 個人持倉、截圖與模型金鑰不得入 Git |
| 選擇權助手 | 衍生品風控 | 私有 repository | `secrets.toml`、使用者資料、真實交易資訊不得入 Git |
| auto-quant-btc | 自主量化研究農場 | **暫停 push／一般 Git 備份** | Git 仍追蹤 ledger、positions、exchange state 與部分快取；先從 index 收斂並審查歷史，資料庫路徑保持原位、真錢三鎖不得解除 |
| 族群雷達 | 市場注意力系統 | 私有 repository | 先確認推播設定、資料授權與歷史輸出 |
| TCRI Risk Workbench | 舊系統風險現代化 | 私有／受管制 | 不上傳授權資料、公司內部 schema、帳密或排程設定 |
| Lab LLM Chat | 實驗室本地模型入口 | 私有 repository | `.env`、使用者 SQLite、JWT secret 與 provider keys 排除 |
| Research Radar | 研究工作流 | 公開候選 | 確認抓取快取與本機路徑不入 Git |
| daily-flow | local-first PWA | 程式碼可公開；資料私有 | 排除個人任務、備份與瀏覽器資料 |
| Task Gacha | 離線任務 PWA | 公開候選 | 發佈前保留 loopback dev 預設並驗證 PWA |

## 備份順序

1. 先推這個純靜態作品集。
2. 公開候選各自整理乾淨 commit，再個別公開；不要把 13 個專案混成一個 monorepo。
3. 研究、個資、金融狀態與受授權資料專案只建 private repository。
4. 對變更很多的 repository 先做本機 checkpoint commit；不要把執行狀態與原始資料一起 `git add -A`。

本輪完成本機整理、驗證與安全 checkpoint；未自動 push、建公開 repository 或部署。

## 已建立的本機 checkpoint

- `ai-portfolio`：`c928718`（初始安全 checkpoint）、`5ef1bc2`（個人故事整合 checkpoint；後續文件與 QA 調整以 `git log` 為準）
- `Chat-Stock-AI`：`650a5eb`（工作樹乾淨，`feature/strategy-stack` 與既有 upstream 同步）
- `投資組合儀表板`：`143fd20`（另有忽略規則 checkpoint `ca4fb4b`）
- `選擇權助手`：`210a080`
- `task-gacha`：`c814852`
- `research-radar`：`8dce654`
- `marketvault`：`0fef47c`
- `TCRI_CMONEY`：`5f8c01b`
- `lab-llm-chat`：`408aba7`
- `wild_alpha`：`1505a49`（只提交忽略規則；研究工作樹仍保留未提交）
- `auto-quant-btc`：`252f9f4`（只提交忽略規則；研究與執行狀態仍保留未提交）

`daily-flow` 與 Edge Validator 仍有使用者工作樹變更；`wild_alpha`、`auto-quant-btc` 也保留大量研究或執行中變更。這些內容沒有為了「看起來乾淨」而混入自動 commit。族群雷達原本就是乾淨 repository。

> **auto-quant-btc 阻擋條件：** `exec_state/ledger.sqlite`、`exec_state/positions.json`、`exec_state/dry_exchange.json` 目前仍受 Git 追蹤；部分 `_data_cache/`、`__pycache__/` 檔案也因先前已入 index，不會只靠 `.gitignore` 自動消失。完成 index 與歷史審查前，不可 push、不可建立一般 GitHub 備份，也不可移動原資料庫路徑或解除真錢交易鎖。
