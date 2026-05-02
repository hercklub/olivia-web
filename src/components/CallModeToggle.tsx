export function CallModeToggle({ live, onToggle }: { live: boolean; onToggle: () => void }) {
  return (
    <button
      className="call-mode-toggle"
      onClick={onToggle}
      title={live ? 'Prepnúť na demo (skriptovaný hovor)' : 'Prepnúť na naživo (ElevenLabs)'}
      aria-label="Prepnúť mód hovoru"
    >
      <span className={`call-mode-dot ${live ? 'live' : 'demo'}`} />
      {live ? 'Naživo' : 'Demo'}
    </button>
  );
}
