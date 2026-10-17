import React from 'react';
import { Star, ShieldCheck, ThumbsUp } from 'lucide-react';
import { CustomerReview } from '../types';
import { storage } from '../services/storage';

export const CustomerReviews: React.FC = () => {
  const reviews = storage.getReviews();

  return (
    <div className="py-12 space-y-6">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>VERIFIED CUSTOMER REVIEWS</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          ✨ Real reviews from real customers
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          আমাদের সন্তুষ্ট গ্রাহকদের দেওয়া সতস্ফূর্ত ফিডব্যাক
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-2xl bg-white dark:bg-[#090E1B] border border-slate-200 dark:border-white/[0.08] flex flex-col justify-between space-y-3 shadow-xs dark:shadow-md hover:border-blue-400 dark:hover:border-white/20 transition"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 font-bold text-white text-xs flex items-center justify-center">
                    {rev.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{rev.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{rev.date}</div>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>

              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1">
                <ThumbsUp className="w-3 h-3 text-cyan-500" />
                <span>{rev.productName} রিকমেন্ডেড</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                "{rev.commentBn}"
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/[0.06] text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> ভেরিফাইড পার্চেজ
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
