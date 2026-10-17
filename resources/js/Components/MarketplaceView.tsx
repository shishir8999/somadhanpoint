import React, { useState } from 'react';
import { AISubscriptionPlan, User, SystemSettings, ProductCategory } from '../types';
import { HeroCarousel } from './HeroCarousel';
import { CategoryNav } from './CategoryNav';
import { ProductCard } from './ProductCard';
import { PromoBanner } from './PromoBanner';
import { TrustBadges } from './TrustBadges';
import { CustomerReviews } from './CustomerReviews';
import { WhyChooseUs } from './WhyChooseUs';
import { FAQSection } from './FAQSection';
import { storage } from '../services/storage';
import { ArrowRight, Flame, Clock } from 'lucide-react';

interface MarketplaceViewProps {
  plans: AISubscriptionPlan[];
  currentUser: User;
  settings: SystemSettings;
  onSelectPlan: (plan: AISubscriptionPlan) => void;
  onOpenWorkspace: () => void;
  onOpenLipikaWorkspace?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  plans,
  currentUser,
  settings,
  onSelectPlan,
  onOpenWorkspace,
  onOpenLipikaWorkspace,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [wishlist, setWishlist] = useState<string[]>(storage.getWishlist(currentUser.id));

  const handleToggleWishlist = (planId: string) => {
    const updated = storage.toggleWishlist(currentUser.id, planId);
    setWishlist(updated);
  };

  // Group plans by categories
  const topPicks = plans.slice(0, 10);
  const ottPlans = plans.filter(p => p.category === 'OTT & Streaming');
  const windowsPlans = plans.filter(p => p.category === 'Windows');
  const officePlans = plans.filter(p => p.category === 'Microsoft Office');
  const aiPlans = plans.filter(p => p.category === 'AI & Education Tools');
  const editingPlans = plans.filter(p => p.category === 'Editing Tools');
  const softwarePlans = plans.filter(p => p.category === 'Software & Productivity');
  const vpnPlans = plans.filter(p => p.category === 'VPN & Security');
  const giftcardPlans = plans.filter(p => p.category === 'Giftcards');

  // Filtered view if user selected a single specific category
  const filteredCategoryPlans = selectedCategory === 'All' 
    ? [] 
    : selectedCategory === 'Top Picks'
    ? topPicks
    : plans.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-12 pb-16">
      
      {/* USA Feature Banner - Direct Link to Dedicated Showcase Page */}
      {onOpenLipikaWorkspace && settings?.enableUsaFeaturePage !== false && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-blue-600/20 border border-blue-400/30">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl shadow-inner">
              🇺🇸
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>{settings?.usaShowcaseTitle || `${settings?.appName || 'OmniCraft AI'} Workspace (ইউএসএ ফিচার লাইভ পেজ)`}</span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  NEW PAGE
                </span>
              </div>
              <div className="text-xs text-blue-100 mt-0.5">
                One Login. One Bill. ChatGPT, Claude, Gemini ও Grok সহ সকল মডেলের ইউএসএ ফিচার সম্পূর্ণ নতুন পেজে লাইভ দেখুন!
              </div>
            </div>
          </div>
          <button
            onClick={onOpenLipikaWorkspace}
            className="bg-white hover:bg-slate-100 text-blue-700 font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shrink-0 shadow-md hover:scale-105 active:scale-95"
          >
            <span>সম্পূর্ণ ফিচার পেজ দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Big Cinematic Carousel Hero Banner */}
      <HeroCarousel
        onSelectCombo={() => {
          const combo = plans.find(p => p.id === 'netflix-prime-crunchy-combo') || plans[0];
          onSelectPlan(combo);
        }}
        onOpenInAppChat={onOpenWorkspace}
      />

