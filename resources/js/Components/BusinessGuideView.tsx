import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  ArrowRight, 
  Calculator, 
  Share2, 
  Lock,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { BusinessGuideTopic } from '../types';
import { storage } from '../services/storage';

export const BusinessGuideView: React.FC = () => {
  const guides = storage.getGuides();
  const [activeTopicId, setActiveTopicId] = useState<string>(guides[0]?.id || 'guide-sourcing-models');
  
  // Interactive Profit Calculator State
  const [customerCount, setCustomerCount] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(499);
  const [costPerSeat, setCostPerSeat] = useState<number>(120);

  const totalRevenue = customerCount * sellingPrice;
  const totalCost = customerCount * costPerSeat;
  const netProfit = totalRevenue - totalCost;
  const marginPercent = Math.round((netProfit / totalRevenue) * 100);

  const activeGuide = guides.find(g => g.id === activeTopicId) || guides[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-500/30 p-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-3">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>এআই সাবস্ক্রিপশন রিসেলিং বিজনেস মাস্টারক্লাস</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            কীভাবে এআই সাবস্ক্রিপশন বিক্রি করে সফল বিজনেস তৈরি করবেন
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            পাইকারি সোর্সিং, নিজস্ব ডোমেইন প্রক্সি সেটআপ, সুপার অ্যাডমিন প্যানেল পরিচালনা এবং ১০০% ইউজার প্রাইভেসি বজায় রেখে মাসে লাখ টাকা আয়ের কমপ্লিট ব্লুপ্রিন্ট।
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/80 border border-blue-500/30 text-center shrink-0 w-full md:w-auto">
          <div className="text-xs text-slate-400">এআই রিসেলিং গড় প্রফিট মার্জিন:</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">৭০% - ৮৫%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">লো ইনভেস্টমেন্ট, হাই ডিমান্ড</div>
        </div>
      </div>

      {/* Interactive Profit Margin Calculator */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">ইন্টারেক্টিভ প্রফিট ক্যালকুলেটর (Revenue Estimator)</h3>
            <p className="text-xs text-slate-400">আপনার গ্রাহক সংখ্যা ও বিক্রয়মূল্য পরিবর্তন করে মাসিক লাভ হিসাব করুন</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Controls */}
          <div className="space-y-4 md:col-span-2">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>মাসিক গ্রাহক সংখ্যা (Subscribers):</span>
                <span className="text-cyan-400 font-mono font-bold text-sm">{customerCount} জন</span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={customerCount}
                onChange={(e) => setCustomerCount(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  প্রতি সাবস্ক্রিপশন বিক্রয়মূল্য (টাকা):
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  প্রতি সিট খরচ (Team/API সোর্সিং খরচ):
                </label>
                <input
                  type="number"
                  value={costPerSeat}
                  onChange={(e) => setCostPerSeat(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-950 border border-indigo-500/40 p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400">মাসিক মোট আয় (Revenue):</div>
              <div className="text-lg font-bold text-white font-mono">৳{totalRevenue.toLocaleString()}</div>

              <div className="text-xs text-slate-400 mt-2">সোর্সিং খরচ (Cost):</div>
              <div className="text-sm font-semibold text-slate-400 font-mono">৳{totalCost.toLocaleString()}</div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="text-xs font-bold text-emerald-400">মাসিক সম্ভাব্য নিট লাভ:</div>
              <div className="text-2xl font-black text-emerald-400 font-mono">
                ৳{netProfit.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                প্রফিট মার্জিন: <span className="text-cyan-400 font-bold">{marginPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Topics Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topic List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            গাইড টপিক নির্বাচন করুন:
          </h3>

          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTopicId(g.id)}
              className={`w-full text-left p-4 rounded-2xl border transition flex flex-col gap-1.5 ${
                activeTopicId === g.id
                  ? 'bg-blue-600/20 border-blue-500/60 shadow-lg text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-300">
                  {g.tag}
                </span>
                <span className="text-[10px] text-slate-500">{g.readTime}</span>
              </div>
              <div className="font-bold text-xs sm:text-sm text-slate-100 line-clamp-1">
                {g.titleBn}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-2">
                {g.descriptionBn}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Topic Content */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300">
                {activeGuide.tag}
              </span>
              <span className="text-xs text-slate-400">পড়ার সময়: {activeGuide.readTime}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {activeGuide.titleBn}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {activeGuide.titleEn}
            </p>
          </div>

          {/* Key Points Checklist */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> মূল সারাংশ ও টেকনিক্যাল পয়েন্ট:
            </h4>
            {activeGuide.keyPointsBn.map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* Full Markdown Guide Content */}
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line border-t border-slate-800 pt-6">
            {activeGuide.fullGuideMarkdownBn}
          </div>
        </div>

      </div>

    </div>
  );
};
