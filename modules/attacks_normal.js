/**
 * 模組 2：常規攻擊形式師（學生 2 負責，負責 attackId: 0, 1, 2）
 * --------------------------------------------------
 * 台灣夜市食物攻擊系：
 *   0 號：波霸奶茶重砲（高存在感重擊＋奶茶液體飛濺）
 *   1 號：臭豆腐毒氣散彈（3 顆扇形金黃方塊＋扭動綠色臭氣波紋）
 *   2 號：香腸配蒜頭（兩段式攻擊：先丟旋轉烤香腸，再補一片蒜頭）
 * 鐵則：hitRadius <= visualRadius（上限 20px）、單次總傷害 <= 35、冷卻 300~1200ms。
 */

export const normalAttacks = [
  { id: 0, name: '波霸奶茶重砲', cooldown: 950, color: '#d9a066' },
  { id: 1, name: '臭豆腐毒氣散彈', cooldown: 750, color: '#eab308' },
  { id: 2, name: '香腸配蒜頭', cooldown: 520, color: '#dc2626' }
];

/**
 * 觸發常規攻擊開火
 * @param {number} attackId - 0, 1, 2
 * @param {object} shooter - { id, x, y, angle }
 * @param {function} spawnBullet - 呼叫 spawnBullet(bulletConfig) 生成子彈
 */
export function onFireNormal(attackId, shooter, spawnBullet) {
  if (attackId === 0) {
    // 0 號：波霸奶茶重砲（主彈大波霸 25 傷 + 兩側濺出的奶茶液體各 5 傷，總傷 35）
    const mainSpeed = 5.2;
    spawnBullet({
      x: shooter.x + Math.cos(shooter.angle) * 24,
      y: shooter.y + Math.sin(shooter.angle) * 24,
      vx: Math.cos(shooter.angle) * mainSpeed,
      vy: Math.sin(shooter.angle) * mainSpeed,
      damage: 25,
      lifeTime: 1900,
      visualRadius: 18,
      hitRadius: 17,
      color: '#3b2314',
      style: 'boba-heavy'
    });

    // 噴發時伴隨灑出來的奶茶液體水花
    [-0.28, 0.28].forEach((offset) => {
      const a = shooter.angle + offset;
      const splashSpeed = 6.2;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 22,
        y: shooter.y + Math.sin(a) * 22,
        vx: Math.cos(a) * splashSpeed,
        vy: Math.sin(a) * splashSpeed,
        damage: 5,
        lifeTime: 550,
        visualRadius: 6,
        hitRadius: 5,
        color: '#e6c29f',
        style: 'milk-tea-splash'
      });
    });
    return;
  }

  if (attackId === 1) {
    // 1 號：臭豆腐毒氣散彈（3 顆扇形飛出，各 11 傷，總傷 33）
    const speed = 6.5;
    [-0.22, 0, 0.22].forEach((offset) => {
      const a = shooter.angle + offset;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 22,
        y: shooter.y + Math.sin(a) * 22,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        damage: 11,
        lifeTime: 1200,
        visualRadius: 14,
        hitRadius: 10,
        color: '#eab308',
        style: 'stinky-tofu'
      });
    });
    return;
  }

  // 2 號：香腸配蒜頭（兩段式攻擊：先丟旋轉香腸 18 傷，140ms 後再丟蒜頭 10 傷，總傷 28）
  const sausageSpeed = 7.5;
  spawnBullet({
    x: shooter.x + Math.cos(shooter.angle) * 24,
    y: shooter.y + Math.sin(shooter.angle) * 24,
    vx: Math.cos(shooter.angle) * sausageSpeed,
    vy: Math.sin(shooter.angle) * sausageSpeed,
    damage: 18,
    lifeTime: 1600,
    visualRadius: 16,
    hitRadius: 11,
    color: '#dc2626',
    style: 'sausage'
  });

  // 第二段：140ms 後補出一片高速蒜頭
  const garlicAngle = shooter.angle;
  const garlicX = shooter.x + Math.cos(garlicAngle) * 22;
  const garlicY = shooter.y + Math.sin(garlicAngle) * 22;
  setTimeout(() => {
    const garlicSpeed = 9.0;
    spawnBullet({
      x: garlicX,
      y: garlicY,
      vx: Math.cos(garlicAngle) * garlicSpeed,
      vy: Math.sin(garlicAngle) * garlicSpeed,
      damage: 10,
      lifeTime: 1400,
      visualRadius: 11,
      hitRadius: 8,
      color: '#fef08a',
      style: 'garlic'
    });
  }, 140);
}

