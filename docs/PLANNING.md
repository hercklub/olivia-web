# Olivia AI — Project Planning

> Master strategic plan a TODO. Aktualizované 2026-05-03.

## Stack & deploy

- **Frontend**: `olivia-web` (Vite + React + Tailwind) → Vercel → `olivia.lubos.app`
- **Backend**: `olivia-api` (Hono + Drizzle + Postgres) → Railway → `api.olivia.lubos.app`
- **AI**: ElevenLabs Conversational AI (agent `agent_0701kqfz32wpee39fymms1e3w24x`)
- **Connection**: WebSocket (WebRTC zatiaľ nefunguje na ElevenLabs LiveKit setup)
- **DNS**: Cloudflare (`lubos.app` zone, gray cloud / DNS only)

## Status (snapshot)

✅ **Live a funguje:**
- Olivia landing page (chat-as-page dizajn, Sky/Night theme, FAQ, customer cards, pricing, calendar UI)
- ElevenLabs voice call cez WebSocket s real-time transcripts v chate
- Demo/Naživo toggle za `?dev=1` (default Live v produkcii)
- `book_appointment` server tool end-to-end (ElevenLabs → backend → Postgres + audit log + auth header)
- Dynamic variables injektnú current date → agent nehalucinuje dátumy
- Backend zod guard proti minulým dátumom

🟡 **Polovičato:**
- Booking sa zapisuje len do nášho Postgres, nie do reálneho kalendára
- Frontend Calendar je stále fake (nevolá API)
- Žiadny `get_availability` tool — agent ponúka časy "naslepo"

❌ **Ešte sa nezačalo:**
- Multi-tenant calendar architektúra (Google / Outlook / industry systems)
- Luboš founder section (boutique agency angle)
- ROI kalkulačka v chate
- Real audio nahrávky (4× pilot client)
- SMS reminders (Twilio integration)

---

## 🎯 Active sprint (next)

Po jednotlivých malých blokoch:

