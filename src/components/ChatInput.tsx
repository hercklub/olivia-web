import { useOliviaAgent } from '../hooks/useOliviaAgent';

const QUICK_REPLIES = [
  'Koľko to stojí?',
  'Iná firma',
  'Zavolajte mi',
];

export function ChatInput() {
  const { sendText, status } = useOliviaAgent();
  const connected = status === 'connected';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const text = input.value.trim();
    if (!text) return;
    sendText(text);
    input.value = '';
  };

  const handleQuickReply = (text: string) => {
    sendText(text);
  };

  return (
    <div className="border-t border-gray-100 bg-white/80 backdrop-blur-sm">
      {/* Quick replies */}
      <div className="flex gap-2 px-4 pt-3 overflow-x-auto">
        {QUICK_REPLIES.map((reply) => (
          <button
            key={reply}
            onClick={() => handleQuickReply(reply)}
            className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input + call */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <input
          name="message"
          type="text"
          placeholder={connected ? 'Napíšte správu...' : 'Začnite konverzáciu hore...'}
          className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
          autoComplete="off"
        />
        <button
          type="submit"
          className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
        <a
          href="tel:+421912345678"
          className="w-10 h-10 rounded-full bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center shrink-0 transition-colors"
          title="Zavolať"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      </form>
    </div>
  );
}
