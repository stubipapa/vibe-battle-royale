/**
 * 模組 1：角色外觀與體質師（學生 1 負責）
 * --------------------------------------------------
 * 6 種萬物角色：香蕉、原子筆、橡皮擦、珍珠奶茶、西瓜、貓咪
 * 護欄限制：hp (60~160)、speed (2~5)、單一角色繪圖不超過 48x48 px。
 */

export const charactersConfig = [
  { id: 0, name: '香蕉', color: '#facc15', hp: 95, speed: 4.1 },
  { id: 1, name: '原子筆', color: '#3b82f6', hp: 85, speed: 4.4 },
  { id: 2, name: '橡皮擦', color: '#f472b6', hp: 150, speed: 2.5 },
  { id: 3, name: '珍珠奶茶', color: '#d97706', hp: 130, speed: 3.0 },
  { id: 4, name: '西瓜', color: '#22c55e', hp: 140, speed: 2.8 },
  { id: 5, name: '貓咪', color: '#fb923c', hp: 80, speed: 4.7 }
];

function drawAimSight(ctx, x = 20) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + 3, 0);
  ctx.lineTo(x - 3, -3.5);
  ctx.lineTo(x - 3, 3.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawBanana(ctx) {
  // 彎曲香蕉本體（朝 +x 方向為瞄準前緣）
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-14, -15);
  ctx.quadraticCurveTo(14, -12, 16, 0);
  ctx.quadraticCurveTo(14, 12, -14, 15);
  ctx.quadraticCurveTo(-2, 7, -2, 0);
  ctx.quadraticCurveTo(-2, -7, -14, -15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 香蕉高光紋理
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, -9);
  ctx.quadraticCurveTo(8, -5, 9, 0);
  ctx.quadraticCurveTo(8, 5, -5, 9);
  ctx.stroke();

  // 蒂頭與尾端黑點
  ctx.fillStyle = '#713f12';
  ctx.fillRect(-17, -16, 4, 4);
  ctx.beginPath();
  ctx.arc(16, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();

  drawAimSight(ctx, 20);
}

function drawPen(ctx) {
  // 藍色筆身
  ctx.fillStyle = '#3b82f6';
  ctx.strokeStyle = '#1e3a8a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-18, -6, 26, 12, 3);
  ctx.fill();
  ctx.stroke();

  // 筆握防滑套
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(0, -6, 8, 12);

  // 筆夾
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-15, -9, 14, 3);

  // 金屬筆錐與筆尖（明確指向 +x 瞄準方向）
  ctx.fillStyle = '#e2e8f0';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, -6);
  ctx.lineTo(21, 0);
  ctx.lineTo(8, 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 藍墨水筆珠
  ctx.fillStyle = '#1e40af';
  ctx.beginPath();
  ctx.arc(21, 0, 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawEraser(ctx) {
  // 橡皮擦本體（粉白雙色＋紙套）
  ctx.fillStyle = '#fbcfe8';
  ctx.strokeStyle = '#831843';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-17, -12, 34, 24, 4);
  ctx.fill();
  ctx.stroke();

  // 前端藍色擦拭面
  ctx.fillStyle = '#93c5fd';
  ctx.fillRect(7, -11, 9, 22);

  // 中段紙套
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.fillRect(-11, -12, 18, 24);
  ctx.strokeRect(-11, -12, 18, 24);

  // 紙套裝飾條紋
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(-9, -8, 14, 5);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(-9, 2, 14, 4);

  drawAimSight(ctx, 20);
}

function drawBubbleTea(ctx) {
  // 杯身（圓角梯形感）
  ctx.fillStyle = '#fde68a';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.roundRect(-13, -15, 26, 30, 5);
  ctx.fill();
  ctx.stroke();

  // 奶茶液體
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.roundRect(-11, -7, 22, 20, 3);
  ctx.fill();

  // 底部黑糖珍珠
  ctx.fillStyle = '#1c1917';
  const pearls = [
    [-7, 9], [-2, 10], [3, 9], [7, 10],
    [-5, 5], [0, 6], [5, 5]
  ];
  for (const [px, py] of pearls) {
    ctx.beginPath();
    ctx.arc(px, py, 2.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 封膜杯蓋
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  ctx.fillRect(-14, -15, 28, 5);
  ctx.strokeRect(-14, -15, 28, 5);

  // 粗吸管指向 +x 前方做為準星
  ctx.fillStyle = '#ec4899';
  ctx.strokeStyle = '#831843';
  ctx.lineWidth = 1.5;
  ctx.fillRect(4, -3, 18, 6);
  ctx.strokeRect(4, -3, 18, 6);
}

function drawWatermelon(ctx) {
  // 綠色外皮
  ctx.fillStyle = '#16a34a';
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 淺綠白邊
  ctx.fillStyle = '#bbf7d0';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();

  // 多汁紅瓤
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
  ctx.fill();

  // 黑西瓜籽
  ctx.fillStyle = '#0f172a';
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI * 2 * i) / 6;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 2, 1.2, a, 0, Math.PI * 2);
    ctx.fill();
  }

  drawAimSight(ctx, 20);
}

function drawCat(ctx) {
  // 橘貓尾巴（後方擺動）
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-13, 2);
  ctx.quadraticCurveTo(-21, -6, -18, -12);
  ctx.stroke();

  // 尖耳朵
  ctx.fillStyle = '#fb923c';
  ctx.strokeStyle = '#9a3412';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-8, -10);
  ctx.lineTo(-14, -20);
  ctx.lineTo(0, -13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-8, 10);
  ctx.lineTo(-14, 20);
  ctx.lineTo(0, 13);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 圓圓貓頭（面向 +x）
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 虎斑條紋
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.lineTo(-3, -3);
  ctx.moveTo(-10, 0);
  ctx.lineTo(-4, 0);
  ctx.moveTo(-9, 4);
  ctx.lineTo(-3, 3);
  ctx.stroke();

  // 貓眼與粉紅鼻
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(5, -5, 2.2, 0, Math.PI * 2);
  ctx.arc(5, 5, 2.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.arc(11, 0, 2, 0, Math.PI * 2);
  ctx.fill();

  // 鬍鬚（兼作前方視線引導）
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(11, -3);
  ctx.lineTo(19, -6);
  ctx.moveTo(11, 3);
  ctx.lineTo(19, 6);
  ctx.stroke();
}

const CHARACTER_PAINTERS = {
  0: drawBanana,
  1: drawPen,
  2: drawEraser,
  3: drawBubbleTea,
  4: drawWatermelon,
  5: drawCat
};

/**
 * 在畫布上繪製單一角色（支援 6 種萬物角色，含護盾光環與旋轉瞄準）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} player - { x, y, angle, charId, charName, color, name, hp, maxHp, isShielded }
 */
export function drawCharacter(ctx, player) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle || 0);

  if (player.isShielded) {
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.stroke();
  }

  let charId = player.charId;
  if (typeof charId !== 'number' && player.charName) {
    const matched = charactersConfig.find((c) => c.name === player.charName);
    if (matched) charId = matched.id;
  }

  const paint = CHARACTER_PAINTERS[charId] || drawBanana;
  paint(ctx, player);

  ctx.restore();
}
