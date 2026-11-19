/**
 * 模組 4：戰場環境與縮圈師（學生 4 負責）
 * --------------------------------------------------
 * 主題：Temple Run 古神廟遺跡 × 裂紋熔岩護城河 × 叢林秘境藤蔓與螢火蟲 × 浮雕文化圖騰
 * 護欄限制：初始半徑 >= 380px、最小半徑 >= 70px、圈外扣血 3~12 HP/s。
 */

const INITIAL_RADIUS = 505;
const MIN_RADIUS = 80;
const FIRST_SHRINK_DELAY_SEC = 5;
const SHRINK_INTERVAL_SEC = 30;
const SHRINK_STEP_PX = 300;

/**
 * 依據回合經過秒數計算目前安全區（5 秒後即刻進場緩慢縮圈版）
 * - 0~5 秒：半徑維持 505px（剛好在 800×600 四角 500px 之外）
 * - 5~35 秒（第 1 次縮圈）：從 505px 緩慢連續縮小 300px 至 205px（5.5 秒起即出現在畫面四角），圈外 3 HP/s
 * - 35~65 秒（第 2 次縮圈）：從 205px 緩慢縮小至最小安全半徑 80px（>= 70px 護欄），圈外 6 HP/s
 * - 65~95 秒（第 3 次縮圈）：維持 80px，圈外 9 HP/s
 * - 95 秒以上（第 4 次以上）：維持 80px，圈外 12 HP/s（上限 12）
 * @param {number} elapsedSec
 * @returns {{ x: number, y: number, radius: number, damagePerSec: number }}
 */
export function getShrinkZone(elapsedSec) {
  const safeElapsed = Math.max(0, elapsedSec);

  if (safeElapsed < FIRST_SHRINK_DELAY_SEC) {
    return {
      x: 400,
      y: 300,
      radius: INITIAL_RADIUS,
      damagePerSec: 3
    };
  }

  const activeSec = safeElapsed - FIRST_SHRINK_DELAY_SEC;
  const shrinkPhase = Math.floor(activeSec / SHRINK_INTERVAL_SEC) + 1;
  const phaseProgress = (activeSec % SHRINK_INTERVAL_SEC) / SHRINK_INTERVAL_SEC;

  const prevTarget = Math.max(MIN_RADIUS, INITIAL_RADIUS - (shrinkPhase - 1) * SHRINK_STEP_PX);
  const currTarget = Math.max(MIN_RADIUS, INITIAL_RADIUS - shrinkPhase * SHRINK_STEP_PX);
  const radius = prevTarget + (currTarget - prevTarget) * phaseProgress;

  const damagePerSec = Math.min(12, Math.max(3, shrinkPhase * 3));

  return {
    x: 400,
    y: 300,
    radius,
    damagePerSec
  };
}

// 預先產生的不規則古神廟石板與青苔分布
const STONE_SLABS = [
  { x: 68, y: 65, w: 120, h: 80, shade: 0.03, moss: true },
  { x: 205, y: 55, w: 135, h: 76, shade: -0.02, moss: false },
  { x: 360, y: 60, w: 125, h: 78, shade: 0.02, moss: true },
  { x: 505, y: 56, w: 140, h: 78, shade: -0.03, moss: true },
  { x: 58, y: 195, w: 110, h: 105, shade: -0.02, moss: true },
  { x: 185, y: 175, w: 130, h: 92, shade: 0.03, moss: false },
  { x: 495, y: 180, w: 135, h: 98, shade: 0.02, moss: true },
  { x: 635, y: 215, w: 105, h: 110, shade: -0.03, moss: true },
  { x: 65, y: 365, w: 120, h: 95, shade: 0.02, moss: true },
  { x: 200, y: 415, w: 135, h: 90, shade: -0.02, moss: false },
  { x: 355, y: 445, w: 130, h: 88, shade: 0.03, moss: true },
  { x: 505, y: 430, w: 140, h: 92, shade: -0.02, moss: true }
];

const STONE_CRACKS = [
  [[155, 130], [178, 155], [170, 188]],
  [[605, 145], [582, 172], [595, 202]],
  [[210, 420], [235, 442], [225, 472]],
  [[565, 405], [542, 432], [558, 462]]
];

