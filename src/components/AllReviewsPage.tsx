import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Trash2,
  Star,
  X,
  CheckCircle2,
  MessageSquare,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Check,
  Filter
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';
import {
  ReviewItem,
  loadStoredReviews,
  saveStoredReviews,
  approveReview,
  unapproveReview,
  deleteReviewItem,
} from '../utils/reviewSync';

interface AllReviewsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllReviewsPage: React.FC<AllReviewsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);

  // New review form
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newReviewerPhone, setNewReviewerPhone] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newProductName, setNewProductName] = useState('');

  // Reviews state with sync
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>(() => loadStoredReviews());

  // Listen to reviews-updated event
  useEffect(() => {
    const handleUpdate = () => {
      setReviewsList(loadStoredReviews());
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('reviews-updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('reviews-updated', handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = (id: string, name: string) => {
    approveReview(id);
    setReviewsList(loadStoredReviews());
    showToast(`"${name}" এর রিভিউটি সফলভাবে অনুমোদিত হয়েছে এবং এখন পাবলিক প্লেসে দেখা যাচ্ছে!`);
    triggerGlobalSuccessModal({
      title: 'রিভিউ অনুমোদিত হয়েছে!',
      message: `গ্রাহক "${name}" এর রিভিউটি সুপার অ্যাডমিন অনুমোদন করেছেন। এখন সকল ক্রেতা এটি দেখতে পাবেন।`,
    });
  };

  const handleUnapprove = (id: string, name: string) => {
    unapproveReview(id);
    setReviewsList(loadStoredReviews());
    showToast(`"${name}" এর রিভিউ স্থগিত করা হয়েছে (পাবলিক প্লেস থেকে সরানো হয়েছে)।`);
  };

  const confirmDelete = () => {
    if (!reviewToDelete) return;
    const name = reviewToDelete.reviewerName;
    deleteReviewItem(reviewToDelete.id);
    setReviewsList(loadStoredReviews());
    setReviewToDelete(null);
    showToast(`"${name}" এর রিভিউটি স্থায়ীভাবে মুছে ফেলা হয়েছে!`);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      productName: newProductName.trim() || undefined,
      reviewerName: newReviewerName.trim(),
      reviewerPhone: newReviewerPhone.trim() || '—',
      rating: Number(newRating),
      reviewComment: newComment.trim(),
      type: newProductName.trim() ? 'Product' : 'Global',
      status: 'Approved', // Manually added by admin is approved
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    const updated = [newRev, ...reviewsList];
    saveStoredReviews(updated);
    setReviewsList(updated);
    setIsAddModalOpen(false);
    setNewReviewerName('');
    setNewReviewerPhone('');
    setNewComment('');
    setNewProductName('');
    showToast('নতুন রিভিউ সফলভাবে যুক্ত ও অনুমোদিত হয়েছে!');
    triggerGlobalSuccessModal({
      title: 'রিভিউ যুক্ত হয়েছে!',
      message: `গ্রাহক "${newRev.reviewerName}" এর ৫-স্টার রিভিউ সফলভাবে সিস্টেমে যুক্ত ও প্রকাশিত হয়েছে।`,
    });
  };

  const pendingCount = reviewsList.filter((r) => r.status === 'Pending').length;
  const approvedCount = reviewsList.filter((r) => r.status === 'Approved').length;

  const filteredReviews = reviewsList.filter((r) => {
    // Status Filter
    if (statusFilter === 'pending' && r.status !== 'Pending') return false;
    if (statusFilter === 'approved' && r.status !== 'Approved') return false;

    // Search Query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.reviewerName.toLowerCase().includes(q) ||
      (r.reviewerPhone && r.reviewerPhone.includes(q)) ||
      (r.reviewComment && r.reviewComment.toLowerCase().includes(q)) ||
      (r.productName && r.productName.toLowerCase().includes(q))
    );
  });

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
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                All Reviews (রিভিউ ম্যানেজমেন্ট)
              </h1>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white animate-pulse">
                  {pendingCount} টি অপেক্ষমাণ
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              কাস্টমারদের দেওয়া রিভিউ সুপার অ্যাডমিন অ্যাপ্রুভ করলে তবেই পাবলিক প্লেসে প্রদর্শিত হবে
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reviews..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-40 sm:w-64"
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

        {/* Status Filter Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>সকল রিভিউ ({reviewsList.length})</span>
          </button>

          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>অপেক্ষমাণ / অনুমোদন প্রয়োজন ({pendingCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'approved'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>অনুমোদিত / পাবলিক লাইভ ({approvedCount})</span>
          </button>
        </div>

        {/* 3. Table */}
        <div className="p-4 sm:p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                {/* Dark Navy Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-28">Product</th>
                    <th className="py-3 px-4 min-w-[150px]">Reviewer (ক্রেতা)</th>
                    <th className="py-3 px-4 w-28">Rating</th>
                    <th className="py-3 px-4 min-w-[200px]">Review (মন্তব্য)</th>
                    <th className="py-3 px-4 w-20 text-center">Type</th>
                    <th className="py-3 px-4 w-32 text-center">Status (স্ট্যাটাস)</th>
                    <th className="py-3 px-4 w-28 hidden md:table-cell">Date</th>
                    <th className="py-3 px-4 text-center min-w-[160px]">Options (অ্যাকশন)</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-500">
                        {statusFilter === 'pending'
                          ? 'বর্তমানে কোনো অপেক্ষমাণ রিভিউ নেই। সকল রিভিউ অনুমোদিত।'
                          : 'কোনো রিভিউ পাওয়া যায়নি।'}
                      </td>
                    </tr>
                  ) : (
                    filteredReviews.map((rev) => (
                      <tr
                        key={rev.id}
                        className={`transition-colors ${
                          rev.status === 'Pending'
                            ? 'bg-amber-50/50 hover:bg-amber-50'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Product */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 line-clamp-1">
                            {rev.productName || '—'}
                          </span>
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
                                  i < rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </td>

                        {/* Review Comment */}
                        <td className="py-3 px-4 text-slate-700">
                          <p className="line-clamp-2 italic font-medium">
                            "{rev.reviewComment || '—'}"
                          </p>
                        </td>

                        {/* Type Badge */}
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                            {rev.type}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4 text-center">
                          {rev.status === 'Approved' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>অনুমোদিত</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>অপেক্ষমাণ</span>
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-3 px-4 text-slate-500 font-medium hidden md:table-cell whitespace-nowrap">
                          {rev.date}
                        </td>

                        {/* Options: APPROVE / UNAPPROVE / DELETE */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {rev.status === 'Pending' ? (
                              <button
                                onClick={() => handleApprove(rev.id, rev.reviewerName)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold inline-flex items-center gap-1 transition-all cursor-pointer shadow-xs hover:shadow-md"
                                title="এই রিভিউটি অনুমোদন করে পাবলিক প্লেসে প্রকাশ করুন"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                                <span>অ্যাপ্রুভ করুন</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUnapprove(rev.id, rev.reviewerName)}
                                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                                title="রিভিউটি স্থগিত করুন"
                              >
                                <Clock className="w-3 h-3" />
                                <span>স্থগিত</span>
                              </button>
                            )}

                            <button
                              onClick={() => setReviewToDelete(rev)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-[11px] font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="রিভিউ মুছে ফেলুন"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
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
              <h3 className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>নতুন রিভিউ তৈরি করুন (সুপার অ্যাডমিন)</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
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
                <label className="block font-bold text-slate-700 mb-1">মোবাইল নাম্বার</label>
                <input
                  type="tel"
                  value={newReviewerPhone}
                  onChange={(e) => setNewReviewerPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রোডাক্টের নাম (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম কটন পাঞ্জাবি"
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
                  <option value={5}>5 Stars (★★★★★) - চমৎকার</option>
                  <option value={4}>4 Stars (★★★★☆) - ভালো</option>
                  <option value={3}>3 Stars (★★★☆☆) - সন্তোষজনক</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">মন্তব্য (রিভিউ) *</label>
                <textarea
                  rows={3}
                  required
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="গ্রাহকের অভিজ্ঞতা বা মতামত লিখুন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs cursor-pointer"
                >
                  সংরক্ষণ ও প্রকাশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CONFIRM DELETE MODAL                                      */}
      {/* ========================================================= */}
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm font-bold">রিভিউ মুছে ফেলার নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setReviewToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-slate-700 space-y-1.5">
                <p className="font-bold text-red-900 text-sm">
                  আপনি কি নিশ্চিত যে এই রিভিউটি মুছে ফেলতে চান?
                </p>
                <p className="font-semibold text-slate-800 text-xs">
                  রিভিউ প্রদানকারী: "{reviewToDelete.reviewerName}"
                </p>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  মন্তব্য: "{reviewToDelete.reviewComment}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setReviewToDelete(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
