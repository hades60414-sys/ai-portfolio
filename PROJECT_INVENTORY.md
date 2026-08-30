# 專案盤點與 GitHub 備份分級

盤點原則：只收錄自有作品與核心系統；第三方 clone、評估用 staging、下載範例、依賴套件與無關舊作不算作品。網站目前整理 13 個系統。以下遠端狀態於 2026-08-31（Asia/Taipei）以 GitHub API 唯讀複驗。

| 專案 | 作品集定位 | GitHub／checkpoint 現況 | 邊界與下一步 |
|---|---|---|---|
| Edge Validator | 量化驗證產品 | **public** `hades60414-sys/edge-validator`，遠端 `master` = `bba2c29` | R23 缺值壓力測試已收口，142 tests 與遠端 engine CI 通過；此 repo 既有 legacy Pages 綁 `master`，任何後續 push 都等同部署，必須先取得明確授權 |
| ChatStock | 對話式 AI 選股 | **private** `hades60414-sys/Chat-Stock-AI`；`feature/strategy-stack` 本機與遠端同為 `650a5eb` | 不提交市場 DB、`.env`、日誌；作品集不提供私人 repo 外鏈 |
| wild_alpha | 抗過擬合研究系統 | 未建遠端；本機 `1505a49`，仍有 36 筆研究／執行中變更 | **阻擋 GitHub**：研究輸出、原始資料、論文素材與未追蹤 local-only 包尚待逐檔分流 |
| marketvault | 市場資料底座 | **private** `hades60414-sys/marketvault`，遠端 `main` = `0fef47c` | 已以 Git 追蹤內容備份；DB、Parquet、備份、憑證與 `.env` 不在上傳範圍 |
| 投資組合儀表板 | 個人資產作業台 | **private** `hades60414-sys/portfolio-dashboard`，遠端 `ui-polish-auto` = `143fd20` | 個人持倉、截圖、資料庫與模型金鑰不得入 Git |
| 選擇權助手 | 衍生品風控 | **private** `hades60414-sys/options-assistant`，遠端 `ui-polish-auto` = `210a080` | `secrets.toml`、使用者資料、資料庫與真實交易資訊不得入 Git |
| auto-quant-btc | 自主量化研究農場 | 未建遠端；本機 `252f9f4`，仍有 150 筆變更 | **阻擋 GitHub／一般 Git 備份**：Git 仍追蹤 ledger、positions、exchange state 與部分快取；資料庫路徑保持原位、真錢三鎖不得解除 |
| 族群雷達 | 市場注意力系統 | 未建遠端；本機 `62fe911`、工作樹乾淨 | **阻擋原 repo 上傳**：seed JSON 的來源／授權需確認，commit metadata 與 tracked 本機路徑需收斂，先前 live test 尚有 1 項失敗；若備份只能建立去歷史、人工確認資料來源的 private snapshot |
| TCRI Risk Workbench | 舊系統風險現代化 | 未建遠端；本機 `5f8c01b`、工作樹乾淨 | **阻擋 GitHub**：涉及 CMoney schema／公式與可能的教授或公司授權邊界，取得書面授權前不建立遠端，即使是 private 也不例外 |
| Lab LLM Chat | 實驗室本地模型入口 | **private** `hades60414-sys/lab-llm-chat`，遠端 `main` = `408aba7` | 已以 Git 追蹤內容備份；`.env`、使用者 SQLite、JWT secret 與 provider keys 排除 |
| Research Radar | 研究工作流 | **public** `hades60414-sys/research-radar`，遠端 `main` = `9070e31` | arXiv API 已改用 HTTPS；抓取快取與本機路徑不入 Git |
| daily-flow | local-first PWA | 未建遠端；本機 `cd25441`，仍有 13 筆變更 | **暫停 GitHub**：先拆分程式碼與個人任務／備份／瀏覽器資料，再重新 preflight |
| Task Gacha | 離線任務 PWA | **private** `hades60414-sys/task-gacha`，遠端 `merge-parallel-auto` = `103324d` | lint 0、111 tests、build 與桌面 onboarding／抽卡 smoke 通過；**暫停公開**：Google Forms 回饋入口、Google Fonts 外連，以及行動版／Shop／主題切換尚待完整 QA |

## 已驗證的 GitHub 備份

- **公開**：`ai-portfolio`（`main` 與遠端同步，最新精確值以 Git／GitHub Actions 為準）、Edge Validator `bba2c29`、Research Radar `9070e31`。
- **私人**：ChatStock `feature/strategy-stack` `650a5eb`、marketvault `0fef47c`、投資組合儀表板 `143fd20`、選擇權助手 `210a080`、Lab LLM Chat `408aba7`、Task Gacha `103324d`。
- `ai-portfolio` 本機 `main` 與 `origin/main` 同步；最新 `validate` 必須成功才算完成 checkpoint。
- 上述「私人」只代表遠端可恢復 checkpoint，不代表可公開，也不代表忽略的 DB、`.env`、憑證、日誌、原始資料或 runtime state 已上傳。

## 本機封存與未完成邊界

1. 桌面 `張大恒專案` 的可恢復封存仍是第二層備份；GitHub 不取代 local-only zip、dirty patch、Git bundle 與資料庫原址。
2. `ai-portfolio` 與 Research Radar 封存已用新 staging 原子刷新；精確封裝 HEAD 以 `張大恒專案/00_整理說明/PACKAGES.csv` 為準，且必須分別等於來源 HEAD。每次新 commit 後都要重新核對，不可混入舊產物。
3. `daily-flow`、`wild_alpha`、`auto-quant-btc` 的使用者變更保持原樣，沒有為了「看起來乾淨」而自動 commit／push。
4. 族群雷達與 TCRI 即使工作樹乾淨，也分別受資料來源與書面授權邊界阻擋；乾淨不等於可上傳。
5. 新公開 repository、private→public、Pages／部署、憑證輪替、資料庫搬移與真錢功能都不是自動備份步驟。Edge Validator 是已知例外：既有 legacy Pages 會由 `master` push 自動觸發，因此未取得部署授權前不得再推該分支。

> **auto-quant-btc 阻擋條件：** `exec_state/ledger.sqlite`、`exec_state/positions.json`、`exec_state/dry_exchange.json` 目前仍受 Git 追蹤；部分 `_data_cache/`、`__pycache__/` 檔案也因先前已入 index，不會只靠 `.gitignore` 自動消失。完成 index 與歷史審查前，不可 push、不可建立一般 GitHub 備份，也不可移動原資料庫路徑或解除真錢交易鎖。
