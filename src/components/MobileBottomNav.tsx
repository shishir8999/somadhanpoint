import React from 'react';
import { Home, ShoppingBag, Grid, ShoppingCart, Menu, Truck } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  cartCount: number;
  onGoHome: () => void;
  onGoProducts: () => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onToggleMenu: () => void;
  onOpenOrderTracking?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  cartCount,
  onGoHome,
  onGoProducts,
  onOpenCategories,
  onOpenCart,
  onToggleMenu,
  onOpenOrderTracking,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 flex items-center justify-around select-none">
      {/* 1. Home */}
      <button
        onClick={onGoHome}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
          currentView === 'home'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <Home className={`w-5 h-5 mb-0.5 ${currentView === 'home' ? 'stroke-[2.2]' : ''}`} />
        <span className="text-[10px] leading-tight">হোম</span>
      </button>

      {/* 2. Products / Categories */}
      <button
        onClick={onGoProducts}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
          currentView === 'products'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <ShoppingBag className={`w-5 h-5 mb-0.5 ${currentView === 'products' ? 'stroke-[2.2]' : ''}`} />
        <span className="text-[10px] leading-tight">শপ</span>
      </button>

      {/* 3. Center Elevated Cart Button */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-4">
        <button
          onClick={onOpenCart}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#800000] to-[#b30000] text-white flex items-center justify-center shadow-lg shadow-red-900/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer relative"
          aria-label="Shopping Cart"
        >
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
        <span className="text-[10px] font-bold text-slate-700 leading-tight mt-0.5">কার্ট</span>
      </div>

      {/* 4. Order Tracking */}
      {onOpenOrderTracking ? (
        <button
          onClick={onOpenOrderTracking}
          className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentView === 'order_tracking'
              ? 'text-[#990000] font-bold'
              : 'text-slate-600 hover:text-[#990000]'
          }`}
        >
          <Truck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">ট্র্যাকিং</span>
        </button>
      ) : (
        <button
          onClick={onOpenCategories}
          className="flex-1 flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#990000] transition-colors cursor-pointer"
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight">ক্যাটাগরি</span>
        </button>
      )}

      {/* 5. Menu Drawer */}
      <button
        onClick={onToggleMenu}
        className="flex-1 flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#990000] transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">মেনু</span>
      </button>
    </div>
  );
};
