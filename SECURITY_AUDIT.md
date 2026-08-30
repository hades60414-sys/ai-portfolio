# 本機連線安全稽核

初次稽核：2026-08-28；最近複驗：2026-08-31（Asia/Taipei）

## 結果

- 13 個作品的自有原始碼與目前操作文件已掃描；排除依賴套件、建置輸出、備份與大型執行資料。
- 掃描未留下「監聽所有介面」的 wildcard 位址或非 loopback 的硬編碼 HTTP IP。
- 現行專案 listener 實測均為 `127.0.0.1`：ChatStock 3000、FastAPI 8000、PostgreSQL 5433、投資組合儀表板 8502、選擇權助手 8530、Ollama 11434。
- 沒有建立或發現名為 `Local project interface *` 的 Windows 入站防火牆規則。
- 作品集以 390×844 與 1440×900 真實瀏覽器複驗：沒有橫向溢位，dialog 會鎖住背景捲動，Esc 關閉後焦點回到原觸發按鈕。
- 完整頁面只請求 10 個 `127.0.0.1:4173` 同源靜態資源，全部回應 200；瀏覽器主控台為 0 error、0 warning。
- `npm test` 10/10 通過（含非 loopback 綁定拒絕與媒體簽章檢查）；`npm run check` 確認 13 個專案、24 個 repository files，未發現明顯秘密或不安全 IP literal。
- 對外專案連結只指向已由 GitHub API 確認為 public 的 repository；ChatStock 實際為 private，因此作品集僅展示案例、不輸出會讓訪客撞 404 的私人外鏈。
- 瀏覽器複驗確認 TCRI 素材以正確 `image/jpeg` + `nosniff` 回應；首頁與 404 都帶 CSP `frame-ancestors 'none'`、`X-Frame-Options: DENY`、Permissions-Policy、COOP/CORP 與 Referrer-Policy。

## GitHub 備份邊界複驗

- 公開遠端：`ai-portfolio`（`main` 與遠端同步，最新 `validate` 成功）、Edge Validator `bba2c29`、Research Radar `9070e31`。
- 私人遠端：ChatStock `feature/strategy-stack` `650a5eb`、marketvault `0fef47c`、投資組合儀表板 `143fd20`、選擇權助手 `210a080`、Lab LLM Chat `408aba7`、Task Gacha `103324d`。
- GitHub API 已重新確認 ChatStock 與上述四個新備份皆為 private；沒有把 private 改 public。備份只涵蓋通過 preflight 的 Git 追蹤快照，不涵蓋忽略的 DB、`.env`、秘密、日誌或 runtime state。
- Edge Validator 的 R23 缺值壓力收斂通過 142 tests 與 engine CI；Task Gacha 通過 lint、111 tests、build 與桌面抽卡 smoke，並只建立 private 備份。族群雷達、TCRI、`auto-quant-btc`、`wild_alpha`、`daily-flow` 維持阻擋或暫停，詳見 `PROJECT_INVENTORY.md`。

### Edge Validator 既有 Pages 邊界

- 該 repository 原先已有 legacy Pages，來源為 `master`／root；因此一般 Git push 也會自動觸發公開部署。
- `bba2c29` 推送後立刻取消 Pages workflow，但 build 在取消前已完成並更新線上內容。新內容是通過 142 tests、0/0 preflight 的安全程式碼，沒有上傳秘密；取消後也沒有殘留中的 run。
- 未自行停用或回滾既有網站，避免在沒有使用者選擇時讓既有公開 URL 失效。後續對 Edge Validator 的 push 必須視為部署動作並先取得明確授權。

## 已完成改造

| 系統 | 舊風險 | 現在的預設 |
|---|---|---|
| ChatStock | 瀏覽器直連 API、服務監聽所有網卡、CORS 全開 | Next.js 同源 `/api/v3/*` proxy；API/前端 loopback；CORS 白名單 |
| ChatStock watchdog / deploy | 重啟時可能再次公開 port | 啟動器強制 `127.0.0.1`，遇到既有非 loopback listener 直接中止 |
| 投資組合儀表板 | Streamlit CORS/XSRF 關閉、所有網卡可連 | loopback + CORS/XSRF；遠端只接受 named tunnel + Access 確認 |
| 選擇權助手 | 同上 | loopback + CORS/XSRF；遠端只接受 named tunnel + Access 確認 |
| Task Gacha | Vite dev server 綁所有網卡 | `127.0.0.1` |
| Lab LLM Chat | 文件建議把 app 綁所有網卡給 Tailscale | app 保持 loopback，改由 Tailscale Serve 或具 Access 的 named tunnel 代理 |
| marketvault | MySQL helper 內含主機與明文密碼；PostgreSQL 密碼有程式預設 | MySQL 全改環境注入，遠端直連需明確確認 + CA；PostgreSQL 密碼無程式預設 |
| TCRI | MSSQL 主機／帳密硬編碼，允許不安全憑證預設 | 全部環境注入；預設加密並驗證憑證；不加密需明確開關 |

## 仍需人工處理

1. 立即輪替曾出現在 `marketvault/scripts/inventory_mysql.py` 的兩組 MySQL 帳密；從檔案刪除不會讓舊憑證失效。
2. 輪替 marketvault 目前的本機 PostgreSQL 密碼，並同步更新忽略的 `.env`。本輪沒有自動改 DB role，以免讓四個下游服務同時斷線。
3. 建立 Cloudflare named tunnel 前先配置 Access policy；禁止使用無驗證 quick tunnel，禁止公開 3000、8000、8502、8530、5433 或 11434。
4. GitHub push 前逐 repository 檢查 staged diff；已有大量執行狀態的專案不可直接 `git add -A`。
5. `auto-quant-btc` 目前仍追蹤 `exec_state/ledger.sqlite`、`positions.json`、`dry_exchange.json` 與部分快取；index／歷史完成收斂前禁止 push 或一般 GitHub 備份。資料庫路徑保持原位，真錢三鎖保持關閉。

本報告不記錄任何實際密碼、token、私人 IP 或完整本機資料路徑。
