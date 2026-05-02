import { useEffect, useRef, useState } from 'react';

export type OliviaState =
  | 'idle'
  | 'listening'
  | 'speaking'
  | 'thinking'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'confused'
  | 'fun'
  | 'love'
  | 'wave';

export type OliviaTheme = 'light' | 'dark';

const STYLE_ID = 'olivia-avatar-styles';
const CSS = `
.olivia-root { display: inline-flex; align-items: center; gap: 10px;
  padding: 5px 14px 5px 5px; border-radius: 999px; user-select: none;
  transition: background 320ms ease, color 320ms ease, box-shadow 320ms ease;
  font-family: "Inter", -apple-system, system-ui, sans-serif; }
.olivia-root.olivia-light {
  background: linear-gradient(135deg, #fff5e6 0%, #f0fae0 100%); color: #1f2440;
  box-shadow: 0 2px 16px rgba(196,240,98,0.30), 0 1px 0 rgba(0,0,0,0.04); }
.olivia-root.olivia-dark {
  background: linear-gradient(135deg, #1b2240 0%, #232b52 100%); color: #f4e9d4;
  box-shadow: 0 2px 22px rgba(196,240,98,0.18),
              inset 0 0 0 1px rgba(255,255,255,0.05); }
.olivia-root.olivia-bare {
  background: transparent; box-shadow: none; padding: 0; gap: 0; }

.olivia-svg { display: block; overflow: visible; }
.olivia-wordmark { font-weight: 600; font-size: 0.95em; letter-spacing: -0.01em;
  line-height: 1; padding-right: 4px; }

.olivia-body-grp { transform-box: fill-box; transform-origin: 50% 80%; }
.olivia-state.olivia-idle      .olivia-body-grp { animation: olivia-breathe 3.4s ease-in-out infinite; }
.olivia-state.olivia-listening .olivia-body-grp { animation: olivia-breathe 2.0s ease-in-out infinite; }
.olivia-state.olivia-speaking  .olivia-body-grp { animation: olivia-bob     0.7s ease-in-out infinite; }
.olivia-state.olivia-happy     .olivia-body-grp { animation: olivia-happy   0.5s ease-in-out infinite; }
.olivia-state.olivia-sad       .olivia-body-grp { animation: olivia-sad     4.0s ease-in-out infinite;
                                                  transform-origin: 50% 100%; }
.olivia-state.olivia-angry     .olivia-body-grp { animation: olivia-shake   0.16s ease-in-out infinite; }
.olivia-state.olivia-confused  .olivia-body-grp { animation: olivia-tilt    2.6s ease-in-out infinite; }
.olivia-state.olivia-fun       .olivia-body-grp { animation: olivia-dance   1.0s ease-in-out infinite;
                                                  transform-origin: 50% 100%; }
.olivia-state.olivia-thinking  .olivia-body-grp { animation: olivia-think   3.6s ease-in-out infinite; }
.olivia-state.olivia-love      .olivia-body-grp { animation: olivia-love    2.0s ease-in-out infinite; }
.olivia-state.olivia-wave      .olivia-body-grp { animation: olivia-greet   2.4s ease-in-out infinite;
                                                  transform-origin: 50% 100%; }

@keyframes olivia-breathe { 0%,100% { transform: scale(1, 1); } 50% { transform: scale(1.03, 0.97); } }
@keyframes olivia-bob {
  0%, 100% { transform: translateY(0)    rotate(0deg); }
  25%      { transform: translateY(-1px) rotate( 2deg) scale(1.02, 0.98); }
  75%      { transform: translateY(-1px) rotate(-2deg) scale(1.02, 0.98); }
}
@keyframes olivia-happy {
  0%, 100% { transform: translateY(0)    scale(1, 1); }
  50%      { transform: translateY(-4px) scale(1.06, 0.94); }
}
@keyframes olivia-sad {
  0%, 100% { transform: scale(0.96, 0.93) translateY(3px); }
  50%      { transform: scale(0.97, 0.92) translateY(4px); }
}
@keyframes olivia-shake {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  25%      { transform: translateX(-1.5px) rotate(-1.2deg); }
  75%      { transform: translateX( 1.5px) rotate( 1.2deg); }
}
@keyframes olivia-tilt {
  0%, 100% { transform: rotate(-9deg); }
  50%      { transform: rotate(-3deg); }
}
@keyframes olivia-dance {
  0%   { transform: translateY(0)    rotate(-3deg) scale(1, 1); }
  18%  { transform: translateY(-7px) rotate(-2deg) scale(0.94, 1.07); }
  32%  { transform: translateY(0)    rotate(-4deg) scale(1.10, 0.91); }
  50%  { transform: translateY(0)    rotate( 3deg) scale(1, 1); }
  68%  { transform: translateY(-7px) rotate( 2deg) scale(0.94, 1.07); }
  82%  { transform: translateY(0)    rotate( 4deg) scale(1.10, 0.91); }
  100% { transform: translateY(0)    rotate(-3deg) scale(1, 1); }
}
@keyframes olivia-think {
  0%, 100% { transform: rotate(-3deg) scale(1, 1); }
  50%      { transform: rotate( 3deg) scale(1.02, 0.98); }
}
@keyframes olivia-love {
  0%, 100% { transform: scale(1, 1)        translateY(0); }
  50%      { transform: scale(1.05, 0.95)  translateY(-2px); }
}
@keyframes olivia-greet {
  0%, 60%, 100% { transform: translateY(0) scale(1, 1); }
  72%           { transform: translateY(-6px) scale(0.94, 1.07); }
  85%           { transform: translateY(0)    scale(1.08, 0.92); }
}

.olivia-eye-blink { transform-box: fill-box; transform-origin: center;
  animation: olivia-blink 4.6s ease-in-out infinite; }
.olivia-eye-blink-r { animation-delay: 0.04s; }
.olivia-state.olivia-listening .olivia-eye-blink { animation-duration: 5.8s; }
@keyframes olivia-blink {
  0%, 91%, 100% { transform: scaleY(1); }
  93.5%         { transform: scaleY(0.05); }
  96%           { transform: scaleY(1); }
}

.olivia-mouth { transition: d 150ms cubic-bezier(.4,.0,.2,1),
                            fill-opacity 150ms ease; }
.olivia-mouth-bob { transform-box: fill-box; transform-origin: center; }
.olivia-state.olivia-speaking .olivia-mouth-bob {
  animation: olivia-mouth-bob 0.36s ease-in-out infinite alternate; }
@keyframes olivia-mouth-bob { from { transform: scale(1); } to { transform: scale(1.08); } }

.olivia-leaf { transform-box: fill-box; transform-origin: 50% 100%;
  transition: transform 320ms cubic-bezier(.34,1.56,.64,1); }
.olivia-state.olivia-listening .olivia-leaf,
.olivia-state.olivia-happy     .olivia-leaf,
.olivia-state.olivia-love      .olivia-leaf,
.olivia-state.olivia-wave      .olivia-leaf { animation: olivia-sway 1.4s ease-in-out infinite; }
.olivia-state.olivia-speaking  .olivia-leaf { animation: olivia-sway 0.8s ease-in-out infinite; }
.olivia-state.olivia-thinking  .olivia-leaf { animation: olivia-sway 2.6s ease-in-out infinite; }
.olivia-state.olivia-angry     .olivia-leaf { animation: olivia-leaf-shake 0.14s ease-in-out infinite; }
.olivia-state.olivia-fun       .olivia-leaf { animation: olivia-leaf-bounce 0.5s ease-in-out infinite; }
.olivia-state.olivia-sad       .olivia-leaf-l { transform: rotate(-32deg) translateY(2px); }
.olivia-state.olivia-sad       .olivia-leaf-c { transform: rotate(  6deg) translateY(3px); }
.olivia-state.olivia-sad       .olivia-leaf-r { transform: rotate( 32deg) translateY(2px); }
.olivia-leaf-c { animation-delay: 0.12s !important; }
.olivia-leaf-r { animation-delay: 0.24s !important; }
@keyframes olivia-sway { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
@keyframes olivia-leaf-shake { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@keyframes olivia-leaf-bounce {
  0%, 100% { transform: rotate(-12deg) translateY(0); }
  50%      { transform: rotate( 12deg) translateY(-1.5px); }
}

.olivia-ring { transform-box: fill-box; transform-origin: center; opacity: 0; }
.olivia-state.olivia-listening .olivia-ring { animation: olivia-pulse 2.0s ease-out infinite; }
.olivia-state.olivia-speaking  .olivia-ring { animation: olivia-pulse 1.3s ease-out infinite; }
.olivia-ring-2 { animation-delay: 0.4s !important; }
.olivia-ring-3 { animation-delay: 0.8s !important; }
@keyframes olivia-pulse {
  0%   { opacity: 0;    transform: scale(0.82); }
  18%  { opacity: 0.55; }
  100% { opacity: 0;    transform: scale(1.42); }
}

.olivia-aura { transition: opacity 480ms ease; opacity: 0; }
.olivia-state.olivia-listening .olivia-aura,
.olivia-state.olivia-speaking  .olivia-aura,
.olivia-state.olivia-happy     .olivia-aura,
.olivia-state.olivia-fun       .olivia-aura { opacity: 0.55; }
.olivia-state.olivia-idle      .olivia-aura { opacity: 0.20; }

.olivia-tear { transform-box: fill-box; transform-origin: center top; opacity: 0;
  animation: olivia-teardrop 2.4s ease-in infinite; }
@keyframes olivia-teardrop {
  0%   { transform: translateY(0)   scale(0.4); opacity: 0; }
  18%  { transform: translateY(0)   scale(1);   opacity: 1; }
  78%  { transform: translateY(20px) scale(1);  opacity: 1; }
  100% { transform: translateY(28px) scale(0.5); opacity: 0; }
}
.olivia-steam { transform-box: fill-box; transform-origin: center; opacity: 0;
  animation: olivia-steam 1.4s ease-out infinite; }
.olivia-steam-2 { animation-delay: 0.4s; }
.olivia-steam-3 { animation-delay: 0.8s; }
@keyframes olivia-steam {
  0%   { transform: translateY(0)    scale(0.5); opacity: 0; }
  25%  { opacity: 0.75; }
  100% { transform: translateY(-16px) scale(1.6); opacity: 0; }
}
.olivia-question { transform-box: fill-box; transform-origin: 50% 50%;
  animation: olivia-qbob 1.4s ease-in-out infinite; }
@keyframes olivia-qbob {
  0%, 100% { transform: translateY(0)   rotate(-10deg); }
  50%      { transform: translateY(-3px) rotate( 10deg); }
}
.olivia-spark { transform-box: fill-box; transform-origin: center; opacity: 0;
  animation: olivia-spark 1.3s ease-in-out infinite; }
.olivia-spark-2 { animation-delay: 0.32s; }
.olivia-spark-3 { animation-delay: 0.65s; }
.olivia-spark-4 { animation-delay: 0.95s; }
@keyframes olivia-spark {
  0%, 100% { opacity: 0; transform: scale(0.4) rotate(0deg); }
  50%      { opacity: 1; transform: scale(1.2) rotate(180deg); }
}
.olivia-tongue { transform-box: fill-box; transform-origin: 50% 0%;
  animation: olivia-tongue-wag 0.6s ease-in-out infinite alternate; }
@keyframes olivia-tongue-wag {
  from { transform: rotate(-8deg) translateY(0); }
  to   { transform: rotate( 8deg) translateY(1px); }
}
.olivia-think-dot { transform-box: fill-box; transform-origin: center; opacity: 0.3;
  animation: olivia-think-pulse 1.4s ease-in-out infinite; }
.olivia-think-dot-2 { animation-delay: 0.2s; }
.olivia-think-dot-3 { animation-delay: 0.4s; }
@keyframes olivia-think-pulse {
  0%, 100% { opacity: 0.25; transform: scale(0.85); }
  50%      { opacity: 1;    transform: scale(1.2); }
}
.olivia-heart-eye { transform-box: fill-box; transform-origin: center;
  animation: olivia-heartbeat 0.7s ease-in-out infinite; }
@keyframes olivia-heartbeat {
  0%, 100% { transform: scale(1); }
  30%      { transform: scale(1.18); }
  60%      { transform: scale(0.95); }
}
.olivia-heart-float { transform-box: fill-box; transform-origin: center; opacity: 0;
  animation: olivia-heart-rise 2.0s ease-out infinite; }
.olivia-heart-float-2 { animation-delay: 0.55s; }
.olivia-heart-float-3 { animation-delay: 1.1s; }
@keyframes olivia-heart-rise {
  0%   { transform: translateY(0)    scale(0.5); opacity: 0; }
  20%  { opacity: 1; }
  100% { transform: translateY(-22px) scale(1.15); opacity: 0; }
}

.olivia-state.olivia-angry .olivia-cheek { fill: #ff5544; opacity: 0.85; }
.olivia-state.olivia-sad   .olivia-cheek { opacity: 0.25; }
.olivia-state.olivia-love  .olivia-cheek { fill: #ff5588; opacity: 0.8; }

.olivia-dark .olivia-eye-mark  { filter: drop-shadow(0 0 1.6px rgba(196,240,98,0.7)); }
.olivia-dark .olivia-leaf-fill { filter: drop-shadow(0 0 1.4px rgba(196,240,98,0.45)); }
.olivia-dark .olivia-cheek     { opacity: 0.5; }

@media (prefers-reduced-motion: reduce) {
  .olivia-body-grp, .olivia-eye-blink, .olivia-ring, .olivia-mouth-bob,
  .olivia-leaf, .olivia-tear, .olivia-steam, .olivia-question,
  .olivia-spark, .olivia-tongue, .olivia-think-dot, .olivia-heart-eye,
  .olivia-heart-float { animation: none !important; }
  .olivia-mouth { transition: none !important; }
}
`;

