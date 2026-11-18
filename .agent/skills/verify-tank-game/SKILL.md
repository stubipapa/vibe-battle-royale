---
name: verify-tank-game
description: >-
  Use this skill when verifying the Battle Royale game modules, checking ES6 syntax across config/ and modules/,
  or previewing the static HTML5 Canvas game locally in Practice Mode.
---

# 萬物大逃殺本地驗證與預覽流程

## 驗證步驟

1. **檢查檔案結構與語法**
   - 執行 `node --check` 檢查 `config/*.js` 與 `modules/*.js` 是否有語法錯誤：
     `for f in config/*.js modules/*.js; do node --check "$f"; done`
   - 確認沒有混用 CommonJS `require()` 或未宣告的外部依賴。

2. **啟動本地靜態伺服器於「練習模式」預覽**
   - 由於專案使用原生 ES6 Modules（`<script type="module">`），不可直接以 `file://` 開啟 `index.html`。
   - 執行 `python3 -m http.server 8080`，於 Chrome 開啟 `http://localhost:8080` 並點選 **「練習模式」** 測試角色、攻擊圖案與範圍、縮圈、道具與 UI 是否正常運作。
