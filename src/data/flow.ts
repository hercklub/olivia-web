import type { Customer, FaqItem, PriceTier, QuickReply } from '../types';

export const WELCOME_BOT: { content: string }[] = [
  { content: '👋 Ahoj, som Olívia.' },
  { content: 'Som AI agent, ktorá odpovedá na hovory pre firmy. Nikdy nezaspím, neunavím sa, neurazím klienta.' },
  { content: 'Vyskúšaj ma — alebo si vypočuj, ako hovorím u reálnych klientov.' },
];

export const WELCOME_QUICK: QuickReply[] = [
  { id: 'call', emoji: '📞', label: 'Zavolaj mi na demo', variant: 'primary' },
  { id: 'pricing', emoji: '💸', label: 'Koľko to stojí?' },
  { id: 'faq', emoji: '🤔', label: 'Mám obavy' },
  { id: 'how', label: 'Ako to funguje?' },
];

export const FAQ: FaqItem[] = [
  {
    id: 'fail',
    q: 'Čo keď Olívia nevie odpovedať?',
    a: 'Eskaluje na vás. Olívia rozpozná, že situácia je mimo jej kompetencie a buď prepojí hovor priamo na váš mobil, alebo zoberie kontakt a pošle vám SMS s odkazom. Klient sa nikdy nedostane do slepej uličky.',
  },
  {
    id: 'setup',
    q: 'Ako rýchlo to viem nasadiť?',
    a: 'Spustenie do 48 hodín. Stačí jeden 30-minútový hovor so mnou (Lubošom) — prejdeme čo robíte, časté otázky, postup pri rezervácii. Olívia sa to naučí, ja vám prepojím firemné číslo a hotovo.',
  },
  {
    id: 'cancel',
    q: 'Mám záväzok? Môžem to vypnúť?',
    a: 'Žiadny záväzok. Mesačná platba, môžete kedykoľvek vypnúť. Prvých 14 dní je navyše bez rizika — ak vám to neklikne, vrátim peniaze.',
  },
  {
    id: 'voice',
    q: 'Rozumie aj nárečiam a starším klientom?',
    a: 'Áno. Olívia je trénovaná na slovenskej a českej reči vrátane východniarskeho a záhoráckeho dialektu. Ak klient hovorí veľmi neštandardne, požiada o zopakovanie — rovnako ako človek.',
  },
  {
    id: 'security',
    q: 'Čo sa deje s nahrávkami a dátami?',
    a: 'Hovory sú šifrované, uložené v EÚ (GDPR-compliant). Nahrávky vidíte len vy v admin paneli, ja k nim nemám prístup. Mažú sa po 30 dňoch alebo kedykoľvek na žiadosť klienta.',
  },
  {
    id: 'cost-fail',
    q: 'Čo keď ma to vyjde drahšie ako recepčná?',
    a: 'Olívia je 24/7 za cenu pár hodín recepčnej. Ak vám aspoň 2× mesačne zachytí hovor po 17:00 alebo cez víkend, ktorý by ste inak stratili — vrátila sa investícia.',
  },
];

export const CUSTOMERS: Customer[] = [
  {
    id: 'salon-marta',
    vertical: 'kadernictvo',
    businessName: 'Salón Marta',
    ownerName: 'Marta Hrivnáková',
    location: 'Bratislava',
    tagline: 'Dámske kaderníctvo · 2 stoličky',
    tone: 'lime',
    initials: 'SM',
    stat: '47 zachytených hovorov',
    statSub: 'a 12 nových rezervácií za prvý mesiac',
    caption: 'Olívia rezervuje strih · 0:28',
    audioReply:
      'Klientka volala v stredu o 19:42 — po pracovnej dobe. Olívia ponúkla termín, potvrdila ho a poslala SMS pripomienku. Bez ľudského zásahu.',
    quote:
      'Predtým mi po piatej hodine odchádzali objednávky ku konkurencii. Teraz mi Olívia dvíha aj v sobotu večer.',
  },
  {
    id: 'dental-kovac',
    vertical: 'zubar',
    businessName: 'Dentál Kováč',
    ownerName: 'MUDr. Peter Kováč',
    location: 'Košice',
    tagline: 'Zubná ambulancia',
    tone: 'sky',
    initials: 'DK',
    stat: '0 zmeškaných akútnych volaní',
    statSub: 'pohotovosť triedi sama, recepcia má pokoj',
    caption: 'Akútna bolesť o 22:14 · 0:34',
    audioReply:
      'Olívia rozpoznala akútny prípad, presmerovala pacienta na pohotovosť a rezervovala kontrolu na ráno o 8:00.',
    quote: 'Recepčná už nedvíha hovory po pracovnej dobe. A pacienti to ani nevedia rozoznať.',
  },
  {
    id: 'gymhouse',
    vertical: 'fitness',
    businessName: 'GymHouse',
    ownerName: 'Tomáš Mišík',
    location: 'Žilina',
    tagline: 'Fitness centrum',
    tone: 'sand',
    initials: 'GH',
    stat: '+18 % nových členov',
    statSub: 'záujemcovia dostanú odpoveď do 2 sekúnd, nie do 2 dní',
    caption: 'Cena permanentky · 0:47',
    audioReply:
      'Olívia odpovedala na tarify, poslala link na registráciu a pridala kontakt do CRM. Hovor trval 47 sekúnd.',
    quote:
      'Predtým mi ľudia písali na Instagram a ja som odpovedal o tri dni. Teraz mám booking ešte v ten istý večer.',
  },
  {
    id: 'autoservis-kraus',
    vertical: 'autoservis',
    businessName: 'Autoservis Kraus',
    ownerName: 'Roman Kraus',
    location: 'Trnava',
    tagline: 'Mechanika · pneuservis',
    tone: 'mint',
    initials: 'AK',
    stat: '~12 hodín mesačne',
    statSub: 'už nemusím dvíhať pri aute alebo na obede',
    caption: 'Hlásenie poruchy · 0:39',
    audioReply:
      'Olívia identifikovala typ závady, ponúkla najbližší voľný termín a poslala adresu servisu cez SMS.',
    quote: 'Najlepšia investícia od pneudvíhača. Olívia mi šetrí pol dňa týždenne.',
  },
];