function injectStyles() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement('style');
  tag.id = STYLE_ID;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

const VISEMES: Record<string, string> = {
  closed: 'M 46 62 Q 50 65 54 62 Q 50 64 46 62 Z',
  smile: 'M 44 61 Q 50 67 56 61 Q 50 65 44 61 Z',
  bigSmile: 'M 41 59 Q 50 71 59 59 Q 50 68 41 59 Z',
  ah: 'M 47 60 Q 50 68 53 60 Q 50 63 47 60 Z',
  oh: 'M 47 61 Q 50 66 53 61 Q 50 63 47 61 Z',
  oval: 'M 46 61 Q 50 53 54 61 Q 50 69 46 61 Z',
  ee: 'M 44 62 Q 50 64 56 62 Q 50 63 44 62 Z',
  frown: 'M 44 65 Q 50 59 56 65 Q 50 62 44 65 Z',
  pursed: 'M 48 62 Q 50 64 52 62 Q 50 63 48 62 Z',
};

const SPEAKING_CYCLE = ['ah', 'oh', 'oval', 'ee', 'closed', 'oval', 'ah'];

type EyeMode = 'normal' | 'happy' | 'wink' | 'sad' | 'angry' | 'confused' | 'thinking' | 'love';

interface StateConfig {
  mouth: string | null;
  eye: EyeMode;
  fx?: string | null;
}

