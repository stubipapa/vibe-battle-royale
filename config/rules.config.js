/**
 * 模組 6：規則與結算 UI 師（學生 6 負責）
 * --------------------------------------------------
 * 設計大逃殺左上角存活 HUD、底部極簡觀戰加油表情提示條與華麗吃雞頒獎台。
 * 護欄限制：
 * - HUD 與觀戰面板不可遮擋畫面中央直徑 450px 主交戰區（圓心 (400, 300)、半徑 225px）。
 * - 額外自訂按鍵不超過 3 種（觀戰表情 1~4 共用表情互動機制）。
 */

/**
 * 繪製圓角矩形路徑（相容所有 Canvas 環境）
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number} r
 */
function roundedRectPath(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * 將秒數格式化為 MM:SS
 * @param {number} elapsedSec
 * @returns {string}
 */
function formatTime(elapsedSec) {
  const total = Math.max(0, Math.floor(elapsedSec || 0));
  const mins = String(Math.floor(total / 60)).padStart(2, '0');
  const secs = String(total % 60).padStart(2, '0');
  return `${mins}:${secs}`;
}

/**
 * 在指定最大寬度內截斷過長文字
 * @param {CanvasRenderingContext2D} ctx
 * @param {string} text
 * @param {number} maxWidth
 * @returns {string}
 */
function fitText(ctx, text, maxWidth) {
  const str = String(text ?? '');
  if (ctx.measureText(str).width <= maxWidth) return str;
  let trimmed = str;
  while (trimmed.length > 1 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}

/**
 * 繪製對戰中左上角 HUD（嚴格位於中央直徑 450px 戰場之外）
 * 面板範圍 [12, 264] x [12, 90]，最近角點 (264, 90) 距圓心 (400, 300) 約 250px > 225px
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gameState - { mode, elapsedSec, aliveCount, totalCount, me }
 */
export function drawHUD(ctx, gameState) {
  const { mode, elapsedSec, aliveCount, totalCount, me } = gameState || {};
  ctx.save();

  const panelX = 12;
  const panelY = 12;
  const panelW = 252;
  const panelH = me ? 78 : 42;

  // 玻璃擬態深色底板
  const bgGrad = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  bgGrad.addColorStop(0, 'rgba(15, 23, 42, 0.86)');
  bgGrad.addColorStop(1, 'rgba(30, 41, 59, 0.78)');
  roundedRectPath(ctx, panelX, panelY, panelW, panelH, 10);
  ctx.fillStyle = bgGrad;
  ctx.fill();

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
  ctx.stroke();

  // 頂部：模式標籤 + 存活人數 + 經過時間
  const modeLabel = mode === 'practice' ? '練習' : '連線';
  const badgeColor = mode === 'practice' ? '#38bdf8' : '#f59e0b';

  roundedRectPath(ctx, panelX + 8, panelY + 8, 42, 20, 6);
  ctx.fillStyle = badgeColor;
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(modeLabel, panelX + 29, panelY + 18);

  // 存活人數膠囊
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`存活 ${aliveCount ?? 0}/${totalCount ?? 0}`, panelX + 58, panelY + 18);

  // 經過時間
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 13px monospace';
  ctx.fillText(`⏱ ${formatTime(elapsedSec)}`, panelX + panelW - 10, panelY + 18);

  // 下半部：玩家自身盲盒裝備與血量條（僅有 me 時繪製）
  if (me) {
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(panelX + 10, panelY + 34);
    ctx.lineTo(panelX + panelW - 10, panelY + 34);
    ctx.stroke();

    // 角色 × 武器名稱
    ctx.textAlign = 'left';
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'bold 12px sans-serif';
    const gearText = `${me.charName || '未知'} × ${me.attackName || '預設'}`;
    ctx.fillText(fitText(ctx, gearText, panelW - 68), panelX + 10, panelY + 46);

    // 擊殺數徽章
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`⚔ ${me.kills ?? 0}`, panelX + panelW - 10, panelY + 46);

    // HP 血量進度條
    const maxHp = Math.max(1, me.maxHp || 100);
    const curHp = Math.max(0, me.hp || 0);
    const ratio = Math.min(1, curHp / maxHp);

    const barX = panelX + 10;
    const barY = panelY + 58;
    const barW = panelW - 20;
    const barH = 12;

    roundedRectPath(ctx, barX, barY, barW, barH, 6);
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fill();

    if (ratio > 0) {
      const hpColor = ratio > 0.5 ? '#22c55e' : ratio > 0.25 ? '#f59e0b' : '#ef4444';
      roundedRectPath(ctx, barX, barY, Math.max(8, barW * ratio), barH, 6);
      ctx.fillStyle = me.isShielded ? '#38bdf8' : hpColor;
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    const shieldTag = me.isShielded ? ' 🛡️' : '';
    ctx.fillText(`HP ${Math.ceil(curHp)}/${Math.ceil(maxHp)}${shieldTag}`, barX + barW / 2, barY + 6.5);
  }

  ctx.restore();
}

/**
 * 繪製淘汰後底部極簡觀戰提示條（位於 y=544..588，完全低於中央圓底緣 y=525）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gameState - { aliveCount, floatingEmojis }
 */
export function drawSpectatorOverlay(ctx, gameState) {
  const aliveCount = gameState?.aliveCount ?? 0;
  ctx.save();

  const barW = 500;
  const barH = 40;
  const barX = (800 - barW) / 2;
  const barY = 548;

  const grad = ctx.createLinearGradient(barX, barY, barX + barW, barY);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.88)');
  grad.addColorStop(0.5, 'rgba(30, 41, 59, 0.92)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.88)');

  roundedRectPath(ctx, barX, barY, barW, barH, 20);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
  ctx.stroke();

  // 左側極簡觀戰狀態標籤
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText(`👀 觀戰中（餘 ${aliveCount} 人）`, barX + 16, barY + barH / 2);

  // 右側 1~4 加油表情鍵帽膠囊
  const emojis = [
    { key: '1', icon: '👍' },
    { key: '2', icon: '🔥' },
    { key: '3', icon: '🍉' },
    { key: '4', icon: '😂' }
  ];

  const startX = barX + 188;
  const chipW = 70;
  const chipGap = 6;
  emojis.forEach((item, idx) => {
    const cx = startX + idx * (chipW + chipGap);
    const cy = barY + 7;
    roundedRectPath(ctx, cx, cy, chipW, 26, 8);
    ctx.fillStyle = 'rgba(51, 65, 85, 0.85)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`${item.key}:${item.icon}`, cx + chipW / 2, cy + 13.5);
  });

  ctx.restore();
}

