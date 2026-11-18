---
name: teacher-pr-review
description: >-
  [Teacher Only] Use this skill when the teacher asks to review, audit, or check
  student Pull Requests (PRs) on GitHub for the 6-player Battle Royale game
  before merging into main.
---

# 教師專用：GitHub PR 自動審核流程

> **使用對象限制**：本 Skill 專供**教師端**審核學生 Pull Request 使用，與學生端開發技能（`env-check`、`role-assignment`、`tank-module-dev`、`verify-tank-game`）區隔。

當教師要求檢查或審核學生的 GitHub PR 時，請依下列步驟執行：

## 步驟 1：取得 PR 清單與差異內容

1. 執行 `gh pr list` 查看目前待審核的 PR。
2. 針對教師指定的 PR 編號（或逐一針對所有開啟中的 PR），執行：
   - `gh pr view <PR編號> --json title,author,files,headRefName`
   - `gh pr diff <PR編號>`

## 步驟 2：逐項合規與逾矩檢查

依據 [module-contracts.md](../../rules/module-contracts.md) 與 [project-standards.md](../../rules/project-standards.md) 檢查以下 5 項紅線：

1. **檔案權限邊界**：是否**僅異動**該學生分支對應的單一模組檔案？若動到 `index.html`、`.agent/` 或其他學生的模組，直接判定 ❌ 不通過。
2. **技術棧與語法**：是否為純原生 ES6 Modules？有無混用 `require()` / `module.exports` 或外部 npm 套件？必要匯出名稱與函式簽章是否完整？
3. **攻擊範圍鐵則（學生 2、3）**：`hitRadius` 是否確實 `<= visualRadius`？（嚴禁隱形超大碰撞判定框）。
4. **數值護欄檢查**：
   - 學生 1（`characters.config.js`）：`hp` 60～160、`speed` 2～5、繪圖不超過 `48×48` px。
   - 學生 2（`attacks_normal.js`）：`visualRadius` ≤ 20、單次總傷害 ≤ 35、冷卻 300～1200ms。
   - 學生 3（`attacks_special.js`）：`visualRadius` ≤ 36、單發傷害 ≤ 45、冷卻 800～2500ms。
   - 學生 4（`arena.config.js`）：初始安全區半徑 ≥ 380、最小半徑 ≥ 70、圈外扣血 3～12 HP/s。
   - 學生 5（`items.js`）：回血 ≤ 50、加速倍率 ≤ 1.6x、Buff 持續時間 ≤ 5000ms。
   - 學生 6（`rules.config.js`）：HUD 不得遮擋中央直徑 450px 主交戰區。
5. **額外按鍵上限**：扣除固定按鍵（`↑ ↓ ← →`、`Z`、`X`、`Space`）後，學生自訂的額外功能鍵是否 **≤ 3 種**？

## 步驟 3：輸出審核報告

- **全部通過**：明確回報 `✅ PR #<編號> 審核通過，可以合併（Ready to Merge）`，並簡述該學生的設計亮點。
- **發現逾矩或錯誤**：明確回報 `❌ PR #<編號> 暫不可合併`，列出違規項目、檔案行號與具體修正建議，讓教師可投影引導學生修改後再重推。
