# Olivia Web — Landing Page + Agent SDK

Chat-first landing page pre Olívia AI agent. Backend-less na začiatok — ElevenLabs SDK pripojený directne.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- @elevenlabs/react (conversational AI SDK)
- Deploy: Vercel

## ElevenLabs Agent
- **Agent ID:** `agent_0701kqfz32wpee39fymms1e3w24x`
- **SDK:** @elevenlabs/react
- **Connection:** WebRTC (lower latency) alebo WebSocket

## SDK Usage

### Start voice session
```tsx
const conversation = useConversation({
  agentId: "agent_0701kqfz32wpee39fymms1e3w24x",
  onMessage: (msg) => handleAgentMessage(msg),
  clientTools: {
    show_pricing: ({ tier }) => { /* trigger UI */ return { success: true }; },
    play_demo: ({ industry }) => { /* play audio */ return { success: true }; },
    show_booking_calendar: ({ available_slots }) => { /* show calendar */ return { success: true }; },
  },
});

await navigator.mediaDevices.getUserMedia({ audio: true });
await conversation.startSession({ agentId: "...", connectionType: "webrtc" });
```

### Send text message
```
conversation.sendUserMessage("Koľko to stojí?");
```

### Send contextual update (non-interrupting)
```
conversation.sendContextualUpdate("User clicked pricing section");
```

### Client tools
Definuj v options.clientTools — agent ich zavolá a frontend reaguje.

## Pricing (reálny)
- ~455 credits/min (~$0.09/min all-in)
- LLM cost: ~$0.014/min (GPT-4o)
- Scale plan $299/mes: 2,000 included minút

## Development
```bash
npm install
npm run dev
```

## Deploy
```bash
vercel --prod
```
