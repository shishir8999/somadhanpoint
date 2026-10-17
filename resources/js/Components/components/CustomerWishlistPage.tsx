import React, { useState } from 'react';
import {
  Heart,
  Search,
  Phone,
  Send,
  ShoppingBag,
  Trash2,
  Filter,
  CheckCircle2,
  X,
  Package,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import { AdminSidebar, AdminPageType } from './AdminSidebar';
import { ProductVisual } from './ProductVisual';

export interface WishlistItemRow {
  id: string;
  sl: number;
  customerName: string;
  customerPhone: string;
  district: string;
  productName: string;
  visualType: string;
  category: string;
  price: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  stockCount: number;
  addedDate: string;
}

interface CustomerWishlistPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const CustomerWishlistPage: React.FC<CustomerWishlistPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SMS Modal
  const [smsModalItem, setSmsModalItem] = useState<WishlistItemRow | null>(null);
  const [smsDiscount, setSmsDiscount] = useState('10%');
  const [smsCustomText, setSmsCustomText] = useState('');

  // Sample Wishlist Rows
  const [wishlistItems, setWishlistItems] = useState<WishlistItemRow[]>([
    {
      id: 'wish-1',
      sl: 1,
      customerName: 'শাহানা বেগম',
      customerPhone: '01873315210',
      district: 'সিলেট',
      productName: 'T900 Ultra 2 Smartwatch',
      visualType: 't900_ultra',
      category: 'Smart Gadget',
      price: 1350,
      stockStatus: 'In Stock',
      stockCount: 45,
      addedDate: '02 Oct 2026',
    },
    {
      id: 'wish-2',
      sl: 2,
      customerName: 'জাহিদুল ইসলাম',
      customerPhone: '01825874033',
      district: 'ঢাকা',
      productName: 'Multifunctional Electric Hot Pot & Kettle',
      visualType: 'silver_crest_kettle',
      category: 'Kitchen',
      price: 1850,
      stockStatus: 'In Stock',
      stockCount: 18,
      addedDate: '01 Oct 2026',
    },
    {
      id: 'wish-3',
      sl: 3,
      customerName: 'তানজিলা হক',
      customerPhone: '01712984521',
      district: 'চট্টগ্রাম',
      productName: 'Premium Wireless Air Earbuds Pro',
      visualType: 'air_earbuds',
      category: 'Audio',
      price: 1250,
      stockStatus: 'Low Stock',
      stockCount: 4,
      addedDate: '30 Sep 2026',
    },
    {
      id: 'wish-4',
      sl: 4,
      customerName: 'ইমরান হোসেন',
      customerPhone: '01983858653',
      district: 'নারায়ণগঞ্জ',
      productName: 'President Tor Luxury Navy Jubba',
      visualType: 'president_jubba_navy',
      category: 'Fashion',
      price: 2450,
      stockStatus: 'In Stock',
      stockCount: 22,
      addedDate: '29 Sep 2026',
    },
    {
      id: 'wish-5',
      sl: 5,
      customerName: 'মুমতাহা বেগম',
      customerPhone: '01528401282',
      district: 'খুলনা',
      productName: 'Kids Cherry Borqa with Nikab',
      visualType: 'cotton_khimar_red',
      category: 'Modest Wear',
      price: 1150,
      stockStatus: 'In Stock',
      stockCount: 30,
      addedDate: '28 Sep 2026',
    },
    {
      id: 'wish-6',
      sl: 6,
      customerName: 'জাহাঙ্গীর আলম',
      customerPhone: '01343148035',
      district: 'দিনাজপুর',
      productName: 'Rechargeable Desktop Misting Fan',
      visualType: 'desktop_fan',
      category: 'Home Appliances',
      price: 1650,
      stockStatus: 'Out of Stock',
      stockCount: 0,
      addedDate: '27 Sep 2026',
    },
    {
      id: 'wish-7',
      sl: 7,
      customerName: 'নাজমুল হাসান',
      customerPhone: '01684521970',
      district: 'বরিশাল',
      productName: 'ZF18 Smart Sensor Scalp Massager',
      visualType: 'scalp_massager',
      category: 'Personal Care',
      price: 1450,
      stockStatus: 'In Stock',
      stockCount: 15,
      addedDate: '26 Sep 2026',
    },
    {
      id: 'wish-8',
      sl: 8,
      customerName: 'ফারহানা আক্তার',
      customerPhone: '01799234812',
      district: 'রাজশাহী',
      productName: 'Rechargeable Rain Cloud Humidifier Lamp',
      visualType: 'table_lamp',
      category: 'Home Decor',
      price: 2000,
      stockStatus: 'In Stock',
      stockCount: 8,
      addedDate: '25 Sep 2026',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRemove = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    showToast('আইটেমটি উইশলিস্ট থেকে সফলভাবে সরানো হয়েছে।');
  };

  const handleOpenSmsModal = (item: WishlistItemRow) => {
    setSmsModalItem(item);
    setSmsCustomText(
      `প্রিয় ${item.customerName}, আপনার উইশলিস্টের "${item.productName}" পণ্যে আজই পাচ্ছেন ${smsDiscount} বিশেষ ছাড়! অর্ডার করতে ভিজিট করুন আমাদের ওয়েবসাইট। হটলাইন: 01982708789`
    );
  };

  const handleSendOfferSms = () => {
    if (!smsModalItem) return;
    showToast(`${smsModalItem.customerName}-কে অফার SMS সফলভাবে পাঠানো হয়েছে!`);
    setSmsModalItem(null);
  };

  const handleConvertToOrder = (item: WishlistItemRow) => {
    showToast(`উইশলিস্ট আইটেম "${item.productName}" সরাসরি অর্ডারে কনভার্ট করা হয়েছে!`);
    setTimeout(() => {
      onNavigate('orders');
    }, 1200);
  };

  // Filtered List
  const filteredList = wishlistItems.filter((item) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerPhone.includes(searchQuery) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStock =
      stockFilter === 'All' ? true : item.stockStatus === stockFilter;

    return matchesSearch && matchesStock;
  });

  const totalValue = wishlistItems.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="customer_wishlist"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg text-xs flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">{toastMessage}</span>
              </div>
              <button
                onClick={() => setToastMessage(null)}
                className="text-emerald-500 hover:text-emerald-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                <span>Users</span>
                <span>/</span>
                <span className="text-[#990000]">Customer Wishlist</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                <span>Customer Wishlist Management</span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                গ্রাহকদের সংরক্ষিত পছন্দের পণ্যের তালিকা, স্টক স্ট্যাটাস এবং সরাসরি অফার SMS পাঠানোর ড্যাশবোর্ড
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => showToast('সকল উইশলিস্ট গ্রাহকদের বাল্ক প্রমোশন SMS পাঠানো হয়েছে!')}
                className="bg-[#990000] hover:bg-[#800000] text-white px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send Bulk Wishlist Offer</span>
              </button>
            </div>
          </div>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Wishlist Items</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{wishlistItems.length} Products</p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +14% this week
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Heart className="w-5 h-5 fill-rose-100" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Unique Customers</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{wishlistItems.length} Users</p>
                <span className="text-[11px] text-slate-400 mt-1 block">Active shoppers</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">Potential Order Value</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">৳ {totalValue.toLocaleString()}</p>
                <span className="text-[11px] text-indigo-600 font-medium mt-1 block">Ready to convert</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Tag className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-medium">In-Stock Rate</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">87.5%</p>
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Available for instant order</span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="গ্রাহকের নাম, ফোন বা প্রোডাক্ট খুঁজুন..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-[#990000]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Stock Filter:</span>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#990000]"
                >
                  <option value="All">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#111827] text-white font-semibold">
                    <th className="py-3 px-4 w-12 text-center">Sl.</th>
                    <th className="py-3 px-4">গ্রাহকের বিবরণ</th>
                    <th className="py-3 px-4">পছন্দের প্রোডাক্ট</th>
                    <th className="py-3 px-4">মূল্য</th>
                    <th className="py-3 px-4">স্টক অবস্থা</th>
                    <th className="py-3 px-4">সংরক্ষণের তারিখ</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        কোনো উইশলিস্ট আইটেম পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredList.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-slate-500">
                          {row.sl}
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-800">{row.customerName}</p>
                          <p className="text-[11px] text-slate-500 font-mono mt-0.5">{row.customerPhone}</p>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium mt-1 inline-block">
                            {row.district}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-md bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                              <ProductVisual visualType={row.visualType} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 line-clamp-1">{row.productName}</p>
                              <p className="text-[10px] text-slate-500">{row.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-[#990000]">
                          ৳ {row.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                              row.stockStatus === 'In Stock'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : row.stockStatus === 'Low Stock'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                row.stockStatus === 'In Stock'
                                  ? 'bg-emerald-500'
                                  : row.stockStatus === 'Low Stock'
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                            />
                            {row.stockStatus} ({row.stockCount})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 font-medium">
                          {row.addedDate}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Send SMS Offer */}
                            <button
                              onClick={() => handleOpenSmsModal(row)}
                              className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Send Offer SMS"
                            >
                              <Send className="w-3 h-3" />
                              <span>SMS Offer</span>
                            </button>

                            {/* Convert to order */}
                            <button
                              onClick={() => handleConvertToOrder(row)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Create Order"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Order</span>
                            </button>

                            {/* Remove */}
                            <button
                              onClick={() => handleRemove(row.id)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* SMS Modal */}
      {smsModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Send Wishlist SMS Offer</h3>
                  <p className="text-[11px] text-slate-500">To: {smsModalItem.customerName} ({smsModalItem.customerPhone})</p>
                </div>
              </div>
              <button
                onClick={() => setSmsModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">প্রোডাক্ট</label>
                <input
                  type="text"
                  disabled
                  value={smsModalItem.productName}
                  className="w-full px-3 py-1.5 bg-slate-100 rounded border border-slate-200 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">অফার ডিসকাউন্ট</label>
                <select
                  value={smsDiscount}
                  onChange={(e) => {
                    setSmsDiscount(e.target.value);
                    setSmsCustomText(
                      `প্রিয় ${smsModalItem.customerName}, আপনার উইশলিস্টের "${smsModalItem.productName}" পণ্যে আজই পাচ্ছেন ${e.target.value} বিশেষ ছাড়! অর্ডার করতে ভিজিট করুন আমাদের ওয়েবসাইট। হটলাইন: 01982708789`
                    );
                  }}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-700 bg-white focus:outline-none"
                >
                  <option value="5%">৫% বিশেষ ছাড় (5% Discount)</option>
                  <option value="10%">১০% বিশেষ ছাড় (10% Discount)</option>
                  <option value="15%">১৫% বিশেষ ছাড় (15% Discount)</option>
                  <option value="Free Delivery">ফ্রি ডেলিভারি অফার (Free Delivery)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">SMS মেসেজ প্রিভিউ</label>
                <textarea
                  rows={4}
                  value={smsCustomText}
                  onChange={(e) => setSmsCustomText(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded text-slate-700 bg-slate-50 focus:bg-white focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSmsModalItem(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleSendOfferSms}
                className="px-4 py-1.5 bg-[#990000] hover:bg-[#800000] text-white rounded text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>মেসেজ পাঠান</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
