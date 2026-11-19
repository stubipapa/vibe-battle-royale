---
name: role-assignment
description: >-
  Use this skill whenever a student asks "我能設計什麼？", "我能改什麼？",
  "我是學生X，我負責什麼？", or asks about team division of labor and allowed
  customization scope in the 5-player Battle Royale game.
---

# 5 人分工與創意設計指引（「分工」Skill）

當學生詢問「我能設計什麼？」、「我能改什麼？」或確認自身職責時，請先確認對方是**學生 1～5 號中的哪一位**（若未說明則主動詢問）。

**回覆原則**：不要只回答檔案名稱與限制數字！請用**鼓勵創意、不設限玩法發想**的方式，完整告訴學生：
1. **你負責的檔案路徑**
2. **你可以準備的素材與創意方向**（舉例多種風格，並告訴他「不限於這些，任何點子都可以！」）
3. **你可以修改的程式內容**（設定陣列、外觀繪製函式、動態效果等）
4. **只需注意的 3 條安全底線**（只改自己負責的檔案、額外自訂按鍵 ≤ 3 種、遵守主引擎數值護欄與 `hitRadius <= visualRadius`）

---

## 5 位實作學生完整創作指南

- **學生 1：角色外觀與體質師（`config/characters.config.js`）**
  - **你可以準備與發想**：準備 **5～6 種完全不同主題的角色**（例如：水果、文具、台灣小吃、動物，任何風格皆可）。
  - **你可以修改的內容**：修改 `charactersConfig` 陣列（角色名稱、代表色、HP `60~160`、移動速度 `2~5`），以及自由改寫 `drawCharacter(ctx, player)`（**一律使用 Canvas 程式碼渲染、內嵌 SVG 或 Emoji 繪製，千萬不要使用 `.jpg` 或 `.png` 圖片檔**；記得自行 `translate` / `rotate` 且大小不超過 `48×48` px）。

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
  - **你可以修改的內容**：改寫 `drawArenaBackground(ctx, width, height)` 畫出舞台底圖、改寫 `getShrinkZone(elapsedSec)` 控制縮圈起始／最小半徑與圈外每秒扣血（`3~12` HP/s），以及在 `drawDangerZone(ctx, zone, width, height)` 加入電流、警戒線或動態光影（可用 `performance.now()`）。
  - **安全底線**：初始半徑 `>= 380px`、最小半徑 `>= 70px`。

- **學生 5：戰場道具與決戰 UI 師（主責 `modules/items.js`；可選配美化 `config/rules.config.js`）**
  - **你可以準備與發想**：
    1. **主任務（`modules/items.js`）**：發想 **3～4 種神秘盲盒空投箱外觀**（如問號禮盒、急救包、閃電藥水、神秘便當）與讓人驚喜的 Buff 組合。
    2. **進階加分選配（`config/rules.config.js`）**：若完成空投道具後還有時間，你也可以一併美化左上角存活 HUD、淘汰觀戰表情條（`1:👍 2:🔥 3:🍉 4:😂`）與最終「吃雞頒獎台」結算畫面！（若不改 `config/rules.config.js`，系統也有完整預設畫面可直接運行）。
  - **你可以修改的內容**：修改 `itemsConfig`、`drawItem(ctx, item)`、`applyItemEffect(player, itemType)`（搭配 `heal <= 50`、`shieldMs <= 5000ms`、`speedMult <= 1.6x`、`speedMs <= 5000ms`）；以及選配修改 `config/rules.config.js`（HUD 不可遮擋中央直徑 `450px` 戰場）。
