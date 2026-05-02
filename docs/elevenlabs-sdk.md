# ElevenLabs SDK Integration Notes

Agent ID: agent_0701kqfz32wpee39fymws1e3w24x

## React SDK Setup
npm install @elevenlabs/react

## Core Hook
```tsx
import { useConversation } from "@elevenlabs/react";

const conversation = useConversation({
  onConnect: () => console.log("Connected"),
  onDisconnect: () => console.log("Disconnected"),
  onMessage: (message) => console.log("Message:", message),
  onError: (error) => console.error("Error:", error),
  onModeChange: (mode) => console.log("Mode:", mode),
});
```

## Start Voice Session
```tsx
const startConversation = async () => {
  await navigator.mediaDevices.getUserMedia({ audio: true });
  await conversation.startSession({
    agentId: "agent_0701kqfz32wpee39fymws1e3w24x",
    connectionType: "webrtc", // or "websocket"
  });
};
```

## Methods
- conversation.sendUserMessage(text) — send text to agent
- conversation.sendContextualUpdate(text) — send context without response
- conversation.endSession() — end session
- conversation.sendFeedback(true/false) — rate response
- conversation.setVolume({ volume: 0.5 }) — adjust output
- conversation.getInputVolume() / getOutputVolume() — audio levels

## Client Tools
Define in options to let agent invoke client-side functions:
```tsx
clientTools: {
  show_pricing: ({ tier }: { tier?: string }) => {
    // Show pricing UI
    return { success: true };
  },
  play_demo: ({ industry }: { industry: string }) => {
    // Play demo audio
    return { success: true };
  },
}
```

## Overrides
Customize per-session:
- overrides.prompt — custom system prompt
- overrides.firstMessage — override greeting
- overrides.agent.language — force language
- overrides.agent.voiceId — switch voice

## WebSocket (alternative)
wss://api.elevenlabs.io/v1/convai/conversation?agent_id=agent_0701kqfz32wpee39fymws1e3w24x

## Widget (simplest)
```html
<script src="https://elevenlabs.io/convai-widget/index.js" async></script>
<elevenlabs-convai agent-id="agent_0701kqfz32wpee39fymws1e3w24x"></elevenlabs-convai>
```

## Documentation
- https://elevenlabs.io/docs/eleven-agents
- https://elevenlabs.io/docs/api-reference/agents/get
- https://elevenlabs.io/docs/api-reference/conversations/get
