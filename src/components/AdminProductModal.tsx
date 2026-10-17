import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Check,
  Trash2,
  Upload,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Package,
  Palette,
  Ruler,
  FileText,
  Sparkles,
  AlertTriangle,
  Eye,
  Camera,
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminProductRow } from './AllProductsPage';
import { ColorVariant } from '../types';

export const PRESET_APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
export const PRESET_SHOE_SIZES = ['38', '39', '40', '41', '42', '43', '44', '45', '46'];

export const PRESET_COLORS = [
  { name: 'কালো (Black)', hex: '#000000', border: false },
  { name: 'সাদা (White)', hex: '#FFFFFF', border: true },
  { name: 'লাল (Red)', hex: '#DC2626', border: false },
  { name: 'নীল (Blue)', hex: '#2563EB', border: false },
  { name: 'সবুজ (Green)', hex: '#16A34A', border: false },
  { name: 'মেরুন (Maroon)', hex: '#800000', border: false },
  { name: 'নেভি ব্লু (Navy)', hex: '#1E3A8A', border: false },
  { name: 'গোলাপী (Pink)', hex: '#DB2777', border: false },
  { name: 'হলুদ (Yellow)', hex: '#CA8A04', border: false },
  { name: 'অলিভ (Olive)', hex: '#4D7C0F', border: false },
  { name: 'ধূসর (Gray)', hex: '#6B7280', border: false },
  { name: 'বাদামী (Brown)', hex: '#78350F', border: false },
  { name: 'গোল্ডেন (Golden)', hex: '#D97706', border: false },
];

export const PRESET_CATEGORIES = [
  'FORMAL SHOE',
  'Smart Watch',
  'Wired Headphone',
  'Winter Jacket',
  'Woman Khimar',
  'Woman Borka',
  "Man's Jubba",
  "Man's Panjabi",
  "Man's Shirt",
  'Gadget and Accessories',
  'Electronics',
  'Home & Kitchen',
];

export const PRESET_BRANDS = [
  'Walton',
  'Apex',
  'Lotto',
  'Comforty',
  'Casio',
  'Fastrack',
  'Xiaomi',
  'Samsung',
  'Realme',
  'Generic / নন-ব্র্যান্ড',
];

export const PRESET_SECTIONS = [
  { value: 'hot_deals', label: 'হট ডিলস (Hot Deals)' },
  { value: 'flash_sale', label: 'ফ্ল্যাশ সেল (Flash Sale)' },
  { value: 'top_rated', label: 'টপ রেটেড (Top Rated)' },
  { value: 'best_sells', label: 'বেস্ট সেলিং (Best Sells)' },
  { value: 'regular', label: 'রেগুলার পণ্য (Regular)' },
];

export const PRESET_BADGES = [
  'ডেলিভারি ফ্রি',
  '৪০% ছাড়',
  '৫০% ছাড়',
  'হট সেল',
  'নতুন কালেকশন',
  'বেস্ট সেলার',
  'সীমিত অফার',
];

