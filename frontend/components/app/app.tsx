'use client';

import { RoomAudioRenderer, StartAudio } from '@livekit/components-react';
import type { AppConfig } from '@/app-config';
import { SessionProvider } from '@/components/app/session-provider';
import { ViewController } from '@/components/app/view-controller';
import { Toaster } from '@/components/livekit/toaster';
import { ErrorBoundary } from '@/components/app/error-boundary';

interface AppProps {
  appConfig: AppConfig;
}

export function App({ appConfig }: AppProps) {
  return (
    <ErrorBoundary>
      <SessionProvider appConfig={appConfig}>
        <main className="zepto-gradient min-h-screen w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <ViewController />
        </main>
        <StartAudio label="Start Audio" />
        <RoomAudioRenderer />
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  );
}
