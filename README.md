# Mike 張大恒 — AI × Finance × Product

Mike 張大恒的一站式作品集。網站把金融實務、研究方法與產品工程整理成四個代表案例與 13 個系統索引；每案固定交代問題、本人角色、關鍵決策、證據與公開邊界。

正式網址：<https://mike-zhang-portfolio.hades60414.chatgpt.site/>

## Local preview

需求：Node.js 22.13 以上。

    npm install
    npm run dev

預覽只監聽 http://127.0.0.1:4173。完整驗證：

    npm run validate

validate 會依序執行內容／秘密掃描、11 項測試與正式 Sites build。

## Structure

- index.html：人物定位、履歷摘要、作品、經歷與方法。
- data/projects.js：13 個案例的唯一內容來源。
- app.js：案例索引、詳情 dialog、行動導覽與 GRILL ME。
- styles.css：暖象牙、海軍藍與單一鈷藍重點色的 editorial system。
- assets/og.png：社交分享圖。
- .openai/hosting.json：Sites 專案綁定，不含秘密。
- robots.txt／sitemap.xml：正式網址的搜尋引擎入口。

## Public boundary

- 公開頁不放私人電話、私人信箱、持倉、帳戶、資料庫、憑證或 runtime state。
- 只有已確認公開的 Edge Validator 與 Research Radar 提供 repository 連結。
- 只有 Edge Validator 提供直接 Live Demo。
- private、local research 與 restricted case 只展示去識別的方法摘要。
- 網站不載入遠端字型、遠端 JavaScript、追蹤器或分析服務。
- 正式 worker 與本機 preview 都加上 CSP、nosniff、frame deny、referrer 與 permissions policy。

## Project notes

- [專案盤點與 GitHub 備份分級](PROJECT_INVENTORY.md)
- [本機連線安全稽核](SECURITY_AUDIT.md)
- [VOKE 續跑與交接](VOKE.md)