export const VISUAL_TYPE_OPTIONS = [
  { value: 'formal_shoe', label: 'ফরমাল সু / লোফার' },
  { value: 'floor_mat', label: 'ওয়াটার অ্যাবজরবিং ম্যাট' },
  { value: 'smart_watch', label: 'স্মার্ট ওয়াচ' },
  { value: 'wireless_speaker', label: 'ওয়ারলেস স্পিকার' },
  { value: 'cotton_khimar_red', label: 'কটন খিমার (লাল/মেরুন)' },
  { value: 'kids_khimar_pink', label: 'বাচ্চাদের খিমার (পিংক)' },
  { value: 'president_jubba_white', label: 'জুব্বা (সাদা)' },
  { value: 'president_jubba_teal', label: 'জুব্বা (টিল/নীল)' },
  { value: 'president_jubba_navy', label: 'জুব্বা (নেভি)' },
  { value: 'leather_half_shoe', label: 'লেদার হাফ সু' },
  { value: 'embroidered_panjabi', label: 'এমব্রয়ডারি পাঞ্জাবি' },
  { value: 'silver_crest_kettle', label: 'সিলভার ক্রেস্ট গ্রাইন্ডার/কেটলি' },
  { value: 'bedsheet_set', label: 'কটন বেডশিট' },
  { value: 'neck_fan', label: 'নেক ফ্যান' },
  { value: 'desktop_fan', label: 'ডেস্ক ফ্যান' },
  { value: 'potato_chipper', label: 'পটেটো চিপার' },
  { value: 'wooden_wall_clock', label: 'উডেন ওয়াল ক্লক' },
  { value: 'ultrapods_max', label: 'আল্ট্রাপডস ম্যাক্স' },
  { value: 'scalp_massager', label: 'স্ক্যাল্প ম্যাসাজার' },
  { value: 'school_bag_black', label: 'স্কুল ব্যাগ' },
  { value: 'laptop_bag', label: 'ল্যাপটপ ব্যাগ' },
  { value: 'table_lamp', label: 'মাল্টিফাংশন টেবিল ল্যাম্প' },
  { value: 'jiofi_router', label: 'ওয়াইফাই রাউটার' },
  { value: 'rechargeable_fan', label: 'রিচার্জেবল ফ্যান' },
  { value: 'furniture_moving_set', label: 'ফার্নিচার মুভিং সেট' },
  { value: 'wooden_tissue_box', label: 'উডেন টিস্যু বক্স' },
  { value: 't900_ultra', label: 'T900 আল্ট্রা স্মার্ট ওয়াচ' },
];

