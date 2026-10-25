import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSettingsFromDatabase, saveSettingsToDatabase } from '../utils/apiSync';

export interface BannerSlide {
  id: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  imageUrl: string;
  link: string;
}

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
  supportTitle?: string;
  supportWelcomeMessage?: string;
  supportPhone?: string;
  supportReplyMessage?: string;
  supportCallButtonText?: string;
  banners: BannerSlide[];
  promoBanner?: PromoBannerSettings;
}

export interface PromoCard {
  id: string;
  title: string;
  subtitle?: string;
  tagText?: string;
  tagBg?: string;
  imageUrl: string;
  link: string;
}

export interface PromoBannerSettings {
  enabled: boolean;
  badgeText: string;
  title: string;
  highlightTitle?: string;
  description: string;
  feature1Text?: string;
  feature2Text?: string;
  cards: PromoCard[];
}

export const DEFAULT_PROMO_BANNER_SETTINGS: PromoBannerSettings = {
  enabled: true,
  badgeText: 'এক্সক্লুসিভ ফ্যাশন ফেস্টিভ্যাল',
  title: 'স্টাইলিশ পোশাক, জুতা ও লেডিস ব্যাগ স্পেশাল কালেকশন',
  highlightTitle: 'লেডিস ব্যাগ স্পেশাল কালেকশন',
  description: 'সেরা মানের প্রিমিয়াম ফেব্রিক ও আকর্ষণীয় ডিজাইনের ট্রেন্ডি পোশাক, স্টাইলিশ জুতা ও ব্র্যান্ডেড লেডিস ব্যাগে আকর্ষণীয় ছাড়!',
  feature1Text: 'সারা দেশে ক্যাশ অন ডেলিভারি',
  feature2Text: '১০০% কোয়ালিটি গ্যারান্টি',
  cards: [
    {
      id: 'promo-card-1',
      title: 'পোশাক-আশাক',
      subtitle: 'নতুন ডিজাইন',
      tagText: '-৪০%',
      tagBg: '#e11d48',
      imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80',
      link: '#flash-sale',
    },
    {
      id: 'promo-card-2',
      title: 'লেডিস ব্যাগ',
      subtitle: 'লেদার ও ক্লাচ',
      tagText: 'হট ডিল',
      tagBg: '#f59e0b',
      imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop&q=80',
      link: '#top-rated',
    },
    {
      id: 'promo-card-3',
      title: 'জুতা ও হিল',
      subtitle: 'হিল ও স্নিকার্স',
      tagText: '-৫০%',
      tagBg: '#e11d48',
      imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&auto=format&fit=crop&q=80',
      link: '#best-sells',
    },
  ],
};

export const FASHION_DEFAULT_BANNERS: BannerSlide[] = [
  {
    id: 'b-fashion-1',
    title: 'প্রিমিয়াম পোশাক ও ট্রেন্ডি ফ্যাশন কালেকশন',
    subtitle: 'সেরা মানের ফেব্রিক, আধুনিক ডিজাইন ও স্টাইলিশ পোশাকের বিশাল সম্ভার',
    buttonText: 'কালেকশন দেখুন',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80',
    link: '#flash-sale',
  },
  {
    id: 'b-fashion-2',
    title: 'এক্সক্লুসিভ লেডিস ব্যাগ ও হ্যান্ডব্যাগ কালেকশন',
    subtitle: 'আকর্ষণীয় ডিজাইনের প্রিমিয়াম কোয়ালিটি লেদার হ্যান্ডব্যাগ, ক্লাচ ও পার্স',
    buttonText: 'ব্যাগ কিনুন',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1600&auto=format&fit=crop&q=80',
    link: '#top-rated',
  },
  {
    id: 'b-fashion-3',
    title: 'ফ্যাশনেবল জুতা ও ফুটওয়্যার কালেকশন',
    subtitle: 'লেডিস হিলস, জেন্টস স্নিকার্স ও আরামদায়ক ক্যাজুয়াল জুতার সেরা কালেকশন',
    buttonText: 'জুতা কালেকশন',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop&q=80',
    link: '#best-sells',
  },
  {
    id: 'b-fashion-4',
    title: 'পোশাক, জুতা ও ব্যাগে ধামাকা মেগা অফার',
    subtitle: 'দেশজুড়ে দ্রুত ক্যাশ অন ডেলিভারি এবং ১০০% আসল কোয়ালিটির নিশ্চয়তা',
    buttonText: 'অফারটি দেখুন',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&auto=format&fit=crop&q=80',
    link: '#all-new',
  },
];

