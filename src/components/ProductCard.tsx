import React from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onInstantOrder: (product: Product) => void;
  onViewProduct?: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onInstantOrder,
  onViewProduct,
  isWishlisted,
  onToggleWishlist,
}) => {
  const handleClick = () => {
    if (onViewProduct) {
      onViewProduct(product);
    }
  };

  return (
    <div className="bg-white rounded border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow group">
      <div onClick={handleClick} className="cursor-pointer">
        {/* Visual Box */}
        <div className="relative w-full aspect-square bg-[#fafafa] flex items-center justify-center p-2 border-b border-slate-100 overflow-hidden">
          {/* Top-left Badge */}
          {product.badge && (
            <span className="absolute top-1.5 left-1.5 z-10 bg-[#990000] text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
              {product.badge}
            </span>
          )}

          {/* Top-right Wishlist Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-1.5 right-1.5 z-10 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-slate-500 hover:text-[#990000] flex items-center justify-center shadow-xs transition-colors"
            title="Add to Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isWishlisted ? 'fill-[#990000] text-[#990000]' : 'stroke-current'
              }`}
            />
          </button>

          {/* Artwork */}
          {(() => {
            const productImg =
              product.imageUrl ||
              product.thumbnailUrl ||
              (product.colorVariants && product.colorVariants.find((c) => c.image)?.image);

            return (
              <div className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                {productImg ? (
                  <img
                    src={productImg}
                    alt={product.name}
                    loading="lazy"
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <ProductVisual visualType={product.visualType} name={product.name} />
                )}
              </div>
            );
          })()}
        </div>

        {/* Title & Price */}
        <div className="p-2 sm:p-2.5 text-center">
          <h3 className="text-xs font-semibold text-slate-800 truncate hover:text-[#990000] transition-colors" title={product.name}>
            {product.name}
          </h3>

          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-xs sm:text-sm font-bold text-[#990000]">
              ৳{product.currentPrice}
            </span>
            {product.originalPrice && product.originalPrice > product.currentPrice && (
              <span className="text-[11px] text-slate-400 line-through">
                ৳{product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Two Buttons Section */}
      <div className="p-2 pt-0 space-y-1.5">
        {/* Button 1: Add to Cart (White with red border) */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="w-full py-1.5 text-center text-[11px] sm:text-xs font-bold text-[#990000] bg-white border border-[#990000] rounded hover:bg-red-50 active:bg-red-100 transition-colors cursor-pointer"
        >
          কার্টে যোগ করুন
        </button>

        {/* Button 2: Order Now (Deep Red) */}
        <button
          type="button"
          onClick={() => onInstantOrder(product)}
          className="w-full py-1.5 text-center text-[11px] sm:text-xs font-bold text-white bg-[#990000] hover:bg-[#800000] active:bg-[#700000] rounded transition-colors shadow-2xs cursor-pointer"
        >
          অর্ডার করুন
        </button>
      </div>
    </div>
  );
};
