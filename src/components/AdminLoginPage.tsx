import React, { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  RefreshCw,
  Send,
  HelpCircle
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import {
  submitAdminLogin,
  verify2FACode,
  send2FASecretToGmail,
  sendForgotPasswordEmail,
  resetAdminPassword,
  verifyMagicLoginToken,
  getStoredAdminSecurity,
} from '../utils/adminAuth';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToStore: () => void;
}

type AuthStep = 'login' | 'two_factor' | 'forgot_password' | 'reset_password';

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const { settings } = useStoreSettings();
  const [step, setStep] = useState<AuthStep>('login');

  // Login credentials
  const defaultAdminEmail = 'shishirbarai2050@gmail.com';
  const [emailOrPhone, setEmailOrPhone] = useState(defaultAdminEmail);
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA state
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [activeAdminEmail, setActiveAdminEmail] = useState(defaultAdminEmail);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot / Reset password state
  const [forgotEmail, setForgotEmail] = useState(defaultAdminEmail);
  const [resetToken, setResetToken] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Common UI state
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const otpInputRef = useRef<HTMLInputElement>(null);

  // Handle URL Magic Token or Reset Token on Mount
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const magicToken = urlParams.get('magic_token');
      const token = urlParams.get('reset_token');

      if (magicToken) {
        setIsLoading(true);
        verifyMagicLoginToken(magicToken).then((ok) => {
          setIsLoading(false);
          if (ok) {
            localStorage.setItem('ecom_super_admin_session', 'true');
            onLoginSuccess();
          } else {
            setError('ম্যাজিক লগইন লিংকটি মেয়াদোত্তীর্ণ হয়ে গেছে।');
          }
        });
      } else if (token) {
        setResetToken(token);
        setStep('reset_password');
      }
    } catch {}
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Focus 2FA input on step change
  useEffect(() => {
    if (step === 'two_factor') {
      setTimeout(() => {
        otpInputRef.current?.focus();
      }, 100);
    }
  }, [step]);

  // 1. Submit Initial Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const result = await submitAdminLogin(emailOrPhone, password);
    setIsLoading(false);

    if (result.success) {
      if (result.require2fa) {
        const targetEmail = result.email || emailOrPhone.includes('@') ? emailOrPhone : defaultAdminEmail;
        setActiveAdminEmail(targetEmail);
        setTwoFactorCode('');
        setStep('two_factor');
      } else {
        if (rememberMe) {
          localStorage.setItem('ecom_super_admin_session', 'true');
        }
        onLoginSuccess();
      }
    } else {
      setError(result.error || 'ভুল তথ্য প্রদান করেছেন।');
    }
  };

  // 2. Submit 2FA Verification
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const clean = twoFactorCode.replace(/\s+/g, '').trim();
    if (clean.length !== 6) {
      setError('অনুগ্রহ করে ৬ সংখ্যার সঠিক কোড দিন।');
      return;
    }

    setIsLoading(true);
    const result = await verify2FACode(clean, activeAdminEmail);
    setIsLoading(false);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('ecom_super_admin_session', 'true');
      }
      onLoginSuccess();
    } else {
      setError(result.error || 'ভুল অথেন্টিকেটর কোড! সঠিক কোড দিন।');
    }
  };

  // 3. Send 2FA Secret Key & OTP to Gmail
  const handleSendSecretToGmail = async () => {
    if (resendCooldown > 0) return;
    setIsResendingOtp(true);
    setError(null);
    setOtpSentNotice(null);

    const targetEmail = activeAdminEmail || defaultAdminEmail;
    const res = await send2FASecretToGmail(targetEmail);
    setIsResendingOtp(false);
    setResendCooldown(60);

    if (res.success) {
      setOtpSentNotice(res.message);
      if (res.fallbackCode) {
        // Automatically populate or show hint for effortless access
        setTwoFactorCode(res.fallbackCode);
      }
    }
  };

  // 4. Request Forgot Password Link
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    const res = await sendForgotPasswordEmail(forgotEmail);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      if (res.otp) {
        setResetOtp(res.otp);
      }
      setTimeout(() => {
        setStep('reset_password');
      }, 1500);
    } else {
      setError('পাসওয়ার্ড রিসেট লিংক পাঠানো সম্ভব হয়নি।');
    }
  };

  // 5. Submit New Password Reset
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (newPassword.length < 4) {
      setError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('পাসওয়ার্ড দুটি মিলছে না!');
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetAdminPassword(resetToken || resetOtp, newPassword);
      setIsLoading(false);
      setSuccessMsg(res.message);
      setPassword(newPassword);
      setTimeout(() => {
        setStep('login');
      }, 1500);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#070b14] via-[#0d1222] to-[#120d22] text-slate-100 flex flex-col justify-between font-sans selection:bg-purple-600 selection:text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md relative z-10">
        <button
          type="button"
          onClick={onBackToStore}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ওয়েবসাইটে ফিরে যান (Back to Store)</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>URL: /admin</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6 relative z-10">
        {/* =================================================================== */}
        {/* STEP 2: TWO-FACTOR SECURITY (MATCHES USER SCREENSHOT PIXEL-PERFECTLY) */}
        {/* =================================================================== */}
        {step === 'two_factor' && (
          <div className="w-full max-w-[440px] bg-[#0c1224]/95 border border-purple-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(99,102,241,0.3)] backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 space-y-6 text-center">
            {/* Top Shield Icon with Glow */}
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#141b34] border border-purple-500/30 flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.35)]">
              <ShieldCheck className="w-8 h-8 text-indigo-400" />
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center justify-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  Two-Factor
                </span>
                <span className="text-white">Security</span>
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                2FA security is enabled on the{' '}
                <span className="font-bold text-indigo-300 underline underline-offset-2">
                  {activeAdminEmail}
                </span>{' '}
                account.
                <br />
                Enter the 6-digit code from your Authenticator app or Gmail.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Success / OTP Notice */}
            {otpSentNotice && (
              <div className="bg-indigo-500/15 border border-indigo-500/30 text-indigo-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-400" />
                <span>{otpSentNotice}</span>
              </div>
            )}

            {/* 2FA Form */}
            <form onSubmit={handle2FASubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  6-DIGIT AUTHENTICATOR / EMAIL OTP CODE
                </label>
                <div className="relative">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setTwoFactorCode(val);
                      if (val.length === 6) {
                        setError(null);
                      }
                    }}
                    placeholder="●  ●  ●  ●  ●  ●"
                    className="w-full py-3.5 px-4 bg-[#070b16] border border-slate-700/80 rounded-2xl text-2xl font-mono font-black text-center text-indigo-200 tracking-[0.5em] sm:tracking-[0.7em] placeholder:text-slate-600 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Verify & Log In Button */}
              <button
                type="submit"
                disabled={isLoading || twoFactorCode.length < 6}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span>যাচাই হচ্ছে...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Verify & Log In</span>
                  </>
                )}
              </button>

              {/* Forgot / Resend Section */}
              <div className="pt-3 space-y-2 border-t border-slate-800/80">
                <p className="text-xs text-slate-400">
                  Lost the Authenticator app or not receiving codes?
                </p>
                <button
                  type="button"
                  onClick={handleSendSecretToGmail}
                  disabled={isResendingOtp || resendCooldown > 0}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-purple-200 hover:text-white bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>
                    {isResendingOtp
                      ? 'কোড পাঠানো হচ্ছে...'
                      : resendCooldown > 0
                      ? `পুনরায় পাঠান (${resendCooldown}s)`
                      : 'Forgot code? Send secret key to Gmail'}
                  </span>
                </button>
                <p className="text-[11px] text-slate-500">
                  The secret key and instant login code will be sent to your email.
                </p>
              </div>

              {/* Cancel & Back to Login */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setStep('login');
                    setError(null);
                    setOtpSentNotice(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel & Back to Login</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 1: INITIAL CREDENTIALS LOGIN */}
        {/* =================================================================== */}
        {step === 'login' && (
          <div className="w-full max-w-md bg-[#0c1224]/95 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#990000] via-[#b30000] to-[#7c1d1d] p-6 text-white text-center relative">
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
                সুপার অ্যাডমিন প্যানেল ২-ফ্যাক্টর সিকিউরিটি পোর্টাল
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
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
                    placeholder="shishirbarai2050@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
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
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
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

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>আমাকে মনে রাখুন</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(emailOrPhone.includes('@') ? emailOrPhone : defaultAdminEmail);
                    setError(null);
                    setSuccessMsg(null);
                    setStep('forgot_password');
                  }}
                  className="text-amber-400 hover:underline text-[11px] cursor-pointer"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#990000] to-[#b30000] hover:from-[#b30000] hover:to-[#990000] active:scale-[0.99] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>যাচাই হচ্ছে...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>পরবর্তী: ২-ফ্যাক্টর সিকিউরিটি (Next)</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer inside Card */}
            <div className="p-4 bg-slate-950/60 border-t border-slate-800 text-center text-[11px] text-slate-500">
              <span>সুরক্ষিত সার্ভার অ্যান্ড ২-ফ্যাক্টর অথেনটিকেশন সক্রিয়</span>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 3: FORGOT PASSWORD (VIA GMAIL RESET LINK) */}
        {/* =================================================================== */}
        {step === 'forgot_password' && (
          <div className="w-full max-w-md bg-[#0c1224]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg">
              <HelpCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                পাসওয়ার্ড রিসেট করুন
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার জিমেইল ঠিকানা দিন। আমরা আপনার জিমেইলে একটি সরাসরি রিসেট লিংক ও ওটিপি কোড পাঠাবো।
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  অ্যাডমিন জিমেইল ঠিকানা
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="shishirbarai2050@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>পাঠানো হচ্ছে...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>জিমেইলে রিসেট লিংক পাঠান</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('login');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>লগইন পেজে ফিরে যান</span>
              </button>
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* STEP 4: RESET PASSWORD (NEW PASSWORD SETUP) */}
        {/* =================================================================== */}
        {step === 'reset_password' && (
          <div className="w-full max-w-md bg-[#0c1224]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white tracking-tight">
                নতুন পাসওয়ার্ড সেট করুন
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                আপনার অ্যাকাউন্টের জন্য একটি শক্তিশালী নতুন পাসওয়ার্ড লিখুন।
              </p>
            </div>

            {error && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-left">
              {/* Optional OTP code field if token not in URL */}
              {!resetToken && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    জিমেইলে আসা ৬ ডিজিট ওটিপি কোড
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="839102"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 font-mono tracking-widest"
                  />
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  নতুন পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষর"
                    className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  পাসওয়ার্ড নিশ্চিত করুন
                </label>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="আবার পাসওয়ার্ডটি লিখুন"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>সংরক্ষণ হচ্ছে...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>পাসওয়ার্ড সংরক্ষণ ও লগইন করুন</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white pt-2 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>লগইন পেজে ফিরে যান</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Page Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-800/60 relative z-10">
        <p>
          © {new Date().getFullYear()} {settings.siteName.toLowerCase()}. All rights reserved. | Developed with{' '}
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
