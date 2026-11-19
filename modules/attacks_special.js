/**
 * 模組 3：特殊攻擊形式師（學生 3 負責，負責 attackId: 3, 4, 5）
 * --------------------------------------------------
 * 主題：萬聖亡靈與魔法大亂鬥
 * 3. 詛咒巨型南瓜王（超慢速巨型鬼火南瓜 + 沿途滾燙南瓜汁）
 * 4. 狂暴魔法掃帚（高速直線掃帚突刺 + 枯葉旋風）
 * 5. 亡靈屍潮圓陣（原地召喚 5 隻殭屍圍成 360 度毒氣護陣）
 *
 * 鐵則：hitRadius <= visualRadius（上限 36px）、單發傷害 <= 45、冷卻 800~2500ms。
 */

export const specialAttacks = [
  { id: 3, name: '詛咒巨型南瓜王', cooldown: 1900, color: '#f97316' },
  { id: 4, name: '狂暴魔法掃帚', cooldown: 1200, color: '#a855f7' },
  { id: 5, name: '亡靈屍潮圓陣', cooldown: 1800, color: '#22c55e' }
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

  if (attackId === 3) {
    // 1. 詛咒巨型南瓜王（滿編 8 顆彈體，總傷 36 + 2*2 + 1*5 = 45）
    const speed = 1.8;
    spawnBullet({
      x: shooter.x + cos * 44,
      y: shooter.y + sin * 44,
      vx: cos * speed,
      vy: sin * speed,
      damage: 36,
      lifeTime: 5000,
      visualRadius: 36,
      hitRadius: 34,
      color: '#f97316',
      style: 'pumpkin-king'
    });

    // 兩側伴飛的幽藍護衛鬼火彈
    for (const offset of [-0.36, 0.36]) {
      const a = shooter.angle + offset;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 38,
        y: shooter.y + Math.sin(a) * 38,
        vx: Math.cos(a) * 3.0,
        vy: Math.sin(a) * 3.0,
        damage: 2,
        lifeTime: 3200,
        visualRadius: 12,
        hitRadius: 10,
        color: '#38bdf8',
        style: 'ghost-wisp'
      });
    }

    // 沿途滴落的 5 灘滾燙南瓜汁
    for (let i = 0; i < 5; i++) {
      const spread = (i - 2) * 0.22;
      const a = shooter.angle + spread;
      spawnBullet({
        x: shooter.x + Math.cos(a) * (20 + i * 7),
        y: shooter.y + Math.sin(a) * (20 + i * 7),
        vx: Math.cos(a) * 0.35,
        vy: Math.sin(a) * 0.35,
        damage: 1,
        lifeTime: 4000,
        visualRadius: 11,
        hitRadius: 10,
        color: '#ff6600',
        style: 'pumpkin-juice'
      });
    }
    return;
  }

  if (attackId === 4) {
    // 2. 狂暴魔法掃帚（滿編 8 顆彈體，總傷 34 + 3*2 + 1*5 = 45）
    const broomSpeed = 8.5;
    spawnBullet({
      x: shooter.x + cos * 30,
      y: shooter.y + sin * 30,
      vx: cos * broomSpeed,
      vy: sin * broomSpeed,
      damage: 34,
      lifeTime: 1050,
      visualRadius: 20,
      hitRadius: 18,
      color: '#a855f7',
      style: 'magic-broom'
    });

    // 捲起的枯葉與黑貓毛旋風（左右兩側伴飛）
    for (const offset of [-0.26, 0.26]) {
      const a = shooter.angle + offset;
      spawnBullet({
        x: shooter.x + Math.cos(a) * 26,
        y: shooter.y + Math.sin(a) * 26,
        vx: Math.cos(a) * 6.5,
        vy: Math.sin(a) * 6.5,
        damage: 3,
        lifeTime: 850,
        visualRadius: 16,
        hitRadius: 14,
        color: '#eab308',
        style: 'leaf-whirl'
      });
    }

    // 5 團過熱黑煙火星殘影
    for (let i = 0; i < 5; i++) {
      const a = shooter.angle + (i - 2) * 0.14;
      const spd = 1.4 + i * 0.45;
      spawnBullet({
        x: shooter.x + Math.cos(a) * (12 + i * 5),
        y: shooter.y + Math.sin(a) * (12 + i * 5),
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        damage: 1,
        lifeTime: 1400,
        visualRadius: 13,
        hitRadius: 11,
        color: '#c084fc',
        style: 'broom-ember'
      });
    }
    return;
  }

  // 3. 亡靈屍潮圓陣 (attackId === 5)：滿編 8 顆彈體（7 隻殭屍各 6 傷 + 中心綠色召喚法陣 3 傷 = 45）
  spawnBullet({
    x: shooter.x,
    y: shooter.y,
    vx: 0,
    vy: 0,
    damage: 3,
    lifeTime: 5000,
    visualRadius: 36,
    hitRadius: 34,
    color: '#22c55e',
    style: 'zombie-ritual'
  });

  const zombieCount = 7;
  const ringRadius = 46;
  for (let i = 0; i < zombieCount; i++) {
    const a = shooter.angle + (i * Math.PI * 2) / zombieCount;
    spawnBullet({
      x: shooter.x + Math.cos(a) * ringRadius,
      y: shooter.y + Math.sin(a) * ringRadius,
      vx: Math.cos(a) * 0.2,
      vy: Math.sin(a) * 0.2,
      damage: 6,
      lifeTime: 5000,
      visualRadius: 18,
      hitRadius: 16,
      color: '#22c55e',
      style: 'zombie-guard'
    });
  }
}

