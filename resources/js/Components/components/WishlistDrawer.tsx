import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types';
import { ProductVisual } from './ProductVisual';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onInstantOrder: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
  onInstantOrder,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-3.5 bg-[#990000] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-current text-white" />
              <h2 className="text-sm font-bold">উইশলিস্ট / পছন্দের তালিকা ({products.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {products.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Heart className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">উইশলিস্ট খালি</p>
                <p className="text-xs text-slate-500 mt-1">
                  পছন্দের পণ্যের হার্ট আইকনে ক্লিক করে তালিকায় সংরক্ষণ করুন।
                </p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2.5 bg-slate-50 rounded border border-slate-200"
                >
                  <div className="w-14 h-14 bg-white rounded border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center">
                    <ProductVisual visualType={product.visualType} name={product.name} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">
                      {product.name}
                    </h4>
                    <span className="text-xs font-bold text-[#990000]">
                      ৳{product.currentPrice}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          onClose();
                        }}
                        className="text-[10px] font-bold text-[#990000] bg-white border border-[#990000] px-2 py-0.5 rounded hover:bg-red-50"
                      >
                        কার্টে যোগ করুন
                      </button>
                      <button
                        onClick={() => {
                          onInstantOrder(product);
                          onClose();
                        }}
                        className="text-[10px] font-bold text-white bg-[#990000] px-2 py-0.5 rounded hover:bg-[#800000]"
                      >
                        অর্ডার করুন
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveFromWishlist(product)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
