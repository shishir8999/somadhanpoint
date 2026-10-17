import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  CreditCard, 
  KeyRound, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Calculator,
  RefreshCw,
  Zap,
  Users,
  Settings,
  Smartphone
} from 'lucide-react';
import { SystemSettings } from '../types';

interface SubscriptionOperationsGuideProps {
  settings: SystemSettings;
  onOpenSuperAdmin?: () => void;
  onOpenMarketplace?: () => void;
  onOpenResellerPanel?: () => void;
}

export const SubscriptionOperationsGuide: React.FC<SubscriptionOperationsGuideProps> = ({
  settings,
  onOpenSuperAdmin,
  onOpenMarketplace,
  onOpenResellerPanel,
}) => {
  const [activeSection, setActiveSection] = useState<'workflow' | 'credits' | 'activation' | 'reseller' | 'templates'>('workflow');
  const [calcBDT, setCalcBDT] = useState<number>(499);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Credit calculation logic: 1 BDT = 1 Credit Point = 1,000 AI Tokens
  const calculatedCredits = calcBDT;
  const calculatedTokens = calcBDT * 1000;
  const estimatedQueries = Math.round(calculatedTokens / 750); // average query ~750 tokens

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTemplate(id);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/50 dark:from-[#0C1322] dark:via-[#101935] dark:to-[#18234D] border border-blue-200/80 dark:border-white/[0.08] p-6 sm:p-8 shadow-xl shadow-blue-500/5 dark:shadow-2xl relative overflow-hidden transition-colors">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30">
            <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span>অফিশিয়াল সাবস্ক্রিপশন অপারেশন ম্যানুয়াল ও এসওপি (SOP)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            সম্পূর্ণ সাবস্ক্রিপশন ও লাইসেন্স পরিচালনা নির্দেশিকা
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            প্যাকেজ তৈরি, পেমেন্টের সাথে সাথে তাৎক্ষণিক স্বয়ংক্রিয় লাইসেন্স অ্যাক্টিভেশন, কত টাকায় কত পয়েন্ট/ক্রেডিট পাবে তার নিখুঁত হিসাব এবং মেয়াদ শেষ পর্যন্ত কাস্টমার ও রিসেলার পরিচালনার সম্পূর্ণ কর্মপদ্ধতি।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveSection('workflow')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSection === 'workflow'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>১. সম্পূর্ণ বিজনেস প্রসেস</span>
            </button>

            <button
              onClick={() => setActiveSection('credits')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSection === 'credits'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>২. পয়েন্ট ও ক্রেডিট ইকোনমিক্স</span>
            </button>

            <button
              onClick={() => setActiveSection('activation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSection === 'activation'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>৩. তাৎক্ষণিক অ্যাক্টিভেশন আর্কিটেকচার</span>
            </button>

            <button
              onClick={() => setActiveSection('reseller')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSection === 'reseller'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>৪. রিসেলার প্রফিট ও মেয়াদ নির্ধারণ</span>
            </button>

            <button
              onClick={() => setActiveSection('templates')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeSection === 'templates'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                  : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 shadow-xs'
              }`}
            >
              <Copy className="w-3.5 h-3.5" />
              <span>৫. এসএমএস ও ডেলিভারি টেমপ্লেট</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Body Tabs */}
      
      {/* SECTION 1: WORKFLOW */}
      {activeSection === 'workflow' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>কাস্টমার সাবস্ক্রিপশন ও ডেলিভারির ৬টি ধাপ (Step-by-Step SOP)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Step 1 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-indigo-400 dark:hover:border-indigo-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-600/20 dark:text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-200 dark:border-indigo-500/30 font-mono">
                  ০১
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">প্যাকেজ তৈরি ও মূল্য নির্ধারণ</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  সুপার অ্যাডমিন প্যানেল থেকে যেকোনো প্ল্যানের নাম (যেমন ChatGPT Plus), দাম (টাকা ও ডলারে), মেয়াদ (মাসিক/বাৎসরিক) এবং পয়েন্ট বরাদ্দ সেট করুন।
                </p>
                <div className="text-[11px] text-indigo-800 dark:text-indigo-300 font-mono bg-indigo-50 dark:bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-200/80 dark:border-indigo-500/20">
                  অ্যাকশন: সাইডবারে "সাবস্ক্রিপশন পরিচালনা" → "+ নতুন প্ল্যান"
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-cyan-400 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-600/20 dark:text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-200 dark:border-cyan-500/30 font-mono">
                  ০২
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">গ্রাহক দ্বারা প্যাকেজ নির্বাচন ও পয়েন্ট দর্শন</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  গ্রাহক স্টোর থেকে প্ল্যান নির্বাচন করবে। সেখানে স্পষ্টভাবে দেখতে পাবে এই প্যাকেজে সে কত পয়েন্ট, কত টোকেন এবং কত দিনের মেয়াদ পাচ্ছে।
                </p>
                <div className="text-[11px] text-cyan-800 dark:text-cyan-300 font-mono bg-cyan-50 dark:bg-cyan-950/30 p-2.5 rounded-xl border border-cyan-200/80 dark:border-cyan-500/20">
                  স্বচ্ছতা: কত টাকায় কত ক্রেডিট ও টোকেন গ্রাহক তাৎক্ষণিক দেখতে পায়।
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-emerald-400 dark:hover:border-emerald-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-600/20 dark:text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-200 dark:border-emerald-500/30 font-mono">
                  ০৩
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">বিকাশ/নগদে পেমেন্ট ও TrxID প্রদান</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  গ্রাহক আপনার দেওয়া মার্চেন্ট/পার্সোনাল বিকাশ, নগদ বা রকেট নম্বরে সেন্ড মানি বা পেমেন্ট করবে এবং প্রাপ্ত TrxID বক্সে ইনপুট দেবে।
                </p>
                <div className="text-[11px] text-emerald-800 dark:text-emerald-300 font-mono bg-emerald-50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-200/80 dark:border-emerald-500/20">
                  নম্বর: {settings.bkashMerchant} (সেটিংস থেকে পরিবর্তনযোগ্য)
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-purple-400 dark:hover:border-purple-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-600/20 dark:text-purple-400 font-bold flex items-center justify-center text-sm border border-purple-200 dark:border-purple-500/30 font-mono">
                  ০৪
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">তাৎক্ষণিক লাইসেন্স কি ও ক্রেডিট একটিভ</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  পেমেন্ট সাবমিট হওয়ার সাথে সাথেই সিস্টেম একটি ইউনিক এনক্রিপ্টেড লাইসেন্স কি (Seat Key) তৈরি করবে এবং গ্রাহকের একাউন্টে ক্রেডিট ও মেয়াদ সক্রিয় করবে।
                </p>
                <div className="text-[11px] text-purple-800 dark:text-purple-300 font-mono bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded-xl border border-purple-200/80 dark:border-purple-500/20">
                  কী ফরম্যাট: NEXUS-XXXX-XXXXX
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-amber-400 dark:hover:border-amber-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-600/20 dark:text-amber-400 font-bold flex items-center justify-center text-sm border border-amber-200 dark:border-amber-500/30 font-mono">
                  ০৫
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">মেয়াদ ট্র্যাকিং ও রিয়েল-টাইম কাউন্টডাউন</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  কাস্টমার পোর্টাল ও নেভিগেশনে দিন ও ঘণ্টার নিখুঁত কাউন্টডাউন চলবে (যেমন: "২৩ দিন বাকি - সক্রিয়")। ফলে গ্রাহক আগে থেকেই মেয়াদ দেখতে পায়।
                </p>
                <div className="text-[11px] text-amber-800 dark:text-amber-300 font-mono bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200/80 dark:border-amber-500/20">
                  কাউন্টডাউন: ০ দিন হলে স্বয়ংক্রিয়ভাবে 'মেয়াদ শেষ' স্ট্যাটাস হয়।
                </div>
              </div>

              {/* Step 6 */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3 relative group hover:border-rose-400 dark:hover:border-rose-500/40 shadow-xs hover:shadow-md transition">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-600/20 dark:text-rose-400 font-bold flex items-center justify-center text-sm border border-rose-200 dark:border-rose-500/30 font-mono">
                  ০৬
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">মেয়াদ শেষে ওয়ান-ক্লিক রিনিউয়াল</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  মেয়াদ শেষ হওয়ার ৩ দিন আগে হলুদ ওয়ার্নিং নোটিশ আসবে। মেয়াদ শেষ হলে চ্যাট উইন্ডোতে রিনিউ পপআপ আসবে এবং ১ ক্লিকে বিকাশ দিয়ে মেয়াদ বাড়ানো যাবে।
                </p>
                <div className="text-[11px] text-rose-800 dark:text-rose-300 font-mono bg-rose-50 dark:bg-rose-950/30 p-2.5 rounded-xl border border-rose-200/80 dark:border-rose-500/20">
                  সুবিধা: কাস্টমারের পুরনো চ্যাট হিস্ট্রি সংরক্ষিত থাকে।
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CREDITS & POINT ECONOMICS */}
      {activeSection === 'credits' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-sm">
            <div>
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>পয়েন্ট ও ক্রেডিট ইকোনমিক্স ক্যালকুলেটর (টাকা ↔ ক্রেডিট ↔ এআই টোকেন)</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                গ্রাহক কত টাকা পরিশোধ করলে কত ক্রেডিট ও কত টোকেন ক্যাপাসিটি পাবে তা এই সূত্রের মাধ্যমে পরিচালিত হয়।
              </p>
            </div>

            {/* Interactive Calculator Tool */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-indigo-50/30 to-slate-50 dark:from-slate-950 dark:via-[#0A1020] dark:to-slate-950 border border-slate-200 dark:border-white/[0.08]">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    প্যাকেজ বা রিচার্জের মূল্য (BDT ৳):
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={calcBDT}
                      onChange={(e) => setCalcBDT(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white dark:bg-[#050814] border border-indigo-300 dark:border-indigo-500/40 rounded-xl px-4 py-3 text-base text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-indigo-500"
                    />
                    <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-bold">টাকা</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {[100, 250, 499, 999, 2500].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCalcBDT(amt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                        calcBDT === amt
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      ৳{amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-indigo-950/30 border border-blue-200 dark:border-indigo-500/30 text-center">
                  <span className="text-[11px] text-blue-700 dark:text-indigo-300 font-semibold block">অর্জিত ক্রেডিট পয়েন্ট</span>
                  <span className="text-2xl font-black text-blue-900 dark:text-cyan-300 font-mono block mt-1">
                    {calculatedCredits.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">১ টাকা = ১ ক্রেডিট</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-center">
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block">এআই টোকেন বরাদ্দ</span>
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400 font-mono block mt-1">
                    {calculatedTokens.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">১ ক্রেডিট = ১,০০০ টোকেন</span>
                </div>

                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/30 text-center">
                  <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold block">আনুমানিক প্রম্পট সংখ্যা</span>
                  <span className="text-2xl font-black text-purple-900 dark:text-purple-300 font-mono block mt-1">
                    ~{estimatedQueries.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">গড় বার্তা প্রতি ৭৫০ টোকেন</span>
                </div>
              </div>
            </div>

            {/* Standard Packages Table */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">স্ট্যান্ডার্ড প্যাকেজ কাঠামো ও পয়েন্ট নীতিমালা:</h4>
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/[0.08]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-[#050814] text-slate-700 dark:text-slate-400 uppercase text-[10px] border-b border-slate-200 dark:border-white/[0.08]">
                    <tr>
                      <th className="p-3">প্যাকেজের নাম</th>
                      <th className="p-3">মূল্য (BDT)</th>
                      <th className="p-3">ক্রেডিট পয়েন্ট</th>
                      <th className="p-3">এআই টোকেন ক্যাপাসিটি</th>
                      <th className="p-3">মেয়াদকাল</th>
                      <th className="p-3">বিশেষ সুবিধা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-white/[0.06] text-slate-800 dark:text-slate-300 font-mono">
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">Gemini Advance Pro</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">৳২৫০</td>
                      <td className="p-3 text-indigo-600 dark:text-cyan-300">২৫০ ক্রেডিট</td>
                      <td className="p-3">২৫০,০০০ টোকেন</td>
                      <td className="p-3 text-amber-600 dark:text-amber-300 font-sans">৩০ দিন</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">ইন-অ্যাপ চ্যাট উইন্ডো</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">ChatGPT Plus (GPT-4o)</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">৳৪৯৯</td>
                      <td className="p-3 text-indigo-600 dark:text-cyan-300">৪৯৯ ক্রেডিট</td>
                      <td className="p-3">৫০০,০০০ টোকেন</td>
                      <td className="p-3 text-amber-600 dark:text-amber-300 font-sans">৩০ দিন</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">GPT-4o ও DALL-E ৩</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">GPT-4o VIP Unlimited</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">৳৯৯৯</td>
                      <td className="p-3 text-indigo-600 dark:text-cyan-300">১,০০০ ক্রেডিট</td>
                      <td className="p-3">১,০০০,০০০ টোকেন</td>
                      <td className="p-3 text-amber-600 dark:text-amber-300 font-sans">৩০ দিন</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">হাই স্পিড প্রায়োরিটি কি</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">Canva Pro Lifetime Seat</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">৳৫০</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">লাইসেন্স কি</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">আনলিমিটেড</td>
                      <td className="p-3 text-amber-600 dark:text-amber-300 font-sans">১ বছর (৩৬৫ দিন)</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">টিম ইনভাইটেশন লিংক</td>
                    </tr>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02]">
                      <td className="p-3 font-sans font-bold text-slate-900 dark:text-white">Windows 11 Pro Retail Key</td>
                      <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">৳৩৫০</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">অ্যাক্টিভেশন কি</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">লাইফটাইম</td>
                      <td className="p-3 text-amber-600 dark:text-amber-300 font-sans">আজীবন (Life)</td>
                      <td className="p-3 font-sans text-slate-600 dark:text-slate-400">মাইক্রোসফট অফিসিয়াল কি</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SECTION 3: INSTANT ACTIVATION ARCHITECTURE */}
      {activeSection === 'activation' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>তাৎক্ষণিক লাইসেন্স সক্রিয়করণ আর্কিটেকচার (Instant Activation System)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">অটো-অ্যাপ্রুভ মেকানিজম (Auto-Approval)</h4>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">বর্তমানে প্ল্যাটফর্মে চালু আছে</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  গ্রাহক বিকাশ বা নগদ থেকে টাকা পাঠিয়ে যখনই পেমেন্ট মডালে TrxID লিখবে এবং <strong>"ভেরিফাই ও সাবস্ক্রিপশন সক্রিয় করুন"</strong> চাপবে, তখন ব্যাকএন্ড তাৎক্ষণিকভাবে:
                </p>

                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>ইউনিক লাইসেন্স টোকেন জেনারেট করে (যেমন: NEXUS-A9F2-4819)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>গ্রাহকের অ্যাকাউন্টে বর্তমান তারিখ থেকে ঠিক ৩০ দিন (বা ৩৬৫ দিন) মেয়াদ সেট করে</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>নির্ধারিত ক্রেডিট ও টোকেন ব্যালেন্স যুক্ত করে দেয়</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>অর্ডারটি 'approved' স্ট্যাটাসে ডাটাবেজে সংরক্ষণ করে</span>
                  </li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center font-bold">
                    🛡
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">জিরো-নলেজ সিকিউরিটি ও সিট আইসোলেশন</h4>
                    <span className="text-[11px] text-purple-700 dark:text-purple-300 font-semibold">১০০% গোপনীয়তা নিশ্চয়তা</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  অনেকে জানতে চায়: <em>"শেয়ার্ড একাউন্টে কি একজনের হিস্ট্রি অন্যজন দেখতে পাবে?"</em>
                </p>

                <div className="p-3.5 rounded-xl bg-indigo-50/70 dark:bg-slate-900 border border-indigo-200/70 dark:border-white/[0.06] text-xs text-slate-800 dark:text-slate-300 leading-relaxed">
                  <strong>আমাদের সিস্টেমের সমাধান:</strong> প্রতিটি গ্রাহকের জন্য ব্রাউজার লোকাল এনক্রিপ্টেড পার্টিশনিং ব্যবহার করা হয়েছে। ফলে গ্রাহক চ্যাটজিপিটি বা এআই দিয়ে যা-ই কাজ করুক না কেন, তা কেবল তার ডিভাইসেই লোড হবে। এমনকি সুপার অ্যাডমিনও কারও ব্যক্তিগত চ্যাট পড়তে পারে না!
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: RESELLER SYSTEM */}
      {activeSection === 'reseller' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>রিসেলারদের পরিচালনা ও মেয়াদ নির্ধারণ কর্মপদ্ধতি</span>
            </h3>

            <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06]">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">১. রিসেলাররা কিভাবে লাভ করবে?</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  রিসেলারদের সুপার অ্যাডমিন ২৫% থেকে ৩৫% পাইকারি (Wholesale) ডিসকাউন্ট প্রদান করে। যেমন: ChatGPT Plus এর মূল দাম ৳৪৯৯ হলে রিসেলার তা পায় ৳৩০০ টাকায়। রিসেলার নিজের ক্লায়েন্টের কাছে ৳৪৫০ বা ৳৫০০ টাকায় বিক্রি করে প্রতি সিটে ৳১৫০–৳২০০ টাকা পর্যন্ত নিট প্রফিট করে।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06]">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">২. কাস্টম মেয়াদ নির্ধারণ (৭ দিন, ১৫ দিন, ১ মাস, ৬ মাস, ১ বছর):</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  রিসেলার প্যানেল থেকে যখন কোনো ক্লায়েন্টের কাছে বিক্রি করা হয়, তখন রিসেলার ড্রপডাউন থেকে মেয়াদ নির্বাচন করতে পারে। সিস্টেম স্বয়ংক্রিয়ভাবে ক্লায়েন্টের মেয়াদ শেষ হওয়ার তারিখ হিসাব করে এবং সেই তারিখ অতিক্রম করলেই সিট স্বয়ংক্রিয়ভাবে Expired হয়ে যায়।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06]">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">৩. রিসেলার ওয়ালেট ও ব্যালেন্স রিচার্জ:</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  রিসেলাররা সুপার অ্যাডমিনকে এককালীন টাকা (যেমন ৫,০০০ বা ১০,০০০ টাকা) বিকাশ বা ব্যাংকে পাঠিয়ে ওয়ালেট লোড করে। এরপর প্রতিবার বিক্রি করার সময় তার ওয়ালেট থেকে পাইকারি খরচ কেটে ক্লায়েন্টের লাইসেন্স সক্রিয় হয়ে যায়।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: SMS & WHATSAPP TEMPLATES */}
      {activeSection === 'templates' && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-white dark:bg-[#090E1A] border border-slate-200 dark:border-white/[0.08] p-6 sm:p-7 space-y-6 shadow-sm">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Copy className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              <span>গ্রাহককে লাইসেন্স পাঠানোর জন্য কপিযোগ্য এসএমএস ও মেসেজ টেমপ্লেট</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Template 1: Instant Delivery */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">টেমপ্লেট ১: তাৎক্ষণিক লাইসেন্স ডেলিভারি এসএমএস</span>
                  <button
                    onClick={() => copyToClipboard(`অভিনন্দন! আপনার NexusAI ChatGPT Plus সাবস্ক্রিপশন সক্রিয় হয়েছে।\nলাইসেন্স কি: NEXUS-GPT4-99824\nমেয়াদকাল: ৩০ দিন (মেয়াদ শেষ: ১৫ নভেম্বর, ২০২৬)\nক্রেডিট পয়েন্ট: ৫০০ ক্রেডিট (৫০০,০০০ টোকেন)\nলগইন লিংক: https://nexus-ai.store\nযেকোনো সহায়তায় হেল্পলাইন: ${settings.bkashMerchant}`, 'temp1')}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 text-[11px] shadow-xs"
                  >
                    {copiedTemplate === 'temp1' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplate === 'temp1' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] leading-relaxed whitespace-pre-wrap">
{`অভিনন্দন! আপনার NexusAI ChatGPT Plus সাবস্ক্রিপশন সক্রিয় হয়েছে।
লাইসেন্স কি: NEXUS-GPT4-99824
মেয়াদকাল: ৩০ দিন (মেয়াদ শেষ: ১৫ নভেম্বর, ২০২৬)
ক্রেডিট পয়েন্ট: ৫০০ ক্রেডিট (৫০০,০০০ টোকেন)
লগইন লিংক: https://nexus-ai.store
যেকোনো সহায়তায় হেল্পলাইন: ${settings.supportPhone}`}
                </div>
              </div>

              {/* Template 2: Expiry Reminder */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#050814] border border-slate-200/90 dark:border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">টেমপ্লেট ২: মেয়াদ শেষ হওয়ার রিমাইন্ডার ও রিনিউয়াল</span>
                  <button
                    onClick={() => copyToClipboard(`প্রিয় গ্রাহক, আপনার NexusAI সাবস্ক্রিপশনের মেয়াদ আগামী ৩ দিনের মধ্যে শেষ হতে যাচ্ছে। নিরবচ্ছিন্ন এআই সেবা বজায় রাখতে আজই রিনিউ করুন। রিনিউ করতে বিকাশ করুন: ${settings.bkashMerchant} নম্বরে। ধন্যবাদ!`, 'temp2')}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 text-[11px] shadow-xs"
                  >
                    {copiedTemplate === 'temp2' ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedTemplate === 'temp2' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06] leading-relaxed whitespace-pre-wrap">
{`প্রিয় গ্রাহক, আপনার NexusAI সাবস্ক্রিপশনের মেয়াদ আগামী ৩ দিনের মধ্যে শেষ হতে যাচ্ছে।
নিরবচ্ছিন্ন এআই সেবা বজায় রাখতে আজই রিনিউ করুন।
রিনিউ করতে বিকাশ করুন: ${settings.bkashMerchant} নম্বরে।
ধন্যবাদ!`}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 3. Bottom Quick Action Links */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-[#080D1A] border border-slate-200 dark:border-white/[0.08] shadow-xs">
        <div>
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">সরাসরি কাজ শুরু করতে চান?</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400">সুপার অ্যাডমিন সিকিউর পোর্টালে লগইন করে প্যাকেজ বা সেটিংস কনফিগার করুন।</p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-purple-600/25"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>সুপার অ্যাডমিন লগইন পোর্টাল</span>
            </button>
          )}

          {onOpenMarketplace && (
            <button
              onClick={onOpenMarketplace}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>ডিজিটাল স্টোরে যান</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
