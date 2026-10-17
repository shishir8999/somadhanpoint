import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { Search, Filter, ArrowUpDown, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '../data/products';

interface ProductsCatalogPageProps {
  allProducts: Product[];
  onAddToCart: (product: Product) => void;
  onInstantOrder: (product: Product) => void;
  onViewProduct: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onBackToHome: () => void;
  initialCategory?: string;
  initialSearchQuery?: string;
}

export const ProductsCatalogPage: React.FC<ProductsCatalogPageProps> = ({
  allProducts,
  onAddToCart,
  onInstantOrder,
  onViewProduct,
  wishlistIds,
  onToggleWishlist,
  onBackToHome,
  initialCategory,
  initialSearchQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'discount'>('featured');

  // Sync initialCategory & initialSearchQuery when props change
  React.useEffect(() => {
    if (initialCategory !== undefined) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  React.useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  // Dynamic Categories from localStorage & DB
  const [categoriesList, setCategoriesList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return CIRCULAR_CATEGORIES;
  });

  React.useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setCategoriesList(parsed);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('categories-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('categories-updated', handleStorage);
    };
  }, []);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim()
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.badge && p.badge.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.currentPrice - b.currentPrice);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.currentPrice - a.currentPrice);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.originalPrice ? a.originalPrice - a.currentPrice : 0;
        const discB = b.originalPrice ? b.originalPrice - b.currentPrice : 0;
        return discB - discA;
      });
    }

    return result;
  }, [allProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <button
            onClick={onBackToHome}
            className="hover:text-[#990000] font-medium transition-colors cursor-pointer"
          >
            হোম
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">পণ্যসমূহ</span>
          {selectedCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#990000] font-bold">{selectedCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-[#990000] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                সকল পণ্যসমূহ (All Products)
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              আমাদের সকল প্রিমিয়াম ও অরিজিনাল কালেকশন থেকে আপনার পছন্দের পণ্যটি বেছে নিন।
            </p>
          </div>

          {/* Quick stats badge */}
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>মোট পণ্য:</span>
            <strong className="text-[#990000] font-bold text-sm">
              {filteredProducts.length}
            </strong>
            <span>টি</span>
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#990000]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-800 font-medium focus:outline-none focus:border-[#990000] cursor-pointer"
              >
                <option value="featured">ফিচার্ড পণ্যসমূহ</option>
                <option value="price_low">মূল্য: কম থেকে বেশি</option>
                <option value="price_high">মূল্য: বেশি থেকে কম</option>
                <option value="discount">সর্বোচ্চ ছাড়</option>
              </select>
            </div>
          </div>

          {/* Category Horizontal Scroll Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#990000] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              সকল পণ্য
            </button>
            {categoriesList.map((cat: any) => {
              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#990000] text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Product Grid Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Active Search Result Notification */}
        {searchQuery.trim() && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 px-4 flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#990000] shrink-0" />
              <span className="text-slate-800">
                <strong>"{searchQuery}"</strong> অনুসন্ধানের জন্য{' '}
                <strong className="text-[#990000]">{filteredProducts.length}</strong> টি পণ্য পাওয়া গেছে
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-[#990000] font-bold underline hover:text-[#800000] cursor-pointer shrink-0"
            >
              অনুসন্ধান মুছুন
            </button>
          </div>
        )}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 my-4 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">কোনো পণ্য খুঁজে পাওয়া যায়নি</h3>
            <p className="text-xs text-slate-400">
              অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার রিসেট করুন।
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-1.5 bg-[#990000] text-white text-xs font-bold rounded-lg hover:bg-[#800000] transition-colors cursor-pointer"
            >
              ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onInstantOrder={onInstantOrder}
                onViewProduct={onViewProduct}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
