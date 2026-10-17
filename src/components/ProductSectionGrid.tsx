import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductSectionGridProps {
  id?: string;
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onInstantOrder: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onViewAll?: () => void;
}

export const ProductSectionGrid: React.FC<ProductSectionGridProps> = ({
  id,
  title,
  products,
  onAddToCart,
  onInstantOrder,
  onViewProduct,
  wishlistIds,
  onToggleWishlist,
  onViewAll,
}) => {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section id={id} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Header Row */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        <button
          onClick={onViewAll}
          className="bg-[#990000] hover:bg-[#800000] text-white text-[11px] sm:text-xs font-semibold px-3 py-1 rounded transition-colors"
        >
          View All
        </button>
      </div>

      {/* 5-Column Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {products.map((product) => (
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
    </section>
  );
};
