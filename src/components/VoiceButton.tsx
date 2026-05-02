import { useOliviaAgent } from '../hooks/useOliviaAgent';

export function VoiceButton() {
  const { status, isSpeaking, startVoice, endSession } = useOliviaAgent();
  const connected = status === 'connected';

  const handleClick = async () => {
    if (connected) {
      endSession();
    } else {
      await startVoice();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          connected
            ? 'bg-emerald-500 shadow-lg shadow-emerald-200 scale-105'
            : 'bg-white shadow-md hover:shadow-lg hover:scale-105'
        }`}
      >
        {/* Pulse ring when speaking */}
        {connected && isSpeaking && (
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30" />
        )}
        {connected && (
          <span className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-pulse" />
        )}
        <svg
          className={`w-8 h-8 transition-colors ${connected ? 'text-white' : 'text-emerald-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          {connected ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
            />
          )}
        </svg>
      </button>
      <span className="text-xs text-gray-500 font-medium">
        {connected ? (isSpeaking ? 'Olívia hovorí...' : 'Počúvam...') : 'Kliknite pre hlasový chat'}
      </span>
    </div>
  );
}
