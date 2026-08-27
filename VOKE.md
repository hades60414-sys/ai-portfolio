# VOKE：續跑與交接

## 喚醒語

把這句貼回同一個 Codex task：

> 繼續 AI 作品集夜班：先讀 ai-portfolio/VOKE.md、PROJECT_INVENTORY.md、SECURITY_AUDIT.md 與各 repo 最新 git status；從未完成的安全項目往下做，不要重做已驗證項目，不要 push/deploy，不要解開真錢鎖。

## 自動續跑

已建立同一 task 的心跳自動化「AI 作品集夜班續跑」，每 5 分鐘檢查一次；目標完成後應停用。電腦必須保持開機且 Codex app 持續執行，才能處理本機檔案。

## 每輪先做

1. 檢查 `%USERPROFILE%\.claude\halt\all.now` 與專案 halt flag。
2. 讀最新 git status，保留既有未提交變更。
3. 只做一個可驗證的原子循環：inspect → implement → verify → checkpoint。
4. 遠端公開、GitHub push、部署、憑證輪替與真錢功能仍是人工 gate。

## 目前 checkpoint

- 靜態作品集、13 個專案資料、GRILL 互動、響應式版面與零外部資源政策已完成。
- 主要網路暴露已改為 loopback + authenticated tunnel 模式，現行 listener 已實測無非 loopback 綁定。
- 已為作品集、Task Gacha、Research Radar、marketvault、TCRI 與 Lab LLM Chat 建立本機 checkpoint commit；尚未設定新 remote 或 push。
- 下一個安全工作是 GitHub 備份分批推送；先公開作品集，再逐一處理公開候選與 private repository。ChatStock、投資組合儀表板、選擇權助手、wild_alpha、auto-quant-btc、daily-flow 與 Edge Validator 仍有使用者／執行中變更，不可直接 `git add -A`。
