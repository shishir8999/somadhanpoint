import React from 'react';
import { Home, ShoppingBag, Grid, ShoppingCart, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  cartCount: number;
  onGoHome: () => void;
  onGoProducts: () => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onToggleMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  cartCount,
  onGoHome,
  onGoProducts,
  onOpenCategories,
  onOpenCart,
  onToggleMenu,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
      {/* 1. Home */}
      <button
        onClick={onGoHome}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'home'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">হোম</span>
      </button>

      {/* 2. Products */}
      <button
        onClick={onGoProducts}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'products'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <ShoppingBag className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">পণ্যসমূহ</span>
      </button>

      {/* 3. Categories */}
      <button
        onClick={onOpenCategories}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-600 hover:text-[#990000] transition-colors cursor-pointer"
      >
        <Grid className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">ক্যাটাগরি</span>
      </button>

      {/* 4. Cart with Live Badge */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-600 hover:text-[#990000] relative transition-colors cursor-pointer"
      >
        <div className="relative mb-0.5">
          <ShoppingCart className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#990000] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] leading-tight font-medium">কার্ট</span>
      </button>

      {/* 5. Menu Drawer */}
      <button
        onClick={onToggleMenu}
        className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-slate-600 hover:text-[#990000] transition-colors cursor-pointer"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] leading-tight">মেনু</span>
      </button>
    </div>
  );
};
