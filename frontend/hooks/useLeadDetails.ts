import { useMemo } from 'react';
import type { ReceivedChatMessage } from '@livekit/components-react';
import type { LeadDetails } from '@/components/app/lead-summary';

const FIELD_MAP: Record<string, keyof LeadDetails> = {
  name: 'name',
  company: 'company',
  email: 'email',
  role: 'role',
  usecase: 'useCase',
  'use-case': 'useCase',
  teamsize: 'teamSize',
  timeline: 'timeline',
  budget: 'budget',
};

export function useLeadDetails(messages: ReceivedChatMessage[]): LeadDetails | null {
  return useMemo(() => {
    const agentMessages = messages.filter((msg) => !msg.from?.isLocal);
    const summaryMessage = [...agentMessages]
      .reverse()
      .find((msg) => msg.message.toLowerCase().includes('lead summary'));

    if (!summaryMessage) {
      return null;
    }

    const details: Partial<LeadDetails> = {};
    const text = summaryMessage.message;
    const regex = /([A-Za-z\-]+)\s*=\s*([^;.\n]+)/g;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      const rawKey = match[1].trim().toLowerCase();
      const mappedKey = FIELD_MAP[rawKey];
      if (!mappedKey) continue;
      details[mappedKey] = match[2].trim();
    }

    const requiredFields: Array<keyof LeadDetails> = [
      'name',
      'company',
      'email',
      'role',
      'useCase',
      'teamSize',
      'timeline',
    ];

    if (requiredFields.some((field) => !details[field])) {
      return null;
    }

    return details as LeadDetails;
  }, [messages]);
}


