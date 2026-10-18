import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  MessageSquare,
  Send,
  X,
  Phone,
  Settings as SettingsIcon,
  Check,
  Edit2
} from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { saveSettingsToDatabase } from '../utils/apiSync';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';

interface FloatingButtonsProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
}) => {
  const { settings, updateSettings } = useStoreSettings();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Resolved dynamic values
  const supportPhone = settings.supportPhone || settings.phone1 || '01982708789';
  const supportTitle = settings.supportTitle || 'কাস্টমার সাপোর্ট';
  const welcomeText =
    settings.supportWelcomeMessage ||
    `আসসালামু আলাইকুম! কোনো পণ্য বা অর্ডার সম্পর্কে জানতে চাইলে এখানে লিখুন অথবা কল করুন ${supportPhone}`;
  const replyText =
    settings.supportReplyMessage ||
    `ধন্যবাদ! আমাদের কাস্টমার সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে। সরাসরি ফোনে কথা বলতে ডায়াল করুন ${supportPhone}`;
  const callButtonLabel = settings.supportCallButtonText || 'কল করুন';

  // Edit form state
  const [editWelcome, setEditWelcome] = useState(welcomeText);
  const [editPhone, setEditPhone] = useState(supportPhone);
  const [editCallLabel, setEditCallLabel] = useState(callButtonLabel);
  const [editReply, setEditReply] = useState(replyText);
  const [editTitle, setEditTitle] = useState(supportTitle);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Messages state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: welcomeText,
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  // Update welcome message if settings change
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].sender === 'agent') {
        return [{ sender: 'agent', text: welcomeText }];
      }
      return prev;
    });
    setEditWelcome(welcomeText);
    setEditPhone(supportPhone);
    setEditCallLabel(callButtonLabel);
    setEditReply(replyText);
    setEditTitle(supportTitle);
  }, [welcomeText, supportPhone, callButtonLabel, replyText, supportTitle]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: inputMsg }]);
    setInputMsg('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: replyText,
        },
      ]);
    }, 700);
  };

  const handleSaveSupportSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...settings,
      supportTitle: editTitle.trim() || 'কাস্টমার সাপোর্ট',
      supportWelcomeMessage: editWelcome.trim(),
      supportPhone: editPhone.trim(),
      supportCallButtonText: editCallLabel.trim() || 'কল করুন',
      supportReplyMessage: editReply.trim(),
    };

    updateSettings(updated);
    saveSettingsToDatabase(updated);

    // Update current active message
    setMessages([
      {
        sender: 'agent',
        text: editWelcome.trim(),
      },
    ]);

    setIsEditModalOpen(false);
    showToast('কাস্টমার সাপোর্ট বার্তা ও ফোন সফলভাবে সেভ হয়েছে!');
    triggerGlobalSuccessModal({
      title: 'সাপোর্ট বার্তা সেভ হয়েছে!',
      message: 'চ্যাটবক্সের স্বাগতম মেসেজ ও কল নম্বর সফলভাবে আপডেট করা হয়েছে।',
    });
  };

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Floating Cart Tab on Right Edge (hidden on mobile, bottom nav has cart) */}
      <div
        onClick={onOpenCart}
        className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#990000] hover:bg-[#800000] text-white p-2 rounded-l-md shadow-xl flex-col items-center cursor-pointer transition-transform hover:-translate-x-1"
      >
        <div className="relative mb-1">
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute -top-2 -left-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-tighter">
          ৳{cartTotal}
        </span>
      </div>

      {/* 2. Floating Red Chat Bubble on Bottom Right */}
      <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-[#990000] hover:bg-[#800000] text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          title="Live Chat Support"
        >
          <MessageSquare className="w-5 sm:w-6 h-5 sm:h-6 fill-current" />
        </button>
      </div>

      {/* Live Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-28 sm:bottom-20 right-4 sm:right-6 z-50 w-80 sm:w-88 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#990000] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                CS
              </div>
              <div>
                <h4 className="text-xs font-bold">{supportTitle}</h4>
                <p className="text-[10px] text-red-200">অনলাইন আছেন</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Quick Settings / Edit Button */}
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                title="বার্তা ও ফোন নম্বর পরিবর্তন করুন"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 bg-slate-50 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg max-w-[85%] ${
                    m.sender === 'user'
                      ? 'bg-[#990000] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Call Support Banner with Clickable Tel Link */}
          <div className="p-2 bg-red-50 text-center border-t border-red-100 text-[11px] text-[#990000] font-bold">
            <a
              href={`tel:${supportPhone}`}
              className="flex items-center justify-center gap-1 hover:underline"
            >
              <Phone className="w-3 h-3" />
              <span>{callButtonLabel}: {supportPhone}</span>
            </a>
          </div>

          {/* Input Box */}
          <form
            onSubmit={handleSend}
            className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="একটি বার্তা লিখুন..."
              className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded bg-[#990000] text-white flex items-center justify-center hover:bg-[#800000] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* QUICK EDIT MODAL: CHANGE SUPPORT MESSAGE & PHONE          */}
      {/* ========================================================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">কাস্টমার সাপোর্ট বার্তা ও ফোন পরিবর্তন</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupportSettings} className="p-5 space-y-4 text-xs">
              {/* Header Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সাপোর্ট হেডার টাইটেল
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="যেমন: কাস্টমার সাপোর্ট"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Welcome Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  স্বাগতম মেসেজ (Welcome Message) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editWelcome}
                  onChange={(e) => setEditWelcome(e.target.value)}
                  placeholder="গ্রাহক চ্যাট ওপেন করলে এই মেসেজটি দেখতে পাবেন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] leading-relaxed"
                />
                <p className="text-[10px] text-slate-500 mt-0.5">
                  যেমন: আসসালামু আলাইকুম! কোনো পণ্য বা অর্ডার সম্পর্কে জানতে চাইলে এখানে লিখুন অথবা কল করুন {editPhone}
                </p>
              </div>

              {/* Support Phone Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  সাপোর্ট কল নম্বর (Phone Number) *
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="যেমন: 01982708789"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Call Button Text */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  কল বাটন টেক্সট (Call Button Label)
                </label>
                <input
                  type="text"
                  value={editCallLabel}
                  onChange={(e) => setEditCallLabel(e.target.value)}
                  placeholder="যেমন: কল করুন"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                />
              </div>

              {/* Auto Reply Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  অটো রিপ্লাই বার্তা (গ্রাহক মেসেজ পাঠানোর পর)
                </label>
                <textarea
                  rows={2}
                  value={editReply}
                  onChange={(e) => setEditReply(e.target.value)}
                  placeholder="গ্রাহক মেসেজ পাঠানোর পর যে স্বয়ংক্রিয় রিপ্লাই পাবেন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
