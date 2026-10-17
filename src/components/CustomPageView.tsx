import React, { useState } from 'react';
import {
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  RefreshCw,
  Lock,
  FileText,
  CreditCard,
  XCircle,
  Sparkles,
  Target,
  Send,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { useCustomPages } from '../context/CustomPagesContext';
import { useStoreSettings } from '../context/StoreSettingsContext';

interface CustomPageViewProps {
  pageId: 'about_us' | 'contact_us' | 'privacy_policy' | 'terms_conditions' | 'return_policy' | 'delivery_policy';
  onBackToHome: () => void;
  onGoToProducts: () => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({
  pageId,
  onBackToHome,
  onGoToProducts,
}) => {
  const { getPage } = useCustomPages();
  const { settings } = useStoreSettings();
  const page = getPage(pageId);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !contactMessage.trim()) return;

    setFormSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactPhone('');
      setContactSubject('');
      setContactMessage('');
    }, 1500);
  };

  const getSectionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#990000]" />;
      case 'Target':
        return <Target className="w-5 h-5 text-[#990000]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-amber-600" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'Package':
        return <Package className="w-5 h-5 text-rose-600" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-teal-600" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-blue-600" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-emerald-600" />;
      case 'XCircle':
        return <XCircle className="w-5 h-5 text-rose-500" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5 text-[#990000]" />;
      case 'Phone':
        return <Phone className="w-5 h-5 text-emerald-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-green-600" />;
      case 'Mail':
        return <Mail className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-[#990000]" />;
    }
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-16">
      {/* Breadcrumb strip */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <button
            onClick={onBackToHome}
            className="hover:text-[#990000] font-medium transition-colors cursor-pointer"
          >
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">{page.title}</span>
        </div>
      </div>

      {/* Hero Banner Header */}
      <div className="bg-gradient-to-r from-[#990000] via-[#800000] to-[#660000] text-white py-10 px-4 text-center relative overflow-hidden shadow-sm">
        <div className="max-w-3xl mx-auto relative z-10 space-y-2">
          <span className="inline-block bg-white/15 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold text-rose-100 border border-white/20">
            সর্বশেষ আপডেট: {page.lastUpdated}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {page.title}
          </h1>
          <p className="text-xs sm:text-sm text-rose-100/90 max-w-xl mx-auto leading-relaxed">
            {page.subtitle}
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        {/* Intro Card */}
        <div className="bg-white rounded-xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#990000] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {page.title} সম্পর্কিত সাধারণ বিবরণ
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {page.content}
              </p>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {page.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getSectionIcon(section.icon)}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    {section.heading}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-11">
                  {section.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Specialized Interactive Section for Contact Page */}
        {pageId === 'contact_us' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            {/* Direct Channels Box */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#990000]" />
                <span>সরাসরি যোগাযোগ করুন</span>
              </h3>
              <p className="text-xs text-slate-500">
                আমাদের কাস্টমার রিপ্রেজেন্টেটিভরা তাৎক্ষণিক সহায়তা দিতে অনলাইন আছেন।
              </p>

              <div className="space-y-3 pt-1">
                <a
                  href={`tel:${settings.phone1 || '01982708789'}`}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">হটলাইনে কল দিন</div>
                      <div className="text-xs font-mono font-bold text-emerald-700">
                        {settings.phone1 || '01982708789'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                    কল করুন →
                  </span>
                </a>

                <a
                  href={`https://wa.me/88${(settings.whatsapp1 || settings.phone1 || '01982708789').replace(/\D/g, '').replace(/^88/, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-lg bg-green-50/80 hover:bg-green-100 border border-green-200 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">হোয়াটসঅ্যাপে চ্যাট করুন</div>
                      <div className="text-xs text-green-700 font-semibold">তাৎক্ষণিক উত্তর পাবেন</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-700 group-hover:translate-x-1 transition-transform">
                    মেসেজ দিন →
                  </span>
                </a>

                <a
                  href={`mailto:${settings.email || 'shishirbarai01982708789@gmail.com'}`}
                  className="flex items-center justify-between p-3.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 border border-blue-200 transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">ইমেইল পাঠান</div>
                      <div className="text-xs text-blue-700 truncate max-w-[200px]">
                        {settings.email || 'shishirbarai01982708789@gmail.com'}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700 group-hover:translate-x-1 transition-transform">
                    ইমেইল →
                  </span>
                </a>
              </div>

              {/* Address Map Card */}
              <div className="mt-4 p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#990000]" />
                  <span>অফিস লোকেশন:</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {settings.address || 'সৌরভ কুঞ্জ, বেনারসি কমিউনিটি সেন্টার রোড, কদমতলী, ঢাকা ১২৩৬'}
                </p>
                <p className="text-slate-500 text-[10px] mt-1">
                  খোলা থাকে: শনিবার থেকে বৃহস্পতিবার (সকাল ৯টা - রাত ১০টা)
                </p>
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-2xs">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-[#990000]" />
                <span>আমাদের একটি বার্তা পাঠান</span>
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                যেকোনো অভিযোগ, পণ্যের অনুসন্ধান বা পরামর্শ নিচে লিখে পাঠান:
              </p>

              {formSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 animate-in fade-in">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে!</h4>
                  <p className="text-xs text-emerald-700">
                    আমাদের কাস্টমার সাপোর্ট টিম অতি দ্রুত আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 text-xs text-emerald-800 underline font-semibold cursor-pointer"
                  >
                    আরেকটি বার্তা পাঠান
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="যেমন: রহিম আহমেদ"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="যেমন: 01700000000"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">বিষয় (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="অর্ডার সংক্রান্ত / প্রোডাক্ট অনুসন্ধান / ডেলিভারি"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">আপনার বার্তা বা মেসেজ *</label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>মেসেজ পাঠান</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Bottom Fast Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold flex items-center gap-2 justify-center sm:justify-start">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>আমাদের আকর্ষণীয় পণ্যসমূহ দেখতে চান?</span>
            </h4>
            <p className="text-xs text-slate-300">
              সেরা ডিসকাউন্টে অরিজিনাল পণ্য অর্ডার করুন ক্যাশ অন ডেলিভারিতে।
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onGoToProducts}
              className="px-4 py-2 bg-[#990000] hover:bg-[#b30000] text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>পণ্যসমূহ দেখুন</span>
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              হোমে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
