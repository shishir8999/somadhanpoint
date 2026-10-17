import React from 'react';
import { Heart, Crown, Sparkles, Bot, ShoppingCart } from 'lucide-react';
import { AISubscriptionPlan } from '../types';

interface ProductCardProps {
  plan: AISubscriptionPlan;
  isWishlisted: boolean;
  isUserPlan: boolean;
  currency: 'BDT' | 'USD';
  bdtToUsdRate: number;
  onSelectPlan: (plan: AISubscriptionPlan) => void;
  onToggleWishlist: (planId: string) => void;
  onOpenWorkspace: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  plan,
  isWishlisted,
  isUserPlan,
  currency,
  bdtToUsdRate,
  onSelectPlan,
  onToggleWishlist,
  onOpenWorkspace,
}) => {
  const formatPrice = () => {
    if (currency === 'USD') {
      return `$${plan.priceUSD.toFixed(2)}`;
    }
    return `৳${plan.priceBDT.toLocaleString()}`;
  };

  const formatOriginalPrice = () => {
    if (currency === 'USD') {
      return `$${(plan.originalPriceBDT / bdtToUsdRate).toFixed(2)}`;
    }
    return `৳${plan.originalPriceBDT.toLocaleString()}`;
  };

  // Get brand specific visual styling and icons
  const getBrandVisual = () => {
    const name = (plan.name || '').toLowerCase();
    const provider = (plan.provider || '').toLowerCase();
    const icon = (plan.iconName || '').toLowerCase();

    // 1. ChatGPT (OpenAI)
    if (name.includes('chatgpt') || provider.includes('openai') || icon.includes('chatgpt') || icon.includes('openai')) {
      return {
        bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-[#0A261D] dark:to-slate-950',
        ring: 'border-emerald-500/30 dark:border-emerald-500/40',
        text: 'text-emerald-700 dark:text-emerald-400',
        symbol: 'ChatGPT-5.5',
        icon: (
          <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729z" />
          </svg>
        ),
      };
    }

    // 2. Claude (Anthropic)
    if (name.includes('claude') || provider.includes('anthropic') || icon.includes('claude') || icon.includes('anthropic')) {
      return {
        bg: 'from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-[#2B1B0A] dark:to-slate-950',
        ring: 'border-amber-500/30 dark:border-amber-500/40',
        text: 'text-amber-700 dark:text-amber-400',
        symbol: 'Claude 3.7 Sonnet',
        icon: (
          <span className="text-3xl text-amber-600 dark:text-amber-400 font-extrabold leading-none">✳</span>
        ),
      };
    }

    // 3. Google (Gemini)
    if (name.includes('google') || name.includes('gemini') || provider.includes('google') || icon.includes('gemini') || icon.includes('google')) {
      return {
        bg: 'from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-950/40 dark:via-[#0D1B2A] dark:to-slate-950',
        ring: 'border-blue-500/30 dark:border-blue-500/40',
        text: 'text-blue-700 dark:text-blue-400',
        symbol: 'Google Gemini',
        icon: (
          <Sparkles className="w-8 h-8 text-blue-500" />
        ),
      };
    }

    // 4. Canva Pro
    if (name.includes('canva') || icon.includes('canva')) {
      return {
        bg: 'from-cyan-500/10 via-teal-500/5 to-transparent dark:from-cyan-950/40 dark:via-[#0C2B36] dark:to-slate-950',
        ring: 'border-cyan-500/30 dark:border-cyan-500/40',
        text: 'text-cyan-700 dark:text-cyan-300',
        symbol: 'Canva Pro',
        icon: (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center text-white font-black text-sm italic shadow-sm">
            C
          </div>
        ),
      };
    }

    // 5. CapCut Pro
    if (name.includes('capcut') || icon.includes('capcut')) {
      return {
        bg: 'from-slate-500/10 via-slate-500/5 to-transparent dark:from-zinc-900/60 dark:via-neutral-900 dark:to-black',
        ring: 'border-slate-500/30 dark:border-zinc-500/40',
        text: 'text-slate-900 dark:text-white',
        symbol: 'CapCut PRO',
        icon: (
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs tracking-tighter shadow-sm">
            ⧖ PRO
          </div>
        ),
      };
    }

    // 6. Midjourney
    if (name.includes('midjourney') || icon.includes('midjourney')) {
      return {
        bg: 'from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-950/40 dark:via-[#200B36] dark:to-slate-950',
        ring: 'border-purple-500/30 dark:border-purple-500/40',
        text: 'text-purple-700 dark:text-purple-400',
        symbol: 'Midjourney v6',
        icon: (
          <span className="text-2xl">⛵</span>
        ),
      };
    }

    // 7. Netflix
    if (name.includes('netflix') || icon.includes('netflix')) {
      return {
        bg: 'from-red-500/10 via-red-500/5 to-transparent dark:from-red-950/40 dark:via-[#2E080C] dark:to-slate-950',
        ring: 'border-red-500/30 dark:border-red-500/40',
        text: 'text-red-600 dark:text-red-500',
        symbol: 'NETFLIX 4K',
        icon: (
          <span className="font-black text-xl text-red-600 tracking-wider">N</span>
        ),
      };
    }

    // 8. Amazon Prime Video
    if (name.includes('prime') || icon.includes('prime')) {
      return {
        bg: 'from-sky-500/10 via-sky-500/5 to-transparent dark:from-sky-950/40 dark:via-[#082032] dark:to-slate-950',
        ring: 'border-sky-500/30 dark:border-sky-500/40',
        text: 'text-sky-700 dark:text-sky-400',
        symbol: 'Prime Video',
        icon: (
          <span className="font-bold text-xs font-mono text-sky-600">prime</span>
        ),
      };
    }

    // 9. Windows
    if (name.includes('windows') || icon.includes('windows')) {
      return {
        bg: 'from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-[#0B2545] dark:to-slate-950',
        ring: 'border-blue-500/30 dark:border-blue-500/40',
        text: 'text-blue-700 dark:text-blue-400',
        symbol: 'Windows 11 Pro',
        icon: (
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <span className="bg-blue-600 rounded-2xs" />
            <span className="bg-blue-600 rounded-2xs" />
            <span className="bg-blue-600 rounded-2xs" />
            <span className="bg-blue-600 rounded-2xs" />
          </div>
        ),
      };
    }

    // 10. Microsoft Office
    if (name.includes('office') || icon.includes('office')) {
      return {
        bg: 'from-orange-500/10 via-orange-500/5 to-transparent dark:from-orange-950/40 dark:via-[#2E1408] dark:to-slate-950',
        ring: 'border-orange-500/30 dark:border-orange-500/40',
        text: 'text-orange-700 dark:text-orange-400',
        symbol: 'Office 365',
        icon: (
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
            O
          </div>
        ),
      };
    }

    // Default Fallback
    return {
      bg: 'from-indigo-500/10 via-indigo-500/5 to-transparent dark:from-indigo-950/40 dark:via-[#10142B] dark:to-slate-950',
      ring: 'border-indigo-500/30 dark:border-indigo-500/40',
      text: 'text-indigo-700 dark:text-indigo-400',
      symbol: plan.provider || 'AI Service',
      icon: (
        <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
      ),
    };
  };

  const visual = getBrandVisual();

  return (
    <div
      onClick={() => onSelectPlan(plan)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-white/10 hover:border-blue-500 dark:hover:border-indigo-500 transition-all duration-200 cursor-pointer overflow-hidden shadow-xs hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-none hover:-translate-y-1 select-none"
    >
      {/* Top Banner & Wishlist Button */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        {plan.badge ? (
          <span className="pointer-events-auto px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black tracking-wider text-[9px] uppercase shadow-xs">
            {plan.badge}
          </span>
        ) : (
          <span className="pointer-events-auto px-1.5 py-0.5 rounded bg-white/90 dark:bg-black/60 text-[9px] font-mono text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-xs">
            {plan.provider}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(plan.id);
          }}
          className="pointer-events-auto p-1.5 rounded-full bg-white/90 dark:bg-black/60 hover:bg-white dark:hover:bg-black text-slate-600 dark:text-white transition backdrop-blur-sm border border-slate-200 dark:border-white/10 shadow-xs cursor-pointer"
          title="উইশলিস্টে যোগ করুন"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Visual Image / Brand Frame */}
      {plan.imageUrl ? (
        <div className="relative h-44 w-full bg-slate-50 dark:bg-slate-900/60 flex items-center justify-center p-4 border-b border-slate-200/80 dark:border-white/[0.08] overflow-hidden">
          <img
            src={plan.imageUrl}
            alt={plan.name}
            className="max-h-32 max-w-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <div className={`relative h-44 w-full bg-gradient-to-b ${visual.bg} flex flex-col items-center justify-center p-4 border-b border-slate-200/80 dark:border-white/[0.08] overflow-hidden`}>
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/[0.03] dark:from-white/[0.05] via-transparent to-transparent pointer-events-none" />

          {/* Brand Icon Badge */}
          <div className="mb-2 shadow-sm transform group-hover:scale-110 transition-transform duration-200">
            {visual.icon}
          </div>

          {/* Main Brand Symbol Emblem */}
          <div className={`font-black text-base sm:text-lg tracking-tight ${visual.text} text-center drop-shadow-xs select-none`}>
            {visual.symbol}
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider mt-0.5 uppercase">
            {plan.category}
          </div>

          {/* Out of stock overlay if applicable */}
          {plan.isOutOfStock && (
            <div className="absolute inset-0 bg-white/90 dark:bg-black/80 backdrop-blur-xs flex items-center justify-center">
              <span className="px-3 py-1 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-md shadow-lg">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>
      )}

      {/* Card Content & Price */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2">
        <div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-indigo-300 transition-colors line-clamp-1">
            {plan.name}
          </h3>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-950 dark:text-white font-mono tabular-nums">
              {formatPrice()}
            </span>
            {plan.originalPriceBDT > plan.priceBDT && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 line-through font-mono tabular-nums">
                {formatOriginalPrice()}
              </span>
            )}
          </div>

          {/* Credit Points & Validity Notice */}
          <div className="mt-2 flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.05]">
            <span className="text-blue-600 dark:text-cyan-300 font-bold">
              💎 +{plan.priceBDT} ক্রেডিট
            </span>
            <span className="text-amber-600 dark:text-amber-300 font-medium">
              ⏳ {plan.billingCycle === 'yearly' ? '৩৬৫ দিন' : '৩০ দিন'}
            </span>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center gap-1.5">
          {isUserPlan ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenWorkspace();
              }}
              className="w-full bg-emerald-50 dark:bg-emerald-600/30 hover:bg-emerald-100 dark:hover:bg-emerald-600/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition border border-emerald-200 dark:border-emerald-500/30 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>ব্যবহার করুন</span>
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectPlan(plan);
              }}
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-slate-900 dark:hover:bg-indigo-600 text-white text-[11px] font-bold py-1.5 px-2 rounded-lg border border-blue-600 dark:border-white/10 flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer hover:scale-101 active:scale-98"
            >
              <ShoppingCart className="w-3 h-3 text-white" />
              <span>সাবস্ক্রাইব</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
