import React from 'react';
import { ShoppingBag, Sparkles, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';

export const FashionPromoBanner: React.FC = () => {
  const scrollToProducts = (id: string) => {
    const el = document.getElementById(id) || document.getElementById('flash-sale');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-[11px] sm:text-xs font-bold mb-3 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>এক্সক্লুসিভ ফ্যাশন ফেস্টিভ্যাল</span>
            </div>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              স্টাইলিশ পোশাক, জুতা ও <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-rose-300">
                লেডিস ব্যাগ স্পেশাল কালেকশন
              </span>
            </h3>

            <p className="mt-2 text-xs sm:text-sm text-rose-100/85 leading-relaxed font-medium">
              সেরা মানের প্রিমিয়াম ফেব্রিক ও আকর্ষণীয় ডিজাইনের ট্রেন্ডি পোশাক, স্টাইলিশ জুতা ও ব্র্যান্ডেড লেডিস ব্যাগে আকর্ষণীয় ছাড়!
            </p>

            {/* Benefit Badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-[11px] text-slate-200">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs">
                <Truck className="w-3.5 h-3.5 text-amber-300" />
                <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-md backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>১০০% কোয়ালিটি গ্যারান্টি</span>
              </span>
            </div>
          </div>

          {/* Right: Category Showcase Cards */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 w-full sm:w-auto shrink-0">
            {/* Card 1: Clothing / পোশাক */}
            <div
              onClick={() => scrollToProducts('flash-sale')}
              className="group cursor-pointer bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-2 sm:p-3 rounded-xl border border-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center w-full sm:w-32 md:w-36"
            >
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden mb-2 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80"
                  alt="Clothing"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                  -৪০%
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                পোশাক-আশাক
              </span>
              <span className="text-[10px] text-rose-200/80 mt-0.5">নতুন ডিজাইন</span>
            </div>

            {/* Card 2: Ladies Bag / লেডিস ব্যাগ */}
            <div
              onClick={() => scrollToProducts('top-rated')}
              className="group cursor-pointer bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-2 sm:p-3 rounded-xl border border-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center w-full sm:w-32 md:w-36"
            >
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden mb-2 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80"
                  alt="Ladies Handbag"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 text-[9px] font-bold px-1 rounded shadow-xs">
                  হট ডিল
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                লেডিস ব্যাগ
              </span>
              <span className="text-[10px] text-rose-200/80 mt-0.5">লেদার ও ক্লাচ</span>
            </div>

            {/* Card 3: Shoes / জুতা */}
            <div
              onClick={() => scrollToProducts('best-sells')}
              className="group cursor-pointer bg-gradient-to-b from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 p-2 sm:p-3 rounded-xl border border-white/15 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col items-center text-center w-full sm:w-32 md:w-36"
            >
              <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden mb-2 bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80"
                  alt="Footwear Shoes"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1 rounded shadow-xs">
                  -৫০%
                </span>
              </div>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                জুতা ও হিল
              </span>
              <span className="text-[10px] text-rose-200/80 mt-0.5">হিল ও স্নিকার্স</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