/**
 * 繪製單一座吃雞頒獎台柱（前三名共用）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} player
 * @param {object} slot - { x, width, height, medal, label, topColor, bottomColor, borderColor }
 */
function drawPodiumColumn(ctx, player, slot) {
  const baseLineY = 398;
  const topY = baseLineY - slot.height;
  const centerX = slot.x + slot.width / 2;

  // 頒獎台柱體
  const colGrad = ctx.createLinearGradient(slot.x, topY, slot.x, baseLineY);
  colGrad.addColorStop(0, slot.topColor);
  colGrad.addColorStop(1, slot.bottomColor);

  roundedRectPath(ctx, slot.x, topY, slot.width, slot.height, 12);
  ctx.fillStyle = colGrad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = slot.borderColor;
  ctx.stroke();

  // 台階名次字樣
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(slot.label, centerX, topY + slot.height * 0.45);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
  ctx.font = 'bold 12px sans-serif';
  ctx.fillText(`⚔ ${player.kills ?? 0} 擊殺`, centerX, topY + slot.height * 0.76);

  // 台上玩家名牌
  ctx.font = '28px sans-serif';
  ctx.fillText(slot.medal, centerX, topY - 58);

  ctx.fillStyle = slot.isChampion ? '#fef08a' : '#f8fafc';
  ctx.font = slot.isChampion ? 'bold 17px sans-serif' : 'bold 15px sans-serif';
  ctx.fillText(fitText(ctx, player.name || '玩家', slot.width + 16), centerX, topY - 30);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px sans-serif';
  ctx.fillText(fitText(ctx, `(${player.charName || '未知'})`, slot.width + 16), centerX, topY - 12);
}

