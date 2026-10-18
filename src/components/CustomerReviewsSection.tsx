import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { getPublicApprovedReviews, ReviewItem } from '../utils/reviewSync';

const AVATAR_COLORS = [
  'bg-[#990000]',
  'bg-[#f59e0b]',
  'bg-[#7f1d1d]',
  'bg-[#2563eb]',
  'bg-[#059669]',
  'bg-[#7c3aed]',
];

export const CustomerReviewsSection: React.FC = () => {
  const { settings } = useStoreSettings();
  const [approvedReviews, setApprovedReviews] = useState<ReviewItem[]>(() =>
    getPublicApprovedReviews()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setApprovedReviews(getPublicApprovedReviews());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('reviews-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('reviews-updated', handleUpdate);
    };
  }, []);

  // Display top 3-6 approved reviews
  const displayReviews = approvedReviews.slice(0, 6);

  if (displayReviews.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          আমাদের কাস্টমার রিভিউ
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayReviews.map((rev, idx) => {
          const avatarBg = AVATAR_COLORS[idx % AVATAR_COLORS.length];
          const initialLetter = (rev.reviewerName || 'C').charAt(0).toUpperCase();

          return (
            <div
              key={rev.id || idx}
              className="bg-white rounded border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Header: Avatar, Name & Stars */}
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div
                    className={`w-7 h-7 rounded-full ${avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                  >
                    {initialLetter}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{rev.reviewerName}</span>
                </div>

                {/* Stars */}
                <div className="flex text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-[11px] text-slate-600 mb-3 italic">
                  "{rev.reviewComment}"
                </p>
              </div>

              {/* Mobile screenshot mockup */}
              <div className="w-full h-36 bg-slate-50 rounded border border-slate-200 flex flex-col items-center justify-center p-2 relative overflow-hidden">
                <div className="w-28 h-full bg-white rounded-t-lg shadow-sm border border-slate-300 p-2 flex flex-col justify-between text-[7px] text-slate-600">
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
                  <div className="w-full text-center text-slate-400 font-mono text-[6px]">
                    Verified Order ✓
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