const STATE_CONFIG: Record<OliviaState, StateConfig> = {
  idle: { mouth: 'smile', eye: 'normal' },
  listening: { mouth: 'closed', eye: 'normal' },
  speaking: { mouth: null, eye: 'normal' },
  happy: { mouth: 'bigSmile', eye: 'happy', fx: 'sparkles' },
  sad: { mouth: 'frown', eye: 'sad', fx: 'tear' },
  angry: { mouth: 'frown', eye: 'angry', fx: 'steam' },
  confused: { mouth: 'oh', eye: 'confused', fx: 'question' },
  fun: { mouth: 'bigSmile', eye: 'wink', fx: 'sparkles+tongue' },
  thinking: { mouth: 'pursed', eye: 'thinking', fx: 'thoughts' },
  love: { mouth: 'smile', eye: 'love', fx: 'hearts' },
  wave: { mouth: 'smile', eye: 'normal', fx: null },
};

interface Palette {
  body: string;
  bodyTop: string;
  outline: string;
  eye: string;
  cheek: string;
  leaf: string;
  leafTop: string;
  halo: string;
  mouthFill: string;
  tongue: string;
  spark: string;
  tear: string;
  tearOutline: string;
  heart: string;
  heartLight: string;
}

const PALETTES: Record<OliviaTheme, Palette> = {
  light: {
    body: '#bce86b', bodyTop: '#d6f08e', outline: '#28341a',
    eye: '#1f2440', cheek: '#ff9a62',
    leaf: '#7fb946', leafTop: '#a8d676',
    halo: '#ffe27a', mouthFill: '#28341a', tongue: '#ff7088',
    spark: '#ffd84a', tear: '#7fc8e8', tearOutline: '#3a7a9a',
    heart: '#e94565', heartLight: '#ff7088',
  },
  dark: {
    body: '#3d5538', bodyTop: '#4f6a48', outline: '#dde9b0',
    eye: '#f4e9d4', cheek: '#ff9a62',
    leaf: '#7fb946', leafTop: '#c4f062',
    halo: '#9aa6d8', mouthFill: '#0d1330', tongue: '#ff7088',
    spark: '#c4f062', tear: '#9adcff', tearOutline: '#5fa9d1',
    heart: '#ff5588', heartLight: '#ff88aa',
  },
};

