# 5 人連線萬物大逃殺：AI 應用課堂最終規劃表（5 位實作學員專屬版）

> **文件用途**：本文件為「5 人連線萬物大逃殺網頁小遊戲」之核心課程與技術總規劃，已針對課堂實際 **5 位實作學員** 重新調整分工、連線開戰門檻（`5 / 5`）、數值護欄、`.agent` 規範與 Git 協作流程。

---

## 一、 核心玩法與執行環境規格

### 1. 遊戲定位與盲盒大逃殺機制
- **遊戲模式**：萬物大逃殺（最後 1 名存活者獲勝／吃雞）。角色不限於傳統戰車，可自由設計為水果、原子筆、橡皮擦等萬物；攻擊形式也不寫死，可為噴發彩虹、超慢巨型西瓜、旋轉直尺等。
- **盲盒隨機開局（Mystery Loadout）**：進入遊戲前，玩家不知道自己會拿到什麼角色、武器或場上道具功能；開局時由 **Host（教師房主端）** 為 5 位學員隨機洗牌配對 `charId` ＋ `attackId`。
- **粗糙矩形樣板開局（Rectangle Prototype）**：課堂開始時，底層已備妥可運行的陽春矩形版本（純色長方形角色、白方塊子彈、黃方塊道具、紅框縮圈），教師先帶玩確認底層連線流暢，再由 **5 位學員**各自用 AI 進化成華麗成品。

### 2. 雙模式入口
| 模式 | 觸發條件 | 用途說明 |
| :--- | :--- | :--- |
| **練習模式** | 單人即可立即開始 | 供教師課堂示範，以及學員本機開發時單人測試角色繪圖、武器彈道與縮圈效果。 |
| **連線模式** | **教師開房觀戰＋等待 5 位學生到齊** | 透過 Firebase Realtime Database 進行正式多人連線：教師開房擔任觀戰轉播台（不佔名額），滿 **5 位學生（`5 / 5`）** 後方可啟動盲盒開局（亦附教師緊急人數開戰備援鈕）。 |

### 3. 統一操作規範（限筆電 Chrome 瀏覽器）
- **移動**：僅限方向鍵 `↑ ↓ ← →`
- **瞄準方向**：鍵盤 `Z`（逆時針旋轉）／ `X`（順時針旋轉）
- **開火**：空白鍵 `Space`
- **自訂擴充按鍵限制**：學員可依模組需要設計額外鍵盤功能，但扣除上述固定按鍵後，**最多不得超過 3 種額外功能鍵**。

---

## 二、 網路同步與主引擎雙重防呆設計

### 1. Firebase Realtime Database 輕量化原則（教師開房純觀戰 Host 權威模式）
- **網路僅同步極簡數據（新加坡節點 `asia-southeast1`）**：學生端僅上傳操作輸入（`dx, dy, turn, firing`）與觀戰表情事件；教師 Host 端廣播精簡世界狀態（玩家座標 `(x, y)`、角度 `angle`、血量 `hp`、存活狀態 `alive`、盲盒角色與武器顯示資訊、子彈座標與 `visualRadius`/`style`、道具與縮圈資訊）。
- **本機各自渲染視覺**：所有複雜圖形（水果外觀、彩虹粒子、西瓜旋轉等）一律在各台筆電的 Canvas 本機運算繪製。
- **教師開房純觀戰（Host 單一真理來源）**：教師開房擔任純觀戰轉播與權威主機（不佔 5 位學生參賽名額），回合秒數、安全區縮圈半徑、空投道具生成、子彈碰撞與扣血判定、勝負結算，統一由教師 Host 計算並廣播。

### 2. 雙重數值護欄（主引擎 Clamp + `.agent` 規範）
- 主引擎 `index.html` 在載入學生模組時，強制執行 `Math.min / Math.max` 夾限（Clamp）。
- `.agent/rules/module-contracts.md` 同步寫死相同上限。
- **攻擊範圍鐵則**：任何攻擊的碰撞判定半徑 `hitRadius` **最大只能等於武器視覺圖案半徑 `visualRadius`**（`hitRadius <= visualRadius`），嚴禁隱形超大判定框。

---

## 三、 5 位實作學員外掛模組分工與介面契約

