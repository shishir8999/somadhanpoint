import React from 'react';
import { Phone } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface TopBarProps {
  onOpenAdmin?: () => void;
  onOpenOrderPage?: () => void;
}

export const TopBar: React.FC<TopBarProps> = () => {
  const { settings } = useStoreSettings();

  return (
    <div className="w-full bg-[#990000] text-white py-1.5 px-4 text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
        <span className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
          <span>{settings.marqueeText || 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি)'}</span>
        </span>

        <span className="font-bold flex items-center gap-1 bg-black/20 px-2.5 py-0.5 rounded text-amber-200 shrink-0">
          <Phone className="w-3 h-3 text-amber-300 shrink-0" />
          <a href={`tel:${settings.phone1 || '01982708789'}`} className="hover:underline font-mono">
            হটলাইন: {settings.phone1 || '01982708789'}
          </a>
        </span>
      </div>
    </div>
  );
};
