import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CUSTOMERS,
  FALLBACK_BOT,
  FALLBACK_QUICK,
  HOW_IT_WORKS_BOT,
  HOW_IT_WORKS_QUICK,
  POST_CALL_QUICK,
  POST_CUSTOMER_QUICK,
  POST_FAQ_QUICK,
  PRICING_INTRO_BOT,
  RESTART_QUICK,
  WELCOME_BOT,
  WELCOME_QUICK,
  BOOKING_QUICK,
} from '../data/flow';
import type { CallState, ChatMessage, Customer, MessageKind, PriceTier, QuickReply } from '../types';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

interface CallController {
  start: () => void;
  end: () => void;
  state: CallState;
  elapsed: number;
  open: boolean;
  muted: boolean;
  toggleMute: () => void;
}

export function useChat(call: CallController) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [activeQuick, setActiveQuick] = useState<QuickReply[] | null>(null);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [input, setInput] = useState('');
  const keyRef = useRef(0);
  const k = () => ++keyRef.current;

  const pushBotText = useCallback(
    async (content: string, opts: { delay?: number; after?: number; voice?: boolean } = {}) => {
      setTyping(true);
      await wait(opts.delay ?? 700);
      setTyping(false);
      setMessages((m) => [
        ...m,
        { side: 'bot', kind: 'text', content, key: k(), voice: opts.voice },
      ]);
      await wait(opts.after ?? 280);
    },
    [],
  );

  const pushUser = useCallback((content: string, voice = false) => {
    setMessages((m) => [...m, { side: 'user', kind: 'text', content, key: k(), voice }]);
  }, []);

  const pushBotComponent = useCallback(
    async (kind: MessageKind, payload: unknown = null, delay = 600) => {
      setTyping(true);
      await wait(delay);
      setTyping(false);
      setMessages((m) => [...m, { side: 'bot', kind, payload, key: k() }]);
    },
    [],
  );

  // Welcome flow on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await wait(450);
      if (cancelled) return;
      for (const item of WELCOME_BOT) {
        if (cancelled) return;
        await pushBotText(item.content);
      }
      if (cancelled) return;
      setActiveQuick(WELCOME_QUICK);
      await wait(120);
      setMessages((m) => [...m, { side: 'bot', kind: 'customers-intro', key: k() }]);
    })();
    return () => {
      cancelled = true;
    };
  }, [pushBotText]);

  const handleQuick = useCallback(
    async (opt: QuickReply) => {
      setActiveQuick(null);
      pushUser(opt.label);

      if (opt.id === 'call') {
        call.start();
        return;
      }
      if (opt.id === 'pricing') {
        for (const item of PRICING_INTRO_BOT) await pushBotText(item.content);
        await pushBotComponent('pricing', null, 400);
        return;
      }
      if (opt.id === 'how') {
        for (const item of HOW_IT_WORKS_BOT) await pushBotText(item.content);
        setActiveQuick(HOW_IT_WORKS_QUICK);
        return;
      }
      if (opt.id === 'demo') {
        await pushBotText('Vyberte si firmu — pustím reálny hovor.');
        setMessages((m) => [...m, { side: 'bot', kind: 'customers-intro', key: k() }]);
        return;
      }
      if (opt.id === 'faq') {
        await pushBotText('Pýtajú sa to skoro všetci. Tu sú najčastejšie obavy:');
        setMessages((m) => [...m, { side: 'bot', kind: 'faq', key: k() }]);
        setActiveQuick(POST_FAQ_QUICK);
        return;
      }
      if (opt.id === 'book') {
        await pushBotText('Tu sú voľné termíny:');
        await pushBotComponent('calendar', null, 400);
        return;
      }
      if (opt.id === 'restart') {
        await pushBotText('Smelo do toho — čo vás zaujíma?');
        setActiveQuick(RESTART_QUICK);
        return;
      }

      const cust = CUSTOMERS.find((c) => c.id === opt.id);
      if (cust) {
        await pushBotComponent('customer-detail', cust, 700);
        await pushBotText(cust.audioReply, { delay: 1100 });
        setMessages((m) => [...m, { side: 'bot', kind: 'customer-quote', payload: cust, key: k() }]);
        setActiveQuick(POST_CUSTOMER_QUICK);
      }
    },
    [call, pushBotComponent, pushBotText, pushUser],
  );

  const handlePricingPick = useCallback(
    async (tier: PriceTier) => {
      pushUser(`Vybral som ${tier.name}`);
      setMessages((m) => m.filter((x) => x.kind !== 'pricing'));
      await pushBotText(
        `Skvelá voľba — ${tier.name}. Posledný krok: vyberte si termín 15-min hovoru s Lubošom (zakladateľ).`,
      );
      await pushBotComponent('calendar', null, 400);
    },
    [pushBotComponent, pushBotText, pushUser],
  );

  const handleBook = useCallback(
    async ({ date, time }: { date: string; time: string }) => {
      pushUser(`${date} o ${time}`);
      setMessages((m) => m.filter((x) => x.kind !== 'calendar'));
      await pushBotComponent('booked', { date, time }, 500);
      await pushBotText(`Hotovo. Stretneme sa ${date} o ${time}.`);
      await pushBotText('Pošlem vám pripomienku 1 hodinu vopred. Tešíme sa! 🎉');
      setActiveQuick(BOOKING_QUICK);
    },
    [pushBotComponent, pushBotText, pushUser],
  );

  const handleSend = useCallback(async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    pushUser(text, call.open);
    setActiveQuick(null);

    const t = text.toLowerCase();
    if (/cena|kolko|stoj|cenn/i.test(t)) {
      for (const item of PRICING_INTRO_BOT) await pushBotText(item.content);
      await pushBotComponent('pricing', null, 400);
    } else if (/funguj|ako|setup|nasaden/i.test(t)) {
      for (const item of HOW_IT_WORKS_BOT) await pushBotText(item.content);
      setActiveQuick(HOW_IT_WORKS_QUICK);
    } else if (/obav|stra|bezpec|bezpeč|gdpr|nárec|narec|dialekt|zlyha|zasekn|nasta|nasadi|záväz|zavaz|vypn|zruš|zrus/i.test(t)) {
      await pushBotText('Pýtajú sa to skoro všetci. Tu sú najčastejšie obavy:');
      setMessages((m) => [...m, { side: 'bot', kind: 'faq', key: k() }]);
    } else if (/demo|skús|skus|ukáz|klient|referen/i.test(t)) {
      await pushBotText('Vyberte si firmu — pustím reálny hovor.');
      setMessages((m) => [...m, { side: 'bot', kind: 'customers-intro', key: k() }]);
    } else if (/zavola|telefón|telefon|cislo|číslo/i.test(t)) {
      setPhoneOpen(true);
    } else if (/termín|termin|stretnutie|kalendár/i.test(t)) {
      await pushBotText('Hneď to máme:');
      await pushBotComponent('calendar', null, 400);
    } else {
      for (const item of FALLBACK_BOT) await pushBotText(item.content);
      setActiveQuick(FALLBACK_QUICK);
    }
  }, [call.open, input, pushBotComponent, pushBotText, pushUser]);

  const onCallEnded = useCallback(async () => {
    await pushBotText(
      'To bola Olívia v reálnom čase. Tak isto bude hovoriť aj s vašimi klientmi.',
      { delay: 700 },
    );
    setActiveQuick(POST_CALL_QUICK);
  }, [pushBotText]);

  const pushVoiceBot = useCallback((content: string) => {
    setMessages((m) => [...m, { side: 'bot', kind: 'text', content, key: k(), voice: true }]);
  }, []);
  const pushVoiceUser = useCallback((content: string) => {
    setMessages((m) => [...m, { side: 'user', kind: 'text', content, key: k(), voice: true }]);
  }, []);

  return {
    messages,
    typing,
    activeQuick,
    phoneOpen,
    setPhoneOpen,
    input,
    setInput,
    handleQuick,
    handlePricingPick,
    handleBook,
    handleSend,
    onCallEnded,
    pushVoiceBot,
    pushVoiceUser,
    appendCustomer: (c: Customer) => c,
  };
}
