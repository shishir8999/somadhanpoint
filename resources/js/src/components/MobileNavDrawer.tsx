import React, { useState } from 'react';
import {
  X,
  Home,
  ShoppingBag,
  Grid,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileText,
  RefreshCw,
  Truck,
  Sparkles,
  ChevronRight,
  Package,
  Search,
  ExternalLink,
  User,
  LogOut
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { CIRCULAR_CATEGORIES } from '../data/products';
import { CustomerUser } from '../types';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateHome: () => void;
  onNavigateProducts: () => void;
  onNavigateCategory: (catName: string) => void;
  onNavigatePage: (pageId: 'about_us' | 'contact_us' | 'privacy_policy' | 'terms_conditions' | 'return_policy' | 'delivery_policy') => void;
  onNavigateOrderPage: () => void;
  onOpenAdmin?: () => void;
  currentCustomer?: CustomerUser | null;
  onOpenAuth?: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCategory,
  onNavigatePage,
  onNavigateOrderPage,
  onOpenAdmin,
  currentCustomer,
  onOpenAuth,
  onOpenProfile,
  onLogout,
}) => {
  const { settings } = useStoreSettings();
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [categories, setCategories] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return CIRCULAR_CATEGORIES;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Drawer Body */}
      <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-250">
        {/* Drawer Header */}
        <div className="p-4 bg-[#990000] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt={settings.siteName}
                className="h-8 w-auto max-w-[130px] object-contain rounded bg-white/10 p-0.5"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
                SP
              </div>
            )}
            <span className="text-base font-bold truncate">
              {settings.siteName}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Customer Auth Profile Card or Login Banner */}
          {currentCustomer ? (
            <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
              <div
                onClick={() => {
                  if (onOpenProfile) onOpenProfile();
                  onClose();
                }}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-8 h-8 rounded-full bg-[#990000] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                  {currentCustomer.name ? currentCustomer.name.charAt(0) : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate text-xs">{currentCustomer.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{currentCustomer.email}</p>
                </div>
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
                  title="লগআউট"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onOpenAuth) onOpenAuth();
                onClose();
              }}
              className="w-full bg-[#990000] hover:bg-[#800000] text-white font-bold p-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer text-xs"
            >
              <User className="w-4 h-4" />
              <span>লগইন / নতুন অ্যাকাউন্ট রেজিস্টার</span>
            </button>
          )}

          {/* Main Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-800 hover:bg-red-50 hover:text-[#990000] font-bold transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4 text-[#990000]" />
              <span>হোম পেজ</span>
            </button>

            <button
              onClick={() => {
                onNavigateProducts();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-800 hover:bg-red-50 hover:text-[#990000] font-bold transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#990000]" />
              <span>সকল পণ্যসমূহ</span>
            </button>

            <button
              onClick={() => {
                onNavigateOrderPage();
                onClose();
              }}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg text-slate-800 hover:bg-red-50 hover:text-[#990000] font-bold transition-colors cursor-pointer"
            >
              <Truck className="w-4 h-4 text-[#990000]" />
              <span>অর্ডার ট্র্যাকিং</span>
            </button>
          </div>

          {/* Categories Accordion */}
          <div className="border-t border-slate-100 pt-3">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1 cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-[#990000]" />
                <span>পণ্য ক্যাটাগরিজ</span>
              </div>
              <ChevronRight
                className={`w-3.5 h-3.5 transition-transform ${isCategoryOpen ? 'rotate-90' : ''}`}
              />
            </button>

            {isCategoryOpen && (
              <div className="space-y-0.5 pl-3 border-l-2 border-rose-100">
                {categories.map((cat: any) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onNavigateCategory(cat.name);
                      onClose();
                    }}
                    className="w-full text-left py-1.5 px-2 rounded text-slate-700 hover:text-[#990000] hover:bg-slate-50 font-medium transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">→</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Custom Information Pages */}
          <div className="border-t border-slate-100 pt-3">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
              দরকারী পেইজসমূহ
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onNavigatePage('about_us');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#990000]" />
                <span>আমাদের সম্পর্কে</span>
              </button>

              <button
                onClick={() => {
                  onNavigatePage('contact_us');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>যোগাযোগ ও সাপোর্ট</span>
              </button>

              <button
                onClick={() => {
                  onNavigatePage('privacy_policy');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>প্রাইভেসি পলিসি</span>
              </button>

              <button
                onClick={() => {
                  onNavigatePage('terms_conditions');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-purple-600" />
                <span>শর্তাবলী ও নিয়মাবলী</span>
              </button>

              <button
                onClick={() => {
                  onNavigatePage('return_policy');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                <span>রিটার্ন ও রিফান্ড পলিসি</span>
              </button>

              <button
                onClick={() => {
                  onNavigatePage('delivery_policy');
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 p-2 rounded-lg text-slate-700 hover:bg-slate-50 hover:text-[#990000] font-medium transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5 text-indigo-600" />
                <span>ডেলিভারি পলিসি ও চার্জ</span>
              </button>
            </div>
          </div>

          {/* Quick Hotline Call & WhatsApp Strip */}
          <div className="border-t border-slate-100 pt-3 space-y-2">
            <a
              href={`tel:${settings.phone1 || '01982708789'}`}
              className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>সরাসরি কল করুন</span>
              </div>
              <span className="font-mono text-[11px]">{settings.phone1 || '01982708789'}</span>
            </a>

            <a
              href={`https://wa.me/88${(settings.whatsapp1 || settings.phone1 || '01982708789').replace(/\D/g, '').replace(/^88/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 text-green-800 border border-green-200 font-bold transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp চ্যাট</span>
              </div>
              <span className="text-[10px]">অনলাইন →</span>
            </a>
          </div>
        </div>

        {/* Drawer Bottom Bar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} {settings.siteName}</span>
          {onOpenAdmin && (
            <button
              onClick={() => {
                onOpenAdmin();
                onClose();
              }}
              className="text-[#990000] hover:underline font-bold cursor-pointer"
            >
              Admin Portal
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
