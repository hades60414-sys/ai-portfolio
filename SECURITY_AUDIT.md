# 本機連線安全稽核

日期：2026-08-28（Asia/Taipei）

## 結果

- 13 個作品的自有原始碼與目前操作文件已掃描；排除依賴套件、建置輸出、備份與大型執行資料。
- 掃描未留下「監聽所有介面」的 wildcard 位址或非 loopback 的硬編碼 HTTP IP。
- 現行專案 listener 實測均為 `127.0.0.1`：ChatStock 3000、FastAPI 8000、PostgreSQL 5433、投資組合儀表板 8502、選擇權助手 8530、Ollama 11434。
- 沒有建立或發現名為 `Local project interface *` 的 Windows 入站防火牆規則。

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

本報告不記錄任何實際密碼、token、私人 IP 或完整本機資料路徑。
