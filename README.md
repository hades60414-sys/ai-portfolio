# HADES — AI × Quant Systems Portfolio

這是從本機專案盤點整理出的靜態作品集。重點不是列出所有資料夾，而是把自有系統整理成清楚的四條能力主線：AI 產品、量化／風控、資料基礎設施、工作流產品。

## 本機預覽

需求：Node.js 20 以上，不需要安裝任何套件。

```powershell
npm run check
npm test
npm run dev
```

瀏覽器開啟 `http://127.0.0.1:4173`。

## GitHub Pages

網站沒有建置步驟，可以直接從 repository root 發佈：

1. 建立新的 GitHub repository。
2. 推送前先執行 `npm run check` 與 `npm test`。
3. 在 GitHub 的 **Settings → Pages** 選擇 **Deploy from a branch**，branch 選 `main`，資料夾選 `/ (root)`。

尚未經本人確認公開的專案只顯示 `LOCAL / PRIVATE REPOSITORY`，不會產生本機路徑連結。

## 安全邊界

- 零遠端 JavaScript、零外部字型、零分析追蹤。
- Content Security Policy 禁止網頁對外連線。
- `npm run check` 會檢查常見金鑰前綴、非 loopback IP literal、素材缺檔與專案資料完整性。
- 素材只使用已檢視、不含個人持倉或帳密的產品畫面。
- `.env`、資料庫、日誌、測試報告與本機設定預設不納入 Git。

## 更新作品

專案資料集中在 `data/projects.js`。新增作品時請補齊 `problem` 與 `proof`，不要只寫功能清單；若加入圖片，先確認畫面沒有帳號、部位、內網位址或其他敏感資料。

## 盤點範圍

納入 13 個自有或核心系統。第三方 clone、評估用 staging repo、下載範例與無關舊專案不列入作品。

- [專案盤點與 GitHub 備份分級](PROJECT_INVENTORY.md)
- [本機連線安全稽核](SECURITY_AUDIT.md)
- [VOKE 續跑與交接](VOKE.md)