/**
 * 繪製最後生存者結算畫面（吃雞頒獎台 + 完整排名）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ name: string, charName: string, kills: number, alive: boolean, rank: number }>} ranking
 */
export function drawGameOverScreen(ctx, ranking) {
  const list = Array.isArray(ranking) ? ranking : [];
  const now = typeof performance !== 'undefined' ? performance.now() : 0;
  ctx.save();

  // 舞台深色背景與聚光燈
  const bgGrad = ctx.createRadialGradient(400, 180, 40, 400, 300, 520);
  bgGrad.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
  bgGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.94)');
  bgGrad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 800, 600);

  // 金色頂部聚光錐
  const beamGrad = ctx.createLinearGradient(400, 0, 400, 400);
  beamGrad.addColorStop(0, 'rgba(250, 204, 21, 0.24)');
  beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(310, 0);
  ctx.lineTo(490, 0);
  ctx.lineTo(640, 400);
  ctx.lineTo(160, 400);
  ctx.closePath();
  ctx.fill();

  // 飄落彩帶點綴
  const confettiColors = ['#fde047', '#38bdf8', '#f472b6', '#4ade80', '#fb923c'];
  for (let i = 0; i < 28; i += 1) {
    const cx = (i * 97 + Math.sin(now * 0.0012 + i) * 18) % 800;
    const cy = ((i * 53 + now * (0.04 + (i % 3) * 0.015)) % 560) + 10;
    ctx.fillStyle = confettiColors[i % confettiColors.length];
    ctx.globalAlpha = 0.55;
    ctx.fillRect(cx, cy, 6, 4);
  }
  ctx.globalAlpha = 1;

  // 主標題
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('🏆 大吉大利・今晚吃雞 🏆', 400, 50);

  const champion = list[0];
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px sans-serif';
  ctx.fillText(
    champion
      ? `恭喜「${champion.name}」使用 ${champion.charName} 稱霸戰場！`
      : '對戰結束・結算頒獎台',
    400,
    82
  );

  // 前三名吃雞頒獎台（左：第 2 名、中：第 1 名、右：第 3 名）
  const podiumSlots = [
    {
      index: 1,
      x: 150,
      width: 146,
      height: 112,
      medal: '🥈',
      label: '#2',
      topColor: '#94a3b8',
      bottomColor: '#475569',
      borderColor: '#e2e8f0',
      isChampion: false
    },
    {
      index: 0,
      x: 316,
      width: 168,
      height: 152,
      medal: '👑',
      label: '#1 吃雞',
      topColor: '#f59e0b',
      bottomColor: '#b45309',
      borderColor: '#fef08a',
      isChampion: true
    },
    {
      index: 2,
      x: 504,
      width: 146,
      height: 88,
      medal: '🥉',
      label: '#3',
      topColor: '#c2410c',
      bottomColor: '#7c2d12',
      borderColor: '#fdba74',
      isChampion: false
    }
  ];

  podiumSlots.forEach((slot) => {
    const player = list[slot.index];
    if (player) {
      drawPodiumColumn(ctx, player, slot);
    }
  });

  // 頒獎台底座橫線
  ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 400);
  ctx.lineTo(680, 400);
  ctx.stroke();

  // 第 4 名起的名次卡片列
  const restPlayers = list.slice(3, 6);
  restPlayers.forEach((p, i) => {
    const rowY = 418 + i * 38;
    const rowX = 160;
    const rowW = 480;
    const rowH = 30;

    roundedRectPath(ctx, rowX, rowY, rowW, rowH, 8);
    ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)';
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(`#${p.rank}`, rowX + 14, rowY + 15.5);

    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(fitText(ctx, `${p.name}（${p.charName}）`, 290), rowX + 54, rowY + 15.5);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#fb923c';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(`⚔ ${p.kills ?? 0} 擊殺`, rowX + rowW - 14, rowY + 15.5);
  });

  // 底部操作提示
  ctx.textAlign = 'center';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '13px sans-serif';
  ctx.fillText('房主或玩家可點擊上方「房主重開下一局」或「返回選單」再來一局', 400, 566);

  ctx.restore();
}
