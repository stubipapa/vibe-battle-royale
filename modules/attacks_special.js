/**
 * 模組 3：特殊攻擊形式師（學生 3 負責，負責 attackId: 3, 4, 5）
 * --------------------------------------------------
 * 目前為「粗糙橘色中方塊」樣板，請使用 Antigravity 改造成超慢巨型西瓜、迴力尺、定時墨水等！
 * 鐵則：hitRadius <= visualRadius（上限 36px）、單發傷害 <= 45、冷卻 800~2500ms。
 */

export const specialAttacks = [
  { id: 3, name: '慢速橘方塊', cooldown: 1100, color: '#fb923c' },
  { id: 4, name: '重型橘方塊', cooldown: 1500, color: '#f97316' },
  { id: 5, name: '長程橘方塊', cooldown: 1300, color: '#ea580c' }
];

/**
 * 觸發特殊攻擊開火
 * @param {number} attackId - 3, 4, 5
 * @param {object} shooter - { id, x, y, angle }
 * @param {function} spawnBullet - 呼叫 spawnBullet(bulletConfig) 生成子彈
 */
export function onFireSpecial(attackId, shooter, spawnBullet) {
  const speed = attackId === 4 ? 3.0 : 4.2;
  const radius = attackId === 4 ? 14 : 10;
  const damage = attackId === 4 ? 32 : 24;

  spawnBullet({
    x: shooter.x + Math.cos(shooter.angle) * 26,
    y: shooter.y + Math.sin(shooter.angle) * 26,
    vx: Math.cos(shooter.angle) * speed,
    vy: Math.sin(shooter.angle) * speed,
    damage,
    lifeTime: 2600,
    visualRadius: radius,
    hitRadius: radius,
    color: '#fb923c',
    style: 'special-rect'
  });
}

/**
 * 繪製特殊攻擊子彈外觀（目前為粗糙橘色中方塊）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawSpecialProjectile(ctx, bullet) {
  const r = bullet.visualRadius || 10;
  ctx.save();
  ctx.fillStyle = bullet.color || '#fb923c';
  ctx.fillRect(bullet.x - r, bullet.y - r, r * 2, r * 2);
  ctx.strokeStyle = '#ffedd5';
  ctx.lineWidth = 2;
  ctx.strokeRect(bullet.x - r, bullet.y - r, r * 2, r * 2);
  ctx.restore();
}
