import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Sparkles, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Mail, Bot, Cpu, Zap, Lock } from 'lucide-react';

interface ActivateLinkProps {
  isValid: boolean;
  error?: string;
  token?: string;
  serviceType?: string;
  serviceName?: string;
  validityDays?: number;
  planId?: string;
  usedByEmail?: string;
  usedAt?: string;
  message?: string;
  appName?: string;
  supportEmail?: string;
}

export default function ActivateLink({
  isValid,
  error,
  token,
  serviceType = 'gemini',
  serviceName = 'Google Gemini Advanced',
  validityDays = 30,
  planId,
  usedByEmail,
  usedAt,
  message,
  appName = 'OmniCraft AI',
  supportEmail = 'support@omnicraft.ai',
}: ActivateLinkProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const getServiceIcon = () => {
    switch (serviceType) {
      case 'gemini':
        return <Cpu className="w-8 h-8 text-blue-400" />;
      case 'chatgpt':
        return <Sparkles className="w-8 h-8 text-emerald-400" />;
      case 'claude':
        return <Bot className="w-8 h-8 text-amber-400" />;
      case 'grok':
        return <Zap className="w-8 h-8 text-purple-400" />;
      default:
        return <Sparkles className="w-8 h-8 text-indigo-400" />;
    }
  };

  const getServiceColor = () => {
    switch (serviceType) {
      case 'gemini':
        return 'from-blue-600 via-indigo-600 to-cyan-500';
      case 'chatgpt':
        return 'from-emerald-600 via-teal-600 to-green-500';
      case 'claude':
        return 'from-amber-600 via-orange-600 to-yellow-500';
      case 'grok':
        return 'from-purple-600 via-pink-600 to-indigo-500';
      default:
        return 'from-indigo-600 via-blue-600 to-violet-500';
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('অনুগ্রহ করে সঠিক জিমেইল অ্যাড্রেস প্রদান করুন।');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/activate/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || 'অ্যাক্টিভেশনে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
        setLoading(false);
        return;
      }

      setSuccessData(data);
      // Automatically redirect to workspace after 2 seconds
      setTimeout(() => {
        window.location.href = data.redirect || '/workspace';
      }, 2000);
    } catch (err: any) {
      setErrorMessage('সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি। আবার চেষ্টা করুন।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <Head title={`এক্টিভেশন - ${serviceName} | ${appName}`} />

      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.08] bg-[#070A14]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-lg text-white tracking-tight">{appName}</span>
            <span className="text-xs text-indigo-400 block font-medium">One-Time AI Activation Portal</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>১০০% অফিসিয়াল সিট অ্যাক্টিভেশন</span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full">

          {/* STATE 1: ALREADY USED OR INVALID */}
          {!isValid && (
            <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {error === 'already_used' ? 'লিংকটি ইতিমধ্যে ব্যবহৃত হয়ে গেছে!' : 'ইনভ্যালিড অ্যাক্টিভেশন লিংক'}
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                  {message || 'এই অ্যাক্টিভেশন লিংকটি আর ব্যবহারযোগ্য নয়।'}
                </p>
              </div>

              {usedByEmail && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="text-slate-400 text-[11px]">যে জিমেইলে এক্টিভ করা হয়েছে:</div>
                  <div className="font-mono font-bold text-indigo-400 text-sm">{usedByEmail}</div>
                  {usedAt && <div className="text-[10px] text-slate-500">সময়: {usedAt}</div>}
                </div>
              )}

              <div className="pt-2">
                <a
                  href="/store"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition"
                >
                  <span>স্টোরে ফিরে যান</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* STATE 2: SUCCESS ACTIVATED */}
          {isValid && successData && (
            <div className="bg-[#0B0F19] border border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-1">অ্যাক্টিভেশন সম্পন্ন হয়েছে! 🎉</h2>
                <p className="text-xs text-slate-400">
                  আপনার <span className="text-white font-semibold">{email}</span> জিমেইল অ্যাকাউন্টে প্রিমিয়াম সিট সংযুক্ত করা হয়েছে।
                </p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-xs text-emerald-300 space-y-1">
                <div>সিট কি: <span className="font-mono font-bold text-white">{successData.user?.seat_key}</span></div>
                <div>মেয়াদ: <span className="font-bold text-white">{validityDays} দিন ({successData.user?.expiry})</span> পর্যন্ত</div>
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-center gap-2 text-xs text-indigo-400 animate-pulse">
                  <span>আপনাকে আপনার AI ওয়ার্কস্পেসে নিয়ে যাওয়া হচ্ছে...</span>
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: READY TO ACTIVATE WITH GMAIL */}
          {isValid && !successData && (
            <div className="bg-[#0B0F19] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {/* Service Header Badge */}
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
                  {getServiceIcon()}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mb-2">
                    <Lock className="w-3 h-3" />
                    <span>ওয়ান-টাইম ইউনিক ইনভাইট লিংক</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {serviceName}
                  </h1>
                  <p className="text-xs text-slate-400">
                    মেয়াদকাল: <span className="text-indigo-400 font-bold">{validityDays} দিন আনলিমিটেড অ্যাক্সেস</span>
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleActivate} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>আপনার জিমেইল (Gmail) অ্যাড্রেস:</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">
                    * এই জিমেইল দিয়েই আপনার সিট লক হবে এবং লিংকটি একবারই কাজ করবে।
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    আপনার নাম (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full bg-[#050814] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-lg transition transform active:scale-95 bg-gradient-to-r ${getServiceColor()} hover:opacity-95 disabled:opacity-50`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>আমার জিমেইল দিয়ে এখনই প্রিমিয়াম অ্যাক্টিভ করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Guarantees */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>তাত্ক্ষণিক ডেলিভারি</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-blue-400" />
                  <span>১ জিমেইলে সুরক্ষিত সিট</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-4 px-6 text-center text-xs text-slate-500">
        © 2026 {appName}. All Rights Reserved. প্রয়োজনে সহায়তা পেতে যোগাযোগ করুন: {supportEmail}
      </footer>
    </div>
  );
}
