/**
 * 模組 4：戰場環境與縮圈師（學生 4 負責）
 * --------------------------------------------------
 * 主題：綠色課桌切割墊風格（含網格、刻度線與角度參考線）＋ 動態閃爍危險區縮圈。
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
  // 開局保留 5 秒適應期，之後每秒縮小約 3px（約 118 秒縮至最小安全區）
  const shrinkElapsed = Math.max(0, elapsedSec - 5);
  const radius = Math.max(minRadius, initialRadius - shrinkElapsed * 3);

  return {
    x: 400,
    y: 300,
    radius,
    damagePerSec: 8
  };
}

/**
 * 繪製「綠色課桌切割墊風格」競技場底圖（800 × 600）
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - 800
 * @param {number} height - 600
 */
export function drawArenaBackground(ctx, width, height) {
  ctx.save();

  // 1. 切割墊深綠底色與微漸層質感
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    60,
    width / 2,
    height / 2,
    width * 0.72
  );
  bgGrad.addColorStop(0, '#1f6f46');
  bgGrad.addColorStop(1, '#144d30');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const margin = 24;
  const innerW = width - margin * 2;
  const innerH = height - margin * 2;

  // 2. 細格線（每 10px）
  ctx.strokeStyle = 'rgba(220, 252, 231, 0.08)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = margin; x <= width - margin; x += 10) {
    ctx.moveTo(x, margin);
    ctx.lineTo(x, height - margin);
  }
  for (let y = margin; y <= height - margin; y += 10) {
    ctx.moveTo(margin, y);
    ctx.lineTo(width - margin, y);
  }
  ctx.stroke();

  // 3. 主格線（每 50px）
  ctx.strokeStyle = 'rgba(236, 253, 245, 0.24)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  for (let x = margin; x <= width - margin; x += 50) {
    ctx.moveTo(x, margin);
    ctx.lineTo(x, height - margin);
  }
  for (let y = margin; y <= height - margin; y += 50) {
    ctx.moveTo(margin, y);
    ctx.lineTo(width - margin, y);
  }
  ctx.stroke();

  // 4. 切割墊斜角參考線（45° / 中心準星）
  ctx.save();
  ctx.beginPath();
  ctx.rect(margin, margin, innerW, innerH);
  ctx.clip();

  ctx.strokeStyle = 'rgba(236, 253, 245, 0.14)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  // 中心 45 度斜線
  ctx.moveTo(width / 2 - 300, height / 2 - 300);
  ctx.lineTo(width / 2 + 300, height / 2 + 300);
  ctx.moveTo(width / 2 + 300, height / 2 - 300);
  ctx.lineTo(width / 2 - 300, height / 2 + 300);
  ctx.stroke();

  // 中心圓規同心參考圓
  ctx.setLineDash([]);
  ctx.strokeStyle = 'rgba(236, 253, 245, 0.12)';
  for (const r of [60, 120]) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 5. 外框與四邊尺規刻度線
  ctx.strokeStyle = 'rgba(236, 253, 245, 0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(margin, margin, innerW, innerH);

  ctx.fillStyle = 'rgba(236, 253, 245, 0.72)';
  ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 上、下邊刻度線（每 10px 短刻度，每 50px 長刻度與數字）
  for (let x = margin, idx = 0; x <= width - margin; x += 10, idx++) {
    const isMajor = idx % 5 === 0;
    const tickLen = isMajor ? 8 : 4;

    ctx.strokeStyle = isMajor
      ? 'rgba(236, 253, 245, 0.65)'
      : 'rgba(236, 253, 245, 0.32)';
    ctx.lineWidth = isMajor ? 1.4 : 1;

    ctx.beginPath();
    ctx.moveTo(x, margin);
    ctx.lineTo(x, margin - tickLen);
    ctx.moveTo(x, height - margin);
    ctx.lineTo(x, height - margin + tickLen);
    ctx.stroke();

    if (isMajor && idx > 0 && x < width - margin) {
      const label = String(idx);
      ctx.fillText(label, x, margin - 14);
      ctx.fillText(label, x, height - margin + 14);
    }
  }

  // 左、右邊刻度線
  for (let y = margin, idx = 0; y <= height - margin; y += 10, idx++) {
    const isMajor = idx % 5 === 0;
    const tickLen = isMajor ? 8 : 4;

    ctx.strokeStyle = isMajor
      ? 'rgba(236, 253, 245, 0.65)'
      : 'rgba(236, 253, 245, 0.32)';
    ctx.lineWidth = isMajor ? 1.4 : 1;

    ctx.beginPath();
    ctx.moveTo(margin, y);
    ctx.lineTo(margin - tickLen, y);
    ctx.moveTo(width - margin, y);
    ctx.lineTo(width - margin + tickLen, y);
    ctx.stroke();

    if (isMajor && idx > 0 && y < height - margin) {
      const label = String(idx);
      ctx.fillText(label, margin - 15, y);
      ctx.fillText(label, width - margin + 15, y);
    }
  }

  // 右下角切割墊印字裝飾
  ctx.fillStyle = 'rgba(236, 253, 245, 0.25)';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('CUTTING MAT  80×60  A2', width - margin - 10, height - margin - 12);

  ctx.restore();
}

/**
 * 繪製安全區邊界與圈外閃爍危險區特效
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number, radius: number, damagePerSec?: number }} zone
 * @param {number} width
 * @param {number} height
 */
export function drawDangerZone(ctx, zone, width, height) {
  const now = performance.now();
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.006);
  const fastBlink = 0.5 + 0.5 * Math.sin(now * 0.014);

  ctx.save();

  // 1. 圈外閃爍紅色警示遮罩
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = `rgba(239, 68, 68, ${(0.14 + pulse * 0.16).toFixed(3)})`;
  ctx.fill();

  // 2. 圈外斜紋警戒帶（裁切至安全區外部）
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2, true);
  ctx.clip();

  ctx.strokeStyle = `rgba(248, 113, 113, ${(0.08 + fastBlink * 0.12).toFixed(3)})`;
  ctx.lineWidth = 6;
  const stripeOffset = (now * 0.03) % 28;
  ctx.beginPath();
  for (let d = -height + stripeOffset; d < width + height; d += 28) {
    ctx.moveTo(d, 0);
    ctx.lineTo(d - height, height);
  }
  ctx.stroke();
  ctx.restore();

  // 3. 安全區發光外圈與流動虛線邊界
  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(252, 165, 165, ${(0.45 + pulse * 0.45).toFixed(3)})`;
  ctx.lineWidth = 6 + pulse * 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
  ctx.strokeStyle = fastBlink > 0.5 ? '#ef4444' : '#fca5a5';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([12, 8]);
  ctx.lineDashOffset = -(now * 0.04);
  ctx.stroke();

  ctx.restore();
}
