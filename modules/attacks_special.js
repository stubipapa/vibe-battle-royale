/**
 * 模組 3：特殊攻擊形式師（學生 3 負責，負責 attackId: 3, 4, 5）
 * --------------------------------------------------
 * [演練暴力測試版] 實作巨型西瓜 / 旋轉直尺 / 墨水球，故意填入違規數值測試審查。
 */

export const specialAttacks = [
  { id: 3, name: '巨型西瓜', cooldown: 1200, color: '#22c55e' },
  { id: 4, name: '旋轉直尺', cooldown: 1400, color: '#facc15' },
  { id: 5, name: '墨水球', cooldown: 1100, color: '#1e293b' }
];

/**
 * 觸發特殊攻擊開火
 * @param {number} attackId - 3, 4, 5
 * @param {object} shooter - { id, x, y, angle }
 * @param {function} spawnBullet - 呼叫 spawnBullet(bulletConfig) 生成子彈
 */
export function onFireSpecial(attackId, shooter, spawnBullet) {
  const cos = Math.cos(shooter.angle);
  const sin = Math.sin(shooter.angle);
  const spawnX = shooter.x + cos * 28;
  const spawnY = shooter.y + sin * 28;

  if (attackId === 3) {
    // 故意違規測試：damage: 999、visualRadius: 60、hitRadius: 60
    spawnBullet({
      x: spawnX,
      y: spawnY,
      vx: cos * 2.4,
      vy: sin * 2.4,
      damage: 999,
      lifeTime: 3000,
      visualRadius: 60,
      hitRadius: 60,
      color: '#22c55e',
      style: 'watermelon'
    });
    return;
  }

  if (attackId === 4) {
    spawnBullet({
      x: spawnX,
      y: spawnY,
      vx: cos * 4.5,
      vy: sin * 4.5,
      damage: 999,
      lifeTime: 2400,
      visualRadius: 60,
      hitRadius: 60,
      color: '#facc15',
      style: 'ruler'
    });
    return;
  }

  spawnBullet({
    x: spawnX,
    y: spawnY,
    vx: cos * 3.8,
    vy: sin * 3.8,
    damage: 999,
    lifeTime: 2600,
    visualRadius: 60,
    hitRadius: 60,
    color: '#0f172a',
    style: 'inkball'
  });
}

/**
 * 繪製特殊攻擊子彈外觀（巨型西瓜 / 旋轉直尺 / 墨水球）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawSpecialProjectile(ctx, bullet) {
  const r = bullet.visualRadius || 24;
  const t = performance.now() * 0.008;

  ctx.save();
  ctx.translate(bullet.x, bullet.y);

  if (bullet.style === 'watermelon') {
    ctx.rotate(t * 0.6);
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = Math.max(2, r * 0.14);
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(i * r * 0.3, 0, r * 0.65, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
    ctx.strokeStyle = '#bbf7d0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
  } else if (bullet.style === 'ruler') {
    ctx.rotate(t * 1.8);
    const w = r * 1.9;
    const h = r * 0.45;
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeStyle = '#854d0e';
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2, -h / 2, w, h);
    ctx.beginPath();
    for (let x = -w / 2 + 6; x < w / 2 - 4; x += 6) {
      ctx.moveTo(x, -h / 2);
      ctx.lineTo(x, -h / 2 + h * 0.45);
    }
    ctx.stroke();
  } else {
    const pulse = 1 + Math.sin(t * 1.5) * 0.12;
    ctx.fillStyle = 'rgba(30, 41, 59, 0.35)';
    ctx.beginPath();
    ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * pulse, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
