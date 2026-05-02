import { ConversationProvider } from '@elevenlabs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { type OliviaState } from './components/OliviaAvatar';
import { OliviaInteractive } from './components/OliviaInteractive';
import { ThemeToggle } from './components/ThemeToggle';
import { CallModeToggle } from './components/CallModeToggle';
import { Sky } from './components/Sky';
import { Icons } from './components/Icons';
import { Bubble, QuickReplies, Row, Typing } from './components/ChatPrimitives';
import { AudioPlayer } from './components/AudioPlayer';
import { Pricing } from './components/Pricing';
import { Calendar } from './components/Calendar';
import { PhoneOverlay } from './components/PhoneOverlay';
import { Booked } from './components/Booked';
import { FAQ } from './components/FAQ';
import { CustomerCard, CustomerPreview, CustomerQuote } from './components/CustomerCards';
import { CUSTOMERS, FAQ as FAQ_ITEMS } from './data/flow';
import { useTheme } from './hooks/useTheme';
import { useCallMode } from './hooks/useCallMode';
import { useChat } from './hooks/useChat';
import { useOliviaAgent } from './hooks/useOliviaAgent';
import type { CallState, ChatMessage, Customer } from './types';

type DemoStep = [number, () => void];

function callStateToOlivia(s: CallState): OliviaState {
  if (s === 'connecting') return 'wave';
  if (s === 'thinking') return 'thinking';
  if (s === 'speaking') return 'speaking';
  return 'listening';
}

