import { useEffect, useRef, useState } from 'react';
import { OliviaAvatar, type OliviaState, type OliviaTheme } from './OliviaAvatar';

interface Props {
  baseState: OliviaState;
  theme: OliviaTheme;
  size?: number;
  interactive?: boolean;
}

const PET_HOLD_MS = 600;
const CLICK_RESET_MS = 1500;
const RANDOM_MIN_MS = 30_000;
const RANDOM_SPREAD_MS = 30_000;
const RANDOM_SHOW_MS = 2000;
const RANDOM_EMOTIONS: OliviaState[] = ['fun', 'happy', 'love', 'thinking'];

export function OliviaInteractive({ baseState, theme, size = 56, interactive = true }: Props) {
  const [hover, setHover] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [petting, setPetting] = useState(false);
  const [randomBlink, setRandomBlink] = useState<OliviaState | null>(null);

  const petTimer = useRef<number | null>(null);
  const clickResetTimer = useRef<number | null>(null);
  const pettingRef = useRef(false);
  pettingRef.current = petting;

  // Idle random emotion blink (raz za 30-60s)
  useEffect(() => {
    if (!interactive || baseState !== 'idle') return;
    let blinkTimeout: number | null = null;
    const tick = window.setInterval(() => {
      const emo = RANDOM_EMOTIONS[Math.floor(Math.random() * RANDOM_EMOTIONS.length)];
      setRandomBlink(emo);
      blinkTimeout = window.setTimeout(() => setRandomBlink(null), RANDOM_SHOW_MS);
    }, RANDOM_MIN_MS + Math.random() * RANDOM_SPREAD_MS);
    return () => {
      window.clearInterval(tick);
      if (blinkTimeout) window.clearTimeout(blinkTimeout);
    };
  }, [baseState, interactive]);

  useEffect(
    () => () => {
      if (petTimer.current) window.clearTimeout(petTimer.current);
      if (clickResetTimer.current) window.clearTimeout(clickResetTimer.current);
    },
    [],
  );

  const onPointerDown = () => {
    if (!interactive) return;
    if (petTimer.current) window.clearTimeout(petTimer.current);
    petTimer.current = window.setTimeout(() => {
      setPetting(true);
      petTimer.current = null;
    }, PET_HOLD_MS);
  };

  const endPress = () => {
    const wasPetting = pettingRef.current;
    if (petTimer.current) {
      window.clearTimeout(petTimer.current);
      petTimer.current = null;
    }
    if (wasPetting) {
      setPetting(false);
      return;
    }
    setClickCount((c) => c + 1);
    if (clickResetTimer.current) window.clearTimeout(clickResetTimer.current);
    clickResetTimer.current = window.setTimeout(() => setClickCount(0), CLICK_RESET_MS);
  };

  const cancelPress = () => {
    if (petTimer.current) {
      window.clearTimeout(petTimer.current);
      petTimer.current = null;
    }
    if (pettingRef.current) setPetting(false);
  };

  // Priority: hovor (non-idle) > pet > click > randomBlink > hover > idle
  let displayState: OliviaState = baseState;
  if (interactive && baseState === 'idle') {
    if (petting) displayState = 'love';
    else if (clickCount >= 4) displayState = 'angry';
    else if (clickCount >= 2) displayState = 'confused';
    else if (clickCount === 1) displayState = 'fun';
    else if (randomBlink) displayState = randomBlink;
    else if (hover) displayState = 'happy';
  }

  return (
    <div
      className="olivia-interactive"
      style={{ cursor: interactive ? 'pointer' : 'default', display: 'inline-flex', lineHeight: 0 }}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        cancelPress();
      }}
      onPointerDown={onPointerDown}
      onPointerUp={endPress}
      onPointerCancel={cancelPress}
    >
      <OliviaAvatar state={displayState} theme={theme} size={size} showWordmark={false} bare />
    </div>
  );
}
