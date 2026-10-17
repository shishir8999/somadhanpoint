import React, { useState } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Star,
  X,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

export interface ReviewRow {
  id: string;
  productName?: string;
  reviewerName: string;
  reviewerPhone: string;
  rating: number;
  reviewComment?: string;
  type: string;
  status: 'Verified' | 'Pending';
  date: string;
}

interface AllReviewsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllReviewsPage: React.FC<AllReviewsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New review form
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerPhone, setNewReviewerPhone] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  // Exact 4 rows from Screenshot 4
  const [reviewsList, setReviewsList] = useState<ReviewRow[]>([
    {
      id: 'rev-1',
      reviewerName: 'samsul alam',
      reviewerPhone: '01992837746',
      rating: 5,
      reviewComment: 'খুবই চমৎকার প্রোডাক্ট ও দ্রুত ডেলিভারি পেয়েছি।',
      type: 'Global',
      status: 'Verified',
      date: 'September 29, 2026',
    },
    {
      id: 'rev-2',
      reviewerName: 'Adiba',
      reviewerPhone: '01638474555',
      rating: 5,
      reviewComment: 'কাপড়ের কোয়ালিটি অনেক ভালো, ধন্যবাদ।',
      type: 'Global',
      status: 'Verified',
      date: 'September 29, 2026',
    },
    {
      id: 'rev-3',
      reviewerName: 'Shajidur Rahman',
      reviewerPhone: '01688444555',
      rating: 5,
      reviewComment: 'অসাধারণ সার্ভিস, রেকমেন্ডেড শপ।',
      type: 'Global',
      status: 'Verified',
      date: 'September 29, 2026',
    },
    {
      id: 'rev-4',
      reviewerName: 'korim uddin',
      reviewerPhone: '01982708789',
      rating: 5,
      reviewComment: '১০০% অরিজিনাল পণ্য হাতে পেয়েছি।',
      type: 'Global',
      status: 'Verified',
      date: 'September 29, 2026',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerPhone.trim()) return;

    const newRev: ReviewRow = {
      id: `rev-${Date.now()}`,
      reviewerName: newReviewerName.trim(),
      reviewerPhone: newReviewerPhone.trim(),
      rating: Number(newRating),
      reviewComment: newComment.trim(),
      type: 'Global',
      status: 'Verified',
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    setReviewsList((prev) => [newRev, ...prev]);
    setIsAddModalOpen(false);
    setNewReviewerName('');
    setNewReviewerPhone('');
    setNewComment('');
    showToast(`নতুন রিভিউ সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleDeleteReview = (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" এর রিভিউ মুছে ফেলতে চান?`)) {
      setReviewsList((prev) => prev.filter((r) => r.id !== id));
      showToast(`রিভিউ মুছে ফেলা হয়েছে!`);
    }
  };

  const filteredReviews = reviewsList.filter((r) =>
    r.reviewerName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    r.reviewerPhone.includes(searchQuery.trim())
  );

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="reviews"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Page Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Search Row */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            All Reviews
          </h1>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-64"
              />
            </div>

            {/* Red + Add Review Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Review</span>
            </button>
          </div>
        </header>

        {/* 3. Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 min-w-[120px]">Product</th>
                    <th className="py-3 px-4 min-w-[200px]">Reviewer</th>
                    <th className="py-3 px-4 min-w-[140px]">Rating</th>
                    <th className="py-3 px-4 min-w-[180px]">Review</th>
                    <th className="py-3 px-4 min-w-[100px]">Type</th>
                    <th className="py-3 px-4 min-w-[110px]">Status</th>
                    <th className="py-3 px-4 min-w-[160px]">Date</th>
                    <th className="py-3 px-4 text-center min-w-[120px]">Options</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded border border-slate-200 bg-slate-100 flex items-center justify-center text-slate-400">
                            <span className="text-[10px]">—</span>
                          </div>
                          <span className="text-slate-400">—</span>
                        </div>
                      </td>

                      {/* Reviewer */}
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">
                            {rev.reviewerName}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {rev.reviewerPhone}
                          </span>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Review Comment */}
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {rev.reviewComment || '—'}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-600">
                          {rev.type}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          {rev.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-4 text-slate-500 font-medium">
                        {rev.date}
                      </td>

                      {/* Options: Delete */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteReview(rev.id, rev.reviewerName)}
                          className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD REVIEW                                         */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-3.5 flex items-center justify-between">
              <h3 className="text-sm font-bold">নতুন রিভিউ যুক্ত করুন</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">গ্রাহকের নাম *</label>
                <input
                  type="text"
                  required
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিব হোসেন"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নাম্বার *</label>
                <input
                  type="tel"
                  required
                  value={newReviewerPhone}
                  onChange={(e) => setNewReviewerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্টার রেটিং</label>
                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded focus:outline-none"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মন্তব্য (রিভিউ)</label>
                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="গ্রাহকের মন্তব্য লিখুন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs"
                >
                  রিভিউ সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
