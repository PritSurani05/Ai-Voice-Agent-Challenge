'use client';

import { CoffeeWelcomeView } from './coffee-welcome';
import { WellnessWelcomeView } from './wellness-welcome';
import { TeacherWelcomeView } from './teacher-welcome';
import { RazorpayWelcomeView } from './razorpay-welcome';

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
  if (agentDay === '4') {
    return <TeacherWelcomeView {...props} />;
  }
  if (agentDay === '5') {
    return <RazorpayWelcomeView {...props} />;
  }
  return <CoffeeWelcomeView {...props} />;
}
