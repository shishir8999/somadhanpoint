import React, { useState, useEffect } from 'react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { settings } = useStoreSettings();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = settings.banners && settings.banners.length > 0 ? settings.banners : [];

  // Auto-play slider
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  if (banners.length > 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-2 select-none">
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-xs aspect-[16/9] sm:aspect-[21/9] md:aspect-[28/8] min-h-[160px] sm:min-h-[220px] md:min-h-[280px] bg-slate-900 group"
        >
          {banners.map((b, idx) => (
            <div
              key={b.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={b.imageUrl}
                alt="Banner"
                className="w-full h-full object-cover object-center"
              />
              {b.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex items-end p-3.5 sm:p-6 pb-6 sm:pb-7">
                  <h3 className="text-white text-xs sm:text-lg md:text-2xl font-black drop-shadow-md line-clamp-2 max-w-[85%] sm:max-w-none leading-snug">
                    {b.title}
                  </h3>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-1.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-1.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx ? 'w-4 sm:w-5 bg-white' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Fallback default Mustard oil banner if no banners
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="relative rounded-md overflow-hidden bg-gradient-to-r from-[#1a120b] via-[#2d1b09] to-[#0f0a05] text-white min-h-[180px] sm:min-h-[220px] md:min-h-[260px] flex items-center shadow-xs">
        <div className="w-full px-6 sm:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <div className="w-20 sm:w-26 h-36 sm:h-44 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 rounded-lg shadow-xl border-2 border-amber-300/60 flex flex-col items-center justify-between p-2 relative">
              <div className="w-8 h-4 bg-red-600 rounded-t-sm -mt-3 shadow"></div>
              <div className="w-16 h-14 bg-white/95 rounded flex flex-col items-center justify-center p-1 text-center shadow-xs">
                <span className="text-[10px] sm:text-xs font-black text-red-700">সরিষার</span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-900">তৈল</span>
                <span className="text-[7px] text-emerald-700 font-semibold">১০০% খাঁটি</span>
              </div>
              <span className="text-[8px] text-amber-950 font-bold bg-amber-200/90 px-1 rounded">৫ লিটার</span>
            </div>
            <div className="w-14 sm:w-18 h-28 sm:h-34 bg-gradient-to-b from-amber-400 to-amber-600 rounded-md shadow-lg border border-amber-300 flex flex-col items-center justify-between p-1.5 relative">
              <div className="w-6 h-3 bg-red-600 rounded-t-xs -mt-2.5"></div>
              <div className="w-12 h-10 bg-white/90 rounded flex flex-col items-center justify-center text-center">
                <span className="text-[8px] font-bold text-red-700">ঘানি ভাঙা</span>
              </div>
              <span className="text-[7px] text-amber-950 font-bold">১ লিটার</span>
            </div>
          </div>
          <div className="text-center md:text-right flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug drop-shadow-md">
              স্বাস্থ্যকর তেলে
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-amber-300 mt-1 drop-shadow">
              অ্যাক্টিভ থাকুন প্রতিদিন
            </p>
            <div className="mt-3 inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-1.5 rounded shadow cursor-pointer transition-colors">
              অর্ডার করুন এখনই →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
