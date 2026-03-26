import { board, current, COLS, ROWS, CELL, gameOver, animating, getGhostCells, next } from './game';

let ctx: CanvasRenderingContext2D;
let nextCtx: CanvasRenderingContext2D;

export function initRenderer(canvas: HTMLCanvasElement, nextCanvas: HTMLCanvasElement) {
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;
  ctx = canvas.getContext('2d')!;
  nextCtx = nextCanvas.getContext('2d')!;
}

export function render() {
  ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);

  // 网格
  ctx.strokeStyle = 'rgba(255,255,255,0.03)';
  ctx.lineWidth = 1;
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(COLS * CELL, r * CELL); ctx.stroke();
  }
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, ROWS * CELL); ctx.stroke();
  }

  // 已放置方块
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = board[r][c];
      if (cell) {
        if (cell._flash) drawCell(c, r, '#fff', '#000', 'rgba(255,255,255,0.8)', cell.char);
        else drawCell(c, r, cell.bg, cell.text, cell.glow, cell.char);
      }
    }
  }

  if (current && !gameOver && !animating) {
    // 幽灵
    getGhostCells().forEach(cell => {
      if (cell.r >= 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(cell.c * CELL + 1, cell.r * CELL + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cell.c * CELL + 1, cell.r * CELL + 1, CELL - 2, CELL - 2);
      }
    });

    // 当前方块
    current.cells.forEach((cell, i) => {
      if (cell.r >= 0) {
        drawCell(cell.c, cell.r, current!.color.bg, current!.color.text, current!.color.glow, current!.chars[i]);
      }
    });
  }
}

function drawCell(x: number, y: number, bg: string, text: string, glow: string, char: string) {
  const px = x * CELL;
  const py = y * CELL;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 8;
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, 3);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.roundRect(px + 2, py + 2, CELL - 4, (CELL - 4) / 2, [3, 3, 0, 0]);
  ctx.fill();
  ctx.fillStyle = text;
  ctx.font = 'bold 16px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, px + CELL / 2, py + CELL / 2 + 1);
}

export function renderNext() {
  const w = 160, h = 120;
  nextCtx.clearRect(0, 0, w, h);
  if (!next) return;

  const minR = Math.min(...next.cells.map(c => c.r));
  const maxR = Math.max(...next.cells.map(c => c.r));
  const minC = Math.min(...next.cells.map(c => c.c));
  const maxC = Math.max(...next.cells.map(c => c.c));
  const cw = maxC - minC + 1;
  const ch = maxR - minR + 1;
  const cs = 28;
  const ox = (w - cw * cs) / 2;
  const oy = (h - ch * cs) / 2;

  nextCtx.fillStyle = 'rgba(255,255,255,0.3)';
  nextCtx.font = '11px "PingFang SC", sans-serif';
  nextCtx.textAlign = 'center';
  nextCtx.fillText(next.phrase, w / 2, h - 8);

  next.cells.forEach((cell, i) => {
    const px = ox + (cell.c - minC) * cs;
    const py = oy + (cell.r - minR) * cs;
    nextCtx.shadowColor = next!.color.glow;
    nextCtx.shadowBlur = 6;
    nextCtx.fillStyle = next!.color.bg;
    nextCtx.beginPath();
    nextCtx.roundRect(px + 1, py + 1, cs - 2, cs - 2, 3);
    nextCtx.fill();
    nextCtx.shadowBlur = 0;
    nextCtx.fillStyle = next!.color.text;
    nextCtx.font = 'bold 14px "PingFang SC", "Microsoft YaHei", sans-serif';
    nextCtx.textAlign = 'center';
    nextCtx.textBaseline = 'middle';
    nextCtx.fillText(next!.chars[i], px + cs / 2, py + cs / 2 + 1);
  });
}
