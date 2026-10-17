import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { HeaderMarquee } from '../Components/HeaderMarquee';
import { Navbar } from '../Components/Navbar';
import { MarketplaceView } from '../Components/MarketplaceView';
import { InAppAIChatView } from '../Components/InAppAIChatView';
import { DomainProxyView } from '../Components/DomainProxyView';
import { PrivateVaultView } from '../Components/PrivateVaultView';
import { SuperAdminView } from '../Components/SuperAdminView';
import { CustomerPortalView } from '../Components/CustomerPortalView';
import { ResellerPanelView } from '../Components/ResellerPanelView';
import { SubscriptionOperationsGuide } from '../Components/SubscriptionOperationsGuide';
import { LipikaWorkspaceLandingView } from '../Components/LipikaWorkspaceLandingView';
import { PaymentModal } from '../Components/PaymentModal';
import { AuthModal } from '../Components/AuthModal';
import { FloatingChat } from '../Components/FloatingChat';
import { SuperAdminLoginPortal } from '../Components/SuperAdminLoginPortal';
import { AiWorkspaceLoginPortal } from '../Components/AiWorkspaceLoginPortal';
import { 
  User, 
  AISubscriptionPlan, 
  PaymentOrder, 
  SystemSettings, 
  UserDocument 
} from '../types';
import { storage } from '../services/storage';
import { pixel } from '../services/pixel';
import { ShieldCheck, Mail, Phone, MapPin, Lock } from 'lucide-react';

interface HubProps {
  initialTab?: string;
  currentUser: User;
  allUsers: User[];
  plans: AISubscriptionPlan[];
  orders: PaymentOrder[];
  resellerSales?: any[];
  activationLinks?: any[];
  settings: SystemSettings;
  reviews?: any[];
  faqs?: any[];
  isLoggedIn?: boolean;
}

export default function Hub({
  initialTab = 'lipika_workspace',
  currentUser: initialCurrentUser,
  allUsers: initialUsers,
  plans: initialPlans,
  orders: initialOrders,
  activationLinks: initialActivationLinks = [],
  settings: initialSettings,
  isLoggedIn: initialIsLoggedIn = false,
}: HubProps) {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    if (typeof window !== 'undefined' && storage.isLoggedIn()) {
      return storage.getCurrentUser();
    }
    return initialCurrentUser || storage.getCurrentUser();
  });
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers && initialUsers.length ? initialUsers : storage.getUsers());
  const [plans, setPlans] = useState<AISubscriptionPlan[]>(initialPlans && initialPlans.length ? initialPlans : storage.getPlans());
  const [orders, setOrders] = useState<PaymentOrder[]>(initialOrders && initialOrders.length ? initialOrders : storage.getOrders());
  const [settings, setSettings] = useState<SystemSettings>(initialSettings || storage.getSettings());
  const [activeTab, setActiveTabState] = useState<string>(initialTab);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (initialIsLoggedIn) return true;
    if (typeof window !== 'undefined') {
      return storage.isLoggedIn();
    }
    return false;
  });

  // Super Admin session authentication check
  const [isSuperAdminUnlocked, setIsSuperAdminUnlocked] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('nexus_superadmin_unlocked') === 'true';
    }
    return false;
  });

  // Sync tab with browser URL history
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    const tabUrlMap: Record<string, string> = {
      lipika_workspace: '/',
      marketplace: '/store',
      in_app_chat: '/workspace',
      domain_proxy: '/proxy',
      customer_portal: '/dashboard',
      reseller_panel: '/reseller',
      vault: '/vault',
      super_admin: '/admin',
      guides: '/guides',
    };
    const targetUrl = tabUrlMap[tab] || `/?tab=${tab}`;
    window.history.pushState({}, '', targetUrl);
  };

  // Initialize Facebook Pixel when enabled in settings
  useEffect(() => {
    if (settings.enableFacebookPixel && settings.facebookPixelId) {
      pixel.init(settings.facebookPixelId);
    }
  }, [settings.enableFacebookPixel, settings.facebookPixelId]);

  // Track PageView on tab / navigation changes
  useEffect(() => {
    if (settings.enableFacebookPixel && settings.facebookPixelId) {
      pixel.trackPageView(activeTab);
    }
  }, [activeTab, settings.enableFacebookPixel, settings.facebookPixelId]);

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [authPromptNotice, setAuthPromptNotice] = useState<string | null>(null);

  // Pending prompt from unauthenticated submission
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [pendingModel, setPendingModel] = useState<string | null>(null);

  // Checkout Modal State
  const [checkoutPlan, setCheckoutPlan] = useState<AISubscriptionPlan | null>(null);

  // Refresh data from server
  const refreshAppData = () => {
    router.reload({
      only: ['currentUser', 'allUsers', 'plans', 'orders', 'settings'],
      onSuccess: (page) => {
        const props = page.props as unknown as HubProps;
        if (props.currentUser) setCurrentUser(props.currentUser);
        if (props.allUsers) setAllUsers(props.allUsers);
        if (props.plans) setPlans(props.plans);
        if (props.orders) setOrders(props.orders);
        if (props.settings) setSettings(props.settings);
      }
    });
  };

  const handleOpenLoginModal = (tab: 'login' | 'register' = 'login') => {
    window.location.href = tab === 'register' ? '/register' : '/login';
  };

