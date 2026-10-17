import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ShoppingBag,
  CircleDollarSign,
  TrendingUp,
  Wallet,
  Package,
  Users,
  Receipt,
  Truck,
  Tag,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Filter
} from 'lucide-react';
import { ProductVisual } from './ProductVisual';
import { AdminSidebar, AdminPageType } from './AdminSidebar';

interface SalesReportPageProps {
  onNavigate: (page: AdminPageType) => void;
  onBackToStore: () => void;
}

export const SalesReportPage: React.FC<SalesReportPageProps> = ({
  onNavigate,
  onBackToStore,
}) => {
  const [dateRange, setDateRange] = useState('Today');
  const [hoveredPoint, setHoveredPoint] = useState<{ hour: string; count: number } | null>(null);

  // Hourly order activity for "Today" chart
  const activityData = [
    { hour: '00:00', orders: 0 },
    { hour: '02:00', orders: 0 },
    { hour: '04:00', orders: 0 },
    { hour: '06:00', orders: 0 },
    { hour: '08:00', orders: 0 },
    { hour: '10:00', orders: 0 },
    { hour: '12:00', orders: 1 }, // the 1 order
    { hour: '14:00', orders: 0 },
    { hour: '16:00', orders: 0 },
    { hour: '18:00', orders: 0 },
    { hour: '20:00', orders: 0 },
    { hour: '22:00', orders: 0 },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] text-slate-800 font-sans">
      {/* 1. Left Unified Sidebar */}
      <AdminSidebar
        activePage="sales_report"
        onNavigate={onNavigate}
        onBackToStore={onBackToStore}
      />

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Filter Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Sales Report
            </h1>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
              Live Data
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Date Range Selector matching Screenshot 2 */}
            <div className="relative">
              <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:border-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent focus:outline-hidden cursor-pointer pr-4 font-semibold text-slate-800"
                >
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="Last 7 Days">Last 7 Days</option>
                  <option value="This Month">This Month</option>
                  <option value="All Time">All Time</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => alert('Exporting Sales Report PDF/Excel...')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Download Report"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full space-y-6">
          {/* 12 Stats Cards Grid (3 Rows of 4 Cards) matching Screenshot 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Total Orders */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Total Orders</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">1</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-75.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 2. Total Sales */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0 font-bold text-lg">
                ৳
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Total Sales</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 730</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-96.1% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 3. Total Revenue */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Total Revenue</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 4. Gross Profit */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Gross Profit</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 5. Avg Order Value */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Avg Order Value</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 730</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-84.3% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 6. Total Items */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Total Items</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">1</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-91.7% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 7. Total Customers */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Total Customers</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">1</h3>
                <div className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold mt-0.5">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>-66.7% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 8. Product Cost */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Product Cost</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 9. Delivery Cost */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Delivery Cost</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 10. Discount Given */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <Tag className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Discount Given</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 11. Fake Orders */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Fake Orders</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>

            {/* 12. Fake Order Amount */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:shadow-xs transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-slate-500 truncate">Fake Order Amount</p>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">৳ 0</h3>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>0.0% vs Yesterday</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visual Cards: Order Activity Chart & Top Selling Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Order Activity Chart matching Screenshot 2 */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col justify-between">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-slate-800">Order activity</h3>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="w-3 h-3" />
                      Activity Overview
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="text-slate-600">
                      TOTAL <strong className="text-slate-900 ml-1">1</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600">
                      AVG <strong className="text-slate-900 ml-1">1</strong>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 flex items-center gap-1">
                      BEST <strong className="text-slate-900 ml-0.5">1</strong>
                      <TrendingUp className="w-3 h-3 text-emerald-500 inline" />
                    </span>
                  </div>
                </div>

                {/* Interactive Chart Canvas */}
                <div className="mt-6 relative h-64 w-full">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-slate-400 select-none pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-right">4</span>
                      <div className="flex-1 border-b border-dashed border-slate-200"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-right">3</span>
                      <div className="flex-1 border-b border-dashed border-slate-200"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-right">2</span>
                      <div className="flex-1 border-b border-dashed border-slate-200"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-right">1</span>
                      <div className="flex-1 border-b border-dashed border-slate-200"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-right">0</span>
                      <div className="flex-1 border-b border-slate-200"></div>
                    </div>
                  </div>

                  {/* SVG Line & Area Curve */}
                  <svg className="absolute inset-0 w-full h-full pl-6 overflow-visible" viewBox="0 0 500 220" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area under curve */}
                    <path
                      d="M 0,220 L 0,220 L 250,165 L 500,220 Z"
                      fill="url(#salesGrad)"
                    />

                    {/* Line curve */}
                    <path
                      d="M 0,220 L 220,220 Q 250,165 260,165 L 280,220 L 500,220"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Peak Point dot */}
                    <circle
                      cx="250"
                      cy="165"
                      r="5"
                      className="fill-blue-600 stroke-white stroke-2 cursor-pointer transition-transform hover:scale-150"
                      onMouseEnter={() => setHoveredPoint({ hour: '12:00 PM', count: 1 })}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  </svg>

                  {/* Tooltip */}
                  {hoveredPoint && (
                    <div
                      className="absolute bg-slate-900 text-white text-[11px] rounded px-2 py-1 shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-8"
                      style={{ left: '50%', top: '70%' }}
                    >
                      {hoveredPoint.hour}: {hoveredPoint.count} order
                    </div>
                  )}
                </div>

                {/* X Axis Time Labels */}
                <div className="flex justify-between text-[11px] text-slate-400 pl-6 pt-2 border-t border-slate-100">
                  <span>00:00</span>
                  <span>04:00</span>
                  <span>08:00</span>
                  <span>12:00</span>
                  <span>16:00</span>
                  <span>20:00</span>
                  <span>23:59</span>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Top Selling Products matching Screenshot 2 */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 mb-3">
                Top Selling Products
              </h3>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 uppercase text-[10px] font-semibold tracking-wider border-b border-slate-100">
                      <th className="pb-2">IMAGE</th>
                      <th className="pb-2">NAME</th>
                      <th className="pb-2 text-center">SOLD</th>
                      <th className="pb-2 text-right">PRICE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-2 w-10">
                        <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                          <ProductVisual visualType="air_earbuds" className="w-full h-full object-cover" />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px]" title="Regrsi RE-NY032 Wireless Neckband Bluetooth Earphone">
                          Regrsi RE-NY032 Wire...
                        </p>
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-slate-700">
                        1
                      </td>
                      <td className="py-3 pl-2 text-right font-bold text-slate-900">
                        ৳ 650
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <button
                  onClick={() => onNavigate('product_report')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  View Full Product Report &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
