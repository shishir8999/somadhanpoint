import React from 'react';
import { SystemSettings } from '../types';

interface HeaderMarqueeProps {
  settings?: SystemSettings;
}

export const HeaderMarquee: React.FC<HeaderMarqueeProps> = ({ settings }) => {
  if (settings && settings.enableHeaderMarquee === false) {
    return null;
  }

  const brandName = settings?.appName || 'OmniCraft AI';
  const customAnnouncement = settings?.announcementText || `★ ${brandName} Workspace Live Now`;

  const marqueeItems = [
    customAnnouncement,
    "•",
    "ChatGPT, Claude, Gemini & Grok In One Place",
    "•",
    "Instant Delivery & 100% Genuine Retail Keys",
    "•",
    `Support Hotline: ${settings?.supportPhone || '+880 1982-708789'}`,
    "•",
    "Wholesale Reseller Discount 25%",
    "•",
    "ORDER NOW",
    "★"
  ];

  return (
    <div className="bg-[#D11E36] text-white text-[11px] font-bold py-1.5 overflow-hidden relative shadow-md select-none border-b border-red-700/40">
      <div className="flex animate-marquee-smooth whitespace-nowrap">
        {/* Track 1 */}
        <div className="flex items-center gap-6 px-4">
          {marqueeItems.map((item, idx) => (
            <span key={`m1-${idx}`} className={item === 'ORDER NOW' ? 'underline uppercase tracking-wider text-amber-200' : ''}>
              {item}
            </span>
          ))}
        </div>
        {/* Track 2 for infinite seamless loop */}
        <div className="flex items-center gap-6 px-4" aria-hidden="true">
          {marqueeItems.map((item, idx) => (
            <span key={`m2-${idx}`} className={item === 'ORDER NOW' ? 'underline uppercase tracking-wider text-amber-200' : ''}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
