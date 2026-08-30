# VOKE：續跑與交接

## 喚醒語

把這句貼回同一個 Codex task：

> 繼續 AI 作品集夜班：先讀 ai-portfolio/VOKE.md、PROJECT_INVENTORY.md、SECURITY_AUDIT.md 與各 repo 最新 git status；從未完成的安全項目往下做，不要重做已驗證項目。只有精確 Git archive 通過秘密／私人 IP／tracked DB／歷史檢查且分級無疑義時，才能續做既定 GitHub 備份；不要部署、開 Pages、把 private 改 public、搬資料庫、提交 runtime／秘密或解開真錢鎖。

## 自動續跑

同一 task 可用心跳自動化「AI 作品集夜班續跑」恢復工作；只在仍有未完成檢查時啟用，目標完成後停用。若要再次自主續跑，可用上面的喚醒語恢復。處理本機檔案時，電腦必須保持開機且 Codex app 持續執行。

## 每輪先做

1. 檢查 `%USERPROFILE%\.claude\halt\all.now` 與專案 halt flag。
2. 讀最新 git status，保留既有未提交變更。
3. 只做一個可驗證的原子循環：inspect → implement → verify → checkpoint。
4. 新公開 repository、private→public、部署／Pages、憑證輪替、資料庫搬移與真錢功能仍是人工 gate；既定安全備份也必須先對精確待推內容 fail-closed preflight。

## 目前 checkpoint

- 靜態作品集、13 個專案資料、GRILL 互動、響應式版面與零外部資源政策已完成。
- 主要網路暴露已改為 loopback + authenticated tunnel 模式，現行 listener 已實測無非 loopback 綁定。
- 公開備份已核對：`ai-portfolio` 的 `main` 與遠端同步且最新 GitHub Actions 成功、Edge Validator `7e68e79`、Research Radar `9070e31`。ChatStock 實際為 private；其 `feature/strategy-stack` 本機與遠端同為 `650a5eb`，作品集不輸出私人 repo 外鏈。
- 私人備份已核對：marketvault `0fef47c`、投資組合儀表板 `143fd20`、選擇權助手 `210a080`、Lab LLM Chat `408aba7`。這些只上傳 Git 追蹤內容；忽略的 DB、`.env`、憑證、日誌、原始資料與 runtime state 未納入。
- Edge Validator 本機仍有 3 筆既有變更、`daily-flow` 13 筆、`wild_alpha` 36 筆、`auto-quant-btc` 150 筆；均未自動提交或推送。`auto-quant-btc` 的 ledger、positions、exchange state 與部分快取仍受 Git 追蹤，完成 index／歷史收斂前不可 push 或做一般 GitHub 備份；不可移動資料庫路徑，也不可解除真錢三鎖。
- Task Gacha 暫停公開：lint 仍有 17 errors／2 warnings，package scripts 沒有 test；族群雷達受 seed 資料來源、metadata／本機路徑與 1 項 live test 失敗阻擋；TCRI 在取得教授／公司書面授權前不建立任何 GitHub 遠端。
- 本機封存已原子刷新並完成 `PACKAGES.csv`／`SHA256SUMS.txt`、normal + deep verify 與 restore test；每次作品集新 commit 後仍須確認封裝 HEAD 與來源 HEAD 完全一致。之後再處理 Edge dirty 變更與其餘阻擋項目；若事實未變，不製造無意義 commit。
