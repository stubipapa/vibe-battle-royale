# 6 人連線萬物大逃殺：AI 應用課堂最終規劃表（滾動式文件）

> **文件用途**：本文件為「6 人連線戰車（萬物大逃殺）網頁小遊戲」之核心課程與技術總規劃，記錄已定案的玩法規格、模組分工、數值護欄、`.agent` 規範與 Git 協作流程，供後續開發與課堂滾動調整使用。

---

## 一、 核心玩法與執行環境規格

### 1. 遊戲定位與盲盒大逃殺機制
- **遊戲模式**：萬物大逃殺（最後 1 名存活者獲勝／吃雞）。角色不限於傳統戰車，可自由設計為水果、原子筆、橡皮擦等萬物；攻擊形式也不寫死，可為噴發彩虹、超慢巨型西瓜、迴力尺等。
- **盲盒隨機開局（Mystery Loadout）**：進入遊戲前，玩家不知道自己會拿到什麼角色、武器或場上道具功能；開局時由 **Host（房主端）** 隨機配對 `charId (0~5)` ＋ `attackId (0~5)`。
- **粗糙矩形樣板開局（Rectangle Prototype）**：課堂開始時，底層已備妥可運行的陽春矩形版本（純色長方形角色、白方塊子彈、黃方塊道具、紅框縮圈），教師先帶玩確認底層連線流暢，再由 6 位學生各自用 AI 進化成華麗成品。

### 2. 雙模式入口
| 模式 | 觸發條件 | 用途說明 |
| :--- | :--- | :--- |
| **練習模式** | 單人即可立即開始 | 供教師課堂示範，以及學生本機開發時單人測試角色繪圖、武器彈道與縮圈效果。 |
| **連線模式** | **教師開房觀戰＋等待 6 位學生到齊** | 透過 Firebase Realtime Database 進行正式多人連線：教師開房擔任觀戰轉播台（不佔名額），滿 6 位學生後方可啟動盲盒開局。 |

### 3. 統一操作規範（限筆電 Chrome 瀏覽器）
- **移動**：僅限方向鍵 `↑ ↓ ← →`
- **瞄準方向**：鍵盤 `Z`（逆時針旋轉）／ `X`（順時針旋轉）
- **開火**：空白鍵 `Space`
- **自訂擴充按鍵限制**：學生可依模組需要設計額外鍵盤功能，但扣除上述固定按鍵後，**最多不得超過 3 種額外功能鍵**。

---

## 二、 網路同步與主引擎雙重防呆設計

### 1. Firebase Realtime Database 輕量化原則（教師開房純觀戰 Host 權威模式）
- **網路僅同步極簡數據（新加坡節點 `asia-southeast1`）**：學生端僅上傳操作輸入（`dx, dy, turn, firing`）與觀戰表情事件；教師 Host 端廣播精簡世界狀態（玩家座標 `(x, y)`、角度 `angle`、血量 `hp`、存活狀態 `alive`、盲盒角色與武器顯示資訊、子彈座標與 `visualRadius`/`style`、道具與縮圈資訊）。
- **本機各自渲染視覺**：所有複雜圖形（水果外觀、彩虹粒子、西瓜旋轉等）一律在各台筆電的 Canvas 本機運算繪製。
- **教師開房純觀戰（Host 單一真理來源）**：教師開房擔任純觀戰轉播與權威主機（不佔 6 位學生參賽名額），回合秒數、安全區縮圈半徑、空投道具生成、子彈碰撞與扣血判定、勝負結算，統一由教師 Host 計算並廣播。

### 2. 雙重數值護欄（主引擎 Clamp + `.agent` 規範）
- 主引擎 `index.html` 在載入學生模組時，會強制執行 `Math.min / Math.max` 夾限（Clamp）。
- `.agent/rules/module-contracts.md` 同步寫死相同上限，確保 AI 生成階段就不會產出破壞平衡的數值。
- **攻擊範圍鐵則**：任何攻擊的碰撞判定半徑 `hitRadius` **最大只能等於武器視覺圖案半徑 `visualRadius`**（`hitRadius <= visualRadius`），嚴禁隱形超大判定框。

---

## 三、 6 大外掛模組分工與介面契約

