---
name: tank-module-dev
description: >-
  Use this skill when creating, editing, or reviewing any of the 6 student plugin modules
  (characters.config.js, attacks_normal.js, attacks_special.js, arena.config.js, items.js, rules.config.js)
  for the 6-player Battle Royale game.
---

# 萬物大逃殺外掛模組開發流程

當學生要求開發或修改 6 大模組之一時，請依下列步驟執行：

## 步驟

1. **確認學生編號與介面契約**
   - 確認對方是學生 1～6 號，並讀取 [module-contracts.md](../../rules/module-contracts.md)。
   - 嚴禁修改不屬於該模組的檔案（特別是 `index.html`、`.agent/` 與其他學生的模組）。

2. **撰寫純原生 ES6 模組程式碼**
   - 不可使用 CommonJS（`require` / `module.exports`）或外部 npm 套件。
   - 嚴格遵守數值護欄與 `hitRadius <= visualRadius` 鐵則。
   - 若有新增自訂鍵盤按鍵，扣除固定按鍵（`↑ ↓ ← →`、`Z`、`X`、`Space`）後不得超過 3 種。

3. **驗證語法與契約相容性**
   - 執行 `node --check <目標檔案>` 檢查語法是否正確。
   - 確認所有必要匯出名稱與函式簽章皆已正確匯出。
