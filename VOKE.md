# VOKE：續跑與交接

## 喚醒語

把這句貼回同一個 Codex task：

> 繼續 AI 作品集夜班：先讀 ai-portfolio/VOKE.md、PROJECT_INVENTORY.md、SECURITY_AUDIT.md 與各 repo 最新 git status；從未完成的安全項目往下做，不要重做已驗證項目，不要 push/deploy，不要解開真錢鎖。

## 自動續跑

同一 task 可用心跳自動化「AI 作品集夜班續跑」恢復工作；只在仍有未完成檢查時啟用，目標完成後停用。若要再次自主續跑，可用上面的喚醒語恢復。處理本機檔案時，電腦必須保持開機且 Codex app 持續執行。

## 每輪先做

1. 檢查 `%USERPROFILE%\.claude\halt\all.now` 與專案 halt flag。
2. 讀最新 git status，保留既有未提交變更。
3. 只做一個可驗證的原子循環：inspect → implement → verify → checkpoint。
4. 遠端公開、GitHub push、部署、憑證輪替與真錢功能仍是人工 gate。

## 目前 checkpoint

- 靜態作品集、13 個專案資料、GRILL 互動、響應式版面與零外部資源政策已完成。
- 主要網路暴露已改為 loopback + authenticated tunnel 模式，現行 listener 已實測無非 loopback 綁定。
- 作品集已推送到公開 `hades60414-sys/ai-portfolio`，GitHub Actions 驗證成功。ChatStock 已與既有 private upstream 同步，作品集不提供該私人 repository 的外鏈；其餘專案仍依公開／私有分級逐一 preflight。
- `wild_alpha` 與 `auto-quant-btc` 只 checkpoint 安全的忽略規則，原有研究／執行狀態仍留在工作樹；`daily-flow` 與 Edge Validator 的既有變更也未自動提交。`auto-quant-btc` 的 ledger、positions、exchange state 與部分快取仍受 Git 追蹤，完成 index／歷史收斂前不可 push 或做一般 GitHub 備份；不可移動資料庫路徑，也不可解除真錢三鎖。
- 下一步是只推通過現況與歷史掃描的公開候選；含舊憑證歷史、tracked DB、runtime state 或 dirty tree 的專案維持阻擋，私有備份優先採去歷史的安全 snapshot。
