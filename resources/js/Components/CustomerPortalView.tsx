import React, { useState } from 'react';
import { 
  User, 
  AISubscriptionPlan, 
  PaymentOrder, 
  SystemSettings 
} from '../types';
import { storage } from '../services/storage';
import { 
  UserCheck, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  CreditCard, 
  RefreshCw, 
  Bot, 
  Globe, 
  Calendar, 
  KeyRound,
  FileText
} from 'lucide-react';
import { UserAvatar } from './UserAvatar';

interface CustomerPortalViewProps {
  currentUser: User;
  plans: AISubscriptionPlan[];
  orders: PaymentOrder[];
  settings: SystemSettings;
  onOpenInAppChat: () => void;
  onOpenDomainProxy: () => void;
  onOpenMarketplace: () => void;
  onSelectPlanForRenewal: (plan: AISubscriptionPlan) => void;
}

export const CustomerPortalView: React.FC<CustomerPortalViewProps> = ({
  currentUser,
  plans,
  orders,
  settings,
  onOpenInAppChat,
  onOpenDomainProxy,
  onOpenMarketplace,
  onSelectPlanForRenewal,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);

  // Find user's active plan
  const currentPlan = plans.find(p => p.id === currentUser.currentPlanId);
  const validity = storage.checkSubscriptionValidity(currentUser.subscriptionExpiry);

  // User's personal orders
  const myOrders = orders.filter(o => o.userId === currentUser.id);

  const handleCopySeatKey = () => {
    if (currentUser.activeSeatKey) {
      navigator.clipboard.writeText(currentUser.activeSeatKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2500);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Profile Welcome Card */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#141C33] border border-white/[0.08] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <UserAvatar name={currentUser.name} avatar={currentUser.avatar} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-bold border border-indigo-500/30">
                কাস্টমার ড্যাশবোর্ড
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              ইমেইল: <span className="text-slate-300 font-mono">{currentUser.email}</span> · ফোন: <span className="text-slate-300 font-mono">{currentUser.phone || '01XXXXXXXXX'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenMarketplace}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>নতুন প্ল্যান কিনুন</span>
          </button>
        </div>
      </div>

      {/* 2. Active Subscription & Validity Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Subscription Validity & Access (2 Columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#090E1A] border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-base text-white">আমার সক্রিয় সাবস্ক্রিপশন ও মেয়াদকাল</h2>
            </div>
            
            {/* Validity Status Pill */}
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 ${validity.badgeColor}`}>
              {validity.isValid ? (
                validity.isExpiringSoon ? (
                  <>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{validity.statusLabel}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{validity.statusLabel}</span>
                  </>
                )
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{validity.statusLabel}</span>
                </>
              )}
            </span>
          </div>

          {currentPlan ? (
            <div className="space-y-4">
              
              {/* Plan Information Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#050814] border border-white/[0.06]">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                    বর্তমান প্যাকেজ:
                  </div>
                  <div className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
                    <span>{currentPlan.name}</span>
                    <span className="text-xs font-normal text-indigo-400 font-mono">({currentPlan.provider})</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-mono">মাসিক সাবস্ক্রিপশন ফি</div>
                  <div className="text-lg font-black text-emerald-400 font-mono tabular-nums">
                    ৳{currentPlan.priceBDT.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Validity Progress & Dates */}
              <div className="space-y-2 p-4 rounded-xl bg-[#050814] border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">সাবস্ক্রিপশনের মেয়াদ অগ্রগতি:</span>
                  <span className="text-white font-mono font-bold">
                    {validity.isValid ? `আর ${validity.daysRemaining} দিন কার্যকর` : 'মেয়াদ শেষ হয়েছে'}
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      !validity.isValid 
                        ? 'bg-red-500 w-full' 
                        : validity.isExpiringSoon 
                        ? 'bg-amber-400' 
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${validity.isValid ? validity.percentRemaining : 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                  <div>শুরু: <strong className="text-slate-300">{currentUser.subscriptionStartDate || '2026-10-10'}</strong></div>
                  <div>মেয়াদ শেষ: <strong className={validity.isValid ? 'text-emerald-400' : 'text-red-400'}>{currentUser.subscriptionExpiry || 'মেয়াদ নেই'}</strong></div>
                </div>
              </div>

              {/* Point & Credit Token Balance */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-[#050814] border border-white/[0.06]">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">অ্যাকাউন্ট ক্রেডিট পয়েন্ট:</span>
                  <span className="text-base sm:text-lg font-black text-cyan-300 font-mono flex items-center gap-1 mt-0.5">
                    💎 {Math.round((currentUser.maxTokens || 500000) / 1000)} ক্রেডিট
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">এআই টোকেন ক্যাপাসিটি:</span>
                  <span className="text-base sm:text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                    {(currentUser.maxTokens || 500000).toLocaleString()} টোকেন
                  </span>
                </div>
              </div>

              {/* License Key & Credentials */}
              {currentUser.activeSeatKey && (
                <div className="p-4 rounded-xl bg-[#050814] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                      <span>আপনার অফিসিয়াল সিট / লাইসেন্স টোকেন:</span>
                    </div>
                    <code className="text-sm font-mono text-emerald-300 font-bold tracking-wider mt-1 block">
                      {currentUser.activeSeatKey}
                    </code>
                  </div>

                  <button
                    onClick={handleCopySeatKey}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'কপি হয়েছে' : 'কি কপি করুন'}</span>
                  </button>
                </div>
              )}

              {/* Action Launch Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={onOpenInAppChat}
                  disabled={!validity.isValid}
                  className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                    validity.isValid
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Bot className="w-4 h-4" />
                  <span>প্ল্যাটফর্মে চ্যাটজিপিটি ওপেন করুন</span>
                </button>

                <button
                  onClick={onOpenDomainProxy}
                  disabled={!validity.isValid}
                  className={`flex-1 w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                    validity.isValid
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>ডোমেইন প্রক্সি ভিউ</span>
                </button>

                <button
                  onClick={() => onSelectPlanForRenewal(currentPlan)}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>রিনিউ / মেয়াদ বৃদ্ধি</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="text-white font-bold text-sm">আপনার কোনো সক্রিয় এআই সাবস্ক্রিপশন নেই</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                চ্যাটজিপিটি, ক্লড অথবা মিডজার্নি সাবস্ক্রিপশন কিনে অবিলম্বে আনলিমিটেড এআই এক্সেস চালু করুন।
              </p>
              <button
                onClick={onOpenMarketplace}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>এআই শপ থেকে প্ল্যান কিনুন</span>
              </button>
            </div>
          )}
        </div>

        {/* Right: Security & Zero-Knowledge Guarantee (1 Column) */}
        <div className="rounded-2xl bg-[#090E1A] border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-white/[0.06] pb-3">
            <ShieldCheck className="w-5 h-5" />
            <span>প্রাইভেসি ও সিকিউরিটি শিল্ড</span>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3 rounded-xl bg-[#050814] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">🔒 জিরো-নলেজ চ্যাট স্টোরেজ</div>
              <div className="text-[11px] text-slate-400">
                আপনার সমস্ত চ্যাট হিস্ট্রি আপনার ব্রাউজারের নিজস্ব এনক্রিপ্টেড সেশনে সুরক্ষিত। অন্য কোনো গ্রাহক বা অ্যাডমিন এটি পড়তে পারেন না।
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#050814] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">📁 প্রাইভেট ডকুমেন্ট ভল্ট</div>
              <div className="text-[11px] text-slate-400">
                আপনার আপলোড করা গোপন পিডিএফ, কোড বা ডকুমেন্ট সম্পূর্ণ আইসোলেটেড পার্টিশনে এনক্রিপ্ট থাকে।
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#050814] border border-white/[0.06]">
              <div className="font-bold text-white mb-1">⚡ ১০০% অফিশিয়াল ডোমেইন সিট</div>
              <div className="text-[11px] text-slate-400">
                অফিশিয়াল ChatGPT Plus ও ডোমেইন প্রক্সির মাধ্যমে কোনো অ্যাকাউন্ট ব্যান বা আইপি কনফ্লিক্ট ছাড়া নির্ভরযোগ্য এক্সেস।
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 3. My Payment Orders History */}
      <div className="rounded-2xl bg-[#090E1A] border border-white/[0.08] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>আমার পেমেন্ট ও অর্ডার হিস্ট্রি</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">মোট {myOrders.length} টি অর্ডার</span>
        </div>

        {myOrders.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            এখনো কোনো অর্ডার সম্পন্ন করা হয়নি।
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="py-2.5 px-3">অর্ডার আইডি</th>
                  <th className="py-2.5 px-3">প্ল্যানের নাম</th>
                  <th className="py-2.5 px-3">পদ্ধতি ও TrxID</th>
                  <th className="py-2.5 px-3 text-right">পরিশোধিত টাকা</th>
                  <th className="py-2.5 px-3 text-center">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right">তারিখ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {myOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-300">{order.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{order.planName}</td>
                    <td className="py-3 px-3">
                      <span className="uppercase font-mono text-[11px] text-slate-300">{order.method}</span>
                      <span className="text-slate-500 mx-1">·</span>
                      <code className="text-[10px] text-slate-400 font-mono">{order.trxId}</code>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      ৳{order.amountBDT.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {order.status === 'approved' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                          অ্যাপ্রুভড
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                          পেন্ডিং রিভিউ
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {order.createdAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