| 編號與職稱 | 負責檔案 | 粗糙矩形初始樣板 | 學生 AI 創作與可設計範圍 | 強制介面與數值護欄上限 |
| :--- | :--- | :--- | :--- | :--- |
| **學生 1**<br>角色外觀與體質師 | `config/characters.config.js` | 6 個不同顏色的純長方形（`32×32` px） | 設計 6 種萬物造型（水果、文具等）的 Canvas 繪圖與基礎體質 | 匯出 `charactersConfig`、`drawCharacter(ctx, player)`。<br>🛡️ `hp`: `60~160`、`speed`: `2~5`、碰撞半徑固定 `16px`、繪圖不超過 `48×48` px。 |
| **學生 2**<br>常規攻擊形式師 | `modules/attacks_normal.js` | 編號 `0, 1, 2`：發射白色小方塊直線飛行 | 設計 1～3 號攻擊形式（如噴彩虹、筆芯連射、橡皮擦屑散彈）的彈道與圖案 | 匯出 `normalAttacks`、`onFireNormal(...)`、`drawNormalProjectile(ctx, bullet)`。<br>🛡️ **`hitRadius <= visualRadius`**（上限 `20px`）；單次總傷害上限 `35`；冷卻 `300~1200ms`。 |
| **學生 3**<br>特殊攻擊形式師 | `modules/attacks_special.js` | 編號 `3, 4, 5`：發射橘色中方塊慢速飛行 | 設計 4～6 號奇葩攻擊（如超慢巨型西瓜、迴力尺、定時墨水）的動態與圖案 | 匯出 `specialAttacks`、`onFireSpecial(...)`、`drawSpecialProjectile(ctx, bullet)`。<br>🛡️ **`hitRadius <= visualRadius`**（上限 `36px`，大體積須配低速）；單發傷害上限 `45`；冷卻 `800~2500ms`。 |
| **學生 4**<br>戰場環境與縮圈師 | `config/arena.config.js` | 灰色素面背景 + 單純紅框縮圈 | 設計競技場背景主題與大逃殺縮圈節奏、危險區特效 | 匯出 `getShrinkZone(elapsedSec)`、`drawArenaBackground(...)`、`drawDangerZone(...)`。<br>🛡️ 初始半徑 `>= 380px`、最小半徑 `>= 70px`、圈外扣血 `3~12` HP/s。 |
| **學生 5**<br>戰場道具師 | `modules/items.js` | 隨機生成黃色方塊，撿到固定 `+20 HP` | 設計 3～4 種神秘空投外觀與未知 Buff（加速、護盾、巨大化等） | 匯出 `itemsConfig`、`drawItem(ctx, item)`、`applyItemEffect(player, itemType)`。<br>🛡️ 回血上限 `50 HP`、加速倍率上限 `1.6x`、Buff 持續時間上限 `5000ms`。 |
| **學生 6**<br>規則與結算 UI 師 | `config/rules.config.js` | 左上角純白字存活數 + 純文字結算 | 設計存活 HUD、擊殺播報、**淘汰後極簡觀戰畫面＋加油表情互動**、吃雞頒獎台結算 | 匯出 `drawHUD(...)`、`drawSpectatorOverlay(...)`、`drawGameOverScreen(...)`。<br>🛡️ HUD 不得遮擋畫面中央直徑 `450px` 主交戰區。 |

---

## 四、 `.agent` 官方規範與 Skills 架構設計

### 1. 分發給學生的專案內 `.agent/`（隨 Repo 下載自動生效）
- **`AGENTS.md` + `.agent/rules/`**（永遠強制載入）：
  - 鎖死技術棧（純 HTML5 Canvas + 原生 ES6 Modules + Firebase Realtime Database 新加坡節點）。
  - 鎖死檔案權限邊界（嚴禁修改 `index.html` 與他人模組）。
  - 鎖死上述數值護欄、`hitRadius <= visualRadius`、以及「額外自訂按鍵不超過 3 種」。
- **`.agent/skills/role-assignment/`（「分工」Skill）**：
  - 當學生問 AI「我能設計什麼？」或「我能改什麼？」時自動觸發，精準列出 1～6 號各自可創作的範圍（包含學生 6 擁有觀戰模式與表情互動設計權）。
- **`.agent/skills/tank-module-dev/`（模組開發 Skill）**：
  - 引導學生從創意發想到輸出符合契約的 ES6 模組代碼，並執行語法檢查。
- **`.agent/skills/verify-tank-game/`（本地驗證 Skill）**：
  - 提供 `node --check` 與 `python3 -m http.server 8080` 本地「練習模式」測試流程。
- **`.agent/skills/env-check/`（環境檢查 Skill）**：
  - 當學生詢問「GitHub 相關工具是否已經裝好？」時自動觸發，檢查 `git`（含 `user.name` / `user.email`）、`gh`（含 `gh auth status`），以及地端測試必備的 `python3`（本地伺服器預覽）與 `node`（語法檢查）。

### 2. 教師專用 Skill（置於專案內 `.agent/skills/teacher-pr-review/`，與學生技能區隔）
- **`teacher-pr-review`（GitHub PR 自動審核 Skill）**：
  - 保留於專案 `.agent/skills/teacher-pr-review/SKILL.md`，在命名與說明上與學生端技能（`env-check`、`role-assignment`、`tank-module-dev`、`verify-tank-game`）明確區分。
  - 自動讀取專案 GitHub 上的學生 Pull Request（透過 `gh pr list` / `gh pr diff`）。
  - 逐項檢查：
    1. 是否僅異動該學生負責的單一模組檔案？
    2. 是否有語法錯誤或缺少必要 ES6 `export`？
    3. 是否違反數值護欄、`hitRadius <= visualRadius` 或額外按鍵超過 3 種？
  - 全部通過後回報「可以合併（Ready to Merge）」，若有違規或錯誤則明確指出行號與修正建議。

---

## 五、 學生端 Git 下載、開分支與 PR 審核流程 SOP

