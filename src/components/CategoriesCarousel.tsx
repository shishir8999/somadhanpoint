import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { CategoryItem } from '../types';

import { fetchCategoriesFromDatabase } from '../utils/apiSync';

interface CategoriesCarouselProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory?: string;
}

export const CategoriesCarousel: React.FC<CategoriesCarouselProps> = ({
  onSelectCategory,
  selectedCategory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
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

  // Fetch from database on mount
  useEffect(() => {
    fetchCategoriesFromDatabase().then((dbCats) => {
      if (dbCats && Array.isArray(dbCats)) {
        setCategories(dbCats);
      }
    });
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ummah_admin_categories_list');
        if (saved !== null) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-2.5 sm:py-4 relative">
      <div className="relative flex items-center">
        {/* Left Arrow Button (Desktop only, touch swipe on mobile) */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 z-10 w-8 h-8 rounded-full bg-[#990000] text-white items-center justify-center shadow-md hover:bg-[#800000] transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-2 sm:px-6 py-1.5 w-full justify-start sm:justify-between touch-pan-x"
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.name)}
                className="flex flex-col items-center gap-1.5 cursor-pointer shrink-0 group select-none"
              >
                <div
                  className={`w-13 h-13 sm:w-16 sm:h-16 rounded-full border-2 p-1 transition-all bg-white flex items-center justify-center overflow-hidden shadow-2xs group-hover:scale-105 ${
                    isSelected
                      ? 'border-[#990000] ring-2 ring-red-200'
                      : 'border-slate-200 group-hover:border-[#990000]'
                  }`}
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <ProductVisual visualType={cat.visualType || 'cat_khimar'} name={cat.name} />
                  )}
                </div>
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold text-center whitespace-nowrap group-hover:text-[#990000] transition-colors max-w-[75px] sm:max-w-[90px] truncate ${
                    isSelected ? 'text-[#990000]' : 'text-slate-700'
                  }`}
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button (Desktop only) */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 z-10 w-8 h-8 rounded-full bg-[#990000] text-white items-center justify-center shadow-md hover:bg-[#800000] transition-colors cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
