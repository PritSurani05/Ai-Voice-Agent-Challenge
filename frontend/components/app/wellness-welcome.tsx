'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/livekit/button';

function WellnessIcon() {
  return (
    <motion.div
      className="relative mb-4"
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Enhanced glow effect - Blue/Teal theme */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-48 h-48 bg-blue-500/25 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div 
          className="absolute w-36 h-36 bg-teal-500/20 rounded-full blur-2xl"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.15, 0.35, 0.15],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.7,
          }}
        />
      </div>
      
      {/* Wellness/Health Icon - Medical Cross with Heart */}
      <motion.svg
        width="140"
        height="160"
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 25px 50px rgba(59, 130, 246, 0.4))' }}
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Blue gradient */}
          <linearGradient id="wellnessGrad" x1="35" y1="25" x2="105" y2="115">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
          
          {/* Teal gradient */}
          <linearGradient id="tealGrad" x1="40" y1="30" x2="100" y2="110">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#0891B2" />
          </linearGradient>
        </defs>
        
        {/* Heart shape */}
        <motion.path
          d="M70 50 C70 40, 60 35, 55 40 C50 35, 40 40, 40 50 C40 60, 70 85, 70 85 C70 85, 100 60, 100 50 C100 40, 90 35, 85 40 C80 35, 70 40, 70 50 Z"
          fill="url(#wellnessGrad)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        
        {/* Medical cross */}
        <motion.rect
          x="65"
          y="60"
          width="10"
          height="30"
          rx="2"
          fill="white"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.rect
          x="55"
          y="70"
          width="30"
          height="10"
          rx="2"
          fill="white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
        />
        
        {/* Pulse animation circles */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="70"
            cy="75"
            r={20 + i * 15}
            fill="none"
            stroke="url(#tealGrad)"
            strokeWidth="2"
            initial={{ opacity: 0.6, scale: 0.8 }}
            animate={{
              opacity: [0.6, 0, 0.6],
              scale: [0.8, 1.5, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeOut',
            }}
          />
        ))}
      </motion.svg>
      
      {/* Floating health particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-300/50 rounded-full"
          style={{
            left: `${45 + i * 15}%`,
            top: `${-8 - i * 3}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 2.5 + i * 0.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.4,
          }}
        />
      ))}
    </motion.div>
  );
}

function ApolloBadge() {
  return (
    <motion.div
      className="mb-3 flex items-center gap-2 justify-center flex-wrap"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
    >
      <div className="glass-card rounded-full px-5 py-2 glow-blue">
        <span className="text-sm font-bold bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent">
          APOLLO PHARMACY
        </span>
      </div>
      <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 shadow-lg shadow-green-500/30">
        <span className="text-xs font-bold text-white">Wellness Companion</span>
      </div>
    </motion.div>
  );
}

interface WellnessWelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WellnessWelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WellnessWelcomeViewProps) => {
  return (
    <div ref={ref} className="w-full min-h-screen flex flex-col items-center justify-start pt-8 md:pt-12 pb-4 px-6 relative overflow-y-auto">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => {
          const positions = [10, 20, 30, 40, 50, 60, 70, 80, 90];
          const x = positions[i % positions.length];
          const y = positions[Math.floor(i / 3) % positions.length];
          return (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/20 rounded-full"
              initial={{
                x: `${x}%`,
                y: `${y}%`,
                opacity: 0.2,
              }}
              animate={{
                y: [`${y}%`, `${(y + 30) % 100}%`],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      {/* Apollo Pharmacy Branding */}
      <motion.div
        className="mb-6 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-blue-200 via-teal-100 via-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2 tracking-tighter leading-none animate-text-shimmer">
          APOLLO
        </h1>
        <p className="text-blue-200 font-extrabold text-2xl md:text-3xl lg:text-4xl tracking-[0.3em] uppercase letter-spacing-wider">PHARMACY</p>
      </motion.div>

      {/* Wellness Icon Animation */}
      <motion.div
        className="mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <WellnessIcon />
      </motion.div>

      {/* Subtitle */}
      <motion.p
        className="text-blue-200 text-lg md:text-xl mb-6 text-center max-w-2xl leading-relaxed relative z-10 px-4 font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Your daily wellness check-in companion
      </motion.p>

      {/* CTA Button */}
      <motion.div
        className="relative z-10 mt-4"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="primary"
          size="lg"
          onClick={onStartCall}
          className="relative w-72 md:w-80 h-14 md:h-16 text-base md:text-lg font-bold bg-gradient-to-r from-blue-800 via-blue-700 to-teal-800 hover:from-blue-700 hover:via-blue-600 hover:to-teal-700 text-white rounded-full glow-blue overflow-hidden group transition-all duration-300 shadow-lg shadow-blue-600/40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {startButtonText || 'START WELLNESS CHECK-IN'}
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </Button>
      </motion.div>

      {/* Features Cards */}
      <motion.div
        className="mt-12 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, staggerChildren: 0.1 }}
      >
        {[
          { icon: '💚', title: 'Daily Check-ins', desc: 'Track mood & energy' },
          { icon: '🎯', title: 'Wellness Goals', desc: 'Set daily objectives' },
          { icon: '📊', title: 'Health Insights', desc: 'Review your progress' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300 cursor-pointer border border-blue-500/20 hover:border-blue-400/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -8, scale: 1.05 }}
          >
            <div className="text-5xl mb-4 filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="font-extrabold text-white mb-2 text-xl tracking-tight">{feature.title}</h3>
            <p className="text-sm text-blue-200 font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

