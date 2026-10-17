import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Copy, 
  Check, 
  Search, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  KeyRound, 
  Phone, 
  Mail, 
  Calendar, 
  Percent,
  RefreshCw
} from 'lucide-react';
import { User, AISubscriptionPlan, ResellerClientSale, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface ResellerPanelViewProps {
  currentUser: User;
  plans: AISubscriptionPlan[];
  settings: SystemSettings;
  onRefreshData: () => void;
  onOpenWorkspace: () => void;
}

export const ResellerPanelView: React.FC<ResellerPanelViewProps> = ({
  currentUser,
  plans,
  settings,
  onRefreshData,
  onOpenWorkspace,
}) => {
  const [sales, setSales] = useState<ResellerClientSale[]>(storage.getResellerSales(currentUser.role === 'reseller' ? currentUser.id : undefined));
  const [searchQuery, setSearchQuery] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  // Form state for selling / issuing subscription
  const discountRate = (currentUser.resellerDiscountPercent || 25) / 100;

  const [issueForm, setIssueForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    planId: plans[0]?.id || 'chatgpt-plus',
    durationDays: 30,
    durationLabel: '১ মাস (৩০ দিন)',
    customSellingPriceBDT: 450,
  });

  const selectedPlan = plans.find(p => p.id === issueForm.planId) || plans[0];
  const wholesaleCost = Math.round(selectedPlan ? selectedPlan.priceBDT * (1 - discountRate) : 300);
  const calculatedProfit = Math.max(0, issueForm.customSellingPriceBDT - wholesaleCost);

  // Filtered sales list
  const filteredSales = sales.filter(s =>
    searchQuery === '' ||
    s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.clientPhone.includes(searchQuery) ||
    s.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.seatKey.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Analytics
  const totalSeatsSold = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + s.sellingPriceBDT, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profitBDT, 0);
  const activeClients = sales.filter(s => s.status === 'active' || s.status === 'expiring_soon').length;
  const walletBalance = currentUser.walletBalanceBDT || 14500;

  // Duration Options
  const durationOptions = [
    { days: 7, label: '৭ দিন (ট্রায়াল প্যাক)' },
    { days: 15, label: '১৫ দিন (অর্ধ-মাসিক)' },
    { days: 30, label: '১ মাস (৩০ দিন - স্ট্যান্ডার্ড)' },
    { days: 90, label: '৩ মাস (৯০ দিন - কোয়াটারলি)' },
    { days: 180, label: '৬ মাস (১৮০ দিন)' },
    { days: 365, label: '১ বছর (৩৬৫ দিন - বার্ষিক)' },
  ];

  const handleSelectPlan = (planId: string) => {
    const p = plans.find(plan => plan.id === planId);
    if (p) {
      const wholesale = Math.round(p.priceBDT * (1 - discountRate));
      setIssueForm({
        ...issueForm,
        planId,
        customSellingPriceBDT: Math.round(p.priceBDT * 1.1),
      });
    }
  };

  const handleIssueSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.clientName || !issueForm.clientPhone) return;

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + issueForm.durationDays);

    const seatKey = 'RES-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newSale = storage.createResellerSale({
      resellerId: currentUser.id,
      clientName: issueForm.clientName,
      clientPhone: issueForm.clientPhone,
      clientEmail: issueForm.clientEmail || `${issueForm.clientPhone}@nexusclient.com`,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      durationDays: issueForm.durationDays,
      durationLabel: issueForm.durationLabel,
      startDate: startDate.toISOString().split('T')[0],
      expiryDate: expiryDate.toISOString().split('T')[0],
      seatKey,
      wholesaleCostBDT: wholesaleCost,
      sellingPriceBDT: Number(issueForm.customSellingPriceBDT),
      profitBDT: calculatedProfit,
      status: 'active',
      credentialsOrUrl: selectedPlan.accessType === 'in_app_chat' 
        ? `${settings.chatgptProxyUrl} (লগইন টোকেন: ${seatKey})`
        : `অফিসিয়াল ডোমেইন লিংক: ${selectedPlan.directDomainUrl}`,
    });

    setSales(storage.getResellerSales(currentUser.role === 'reseller' ? currentUser.id : undefined));
    setShowIssueModal(false);
    onRefreshData();

    // Reset Form
    setIssueForm({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      planId: plans[0]?.id || 'chatgpt-plus',
      durationDays: 30,
      durationLabel: '১ মাস (৩০ দিন)',
      customSellingPriceBDT: 450,
    });
  };

  const handleCopySeatKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleCopyWhatsAppTemplate = (sale: ResellerClientSale) => {
    const text = `🎉 প্রিয় ${sale.clientName}, আপনার ${sale.planName} সাবস্ক্রিপশন সফলভাবে চালু করা হয়েছে!\n\n🔑 আপনার লাইসেন্স / সিট কি: ${sale.seatKey}\n📅 মেয়াদ শুরু: ${sale.startDate}\n⏳ মেয়াদ শেষ হবে: ${sale.expiryDate} (${sale.durationLabel})\n🌐 ব্যবহারের লিংক: ${settings.chatgptProxyUrl || 'https://chatgpt.com'}\n\nযেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন। ধন্যবাদ!`;
    navigator.clipboard.writeText(text);
    setCopiedTemplate(sale.id);
    setTimeout(() => setCopiedTemplate(null), 2500);
  };

  const handleExtendSale = (saleId: string) => {
    const salesList = storage.getResellerSales();
    const target = salesList.find(s => s.id === saleId);
    if (!target) return;

    const currentExp = new Date(target.expiryDate);
    const base = currentExp > new Date() ? currentExp : new Date();
    base.setDate(base.getDate() + 30);
    target.expiryDate = base.toISOString().split('T')[0];
    target.status = 'active';

    storage.saveResellerSales(salesList);
    setSales(storage.getResellerSales(currentUser.role === 'reseller' ? currentUser.id : undefined));
    onRefreshData();
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Header Banner with Reseller Persona */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0C1222] via-[#0E162B] to-[#121E3B] border border-white/[0.08] p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                NexusAI রিসেলার ড্যাশবোর্ড
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30">
                PRO RESELLER
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              পাইকারি মূল্যে এআই সাবস্ক্রিপশন কিনুন, নিজস্ব মূল্যে গ্রাহকদের কাছে বিক্রি করুন এবং প্রতিটি সিটে নিশ্চিত লাভ অর্জন করুন।
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowIssueModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-600/30 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রাহককে সাবস্ক্রিপশন বিক্রি করুন</span>
        </button>
      </div>

      {/* 2. Reseller Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Wallet Balance */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090E1A] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>রিসেলার ওয়ালেট ব্যালেন্স</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 font-mono tabular-nums">
            ৳{walletBalance.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>পাইকারি ডিসকাউন্ট:</span>
            <span className="font-bold font-mono">{currentUser.resellerDiscountPercent || 25}% OFF</span>
          </div>
        </div>

        {/* Total Client Seats Sold */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090E1A] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>মোট বিক্রিত সাবস্ক্রিপশন</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 font-mono tabular-nums">
            {totalSeatsSold} টি সিট
          </div>
          <div className="text-[11px] text-indigo-300 mt-1">
            সক্রিয় ক্লায়েন্ট: <strong className="text-white font-mono">{activeClients} জন</strong>
          </div>
        </div>

        {/* Total Client Revenue */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090E1A] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>মোট বিক্রয় মূল্য (Gross Revenue)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2 font-mono tabular-nums">
            ৳{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            গ্রাহকদের কাছ থেকে গৃহীত
          </div>
        </div>

        {/* Reseller Net Profit */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090E1A] border border-white/[0.08] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>আপনার অর্জিত নিট লাভ (Net Profit)</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2 font-mono tabular-nums">
            ৳{totalProfit.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1 font-medium">
            প্রতি সিটে গড় লাভ: ৳{totalSeatsSold > 0 ? Math.round(totalProfit / totalSeatsSold) : 150}
          </div>
        </div>
      </div>

      {/* 3. Client Subscriptions & Expiry Management Table */}
      <div className="rounded-2xl bg-[#090E1A] border border-white/[0.08] overflow-hidden shadow-sm space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>আপনার ক্লায়েন্ট সাবস্ক্রিপশন ও মেয়াদ ট্র্যাকার</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              প্রতিটি ক্লায়েন্টের লাইসেন্স কি, মেয়াদকাল এবং এক ক্লিকে রিনিউ করার সুবিধা।
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="গ্রাহকের নাম, মোবাইল বা সিট কি খুঁজুন..."
              className="w-full bg-[#050814] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {filteredSales.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            কোনো ক্লায়েন্ট সাবস্ক্রিপশন পাওয়া যায়নি। "নতুন গ্রাহককে সাবস্ক্রিপশন বিক্রি করুন" বাটনে ক্লিক করে প্রথম সাবস্ক্রিপশন বিক্রি করুন।
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#050814] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.06]">
                <tr>
                  <th className="py-3 px-3">গ্রাহকের নাম ও ফোন</th>
                  <th className="py-3 px-3">এআই প্ল্যান ও কি</th>
                  <th className="py-3 px-3">মেয়াদকাল ও স্ট্যাটাস</th>
                  <th className="py-3 px-3 text-right">পাইকারি ও বিক্রয় মূল্য</th>
                  <th className="py-3 px-3 text-right">আপনার লাভ</th>
                  <th className="py-3 px-3 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredSales.map((sale) => {
                  const now = new Date();
                  const expDate = new Date(sale.expiryDate);
                  const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  const isExpired = daysLeft <= 0;
                  const isExpiringSoon = daysLeft > 0 && daysLeft <= 3;

                  return (
                    <tr key={sale.id} className="hover:bg-white/[0.02] transition">
                      {/* Client Info */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{sale.clientName}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          <span>{sale.clientPhone}</span>
                        </div>
                      </td>

                      {/* Plan & Seat Key */}
                      <td className="py-3.5 px-3">
                        <div className="font-medium text-slate-200">{sale.planName}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <code className="text-[10px] font-mono bg-black/40 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            {sale.seatKey}
                          </code>
                          <button
                            onClick={() => handleCopySeatKey(sale.seatKey)}
                            className="text-slate-400 hover:text-white"
                            title="সিট কি কপি করুন"
                          >
                            {copiedKey === sale.seatKey ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Validity & Expiry */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {isExpired ? (
                            <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>মেয়াদ উত্তীর্ণ</span>
                            </span>
                          ) : isExpiringSoon ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/30 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>আর {daysLeft} দিন বাকি</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>আর {daysLeft} দিন বাকি</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">
                          মেয়াদ শেষ: {sale.expiryDate}
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="font-bold text-white font-mono tabular-nums">
                          ৳{sale.sellingPriceBDT.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                          খরচ: ৳{sale.wholesaleCostBDT}
                        </div>
                      </td>

                      {/* Profit */}
                      <td className="py-3.5 px-3 text-right">
                        <span className="font-bold text-amber-400 font-mono tabular-nums">
                          +৳{sale.profitBDT.toLocaleString()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleCopyWhatsAppTemplate(sale)}
                            className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition border border-emerald-500/30"
                            title="কাস্টমারকে মেসেজ পাঠাতে টেক্সট কপি করুন"
                          >
                            <Send className="w-3 h-3" />
                            <span>{copiedTemplate === sale.id ? 'কপি হয়েছে!' : 'মেসেজ'}</span>
                          </button>

                          <button
                            onClick={() => handleExtendSale(sale.id)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition"
                            title="মেয়াদ আরও ৩০ দিন বৃদ্ধি করুন"
                          >
                            <RefreshCw className="w-3 h-3 text-cyan-400" />
                            <span>+৩০ দিন</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Reseller Selling / Issuing Subscription Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">গ্রাহকের কাছে সাবস্ক্রিপশন বিক্রি ও সিট ইস্যু</h3>
              </div>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleIssueSale} className="space-y-4">
              
              {/* Client Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">গ্রাহকের পূর্ণ নাম:</label>
                <input
                  type="text"
                  required
                  value={issueForm.clientName}
                  onChange={(e) => setIssueForm({ ...issueForm, clientName: e.target.value })}
                  placeholder="যেমন: শিশির বাড়ৈ / হাসান মাহমুদ"
                  className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Client Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">মোবাইল / WhatsApp নম্বর:</label>
                  <input
                    type="tel"
                    required
                    value={issueForm.clientPhone}
                    onChange={(e) => setIssueForm({ ...issueForm, clientPhone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">ইমেইল (ঐচ্ছিক):</label>
                  <input
                    type="email"
                    value={issueForm.clientEmail}
                    onChange={(e) => setIssueForm({ ...issueForm, clientEmail: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Plan Select */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">এআই সাবস্ক্রিপশন নির্বাচন করুন:</label>
                <select
                  value={issueForm.planId}
                  onChange={(e) => handleSelectPlan(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.provider}) - নিয়মিত দাম ৳{p.priceBDT}
                    </option>
                  ))}
                </select>
              </div>

              {/* Validity / Duration Select */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">সাবস্ক্রিপশনের মেয়াদ (Validity):</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.days}
                      type="button"
                      onClick={() => setIssueForm({ ...issueForm, durationDays: opt.days, durationLabel: opt.label })}
                      className={`p-2 rounded-xl text-[11px] font-semibold text-center border transition ${
                        issueForm.durationDays === opt.days
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold'
                          : 'bg-[#050814] text-slate-400 border-white/10 hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing & Profit Calculation */}
              <div className="p-3.5 rounded-2xl bg-[#050814] border border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>আপনার পাইকারি ক্রয়মূল্য (Wholesale Cost):</span>
                  <span className="font-bold text-white font-mono">৳{wholesaleCost}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">গ্রাহকের কাছে বিক্রয় মূল্য (BDT):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">৳</span>
                    <input
                      type="number"
                      required
                      min={wholesaleCost}
                      value={issueForm.customSellingPriceBDT}
                      onChange={(e) => setIssueForm({ ...issueForm, customSellingPriceBDT: Number(e.target.value) })}
                      className="w-24 bg-slate-900 border border-white/20 rounded-lg px-2 py-1 text-xs text-white font-mono text-right font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs font-bold">
                  <span className="text-emerald-400">এই বিক্রয়ে আপনার নিট মুনাফা:</span>
                  <span className="text-amber-400 font-mono text-sm">৳{calculatedProfit}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সিট ইস্যু ও সেল সম্পন্ন করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
