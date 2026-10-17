import React, { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Copy,
  Edit,
  Trash2,
  X,
  Check,
  CheckCircle2,
  ChevronDown,
  CheckSquare,
  Square,
  MinusSquare,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { AdminProductModal } from './AdminProductModal';
import { SuccessSaveModal } from './SuccessSaveModal';
import { triggerGlobalSuccessModal } from '../context/SuccessModalContext';
import { ColorVariant } from '../types';
import { fetchProductsFromDatabase, saveProductsToDatabase } from '../utils/apiSync';

export interface AdminProductRow {
  id: string;
  sl: number;
  name: string;
  visualType: string;
  price: number;
  originalPrice?: number;
  discountPercent?: string;
  category: string;
  subcategory?: string;
  brand: string;
  stock: number | string; // e.g. 5, 999, 1000, 0, '—'
  stockColor?: 'green' | 'yellow' | 'red' | 'gray';
  section?: string;
  sku?: string;
  sizes?: string[];
  colors?: string[];
  colorVariants?: ColorVariant[];
  thumbnailUrl?: string;
  galleryImages?: string[];
  badge?: string;
  description?: string;
  imageUrl?: string;
  inStock?: boolean;
}

interface AllProductsPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const AllProductsPage: React.FC<AllProductsPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedBrand, setSelectedBrand] = useState('All Brand');
  const [selectedSection, setSelectedSection] = useState('All Section');
  const [pageSize, setPageSize] = useState('20');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bulk Selection States
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(null);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });


  // 20 Exact Products matching Screenshot 1
  const [productsList, setProductsList] = useState<AdminProductRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_products_list');
        if (saved !== null) {
          return JSON.parse(saved);
        }
      } catch (e) {
        console.error('Failed to load products from localStorage', e);
      }
    }
    return [
    {
      id: 'prod-1',
      sl: 1,
      name: "Men's Genuine Leather Half Loafer Shoes",
      visualType: 'formal_shoe',
      price: 1200,
      category: 'FORMAL SHOE',
      brand: '—',
      stock: '—',
      stockColor: 'gray',
    },
    {
      id: 'prod-2',
      sl: 2,
      name: 'Super Water Absorbing Quick Drying Floor Mat',
      visualType: 'floor_mat',
      price: 500,
      originalPrice: 690,
      discountPercent: '-28%',
      category: '—',
      brand: '—',
      stock: 5,
      stockColor: 'yellow',
    },
    {
      id: 'prod-3',
      sl: 3,
      name: 'Laxasfit K10 Ultra Smart Watch With Sim Supported',
      visualType: 'smart_watch',
      price: 1450,
      originalPrice: 1550,
      discountPercent: '-6%',
      category: 'Smart Watch',
      brand: 'Walton',
      stock: 999,
      stockColor: 'green',
    },
    {
      id: 'prod-4',
      sl: 4,
      name: 'Air 31 Wireless Bluetooth Earbuds',
      visualType: 'air_earbuds',
      price: 590,
      originalPrice: 790,
      discountPercent: '-25%',
      category: 'Wired Headphone',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-5',
      sl: 5,
      name: 'লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস',
      visualType: 'oud_perfume',
      price: 1100,
      originalPrice: 1350,
      discountPercent: '-19%',
      category: '—',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-6',
      sl: 6,
      name: 'Portable Retro Camping Lamp',
      visualType: 'camping_lamp',
      price: 1050,
      category: 'FORMAL SHOE',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-7',
      sl: 7,
      name: 'Rechargeable USB T-10 Handheld Mini Fan | 3...',
      visualType: 'desktop_fan',
      price: 480,
      originalPrice: 550,
      discountPercent: '-13%',
      category: 'FORMAL SHOE',
      brand: 'Vision',
      stock: 100,
      stockColor: 'green',
    },
    {
      id: 'prod-8',
      sl: 8,
      name: 'Vacuum Flask Stainless Steel (500 ml flask)',
      visualType: 'vacuum_flask',
      price: 750,
      originalPrice: 790,
      discountPercent: '-5%',
      category: '—',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-9',
      sl: 9,
      name: 'Multifunctional 2 In 1 Egg Opener',
      visualType: 'egg_opener',
      price: 650,
      originalPrice: 790,
      discountPercent: '-18%',
      category: '—',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-10',
      sl: 10,
      name: 'Led Rechargeable Key Chain Light',
      visualType: 'keychain_light',
      price: 750,
      category: 'FORMAL SHOE',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-11',
      sl: 11,
      name: 'Regrsi RE-NY032 Wireless Neckband Bluetooth...',
      visualType: 'neckband_headphone',
      price: 650,
      originalPrice: 890,
      discountPercent: '-27%',
      category: 'Wired Headphone',
      brand: '—',
      stock: 0,
      stockColor: 'red',
    },
    {
      id: 'prod-12',
      sl: 12,
      name: 'Hoco W35 Max Wireless Headphone',
      visualType: 'wireless_headphone',
      price: 1350,
      originalPrice: 1450,
      discountPercent: '-7%',
      category: 'Wired Headphone',
      brand: 'Walton',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-13',
      sl: 13,
      name: 'Ultrapods Max Wireless Earbuds 5.3 Transparent.',
      visualType: 'ultrapods_earbuds',
      price: 500,
      originalPrice: 590,
      discountPercent: '-15%',
      category: 'Wired Headphone',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-14',
      sl: 14,
      name: 'T900 Ultra 2 Pro Smart Watch',
      visualType: 't900_ultra',
      price: 980,
      originalPrice: 1150,
      discountPercent: '-15%',
      category: 'Smart Watch',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-15',
      sl: 15,
      name: 'Laxasfit S9 pro Smart Watch',
      visualType: 's9_smartwatch',
      price: 1050,
      originalPrice: 1190,
      discountPercent: '-12%',
      category: 'Smart Watch',
      brand: '—',
      stock: 1000,
      stockColor: 'green',
    },
    {
      id: 'prod-16',
      sl: 16,
      name: 'SY-322 Multifunctional Wireless Stereo Speaker...',
      visualType: 'wireless_speaker',
      price: 1150,
      originalPrice: 1350,
      discountPercent: '-15%',
      category: 'Gadget and Accessories',
      brand: '—',
      stock: 99,
      stockColor: 'green',
    },
    {
      id: 'prod-17',
      sl: 17,
      name: 'Cotton Panel Bedsheet CPB100',
      visualType: 'bedsheet_set',
      price: 1050,
      originalPrice: 1350,
      discountPercent: '-22%',
      category: '—',
      brand: '—',
      stock: 200,
      stockColor: 'green',
    },
    {
      id: 'prod-18',
      sl: 18,
      name: 'Hanging Neck Charging Fan',
      visualType: 'neck_fan',
      price: 900,
      originalPrice: 1050,
      discountPercent: '-14%',
      category: 'Winter Jacket',
      brand: 'Comforty',
      stock: 99,
      stockColor: 'green',
    },
    {
      id: 'prod-19',
      sl: 19,
      name: 'Silver Crest Stainless Steel Body Electric Mini Grinde...',
      visualType: 'silver_crest_kettle',
      price: 1350,
      originalPrice: 1550,
      discountPercent: '-13%',
      category: 'Winter Jacket',
      brand: '—',
      stock: 100,
      stockColor: 'green',
    },
    {
      id: 'prod-20',
      sl: 20,
      name: 'Kids mix Cotton grameen check Khimar Set KCK505',
      visualType: 'cotton_khimar_red',
      price: 890,
      category: 'Woman Khimar',
      brand: '—',
      stock: 10,
      stockColor: 'yellow',
    },
  ];
});

  // Initial load from server database
  useEffect(() => {
    fetchProductsFromDatabase().then((dbProducts) => {
      if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
        setProductsList(dbProducts);
        try {
          localStorage.setItem('ummah_admin_products_list', JSON.stringify(dbProducts));
          window.dispatchEvent(new Event('storage'));
        } catch {}
      }
    });
  }, []);

  // Sync productsList with localStorage and server database
  useEffect(() => {
    try {
      localStorage.setItem('ummah_admin_products_list', JSON.stringify(productsList));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('products-updated'));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
    // Save permanently to server database
    saveProductsToDatabase(productsList);
  }, [productsList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Actions
  const handleCopyProduct = (prod: AdminProductRow) => {
    const cloned: AdminProductRow = {
      ...prod,
      id: `copy-${Date.now()}`,
      sl: productsList.length + 1,
      name: `${prod.name} (Copy)`,
    };
    setProductsList((prev) => [cloned, ...prev]);
    showToast(`"${prod.name}" সফলভাবে কপি করা হয়েছে!`);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই প্রোডাক্টটি মুছে ফেলতে চান?')) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
      setSelectedProductIds((prev) => prev.filter((item) => item !== id));
      showToast('প্রোডাক্ট সফলভাবে মুছে ফেলা হয়েছে!');
    }
  };

  // Bulk Selection Handlers
  const handleToggleSelectOne = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllStoreProducts = () => {
    setSelectedProductIds(productsList.map((p) => p.id));
    showToast(`স্টোরের সব (${productsList.length} টি) প্রোডাক্ট সিলেক্ট করা হয়েছে!`);
  };

  const handleConfirmBulkDelete = () => {
    const count = selectedProductIds.length;
    if (count === 0) return;

    setProductsList((prev) => prev.filter((p) => !selectedProductIds.includes(p.id)));
    setSelectedProductIds([]);
    setIsBulkDeleteModalOpen(false);
    showToast(`${count} টি প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে!`);
  };

  const handleSaveProduct = (savedProd: AdminProductRow) => {
    if (editingProduct) {
      const updated = productsList.map((p) => (p.id === savedProd.id ? savedProd : p));
      setProductsList(updated);
      saveProductsToDatabase(updated);
      setEditingProduct(null);
      showToast(`প্রোডাক্ট "${savedProd.name}" সফলভাবে আপডেট করা হয়েছে!`);
      const modalInfo = {
        title: 'প্রোডাক্ট আপডেট হয়েছে!',
        message: `প্রোডাক্ট "${savedProd.name}" এর সকল তথ্য সফলভাবে সংরক্ষিত ও ওয়েবসাইটে আপডেট করা হয়েছে।`,
      };
      setSuccessModal({ isOpen: true, ...modalInfo });
      triggerGlobalSuccessModal(modalInfo);
    } else {
      const newProd: AdminProductRow = {
        ...savedProd,
        id: `prod-${Date.now()}`,
        sl: productsList.length + 1,
      };
      const updated = [newProd, ...productsList];
      setProductsList(updated);
      saveProductsToDatabase(updated);
      setIsAddModalOpen(false);
      showToast(`নতুন প্রোডাক্ট "${newProd.name}" সফলভাবে যুক্ত হয়েছে!`);
      const modalInfo = {
        title: 'নতুন প্রোডাক্ট যুক্ত হয়েছে!',
        message: `প্রোডাক্ট "${newProd.name}" সফলভাবে ক্যাটালগে যুক্ত হয়েছে এবং দোকানে লাইভ করা হয়েছে।`,
      };
      setSuccessModal({ isOpen: true, ...modalInfo });
      triggerGlobalSuccessModal(modalInfo);
    }
  };

  // Filter products
  const filteredProducts = productsList.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'All Category' || p.category === selectedCategory;

    const matchesBrand =
      selectedBrand === 'All Brand' || p.brand === selectedBrand;

    return matchesSearch && matchesCat && matchesBrand;
  });

  const isAllFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p.id));

  const isSomeFilteredSelected =
    filteredProducts.some((p) => selectedProductIds.includes(p.id)) &&
    !isAllFilteredSelected;

  const handleToggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredProducts.map((p) => p.id));
      setSelectedProductIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const filteredIds = filteredProducts.map((p) => p.id);
      setSelectedProductIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="all_products"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Page Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 bg-[#111827] text-white px-4 py-2.5 rounded shadow-xl text-xs flex items-center gap-2 border border-slate-700 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header & Filter Row */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            All Products
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:border-slate-500"
            >
              <option value="All Category">All Category</option>
              <option value="FORMAL SHOE">FORMAL SHOE</option>
              <option value="Smart Watch">Smart Watch</option>
              <option value="Wired Headphone">Wired Headphone</option>
              <option value="Winter Jacket">Winter Jacket</option>
              <option value="Woman Khimar">Woman Khimar</option>
              <option value="Gadget and Accessories">Gadget and Accessories</option>
            </select>

            {/* Brand Dropdown */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:border-slate-500"
            >
              <option value="All Brand">All Brand</option>
              <option value="Walton">Walton</option>
              <option value="Vision">Vision</option>
              <option value="Comforty">Comforty</option>
            </select>

            {/* Section Dropdown */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none focus:border-slate-500"
            >
              <option value="All Section">All Section</option>
              <option value="Hot Deals">Hot Deals</option>
              <option value="Flash Sale">Flash Sale</option>
              <option value="Top Rated">Top Rated</option>
              <option value="Best Sells">Best Sells</option>
              <option value="Temporary">Temporary Section</option>
            </select>

            {/* Page count dropdown */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-44 sm:w-52"
              />
            </div>

            {/* Red + Add Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#990000] hover:bg-[#800000] text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </header>

        {/* 3. Product Table */}
        <div className="p-6">
          {/* Bulk Selection Notification & Action Bar */}
          {selectedProductIds.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 px-4 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in slide-in-from-top-1 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <CheckSquare className="w-4 h-4 text-[#990000] shrink-0" />
                <span className="font-bold text-slate-800">
                  {selectedProductIds.length} টি প্রোডাক্ট সিলেক্ট করা হয়েছে
                </span>
                <span className="text-slate-400">|</span>
                {selectedProductIds.length < productsList.length ? (
                  <button
                    type="button"
                    onClick={handleSelectAllStoreProducts}
                    className="text-xs text-[#990000] underline font-bold hover:text-[#800000] cursor-pointer"
                  >
                    স্টোরের সব ({productsList.length} টি) প্রোডাক্ট একসাথে সিলেক্ট করুন
                  </button>
                ) : (
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                    স্টোরের সব প্রোডাক্ট নির্বাচিত
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProductIds([])}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  সিলেকশন বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="px-3.5 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>সবগুলো ডিলিট করুন ({selectedProductIds.length})</span>
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Navy Blue Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    {/* Checkbox Select All */}
                    <th className="py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllFilteredSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = isSomeFilteredSelected;
                        }}
                        onChange={handleToggleSelectAllFiltered}
                        title={
                          isAllFilteredSelected
                            ? 'সিলেকশন বাতিল করুন'
                            : 'সবগুলো প্রোডাক্ট একসাথে সিলেক্ট করুন'
                        }
                        className="w-4 h-4 rounded border-slate-300 text-[#990000] focus:ring-[#990000] cursor-pointer accent-[#990000]"
                      />
                    </th>
                    <th className="py-3 px-4 w-12 text-center">Sl.</th>
                    <th className="py-3 px-4 min-w-[280px]">Product</th>
                    <th className="py-3 px-4 min-w-[100px]">Price</th>
                    <th className="py-3 px-4 min-w-[140px]">Category & Subcategory</th>
                    <th className="py-3 px-4 min-w-[100px]">Brand</th>
                    <th className="py-3 px-4 min-w-[80px]">Stock</th>
                    <th className="py-3 px-4 text-center min-w-[190px]">Actions</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.map((p, idx) => {
                    const isSelected = selectedProductIds.includes(p.id);
                    return (
                      <tr
                        key={p.id}
                        className={`transition-colors ${
                          isSelected ? 'bg-red-50/70' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* Row Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOne(p.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#990000] focus:ring-[#990000] cursor-pointer accent-[#990000]"
                          />
                        </td>

                        {/* Sl. */}
                        <td className="py-3 px-4 text-center font-medium text-slate-500">
                          {p.sl || idx + 1}
                        </td>

                        {/* Product */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-0.5 relative">
                              {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover rounded" />
                              ) : (
                                <ProductVisual visualType={p.visualType} name={p.name} />
                              )}
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 line-clamp-1 max-w-sm block" title={p.name}>
                                {p.name}
                              </span>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                {p.sku && (
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {p.sku}
                                  </span>
                                )}
                                {p.sizes && p.sizes.length > 0 && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                                    <span className="font-semibold">সাইজ:</span> {p.sizes.slice(0, 3).join(', ')}{p.sizes.length > 3 ? ` +${p.sizes.length - 3}` : ''}
                                  </span>
                                )}
                                {p.colors && p.colors.length > 0 && (
                                  <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">
                                    <span className="font-semibold">কালার:</span> {p.colors.length} টি
                                  </span>
                                )}
                                {p.badge && (
                                  <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded border border-rose-200">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="text-[#990000] font-bold text-xs">{p.price}</span>
                            {p.originalPrice && (
                              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                <span className="line-through">{p.originalPrice}</span>
                                {p.discountPercent && (
                                  <span className="text-red-500 font-semibold">{p.discountPercent}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Category & Subcategory */}
                        <td className="py-3 px-4">
                          {p.category !== '—' ? (
                            <div>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-semibold rounded text-[11px] border border-slate-200 inline-block">
                                {p.category}
                              </span>
                              {p.subcategory && (
                                <div className="text-[10px] text-[#990000] font-bold mt-1 flex items-center gap-1">
                                  <span className="text-slate-400">↳</span>
                                  <span>{p.subcategory}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                      {/* Brand */}
                      <td className="py-3 px-4 font-medium text-slate-600">
                        {p.brand}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        {p.stock === '—' ? (
                          <span className="text-slate-400">—</span>
                        ) : p.stockColor === 'yellow' ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[11px] font-bold">
                            {p.stock}
                          </span>
                        ) : p.stockColor === 'red' || p.stock === 0 ? (
                          <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-bold">
                            0
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold">
                            {p.stock}
                          </span>
                        )}
                      </td>

                      {/* Actions (Copy, Edit, Delete) */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Copy */}
                          <button
                            onClick={() => handleCopyProduct(p)}
                            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Copy Product"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Pagination Strip matching Screenshot */}
            <div className="py-4 px-6 border-t border-slate-200 bg-white flex items-center justify-center gap-1.5 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(1)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 1
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                1
              </button>
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 2
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                2
              </button>
              <button
                onClick={() => setCurrentPage(3)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === 3
                    ? 'bg-[#990000] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                3
              </button>
              <button
                disabled={currentPage === 3}
                onClick={() => setCurrentPage((p) => Math.min(3, p + 1))}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: BULK DELETE CONFIRMATION                           */}
      {/* ========================================================= */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm font-bold">একসাথে প্রোডাক্ট ডিলিট নিশ্চিতকরণ</h3>
              </div>
              <button
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-slate-700 space-y-1.5">
                <p className="font-bold text-red-900 text-sm">
                  আপনি কি নিশ্চিত যে নির্বাচিত {selectedProductIds.length} টি প্রোডাক্ট একসাথে মুছে ফেলতে চান?
                </p>
                <p className="text-slate-600 text-xs leading-relaxed">
                  এই কাজটি সম্পন্ন করার পর প্রোডাক্টগুলো স্টোর থেকে স্থায়ীভাবে মুছে যাবে এবং গ্রাহকেরা আর দেখতে পাবেন না।
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsBulkDeleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBulkDelete}
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>হ্যাঁ, সবগুলো ডিলিট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* COMPREHENSIVE PRODUCT MODALS: ADD & EDIT                  */}
      {/* ========================================================= */}
      <AdminProductModal
        isOpen={isAddModalOpen}
        mode="add"
        product={null}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveProduct}
      />

      <AdminProductModal
        isOpen={!!editingProduct}
        mode="edit"
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />

      {/* Save Success Confirmation Modal */}
      <SuccessSaveModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal((prev) => ({ ...prev, isOpen: false }))}
        title={successModal.title}
        message={successModal.message}
        buttonText="ঠিক আছে (OK)"
        onViewSite={onBackToStore}
      />
    </div>
  );
};
