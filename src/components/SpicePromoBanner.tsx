import React from 'react';

export const SpicePromoBanner: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="relative rounded-md overflow-hidden bg-gradient-to-r from-[#120a06] via-[#241309] to-[#120a06] text-white p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-950/40 shadow-xs">
        {/* Left: Bengali headline */}
        <div className="text-center md:text-left z-10">
          <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-amber-100 tracking-tight leading-snug">
            সেরা স্বাদে রান্না
          </p>
          <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-amber-400 mt-0.5">
            হোক স্বস্তিতে
          </p>
          <span className="inline-block mt-2 text-[11px] sm:text-xs text-amber-200/80 font-medium border-l-2 border-amber-500 pl-2">
            শতভাগ বিশুদ্ধ ও খাঁটি মসলার নিশ্চয়তা
          </span>
        </div>

        {/* Right: Spice packets & jars visual array */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center z-10">
          {/* Turmeric Powder packet */}
          <div className="w-16 h-22 sm:w-20 sm:h-26 bg-gradient-to-b from-yellow-400 to-amber-500 rounded p-1 shadow-md flex flex-col justify-between items-center border border-amber-300">
            <span className="text-[7px] sm:text-[8px] font-bold text-slate-950">হলুদ গুঁড়া</span>
            <div className="w-8 h-8 rounded-full bg-amber-600/30 flex items-center justify-center text-xs">
              🟡
            </div>
            <span className="text-[6px] sm:text-[7px] text-amber-950 font-semibold">১০০% খাঁটি</span>
          </div>

          {/* Chili Powder packet */}
          <div className="w-16 h-22 sm:w-20 sm:h-26 bg-gradient-to-b from-red-600 to-rose-700 rounded p-1 shadow-md flex flex-col justify-between items-center border border-red-400">
            <span className="text-[7px] sm:text-[8px] font-bold text-white">মরিচ গুঁড়া</span>
            <div className="w-8 h-8 rounded-full bg-red-900/30 flex items-center justify-center text-xs">
              🌶️
            </div>
            <span className="text-[6px] sm:text-[7px] text-rose-100 font-semibold">ঝাল স্পেশাল</span>
          </div>

          {/* Meat Masala */}
          <div className="w-16 h-22 sm:w-20 sm:h-26 bg-gradient-to-b from-amber-700 to-amber-900 rounded p-1 shadow-md flex flex-col justify-between items-center border border-amber-600">
            <span className="text-[7px] sm:text-[8px] font-bold text-amber-100">মাংসের মসলা</span>
            <div className="w-8 h-8 rounded-full bg-amber-950/40 flex items-center justify-center text-xs">
              🥘
            </div>
            <span className="text-[6px] sm:text-[7px] text-amber-200 font-semibold">প্রিমিয়াম টেস্ট</span>
          </div>

          {/* Biryani Masala */}
          <div className="w-16 h-22 sm:w-20 sm:h-26 bg-gradient-to-b from-orange-600 to-amber-800 rounded p-1 shadow-md flex flex-col justify-between items-center border border-orange-400">
            <span className="text-[7px] sm:text-[8px] font-bold text-white">বিরিয়ানি মসলা</span>
            <div className="w-8 h-8 rounded-full bg-orange-950/30 flex items-center justify-center text-xs">
              🍚
            </div>
            <span className="text-[6px] sm:text-[7px] text-orange-100 font-semibold">আসল স্বাদ</span>
          </div>
        </div>
      </div>
    </div>
  );
};