/**
 * 繪製常規攻擊子彈外觀
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawNormalProjectile(ctx, bullet) {
  const r = bullet.visualRadius || 8;
  const now = performance.now();
  const moveAngle = Math.atan2(bullet.vy || 0, bullet.vx || 1);

  ctx.save();
  ctx.translate(bullet.x, bullet.y);

  if (bullet.style === 'boba-heavy') {
    drawBobaHeavy(ctx, r, moveAngle, now);
  } else if (bullet.style === 'milk-tea-splash') {
    drawMilkTeaSplash(ctx, r, moveAngle, now);
  } else if (bullet.style === 'stinky-tofu') {
    drawStinkyTofu(ctx, r, now);
  } else if (bullet.style === 'sausage') {
    drawSausage(ctx, r, now);
  } else if (bullet.style === 'garlic') {
    drawGarlic(ctx, r, now);
  } else {
    ctx.fillStyle = bullet.color || '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawBobaHeavy(ctx, r, moveAngle, now) {
  // 沿飛行方向畫出灑落的奶茶液體拖尾與飛沫
  ctx.save();
  ctx.rotate(moveAngle);

  const wobble = Math.sin(now * 0.018) * 2.5;
  const trailGrad = ctx.createLinearGradient(-r * 2.1, 0, r * 0.4, 0);
  trailGrad.addColorStop(0, 'rgba(230, 194, 159, 0)');
  trailGrad.addColorStop(0.5, 'rgba(230, 194, 159, 0.72)');
  trailGrad.addColorStop(1, 'rgba(217, 160, 102, 0.92)');

  ctx.fillStyle = trailGrad;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.9);
  ctx.quadraticCurveTo(-r * 1.4, -r * 0.65 + wobble, -r * 2.2, 0);
  ctx.quadraticCurveTo(-r * 1.4, r * 0.65 - wobble, 0, r * 0.9);
  ctx.closePath();
  ctx.fill();

  // 飛濺出來的兩滴小奶茶水珠
  ctx.fillStyle = 'rgba(245, 224, 198, 0.85)';
  ctx.beginPath();
  ctx.arc(-r * 1.45, -r * 0.75 + wobble * 0.6, r * 0.18, 0, Math.PI * 2);
  ctx.arc(-r * 1.65, r * 0.7 - wobble * 0.6, r * 0.14, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 外圍焦糖奶茶光暈
  const halo = ctx.createRadialGradient(0, 0, r * 0.4, 0, 0, r);
  halo.addColorStop(0, 'rgba(217, 160, 102, 0.65)');
  halo.addColorStop(1, 'rgba(217, 160, 102, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // 黑糖波霸珍珠本體
  const bobaR = r * 0.74;
  const bobaGrad = ctx.createRadialGradient(-bobaR * 0.3, -bobaR * 0.3, bobaR * 0.1, 0, 0, bobaR);
  bobaGrad.addColorStop(0, '#6b4226');
  bobaGrad.addColorStop(0.55, '#3b2314');
  bobaGrad.addColorStop(1, '#1c0f08');
  ctx.fillStyle = bobaGrad;
  ctx.beginPath();
  ctx.arc(0, 0, bobaR, 0, Math.PI * 2);
  ctx.fill();

  // 晶瑩 Q 彈高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.ellipse(-bobaR * 0.34, -bobaR * 0.34, bobaR * 0.24, bobaR * 0.14, -Math.PI / 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawMilkTeaSplash(ctx, r, moveAngle, now) {
  ctx.rotate(moveAngle);
  const stretch = 1 + Math.sin(now * 0.025) * 0.15;

  // 拉長的水滴狀奶茶液體
  ctx.fillStyle = 'rgba(230, 194, 159, 0.9)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.3 * stretch, r * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  // 奶蓋高光點
  ctx.fillStyle = 'rgba(255, 250, 240, 0.8)';
  ctx.beginPath();
  ctx.arc(r * 0.3, -r * 0.15, r * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawStinkyTofu(ctx, r, now) {
  // 濃郁的毒綠色臭氣底霧
  const mist = ctx.createRadialGradient(0, 0, r * 0.25, 0, 0, r * 1.15);
  mist.addColorStop(0, 'rgba(132, 204, 22, 0.45)');
  mist.addColorStop(0.6, 'rgba(163, 230, 53, 0.22)');
  mist.addColorStop(1, 'rgba(132, 204, 22, 0)');
  ctx.fillStyle = mist;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
  ctx.fill();

  // 雙層交錯擴散的螢光綠臭氣波紋
  const basePulse = (now * 0.0038) % 1;
  [basePulse, (basePulse + 0.5) % 1].forEach((p) => {
    ctx.strokeStyle = `rgba(163, 230, 53, ${(0.95 * (1 - p)).toFixed(2)})`;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(0, 0, r * (0.58 + p * 0.65), 0, Math.PI * 2);
    ctx.stroke();
  });

  // 3 條明顯向上飄散的螢光綠臭氣波浪線
  ctx.strokeStyle = 'rgba(190, 242, 100, 0.95)';
  ctx.lineWidth = 2.2;
  ctx.lineCap = 'round';
  [-r * 0.42, 0, r * 0.42].forEach((ox, idx) => {
    const wave = Math.sin(now * 0.016 + idx * 1.8) * 3.5;
    ctx.beginPath();
    ctx.moveTo(ox, -r * 0.38);
    ctx.quadraticCurveTo(ox + wave, -r * 0.82, ox - wave, -r * 1.25);
    ctx.stroke();
  });

  // 旋轉的金黃酥脆臭豆腐方塊
  ctx.rotate(now * 0.006);
  const box = r * 0.52;
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 1.6;
  ctx.fillRect(-box, -box, box * 2, box * 2);
  ctx.strokeRect(-box, -box, box * 2, box * 2);

  // 中間一撮紅辣椒／泡菜點綴
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(0, 0, box * 0.36, 0, Math.PI * 2);
  ctx.fill();
}

function drawSausage(ctx, r, now) {
  // 旋轉中的夜市烤香腸
  ctx.rotate(now * 0.011);

  const halfLen = r * 0.85;
  const halfThick = r * 0.36;

  // 香腸本體（飽滿紅褐色膠囊狀）
  ctx.fillStyle = '#c2410c';
  ctx.strokeStyle = '#7c2d12';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.roundRect(-halfLen, -halfThick, halfLen * 2, halfThick * 2, halfThick);
  ctx.fill();
  ctx.stroke();

  // 兩端打結/腸衣尖頭
  ctx.fillStyle = '#9a3412';
  ctx.beginPath();
  ctx.arc(-halfLen - 1.5, 0, halfThick * 0.45, 0, Math.PI * 2);
  ctx.arc(halfLen + 1.5, 0, halfThick * 0.45, 0, Math.PI * 2);
  ctx.fill();

  // 炭烤焦香斜紋
  ctx.strokeStyle = 'rgba(67, 20, 7, 0.75)';
  ctx.lineWidth = 2;
  [-halfLen * 0.48, 0, halfLen * 0.48].forEach((xPos) => {
    ctx.beginPath();
    ctx.moveTo(xPos - 2, -halfThick * 0.78);
    ctx.lineTo(xPos + 2.5, halfThick * 0.78);
    ctx.stroke();
  });

  // 油脂反光高光
  ctx.strokeStyle = 'rgba(254, 215, 170, 0.75)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-halfLen * 0.55, -halfThick * 0.42);
  ctx.lineTo(halfLen * 0.45, -halfThick * 0.42);
  ctx.stroke();
}

function drawGarlic(ctx, r, now) {
  // 旋轉中的蒜頭瓣
  ctx.rotate(now * 0.009);

  // 淡黃色蒜香外光暈
  ctx.fillStyle = 'rgba(254, 240, 138, 0.25)';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
  ctx.fill();

  // 水滴狀乳白微黃蒜頭本體
  ctx.fillStyle = '#fef9c3';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.88);
  ctx.quadraticCurveTo(r * 0.78, -r * 0.1, r * 0.58, r * 0.52);
  ctx.quadraticCurveTo(0, r * 0.85, -r * 0.58, r * 0.52);
  ctx.quadraticCurveTo(-r * 0.78, -r * 0.1, 0, -r * 0.88);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 蒜瓣紋路
  ctx.strokeStyle = 'rgba(202, 138, 4, 0.45)';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.65);
  ctx.quadraticCurveTo(r * 0.16, r * 0.05, 0, r * 0.62);
  ctx.stroke();
}
