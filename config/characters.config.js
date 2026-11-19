/**
 * 模組 1：角色外觀與體質師（學生 1 負責）
 * --------------------------------------------------
 * 目前為「粗糙矩形樣板」，請使用 Antigravity 改造成 5～6 種萬物角色（水果、文具、橡皮擦等）！
 * 護欄限制：hp (60~160)、speed (2~5)、繪圖不超過 48x48 px。
 */

export const charactersConfig = [
  { id: 0, name: '紅方塊', color: '#ef4444', hp: 100, speed: 3.5 },
  { id: 1, name: '藍方塊', color: '#3b82f6', hp: 110, speed: 3.2 },
  { id: 2, name: '綠方塊', color: '#22c55e', hp: 90, speed: 4.0 },
  { id: 3, name: '黃方塊', color: '#eab308', hp: 120, speed: 3.0 },
  { id: 4, name: '紫方塊', color: '#a855f7', hp: 85, speed: 4.2 },
  { id: 5, name: '青方塊', color: '#06b6d4', hp: 130, speed: 2.8 }
];

/**
 * 在畫布上繪製單一角色（目前為粗糙矩形 + 瞄準線）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} player - { x, y, angle, color, name, hp, maxHp, isShielded }
 */
export function drawCharacter(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  // 粗糙矩形本體（32x32）
  ctx.fillStyle = player.color || '#ffffff';
  ctx.fillRect(-16, -16, 32, 32);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-16, -16, 32, 32);

  // 瞄準方向指示棒（讓 Z/X 旋轉方向清楚可見）
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(10, -3, 12, 6);

  ctx.restore();
}
