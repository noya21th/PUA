// 90年代8-bit音效引擎

let audioCtx: AudioContext | null = null;

export function initAudio() {
  if (!audioCtx) audioCtx = new AudioContext();
}

function playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function sfxMove() { playTone(200, 0.05, 'square', 0.08); }
export function sfxRotate() { playTone(300, 0.06, 'square', 0.1); }
export function sfxDrop() {
  playTone(150, 0.1, 'triangle', 0.15);
  setTimeout(() => playTone(100, 0.08, 'triangle', 0.1), 30);
}
export function sfxLand() { playTone(120, 0.12, 'triangle', 0.12); }

export function sfxClear(rows: number) {
  const base = [0, 523, 659, 784, 1047];
  for (let i = 0; i < rows; i++) {
    setTimeout(() => {
      playTone(base[Math.min(rows, 4)] + i * 50, 0.15, 'square', 0.12);
      playTone(base[Math.min(rows, 4)] * 0.5, 0.1, 'triangle', 0.08);
    }, i * 80);
  }
  setTimeout(() => playTone(1318, 0.2, 'sine', 0.1), rows * 80 + 50);
}

export function sfxGameOver() {
  [523, 493, 440, 392, 349, 330, 294, 261].forEach((n, i) => {
    setTimeout(() => playTone(n, 0.25, 'square', 0.1), i * 150);
  });
}

export function sfxLevelUp() {
  [523, 659, 784, 1047].forEach((n, i) => {
    setTimeout(() => playTone(n, 0.12, 'square', 0.12), i * 80);
  });
  setTimeout(() => playTone(1318, 0.3, 'sine', 0.1), 400);
}

// BGM — 科罗贝尼基简化版
const BGM_MELODY: [number, number][] = [
  [659,400],[494,200],[523,200],[587,400],[523,200],[494,200],
  [440,400],[440,200],[523,200],[659,400],[587,200],[523,200],
  [494,400],[494,200],[523,200],[587,400],[659,400],
  [523,400],[440,400],[440,400],[0,400],
  [587,400],[698,200],[880,400],[784,200],[698,200],
  [659,400],[523,200],[659,400],[587,200],[523,200],
  [494,400],[494,200],[523,200],[587,400],[659,400],
  [523,400],[440,400],[440,400],[0,400],
];

let bgmPlaying = false;
let bgmTimer: ReturnType<typeof setTimeout> | null = null;
let getLevelFn: (() => number) | null = null;
let isPausedFn: (() => boolean) | null = null;
let isGameOverFn: (() => boolean) | null = null;

export function setBGMCallbacks(
  getLevel: () => number,
  isPaused: () => boolean,
  isGameOver: () => boolean,
) {
  getLevelFn = getLevel;
  isPausedFn = isPaused;
  isGameOverFn = isGameOver;
}

export function startBGM() {
  if (bgmPlaying) return;
  bgmPlaying = true;
  let idx = 0;
  function playNext() {
    if (!bgmPlaying || isGameOverFn?.()) return;
    if (isPausedFn?.()) { bgmTimer = setTimeout(playNext, 200); return; }
    const [freq, dur] = BGM_MELODY[idx % BGM_MELODY.length];
    const lvl = getLevelFn?.() ?? 1;
    const speed = Math.max(0.5, 1 - (lvl - 1) * 0.005);
    const actualDur = dur * speed;
    if (freq > 0) {
      playTone(freq, actualDur / 1000 * 0.9, 'square', 0.06);
      playTone(freq / 2, actualDur / 1000 * 0.6, 'triangle', 0.03);
    }
    idx++;
    bgmTimer = setTimeout(playNext, actualDur);
  }
  playNext();
}

export function stopBGM() {
  bgmPlaying = false;
  if (bgmTimer) { clearTimeout(bgmTimer); bgmTimer = null; }
}
