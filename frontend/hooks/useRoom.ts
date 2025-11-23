import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Room, RoomEvent, TokenSource, Track, RemoteParticipant, TrackPublication } from 'livekit-client';
import { AppConfig } from '@/app-config';
import { toastAlert } from '@/components/livekit/alert-toast';

export function useRoom(appConfig: AppConfig) {
  const aborted = useRef(false);
  const room = useMemo(() => new Room(), []);
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    function onDisconnected() {
      setIsSessionActive(false);
    }

    function onMediaDevicesError(error: Error) {
      toastAlert({
        title: 'Encountered an error with your media devices',
        description: `${error.name}: ${error.message}`,
      });
    }

    function onParticipantConnected(participant: RemoteParticipant) {
      console.log('Participant connected:', {
        identity: participant.identity,
        name: participant.name,
        sid: participant.sid,
        isAgent: participant.isAgent,
        metadata: participant.metadata,
      });
    }

    function onTrackPublished(publication: TrackPublication, participant: RemoteParticipant) {
      console.log('Track published:', {
        participant: participant.identity,
        source: publication.source,
        trackSid: publication.trackSid,
        isMuted: publication.isMuted,
        kind: publication.kind,
      });
    }

    async function onConnected() {
      console.log('Room connected!', {
        roomName: room.name,
        roomSid: room.sid,
        localParticipant: {
          identity: room.localParticipant.identity,
          name: room.localParticipant.name,
          sid: room.localParticipant.sid,
        },
        remoteParticipants: Array.from(room.remoteParticipants.values()).map(p => ({
          identity: p.identity,
          name: p.name,
          sid: p.sid,
          isAgent: p.isAgent,
          metadata: p.metadata,
        })),
      });

      // Listen for participant connections
      room.on('participantConnected', onParticipantConnected);
      room.on('trackPublished', onTrackPublished);

      // Force enable microphone after room connection - this is critical for the agent to listen
      try {
        // Clear any saved muted preference for this session
        try {
          const storageKey = 'lk-audio-input-enabled';
          localStorage.setItem(storageKey, 'true');
        } catch (e) {
          // Ignore localStorage errors
        }

        console.log('Force enabling microphone after room connection...');
        
        // Force enable microphone - this will request permissions if needed
        await room.localParticipant.setMicrophoneEnabled(true);
        
        // Wait a bit for the track to be created and published
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let micPublication = room.localParticipant.getTrackPublication(Track.Source.Microphone);
        console.log('Microphone status after enable:', {
          exists: !!micPublication,
          isMuted: micPublication?.isMuted,
          isSubscribed: micPublication?.isSubscribed,
          trackState: micPublication?.track?.readyState,
          trackKind: micPublication?.track?.kind,
        });

        // If still not enabled, try again with retries
        if (!micPublication || micPublication.isMuted) {
          console.log('Microphone not enabled yet, retrying...');
          
          for (let i = 0; i < 5; i++) {
            await room.localParticipant.setMicrophoneEnabled(true);
            await new Promise(resolve => setTimeout(resolve, 400));
            
            micPublication = room.localParticipant.getTrackPublication(Track.Source.Microphone);
            if (micPublication && !micPublication.isMuted) {
              console.log(`Microphone enabled successfully (attempt ${i + 1}):`, {
                exists: !!micPublication,
                isMuted: micPublication.isMuted,
                trackState: micPublication.track?.readyState,
                trackKind: micPublication.track?.kind,
                trackId: micPublication.trackSid,
              });
              break;
            }
          }
        }
        
        // Final verification
        micPublication = room.localParticipant.getTrackPublication(Track.Source.Microphone);
        if (micPublication && !micPublication.isMuted) {
          console.log('✅ Microphone is enabled and ready for listening');
        } else {
          console.error('❌ Microphone failed to enable after multiple attempts:', {
            exists: !!micPublication,
            isMuted: micPublication?.isMuted,
          });
          toastAlert({
            title: 'Microphone not enabled',
            description: 'Please manually enable your microphone using the control bar.',
          });
        }
      } catch (error) {
        console.error('Error enabling microphone after connection:', error);
        toastAlert({
          title: 'Microphone access issue',
          description: 'Please check your microphone permissions in your browser settings.',
        });
      }
    }

    room.on(RoomEvent.Disconnected, onDisconnected);
    room.on(RoomEvent.Connected, onConnected);
    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.ParticipantConnected, onParticipantConnected);
    room.on(RoomEvent.TrackPublished, onTrackPublished);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.Connected, onConnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
      room.off(RoomEvent.ParticipantConnected, onParticipantConnected);
      room.off(RoomEvent.TrackPublished, onTrackPublished);
    };
  }, [room]);

  useEffect(() => {
    return () => {
      aborted.current = true;
      room.disconnect();
    };
  }, [room]);

  const tokenSource = useMemo(
    () =>
      TokenSource.custom(async () => {
        const url = new URL(
          process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? '/api/connection-details',
          window.location.origin
        );

        try {
          const res = await fetch(url.toString(), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Sandbox-Id': appConfig.sandboxId ?? '',
            },
            body: JSON.stringify({
              // For local dev, request agent with empty name - agent worker will auto-join
              // For cloud/sandbox, use the specific agentName
              room_config: appConfig.agentName
                ? {
                    agents: [{ agent_name: appConfig.agentName }],
                  }
                : {
                    agents: [{ agent_name: "" }], // Empty name for local dev - any agent can join
                  },
            }),
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error(`Failed to fetch connection details: ${res.status} ${res.statusText}`, errorText);
            throw new Error(`Failed to fetch connection details: ${res.status} ${res.statusText}. ${errorText}`);
          }

          const data = await res.json();
          return data;
        } catch (error) {
          console.error('Error fetching connection details:', error);
          if (error instanceof Error) {
            throw new Error(`Error fetching connection details: ${error.message}`);
          }
          throw new Error('Error fetching connection details!');
        }
      }),
    [appConfig]
  );

  const startSession = useCallback(() => {
    setIsSessionActive(true);

    if (room.state === 'disconnected') {
      const { isPreConnectBufferEnabled } = appConfig;
      
      // Clear any saved muted preference before starting session
      try {
        const storageKey = 'lk-audio-input-enabled';
        localStorage.setItem(storageKey, 'true');
      } catch (e) {
        // Ignore localStorage errors
      }
      
      // First, request microphone permission and enable it (with pre-connect buffer if enabled)
      const enableMicPromise = room.localParticipant.setMicrophoneEnabled(true, undefined, {
        preConnectBuffer: isPreConnectBufferEnabled,
      }).catch((error) => {
        console.error('Error enabling microphone:', error);
        // Don't throw here - allow connection to proceed even if mic fails initially
        // The onConnected handler will retry
      });

      // Then connect to the room
      const connectPromise = tokenSource
        .fetch({ agentName: appConfig.agentName })
        .then(async (connectionDetails) => {
          await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);
          return connectionDetails;
        });

      Promise.all([enableMicPromise, connectPromise]).catch((error) => {
        if (aborted.current) {
          // Once the effect has cleaned up after itself, drop any errors
          //
          // These errors are likely caused by this effect rerunning rapidly,
          // resulting in a previous run `disconnect` running in parallel with
          // a current run `connect`
          return;
        }

        toastAlert({
          title: 'There was an error connecting to the agent',
          description: `${error.name}: ${error.message}`,
        });
      });
    }
  }, [room, appConfig, tokenSource]);

  const endSession = useCallback(() => {
    setIsSessionActive(false);
  }, []);

  return { room, isSessionActive, startSession, endSession };
}
