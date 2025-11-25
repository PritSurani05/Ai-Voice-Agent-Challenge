'use client';

import { motion } from 'motion/react';
import { Button } from '@/components/livekit/button';

interface RazorpayWelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

const featureCards = [
  { icon: '💳', title: '100+ Payment Modes', desc: 'Cards, UPI, Netbanking, Wallets' },
  { icon: '⚡', title: '24–48h Activation', desc: 'Upload docs, go live fast' },
  { icon: '📊', title: 'RazorpayX Banking', desc: 'Automated payouts and analytics' },
];

function GlowingOrb({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl bg-cyan-400/30"
      initial={{ scale: 0.8, opacity: 0.4 }}
      animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.5, 0.2] }}
      transition={{ duration: 6, repeat: Infinity, delay }}
    />
  );
}

export function RazorpayWelcomeView({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & RazorpayWelcomeViewProps) {
  return (
    <div
      ref={ref}
      className="razorpay-gradient relative min-h-screen w-full overflow-hidden px-6 pb-8 pt-10 flex flex-col items-center"
    >
      <div className="pointer-events-none absolute inset-0">
        <GlowingOrb delay={0} />
        <GlowingOrb delay={1.2} />
        <GlowingOrb delay={2.4} />
      </div>

      <motion.div
        className="relative z-10 text-center mb-8"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p 
          className="text-cyan-300 font-bold tracking-[0.5em] text-sm md:text-base uppercase mb-6 relative inline-block"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="relative z-10 bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-200 bg-clip-text text-transparent font-extrabold drop-shadow-[0_0_15px_rgba(14,165,233,0.5)]">
            RAZORPAY
          </span>
          <span className="text-cyan-100/80 ml-2">SDR DESK</span>
        </motion.p>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-2">
          Power growth with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-200 to-indigo-200">
            India&apos;s #1 payment stack
          </span>
        </h1>
        <p className="mt-4 text-cyan-100/90 text-lg max-w-2xl mx-auto">
          Ask anything about <span className="font-semibold text-cyan-200">Razorpay</span>&apos;s payment gateway, <span className="font-semibold text-cyan-200">RazorpayX</span> banking, or payouts.
          I&apos;ll capture your details and share the next steps with the sales team instantly.
        </p>
      </motion.div>

      {/* Button and Cards Container */}
      <div className="relative z-10 w-full max-w-7xl mt-8 md:mt-12">
        {/* Desktop: Side Cards and Button Layout */}
        <div className="hidden md:block relative w-full">
          {/* Card 1 - Left Side (Absolute positioned) */}
          <motion.div
            className="absolute left-0 lg:left-4 top-8 w-56 lg:w-64"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <motion.div
              className="rounded-3xl border border-cyan-200/20 bg-white/5 p-5 lg:p-6 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)] relative overflow-hidden"
              whileHover={{ scale: 1.05, rotate: -2 }}
            >
              <span className="text-4xl mb-3 block">{featureCards[0].icon}</span>
              <h3 className="text-lg lg:text-xl font-bold mb-2">{featureCards[0].title}</h3>
              <p className="text-sm text-cyan-100/90">{featureCards[0].desc}</p>
            </motion.div>
          </motion.div>

          {/* Start Call Button - Center */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              className="bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white px-12 py-6 rounded-full shadow-[0_20px_60px_rgba(14,165,233,0.35)] text-lg font-semibold"
            >
              {startButtonText || 'Talk to Razorpay'}
            </Button>
          </motion.div>

          {/* Card 2 - Right Side (Absolute positioned) */}
          <motion.div
            className="absolute right-0 lg:right-4 top-8 w-56 lg:w-64"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 100 }}
          >
            <motion.div
              className="rounded-3xl border border-cyan-200/20 bg-white/5 p-5 lg:p-6 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)] relative overflow-hidden"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <span className="text-4xl mb-3 block">{featureCards[1].icon}</span>
              <h3 className="text-lg lg:text-xl font-bold mb-2">{featureCards[1].title}</h3>
              <p className="text-sm text-cyan-100/90">{featureCards[1].desc}</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile: Button and Stacked Cards */}
        <div className="md:hidden flex flex-col items-center">
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 180 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={onStartCall}
              className="bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white px-12 py-6 rounded-full shadow-[0_20px_60px_rgba(14,165,233,0.35)] text-lg font-semibold"
            >
              {startButtonText || 'Talk to Razorpay'}
            </Button>
          </motion.div>
          
          <div className="mt-8 space-y-6 w-full px-4">
            {featureCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.2, type: 'spring', stiffness: 100 }}
              >
                <motion.div
                  className="rounded-3xl border border-cyan-200/20 bg-white/5 p-6 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)]"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="text-4xl mb-3 block">{card.icon}</span>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-cyan-100/90">{card.desc}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Card 3 - Below Button (Desktop) */}
        <motion.div
          className="hidden md:flex justify-center mt-6 lg:mt-7"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="w-full max-w-md lg:max-w-lg"
            whileHover={{ scale: 1.03, y: -5 }}
          >
            <motion.div
              className="rounded-3xl border border-cyan-200/20 bg-white/5 p-6 lg:p-7 backdrop-blur-xl text-white shadow-[0_20px_80px_rgba(15,23,42,0.45)] relative overflow-hidden"
            >
              <div className="flex items-start gap-4">
                <span className="text-5xl flex-shrink-0">{featureCards[2].icon}</span>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-2">{featureCards[2].title}</h3>
                  <p className="text-sm lg:text-base text-cyan-100/90">{featureCards[2].desc}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}