function ChatApp() {
  const { theme, toggle: toggleTheme } = useTheme();
  const { live: liveMode, toggle: toggleLiveMode, devMode } = useCallMode();

  const [callOpen, setCallOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>('connecting');
  const [callElapsed, setCallElapsed] = useState(0);
  const [muted, setMuted] = useState(false);

  const callStartRef = useRef(0);
  const callTimerRef = useRef<number | null>(null);
  const demoTimersRef = useRef<number[]>([]);
  const wasConnectedRef = useRef(false);
  const prevStatusRef = useRef<string>('disconnected');
  const chatHandlersRef = useRef<{
    pushVoiceBot: (t: string) => void;
    pushVoiceUser: (t: string) => void;
    onCallEnded: () => void;
    onCallFailed: () => void;
  } | null>(null);

  const agent = useOliviaAgent({
    onAgentMessage: (text) => chatHandlersRef.current?.pushVoiceBot(text),
    onUserMessage: (text) => chatHandlersRef.current?.pushVoiceUser(text),
  });

  const cancelDemoTimeline = useCallback(() => {
    demoTimersRef.current.forEach((t) => window.clearTimeout(t));
    demoTimersRef.current = [];
  }, []);

  const stopCall = useCallback(
    (reason: 'ended' | 'failed' = 'ended') => {
      if (callTimerRef.current) {
        window.clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      cancelDemoTimeline();
      wasConnectedRef.current = false;
      prevStatusRef.current = 'disconnected';
      setCallOpen(false);
      setMuted(false);
      setCallElapsed(0);
      if (reason === 'failed') chatHandlersRef.current?.onCallFailed();
      else chatHandlersRef.current?.onCallEnded();
    },
    [cancelDemoTimeline],
  );

  // Live mode: map agent status → call UI state. Distinguishes "never
  // connected → disconnected" (failed) from "connected → disconnected" (ended).
  useEffect(() => {
    if (!callOpen || !liveMode) {
      prevStatusRef.current = 'disconnected';
      wasConnectedRef.current = false;
      return;
    }
    const prev = prevStatusRef.current;
    prevStatusRef.current = agent.status;

    if (agent.status === 'connecting') {
      setCallState('connecting');
    } else if (agent.status === 'connected') {
      wasConnectedRef.current = true;
      setCallState(agent.isSpeaking ? 'speaking' : 'listening');
    } else if (agent.status === 'disconnected' && prev !== 'disconnected') {
      stopCall(wasConnectedRef.current ? 'ended' : 'failed');
    }
  }, [agent.status, agent.isSpeaking, callOpen, liveMode, stopCall]);

  // Sync mute (live only, and only when SDK actually has a session)
  useEffect(() => {
    if (callOpen && liveMode && agent.status === 'connected') {
      agent.setMuted(muted);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, callOpen, liveMode, agent.status]);

  const runDemoTimeline = useCallback(() => {
    const setStateAt = (s: CallState) => setCallState(s);
    const pushBot = (text: string) => chatHandlersRef.current?.pushVoiceBot(text);
    const pushUser = (text: string) => chatHandlersRef.current?.pushVoiceUser(text);

    const steps: DemoStep[] = [
      [1000, () => setStateAt('speaking')],
      [1100, () => pushBot('Dobrý deň, ja som Olívia. Ako vám môžem pomôcť?')],
      [4200, () => setStateAt('listening')],
      [6200, () => setStateAt('thinking')],
      [6400, () => pushUser('Otvárate aj cez víkend?')],
      [7300, () => setStateAt('speaking')],
      [7400, () => pushBot('Áno, v sobotu od 9 do 14. V nedeľu máme zatvorené.')],
      [10500, () => setStateAt('listening')],
      [12500, () => setStateAt('thinking')],
      [12700, () => pushUser('Super, koľko stojí mesačne?')],
      [13500, () => setStateAt('speaking')],
      [
        13700,
        () =>
          pushBot('Tri balíčky — Starter za 5 000 Kč, Business za 10 000 a Premium za 20 000.'),
      ],
      [17500, () => setStateAt('listening')],
    ];

    demoTimersRef.current = steps.map(([t, fn]) => window.setTimeout(fn, t));
  }, []);

  const callController = useMemo(
    () => ({
      open: callOpen,
      state: callState,
      elapsed: callElapsed,
      muted,
      toggleMute: () => setMuted((m) => !m),
      start: async () => {
        setCallOpen(true);
        setMuted(false);
        setCallState('connecting');
        callStartRef.current = Date.now();
        if (callTimerRef.current) window.clearInterval(callTimerRef.current);
        callTimerRef.current = window.setInterval(() => {
          setCallElapsed(Math.floor((Date.now() - callStartRef.current) / 1000));
        }, 1000);

        if (liveMode) {
          try {
            await agent.startVoice();
          } catch (err) {
            console.error('[Olivia] Failed to start voice:', err);
            stopCall('failed');
          }
        } else {
          runDemoTimeline();
        }
      },
      end: () => {
        if (liveMode) agent.endSession();
        stopCall();
      },
    }),
    [callOpen, callState, callElapsed, muted, agent, stopCall, liveMode, runDemoTimeline],
  );

  const chat = useChat(callController);

  // Expose chat helpers to call layer via ref
  useEffect(() => {
    chatHandlersRef.current = {
      pushVoiceBot: chat.pushVoiceBot,
      pushVoiceUser: chat.pushVoiceUser,
      onCallEnded: chat.onCallEnded,
      onCallFailed: chat.onCallFailed,
    };
  }, [chat.pushVoiceBot, chat.pushVoiceUser, chat.onCallEnded, chat.onCallFailed]);

  // Auto-scroll
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [chat.messages, chat.typing, chat.activeQuick]);

  const renderMessage = (msg: ChatMessage, idx: number, all: ChatMessage[]) => {
    const prev = all[idx - 1];
    const isFirst = !prev || prev.side !== msg.side;

    if (msg.kind === 'text') {
      return (
        <Row key={msg.key} side={msg.side} first={isFirst} voice={msg.voice}>
          <Bubble>{msg.content}</Bubble>
        </Row>
      );
    }
    if (msg.kind === 'customers-intro') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {CUSTOMERS.map((c) => (
              <CustomerPreview
                key={c.id}
                customer={c}
                onPick={() =>
                  chat.handleQuick({ id: c.id, label: `Pustite ${c.businessName}` })
                }
              />
            ))}
          </div>
        </Row>
      );
    }
    if (msg.kind === 'customer-detail') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%' }}>
            <CustomerCard customer={msg.payload as Customer} />
          </div>
        </Row>
      );
    }
    if (msg.kind === 'customer-quote') {
      return (
        <Row key={msg.key} side="user" first={isFirst}>
          <CustomerQuote customer={msg.payload as Customer} />
        </Row>
      );
    }
    if (msg.kind === 'faq') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%' }}>
            <FAQ items={FAQ_ITEMS} />
          </div>
        </Row>
      );
    }
    if (msg.kind === 'audio') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ maxWidth: '78%', width: '100%' }}>
            <AudioPlayer caption={(msg.payload as { caption?: string })?.caption} duration={28} />
          </div>
        </Row>
      );
    }
    if (msg.kind === 'pricing') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%', paddingTop: 8 }}>
            <Pricing onPick={chat.handlePricingPick} />
          </div>
        </Row>
      );
    }
    if (msg.kind === 'calendar') {
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%', maxWidth: '88%' }}>
            <Calendar onBook={chat.handleBook} />
          </div>
        </Row>
      );
    }
    if (msg.kind === 'booked') {
      const p = msg.payload as { date: string; time: string };
      return (
        <Row key={msg.key} side="bot" first={isFirst}>
          <div style={{ width: '100%', maxWidth: '78%' }}>
            <Booked date={p.date} time={p.time} />
          </div>
        </Row>
      );
    }
    return null;
  };

  const stateLabel: Record<CallState, string> = {
    connecting: 'Pripájam…',
    listening: 'Počúvam',
    speaking: 'Hovorím',
    thinking: 'Premýšľam…',
  };

  const sendDuringCall = () => {
    const text = chat.input.trim();
    if (!text) return;
    if (liveMode) agent.sendUserMessage(text);
    chat.handleSend();
  };

  return (
    <>
      <Sky />
      <div className="app-shell">
        <header className="topbar">
          <div className="top-meta">
            {devMode && <CallModeToggle live={liveMode} onToggle={toggleLiveMode} />}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        <main className="stage">
          <section className="chat-card">
            {chat.phoneOpen && <PhoneOverlay onClose={() => chat.setPhoneOpen(false)} />}

            <div className="chat-head">
              <div className="chat-head-avatar">
                <OliviaInteractive
                  baseState={callOpen ? (callStateToOlivia(callState) as OliviaState) : 'idle'}
                  theme={theme === 'night' ? 'dark' : 'light'}
                  size={96}
                  interactive={!callOpen}
                />
              </div>
              <div className="head-meta">
                <div className="head-name">Olívia</div>
                <div className="head-status">
                  {callOpen ? (
                    <>
                      {callState === 'connecting' ? (
                        <span className="call-spinner" />
                      ) : (
                        <span className={`call-dot state-${callState}`} />
                      )}
                      <span className="head-status-label">{stateLabel[callState]}</span>
                    </>
                  ) : (
                    <>
                      <span className="live-dot" />
                      AI recepčná
                    </>
                  )}
                </div>
              </div>
              <div className="head-actions">
                {callOpen ? (
                  <span className="head-time mono">
                    {`${Math.floor(callElapsed / 60)}:${String(callElapsed % 60).padStart(2, '0')}`}
                  </span>
                ) : (
                  <button
                    className="head-call"
                    onClick={() => callController.start()}
                    aria-label="Zavolať Olívii"
                  >
                    <Icons.PhoneCall />
                    <span>Zavolať</span>
                  </button>
                )}
              </div>
            </div>

            <div className="messages" ref={messagesRef}>
              {chat.messages.map((m, i) => renderMessage(m, i, chat.messages))}
              {chat.typing && <Typing />}
              {chat.activeQuick && !chat.typing && !callOpen && (
                <QuickReplies options={chat.activeQuick} onPick={chat.handleQuick} />
              )}
              <div style={{ height: 8 }} />
            </div>

            <div className="composer">
              <div className={`compose-row ${callOpen ? 'in-call' : ''}`}>
                <input
                  type="text"
                  placeholder={
                    callOpen
                      ? 'Píšte aj počas hovoru…'
                      : 'Napíšte čokoľvek alebo si vyberte vyššie…'
                  }
                  value={chat.input}
                  onChange={(e) => chat.setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (callOpen) sendDuringCall();
                      else chat.handleSend();
                    }
                  }}
                />
                {callOpen ? (
                  <>
                    <button
                      className={`mic-btn mute-btn ${muted ? 'muted' : ''}`}
                      onClick={() => setMuted((m) => !m)}
                      aria-label={muted ? 'Zapnúť mikrofón' : 'Stíšiť mikrofón'}
                      title={muted ? 'Zapnúť' : 'Stíšiť'}
                    >
                      {muted ? <Icons.MicOff /> : <Icons.Mic />}
                    </button>
                    <button
                      className="end-call-btn"
                      onClick={() => callController.end()}
                      aria-label="Ukončiť hovor"
                      title="Ukončiť hovor"
                    >
                      <Icons.PhoneEnd />
                    </button>
                  </>
                ) : (
                  <button
                    className="mic-btn"
                    onClick={() => callController.start()}
                    aria-label="Spustiť hovor s Olíviou"
                    title="Hovor s Olíviou"
                  >
                    <Icons.PhoneCall />
                  </button>
                )}
                <button
                  className="send-btn"
                  onClick={() => (callOpen ? sendDuringCall() : chat.handleSend())}
                  disabled={!chat.input.trim()}
                  aria-label="Odoslať"
                >
                  <Icons.Send />
                </button>
              </div>
              <div className="compose-hint">
                <span>
                  {callOpen
                    ? liveMode
                      ? 'V živom hovore s Olíviou — môžete jej aj písať.'
                      : 'Demo hovor — UI ukážka, žiadny reálny audio.'
                    : 'Olívia je AI demo — skúšajte čo chcete.'}
                </span>
                <span>
                  <span className="kbd">Enter</span> odoslať
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <ConversationProvider>
      <ChatApp />
    </ConversationProvider>
  );
}
