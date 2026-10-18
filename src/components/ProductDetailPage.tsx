import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Phone, 
  MessageCircle, 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Star,
  CheckCircle2,
  AlertCircle,
  Check,
  Clock
} from 'lucide-react';
import { Product, ColorVariant } from '../types';
import { ProductVisual } from './ProductVisual';
import { AuthModal } from './AuthModal';
import {
  submitCustomerReview,
  getPublicApprovedReviews,
  ReviewItem
} from '../utils/reviewSync';

interface ProductDetailPageProps {
  product: Product;
  onBackToHome: () => void;
  onAddToCart: (product: Product, quantity: number, options?: { color?: string; size?: string; image?: string }) => void;
  onInstantOrder: (product: Product, quantity: number, options?: { color?: string; size?: string; image?: string }) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenAuth?: () => void;
}

interface ProductReview {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface GalleryItem {
  id: string;
  type: 'thumbnail' | 'gallery' | 'color';
  label: string;
  url?: string;
  colorName?: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  onBackToHome,
  onAddToCart,
  onInstantOrder,
  isWishlisted,
  onToggleWishlist,
  onOpenAuth,
}) => {
  // Resolve Color Variants
  const resolvedColors: ColorVariant[] = useMemo(() => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants;
    }
    if (product.colors && product.colors.length > 0) {
      return product.colors.map((c) => {
        let hex = '#64748b';
        const lower = c.toLowerCase();
        if (lower.includes('white') || lower.includes('সাদা')) hex = '#ffffff';
        else if (lower.includes('black') || lower.includes('কালো')) hex = '#0f172a';
        else if (lower.includes('pink') || lower.includes('গোলাপি')) hex = '#f472b6';
        else if (lower.includes('red') || lower.includes('লাল')) hex = '#ef4444';
        else if (lower.includes('blue') || lower.includes('নীল')) hex = '#3b82f6';
        else if (lower.includes('green') || lower.includes('সবুজ')) hex = '#10b981';
        else if (lower.includes('yellow') || lower.includes('হলুদ')) hex = '#eab308';
        else if (lower.includes('maroon') || lower.includes('মেরুন')) hex = '#831843';
        return { name: c, hex };
      });
    }
    // Default smart variants based on product description or fallback
    return [
      { name: 'সাদা (White)', hex: '#ffffff' },
      { name: 'কালো (Black)', hex: '#0f172a' },
      { name: 'গোলাপি (Pink)', hex: '#f472b6' },
    ];
  }, [product]);

  // Resolve Sizes
  const resolvedSizes: string[] = useMemo(() => {
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes;
    }
    const cat = (product.category || '').toLowerCase();
    if (cat.includes('shoe') || cat.includes('জুতা')) {
      return ['৩৯', '৪০', '৪১', '৪২', '৪৩'];
    }
    if (
      cat.includes('borka') ||
      cat.includes('khimar') ||
      cat.includes('jubba') ||
      cat.includes('shirt') ||
      cat.includes('panjabi')
    ) {
      return ['S', 'M', 'L', 'XL', 'XXL'];
    }
    return ['Standard', 'Free Size'];
  }, [product]);

  // State
  const [selectedColor, setSelectedColor] = useState<string>(() => resolvedColors[0]?.name || 'সাদা (White)');
  const [selectedSize, setSelectedSize] = useState<string>(() => resolvedSizes[0] || 'Standard');
  const [activeImage, setActiveImage] = useState<string | undefined>(() => {
    return resolvedColors[0]?.image || product.thumbnailUrl || product.imageUrl;
  });
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');

  // Build Dynamic Gallery Items
  const galleryItems: GalleryItem[] = useMemo(() => {
    const list: GalleryItem[] = [];
    const mainImg = product.thumbnailUrl || product.imageUrl;
    list.push({
      id: 'main',
      type: 'thumbnail',
      label: 'মেইন ছবি',
      url: mainImg,
    });

    if (product.galleryImages && product.galleryImages.length > 0) {
      product.galleryImages.forEach((img, idx) => {
        list.push({
          id: `gallery-${idx}`,
          type: 'gallery',
          label: `গ্যালারি ${idx + 1}`,
          url: img,
        });
      });
    }

    resolvedColors.forEach((cVar, idx) => {
      if (cVar.image && cVar.image !== mainImg && !list.some((item) => item.url === cVar.image)) {
        list.push({
          id: `color-${idx}`,
          type: 'color',
          label: cVar.name,
          url: cVar.image,
          colorName: cVar.name,
        });
      }
    });

    // If no custom URLs exist, generate color previews so thumbnail list has interactive items
    if (list.length === 1 && !list[0].url) {
      resolvedColors.forEach((cVar, idx) => {
        if (idx > 0) {
          list.push({
            id: `v-color-${idx}`,
            type: 'color',
            label: cVar.name,
            colorName: cVar.name,
          });
        }
      });
    }

    return list;
  }, [product, resolvedColors]);

  // Sync state whenever product changes
  useEffect(() => {
    const firstColor = resolvedColors[0]?.name || 'সাদা (White)';
    setSelectedColor(firstColor);
    const firstSize = resolvedSizes[0] || 'Standard';
    setSelectedSize(firstSize);
    setActiveImage(resolvedColors[0]?.image || product.thumbnailUrl || product.imageUrl);
    setSelectedImageIndex(0);
  }, [product, resolvedColors, resolvedSizes]);

  // Reviews State - ONLY Super Admin approved reviews are displayed in public!
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(() => {
    const approved = getPublicApprovedReviews(product.id);
    return approved.map((r) => ({
      id: r.id,
      userName: r.reviewerName,
      rating: r.rating,
      comment: r.reviewComment,
      date: r.date,
    }));
  });
  const [hasPendingNotice, setHasPendingNotice] = useState(false);
  const [experienceRating, setExperienceRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [formError, setFormError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [isLocalAuthOpen, setIsLocalAuthOpen] = useState(false);

  // Real-time synchronization: when Super Admin approves, it immediately displays live
  useEffect(() => {
    const syncApprovedReviews = () => {
      const approved = getPublicApprovedReviews(product.id);
      setReviewsList(
        approved.map((r) => ({
          id: r.id,
          userName: r.reviewerName,
          rating: r.rating,
          comment: r.reviewComment,
          date: r.date,
        }))
      );
    };
    syncApprovedReviews();
    window.addEventListener('storage', syncApprovedReviews);
    window.addEventListener('reviews-updated', syncApprovedReviews);
    return () => {
      window.removeEventListener('storage', syncApprovedReviews);
      window.removeEventListener('reviews-updated', syncApprovedReviews);
    };
  }, [product.id]);

  const handleOpenAuth = () => {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setIsLocalAuthOpen(true);
    }
  };

  const handleSelectColor = (colorVariant: ColorVariant) => {
    setSelectedColor(colorVariant.name);
    if (colorVariant.image) {
      setActiveImage(colorVariant.image);
      const matchIdx = galleryItems.findIndex(
        (g) => g.url === colorVariant.image || g.colorName === colorVariant.name
      );
      if (matchIdx > -1) setSelectedImageIndex(matchIdx);
    } else {
      setActiveImage(undefined);
      const matchIdx = galleryItems.findIndex((g) => g.colorName === colorVariant.name);
      if (matchIdx > -1) setSelectedImageIndex(matchIdx);
    }
  };

  const handleSelectThumbnail = (index: number) => {
    setSelectedImageIndex(index);
    const item = galleryItems[index];
    if (item) {
      if (item.url) {
        setActiveImage(item.url);
      } else {
        setActiveImage(undefined);
      }
      if (item.colorName) {
        setSelectedColor(item.colorName);
      }
    }
  };

  const handlePrevImage = () => {
    const nextIdx = selectedImageIndex === 0 ? galleryItems.length - 1 : selectedImageIndex - 1;
    handleSelectThumbnail(nextIdx);
  };

  const handleNextImage = () => {
    const nextIdx = selectedImageIndex === galleryItems.length - 1 ? 0 : selectedImageIndex + 1;
    handleSelectThumbnail(nextIdx);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceRating || experienceRating === 0) {
      setFormError('অনুগ্রহ করে আপনার অভিজ্ঞতা নির্বাচন করুন');
      return;
    }
    if (!reviewText.trim()) {
      setFormError('অনুগ্রহ করে আপনার রিভিউ লিখুন');
      return;
    }

    // Customer review submitted with Pending status: NEVER shown publicly until Super Admin approves!
    submitCustomerReview({
      productId: product.id,
      productName: product.title || product.name,
      reviewerName: reviewerName.trim() || 'সম্মানিত ক্রেতা',
      rating: experienceRating,
      reviewComment: reviewText.trim(),
    });

    setExperienceRating(0);
    setReviewText('');
    setReviewerName('');
    setFormError('');
    setHasPendingNotice(true);
    setSuccessToast(
      'ধন্যবাদ! আপনার রিভিউ সফলভাবে জমা হয়েছে। আমাদের সুপার অ্যাডমিন পর্যালোচনার পর এটি অনুমোদিত হলে ওয়েবসাইটে প্রদর্শিত হবে।'
    );
    setTimeout(() => {
      setSuccessToast('');
    }, 6000);
  };

  // Get active color variant details if present
  const activeColorVariant = resolvedColors.find((c) => c.name === selectedColor);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb / Back button */}
      <div className="mb-4 flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={onBackToHome}
          className="hover:text-[#990000] font-medium flex items-center gap-1 transition-colors"
        >
          <span>← হোমপেজে ফিরে যান</span>
        </button>
        <span>/</span>
        <span className="text-slate-700">{product.category}</span>
        <span>/</span>
        <span className="text-[#990000] font-semibold truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main Product Container */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Gallery: Vertical Thumbnails + Main View (5 Cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-center sm:items-start">
            {/* Vertical thumbnails */}
            <div className="flex sm:flex-col gap-2 shrink-0 items-center">
              <button
                onClick={handlePrevImage}
                className="w-6 h-6 rounded-full border border-slate-300 text-slate-500 hover:text-[#990000] flex items-center justify-center hidden sm:flex cursor-pointer"
                aria-label="Previous thumbnail"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              <div className="flex sm:flex-col gap-2 max-h-[420px] overflow-y-auto pr-0.5">
                {galleryItems.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectThumbnail(idx)}
                    title={item.label}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded border-2 overflow-hidden bg-slate-50 flex items-center justify-center p-1 transition-all cursor-pointer relative ${
                      selectedImageIndex === idx
                        ? 'border-[#990000] ring-2 ring-red-100 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <ProductVisual
                      visualType={product.visualType}
                      name={product.name}
                      imageUrl={item.url}
                      color={item.colorName || (item.id === 'main' ? selectedColor : undefined)}
                    />
                    {item.colorName && (
                      <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[8px] text-white text-center font-bold truncate px-0.5 py-0.2">
                        {item.colorName.split(' ')[0]}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextImage}
                className="w-6 h-6 rounded-full border border-slate-300 text-slate-500 hover:text-[#990000] flex items-center justify-center hidden sm:flex cursor-pointer"
                aria-label="Next thumbnail"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Big Main Image Frame */}
            <div className="relative w-full aspect-square bg-[#fcfcfc] rounded-lg border border-slate-200 overflow-hidden flex items-center justify-center p-6 shadow-2xs group">
              {/* Brand watermark badge as shown in image ("Vibehul") */}
              <div className="absolute top-3 left-4 text-xs font-bold text-slate-400">
                <span className="text-amber-600 font-black">Vibe</span>hul
              </div>

              {/* Prev / Next Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-slate-300 text-slate-700 hover:text-[#990000] hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-slate-300 text-slate-700 hover:text-[#990000] hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Image artwork */}
              <div className="w-full h-full flex items-center justify-center max-w-[340px]">
                <ProductVisual
                  visualType={product.visualType}
                  name={product.name}
                  imageUrl={activeImage}
                  color={selectedColor}
                />
              </div>

              {/* Bottom Image counter pill */}
              <div className="absolute bottom-3 left-4 bg-slate-900/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>{selectedImageIndex + 1}</span>
                <span>/</span>
                <span>{galleryItems.length}</span>
                {activeColorVariant && (
                  <span className="ml-1 pl-1 border-l border-white/30 text-amber-300">
                    {activeColorVariant.name}
                  </span>
                )}
              </div>

              {/* Expand icon */}
              <button
                onClick={() => alert(`ফুলস্ক্রিন প্রিভিউ: ${product.name} (${selectedColor})`)}
                className="absolute bottom-3 right-4 p-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-[#990000] shadow-xs cursor-pointer"
                title="Fullscreen Zoom"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module (7 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {product.description || (
                  `${product.name} Product name desktop table fan Material Plastic Colour White/black/pink High capacity battery rechargeable 3-speed wind control.`
                )}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
              <span className="text-2xl sm:text-3xl font-black text-[#990000]">
                ৳{product.currentPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ৳{product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.badge && (
                <span className="bg-[#990000] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  {product.badge}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  {Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100)}% ছাড়
                </span>
              )}
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-4">
              {/* 1. Interactive Color Selection (কালার নির্বাচন) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    কালার নির্বাচন করুন: <span className="text-[#990000] font-black">{selectedColor}</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {resolvedColors.length} টি কালার অপশন
                  </span>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  {resolvedColors.map((cVar) => {
                    const isSelected = selectedColor === cVar.name;
                    return (
                      <button
                        key={cVar.name}
                        type="button"
                        onClick={() => handleSelectColor(cVar)}
                        className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#990000] bg-red-50/70 text-[#990000] ring-1 ring-[#990000] font-bold shadow-xs'
                            : 'border-slate-300 hover:border-slate-400 bg-white text-slate-700'
                        }`}
                      >
                        {/* Color swatch or thumbnail image */}
                        {cVar.image ? (
                          <div className="w-5 h-5 rounded-full border border-slate-300 overflow-hidden shrink-0">
                            <img src={cVar.image} alt={cVar.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300 shrink-0 shadow-2xs flex items-center justify-center"
                            style={{ backgroundColor: cVar.hex || '#ffffff' }}
                          >
                            {isSelected && (
                              <Check
                                className={`w-2.5 h-2.5 ${
                                  cVar.hex && ['#ffffff', '#fff', '#f8fafc', '#f1f5f9'].includes(cVar.hex.toLowerCase())
                                    ? 'text-slate-900'
                                    : 'text-white'
                                }`}
                              />
                            )}
                          </span>
                        )}
                        <span>{cVar.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Interactive Size Selection (সাইজ নির্বাচন) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800">
                    সাইজ নির্বাচন করুন: <span className="text-[#990000] font-black">{selectedSize}</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {resolvedSizes.map((sz) => {
                    const isSelected = selectedSize === sz;
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-10 px-3.5 py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-[#990000] text-white border-[#990000] shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quantity Stepper */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-slate-700">পরিমাণ:</span>
                <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-[#990000] text-white flex items-center justify-center font-bold text-base hover:bg-[#800000] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="text"
                    readOnly
                    value={quantity}
                    className="w-12 h-8 text-center text-xs font-bold text-slate-900 bg-white focus:outline-none"
                  >
                  </input>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 bg-[#990000] text-white flex items-center justify-center font-bold text-base hover:bg-[#800000] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-500 font-medium ml-2">
                  মোট: <span className="font-bold text-[#990000]">৳{(product.currentPrice * quantity).toLocaleString()}</span>
                </span>
              </div>

              {/* Primary Two Buttons: Cart & Instant Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    onAddToCart(product, quantity, {
                      color: selectedColor,
                      size: selectedSize,
                      image: activeImage || activeColorVariant?.image || product.thumbnailUrl || product.imageUrl,
                    })
                  }
                  className="w-full py-2.5 px-4 text-center text-xs font-bold text-[#990000] bg-white border-2 border-[#990000] rounded hover:bg-red-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>কার্টে যোগ করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    onInstantOrder(product, quantity, {
                      color: selectedColor,
                      size: selectedSize,
                      image: activeImage || activeColorVariant?.image || product.thumbnailUrl || product.imageUrl,
                    })
                  }
                  className="w-full py-2.5 px-4 text-center text-xs font-bold text-white bg-[#990000] hover:bg-[#800000] rounded flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>অর্ডার করুন</span>
                </button>
              </div>

              {/* Direct Hotline & WhatsApp Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <a
                  href="tel:01982708789"
                  className="w-full py-2 px-3 rounded bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>কল করুন 01982708789</span>
                </a>

                <a
                  href="https://wa.me/8801982708789?text=I%20want%20to%20order"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপে মেসেজ করুন</span>
                </a>
              </div>

              {/* Meta Tags: Wishlist, Category, Brand */}
              <div className="flex flex-wrap items-center gap-2 text-xs pt-3 mt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onToggleWishlist(product)}
                  className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'border-[#990000] text-[#990000] bg-red-50 font-bold'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#990000]' : ''}`} />
                  <span>পছন্দের তালিকায় রাখুন</span>
                </button>

                <div className="px-3 py-1.5 rounded border border-slate-200 flex items-center gap-1.5 text-slate-700">
                  <span className="font-semibold">Category:</span>
                  <span className="text-[#990000] font-bold">{product.category}</span>
                </div>

                <div className="px-3 py-1.5 rounded border border-slate-200 flex items-center gap-1.5 text-slate-700">
                  <span className="font-semibold">Brand:</span>
                  <span className="text-slate-900 font-bold">{product.brand || 'VISION Vision'}</span>
                </div>
              </div>

              {/* Stock Urgency Notice */}
              <div className="mt-3 text-left">
                <p className="text-xs font-bold text-[#990000] tracking-wide animate-pulse">
                  স্টক আউট হওয়ার আগেই অর্ডার করুন
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Section Below with Red Active Tab */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <div className="flex border-b border-slate-200 gap-1">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold border-t-2 -mb-px transition-colors ${
                activeTab === 'description'
                  ? 'border-[#990000] text-[#990000] bg-white border-x border-slate-200'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold border-t-2 -mb-px transition-colors ${
                activeTab === 'specifications'
                  ? 'border-[#990000] text-[#990000] bg-white border-x border-slate-200'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 text-xs sm:text-sm font-bold border-t-2 -mb-px transition-colors ${
                activeTab === 'reviews'
                  ? 'border-[#990000] text-[#990000] bg-white border-x border-slate-200'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews {reviewsList.length > 0 ? `(${reviewsList.length})` : ''}
            </button>
          </div>

          {/* Tab Content Box with Red border accent */}
          <div className="p-5 border border-slate-200 border-t-0 rounded-b-lg bg-[#fafafa]/50 text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">{product.name}</h4>
                <p>
                  এটি একটি আধুনিক ও প্রিমিয়াম কোয়ালিটির রিচার্জেবল ডেস্কটপ ফ্যান। লোডশেডিং কিংবা ঘরের যে কোনো স্থানে
                  সহজে ব্যবহার উপযোগী। উচ্চ ক্ষমতাসম্পন্ন ব্যাটারির কারণে দীর্ঘক্ষণ ব্যাকআপ পাওয়া যায়।
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>৩-স্পিড উইন্ড কন্ট্রোল (লো, মিডিয়াম, হাই)</li>
                  <li>সাইলেন্ট এবং নয়েজ-ফ্রি মোটর প্রযুক্তি</li>
                  <li>ইউএসবি টাইপ-সি ফাস্ট চার্জিং সুবিধা</li>
                  <li>লাইটওয়েট ও পোর্টেবল ডিজাইন</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-lg space-y-2 text-xs">
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Material</span>
                  <span>ABS + Polycarbonate</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Battery Capacity</span>
                  <span>2400mAh Li-ion</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Charging Port</span>
                  <span>Type-C USB (5V/1A)</span>
                </div>
                <div className="grid grid-cols-2 py-1.5 border-b border-slate-200">
                  <span className="font-bold text-slate-600">Warranty</span>
                  <span>6 Months Replacement Warranty</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Submission Card - Pixel-matched to Reference */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs max-w-xl">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                    আপনার রিভিউ দিন
                  </h3>

                  {/* Yellow Warning Notice */}
                  <div className="bg-[#fffbeb] border border-[#fde047] rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 mb-4 flex items-center justify-between flex-wrap gap-1.5">
                    <span>
                      রিভিউ দিতে অনুগ্রহ করে আগে লগইন করুন।{' '}
                      <button
                        type="button"
                        onClick={handleOpenAuth}
                        className="text-[#990000] font-bold hover:underline cursor-pointer inline-block ml-1"
                      >
                        এখানে লগইন / রেজিস্টার করুন
                      </button>
                    </span>
                  </div>

                  {/* Form Success Notification */}
                  {successToast && (
                    <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-md text-xs sm:text-sm flex items-center gap-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{successToast}</span>
                    </div>
                  )}

                  {/* Pending Approval Notice Banner */}
                  {hasPendingNotice && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-md text-xs flex items-start gap-2 animate-in fade-in">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">আপনার রিভিউটি পর্যালোচনার জন্য জমা হয়েছে!</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">
                          সুপার অ্যাডমিন অনুমোদনের পর এটি সবার জন্য উন্মুক্ত করা হবে।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Form Error Notification */}
                  {formError && (
                    <div className="mb-4 p-2.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-md text-xs flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Experience Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        অভিজ্ঞতা *
                      </label>
                      <div className="relative">
                        <select
                          value={experienceRating}
                          onChange={(e) => {
                            setExperienceRating(Number(e.target.value));
                            setFormError('');
                          }}
                          className="w-full appearance-none border border-slate-300 rounded-md px-3.5 py-2.5 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-1 focus:ring-[#990000] focus:border-[#990000] cursor-pointer pr-10"
                        >
                          <option value={0}>আপনার অভিজ্ঞতা কেমন ছিল?</option>
                          <option value={5}>৫ স্টার (অসাধারণ / চমৎকার)</option>
                          <option value={4}>৪ স্টার (খুব ভালো)</option>
                          <option value={3}>৩ স্টার (মোটামুটি / সাধারণ)</option>
                          <option value={2}>২ স্টার (খারাপ)</option>
                          <option value={1}>১ স্টার (খুব খারাপ)</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Review Textarea */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        আপনার রিভিউ *
                      </label>
                      <textarea
                        rows={4}
                        value={reviewText}
                        onChange={(e) => {
                          setReviewText(e.target.value);
                          setFormError('');
                        }}
                        placeholder="এখানে আপনার অভিজ্ঞতা লিখুন..."
                        className="w-full border border-slate-300 rounded-md p-3 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                      />
                    </div>

                    {/* Optional Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        আপনার নাম (ঐচ্ছিক)
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="আপনার নাম লিখুন (ডিফল্ট: সম্মানিত ক্রেতা)"
                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#990000] focus:border-[#990000]"
                      />
                    </div>

                    {/* Submit Review Button */}
                    <button
                      type="submit"
                      className="w-full bg-[#8B0000] hover:bg-[#720000] active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded text-sm transition-all shadow-xs"
                    >
                      রিভিউ জমা দিন
                    </button>
                  </form>
                </div>

                {/* Bottom Status / Existing Reviews */}
                {reviewsList.length === 0 ? (
                  <div className="text-right sm:text-right py-4 text-xs sm:text-sm text-slate-500 font-medium">
                    এখনো কোনো রিভিউ নেই। আপনি প্রথম রিভিউ দিন!
                  </div>
                ) : (
                  <div className="space-y-3 max-w-xl">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 border-b border-slate-200 pb-2">
                      গ্রাহকদের রিভিউ ({reviewsList.length})
                    </h4>
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-3.5 bg-white rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-slate-600 ml-1.5 font-medium">({rev.rating}/৫)</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fallback AuthModal if onOpenAuth is used locally */}
      <AuthModal
        isOpen={isLocalAuthOpen}
        onClose={() => setIsLocalAuthOpen(false)}
      />
    </div>
  );
};
