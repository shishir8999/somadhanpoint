import React from 'react';
import { Home, ShoppingBag, Grid, ShoppingCart } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: string;
  cartCount: number;
  onGoHome: () => void;
  onGoProducts: () => void;
  onOpenCategories: () => void;
  onOpenCart: () => void;
  onToggleMenu?: () => void;
  onOpenOrderTracking?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  cartCount,
  onGoHome,
  onGoProducts,
  onOpenCategories,
  onOpenCart,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] px-1 h-[50px] flex items-center justify-around select-none"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        maxWidth: '100vw',
        transform: 'translate3d(0, 0, 0)',
        WebkitTransform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
      aria-label="Mobile Bottom Navigation"
    >
      {/* 1. Home */}
      <button
        type="button"
        onClick={onGoHome}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-colors cursor-pointer active:scale-95 ${
          currentView === 'home'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight mt-0.5">হোম</span>
      </button>

      {/* 2. Products */}
      <button
        type="button"
        onClick={onGoProducts}
        className={`flex-1 flex flex-col items-center justify-center h-full transition-colors cursor-pointer active:scale-95 ${
          currentView === 'products'
            ? 'text-[#990000] font-bold'
            : 'text-slate-600 hover:text-[#990000]'
        }`}
      >
        <ShoppingBag className={`w-5 h-5 ${currentView === 'products' ? 'stroke-[2.2]' : 'stroke-[1.75]'}`} />
        <span className="text-[10px] leading-tight mt-0.5">পণ্যসমূহ</span>
      </button>

      {/* 3. Categories */}
      <button
        type="button"
        onClick={onOpenCategories}
        className="flex-1 flex flex-col items-center justify-center h-full text-slate-600 hover:text-[#990000] transition-colors cursor-pointer active:scale-95"
      >
        <Grid className="w-5 h-5 stroke-[1.75]" />
        <span className="text-[10px] leading-tight mt-0.5">ক্যাটাগরি</span>
      </button>

      {/* 4. Cart */}
      <button
        type="button"
        onClick={onOpenCart}
        className="flex-1 flex flex-col items-center justify-center h-full text-slate-600 hover:text-[#990000] relative transition-colors cursor-pointer active:scale-95"
      >
        <div className="relative">
          <ShoppingCart className="w-5 h-5 stroke-[1.75]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-[#990000] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] leading-tight mt-0.5 font-medium">কার্ট</span>
      </button>
    </nav>
  );
};
