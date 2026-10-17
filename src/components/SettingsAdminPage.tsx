import React, { useState, useRef } from 'react';
import {
  Settings,
  Globe,
  Image as ImageIcon,
  Sun,
  Phone,
  MessageCircle,
  Share2,
  Save,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Type,
  Link,
  MapPin,
  Mail,
  Sliders,
  Tag,
  FileText,
  Target,
  Key,
  Shield,
  Smartphone,
  Clock,
  Percent,
  Search,
  Check,
  AlertCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Video,
  Undo2,
  Redo2,
  Edit2,
  UploadCloud,
  Upload,
  RefreshCw
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { useStoreSettings } from '../context/StoreSettingsContext';
import {
  initFacebookPixel,
  trackFacebookEvent,
  getPixelLogs,
  onPixelLogUpdate,
  PixelEventLog,
} from '../utils/pixel';
import { getOrderSettings, saveOrderSettings, OrderSettings } from '../utils/orderSettings';

interface SettingsAdminPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export interface CouponItem {
  id: string;
  code: string;
  discount: string;
  expires: string;
  status: 'Active' | 'Expired';
  usageCount?: number;
  minSpend?: number;
}

export const SettingsAdminPage: React.FC<SettingsAdminPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const { settings, updateSettings } = useStoreSettings();
  const [activeTab, setActiveTab] = useState<'web' | 'order' | 'coupons' | 'page' | 'pixel'>('web');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // TAB 1: WEB SETTINGS (Connected to StoreSettingsContext)
  // -------------------------------------------------------------
  const [siteName, setSiteName] = useState(settings.siteName || 'Somadhan Point');
  const [slogan, setSlogan] = useState(settings.slogan || 'বাংলাদেশের বিশ্বস্ত অনলাইন শপ');
  const [description, setDescription] = useState(
    settings.description ||
      'সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789'
  );
  const [developerName, setDeveloperName] = useState(settings.developerName || 'SHISHIR');
  const [developerUrl, setDeveloperUrl] = useState(
    settings.developerUrl || 'https://www.facebook.com/shishir9barai'
  );
  const [banners, setBanners] = useState(settings.banners || []);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#fff');
  const [bgColor, setBgColor] = useState(settings.bgColor || '#990000');
  const [phone1, setPhone1] = useState(settings.phone1 || '01982708789');
  const [phone2, setPhone2] = useState(settings.phone2 || '');
  const [whatsapp1, setWhatsapp1] = useState(settings.whatsapp1 || '01982708789');
  const [whatsapp2, setWhatsapp2] = useState(settings.whatsapp2 || '');
  const [email, setEmail] = useState(settings.email || 'shishirbarai01982708789@gmail.com');
  const [address, setAddress] = useState(
    settings.address || 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬'
  );
  const [mapEmbed, setMapEmbed] = useState(settings.mapEmbed || '');
  const [marqueeText, setMarqueeText] = useState(
    settings.marqueeText ||
      'বাংলাদেশের বিশ্বস্ত অনলাইন শপ আপনাদের স্বাগতম। সারাদেশে ক্যাশ অন ডেলিভারি (৪৮ থেকে ৭২ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি) হটলাইনঃ 01982708789'
  );
  const [orderNote, setOrderNote] = useState(settings.orderNote || 'স্টক আউট হওয়ার আগেই অর্ডার করুন');
  const [facebook, setFacebook] = useState(settings.facebook || 'https://www.facebook.com');
  const [instagram, setInstagram] = useState(settings.instagram || 'https://www.instagram.com');
  const [youtube, setYoutube] = useState(settings.youtube || 'https://www.youtube.com');
  const [tiktok, setTiktok] = useState(settings.tiktok || 'https://www.tiktok.com');

  // Logo Upload State
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl || '');
  const [footerLogoUrl, setFooterLogoUrl] = useState<string>(settings.footerLogoUrl || '');
  const [footerLogoBg, setFooterLogoBg] = useState<'white_card' | 'transparent'>(settings.footerLogoBg || 'white_card');
  const [adminLogoBg, setAdminLogoBg] = useState<'white_card' | 'transparent'>(settings.adminLogoBg || 'white_card');
  const [showLogoText, setShowLogoText] = useState<boolean>(settings.showLogoText || false);
  const [logoUploadMode, setLogoUploadMode] = useState<'upload' | 'url'>('upload');
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const footerLogoFileInputRef = useRef<HTMLInputElement>(null);

  const handleFooterLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFooterLogoUrl(result);
      updateSettings({ footerLogoUrl: result });
      showToast('ফুটার লোগো সফলভাবে লোড ও সেভ হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFooterLogo = () => {
    setFooterLogoUrl('');
    if (footerLogoFileInputRef.current) {
      footerLogoFileInputRef.current.value = '';
    }
    updateSettings({ footerLogoUrl: '' });
    showToast('ফুটার লোগো রিমুভ করা হয়েছে (মেইন লোগো ফুটার হিসেবে দেখানো হবে)!');
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, SVG, WebP) নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoUrl(result);
      updateSettings({ logoUrl: result });
      showToast('লোগো সফলভাবে লোড ও সেভ হয়েছে!');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyLogoUrl = () => {
    if (!logoUrlInput.trim()) {
      showToast('অনুগ্রহ করে একটি সঠিক ইমেজ URL লিখুন');
      return;
    }
    const cleanUrl = logoUrlInput.trim();
    setLogoUrl(cleanUrl);
    setLogoUrlInput('');
    updateSettings({ logoUrl: cleanUrl });
    showToast('লোগো URL যুক্ত ও সেভ হয়েছে!');
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    if (logoFileInputRef.current) {
      logoFileInputRef.current.value = '';
    }
    updateSettings({ logoUrl: '' });
    showToast('লোগো পার্মানেন্টলি ডিলিট করা হয়েছে!');
  };

  const handleSaveWeb = () => {
    updateSettings({
      siteName,
      slogan,
      description,
      developerName: 'SHISHIR',
      developerUrl: 'https://www.facebook.com/shishir9barai',
      primaryColor,
      bgColor,
      phone1,
      phone2,
      whatsapp1,
      whatsapp2,
      email,
      address,
      mapEmbed,
      marqueeText,
      orderNote,
      facebook,
      instagram,
      youtube,
      tiktok,
      banners,
      logoUrl,
      footerLogoUrl,
      footerLogoBg,
      adminLogoBg,
      showLogoText,
    });
    showToast('Web Settings ও লোগো সফলভাবে সংরক্ষিত হয়েছে এবং সাইটের সর্বত্র লাইভ আপডেট হয়েছে!');
  };

  // Banner Upload Refs & Handlers
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [replacingBannerId, setReplacingBannerId] = useState<string | null>(null);
  const replaceBannerInputRef = useRef<HTMLInputElement>(null);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (PNG, JPG, WebP) নির্বাচন করুন');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const newBanner = {
        id: `b-${Date.now()}`,
        title: '',
        imageUrl: result,
        link: '',
      };
      const updated = [...banners, newBanner];
      setBanners(updated);
      updateSettings({ banners: updated });
      showToast('নতুন ব্যানার ছবি সফলভাবে আপলোড করা হয়েছে!');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleReplaceBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingBannerId) return;

    if (!file.type.startsWith('image/')) {
      showToast('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল নির্বাচন করুন');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const updated = banners.map((b) =>
        b.id === replacingBannerId ? { ...b, imageUrl: result } : b
      );
      setBanners(updated);
      updateSettings({ banners: updated });
      showToast('ব্যানার ছবি সফলভাবে পরিবর্তন করা হয়েছে!');
      setReplacingBannerId(null);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDeleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    updateSettings({ banners: updated });
    showToast('ব্যানার ডিলিট করা হয়েছে!');
  };

  // -------------------------------------------------------------
  // TAB 2: ORDER SETTINGS (Screenshot 1)
  // -------------------------------------------------------------
  const [orderSettings, setOrderSettingsState] = useState<OrderSettings>(getOrderSettings);
  const [mobileVerification, setMobileVerification] = useState<boolean>(orderSettings.mobileVerification);
  const [locationFields, setLocationFields] = useState<boolean>(orderSettings.locationFields);
  const [vpnProtection, setVpnProtection] = useState<boolean>(orderSettings.vpnProtection);
  const [orderConfirmationSms, setOrderConfirmationSms] = useState<boolean>(orderSettings.orderConfirmationSms);
  const [duplicateOrderBlock, setDuplicateOrderBlock] = useState<boolean>(orderSettings.duplicateOrderBlock);
  const [orderBlockTime, setOrderBlockTime] = useState<string>(orderSettings.orderBlockTime || '15');
  const [courierProtection, setCourierProtection] = useState<boolean>(orderSettings.courierProtection);
  const [successRatio, setSuccessRatio] = useState<string>(orderSettings.successRatio || '60');

  const handleToggleOrderSetting = (key: keyof OrderSettings, value: any) => {
    const updated = saveOrderSettings({ [key]: value });
    setOrderSettingsState(updated);
  };

  const handleSaveOrderSettings = () => {
    saveOrderSettings({
      mobileVerification,
      locationFields,
      vpnProtection,
      orderConfirmationSms,
      duplicateOrderBlock,
      orderBlockTime,
      courierProtection,
      successRatio,
    });
    showToast('সবগুলো Order Settings সফলভাবে সংরক্ষিত ও সাইটে ১০০% সক্রিয় করা হয়েছে!');
  };

  // -------------------------------------------------------------
  // TAB 3: COUPONS (Screenshot 2)
  // -------------------------------------------------------------
  const [couponsList, setCouponsList] = useState<CouponItem[]>([
    {
      id: 'c-1',
      code: 'EID2026',
      discount: '15%',
      expires: '31 Oct 2026',
      status: 'Active',
      minSpend: 1000,
    },
    {
      id: 'c-2',
      code: 'FREE50',
      discount: '৳ 50',
      expires: '15 Oct 2026',
      status: 'Active',
      minSpend: 500,
    },
  ]);
  const [couponSearch, setCouponSearch] = useState('');
  const [isAddCouponModalOpen, setIsAddCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percent' | 'fixed'>('percent');
  const [newCouponExpires, setNewCouponExpires] = useState('2026-12-31');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim() || !newCouponDiscount.trim()) return;

    const formattedDiscount =
      newCouponType === 'percent'
        ? `${newCouponDiscount}%`
        : `৳ ${newCouponDiscount}`;

    const newCoupon: CouponItem = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discount: formattedDiscount,
      expires: newCouponExpires,
      status: 'Active',
    };

    setCouponsList([newCoupon, ...couponsList]);
    setNewCouponCode('');
    setNewCouponDiscount('');
    setIsAddCouponModalOpen(false);
    showToast(`কুপন কোড ${newCoupon.code} সফলভাবে যোগ করা হয়েছে!`);
  };

  const handleDeleteCoupon = (id: string) => {
    setCouponsList(couponsList.filter((c) => c.id !== id));
    showToast('কুপন মুছে ফেলা হয়েছে!');
  };

  const filteredCoupons = couponsList.filter((c) =>
    c.code.toLowerCase().includes(couponSearch.toLowerCase())
  );

  const activeCouponsCount = couponsList.filter((c) => c.status === 'Active').length;
  const expiredCouponsCount = couponsList.filter((c) => c.status === 'Expired').length;

  // -------------------------------------------------------------
  // TAB 4: PAGE SETTINGS (Screenshot 3)
  // -------------------------------------------------------------
  type PolicyPageKey = 'privacy' | 'terms' | 'return' | 'delivery' | 'about';
  const [selectedPolicyPage, setSelectedPolicyPage] = useState<PolicyPageKey>('privacy');

  const [pageContents, setPageContents] = useState<Record<PolicyPageKey, string>>({
    privacy:
      '১. তথ্যের গোপনীয়তা: আমরা আপনার সকল ব্যক্তিগত তথ্য যেমন নাম, ফোন নম্বর ও ঠিকানার সর্বোচ্চ গোপনীয়তা বজায় রাখি। কোনো তৃতীয় পক্ষের সাথে এই তথ্য শেয়ার করা হয় না।\n২. পেমেন্ট নিরাপত্তা: আমাদের সাইটের সকল অনলাইন এবং ক্যাশ অন ডেলিভারি লেনদেন ১০০% সুরক্ষিত।',
    terms:
      '১. সাধারণ শর্তাবলী: আমাদের ওয়েবসাইট থেকে পণ্য অর্ডারের মাধ্যমে আপনি আমাদের নিয়মাবলীর সাথে একমত হচ্ছেন।\n২. ডেলিভারি সময়: ঢাকা সিটির মধ্যে ২৪ থেকে ৪৮ ঘণ্টা এবং ঢাকার বাইরে ৪৮ থেকে ৭২ ঘণ্টার মধ্যে ডেলিভারি সম্পন্ন হয়।\n৩. স্টক সীমাবদ্ধতা: বিশেষ অফারের পণ্য স্টক শেষ হওয়া পর্যন্ত প্রযোজ্য।',
    return:
      '১. রিটার্ন পলিসি: পণ্য গ্রহণের সময় কোনো ত্রুটি দেখা গেলে ডেলিভারিম্যানের সামনেই রিটার্ন করতে পারবেন অথবা ৭ দিনের মধ্যে কাস্টমার কেয়ারে যোগাযোগ করুন।\n২. রিফান্ড: বিকাশ বা নগদ এর মাধ্যমে সর্বোচ্চ ৩ কর্মদিবসের মধ্যে রিফান্ড প্রদান করা হয়।',
    delivery:
      '১. সারাদেশে ক্যাশ অন ডেলিভারি প্রযোজ্য।\n২. ডেলিভারি চার্জ: ঢাকার ভিতরে ৮০ টাকা, ঢাকার বাইরে ১৫০ টাকা।\n৩. পণ্য হাতে পেয়ে চেক করে পেমেন্ট করার নিশ্চয়তা।',
    about:
      'ইকম বাইট (EcomByte) বাংলাদেশের একটি বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। আমরা সাশ্রয়ী মূল্যে প্রিমিয়াম কোয়ালিটি পণ্য সরবরাহ করে থাকি। আমাদের হটলাইন: 01982708789।',
  });

  const handleSavePageContent = () => {
    localStorage.setItem('ecom_page_contents', JSON.stringify(pageContents));
    showToast('পেজের কনটেন্ট সফলভাবে সংরক্ষিত হয়েছে!');
  };

  const handleFormat = (prefix: string, suffix: string = '') => {
    const current = pageContents[selectedPolicyPage] || '';
    setPageContents({
      ...pageContents,
      [selectedPolicyPage]: current ? `${current}\n${prefix}নতুন লেখা${suffix}` : `${prefix}নতুন লেখা${suffix}`,
    });
  };

  // -------------------------------------------------------------
  // TAB 5: PIXEL SETTINGS (Screenshot 4)
  // -------------------------------------------------------------
  const [fbPixelId, setFbPixelId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ecom_pixel_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fbPixelId) return parsed.fbPixelId;
      }
    } catch {}
    return settings.fbPixelId || '';
  });

  const [fbApiToken, setFbApiToken] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ecom_pixel_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fbApiToken) return parsed.fbApiToken;
      }
    } catch {}
    return settings.fbApiToken || '';
  });

  const [tiktokPixelId, setTiktokPixelId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ecom_pixel_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tiktokPixelId) return parsed.tiktokPixelId;
      }
    } catch {}
    return '';
  });

  const [tiktokApiToken, setTiktokApiToken] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ecom_pixel_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tiktokApiToken) return parsed.tiktokApiToken;
      }
    } catch {}
    return '';
  });

  const [pixelLogs, setPixelLogs] = useState<PixelEventLog[]>(getPixelLogs);

  React.useEffect(() => {
    const unsub = onPixelLogUpdate((logs) => setPixelLogs(logs));
    return unsub;
  }, []);

  const handleSavePixels = () => {
    const cleanFbPixelId = fbPixelId.trim();
    const cleanFbApiToken = fbApiToken.trim();
    const cleanTiktokPixelId = tiktokPixelId.trim();
    const cleanTiktokApiToken = tiktokApiToken.trim();

    localStorage.setItem(
      'ecom_pixel_settings',
      JSON.stringify({
        fbPixelId: cleanFbPixelId,
        fbApiToken: cleanFbApiToken,
        tiktokPixelId: cleanTiktokPixelId,
        tiktokApiToken: cleanTiktokApiToken,
      })
    );

    updateSettings({
      fbPixelId: cleanFbPixelId,
      fbApiToken: cleanFbApiToken,
    });

    if (cleanFbPixelId) {
      initFacebookPixel(cleanFbPixelId);
      trackFacebookEvent('PageView', {
        page_name: 'Admin Pixel Settings',
        source: 'Pixel Setup Saved',
      });
    }

    showToast('Facebook Pixel সফলভাবে সক্রিয় ও সংরক্ষিত হয়েছে! পুরো ওয়েবসাইটে ট্র্যাকিং চালু আছে।');
  };

  const handleTriggerTestEvent = (eventName: string) => {
    if (!fbPixelId.trim()) {
      showToast('অনুগ্রহ করে প্রথমে আপনার Facebook Pixel ID লিখে Save করুন!');
      return;
    }

    switch (eventName) {
      case 'PageView':
        trackFacebookEvent('PageView', {
          test_event: true,
          page_title: 'Homepage - EcomByte',
          url: window.location.href,
        });
        break;
      case 'ViewContent':
        trackFacebookEvent('ViewContent', {
          test_event: true,
          content_name: 'সরিষার খাঁটি তেল ১ লিটার',
          content_category: 'সরিষার তেল',
          content_ids: ['prod-oil-1'],
          content_type: 'product',
          value: 390,
          currency: 'BDT',
        });
        break;
      case 'AddToCart':
        trackFacebookEvent('AddToCart', {
          test_event: true,
          content_name: 'সরিষার খাঁটি তেল ১ লিটার',
          content_ids: ['prod-oil-1'],
          content_type: 'product',
          value: 390,
          currency: 'BDT',
          quantity: 1,
        });
        break;
      case 'InitiateCheckout':
        trackFacebookEvent('InitiateCheckout', {
          test_event: true,
          content_ids: ['prod-oil-1'],
          content_type: 'product',
          num_items: 1,
          value: 390,
          currency: 'BDT',
        });
        break;
      case 'Purchase':
        trackFacebookEvent('Purchase', {
          test_event: true,
          content_ids: ['prod-oil-1'],
          content_type: 'product',
          value: 470,
          currency: 'BDT',
          num_items: 1,
          order_id: `TEST-${Date.now()}`,
          payment_method: 'cod',
        });
        break;
      default:
        trackFacebookEvent(eventName, { test_event: true });
    }

    showToast(`টেস্ট ইভেন্ট '${eventName}' সফলভাবে ফায়ার করা হয়েছে!`);
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="settings"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Tabs matching Screenshots */}
        <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-6 sticky top-0 z-10 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('web')}
            className={`flex items-center gap-1.5 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'web'
                ? 'text-[#990000] border-[#990000] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Web Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('order')}
            className={`flex items-center gap-1.5 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'order'
                ? 'text-[#990000] border-[#990000] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Order Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-1.5 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'text-[#990000] border-[#990000] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('page')}
            className={`flex items-center gap-1.5 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'page'
                ? 'text-[#990000] border-[#990000] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Page Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('pixel')}
            className={`flex items-center gap-1.5 py-2.5 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
              activeTab === 'pixel'
                ? 'text-[#990000] border-[#990000] font-bold'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Pixel Settings</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-500 hover:text-emerald-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: ORDER SETTINGS (Screenshot 1)                           */}
          {/* ============================================================== */}
          {activeTab === 'order' && (
            <div className="space-y-6">
              {/* Row 1: Mobile verification & Location fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mobile number verification */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Mobile number verification</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      কাস্টমার অর্ডার করার সাথে সাথেই তার মোবাইল নাম্বারে একটা কোড যাবে যেটা কাস্টমারকে ভেরিফাই করতে হবে।
                    </p>
                    <p className="text-xs font-bold text-slate-800 pt-1">
                      এতে কেউ আর ফেক অর্ডার করতে পারবে না
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      const val = !mobileVerification;
                      setMobileVerification(val);
                      handleToggleOrderSetting('mobileVerification', val);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      mobileVerification ? 'bg-[#990000]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        mobileVerification ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Location fields */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Location fields</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      কাস্টমার জেলা উপজেলা সিলেক্ট করলে সঠিক ডেলিভারি চার্জ যুক্ত হবে।
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      const val = !locationFields;
                      setLocationFields(val);
                      handleToggleOrderSetting('locationFields', val);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      locationFields ? 'bg-[#990000]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        locationFields ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Row 2: VPN protection & Order confirmation SMS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* VPN protection */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">VPN protection</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      VPN ব্যবহার করে অর্ডার করা কাস্টমারদের অর্ডার ব্লক করবে।
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      const val = !vpnProtection;
                      setVpnProtection(val);
                      handleToggleOrderSetting('vpnProtection', val);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      vpnProtection ? 'bg-[#990000]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        vpnProtection ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Order confirmation SMS */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-800">Order confirmation SMS</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      অর্ডার সফল হওয়ার পর কাস্টমারের মোবাইল নাম্বারে একটি কনফার্মেশন SMS পাঠাবে।
                    </p>
                  </div>
                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => {
                      const val = !orderConfirmationSms;
                      setOrderConfirmationSms(val);
                      handleToggleOrderSetting('orderConfirmationSms', val);
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      orderConfirmationSms ? 'bg-[#990000]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        orderConfirmationSms ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Row 3: Duplicate order block & Courier protection (with inputs) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Duplicate order block */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Duplicate order block</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          একই কাস্টমার আপনার সেট করা মিনিটের মধ্যে একবারের বেশি অর্ডার করতে পারবে না।
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !duplicateOrderBlock;
                          setDuplicateOrderBlock(val);
                          handleToggleOrderSetting('duplicateOrderBlock', val);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          duplicateOrderBlock ? 'bg-[#990000]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            duplicateOrderBlock ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Order block time (minutes) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="number"
                          value={orderBlockTime}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOrderBlockTime(val);
                            handleToggleOrderSetting('orderBlockTime', val);
                          }}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Courier protection */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Courier protection</h4>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          কাস্টমারের পার্সেল রিসিভ করার সাকসেস রেশিও আপনার সেট করা রেশিও এর চেয়ে কম হলে অর্ডার করতে পারবে না
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = !courierProtection;
                          setCourierProtection(val);
                          handleToggleOrderSetting('courierProtection', val);
                        }}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          courierProtection ? 'bg-[#990000]' : 'bg-slate-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            courierProtection ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Success ratio
                      </label>
                      <div className="relative">
                        <span className="text-slate-400 absolute left-3 top-2 text-xs font-bold">%</span>
                        <input
                          type="text"
                          value={successRatio}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSuccessRatio(val);
                            handleToggleOrderSetting('successRatio', val);
                          }}
                          placeholder="Enter success ratio"
                          className="w-full pl-8 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSaveOrderSettings}
                  className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: COUPONS (Screenshot 2)                                  */}
          {/* ============================================================== */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              {/* 3 Top Stat Cards matching Screenshot 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Total</span>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{couponsList.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Tag className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </div>

                {/* Active */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Active</span>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{activeCouponsCount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Check className="w-5 h-5 stroke-[2]" />
                  </div>
                </div>

                {/* Expired */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Expired</span>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{expiredCouponsCount}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </div>
              </div>

              {/* All Coupons Section Header & Search */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                <h3 className="text-sm font-bold text-slate-800">All Coupons</h3>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponSearch}
                      onChange={(e) => setCouponSearch(e.target.value)}
                      placeholder="Search by code..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#990000]"
                    />
                  </div>

                  <button
                    onClick={() => setIsAddCouponModalOpen(true)}
                    className="bg-[#990000] hover:bg-[#800000] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Coupon</span>
                  </button>
                </div>
              </div>

              {/* Coupons Table matching Screenshot 2 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#1e3a8a] text-white font-semibold">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Expires</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Options</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCoupons.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                          No coupons yet. Click "Add Coupon" to create one.
                        </td>
                      </tr>
                    ) : (
                      filteredCoupons.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">
                            {c.code}
                          </td>
                          <td className="py-3 px-4 font-bold text-[#990000]">
                            {c.discount}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-medium">
                            {c.expires}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                c.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Add Coupon Modal */}
              {isAddCouponModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="text-sm font-bold text-slate-800">Create New Coupon</h3>
                      <button onClick={() => setIsAddCouponModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Coupon Code *</label>
                        <input
                          type="text"
                          required
                          value={newCouponCode}
                          onChange={(e) => setNewCouponCode(e.target.value)}
                          placeholder="e.g. DISCOUNT20"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-800 uppercase font-mono font-bold focus:outline-none focus:border-[#990000]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Discount Type</label>
                          <select
                            value={newCouponType}
                            onChange={(e) => setNewCouponType(e.target.value as any)}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-700 bg-white focus:outline-none"
                          >
                            <option value="percent">Percentage (%)</option>
                            <option value="fixed">Fixed Amount (৳)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Discount Value *</label>
                          <input
                            type="text"
                            required
                            value={newCouponDiscount}
                            onChange={(e) => setNewCouponDiscount(e.target.value)}
                            placeholder={newCouponType === 'percent' ? 'e.g. 15' : 'e.g. 100'}
                            className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#990000]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Expiry Date</label>
                        <input
                          type="date"
                          value={newCouponExpires}
                          onChange={(e) => setNewCouponExpires(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-700 focus:outline-none focus:border-[#990000]"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t">
                        <button
                          type="button"
                          onClick={() => setIsAddCouponModalOpen(false)}
                          className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded text-xs font-bold"
                        >
                          Save Coupon
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: PAGE SETTINGS (Screenshot 3)                            */}
          {/* ============================================================== */}
          {activeTab === 'page' && (
            <div className="space-y-6">
              {/* Select a page pills matching Screenshot 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <span className="block text-xs font-semibold text-slate-600">Select a page</span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'privacy', label: 'প্রাইভেসি পলিসি' },
                    { id: 'terms', label: 'শর্তাবলী' },
                    { id: 'return', label: 'রিটার্ন পলিসি' },
                    { id: 'delivery', label: 'ডেলিভারি পলিসি' },
                    { id: 'about', label: 'আমাদের সম্পর্কে' },
                  ].map((p) => {
                    const isSelected = selectedPolicyPage === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPolicyPage(p.id as PolicyPageKey)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#990000] text-white shadow-2xs'
                            : 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rich Page Content Editor matching Screenshot 3 */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
                <span className="block text-xs font-semibold text-slate-600">Page content</span>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border border-slate-200 rounded-t-lg text-slate-600 text-xs">
                  <button
                    type="button"
                    onClick={() => handleFormat('**', '**')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('*', '*')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('<u>', '</u>')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Underline"
                  >
                    <Underline className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('~~', '~~')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Strikethrough"
                  >
                    <Strikethrough className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => handleFormat('## ')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Heading 2"
                  >
                    <Heading2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('• ')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('1. ')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('> ')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => handleFormat('[লিঙ্ক শিরোনাম](https://example.com)')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Insert Link"
                  >
                    <Link className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('![ছবি](https://images.unsplash.com/photo-1542838132-92c53300491e)')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Insert Image"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFormat('<iframe src="video-url"></iframe>')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Insert Video"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => showToast('পূর্বাবস্থায় ফেরানো হয়েছে')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Undo"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('পুনরায় করা হয়েছে')}
                    className="p-1.5 hover:bg-white hover:text-slate-900 rounded transition-colors"
                    title="Redo"
                  >
                    <Redo2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  rows={10}
                  value={pageContents[selectedPolicyPage] || ''}
                  onChange={(e) =>
                    setPageContents({
                      ...pageContents,
                      [selectedPolicyPage]: e.target.value,
                    })
                  }
                  placeholder="পেজের কনটেন্ট লিখুন..."
                  className="w-full p-4 border border-t-0 border-slate-200 rounded-b-lg text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-[#990000] font-sans"
                />
              </div>

              {/* Bottom Save Page Button matching Screenshot 3 */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePageContent}
                  className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Page</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: PIXEL SETTINGS (Screenshot 4)                           */}
          {/* ============================================================== */}
          {activeTab === 'pixel' && (
            <div className="space-y-6">
              {/* Facebook Card with Status & Comprehensive Coverage */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      f
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Facebook (Meta) Pixel</h4>
                      <p className="text-[11px] text-slate-500">পুরো ওয়েবসাইটে ১০০% নির্ভুল ট্র্যাকিং নিশ্চিত করে</p>
                    </div>
                  </div>

                  {/* Real-time Status Badge */}
                  <div className="flex items-center gap-2">
                    {fbPixelId.trim() ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>সক্রিয় (Active Tracking)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>পিক্সেল আইডি সেট করুন</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Tracking Coverage Summary Strip */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h5 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>ওয়েবসাইটে যেসকল স্ট্যান্ডার্ড ইভেন্ট স্বয়ংক্রিয়ভাবে ট্র্যাক হয়:</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">1. PageView</span>
                      <p className="text-[10px] text-slate-500">হোম, ক্যাটাগরি ও সব পেজ</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">2. ViewContent</span>
                      <p className="text-[10px] text-slate-500">প্রোডাক্ট বিস্তারিত দেখা</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">3. AddToCart</span>
                      <p className="text-[10px] text-slate-500">কার্টে পণ্য যোগ করা</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">4. AddToWishlist</span>
                      <p className="text-[10px] text-slate-500">পছন্দের তালিকায় রাখা</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">5. InitiateCheckout</span>
                      <p className="text-[10px] text-slate-500">চেকআউট ও অর্ডার পেজ</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">6. Purchase</span>
                      <p className="text-[10px] text-slate-500">অর্ডার সফল হওয়া</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">7. Search</span>
                      <p className="text-[10px] text-slate-500">সার্চ বারে পণ্য খোঁজা</p>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
                      <span className="font-bold text-[#1877f2]">8. Contact</span>
                      <p className="text-[10px] text-slate-500">WhatsApp ও কল করা</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pixel ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Facebook Pixel ID <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="w-4 h-4 rounded-full bg-[#1877f2] text-white text-[9px] font-bold flex items-center justify-center absolute left-3 top-2.5">
                        f
                      </div>
                      <input
                        type="text"
                        value={fbPixelId}
                        onChange={(e) => setFbPixelId(e.target.value)}
                        placeholder="e.g. 1234567890123456"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000] font-mono font-medium text-slate-800"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Meta Events Manager থেকে পাওয়া ১৫ বা ১৬ ডিজিটের পিক্সেল আইডি দিন।
                    </p>
                  </div>

                  {/* Conversion API Access Token */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Conversion API Access Token (Optional)
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={fbApiToken}
                        onChange={(e) => setFbApiToken(e.target.value)}
                        placeholder="e.g. EAAG..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000] font-mono truncate"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                      সার্ভার-সাইড ট্র্যাকিং ও AdBlocker বাইপাসের জন্য Access Token।
                    </p>
                  </div>
                </div>

                {/* Test Events Trigger Bar */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">
                      পিক্সেল টেস্ট করুন (Test Standard Events):
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ক্লিক করে লাইভ ট্র্যাকিং চেক করুন
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerTestEvent('PageView')}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors cursor-pointer border border-slate-200 shadow-2xs"
                    >
                      Test PageView
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerTestEvent('ViewContent')}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors cursor-pointer border border-blue-200 shadow-2xs"
                    >
                      Test ViewContent
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerTestEvent('AddToCart')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold transition-colors cursor-pointer border border-amber-200 shadow-2xs"
                    >
                      Test AddToCart
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerTestEvent('InitiateCheckout')}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-colors cursor-pointer border border-purple-200 shadow-2xs"
                    >
                      Test InitiateCheckout
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerTestEvent('Purchase')}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-200 shadow-2xs"
                    >
                      Test Purchase
                    </button>
                  </div>
                </div>

                {/* Live Events Log Table */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>রিসেন্ট ট্র্যাকিং লগ (Recent Event Activity):</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {pixelLogs.length} events logged
                    </span>
                  </div>

                  <div className="bg-slate-900 text-slate-100 rounded-xl p-3 max-h-48 overflow-y-auto font-mono text-[11px] space-y-1.5 border border-slate-800">
                    {pixelLogs.length === 0 ? (
                      <p className="text-slate-500 text-center py-2 text-xs">
                        এখনো কোনো ইভেন্ট ফায়ার হয়নি। উপরের টেস্ট বাটনে ক্লিক করুন অথবা ওয়েবসাইটে ব্রাউজ করুন।
                      </p>
                    ) : (
                      pixelLogs.slice(0, 10).map((log) => (
                        <div key={log.id} className="flex items-start justify-between gap-2 border-b border-slate-800 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold">✓ {log.eventName}</span>
                            <span className="text-slate-400 text-[10px] truncate max-w-xs">
                              {JSON.stringify(log.params || {})}
                            </span>
                          </div>
                          <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* TikTok Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                    ♪
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">TikTok Pixel</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pixel ID */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      TikTok Pixel ID
                    </label>
                    <div className="relative">
                      <span className="text-slate-900 text-xs font-bold absolute left-3 top-2">♪</span>
                      <input
                        type="text"
                        value={tiktokPixelId}
                        onChange={(e) => setTiktokPixelId(e.target.value)}
                        placeholder="e.g. C4ABCDEFGHJKLLMN"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000] font-mono"
                      />
                    </div>
                  </div>

                  {/* Events API Access Token */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Events API Access Token
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={tiktokApiToken}
                        onChange={(e) => setTiktokApiToken(e.target.value)}
                        placeholder="e.g. ts_..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300 rounded-lg focus:outline-none focus:border-[#990000] font-mono truncate"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Save Button matching Screenshot 4 */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSavePixels}
                  className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Pixel Settings</span>
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: WEB SETTINGS                                            */}
          {/* ============================================================== */}
          {activeTab === 'web' && (
            <div className="space-y-6">
              {/* Section 1: General Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Globe className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">General Information</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Brand Logo Upload Section */}
                  <div className="lg:col-span-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800">
                        Brand Logo (লোগো)
                      </label>
                      <div className="flex items-center gap-1 bg-white p-0.5 rounded-md border border-slate-200 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setLogoUploadMode('upload')}
                          className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                            logoUploadMode === 'upload'
                              ? 'bg-[#990000] text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Upload
                        </button>
                        <button
                          type="button"
                          onClick={() => setLogoUploadMode('url')}
                          className={`px-2 py-0.5 rounded font-medium transition-colors cursor-pointer ${
                            logoUploadMode === 'url'
                              ? 'bg-[#990000] text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Image URL
                        </button>
                      </div>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={logoFileInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                      onChange={handleLogoFileUpload}
                      className="hidden"
                    />

                    {/* Logo Preview / Upload Area */}
                    {logoUrl ? (
                      <div className="space-y-3">
                        <div className="relative border-2 border-dashed border-emerald-400 rounded-xl p-4 flex flex-col items-center justify-center bg-white shadow-2xs group min-h-[160px]">
                          <div className="w-full h-24 flex items-center justify-center p-2">
                            <img
                              src={logoUrl}
                              alt="Brand Logo"
                              className="max-h-full max-w-full object-contain rounded"
                            />
                          </div>

                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-2">
                            ✓ বর্তমান লোগো (Active)
                          </span>

                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                            title="লোগো মুছুন"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logoFileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          >
                            <Upload className="w-3.5 h-3.5 text-[#990000]" />
                            <span>লোগো পরিবর্তন করুন</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="লোগো ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {logoUploadMode === 'upload' ? (
                          <div
                            onClick={() => logoFileInputRef.current?.click()}
                            className="border-2 border-dashed border-rose-300 hover:border-[#990000] rounded-xl p-5 flex flex-col items-center justify-center bg-white shadow-2xs hover:bg-rose-50/40 transition-all cursor-pointer group min-h-[160px] text-center"
                          >
                            <div className="w-12 h-12 rounded-full bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-[#990000] mb-2 transition-colors">
                              <UploadCloud className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-[#990000] transition-colors">
                              লোগো ইমেজ আপলোড করুন
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              ক্লিক করে ডিভাইস থেকে ছবি বাছাই করুন
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              PNG, JPG, SVG, WebP (Max 5MB)
                            </p>
                            <button
                              type="button"
                              className="mt-3 px-3 py-1 bg-[#990000] hover:bg-[#800000] text-white text-[11px] font-bold rounded-md shadow-xs pointer-events-none"
                            >
                              ব্রাউজ করুন
                            </button>
                          </div>
                        ) : (
                          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5 shadow-2xs">
                            <label className="block text-[11px] font-semibold text-slate-700">
                              Direct Image URL লিখুন
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={logoUrlInput}
                                onChange={(e) => setLogoUrlInput(e.target.value)}
                                placeholder="https://example.com/logo.png"
                                className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                              />
                              <button
                                type="button"
                                onClick={handleApplyLogoUrl}
                                className="px-3 py-1.5 bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
                              >
                                যুক্ত করুন
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400">
                              অনলাইন ইমেজ লিঙ্ক থাকলে এখানে পেস্ট করুন
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle show text next to logo */}
                    {logoUrl && (
                      <label className="flex items-center gap-2 px-1 py-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={showLogoText}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setShowLogoText(val);
                            updateSettings({ showLogoText: val });
                          }}
                          className="w-3.5 h-3.5 text-[#990000] rounded border-slate-300 focus:ring-[#990000]"
                        />
                        <span className="text-[11px] text-slate-600 font-medium">
                          লোগোর পাশে সাইটের নাম ও স্লোগান দেখাবেন? (ডিফল্ট: হাইড)
                        </span>
                      </label>
                    )}

                    {/* Live Preview on Storefront Header badge */}
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          ১. হেডারে কেমন দেখাবে (Header Preview)
                        </p>
                        {logoUrl && (
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {showLogoText ? 'লোগো + নাম' : 'শুধুমাত্র লোগো'}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100 min-h-[46px]">
                        {logoUrl ? (
                          <>
                            <img
                              src={logoUrl}
                              alt="Logo preview"
                              className="h-9 max-w-[170px] object-contain rounded"
                            />
                            {showLogoText && (
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-slate-900 leading-tight">
                                  {siteName || 'Somadhan Point'}
                                </span>
                                <span className="text-[9px] text-slate-500 truncate max-w-[140px]">
                                  {slogan || 'বিশ্বস্ত অনলাইন শপ'}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded bg-[#990000] flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0">
                              SP
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-900 leading-tight">
                                {siteName || 'Somadhan Point'}
                              </span>
                              <span className="text-[9px] text-slate-500 truncate max-w-[140px]">
                                {slogan || 'বিশ্বস্ত অনলাইন শপ'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Footer Logo Controls & Dark Footer Live Preview */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          ২. ফুটার লোগো স্টাইল (Footer Logo)
                        </p>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {footerLogoBg === 'white_card' ? 'সাদা কার্ড (স্পষ্ট)' : 'স্বচ্ছ'}
                        </span>
                      </div>

                      {/* Style Toggle Buttons */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setFooterLogoBg('white_card');
                            updateSettings({ footerLogoBg: 'white_card' });
                            showToast('ফুটার লোগো স্টাইল: সাদা কার্ড (Crystal Clear) সিলেক্ট হয়েছে');
                          }}
                          className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                            footerLogoBg === 'white_card'
                              ? 'border-[#990000] bg-rose-50 text-[#990000] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
                            সাদা কার্ড (প্রস্তাবিত)
                          </span>
                          <span className="text-[9px] text-slate-500 font-normal">
                            ডার্ক ফুটারে ১০০% ক্লিয়ার ও ঝকঝকে
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setFooterLogoBg('transparent');
                            updateSettings({ footerLogoBg: 'transparent' });
                            showToast('ফুটার লোগো স্টাইল: স্বচ্ছ ব্যাকগ্রাউন্ড সিলেক্ট হয়েছে');
                          }}
                          className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                            footerLogoBg === 'transparent'
                              ? 'border-[#990000] bg-rose-50 text-[#990000] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            স্বচ্ছ (Transparent)
                          </span>
                          <span className="text-[9px] text-slate-500 font-normal">
                            কোনো ব্যাকগ্রাউন্ড ছাড়াই
                          </span>
                        </button>
                      </div>

                      {/* Footer Real-time Preview matching Dark #111827 */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          ডার্ক ফুটারে যেমন দেখাবে:
                        </span>
                        <div className="bg-[#111827] p-3 rounded-lg border border-slate-800 flex items-center justify-center min-h-[64px]">
                          {(footerLogoUrl || logoUrl) ? (
                            <div
                              className={
                                footerLogoBg === 'transparent'
                                  ? 'p-1'
                                  : 'bg-white rounded-xl px-3 py-1.5 shadow-md border border-white/20 inline-flex items-center justify-center'
                              }
                            >
                              <img
                                src={footerLogoUrl || logoUrl}
                                alt="Footer Logo Preview"
                                className={`h-8 sm:h-9 max-w-[170px] object-contain ${
                                  footerLogoBg === 'transparent'
                                    ? 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.25)]'
                                    : ''
                                }`}
                              />
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">লোগো আপলোড করা নেই</span>
                          )}
                        </div>
                      </div>

                      {/* Optional separate footer logo file upload */}
                      <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                        <input
                          ref={footerLogoFileInputRef}
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                          onChange={handleFooterLogoFileUpload}
                          className="hidden"
                        />
                        {footerLogoUrl ? (
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[10px] text-emerald-600 font-medium truncate max-w-[150px]">
                              ✓ নিজস্ব ফুটার লোগো যুক্ত আছে
                            </span>
                            <button
                              type="button"
                              onClick={handleRemoveFooterLogo}
                              className="text-[10px] text-rose-600 hover:text-rose-700 underline font-semibold cursor-pointer"
                            >
                              রিমুভ করুন
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => footerLogoFileInputRef.current?.click()}
                            className="text-[10px] text-[#990000] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>আলাদা ফুটার লোগো আপলোড (ঐচ্ছিক)</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Admin Sidebar Logo Controls & Dark Sidebar Live Preview */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          ৩. অ্যাডমিন সাইডবার লোগো স্টাইল
                        </p>
                        <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {adminLogoBg === 'white_card' ? 'সাদা কার্ড (স্পষ্ট)' : 'স্বচ্ছ'}
                        </span>
                      </div>

                      {/* Style Toggle Buttons */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            setAdminLogoBg('white_card');
                            updateSettings({ adminLogoBg: 'white_card' });
                            showToast('অ্যাডমিন সাইডবার লোগো স্টাইল: সাদা কার্ড (Crystal Clear) সিলেক্ট হয়েছে');
                          }}
                          className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                            adminLogoBg === 'white_card'
                              ? 'border-[#990000] bg-rose-50 text-[#990000] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#990000]"></span>
                            সাদা কার্ড (প্রস্তাবিত)
                          </span>
                          <span className="text-[9px] text-slate-500 font-normal">
                            ডার্ক সাইডবারে ১০০% ক্লিয়ার ও ঝকঝকে
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAdminLogoBg('transparent');
                            updateSettings({ adminLogoBg: 'transparent' });
                            showToast('অ্যাডমিন সাইডবার লোগো স্টাইল: স্বচ্ছ ব্যাকগ্রাউন্ড সিলেক্ট হয়েছে');
                          }}
                          className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 cursor-pointer transition-all ${
                            adminLogoBg === 'transparent'
                              ? 'border-[#990000] bg-rose-50 text-[#990000] font-bold shadow-xs'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            স্বচ্ছ (Transparent)
                          </span>
                          <span className="text-[9px] text-slate-500 font-normal">
                            কোনো ব্যাকগ্রাউন্ড ছাড়াই
                          </span>
                        </button>
                      </div>

                      {/* Real-time Preview matching Dark Admin Sidebar #111827 */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 font-medium">
                          অ্যাডমিন সাইডবারে যেমন দেখাবে:
                        </span>
                        <div className="bg-[#111827] p-2.5 rounded-lg border border-slate-800 flex items-center justify-between min-h-[50px] px-3">
                          <div className="flex items-center gap-2">
                            {logoUrl ? (
                              <div
                                className={
                                  adminLogoBg === 'transparent'
                                    ? 'p-0.5'
                                    : 'bg-white rounded-lg px-2 py-1 shadow-sm border border-white/20 inline-flex items-center justify-center'
                                }
                              >
                                <img
                                  src={logoUrl}
                                  alt="Sidebar Logo Preview"
                                  className={`h-7 max-w-[120px] object-contain ${
                                    adminLogoBg === 'transparent'
                                      ? 'drop-shadow-[0_1px_4px_rgba(255,255,255,0.3)]'
                                      : ''
                                  }`}
                                />
                              </div>
                            ) : (
                              <span className="text-white text-xs font-bold">SP</span>
                            )}
                            {showLogoText && (
                              <span className="text-white text-xs font-bold truncate max-w-[80px]">
                                {siteName || 'Somadhan Point'}
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] text-slate-500 bg-slate-800/80 px-1.5 py-0.5 rounded">
                            Sidebar
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Site Name
                      </label>
                      <div className="relative">
                        <Type className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={siteName}
                          onChange={(e) => setSiteName(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 font-semibold text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Slogan
                      </label>
                      <div className="relative">
                        <Type className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={slogan}
                          onChange={(e) => setSlogan(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 font-medium text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Description
                      </label>
                      <div className="relative">
                        <Type className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-red-500 text-slate-700"
                        />
                      </div>
                    </div>


                  </div>
                </div>
              </div>

              {/* Section 2: Banners */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-slate-700" />
                    <h3 className="text-sm font-bold text-slate-900">Banners (হোমপেজ ব্যানারসমূহ)</h3>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    সরাসরি কম্পিউটার থেকে ছবি আপলোড করুন
                  </span>
                </div>

                {/* Hidden File Inputs for Banner Upload */}
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleBannerFileUpload}
                  className="hidden"
                />
                <input
                  ref={replaceBannerInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleReplaceBannerFileUpload}
                  className="hidden"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((b) => (
                    <div key={b.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-600">
                          Banner Image
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          Active
                        </span>
                      </div>

                      <div className="relative rounded-xl overflow-hidden border-2 border-dashed border-rose-300/80 aspect-[16/9] group shadow-2xs bg-slate-50">
                        <img
                          src={b.imageUrl}
                          alt="Banner"
                          className="w-full h-full object-cover"
                        />

                        {/* Hover Overlay to change image */}
                        <div
                          onClick={() => {
                            setReplacingBannerId(b.id);
                            replaceBannerInputRef.current?.click();
                          }}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity cursor-pointer p-2 text-white"
                          title="ছবি পরিবর্তন করতে ক্লিক করুন"
                        >
                          <Upload className="w-6 h-6 mb-1 text-white" />
                          <span className="text-xs font-bold drop-shadow">ছবি পরিবর্তন করতে ক্লিক করুন</span>
                        </div>

                        {/* Red (X) delete button on top-right */}
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(b.id)}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition-colors cursor-pointer z-10"
                          title="ব্যানার ডিলিট করুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setReplacingBannerId(b.id);
                            replaceBannerInputRef.current?.click();
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#990000]" />
                          <span>ছবি পরিবর্তন</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(b.id)}
                          className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                          title="ব্যানার ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Banner Card via Direct File Upload */}
                  <div className="flex flex-col justify-center">
                    <span className="block text-[11px] font-semibold text-transparent mb-2 select-none">Add</span>
                    <div
                      onClick={() => bannerFileInputRef.current?.click()}
                      className="w-full aspect-[16/9] border-2 border-dashed border-rose-300/80 hover:border-[#990000] rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-[#990000] transition-all bg-white hover:bg-rose-50/30 cursor-pointer shadow-2xs group"
                      title="নতুন ব্যানার ছবি আপলোড করুন"
                    >
                      <div className="w-10 h-10 rounded-full bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center text-[#990000] mb-2 transition-colors">
                        <Plus className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="text-xs font-bold text-slate-700 group-hover:text-[#990000] transition-colors">
                        ব্যানার আপলোড করুন
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG, WebP (Max 5MB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Theme */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Sun className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Theme</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Primary Color
                    </label>
                    <div className="flex items-center gap-2 border border-rose-300/80 rounded-lg px-3 py-1.5 bg-white shadow-2xs">
                      <span className="w-5 h-5 rounded border border-slate-300 shadow-2xs shrink-0" style={{ backgroundColor: primaryColor }}></span>
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full text-xs font-mono font-medium text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Background Color
                    </label>
                    <div className="flex items-center gap-2 border border-rose-300/80 rounded-lg px-3 py-1.5 bg-white shadow-2xs">
                      <span className="w-5 h-5 rounded border border-slate-300 shadow-2xs shrink-0" style={{ backgroundColor: bgColor }}></span>
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full text-xs font-mono font-medium text-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Contact Information */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Phone className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone 1</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={phone1}
                        onChange={(e) => setPhone1(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone 2</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={phone2}
                        onChange={(e) => setPhone2(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp 1</label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={whatsapp1}
                        onChange={(e) => setWhatsapp1(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp 2</label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={whatsapp2}
                        onChange={(e) => setWhatsapp2(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Address</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Map Embed URL</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={mapEmbed}
                      onChange={(e) => setMapEmbed(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-600 truncate"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Notices */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MessageCircle className="w-4 h-4 text-slate-700" />
                  <h3 className="text-sm font-bold text-slate-900">Notices</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Marquee Text</label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={marqueeText}
                        onChange={(e) => setMarqueeText(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Order Note</label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 6: Social Media with Real Brand Icons */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-slate-700" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">সোশ্যাল মিডিয়া সেটিংস (Social Media Links)</h3>
                      <p className="text-[11px] text-slate-500">এখানে যে লিংকগুলো দিবেন, ওয়েবসাইটের ফুটারে রিয়েল আইকনগুলোতে ক্লিক করলে সেই লিংকে যাবে।</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>৫টি রিয়েল সোশ্যাল আইকন সক্রিয়</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Facebook */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </span>
                      <span>Facebook Page / Profile URL</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://www.facebook.com/shishir9barai"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </span>
                      <span>Instagram URL</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://www.instagram.com/..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* YouTube */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                      </span>
                      <span>YouTube Channel URL</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        placeholder="https://www.youtube.com/@..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* TikTok */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center shrink-0 border border-slate-700 shadow-xs">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                      </span>
                      <span>TikTok URL</span>
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://www.tiktok.com/@..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      </span>
                      <span>WhatsApp Link / মোবাইল নম্বর</span>
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={whatsapp1}
                        onChange={(e) => setWhatsapp1(e.target.value)}
                        placeholder="01982708789 বা https://wa.me/..."
                        className="w-full pl-9 pr-3 py-2 text-xs border border-rose-300/80 rounded-lg font-mono text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Preview of Social Icons */}
                <div className="bg-slate-900 rounded-xl p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <span>আইকনগুলোর লাইভ প্রিভিউ (ক্লিক করে সরাসরি টেস্ট করুন):</span>
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">ওয়েবসাইটের ফুটারে ঠিক এই ৫টি রিয়েল আইকন দেখা যাবে।</p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* FB */}
                    <a
                      href={facebook || 'https://www.facebook.com/shishir9barai'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#1877F2] hover:bg-[#166fe5] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                      title="Facebook টেস্ট করুন"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* Instagram */}
                    <a
                      href={instagram || 'https://www.instagram.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                      title="Instagram টেস্ট করুন"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>

                    {/* YouTube */}
                    <a
                      href={youtube || 'https://www.youtube.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#FF0000] hover:bg-[#e60000] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                      title="YouTube টেস্ট করুন"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>

                    {/* TikTok */}
                    <a
                      href={tiktok || 'https://www.tiktok.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-black hover:bg-zinc-800 text-white border border-slate-700 flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                      title="TikTok টেস্ট করুন"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={
                        whatsapp1 && (whatsapp1.startsWith('http://') || whatsapp1.startsWith('https://'))
                          ? whatsapp1
                          : `https://wa.me/88${(whatsapp1 || '01982708789').replace(/\D/g, '').replace(/^88/, '')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-md hover:scale-110 transition-all cursor-pointer"
                      title="WhatsApp টেস্ট করুন"
                    >
                      <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom Right: Save Settings Button */}
              <div className="flex justify-end pt-2 pb-6">
                <button
                  type="button"
                  onClick={handleSaveWeb}
                  className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
