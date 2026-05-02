import { ChatContainer } from './components/ChatContainer';
import { ChatInput } from './components/ChatInput';
import { VoiceButton } from './components/VoiceButton';

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-teal-50 to-sky-50">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-sm border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            O
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Olívia</h1>
            <p className="text-xs text-emerald-500 font-medium">AI recepcná • Online</p>
          </div>
        </div>
        <a
          href="tel:+421912345678"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Zavolať
        </a>
      </header>

      {/* Voice hero */}
      <div className="flex justify-center py-6 bg-white/30">
        <VoiceButton />
      </div>

      {/* Chat area */}
      <ChatContainer />

      {/* Input */}
      <ChatInput />
    </div>
  );
}

export default App;
