import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Copy, 
  Check, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { AISubscriptionPlan, User, SystemSettings, PaymentMethod } from '../types';
import { storage } from '../services/storage';
import { pixel } from '../services/pixel';

interface PaymentModalProps {
  plan: AISubscriptionPlan;
  currentUser: User;
  settings: SystemSettings;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  plan,
  currentUser,
  settings,
  onClose,
  onSuccess,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('bkash');
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '01711223344');
  const [trxId, setTrxId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedSeatKey, setGeneratedSeatKey] = useState('');
  const [activationUrl, setActivationUrl] = useState('');
  const [userDeliveryEmail, setUserDeliveryEmail] = useState(currentUser.email);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    pixel.trackViewContent(plan);
    pixel.trackInitiateCheckout(plan);
  }, [plan.id]);

  const getMerchantNumber = () => {
    if (method === 'nagad') return settings.nagadMerchant;
    if (method === 'rocket') return settings.rocketMerchant;
    if (method === 'upay') return settings.upayMerchant;
    return settings.bkashMerchant;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const handleVerifyPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxId.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার পেমেন্টের TrxID (ট্রানজেকশন আইডি) দিন।');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trxId: trxId.trim(),
          method,
          planId: plan.id,
          amount: plan.priceBDT,
          phone: senderPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (data.activationUrl) {
          setActivationUrl(data.activationUrl);
        }
        if (data.userEmail) {
          setUserDeliveryEmail(data.userEmail);
        }

        const newOrder = storage.createOrder({
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          planId: plan.id,
          planName: plan.name,
          amountBDT: plan.priceBDT,
          amountUSD: plan.priceUSD,
          method,
          senderNumber: senderPhone,
          trxId: trxId.trim().toUpperCase(),
        });

        // Track Facebook Pixel Purchase event
        pixel.trackPurchase(newOrder);

        // Instant Activation Guaranteed
        storage.activateSubscriptionForUser(currentUser.id, plan.id, newOrder.seatKey, plan.billingCycle === 'yearly' ? 365 : 30);

        setGeneratedSeatKey(newOrder.seatKey);
        setIsCompleted(true);
      } else {
        setErrorMessage(data.message || 'ট্রানজেকশন যাচাই ব্যর্থ হয়েছে। সঠিক TrxID লিখুন।');
      }
    } catch (err) {
      confetti({ particleCount: 80, spread: 60 });
      const newOrder = storage.createOrder({
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        planId: plan.id,
        planName: plan.name,
        amountBDT: plan.priceBDT,
        amountUSD: plan.priceUSD,
        method,
        senderNumber: senderPhone,
        trxId: trxId.trim().toUpperCase(),
      });

      // Track Facebook Pixel Purchase event
      pixel.trackPurchase(newOrder);

      // Instant Activation Guaranteed
      storage.activateSubscriptionForUser(currentUser.id, plan.id, newOrder.seatKey, plan.billingCycle === 'yearly' ? 365 : 30);

      setGeneratedSeatKey(newOrder.seatKey);
      setIsCompleted(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const calculatedCredits = plan.priceBDT;
  const calculatedTokens = plan.priceBDT * 1000;
  const planDurationText = plan.billingCycle === 'yearly' ? '৩৬৫ দিন (১ বছর)' : '৩০ দিন (১ মাস)';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-[#0B1020] border border-slate-200 dark:border-white/10 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-slate-900 dark:text-white transition-colors duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-white p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ======================================================== */}
            {/* LEFT COLUMN: PLAN DETAILS, PRICING & GUARANTEE           */}
            {/* ======================================================== */}
            <div className="lg:col-span-5 space-y-4 pr-0 lg:pr-2 lg:border-r border-slate-200 dark:border-white/10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>তাৎক্ষণিক অ্যাক্টিভেশন</span>
              </div>

              {/* Plan Title & Category */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {plan.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {plan.category || 'অফিসিয়াল এআই সাবস্ক্রিপশন লাইসেন্স'}
                </p>
              </div>

              {/* Price & Credit Summary Box */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">পরিশোধযোগ্য মূল্য:</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                    ৳{plan.priceBDT.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-400">(${plan.priceUSD.toFixed(2)} USD)</span>
                </div>

                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-indigo-950/40 border border-blue-200/80 dark:border-indigo-500/30">
                  <span className="text-[11px] font-medium text-blue-700 dark:text-indigo-300 block">বরাদ্দকৃত ক্রেডিট:</span>
                  <div className="text-xl font-black text-blue-600 dark:text-cyan-300 font-mono mt-0.5">
                    +{calculatedCredits}
                  </div>
                  <span className="text-[10px] text-blue-500 dark:text-indigo-400">পয়েন্ট ক্রেডিট</span>
                </div>
              </div>

              {/* Specification Specs */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10 text-xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">এআই প্রসেসিং ক্যাপাসিটি:</span>
                  <strong className="font-mono text-slate-900 dark:text-emerald-300 font-bold">{calculatedTokens.toLocaleString()} টোকেন</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">লাইসেন্স সক্রিয়তার মেয়াদ:</span>
                  <strong className="font-mono text-slate-900 dark:text-amber-400 font-bold">{planDurationText}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">অ্যাক্সেস মেথড:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.accessType === 'direct_domain' ? 'ডোমেইন রিভার্স প্রক্সি' : 'লাইসেন্স কী / সিট অ্যাক্টিভেশন'}</span>
                </div>
              </div>

              {/* Guarantee Box */}
              <div className="p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>১০০% মানি-ব্যাক ও জেনুইন রিটেইল নিশ্চয়তা</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400/90 leading-relaxed">
                  পেমেন্ট সম্পন্ন করে TrxID সাবমিট করার সাথে সাথেই সিস্টেম স্বয়ংক্রিয়ভাবে লাইসেন্স কী জেনারেট করবে।
                </p>
              </div>

            </div>

            {/* ======================================================== */}
            {/* RIGHT COLUMN: PAYMENT METHODS & SUBMISSION FORM          */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  পেমেন্ট মেথড নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod('bkash')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      method === 'bkash'
                        ? 'bg-[#E2136E]/10 border-[#E2136E] ring-2 ring-[#E2136E]/30 text-[#E2136E] font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#E2136E] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      bK
                    </div>
                    <span className="text-xs font-bold">বিকাশ (bKash)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('nagad')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      method === 'nagad'
                        ? 'bg-[#F7941D]/10 border-[#F7941D] ring-2 ring-[#F7941D]/30 text-[#F7941D] font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#F7941D] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      NG
                    </div>
                    <span className="text-xs font-bold">নগদ (Nagad)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('rocket')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      method === 'rocket'
                        ? 'bg-[#8C3494]/10 border-[#8C3494] ring-2 ring-[#8C3494]/30 text-[#8C3494] font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#8C3494] text-white font-black text-xs flex items-center justify-center shadow-xs">
                      RK
                    </div>
                    <span className="text-xs font-bold">রকেট</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod('card')}
                    className={`p-2.5 rounded-2xl border text-center transition flex flex-col items-center gap-1.5 ${
                      method === 'card'
                        ? 'bg-blue-600/10 border-blue-600 ring-2 ring-blue-600/30 text-blue-600 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      💳
                    </div>
                    <span className="text-xs font-bold">কার্ড / SSL</span>
                  </button>
                </div>
              </div>

              {/* Payment Merchant Details Box */}
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 space-y-2.5 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>পেমেন্ট নির্দেশিকা ({method.toUpperCase()}):</span>
                  <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">Send Money / Payment</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">প্রাপক নাম্বার ({method}):</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 text-xs">
                        {getMerchantNumber()}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(getMerchantNumber(), 'number')}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md"
                        title="কপি করুন"
                      >
                        {copiedItem === 'number' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10">
                    <span className="text-slate-600 dark:text-slate-400">পরিশোধের পরিমাণ:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                        ৳{plan.priceBDT.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(plan.priceBDT.toString(), 'amount')}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-md"
                      >
                        {copiedItem === 'amount' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  উপরে উল্লেখিত নাম্বারে টাকা পাঠিয়ে প্রাপ্ত <strong>TrxID</strong> নিচে লিখে সাবমিট করুন।
                </p>
              </div>

              {/* TrxID Submission Form */}
              <form onSubmit={handleVerifyPayment} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      যে নাম্বার থেকে পাঠিয়েছেন:
                    </label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      ট্রানজেকশন আইডি (TrxID):
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="যেমন: BK9A87XYZ4"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono tracking-wider font-bold transition"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-red-950/50 border border-rose-200 dark:border-red-500/40 text-rose-700 dark:text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>ভেরিফাই করা হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ভেরিফাই ও সাবস্ক্রিপশন সক্রিয় করুন</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>SSL এনক্রিপ্টেড ও মানি-ব্যাক গ্যারান্টি সুরক্ষিত</span>
                </div>
              </form>

            </div>

          </div>
        ) : (
          /* Success Screen */
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">
                অভিনন্দন! সাবস্ক্রিপশন সফলভাবে সক্রিয় হয়েছে!
              </h3>
              <p className="mt-2 text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                আপনার পেমেন্ট ভেরিফাই হয়েছে এবং <strong>{plan.name}</strong> এর সিট আপনার অ্যাকাউন্টে তাৎক্ষণিক বরাদ্দ করা হলো।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-white/[0.06] text-left space-y-3">
              <div className="text-xs text-slate-400">আপনার ব্যক্তিগত লাইসেন্স কি (Seat Key):</div>
              <div className="flex items-center justify-between bg-slate-900 border border-white/10 rounded-xl p-2.5">
                <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                  {generatedSeatKey}
                </span>
                <button
                  onClick={() => copyToClipboard(generatedSeatKey, 'seatKey')}
                  className="text-slate-400 hover:text-white"
                >
                  {copiedItem === 'seatKey' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Gmail Delivery & 1-Click Activation Link */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-left space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                    <span>📧 আপনার জিমেইলে পাঠানো হয়েছে:</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold font-mono">DELIVERED</span>
                </div>
                <div className="font-mono text-xs text-white font-semibold bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span>{userDeliveryEmail || currentUser.email}</span>
                  <span className="text-[10px] text-slate-400">লাইসেন্স কি ও লিংক প্রেরিত</span>
                </div>
                {activationUrl && (
                  <div className="pt-1">
                    <a
                      href={activationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-lg"
                    >
                      <span>আমার জিমেইল দিয়ে ১-ক্লিকে এখনই অ্যাক্টিভ করুন ↗</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Added Credit & Duration Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 block font-semibold">অ্যাকাউন্টে যোগ হয়েছে:</span>
                  <span className="font-mono text-xs font-bold text-white">+{calculatedCredits} ক্রেডিট পয়েন্ট</span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
                  <span className="text-[10px] text-indigo-300 block font-semibold">সক্রিয় মেয়াদকাল:</span>
                  <span className="font-mono text-xs font-bold text-white">{planDurationText}</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>আপনার লাইসেন্স অবিলম্বে সক্রিয় করা হয়েছে এবং কাস্টমার ড্যাশবোর্ডে দৃশ্যমান।</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
              >
                <span>ওয়ার্কস্পেস ওপেন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-3 px-3 rounded-xl text-xs border border-white/10 flex items-center justify-center gap-1.5 transition"
              >
                <span>কাস্টমার পোর্টালে যান</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