export const isGroceryOrOilBanner = (bannerList?: any[]): boolean => {
  if (!bannerList || !Array.isArray(bannerList) || bannerList.length === 0) return true;
  return bannerList.some((b: any) => {
    const title = (b.title || '').toLowerCase();
    const url = (b.imageUrl || '').toLowerCase();
    return (
      title.includes('তেল') ||
      title.includes('তৈল') ||
      title.includes('স্বাস্থ্যকর') ||
      title.includes('মসলা') ||
      title.includes('প্রকৃতি') ||
      url.includes('photo-1474979266404-7eaacbcd87c5') ||
      url.includes('photo-1587049352846-4a222e784d38')
    );
  });
};

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  siteName: 'Somadhan Point',
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
  logoUrl: '/somadhan-logo.svg',
  footerLogoUrl: '/somadhan-logo.svg',
  footerLogoBg: 'white_card',
  adminLogoBg: 'transparent',
  showLogoText: false,
  supportTitle: 'কাস্টমার সাপোর্ট',
  supportWelcomeMessage: 'আসসালামু আলাইকুম! কোনো পণ্য বা অর্ডার সম্পর্কে জানতে চাইলে এখানে লিখুন অথবা কল করুন 01982708789',
  supportPhone: '01982708789',
  supportReplyMessage: 'ধন্যবাদ! আমাদের কাস্টমার সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে। সরাসরি ফোনে কথা বলতে ডায়াল করুন 01982708789',
  supportCallButtonText: 'কল করুন',
  banners: FASHION_DEFAULT_BANNERS,
  promoBanner: DEFAULT_PROMO_BANNER_SETTINGS,
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
        // Automatically migrate to Somadhan Point and clean up old EcomByte
        if (!parsed.siteName || parsed.siteName === 'EcomByte' || parsed.siteName.toLowerCase().includes('ecombyte')) {
          parsed.siteName = 'Somadhan Point';
        }
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
        if (!parsed.logoUrl || parsed.logoUrl === '' || parsed.logoUrl.includes('placeholder')) {
          parsed.logoUrl = '/somadhan-logo.svg';
        }
        if (!parsed.footerLogoUrl || parsed.footerLogoUrl === '' || parsed.footerLogoUrl.includes('placeholder')) {
          parsed.footerLogoUrl = '/somadhan-logo.svg';
        }

        // Migrate old grocery / mustard oil banners to fashion banners
        if (isGroceryOrOilBanner(parsed.banners)) {
          parsed.banners = FASHION_DEFAULT_BANNERS;
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

  // Permanently sync with server database on mount
  useEffect(() => {
    let isMounted = true;
    fetchSettingsFromDatabase().then((dbSettings) => {
      if (dbSettings && isMounted) {
        setSettings((prev) => {
          let updatedBanners = dbSettings.banners;
          const hadOldBanners = isGroceryOrOilBanner(updatedBanners);
          if (hadOldBanners) {
            updatedBanners = FASHION_DEFAULT_BANNERS;
          }
          const merged = { ...prev, ...dbSettings, banners: updatedBanners };
          try {
            localStorage.setItem('ecom_store_settings', JSON.stringify(merged));
          } catch {}
          // If old grocery banners were stored in DB, update DB permanently
          if (hadOldBanners) {
            saveSettingsToDatabase(merged);
          }
          return merged;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ecom_store_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving store settings', e);
      }
      // Save permanently to MySQL database on the server
      saveSettingsToDatabase(updated);
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
