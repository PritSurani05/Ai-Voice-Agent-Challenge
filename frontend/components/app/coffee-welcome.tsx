'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/livekit/button';

function CoffeeCup() {
  return (
    <motion.div
      className="relative mb-4"
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-48 h-48 bg-purple-500/25 rounded-full blur-3xl"
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
          className="absolute w-36 h-36 bg-pink-500/20 rounded-full blur-2xl"
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
      
      {/* Dribbble-style Coffee Animation */}
      <motion.svg
        width="140"
        height="160"
        viewBox="0 0 140 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        style={{ filter: 'drop-shadow(0 25px 50px rgba(139, 92, 246, 0.4))' }}
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
          {/* Cup gradient */}
          <linearGradient id="cupGrad" x1="35" y1="25" x2="105" y2="115">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="30%" stopColor="#B8865B" />
            <stop offset="70%" stopColor="#8B6F47" />
            <stop offset="100%" stopColor="#6F4E37" />
          </linearGradient>
          
          {/* Coffee gradient with depth */}
          <linearGradient id="coffeeGrad" x1="40" y1="30" x2="100" y2="110">
            <stop offset="0%" stopColor="#9D6B47" />
            <stop offset="40%" stopColor="#7A5235" />
            <stop offset="100%" stopColor="#5C3D28" />
          </linearGradient>
          
          {/* Foam gradient */}
          <linearGradient id="foamGrad" x1="40" y1="25" x2="100" y2="35">
            <stop offset="0%" stopColor="#FFF8E7" />
            <stop offset="50%" stopColor="#E8D5B7" />
            <stop offset="100%" stopColor="#D4B896" />
          </linearGradient>
          
          {/* Steam gradient */}
          <linearGradient id="steamGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Cup shadow */}
        <ellipse cx="70" cy="125" rx="35" ry="10" fill="rgba(0, 0, 0, 0.15)" opacity="0.6" />
        
        {/* Cup body - modern rounded design */}
        <motion.path
          d="M35 30 L35 115 Q35 125 45 125 L95 125 Q105 125 105 115 L105 30 Q105 25 100 25 L40 25 Q35 25 35 30 Z"
          fill="url(#cupGrad)"
          stroke="#6F4E37"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        
        {/* Cup handle - smooth curve */}
        <motion.path
          d="M105 60 Q125 55 130 70 Q130 90 115 95"
          fill="none"
          stroke="#6F4E37"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        />
        
        {/* Coffee liquid with wave animation */}
        <motion.path
          fill="url(#coffeeGrad)"
          initial={{ d: "M40 35 L40 110 Q40 115 45 115 L95 115 Q100 115 100 110 L100 35 Z" }}
          animate={{
            d: [
              "M40 35 L40 110 Q40 115 45 115 L95 115 Q100 115 100 110 L100 35 Z",
              "M40 35 L40 110 Q40 115 45 115 L95 115 Q100 115 100 110 L100 35 Q100 33 98 33 L42 33 Q40 33 40 35 Z",
              "M40 35 L40 110 Q40 115 45 115 L95 115 Q100 115 100 110 L100 35 Z",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Foam layer with animated bubbles */}
        <motion.ellipse
          cx="70"
          rx="30"
          fill="url(#foamGrad)"
          initial={{ cy: 30, ry: 10 }}
          animate={{
            ry: [10, 12, 10],
            cy: [30, 29, 30],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Animated foam bubbles */}
        {[
          { cx: 55, cy: 27, r: 2.5, delay: 0 },
          { cx: 70, cy: 28, r: 2, delay: 0.3 },
          { cx: 85, cy: 27, r: 1.8, delay: 0.6 },
          { cx: 62, cy: 30, r: 1.5, delay: 0.9 },
          { cx: 78, cy: 29, r: 1.3, delay: 1.2 },
        ].map((bubble, i) => (
          <motion.circle
            key={i}
            cx={bubble.cx ?? 70}
            r={bubble.r ?? 2}
            fill="rgba(255, 255, 255, 0.7)"
            initial={{ cy: bubble.cy ?? 28, opacity: 0.5, scale: 1 }}
            animate={{
              cy: [bubble.cy ?? 28, (bubble.cy ?? 28) - 2, bubble.cy ?? 28],
              opacity: [0.5, 0.9, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: bubble.delay ?? 0,
            }}
          />
        ))}
        
        {/* Smooth steam wisps - Dribbble style */}
        {[
          { x: 50, delay: 0, width: 3 },
          { x: 70, delay: 0.4, width: 3.5 },
          { x: 90, delay: 0.8, width: 3 },
        ].map((steam, i) => {
          const x = steam.x ?? 70;
          const width = steam.width ?? 3;
          const delay = steam.delay ?? 0;
          const path1Initial = `M${x} 20 Q${x} 10 ${x + 3} 5 Q${x + 6} 0 ${x + 8} -2`;
          const path2Initial = `M${x} 20 Q${x} 12 ${x - 2} 7 Q${x - 4} 2 ${x - 6} 0`;
          
          return (
            <motion.g key={i}>
              <motion.path
                fill="none"
                stroke="url(#steamGrad)"
                strokeWidth={width}
                strokeLinecap="round"
                initial={{ d: path1Initial, opacity: 0.4 }}
                animate={{
                  d: [
                    path1Initial,
                    `M${x} 20 Q${x + 2} 10 ${x + 5} 5 Q${x + 8} 0 ${x + 10} -2`,
                    `M${x} 20 Q${x - 2} 10 ${x + 1} 5 Q${x + 4} 0 ${x + 6} -2`,
                    path1Initial,
                  ],
                  opacity: [0.4, 0.9, 0.7, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay,
                }}
                style={{ filter: 'blur(1px) drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))' }}
              />
              <motion.path
                fill="none"
                stroke="url(#steamGrad)"
                strokeWidth={width * 0.7}
                strokeLinecap="round"
                initial={{ d: path2Initial, opacity: 0.3 }}
                animate={{
                  d: [
                    path2Initial,
                    `M${x} 20 Q${x - 2} 12 ${x - 4} 7 Q${x - 6} 2 ${x - 8} 0`,
                    `M${x} 20 Q${x + 2} 12 ${x} 7 Q${x - 2} 2 ${x - 4} 0`,
                    path2Initial,
                  ],
                  opacity: [0.3, 0.8, 0.6, 0.3],
                }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: delay + 0.2,
                }}
                style={{ filter: 'blur(1px) drop-shadow(0 0 6px rgba(167, 139, 250, 0.5))' }}
              />
            </motion.g>
          );
        })}
      </motion.svg>

      {/* Floating coffee beans - smooth motion */}
      {[
        { x: -8, y: -8, size: 8, delay: 0 },
        { x: 8, y: -6, size: 6, delay: 0.5 },
      ].map((bean, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${50 + bean.x}%`,
            top: `${-5 + bean.y}%`,
            width: `${bean.size * 4}px`,
            height: `${bean.size * 4}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, bean.x * 0.5, 0],
            rotate: [0, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: bean.delay,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <ellipse cx="12" cy="12" rx="8" ry="12" fill="#8B6F47" />
            <path d="M12 4 Q8 8 12 12 Q16 8 12 4" fill="#6F4E37" opacity="0.6" />
            <ellipse cx="12" cy="8" rx="3" ry="2" fill="rgba(255, 255, 255, 0.25)" />
          </svg>
        </motion.div>
      ))}
      
      {/* Floating particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-purple-300/50 rounded-full"
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

function ZeptoBadge() {
  return (
    <motion.div
      className="mb-3 flex items-center gap-2 justify-center flex-wrap"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
    >
      <div className="glass-card rounded-full px-5 py-2 glow-purple">
        <span className="text-sm font-bold bg-gradient-to-r from-purple-200 to-purple-100 bg-clip-text text-transparent">
          ZEPTO CAFE
        </span>
      </div>
      <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 shadow-lg shadow-green-500/30">
        <span className="text-xs font-bold text-white">₹0 Convenience Fee</span>
      </div>
    </motion.div>
  );
}

interface CoffeeWelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const CoffeeWelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & CoffeeWelcomeViewProps) => {
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
              className="absolute w-1.5 h-1.5 bg-purple-400/20 rounded-full"
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

      {/* Zepto Branding - Extra Large */}
      <motion.div
        className="mb-6 text-center relative z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black bg-gradient-to-r from-purple-200 via-purple-100 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2 tracking-tighter leading-none animate-text-shimmer">
          zepto
        </h1>
        <p className="text-purple-200 font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-[0.3em] uppercase letter-spacing-wider">CAFE</p>
      </motion.div>

      {/* Coffee Cup Animation - Smaller to save space */}
      <motion.div
        className="mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <CoffeeCup />
      </motion.div>

      {/* Subtitle - Compact, removed "Enjoy Your Morning Coffee" */}
      <motion.p
        className="text-purple-200 text-lg md:text-xl mb-6 text-center max-w-2xl leading-relaxed relative z-10 px-4 font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Order in minutes with our AI barista!
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
          className="relative w-72 md:w-80 h-14 md:h-16 text-base md:text-lg font-bold bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-white rounded-full glow-purple overflow-hidden group transition-all duration-300 shadow-lg shadow-purple-600/40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {startButtonText || 'START CALL'}
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
          { icon: '⚡', title: '10-Min Delivery', desc: 'Lightning fast service' },
          { icon: '☕', title: 'Fresh Brewed', desc: 'Premium coffee beans' },
          { icon: '🎯', title: 'AI Barista', desc: 'Smart order taking' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            className="glass-card rounded-3xl p-8 text-center group hover:scale-105 transition-all duration-300 cursor-pointer border border-purple-500/20 hover:border-purple-400/40"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            whileHover={{ y: -8, scale: 1.05 }}
          >
            <div className="text-5xl mb-4 filter drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
              {feature.icon}
            </div>
            <h3 className="font-extrabold text-white mb-2 text-xl tracking-tight">{feature.title}</h3>
            <p className="text-sm text-purple-200 font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

