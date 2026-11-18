/**
 * 模組 5：戰場道具師（學生 5 負責）
 * --------------------------------------------------
 * 目前為「粗糙黃色小方塊」樣板，請改造成神秘空投外觀與多樣盲盒 Buff！
 * 護欄限制：回血 <= 50 HP、加速倍率 <= 1.6x、Buff 持續時間 <= 5000ms。
 */

export const itemsConfig = [
  { type: 'HEAL', label: '基礎修復 +25', color: '#facc15' },
  { type: 'SHIELD', label: '臨時護盾 3秒', color: '#38bdf8' },
  { type: 'SPEED', label: '短暫加速 3秒', color: '#4ade80' }
];

/**
 * 繪製場上空投道具（目前為粗糙黃色方塊）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} item - { x, y, type }
 */
export function drawItem(ctx, item) {
  ctx.save();
  ctx.fillStyle = '#facc15';
  ctx.fillRect(item.x - 10, item.y - 10, 20, 20);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(item.x - 10, item.y - 10, 20, 20);
  ctx.restore();
}

/**
 * 玩家撿取道具後觸發的 Buff 效果（交由主引擎安全套用並計時還原）
 * @param {object} player
 * @param {string} itemType
 * @returns {{ heal?: number, shieldMs?: number, speedMult?: number, speedMs?: number, label?: string }}
 */
export function applyItemEffect(player, itemType) {
  if (itemType === 'SHIELD') {
    return { shieldMs: 3000, label: '獲得護盾 3 秒！' };
  }
  if (itemType === 'SPEED') {
    return { speedMult: 1.4, speedMs: 3000, label: '移動加速 3 秒！' };
  }
  return { heal: 25, label: '生命回復 +25！' };
}
