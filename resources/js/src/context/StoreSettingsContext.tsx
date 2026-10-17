import React, { createContext, useContext, useState, useEffect } from 'react';

export interface StoreSettings {
  siteName: string;
  slogan: string;
  description: string;
  primaryColor: string;
  bgColor: string;
  phone1: string;
  phone2: string;
  whatsapp1: string;
  whatsapp2: string;
  email: string;
  address: string;
  mapEmbed: string;
  marqueeText: string;
  orderNote: string;
  developerName: string;
  developerUrl: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  fbPixelId?: string;
  fbApiToken?: string;
  logoUrl?: string;
  footerLogoUrl?: string;
  footerLogoBg?: 'white_card' | 'transparent';
  adminLogoBg?: 'white_card' | 'transparent';
  showLogoText?: boolean;
  banners: Array<{ id: string; title: string; imageUrl: string; link: string }>;
}

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  siteName: 'EcomByte',
  slogan: 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ',
  description: 'সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789',
  primaryColor: '#ffffff',
  bgColor: '#990000',
  phone1: '01982708789',
  phone2: '',
  whatsapp1: '01982708789',
  whatsapp2: '',
  email: 'shishirbarai01982708789@gmail.com',
  address: 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬',
  mapEmbed: '<iframe src="https://www.google.com/maps/embed" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>',
  marqueeText: 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789',
  orderNote: 'স্টক আউট হওয়ার আগেই অর্ডার করুন',
  developerName: 'SHISHIR',
  developerUrl: 'https://www.facebook.com/shishir9barai',
  facebook: 'https://www.facebook.com/shishir9barai',
  instagram: 'https://www.instagram.com',
  youtube: 'https://www.youtube.com',
  tiktok: 'https://www.tiktok.com',
  fbPixelId: '',
  fbApiToken: '',
  footerLogoBg: 'white_card',
  adminLogoBg: 'white_card',
  showLogoText: false,
  banners: [
    {
      id: 'b-1',
      title: 'স্বাস্থ্যকর তেলে একটিভ থাকুন প্রতিদিন',
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
      link: 'https://example.com',
    },
    {
      id: 'b-2',
      title: 'সরাসরি প্রকৃতি থেকে আপনার ঘরে',
      imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      link: 'https://example.com',
    },
  ],
};

interface StoreSettingsContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  resetSettings: () => void;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ecom_store_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically migrate to user's phone, email and address
        if (parsed.phone1 === '01891614300' || !parsed.phone1) {
          parsed.phone1 = '01982708789';
        }
        if (parsed.whatsapp1 === '01891614300' || !parsed.whatsapp1) {
          parsed.whatsapp1 = '01982708789';
        }
        if (parsed.email === 'business.appbyte@gmail.com' || !parsed.email) {
          parsed.email = 'shishirbarai01982708789@gmail.com';
        }
        if (parsed.phone2 === '01644636608') {
          parsed.phone2 = '';
        }
        if (parsed.whatsapp2 === '01644636608') {
          parsed.whatsapp2 = '';
        }
        if (parsed.address && parsed.address.includes('শোরুম কুঞ্জ')) {
          parsed.address = 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬';
        }
        if (parsed.description && parsed.description.includes('01891614300')) {
          parsed.description = parsed.description.replace(/01891614300/g, '01982708789');
        }
        // Enforce SHISHIR developer branding & facebook link requested by user
        if (
          !parsed.developerName ||
          parsed.developerName === 'AppByte' ||
          parsed.developerName === 'App Byte' ||
          parsed.developerName.toLowerCase().includes('appbyte') ||
          parsed.developerName.includes('অ্যাপ বাইট')
        ) {
          parsed.developerName = 'SHISHIR';
        }
        if (
          !parsed.developerUrl ||
          parsed.developerUrl.includes('appbyte') ||
          parsed.developerUrl === 'https://example.com'
        ) {
          parsed.developerUrl = 'https://www.facebook.com/shishir9barai';
        }
        if (
          !parsed.facebook ||
          parsed.facebook.includes('appbyte') ||
          parsed.facebook === 'https://www.facebook.com'
        ) {
          parsed.facebook = 'https://www.facebook.com/shishir9barai';
        }
        if (!parsed.instagram || parsed.instagram.includes('appbytebd')) {
          parsed.instagram = 'https://www.instagram.com';
        }
        if (!parsed.youtube || parsed.youtube.includes('appByte-bd')) {
          parsed.youtube = 'https://www.youtube.com';
        }
        if (!parsed.tiktok) {
          parsed.tiktok = 'https://www.tiktok.com';
        }

        const pixelSaved = localStorage.getItem('ecom_pixel_settings');
        if (pixelSaved) {
          try {
            const pixelParsed = JSON.parse(pixelSaved);
            if (pixelParsed.fbPixelId && !parsed.fbPixelId) parsed.fbPixelId = pixelParsed.fbPixelId;
            if (pixelParsed.fbApiToken && !parsed.fbApiToken) parsed.fbApiToken = pixelParsed.fbApiToken;
          } catch {}
        }
        const updated = { ...DEFAULT_STORE_SETTINGS, ...parsed };
        localStorage.setItem('ecom_store_settings', JSON.stringify(updated));
        return updated;
      }
    } catch (e) {
      console.error('Error loading store settings', e);
    }
    const pixelSaved = localStorage.getItem('ecom_pixel_settings');
    if (pixelSaved) {
      try {
        const pixelParsed = JSON.parse(pixelSaved);
        return {
          ...DEFAULT_STORE_SETTINGS,
          fbPixelId: pixelParsed.fbPixelId || '',
          fbApiToken: pixelParsed.fbApiToken || '',
        };
      } catch {}
    }
    return DEFAULT_STORE_SETTINGS;
  });

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ecom_store_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving store settings', e);
      }
      return updated;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_STORE_SETTINGS);
    try {
      localStorage.setItem('ecom_store_settings', JSON.stringify(DEFAULT_STORE_SETTINGS));
    } catch (e) {
      console.error('Error resetting store settings', e);
    }
  };

  return (
    <StoreSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = () => useContext(StoreSettingsContext);