| 編號與職稱 | 負責檔案 | 粗糙矩形初始樣板 | 學生 AI 創作與可設計範圍 | 強制介面與數值護欄上限 |
| :--- | :--- | :--- | :--- | :--- |
| **學生 1**<br>角色外觀與體質師 | `config/characters.config.js` | 6 個不同顏色的純長方形（`32×32` px） | 設計 5～6 種萬物造型（水果、文具等）的 Canvas 繪圖與基礎體質 | 匯出 `charactersConfig`、`drawCharacter(ctx, player)`。<br>🛡️ `hp`: `60~160`、`speed`: `2~5`、碰撞半徑固定 `16px`、繪圖不超過 `48×48` px。 |
| **學生 2**<br>常規攻擊形式師 | `modules/attacks_normal.js` | 編號 `0, 1, 2`：發射白色小方塊直線飛行 | 設計 1～3 號攻擊形式（如噴彩虹、筆芯連射、橡皮擦屑散彈）的彈道與圖案 | 匯出 `normalAttacks`、`onFireNormal(...)`、`drawNormalProjectile(ctx, bullet)`。<br>🛡️ **`hitRadius <= visualRadius`**（上限 `20px`）；單次總傷害上限 `35`；冷卻 `300~1200ms`。 |
| **學生 3**<br>特殊攻擊形式師 | `modules/attacks_special.js` | 編號 `3, 4, 5`：發射橘色中方塊慢速飛行 | 設計 4～6 號奇葩攻擊（如超慢巨型西瓜、旋轉直尺、波紋墨水球）的動態與圖案 | 匯出 `specialAttacks`、`onFireSpecial(...)`、`drawSpecialProjectile(ctx, bullet)`。<br>🛡️ **`hitRadius <= visualRadius`**（上限 `36px`，大體積須配低速）；單發傷害上限 `45`；冷卻 `800~2500ms`。 |
| **學生 4**<br>戰場環境與縮圈師 | `config/arena.config.js` | 灰色素面背景 + 單純紅框縮圈 | 設計競技場背景主題與大逃殺縮圈節奏、危險區特效 | 匯出 `getShrinkZone(elapsedSec)`、`drawArenaBackground(...)`、`drawDangerZone(...)`。<br>🛡️ 初始半徑 `>= 380px`、最小半徑 `>= 70px`、圈外扣血 `3~12` HP/s。 |
| **學生 5**<br>戰場道具與決戰 UI 師 | 主責 `modules/items.js`<br>*(選配 `config/rules.config.js`)* | 隨機生成黃色方塊（+25 HP）＋ 教師預設基礎 HUD／觀戰／結算 | 主責設計 3～4 種神秘空投外觀與未知 Buff；若完成後有餘裕亦可選配美化 HUD、觀戰表情條與吃雞頒獎台 | 匯出 `itemsConfig`、`drawItem(ctx, item)`、`applyItemEffect(player, itemType)`。<br>🛡️ 回血上限 `50 HP`、加速倍率上限 `1.6x`、Buff 持續時間上限 `5000ms`；若選配改 `rules.config.js`，HUD 不得遮擋中央直徑 `450px` 戰場。 |

---

## 四、 學生端 Git 下載、開分支與 PR 審核流程 SOP（5 人版）

> **教師課前提醒**：請先於 GitHub `stubipapa/vibe-battle-royale` 的 `Settings → Collaborators` 加入 **5 位學員**的 GitHub 帳號，並請其點選 Accept Invitation。

1. **環境檢查與下載專案**
   ```bash
   cd ~/Desktop
   git clone https://github.com/stubipapa/vibe-battle-royale.git
   ```
   用 **Antigravity 2.0** 開啟 `vibe-battle-royale` 資料夾作為工作區後，可問 AI「`github 相關工具是否已經裝好？`」確認環境。
2. **切換專屬分支（5 人互不衝突）**
   - 學生 1：`git checkout -b feat/student-1-characters`
   - 學生 2：`git checkout -b feat/student-2-normal-attacks`
   - 學生 3：`git checkout -b feat/student-3-special-attacks`
   - 學生 4：`git checkout -b feat/student-4-arena`
   - 學生 5：`git checkout -b feat/student-5-items`
3. **本地「練習模式」預覽與自我健檢**
   ```bash
   python3 -m http.server 8080
   ```
   開啟 Chrome 進入 `http://localhost:8080` 選擇「練習模式」測試；推送前問 AI「`幫我檢查我的修改合不合規，我可以推送分支了嗎？`」。
4. **提交分支並發起 PR**
   ```bash
   git status
   git add <自己負責的檔案路徑>
   git commit -m "feat(student-X): 完成模組設計"
   git push -u origin <自己的分支名稱>
   ```
5. **教師審核與 Vercel 5 人連線開戰**
   - 教師使用 `teacher-pr-review` Skill 確認 5 份 PR 無誤後依序 Merge 至 `main` 分支。
   - Vercel 自動建置上線後，教師點「🏠 教師開房」觀戰轉播，等齊 **5 位學員（`5 / 5`）** 開打盲盒大逃殺！

---

## 五、 實作待辦清單（滾動追蹤）

- [x] 完成 `.agent/` 規範、技能（`env-check`、`role-assignment`、`tank-module-dev`、`verify-tank-game`、`teacher-pr-review`）與粗糙矩形原型
- [x] 完成 Firebase Realtime Database（新加坡節點）連線架構與教師開房純觀戰模式
- [x] 完成 **5 位實作學員專屬版** 全面調整（`index.html` `MAX_STUDENTS = 5`、`.agent/` 5 人分工與審核規則、[teacher-runbook.md](./teacher-runbook.md)、[student-handout.md](./student-handout.md)）與核對驗證
- [ ] **【上課現場】**：於 GitHub `stubipapa/vibe-battle-royale` 的 `Settings → Collaborators` 邀請 **5 位學員**並請其點選 Accept Invitation
