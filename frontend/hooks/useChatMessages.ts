import { useMemo } from 'react';
import { Room } from 'livekit-client';
import {
  type ReceivedChatMessage,
  type TextStreamData,
  useChat,
  useRoomContext,
  useTranscriptions,
} from '@livekit/components-react';

function transcriptionToChatMessage(textStream: TextStreamData, room: Room): ReceivedChatMessage {
  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from:
      textStream.participantInfo.identity === room.localParticipant.identity
        ? room.localParticipant
        : Array.from(room.remoteParticipants.values()).find(
            (p) => p.identity === textStream.participantInfo.identity
          ),
  };
}

export function useChatMessages() {
  const chat = useChat();
  const room = useRoomContext();
  const transcriptions: TextStreamData[] = useTranscriptions();

  const mergedTranscriptions = useMemo(() => {
    // Group transcriptions by stream ID and keep only the latest (most complete) version of each stream
    const transcriptionMap = new Map<string, ReceivedChatMessage>();
    
    transcriptions.forEach((transcription) => {
      const message = transcriptionToChatMessage(transcription, room);
      const streamId = message.id;
      
      // Keep the most complete version of each stream
      // Prefer longer text (more complete) or same length with later timestamp
      const existing = transcriptionMap.get(streamId);
      if (!existing || 
          message.message.length > existing.message.length ||
          (message.message.length === existing.message.length && message.timestamp >= existing.timestamp)) {
        transcriptionMap.set(streamId, message);
      }
    });

    // Convert map values to array and merge with chat messages
    const merged: Array<ReceivedChatMessage> = [
      ...Array.from(transcriptionMap.values()),
      ...chat.chatMessages,
    ];
    
    // Sort by timestamp
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return mergedTranscriptions;
}
