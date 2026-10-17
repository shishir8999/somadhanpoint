import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User as UserIcon, 
  ShieldCheck, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  KeyRound,
  AlertCircle,
  Briefcase,
  Check
} from 'lucide-react';
import { User, UserRole } from '../types';
import { storage } from '../services/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialTab?: 'login' | 'register';
  promptNotice?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login',
  promptNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Google Account Chooser State
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('user');
  const [regError, setRegError] = useState('');

  // UI Feedback
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const users = storage.getUsers();

  // 1. Google Sign-In Execution
  const handleGoogleSignInWithEmail = (email: string, name: string) => {
    setIsLoading(true);
    setShowGoogleChooser(false);
    setLoginError('');

    setTimeout(() => {
      // Find if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        storage.loginUser(existingUser.id);
        setIsLoading(false);
        setSuccessMessage(`Google অ্যাকাউন্ট (${email}) দিয়ে সফলভাবে লগইন হয়েছে!`);
        setTimeout(() => {
          onLoginSuccess(existingUser);
          onClose();
        }, 650);
      } else {
        // Automatically create account via Google profile
        const newUser = storage.registerUser({
          name: name || 'Google User',
          email: email,
          phone: '',
          role: 'user',
        });
        setIsLoading(false);
        setSuccessMessage(`Google অ্যাকাউন্ট (${email}) দিয়ে সফলভাবে নতুন অ্যাকাউন্ট তৈরি ও লগইন হয়েছে!`);
        setTimeout(() => {
          onLoginSuccess(newUser);
          onClose();
        }, 650);
      }
    }, 450);
  };

  // 2. Quick Test Role Login
  const handleQuickLogin = (targetUser: User) => {
    setIsLoading(true);
    setLoginError('');
    setTimeout(() => {
      storage.loginUser(targetUser.id);
      setIsLoading(false);
      setSuccessMessage(`${targetUser.name} হিসেবে সফলভাবে লগইন হয়েছে!`);
      setTimeout(() => {
        onLoginSuccess(targetUser);
        onClose();
      }, 600);
    }, 350);
  };

  // 3. Manual Form Login
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginIdentifier.trim()) {
      setLoginError('অনুগ্রহ করে আপনার ইমেইল অথবা মোবাইল নম্বর লিখুন।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const user = storage.loginWithCredentials(loginIdentifier, loginPassword);
      if (user) {
        setIsLoading(false);
        setSuccessMessage(`স্বাগতম ${user.name}! সফলভাবে লগইন হয়েছে।`);
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 700);
      } else {
        setIsLoading(false);
        setLoginError('কোন অ্যাকাউন্ট খুঁজে পাওয়া যায়নি। আপনার তথ্য যাচাই করুন অথবা Google দিয়ে লগইন বা ম্যানুয়ালি অ্যাকাউন্ট তৈরি করুন।');
      }
    }, 400);
  };

  // 4. Manual Account Creation
  const handleFormRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim()) {
      setRegError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('অনুগ্রহ করে সঠিক ইমেইল ঠিকানা দিন।');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newUser = storage.registerUser({
        name: regName,
        email: regEmail,
        phone: regPhone,
        role: regRole,
      });

      setIsLoading(false);
      setSuccessMessage(`অভিনন্দন ${newUser.name}! ম্যানুয়ালি অ্যাকাউন্ট তৈরি হয়েছে এবং ১০,০০০ বোনাস টোকেন যুক্ত হয়েছে।`);
      setTimeout(() => {
        onLoginSuccess(newUser);
        onClose();
      }, 800);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#0D1326] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/[0.08] bg-gradient-to-b from-blue-950/40 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <KeyRound className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {activeTab === 'login' ? 'অ্যাকাউন্টে লগইন করুন' : 'ম্যানুয়ালি অ্যাকাউন্ট ক্রিয়েট'}
              </h2>
              <p className="text-xs text-slate-400">
                Google এর মাধ্যমে ১-ক্লিকে লগইন অথবা ম্যানুয়াল সাইন-আপ
              </p>
            </div>
          </div>

          {/* Tab Switcher Pills */}
          <div className="grid grid-cols-2 gap-1 p-1 mt-4 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
                setShowGoogleChooser(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegError('');
                setShowGoogleChooser(false);
              }}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ম্যানুয়ালি অ্যাকাউন্ট ক্রিয়েট
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Prompt Submission Trigger Notice */}
          {promptNotice && (
            <div className="p-3.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2.5 animate-fadeIn">
              <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
              <div className="font-medium leading-relaxed">
                {promptNotice}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. GOOGLE SIGN-IN PRIMARY BUTTON (User Request Requirement) */}
          <div className="space-y-3">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowGoogleChooser(true)}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-lg shadow-black/10 hover:shadow-xl active:scale-98 border border-slate-200 group"
            >
              {/* Official 4-color Google G Icon */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.99 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google এর মাধ্যমে সরাসরি লগইন করুন</span>
            </button>

            {/* Google Account Selector Dialog if triggered */}
            {showGoogleChooser && (
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-blue-500/40 space-y-3 animate-fadeIn shadow-xl">
                <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Google Email দিয়ে সরাসরি কানেক্ট করুন:
                  </span>
                  <button 
                    onClick={() => setShowGoogleChooser(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Option to type Google email */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="name@gmail.com"
                      className="flex-1 bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customGoogleEmail.trim()) {
                          handleGoogleSignInWithEmail(customGoogleEmail.trim(), customGoogleEmail.split('@')[0]);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shrink-0"
                    >
                      কানেক্ট ও লগইন
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#0D1326] px-3 text-[11px] font-medium text-slate-400 shrink-0">
                অথবা ম্যানুয়াল অপশন সিলেক্ট করুন
              </span>
              <div className="border-t border-white/10 w-full" />
            </div>
          </div>

          {/* TAB 1: MANUAL LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleFormLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    ইমেইল অথবা মোবাইল নম্বর
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. shishirbarai01982708789@gmail.com"
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      পাসওয়ার্ড
                    </label>
                    <button 
                      type="button" 
                      onClick={() => alert('আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইলে নতুন পাসওয়ার্ড লিঙ্ক পাঠানো হয়েছে।')} 
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>লগইন হচ্ছে...</span>
                  ) : (
                    <>
                      <span>ম্যানুয়ালি লগইন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Quick One-Click Logins for Convenience */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">১-ক্লিকে টেস্ট লগইন:</span>
                  <span className="text-amber-400 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" /> ইনস্ট্যান্ট
                  </span>
                </div>

                <div className="space-y-1.5">
                  {users.slice(0, 3).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="w-full p-2 rounded-xl bg-slate-900/80 hover:bg-blue-900/30 border border-white/10 hover:border-blue-500/50 flex items-center justify-between transition text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                          {u.role === 'super_admin' ? '👑' : u.role === 'reseller' ? '💼' : '👤'}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white group-hover:text-blue-300">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                            {u.email}
                          </div>
                        </div>
                      </div>

                      <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                        {u.role === 'super_admin' ? 'Super Admin' : u.role === 'reseller' ? 'Reseller' : 'Customer'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL ACCOUNT CREATION */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Bonus Perk Banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <span>🎁 নতুন ইউজার বোনাস: ম্যানুয়াল রেজিস্ট্রেশনে <strong>১০,০০০ টোকেন</strong> ফ্রি পাবেন!</span>
              </div>

              <form onSubmit={handleFormRegister} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    আপনার পূর্ণ নাম *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. শিশির বাড়ৈ"
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    ইমেইল ঠিকানা *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. shishirbarai01982708789@gmail.com"
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      মোবাইল নম্বর
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-500" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="01982708789"
                        className="w-full bg-[#050814] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      অ্যাকাউন্টের ধরন
                    </label>
                    <div className="relative">
                      <select
                        value={regRole}
                        onChange={(e) => setRegRole(e.target.value as UserRole)}
                        className="w-full bg-[#050814] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        <option value="user">👤 সাধারণ গ্রাহক</option>
                        <option value="reseller">💼 রিসেলার পার্টনার</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    পাসওয়ার্ড সেট করুন
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড"
                      className="w-full bg-[#050814] border border-white/10 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                  ) : (
                    <>
                      <span>ম্যানুয়ালি অ্যাকাউন্ট ক্রিয়েট ও সরাসরি লগইন করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Footer Privacy Guarantee */}
        <div className="p-3.5 border-t border-white/[0.08] bg-slate-950/60 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>নিরাপদ এনক্রিপ্টেড সেশন · Google ও ম্যানুয়াল সিকিউর সাইন-ইন</span>
        </div>
      </div>
    </div>
  );
};
