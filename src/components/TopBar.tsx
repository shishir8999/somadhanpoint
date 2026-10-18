import React from 'react';
import { Phone } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface TopBarProps {
  onOpenAdmin?: () => void;
  onOpenOrderPage?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const { settings } = useStoreSettings();

  const marqueeText = settings.marqueeText || 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি)';
  const hotline = settings.phone1 || '01982708789';

  return (
    <div className="w-full bg-[#990000] text-white py-1 sm:py-1.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-medium tracking-wide border-b border-[#800000]/30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left / Center Announcement */}
        <div className="flex-1 overflow-hidden whitespace-nowrap min-w-0 flex items-center">
          <div className="inline-block truncate text-slate-100">
            {marqueeText}
          </div>
        </div>

        {/* Right Hotline Pill */}
        <a
          href={`tel:${hotline}`}
          className="font-bold flex items-center gap-1 bg-black/25 hover:bg-black/40 px-2 py-0.5 rounded text-amber-200 shrink-0 transition-colors text-[10px] sm:text-xs"
          title="কল করতে ক্লিক করুন"
        >
          <Phone className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-300 shrink-0" />
          <span className="font-mono">{hotline}</span>
        </a>
      </div>
    </div>
  );
};
