'use client';

import { motion } from 'motion/react';
import { useVoiceAssistant } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface WaveVisualizerProps {
  className?: string;
}

export function WaveVisualizer({ className }: WaveVisualizerProps) {
  let agentState: 'idle' | 'listening' | 'speaking' | 'connecting' = 'idle';
  
  try {
    const voiceAssistant = useVoiceAssistant();
    agentState = voiceAssistant?.state || 'idle';
  } catch (error) {
    // Fallback if hook fails - always show idle animation
    agentState = 'idle';
    if (typeof window !== 'undefined') {
      console.warn('WaveVisualizer: useVoiceAssistant hook failed, using idle state', error);
    }
  }

  const bars = Array.from({ length: 6 }, (_, i) => i);
  
  // Debug: Log to ensure component is rendering
  if (typeof window !== 'undefined') {
    console.log('WaveVisualizer rendering, state:', agentState);
  }

  return (
    <div
      className={cn(
        'flex items-end justify-center gap-3 md:gap-4',
        'w-[20%] md:w-[25%]',
        'h-full',
        'relative z-10', // Ensure it's above background
        className
      )}
      style={{ 
        height: '100%',
        minHeight: '150px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      {bars.map((index) => {
        const isListening = agentState === 'listening';
        const isSpeaking = agentState === 'speaking';
        
        // Create wave pattern - center bars taller (symmetrical)
        const centerIndex = 2.5; // Middle of 6 bars (between index 2 and 3)
        const distanceFromCenter = Math.abs(index - centerIndex);
        const baseHeight = 0.4 + (1 - distanceFromCenter / 2.5) * 0.6; // 0.4 to 1.0
        
        return (
          <motion.div
            key={index}
            className={cn(
              'w-8 md:w-10 rounded-full origin-bottom',
              // Listening state: gentle wave with purple
              isListening && [
                'bg-gradient-to-t from-purple-500 via-purple-400 to-purple-300',
                'shadow-[0_0_15px_rgba(139,92,246,0.6)]',
              ],
              // Speaking state: active wave with pink
              isSpeaking && [
                'bg-gradient-to-t from-pink-600 via-pink-500 to-pink-400',
                'shadow-[0_0_20px_rgba(236,72,153,0.8)]',
              ],
              // Default/idle state - always show animation
              !isListening && !isSpeaking && [
                'bg-gradient-to-t from-purple-600 via-purple-500 to-purple-400',
                'shadow-[0_0_12px_rgba(139,92,246,0.4)]',
              ],
            )}
            style={{
              height: '100%',
              minHeight: '80px',
              width: '32px',
            }}
            animate={
              isListening
                ? {
                    scaleY: [baseHeight * 0.4, baseHeight * 0.7, baseHeight, baseHeight * 0.7, baseHeight * 0.4],
                    opacity: [0.8, 0.9, 1, 0.9, 0.8],
                  }
                : isSpeaking
                  ? {
                      scaleY: [
                        baseHeight * 0.3,
                        baseHeight * 0.8,
                        baseHeight * 1.4,
                        baseHeight * 0.9,
                        baseHeight * 1.2,
                        baseHeight * 0.3,
                      ],
                      opacity: [0.8, 0.9, 1, 0.95, 0.9, 0.8],
                    }
                  : {
                      // Default: gentle breathing animation - ALWAYS VISIBLE
                      scaleY: [baseHeight * 0.5, baseHeight * 0.8, baseHeight * 0.5],
                      opacity: [0.8, 1, 0.8],
                    }
            }
            transition={{
              duration: isListening ? 2 : isSpeaking ? 0.6 : 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * (isListening ? 0.2 : isSpeaking ? 0.1 : 0.2),
            }}
          />
        );
      })}
    </div>
  );
}

