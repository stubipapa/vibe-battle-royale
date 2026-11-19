/**
 * 模組 1：角色外觀與體質師（學生 1 負責）
 * --------------------------------------------------
 * 自訂 5 種角色：皮卡丘、人魚漢頓、卡比之星、多拉A夢、巧虎
 * 護欄限制：hp (60~160)、speed (2~5)、繪圖不超過 48x48 px。
 */

export const charactersConfig = [
  { id: 0, name: '皮卡丘', color: '#facc15', hp: 160, speed: 2.2 },
  { id: 1, name: '人魚漢頓', color: '#3b82f6', hp: 85, speed: 2.8 },
  { id: 2, name: '卡比之星', color: '#ef4444', hp: 70, speed: 3.3 },
  { id: 3, name: '多拉A夢', color: '#a855f7', hp: 60, speed: 4.4 },
  { id: 4, name: '巧虎', color: '#f97316', hp: 60, speed: 5.0 }
];

/**
 * 繪製瞄準方向指示器（+X 方向）與護盾光環
 */
function drawAimAndShield(ctx, player, accentColor) {
  // 瞄準方向箭頭（位於 +X 前方，總寬度控制在 48x48 px 內）
  ctx.fillStyle = accentColor || '#ffffff';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(22, 0);
  ctx.lineTo(14, -5);
  ctx.lineTo(14, 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 無敵護盾特效（不超過 48x48 px）
  if (player.isShielded) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 21, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPikachu(ctx) {
  // 尖耳朵（含黑色耳尖）
  for (const sy of [-1, 1]) {
    ctx.save();
    ctx.scale(1, sy);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, -10);
    ctx.lineTo(-14, -20);
    ctx.lineTo(-2, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-10, -16);
    ctx.lineTo(-14, -20);
    ctx.lineTo(-7, -15);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // 黃色圓臉
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 紅色電氣頰與眼睛（朝 +X 方向）
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(4, -8, 3, 0, Math.PI * 2);
  ctx.arc(4, 8, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(6, -4.5, 2, 0, Math.PI * 2);
  ctx.arc(6, 4.5, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawHangyodon(ctx) {
  // 藍色頭身
  ctx.fillStyle = '#3b82f6';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 頭頂小魚鰭
  ctx.fillStyle = '#60a5fa';
  ctx.beginPath();
  ctx.moveTo(-6, -12);
  ctx.lineTo(-12, -19);
  ctx.lineTo(-1, -14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 大圓眼
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(3, -6, 4.2, 0, Math.PI * 2);
  ctx.arc(3, 6, 4.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(4.5, -6, 1.8, 0, Math.PI * 2);
  ctx.arc(4.5, 6, 1.8, 0, Math.PI * 2);
  ctx.fill();

  // 招牌厚嘴唇（朝 +X）
  ctx.fillStyle = '#fda4af';
  ctx.beginPath();
  ctx.ellipse(10, 0, 4, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawKirby(ctx) {
  // 小腳丫
  ctx.fillStyle = '#b91c1c';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(-6, -13, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.ellipse(-6, 13, 5, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 紅色圓滾滾本體
  ctx.fillStyle = '#ef4444';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 腮紅與大眼睛
  ctx.fillStyle = '#fca5a5';
  ctx.beginPath();
  ctx.ellipse(2, -8.5, 2.5, 1.8, 0, 0, Math.PI * 2);
  ctx.ellipse(2, 8.5, 2.5, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(5, -4, 1.8, 3.2, 0, 0, Math.PI * 2);
  ctx.ellipse(5, 4, 1.8, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawDoraemon(ctx) {
  // 紫色頭型外框
  ctx.fillStyle = '#a855f7';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 白色內臉
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(2, 0, 10.5, 0, Math.PI * 2);
  ctx.fill();

  // 雙眼與紅鼻子
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(3, -3.5, 3, 0, Math.PI * 2);
  ctx.arc(3, 3.5, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(4, -3, 1.2, 0, Math.PI * 2);
  ctx.arc(4, 3, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(7, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 黃色鈴鐺
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(-11, 0, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawShimajiro(ctx) {
  // 橘色圓耳
  ctx.fillStyle = '#f97316';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(-6, -13, 5, 0, Math.PI * 2);
  ctx.arc(-6, 13, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 橘色老虎圓臉
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 白色口鼻區
  ctx.fillStyle = '#fff7ed';
  ctx.beginPath();
  ctx.ellipse(6, 0, 5.5, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 老虎條紋
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-10, -5);
  ctx.lineTo(-4, -5);
  ctx.moveTo(-11, 0);
  ctx.lineTo(-5, 0);
  ctx.moveTo(-10, 5);
  ctx.lineTo(-4, 5);
  ctx.stroke();

  // 眼睛與鼻子
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(3, -5, 2, 0, Math.PI * 2);
  ctx.arc(3, 5, 2, 0, Math.PI * 2);
  ctx.arc(8, 0, 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 在畫布上繪製單一角色（依角色 ID 或名稱切換對應造型）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} player - { id, x, y, angle, color, name, hp, maxHp, isShielded }
 */
export function drawCharacter(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  const charId = charactersConfig.findIndex(
    (c) => c.id === player.id || c.name === player.name
  );

  switch (charId) {
    case 0:
      drawPikachu(ctx);
      break;
    case 1:
      drawHangyodon(ctx);
      break;
    case 2:
      drawKirby(ctx);
      break;
    case 3:
      drawDoraemon(ctx);
      break;
    case 4:
      drawShimajiro(ctx);
      break;
    default:
      ctx.fillStyle = player.color || '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      break;
  }

  drawAimAndShield(ctx, player, player.color);
  ctx.restore();
}
