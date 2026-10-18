import React, { useState } from 'react';
import { ShoppingBag, MessageSquare, Send, X, Phone } from 'lucide-react';

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    {
      sender: 'agent',
      text: 'আসসালামু আলাইকুম! কোনো পণ্য বা অর্ডার সম্পর্কে জানতে চাইলে এখানে লিখুন অথবা কল করুন 01982708789',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

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
          text: 'ধন্যবাদ! আমাদের কাস্টমার সাপোর্ট টিম দ্রুত আপনার সাথে যোগাযোগ করবে। সরাসরি ফোনে কথা বলতে ডায়াল করুন 01982708789',
        },
      ]);
    }, 700);
  };

  return (
    <>
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
          <div className="bg-[#990000] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                CS
              </div>
              <div>
                <h4 className="text-xs font-bold">কাস্টমার সাপোর্ট</h4>
                <p className="text-[10px] text-red-200">অনলাইন আছেন</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

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
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2 bg-red-50 text-center border-t border-red-100 text-[11px] text-[#990000] font-bold">
            <a href="tel:01982708789" className="flex items-center justify-center gap-1">
              <Phone className="w-3 h-3" />
              <span>কল করুন: 01982708789</span>
            </a>
          </div>

          <form onSubmit={handleSend} className="p-2 border-t border-slate-200 bg-white flex items-center gap-1.5">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="একটি বার্তা লিখুন..."
              className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded bg-[#990000] text-white flex items-center justify-center hover:bg-[#800000]"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
