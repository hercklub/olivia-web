import { ConversationProvider } from '@elevenlabs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Brandmark } from './components/Brandmark';
import { ThemeToggle } from './components/ThemeToggle';
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
import { useChat } from './hooks/useChat';
import { useOliviaAgent } from './hooks/useOliviaAgent';
import type { CallState, ChatMessage, Customer } from './types';

function ChatApp() {
  const { theme, toggle: toggleTheme } = useTheme();

  const [callOpen, setCallOpen] = useState(false);
  const [callState, setCallState] = useState<CallState>('connecting');
  const [callElapsed, setCallElapsed] = useState(0);
  const [muted, setMuted] = useState(false);

  const callStartRef = useRef(0);
  const callTimerRef = useRef<number | null>(null);
  const chatHandlersRef = useRef<{
    pushVoiceBot: (t: string) => void;
    pushVoiceUser: (t: string) => void;
    onCallEnded: () => void;
  } | null>(null);

  const agent = useOliviaAgent({
    onAgentMessage: (text) => chatHandlersRef.current?.pushVoiceBot(text),
    onUserMessage: (text) => chatHandlersRef.current?.pushVoiceUser(text),
  });

  // Map agent status/mode → call UI state
  useEffect(() => {
    if (!callOpen) return;
    if (agent.status === 'connecting') setCallState('connecting');
    else if (agent.status === 'connected') setCallState(agent.isSpeaking ? 'speaking' : 'listening');
    else if (agent.status === 'disconnected') {
      // session ended externally
      stopCall();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent.status, agent.isSpeaking, callOpen]);

  // Sync mute
  useEffect(() => {
    if (callOpen) agent.setMuted(muted);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted, callOpen]);

  const stopCall = useCallback(() => {
    if (callTimerRef.current) {
      window.clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    setCallOpen(false);
    setMuted(false);
    setCallElapsed(0);
    chatHandlersRef.current?.onCallEnded();
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
        try {
          await agent.startVoice();
        } catch (err) {
          console.error('[Olivia] Failed to start voice:', err);
          // surface error to user via end + post message
          stopCall();
        }
      },
      end: () => {
        agent.endSession();
        stopCall();
      },
    }),
    [callOpen, callState, callElapsed, muted, agent, stopCall],
  );

  const chat = useChat(callController);

  // Expose chat helpers to call layer via ref
  useEffect(() => {
    chatHandlersRef.current = {
      pushVoiceBot: chat.pushVoiceBot,
      pushVoiceUser: chat.pushVoiceUser,
      onCallEnded: chat.onCallEnded,
    };
  }, [chat.pushVoiceBot, chat.pushVoiceUser, chat.onCallEnded]);

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

  return (
    <>
      <Sky />
      <div className="app-shell">
        <header className="topbar">
          <Brandmark />
          <div className="top-meta">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        <main className="stage">
          <section className="chat-card">
            {chat.phoneOpen && <PhoneOverlay onClose={() => chat.setPhoneOpen(false)} />}

            <div className="chat-head">
              <div
                className={`avatar is-talking ${callOpen ? 'in-call call-' + callState : ''}`}
                aria-hidden="true"
              >
                <div className="mouth" />
                {callOpen && <span className="avatar-pulse" />}
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
                      if (callOpen) {
                        const text = chat.input.trim();
                        if (text) {
                          agent.sendUserMessage(text);
                          chat.setInput('');
                        }
                      } else {
                        chat.handleSend();
                      }
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
                  onClick={() => {
                    if (callOpen) {
                      const text = chat.input.trim();
                      if (text) {
                        agent.sendUserMessage(text);
                        chat.setInput('');
                      }
                    } else {
                      chat.handleSend();
                    }
                  }}
                  disabled={!chat.input.trim()}
                  aria-label="Odoslať"
                >
                  <Icons.Send />
                </button>
              </div>
              <div className="compose-hint">
                <span>
                  {callOpen
                    ? 'V živom hovore s Olíviou — môžete jej aj písať.'
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
