import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { storage } from '../services/storage';

export const FAQSection: React.FC = () => {
  const faqs = storage.getFAQs();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="py-12 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          FAQ
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          সাধারণ প্রশ্ন ও উত্তর
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          আপনার যা জানার প্রয়োজন — সংক্ষেপে ও পরিষ্কারভাবে
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="rounded-2xl bg-white dark:bg-[#090E1B] border border-slate-200 dark:border-white/[0.08] shadow-xs dark:shadow-none overflow-hidden transition"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-indigo-300 transition"
              >
                <span>{faq.questionBn}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-blue-600 dark:text-indigo-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/[0.04]">
                  {faq.answerBn}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
