import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroCarouselProps {
  onSelectCombo: () => void;
  onOpenInAppChat: () => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  onSelectCombo,
  onOpenInAppChat,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'slide-1',
      titleHighlight: 'নেটফ্লিক্স + প্রাইম কম্বো',
      priceText: '৪০০ টাকা ১ মাস',
      subtext: 'Ultra HD 4K স্ট্রিমিং ও পার্সোনাল প্রোফাইল উইথ পিন লক',
      ctaText: 'এখনই সাবস্ক্রাইব করুন',
      action: onSelectCombo,
      gradient: 'from-[#140608] via-[#200A10] to-[#0A0D18]',
      accentColor: 'text-red-500',
      badge: 'মেগা ডিল',
      tags: ['Netflix 4K', 'Prime Video', 'Crunchyroll', 'Instant Delivery']
    },
    {
      id: 'slide-2',
      titleHighlight: 'ChatGPT Plus & Claude 3.5 Pro',
      priceText: '৪০০ টাকা থেকে শুরু',
      subtext: 'প্ল্যাটফর্মের ভেতরেই আনলিমিটেড প্রাইভেট চ্যাট ও ডোমেইন প্রক্সি ভিউ',
      ctaText: 'ওয়ার্কস্পেস ওপেন করুন',
      action: onOpenInAppChat,
      gradient: 'from-[#061411] via-[#0A261D] to-[#0A0D18]',
      accentColor: 'text-emerald-400',
      badge: 'এআই স্পেশাল',
      tags: ['GPT-4o Live', 'Claude Sonnet', 'Zero Data Leak', 'ডকুমেন্ট অ্যানালাইসিস']
    },
    {
      id: 'slide-3',
      titleHighlight: 'Windows 11 Pro ও Office 2021',
      priceText: 'মাত্র ৪৫০ টাকায় লাইফটাইম',
      subtext: '১০০% জেনুইন রিটেল লাইসেন্স কি ও তাৎক্ষণিক ডিজিটাল ডেলিভারি',
      ctaText: 'লাইসেন্স কি কিনুন',
      action: onSelectCombo,
      gradient: 'from-[#071224] via-[#0B2144] to-[#0A0D18]',
      accentColor: 'text-blue-400',
      badge: 'লাইফটাইম অফার',
      tags: ['Genuine Retail Key', 'Lifetime Validity', 'Office Pro Plus', 'Auto Activation']
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
      {/* Banner Container */}
      <div className={`relative min-h-[300px] sm:min-h-[380px] bg-gradient-to-r ${slide.gradient} p-6 sm:p-12 flex flex-col justify-between transition-all duration-700`}>
        
        {/* Background decorative glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/[0.08] via-transparent to-transparent pointer-events-none"></div>

        {/* Top Tag */}
        <div className="flex items-center justify-between z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs font-bold text-amber-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{slide.badge}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>১০০% অফিসিয়াল গ্যারান্টি</span>
          </div>
        </div>

        {/* Main Content Area with animated entrance */}
        <div key={slide.id} className="max-w-2xl my-auto z-10 space-y-4 animate-role-in">
          <div className="flex flex-wrap gap-2 text-xs">
            {slide.tags.map((tag, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-mono text-[10px]">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {slide.titleHighlight} <br />
            <span className={slide.accentColor}>{slide.priceText}</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
            {slide.subtext}
          </p>

          <div className="pt-2">
            <button
              onClick={slide.action}
              className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all group"
            >
              <span>{slide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows & Dots */}
        <div className="flex items-center justify-between z-10 pt-4">
          {/* Dots with smooth progress indication */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentSlide === i ? 'w-8 bg-white shadow-xs' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition backdrop-blur-md hover:scale-110 active:scale-90"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 border border-white/10 text-white flex items-center justify-center transition backdrop-blur-md hover:scale-110 active:scale-90"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