### Sprint A: Calendar integration (priorita 1)
- [ ] **Rozhodnutie**: calendar adapter pattern (multi-provider) namiesto Calendly only — viď [Strategic decisions](#strategic-decisions)
- [ ] **MVP s Google Calendar** ako prvý adapter
  - Google Cloud Console: OAuth 2.0 client, redirect URI
  - Backend: `/auth/google/start` + `/auth/google/callback` endpoints
  - Refresh token storage v `tenants.config.calendar.google.refresh_token`
- [ ] **Refactor `book_appointment`**: loadne tenant → resolne calendar adapter → vytvorí real event
- [ ] **Nový server tool `get_availability`**: query free/busy z tenant kalendára → vráti zoznam slotov
- [ ] **Update agent system prompt**: pred booking vždy `get_availability` najprv

### Sprint B: Frontend napojenie na backend
- [ ] `apiClient.ts` (Hono RPC alebo plain fetch)
- [ ] `Calendar` komponent volá real API namiesto fake confirm
- [ ] Po booking pošli ElevenLabs `sendContextualUpdate` ("klient potvrdil cez kalendár")
- [ ] Error handling (slot už zabraný, agent offline, atď.)

### Sprint C: Conversion levers (Luboš sekcia + ROI calc)
- [ ] **Luboš founder section** — quick reply "Kto za tým stojí?" → bublina s fotkou + bio + WhatsApp/email/Calendly buttonmi
- [ ] **ROI mini-kalkulačka** — quick reply "Koľko mi to ušetrí?" → interaktívny widget
- [ ] **"14 dní bez rizika"** badge nad pricing kartami
- [ ] **"Čo sa stane po Vybrať Business"** roadmap pred calendarom (3-step kartička)
- [ ] **Diferenciátor vo welcome**: "Slovenský agent. Postaví ho Luboš osobne. Nie call centrum z Bangalore."

### Sprint D: Real demo content (potrebuje pilotky)
- [ ] 4 reálne 30s MP3 nahrávky cez ElevenLabs (kaderníctvo, zubár, fitness, autoservis)
- [ ] Skutočné mená/quotes/štatistiky pilotných klientov (po podpise pilotov)

---

## Strategic decisions

### Calendly nepoužívame priamo

**Research (2026-05-02):** Calendly Scheduling API (Create Event Invitee endpoint) podporuje programatic booking BEZ kliknutia na link, ale:
- Vyžaduje **paid plan** ($10+/mes na Standard tier)
- Vyžaduje **OAuth aplikáciu** (nie Personal Access Token)
- Lock-in na Calendly + ich pricing

**Verdict**: Calendly out. Ideme priamo na poskytovateľov kalendárov.

Sources:
- [Calendly: Schedule events with AI agents](https://developer.calendly.com/schedule-events-with-ai-agents)
- [Calendly: Create Event Invitee endpoint](https://developer.calendly.com/api-docs/p3ghrxrwbl8kqe-create-event-invitee)

### Multi-tenant calendar: Adapter pattern

**Problém**: Klienti budú mať rôzne systémy:
- Google Calendar (Gmail-based, 60-70% SK SMB)
- Microsoft 365 / Outlook (väčšie firmy)
- iCloud Calendar (Apple ekosystém, malá kohorta)
- **Industry-specific systémy:**
  - Kaderníctva: Reservio (CZ/SK popular), Fresha, Booksy, Treatwell
  - Zubári: Praktik, Stapro, Doctolib, custom EMR
  - Fitness: Mindbody, Glofox, Wellness Living
  - Reštaurácie: TheFork, custom
  - Autoservis: nemá nič formálne (papier, Excel)

**Architecture: per-provider adapter pattern**

```typescript
// apps/api/src/calendar/types.ts
export interface CalendarAdapter {
  getAvailability(from: Date, to: Date): Promise<Slot[]>;
  createBooking(slot: Slot, customer: Customer): Promise<BookingRef>;
  cancelBooking(ref: BookingRef): Promise<void>;
}

// apps/api/src/calendar/google.ts
export class GoogleCalendarAdapter implements CalendarAdapter { ... }

// apps/api/src/calendar/microsoft.ts
export class MicrosoftCalendarAdapter implements CalendarAdapter { ... }

// apps/api/src/calendar/manual.ts
export class ManualCalendarAdapter implements CalendarAdapter {
  // Záznam do nášho Postgres + email/SMS notifikácia majiteľovi
  // Pre klientov bez digitálneho kalendára (autoservis, malé prevádzky)
}
```

V `tenants` tabuľke:

```sql
calendar_provider: 'google' | 'microsoft' | 'reservio' | 'fresha' | 'manual'
calendar_credentials: jsonb  -- encrypted OAuth tokens / API keys
calendar_config: jsonb       -- calendar_id, working_hours, buffer, atď.
```

V `book_appointment` tool: `loadAdapter(tenant.calendar_provider).createBooking(...)`.

**Roadmap order:**
1. **Phase 1 (teraz)**: `GoogleCalendarAdapter` + `ManualCalendarAdapter` → pokrýva 80% SK SMB
2. **Phase 2 (3-6 mes)**: `MicrosoftCalendarAdapter` → väčšie firmy
3. **Phase 3 (per-client)**: Industry-specific adaptéry on demand (Reservio, Fresha, ...)
4. **Phase 4 (later, ak budeme mať veľa providerov)**: vyvalenie cez **Cronofy** alebo **Nylas** (managed calendar API aggregator) — paid ale jeden adapter pokrýva 5+ providerov. Pre teraz overkill.

**Manual adapter ako default fallback:**
Pre klientov bez digitálneho kalendára (autoservis, malé prevádzky) je "manual mode" feature, nie bug:
- Agent zaznamená termín do nášho Postgres
- Pošle SMS/email majiteľovi: "Termín 14:00 utorok — Peter Novák, +421 902 ..."
- Majiteľ si poznačí kde chce
- Klient dostane confirmation SMS

Trojica `Google + Manual + (Microsoft neskôr)` pokrýva 90% nášho target marketu bez potreby industry-specific integrácií.

### Boutique agency positioning

Naša diferenciácia oproti Synthflow/Vapi/Bland:
- **Slovenský agent natívne** (jazyk, prízvuky, lokálne firemné konvencie)
- **Luboš osobne** nastaví → konverzný hook v chate (foto, bio, WhatsApp link)
- **Per-client custom integrácie** ako add-on (industry-specific calendar adaptéry)
- **Boutique scale**: max 50 klientov v prvých 1-2 rokoch, prémiová cena, hands-on onboarding

Frontend musí komunikovať túto angle — preto **Sprint C (Luboš section + ROI calc)** má vysokú prioritu.

### LinkedIn vs alternatívy

Luboš nemá LinkedIn rád. Pre SK/CZ SMB target sú tieto **lepšie** ako LinkedIn:
- WhatsApp Business (`https://wa.me/421...`) — instant, low-commitment
- Calendly (`calendly.com/lubos/setup`) — konkrétna akcia
- Email — fallback

Luboš section v chate použije túto trojicu, žiadny LinkedIn.

### Multi-tenant: shared backend, NIE per-client fork

Jeden codebase, per-tenant konfigurácia v DB. Custom kód per klient v `apps/api/src/tools/tenants/{slug}/` (registry pattern). Forky alebo separátne deploye iba pre regulačnú izoláciu (banky, healthcare s HIPAA).

Detail: viď `apps/api/README.md`.

---

## Backlog (groomed by area)

### Backend (`olivia-api`)

- [ ] **Calendar adapter framework** — `CalendarAdapter` interface + 2 implementácie (Google, Manual)
- [ ] **Google OAuth flow** — `/auth/google/start` + callback, encrypt + store refresh tokens
- [ ] **`get_availability` server tool** — query tenant calendar pre free sloty
- [ ] **Refactor `book_appointment`** — používa CalendarAdapter podľa tenant config
- [ ] **`send_sms` server tool** — Twilio (alebo SK SMS provider) integration
- [ ] **`knowledge_search` server tool** — RAG nad firemným FAQ (Postgres + pgvector)
- [ ] **Webhook endpoint** pre Google Calendar push notifications (klient zruší → DB updatne)
- [ ] **Drizzle migrations** namiesto `db:push` v produkcii (raz za sprint)
- [ ] **Move drizzle-kit + tsx do dependencies** ak chceme `railway run pnpm db:push` priamo (low priority)
- [ ] **Rip out Calendly stub** alebo nechať ako historical reference
- [ ] **Tenant admin endpoints** (CRUD pre tenants + tools_config) — keď budú reálni klienti

### Frontend (`olivia-web`)

- [ ] **`apiClient.ts`** — Hono RPC client (alebo plain fetch) volajúci `api.olivia.lubos.app`
- [ ] **Calendar komponent** volá real API namiesto fake confirmation
- [ ] **Luboš founder section** — quick reply + bublina s fotkou/bio/buttonmi (WhatsApp + Calendly + email)
- [ ] **ROI mini-kalkulačka** — interaktívny widget v chate
- [ ] **"Čo sa stane ďalej" 3-step roadmap** pred calendarom
- [ ] **"14 dní bez rizika · Setup zdarma"** badge nad pricing
- [ ] **Diferenciátor vo welcome message** (slovenský agent, Luboš osobne)
- [ ] **Reálne audio nahrávky** (4× ~30s) namiesto simulovanej waveformy
- [ ] **Skutočné dáta pilotných klientov** (po podpisoch)

### ElevenLabs dashboard (manuálne)

- [ ] **Dynamic variables panel** — definovať `current_date_local`, `current_date_iso`, `current_timezone`, `current_weekday` s default values
- [ ] **System prompt** — KONTEXT ČASU sekcia (copy-paste ready)
- [ ] **`get_availability` server tool** — keď bude implementovaný
- [ ] **`send_sms` server tool** — keď bude
- [ ] **Phone number setup** — keď budeme chcieť test cez Twilio
- [ ] **Agent prompt iteration** — postupne tunovať podľa real interakcií

### Infra

- [ ] **Vercel deploy `olivia-web`** s custom doménou `olivia.lubos.app`
- [ ] **Cloudflare**: nastaviť `olivia` CNAME na Vercel (gray cloud)
- [ ] **Postgres backups** — Railway robí automaticky, ale over že máme retention policy
- [ ] **Production logging** — aktuálne len console.log, neskôr Logtail/Axiom alebo Railway logs sufficient

### Strategické / business decisions (Lubošova akcia)

- [ ] **Hľadanie 4 pilotných klientov** (kaderníctvo, zubár, fitness, autoservis) — bez nich social proof zostane placeholder
- [ ] **Twilio SK number setup** — pre phone callers
- [ ] **Foto + bio + WhatsApp number + email** pre Luboš sekciu
- [ ] **Calendly account / Google Calendar** — natiahnuť dostupnosť, nastaviť working hours
- [ ] **Pricing strategy review** — sú 5/10/20k Kč correct alebo treba zľavy/trial offers?

---

## Hotové ✅ (chronologicky)

### 2026-05-02
- Olivia chat-as-landing dizajn implementovaný (Sky/Night, clouds, brandmark, FAQ, customer cards, pricing, calendar UI)
- ElevenLabs SDK wired (WebSocket connection)
- Inline call mode (avatar pulse, status, mute, end-call v composeri)
- `useCallMode` hook + Demo/Naživo toggle za `?dev=1`
- Theme toggle iOS-style (76×44 pill, 34×34 knob)
- Dev mód: scripted call timeline pre UI testing bez SDK
- `olivia-api` repo + Railway deploy (Hono + Drizzle + Postgres)
- Custom doména `api.olivia.lubos.app` cez Cloudflare
- `book_appointment` server tool: persist + audit log + auth header
- DB schema (`tenants`, `bookings`, `tool_calls`) applied
- First tenant `olivia` seeded
- ElevenLabs server tool wired k `api.olivia.lubos.app`
- Dynamic variables (current date) injektnú do agent contextu
- Backend zod guard proti minulým slot dátumom

---

## Open questions

- **Twilio vs alternatíva pre SK SMS** — Smartsupp, Sloyalty, atď. Treba research.
- **Industry-specific calendar adaptéry** — koľko klientov bude potrebovať? Možno len Google Calendar pre väčšinu.
- **Knowledge base UX** — ako klient nahrá svoje FAQ? CSV upload? Notion/Google Docs sync? Custom admin UI?
- **Pricing pre prvého klienta** — full $100-150/mes alebo zľava na pilot?
