---
name: verify-tank-game
description: >-
  Use this skill whenever a student asks to self-check compliance before pushing/PR
  (e.g. "幫我檢查合不合規", "我可以推送了嗎？", "幫我檢查語法與範圍"),
  or when verifying ES6 syntax and previewing the game locally in Practice Mode.
---

# 學生自我健檢與本地預覽流程（5 位實作學生版）

當學生詢問「幫我檢查合不合規？」「我可以推送分支了嗎？」或準備本地驗證時，請執行以下**寬容且實用的自我健檢**（只把關紅線，不限制創意發揮，並主動給予優化建議）：

## 1. 上傳前合規自我健檢（4 項檢查）

1. **檔案邊界檢查**：執行 `git status -s`，確認**只修改了自己負責的模組檔案**（學生 1～4 僅限各自單一檔案；學生 5 主責 `modules/items.js`，可選配含 `config/rules.config.js`）。
   - 若誤改到 `index.html`、`.agent/` 或其他人檔案，提醒並協助用 `git checkout -- <誤改檔案>` 還原。
2. **ES6 語法與純淨度檢查**：
   - 執行 `node --check <目標檔案>` 確認無 `SyntaxError`。
   - 確認沒有使用 `require()`、`module.exports` 或外部 npm 套件，且該模組必要的 `export` 名稱皆存在。
3. **紅線數值與碰撞範圍檢查**（依 [module-contracts.md](../../rules/module-contracts.md)）：
   - 學生 2、3 必查：`hitRadius <= visualRadius`，且未超過傷害與半徑上限。
   - 學生 1、4、5：確認沒有超出各模組護欄上限（若學生 5 有選配改 `rules.config.js`，確認未遮擋中央 450px 戰場區）。
4. **額外按鍵數量檢查**：若學生有新增自訂鍵盤監聽，確認扣除固定按鍵（`↑ ↓ ← →`、`Z`、`X`、`Space`）後 **≤ 3 種**。

## 2. 回報格式與建設性建議（不限制太死）

- **若全部合規**：明確告知 `✅ 自我健檢通過，可以安心推分支發起 PR！`，同時可給予 **1～2 個不強制的可選優化小建議**。
- **若有違規**：清楚指出哪一行超出護欄（例如 `hitRadius` 大於 `visualRadius`），並直接幫學生修正或提供調整方向。

## 3. 本地「練習模式」預覽步驟

- 若學生想先看畫面效果，協助執行 `python3 -m http.server 8080`（Windows 若無則試 `python` / `py`），引導在 Chrome 開啟 `http://localhost:8080` 點選 **「🧪 練習模式」** 測試（提醒修改後按 `Cmd+Shift+R` / `Ctrl+Shift+R` 強制重整）。