/**
 * 繪製特殊攻擊子彈外觀與動態特效
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} bullet
 */
export function drawSpecialProjectile(ctx, bullet) {
  const now = performance.now();
  const r = bullet.visualRadius || 16;
  const life = typeof bullet.lifeTime === 'number' ? bullet.lifeTime : 1000;

  ctx.save();
  ctx.translate(bullet.x, bullet.y);

  if (bullet.style === 'pumpkin-king') {
    drawPumpkinKing(ctx, r, now, life);
  } else if (bullet.style === 'ghost-wisp') {
    drawGhostWisp(ctx, r, now);
  } else if (bullet.style === 'pumpkin-juice') {
    drawPumpkinJuice(ctx, r, now, life);
  } else if (bullet.style === 'magic-broom') {
    const dir = Math.atan2(bullet.vy || 0, bullet.vx || 1);
    drawMagicBroom(ctx, r, dir, now, life);
  } else if (bullet.style === 'leaf-whirl') {
    drawLeafWhirl(ctx, r, now);
  } else if (bullet.style === 'broom-ember') {
    drawBroomEmber(ctx, r, now, life);
  } else if (bullet.style === 'zombie-ritual') {
    drawZombieRitual(ctx, r, now, life);
  } else if (bullet.style === 'zombie-guard') {
    drawZombieGuard(ctx, r, now, life);
  } else {
    ctx.fillStyle = bullet.color || '#fb923c';
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function drawPumpkinKing(ctx, r, now, life) {
  // 最後 450ms：瞬間膨脹並炸出大片幽藍色鬼火與濃煙 + 雙層衝擊波與飛濺火花
  if (life < 450) {
    const t = 1 - life / 450; // 0 -> 1
    const boomR = r * (1.2 + t * 1.6);

    // 濃煙外圈
    ctx.fillStyle = `rgba(30, 41, 59, ${0.65 * (1 - t)})`;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 + now * 0.005;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * boomR * 0.55, Math.sin(a) * boomR * 0.55, boomR * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 疊加發光：幽藍色鬼火爆發 + 衝擊波環 + 12 顆飛濺靈火粒子
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const ghostBoom = ctx.createRadialGradient(0, 0, 2, 0, 0, boomR);
    ghostBoom.addColorStop(0, `rgba(224, 242, 254, ${0.95 * (1 - t * 0.5)})`);
    ghostBoom.addColorStop(0.45, `rgba(56, 189, 248, ${0.9 * (1 - t * 0.65)})`);
    ghostBoom.addColorStop(1, 'rgba(37, 99, 235, 0)');
    ctx.fillStyle = ghostBoom;
    ctx.beginPath();
    ctx.arc(0, 0, boomR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(125, 211, 252, ${0.85 * (1 - t)})`;
    ctx.lineWidth = 3 * (1 - t) + 1;
    ctx.beginPath();
    ctx.arc(0, 0, boomR * 0.95, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(186, 230, 253, ${1 - t})`;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI * 2) / 12 + 0.3;
      const dist = boomR * (0.4 + t * 0.75);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * dist, Math.sin(a) * dist, 3.2 * (1 - t) + 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    return;
  }

  // 低空漂浮陰影
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, r * 0.92, r * 0.72, r * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();

  // 沿途往下滴落的螢光橘濃稠汁液與熱氣
  const dripY = ((now * 0.04) % 14);
  ctx.fillStyle = 'rgba(255, 115, 0, 0.9)';
  ctx.beginPath();
  ctx.arc(-r * 0.25, r * 0.72 + dripY * 0.5, 3.2, 0, Math.PI * 2);
  ctx.arc(r * 0.2, r * 0.78 + ((dripY + 7) % 14) * 0.5, 2.6, 0, Math.PI * 2);
  ctx.fill();

  // 搖晃低空漂浮
  const wobbleY = Math.sin(now * 0.006) * 4;
  const wobbleRot = Math.sin(now * 0.0045) * 0.14;
  ctx.translate(0, wobbleY);
  ctx.rotate(wobbleRot);

  // 外層強力鬼火發光靈氣與環繞靈火粒子
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const aura = ctx.createRadialGradient(0, 0, r * 0.35, 0, 0, r * 1.32);
  aura.addColorStop(0, 'rgba(56, 189, 248, 0.38)');
  aura.addColorStop(0.6, 'rgba(34, 197, 94, 0.28)');
  aura.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.32, 0, Math.PI * 2);
  ctx.fill();

  // 脈動能量光環
  const ringPulse = 0.95 + Math.sin(now * 0.012) * 0.1;
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.08 * ringPulse, 0, Math.PI * 2);
  ctx.stroke();

  // 6 顆環繞飄浮的綠色／青色鬼火粒子
  for (let i = 0; i < 6; i++) {
    const a = now * 0.004 + (i * Math.PI * 2) / 6;
    const pr = r * (1.02 + Math.sin(now * 0.01 + i) * 0.12);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(74, 222, 128, 0.85)' : 'rgba(56, 189, 248, 0.85)';
    ctx.beginPath();
    ctx.arc(Math.cos(a) * pr, Math.sin(a) * pr, 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  ctx.globalAlpha = 0.86;

  // 枯萎蒂頭
  ctx.fillStyle = '#14532d';
  ctx.beginPath();
  ctx.roundRect(-4, -r * 0.98, 8, r * 0.28, 3);
  ctx.fill();

  // 半透明幽靈南瓜本體
  ctx.fillStyle = 'rgba(234, 88, 12, 0.78)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.9, r * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(124, 45, 18, 0.9)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = 'rgba(249, 115, 22, 0.76)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 0.56, r * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 眼窩燃燒綠色鬼火
  const fireFlicker = Math.sin(now * 0.025) * 2.2;
  ctx.shadowColor = '#4ade80';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#22c55e';
  for (const sx of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(sx * r * 0.42, -r * 0.06);
    ctx.lineTo(sx * r * 0.14, -r * 0.34 - fireFlicker);
    ctx.lineTo(sx * r * 0.1, -r * 0.02);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#bbf7d0';
    ctx.beginPath();
    ctx.arc(sx * r * 0.22, -r * 0.12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
  }

  // 扭曲鬼臉大嘴
  ctx.fillStyle = '#86efac';
  ctx.beginPath();
  ctx.moveTo(-r * 0.46, r * 0.14);
  ctx.lineTo(-r * 0.26, r * 0.36);
  ctx.lineTo(-r * 0.06, r * 0.16);
  ctx.lineTo(r * 0.12, r * 0.4);
  ctx.lineTo(r * 0.46, r * 0.12);
  ctx.lineTo(r * 0.28, r * 0.52);
  ctx.lineTo(0, r * 0.35);
  ctx.lineTo(-r * 0.28, r * 0.54);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawPumpkinJuice(ctx, r, now, life) {
  const fade = Math.min(1, life / 600);
  ctx.globalAlpha = fade;

  // 冒泡腐蝕痕跡（螢光橘濃稠汁液 + 外發光暈）
  const pulse = 1 + Math.sin(now * 0.01) * 0.08;
  ctx.scale(pulse, pulse);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const glow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.4);
  glow.addColorStop(0, 'rgba(255, 115, 0, 0.5)');
  glow.addColorStop(1, 'rgba(255, 115, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 102, 0, 0.85)';
  ctx.beginPath();
  ctx.ellipse(0, 0, r * 1.1, r * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#fdba74';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 冒泡氣泡與飛濺熱氣火星
  const b1 = ((now * 0.018) % 8);
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(-r * 0.3, -r * 0.1, 2.4, 0, Math.PI * 2);
  ctx.arc(r * 0.32, r * 0.15, 1.8, 0, Math.PI * 2);
  ctx.arc(-r * 0.1, -r * 0.4 - b1, 1.4, 0, Math.PI * 2);
  ctx.arc(r * 0.25, -r * 0.3 - ((b1 + 4) % 8), 1.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawMagicBroom(ctx, r, dir, now, life) {
  ctx.rotate(dir);

  // 衝刺終點（最後 320ms）：掃帚冒出黑煙並散架解體，原地留下一頂女巫帽 + 魔法星環火花
  if (life < 320) {
    const t = 1 - life / 320;
    ctx.fillStyle = `rgba(31, 41, 55, ${0.75 * (1 - t)})`;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(-i * 6, (i % 2 === 0 ? -1 : 1) * t * 10, r * (0.45 + t * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }
    // 斷裂飛散的木柄與掃把草
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -t * 8);
    ctx.lineTo(0, -t * 12);
    ctx.moveTo(r * 0.1, t * 9);
    ctx.lineTo(r * 0.65, t * 5);
    ctx.stroke();

    // 餘燼火花與紫色衝擊波
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(192, 132, 252, ${0.8 * (1 - t)})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, r * (0.6 + t * 0.9), 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(232, 121, 249, ${1 - t})`;
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI * 2) / 6 + t * 2;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * (0.5 + t * 0.7), Math.sin(a) * r * (0.5 + t * 0.7), 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 遺留的女巫帽子（轉回正立角度）
    ctx.rotate(-dir);
    ctx.fillStyle = '#581c87';
    ctx.beginPath();
    ctx.ellipse(0, 6, 13, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-8, 5);
    ctx.lineTo(1, -12);
    ctx.lineTo(8, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-7, 4);
    ctx.lineTo(7, 4);
    ctx.stroke();
    return;
  }

  // 發光層：破空錐形音爆衝擊波 + 長長的紫黑色魔法尾焰 + 噴射星塵粒子
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';

  // 破空錐形衝擊波（前端）
  ctx.strokeStyle = 'rgba(240, 171, 252, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(r * 0.25, 0, r * 0.82, -0.85, 0.85);
  ctx.stroke();

  const headGlow = ctx.createRadialGradient(r * 0.55, 0, 2, r * 0.55, 0, r * 0.9);
  headGlow.addColorStop(0, 'rgba(250, 232, 255, 0.7)');
  headGlow.addColorStop(1, 'rgba(168, 85, 247, 0)');
  ctx.fillStyle = headGlow;
  ctx.beginPath();
  ctx.arc(r * 0.55, 0, r * 0.9, 0, Math.PI * 2);
  ctx.fill();

  // 長長的紫黑色魔法火星與狂風殘影
  const tailLen = r * (2.2 + Math.sin(now * 0.045) * 0.4);
  const grad = ctx.createLinearGradient(-r * 0.35, 0, -r * 0.35 - tailLen, 0);
  grad.addColorStop(0, 'rgba(217, 70, 239, 0.95)');
  grad.addColorStop(0.45, 'rgba(126, 34, 206, 0.75)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, -r * 0.48);
  ctx.lineTo(-r * 0.35 - tailLen, 0);
  ctx.lineTo(-r * 0.35, r * 0.48);
  ctx.closePath();
  ctx.fill();

  // 10 顆高速後掠魔法火星粒子
  for (let i = 0; i < 10; i++) {
    const px = -r * 0.45 - ((now * 0.14 + i * 19) % (r * 2.4));
    const py = Math.sin(i * 2.1 + now * 0.02) * (r * 0.45);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(240, 171, 252, 0.95)' : 'rgba(250, 204, 21, 0.9)';
    ctx.beginPath();
    ctx.arc(px, py, 1.8 + (i % 2) * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 狂風速度線
  ctx.strokeStyle = 'rgba(216, 180, 254, 0.75)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-r * 0.2, -r * 0.62);
  ctx.lineTo(-r * 1.8, -r * 0.72);
  ctx.moveTo(-r * 0.2, r * 0.62);
  ctx.lineTo(-r * 1.8, r * 0.72);
  ctx.stroke();

  // 破舊木頭掃帚柄
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.95, 0);
  ctx.lineTo(r * 0.85, 0);
  ctx.stroke();

  // 掃帚刷毛
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.moveTo(-r * 0.35, 0);
  ctx.lineTo(-r * 1.05, -r * 0.46);
  ctx.lineTo(-r * 0.86, 0);
  ctx.lineTo(-r * 1.05, r * 0.46);
  ctx.closePath();
  ctx.fill();

  // 狼狽跨坐在掃帚上的小巫師剪影（微晃）
  const shake = Math.sin(now * 0.06) * 1.5;
  ctx.fillStyle = '#3b0764';
  ctx.beginPath();
  ctx.arc(0, -5 + shake, 6, 0, Math.PI * 2);
  ctx.fill();
  // 尖頂巫師帽被風吹歪
  ctx.fillStyle = '#581c87';
  ctx.beginPath();
  ctx.moveTo(-6, -7 + shake);
  ctx.lineTo(-12, -14 + shake);
  ctx.lineTo(5, -8 + shake);
  ctx.closePath();
  ctx.fill();
}

function drawLeafWhirl(ctx, r, now) {
  ctx.rotate(now * 0.022);

  // 金黃色風壓疊加發光層與微光塵埃粒子
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const windGlow = ctx.createRadialGradient(0, 0, r * 0.2, 0, 0, r * 1.25);
  windGlow.addColorStop(0, 'rgba(250, 204, 21, 0.35)');
  windGlow.addColorStop(1, 'rgba(234, 179, 8, 0)');
  ctx.fillStyle = windGlow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI * 2) / 4 + now * 0.01;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 旋風氣流外圈
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 1.35);
  ctx.stroke();

  // 飛舞枯葉
  const leafColors = ['#d97706', '#ca8a04', '#92400e'];
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = leafColors[i];
    ctx.beginPath();
    ctx.ellipse(r * 0.5, 0, r * 0.26, r * 0.11, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 黑貓毛髮絲縷
  ctx.strokeStyle = '#18181b';
  ctx.lineWidth = 1.6;
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3 + 0.55;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.38, a, a + 0.65);
    ctx.stroke();
  }
}

function drawGhostWisp(ctx, r, now) {
  const pulse = 1 + Math.sin(now * 0.018) * 0.14;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 1, 0, 0, r * 1.35 * pulse);
  g.addColorStop(0, 'rgba(224, 242, 254, 0.95)');
  g.addColorStop(0.5, 'rgba(56, 189, 248, 0.7)');
  g.addColorStop(1, 'rgba(37, 99, 235, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.35 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#bae6fd';
  for (let i = 0; i < 3; i++) {
    const a = now * 0.01 + (i * Math.PI * 2) / 3;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBroomEmber(ctx, r, now, life) {
  const fade = Math.min(1, life / 500);
  ctx.globalAlpha = fade;

  ctx.fillStyle = 'rgba(31, 41, 55, 0.55)';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgba(217, 70, 239, 0.85)';
  for (let i = 0; i < 4; i++) {
    const a = now * 0.008 + (i * Math.PI * 2) / 4;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r * 0.48, Math.sin(a) * r * 0.48, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawZombieRitual(ctx, r, now, life) {
  const fade = Math.min(1, life / 500);
  ctx.globalAlpha = fade;
  ctx.rotate(now * 0.0025);

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, r);
  g.addColorStop(0, 'rgba(74, 222, 128, 0.28)');
  g.addColorStop(0.75, 'rgba(34, 197, 94, 0.16)');
  g.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();

  // 旋轉綠色亡靈符文法陣外環與內接五芒星
  ctx.strokeStyle = 'rgba(74, 222, 128, 0.72)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= 5; i++) {
    const a = (i * 2 * Math.PI * 2) / 5;
    const x = Math.cos(a) * r * 0.82;
    const y = Math.sin(a) * r * 0.82;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawZombieGuard(ctx, r, now, life) {
  // 最後 450ms：化作白骨消散 + 向上飄散的靈魂星塵粒子
  if (life < 450) {
    const t = 1 - life / 450;
    const alpha = life / 450;
    ctx.globalAlpha = alpha;

    // 飄散靈魂光粒
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = `rgba(134, 239, 172, ${alpha})`;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 + 0.4;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * r * (0.4 + t * 0.6), -t * 14 + Math.sin(a) * 4, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 白骨骷髏頭與交叉骨頭
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r * 0.5, -r * 0.3);
    ctx.lineTo(r * 0.5, r * 0.5);
    ctx.moveTo(r * 0.5, -r * 0.3);
    ctx.lineTo(-r * 0.5, r * 0.5);
    ctx.stroke();

    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.arc(0, -r * 0.15, r * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-3, -r * 0.18, 2, 0, Math.PI * 2);
    ctx.arc(3, -r * 0.18, 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  // 剛召喚前 350ms：破土而出動畫（從下往上冒出 + 陰森綠光召喚陣法衝擊波）
  const emerge = life > 4650 ? 1 - (life - 4650) / 350 : 1;
  if (emerge < 1) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = `rgba(74, 222, 128, ${1 - emerge * 0.7})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 4, r * (0.6 + emerge * 0.9), 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const sway = Math.sin(now * 0.015) * 1.8;
  ctx.translate(0, (1 - emerge) * 12 + sway);

  // 腳下陰森綠光法陣 + 上升怨靈粒子
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const greenGlow = ctx.createRadialGradient(0, 2, 2, 0, 2, r * 1.25);
  greenGlow.addColorStop(0, 'rgba(74, 222, 128, 0.55)');
  greenGlow.addColorStop(0.6, 'rgba(34, 197, 94, 0.25)');
  greenGlow.addColorStop(1, 'rgba(34, 197, 94, 0)');
  ctx.fillStyle = greenGlow;
  ctx.beginPath();
  ctx.arc(0, 2, r * 1.25, 0, Math.PI * 2);
  ctx.fill();

  // 4 顆緩緩上升的綠色怨靈光粒
  ctx.fillStyle = 'rgba(134, 239, 172, 0.85)';
  for (let i = 0; i < 4; i++) {
    const py = 8 - ((now * 0.025 + i * 7) % 24);
    const px = Math.sin(now * 0.008 + i * 1.7) * (r * 0.65);
    ctx.beginPath();
    ctx.arc(px, py, 1.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 破爛古裝（暗青色清朝官服感 + 補丁）
  ctx.fillStyle = '#1e3a5f';
  ctx.beginPath();
  ctx.roundRect(-r * 0.52, -1, r * 1.04, r * 0.72, 4);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 雙臂交扣人牆（青白手臂伸出）
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-r * 0.92, 4);
  ctx.lineTo(r * 0.92, 4);
  ctx.stroke();

  // 臉色青白的殭屍頭
  ctx.fillStyle = '#d1fae5';
  ctx.beginPath();
  ctx.arc(0, -r * 0.18, r * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 古裝官帽與黃色鎮魂符
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-r * 0.48, -r * 0.7, r * 0.96, 5);
  ctx.fillStyle = '#facc15';
  ctx.fillRect(-2.5, -r * 0.64, 5, r * 0.36);

  // 發紅雙眼
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.arc(-r * 0.18, -r * 0.18, 2.2, 0, Math.PI * 2);
  ctx.arc(r * 0.18, -r * 0.18, 2.2, 0, Math.PI * 2);
  ctx.fill();
}
