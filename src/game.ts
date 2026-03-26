import { PHRASES_2, PHRASES_3, PHRASES_4, PUA_LEVELS } from './phrases';
import { sfxMove, sfxRotate, sfxDrop, sfxLand, sfxClear, sfxGameOver, sfxLevelUp, initAudio, startBGM, stopBGM, setBGMCallbacks } from './audio';
import { showPuaPraise, showPuaCrown } from './toast';

// ===== 形状定义 =====
const SHAPES_2 = [ [[0,0],[0,1]], [[0,0],[1,0]] ];
const SHAPES_3 = [
  [[0,0],[0,1],[0,2]], [[0,0],[1,0],[2,0]],
  [[0,0],[1,0],[1,1]], [[0,0],[0,1],[1,0]],
  [[0,1],[1,0],[1,1]], [[0,0],[0,1],[1,1]],
];
const SHAPES_4 = [
  [[0,0],[0,1],[0,2],[0,3]], [[0,0],[0,1],[1,0],[1,1]],
  [[0,0],[0,1],[0,2],[1,1]], [[0,1],[0,2],[1,0],[1,1]],
  [[0,0],[0,1],[1,1],[1,2]], [[0,0],[1,0],[2,0],[2,1]],
  [[0,1],[1,1],[2,0],[2,1]],
];
// 5格形状 — 高等级出现的加难pentomino
const SHAPES_5 = [
  [[0,0],[0,1],[0,2],[0,3],[0,4]],         // I5
  [[0,0],[0,1],[0,2],[1,0],[1,1]],          // P
  [[0,0],[0,1],[0,2],[1,2],[1,3]],          // N
  [[0,0],[1,0],[1,1],[1,2],[2,2]],          // Z5
  [[0,0],[0,1],[1,1],[2,1],[2,2]],          // S5
  [[0,0],[1,0],[1,1],[1,2],[2,0]],          // T5
  [[0,0],[0,1],[0,2],[1,0],[2,0]],          // L5
];

// 5字短语 — 高等级出现
const PHRASES_5 = [
  '简单可依赖','消费者导向','苦练基本功','开除三类人',
  '风口上的猪','复盘四步法','端到端交付','构建和引领',
  '你给妈丢人','碗底还有油','身体牺牲型',
];

const COLORS = [
  { bg: '#ff6b9d', text: '#fff', glow: 'rgba(255,107,157,0.4)' },
  { bg: '#c44dff', text: '#fff', glow: 'rgba(196,77,255,0.4)' },
  { bg: '#4dc9f6', text: '#000', glow: 'rgba(77,201,246,0.4)' },
  { bg: '#f7c948', text: '#000', glow: 'rgba(247,201,72,0.4)' },
  { bg: '#ff8a5c', text: '#fff', glow: 'rgba(255,138,92,0.4)' },
  { bg: '#5cff8a', text: '#000', glow: 'rgba(92,255,138,0.4)' },
  { bg: '#ff5c8a', text: '#fff', glow: 'rgba(255,92,138,0.4)' },
  { bg: '#8a5cff', text: '#fff', glow: 'rgba(138,92,255,0.4)' },
];

export const COLS = 12;
export const ROWS = 22;
export const CELL = 32;

interface CellData {
  char: string;
  bg: string;
  text: string;
  glow: string;
  phrase: string;
  _flash?: boolean;
}

interface Piece {
  cells: { r: number; c: number }[];
  chars: string[];
  color: typeof COLORS[0];
  phrase: string;
}

// ===== 游戏状态 =====
export let board: (CellData | null)[][] = Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
export let current: Piece | null = null;
export let next: Piece | null = null;
export let score = 0;
export let lines = 0;
export let level = 1;
export let clearedPhrases = 0;
export let gameOver = false;
export let paused = false;
export let animating = false;
export let historyPhrases: string[] = [];

let dropInterval = 800;
let lastDrop = 0;
let onUpdate: (() => void) | null = null;
let onGameOver: (() => void) | null = null;

export function setCallbacks(update: () => void, over: () => void) {
  onUpdate = update;
  onGameOver = over;
}

function initBoard() {
  board = [];
  for (let r = 0; r < ROWS; r++) board.push(new Array(COLS).fill(null));
}

function randomPiece(): Piece {
  // 难度曲线：低级主要出2/4字，高级出更多5字
  const roll = Math.random();
  let phrases: string[], shapes: number[][][];

  if (level >= 30 && roll < 0.20) {
    // 30级以上 20%概率出5字
    phrases = PHRASES_5;
    shapes = SHAPES_5;
  } else if (level >= 60 && roll < 0.35) {
    // 60级以上 35%概率出5字
    phrases = PHRASES_5;
    shapes = SHAPES_5;
  } else if (roll < 0.12) {
    phrases = PHRASES_2;
    shapes = SHAPES_2;
  } else if (roll < 0.32) {
    phrases = PHRASES_3;
    shapes = SHAPES_3;
  } else {
    phrases = PHRASES_4;
    shapes = SHAPES_4;
  }

  const phrase = phrases[Math.floor(Math.random() * phrases.length)];
  const shape = shapes[Math.floor(Math.random() * shapes.length)];
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const chars = phrase.split('');
  const cells = shape.map(([r, c]) => ({ r, c }));

  const maxC = Math.max(...cells.map(c => c.c));
  const offsetC = Math.floor((COLS - maxC - 1) / 2);
  cells.forEach(cell => { cell.r -= 2; cell.c += offsetC; });

  return { cells, chars, color, phrase };
}

