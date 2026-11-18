/**
 * 模組 6：規則與結算 UI 師（學生 6 負責）
 * --------------------------------------------------
 * 目前為「純白字 HUD + 黑底白字結算」樣板，請設計吃雞頒獎台、存活 HUD 與淘汰觀戰表情面板！
 * 護欄限制：HUD 不可遮擋畫面中央直徑 450px 主交戰區；額外自訂按鍵不超過 3 種。
 */

/**
 * 繪製對戰中 HUD（目前為左上角純文字）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gameState - { mode, elapsedSec, aliveCount, totalCount, me }
 */
export function drawHUD(ctx, gameState) {
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  const modeLabel = gameState.mode === 'practice' ? '練習模式' : '6人連線';
  ctx.fillText(`[${modeLabel}] 存活: ${gameState.aliveCount}/${gameState.totalCount} | 時間: ${Math.floor(gameState.elapsedSec)}s`, 14, 24);

  if (gameState.me) {
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px monospace';
    ctx.fillText(`盲盒裝備: ${gameState.me.charName} × ${gameState.me.attackName} | HP: ${Math.ceil(gameState.me.hp)}`, 14, 44);
  }
  ctx.restore();
}

/**
 * 繪製淘汰後極簡觀戰畫面與加油表情提示（由學生 6 自由美化）
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} gameState - { aliveCount, floatingEmojis }
 */
export function drawSpectatorOverlay(ctx, gameState) {
  ctx.save();
  // 底部極簡提示條（不遮擋中央戰場）
  ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
  ctx.fillRect(180, 550, 440, 38);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(180, 550, 440, 38);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('已淘汰（觀戰中）｜按鍵 1:👍  2:🔥  3:🍉  4:😂 發送加油表情', 400, 574);
  ctx.restore();
}

/**
 * 繪製最後生存者結算畫面（目前為粗糙黑底白字排名）
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array<{ name: string, charName: string, kills: number, alive: boolean, rank: number }>} ranking
 */
export function drawGameOverScreen(ctx, ranking) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillRect(0, 0, 800, 600);

  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('對戰結束 - 最後生存者結算', 400, 120);

  ctx.font = '18px monospace';
  ranking.forEach((p, idx) => {
    ctx.fillStyle = idx === 0 ? '#fde047' : '#e2e8f0';
    ctx.fillText(`#${p.rank}  ${p.name} (${p.charName})  -  擊殺: ${p.kills}`, 400, 190 + idx * 42);
  });

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px sans-serif';
  ctx.fillText('房主或玩家可重新整理或點擊重開按鈕再來一局', 400, 520);
  ctx.restore();
}
