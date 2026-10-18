/**
 * Centralized Review Management & Moderation Service
 * 
 * RULE: Any review submitted by a customer has status='Pending'
 * and is NEVER shown to the public until approved by Super Admin.
 */

export interface ReviewItem {
  id: string;
  productId?: string;
  productName?: string;
  reviewerName: string;
  reviewerPhone: string;
  rating: number;
  reviewComment: string;
  type: 'Global' | 'Product';
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

export const DEFAULT_INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    reviewerName: 'samsul alam',
    reviewerPhone: '01992837746',
    rating: 5,
    reviewComment: 'খুবই চমৎকার প্রোডাক্ট ও দ্রুত ডেলিভারি পেয়েছি।',
    type: 'Global',
    status: 'Approved',
    date: 'September 29, 2026',
  },
  {
    id: 'rev-2',
    reviewerName: 'Adiba',
    reviewerPhone: '01638474555',
    rating: 5,
    reviewComment: 'কাপড়ের কোয়ালিটি অনেক ভালো, ধন্যবাদ।',
    type: 'Global',
    status: 'Approved',
    date: 'September 29, 2026',
  },
  {
    id: 'rev-3',
    reviewerName: 'Shajidur Rahman',
    reviewerPhone: '01688444555',
    rating: 5,
    reviewComment: 'অসাধারণ সার্ভিস, রেকমেন্ডেড শপ।',
    type: 'Global',
    status: 'Approved',
    date: 'September 29, 2026',
  },
  {
    id: 'rev-4',
    reviewerName: 'korim uddin',
    reviewerPhone: '01982708789',
    rating: 5,
    reviewComment: '১০০% অরিজিনাল পণ্য হাতে পেয়েছি।',
    type: 'Global',
    status: 'Approved',
    date: 'September 29, 2026',
  },
];

const STORAGE_KEY = 'ummah_admin_reviews_list';

export const loadStoredReviews = (): ReviewItem[] => {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_REVIEWS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load reviews from localStorage', e);
  }
  return DEFAULT_INITIAL_REVIEWS;
};

export const saveStoredReviews = (reviews: ReviewItem[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('reviews-updated'));
  } catch (e) {
    console.error('Failed to save reviews to localStorage', e);
  }

  // Sync with server API
  fetch('/api/reviews/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reviews }),
  }).catch(() => {
    // Offline or static fallback
  });
};

/**
 * Public facing function: returns ONLY reviews approved by Super Admin
 */
export const getPublicApprovedReviews = (productId?: string): ReviewItem[] => {
  const all = loadStoredReviews();
  return all.filter((r) => {
    if (r.status !== 'Approved') return false;
    if (productId && r.productId && r.productId !== productId) return false;
    return true;
  });
};

/**
 * Customer submits a review:
 * Always assigned status='Pending'. NEVER visible in public until approved!
 */
export const submitCustomerReview = (data: {
  productId?: string;
  productName?: string;
  reviewerName: string;
  reviewerPhone?: string;
  rating: number;
  reviewComment: string;
}): ReviewItem => {
  const all = loadStoredReviews();

  const newReview: ReviewItem = {
    id: `rev-${Date.now()}`,
    productId: data.productId,
    productName: data.productName,
    reviewerName: data.reviewerName.trim() || 'সম্মানিত ক্রেতা',
    reviewerPhone: data.reviewerPhone?.trim() || '—',
    rating: data.rating || 5,
    reviewComment: data.reviewComment.trim(),
    type: data.productId ? 'Product' : 'Global',
    status: 'Pending', // <--- PENDING APPROVAL! Not public!
    date: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  const updated = [newReview, ...all];
  saveStoredReviews(updated);
  return newReview;
};

/**
 * Super Admin approves a review
 */
export const approveReview = (id: string): void => {
  const all = loadStoredReviews();
  const updated = all.map((r) =>
    r.id === id ? { ...r, status: 'Approved' as const } : r
  );
  saveStoredReviews(updated);
};

/**
 * Super Admin unapproves / puts a review on hold
 */
export const unapproveReview = (id: string): void => {
  const all = loadStoredReviews();
  const updated = all.map((r) =>
    r.id === id ? { ...r, status: 'Pending' as const } : r
  );
  saveStoredReviews(updated);
};

/**
 * Super Admin deletes a review
 */
export const deleteReviewItem = (id: string): void => {
  const all = loadStoredReviews();
  const updated = all.filter((r) => r.id !== id);
  saveStoredReviews(updated);
};
