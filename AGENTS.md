# 專案開發規範（5 人連線萬物大逃殺）

本專案採用 Antigravity 官方自訂規範（`.agent/`）與外掛式模組架構，支援課堂 **Vibe Coding** 協作開發與 **GitHub + Vercel** 靜態部署。

## 核心原則

1. **技術棧限制**：純 HTML5 Canvas（`800 × 600` px）+ 原生 ES6 JavaScript 模組（無需建置工具或 bundler）+ Firebase Realtime Database（新加坡節點 `asia-southeast1`）。
2. **遊戲模式與操作**：
   - 支援 **「練習模式」**（單人即可開始）與 **「連線模式」**（教師開房純觀戰並擔任 Host，須等待 **5 位學生**到齊才可開始）。
   - 統一使用筆電 Chrome：方向鍵 `↑ ↓ ← →` 移動、`Z`/`X` 旋轉瞄準角度、`Space` 開火；額外自訂按鍵功能**最多不超過 3 種**。
3. **外掛式分工邊界**：**5 位學生**各自只修改自己負責的模組檔案（學生 5 主責 `modules/items.js`，亦可選配美化 `config/rules.config.js`），**嚴禁修改 `index.html`、`.agent/` 或其他組員的模組**。
4. **雙重防呆與鐵則**：所有數值必須遵守模組契約的護欄上限，且攻擊碰撞半徑 `hitRadius` **最大只能等於武器視覺半徑 `visualRadius`**。
5. **技能觸發指引**：
   - 當學生詢問「我能設計什麼？」或「我能改什麼？」時，請讀取並遵循 `role-assignment` Skill。
   - 當學生詢問「GitHub 相關工具是否已經裝好？」時，請讀取並遵循 `env-check` Skill。

## 延伸閱讀

- 課程最終規劃表：[course-master-plan.md](./course-master-plan.md)
- 專案開發與 Git 協作規範：[.agent/rules/project-standards.md](./.agent/rules/project-standards.md)
- 外掛模組介面契約：[.agent/rules/module-contracts.md](./.agent/rules/module-contracts.md)
