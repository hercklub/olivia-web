import { useState, useRef, useEffect } from 'react';
import type { ChatMessage, BusinessCard, AudioDemo, Testimonial } from '../types';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    text: 'Ahoj! 👋 Som Olívia, vaša AI recepcná. Môžem odpovedať na otázky vašich zákazníkov, dohodnúť termíny a zastúpiť vašu recepciu 24 hodín denne.',
    timestamp: Date.now() - 60000,
  },
  {
    id: '2',
    role: 'assistant',
    text: 'Pozrite si ako to funguje v praxi — povedzte mi o akej firmu ide a ja vám ukážem demo.',
    timestamp: Date.now() - 30000,
    businessCard: {
      name: 'Autoservis Kraus',
      industry: 'autoservis',
      phone: '+421 912 345 678',
      rating: 4.8,
      address: 'Hlavná 42, Bratislava',
      hours: 'Po-Pi: 7:00–18:00, So: 8:00–13:00',
    },
  },
  {
    id: '3',
    role: 'assistant',
    text: 'Počúnite si ukážku reálneho hovoru:',
    timestamp: Date.now() - 15000,
    audioDemo: {
      url: '/demos/autoservis.mp3',
      label: 'Demo hovor — Autoservis Kraus',
    },
  },
  {
    id: '4',
    role: 'assistant',
    text: '',
    timestamp: Date.now() - 10000,
    testimonial: {
      quote: '„Od kedy máme Olíviu, sme nezmeškali ani jeden hovor. Naši zákazníci sú nadšení."',
      author: 'Martin Kraus',
      company: 'Autoservis Kraus',
    },
  },
];

export function ChatContainer() {
  const [messages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <OliviaAvatar />}
      <div className={`max-w-[80%] space-y-3 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {message.text && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              isUser
                ? 'bg-emerald-500 text-white rounded-br-sm'
                : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
            }`}
          >
            {message.text}
          </div>
        )}
        {message.businessCard && <BusinessCardComponent card={message.businessCard} />}
        {message.audioDemo && <AudioPlayer demo={message.audioDemo} />}
        {message.testimonial && <TestimonialCard testimonial={message.testimonial} />}
      </div>
    </div>
  );
}

function OliviaAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
      O
    </div>
  );
}

function BusinessCardComponent({ card }: { card: BusinessCard }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full border border-gray-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{card.name}</h3>
          <p className="text-xs text-gray-500 capitalize">{card.industry}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-500 text-xs font-medium">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          {card.rating}
        </div>
      </div>
      <div className="space-y-1.5 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {card.address}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {card.hours}
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span className="text-emerald-600 font-medium">{card.phone}</span>
        </div>
      </div>
    </div>
  );
}

function AudioPlayer({ demo }: { demo: AudioDemo }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const onEnded = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const fmt = (s: number) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full border border-gray-100">
      <audio ref={audioRef} src={demo.url} preload="metadata" />
      <p className="text-xs text-gray-500 mb-3">{demo.label}</p>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shrink-0 transition-colors"
        >
          {playing ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
          ) : (
            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>
        <div className="flex-1">
          {/* Waveform visual */}
          <div className="flex items-end gap-[2px] h-8 mb-1">
            {Array.from({ length: 40 }).map((_, i) => {
              const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 20;
              const filled = (i / 40) * 100 < progress;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${filled ? 'bg-emerald-400' : 'bg-gray-200'}`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-gray-100 rounded-full cursor-pointer" onClick={seek}>
            <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span className="text-xs text-gray-400 tabular-nums w-12 text-right">
          {fmt(currentTime)}/{fmt(duration)}
        </span>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full border border-gray-100">
      <svg className="w-6 h-6 text-emerald-300 mb-2" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <p className="text-sm text-gray-700 italic leading-relaxed mb-3">{testimonial.quote}</p>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-300 to-emerald-300 flex items-center justify-center text-white text-xs font-bold">
          {testimonial.author.charAt(0)}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900">{testimonial.author}</p>
          <p className="text-xs text-gray-500">{testimonial.company}</p>
        </div>
      </div>
    </div>
  );
}
