import React, { useState } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ShieldCheck, 
  UserCheck, 
  DollarSign, 
  Settings, 
  User, 
  Sparkles,
  Bot,
  CreditCard,
  BookOpen,
  FolderLock,
  Globe,
  LogIn,
  LogOut,
  Briefcase,
  KeyRound,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';
import { User as UserType, SystemSettings } from '../types';
import { UserAvatar } from './UserAvatar';
import { storage } from '../services/storage';

interface NavbarProps {
  currentUser: UserType;
  allUsers: UserType[];
  onSwitchUser: (userId: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: SystemSettings;
  onToggleCurrency: () => void;
  onSelectPopularPlan?: () => void;
  isLoggedIn: boolean;
  onOpenLoginModal: (tab?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  activeTab,
  setActiveTab,
  settings,
  onToggleCurrency,
  onSelectPopularPlan,
  isLoggedIn,
  onOpenLoginModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isReseller = currentUser.role === 'reseller';
  const validity = storage.checkSubscriptionValidity(currentUser.subscriptionExpiry);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('omnicraft_theme') === 'dark';
    }
    return false;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omnicraft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omnicraft_theme', 'light');
    }
  };

  const navItems = [
    { id: 'lipika_workspace', label: 'Features', subLabel: 'ইউএসএ ফিচার লাইভ পেজ' },
    { id: 'in_app_chat', label: 'AI Models', subLabel: 'ChatGPT, Claude, Gemini' },
    { id: 'marketplace', label: 'Pricing / Store', subLabel: 'ডিজিটাল স্টোর ও প্ল্যান' },
    { id: 'reseller_panel', label: 'Reseller Hub', subLabel: 'রিসেলার পার্টনার প্যানেল' },
    { id: 'guides', label: 'FAQ', subLabel: 'পরিচালনা গাইড ও প্রশ্নোত্তর' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#070B16]/95 backdrop-blur-xl border-b border-slate-200/90 dark:border-white/10 shadow-xs select-none transition-colors duration-200">
      {/* Full Screen Header spanning 100% edge-to-edge without side gaps */}
      <div className="w-full px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between text-slate-900 dark:text-white">
        
        {/* 1. Left: Brand Logo & Text (Dynamically loaded from Super Admin settings) */}
        <div 
          onClick={() => setActiveTab('lipika_workspace')} 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.appName || 'Logo'} 
              className="h-8 sm:h-9 w-auto max-w-[200px] object-contain group-hover:scale-105 transition-all"
            />
          ) : (
            <>
              {/* Circular Swirl Icon with dynamic glow */}
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                <svg 
                  className="w-5 h-5 text-white" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                </svg>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight font-sans">
                  {settings.brandPrefix || (settings.appName?.includes(' ') ? settings.appName.split(' ')[0] : (settings.appName || 'OmniCraft'))}
                </span>
                <span className="font-bold text-lg sm:text-xl text-blue-600 dark:text-blue-400 font-sans tracking-tight">
                  {settings.brandSuffix || (settings.appName?.includes(' ') ? settings.appName.split(' ').slice(1).join(' ') : 'AI')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* 2. Center: Clean Navigation Links (Features, AI Models, Pricing, Reseller Hub, FAQ) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative text-sm font-medium transition-all duration-200 hover:text-blue-600 dark:hover:text-blue-400 hover:-translate-y-0.5 ${
                  isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* 3. Right: Theme Toggle, User Profile & Try for Free button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          
          {/* Light/Dark Mode Sun/Moon Button */}
          <button
            onClick={toggleTheme}
            title={isDark ? "লাইট মোড চালু করুন (Switch to Light Mode)" : "ডার্ক মোড চালু করুন (Switch to Dark Mode)"}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Toggle Dark/Light Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
          
          {/* If Logged In: Show User Profile Trigger with Role-Specific Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 shadow-xs cursor-pointer"
              >
                <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
                <span className="hidden sm:inline font-medium text-xs max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Popover Tailored Specifically to Active Role */}
              {profileDropdownOpen && (
                <div 
                  className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3.5 z-50 text-slate-800 dark:text-slate-100 space-y-3 animate-fadeIn"
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                >
                  {/* Role Specific User Header Info */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
                    <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center justify-between">
                      <span className="truncate max-w-[180px]">{currentUser.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        isReseller 
                          ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' 
                          : isSuperAdmin 
                          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300' 
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                      }`}>
                        {isReseller ? 'রিসেলার পার্টনার' : isSuperAdmin ? 'সুপার অ্যাডমিন' : 'কাস্টমার প্রোফাইল'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{currentUser.email}</div>
                    {currentUser.phone && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">{currentUser.phone}</div>
                    )}

                    {/* Reseller-Specific Wallet Metrics */}
                    {isReseller && (
                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <div className="text-xs text-slate-600 flex items-center justify-between">
                          <span>হোলসেল ব্যালেন্স:</span>
                          <strong className="text-emerald-600 font-bold font-mono">
                            ৳{(currentUser.walletBalanceBDT || 14500).toLocaleString()}
                          </strong>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center justify-between">
                          <span>হোলসেল ডিসকাউন্ট:</span>
                          <strong className="text-blue-600 font-bold font-mono">
                            {currentUser.resellerDiscountPercent || 25}%
                          </strong>
                        </div>
                      </div>
                    )}

                    {/* Customer-Specific Validity Metrics */}
                    {!isReseller && !isSuperAdmin && (
                      <div className="pt-2 border-t border-slate-200 space-y-1">
                        <div className="text-xs text-slate-600 flex items-center justify-between">
                          <span>মেয়াদকাল:</span>
                          <strong className={validity.isValid ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {validity.statusLabel}
                          </strong>
                        </div>
                        <div className="text-xs text-slate-600 flex items-center justify-between">
                          <span>টোকেন ক্রেডিট:</span>
                          <strong className="text-blue-600 font-mono font-bold">
                            {(currentUser.maxTokens || 100000).toLocaleString()} টোকেন
                          </strong>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 1. If Customer: Show Customer Panel Options Only */}
                  {!isReseller && !isSuperAdmin && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        কাস্টমার পোর্টাল মেনু:
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('customer_portal');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'customer_portal' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-bold">আমার কাস্টমার পোর্টাল</div>
                          <div className="text-[10px] text-slate-400">অ্যাক্টিভেশন কি, সাবস্ক্রিপশন ও রিনিউ</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('in_app_chat');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'in_app_chat' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <div className="font-bold">চ্যাটজিপিটি ওয়ার্কস্পেস</div>
                          <div className="text-[10px] text-slate-400">GPT-4o, Claude 3.5, Gemini চ্যাট</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('domain_proxy');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'domain_proxy' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <div className="font-bold">ডোমেইন প্রক্সি ভিউ</div>
                          <div className="text-[10px] text-slate-400">অফিসিয়াল ডোমেইন রিভার্স প্রক্সি</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('vault');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'vault' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <FolderLock className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <div className="font-bold">ব্যক্তিগত ভল্ট ও সিকিউরিটি</div>
                          <div className="text-[10px] text-slate-400">জিরো-নলেজ ফাইল ও ডকুমেন্ট স্টোরেজ</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* 2. If Reseller: Show Reseller Panel Options */}
                  {isReseller && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        রিসেলার পার্টনার মেনু:
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('reseller_panel');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'reseller_panel' 
                            ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Briefcase className="w-4 h-4 text-amber-600 shrink-0" />
                        <div>
                          <div className="font-bold">রিসেলার ড্যাশবোর্ড ও ক্লায়েন্ট সেলস</div>
                          <div className="text-[10px] text-slate-400">সিট কি তৈরি, মেয়াদ ও হোলসেল হিসাব</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('customer_portal');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'customer_portal' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-bold">কাস্টমার পোর্টাল ভিউ</div>
                          <div className="text-[10px] text-slate-400">ব্যক্তিগত সাবস্ক্রিপশন ও অ্যাক্টিভেশন</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('vault');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'vault' 
                            ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <FolderLock className="w-4 h-4 text-rose-500 shrink-0" />
                        <div>
                          <div className="font-bold">ব্যক্তিগত ভল্ট</div>
                          <div className="text-[10px] text-slate-400">এনক্রিপ্টেড ক্লায়েন্ট ও বিজনেস ফাইল</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* 3. If Super Admin: Dedicated Admin Options */}
                  {isSuperAdmin && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
                        অ্যাডমিন মেনু:
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('super_admin');
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 transition ${
                          activeTab === 'super_admin' 
                            ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Settings className="w-4 h-4 text-purple-600 shrink-0" />
                        <div>
                          <div className="font-bold">সুপার অ্যাডমিন ড্যাশবোর্ড</div>
                          <div className="text-[10px] text-slate-400">প্ল্যান, পেমেন্ট ও সিস্টেম কন্ট্রোল</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTab('customer_portal');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl text-xs flex items-center gap-2.5 hover:bg-slate-50 text-slate-700 transition"
                      >
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <div className="font-bold">কাস্টমার পোর্টাল ভিউ</div>
                          <div className="text-[10px] text-slate-400">সাধারণ কাস্টমার এক্সপেরিয়েন্স</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {/* Currency Switcher */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-1">
                    <span className="text-slate-500">কারেন্সি:</span>
                    <button
                      onClick={onToggleCurrency}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono font-bold text-slate-700 transition flex items-center gap-1"
                    >
                      <DollarSign className="w-3 h-3 text-amber-500" />
                      <span>{settings.currency} (ক্লিক করে পরিবর্তন)</span>
                    </button>
                  </div>

                  {/* Inside Logout Button */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-semibold text-xs flex items-center justify-center gap-2 transition border border-rose-200 active:scale-98"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>লগআউট করুন (Log Out)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* If Logged Out: Show Direct Login Button */
            <button
              onClick={() => onOpenLoginModal('login')}
              className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition flex items-center gap-1.5 py-1.5 px-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-white/10 shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>লগইন (Login)</span>
            </button>
          )}

          {/* Try for Free Vibrant Blue Button matching screenshot */}
          <button
            onClick={() => {
              if (!isLoggedIn) {
                onOpenLoginModal('register');
              } else if (onSelectPopularPlan) {
                onSelectPopularPlan();
              } else {
                setActiveTab('marketplace');
              }
            }}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {isLoggedIn ? 'Try for Free' : 'শুরু করুন'}
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden max-w-6xl mx-auto mt-2 p-4 rounded-2xl bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-slate-900 dark:text-slate-100 z-50 animate-fadeIn">
          {/* Mobile Auth Status Banner */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                আপনি বর্তমানে লগইন অবস্থায় নেই
              </div>
            )}

            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal('login');
                }}
                className="text-xs font-semibold text-white bg-blue-600 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>লগইন করুন</span>
              </button>
            )}
          </div>

          <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2 pb-1 border-b border-slate-100 dark:border-slate-800">
            পেজ মেনু:
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition cursor-pointer ${
                activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">{item.subLabel}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab(isReseller ? 'reseller_panel' : 'customer_portal');
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {isReseller ? 'রিসেলার পার্টনার হাব' : 'আমার কাস্টমার পোর্টাল'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
