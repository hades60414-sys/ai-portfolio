# Mike 張大恒 — 作品集

Mike 張大恒的一站式作品集：台新綜合證券 金融交易總處 Internship 四案（TCRI 信用風險預警平台、ANC 預警＋回測平台、MarketVault 市場資料管線、BLN 商品評價模型），加上量化研究、AI 應用與工作流工具，共 15 個系統。每案交代問題、本人角色、結果與公開邊界。

`demo/tcri/` 是 TCRI 平台的靜態互動演示，公司名稱與代號為公開台股名單，評等與數值為固定種子產生的合成資料，不含內部資訊。

## Local preview

需求：Node.js 22.13 以上。

    npm install
    npm run dev

預覽只監聽 http://127.0.0.1:4173。完整驗證：

    npm run validate

## Structure

- index.html：定位、台新實習區、代表案例、索引、經歷與聯絡。
- data/projects.js：15 個案例的唯一內容來源。
- app.js：分類索引、案例 dialog 與行動導覽。
- styles.css：暖象牙、海軍藍與鈷藍重點色的 editorial system。
- demo/tcri/：純前端合成資料互動演示。

## Public boundary

- 公開頁不放私人電話、持倉、帳戶、資料庫、憑證或 runtime state。
- 演示與截圖不含公司內部資料；TCRI demo 全為合成資料。
- 網站不載入遠端字型、遠端 JavaScript、追蹤器或分析服務。
