// 90年代8-bit音效引擎 — 多曲目BGM

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

// ===== 多曲目BGM系统 =====
// Track A: 科罗贝尼基 (Lv.1-19) — 经典欢快
const TRACK_A: [number, number][] = [
  [659,400],[494,200],[523,200],[587,400],[523,200],[494,200],
  [440,400],[440,200],[523,200],[659,400],[587,200],[523,200],
  [494,400],[494,200],[523,200],[587,400],[659,400],
  [523,400],[440,400],[440,400],[0,400],
  [587,400],[698,200],[880,400],[784,200],[698,200],
  [659,400],[523,200],[659,400],[587,200],[523,200],
  [494,400],[494,200],[523,200],[587,400],[659,400],
  [523,400],[440,400],[440,400],[0,400],
];

// Track B: 卡林卡风格 (Lv.20-39) — 渐快紧张
const TRACK_B: [number, number][] = [
  [392,300],[440,300],[494,300],[523,300],
  [587,200],[587,200],[587,400],[0,200],
  [523,300],[494,300],[440,300],[392,300],
  [440,200],[440,200],[440,400],[0,200],
  [494,200],[523,200],[587,200],[659,200],
  [784,400],[659,200],[587,200],
  [523,200],[494,200],[440,200],[392,200],
  [440,400],[392,400],[0,400],
  [587,200],[659,200],[784,200],[880,200],
  [784,200],[659,200],[587,400],
  [523,200],[494,200],[440,200],[523,200],
  [494,400],[440,400],[0,400],
];

// Track C: 进行曲风格 (Lv.40-59) — 紧迫坚定
const TRACK_C: [number, number][] = [
  [523,200],[523,200],[523,200],[659,400],[523,200],
  [440,200],[440,200],[523,200],[440,400],[0,200],
  [392,200],[392,200],[440,200],[523,400],[494,200],
  [440,200],[392,200],[440,200],[392,400],[0,200],
  [523,200],[587,200],[659,200],[784,200],
  [659,400],[587,200],[523,200],
  [494,200],[523,200],[587,200],[659,200],
  [523,400],[440,400],[0,400],
  [784,200],[784,200],[659,200],[523,200],
  [587,400],[659,200],[784,200],
  [880,400],[784,200],[659,200],
  [523,400],[523,400],[0,400],
];

// Track D: 暴风前夜 (Lv.60-79) — 阴郁急促 小调
const TRACK_D: [number, number][] = [
  [330,200],[392,200],[440,200],[494,200],
  [523,400],[494,200],[440,200],
  [392,200],[370,200],[330,400],[0,200],
  [294,200],[330,200],[370,200],[440,200],
  [392,400],[370,200],[330,200],
  [294,400],[294,400],[0,200],
  [440,200],[494,200],[523,200],[587,200],
  [659,400],[587,200],[523,200],
  [494,200],[440,200],[392,200],[370,200],
  [330,400],[294,400],[0,400],
  [523,200],[587,200],[659,200],[784,200],
  [659,200],[587,200],[523,400],
  [494,200],[440,200],[392,200],[330,200],
  [294,400],[330,400],[0,400],
];

// Track E: 最终决战 (Lv.80-99) — 极速狂暴
const TRACK_E: [number, number][] = [
  [659,150],[784,150],[880,150],[1047,150],
  [880,150],[784,150],[659,300],[0,150],
  [587,150],[659,150],[784,150],[880,150],
  [784,150],[659,150],[587,300],[0,150],
  [440,150],[523,150],[587,150],[659,150],
  [784,150],[880,150],[1047,300],
  [880,150],[784,150],[659,150],[587,150],
  [523,300],[440,300],[0,300],
  [1047,150],[880,150],[784,150],[659,150],
  [784,150],[880,150],[1047,300],
  [880,150],[784,150],[659,150],[587,150],
  [659,300],[523,300],[0,300],
];

// 根据等级选择曲目
function getTrackForLevel(level: number): [number, number][] {
  if (level >= 80) return TRACK_E;
  if (level >= 60) return TRACK_D;
  if (level >= 40) return TRACK_C;
  if (level >= 20) return TRACK_B;
  return TRACK_A;
}

// 音色也随等级变化
function getVoiceForLevel(level: number): { lead: OscillatorType; bass: OscillatorType; vol: number } {
  if (level >= 80) return { lead: 'sawtooth', bass: 'square', vol: 0.07 };
  if (level >= 60) return { lead: 'square', bass: 'triangle', vol: 0.06 };
  if (level >= 40) return { lead: 'square', bass: 'square', vol: 0.06 };
  if (level >= 20) return { lead: 'square', bass: 'triangle', vol: 0.06 };
  return { lead: 'square', bass: 'triangle', vol: 0.06 };
}

let bgmPlaying = false;
let bgmTimer: ReturnType<typeof setTimeout> | null = null;
let getLevelFn: (() => number) | null = null;
let isPausedFn: (() => boolean) | null = null;
let isGameOverFn: (() => boolean) | null = null;
let currentTrack: [number, number][] = TRACK_A;

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
  currentTrack = TRACK_A;

  function playNext() {
    if (!bgmPlaying || isGameOverFn?.()) return;
    if (isPausedFn?.()) { bgmTimer = setTimeout(playNext, 200); return; }

    const lvl = getLevelFn?.() ?? 1;

    // 检测是否需要切换曲目
    const newTrack = getTrackForLevel(lvl);
    if (newTrack !== currentTrack) {
      currentTrack = newTrack;
      idx = 0; // 切曲时从头开始
    }

    const [freq, dur] = currentTrack[idx % currentTrack.length];
    const voice = getVoiceForLevel(lvl);

    // 速度随等级微调（在曲目本身节奏基础上）
    const speed = Math.max(0.7, 1 - (lvl - 1) * 0.003);
    const actualDur = dur * speed;

    if (freq > 0) {
      playTone(freq, actualDur / 1000 * 0.9, voice.lead, voice.vol);
      playTone(freq / 2, actualDur / 1000 * 0.6, voice.bass, voice.vol * 0.5);
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
