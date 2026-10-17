import React, { useState, useEffect } from 'react';
import { BrandItem } from '../types';

interface BrandSectionProps {
  onSelectBrand?: (brandName: string) => void;
}

const DEFAULT_BRANDS: BrandItem[] = [
  {
    id: 'brand-1',
    name: 'Comforty',
    logoText: 'COMFORTY',
  },
  {
    id: 'brand-2',
    name: 'Vision',
    logoText: 'VISION',
  },
  {
    id: 'brand-3',
    name: 'Walton',
    logoText: 'WALTON',
  },
];

export const BrandSection: React.FC<BrandSectionProps> = ({ onSelectBrand }) => {
  const [brands, setBrands] = useState<BrandItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_brands_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    return DEFAULT_BRANDS;
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem('ummah_admin_brands_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBrands(parsed);
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="text-center mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
          আমাদের ব্র্যান্ড
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {brands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => onSelectBrand && onSelectBrand(brand.name)}
            className={`h-24 bg-white rounded border border-slate-200 flex items-center justify-center p-3 hover:border-[#990000] hover:shadow-sm transition-all group overflow-hidden ${
              onSelectBrand ? 'cursor-pointer' : ''
            }`}
            title={brand.name}
          >
            {brand.imageUrl ? (
              <img
                src={brand.imageUrl}
                alt={brand.name}
                className="max-h-14 max-w-[120px] object-contain transition-transform duration-200 group-hover:scale-105"
              />
            ) : brand.name.toLowerCase() === 'comforty' ? (
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-serif">
                COMFORT
              </span>
            ) : brand.name.toLowerCase() === 'vision' ? (
              <div className="flex items-center">
                <span className="text-lg sm:text-xl font-black tracking-widest text-slate-900">
                  VISI
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mx-0.5"></span>
                <span className="text-lg sm:text-xl font-black tracking-widest text-slate-900">
                  N
                </span>
              </div>
            ) : brand.name.toLowerCase() === 'walton' ? (
              <span className="text-lg sm:text-xl font-black tracking-wider text-[#0052cc]">
                WALTON
              </span>
            ) : (
              <span className="text-sm sm:text-base font-bold text-slate-800 text-center tracking-wide group-hover:text-[#990000] transition-colors">
                {brand.logoText || brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
