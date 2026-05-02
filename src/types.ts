export type CallState = 'connecting' | 'listening' | 'speaking' | 'thinking';

export type Tone = 'lime' | 'sky' | 'sand' | 'mint';

export interface Customer {
  id: string;
  vertical: string;
  businessName: string;
  ownerName: string;
  location: string;
  tagline: string;
  tone: Tone;
  initials: string;
  stat: string;
  statSub: string;
  caption: string;
  audioReply: string;
  quote: string;
}

export interface PriceTier {
  id: string;
  name: string;
  price: string;
  featured?: boolean;
  badge?: string;
  features: string[];
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
}

export interface QuickReply {
  id: string;
  emoji?: string;
  label: string;
  variant?: 'primary' | 'dark';
}

export type MessageKind =
  | 'text'
  | 'customers-intro'
  | 'customer-detail'
  | 'customer-quote'
  | 'faq'
  | 'audio'
  | 'pricing'
  | 'calendar'
  | 'booked';

export interface ChatMessage {
  key: number;
  side: 'bot' | 'user';
  kind: MessageKind;
  content?: string;
  voice?: boolean;
  payload?: unknown;
}
