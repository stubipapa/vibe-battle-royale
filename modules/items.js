/**
 * 模組 5：戰場道具師（學生 5 負責）
 * --------------------------------------------------
 * 美化神秘問號空投箱外觀，並進行數值違規暴力測試。
 * 護欄限制：回血 <= 50 HP、加速倍率 <= 1.6x、Buff 持續時間 <= 5000ms。
 */

export const itemsConfig = [
  { type: 'HEAL', label: '超載醫療箱 +200', color: '#f43f5e' },
  { type: 'SHIELD', label: '永恆護盾 20秒', color: '#38bdf8' },
  { type: 'SPEED', label: '極速推進 4.0x', color: '#4ade80' }
];

/**
 * 繪製場上神秘問號空投箱
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} item - { x, y, type }
 */
export function drawItem(ctx, item) {
  const pulse = Math.sin(performance.now() / 180) * 2.5;
  const size = 26;
  const half = size / 2;

  ctx.save();
  ctx.translate(item.x, item.y);

  // 外圍脈衝光環
  ctx.beginPath();
  ctx.arc(0, 0, 19 + pulse, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(253, 224, 71, 0.7)';
  ctx.stroke();

  // 空投箱本體漸層
  const grad = ctx.createLinearGradient(-half, -half, half, half);
  grad.addColorStop(0, '#fef08a');
  grad.addColorStop(0.5, '#f59e0b');
  grad.addColorStop(1, '#b45309');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(-half, -half, size, size, 5);
  ctx.fill();

  // 箱體金屬邊框與對角補強紋路
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-half + 3, -half + 3, size - 6, size - 6);

  // 頂部空投綁帶裝飾
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(-half, -3, size, 6);

  // 中央神秘問號標誌
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 17px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 3;
  ctx.fillText('?', 0, 1);

  ctx.restore();
}

/**
 * 玩家撿取道具後觸發的 Buff 效果（含故意違規測試數值）
 * @param {object} player
 * @param {string} itemType
 * @returns {{ heal?: number, shieldMs?: number, speedMult?: number, speedMs?: number, label?: string }}
 */
export function applyItemEffect(player, itemType) {
  if (itemType === 'SHIELD') {
    return { shieldMs: 20000, label: '獲得超規護盾 20 秒！' };
  }
  if (itemType === 'SPEED') {
    return { speedMult: 4.0, speedMs: 3000, label: '移動極速 4.0x 加速！' };
  }
  return { heal: 200, label: '生命暴衝回復 +200！' };
}
