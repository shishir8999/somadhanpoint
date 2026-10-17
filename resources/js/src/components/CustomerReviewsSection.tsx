import React from 'react';
import { Star } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';

export const CustomerReviewsSection: React.FC = () => {
  const { settings } = useStoreSettings();
  const reviews = [
    {
      avatarBg: 'bg-[#990000]',
      letter: 'K',
      name: 'korim uddin',
      comment: 'পণ্যটি হাতে পেয়েছি, চমৎকার কোয়ালিটি। ধন্যবাদ সেলারকে!',
    },
    {
      avatarBg: 'bg-[#f59e0b]',
      letter: 'S',
      name: 'Shajidur Rahman',
      comment: 'খুব দ্রুত ডেলিভারি পেয়েছি। প্রোডাক্ট হুবহু ছবির মতো।',
    },
    {
      avatarBg: 'bg-[#7f1d1d]',
      letter: 'A',
      name: 'Adiba',
      comment: 'কটন খিমার সেটটি দারুণ হয়েছে, কাপড়ের মান অসাধারণ।',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          আমাদের কাস্টমার রিভিউ
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="bg-white rounded border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
          >
            {/* Header: Avatar, Name & Stars */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`w-7 h-7 rounded-full ${rev.avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                >
                  {rev.letter}
                </div>
                <span className="text-xs font-bold text-slate-800">{rev.name}</span>
              </div>

              {/* 5 Golden Stars */}
              <div className="flex text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-[11px] text-slate-600 mb-3 italic">
                "{rev.comment}"
              </p>
            </div>

            {/* Mobile screenshot mockup as shown in the screenshot */}
            <div className="w-full h-40 bg-slate-50 rounded border border-slate-200 flex flex-col items-center justify-center p-2 relative overflow-hidden">
              <div className="w-24 h-full bg-white rounded-t-lg shadow-sm border border-slate-300 p-1.5 flex flex-col justify-between text-[6px] text-slate-600">
                <div className="w-full h-2 bg-slate-200 rounded-xs mb-1"></div>
                <div className="space-y-1">
                  <div className="p-1 bg-green-50 text-emerald-800 rounded border border-green-200">
                    <p className="font-bold">ডেলিভারি সফল!</p>
                    <p>পার্সেল রিসিভ করেছি।</p>
                  </div>
                  <div className="p-1 bg-slate-100 rounded">
                    <p>ধন্যবাদ {settings.siteName}</p>
                  </div>
                </div>
                <div className="w-full text-center text-slate-400 font-mono">
                  Verified Order
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
