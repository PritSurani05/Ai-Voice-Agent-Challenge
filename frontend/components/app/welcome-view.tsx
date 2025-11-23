'use client';

import { CoffeeWelcomeView } from './coffee-welcome';
import { WellnessWelcomeView } from './wellness-welcome';

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export function WelcomeView(props: React.ComponentProps<'div'> & WelcomeViewProps) {
  const agentDay = typeof window !== 'undefined' 
    ? (window as any).__NEXT_PUBLIC_AGENT_DAY__ || process.env.NEXT_PUBLIC_AGENT_DAY || '2'
    : process.env.NEXT_PUBLIC_AGENT_DAY || '2';
  
  if (agentDay === '3') {
    return <WellnessWelcomeView {...props} />;
  }
  return <CoffeeWelcomeView {...props} />;
}