function heartPath(cx: number, cy: number, s: number) {
  return `M ${cx},${cy + s} ` +
    `C ${cx - s * 0.55},${cy + s * 0.55} ${cx - s},${cy - s * 0.15} ${cx - s},${cy - s * 0.5} ` +
    `C ${cx - s},${cy - s * 0.85} ${cx - s * 0.55},${cy - s} ${cx - s * 0.25},${cy - s * 0.85} ` +
    `C ${cx - s * 0.05},${cy - s * 0.7} ${cx},${cy - s * 0.4} ${cx},${cy - s * 0.2} ` +
    `C ${cx},${cy - s * 0.4} ${cx + s * 0.05},${cy - s * 0.7} ${cx + s * 0.25},${cy - s * 0.85} ` +
    `C ${cx + s * 0.55},${cy - s} ${cx + s},${cy - s * 0.85} ${cx + s},${cy - s * 0.5} ` +
    `C ${cx + s},${cy - s * 0.15} ${cx + s * 0.55},${cy + s * 0.55} ${cx},${cy + s} Z`;
}

function renderEye(side: 'l' | 'r', mode: EyeMode, p: Palette, baseRx: number, baseRy: number) {
  const cx = side === 'l' ? 38 : 62;
  const hx = side === 'l' ? 39.2 : 63.2;

  if (mode === 'happy' || (mode === 'wink' && side === 'l')) {
    return (
      <path className="olivia-eye-mark"
        d={`M ${cx - 4.5} 55 Q ${cx} 49 ${cx + 4.5} 55`}
        fill="none" stroke={p.eye} strokeWidth="2.6" strokeLinecap="round" />
    );
  }
  if (mode === 'sad') {
    return (
      <g className="olivia-eye-mark">
        <ellipse cx={cx} cy="56" rx={baseRx} ry={baseRy * 0.85} fill={p.eye} />
        <circle cx={hx} cy="55.5" r="1" fill="#fff" opacity="0.9" />
        <path d={`M ${cx - 5} 50 Q ${cx} 53.5 ${cx + 5} 50`}
          fill="none" stroke={p.eye} strokeWidth="1.6" strokeLinecap="round" />
      </g>
    );
  }
  if (mode === 'angry') {
    const brow = side === 'l' ? 'M 32 47 L 44 51' : 'M 68 47 L 56 51';
    return (
      <g className="olivia-eye-mark">
        <path d={brow} fill="none" stroke={p.eye} strokeWidth="2.6" strokeLinecap="round" />
        <ellipse cx={cx} cy="56" rx="3.4" ry="2.5" fill={p.eye} />
        <circle cx={hx - 0.4} cy="55.2" r="0.9" fill="#fff" opacity="0.95" />
      </g>
    );
  }
  if (mode === 'confused') {
    const rx = side === 'l' ? baseRx * 1.18 : baseRx * 0.82;
    const ry = side === 'l' ? baseRy * 1.18 : baseRy * 0.82;
    return (
      <g className="olivia-eye-mark">
        <ellipse cx={cx} cy="54" rx={rx} ry={ry} fill={p.eye} />
        <circle cx={hx} cy="52.6" r="1.2" fill="#fff" opacity="0.95" />
      </g>
    );
  }
  if (mode === 'thinking') {
    return (
      <g className="olivia-eye-mark">
        <ellipse cx={cx} cy="51.5" rx={baseRx * 0.95} ry={baseRy * 1.05} fill={p.eye} />
        <circle cx={hx - 0.2} cy="53.4" r="1.0" fill="#fff" opacity="0.9" />
      </g>
    );
  }
  if (mode === 'love') {
    return (
      <path className="olivia-eye-mark olivia-heart-eye"
        d={heartPath(cx, 51, 7)}
        fill={p.heart} stroke={p.outline} strokeWidth="0.9"
        strokeLinejoin="round" />
    );
  }
  return (
    <g className={`olivia-eye-mark olivia-eye-blink olivia-eye-blink-${side}`}>
      <ellipse cx={cx} cy="54" rx={baseRx} ry={baseRy} fill={p.eye} />
      <circle cx={hx} cy="52.6" r="1.2" fill="#fff" opacity="0.95" />
    </g>
  );
}

