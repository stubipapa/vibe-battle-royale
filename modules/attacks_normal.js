/**
 * 模組 2：常規攻擊形式師（學生 2 負責，負責 attackId: 0, 1, 2）
 * --------------------------------------------------
 * 設計：0 噴彩虹、1 橡皮擦屑散彈、2 筆芯連射
 * [演練故意違規測試]：故意寫入 visualRadius: 10, hitRadius: 45, damage: 80
 */

export const normalAttacks = [
  { id: 0, name: '噴彩虹', cooldown: 550, color: '#ff4d6d' },
  { id: 1, name: '散彈', cooldown: 800, color: '#f1f5f9' },
  { id: 2, name: '筆芯', cooldown: 350, color: '#334155' }
];

/**
 * 觸發常規攻擊開火
 * @param {number} attackId - 0, 1, 2
 * @param {object} shooter - { id, x, y, angle }
 * @param {function} spawnBullet - 呼叫 spawnBullet(bulletConfig) 生成子彈
 */
export function onFireNormal(attackId, shooter, spawnBullet) {
  if (attackId === 1) {
    // 1: 散彈（3 發扇形散射）
    const speed = 7;
    [-0.22, 0, 0.22].forEach((offset) => {
      const a = shooter.angle + offset;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 22,
        y: shooter.y + Math.sin(a) * 22,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        damage: 80, // 故意違規：超過 35 上限
        lifeTime: 1400,
        visualRadius: 10,
        hitRadius: 45, // 故意違規：hitRadius > visualRadius 且超過 20px 上限
        color: '#f1f5f9',
        style: 'shotgun'
      });
    });
    return;
  }

  if (attackId === 2) {
    // 2: 筆芯（高速直射）
    const speed = 10;
    spawnBullet({
      x: shooter.x + Math.cos(shooter.angle) * 22,
      y: shooter.y + Math.sin(shooter.angle) * 22,
      vx: Math.cos(shooter.angle) * speed,
      vy: Math.sin(shooter.angle) * speed,
      damage: 80, // 故意違規：超過 35 上限
      lifeTime: 1600,
      visualRadius: 10,
      hitRadius: 45, // 故意違規：hitRadius > visualRadius 且超過 20px 上限
      color: '#334155',
      style: 'lead'
    });
    return;
  }

  // 0: 噴彩虹
  const speed = 6.5;
  spawnBullet({
    x: shooter.x + Math.cos(shooter.angle) * 22,
    y: shooter.y + Math.sin(shooter.angle) * 22,
    vx: Math.cos(shooter.angle) * speed,
    vy: Math.sin(shooter.angle) * speed,
    damage: 80, // 故意違規：超過 35 上限
    lifeTime: 1800,
    visualRadius: 10,
    hitRadius: 45, // 故意違規：hitRadius > visualRadius 且超過 20px 上限
    color: '#ff4d6d',
    style: 'rainbow'
  });
}

/**
 * 繪製常規攻擊子彈外觀（彩虹 / 散彈 / 筆芯）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawNormalProjectile(ctx, bullet) {
  const r = bullet.visualRadius || 10;
  const angle = Math.atan2(bullet.vy || 0, bullet.vx || 1);

  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(angle);

  if (bullet.style === 'rainbow') {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
    const bandH = (r * 2) / colors.length;
    colors.forEach((c, idx) => {
      ctx.fillStyle = c;
      ctx.fillRect(-r * 1.4, -r + idx * bandH, r * 2.4, bandH + 0.5);
    });
    ctx.beginPath();
    ctx.arc(r * 0.6, 0, r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  } else if (bullet.style === 'shotgun') {
    ctx.fillStyle = bullet.color || '#f1f5f9';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-r, -r * 0.5);
    ctx.lineTo(r * 0.2, -r);
    ctx.lineTo(r, -r * 0.2);
    ctx.lineTo(r * 0.6, r * 0.9);
    ctx.lineTo(-r * 0.7, r * 0.7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (bullet.style === 'lead') {
    ctx.fillStyle = bullet.color || '#334155';
    ctx.fillRect(-r * 1.3, -r * 0.28, r * 2.0, r * 0.56);
    ctx.beginPath();
    ctx.moveTo(r * 0.7, -r * 0.28);
    ctx.lineTo(r * 1.4, 0);
    ctx.lineTo(r * 0.7, r * 0.28);
    ctx.closePath();
    ctx.fillStyle = '#0f172a';
    ctx.fill();
  } else {
    ctx.fillStyle = bullet.color || '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