> **教師課前提醒**：請先於 GitHub `stubipapa/vibe-battle-royale` 的 `Settings → Collaborators` 加入 6 位學生的 GitHub 帳號，學生才可直接推送分支。

1. **環境檢查與下載專案（含 `.agent` 規範與粗糙矩形原型）**
   ```bash
   cd ~/Desktop
   git clone https://github.com/stubipapa/vibe-battle-royale.git
   ```
   用 Antigravity IDE 開啟 `vibe-battle-royale` 資料夾後，可問 AI「`github 相關工具是否已經裝好？`」確認 `git`、`gh`（含 `gh auth setup-git`）、`python3`/`python` 與 `node`。
2. **切換專屬分支**（避免 6 人衝突）
   - 學生 1：`git checkout -b feat/student-1-characters`
   - 學生 2：`git checkout -b feat/student-2-normal-attacks`
   - 學生 3：`git checkout -b feat/student-3-special-attacks`
   - 學生 4：`git checkout -b feat/student-4-arena`
   - 學生 5：`git checkout -b feat/student-5-items`
   - 學生 6：`git checkout -b feat/student-6-rules-ui`
3. **本地「練習模式」預覽與 Vibe Coding**
   ```bash
   python3 -m http.server 8080
   ```
   開啟 Chrome 進入 `http://localhost:8080`，選擇「練習」模式即時測試設計效果。
4. **提交分支並發起 PR**
   ```bash
   git status                         # 確認只修改自己負責的檔案
   git add <自己負責的檔案路徑>
   git commit -m "feat(student-X): 完成模組設計"
   git push -u origin <自己的分支名稱>
   ```
   至 GitHub Repo 點擊 `Compare & pull request` → `Create pull request`。
5. **教師審核與 Vercel 上線**
   - 教師使用 `teacher-pr-review` Skill 確認所有 PR 無誤後依序 Merge 至 `main` 分支。
   - Vercel 自動建置上線後，全班用筆電 Chrome 進入正式網址，切換至「連線」模式，等齊 6 人開打盲盒大逃殺！

---

## 六、 90 分鐘課堂時間分配

| 時間 | 環節 | 教師與學生動作 | AI 應用教學重點 |
| :--- | :--- | :--- | :--- |
| **00–15 分** | 破冰與粗糙版展示 | 教師開「練習」與「連線」示範粗糙矩形原型；介紹 `.agent/` 規範。 | 為什麼 AI 協作需要「底層架構 + 介面契約」？ |
| **15–25 分** | Git Clone 與開分支 | 學生認領 1～6 號、拉下專案開分支、跑起 `localhost:8080`。 | AI 開發環境與版本控制基礎。 |
| **25–60 分** | Vibe Coding 創作 | 詢問 AI「我能設計什麼」（觸發分工 Skill），生成造型／武器／縮圈／道具／觀戰 UI 並於 Chrome 練習模式測試。 | 視覺化 Prompt 技巧、動態行為描述與數值邊界意識。 |
| **60–75 分** | PR 審查與合併 | 學生推送分支開 PR；教師用 `teacher-pr-review` Skill 檢查並 Merge 至 `main`。 | AI 輔助 Code Review 與零衝突團隊協作。 |
| **75–90 分** | 6 人連線盲盒大亂鬥 | Vercel 上線後全班筆電 Chrome 滿 6 人開打，體驗盲盒抽籤與淘汰觀戰表情。 | 從粗糙原型到線上多人產品的完整敏捷閉環。 |

---

## 七、 實作待辦清單（滾動追蹤）

- [x] 更新專案 `AGENTS.md`、`.agent/rules/` 與新增 `.agent/skills/role-assignment/SKILL.md`
- [x] 建立教師專用 `teacher-pr-review` Skill（置於專案 `.agent/skills/teacher-pr-review/`）
- [x] 建立底層核心引擎 `index.html`（含練習／6人連線雙模式、`↑↓←→ + Z/X + Space`、盲盒隨機、Host 同步、Clamp 防呆）
- [x] 建立 6 個「粗糙矩形原型」初始模組檔案
- [x] 初始化 Git 儲存庫與 `.gitignore`，驗證 6 個模組語法並推送至 `stubipapa/vibe-battle-royale`
- [x] 完成階段 A（[student-handout.md](file:///Users/jay/Documents/Ai課程202611/student-handout.md) 3 段 Subagent 逐段審查修正與總複驗）
- [x] 完成階段 B（6 偵查員架構稽核 + `teacher-pr-review` PR #1 演練 + Playroom 改用 **Firebase Realtime Database 新加坡節點** 免綁卡方案）
- [x] 完成 Vercel 正式站 `https://vibe-battle-royale.vercel.app/` **6 人同房實戰連線驗證**（6 位瀏覽器 Subagent 實機進入同房、6/6 解鎖開戰、盲盒分配、縮圈扣血、淘汰觀戰與修復短按 `Space` 緩衝）
- [ ] **【上課當天最後一步】**：於 GitHub `stubipapa/vibe-battle-royale` 的 `Settings → Collaborators` 邀請 6 位學生並請其點選 Accept Invitation
