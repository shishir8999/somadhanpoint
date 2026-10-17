import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { ProductVisual } from './ProductVisual';

interface CartDrawerNewProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawerNew: React.FC<CartDrawerNewProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

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
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <h2 className="text-sm font-bold">আপনার শপিং কার্ট ({items.length})</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-700">কার্ট খালি</p>
                <p className="text-xs text-slate-500 mt-1">পছন্দের পণ্য কার্টে যুক্ত করুন।</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded border border-slate-200"
                >
                  <div className="w-14 h-14 bg-white rounded border border-slate-200 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                    {item.selectedImage ? (
                      <img
                        src={item.selectedImage}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <ProductVisual
                        visualType={item.product.visualType}
                        name={item.product.name}
                        color={item.selectedColor}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate" title={item.product.name}>
                      {item.product.name}
                    </h4>
                    {(item.selectedColor || item.selectedSize) && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500 my-0.5">
                        {item.selectedColor && (
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                            {item.selectedColor}
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-[#990000]">
                            {item.selectedSize}
                          </span>
                        )}
                      </div>
                    )}
                    <span className="text-xs font-bold text-[#990000]">
                      ৳{item.unitPrice}
                    </span>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center border border-slate-300 rounded bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>সাবটোটাল:</span>
                <span className="text-[#990000] text-base">৳{subtotal}</span>
              </div>
              <button
                onClick={onProceedToCheckout}
                className="w-full py-2.5 rounded bg-[#990000] hover:bg-[#800000] text-white font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <span>অর্ডার সম্পন্ন করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
