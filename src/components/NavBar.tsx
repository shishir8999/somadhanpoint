import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '../data/products';
import { CategoryItem } from '../types';

interface NavBarProps {
  onSelectCategory: (categoryName: string) => void;
  onFilterSection: (sectionId: string) => void;
  onContactClick: () => void;
  onOpenOrderPage?: () => void;
  onOpenAdmin?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  onSelectCategory,
  onFilterSection,
  onContactClick,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return CIRCULAR_CATEGORIES;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(parsed);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <nav className="w-full bg-[#990000] text-white select-none border-b border-[#800000]">
      {/* 1. Desktop Navbar (hidden on mobile) */}
      <div className="hidden md:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 py-0 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer"
            >
              <span>ক্যাটাগরিজ</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-56 bg-white text-slate-800 shadow-xl border border-slate-200 z-50 py-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onSelectCategory(cat.name);
                      setIsCategoryOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium hover:bg-red-50 hover:text-[#990000] flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <button
            onClick={() => onFilterSection('all')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            সকল প্রোডাক্টস
          </button>
          <button
            onClick={() => onFilterSection('free_delivery')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            ফ্রি ডেলিভারি
          </button>
          <button
            onClick={() => onFilterSection('top_rated')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            বাছাই করা প্রোডাক্টস
          </button>
          <button
            onClick={() => onFilterSection('flash_sale')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            নতুন প্রোডাক্টস
          </button>
          <button
            onClick={() => onFilterSection('brands')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            ব্র্যান্ডের প্রোডাক্টস
          </button>
          <button
            onClick={onContactClick}
            className="py-3 px-3 hover:bg-[#800000] transition-colors"
          >
            যোগাযোগ
          </button>
        </div>
      </div>

      {/* 2. Mobile Responsive Swipeable Pill Strip */}
      <div className="md:hidden flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-xs font-medium touch-pan-x">
        {/* Categories Pill with Dropdown */}
        <div className="relative shrink-0">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="flex items-center gap-1 px-3 py-1 bg-white/15 hover:bg-white/25 active:bg-white/30 rounded-full text-white font-bold transition-colors cursor-pointer"
          >
            <span>ক্যাটাগরিজ</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
          </button>

          {isCategoryOpen && (
            <div className="fixed inset-x-3 top-28 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-50 py-2 max-h-72 overflow-y-auto animate-in fade-in zoom-in-95">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>ক্যাটাগরি নির্বাচন করুন</span>
                <span onClick={() => setIsCategoryOpen(false)} className="text-[#990000] cursor-pointer">✕ বন্ধ করুন</span>
              </div>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.name);
                    setIsCategoryOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-red-50 hover:text-[#990000] flex items-center justify-between border-b border-slate-50 last:border-none"
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => onFilterSection('all')}
          className="shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
        >
          সকল প্রোডাক্টস
        </button>
        <button
          onClick={() => onFilterSection('free_delivery')}
          className="shrink-0 px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-300/30 font-bold hover:bg-amber-400/30 rounded-full transition-colors cursor-pointer"
        >
          🚚 ফ্রি ডেলিভারি
        </button>
        <button
          onClick={() => onFilterSection('top_rated')}
          className="shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
        >
          বাছাই করা
        </button>
        <button
          onClick={() => onFilterSection('flash_sale')}
          className="shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
        >
          নতুন পণ্য
        </button>
        <button
          onClick={() => onFilterSection('brands')}
          className="shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
        >
          ব্র্যান্ডসমূহ
        </button>
        <button
          onClick={onContactClick}
          className="shrink-0 px-3 py-1 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-white transition-colors cursor-pointer"
        >
          যোগাযোগ
        </button>
      </div>
    </nav>
  );
};
