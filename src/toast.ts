import { PUA_PRAISE } from './phrases';

let container: HTMLElement | null = null;

export function initToast(el: HTMLElement) {
  container = el;
}

export function showPuaPraise(rowCount: number) {
  if (!container) return;
  const tier = Math.min(rowCount, 4);
  const pool = PUA_PRAISE[tier];
  if (!pool || pool.length === 0) return;
  const msg = pool[Math.floor(Math.random() * pool.length)];
  const toast = document.createElement('div');
  toast.className = `pua-toast tier${tier}`;
  const labels = ['', '\u6d88\u9664\u00d71', '\u53cc\u6d88\uff01', '\u4e09\u8fde\u6d88\uff01\uff01', '\u56db\u8fde\u5927\u6ee1\u8d2f\uff01\uff01\uff01'];
  toast.innerHTML = `<span class="toast-main">${msg}</span><span class="toast-sub">${labels[tier]}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

export function showPuaCrown() {
  if (!container) return;
  const crown = document.createElement('div');
  crown.className = 'pua-crown-overlay';

  // 马赛克皇冠 pixel art
  const rows = [
    '..0..00..0..',
    '..0..00..0..',
    '.00.0000.00.',
    '.000000000 .',
    '0000000000 0',
    '.0000000000.',
    '..00000000..',
    '..00000000..',
    '..00000000..',
  ];
  const colors = ['#FFD700','#FFA500','#FF6B9D','#c44dff','#4dc9f6'];
  const px = 10;
  let html = '<div class="crown-pixels">';
  rows.forEach(row => {
    html += `<div style="display:flex;justify-content:center;height:${px}px;">`;
    for (const ch of row) {
      if (ch === '0') {
        const c = colors[Math.floor(Math.random() * colors.length)];
        html += `<div style="width:${px}px;height:${px}px;background:${c};box-shadow:0 0 4px ${c};"></div>`;
      } else {
        html += `<div style="width:${px}px;height:${px}px;"></div>`;
      }
    }
    html += '</div>';
  });
  html += '</div>';

  crown.innerHTML = `
    ${html}
    <div class="crown-title">PUA \u4e4b \u738b</div>
    <div class="crown-sub">\u606d\u559c\u4f60\u8fbe\u5230\u4e86\u7b2c99\u7ea7</div>
    <div class="crown-desc">\u4f60\u5df2\u88ab\u5f7b\u5e95PUA\uff0c\u65e0\u4eba\u80fd\u51fa\u5176\u53f3</div>
    <div class="crown-dismiss" onclick="this.parentElement.remove()">\u70b9\u51fb\u7ee7\u7eed\u6e38\u620f...</div>
  `;
  container.appendChild(crown);
}
