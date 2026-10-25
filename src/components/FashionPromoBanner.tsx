import React from 'react';
import { Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { useStoreSettings, DEFAULT_PROMO_BANNER_SETTINGS } from '../context/StoreSettingsContext';

export const FashionPromoBanner: React.FC = () => {
  const { settings } = useStoreSettings();
  const promo = settings.promoBanner || DEFAULT_PROMO_BANNER_SETTINGS;

  // If disabled or no promo cards, do not render
  if (promo.enabled === false || !promo.cards || promo.cards.length === 0) {
    return null;
  }

  const handleCardClick = (link: string) => {
    if (!link) return;
    if (link.startsWith('#')) {
      const targetId = link.replace('#', '');
      const el = document.getElementById(targetId) || document.getElementById('flash-sale');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.location.href = link;
    } else if (link.startsWith('/')) {
      window.location.href = link;
    } else {
      const el = document.getElementById(link);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-4">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#18080c] via-[#2d0f17] to-[#140609] text-white p-5 sm:p-8 border border-rose-900/40 shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* Left: Headline & Highlights */}
          <div className="text-center lg:text-left flex-1 max-w-xl">
            {promo.badgeText && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] sm:text-xs font-bold mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{promo.badgeText}</span>
              </div>
            )}

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              {promo.title}
              {promo.highlightTitle && (
                <>
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300 ml-1.5 sm:ml-0">
                    {promo.highlightTitle}
                  </span>
                </>
              )}
            </h3>

            {promo.description && (
              <p className="mt-2 text-xs sm:text-sm text-rose-100/85 leading-relaxed font-medium">
                {promo.description}
              </p>
            )}

            {/* Benefit Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] text-slate-200">
              {promo.feature1Text && (
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  <Truck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                  <span>{promo.feature1Text}</span>
                </span>
              )}
              {promo.feature2Text && (
                <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{promo.feature2Text}</span>
                </span>
              )}
            </div>
          </div>

          {/* Right: Dynamic Category Showcase Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full sm:w-auto shrink-0 justify-center">
            {promo.cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.link)}
                className="group cursor-pointer bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-2 sm:p-3 rounded-xl border border-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center w-full sm:w-32 md:w-36"
              >
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden mb-2 bg-slate-800">
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&auto=format&fit=crop&q=80';
                    }}
                  />
                  {card.tagText && (
                    <span
                      style={{ backgroundColor: card.tagBg || '#e11d48' }}
                      className="absolute top-1 right-1 text-white text-[9px] font-bold px-1 rounded shadow-xs"
                    >
                      {card.tagText}
                    </span>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                  {card.title}
                </span>
                {card.subtitle && (
                  <span className="text-[10px] text-rose-200/80 mt-0.5 line-clamp-1">
                    {card.subtitle}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
