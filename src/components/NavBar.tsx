import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Tag, Truck, Star, Sparkles, Layers, Phone } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '../data/products';
import { CategoryItem } from '../types';
import { fetchCategoriesFromDatabase } from '../utils/apiSync';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Fetch live categories from database on mount
  useEffect(() => {
    fetchCategoriesFromDatabase().then((dbCats) => {
      if (dbCats && Array.isArray(dbCats) && dbCats.length > 0) {
        setCategories(dbCats);
      }
    });
  }, []);

  // Listen to storage & custom categories updates
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
    window.addEventListener('categories-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('categories-updated', handleStorage);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="hidden md:block w-full bg-[#990000] text-white select-none border-b border-[#800000] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2 py-0 text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
          {/* 1. Categories Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className={`flex items-center gap-2 py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer rounded-t ${
                isCategoryOpen ? 'bg-[#800000]' : ''
              }`}
              title="ক্যাটাগরি তালিকা দেখুন"
            >
              <span>ক্যাটাগরিজ</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-2xl border border-slate-200 rounded-b-lg z-50 py-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50">
                  <span>সকল ক্যাটাগরি</span>
                  <span className="text-[#990000]">{categories.length} টি</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.name);
                        setIsCategoryOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium hover:bg-red-50 hover:text-[#990000] flex items-center justify-between transition-colors cursor-pointer group"
                    >
                      <span className="group-hover:font-bold">{cat.name}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-[#990000] transition-transform group-hover:translate-x-0.5">→</span>
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      onFilterSection('all');
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-center py-1.5 text-xs font-bold text-[#990000] hover:underline cursor-pointer"
                  >
                    সকল প্রোডাক্টস ক্যাটালগ দেখুন →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. All Products */}
          <button
            type="button"
            onClick={() => onFilterSection('all')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer"
            title="সকল পণ্য দেখুন"
          >
            সকল প্রোডাক্টস
          </button>

          {/* 3. Free Delivery */}
          <button
            type="button"
            onClick={() => onFilterSection('free-delivery')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer flex items-center gap-1.5"
            title="ফ্রি ডেলিভারি পণ্যসমূহ"
          >
            <span>ফ্রি ডেলিভারি</span>
            <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              FREE
            </span>
          </button>

          {/* 4. Top Rated */}
          <button
            type="button"
            onClick={() => onFilterSection('top-rated')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer"
            title="বাছাই করা পণ্যসমূহ"
          >
            বাছাই করা প্রোডাক্টস
          </button>

          {/* 5. New Products */}
          <button
            type="button"
            onClick={() => onFilterSection('flash-sale')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer flex items-center gap-1.5"
            title="নতুন ও অফার পণ্যসমূহ"
          >
            <span>নতুন প্রোডাক্টস</span>
            <span className="bg-amber-400 text-slate-900 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              NEW
            </span>
          </button>

          {/* 6. Brand Products */}
          <button
            type="button"
            onClick={() => onFilterSection('brands')}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer"
            title="আমাদের ব্র্যান্ড কালেকশন"
          >
            ব্র্যান্ডের প্রোডাক্টস
          </button>

          {/* 7. Contact */}
          <button
            type="button"
            onClick={onContactClick}
            className="py-3 px-3 hover:bg-[#800000] transition-colors cursor-pointer"
            title="আমাদের সাথে যোগাযোগ করুন"
          >
            যোগাযোগ
          </button>
        </div>
      </div>
    </nav>
  );
};
