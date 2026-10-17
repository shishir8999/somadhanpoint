import React, { useState } from 'react';
import {
  Package,
  CircleDollarSign,
  ShoppingBag,
  AlertTriangle,
  Calendar,
  Sparkles,
  PieChart,
  BarChart3,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface ProductReportPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const ProductReportPage: React.FC<ProductReportPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [selectedDate, setSelectedDate] = useState('Today');
  const [inventoryGrouping, setInventoryGrouping] = useState('By Category');

  // Exact 10 products from Screenshot 4: "New Product Performance"
  const newProducts = [
    {
      id: 'p-1',
      name: "Men's Genuine Leather Half Loafer Shoes",
      price: 1200,
      visualType: 'formal_shoe',
      sold: 68,
      orders: 32,
      fake: 3,
      returned: 0,
    },
    {
      id: 'p-2',
      name: 'Super Water Absorbing Quick Drying Floor Mat',
      price: 500,
      visualType: 'floor_mat',
      sold: 33,
      orders: 18,
      fake: 2,
      returned: 0,
    },
    {
      id: 'p-3',
      name: 'Laxasfit K10 Ultra Smart Watch With Sim Sup...',
      price: 1450,
      visualType: 'smart_watch',
      sold: 52,
      orders: 27,
      fake: 4,
      returned: 0,
    },
    {
      id: 'p-4',
      name: 'Air 31 Wireless Bluetooth Earbuds',
      price: 590,
      visualType: 'air_earbuds',
      sold: 59,
      orders: 27,
      fake: 4,
      returned: 0,
    },
    {
      id: 'p-5',
      name: 'লাক্সারি এরাবিয়ান পারফিউম আতর 10 পিস',
      price: 1100,
      visualType: 'oud_perfume',
      sold: 51,
      orders: 23,
      fake: 3,
      returned: 0,
    },
    {
      id: 'p-6',
      name: 'Portable Retro Camping Lamp',
      price: 1050,
      visualType: 'camping_lamp',
      sold: 25,
      orders: 14,
      fake: 0,
      returned: 0,
    },
    {
      id: 'p-7',
      name: 'Rechargeable USB T-10 Handheld Mini Fan | 3...',
      price: 480,
      visualType: 'mini_fan',
      sold: 70,
      orders: 34,
      fake: 1,
      returned: 0,
    },
    {
      id: 'p-8',
      name: 'Vacuum Flask Stainless Steel (500 ml flask)',
      price: 750,
      visualType: 'smart_cup',
      sold: 44,
      orders: 19,
      fake: 1,
      returned: 0,
    },
    {
      id: 'p-9',
      name: 'Multifunctional 2 In 1 Egg Opener',
      price: 650,
      visualType: 'egg_opener',
      sold: 28,
      orders: 17,
      fake: 1,
      returned: 0,
    },
    {
      id: 'p-10',
      name: 'Led Rechargeable Key Chain Light',
      price: 750,
      visualType: 'keychain_light',
      sold: 32,
      orders: 15,
      fake: 1,
      returned: 0,
    },
  ];

  // Low Stock products from Screenshot 4
  const lowStockProducts = [
    {
      id: 'ls-1',
      name: 'Regrsi RE-NY032 Wireless Neckband Bluetooth Earphone',
      price: 650,
      visualType: 'air_earbuds',
      badge: 'Out of stock',
      badgeClass: 'bg-red-50 text-red-600 border border-red-200 font-bold',
    },
    {
      id: 'ls-2',
      name: 'Super Water Absorbing Quick Drying Floor Mat',
      price: 500,
      visualType: 'floor_mat',
      badge: '5 left',
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200 font-bold',
    },
    {
      id: 'ls-3',
      name: "Men's Genuine Leather Half Loafer Shoes",
      price: 1200,
      visualType: 'formal_shoe',
      badge: '2 variants low',
      badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200 font-bold',
    },
  ];

  // Price range distribution
  const priceRanges = [
    { label: '৳ 990 - ৳ 1,160', amount: '৳ 682,120', percent: '18.4%', color: '#ec4899' },
    { label: '৳ 1,160 - ৳ 1,330', amount: '৳ 596,380', percent: '16.1%', color: '#f59e0b' },
    { label: '৳ 1,330 - ৳ 1,500', amount: '৳ 556,020', percent: '15.0%', color: '#84cc16' },
    { label: '৳ 2,010 - ৳ 2,180', amount: '৳ 507,940', percent: '13.7%', color: '#06b6d4' },
    { label: '৳ 820 - ৳ 990', amount: '৳ 467,360', percent: '12.6%', color: '#3b82f6' },
    { label: '৳ 650 - ৳ 820', amount: '৳ 391,330', percent: '10.6%', color: '#ef4444' },
    { label: '৳ 1,500 - ৳ 1,670', amount: '৳ 209,920', percent: '5.7%', color: '#eab308' },
    { label: '৳ 1,840 - ৳ 2,010', amount: '৳ 148,000', percent: '4.0%', color: '#10b981' },
    { label: '৳ 480 - ৳ 650', amount: '৳ 141,910', percent: '3.8%', color: '#6366f1' },
  ];

  // Inventory category bars
  const inventoryBars = [
    { cat: 'Woman Khimar', height: 95 },
    { cat: 'Electronics', height: 86 },
    { cat: 'Gadget & Acc.', height: 75 },
    { cat: 'Smart Watch', height: 73 },
    { cat: 'Others', height: 60 },
    { cat: 'Wired Headphone', height: 56 },
    { cat: 'Mobile Phone', height: 45 },
    { cat: "Man's Shirt", height: 42 },
    { cat: 'FORMAL SHOE', height: 40 },
    { cat: 'Leather Goods', height: 25 },
    { cat: 'Winter Jacket', height: 16 },
    { cat: 'Woman Borka', height: 12 },
    { cat: "Man's Jubba", height: 8 },
    { cat: 'Kids Khimar', height: 3 },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="product_report"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Product Report
            </h1>
            <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
              Catalog & Sales Insights
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent focus:outline-hidden cursor-pointer pr-2 font-semibold text-slate-800"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="This Month">This Month</option>
                <option value="All Time">All Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* Top 4 Stat Cards matching Screenshot 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Products */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Products</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
              </div>
            </div>

            {/* 2. Total Sales */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 font-bold text-lg">
                ৳
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Total Sales</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 730</h3>
              </div>
            </div>

            {/* 3. Units Sold */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Units Sold</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">1</h3>
              </div>
            </div>

            {/* 4. Low Stocks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500">Low Stocks</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  3
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                </h3>
              </div>
            </div>
          </div>

          {/* Section 1: Inventory Value Bar Chart */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div>
                <p className="text-xs font-semibold text-slate-500">Inventory Value</p>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                  ৳ 1,98,69,824
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={inventoryGrouping}
                  onChange={(e) => setInventoryGrouping(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-3 py-1 text-xs font-medium text-slate-700 shadow-2xs focus:outline-hidden"
                >
                  <option value="By Category">By Category</option>
                  <option value="By Brand">By Brand</option>
                  <option value="By Warehouse">By Warehouse</option>
                </select>
              </div>
            </div>

            {/* Bar Chart Canvas matching Screenshot 4 */}
            <div className="mt-6">
              <div className="relative h-56 flex items-end justify-between gap-2 px-2 pt-6 pb-2 border-b border-slate-200">
                {/* Horizontal scale lines */}
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-300 pointer-events-none">
                  <div className="border-b border-dashed border-slate-100 w-full pt-1">৳ 32L</div>
                  <div className="border-b border-dashed border-slate-100 w-full pt-1">৳ 24L</div>
                  <div className="border-b border-dashed border-slate-100 w-full pt-1">৳ 16L</div>
                  <div className="border-b border-dashed border-slate-100 w-full pt-1">৳ 8L</div>
                  <div className="border-b border-slate-200 w-full pt-1">৳ 0</div>
                </div>

                {/* Bars */}
                {inventoryBars.map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group z-1">
                    <div
                      className="w-full max-w-[32px] bg-emerald-500 hover:bg-emerald-600 rounded-t-sm transition-all duration-300 relative cursor-pointer"
                      style={{ height: `${bar.height}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded shadow pointer-events-none transition-opacity whitespace-nowrap z-10">
                        {bar.cat}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Labels */}
              <div className="flex justify-between gap-1 text-[9px] text-slate-500 font-medium pt-2 overflow-x-auto">
                {inventoryBars.map((bar, idx) => (
                  <span key={idx} className="flex-1 text-center truncate px-0.5" title={bar.cat}>
                    {bar.cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Brand Overview & Category Overview Donut Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Brand Overview */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
                Brand Overview
              </h3>

              <div className="flex items-center justify-center py-10 gap-8">
                {/* Donut representation */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold text-slate-800">0</span>
                    <span className="text-[11px] text-slate-400">৳ 0</span>
                  </div>
                </div>

                <div className="text-slate-400 text-xs italic">
                  No data found
                </div>
              </div>
            </div>

            {/* Category Overview */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100">
                Category Overview
              </h3>

              <div className="flex flex-col sm:flex-row items-center justify-center py-6 gap-8">
                {/* Donut representation with 100% blue arc */}
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-indigo-600"
                      strokeWidth="4.5"
                      strokeDasharray="100, 100"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold text-slate-900">1</span>
                    <span className="text-[11px] font-semibold text-slate-500">৳ 650</span>
                  </div>
                </div>

                {/* Legend matching Screenshot 4 */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    WI
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Wired Headphone</h4>
                    <p className="text-[11px] text-slate-500">1 orders · ৳ 650</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Sales by Price Range & New Product Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sales by Price Range Donut & Legend (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-4">
                Sales by Price Range
              </h3>

              <div className="flex flex-col items-center justify-center">
                {/* Donut Canvas */}
                <div className="relative w-44 h-44 flex items-center justify-center mb-4">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f1f5f9" strokeWidth="6" />
                    {/* Multi-colored segmented donut */}
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#ec4899" strokeWidth="6" strokeDasharray="18.4 81.6" strokeDashoffset="0" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#f59e0b" strokeWidth="6" strokeDasharray="16.1 83.9" strokeDashoffset="-18.4" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#84cc16" strokeWidth="6" strokeDasharray="15.0 85.0" strokeDashoffset="-34.5" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#06b6d4" strokeWidth="6" strokeDasharray="13.7 86.3" strokeDashoffset="-49.5" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#3b82f6" strokeWidth="6" strokeDasharray="12.6 87.4" strokeDashoffset="-63.2" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#ef4444" strokeWidth="6" strokeDasharray="10.6 89.4" strokeDashoffset="-75.8" />
                    <circle cx="21" cy="21" r="15.9155" fill="transparent" stroke="#6366f1" strokeWidth="6" strokeDasharray="9.5 90.5" strokeDashoffset="-86.4" />
                  </svg>
                  <div className="absolute flex flex-col items-center text-center px-4">
                    <span className="text-sm font-black text-slate-900">৳ 3,700,980</span>
                    <span className="text-[10px] text-slate-500 font-medium">Total Sales</span>
                  </div>
                </div>

                {/* Price range breakdown list matching Screenshot 4 */}
                <div className="w-full space-y-1.5 text-xs">
                  {priceRanges.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 border-b border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="text-[11px] font-medium text-slate-700">{item.label}</span>
                        <span className="text-[10px] text-slate-400">({item.amount})</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800">{item.percent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* New Product Performance Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-800">
                    New Product Performance
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  10 latest products · all time
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider border-b border-slate-100">
                      <th className="pb-2 w-10">IMAGE</th>
                      <th className="pb-2">NAME</th>
                      <th className="pb-2 text-center">SOLD</th>
                      <th className="pb-2 text-center">ORDERS</th>
                      <th className="pb-2 text-center">FAKE</th>
                      <th className="pb-2 text-center">RETURNED</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {newProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="w-8 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                            <ProductVisual visualType={p.visualType} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <p className="font-semibold text-slate-800 text-[11px] truncate max-w-[190px]">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-slate-400">৳ {p.price.toLocaleString()} / pc</p>
                        </td>
                        <td className="py-2.5 px-2 text-center font-bold text-slate-700">
                          {p.sold}
                        </td>
                        <td className="py-2.5 px-2 text-center font-medium text-slate-600">
                          {p.orders}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          {p.fake > 0 ? (
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              {p.fake}
                            </span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-2.5 px-2 text-center text-slate-400">
                          {p.returned}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Section 4: Top Selling & Low Stock Products (2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Products */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-3">
                Top Selling Products
              </h3>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                    <th className="pb-2 w-10">IMAGE</th>
                    <th className="pb-2">NAME</th>
                    <th className="pb-2 text-center">SOLD</th>
                    <th className="pb-2 text-right">PRICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-2">
                      <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        <ProductVisual visualType="air_earbuds" className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-slate-800 text-[11px]">
                        Regrsi RE-NY032 Wireless Neckband Bluetooth Earphone
                      </p>
                    </td>
                    <td className="py-3 px-2 text-center font-bold text-slate-800">
                      1
                    </td>
                    <td className="py-3 pl-2 text-right font-bold text-slate-900">
                      ৳ 650
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Low Stock Products matching Screenshot 4 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800">
                  Low Stock Products
                </h3>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-100">
                    <th className="pb-2 w-10">IMAGE</th>
                    <th className="pb-2">NAME</th>
                    <th className="pb-2 text-right">STOCK</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lowStockProducts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-2">
                        <div className="w-9 h-9 rounded bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                          <ProductVisual visualType={item.visualType} className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-slate-800 text-[11px]">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-slate-400">৳ {item.price} / pc</p>
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                          {item.badge}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