function renderAccessory(fx: string | null | undefined, p: Palette) {
  if (!fx) return null;
  const has = (k: string) => fx.includes(k);
  return (
    <>
      {has('tear') && (
        <path className="olivia-tear"
          d="M 36 60 Q 33 65 36 70 Q 39 65 36 60 Z"
          fill={p.tear} stroke={p.tearOutline} strokeWidth="0.8" />
      )}
      {has('steam') && (
        <g>
          <circle className="olivia-steam olivia-steam-1" cx="32" cy="20" r="2.2"
            fill="#fff" opacity="0.7" />
          <circle className="olivia-steam olivia-steam-2" cx="68" cy="22" r="2"
            fill="#fff" opacity="0.7" />
          <circle className="olivia-steam olivia-steam-3" cx="50" cy="14" r="1.8"
            fill="#fff" opacity="0.7" />
        </g>
      )}
      {has('question') && (
        <text className="olivia-question" x="74" y="22"
          fill={p.outline} fontSize="14" fontWeight="800"
          fontFamily="Inter, system-ui, sans-serif">?</text>
      )}
      {has('sparkles') && (
        <g>
          <path className="olivia-spark olivia-spark-1"
            d="M 14 30 L 16 32 L 14 34 L 12 32 Z" fill={p.spark} />
          <path className="olivia-spark olivia-spark-2"
            d="M 86 28 L 88 30 L 86 32 L 84 30 Z" fill={p.spark} />
          <path className="olivia-spark olivia-spark-3"
            d="M 90 60 L 92 62 L 90 64 L 88 62 Z" fill={p.spark} />
          <path className="olivia-spark olivia-spark-4"
            d="M 10 66 L 12 68 L 10 70 L 8 68 Z" fill={p.spark} />
        </g>
      )}
      {has('tongue') && (
        <ellipse className="olivia-tongue" cx="50" cy="64" rx="2.6" ry="1.6"
          fill={p.tongue} stroke={p.outline} strokeWidth="0.8" />
      )}
      {has('thoughts') && (
        <g>
          <ellipse className="olivia-think-dot olivia-think-dot-1"
            cx="72" cy="28" rx="2.6" ry="2.1"
            fill="#fff" stroke={p.outline} strokeWidth="0.8" />
          <ellipse className="olivia-think-dot olivia-think-dot-2"
            cx="80" cy="20" rx="3.6" ry="2.9"
            fill="#fff" stroke={p.outline} strokeWidth="0.9" />
          <path className="olivia-think-dot olivia-think-dot-3"
            d="M 87 5 q -4 0 -4.5 3.5 q -3 0.5 -3 3 q 0 3 4 3 l 8 0 q 4 0 4 -3 q 0 -3 -3 -3.5 q -1 -3 -5.5 -3 z"
            fill="#fff" stroke={p.outline} strokeWidth="0.9" strokeLinejoin="round" />
        </g>
      )}
      {has('hearts') && (
        <g>
          <path className="olivia-heart-float olivia-heart-float-1"
            d={heartPath(20, 32, 2.4)} fill={p.heart} stroke={p.outline} strokeWidth="0.5" />
          <path className="olivia-heart-float olivia-heart-float-2"
            d={heartPath(82, 28, 2.8)} fill={p.heartLight} stroke={p.outline} strokeWidth="0.5" />
          <path className="olivia-heart-float olivia-heart-float-3"
            d={heartPath(50, 14, 2.2)} fill={p.heart} stroke={p.outline} strokeWidth="0.5" />
        </g>
      )}
    </>
  );
}

