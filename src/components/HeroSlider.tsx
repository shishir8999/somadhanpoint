import React, { useState, useEffect, useRef } from 'react';
import { useStoreSettings, FASHION_DEFAULT_BANNERS, BannerSlide } from '../context/StoreSettingsContext';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { settings } = useStoreSettings();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Fallback to fashion default banners if settings.banners is empty or invalid
  const banners: BannerSlide[] =
    settings.banners && settings.banners.length > 0
      ? settings.banners
      : FASHION_DEFAULT_BANNERS;

  // Auto-slide effect with pause-on-hover (6 seconds for smooth slow motion)
  useEffect(() => {
    if (banners.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length, isHovered]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const handleSlideClick = (slide: BannerSlide) => {
    if (slide.link) {
      if (slide.link.startsWith('#')) {
        const el = document.querySelector(slide.link);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      } else if (slide.link.startsWith('http://') || slide.link.startsWith('https://')) {
        window.open(slide.link, '_blank');
        return;
      }
    }
    // Default fallback: scroll to flash sale or hot deals
    const target = document.getElementById('flash-sale') || document.getElementById('hot-deals');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Touch swipe support for mobile devices
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-2 select-none">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[21/9] md:aspect-[24/8] min-h-[190px] sm:min-h-[250px] md:min-h-[320px] bg-slate-950 group"
      >
        {banners.map((b, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={b.id || idx}
              onClick={() => handleSlideClick(b)}
              className={`absolute inset-0 cursor-pointer transition-opacity duration-1500 sm:duration-2000 ease-in-out ${
                isActive
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Fashion Photo with Cinematic Slow Motion Zoom */}
              <img
                src={b.imageUrl}
                alt={b.title || 'Fashion Banner'}
                className={`w-full h-full object-cover object-center transform transition-transform duration-[6000ms] ease-out ${
                  isActive ? 'scale-100' : 'scale-110'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />

              {/* Rich Fashion Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent sm:from-black/80 sm:via-black/35 sm:to-black/10" />

              {/* Content Overlay with gentle slow-motion entrance */}
              <div
                className={`absolute inset-0 flex flex-col justify-center px-4 sm:px-10 md:px-14 py-4 max-w-xl md:max-w-2xl text-white transition-all duration-1000 ease-out delay-150 ${
                  isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                }`}
              >
                {/* Fashion Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-red-600/90 text-white text-[10px] sm:text-xs font-bold tracking-wide uppercase shadow-sm w-fit mb-2 sm:mb-3 backdrop-blur-xs">
                  <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                  <span>ফ্যাশন কালেকশন ২০২৬</span>
                </div>

                {/* Bengali Title */}
                <h2 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight sm:leading-snug drop-shadow-lg line-clamp-2">
                  {b.title}
                </h2>

                {/* Subtitle */}
                {b.subtitle && (
                  <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm md:text-base text-slate-200/95 font-medium line-clamp-2 drop-shadow max-w-lg">
                    {b.subtitle}
                  </p>
                )}

                {/* Action Button */}
                <div className="mt-3 sm:mt-5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer group-hover:translate-x-1">
                    <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                    <span>{b.buttonText || 'কালেকশন দেখুন'}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg border border-white/20 hover:scale-105 active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-lg border border-white/20 hover:scale-105 active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Indicator Dots with smooth transition */}
            <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 bg-black/45 backdrop-blur-md px-3 py-1 sm:py-1.5 rounded-full border border-white/15">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-700 ease-in-out cursor-pointer ${
                    currentSlide === idx
                      ? 'w-6 sm:w-8 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
                      : 'w-1.5 sm:w-2 bg-white/60 hover:bg-white'
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
};
