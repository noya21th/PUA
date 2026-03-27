import './style.css';
import * as game from './game';
import { initRenderer, render, renderNext } from './renderer';
import { initToast } from './toast';

// ===== DOM =====
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<div id="game-wrapper">
  <div id="mobile-header">
    <div class="mobile-stat">
      <span class="mobile-stat-label">分数</span>
      <span class="mobile-stat-value" id="m-score">0</span>
    </div>
    <div class="mobile-stat">
      <span class="mobile-stat-label">等级</span>
      <span class="mobile-stat-value" id="m-level">1</span>
      <span class="mobile-stat-value pua" id="m-pua-level">Lv.1 实习生</span>
    </div>
    <div class="mobile-stat">
      <span class="mobile-stat-label">行数</span>
      <span class="mobile-stat-value" id="m-lines">0</span>
    </div>
    <div class="mobile-stat">
      <span class="mobile-stat-label">消灭</span>
      <span class="mobile-stat-value" id="m-cleared">0</span>
    </div>
  </div>
  <div id="left-panel">
    <div class="panel-box">
      <h3>分数</h3>
      <div class="value" id="score">0</div>
    </div>
    <div class="panel-box">
      <h3>消除行</h3>
      <div class="value" id="lines">0</div>
    </div>
    <div class="panel-box">
      <h3>PUA等级</h3>
      <div class="value" id="level">1</div>
      <div id="pua-level">Lv.1 实习生</div>
    </div>
    <div class="panel-box">
      <h3>已消灭</h3>
      <div class="value" id="cleared-count">0</div>
      <div style="font-size:11px;color:rgba(255,255,255,0.35)">个PUA词汇</div>
    </div>
    <div class="panel-box controls">
      <kbd>←</kbd> <kbd>→</kbd> 移动<br>
      <kbd>↑</kbd> 旋转<br>
      <kbd>↓</kbd> 加速<br>
      <kbd>空格</kbd> 直落<br>
      <kbd>P</kbd> 暂停
    </div>
  </div>

  <div id="board-container">
    <canvas id="game-canvas"></canvas>
    <div id="toast-container"></div>
    <div id="overlay">
      <h1>PUA了吗？</h1>
      <button id="start-btn">开始美好的一天</button>
    </div>
  </div>

  <div id="right-panel">
    <div class="panel-box">
      <h3>下一个</h3>
      <canvas id="next-canvas" width="160" height="120"></canvas>
    </div>
    <div class="panel-box" id="history-box">
      <h3>消灭记录</h3>
      <div id="history-list"></div>
    </div>
  </div>
  <div id="mobile-controls">
    <div class="mobile-controls-row">
      <button class="mobile-btn" id="btn-left">&#9664;</button>
      <button class="mobile-btn" id="btn-rotate">&#8635;</button>
      <button class="mobile-btn" id="btn-right">&#9654;</button>
    </div>
    <div class="mobile-controls-row">
      <button class="mobile-btn" id="btn-down">&#9660;</button>
      <button class="mobile-btn drop" id="btn-drop">&#9199;</button>
    </div>
  </div>