      {/* 2. Category Icon Navigation Bar */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* If a specific category is selected, render single category grid */}
      {selectedCategory !== 'All' ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="text-indigo-500 dark:text-indigo-400">✦</span>
              <span>{selectedCategory}</span>
            </h2>
            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
            >
              সবগুলো ক্যাটাগরি দেখুন →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredCategoryPlans.map((plan) => (
              <ProductCard
                key={plan.id}
                plan={plan}
                isWishlisted={wishlist.includes(plan.id)}
                isUserPlan={currentUser.currentPlanId === plan.id}
                currency={settings.currency}
                bdtToUsdRate={settings.bdtToUsdRate}
                onSelectPlan={onSelectPlan}
                onToggleWishlist={handleToggleWishlist}
                onOpenWorkspace={onOpenWorkspace}
              />
            ))}
          </div>
        </section>
      ) : (
        /* Full Store Multi-Section Showcase Matching User Screenshot */
        <div className="space-y-14">
          
          {/* SECTION: Top Picks for You */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  Top Picks for You
                </h2>
              </div>
              <button 
                onClick={() => setSelectedCategory('Top Picks')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {topPicks.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: OTT & Streaming Platforms */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                OTT & Streaming Platforms
              </h2>
              <button 
                onClick={() => setSelectedCategory('OTT & Streaming')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ottPlans.slice(0, 10).map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: Windows */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Windows
              </h2>
              <button 
                onClick={() => setSelectedCategory('Windows')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {windowsPlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: Microsoft Office */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Microsoft Office
              </h2>
              <button 
                onClick={() => setSelectedCategory('Microsoft Office')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {officePlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* Promotional Golden Offer Banner */}
          <PromoBanner />

          {/* SECTION: AI & Education Tools (Core highlight!) */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 dark:text-cyan-400">✦</span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                  AI & Education Tools
                </h2>
              </div>
              <button 
                onClick={() => setSelectedCategory('AI & Education Tools')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {aiPlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: Editing Tools */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Editing Tools
              </h2>
              <button 
                onClick={() => setSelectedCategory('Editing Tools')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {editingPlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: Software & Productivity */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Software & Productivity
              </h2>
              <button 
                onClick={() => setSelectedCategory('Software & Productivity')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {softwarePlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: VPN & Security */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                VPN & Security
              </h2>
              <button 
                onClick={() => setSelectedCategory('VPN & Security')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {vpnPlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* SECTION: Giftcards */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] pb-2.5">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Giftcards
              </h2>
              <button 
                onClick={() => setSelectedCategory('Giftcards')}
                className="text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {giftcardPlans.map((plan) => (
                <ProductCard
                  key={plan.id}
                  plan={plan}
                  isWishlisted={wishlist.includes(plan.id)}
                  isUserPlan={currentUser.currentPlanId === plan.id}
                  currency={settings.currency}
                  bdtToUsdRate={settings.bdtToUsdRate}
                  onSelectPlan={onSelectPlan}
                  onToggleWishlist={handleToggleWishlist}
                  onOpenWorkspace={onOpenWorkspace}
                />
              ))}
            </div>
          </section>

          {/* Flash Sale Banner with Countdown Timer */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-rose-500/5 to-slate-100 dark:from-red-950/40 dark:via-slate-900 dark:to-black border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm dark:shadow-none">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest bg-red-500/10 px-2.5 py-0.5 rounded">
                <Clock className="w-3 h-3" /> FLASH SALE • LIMITED TIME
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Biggest Discounts Today
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                শীর্ষ জনপ্রিয় ডিজিটাল সাবস্ক্রিপশনে সীমিত সময়ের মূল্যছাড়
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-center">
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-2 rounded-xl min-w-[50px] shadow-xs">
                <div className="text-lg font-black text-slate-900 dark:text-white">03</div>
                <div className="text-[9px] text-slate-500 uppercase">Hours</div>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-2 rounded-xl min-w-[50px] shadow-xs">
                <div className="text-lg font-black text-slate-900 dark:text-white">22</div>
                <div className="text-[9px] text-slate-500 uppercase">Mins</div>
              </div>
              <span className="text-slate-500 font-bold">:</span>
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 p-2 rounded-xl min-w-[50px] shadow-xs">
                <div className="text-lg font-black text-slate-900 dark:text-white">37</div>
                <div className="text-[9px] text-slate-500 uppercase">Secs</div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <TrustBadges />

          {/* Verified Customer Reviews */}
          <CustomerReviews />

          {/* Why Choose Us */}
          <WhyChooseUs />

          {/* FAQ Accordion Section */}
          <FAQSection />

        </div>
      )}

    </div>
  );
};
