export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  businessCard?: BusinessCard;
  audioDemo?: AudioDemo;
  testimonial?: Testimonial;
}

export interface BusinessCard {
  name: string;
  industry: string;
  phone: string;
  rating: number;
  address: string;
  hours: string;
}

export interface AudioDemo {
  url: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  company: string;
}