export const PRICE_TIERS: PriceTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: '5 000',
    features: ['FAQ + telefón 24/7', 'Týždenné reporty', 'SK + EN jazyk', 'Do 200 hovorov/mes.'],
  },
  {
    id: 'business',
    name: 'Business',
    price: '10 000',
    featured: true,
    badge: 'Najobľúbenejšie',
    features: ['Všetko zo Starter', 'Vlastný hlas + meno', 'Online booking', 'Do 1 000 hovorov/mes.'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '20 000',
    features: ['Plná AI integrácia', 'CRM + kalendár sync', 'Bez limitu hovorov', 'Dedikovaný support'],
  },
];

export const HOW_IT_WORKS_BOT: { content: string }[] = [
  { content: 'Veľmi jednoducho:' },
  {
    content:
      '1️⃣ Pripojím sa na vašu firemnú linku.\n2️⃣ Naučím sa všetko o vašej firme za 1 deň.\n3️⃣ Začnem dvíhať telefóny — aj o 23:47 v sobotu.',
  },
  { content: 'Žiadny hardware. Žiadna inštalácia. Spustenie za 48 hodín.' },
];

export const HOW_IT_WORKS_QUICK: QuickReply[] = [
  { id: 'pricing', emoji: '💸', label: 'OK, koľko to stojí?', variant: 'primary' },
  { id: 'demo', emoji: '🎧', label: 'Skúsim demo' },
  { id: 'faq', emoji: '🤔', label: 'Mám obavy' },
];

export const PRICING_INTRO_BOT = [{ content: 'Tri balíčky. Bez záväzku, mesačne.' }];

export const FALLBACK_BOT = [
  { content: 'Skvelá otázka. Ľudská verzia mňa (Luboš) vám zavolá späť.' },
  { content: 'Nechajte mi číslo, alebo si rovno vyberte termín.' },
];

export const FALLBACK_QUICK: QuickReply[] = [
  { id: 'book', emoji: '📅', label: 'Vybrať termín', variant: 'primary' },
  { id: 'call', emoji: '📞', label: 'Zavolajte mi' },
];

export const RESTART_QUICK: QuickReply[] = [
  { id: 'pricing', emoji: '💸', label: 'Koľko to stojí?' },
  { id: 'how', label: 'Ako to funguje?' },
  { id: 'demo', emoji: '🎧', label: 'Pustite mi demo' },
  { id: 'faq', emoji: '🤔', label: 'Mám obavy' },
];

export const POST_CUSTOMER_QUICK: QuickReply[] = [
  { id: 'pricing', emoji: '💸', label: 'Koľko to stojí?', variant: 'primary' },
  { id: 'demo', emoji: '🎧', label: 'Iná firma' },
  { id: 'faq', emoji: '🤔', label: 'Mám obavy' },
  { id: 'call', emoji: '📞', label: 'Zavolajte mi' },
];

export const POST_FAQ_QUICK: QuickReply[] = [
  { id: 'call', emoji: '📞', label: 'Zavolajte mi', variant: 'primary' },
  { id: 'pricing', emoji: '💸', label: 'Cenník' },
  { id: 'demo', emoji: '🎧', label: 'Pustite demo' },
];

export const POST_CALL_QUICK: QuickReply[] = [
  { id: 'pricing', emoji: '💸', label: 'Koľko to stojí?', variant: 'primary' },
  { id: 'how', label: 'Ako to funguje?' },
  { id: 'faq', emoji: '🤔', label: 'Mám obavy' },
];

export const BOOKING_QUICK: QuickReply[] = [
  { id: 'restart', label: 'Spýtam sa ešte niečo' },
  { id: 'call', emoji: '📞', label: 'Radšej zavolajte' },
];