export interface OliviaAvatarProps {
  state?: OliviaState;
  theme?: OliviaTheme;
  size?: number;
  showWordmark?: boolean;
  bare?: boolean;
  ariaLabel?: string;
}

export function OliviaAvatar({
  state = 'idle',
  theme = 'light',
  size = 42,
  showWordmark = true,
  bare = false,
  ariaLabel = 'Olívia',
}: OliviaAvatarProps) {
  useEffect(injectStyles, []);
  const [viseme, setViseme] = useState('smile');
  const cycleRef = useRef(0);
  const gradientId = `olivia-body-grad-${theme}`;
  const cfg = STATE_CONFIG[state] || STATE_CONFIG.idle;

  useEffect(() => {
    const c = STATE_CONFIG[state] || STATE_CONFIG.idle;
    if (c.mouth !== null) {
      setViseme(c.mouth);
      return undefined;
    }
    cycleRef.current = 0;
    setViseme(SPEAKING_CYCLE[0]);
    const id = window.setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % SPEAKING_CYCLE.length;
      setViseme(SPEAKING_CYCLE[cycleRef.current]);
    }, 180);
    return () => window.clearInterval(id);
  }, [state]);

  const p = PALETTES[theme] || PALETTES.light;
  const sw = 2;
  const isOpen = viseme === 'ah' || viseme === 'oh' || viseme === 'oval';
  const eyeRy = state === 'listening' ? 5.2 : 4.4;
  const eyeRx = state === 'listening' ? 4.0 : 3.6;

  return (
    <span
      className={`olivia-root olivia-${theme}${bare ? ' olivia-bare' : ''} olivia-state olivia-${state}`}
      role="img"
      aria-label={`${ariaLabel} — ${state}`}
    >
      <svg
        className="olivia-svg"
        width={size} height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={gradientId} cx="0.4" cy="0.3" r="0.85">
            <stop offset="0%" stopColor={p.bodyTop} />
            <stop offset="100%" stopColor={p.body} />
          </radialGradient>
        </defs>

        <g>
          <circle className="olivia-ring olivia-ring-1" cx="50" cy="54" r="40"
            fill="none" stroke={p.leafTop} strokeWidth="1.5" />
          <circle className="olivia-ring olivia-ring-2" cx="50" cy="54" r="40"
            fill="none" stroke={p.leafTop} strokeWidth="1.5" />
          <circle className="olivia-ring olivia-ring-3" cx="50" cy="54" r="40"
            fill="none" stroke={p.leafTop} strokeWidth="1.5" />
        </g>

        {theme === 'light' ? (
          <circle className="olivia-aura" cx="50" cy="52" r="42" fill={p.halo} />
        ) : (
          <g className="olivia-aura">
            <circle cx="76" cy="22" r="11" fill={p.halo} opacity="0.6" />
            <circle cx="80" cy="20" r="8.5" fill="#1b2240" />
          </g>
        )}

        {renderAccessory(cfg.fx, p)}

        <g className="olivia-body-grp">
          <g className="olivia-leaf olivia-leaf-l">
            <path className="olivia-leaf-fill"
              d="M 38 22 Q 28 16 30 6 Q 40 10 42 22 Z"
              fill={p.leaf} stroke={p.outline} strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round" />
          </g>
          <g className="olivia-leaf olivia-leaf-c">
            <path className="olivia-leaf-fill"
              d="M 50 20 Q 46 10 51 3 Q 56 10 53 20 Z"
              fill={p.leafTop} stroke={p.outline} strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round" />
          </g>
          <g className="olivia-leaf olivia-leaf-r">
            <path className="olivia-leaf-fill"
              d="M 62 22 Q 72 16 70 6 Q 60 10 58 22 Z"
              fill={p.leaf} stroke={p.outline} strokeWidth="1.5"
              strokeLinejoin="round" strokeLinecap="round" />
          </g>

          <path
            d="M 50 20 C 73 20 87 34 87 56 C 87 76 72 88 50 88
               C 28 88 13 76 13 56 C 13 34 27 20 50 20 Z"
            fill={`url(#${gradientId})`}
            stroke={p.outline} strokeWidth={sw} strokeLinejoin="round" />

          <ellipse className="olivia-cheek" cx="28" cy="62" rx="4.5" ry="2.4"
            fill={p.cheek} opacity="0.55" />
          <ellipse className="olivia-cheek" cx="72" cy="62" rx="4.5" ry="2.4"
            fill={p.cheek} opacity="0.55" />

          {renderEye('l', cfg.eye, p, eyeRx, eyeRy)}
          {renderEye('r', cfg.eye, p, eyeRx, eyeRy)}

          <g className="olivia-mouth-bob">
            <path className="olivia-mouth"
              d={VISEMES[viseme] || VISEMES.closed}
              fill={p.mouthFill}
              fillOpacity={isOpen ? 1 : 0.92}
              stroke={p.outline} strokeWidth="1.4"
              strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </svg>

      {showWordmark && <span className="olivia-wordmark">Olívia</span>}
    </span>
  );
}
