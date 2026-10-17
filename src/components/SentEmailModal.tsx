import React from 'react';
import { X, Mail, CheckCircle2, ShieldAlert, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { SentEmailItem } from '../types';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface SentEmailModalProps {
  email: SentEmailItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUseOtp?: (otp: string) => void;
}

export const SentEmailModal: React.FC<SentEmailModalProps> = ({
  email,
  isOpen,
  onClose,
  onUseOtp,
}) => {
  const { settings } = useStoreSettings();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !email) return null;

  const handleCopyOtp = () => {
    if (email.otpCode) {
      navigator.clipboard.writeText(email.otpCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      if (onUseOtp) {
        onUseOtp(email.otpCode);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Gmail Simulated Top Header Bar */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-3.5 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center shadow-md">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide">Gmail ইনবক্স নোটিফিকেশন</span>
                <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.2 rounded-full">
                  নতুন বার্তা
                </span>
              </div>
              <p className="text-[11px] text-red-100 truncate max-w-[240px]">
                {email.to} -এ প্রেরিত
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Header Details */}
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 space-y-1 text-xs">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{email.subject}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">প্রেরক:</span> {email.from}
              </p>
              <p className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">প্রাপক:</span> {email.toName} &lt;{email.to}&gt;
              </p>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 font-medium">{email.sentAt}</span>
          </div>
        </div>

        {/* Email Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed flex-1">
          {/* Brand Letterhead */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-lg p-1 border border-slate-200 shadow-2xs">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="h-7 w-auto object-contain" />
                ) : (
                  <span className="text-xs font-black text-[#990000]">Somadhan Point</span>
                )}
              </div>
              <span className="text-xs font-bold text-slate-800">{settings.siteName}</span>
            </div>
            <span className="text-[10px] text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ ভেরিফাইড সিস্টেম বার্তা
            </span>
          </div>

          {/* Type 1: Welcome Email */}
          {email.type === 'welcome' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!
                </h4>
                <p className="text-xs text-slate-600">
                  প্রিয় <strong className="text-slate-900">{email.toName}</strong>, Somadhan Point পরিবারে আপনাকে স্বাগতম!
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wide">
                  আপনার নিবন্ধিত অ্যাকাউন্টের বিবরণ:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">লগইন জিমেইল:</span>
                    <span className="font-semibold text-slate-800 break-all">{email.to}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">অ্যাকাউন্টের ধরন:</span>
                    <span className="font-semibold text-emerald-700">ভেরিফাইড কাস্টমার</span>
                  </div>
                </div>
              </div>

              {/* SMS Notification simulation */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-700 leading-snug">
                  <strong className="text-amber-900 block mb-0.5">মোবাইল SMS বার্তা প্রেরিত:</strong>
                  &quot;Somadhan Point: প্রিয় {email.toName}, আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে। আমাদের সাথে কেনাকাটা করার জন্য ধন্যবাদ!&quot;
                </div>
              </div>
            </div>
          )}

          {/* Type 2: Password Reset OTP Email */}
          {email.type === 'reset_password' && (
            <div className="space-y-4">
              <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-rose-100 text-[#990000] mx-auto flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  পাসওয়ার্ড রিসেট ভেরিফিকেশন কোড (OTP)
                </h4>
                <p className="text-xs text-slate-600">
                  নিচের ৬ সংখ্যার ওটিপি কোডটি ব্যবহার করে আপনার নতুন পাসওয়ার্ড সেট করুন:
                </p>

                {/* Big OTP Code Box */}
                {email.otpCode && (
                  <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-[#990000] shadow-sm my-2">
                    <span className="font-mono text-2xl font-black text-[#990000] tracking-widest">
                      {email.otpCode}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyOtp}
                      className="ml-2 text-xs font-bold text-slate-600 hover:text-[#990000] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copied ? 'কপি হয়েছে!' : 'কপি ও পেস্ট'}</span>
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-slate-400">এই কোডের মেয়াদ ১৫ মিনিট পর্যন্ত থাকবে।</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                <span className="font-bold text-slate-700 block mb-1">নিরাপত্তা সতর্কতা:</span>
                আপনি যদি পাসওয়ার্ড রিসেটের অনুরোধ না করে থাকেন, তবে এই ইমেইলটি উপেক্ষা করুন এবং আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।
              </div>
            </div>
          )}

          {/* Type 3: Password Changed Confirmation Email */}
          {email.type === 'password_changed' && (
            <div className="space-y-3">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  পাসওয়ার্ড সফলভাবে আপডেট হয়েছে!
                </h4>
                <p className="text-xs text-slate-600">
                  আপনার Somadhan Point অ্যাকাউন্টের পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে এবং আপনার নতুন পাসওয়ার্ড এখন সক্রিয়।
                </p>
              </div>
            </div>
          )}

          {/* Email Footer */}
          <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center leading-relaxed">
            <p>© {new Date().getFullYear()} {settings.siteName}. সর্বস্বত্ব সংরক্ষিত।</p>
            <p>হটলাইন: {settings.phone1 || '01982708789'} | ইমেইল: {settings.email || 'support@somadhanpoint.com'}</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 flex items-center justify-between">
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>জিমেইল ইনবক্সে রিসিভ হয়েছে</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            বুঝেছি / সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
