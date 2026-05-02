import { useEffect } from 'react';

const CLOUD_PATHS = [
  'M5,20 C2,20 2,14 6,13 C6,8 14,6 17,11 C20,7 28,9 28,15 C32,15 32,21 28,21 L8,21 C6,21 5,21 5,20 Z',
  'M3,18 C0,17 1,12 5,12 C5,8 11,6 14,10 C17,6 24,8 25,13 C29,13 30,18 26,19 L7,19 C5,19 4,19 3,18 Z',
  'M4,22 C1,22 1,16 5,15 C6,11 13,10 16,14 C19,11 26,12 27,17 C31,17 31,23 27,23 L7,23 C5,23 4,23 4,22 Z',
];

const CLOUDS = [
  { x: 6, y: 12, s: 90, p: 0, d: 18 },
  { x: 82, y: 8, s: 110, p: 1, d: 22 },
  { x: 14, y: 68, s: 80, p: 2, d: 20 },
  { x: 78, y: 62, s: 100, p: 0, d: 24 },
  { x: 45, y: 6, s: 70, p: 1, d: 16 },
  { x: 50, y: 84, s: 85, p: 2, d: 19 },
  { x: 3, y: 40, s: 65, p: 0, d: 21 },
  { x: 90, y: 38, s: 75, p: 2, d: 17 },
];

export function Sky() {
  useEffect(() => {
    const sky = document.getElementById('sky');
    if (!sky || sky.children.length > 0) return;
    CLOUDS.forEach((c, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'cloud';
      wrap.style.left = c.x + '%';
      wrap.style.top = c.y + '%';
      wrap.style.width = c.s + 'px';
      wrap.style.animationDuration = c.d + 's';
      wrap.style.animationDirection = i % 2 ? 'reverse' : 'normal';
      wrap.innerHTML = `
        <svg viewBox="0 0 32 26" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="${CLOUD_PATHS[c.p]}" fill="white" stroke="#0f1820" stroke-width="1" stroke-linejoin="round"/>
        </svg>
      `;
      sky.appendChild(wrap);
    });
  }, []);
  return null;
}
