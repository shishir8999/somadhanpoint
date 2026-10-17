import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CIRCULAR_CATEGORIES } from '../data/products';
import { ProductVisual } from './ProductVisual';
import { CategoryItem } from '../types';

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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative">
      <div className="relative flex items-center">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 z-10 w-7 h-7 rounded-full bg-[#990000] text-white flex items-center justify-center shadow-md hover:bg-[#800000] transition-colors cursor-pointer"
          aria-label="Previous"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-6 py-2 w-full justify-start sm:justify-between"
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
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 p-1 transition-all bg-white flex items-center justify-center overflow-hidden shadow-2xs group-hover:scale-105 ${
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
                  className={`text-[10px] sm:text-[11px] font-semibold text-center whitespace-nowrap group-hover:text-[#990000] transition-colors max-w-[80px] sm:max-w-[90px] truncate ${
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

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 z-10 w-7 h-7 rounded-full bg-[#990000] text-white flex items-center justify-center shadow-md hover:bg-[#800000] transition-colors cursor-pointer"
          aria-label="Next"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
