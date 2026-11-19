# 外掛模組介面契約與數值護欄（5 位實作學生版）

所有模組必須使用原生 ES6 `export` 語法匯出，供 `index.html` 主引擎載入。主引擎載入時會對所有數值執行 `Math.min / Math.max` 強制夾限（Clamp），請務必在規範範圍內設計。

---

## 模組 1：`config/characters.config.js`（學生 1：角色外觀與體質師）

- **必要匯出**：
  - `export const charactersConfig = [ ... ]`（包含 `5 ~ 6` 筆物件，對應 `id: 0 ~ 4` 或 `0 ~ 5`）
  - `export function drawCharacter(ctx, player)`（主引擎提供 `player.x, player.y, player.angle`，函式內須自行 `ctx.translate(player.x, player.y)` 與 `ctx.rotate(player.angle)` 繪製角色）
- **物件必要屬性與護欄**：
  - `id` (`0 ~ 5`)、`name` (string)、`color` (string)
  - `hp` (number)：🛡️ **護欄 `60 ~ 160`**
  - `speed` (number)：🛡️ **護欄 `2 ~ 5`**
  - 碰撞半徑固定為 `16px`，單一角色繪圖視覺範圍**不得超過 `48 × 48` px**。

---

## 模組 2：`modules/attacks_normal.js`（學生 2：常規攻擊形式師）

- **負責編號**：`attackId` `0, 1, 2`
- **必要匯出**：
  - `export const normalAttacks = [ ... ]`（3 筆攻擊設定，含 `id`, `name`, `cooldown`, `color`）
  - `export function onFireNormal(attackId, shooter, spawnBullet)`（呼叫 `spawnBullet({ x, y, vx, vy, damage, lifeTime, visualRadius, hitRadius, color, style })` 生成子彈）
  - `export function drawNormalProjectile(ctx, bullet)`（自訂繪製子彈圖案，如彩虹、筆芯、橡皮擦屑）
- **護欄與鐵則**：
  - 🛡️ **鐵則：`hitRadius <= visualRadius`**（碰撞半徑最大只能等於視覺半徑），`visualRadius` 上限 **`20px`**。
  - 🛡️ 單次開火總傷害上限 **`35`**；冷卻 `cooldown` 範圍 **`300 ~ 1200` ms**。

---

## 模組 3：`modules/attacks_special.js`（學生 3：特殊攻擊形式師）

- **負責編號**：`attackId` `3, 4, 5`
- **必要匯出**：
  - `export const specialAttacks = [ ... ]`（3 筆攻擊設定，含 `id`, `name`, `cooldown`, `color`）
  - `export function onFireSpecial(attackId, shooter, spawnBullet)`（呼叫 `spawnBullet({ x, y, vx, vy, damage, lifeTime, visualRadius, hitRadius, color, style })` 生成子彈；主引擎僅保留這些標準欄位，旋轉或動畫效果請在 `drawSpecialProjectile` 內依 `bullet.style` 與 `performance.now()` 計算）
  - `export function drawSpecialProjectile(ctx, bullet)`（自訂繪製奇葩攻擊圖案，如巨型西瓜、旋轉直尺、墨水球）
- **護欄與鐵則**：
  - 🛡️ **鐵則：`hitRadius <= visualRadius`**，`visualRadius` 上限 **`36px`**（大型武器須搭配較低飛行速度）。
  - 🛡️ 單發傷害上限 **`45`**；冷卻 `cooldown` 範圍 **`800 ~ 2500` ms**。

---

## 模組 4：`config/arena.config.js`（學生 4：戰場環境與縮圈師）

- **必要匯出**：
  - `export function getShrinkZone(elapsedSec)` → 回傳 `{ x, y, radius, damagePerSec }`
  - `export function drawArenaBackground(ctx, width, height)`（繪製 `800 × 600` 競技場背景）
  - `export function drawDangerZone(ctx, zone, width, height)`（繪製安全區邊界與圈外危險遮罩）
- **護欄**：
  - 🛡️ 初始安全區半徑 **`>= 380` px**，最小縮圈半徑 **`>= 70` px**（不可縮到 0）。
  - 🛡️ 圈外每秒扣血 `damagePerSec` 限制 **`3 ~ 12` HP/s**。

---

## 模組 5：`modules/items.js`（學生 5：戰場道具與決戰特效師）

- **必要匯出**：
  - `export const itemsConfig = [ ... ]`（建議 3～4 種道具類型，如 `'HEAL'`, `'SHIELD'`, `'SPEED'`）
  - `export function drawItem(ctx, item)`（在 `(item.x, item.y)` 繪製道具箱圖案）
  - `export function applyItemEffect(player, itemType)`（回傳 `{ heal?, shieldMs?, speedMult?, speedMs?, label? }` 供主引擎套用並自動計時還原）
- **護欄**：
  - 🛡️ 單次回血上限 **`50` HP**、加速倍率上限 **`1.6x`**、無敵或 Buff 持續時間上限 **`5000` ms**（5 秒）。

---

## 附屬預設模組：`config/rules.config.js`（教師預設內建／學生 5 可選配美化）

- **必要匯出**：
  - `export function drawHUD(ctx, gameState)`（`gameState` 提供 `{ mode, elapsedSec, aliveCount, totalCount, me }`）
  - `export function drawSpectatorOverlay(ctx, gameState)`（`gameState` 提供 `{ aliveCount, floatingEmojis }`，對應主引擎 `1:👍 2:🔥 3:🍉 4:😂` 的表情互動面板）
  - `export function drawGameOverScreen(ctx, ranking)`（繪製最後生存者吃雞頒獎台與排名結算畫面）
- **護欄**：
  - 🛡️ HUD 與觀戰面板**不得遮擋畫面中央直徑 `450px` 的主交戰區**；自訂額外快捷鍵扣除固定操作鍵後**最多不超過 3 種**。
