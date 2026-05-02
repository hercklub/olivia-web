import { useEffect, useState } from 'react';

const STORAGE_KEY = 'olivia-live-mode';

function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).has('dev');
}

export function useCallMode() {
  const devMode = isDevMode();

  const [live, setLive] = useState<boolean>(() => {
    // In production (no ?dev=1): always live — Demo is a dev/UI tool only.
    if (!devMode) return true;
    // In dev: read persisted preference, default false (Demo) so UI work
    // doesn't accidentally trigger ElevenLabs every reload.
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });

  useEffect(() => {
    if (devMode) localStorage.setItem(STORAGE_KEY, String(live));
  }, [live, devMode]);

  return {
    live,
    toggle: () => setLive((l) => !l),
    devMode,
  };
}