// 攀附在古神廟石台邊緣的秘境藤蔓路徑
const JUNGLE_VINES = [
  { p0: [390, 40], p1: [435, 68], p2: [475, 50], p3: [525, 82], phase: 0.4 },
  { p0: [756, 175], p1: [715, 215], p2: [735, 258], p3: [698, 295], phase: 1.3 },
  { p0: [44, 245], p1: [82, 275], p2: [64, 320], p3: [102, 352], phase: 2.2 },
  { p0: [245, 560], p1: [288, 524], p2: [338, 544], p3: [382, 512], phase: 3.1 },
  { p0: [560, 560], p1: [602, 526], p2: [645, 542], p3: [684, 512], phase: 4.0 }
];

// 秘境林間漂浮的螢火蟲／光點孢子
const FIREFLIES = Array.from({ length: 16 }, (_, i) => {
  const seed = Math.sin(i * 45.164 + 1.7) * 43758.5453;
  const f1 = seed - Math.floor(seed);
  const f2 = ((seed * 3.17) % 1 + 1) % 1;
  return {
    bx: 80 + f1 * 640,
    by: 80 + f2 * 440,
    rx: 14 + (i % 4) * 6,
    ry: 10 + (i % 3) * 5,
    speed: 0.0007 + (i % 5) * 0.00018,
    phase: i * 1.3
  };
});

// 熔岩護城河上龜裂的玄武岩浮殼區塊
const MAGMA_CRUST_CELLS = (() => {
  const cells = [];
  const cols = 22;
  const rows = 16;
  const cw = 800 / cols;
  const ch = 600 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r >= 2 && r <= rows - 3 && c >= 2 && c <= cols - 3) continue;
      const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
      const frac = seed - Math.floor(seed);
      cells.push({
        cx: (c + 0.5) * cw + (frac - 0.5) * 6,
        cy: (r + 0.5) * ch + ((frac * 7 % 1) - 0.5) * 6,
        rx: cw * (0.34 + (frac * 0.08)),
        ry: ch * (0.34 + ((frac * 3 % 1) * 0.08)),
        rot: frac * Math.PI,
        phase: frac * Math.PI * 2
      });
    }
  }
  return cells;
})();

/**
 * 繪製神廟外圍真正的裂紋熔岩護城河
 */
function drawPerimeterMagmaMoat(ctx, width, height, now) {
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.003);

  const magmaGrad = ctx.createLinearGradient(0, 0, width, height);
  magmaGrad.addColorStop(0, '#ea580c');
  magmaGrad.addColorStop(0.25, '#facc15');
  magmaGrad.addColorStop(0.5, '#dc2626');
  magmaGrad.addColorStop(0.75, '#f97316');
  magmaGrad.addColorStop(1, '#ea580c');
  ctx.fillStyle = magmaGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.35 + pulse * 0.2;
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 10;
  ctx.setLineDash([45, 55]);
  ctx.lineDashOffset = -(now * 0.025);
  ctx.strokeRect(18, 18, width - 36, height - 36);
  ctx.setLineDash([]);
  ctx.restore();

  for (const cell of MAGMA_CRUST_CELLS) {
    const dx = Math.sin(now * 0.0008 + cell.phase) * 2.2;
    const dy = Math.cos(now * 0.0007 + cell.phase) * 2.2;
    ctx.save();
    ctx.translate(cell.cx + dx, cell.cy + dy);
    ctx.rotate(cell.rot);

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const rScale = i % 2 === 0 ? 1.0 : 0.86;
      const px = Math.cos(a) * cell.rx * rScale;
      const py = Math.sin(a) * cell.ry * rScale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();

    ctx.fillStyle = '#1f120e';
    ctx.fill();
    ctx.strokeStyle = `rgba(251, 146, 60, ${0.45 + pulse * 0.25})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < 18; i++) {
    const t = (now * 0.0005 + i * 0.17) % 1;
    const side = i % 4;
    let sx = 20;
    let sy = 20;
    if (side === 0) { sx = ((i * 97) % 760) + 20; sy = 24 - t * 14; }
    else if (side === 1) { sx = ((i * 113) % 760) + 20; sy = height - 18 - t * 14; }
    else if (side === 2) { sx = 22; sy = ((i * 89) % 560) + 20 - t * 12; }
    else { sx = width - 22; sy = ((i * 103) % 560) + 20 - t * 12; }

    const alpha = Math.sin(t * Math.PI);
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5 + alpha * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 249, 195, ${alpha * 0.9})`;
    ctx.fill();
  }
}

