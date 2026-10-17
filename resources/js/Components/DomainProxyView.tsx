import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Lock, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Maximize2, 
  Bot
} from 'lucide-react';
import { User, AISubscriptionPlan, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface DomainProxyViewProps {
  currentUser: User;
  plans: AISubscriptionPlan[];
  settings: SystemSettings;
  onOpenInAppChat: () => void;
}

export const DomainProxyView: React.FC<DomainProxyViewProps> = ({
  currentUser,
  plans,
  settings,
  onOpenInAppChat,
}) => {
  const [selectedGateway, setSelectedGateway] = useState<string>('chatgpt');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);

  const gateways = [
    {
      id: 'chatgpt',
      name: 'ChatGPT Official Web (chatgpt.com)',
      url: 'https://chatgpt.com',
      badge: 'OpenAI Direct',
      description: 'অফিশিয়াল চ্যাটজিপিটি ডোমেইন গেটওয়ে যা সেশন টোকেনের মাধ্যমে কাজ করে।'
    },
    {
      id: 'nexus-proxy',
      name: 'NexusAI Enterprise Proxy Gateway',
      url: 'https://ais-pre-5cj6fmeawbdj6pdsztqxz4-5471260499.asia-southeast1.run.app',
      badge: 'Zero-Block Proxy',
      description: 'আমাদের ক্লাউড সার্ভারের রিভার্স প্রক্সি ডোমেইন, যেখানে কোনো অ্যাকাউন্ট ব্যান বা ব্লক হয় না।'
    },
    {
      id: 'claude',
      name: 'Claude.ai Workspace Portal',
      url: 'https://claude.ai',
      badge: 'Anthropic Direct',
      description: 'ক্লড ডট এআই ডোমেইনে সরাসরি যুক্ত হওয়ার জন্য সিকিউর রাউটার।'
    }
  ];

  const currentGateway = gateways.find(g => g.id === selectedGateway) || gateways[0];
  const userSeatKey = currentUser.activeSeatKey || 'NEXUS-DEFAULT-TRIAL-88';
  const validity = storage.checkSubscriptionValidity(currentUser.subscriptionExpiry);

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Expiry Warning Banner if invalid */}
      {!validity.isValid && (
        <div className="rounded-2xl bg-red-950/80 border border-red-500/30 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-red-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span>
              <strong>সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে!</strong> ডোমেইন প্রক্সি ও সেশন টোকেন দিয়ে লগইন করতে আপনার সাবস্ক্রিপশন নবায়ন করুন।
            </span>
          </div>
          <span className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold text-[11px] shrink-0">
            মেয়াদ উত্তীর্ণ
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="rounded-3xl bg-[#080d1e] border border-white/10 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 text-xs font-semibold mb-2">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>চ্যাটজিপিটি ও এআই ডোমেইন রাউটিং সিস্টেম</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            অফিশিয়াল ডোমেইন ভিউ ও রিভার্স প্রক্সি ইন্টারফেস
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            প্ল্যাটফর্মের ভেতর থেকেই চ্যাটজিপিটি অফিশিয়াল ডোমেইন ও এন্টারপ্রাইজ প্রক্সির মাধ্যমে এআই ব্যবহার করুন। কোনো পাসওয়ার্ড শেয়ারিং ছাড়াই আপনার সেশন নিরাপদ থাকবে।
          </p>
        </div>

        <button
          onClick={onOpenInAppChat}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 transition shadow-lg shadow-cyan-600/20"
        >
          <Bot className="w-4 h-4" />
          <span>ইন-অ্যাপ ডিরেক্ট চ্যাটে যান</span>
        </button>
      </div>

      {/* Gateway Selector Tabs & User Seat Token Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Gateway Selection & SSO Token */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-white/[0.08] p-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ডোমেইন গেটওয়ে নির্বাচন করুন:
            </h3>

            {gateways.map((gw) => (
              <button
                key={gw.id}
                onClick={() => setSelectedGateway(gw.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition flex flex-col gap-1 ${
                  selectedGateway === gw.id
                    ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md text-white'
                    : 'bg-slate-950 border-white/[0.06] text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{gw.name}</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-300">
                    {gw.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">{gw.url}</div>
              </button>
            ))}
          </div>

          {/* User Seat Key Box */}
          <div className="rounded-2xl bg-slate-900/90 border border-indigo-500/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> আপনার ব্যক্তিগত সিট টোকেন
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                Active
              </span>
            </div>

            <div className="bg-slate-950 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-300 tracking-wider font-bold">
                {userSeatKey}
              </span>
              <button
                onClick={() => copyText(userSeatKey, 'seatKey')}
                className="hover:text-white text-slate-400 transition p-1"
                title="কপি করুন"
              >
                {copiedField === 'seatKey' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              ডোমেইন প্রক্সি ব্যবহারের সময় এই সিট টোকেনটি দিলে আপনার পার্সোনাল সেশন অটোমেটিক অথরাইজড হয়ে যাবে।
            </p>
          </div>

          {/* Direct Launch Button */}
          <a
            href={currentGateway.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition"
          >
            <ExternalLink className="w-4 h-4" />
            <span>নতুন ট্যাবে {currentGateway.name.split(' ')[0]} ওপেন করুন</span>
          </a>
        </div>

        {/* Right: Simulated Browser Frame */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-white/[0.08] overflow-hidden shadow-2xl flex flex-col h-[560px]">
          
          {/* Simulated Browser Bar */}
          <div className="bg-slate-950 px-4 py-2.5 border-b border-white/[0.08] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            </div>

            <div className="flex-1 max-w-lg bg-slate-900 border border-white/10 rounded-xl px-3 py-1 flex items-center gap-2 text-slate-300 font-mono text-[11px]">
              <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-emerald-400">https://</span>
              <span className="truncate">{currentGateway.url.replace('https://', '')}</span>
              <span className="ml-auto text-[10px] text-indigo-400 font-sans">
                🔒 Sandbox
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIframeKey(k => k + 1)}
                className="text-slate-400 hover:text-white p-1"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <a
                href={currentGateway.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white p-1"
                title="পূর্ণ পর্দায় নতুন উইন্ডোতে ওপেন করুন"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Webview Content */}
          <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 shadow-xl">
              <Globe className="w-7 h-7" />
            </div>

            <h4 className="text-base font-bold text-white mb-1">
              {currentGateway.name}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
              OpenAI ও আধুনিক ক্লাউড সার্ভিস সিকিউরিটি পলিসি (X-Frame-Options/CSP) এর কারণে এক্সটার্নাল ফ্রেম ব্লক করে। তাই আমাদের প্ল্যাটফর্ম দুটি নিরাপদ উপায় নিশ্চিত করেছে:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full text-left mb-6">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.08]">
                <div className="text-xs font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" /> উপায় ১: ইন-অ্যাপ চ্যাট
                </div>
                <p className="text-[11px] text-slate-400">
                  ব্রাউজারের কোনো সীমাবদ্ধতা ছাড়াই প্ল্যাটফর্মের ভেতর ১০০% লাইভ চ্যাটজিপিটি ব্যবহার করুন।
                </p>
                <button
                  onClick={onOpenInAppChat}
                  className="mt-2 text-[11px] font-bold text-indigo-400 hover:text-indigo-300"
                >
                  ইন-অ্যাপ চ্যাট খুলুন →
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-white/[0.08]">
                <div className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" /> উপায় ২: ডোমেইন ডিরেক্ট লিংক
                </div>
                <p className="text-[11px] text-slate-400">
                  নতুন ট্যাবে অফিশিয়াল ডোমেইন ওপেন করে সরাসরি আপনার সেশন উপভোগ করুন।
                </p>
                <a
                  href={currentGateway.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-[11px] font-bold text-amber-400 hover:text-amber-300"
                >
                  ডোমেইন ওপেন করুন →
                </a>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              আপনার ব্রাউজারের কোনো কুকি অন্য কারও সাথে শেয়ার হবে না।
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