interface AdminProductModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  product: AdminProductRow | null;
  onClose: () => void;
  onSave: (product: AdminProductRow) => void;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  isOpen,
  mode,
  product,
  onClose,
  onSave,
}) => {
  // Form States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number>(990);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(1200);
  const [discountPercent, setDiscountPercent] = useState('');
  const [stock, setStock] = useState<number | string>(100);
  const [stockStatus, setStockStatus] = useState<'in_stock' | 'out_of_stock' | 'limited'>('in_stock');
  const [category, setCategory] = useState('FORMAL SHOE');
  const [subcategory, setSubcategory] = useState('');
  const [brand, setBrand] = useState('Walton');
  const [section, setSection] = useState('hot_deals');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [visualType, setVisualType] = useState('formal_shoe');

  // Resolve available subcategories for selected category
  const availableSubcategories: string[] = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('ummah_admin_categories_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = parsed.find(
          (c: any) => c.name?.toLowerCase().trim() === category.toLowerCase().trim()
        );
        if (match && Array.isArray(match.subcategories) && match.subcategories.length > 0) {
          return match.subcategories.map((s: any) => s.name);
        }
      }
    } catch {
      // ignore
    }
    const fallbackMap: { [key: string]: string[] } = {
      'Woman Khimar': ['Cotton Khimar', 'Georgette Khimar', 'Two-Piece Khimar Set', 'French Khimar'],
      'FORMAL SHOE': ['Leather Half Shoe', 'Oxford Formal Shoe', 'Loafer Shoe', 'Pure Leather Sandal'],
      'Woman Borka': ['Dubai Cherry Borka', 'Abaya Borka', 'Coat Borka'],
      'Kids Khimar': ['Kids Cotton Khimar', 'Kids Party Khimar'],
      "Man's Shirt": ['Formal Cotton Shirt', 'Casual Oxford Shirt', 'Printed Linen Shirt'],
      'Winter Jacket': ['Windbreaker Jacket', 'Bomber Jacket', 'Hoodie Jacket'],
      "Man's Jubba": ['Arabian Tory Jubba', 'Embroidered Jubba', 'Short Kurta Jubba'],
      'Electronics': ['Rechargeable Table Fans', 'Electric Kettles & Grinders', 'Desk Lamps'],
      'Leather Goods': ['Executive Laptop Bags', 'Genuine Leather Wallets', 'Leather Belts'],
      'Gadget and Accessories': ['Smart Watches', 'Wireless Earbuds', 'Bluetooth Speakers'],
    };
    return fallbackMap[category] || [];
  }, [category]);

  // Media States (Thumbnail & Gallery exactly matching the user's uploaded screenshot)
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [colorImages, setColorImages] = useState<{ [colorName: string]: string }>({});

  // Variants State: Sizes & Colors
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#000000');

  // URL input helper states
  const [showUrlThumbnailInput, setShowUrlThumbnailInput] = useState(false);
  const [customThumbnailUrl, setCustomThumbnailUrl] = useState('');
  const [showUrlGalleryInput, setShowUrlGalleryInput] = useState(false);
  const [customGalleryUrl, setCustomGalleryUrl] = useState('');

  // Refs for hidden file inputs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Active section tab for navigation
  const [activeTab, setActiveTab] = useState<'all' | 'basic' | 'price' | 'variants' | 'media'>('all');

  // Load existing values when opening edit mode or reset on add
  useEffect(() => {
    if (mode === 'edit' && product) {
      setName(product.name || '');
      setSku(product.sku || `SKU-${product.id}`);
      setPrice(Number(product.price) || 0);
      setOriginalPrice(product.originalPrice ? Number(product.originalPrice) : '');
      setDiscountPercent(product.discountPercent || '');
      setStock(product.stock !== undefined ? product.stock : 100);
      setStockStatus(
        Number(product.stock) > 10
          ? 'in_stock'
          : Number(product.stock) > 0
          ? 'limited'
          : 'out_of_stock'
      );
      setCategory(product.category || 'FORMAL SHOE');
      setSubcategory(product.subcategory || '');
      setBrand(product.brand && product.brand !== '—' ? product.brand : 'Generic');
      setSection(product.section || 'hot_deals');
      setBadge(product.badge || '');
      setDescription(product.description || '');
      setVisualType(product.visualType || 'formal_shoe');
      setThumbnailUrl(product.thumbnailUrl || product.imageUrl || '');
      setGalleryImages(product.galleryImages || []);
      setSizes(product.sizes || ['39', '40', '41', '42']);
      setColors(product.colors || ['কালো (Black)', 'বাদামী (Brown)']);

      // Populate color images
      const initialColorMap: { [c: string]: string } = {};
      if (product.colorVariants && Array.isArray(product.colorVariants)) {
        product.colorVariants.forEach((cv: ColorVariant) => {
          if (cv.name && cv.image) {
            initialColorMap[cv.name] = cv.image;
          }
        });
      }
      setColorImages(initialColorMap);
    } else if (mode === 'add') {
      setName('');
      setSku(`UMB-${Date.now().toString().slice(-4)}`);
      setPrice(990);
      setOriginalPrice(1200);
      setDiscountPercent('-18%');
      setStock(100);
      setStockStatus('in_stock');
      setCategory('FORMAL SHOE');
      setSubcategory('');
      setBrand('Walton');
      setSection('hot_deals');
      setBadge('ডেলিভারি ফ্রি');
      setDescription('');
      setVisualType('formal_shoe');
      setThumbnailUrl('');
      setGalleryImages([]);
      setColorImages({});
      setSizes(['39', '40', '41', '42']);
      setColors(['কালো (Black)', 'বাদামী (Brown)']);
    }
    setCustomSizeInput('');
    setCustomColorName('');
    setShowUrlThumbnailInput(false);
    setShowUrlGalleryInput(false);
  }, [mode, product, isOpen]);

  // Auto-calculate discount when originalPrice or price changes
  const handlePriceChange = (newPrice: number) => {
    setPrice(newPrice);
    if (typeof originalPrice === 'number' && originalPrice > newPrice && originalPrice > 0) {
      const disc = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
      setDiscountPercent(`-${disc}%`);
    } else {
      setDiscountPercent('');
    }
  };

  const handleOriginalPriceChange = (newOrig: number | '') => {
    setOriginalPrice(newOrig);
    if (typeof newOrig === 'number' && newOrig > price && newOrig > 0) {
      const disc = Math.round(((newOrig - price) / newOrig) * 100);
      setDiscountPercent(`-${disc}%`);
    } else {
      setDiscountPercent('');
    }
  };

  // Toggle size from presets
  const handleToggleSize = (sizeVal: string) => {
    setSizes((prev) =>
      prev.includes(sizeVal) ? prev.filter((s) => s !== sizeVal) : [...prev, sizeVal]
    );
  };

  // Add custom size
  const handleAddCustomSize = () => {
    const trimmed = customSizeInput.trim();
    if (!trimmed) return;
    if (!sizes.includes(trimmed)) {
      setSizes((prev) => [...prev, trimmed]);
    }
    setCustomSizeInput('');
  };

  // Remove size
  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  // Toggle color from presets
  const handleToggleColor = (colorName: string) => {
    setColors((prev) => {
      if (prev.includes(colorName)) {
        return prev.filter((c) => c !== colorName);
      } else {
        return [...prev, colorName];
      }
    });
  };

  // Add custom color
  const handleAddCustomColor = () => {
    const trimmed = customColorName.trim();
    if (!trimmed) return;
    if (!colors.includes(trimmed)) {
      setColors((prev) => [...prev, trimmed]);
    }
    setCustomColorName('');
  };

  // Remove color
  const handleRemoveColor = (colorToRemove: string) => {
    setColors((prev) => prev.filter((c) => c !== colorToRemove));
    // Clean up color image mapping
    setColorImages((prev) => {
      const copy = { ...prev };
      delete copy[colorToRemove];
      return copy;
    });
  };

  // 1. Upload Thumbnail Image (Matches user screenshot: UPLOAD THUMBNAIL IMAGE 360 X 360)
  const handleThumbnailFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Upload Product Gallery Images (Matches user screenshot: PRODUCT GALLERY +Add)
  const handleGalleryFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setGalleryImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // 3. Upload Image for Specific Color Variant
  const handleColorImageSelect = (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setColorImages((prev) => ({
            ...prev,
            [colorName]: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorImageUrlChange = (colorName: string, url: string) => {
    setColorImages((prev) => ({
      ...prev,
      [colorName]: url,
    }));
  };

  const handleRemoveColorImage = (colorName: string) => {
    setColorImages((prev) => {
      const copy = { ...prev };
      delete copy[colorName];
      return copy;
    });
  };

  const handleSubmit = (e?: React.FormEvent | React.MouseEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!name || !name.trim()) {
      alert('দয়া করে প্রোডাক্টের নাম লিখুন!');
      setActiveTab('basic');
      return;
    }

    const numPrice = Number(price) || 0;
    if (numPrice <= 0) {
      alert('দয়া করে প্রোডাক্টের সঠিক বিক্রয় মূল্য (Price) নির্ধারণ করুন!');
      setActiveTab('price');
      return;
    }

    const numStock = typeof stock === 'number' ? stock : parseInt(String(stock)) || 0;
    const finalStockColor = numStock > 50 ? 'green' : numStock > 0 ? 'yellow' : 'red';

    // Build structured colorVariants with color name, image, and hex
    const colorVariants: ColorVariant[] = colors.map((colName) => {
      const preset = PRESET_COLORS.find((p) => p.name === colName);
      return {
        name: colName,
        image: colorImages[colName] || '',
        hex: preset ? preset.hex : '#000000',
      };
    });

    const primaryImage =
      thumbnailUrl.trim() ||
      (galleryImages.length > 0 ? galleryImages[0] : '') ||
      (colors.length > 0 && colorImages[colors[0]] ? colorImages[colors[0]] : '');

    const savedRow: AdminProductRow = {
      id: product?.id || `prod-${Date.now()}`,
      sl: product?.sl || 1,
      name: name.trim(),
      sku: sku.trim() || undefined,
      price: Number(price) || 0,
      originalPrice: typeof originalPrice === 'number' && originalPrice > 0 ? originalPrice : undefined,
      discountPercent: discountPercent.trim() || undefined,
      category: category.trim() || '—',
      subcategory: subcategory.trim() || undefined,
      brand: brand.trim() || '—',
      section: section || 'hot_deals',
      stock: numStock,
      stockColor: finalStockColor,
      sizes: sizes.length > 0 ? sizes : undefined,
      colors: colors.length > 0 ? colors : undefined,
      colorVariants: colorVariants.length > 0 ? colorVariants : undefined,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      imageUrl: primaryImage || undefined,
      badge: badge.trim() || undefined,
      description: description.trim() || undefined,
      visualType: visualType,
      inStock: stockStatus !== 'out_of_stock' && numStock > 0,
    };

    onSave(savedRow);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-auto overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* 1. Modal Top Header */}
        <div className="bg-[#1e293b] text-white p-4 px-6 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#990000] text-white flex items-center justify-center font-bold shadow-xs">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{mode === 'edit' ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যুক্ত করুন'}</span>
                {mode === 'edit' && product && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    ID: #{product.id}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                থাম্বনেইল, গ্যালারি ও কালার অনুযায়ী ইমেজসহ প্রোডাক্টের যাবতীয় তথ্য কনফিগার করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Quick Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            সব তথ্য (All)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'media'
                ? 'bg-[#990000] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>ইমেজ আপলোড ও গ্যালারি</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('variants')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'variants'
                ? 'bg-[#990000] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>কালার ওয়াইজ ইমেজ ও সাইজ ({colors.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('price')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'price'
                ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>প্রাইস ও স্টক</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'basic'
                ? 'bg-[#1e293b] text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>সাধারণ তথ্য</span>
          </button>
        </div>

        {/* 3. Modal Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-slate-800">
          {/* ============================================================== */}
          {/* SECTION: THUMBNAIL & GALLERY UPLOAD (Matches Screenshot)       */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'media') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-5 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-[#990000]" />
                <span>প্রোডাক্ট ইমেজ ও গ্যালারি (Product Images & Gallery)</span>
              </div>

              {/* 1. UPLOAD THUMBNAIL IMAGE (360 X 360) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  UPLOAD THUMBNAIL IMAGE (360 X 360)
                </label>

                {thumbnailUrl ? (
                  <div className="relative group w-full max-w-xs aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden p-2 flex items-center justify-center shadow-xs">
                    <img
                      src={thumbnailUrl}
                      alt="Thumbnail preview"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-white">
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#990000]" />
                        <span>ছবি পরিবর্তন করুন</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setThumbnailUrl('')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>মুছে ফেলুন</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-100/70 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white border border-slate-200 text-slate-500 group-hover:text-[#990000] flex items-center justify-center mb-2 shadow-2xs group-hover:scale-105 transition-transform">
                      <Upload className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <span className="font-semibold text-slate-700 text-sm group-hover:text-[#990000] transition-colors">
                      Upload thumbnail image
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">
                      JPG, PNG, WEBP (360 x 360 px recommended)
                    </span>
                  </div>
                )}

                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileSelect}
                  className="hidden"
                />

                {/* Optional URL input for thumbnail */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlThumbnailInput(!showUrlThumbnailInput)}
                    className="text-[11px] text-slate-500 hover:text-[#990000] font-semibold underline cursor-pointer"
                  >
                    {showUrlThumbnailInput ? '✕ ইউআরএল ইনপুট লুকান' : '+ ইমেজ লিংক (URL) দিয়ে থাম্বনেইল যুক্ত করুন'}
                  </button>
                </div>
                {showUrlThumbnailInput && (
                  <div className="mt-2 flex items-center gap-2 max-w-md">
                    <input
                      type="url"
                      value={customThumbnailUrl}
                      onChange={(e) => setCustomThumbnailUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customThumbnailUrl.trim()) {
                          setThumbnailUrl(customThumbnailUrl.trim());
                          setCustomThumbnailUrl('');
                          setShowUrlThumbnailInput(false);
                        }
                      }}
                      className="px-3 py-1.5 bg-[#990000] text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-[#800000]"
                    >
                      সেভ
                    </button>
                  </div>
                )}
              </div>

              {/* 2. PRODUCT GALLERY (JPG, JPEG, PNG • MAX 10MB) */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  PRODUCT GALLERY (JPG, JPEG, PNG • MAX 10MB)
                </label>

                {/* Warning Alert matching Screenshot */}
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Please use original product images.</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Uploaded Gallery Thumbnails */}
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="relative group w-20 h-20 rounded-xl border border-slate-200 bg-white overflow-hidden p-1 shadow-2xs flex items-center justify-center shrink-0"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {/* +Add Gallery Box (Matching user screenshot) */}
                  <div
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/70 hover:bg-slate-100/70 flex flex-col items-center justify-center cursor-pointer transition-all group shrink-0"
                    title="Add gallery images"
                  >
                    <Upload className="w-4 h-4 text-slate-500 group-hover:text-[#990000] mb-0.5 transition-colors stroke-[2]" />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-[#990000] transition-colors">
                      +Add
                    </span>
                  </div>
                </div>

                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleGalleryFilesSelect}
                  className="hidden"
                />

                {/* Optional Gallery URL input */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlGalleryInput(!showUrlGalleryInput)}
                    className="text-[11px] text-slate-500 hover:text-[#990000] font-semibold underline cursor-pointer"
                  >
                    {showUrlGalleryInput ? '✕ ইউআরএল ইনপুট লুকান' : '+ ইমেজ লিংক (URL) দিয়ে গ্যালারিতে ছবি যোগ করুন'}
                  </button>
                  {showUrlGalleryInput && (
                    <div className="mt-2 flex items-center gap-2 max-w-md">
                      <input
                        type="url"
                        value={customGalleryUrl}
                        onChange={(e) => setCustomGalleryUrl(e.target.value)}
                        placeholder="https://example.com/gallery-image.jpg"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGalleryUrl.trim()) {
                            setGalleryImages((prev) => [...prev, customGalleryUrl.trim()]);
                            setCustomGalleryUrl('');
                            setShowUrlGalleryInput(false);
                          }
                        }}
                        className="px-3 py-1.5 bg-[#990000] text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-[#800000]"
                      >
                        যোগ করুন
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: COLOR-SPECIFIC IMAGE MAPPING (Core User Request!)     */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'variants' || activeTab === 'media') && (
            <div className="bg-white rounded-lg border border-purple-200 p-4 space-y-4 shadow-2xs ring-1 ring-purple-100">
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <Palette className="w-4 h-4 text-purple-700" />
                  <span>কালার অনুযায়ী প্রোডাক্ট ছবি (Images for Each Color)</span>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {colors.length} টি কালার ভ্যারিয়েন্ট
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                👉 <strong>কীভাবে কাজ করবে:</strong> এখানে প্রতিটি কালারের জন্য ছবি আপলোড করে দিন। যখন কোনো কাস্টমার ওয়েবসাইটে প্রোডাক্ট দেখার সময় যে কালারে ক্লিক করবেন, সাথে সাথে সেই কালারের ছবি প্রোডাক্টের মূল ফটোতে দেখাবে!
              </p>

              {colors.length === 0 ? (
                <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500">
                  <p className="font-semibold mb-1">কোনো কালার সিলেক্ট করা হয়নি</p>
                  <p className="text-[11px] text-slate-400">
                    নিচের "কালার ভ্যারিয়েন্ট" সেকশন থেকে কালার সিলেক্ট করুন, তখন প্রতিটি কালারের জন্য আলাদা ছবি আপলোড করার বক্স আসবে।
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colors.map((colName) => {
                    const preset = PRESET_COLORS.find((p) => p.name === colName);
                    const colHex = preset ? preset.hex : '#000000';
                    const hasColImage = !!colorImages[colName];

                    return (
                      <div
                        key={colName}
                        className="bg-purple-50/40 border border-purple-200 rounded-xl p-3 flex flex-col justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs shrink-0"
                              style={{ backgroundColor: colHex }}
                            />
                            <span className="font-bold text-xs text-slate-800">{colName}</span>
                          </div>
                          {hasColImage ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>ছবি আপলোড আছে</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              ছবি নেই
                            </span>
                          )}
                        </div>

                        {/* Image Preview & Upload for this specific color */}
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg border border-purple-200 bg-white overflow-hidden p-1 shrink-0 flex items-center justify-center relative shadow-2xs">
                            {hasColImage ? (
                              <img
                                src={colorImages[colName]}
                                alt={colName}
                                className="w-full h-full object-contain rounded"
                              />
                            ) : (
                              <div className="text-center text-[10px] text-slate-400 flex flex-col items-center">
                                <Camera className="w-4 h-4 text-slate-300 mb-0.5" />
                                <span>ছবি নেই</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-1.5">
                            <label className="px-2.5 py-1 bg-white hover:bg-purple-100 text-purple-800 border border-purple-300 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs">
                              <Upload className="w-3 h-3" />
                              <span>{hasColImage ? 'ছবি পরিবর্তন করুন' : 'ছবি আপলোড করুন'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleColorImageSelect(colName, e)}
                                className="hidden"
                              />
                            </label>

                            {hasColImage && (
                              <button
                                type="button"
                                onClick={() => handleRemoveColorImage(colName)}
                                className="block text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                              >
                                ছবি সরান
                              </button>
                            )}

                            <input
                              type="url"
                              value={colorImages[colName] || ''}
                              onChange={(e) => handleColorImageUrlChange(colName, e.target.value)}
                              placeholder="বা ইমেজ URL পেস্ট করুন..."
                              className="w-full px-2 py-1 text-[11px] border border-slate-200 rounded focus:outline-none focus:border-purple-600 bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: COLOR OPTIONS SELECTION                               */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'variants') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>কালার ভ্যারিয়েন্ট নির্বাচন (Color Options)</span>
                </div>
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {colors.length} টি কালার নির্বাচিত
                </span>
              </div>

              {/* Preset Colors */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-2">
                  জনপ্রিয় কালার প্যালেট (ক্লিক করে পছন্দ করুন):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_COLORS.map((col) => {
                    const isSelected = colors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => handleToggleColor(col.name)}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-2xs ring-1 ring-purple-400'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full shrink-0 ${
                            col.border ? 'border border-slate-300' : ''
                          }`}
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="truncate text-[11px]">{col.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-700 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Color */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-600 mb-1">
                  কাস্টম কালার যোগ করুন (Custom Color)
                </label>
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="color"
                    value={customColorHex}
                    onChange={(e) => setCustomColorHex(e.target.value)}
                    className="w-9 h-8 p-0.5 border border-slate-300 rounded cursor-pointer shrink-0"
                    title="কালার পিকার থেকে পছন্দ করুন"
                  />
                  <input
                    type="text"
                    value={customColorName}
                    onChange={(e) => setCustomColorName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomColor();
                      }
                    }}
                    placeholder="কালারের নাম (যেমন: রয়েল ব্লু, ম্যাট ব্ল্যাক)"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: SIZES VARIANT                                         */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'variants') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Ruler className="w-4 h-4 text-indigo-600" />
                  <span>সাইজ ভ্যারিয়েন্ট (Size Options)</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {sizes.length} টি সাইজ নির্বাচিত
                </span>
              </div>

              {/* Quick Select Apparel Sizes */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  পোশাক / ক্লথিং সাইজ (ক্লিক করে যোগ/বাদ দিন):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_APPAREL_SIZES.map((sz) => {
                    const isSelected = sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1 rounded font-bold text-xs border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sz} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Select Footwear Sizes */}
              <div>
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5">
                  জুতার সাইজ (Footwear Sizes):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_SHOE_SIZES.map((sz) => {
                    const isSelected = sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1 rounded font-bold text-xs border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {sz} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Size */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-semibold text-slate-600 mb-1">
                  কাস্টম সাইজ লিখুন (Custom Size)
                </label>
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSize();
                      }
                    }}
                    placeholder="যেমন: 32, 34, 48 বা স্পেশাল সাইজ"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>যোগ করুন</span>
                  </button>
                </div>
              </div>

              {/* Active Sizes Chips */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-700 mb-1.5">
                  বর্তমানে এই প্রোডাক্টের জন্য সক্রিয় সাইজসমূহ:
                </p>
                {sizes.length === 0 ? (
                  <p className="text-slate-400 italic text-[11px]">
                    (কোনো সাইজ যুক্ত নেই — সাইজ প্রযোজ্য না হলে খালি রাখুন)
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((sz) => (
                      <span
                        key={sz}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-full font-bold text-xs"
                      >
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(sz)}
                          className="hover:text-red-600 text-slate-400 cursor-pointer"
                          title="এই সাইজটি বাদ দিন"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: BASIC INFORMATION                                    */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'basic') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <Tag className="w-4 h-4 text-[#990000]" />
                <span>সাধারণ তথ্য (Basic Info)</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্রোডাক্টের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: Men's Genuine Leather Half Loafer Shoes"
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* SKU */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    প্রোডাক্ট কোড / SKU
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="যেমন: UMB-SHOE-101"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory('');
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] bg-white cursor-pointer"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategory */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    সাব-ক্যাটাগরি
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      placeholder="সাব-ক্যাটাগরি বাছুন/লিখুন"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                      list="modal-subcategories-list"
                    />
                    <datalist id="modal-subcategories-list">
                      {availableSubcategories.map((sub) => (
                        <option key={sub} value={sub} />
                      ))}
                    </datalist>
                  </div>
                  {availableSubcategories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {availableSubcategories.slice(0, 3).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => setSubcategory(sub)}
                          className={`text-[9px] px-1.5 py-0.5 rounded border transition-colors cursor-pointer truncate max-w-[110px] ${
                            subcategory === sub
                              ? 'bg-purple-700 text-white border-purple-700 font-bold'
                              : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100'
                          }`}
                          title={sub}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ব্র্যান্ড</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="যেমন: Walton / Apex"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                      list="brand-options"
                    />
                    <datalist id="brand-options">
                      {PRESET_BRANDS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">হোমপেজ সেকশন</label>
                  <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] bg-white cursor-pointer"
                  >
                    {PRESET_SECTIONS.map((sec) => (
                      <option key={sec.value} value={sec.value}>
                        {sec.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">স্পেশাল ব্যাজ (Badge)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="যেমন: ডেলিভারি ফ্রি, ৪০% ছাড়"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {PRESET_BADGES.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBadge(b)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                          badge === b
                            ? 'bg-[#990000] text-white border-[#990000]'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: PRICE & STOCK                                         */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'price') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>মূল্য ও স্টক (Price & Stock)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Sale Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    বিক্রয় / অফার মূল্য (৳) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">৳</span>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] font-bold text-slate-900 text-sm"
                    />
                  </div>
                </div>

                {/* Original Price */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    আগের / নিয়মিত মূল্য (৳)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">৳</span>
                    <input
                      type="number"
                      min={0}
                      value={originalPrice}
                      onChange={(e) =>
                        handleOriginalPriceChange(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      placeholder="যেমন: ১২০০"
                      className="w-full pl-7 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000]"
                    />
                  </div>
                </div>

                {/* Discount % */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ডিসকাউন্ট পার্সেন্টেজ
                  </label>
                  <input
                    type="text"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="যেমন: -20%"
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-rose-600 font-bold"
                  />
                </div>
              </div>

              {/* Stock Quantity & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক পরিমাণ (Stock Quantity)</label>
                  <input
                    type="number"
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">স্টক স্ট্যাটাস</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] bg-white cursor-pointer font-medium"
                  >
                    <option value="in_stock">ইন স্টক (In Stock)</option>
                    <option value="limited">সীমিত স্টক (Limited Stock)</option>
                    <option value="out_of_stock">স্টক আউট (Out of Stock)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* SECTION: DESCRIPTION                                           */}
          {/* ============================================================== */}
          {(activeTab === 'all' || activeTab === 'basic') && (
            <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>বিস্তারিত বিবরণ (Description & Highlights)</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  পণ্যের বিবরণ ও বৈশিষ্ট্য
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="যেমন: প্রিমিয়াম কোয়ালিটি ১০০% জেনুইন লেদার, আরামদায়ক কুশন সোল, টেকসই ও আকর্ষণীয় ডিজাইন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-[#990000] text-xs leading-relaxed"
                />
              </div>
            </div>
          )}
        </form>

        {/* 4. Modal Sticky Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>থাম্বনেইল, গ্যালারি ও কালার ইমেজ রিয়েল-টাইমে সংরক্ষিত হবে</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-xs transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{mode === 'edit' ? 'আপডেট করুন' : 'প্রোডাক্ট সেভ করুন'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