function canPlace(cells: { r: number; c: number }[]) {
  return cells.every(({ r, c }) => {
    if (c < 0 || c >= COLS || r >= ROWS) return false;
    if (r < 0) return true;
    return board[r][c] === null;
  });
}

function placePiece() {
  if (!current) return;
  current.cells.forEach((cell, i) => {
    if (cell.r >= 0 && cell.r < ROWS) {
      board[cell.r][cell.c] = {
        char: current!.chars[i],
        bg: current!.color.bg,
        text: current!.color.text,
        glow: current!.color.glow,
        phrase: current!.phrase,
      };
    }
  });
}

export function rotatePiece() {
  if (!current) return;
  const cr = current.cells[0].r;
  const cc = current.cells[0].c;
  const newCells = current.cells.map(({ r, c }) => ({
    r: cr + (c - cc), c: cc - (r - cr),
  }));
  if (canPlace(newCells)) {
    current.cells = newCells;
    sfxRotate();
    return;
  }
  for (const dx of [1, -1, 2, -2]) {
    const kicked = newCells.map(({ r, c }) => ({ r, c: c + dx }));
    if (canPlace(kicked)) { current.cells = kicked; sfxRotate(); return; }
  }
}

export function movePiece(dr: number, dc: number): boolean {
  if (!current) return false;
  const newCells = current.cells.map(({ r, c }) => ({ r: r + dr, c: c + dc }));
  if (canPlace(newCells)) { current.cells = newCells; return true; }
  return false;
}

export function moveLeft() { if (movePiece(0, -1)) sfxMove(); }
export function moveRight() { if (movePiece(0, 1)) sfxMove(); }
export function moveDown() { if (movePiece(1, 0)) { score += 1; sfxMove(); } }

export function hardDrop() {
  if (!current) return;
  sfxDrop();
  while (movePiece(1, 0)) {}
  placePiece();
  checkLines();
  spawnNext();
}

export function getGhostCells(): { r: number; c: number }[] {
  if (!current) return [];
  let ghost = current.cells.map(({ r, c }) => ({ r, c }));
  while (true) {
    const n = ghost.map(({ r, c }) => ({ r: r + 1, c }));
    if (!canPlace(n)) break;
    ghost = n;
  }
  return ghost;
}

function checkLines() {
  const fullRows: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    if (board[r].every(cell => cell !== null)) fullRows.push(r);
  }
  if (fullRows.length === 0) return;

  sfxClear(fullRows.length);
  showPuaPraise(fullRows.length);

  const cleared = new Set<string>();
  fullRows.forEach(r => {
    board[r].forEach(cell => { if (cell?.phrase) cleared.add(cell.phrase); });
  });
  cleared.forEach(p => { historyPhrases.unshift(p); clearedPhrases++; });

  // 闪烁动画
  animating = true;
  let flashes = 0;
  const flashInterval = setInterval(() => {
    flashes++;
    fullRows.forEach(r => {
      board[r].forEach(cell => { if (cell) cell._flash = flashes % 2 === 0; });
    });
    onUpdate?.();
    if (flashes >= 6) {
      clearInterval(flashInterval);
      fullRows.sort((a, b) => b - a).forEach(r => {
        board.splice(r, 1);
        board.unshift(new Array(COLS).fill(null));
      });
      // 计分
      const pts = [0, 100, 300, 500, 800];
      score += (pts[fullRows.length] || 800) * level;
      lines += fullRows.length;

      // 升级曲线：前面快、后面慢
      // 1-10级: 每2行升级 (共20行)
      // 11-30级: 每3行升级 (共60行)
      // 31-60级: 每4行升级 (共120行)
      // 61-99级: 每5行升级 (共195行)
      // 总计约395行通关
      let newLevel: number;
      if (lines <= 20) newLevel = Math.floor(lines / 2) + 1;
      else if (lines <= 80) newLevel = Math.floor((lines - 20) / 3) + 11;
      else if (lines <= 200) newLevel = Math.floor((lines - 80) / 4) + 31;
      else newLevel = Math.floor((lines - 200) / 5) + 61;
      newLevel = Math.min(99, newLevel);

      if (newLevel !== level) {
        sfxLevelUp();
        if (newLevel === 99) showPuaCrown();
      }
      level = newLevel;

      // 速度曲线：1级800ms → 99级45ms
      dropInterval = Math.max(45, 800 - Math.floor(755 * Math.pow((level - 1) / 98, 0.65)));
      onUpdate?.();
      animating = false;
    }
  }, 80);
}

function spawnNext() {
  current = next || randomPiece();
  next = randomPiece();
  if (!canPlace(current.cells)) {
    gameOver = true;
    stopBGM();
    sfxGameOver();
    onGameOver?.();
  }
  onUpdate?.();
}

export function startGame() {
  initBoard();
  score = 0; lines = 0; level = 1; clearedPhrases = 0;
  gameOver = false; paused = false; animating = false;
  dropInterval = 800; lastDrop = 0;
  historyPhrases = [];
  current = null; next = null;
  initAudio();
  setBGMCallbacks(() => level, () => paused, () => gameOver);
  spawnNext();
  startBGM();
}

export function togglePause() {
  paused = !paused;
  onUpdate?.();
}

export function tick(timestamp: number) {
  if (gameOver || paused || animating) return;
  if (timestamp - lastDrop > dropInterval) {
    if (!movePiece(1, 0)) {
      sfxLand();
      placePiece();
      checkLines();
      spawnNext();
    }
    lastDrop = timestamp;
  }
}

export function getPuaLevel(): string {
  return PUA_LEVELS[Math.min(level - 1, PUA_LEVELS.length - 1)];
}
