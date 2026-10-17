import React, { useState } from 'react';
import {
  FileText,
  Save,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  CheckCircle2,
  Info,
  Sparkles,
  Phone,
  ShieldCheck,
  Truck,
  RefreshCw,
  HelpCircle,
  Eye,
  Edit3
} from 'lucide-react';
import { useCustomPages, CustomPageData, PageSection } from '../context/CustomPagesContext';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface CustomPagesAdminPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
  onViewLivePage?: (pageId: string) => void;
}

export const CustomPagesAdminPage: React.FC<CustomPagesAdminPageProps> = ({
  onNavigate,
  onBackToStore,
  onViewLivePage,
}) => {
  const { pages, updatePage, resetPage, resetAllPages } = useCustomPages();
  const [selectedPageId, setSelectedPageId] = useState<string>('about_us');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentPage = pages[selectedPageId] || pages.about_us;

  // Form states initialized with currently selected page
  const [title, setTitle] = useState(currentPage.title);
  const [subtitle, setSubtitle] = useState(currentPage.subtitle);
  const [lastUpdated, setLastUpdated] = useState(currentPage.lastUpdated);
  const [content, setContent] = useState(currentPage.content);
  const [sections, setSections] = useState<PageSection[]>(currentPage.sections || []);

  // When changing selected page, sync the form states
  const handleSelectPage = (id: string) => {
    setSelectedPageId(id);
    const target = pages[id] || pages.about_us;
    setTitle(target.title);
    setSubtitle(target.subtitle);
    setLastUpdated(target.lastUpdated);
    setContent(target.content);
    setSections(target.sections || []);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    updatePage(selectedPageId, {
      title,
      subtitle,
      lastUpdated,
      content,
      sections,
    });
    showToast(`'${title}' পেইজের পরিবর্তন সফলভাবে সংরক্ষিত ও লাইভ হয়েছে!`);
  };

  const handleResetCurrent = () => {
    if (confirm(`আপনি কি '${currentPage.title}' পেইজের তথ্য ডিফল্টে রিসেট করতে চান?`)) {
      resetPage(selectedPageId);
      setTimeout(() => {
        const target = pages[selectedPageId];
        if (target) {
          setTitle(target.title);
          setSubtitle(target.subtitle);
          setLastUpdated(target.lastUpdated);
          setContent(target.content);
          setSections(target.sections || []);
        }
      }, 50);
      showToast('পেইজটি ডিফল্ট তথ্যে রিসেট করা হয়েছে।');
    }
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        heading: 'নতুন সেকশন শিরোনাম',
        body: 'এখানে আপনার সেকশনের বিস্তারিত বর্ণনা লিখুন...',
        icon: 'CheckCircle2',
      },
    ]);
  };

  const handleRemoveSection = (idx: number) => {
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionChange = (idx: number, field: keyof PageSection, val: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  const pageNavItems = [
    { id: 'about_us', label: 'আমাদের সম্পর্কে (About Us)', icon: Sparkles },
    { id: 'contact_us', label: 'যোগাযোগ (Contact Us)', icon: Phone },
    { id: 'privacy_policy', label: 'প্রাইভেসি পলিসি (Privacy Policy)', icon: ShieldCheck },
    { id: 'terms_conditions', label: 'শর্তাবলী (Terms & Conditions)', icon: FileText },
    { id: 'return_policy', label: 'রিটার্ন পলিসি (Return Policy)', icon: RefreshCw },
    { id: 'delivery_policy', label: 'ডেলিভারি পলিসি (Delivery Policy)', icon: Truck },
  ];

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased overflow-hidden">
      {/* Admin Sidebar */}
      <AdminSidebar
        activePage={'settings' as any}
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#990000] flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                পেইজ ম্যানেজমেন্ট ও এডিটর (Custom Pages Manager)
              </h1>
              <p className="text-xs text-slate-500">
                ফুটারের আমাদের সম্পর্কে, যোগাযোগ, প্রাইভেসি পলিসি, শর্তাবলী ও ডেলিভারি পেইজগুলো এডিট করুন
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onViewLivePage && (
              <button
                onClick={() => onViewLivePage(selectedPageId)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="লাইভ ওয়েবসাইটে দেখুন"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>লাইভ প্রিভিউ দেখুন</span>
              </button>
            )}
            <button
              onClick={handleResetCurrent}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="ডিফল্টে রিসেট করুন"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>ডিফল্ট রিসেট</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </button>
          </div>
        </header>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-[#111827] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Content Layout */}
        <div className="p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Pages List Selector */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-1">
              পেইজসমূহ নির্বাচন করুন
            </h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-2 space-y-1">
              {pageNavItems.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedPageId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPage(item.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-[#990000] text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#990000]'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Box */}
            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#990000]" />
                <span>অ্যাডমিন টিপস</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                এখানে যে তথ্য পরিবর্তন করবেন, তা সাথে সাথে ওয়েবসাইটের ফুটারের নির্দিষ্ট পেজে লাইভ আপডেট হয়ে যাবে।
              </p>
            </div>
          </div>

          {/* Right Column: Active Page Editor Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
              <div className="border-b pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {currentPage.title} - পেইজ এডিটর
                  </h2>
                  <p className="text-xs text-slate-500">
                    শিরোনাম, সাব-টাইটেল ও বিস্তারিত বিবরণ আপডেট করুন
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded">
                  ID: {selectedPageId}
                </span>
              </div>

              {/* Title & Subtitle Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">পেইজ শিরোনাম (Title) *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 font-bold focus:outline-none focus:border-[#990000]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সর্বশেষ আপডেট তারিখ</label>
                  <input
                    type="text"
                    value={lastUpdated}
                    onChange={(e) => setLastUpdated(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">সাব-টাইটেল বা ট্যাগলাইন (Subtitle)</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">মূল ভূমিকা / ভূমিকা বক্তব্য (Content / Intro)</label>
                <textarea
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#990000] leading-relaxed"
                />
              </div>
            </div>

            {/* Dynamic Sections Editor */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    সেকশনসমূহ ও বিষয়ভিত্তিক ধারা (Content Sections)
                  </h3>
                  <p className="text-xs text-slate-500">
                    প্রতিটি পয়েন্টের শিরোনাম ও বিস্তারিত প্যারাগ্রাফ এডিট করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddSection}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-[#990000] border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সেকশন যোগ করুন</span>
                </button>
              </div>

              <div className="space-y-4">
                {sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-[#990000] bg-rose-100 px-2 py-0.5 rounded">
                        সেকশন #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSection(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="এই সেকশন মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block font-semibold text-slate-700 mb-1">সেকশন শিরোনাম</label>
                        <input
                          type="text"
                          value={sec.heading}
                          onChange={(e) => handleSectionChange(idx, 'heading', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-[#990000]"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">আইকন ধরণ</label>
                        <select
                          value={sec.icon || 'CheckCircle2'}
                          onChange={(e) => handleSectionChange(idx, 'icon', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#990000]"
                        >
                          <option value="CheckCircle2">CheckCircle (চেক)</option>
                          <option value="ShieldCheck">Shield (নিরাপত্তা)</option>
                          <option value="Sparkles">Sparkles (তারা/বিশেষ)</option>
                          <option value="Clock">Clock (ঘড়ি/সময়)</option>
                          <option value="Truck">Truck (কুরিয়ার/ডেলিভারি)</option>
                          <option value="Package">Package (প্যাকেজ)</option>
                          <option value="RefreshCw">Refresh (রিটার্ন/রিফান্ড)</option>
                          <option value="Lock">Lock (লক/গোপনীয়তা)</option>
                          <option value="FileText">FileText (ডকুমেন্ট)</option>
                          <option value="CreditCard">CreditCard (পেমেন্ট)</option>
                          <option value="MapPin">MapPin (ঠিকানা)</option>
                          <option value="Phone">Phone (ফোন)</option>
                          <option value="Mail">Mail (ইমেইল)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 text-xs mb-1">বিস্তারিত বিবরণ (Body)</label>
                      <textarea
                        rows={3}
                        value={sec.body}
                        onChange={(e) => handleSectionChange(idx, 'body', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-[#990000] leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Save Action */}
              <div className="pt-4 border-t flex justify-end">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-[#990000] hover:bg-[#800000] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>পরিবর্তন সংরক্ষণ করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
