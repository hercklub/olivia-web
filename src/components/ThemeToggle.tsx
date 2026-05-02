import { Icons } from './Icons';
import type { Theme } from '../hooks/useTheme';

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isNight = theme === 'night';
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label="Prepnúť tému"
      title="Prepnúť tému"
    >
      <span className={`theme-knob ${isNight ? 'right' : 'left'}`} />
      <span className={`theme-icon sun ${!isNight ? 'on' : ''}`} aria-hidden="true">
        <Icons.Sun />
      </span>
      <span className={`theme-icon moon ${isNight ? 'on' : ''}`} aria-hidden="true">
        <Icons.Moon />
      </span>
    </button>
  );
}
