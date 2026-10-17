import React, { useState } from 'react';
import { Download, Heart, ShoppingBag, Search, User, Package, ShieldCheck, Menu, ArrowRight, Truck, LogOut, ChevronDown } from 'lucide-react';
import { Product, CustomerUser } from '../types';
import { useStoreSettings } from '../context/StoreSettingsContext';
import { ProductVisual } from './ProductVisual';

interface MainHeaderProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenOrderPage?: () => void;
  onOpenOrderTracking?: () => void;
  onOpenAdmin?: () => void;
  onToggleMobileMenu?: () => void;
  onSearchSubmit?: (searchTerm: string) => void;
  currentCustomer?: CustomerUser | null;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  allProducts,
  onSelectProduct,
  onOpenOrderPage,
  onOpenOrderTracking,
  onOpenAdmin,
  onToggleMobileMenu,
  onSearchSubmit,
  currentCustomer,
  onOpenProfile,
  onLogout,
}) => {
  const { settings } = useStoreSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const trimmedQuery = searchTerm.trim().toLowerCase();
  const searchResults = trimmedQuery
    ? allProducts.filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(trimmedQuery);
        const catMatch = (p.category || '').toLowerCase().includes(trimmedQuery);
        const subcatMatch = (p.subcategory || '').toLowerCase().includes(trimmedQuery);
        const brandMatch = (p.brand || '').toLowerCase().includes(trimmedQuery);
        const skuMatch = (p.sku || '').toLowerCase().includes(trimmedQuery);
        return nameMatch || catMatch || subcatMatch || brandMatch || skuMatch;
      })
    : [];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Hamburger & Brand Logo */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="md:hidden p-1.5 -ml-1 text-slate-700 hover:text-[#990000] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="মেনু খুলুন"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <a href="/" className="flex items-center gap-2 group">
            {settings.logoUrl ? (
              <>
                <img
                  src={settings.logoUrl}
                  alt={settings.siteName}
                  className="h-8 sm:h-12 w-auto max-w-[130px] sm:max-w-[200px] object-contain rounded group-hover:scale-105 transition-transform"
                />
                {settings.showLogoText && (
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 font-sans leading-tight">
                      {settings.siteName}
                    </span>
                    {settings.slogan && (
                      <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block -mt-0.5">
                        {settings.slogan}
                      </span>
                    )}
                  </div>
                )}
              </>
            ) : (
            <>
              <div className="w-9 h-9 rounded-lg bg-[#990000] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform font-black text-sm tracking-wider">
                SP
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans leading-tight">
                  {settings.siteName.toLowerCase().includes('point') ? (
                    <>
                      {settings.siteName.replace(/point/i, '').trim()}{' '}
                      <span className="italic text-[#990000] font-serif">Point</span>
                    </>
                  ) : settings.siteName.toLowerCase().includes('byte') ? (
                    <>
                      {settings.siteName.replace(/byte/i, '').trim()}
                      <span className="italic text-[#990000] font-serif">Byte</span>
                    </>
                  ) : (
                    settings.siteName
                  )}
                </span>
                {settings.slogan && (
                  <span className="text-[10px] text-slate-500 font-medium hidden sm:inline-block -mt-0.5">
                    {settings.slogan}
                  </span>
                )}
              </div>
            </>
          )}
        </a>
      </div>

      {/* Center: Search input with red Search button */}
        <div className="flex-1 max-w-2xl mx-2 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = searchTerm.trim();
              if (!query) return;
              setIsSearching(false);
              if (onSearchSubmit) {
                onSearchSubmit(query);
              } else if (searchResults.length > 0) {
                onSelectProduct(searchResults[0]);
              }
            }}
            className="flex items-center"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="পণ্য বা কি-ওয়ার্ড খুঁজুন (যেমন: জুতা, ঘড়ি, খিমার)..."
              className="w-full text-xs sm:text-sm px-3 sm:px-4 py-2 border border-slate-300 rounded-l focus:outline-none focus:border-[#990000] text-slate-800 placeholder-slate-400 bg-white"
            />
            <button
              type="submit"
              className="bg-[#b30000] hover:bg-[#990000] text-white text-xs sm:text-sm font-bold px-3 sm:px-6 py-2 border border-[#b30000] rounded-r transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              title="Search Products"
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>

          {/* Search Dropdown Results */}
          {isSearching && searchTerm.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length === 0 ? (
                <div className="p-5 text-xs text-slate-500 text-center space-y-2">
                  <p className="font-semibold text-slate-700">
                    "{searchTerm}" দিয়ে কোনো পণ্য খুঁজে পাওয়া যায়নি
                  </p>
                  <p className="text-[11px] text-slate-400">
                    বানান চেক করুন অথবা পণ্য তালিকায় সব পণ্য ঘুরে দেখুন
                  </p>
                  {onSearchSubmit && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearching(false);
                        onSearchSubmit('');
                      }}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#990000] font-bold rounded text-xs transition-colors cursor-pointer"
                    >
                      সকল পণ্য দেখুন
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-bold text-slate-500 flex items-center justify-between">
                    <span>অনুসন্ধানের ফলাফল ({searchResults.length} টি)</span>
                    <span className="text-[10px] text-slate-400">সিলেক্ট করতে ক্লিক করুন</span>
                  </div>
                  {searchResults.slice(0, 8).map((product) => {
                    const img =
                      product.imageUrl ||
                      product.thumbnailUrl ||
                      (product.colorVariants && product.colorVariants.find((c) => c.image)?.image);

                    return (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSelectProduct(product);
                          setIsSearching(false);
                          setSearchTerm('');
                        }}
                        className="p-2.5 flex items-center gap-3 hover:bg-red-50/60 cursor-pointer transition-colors"
                      >
                        <div className="w-11 h-11 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                          {img ? (
                            <img
                              src={img}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ProductVisual visualType={product.visualType} name={product.name} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate" title={product.name}>
                            {product.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <span className="bg-slate-100 px-1.5 py-0.2 rounded font-medium text-slate-600">
                              {product.category}
                            </span>
                            {product.subcategory && (
                              <span className="text-[#990000] font-semibold">
                                ↳ {product.subcategory}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-[#990000] block">
                            ৳{product.currentPrice}
                          </span>
                          {product.originalPrice && product.originalPrice > product.currentPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ৳{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* View All Matches in Catalog Button */}
                  {onSearchSubmit && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearching(false);
                        onSearchSubmit(searchTerm.trim());
                      }}
                      className="w-full p-2.5 bg-slate-50 hover:bg-red-50 text-center text-xs font-bold text-[#990000] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>সকল ফলাফল ক্যাটালগে দেখুন ({searchResults.length} টি পণ্য)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0 text-slate-700">
          {/* Order Tracking Quick Nav (Replaced order_page as requested) */}
          {(onOpenOrderTracking || onOpenOrderPage) && (
            <button
              onClick={onOpenOrderTracking || onOpenOrderPage}
              className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#990000] font-bold px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="অর্ডার ট্র্যাকিং"
            >
              <Truck className="w-4 h-4 text-[#990000]" />
              <span className="hidden sm:inline">অর্ডার ট্র্যাকিং</span>
            </button>
          )}


          {/* Logged in Customer Avatar or Login / Register */}
          {currentCustomer ? (
            <div className="relative group">
              <button
                type="button"
                onClick={onOpenProfile || onOpenAuth}
                className="flex items-center gap-1.5 text-xs text-slate-850 font-bold px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                title={`${currentCustomer.name} (${currentCustomer.email})`}
              >
                <div className="w-6 h-6 rounded-full bg-[#990000] text-white flex items-center justify-center text-[11px] font-bold shrink-0 shadow-2xs">
                  {currentCustomer.name ? currentCustomer.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline truncate max-w-[100px] text-slate-800">
                  {currentCustomer.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-700 transition-transform" />
              </button>

              {/* Quick Dropdown Menu on Hover/Click */}
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1 z-50 hidden group-hover:block divide-y divide-slate-100 text-xs animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 bg-slate-50/50">
                  <p className="font-bold text-slate-900 truncate">{currentCustomer.name}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{currentCustomer.email}</p>
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={onOpenProfile}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-red-50 hover:text-[#990000] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>আমার প্রোফাইল</span>
                  </button>
                  {onOpenOrderTracking && (
                    <button
                      type="button"
                      onClick={onOpenOrderTracking}
                      className="w-full px-3 py-2 text-left text-slate-700 hover:bg-red-50 hover:text-[#990000] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-slate-500" />
                      <span>অর্ডার ট্র্যাকিং ও ইতিহাস</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onOpenWishlist}
                    className="w-full px-3 py-2 text-left text-slate-700 hover:bg-red-50 hover:text-[#990000] font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 text-slate-500" />
                    <span>পছন্দের তালিকা ({wishlistCount})</span>
                  </button>
                </div>
                {onLogout && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="w-full px-3 py-2 text-left text-rose-600 hover:bg-rose-50 font-bold flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs text-slate-700 hover:text-[#b30000] font-bold hidden sm:flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
              title="লগইন বা নতুন অ্যাকাউন্ট রেজিস্ট্রেশন করুন"
            >
              <User className="w-3.5 h-3.5 text-[#990000]" />
              <span>Login | Register</span>
            </button>
          )}

          {/* Wishlist Heart Icon */}
          <button
            onClick={onOpenWishlist}
            className="relative p-1 text-slate-700 hover:text-[#b30000] transition-colors"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 stroke-[1.75]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 bg-[#b30000] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Icon with Red Badge */}
          <button
            onClick={onOpenCart}
            className="relative p-1 text-slate-700 hover:text-[#b30000] transition-colors"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span className="absolute -top-1.5 -right-2 bg-[#b30000] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
