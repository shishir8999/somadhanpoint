import React, { useState } from 'react';
import {
  Search,
  Sliders,
  TrendingUp,
  X,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

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
}

interface StockManagementPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

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

  // Manage Modal State
  const [managingItem, setManagingItem] = useState<StockItemRow | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editSku, setEditSku] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'in_stock' | 'low_stock' | 'out_of_stock'>('in_stock');

  // Exact 20 items from Screenshot 2
  const [stocksList, setStocksList] = useState<StockItemRow[]>([
    {
      id: 'stk-1',
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
      id: 'stk-2',
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
      id: 'stk-3',
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
      id: 'stk-4',
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
      id: 'stk-5',
      sl: 5,
      name: 'লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস',
      visualType: 'oud_perfume',
      type: 'Single',
      price: 1100,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 12,
    },
    {
      id: 'stk-6',
      sl: 6,
      name: 'Portable Retro Camping Lamp',
      visualType: 'camping_lamp',
      type: 'Single',
      price: 1050,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 7,
    },
    {
      id: 'stk-7',
      sl: 7,
      name: 'Rechargeable USB T-10 Handheld Mini Fan | 3...',
      visualType: 'desktop_fan',
      type: 'Single',
      price: 480,
      stockQty: 100,
      stockStatus: 'in_stock',
      soldUnits: 8,
    },
    {
      id: 'stk-8',
      sl: 8,
      name: 'Vacuum Flask Stainless Steel (500 ml flask)',
      visualType: 'vacuum_flask',
      type: 'Single',
      price: 750,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 12,
    },
    {
      id: 'stk-9',
      sl: 9,
      name: 'Multifunctional 2 In 1 Egg Opener',
      visualType: 'egg_opener',
      type: 'Single',
      price: 650,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 6,
    },
    {
      id: 'stk-10',
      sl: 10,
      name: 'Led Rechargeable Key Chain Light',
      sku: 'W5147',
      visualType: 'keychain_light',
      type: 'Single',
      price: 750,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 4,
    },
    {
      id: 'stk-11',
      sl: 11,
      name: 'Regrsi RE-NY032 Wireless Neckband Bluetooth...',
      sku: 'RE-NY032',
      visualType: 'neckband_headphone',
      type: 'Single',
      price: 650,
      stockQty: 0,
      stockStatus: 'out_of_stock',
      soldUnits: 8,
    },
    {
      id: 'stk-12',
      sl: 12,
      name: 'Hoco W35 Max Wireless Headphone',
      sku: 'W35',
      visualType: 'wireless_headphone',
      type: 'Single',
      price: 1350,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 7,
    },
    {
      id: 'stk-13',
      sl: 13,
      name: 'Ultrapods Max Wireless Earbuds 5.3 Transparent.',
      visualType: 'ultrapods_earbuds',
      type: 'Single',
      price: 500,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 9,
    },
    {
      id: 'stk-14',
      sl: 14,
      name: 'T900 Ultra 2 Pro Smart Watch',
      sku: 'T900',
      visualType: 't900_ultra',
      type: 'Single',
      price: 980,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 11,
    },
    {
      id: 'stk-15',
      sl: 15,
      name: 'Laxasfit S9 pro Smart Watch',
      sku: 'S9 pro',
      visualType: 's9_smartwatch',
      type: 'Single',
      price: 1050,
      stockQty: 1000,
      stockStatus: 'in_stock',
      soldUnits: 9,
    },
    {
      id: 'stk-16',
      sl: 16,
      name: 'SY-322 Multifunctional Wireless Stereo Speaker...',
      sku: 'SY-322',
      visualType: 'wireless_speaker',
      type: 'Single',
      price: 1150,
      stockQty: 99,
      stockStatus: 'in_stock',
      soldUnits: 9,
    },
    {
      id: 'stk-17',
      sl: 17,
      name: 'Cotton Panel Bedsheet CPB100',
      sku: 'CPB100',
      visualType: 'bedsheet_set',
      type: 'Single',
      price: 1050,
      stockQty: 200,
      stockStatus: 'in_stock',
      soldUnits: 4,
    },
    {
      id: 'stk-18',
      sl: 18,
      name: 'Hanging Neck Charging Fan',
      visualType: 'neck_fan',
      type: 'Single',
      price: 900,
      stockQty: 99,
      stockStatus: 'in_stock',
      soldUnits: 9,
    },
    {
      id: 'stk-19',
      sl: 19,
      name: 'Silver Crest Stainless Steel Body Electric Mini Grinde...',
      visualType: 'silver_crest_kettle',
      type: 'Single',
      price: 1350,
      stockQty: 100,
      stockStatus: 'in_stock',
      soldUnits: 6,
    },
    {
      id: 'stk-20',
      sl: 20,
      name: 'Kids mix Cotton grameen check Khimar Set KCK505',
      sku: 'KCK505',
      visualType: 'cotton_khimar_red',
      type: 'Single',
      price: 890,
      stockQty: 10,
      stockStatus: 'in_stock',
      soldUnits: 8,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenManage = (item: StockItemRow) => {
    setManagingItem(item);
    setEditQty(typeof item.stockQty === 'number' ? item.stockQty : 0);
    setEditSku(item.sku || '');
    setEditStatus(item.stockStatus === 'none' ? 'in_stock' : item.stockStatus);
  };

  const handleSaveStock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingItem) return;

    setStocksList((prev) =>
      prev.map((item) => {
        if (item.id === managingItem.id) {
          const qty = Number(editQty);
          let computedStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = editStatus;
          if (qty === 0) computedStatus = 'out_of_stock';
          else if (qty < 10) computedStatus = 'low_stock';
          else computedStatus = 'in_stock';

          return {
            ...item,
            stockQty: qty,
            sku: editSku,
            stockStatus: computedStatus,
          };
        }
        return item;
      })
    );

    showToast(`"${managingItem.name}" এর স্টক সফলভাবে আপডেট হয়েছে!`);
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
            Stocks
          </h1>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All Category">All Categor...</option>
              <option value="FORMAL SHOE">FORMAL SHOE</option>
              <option value="Smart Watch">Smart Watch</option>
              <option value="Wired Headphone">Wired Headphone</option>
              <option value="Winter Jacket">Winter Jacket</option>
            </select>

            {/* Brand */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All Brand">All Brand</option>
              <option value="Walton">Walton</option>
              <option value="Vision">Vision</option>
              <option value="Comforty">Comforty</option>
            </select>

            {/* Section */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All Section">All Section</option>
              <option value="Hot Deals">Hot Deals</option>
              <option value="Flash Sale">Flash Sale</option>
            </select>

            {/* Types */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All Types">All Types</option>
              <option value="Single">Single</option>
              <option value="2 Variants">2 Variants</option>
            </select>

            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>

            {/* Page count */}
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="text-xs px-2 py-1.5 border border-slate-300 rounded bg-white text-slate-700 focus:outline-none"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or variants..."
                className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#990000] w-48 sm:w-60"
              />
            </div>
          </div>
        </header>

        {/* 3. Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                {/* Navy Blue Header */}
                <thead className="bg-[#1e293b] text-white font-bold tracking-wide">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">SL.</th>
                    <th className="py-3 px-4 min-w-[280px]">PRODUCT</th>
                    <th className="py-3 px-4 min-w-[120px]">TYPE</th>
                    <th className="py-3 px-4 min-w-[100px]">PRICE</th>
                    <th className="py-3 px-4 min-w-[160px]">STOCK</th>
                    <th className="py-3 px-4 min-w-[120px]">SOLD</th>
                    <th className="py-3 px-4 text-center min-w-[100px]">ACTION</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStocks.map((item, idx) => (
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

                      {/* Action: Manage Button */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleOpenManage(item)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Sliders className="w-3 h-3 text-amber-700" />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  ))}
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
      {/* MANAGE STOCK MODAL                                        */}
      {/* ========================================================= */}
      {managingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-[#1e293b] text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold">স্টক ম্যানেজ করুন</h3>
              </div>
              <button onClick={() => setManagingItem(null)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="p-5 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded border border-slate-200">
                <div className="w-12 h-12 rounded border bg-white overflow-hidden flex items-center justify-center p-0.5 shrink-0">
                  <ProductVisual visualType={managingItem.visualType} name={managingItem.name} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 line-clamp-1">{managingItem.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">মূল্য: ৳{managingItem.price}</p>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">SKU কোড</label>
                <input
                  type="text"
                  value={editSku}
                  onChange={(e) => setEditSku(e.target.value)}
                  placeholder="যেমন: K10, W5147"
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:border-[#990000]"
                />
              </div>

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

              <div>
                <label className="block font-bold text-slate-700 mb-1">স্ট্যাটাস ওভাররাইড</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                >
                  <option value="in_stock">In Stock (পর্যাপ্ত মজুদ)</option>
                  <option value="low_stock">Low Stock (সীমিত মজুদ)</option>
                  <option value="out_of_stock">Out of Stock (মজুদ নেই)</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px]">
                  স্টক সংখ্যা পরিবর্তন করলে স্টোরফ্রন্টের প্রোডাক্ট পেজ এবং অর্ডার চেকআউটে তাৎক্ষণিকভাবে প্রতিফলিত হবে।
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setManagingItem(null)}
                  className="px-4 py-2 border rounded text-slate-600 hover:bg-slate-100 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#990000] hover:bg-[#800000] text-white rounded font-bold shadow-xs"
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
