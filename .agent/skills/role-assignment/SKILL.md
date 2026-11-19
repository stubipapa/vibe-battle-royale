---
name: role-assignment
description: >-
  Use this skill whenever a student asks "我能設計什麼？", "我能改什麼？",
  "我是學生X，我負責什麼？", or asks about team division of labor and allowed
  customization scope in the 6-player Battle Royale game.
---

# 6 人分工與創意設計指引（「分工」Skill）

當學生詢問「我能設計什麼？」、「我能改什麼？」或確認自身職責時，請先確認對方是**學生 1～6 號中的哪一位**（若未說明則主動詢問）。

**回覆原則**：不要只回答檔案名稱與限制數字！請用**鼓勵創意、不設限玩法發想**的方式，完整告訴學生：
1. **你唯一負責的檔案路徑**
2. **你可以準備的素材與創意方向**（舉例多種風格，並告訴他「不限於這些，任何點子都可以！」）
3. **你可以修改的程式內容**（設定陣列、外觀繪製函式、動態效果等）
4. **只需注意的 3 條安全底線**（只改自己那 1 個檔案、額外自訂按鍵 ≤ 3 種、遵守主引擎數值護欄與 `hitRadius <= visualRadius`）

---

## 各角色完整創作指南

- **學生 1：角色外觀與體質師（`config/characters.config.js`）**
  - **你可以準備與發想**：準備 **6 種完全不同主題的角色**（例如：6 種水果、文具、台灣小吃、動物，甚至自己畫／找 6 張去背圖片或 Emoji）。
  - **你可以修改的內容**：修改 `charactersConfig` 陣列（角色名稱、代表色、HP `60~160`、移動速度 `2~5`），以及自由改寫 `drawCharacter(ctx, player)`（可用 Canvas 幾何圖形、Emoji，或預載 `Image` 圖片繪製，記得自行 `translate` / `rotate` 且大小不超過 `48×48` px）。

- **學生 2：常規攻擊形式師（`modules/attacks_normal.js`）**
  - **你可以準備與發想**：設計 **3 種（編號 `0, 1, 2`）截然不同的攻擊形式與視覺特效**（例如：噴發七彩彩虹、扇形散彈、高速連發筆芯、泡泡、音符等，任何形狀或顏色都可以！）。
  - **你可以修改的內容**：修改 `normalAttacks`（名稱、冷卻 `300~1200ms`）、`onFireNormal`（發射幾顆、角度分布、速度與 `style`），以及自由發揮 `drawNormalProjectile(ctx, bullet)` 畫出子彈圖案與拖尾特效。
  - **安全底線**：`hitRadius <= visualRadius`（上限 `20px`）、單次開火總傷害 `<= 35`。

- **學生 3：特殊攻擊形式師（`modules/attacks_special.js`）**
  - **你可以準備與發想**：設計 **3 種（編號 `3, 4, 5`）最有戲劇張力或奇葩風格的攻擊形式**（例如：飛超慢但超痛的巨型西瓜、高速旋轉直尺、閃爍波紋墨水球、愛心光波等）。
  - **你可以修改的內容**：修改 `specialAttacks`（名稱、冷卻 `800~2500ms`）、`onFireSpecial`（發射速度、大小、傷害），以及在 `drawSpecialProjectile(ctx, bullet)` 內用 `bullet.style` 與 `performance.now()` 製作旋轉、脈動、發光等視覺動畫。
  - **安全底線**：`hitRadius <= visualRadius`（上限 `36px`）、單發傷害 `<= 45`。

- **學生 4：戰場環境與縮圈師（`config/arena.config.js`）**
  - **你可以準備與發想**：發想整場對戰的**舞台背景主題**（例如：綠色切割墊、課桌塗鴉、果菜市場、太空星空、籃球場）與**縮圈危險區的氛圍特效**。
  - **你可以修改的內容**：改寫 `drawArenaBackground(ctx, width, height)` 畫出舞台底圖、改寫 `getShrinkZone(elapsedSec)` 控制縮圈起始／最小半徑與圈外每秒扣血（`3~12` HP/s），以及在 `drawDangerZone(ctx, zone, width, height)` 加入電流、警界線或動態光影（可用 `performance.now()`）。
  - **安全底線**：初始半徑 `>= 380px`、最小半徑 `>= 70px`。

- **學生 5：戰場道具師（`modules/items.js`）**
  - **你可以準備與發想**：發想 **3～4 種神秘盲盒空投箱外觀**（如問號禮盒、急救包、閃電藥水、神秘便當）與讓人驚喜的 Buff 組合。
  - **你可以修改的內容**：修改 `itemsConfig`、改寫 `drawItem(ctx, item)` 繪製道具外觀與漂浮發光動畫（可用 `performance.now()`），並在 `applyItemEffect(player, itemType)` 搭配 `heal`（`<= 50`）、`shieldMs`（`<= 5000ms`）、`speedMult`（`<= 1.6x`）與 `speedMs`（`<= 5000ms`）。

- **學生 6：規則與結算 UI 師（`config/rules.config.js`）**
  - **你可以準備與發想**：發想整場大逃殺的 **HUD 介面風格**、**淘汰後的觀戰互動面板**（對應 `1:👍 2:🔥 3:🍉 4:😂`），以及最有儀式感的 **「吃雞頒獎台」結算畫面**（冠亞季軍獎盃、彩帶、背景特效）。
  - **你可以修改的內容**：自由設計 `drawHUD(ctx, gameState)`（使用 `mode, elapsedSec, aliveCount, totalCount, me`）、`drawSpectatorOverlay(ctx, gameState)` 與 `drawGameOverScreen(ctx, ranking)`。
  - **安全底線**：對戰中 HUD 與觀戰條不可遮擋畫面中央直徑 `450px` 主交戰區。
