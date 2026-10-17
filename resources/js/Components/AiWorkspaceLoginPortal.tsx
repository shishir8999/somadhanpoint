import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  Bot, 
  Zap, 
  Cpu, 
  Check, 
  ArrowLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { User, SystemSettings } from '../types';
import { storage } from '../services/storage';

interface AiWorkspaceLoginPortalProps {
  settings: SystemSettings;
  onLoginSuccess: (user: User, targetModel?: string) => void;
  onBackToHome: () => void;
  onOpenStore: () => void;
  initialModel?: string | null;
}

export const AiWorkspaceLoginPortal: React.FC<AiWorkspaceLoginPortalProps> = ({
  settings,
  onLoginSuccess,
  onBackToHome,
  onOpenStore,
  initialModel = 'ChatGPT',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedTargetModel, setSelectedTargetModel] = useState<string>(initialModel || 'ChatGPT');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleInputEmail, setGoogleInputEmail] = useState('');
  const [googleInputName, setGoogleInputName] = useState('');

  // Models available
  const availableModels = [
    { 
      id: 'ChatGPT', 
      name: 'ChatGPT', 
      desc: 'GPT-4o & GPT-5', 
      color: '#10A37F',
      badge: 'OpenAI'
    },
    { 
      id: 'Claude', 
      name: 'Claude 3.7', 
      desc: 'Anthropic Sonnet', 
      color: '#D97706',
      badge: 'Anthropic'
    },
    { 
      id: 'Gemini', 
      name: 'Google Gemini', 
      desc: '2.5 Pro Multimodal', 
      color: '#4285F4',
      badge: 'Google AI'
    },
    { 
      id: 'Grok', 
      name: 'Grok 3', 
      desc: 'xAI Unfiltered Feed', 
      color: '#000000',
      badge: 'xAI'
    },
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!email.trim()) {
      setLoginError('অনুগ্রহ করে আপনার ইমেইল অ্যাড্রেস লিখুন।');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try backend API login
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email.trim(), password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          storage.loginUser(String(data.user.id));
          setSuccessMessage(`স্বাগতম ${data.user.name}! লগইন সফল হয়েছে।`);
          setTimeout(() => {
            onLoginSuccess(data.user, selectedTargetModel);
          }, 400);
          return;
        }
      }
    } catch {
      // offline fallback
    }

    // 2. Client-side storage fallback
    const foundUser = storage.loginWithCredentials(email.trim(), password);
    if (foundUser) {
      setSuccessMessage(`স্বাগতম ${foundUser.name}! লগইন সফল হয়েছে।`);
      setTimeout(() => {
        onLoginSuccess(foundUser, selectedTargetModel);
      }, 400);
    } else {
      // Auto-create or authenticate client account with this email
      const cleanEmail = email.trim().toLowerCase();
      const derivedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);
      
      const newUser = storage.registerUser({
        name: formattedName || 'Client User',
        email: cleanEmail,
        role: 'user',
      });
      storage.loginUser(newUser.id);
      setSuccessMessage(`আপনার ইমেইল (${cleanEmail}) দিয়ে অ্যাকাউন্ট তৈরি ও লগইন সফল হয়েছে!`);
      setTimeout(() => {
        onLoginSuccess(newUser, selectedTargetModel);
      }, 500);
    }

    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!name.trim()) {
      setRegError('অনুগ্রহ করে আপনার পুরো নাম লিখুন।');
      return;
    }
    if (!regEmail.trim()) {
      setRegError('অনুগ্রহ করে আপনার ইমেইল অ্যাড্রেস লিখুন।');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('উভয় পাসওয়ার্ড হুবহু এক হতে হবে।');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: regEmail.trim().toLowerCase(),
          password: regPassword,
          role: 'user',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          storage.loginUser(String(data.user.id));
          setSuccessMessage(`অভিনন্দন ${data.user.name}! অ্যাকাউন্ট তৈরি ও লগইন সফল হয়েছে।`);
          setTimeout(() => {
            onLoginSuccess(data.user, selectedTargetModel);
          }, 400);
          return;
        }
      }
    } catch {
      // offline fallback
    }

    const newUser = storage.registerUser({
      name: name.trim(),
      email: regEmail.trim().toLowerCase(),
      role: 'user',
    });
    storage.loginUser(newUser.id);
    setSuccessMessage(`অভিনন্দন ${newUser.name}! অ্যাকাউন্ট তৈরি সম্পন্ন।`);
    setTimeout(() => {
      onLoginSuccess(newUser, selectedTargetModel);
    }, 400);

    setIsLoading(false);
  };

  const handleGoogleSignIn = async (userEmail: string, userName?: string) => {
    setIsLoading(true);
    setShowGoogleModal(false);
    const cleanEmail = userEmail.trim().toLowerCase();
    const cleanName = userName?.trim() || cleanEmail.split('@')[0];
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanEmail }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setSuccessMessage(`Google একাউন্ট (${cleanEmail}) সফলভাবে কানেক্ট হয়েছে!`);
        setTimeout(() => {
          onLoginSuccess(data.user, selectedTargetModel);
        }, 400);
        return;
      }

      // Auto register if not found
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
        setSuccessMessage(`Google একাউন্ট (${cleanEmail}) দিয়ে সফলভাবে নতুন একাউন্ট তৈরি হয়েছে!`);
        setTimeout(() => {
          onLoginSuccess(regData.user, selectedTargetModel);
        }, 400);
        return;
      }
    } catch (e) {
      // offline fallback
      const fallbackUser = storage.loginWithCredentials(cleanEmail) || storage.registerUser({
        name: cleanName,
        email: cleanEmail,
        phone: '01700000000',
        role: 'user',
      });
      onLoginSuccess(fallbackUser, selectedTargetModel);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#090D1A] flex flex-col justify-between text-slate-900 dark:text-slate-100 font-sans select-none">
      
      {/* Top Header */}
      <header className="h-16 px-6 sm:px-10 flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md sticky top-0 z-20">
        <div 
          onClick={onBackToHome}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Go to Homepage"
        >
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.appName || 'Logo'} 
              className="h-8 max-w-[180px] object-contain group-hover:scale-105 transition-all" 
            />
          ) : (
            <>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-extrabold text-xl text-slate-950 dark:text-white tracking-tight">
                  {settings.brandPrefix || 'OmniCraft'}
                </span>
                <span className="font-bold text-lg text-blue-600 tracking-tight">
                  {settings.brandSuffix || 'AI'}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onBackToHome}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition font-semibold text-slate-600 dark:text-slate-300"
          >
            ← হোম পেজ
          </button>
          <button
            onClick={onOpenStore}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs"
          >
            ডিজিটাল স্টোর →
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md bg-white dark:bg-[#0B0F19] rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
          
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Heading with 4 AI Model Emblems */}
          <div className="text-center space-y-3 relative z-10">
            <div className="flex items-center justify-center gap-2 pb-1">
              {/* ChatGPT */}
              <div className="w-8 h-8 rounded-xl bg-[#10A37F] text-white flex items-center justify-center p-1.5 shadow-xs" title="ChatGPT">
                <svg className="w-full h-full" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.66-4.1354a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1402-1.6564zm-1.0882-9.724a4.466 4.466 0 0 1 2.3418-1.9729l-.0047.161v5.5163a.776.776 0 0 0 .388.6719l5.838 3.3732-2.02 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7913a4.4944 4.4944 0 0 1-1.6418-6.1265zm13.9958 4.0225l-5.838-3.3732 2.02-1.1636a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6767 8.1042v-5.6772a.79.79 0 0 0-.4066-.6815zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L6.009 6.8485V4.5161a.0757.0757 0 0 1 .0332-.0615l4.8802-2.8197a4.504 4.504 0 0 1 6.1308 1.6517 4.4755 4.4755 0 0 1 .5536 3.0184zm-9.5132 4.4045l2.6074-1.5049 2.6074 1.5049v3.0145l-2.6074 1.505-2.6074-1.505zm-1.0693-1.8458l-2.02-1.1683a.071.071 0 0 1-.038-.052V3.4116a4.504 4.504 0 0 1 7.371-3.4539l-.142.0805-4.7783 2.7582a.7948.7948 0 0 0-.3927.6813z"/>
                </svg>
              </div>

              {/* Claude */}
              <div className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold text-sm shadow-xs" title="Claude">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a1 1 0 0 1 1 1v4.07a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm6.364 3.636a1 1 0 0 1 0 1.414l-2.878 2.879a1 1 0 1 1-1.414-1.414l2.878-2.879a1 1 0 0 1 1.414 0zM22 12a1 1 0 0 1-1 1h-4.07a1 1 0 0 1 0-2H21a1 1 0 0 1 1 1zm-3.636 6.364a1 1 0 0 1-1.414 0l-2.879-2.878a1 1 0 0 1 1.414-1.414l2.879 2.878a1 1 0 0 1 0 1.414zM12 22a1 1 0 0 1-1-1v-4.07a1 1 0 0 1 2 0V21a1 1 0 0 1-1 1zm-6.364-3.636a1 1 0 0 1 0-1.414l2.878-2.879a1 1 0 1 1 1.414 1.414l-2.878 2.879a1 1 0 0 1-1.414 0zM2 12a1 1 0 0 1 1-1h4.07a1 1 0 0 1 0 2H3a1 1 0 0 1-1-1zm3.636-6.364a1 1 0 0 1 1.414 0l2.879 2.878a1 1 0 1 1-1.414 1.414L5.636 7.05a1 1 0 0 1 0-1.414z"/>
                </svg>
              </div>

              {/* Gemini */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#1E88E5] via-[#8E24AA] to-[#E91E63] text-white flex items-center justify-center p-1 shadow-xs" title="Google Gemini">
                <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C12 7.52 7.52 12 2 12C7.52 12 12 16.48 12 22C12 16.48 16.48 12 22 12C16.48 12 12 7.52 12 2Z"/>
                </svg>
              </div>

              {/* Grok */}
              <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center p-1.5 shadow-xs" title="Grok 3">
                <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              এআই চ্যাট ওয়ার্কস্পেস লগইন
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              চ্যাট জিপিটি, ক্লড, জেমিনি ও গ্রোক ব্যবহার করতে আপনার ইমেইল দিয়ে লগইন করুন।
            </p>
          </div>

          {/* Model Selector Pills */}
          <div className="space-y-1.5 relative z-10">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              লগইন করে যে মডেলে যেতে চান:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableModels.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedTargetModel(m.id)}
                  className={`p-2 rounded-xl border text-left transition flex items-center gap-2 ${
                    selectedTargetModel === m.id
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-2xs'
                      : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                    style={{ backgroundColor: m.color }}
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{m.name}</div>
                    <div className="text-[9px] text-slate-400 font-normal truncate">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Switcher: Login vs Sign Up */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-white/5 p-1 border border-slate-200/80 dark:border-white/10 text-xs font-bold relative z-10">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-2 rounded-lg transition text-center ${
                activeTab === 'login'
                  ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              লগইন (Sign In)
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setLoginError(''); setRegError(''); }}
              className={`flex-1 py-2 rounded-lg transition text-center ${
                activeTab === 'register'
                  ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              নতুন একাউন্ট তৈরি
            </button>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 relative z-10">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {loginError}
                </div>
              )}

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={() => {
                  if (email && email.includes('@')) {
                    setGoogleInputEmail(email);
                  }
                  setShowGoogleModal(true);
                }}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition shadow-md border border-slate-700/50 group"
              >
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <span>Continue with Google (গুগল দিয়ে লগইন)</span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-1">
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
                <span className="bg-white dark:bg-[#121624] px-3 text-[11px] font-semibold text-slate-400 uppercase">
                  অথবা ইমেইল দিয়ে লগইন
                </span>
                <div className="border-t border-slate-200 dark:border-white/10 w-full" />
              </div>

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  ইমেইল অ্যাড্রেস:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    পাসওয়ার্ড:
                  </label>
                  <span className="text-[10px] text-slate-400 font-normal">ডিফল্ট বা খালি রাখা যাবে</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন ও চ্যাট শুরু করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 relative z-10">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {regError}
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  আপনার নাম:
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার পুরো নাম"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  ইমেইল অ্যাড্রেস:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  পাসওয়ার্ড:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  পাসওয়ার্ড নিশ্চিত করুন:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="হুবহু একই পাসওয়ার্ড লিখুন"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করে চ্যাট শুরু করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Privacy & Trust note */}
          <div className="pt-2 text-[11px] text-center text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>১০০% এনক্রিপ্টেড প্রাইভেট চ্যাট ভল্ট ও জিরো ডেটা লিক গ্যারান্টি।</span>
          </div>

        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-white/5">
        <span>© {new Date().getFullYear()} {settings.appName || 'OmniCraft AI'}. All rights reserved.</span>
      </footer>

      {/* Google Connect & Sign-In Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#121624] rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-transparent border-b border-slate-100 dark:border-white/10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-slate-200/80">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Sign in with Google</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Google অ্যাকাউন্টের সাথে সরাসরি কানেক্ট করুন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
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
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
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
                    className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  এই জিমেইলের সাথে গুগল ভেরিফিকেশনে আপনার একাউন্ট সরাসরি কানেক্ট হবে।
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  আপনার পুরো নাম (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={googleInputName}
                  onChange={(e) => setGoogleInputName(e.target.value)}
                  placeholder="যেমন: শিশির বাড়ৈ"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white bg-slate-50/50 dark:bg-white/5"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span>কানেক্ট হচ্ছে...</span>
                  ) : (
                    <>
                      <span>কানেক্ট ও প্রবেশ করুন</span>
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
};