const GUEST_USER: User = {
  id: 'guest',
  name: 'গেস্ট ইউজার',
  email: '',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  tokenUsage: 0,
  maxTokens: 10000,
  walletBalanceBDT: 0,
  resellerDiscountPercent: 0,
  joinedAt: new Date().toISOString(),
};

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // fallback
    }
    storage.logout();
    if (currentUser?.id) {
      try {
        localStorage.removeItem(`nexus_auth_models_${currentUser.id}`);
      } catch (err) {
        // ignore
      }
    }
    setCurrentUser(GUEST_USER);
    setIsLoggedIn(false);
    
    // If not in workspace, navigate to /workspace so client can log in
    if (activeTab !== 'in_app_chat') {
      window.location.href = '/workspace';
    }
  };

  const handleLoginSuccess = (user: User, targetModel: string = 'ChatGPT') => {
    storage.loginUser(String(user.id));
    setIsLoggedIn(true);
    setCurrentUser(user);
    setAuthModalOpen(false);
    setAuthPromptNotice(null);
    setActiveTab('in_app_chat');

    // Persist target model as authenticated for this user
    try {
      const existing = localStorage.getItem(`nexus_auth_models_${user.id}`);
      let list: string[] = existing ? JSON.parse(existing) : [];
      if (!Array.isArray(list)) list = [];
      const m = targetModel || 'ChatGPT';
      if (!list.includes(m)) list.push(m);
      localStorage.setItem(`nexus_auth_models_${user.id}`, JSON.stringify(list));
    } catch (e) {
      // ignore
    }
  };

  const handlePromptSubmitWithAuth = (prompt: string, model: string) => {
    setPendingPrompt(prompt);
    setPendingModel(model);

    if (!isLoggedIn) {
      setAuthPromptNotice('লগইন করুন — আপনার প্রম্পটটির উত্তর পেতে এবং ChatGPT ফুল ফিচার শুরু করতে দয়া করে লগইন বা সাইনআপ করুন!');
      setAuthModalTab('login');
      setAuthModalOpen(true);
    } else {
      setActiveTab('in_app_chat');
    }
  };

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        storage.loginUser(String(data.user.id));
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        refreshAppData();
      }
    } catch (e) {
      storage.loginUser(userId);
      setIsLoggedIn(true);
      refreshAppData();
    }
  };

  const handleToggleCurrency = async () => {
    const nextCurrency: 'BDT' | 'USD' = settings.currency === 'BDT' ? 'USD' : 'BDT';
    const updated: SystemSettings = { ...settings, currency: nextCurrency };
    setSettings(updated);
    storage.saveSettings(updated);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: nextCurrency }),
      });
    } catch (e) {
      // offline fallback
    }
  };

  const handleOpenChatWithDoc = (doc: UserDocument) => {
    setActiveTab('in_app_chat');
  };

  // Full screen in_app_chat workspace
  if (activeTab === 'in_app_chat') {
    // If client is not logged in, show the ChatGPT-style AI Workspace Login Portal
    if (!isLoggedIn) {
      return (
        <AiWorkspaceLoginPortal
          settings={settings}
          onLoginSuccess={(user, targetModel) => {
            handleLoginSuccess(user, targetModel);
            if (targetModel) setPendingModel(targetModel);
          }}
          onBackToHome={() => setActiveTab('lipika_workspace')}
          onOpenStore={() => setActiveTab('marketplace')}
          initialModel={pendingModel || 'ChatGPT'}
        />
      );
    }

    return (
      <div className="min-h-screen bg-white text-slate-900 font-sans">
        <Head title="AI Chat Workspace" />
        <InAppAIChatView
          currentUser={currentUser}
          settings={settings}
          onOpenMarketplace={() => setActiveTab('marketplace')}
          onBackToHome={() => setActiveTab('lipika_workspace')}
          onOpenUpgrade={() => {
            const topPlan = plans.find(p => p.id === 'lipika-pro') || plans[0];
            if (topPlan) setCheckoutPlan(topPlan);
          }}
          onLogout={handleLogout}
          initialPrompt={pendingPrompt}
          initialModel={pendingModel}
        />

        {checkoutPlan && (
          <PaymentModal
            plan={checkoutPlan}
            currentUser={currentUser}
            settings={settings}
            onClose={() => setCheckoutPlan(null)}
            onSuccess={() => {
              refreshAppData();
              setActiveTab('in_app_chat');
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070B16] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200">
      <Head title={settings.appName || 'OmniCraft AI'} />
      
      {/* 1. Header Marquee if enabled */}
      {settings.enableHeaderMarquee !== false && (
        <HeaderMarquee settings={settings} />
      )}

      {/* 2. Floating Navbar */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={handleSwitchUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        settings={settings}
        onToggleCurrency={handleToggleCurrency}
        isLoggedIn={isLoggedIn}
        onOpenLoginModal={handleOpenLoginModal}
        onLogout={handleLogout}
        onSelectPopularPlan={() => {
          const topPlan = plans.find(p => p.id === 'chatgpt-plus') || plans[0];
          if (topPlan) setCheckoutPlan(topPlan);
        }}
      />

      {/* 3. Main Viewport */}
      {activeTab === 'lipika_workspace' ? (
        <LipikaWorkspaceLandingView
          currentUser={currentUser}
          settings={settings}
          onSelectPlan={(plan) => setCheckoutPlan(plan)}
          onOpenInAppChat={() => {
            if (!isLoggedIn) {
              setAuthPromptNotice('ChatGPT ফুল ফিচারে প্রবেশ করতে অনুগ্রহ করে লগইন করুন!');
              handleOpenLoginModal('login');
            } else {
              setActiveTab('in_app_chat');
            }
          }}
          onOpenDigitalStore={() => setActiveTab('marketplace')}
          onOpenLoginModal={handleOpenLoginModal}
          isLoggedIn={isLoggedIn}
          onSubmitPromptWithAuth={handlePromptSubmitWithAuth}
        />
      ) : (
        <main className={`flex-1 w-full mx-auto px-3 sm:px-6 lg:px-8 pt-6 ${
          activeTab === 'super_admin' ? 'max-w-[1720px]' : 'max-w-7xl'
        }`}>
          {activeTab === 'marketplace' && (
            <MarketplaceView
              plans={plans}
              currentUser={currentUser}
              settings={settings}
              onSelectPlan={(plan) => setCheckoutPlan(plan)}
              onOpenWorkspace={() => setActiveTab('in_app_chat')}
              onOpenLipikaWorkspace={() => setActiveTab('lipika_workspace')}
            />
          )}

          {activeTab === 'domain_proxy' && (
            <DomainProxyView
              currentUser={currentUser}
              plans={plans}
              settings={settings}
              onOpenInAppChat={() => setActiveTab('in_app_chat')}
            />
          )}

          {activeTab === 'customer_portal' && (
            <CustomerPortalView
              currentUser={currentUser}
              plans={plans}
              orders={orders}
              settings={settings}
              onOpenInAppChat={() => setActiveTab('in_app_chat')}
              onOpenDomainProxy={() => setActiveTab('domain_proxy')}
              onOpenMarketplace={() => setActiveTab('marketplace')}
              onSelectPlanForRenewal={(plan) => setCheckoutPlan(plan)}
            />
          )}

          {activeTab === 'reseller_panel' && (
            <ResellerPanelView
              currentUser={currentUser}
              plans={plans}
              settings={settings}
              onRefreshData={refreshAppData}
              onOpenWorkspace={() => setActiveTab('in_app_chat')}
            />
          )}

          {activeTab === 'vault' && (
            <PrivateVaultView
              currentUser={currentUser}
              onOpenChatWithDoc={handleOpenChatWithDoc}
            />
          )}

          {activeTab === 'super_admin' && (
            isSuperAdminUnlocked ? (
              <div className="space-y-4">
                {/* Admin Session Security Bar */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-800 dark:text-purple-300">
                    <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>সুপার অ্যাডমিন মোড সক্রিয় — {currentUser?.name || 'Super Admin'} ({currentUser?.email || 'admin@nexusai.hub'})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem('nexus_superadmin_unlocked');
                      setIsSuperAdminUnlocked(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950/40 transition text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    title="অ্যাডমিন প্যানেল লক করুন"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>লক ও লগআউট</span>
                  </button>
                </div>

                <SuperAdminView
                  plans={plans}
                  orders={orders}
                  users={allUsers}
                  settings={settings}
                  activationLinks={initialActivationLinks}
                  onRefreshData={refreshAppData}
                  onOpenGuides={() => setActiveTab('guides')}
                />
              </div>
            ) : (
              <SuperAdminLoginPortal
                settings={settings}
                onLoginSuccess={(adminUser) => {
                  setCurrentUser(adminUser);
                  setIsSuperAdminUnlocked(true);
                  setIsLoggedIn(true);
                  refreshAppData();
                }}
                onBackToHome={() => setActiveTab('lipika_workspace')}
              />
            )
          )}

          {activeTab === 'guides' && (
            <SubscriptionOperationsGuide
              settings={settings}
              onOpenSuperAdmin={() => setActiveTab('super_admin')}
              onOpenMarketplace={() => setActiveTab('marketplace')}
              onOpenResellerPanel={() => setActiveTab('reseller_panel')}
            />
          )}
        </main>
      )}

      {/* 4. Payment Checkout Modal */}
      {checkoutPlan && (
        <PaymentModal
          plan={checkoutPlan}
          currentUser={currentUser}
          settings={settings}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={() => {
            refreshAppData();
            setActiveTab('in_app_chat');
          }}
        />
      )}

      {/* 5. User Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authModalTab}
        promptNotice={authPromptNotice}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthPromptNotice(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 6. Floating Support Toggle Widget (WhatsApp, Messenger & Live Chat) */}
      {settings.enableFloatingChat !== false && (
        <FloatingChat
          settings={settings}
          onOpenLiveChat={() => setActiveTab('in_app_chat')}
        />
      )}

      {/* 7. Store Footer */}
      {activeTab !== 'lipika_workspace' && (
        <footer className="mt-auto border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#04070F] text-xs text-slate-600 dark:text-slate-400 pt-12 pb-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/[0.06] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <div className="text-slate-900 dark:text-white font-bold text-xs">আমাদের লক্ষ্য গ্রাহকদের সেরা সাশ্রয়ী মূল্যে প্রিমিয়াম ডিজিটাল সেবা এবং অফিসিয়াল সাবস্ক্রিপশন পৌঁছে দেওয়া।</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">১০০% মানি-ব্যাক ও জিরো-নলেজ ইউজার প্রাইভেসি নিশ্চয়তা।</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300 font-mono text-xs shrink-0">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> SSL SECURED
                </span>
                <span>bKash · Nagad · Rocket</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  CATEGORIES
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">OTT & Streaming Platforms</button></li>
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">AI & Education Tools</button></li>
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">Microsoft Office & Windows</button></li>
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">Editing Tools & Canva Pro</button></li>
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">VPN & Security</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  USEFUL LINKS
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
                  <li><button onClick={() => setActiveTab('marketplace')} className="hover:text-blue-600 dark:hover:text-white transition">Home & Store</button></li>
                  <li><button onClick={() => setActiveTab('in_app_chat')} className="hover:text-blue-600 dark:hover:text-white transition">চ্যাটজিপিটি ওয়ার্কস্পেস</button></li>
                  <li><button onClick={() => setActiveTab('domain_proxy')} className="hover:text-blue-600 dark:hover:text-white transition">ডোমেইন প্রক্সি ভিউ</button></li>
                  <li><button onClick={() => setActiveTab('vault')} className="hover:text-blue-600 dark:hover:text-white transition">ব্যক্তিগত ভল্ট ও সিকিউরিটি</button></li>
                  <li><button onClick={() => setActiveTab('guides')} className="hover:text-blue-600 dark:hover:text-white transition">বিজনেস গাইড</button></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  POLICIES & SAFETY
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
                  <li className="hover:text-blue-600 dark:hover:text-white transition cursor-pointer">Privacy Policy (জিরো-নলেজ ডেটা সুরক্ষা)</li>
                  <li className="hover:text-blue-600 dark:hover:text-white transition cursor-pointer">Terms of Service</li>
                  <li className="hover:text-blue-600 dark:hover:text-white transition cursor-pointer">Replacement & Refund Policy</li>
                  <li className="hover:text-blue-600 dark:hover:text-white transition cursor-pointer">Delivery Information (১-৫ মিনিট)</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  NEED HELP?
                </h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-xs">
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{settings.supportPhone}</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400 shrink-0" />
                    <span className="truncate">{settings.supportEmail}</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0" />
                    <span>ঢাকা, বাংলাদেশ (সকাল ৮টা - রাত ১২টা)</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
              <div>
                © 2026 {settings.appName || 'OmniCraft AI'}. All rights reserved.
              </div>
              <div className="flex items-center gap-3">
                <span>১০০% নিরাপদ ও সুরক্ষিত ডিজিটাল কেনাকাটা</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
