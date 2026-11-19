# 專案開發與協作規範（5 位實作學生版）

## 1. 技術選型與執行環境

- **前端渲染**：HTML5 Canvas（標準畫布尺寸 `800 × 600` px）。
- **模組系統**：瀏覽器原生 ES6 Modules（`export` / `import`），不依賴 Node.js、Webpack、Vite 等打包工具，確保可直接部署於 Vercel 靜態託管。
- **多人連線**：透過 Firebase Realtime Database（新加坡節點 `asia-southeast1`）採用「教師開房純觀戰（Host）＋ 5 位學生參賽」架構同步極簡狀態（學生端上傳移動／瞄準／開火輸入與觀戰表情；Host 統一計算縮圈、道具生成、傷害判定與盲盒分配，並廣播精簡世界狀態，包含座標、角度、血量、存活、角色與武器名稱、子彈位置、道具與排名），複雜視覺圖形與粒子一律在各台筆電本機 Canvas 渲染。
- **操作設備與按鍵**：統一使用筆電 Chrome 瀏覽器。固定操作為 `↑ ↓ ← →` 移動、`Z`（逆時針）／`X`（順時針）瞄準、`Space` 開火。學生自訂額外按鍵功能**不得超過 3 種**。

## 2. 目錄結構與 5 人權限邊界

```text
.
├── AGENTS.md                       # 根目錄全域規則
├── .agent/                         # Antigravity 官方專案規範
│   ├── rules/                      # 專案開發規則與模組介面契約
│   └── skills/                     # 分工、環境檢查、模組開發、驗證與教師PR審核技能
├── index.html                      # 核心遊戲引擎（教師維護，學生嚴禁修改）
├── config/
│   ├── characters.config.js        # 學生 1：角色外觀與體質（5～6 種萬物角色）
│   ├── arena.config.js             # 學生 4：戰場環境與縮圈機制
│   └── rules.config.js             # 教師內建預設 UI（學生 5 完成道具後可選配美化 HUD／觀戰／頒獎台）
└── modules/
    ├── attacks_normal.js           # 學生 2：常規攻擊形式（編號 0, 1, 2）
    ├── attacks_special.js          # 學生 3：特殊攻擊形式（編號 3, 4, 5）
    └── items.js                    # 學生 5：空投道具與 Buff 機制
```

## 3. Git 協作與 PR 規則

- 5 位學生應在獨立分支上開發自己負責的模組檔案（例如 `feat/student-2-normal-attacks`）。
- 發起 Pull Request 前，必須確認：
  1. 僅異動自己負責的檔案（學生 1～4 僅限各自單一檔案；學生 5 主責 `modules/items.js`，可選配含 `config/rules.config.js`，皆不可動到 `index.html`、`.agent/` 或他人檔案）。
  2. 無語法錯誤（SyntaxError）或外部套件依賴。
  3. 匯出名稱、函式簽章、數值護欄與 `hitRadius <= visualRadius` 完全符合 [module-contracts.md](./module-contracts.md)。
