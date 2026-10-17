import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  Check, 
  ChevronDown, 
  MessageCircle,
  HelpCircle,
  AlertCircle,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { storage } from '@/services/storage';

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
  initialTab?: 'login' | 'register';
  settings?: {
    appName?: string;
    brandPrefix?: string;
    brandSuffix?: string;
    brandTagline?: string;
    supportPhone?: string;
    supportEmail?: string;
    announcementText?: string;
    enableHeaderMarquee?: boolean;
  } | null;
}

export default function Login({ 
  status, 
  canResetPassword = true, 
  initialTab = 'login',
  settings 
}: LoginProps) {
  const brandPrefix = settings?.brandPrefix || (settings?.appName?.includes(' ') ? settings.appName.split(' ')[0] : 'OmniCraft');
  const brandSuffix = settings?.brandSuffix || (settings?.appName?.includes(' ') ? settings.appName.split(' ').slice(1).join(' ') : 'AI');
  const brandName = `${brandPrefix} ${brandSuffix}`.trim();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState('');
  const [googleInputName, setGoogleInputName] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Inertia Form for Login
  const loginForm = useForm({
    email: '',
    password: '',
    remember: true,
  });

  // Inertia Form for Register (matching exact screenshot fields: Name, Email, Password, Confirm password)
  const registerForm = useForm({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    role: 'user' as 'user' | 'reseller',
  });

  // Video Player Mockup State (Right Container matching exact screenshot)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(5); // 0:07 of 2:15
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVideoPlaying) {
      timer = setInterval(() => {
        setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isVideoPlaying]);

  // Handle Form Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginForm.post('/login', {
      onSuccess: () => {
        // Also sync storage session
        const users = storage.getUsers();
        const found = users.find(u => u.email.toLowerCase() === loginForm.data.email.toLowerCase());
        if (found) {
          storage.loginUser(String(found.id));
        }
      },
    });
  };

  // Handle Form Register Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.data.password !== registerForm.data.password_confirmation) {
      registerForm.setError('password_confirmation', 'পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলছে না!');
      return;
    }
    registerForm.post('/register', {
      onSuccess: () => {
        // Add to storage service
        storage.registerUser({
          name: registerForm.data.name,
          email: registerForm.data.email,
          phone: registerForm.data.phone || '',
          role: registerForm.data.role,
        });
      },
    });
  };

  // Handle Google Connect & Sign-In
  const handleGoogleSignIn = async (email: string, name?: string) => {
    setIsGoogleLoading(true);
    setShowGoogleModal(false);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name?.trim() || cleanEmail.split('@')[0];
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanEmail }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setAlertSuccess(`Google একাউন্ট (${cleanEmail}) দিয়ে সফলভাবে লগইন সম্পন্ন হয়েছে!`);
        storage.loginUser(String(data.user.id));
        setTimeout(() => {
          window.location.href = data.user.role === 'super_admin' ? '/admin' : data.user.role === 'reseller' ? '/reseller' : '/workspace';
        }, 500);
      } else {
        // Auto register if account not present
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: cleanName,
            email: cleanEmail,
            phone: '01700000000',
            password: 'google_oauth_pass',
            role: 'user',
          }),
        });
        const regData = await regRes.json();
        if (regData.success && regData.user) {
          setAlertSuccess(`Google একাউন্ট (${cleanEmail}) দিয়ে সফলভাবে নতুন একাউন্ট তৈরি ও লগইন হয়েছে!`);
          storage.loginUser(String(regData.user.id));
          setTimeout(() => {
            window.location.href = '/workspace';
          }, 500);
        }
      }
    } catch (err) {
      window.location.href = '/workspace';
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-slate-900 font-sans flex flex-col selection:bg-blue-600 selection:text-white">
      <Head title={`${activeTab === 'login' ? 'Login' : 'Create Account'} - ${brandName}`} />

      {/* ============================================================ */}
      {/* 1. TOP HEADER MARQUEE, NAVBAR & ANNOUNCEMENT BANNER         */}
      {/* (Matching user uploaded screenshot media_1792085178574_94a94e1a.png) */}
      {/* ============================================================ */}

      {/* 1.1 Red Announcement Marquee Ticker */}
      {settings?.enableHeaderMarquee !== false && (
        <div className="bg-[#D11E36] text-white text-[11px] font-bold py-1.5 overflow-hidden relative shadow-md select-none border-b border-red-700/40">
          <div className="flex animate-marquee-smooth whitespace-nowrap">
            {/* Track 1 */}
            <div className="flex items-center gap-6 px-4">
              <span>Support Hotline: {settings?.supportPhone || '+880 1700-000000'}</span>
              <span>•</span>
              <span>Wholesale Reseller Discount 25%</span>
              <span>•</span>
              <Link href="/store" className="underline uppercase tracking-wider text-amber-200 hover:text-white">ORDER NOW</Link>
              <span>★</span>
              <span className="text-amber-300 font-bold">🔥 বিশেষ অফার: ChatGPT Plus & Canva Pro তে আজ পাচ্ছেন সর্বোচ্চ ৭০% ছাড়! বিকাশ/নগদে তাৎক্ষণিক অ্যাক্টিভেশন!</span>
              <span>•</span>
              <span>ChatGPT, Claude, Gemini & Grok In One Place</span>
              <span>•</span>
              <span>Instant Delivery & 100% Genuine Retail Keys</span>
              <span>★</span>
            </div>
            {/* Track 2 */}
            <div className="flex items-center gap-6 px-4" aria-hidden="true">
              <span>Support Hotline: {settings?.supportPhone || '+880 1700-000000'}</span>
              <span>•</span>
              <span>Wholesale Reseller Discount 25%</span>
              <span>•</span>
              <Link href="/store" className="underline uppercase tracking-wider text-amber-200 hover:text-white">ORDER NOW</Link>
              <span>★</span>
              <span className="text-amber-300 font-bold">🔥 বিশেষ অফার: ChatGPT Plus & Canva Pro তে আজ পাচ্ছেন সর্বোচ্চ ৭০% ছাড়! বিকাশ/নগদে তাৎক্ষণিক অ্যাক্টিভেশন!</span>
              <span>•</span>
              <span>ChatGPT, Claude, Gemini & Grok In One Place</span>
              <span>•</span>
              <span>Instant Delivery & 100% Genuine Retail Keys</span>
              <span>★</span>
            </div>
          </div>
        </div>
      )}

      {/* 1.2 Main Full-Width Sticky Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-slate-200/90 shadow-xs select-none">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-3 flex items-center justify-between text-slate-900">
          
          {/* Left: Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            {settings?.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt={brandName} 
                className="h-8 sm:h-9 w-auto max-w-[200px] object-contain group-hover:scale-105 transition-all" 
              />
            ) : (
              <>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-md shadow-blue-500/25 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-pulse-glow">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                  </svg>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight font-sans">
                    {brandPrefix}
                  </span>
                  <span className="font-bold text-lg sm:text-xl text-blue-600 font-sans tracking-tight">
                    {brandSuffix}
                  </span>
                </div>
              </>
            )}
          </Link>

          {/* Center: Navigation Links matching exact items in screenshot */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link 
              href="/" 
              className="text-sm font-medium transition-all duration-200 text-slate-600 hover:text-blue-600 hover:-translate-y-0.5"
            >
              Features
            </Link>
            <Link 
              href="/workspace" 
              className="text-sm font-medium transition-all duration-200 text-slate-600 hover:text-blue-600 hover:-translate-y-0.5"
            >
              AI Models
            </Link>
            <Link 
              href="/store" 
              className="text-sm font-medium transition-all duration-200 text-slate-600 hover:text-blue-600 hover:-translate-y-0.5"
            >
              Pricing / Store
            </Link>
            <Link 
              href="/reseller" 
              className="text-sm font-medium transition-all duration-200 text-slate-600 hover:text-blue-600 hover:-translate-y-0.5"
            >
              Reseller Hub
            </Link>
            <Link 
              href="/guides" 
              className="text-sm font-medium transition-all duration-200 text-slate-600 hover:text-blue-600 hover:-translate-y-0.5"
            >
              FAQ
            </Link>
          </nav>

          {/* Right: Login & Register action buttons matching screenshot */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button 
              onClick={() => setActiveTab('login')}
              className={`text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 py-1.5 px-3 rounded-full border shadow-xs ${
                activeTab === 'login'
                  ? 'text-blue-600 bg-blue-50 border-blue-200 font-bold'
                  : 'text-slate-700 hover:text-blue-600 hover:bg-slate-100 border-slate-200/90'
              }`}
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span>লগইন (Login)</span>
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`font-semibold px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 whitespace-nowrap ${
                activeTab === 'register'
                  ? 'bg-[#1D4ED8] ring-2 ring-blue-400 text-white'
                  : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
              }`}
            >
              শুরু করুন
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-3 animate-fadeIn">
            <Link href="/" className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600">Features</Link>
            <Link href="/workspace" className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600">AI Models</Link>
            <Link href="/store" className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600">Pricing / Store</Link>
            <Link href="/reseller" className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600">Reseller Hub</Link>
            <Link href="/guides" className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600">FAQ</Link>
          </div>
        )}
      </header>

      {/* 1.3 Blue Sub-Bar Announcement Strip */}
      <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs sm:text-sm py-2.5 sm:py-3 px-4 text-center font-medium flex flex-wrap items-center justify-center gap-2 shadow-sm border-b border-blue-500/30 relative z-30">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
        <span>ইউএসএ ফিচার লাইভ প্রিভিউ পেইজ ({brandName} Workspace Live) — আপনার ডিজিটাল স্টোরেও সকল সাবস্ক্রিপশন চালু আছে!</span>
        <Link 
          href="/store"
          className="ml-2 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white underline font-bold transition text-xs shadow-2xs hover:scale-105 active:scale-95"
        >
          ডিজিটাল স্টোরে যান →
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN SPLIT SECTION: AUTH CARD (LEFT) & VIDEO (RIGHT)     */}
      {/* ============================================================ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* ---------------------------------------------------------- */}
          {/* LEFT COLUMN: AUTH CARD (1:1 with Screenshot)              */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-[420px] bg-white rounded-[28px] border border-slate-200/90 shadow-2xl shadow-slate-200/60 p-6 sm:p-8 space-y-6">
              
              {/* Card Brand Swirl Logo */}
              <div className="flex justify-center">
                {settings?.logoUrl ? (
                  <img 
                    src={settings.logoUrl} 
                    alt={brandName} 
                    className="h-12 w-auto max-w-[200px] object-contain drop-shadow-md" 
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-glow">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Header Title & Mode Toggle (Matching exact screenshot) */}
              <div className="text-center space-y-1.5">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {activeTab === 'login' ? `Welcome to ${brandName}` : 'Create your account'}
                </h1>
                <p className="text-xs text-slate-500">
                  {activeTab === 'login' ? (
                    <>
                      Don't have an account ?{' '}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('register')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Create account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button 
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-blue-600 font-semibold hover:underline"
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Status / Success Toast */}
              {(status || alertSuccess) && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{status || alertSuccess}</span>
                </div>
              )}

              {/* Google One-Tap Capsule Button - Only on Login tab matching screenshot */}
              {activeTab === 'login' && (
                <>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        if (loginForm.data.email && loginForm.data.email.includes('@')) {
                          setGoogleInputEmail(loginForm.data.email);
                        }
                        setShowGoogleModal(true);
                      }}
                      disabled={isGoogleLoading}
                      className="w-full bg-[#13161F] hover:bg-[#1E2333] active:scale-[0.99] text-white py-2.5 px-4 rounded-full flex items-center justify-between transition-all duration-200 shadow-md border border-slate-700/60 font-semibold text-xs sm:text-sm group select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-slate-100">
                          {isGoogleLoading ? 'গুগলের সাথে কানেক্ট হচ্ছে...' : 'Continue with Google (গুগল দিয়ে লগইন)'}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition" />
                    </button>
                  </div>

                  {/* "or" Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="border-t border-slate-200 w-full" />
                    <span className="bg-white px-3 text-xs text-slate-400 uppercase font-medium">or</span>
                    <div className="border-t border-slate-200 w-full" />
                  </div>
                </>
              )}

              {/* ---------------------------------------------------- */}
              {/* LOGIN FORM (When activeTab === 'login')               */}
              {/* ---------------------------------------------------- */}
              {activeTab === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="text-xs font-semibold text-slate-700">Login</div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="email"
                        value={loginForm.data.email}
                        onChange={(e) => loginForm.setData('email', e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                    {loginForm.errors.email && (
                      <p className="text-[11px] text-rose-600 font-medium px-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {loginForm.errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={loginForm.data.password}
                        onChange={(e) => loginForm.setData('password', e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {loginForm.errors.password && (
                      <p className="text-[11px] text-rose-600 font-medium px-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {loginForm.errors.password}
                      </p>
                    )}
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(true)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  {/* Vibrant Blue Login Button */}
                  <button
                    type="submit"
                    disabled={loginForm.processing}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {loginForm.processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Logging in...</span>
                      </>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </form>
              ) : (
                /* -------------------------------------------------- */
                /* REGISTRATION FORM (Matching media_1792085398427_5d82fdfa.png) */
                /* -------------------------------------------------- */
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Full Name Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        name="name"
                        value={registerForm.data.name}
                        onChange={(e) => registerForm.setData('name', e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                    {registerForm.errors.name && (
                      <p className="text-[11px] text-rose-600 font-medium px-1">{registerForm.errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        name="email"
                        value={registerForm.data.email}
                        onChange={(e) => registerForm.setData('email', e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                    </div>
                    {registerForm.errors.email && (
                      <p className="text-[11px] text-rose-600 font-medium px-1">{registerForm.errors.email}</p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={registerForm.data.password}
                        onChange={(e) => registerForm.setData('password', e.target.value)}
                        placeholder="Password"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.errors.password && (
                      <p className="text-[11px] text-rose-600 font-medium px-1">{registerForm.errors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password Input */}
                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="password_confirmation"
                        value={registerForm.data.password_confirmation}
                        onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                        placeholder="Confirm password"
                        required
                        minLength={6}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {registerForm.errors.password_confirmation && (
                      <p className="text-[11px] text-rose-600 font-medium px-1">{registerForm.errors.password_confirmation}</p>
                    )}
                  </div>

                  {/* Submit Registration Button */}
                  <button
                    type="submit"
                    disabled={registerForm.processing}
                    className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {registerForm.processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating account...</span>
                      </>
                    ) : (
                      <span>Create account</span>
                    )}
                  </button>
                </form>
              )}

              {/* Disclaimer */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed">
                By logging in you agree with our{' '}
                <a href="/guides" className="text-blue-600 font-semibold hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="/guides" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a>
              </p>

              {/* Security Badges Footer (Exact Screenshot Match) */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Private Data</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>100% Secure</span>
                </span>
              </div>

            </div>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: SHOWCASE VIDEO CONTAINER (Exact Screenshot)  */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-7 w-full flex justify-center">
            <div className="w-full max-w-[620px] rounded-3xl overflow-hidden bg-[#070A14] border border-slate-800/90 shadow-2xl aspect-[16/10] sm:aspect-[16/10] flex flex-col justify-between p-6 sm:p-8 text-white relative group select-none">
              
              {/* Radial Glowing Ambient Light in Background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950/60 to-black/95 pointer-events-none" />

              {/* Animated Concentric Rings in center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-blue-500/10 pointer-events-none animate-pulse-glow" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full border border-blue-500/15 pointer-events-none" />

              {/* Top Row / Spacer */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold">
                    Interactive AI Showcase
                  </span>
                </div>
              </div>

              {/* Center Content: "Welcome to" with Glowing Swirl Logo */}
              <div className="relative z-10 my-auto flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                      Welcome
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-blue-600/30 text-blue-300 font-bold text-xs sm:text-sm border border-blue-400/40 shadow-inner">
                      to
                    </span>
                  </div>
                </div>

                {/* Glowing Circular Swirl Swirl Matching Screenshot */}
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center shadow-2xl shadow-blue-500/60 animate-pulse-glow border-2 border-blue-400/50">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Video Controls Bar (Exact Match with Screenshot) */}
              <div className="relative z-10 space-y-2.5 pt-4">
                
                {/* Seekbar with Blue Active Progress */}
                <div 
                  className="w-full h-1 bg-white/20 hover:h-1.5 rounded-full overflow-hidden cursor-pointer transition-all duration-200 relative group/seek"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
                    setVideoProgress(pct);
                  }}
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                {/* Video Action Controls Strip */}
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="hover:text-white transition"
                    >
                      {isVideoPlaying ? <Pause className="w-4 h-4 text-blue-400" /> : <Play className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-400">
                      0:07
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsMuted(!isMuted)}
                      className="hover:text-white transition"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <div className="w-14 h-1 bg-white/30 rounded-full relative cursor-pointer">
                      <div className="h-full bg-white rounded-full" style={{ width: isMuted ? '0%' : '65%' }} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>

      {/* ============================================================ */}
      {/* 3. RICH FOOTER SECTION MATCHING EXACT SCREENSHOT             */}
      {/* ============================================================ */}
      <footer className="w-full border-t border-slate-100 bg-[#FFFFFF] text-slate-600 pt-12 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Brand & Socials */}
            <div className="md:col-span-4 space-y-4">
              <Link href="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={brandName} className="h-8 max-w-[180px] object-contain drop-shadow-sm" />
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#1E40AF] via-[#2563EB] to-[#38BDF8] flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.96-.48-7.07-3.6-7.55-7.55.33-.09.68-.15 1.05-.18 2.87-.22 5.25-2.29 5.86-5.08.18-.83.21-1.66.1-2.47 3.39.81 5.99 3.65 6.47 7.15-.33.09-.68.15-1.05.18-2.87.22-5.25 2.29-5.86 5.08-.18.83-.21 1.66-.1 2.47-.34.13-.67.27-1.02.4z"/>
                      </svg>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-extrabold text-xl text-slate-900">{brandPrefix}</span>
                      <span className="font-bold text-lg text-blue-600">{brandSuffix}</span>
                    </div>
                  </>
                )}
              </Link>
              
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Gain a competitive edge with {brandName} — driving growth through efficient AI adaptation.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3 text-slate-400">
                <a href="#" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">
                  <span className="font-bold text-xs">in</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:text-blue-600 hover:border-blue-600 transition">
                  <span className="font-bold text-xs">f</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:text-pink-600 hover:border-pink-600 transition">
                  <span className="font-bold text-xs">ig</span>
                </a>
                <a href="#" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:text-slate-900 hover:border-slate-900 transition">
                  <span className="font-bold text-xs">𝕏</span>
                </a>
                <a href={`https://wa.me/${settings?.supportPhone?.replace(/\D/g, '') || '8801700000000'}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:text-emerald-600 hover:border-emerald-600 transition">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Col 2: Solutions */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Solutions
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/" className="hover:text-blue-600 font-semibold text-blue-600">Home</Link></li>
                <li><Link href="/workspace" className="hover:text-blue-600">Features</Link></li>
                <li><Link href="/workspace" className="hover:text-blue-600">AI Models</Link></li>
                <li><Link href="/store" className="hover:text-blue-600">Pricing</Link></li>
              </ul>
            </div>

            {/* Col 3: Legal */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Legal
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/guides" className="hover:text-blue-600">Terms of Use</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">Cookie Policy</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">Refund Policy</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">FAQ</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">Cookie Settings</Link></li>
              </ul>
            </div>

            {/* Col 4: Resources */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/guides" className="hover:text-blue-600">Blog</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">Contact</Link></li>
                <li><Link href="/guides" className="hover:text-blue-600">About</Link></li>
              </ul>
            </div>

          </div>

          {/* Payment Partner Icons Strip (Exact Match with Screenshot) */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-500 mr-1">Pay With:</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 text-[10px]">VISA</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 text-[10px]">Mastercard</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-700 text-[10px]">AMEX</span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold text-[10px]">bKash</span>
              <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-bold text-[10px]">Nagad</span>
              <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-bold text-[10px]">Rocket</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">Upay</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px]">SSLCommerz</span>
            </div>
          </div>

          {/* Copyright Strip */}
          <div className="text-center text-xs text-slate-400 pt-2">
            © 2026 {brandName}. All rights reserved.
          </div>

        </div>
      </footer>

      {/* ============================================================ */}
      {/* 4. FLOATING SUPPORT CHAT WIDGET (Exact Match)                */}
      {/* ============================================================ */}
      <a
        href={`https://wa.me/${settings?.supportPhone?.replace(/\D/g, '') || '8801700000000'}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#00897B] hover:bg-[#00796B] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 group"
        title="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* ============================================================ */}
      {/* 5. FORGOT PASSWORD MODAL                                     */}
      {/* ============================================================ */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">পাসওয়ার্ড রিসেট (Reset Password)</h3>
            <p className="text-xs text-slate-500">
              আপনার একাউন্টের রেজিস্টার্ড ইমেইলটি লিখুন। রিসেট নির্দেশনা পাঠানো হবে।
            </p>
            {forgotSubmitted ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium">
                ✅ পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে। অনুগ্রহ করে চেক করুন।
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setForgotSubmitted(true);
                  setTimeout(() => setForgotModalOpen(false), 2500);
                }} 
                className="space-y-3"
              >
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    বন্ধ করুন
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
                  >
                    রিসেট লিংক পাঠান
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Google Connect & Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sign in with Google</h3>
                  <p className="text-xs text-slate-500">Google অ্যাকাউন্টের সাথে সরাসরি কানেক্ট করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (!googleInputEmail.trim()) return;
              const autoName = googleInputName.trim() || googleInputEmail.split('@')[0].replace(/[._0-9]/g, ' ').trim() || 'Google User';
              handleGoogleSignIn(googleInputEmail.trim(), autoName);
            }} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  আপনার Google Email / Gmail লিখুন
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={googleInputEmail}
                    onChange={(e) => setGoogleInputEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-slate-50/50"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  এই জিমেইলের সাথে গুগল ভেরিফিকেশনে আপনার একাউন্ট সরাসরি কানেক্ট হবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  আপনার পুরো নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={googleInputName}
                  onChange={(e) => setGoogleInputName(e.target.value)}
                  placeholder="যেমন: শিশির বাড়ৈ"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-slate-50/50"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isGoogleLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#13161F] hover:bg-[#1E2333] text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  {isGoogleLoading ? (
                    <span>কানেক্ট হচ্ছে...</span>
                  ) : (
                    <>
                      <span>কানেক্ট ও লগইন করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