/**
 * 繪製架在熔岩護城河之上的古神廟石台輪廓
 */
function traceTemplePlatform(ctx, width, height) {
  const mX = 44;
  const mY = 40;
  const r = 24;
  ctx.beginPath();
  ctx.moveTo(mX + r, mY);
  ctx.lineTo(width - mX - r, mY);
  ctx.quadraticCurveTo(width - mX, mY, width - mX, mY + r);
  ctx.lineTo(width - mX, height - mY - r);
  ctx.quadraticCurveTo(width - mX, height - mY, width - mX - r, height - mY);
  ctx.lineTo(mX + r, height - mY);
  ctx.quadraticCurveTo(mX, height - mY, mX, height - mY - r);
  ctx.lineTo(mX, mY + r);
  ctx.quadraticCurveTo(mX, mY, mX + r, mY);
  ctx.closePath();
}

/**
 * 繪製圓潤風化的古神廟石板與翠綠青苔
 */
function drawWeatheredSlab(ctx, s) {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(s.x, s.y, s.w, s.h, 12);
  ctx.fillStyle = s.shade > 0 ? 'rgba(255, 237, 213, 0.035)' : 'rgba(12, 10, 9, 0.22)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(28, 22, 18, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(s.x + 14, s.y + 2);
  ctx.lineTo(s.x + s.w - 14, s.y + 2);
  ctx.strokeStyle = 'rgba(245, 208, 169, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (s.moss) {
    const mx = s.x + s.w * 0.25;
    const my = s.y + s.h * 0.76;
    const grad = ctx.createRadialGradient(mx, my, 3, mx, my, 28);
    grad.addColorStop(0, 'rgba(34, 197, 94, 0.24)');
    grad.addColorStop(0.55, 'rgba(21, 128, 61, 0.12)');
    grad.addColorStop(1, 'rgba(20, 83, 45, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, 28, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * 繪製攀附於神廟石台的秘境藤蔓與小葉片
 */
function drawCreepingVine(ctx, v, now) {
  const sway = Math.sin(now * 0.0014 + v.phase) * 3;
  ctx.save();

  ctx.beginPath();
  ctx.moveTo(v.p0[0], v.p0[1]);
  ctx.bezierCurveTo(v.p1[0], v.p1[1] + sway, v.p2[0], v.p2[1] - sway, v.p3[0], v.p3[1] + sway);
  ctx.strokeStyle = '#14532d';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.stroke();

  // 沿藤蔓生長的 4 對秘境小葉
  for (let i = 1; i <= 4; i++) {
    const t = i / 5;
    const lx = v.p0[0] + (v.p3[0] - v.p0[0]) * t;
    const ly = v.p0[1] + (v.p3[1] - v.p0[1]) * t + Math.sin(t * Math.PI) * sway;
    const angle = Math.atan2(v.p3[1] - v.p0[1], v.p3[0] - v.p0[0]) + (i % 2 === 0 ? 0.7 : -0.7);
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(8, -5, 16, 0);
    ctx.quadraticCurveTo(8, 5, 0, 0);
    ctx.fillStyle = i % 2 === 0 ? '#166534' : '#15803d';
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 繪製隨風輕輕搖曳的熱帶蕨葉叢
 */
function drawSwayingFern(ctx, x, y, baseAngle, scale, now, phase) {
  const sway = Math.sin(now * 0.0016 + phase) * 0.06;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(baseAngle + sway);
  ctx.scale(scale, scale);

  const fronds = [
    { a: -0.52, len: 86, w: 15, c: '#14532d' },
    { a: 0.48, len: 82, w: 14, c: '#14532d' },
    { a: -0.18, len: 100, w: 17, c: '#166534' },
    { a: 0.18, len: 92, w: 15, c: '#15803d' },
    { a: 0.0, len: 74, w: 12, c: '#22c55e' }
  ];

  for (const f of fronds) {
    ctx.save();
    ctx.rotate(f.a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(f.len * 0.45, -f.w, f.len, 0);
    ctx.quadraticCurveTo(f.len * 0.45, f.w, 0, 0);
    ctx.fillStyle = f.c;
    ctx.globalAlpha = f.c === '#22c55e' ? 0.45 : 0.92;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(f.len * 0.85, 0);
    ctx.strokeStyle = 'rgba(163, 230, 53, 0.25)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 繪製林間穿透光斑與秘境螢火蟲
 */
function drawJungleCanopyAndFireflies(ctx, width, height, now) {
  ctx.save();

  // 林間樹冠篩下的柔和翠綠金色光斑
  const sunSpots = [
    { x: 260, y: 190, r: 120 },
    { x: 540, y: 390, r: 135 },
    { x: 400, y: 300, r: 150 }
  ];
  for (const spot of sunSpots) {
    const g = ctx.createRadialGradient(spot.x, spot.y, 10, spot.x, spot.y, spot.r);
    g.addColorStop(0, 'rgba(134, 239, 172, 0.045)');
    g.addColorStop(1, 'rgba(20, 83, 45, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 漂浮發光的秘境螢火蟲
  for (const ff of FIREFLIES) {
    const fx = ff.bx + Math.sin(now * ff.speed + ff.phase) * ff.rx;
    const fy = ff.by + Math.cos(now * ff.speed * 1.3 + ff.phase) * ff.ry;
    const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.003 + ff.phase * 2));

    const halo = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, 8);
    halo.addColorStop(0, `rgba(217, 249, 157, ${glow * 0.85})`);
    halo.addColorStop(1, 'rgba(132, 204, 22, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(fx, fy, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * 繪製非幾何、圓潤浮雕感的古神廟文化圖騰面具（一律正面朝上）
 */
function drawSculptedTotem(ctx, cx, cy, now, phase) {
  const eyeGlow = 0.7 + 0.3 * Math.sin(now * 0.004 + phase);
  ctx.save();
  ctx.translate(cx, cy);

  ctx.beginPath();
  ctx.arc(0, 2, 26, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -24);
  ctx.bezierCurveTo(20, -24, 24, -5, 20, 11);
  ctx.bezierCurveTo(16, 23, 5, 26, 0, 26);
  ctx.bezierCurveTo(-5, 26, -16, 23, -20, 11);
  ctx.bezierCurveTo(-24, -5, -20, -24, 0, -24);
  const stoneGrad = ctx.createLinearGradient(0, -24, 0, 26);
  stoneGrad.addColorStop(0, '#57534e');
  stoneGrad.addColorStop(1, '#292524');
  ctx.fillStyle = stoneGrad;
  ctx.fill();
  ctx.strokeStyle = '#a8a29e';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -9, 13, Math.PI * 1.15, Math.PI * 1.85);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  for (const dir of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(dir * 4, -3);
    ctx.quadraticCurveTo(dir * 9, -8, dir * 14, -3);
    ctx.quadraticCurveTo(dir * 9, 2, dir * 4, -3);
    ctx.fillStyle = `rgba(245, 158, 11, ${eyeGlow})`;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, 6);
  ctx.strokeStyle = '#d6d3d1';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-9, 12);
  ctx.quadraticCurveTo(0, 17, 9, 12);
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

/**
 * 繪製中央古神廟太陽輪浮雕
 */
function drawCentralSunRelic(ctx, cx, cy, now) {
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.002);
  ctx.save();
  ctx.translate(cx, cy);

  const altGrad = ctx.createRadialGradient(0, 0, 20, 0, 0, 132);
  altGrad.addColorStop(0, 'rgba(180, 83, 9, 0.14)');
  altGrad.addColorStop(0.7, 'rgba(20, 83, 45, 0.16)');
  altGrad.addColorStop(1, 'rgba(28, 25, 23, 0)');
  ctx.fillStyle = altGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 132, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, 116, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(217, 119, 6, 0.28)';
  ctx.lineWidth = 4;
  ctx.stroke();

  for (let i = 0; i < 8; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI) / 4);
    ctx.beginPath();
    ctx.moveTo(0, -44);
    ctx.quadraticCurveTo(16, -74, 0, -104);
    ctx.quadraticCurveTo(-16, -74, 0, -44);
    ctx.fillStyle = 'rgba(217, 119, 6, 0.11)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(251, 191, 36, ${0.26 + pulse * 0.14})`;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(245, 158, 11, ${0.14 + pulse * 0.1})`;
  ctx.fill();

  ctx.restore();
}

/**
 * 繪製競技場底圖
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width - 800
 * @param {number} height - 600
 */
export function drawArenaBackground(ctx, width, height) {
  const now = performance.now();
  const rimPulse = 0.55 + 0.3 * Math.sin(now * 0.003);

  // 1. 外圈裂紋熔岩護城河
  drawPerimeterMagmaMoat(ctx, width, height, now);

  // 2. 神廟石台主戰場
  ctx.save();
  traceTemplePlatform(ctx, width, height);
  ctx.clip();

  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 70, width / 2, height / 2, 500);
  bgGrad.addColorStop(0, '#3a3228');
  bgGrad.addColorStop(0.6, '#26241d');
  bgGrad.addColorStop(1, '#141712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  for (const slab of STONE_SLABS) {
    drawWeatheredSlab(ctx, slab);
  }

  ctx.strokeStyle = 'rgba(12, 10, 9, 0.5)';
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  for (const crack of STONE_CRACKS) {
    ctx.beginPath();
    ctx.moveTo(crack[0][0], crack[0][1]);
    for (let i = 1; i < crack.length; i++) {
      ctx.lineTo(crack[i][0], crack[i][1]);
    }
    ctx.stroke();
  }

  drawCentralSunRelic(ctx, width / 2, height / 2, now);

  // 攀附石台的秘境藤蔓
  for (const vine of JUNGLE_VINES) {
    drawCreepingVine(ctx, vine, now);
  }

  // 林間光斑與螢火蟲
  drawJungleCanopyAndFireflies(ctx, width, height, now);
  ctx.restore();

  // 3. 石台懸崖邊緣與熔岩熱浪反光
  ctx.save();
  traceTemplePlatform(ctx, width, height);
  ctx.strokeStyle = `rgba(234, 88, 12, ${rimPulse * 0.55})`;
  ctx.lineWidth = 7;
  ctx.stroke();

  traceTemplePlatform(ctx, width, height);
  ctx.strokeStyle = '#1c1512';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // 4. 左上角 HUD 護眼樹蔭陰影（確保白色狀態文字清晰可讀）
  const hudShade = ctx.createLinearGradient(0, 0, 320, 75);
  hudShade.addColorStop(0, 'rgba(10, 18, 12, 0.72)');
  hudShade.addColorStop(0.7, 'rgba(10, 18, 12, 0.35)');
  hudShade.addColorStop(1, 'rgba(10, 18, 12, 0)');
  ctx.fillStyle = hudShade;
  ctx.fillRect(0, 0, 330, 75);

  // 5. 搖曳叢林蕨葉
  drawSwayingFern(ctx, 56, height - 54, -0.75, 1.05, now, 0.5);
  drawSwayingFern(ctx, width - 56, 54, 2.35, 1.05, now, 1.8);
  drawSwayingFern(ctx, width - 56, height - 54, -2.35, 1.05, now, 3.1);

  // 6. 文化圖騰浮雕面具
  drawSculptedTotem(ctx, width - 74, 72, now, 0.3);
  drawSculptedTotem(ctx, 74, height - 72, now, 1.7);
  drawSculptedTotem(ctx, width - 74, height - 72, now, 2.9);
}

/**
 * 繪製安全區邊界與圈外熾熱熔岩風暴危險區
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ x: number, y: number, radius: number, damagePerSec?: number }} zone
 * @param {number} width
 * @param {number} height
 */
export function drawDangerZone(ctx, zone, width, height) {
  const now = performance.now();
  const pulse = 0.5 + 0.5 * Math.sin(now * 0.005);

  ctx.save();

  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2, true);
  ctx.fillStyle = `rgba(154, 32, 18, ${0.24 + pulse * 0.08})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius + 6, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(234, 88, 12, ${0.48 + pulse * 0.25})`;
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#facc15';
  ctx.lineWidth = 3;
  ctx.stroke();

  if (zone.radius < 580) {
    const sparkCount = 16;
    for (let i = 0; i < sparkCount; i++) {
      const angle = (i / sparkCount) * Math.PI * 2 + now * 0.0006;
      const radialJitter = Math.sin(now * 0.006 + i * 2.1) * 5;
      const sx = zone.x + Math.cos(angle) * (zone.radius + radialJitter);
      const sy = zone.y + Math.sin(angle) * (zone.radius + radialJitter);
      const sr = 1.5 + 1.2 * Math.sin(now * 0.008 + i);
      ctx.beginPath();
      ctx.arc(sx, sy, Math.max(0.8, sr), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
      ctx.fill();
    }
  }

  ctx.restore();
}
