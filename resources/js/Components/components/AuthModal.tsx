import React, { useState } from 'react';
import {
  X,
  User,
  Lock,
  Phone,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { CustomerUser, SentEmailItem } from '../types';
import {
  loginCustomer,
  registerCustomer,
  requestPasswordReset,
  verifyAndResetPassword
} from '../utils/customerAuth';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: CustomerUser) => void;
  onShowEmail?: (email: SentEmailItem) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  onShowEmail,
  initialMode = 'login',
}) => {
  const { settings } = useStoreSettings();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setAuthMode(initialMode);
  }, [initialMode, isOpen]);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot password flow
  const [forgotStep, setForgotStep] = useState<'request_otp' | 'verify_otp'>('request_otp');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Status & Error messages
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(false);
    setForgotStep('request_otp');
    setResetOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleSwitchMode = (mode: 'login' | 'register' | 'forgot') => {
    setAuthMode(mode);
    resetFormState();
  };

  // 1. Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginCustomer(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg(res.message);
        if (onAuthSuccess) onAuthSuccess(res.user);
        setTimeout(() => {
          onClose();
          resetFormState();
        }, 800);
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  // 2. Handle Register with Gmail
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মেলেনি!');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('অনুগ্রহ করে শর্তাবলীর সাথে সম্মতি প্রদান করুন।');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerCustomer(name, email, phone, password);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg(res.message);
        if (onAuthSuccess) onAuthSuccess(res.user);
        if (res.sentEmail && onShowEmail) {
          onShowEmail(res.sentEmail);
        }
        setTimeout(() => {
          onClose();
          resetFormState();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  // 3. Handle Forgot Password: Step 1 (Request OTP via Gmail)
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = requestPasswordReset(email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setForgotStep('verify_otp');
        if (res.sentEmail && onShowEmail) {
          onShowEmail(res.sentEmail);
        }
      } else {
        setErrorMsg(res.message);
      }
    }, 400);
  };

  // 4. Handle Forgot Password: Step 2 (Verify OTP & Reset)
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড একই হতে হবে!');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = verifyAndResetPassword(email, resetOtp, newPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        setSuccessMsg(res.message);
        if (onAuthSuccess) onAuthSuccess(res.user);
        if (res.sentEmail && onShowEmail) {
          onShowEmail(res.sentEmail);
        }
        setTimeout(() => {
          onClose();
          resetFormState();
        }, 1200);
      } else {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  // Quick Demo Login Helper
  const handleDemoLogin = () => {
    setEmail('sakib@gmail.com');
    setPassword('123456');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Top Header Strip with Brand Logo */}
        <div className="bg-[#990000] text-white p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="bg-white rounded-lg p-1 shadow-xs border border-white/20">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
              ) : (
                <span className="text-xs font-black text-[#990000]">SP</span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {authMode === 'login'
                  ? 'কাস্টমার লগইন পোর্টাল'
                  : authMode === 'register'
                  ? 'নতুন অ্যাকাউন্ট রেজিস্ট্রেশন'
                  : 'পাসওয়ার্ড পুনরুদ্ধার (Gmail)'}
              </h3>
              <p className="text-[11px] text-red-100">{settings.siteName} - বিশ্বস্ত অনলাইন সেবা</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              resetFormState();
            }}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Login / Register) */}
        {authMode !== 'forgot' && (
          <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`py-2.5 text-center transition-all cursor-pointer ${
                authMode === 'login'
                  ? 'bg-white text-[#990000] border-b-2 border-[#990000] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              লগইন করুন
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`py-2.5 text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-white text-[#990000] border-b-2 border-[#990000] shadow-2xs font-extrabold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>নতুন রেজিস্ট্রেশন</span>
            </button>
          </div>
        )}

        <div className="p-5 space-y-4">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ========================================================= */}
          {/* 1. LOGIN FORM                                             */}
          {/* ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              {/* Gmail / Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জিমেইল / ইমেইল অ্যাড্রেস <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার জিমেইল (যেমন: sakib@gmail.com)"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('forgot')}
                    className="text-[11px] text-[#990000] font-semibold hover:underline cursor-pointer"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                    className="w-full text-xs pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>যাচাই করা হচ্ছে...</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Demo Quick Login Pill */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>টেস্ট করতে চান?</span>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="text-xs text-[#990000] font-bold hover:underline flex items-center gap-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded border border-red-200"
                >
                  <Zap className="w-3 h-3 text-amber-500" />
                  <span>ডেমো জিমেইল বসান</span>
                </button>
              </div>

              {/* Bottom Switch Link */}
              <div className="text-center pt-1 text-xs text-slate-600">
                অ্যাকাউন্ট নেই?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('register')}
                  className="text-[#990000] font-bold hover:underline cursor-pointer"
                >
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 2. REGISTRATION FORM (Gmail Based)                         */}
          {/* ========================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  আপনার পুরো নাম <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: মোঃ সাকিব হোসেন"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                  />
                </div>
              </div>

              {/* Gmail Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  জিমেইল / ইমেইল <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  ✓ অ্যাকাউন্ট কনফার্মেশন ও অর্ডার ট্র্যাকিং এই জিমেইলে যাবে।
                </p>
              </div>

              {/* Mobile Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  মোবাইল নাম্বার (১১ ডিজিট) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000] focus:border-[#990000] font-mono"
                  />
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="w-full text-xs pl-8 pr-2 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    কনফার্ম পাসওয়ার্ড <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড পুনরাবৃত্তি"
                      className="w-full text-xs pl-8 pr-2 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                    />
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#990000] rounded mt-0.5 border-slate-300 focus:ring-[#990000]"
                />
                <span>
                  আমি সাইটের <strong className="text-slate-800">শর্তাবলী</strong> এবং <strong className="text-slate-800">প্রাইভেসি পলিসি</strong> মেনে নিয়ে একমত পোষণ করছি।
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>অ্যাকাউন্ট তৈরি করুন (রেজিস্ট্রেশন)</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1 text-xs text-slate-600">
                পূর্বে অ্যাকাউন্ট রয়েছে?{' '}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('login')}
                  className="text-[#990000] font-bold hover:underline cursor-pointer"
                >
                  লগইন করুন
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* 3. FORGOT PASSWORD (Gmail OTP Based)                      */}
          {/* ========================================================= */}
          {authMode === 'forgot' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <KeyRound className="w-4 h-4 text-[#990000]" />
                <h4 className="text-xs font-bold text-slate-800">
                  {forgotStep === 'request_otp'
                    ? '১. জিমেইলে ওটিপি কোড পাঠান'
                    : '২. ওটিপি যাচাই ও নতুন পাসওয়ার্ড সেট করুন'}
                </h4>
              </div>

              {forgotStep === 'request_otp' ? (
                <form onSubmit={handleRequestOtp} className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    আপনার অ্যাকাউন্টের সাথে নিবন্ধিত জিমেইল অ্যাড্রেসটি লিখুন। আমরা সাথে সাথে একটি ৬ সংখ্যার ভেরিফিকেশন কোড পাঠাবো।
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      নিবন্ধিত জিমেইল অ্যাড্রেস <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="আপনার জিমেইল (যেমন: sakib@gmail.com)"
                        className="w-full text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? <span>কোড পাঠানো হচ্ছে...</span> : <span>ভেরিফিকেশন কোড পাঠান</span>}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      ← লগইনে ফিরে যান
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-[11px] text-amber-800">
                    <span className="font-bold">{email}</span> জিমেইলে আসা ৬ সংখ্যার ওটিপি কোডটি নিচে দিন।
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ৬ সংখ্যার ভেরিফিকেশন কোড (OTP) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="যেমন: 482910"
                      className="w-full text-center text-lg font-mono font-bold tracking-widest py-2 border-2 border-slate-300 focus:border-[#990000] rounded-lg text-slate-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      কনফার্ম নতুন পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="পাসওয়ার্ড পুনরাবৃত্তি করুন"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-[#990000]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 rounded-lg bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                  >
                    {isLoading ? <span>যাচাই হচ্ছে...</span> : <span>পাসওয়ার্ড পরিবর্তন ও লগইন করুন</span>}
                  </button>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setForgotStep('request_otp')}
                      className="text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      ← অন্য জিমেইল দিন
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('login')}
                      className="text-[#990000] font-bold hover:underline cursor-pointer"
                    >
                      লগইনে ফিরে যান
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
