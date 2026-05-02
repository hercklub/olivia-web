import { useConversation } from '@elevenlabs/react';
import { ELEVENLABS_AGENT_ID } from '../config';

interface AgentCallbacks {
  onUserMessage?: (text: string) => void;
  onAgentMessage?: (text: string) => void;
}

interface AgentMessage {
  source?: 'ai' | 'user' | string;
  message?: string;
}

export function useOliviaAgent(callbacks: AgentCallbacks = {}) {
  const conversation = useConversation({
    agentId: ELEVENLABS_AGENT_ID,
    onConnect: () => console.log('[Olivia] Connected'),
    onDisconnect: () => console.log('[Olivia] Disconnected'),
    onMessage: (raw: unknown) => {
      const m = raw as AgentMessage;
      const text = m?.message ?? '';
      if (!text) return;
      if (m.source === 'user') callbacks.onUserMessage?.(text);
      else callbacks.onAgentMessage?.(text);
    },
    onError: (error) => console.error('[Olivia] Error:', error),
    clientTools: {
      show_pricing: ({ tier }: { tier?: string }) => {
        console.log('[Olivia] Show pricing:', tier);
      },
      play_demo: ({ industry }: { industry: string }) => {
        console.log('[Olivia] Play demo:', industry);
      },
      show_booking_calendar: ({ available_slots }: { available_slots: string[] }) => {
        console.log('[Olivia] Show calendar:', available_slots);
      },
      show_testimonial: ({ company }: { company: string }) => {
        console.log('[Olivia] Show testimonial:', company);
      },
    },
  });

  const startVoice = async () => {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    // WebSocket connection — bypasses LiveKit WebRTC stack which has
    // negotiation timeouts on this account. Higher latency than webrtc but
    // reliable. Switch back to 'webrtc' once ElevenLabs LiveKit pathing is fixed.
    //
    // Dynamic variables inject current date into the agent's context. Without
    // this the LLM hallucinates dates from its training cutoff (often 2023).
    // The agent's system prompt must reference {{current_date_local}} etc. to
    // actually use these — see ElevenLabs dashboard.
    const now = new Date();
    const dynamicVariables = {
      current_date_iso: now.toISOString(),
      current_date_local: now.toLocaleString('sk-SK', {
        timeZone: 'Europe/Bratislava',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      current_timezone: 'Europe/Bratislava',
      current_weekday: now.toLocaleDateString('sk-SK', {
        timeZone: 'Europe/Bratislava',
        weekday: 'long',
      }),
    };

    await conversation.startSession({
      agentId: ELEVENLABS_AGENT_ID,
      connectionType: 'websocket',
      dynamicVariables,
    });
  };

  return {
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    isMuted: conversation.isMuted,
    setMuted: conversation.setMuted,
    startVoice,
    endSession: conversation.endSession,
    sendUserMessage: conversation.sendUserMessage,
    sendContextualUpdate: conversation.sendContextualUpdate,
    setVolume: conversation.setVolume,
  };
}
