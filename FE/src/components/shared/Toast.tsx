'use client';

import React from 'react';
import { useApp } from '@/stores/AppContext';
import { CheckCircle2, ShoppingBag, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-panel-glow text-white shadow-2xl border border-white/15 backdrop-blur-xl"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
              )}
              {toast.type === 'cart' && (
                <div className="w-6 h-6 rounded-full bg-[#c89b3c]/20 text-[#e6bf70] flex items-center justify-center">
                  <ShoppingBag size={16} />
                </div>
              )}
              {toast.type === 'info' && (
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Info size={16} />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white tracking-tight">{toast.title}</p>
              <p className="text-xs text-neutral-300 mt-0.5 line-clamp-2 leading-relaxed">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Đóng thông báo"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
