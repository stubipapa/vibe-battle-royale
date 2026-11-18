/**
 * 模組 4：戰場環境與縮圈師（學生 4 負責）
 * --------------------------------------------------
 * 目前為「灰色素面背景 + 單純紅線框縮圈」樣板，請改造成課桌墊、果菜市場等主題與危險區特效！
 * 護欄限制：初始半徑 >= 380px、最小半徑 >= 70px、圈外扣血 3~12 HP/s。
 */

/**
 * 依據回合經過秒數計算目前安全區
 * @param {number} elapsedSec
 * @returns {{ x: number, y: number, radius: number, damagePerSec: number }}
 */
export function getShrinkZone(elapsedSec) {
  const initialRadius = 420;
  const minRadius = 80;
  // 每秒縮小約 2.5px，約 136 秒縮至最小安全區
  const radius = Math.max(minRadius, initialRadius - elapsedSec * 2.5);
  return {
    x: 400,
    y: 300,
    radius,
    damagePerSec: 6
  };
}

/**
 * 繪製競技場底圖（目前為粗糙素面深灰背景與簡單格線）
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - 800
 * @param {number} height - 600
 */
export function drawArenaBackground(ctx, width, height) {
  ctx.fillStyle = '#2b2d31';
  ctx.fillRect(0, 0, width, height);

  // 粗糙參考格線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

/**
 * 繪製安全區邊界與圈外危險區（目前為單純紅線框）
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number, radius: number }} zone
 * @param {number} width
 * @param {number} height
 */
export function drawDangerZone(ctx, zone, width, height) {
  ctx.save();
  // 圈外淡淡紅色警示
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = 'rgba(239, 68, 68, 0.14)';
  ctx.fill();

  // 單純紅色安全區框線
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();
}