</div>
<div id="credit">Made by Blue Little Blue Whale</div>
`;

// ===== 初始化 =====
const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const nextCanvas = document.getElementById('next-canvas') as HTMLCanvasElement;
const overlay = document.getElementById('overlay')!;
const startBtn = document.getElementById('start-btn')!;

initRenderer(canvas, nextCanvas);
initToast(document.getElementById('toast-container')!);

function updateUI() {
  document.getElementById('score')!.textContent = String(game.score);
  document.getElementById('lines')!.textContent = String(game.lines);
  document.getElementById('level')!.textContent = String(game.level);
  document.getElementById('cleared-count')!.textContent = String(game.clearedPhrases);

  const puaEl = document.getElementById('pua-level')!;
  puaEl.textContent = game.getPuaLevel();
  if (game.level >= 99) puaEl.style.color = '#FFD700';
  else if (game.level >= 80) puaEl.style.color = '#c44dff';
  else if (game.level >= 50) puaEl.style.color = '#ff6b9d';

  // 消灭记录
  const histEl = document.getElementById('history-list')!;
  histEl.innerHTML = game.historyPhrases.slice(0, 20).map(p =>
    `<div style="margin-bottom:2px">\u2715 <span style="text-decoration:line-through;color:rgba(255,255,255,0.3)">${p}</span></div>`
  ).join('');

  // 移动端 header 同步
  const ms = document.getElementById('m-score');
  if (ms) {
    ms.textContent = String(game.score);
    document.getElementById('m-level')!.textContent = String(game.level);
    document.getElementById('m-lines')!.textContent = String(game.lines);
    document.getElementById('m-cleared')!.textContent = String(game.clearedPhrases);
    const mp = document.getElementById('m-pua-level')!;
    mp.textContent = game.getPuaLevel();
    if (game.level >= 99) mp.style.color = '#FFD700';
    else if (game.level >= 80) mp.style.color = '#c44dff';
  }

  renderNext();
  render();
}

function showGameOverOverlay() {
  overlay.classList.remove('hidden');
  const lvlColor = game.level >= 99 ? '#FFD700' : '#ff6b9d';
  overlay.innerHTML = `
    <h1>PUA了吗？</h1>
    <div class="subtitle">你今天被PUA了 ${game.lines} 行</div>
    <div class="final-score">得分: ${game.score} | 消灭: ${game.clearedPhrases}个PUA</div>
    <div class="subtitle" style="color:${lvlColor}">PUA等级: ${game.getPuaLevel()}</div>
    <button id="start-btn" style="margin-top:16px">再来美好的一天</button>
  `;
  document.getElementById('start-btn')!.onclick = doStart;
}

game.setCallbacks(updateUI, showGameOverOverlay);

function doStart() {
  game.startGame();
  overlay.classList.add('hidden');
  updateUI();
  requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp: number) {
  if (game.gameOver) { render(); return; }
  if (game.paused || game.animating) { requestAnimationFrame(gameLoop); return; }
  game.tick(timestamp);
  render();
  requestAnimationFrame(gameLoop);
}

// ===== 输入 =====
document.addEventListener('keydown', (e) => {
  if (game.gameOver && e.code === 'Enter') { doStart(); return; }
  if (game.gameOver) return;

  switch (e.code) {
    case 'ArrowLeft': e.preventDefault(); if (!game.paused) game.moveLeft(); break;
    case 'ArrowRight': e.preventDefault(); if (!game.paused) game.moveRight(); break;
    case 'ArrowDown': e.preventDefault(); if (!game.paused) game.moveDown(); break;
    case 'ArrowUp': e.preventDefault(); if (!game.paused) game.rotatePiece(); break;
    case 'Space': e.preventDefault(); if (!game.paused) game.hardDrop(); break;
    case 'KeyP':
      game.togglePause();
      if (game.paused) {
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
          <h1>暂停</h1>
          <div class="subtitle">摸鱼时间到</div>
          <button id="start-btn">继续</button>
        `;
        document.getElementById('start-btn')!.onclick = () => {
          game.togglePause();
          overlay.classList.add('hidden');
        };
      } else {
        overlay.classList.add('hidden');
      }
      break;
  }
  if (!game.animating) render();
});

// ===== 触摸支持 =====
let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  touchStartTime = Date.now();
});
canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (game.gameOver || game.paused) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStartX;
  const dy = t.clientY - touchStartY;
  const dt = Date.now() - touchStartTime;
  if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 200) game.rotatePiece();
  else if (Math.abs(dx) > Math.abs(dy)) dx > 0 ? game.moveRight() : game.moveLeft();
  else if (dy > 30) game.hardDrop();
  render();
});

// ===== 移动端虚拟按钮 =====
function bindMobileBtn(id: string, action: () => void) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!game.gameOver && !game.paused) { action(); render(); }
  });
}
bindMobileBtn('btn-left', () => game.moveLeft());
bindMobileBtn('btn-right', () => game.moveRight());
bindMobileBtn('btn-rotate', () => game.rotatePiece());
bindMobileBtn('btn-down', () => game.moveDown());
bindMobileBtn('btn-drop', () => game.hardDrop());

// ===== 移动端 canvas 自适应 =====
function fitMobileCanvas() {
  if (window.innerWidth > 768) {
    canvas.style.width = '';
    canvas.style.height = '';
    return;
  }
  const header = document.getElementById('mobile-header')!;
  const controls = document.getElementById('mobile-controls')!;
  const headerH = header.offsetHeight;
  const controlsH = controls.offsetHeight;
  const availH = window.innerHeight - headerH - controlsH - 4;
  const availW = window.innerWidth * 0.96;
  const ratio = 384 / 704;
  let w: number, h: number;
  if (availW / availH > ratio) {
    h = availH;
    w = availH * ratio;
  } else {
    w = availW;
    h = availW / ratio;
  }
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}
fitMobileCanvas();
window.addEventListener('resize', fitMobileCanvas);
window.addEventListener('orientationchange', () => setTimeout(fitMobileCanvas, 100));

// ===== 移动端操作提示 =====
function showMobileTutorial() {
  if (window.innerWidth > 768) return;
  const el = document.createElement('div');
  el.id = 'mobile-tutorial';
  el.className = 'show';
  el.innerHTML = `
    <div class="tutorial-title">操作指南</div>
    <div class="tutorial-grid">
      <div class="tutorial-icon">◀ ▶</div>
      <div class="tutorial-desc">左右按钮移动<small>或在画面上左右滑动</small></div>
      <div class="tutorial-icon">↻</div>
      <div class="tutorial-desc">旋转方块<small>或点击画面</small></div>
      <div class="tutorial-icon">▼</div>
      <div class="tutorial-desc">加速下落</div>
      <div class="tutorial-icon accent">⏏</div>
      <div class="tutorial-desc">直接落底<small>或在画面上下滑</small></div>
    </div>
    <div class="tutorial-dismiss">点击任意位置开始</div>
  `;
  document.body.appendChild(el);
  el.addEventListener('click', () => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.3s';
    setTimeout(() => el.remove(), 300);
  });
}
showMobileTutorial();

// ===== 初始渲染 =====
startBtn.onclick = doStart;
render();
