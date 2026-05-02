// ElevenLabs Agent Config
export const ELEVENLABS_AGENT_ID = 'agent_0701kqfz32wpee39fymms1e3w24x';

// Verticals for demo
export const VERTICALS = [
  { id: 'autoservis', label: '🔧 Autoservis', demo: '/demos/autoservis.mp3' },
  { id: 'kadernictvo', label: '💇 Kaderníctvo', demo: '/demos/kadernictvo.mp3' },
  { id: 'zubár', label: '🦷 Zubár', demo: '/demos/zubar.mp3' },
  { id: 'fitness', label: '💪 Fitness', demo: '/demos/fitness.mp3' },
] as const;

// Pricing tiers
export const PRICING = [
  {
    tier: 'starter',
    price: '5 000',
    unit: 'Kč/mesiac',
    features: ['Voice agent', 'FAQ', '1 phone number', 'Denné reporty', 'Unlimited minutes*'],
    cta: 'Začať',
  },
  {
    tier: 'business',
    price: '10 000',
    unit: 'Kč/mesiac',
    features: ['Všetko zo Starter', 'Custom voice', 'Booking integrácia', 'SMS notifikácie', 'Knowledge base'],
    cta: 'Vybrať',
    popular: true,
  },
  {
    tier: 'premium',
    price: '20 000',
    unit: 'Kč/mesiac',
    features: ['Všetko z Business', 'Full custom integrácia', 'CRM napojenie', 'Multi-agent', 'Priority support'],
    cta: 'Kontakt',
  },
] as const;
