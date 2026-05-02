import { useConversation } from '@elevenlabs/react';
import { ELEVENLABS_AGENT_ID } from '../config';

export function useOliviaAgent() {
  const conversation = useConversation({
    agentId: ELEVENLABS_AGENT_ID,
    onConnect: () => console.log('[Olivia] Connected'),
    onDisconnect: () => console.log('[Olivia] Disconnected'),
    onMessage: (message) => {
      console.log('[Olivia] Message:', message);
    },
    onError: (error) => console.error('[Olivia] Error:', error),
    onModeChange: (mode) => console.log('[Olivia] Mode:', mode),
    clientTools: {
      show_pricing: ({ tier }: { tier?: string }) => {
        console.log('[Olivia] Show pricing:', tier);
        // TODO: trigger UI state change
        return { success: true };
      },
      play_demo: ({ industry }: { industry: string }) => {
        console.log('[Olivia] Play demo:', industry);
        // TODO: trigger audio playback
        return { success: true };
      },
      show_booking_calendar: ({ available_slots }: { available_slots: string[] }) => {
        console.log('[Olivia] Show calendar:', available_slots);
        return { success: true };
      },
      show_testimonial: ({ company }: { company: string }) => {
        console.log('[Olivia] Show testimonial:', company);
        return { success: true };
      },
    },
  });

  const startVoice = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: ELEVENLABS_AGENT_ID,
        connectionType: 'webrtc',
      });
    } catch (err) {
      console.error('[Olivia] Failed to start voice:', err);
    }
  };

  const sendText = (text: string) => {
    conversation.sendUserMessage(text);
  };

  return {
    status: conversation.status,
    isSpeaking: conversation.isSpeaking,
    startVoice,
    endSession: conversation.endSession,
    sendText,
    sendContext: conversation.sendContextualUpdate,
    setVolume: conversation.setVolume,
  };
}
