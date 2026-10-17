import React, { useState, useRef, useEffect } from 'react';
import { X, Headphones, Phone, MessageSquare } from 'lucide-react';
import { SystemSettings } from '../types';

interface FloatingChatProps {
  settings: SystemSettings;
  onOpenLiveChat?: () => void;
}

// 1. Authentic Messenger SVG with circle outline
const MessengerIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 28 28" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14 2C7.373 2 2 6.974 2 13.111c0 3.498 1.745 6.623 4.47 8.653v4.236l3.992-2.193c1.107.307 2.29.475 3.538.475 6.627 0 12-4.974 12-11.111C26 6.974 20.627 2 14 2zm1.282 14.932l-3.292-3.513-6.425 3.513 7.068-7.505 3.375 3.513 6.342-3.513-7.068 7.505z"
      fill="currentColor"
    />
  </svg>
);

// 2. Authentic WhatsApp SVG with speech bubble and phone
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const FloatingChat: React.FC<FloatingChatProps> = ({ settings, onOpenLiveChat }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayPhone = settings.supportPhone || '09658027707';
  const cleanPhone = displayPhone.replace(/[^0-9]/g, '');

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleOpenMessenger = () => {
    window.open('https://m.me/', '_blank');
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('Hello, I need assistance with AI Subscription.');
    window.open(`https://wa.me/${cleanPhone || '8801982708789'}?text=${text}`, '_blank');
  };

  const handleTriggerLiveChat = () => {
    setIsOpen(false);
    if (onOpenLiveChat) {
      onOpenLiveChat();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans" ref={containerRef}>
      
      {/* ======================================================== */}
      {/* EXPANDED VERTICAL PILL BUTTONS (Matching Screenshot Exactly) */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 mb-1 animate-in slide-in-from-bottom-4 fade-in duration-200">
          
          {/* 1. Messenger Pill Button (Blue Gradient) */}
          <button
            onClick={handleOpenMessenger}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00C6FF] to-[#0072FF] text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-w-[155px]"
          >
            <div className="w-7 h-7 rounded-full bg-white text-[#0072FF] flex items-center justify-center shrink-0 shadow-xs">
              <MessengerIcon className="w-4 h-4 fill-[#0072FF]" />
            </div>
            <span className="tracking-wide">Messenger</span>
          </button>

          {/* 2. WhatsApp Pill Button (Green Gradient) */}
          <button
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#00E676] to-[#00A859] text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-w-[155px]"
          >
            <div className="w-7 h-7 rounded-full bg-white text-[#00A859] flex items-center justify-center shrink-0 shadow-xs">
              <WhatsAppIcon className="w-4.5 h-4.5 fill-[#00A859]" />
            </div>
            <span className="tracking-wide">WhatsApp</span>
          </button>


          {/* 4. Live Chat Pill Button (Purple to Magenta Gradient) */}
          <button
            onClick={handleTriggerLiveChat}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#7B2CBF] via-[#9D4EDD] to-[#D90429] text-white font-black text-sm sm:text-base shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer min-w-[155px]"
          >
            <Headphones className="w-5 h-5 text-white stroke-[2.8]" />
            <span className="tracking-wide">Live Chat</span>
          </button>

        </div>
      )}

      {/* ======================================================== */}
      {/* MASTER TOGGLE BUTTON (Dark circular button with white X) */}
      {/* ======================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 cursor-pointer ${
          isOpen
            ? 'bg-[#182030] hover:bg-[#202C40] text-white border-2 border-white/10 ring-4 ring-slate-900/40 rotate-90'
            : 'bg-[#182030] hover:bg-[#202C40] text-white border-2 border-white/10 hover:border-emerald-400/50 ring-4 ring-emerald-500/20 hover:scale-105'
        }`}
        title="সাপোর্ট অপশন দেখতে ক্লিক করুন"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white stroke-[3]" />
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Pulsing Green Indicator */}
            <span className="absolute -top-3.5 -right-3.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#182030]"></span>
            </span>
            <MessageSquare className="w-6 h-6 text-emerald-400" />
          </div>
        )}
      </button>

    </div>
  );
};
