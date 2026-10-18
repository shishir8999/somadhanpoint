import React, { useState, useEffect } from 'react';
import {
  Search,
  Sliders,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import {
  fetchProductsFromDatabase,
  saveSingleProductToDatabase,
  deleteProductFromDatabase
} from '../utils/apiSync';

export interface StockItemRow {
  id: string;
  sl: number;
  name: string;
  sku?: string;
  visualType: string;
  type: string; // 'Single' | '2 Variants' | '3 Variants'
  price: number;
  stockQty: number | string; // e.g. 5, 999, 1000, 0, '—'
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'none';
  soldUnits: number;
  category?: string;
  brand?: string;
  originalProduct?: any;
}

interface StockManagementPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

const mapProductToStock = (p: any, idx: number): StockItemRow => {
  const stockNum = typeof p.stock === 'number' ? p.stock : (parseInt(String(p.stock)) || 0);
  const variantsCount = (p.colorVariants && p.colorVariants.length) || 0;
  const typeStr = variantsCount > 1 ? `${variantsCount} Variants` : 'Single';

  let status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'none' = 'in_stock';
  if (p.stock === '—' || p.stock === undefined || p.stock === null) {
    status = 'none';
  } else if (stockNum <= 0) {
    status = 'out_of_stock';
  } else if (stockNum < 10) {
    status = 'low_stock';
  } else {
    status = 'in_stock';
  }

  return {
    id: String(p.id),
    sl: idx + 1,
    name: p.name || 'Product',
    sku: p.sku || `SKU-${p.id}`,
    visualType: p.visualType || 'formal_shoe',
    type: typeStr,
    price: typeof p.price === 'number' ? p.price : (parseFloat(String(p.price)) || 0),
    stockQty: p.stock !== undefined && p.stock !== null ? p.stock : 100,
    stockStatus: status,
    soldUnits: p.soldUnits || Math.floor(Math.random() * 20) + 1,
    category: p.category || 'General',
    brand: p.brand || '—',
    originalProduct: p,
  };
};

const DEFAULT_STOCKS: StockItemRow[] = [
  {
    id: 'prod-1',
    sl: 1,
    name: "Men's Genuine Leather Half Loafer Shoes",
    visualType: 'formal_shoe',
    type: '2 Variants',
    price: 1200,
    stockQty: '—',
    stockStatus: 'none',
    soldUnits: 16,
  },
  {
    id: 'prod-2',
    sl: 2,
    name: 'Super Water Absorbing Quick Drying Floor Mat',
    visualType: 'floor_mat',
    type: 'Single',
    price: 500,
    stockQty: 5,
    stockStatus: 'low_stock',
    soldUnits: 0,
  },
  {
    id: 'prod-3',
    sl: 3,
    name: 'Laxasfit K10 Ultra Smart Watch With Sim Supported',
    sku: 'K10',
    visualType: 'smart_watch',
    type: 'Single',
    price: 1450,
    stockQty: 999,
    stockStatus: 'in_stock',
    soldUnits: 9,
  },
  {
    id: 'prod-4',
    sl: 4,
    name: 'Air 31 Wireless Bluetooth Earbuds',
    visualType: 'air_earbuds',
    type: 'Single',
    price: 590,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 8,
  },
  {
    id: 'prod-5',
    sl: 5,
    name: 'লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস',
    visualType: 'oud_perfume',
    type: 'Single',
    price: 1100,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 5,
  },
  {
    id: 'prod-6',
    sl: 6,
    name: 'Portable Retro Camping Lamp',
    visualType: 'camping_lamp',
    type: 'Single',
    price: 1050,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 4,
  },
  {
    id: 'prod-7',
    sl: 7,
    name: 'Rechargeable USB T-10 Handheld Mini Fan | 3...',
    visualType: 'desktop_fan',
    type: 'Single',
    price: 480,
    stockQty: 100,
    stockStatus: 'in_stock',
    soldUnits: 12,
  },
  {
    id: 'prod-8',
    sl: 8,
    name: 'Vacuum Flask Stainless Steel (500 ml flask)',
    visualType: 'vacuum_flask',
    type: 'Single',
    price: 750,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 7,
  },
  {
    id: 'prod-9',
    sl: 9,
    name: 'Multifunctional 2 In 1 Egg Opener',
    visualType: 'egg_opener',
    type: 'Single',
    price: 650,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 11,
  },
  {
    id: 'prod-10',
    sl: 10,
    name: 'Led Rechargeable Key Chain Light',
    visualType: 'keychain_light',
    type: 'Single',
    price: 750,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 3,
  },
  {
    id: 'prod-11',
    sl: 11,
    name: 'Regrsi RE-NY032 Wireless Neckband Bluetooth...',
    visualType: 'neckband_headphone',
    type: 'Single',
    price: 650,
    stockQty: 0,
    stockStatus: 'out_of_stock',
    soldUnits: 20,
  },
  {
    id: 'prod-12',
    sl: 12,
    name: 'Hoco W35 Max Wireless Headphone',
    visualType: 'wireless_headphone',
    type: 'Single',
    price: 1350,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 14,
  },
  {
    id: 'prod-13',
    sl: 13,
    name: 'Ultrapods Max Wireless Earbuds 5.3 Transparent.',
    visualType: 'ultrapods_earbuds',
    type: 'Single',
    price: 500,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 2,
  },
  {
    id: 'prod-14',
    sl: 14,
    name: 'T900 Ultra 2 Pro Smart Watch',
    visualType: 't900_ultra',
    type: 'Single',
    price: 980,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 15,
  },
  {
    id: 'prod-15',
    sl: 15,
    name: 'Laxasfit S9 pro Smart Watch',
    visualType: 's9_smartwatch',
    type: 'Single',
    price: 1050,
    stockQty: 1000,
    stockStatus: 'in_stock',
    soldUnits: 6,
  },
  {
    id: 'prod-16',
    sl: 16,
    name: 'SY-322 Multifunctional Wireless Stereo Speaker...',
    visualType: 'wireless_speaker',
    type: 'Single',
    price: 1150,
    stockQty: 99,
    stockStatus: 'in_stock',
    soldUnits: 18,
  },
  {
    id: 'prod-17',
    sl: 17,
    name: 'Cotton Panel Bedsheet CPB100',
    visualType: 'bedsheet_set',
    type: 'Single',
    price: 1050,
    stockQty: 200,
    stockStatus: 'in_stock',
    soldUnits: 9,
  },
  {
    id: 'prod-18',
    sl: 18,
    name: 'Hanging Neck Charging Fan',
    visualType: 'neck_fan',
    type: 'Single',
    price: 900,
    stockQty: 99,
    stockStatus: 'in_stock',
    soldUnits: 13,
  },
  {
    id: 'prod-19',
    sl: 19,
    name: 'Silver Crest Stainless Steel Body Electric Mini Grinde...',
    visualType: 'silver_crest_kettle',
    type: 'Single',
    price: 1350,
    stockQty: 100,
    stockStatus: 'in_stock',
    soldUnits: 25,
  },
  {
    id: 'prod-20',
    sl: 20,
    name: 'Kids mix Cotton grameen check Khimar Set KCK505',
    visualType: 'cotton_khimar_red',
    type: 'Single',
    price: 890,
    stockQty: 10,
    stockStatus: 'in_stock',
    soldUnits: 8,
  },
];

export const StockManagementPage: React.FC<StockManagementPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All Category');
  const [selectedBrand, setSelectedBrand] = useState('All Brand');
  const [selectedSection, setSelectedSection] = useState('All Section');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [pageSize, setPageSize] = useState('20');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Manage Modal State
  const [managingItem, setManagingItem] = useState<StockItemRow | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editOriginalPrice, setEditOriginalPrice] = useState<number | string>('');
  const [editQty, setEditQty] = useState<number>(0);
  const [editSku, setEditSku] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState<StockItemRow | null>(null);

  // Stock Items List
  const [stocksList, setStocksList] = useState<StockItemRow[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ummah_admin_products_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map(mapProductToStock);
          }
        }
      } catch (e) {}
    }
    return DEFAULT_STOCKS;
  });

  // Load latest products from MySQL database and keep synced
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const saved = localStorage.getItem('ummah_admin_products_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStocksList(parsed.map(mapProductToStock));
            return;
          }
        }
      } catch (e) {}
    };

    fetchProductsFromDatabase().then((dbProducts) => {
      if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
        setStocksList(dbProducts.map(mapProductToStock));
      }
    });

    window.addEventListener('products-updated', loadFromStorage);
    window.addEventListener('storage', loadFromStorage);
    return () => {
      window.removeEventListener('products-updated', loadFromStorage);
      window.removeEventListener('storage', loadFromStorage);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: StockItemRow) => {
    setManagingItem(item);
    setEditName(item.name);
    setEditPrice(item.price);
    setEditOriginalPrice(item.originalProduct?.originalPrice || '');
    setEditQty(typeof item.stockQty === 'number' ? item.stockQty : 0);
    setEditSku(item.sku || '');
    setEditStatus(item.stockStatus === 'none' ? 'in_stock' : item.stockStatus);
  };

  // Open Delete Modal
  const handleOpenDelete = (item: StockItemRow) => {
    setProductToDelete(item);
  };

  // Confirm Delete
  const confirmDeleteStock = () => {
    if (!productToDelete) return;
    const id = productToDelete.id;
    const name = productToDelete.name;

    // 1. Update local state
    setStocksList((prev) => prev.filter((item) => String(item.id) !== String(id)));
    setProductToDelete(null);

    // 2. Update localStorage products list
    try {
      const saved = localStorage.getItem('ummah_admin_products_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((p: any) => String(p.id) !== String(id));
          localStorage.setItem('ummah_admin_products_list', JSON.stringify(updated));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('products-updated'));
        }
      }
    } catch (e) {}

    // 3. Permanently delete from MySQL database
    deleteProductFromDatabase(id);

    showToast(`"${name}" প্রোডাক্টটি স্টক ও ডাটাবেস থেকে সফলভাবে মুছে ফেলা হয়েছে!`);
  };

  // Save Edit Stock & Product
  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingItem) return;

    const qty = Number(editQty);
    let computedStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = editStatus;
    if (qty === 0) computedStatus = 'out_of_stock';
    else if (qty < 10) computedStatus = 'low_stock';
    else computedStatus = 'in_stock';

    // 1. Update stocksList state
    setStocksList((prev) =>
      prev.map((item) => {
        if (item.id === managingItem.id) {
          return {
            ...item,
            name: editName,
            price: Number(editPrice),
            stockQty: qty,
            sku: editSku,
            stockStatus: computedStatus,
          };
        }
        return item;
      })
    );

    // 2. Update localStorage and MySQL database
    try {
      const saved = localStorage.getItem('ummah_admin_products_list');
      let fullProd: any = managingItem.originalProduct || {
        id: managingItem.id,
        name: editName,
        price: Number(editPrice),
        visualType: managingItem.visualType,
        category: managingItem.category || 'General',
      };

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const updatedList = parsed.map((p: any) => {
            if (String(p.id) === String(managingItem.id)) {
              fullProd = {
                ...p,
                name: editName,
                price: Number(editPrice),
                originalPrice: editOriginalPrice ? Number(editOriginalPrice) : null,
                stock: qty,
                stockColor: qty === 0 ? 'red' : qty < 10 ? 'yellow' : 'green',
                sku: editSku,
                inStock: computedStatus !== 'out_of_stock',
              };
              return fullProd;
            }
            return p;
          });
          localStorage.setItem('ummah_admin_products_list', JSON.stringify(updatedList));
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('products-updated'));
        }
      }

      // Save permanently to MySQL server database
      saveSingleProductToDatabase(fullProd);
    } catch (e) {
      console.error('Failed to sync updated stock', e);
    }

    showToast(`"${editName}" এর স্টক ও তথ্য সফলভাবে আপডেট হয়েছে!`);
    setManagingItem(null);
  };

  // Filter stocks
  const filteredStocks = stocksList.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'All Types' || item.type === selectedType;

    const matchesStatus =
      selectedStatus === 'All Status' ||
      (selectedStatus === 'In Stock' && item.stockStatus === 'in_stock') ||
      (selectedStatus === 'Low Stock' && item.stockStatus === 'low_stock') ||
      (selectedStatus === 'Out of Stock' && item.stockStatus === 'out_of_stock');

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="stock_management"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#1e293b] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Header Title */}
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Stocks
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              পণ্যের স্টক ইনভেন্টরি পর্যবেক্ষণ, মূল্য ও স্টক এডিট এবং অপ্রয়োজনীয় প্রোডাক্ট ডাটাবেস থেকে ডিলিট করুন।
            </p>
          </div>

          {/* ========================================================= */}
          {/* TOP CONTROLS & FILTER ROW (Exact Match Screenshot 2)      */}
          {/* ========================================================= */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            {/* Row 1: Select Dropdowns */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000]"
              >
                <option value="All Category">All Category</option>
                <option value="FORMAL SHOE">FORMAL SHOE</option>
                <option value="Smart Watch">Smart Watch</option>
                <option value="Wired Headphone">Wired Headphone</option>
                <option value="Winter Jacket">Winter Jacket</option>
                <option value="Woman Khimar">Woman Khimar</option>
                <option value="General">General</option>
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000]"
              >
                <option value="All Brand">All Brand</option>
                <option value="Apex">Apex</option>
                <option value="Walton">Walton</option>
                <option value="Somadhan Pure">Somadhan Pure</option>
                <option value="Vision">Vision</option>
                <option value="Comforty">Comforty</option>
              </select>

              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000]"
              >
                <option value="All Section">All Section</option>
                <option value="hot_deals">Hot Deals</option>
                <option value="flash_sale">Flash Sale</option>
                <option value="top_rated">Top Rated</option>
                <option value="best_sells">Best Sells</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000]"
              >
                <option value="All Types">All Types</option>
                <option value="Single">Single</option>
                <option value="2 Variants">2 Variants</option>
                <option value="3 Variants">3 Variants</option>
              </select>
            </div>

            {/* Row 2: Status, Page Size, Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000] min-w-[120px]"
              >
                <option value="All Status">All Status</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>

              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 focus:outline-none focus:border-[#990000] w-20"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>

              {/* Search Bar */}
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products or variants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* DATA TABLE (Dark Navy Table Header)                       */}
          {/* ========================================================= */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Navy Blue Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">SL.</th>
                    <th className="py-3 px-4 min-w-[260px]">PRODUCT</th>
                    <th className="py-3 px-4 min-w-[110px]">TYPE</th>
                    <th className="py-3 px-4 min-w-[90px]">PRICE</th>
                    <th className="py-3 px-4 min-w-[150px]">STOCK</th>
                    <th className="py-3 px-4 min-w-[100px]">SOLD</th>
                    <th className="py-3 px-4 text-center min-w-[150px]">ACTION</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStocks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                        কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredStocks.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* SL. */}
                        <td className="py-3 px-4 text-center font-medium text-slate-500">
                          {item.sl || idx + 1}
                        </td>

                        {/* Product with Image and SKU */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-slate-200 bg-slate-50 shrink-0 overflow-hidden flex items-center justify-center p-0.5">
                              <ProductVisual visualType={item.visualType} name={item.name} />
                            </div>
                            <div>
                              <span className="font-semibold text-slate-900 block line-clamp-1 max-w-sm" title={item.name}>
                                {item.name}
                              </span>
                              {item.sku && (
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  SKU: {item.sku}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-3 px-4 text-slate-600 font-medium">
                          {item.type}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-bold text-[#990000]">
                          ৳ {item.price.toLocaleString()}
                        </td>

                        {/* Stock Pill Badge */}
                        <td className="py-3 px-4">
                          {item.stockStatus === 'none' || item.stockQty === '—' ? (
                            <span className="text-slate-400">—</span>
                          ) : item.stockStatus === 'low_stock' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              <span>Low stock · {item.stockQty}</span>
                            </span>
                          ) : item.stockStatus === 'out_of_stock' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              <span>Out of stock</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>In stock · {typeof item.stockQty === 'number' ? item.stockQty.toLocaleString() : item.stockQty}</span>
                            </span>
                          )}
                        </td>

                        {/* Sold Units with green trend arrow */}
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 stroke-[2.2]" />
                            <span>{item.soldUnits} units</span>
                          </span>
                        </td>

                        {/* Action: Edit & Delete Buttons */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit / Manage Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="স্টক ও প্রোডাক্ট এডিট করুন"
                            >
                              <Edit2 className="w-3 h-3 text-amber-700" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenDelete(item)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="প্রোডাক্টটি স্টক ও ডাটাবেস থেকে ডিলিট করুন"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Strip */}
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
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#990000] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-300 shrink-0" />
                <h3 className="text-sm font-bold">প্রোডাক্ট ডিলিট নিশ্চিতকরণ</h3>
              </div>
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-red-50/70 border border-red-200 rounded-lg">
                <div className="w-12 h-12 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                  <ProductVisual visualType={productToDelete.visualType} name={productToDelete.name} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{productToDelete.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    মূল্য: ৳{productToDelete.price} | বর্তমান স্টক: {productToDelete.stockQty}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-slate-700 space-y-1">
                <p className="font-bold text-amber-900">⚠️ আপনি কি নিশ্চিত?</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  এই প্রোডাক্টটি ডিলিট করলে তা লাইভ স্টোরফ্রন্ট, স্টক ম্যানেজমেন্ট এবং MySQL ডাটাবেস থেকে স্থায়ীভাবে মুছে ফেলা হবে।
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteStock}
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>হ্যাঁ, ডিলিট করুন</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / MANAGE STOCK MODAL                                 */}
      {/* ========================================================= */}
      {managingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">স্টক ও প্রোডাক্ট এডিট করুন</h3>
              </div>
              <button
                type="button"
                onClick={() => setManagingItem(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="w-12 h-12 rounded border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                  <ProductVisual visualType={managingItem.visualType} name={managingItem.name} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 line-clamp-1">{managingItem.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">টাইপ: {managingItem.type}</p>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রোডাক্টের নাম *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Selling Price */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] text-sm font-bold text-[#990000]"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU কোড</label>
                  <input
                    type="text"
                    value={editSku}
                    onChange={(e) => setEditSku(e.target.value)}
                    placeholder="যেমন: K10, W5147"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Stock Quantity */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক ইনভেন্টরি পরিমাণ *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editQty}
                    onChange={(e) => setEditQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000] text-sm font-bold text-slate-900"
                  />
                </div>

                {/* Status Override */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্ট্যাটাস</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none text-xs"
                  >
                    <option value="in_stock">In Stock (পর্যাপ্ত মজুদ)</option>
                    <option value="low_stock">Low Stock (সীমিত মজুদ)</option>
                    <option value="out_of_stock">Out of Stock (মজুদ নেই)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  স্টক সংখ্যা বা মূল্য পরিবর্তন করলে লাইভ ওয়েবসাইট, প্রোডাক্ট পেজ এবং MySQL ডাটাবেসে তাৎক্ষণিকভাবে স্থায়ীভাবে আপডেট হয়ে যাবে।
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setManagingItem(null)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs transition-colors cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
