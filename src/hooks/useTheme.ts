import { useEffect, useState } from 'react';

export type Theme = 'sky' | 'night';

const STORAGE_KEY = 'olivia-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'sky';
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return saved === 'night' ? 'night' : 'sky';
  });

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'night' ? 'sky' : 'night'));
  return { theme, toggle };
}
