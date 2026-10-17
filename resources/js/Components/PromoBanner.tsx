import React, { useState } from 'react';
import { Sparkles, Copy, Check, Tag } from 'lucide-react';

export const PromoBanner: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const promoCode = 'RXBE1D001';

  const copyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#201505] via-[#352309] to-[#120B02] border border-amber-500/30 p-6 sm:p-8 shadow-2xl">
      {/* Decorative Gold Glow */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>New Special Offer</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Buy Any 3 Products & Get <span className="text-amber-400">৳50 - ৳100 Off</span>
          </h3>

          <p className="text-xs text-amber-200/80 max-w-md">
            Auto applied at checkout • Limited time only • Smarter shopping • More savings
          </p>
        </div>

        {/* Promo Code Box */}
        <div className="flex items-center gap-2 bg-black/60 border border-amber-500/40 p-2.5 rounded-2xl backdrop-blur-md shrink-0">
          <Tag className="w-4 h-4 text-amber-400 ml-1.5" />
          <div className="flex flex-col pr-3">
            <span className="text-[10px] text-amber-300/70 uppercase tracking-widest font-bold">PROMO CODE</span>
            <span className="font-mono font-black text-white text-sm tracking-wider">{promoCode}</span>
          </div>
          <button
            onClick={copyCode}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'কপি হয়েছে' : 'কপি করুন'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
