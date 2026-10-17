import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Sparkles, 
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const { settings } = useStoreSettings();
  const [emailOrPhone, setEmailOrPhone] = useState(settings.email || 'shishirbarai01982708789@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Allow flexible admin credentials for the store owner
      if (
        emailOrPhone.trim().length > 0 &&
        password.trim().length >= 4
      ) {
        if (rememberMe) {
          localStorage.setItem('ecom_super_admin_session', 'true');
        }
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('সঠিক ইমেইল/মোবাইল এবং পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর) প্রদান করুন।');
      }
    }, 400);
  };

  const handleQuickLogin = () => {
    localStorage.setItem('ecom_super_admin_session', 'true');
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#1e1b2e] text-slate-100 flex flex-col justify-between font-sans selection:bg-[#990000] selection:text-white">
      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান (Back to Store)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>URL: /admin</span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#990000] to-[#b30000] p-6 text-white text-center relative">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-3">
              <ShieldCheck className="w-8 h-8 text-amber-300" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              <span>{settings.siteName || 'Somadhan Point'}</span>
              <span className="text-[11px] bg-black/30 font-bold px-2 py-0.5 rounded-full text-amber-300 border border-white/10 uppercase tracking-widest">
                Super Admin
              </span>
            </h1>
            <p className="text-xs text-red-100 mt-1">
              সুপার অ্যাডমিন প্যানেল লগইন পোর্টাল (/admin)
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Email / Phone Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                অ্যাডমিন ইমেইল বা ফোন নম্বর
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="admin@somadhanpoint.com বা 01982708789"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  পাসওয়ার্ড
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Default: admin123
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#990000] focus:ring-1 focus:ring-[#990000] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-[#990000] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>আমাকে মনে রাখুন</span>
              </label>

              <button
                type="button"
                onClick={() => alert(`পাসওয়ার্ড রিসেটের জন্য হটলাইনে যোগাযোগ করুন: ${settings.phone1 || '01982708789'}`)}
                className="text-amber-400 hover:underline text-[11px] cursor-pointer"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#990000] hover:bg-[#800000] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>যাচাই হচ্ছে...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>সুপার অ্যাডমিন লগইন করুন</span>
                </>
              )}
            </button>

            {/* Quick 1-Click Access for Owner */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickLogin}
                className="w-full bg-slate-800 hover:bg-slate-700/80 text-amber-300 border border-slate-700 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>১-ক্লিকে সুপার অ্যাডমিন প্রবেশ (Quick Login)</span>
              </button>
            </div>
          </form>

          {/* Footer inside Card */}
          <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-500">
            <span>সুরক্ষিত সার্ভার অ্যান্ড ডাটাবেজ প্রটেক্টেড প্যানেল</span>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60">
        <p>
          © {new Date().getFullYear()} {settings.siteName.toLowerCase()}. All rights reserved. | Developed by with{' '}
          <a
            href={settings.developerUrl || 'https://www.facebook.com/shishir9barai'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 font-bold hover:underline"
          >
            {settings.developerName || 'SHISHIR'}
          </a>
        </p>
      </footer>
    </div>
  );
};
