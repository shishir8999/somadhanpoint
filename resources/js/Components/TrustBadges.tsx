import React from 'react';
import { Zap, ShieldCheck, Headphones, Users, CreditCard, RefreshCw } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    { label: 'Instant Delivery', icon: Zap, color: 'text-amber-400' },
    { label: '100% Genuine', icon: ShieldCheck, color: 'text-emerald-400' },
    { label: '24/7 Support', icon: Headphones, color: 'text-cyan-400' },
    { label: 'Trusted 10K+', icon: Users, color: 'text-indigo-400' },
    { label: 'Secure Payment', icon: CreditCard, color: 'text-pink-400' },
    { label: 'Replacement', icon: RefreshCw, color: 'text-purple-400' },
  ];

  return (
    <div className="text-center py-10 space-y-6">
      <div>
        <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
          ✦ WHY CHOOSE US
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Built for trust. <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent">Designed for speed.</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Instant delivery, genuine subscriptions and support you can count on.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
        {badges.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-[#0B0F1A] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-none flex flex-col items-center justify-center gap-2 hover:border-blue-400 dark:hover:border-white/20 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className={`w-5 h-5 ${b.color}`} />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{b.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
