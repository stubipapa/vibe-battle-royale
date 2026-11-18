/**
 * 模組 2：常規攻擊形式師（學生 2 負責，負責 attackId: 0, 1, 2）
 * --------------------------------------------------
 * 目前為「粗糙白色小方塊」樣板，請使用 Antigravity 改造成噴彩虹、筆芯連射、橡皮擦屑散彈等！
 * 鐵則：hitRadius <= visualRadius（上限 20px）、單次總傷害 <= 35、冷卻 300~1200ms。
 */

export const normalAttacks = [
  { id: 0, name: '基礎白方塊', cooldown: 500, color: '#ffffff' },
  { id: 1, name: '快速白方塊', cooldown: 350, color: '#e2e8f0' },
  { id: 2, name: '雙發白方塊', cooldown: 700, color: '#f8fafc' }
];

/**
 * 觸發常規攻擊開火
 * @param {number} attackId - 0, 1, 2
 * @param {object} shooter - { id, x, y, angle }
 * @param {function} spawnBullet - 呼叫 spawnBullet(bulletConfig) 生成子彈
 */
export function onFireNormal(attackId, shooter, spawnBullet) {
  const speed = attackId === 1 ? 8 : 6;
  const damage = attackId === 2 ? 12 : 16;

  if (attackId === 2) {
    // 簡單雙發偏移示例
    [-0.12, 0.12].forEach((offset) => {
      const a = shooter.angle + offset;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 22,
        y: shooter.y + Math.sin(a) * 22,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        damage,
        lifeTime: 1600,
        visualRadius: 5,
        hitRadius: 5,
        color: '#ffffff',
        style: 'rect'
      });
    });
    return;
  }

  spawnBullet({
    x: shooter.x + Math.cos(shooter.angle) * 22,
    y: shooter.y + Math.sin(shooter.angle) * 22,
    vx: Math.cos(shooter.angle) * speed,
    vy: Math.sin(shooter.angle) * speed,
    damage,
    lifeTime: 1800,
    visualRadius: 5,
    hitRadius: 5,
    color: '#ffffff',
    style: 'rect'
  });
}

/**
 * 繪製常規攻擊子彈外觀（目前為粗糙白色小方塊）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawNormalProjectile(ctx, bullet) {
  const r = bullet.visualRadius || 5;
  ctx.save();
  ctx.fillStyle = bullet.color || '#ffffff';
  ctx.fillRect(bullet.x - r, bullet.y - r, r * 2, r * 2);
  ctx.restore();
}
