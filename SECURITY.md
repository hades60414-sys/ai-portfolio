# Security policy

此 repository 是純靜態作品集，不需要 API key、資料庫或後端服務。

## 發佈前

```powershell
npm run check
git status --short
git diff --cached
```

確認沒有 `.env`、私鑰、憑證、資料庫、日誌、真實主機位址或含私人資料的截圖。若曾誤提交 secret，不要只刪檔：先撤銷／換發 secret，再清理 Git 歷史。

## 連結到其他專案

只有已確認公開的 GitHub repository 才能放可點擊連結。需要從外部存取本機服務時，服務應預設綁定 loopback，並透過有身分驗證的 HTTPS ingress 或私有網路提供存取；不要把應用或模型服務的 port 直接轉發到公網。
