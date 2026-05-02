import { useEffect, useMemo, useRef, useState } from 'react';
import { Icons } from './Icons';

export function AudioPlayer({ caption, duration = 28 }: { caption?: string; duration?: number }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    const start = Date.now() - progress * 1000;
    const tick = () => {
      const elapsed = (Date.now() - start) / 1000;
      if (elapsed >= duration) {
        setProgress(duration);
        setPlaying(false);
        return;
      }
      setProgress(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, duration]);

  const bars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => {
        const t = i / 48;
        const env = Math.sin(t * Math.PI) * 0.7 + 0.3;
        const noise = Math.sin(i * 1.7) * 0.3 + Math.sin(i * 0.4) * 0.4;
        return Math.max(0.15, Math.min(1, env * (0.6 + noise * 0.6)));
      }),
    [],
  );

  const ratio = progress / duration;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div>
      <div className="player">
        <button
          className="play-btn"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pauza' : 'Prehrať'}
        >
          {playing ? <Icons.Pause /> : <Icons.Play />}
        </button>
        <div
          className="waveform"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - r.left) / r.width;
            setProgress(pct * duration);
          }}
        >
          {bars.map((h, i) => (
            <div
              key={i}
              className={`bar${i / bars.length <= ratio ? ' active' : ''}`}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
        <div className="time">{fmt(progress)}</div>
      </div>
      {caption && <div className="player-caption">{caption}</div>}
    </div>
  );
}
