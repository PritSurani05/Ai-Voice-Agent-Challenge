'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface OrderDetails {
  drinkType: string;
  size: string;
  milk: string;
  extras: string[];
  name: string;
}

interface OrderReceiptProps {
  order: OrderDetails;
  className?: string;
}

export function OrderReceipt({ order, className }: OrderReceiptProps) {
  const formatField = (value: string) => {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const calculateTotal = () => {
    // Simple pricing logic - you can customize this
    const basePrice = 5.0;
    const sizeMultiplier: Record<string, number> = {
      small: 1.0,
      medium: 1.2,
      large: 1.4,
      tall: 1.0,
      grande: 1.2,
      venti: 1.4,
    };
    const extraPrice = order.extras.length * 0.5;
    const sizePrice = basePrice * (sizeMultiplier[order.size.toLowerCase()] || 1.2);
    return (sizePrice + extraPrice).toFixed(2);
  };

  return (
    <motion.div
      className={cn(
        'glass-card rounded-3xl p-8 md:p-10 max-w-md mx-auto border border-purple-500/30 shadow-2xl shadow-purple-900/20',
        className
      )}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="text-center mb-6 pb-6 border-b border-purple-500/20">
        <motion.h2
          className="text-3xl font-black bg-gradient-to-r from-purple-200 via-purple-100 to-pink-200 bg-clip-text text-transparent mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ZEPTO CAFE
        </motion.h2>
        <motion.p
          className="text-purple-300 text-sm font-semibold tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ORDER RECEIPT
        </motion.p>
      </div>

      {/* Order Details */}
      <div className="space-y-4 mb-6">
        <motion.div
          className="flex justify-between items-center py-2 border-b border-purple-500/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-purple-300 font-medium">Drink:</span>
          <span className="text-white font-bold">{formatField(order.drinkType)}</span>
        </motion.div>

        <motion.div
          className="flex justify-between items-center py-2 border-b border-purple-500/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-purple-300 font-medium">Size:</span>
          <span className="text-white font-bold">{formatField(order.size)}</span>
        </motion.div>

        <motion.div
          className="flex justify-between items-center py-2 border-b border-purple-500/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-purple-300 font-medium">Milk:</span>
          <span className="text-white font-bold">{formatField(order.milk)}</span>
        </motion.div>

        {order.extras.length > 0 && (
          <motion.div
            className="py-2 border-b border-purple-500/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-purple-300 font-medium block mb-2">Extras:</span>
            <div className="flex flex-wrap gap-2">
              {order.extras.map((extra, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-700/30 rounded-full text-white text-sm font-medium border border-purple-500/30"
                >
                  {formatField(extra)}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="flex justify-between items-center py-2 border-b border-purple-500/10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <span className="text-purple-300 font-medium">Name:</span>
          <span className="text-white font-bold">{formatField(order.name)}</span>
        </motion.div>
      </div>

      {/* Total */}
      <motion.div
        className="flex justify-between items-center pt-4 border-t-2 border-purple-500/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
      >
        <span className="text-purple-200 font-bold text-lg">Total:</span>
        <span className="text-white font-black text-2xl">${calculateTotal()}</span>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="mt-6 pt-4 text-center border-t border-purple-500/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <p className="text-purple-400 text-xs font-medium">
          Thank you for your order!
        </p>
        <p className="text-purple-500 text-xs mt-1">
          Your order will be ready shortly
        </p>
      </motion.div>
    </motion.div>
  );
}

